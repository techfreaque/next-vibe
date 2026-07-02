/**
 * Shared remote-connection setup/teardown factories for the AI-stream and
 * execute-tool suites.
 *
 * Every remote suite repeated the same block: (idempotent disconnect →)
 * connect to hermes → resolveProdUserId → resolveProdAdminToken →
 * ensureRemoteUserCredits(20000) → mirrored teardown (disconnect +
 * unregisterDevFromHermes). The factories below own that block once,
 * parameterized by the transport (direct-http vs reverse-ws) and the few
 * real per-suite variations (REMOTE/<instance> folder creation, extra
 * credit targets, a post-connect hook, prod-db credit path).
 */

import "server-only";

import { sql } from "drizzle-orm";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { expect } from "vitest";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";

/** Setup/teardown pair produced by the factories, plus getters for state resolved during setup. */
export interface RemoteSuiteHooks {
  /** Pass as (or call from) cfg.setup / the suite's beforeAll. */
  setup: (testUser: JwtPrivatePayloadType) => Promise<void>;
  /** Pass as (or call from) cfg.teardown / the suite's afterAll. */
  teardown: (testUser: JwtPrivatePayloadType) => Promise<void>;
  /**
   * REMOTE/<instance> subfolder UUID on the local instance — resolved during
   * setup when options.createRemoteFolder is set, null otherwise.
   */
  getLocalFolderId: () => string | null;
  /** Remote (hermes) admin user id resolved during setup, null before/after. */
  getProdUserId: () => string | null;
}

export interface RemoteSetupOptions {
  /**
   * Create the REMOTE/<hermes> subfolder on the local instance during setup
   * (remote-chat-root suites route their streams through it).
   */
  createRemoteFolder?: boolean;
  /** Remote credit floor (default 20000). */
  credits?: number;
  /**
   * How to top up remote credits: "remote-endpoint" (default) goes through the
   * remote admin-add endpoint with a real admin token; "prod-db" writes packs
   * directly via ensureProdUserCredits (used by execute-tool suites that don't
   * want endpoint routing in setup).
   */
  creditVia?: "remote-endpoint" | "prod-db";
  /**
   * Extra step right after the connection is established and before credits —
   * e.g. PATCH transportMode / isInferenceProvider flags on the connection row.
   */
  afterConnect?: (testUser: JwtPrivatePayloadType) => Promise<void>;
}

function makeRemoteSetup(
  transport: "direct-http" | "reverse-ws",
  remoteUrl: string | null,
  options: RemoteSetupOptions = {},
): RemoteSuiteHooks {
  const url = remoteUrl ?? "http://localhost:3002";
  const credits = options.credits ?? 20_000;
  let prodUserId: string | null = null;
  let localFolderId: string | null = null;

  return {
    async setup(testUser: JwtPrivatePayloadType): Promise<void> {
      const remoteSetup = await import("../../../testing/remote-setup");

      // Idempotent: clean up any leftover connection from a previous failed
      // run, then establish the transport-appropriate connection E2E (login
      // on the remote, register this instance, sync capabilities).
      if (transport === "direct-http") {
        await remoteSetup.disconnectFromHermes(testUser.id);
        await remoteSetup.connectToHermes(testUser, url);
      } else {
        await remoteSetup.disconnectFromHermesLocalAi(testUser, url);
        await remoteSetup.connectToHermesLocalAi(testUser, url);
      }

      if (options.afterConnect) {
        await options.afterConnect(testUser);
      }

      if (options.createRemoteFolder) {
        const { getOrCreateFolder } =
          await import("../../../testing/headless-test-runner");
        const { DefaultFolderId: FolderIds } =
          await import("@/app/api/[locale]/agent/chat/config");
        localFolderId = await getOrCreateFolder(
          testUser,
          FolderIds.REMOTE,
          remoteSetup.HERMES_INSTANCE_ID,
          null,
        );
      }

      prodUserId = await remoteSetup.resolveProdUserId();

      // Top up credits on the remote — the relayed loop checks credits in the
      // remote DB, so the local wallet alone is never enough.
      if (options.creditVia === "prod-db") {
        await remoteSetup.ensureProdUserCredits(prodUserId, credits);
      } else {
        const remoteAdminToken = await remoteSetup.resolveProdAdminToken(url);
        await remoteSetup.ensureRemoteUserCredits(
          url,
          remoteAdminToken,
          prodUserId,
          credits,
        );
        // NOTE: never credit testUser.id on the REMOTE — that id exists only
        // in the local DB (admin-add correctly 404s). The remote loop bills
        // the hermes-side mapped user (prodUserId), credited above.
      }
    },

    async teardown(testUser: JwtPrivatePayloadType): Promise<void> {
      const remoteSetup = await import("../../../testing/remote-setup");
      if (transport === "direct-http") {
        const tasks: Promise<void>[] = [
          remoteSetup.disconnectFromHermes(testUser.id),
        ];
        if (prodUserId) {
          tasks.push(remoteSetup.unregisterDevFromHermes(prodUserId));
        }
        await Promise.all(tasks);
      } else {
        await remoteSetup.disconnectFromHermesLocalAi(testUser, url);
        if (prodUserId) {
          await remoteSetup.unregisterDevFromHermes(prodUserId);
        }
      }
      prodUserId = null;
      localFolderId = null;
    },

    getLocalFolderId: (): string | null => localFolderId,
    getProdUserId: (): string | null => prodUserId,
  };
}

/**
 * Direct-http remote suite hooks: connectToHermes/disconnectFromHermes.
 * transportMode='direct-http' is the default after connectToHermes (same machine).
 */
export function makeDirectSetup(
  remoteUrl: string | null,
  options: RemoteSetupOptions = {},
): RemoteSuiteHooks {
  return makeRemoteSetup("direct-http", remoteUrl, options);
}

/**
 * Reverse-WS remote suite hooks: connectToHermesLocalAi sets the local send
 * leg to reverse-ws and opens hermes's connector (always-connected peer).
 */
export function makeReverseWsSetup(
  remoteUrl: string | null,
  options: RemoteSetupOptions = {},
): RemoteSuiteHooks {
  return makeRemoteSetup("reverse-ws", remoteUrl, options);
}

/**
 * Assert a relayed thread landed in the expected folder chain on the hermes
 * prod DB, walking chat_folders name-by-name from the root.
 *
 * Replaces the per-suite copy of the RCR-3 / RCR-D3 SQL walk: resolve
 * <rootFolderId>/<chain[0]>/<chain[1]>/… for `prodUserId`, assert every link
 * exists, then assert the thread sits in the final folder (and optionally has
 * at least `minMessages` messages there — the "AI loop ran there" marker).
 */
export async function assertHermesFolderChainHasThread(params: {
  /** Remote admin user id owning the folder chain (from getProdUserId()). */
  prodUserId: string | null;
  /** Root folder on the remote, e.g. DefaultFolderId.BACKGROUND. */
  rootFolderId: DefaultFolderId;
  /** Folder names from the root down, e.g. ["atlas", "tests", "unbottled-relay"]. */
  folderChain: string[];
  /** Thread that must sit in the final folder of the chain. */
  threadId: string;
  /** When set, also assert the thread has at least this many messages on the remote. */
  minMessages?: number;
}): Promise<void> {
  const { getProdDb, assertProdDbHasThread, assertProdDbHasMessages } =
    await import("../../../testing/remote-setup");
  const pdb = getProdDb();

  let parentId: string | null = null;
  const walked: string[] = [];
  for (const name of params.folderChain) {
    walked.push(name);
    const rows: { rows: Array<{ id: string }> } = await pdb.execute<{
      id: string;
    }>(
      parentId === null
        ? sql`SELECT id FROM chat_folders
              WHERE user_id = ${params.prodUserId}
                AND root_folder_id = ${params.rootFolderId}
                AND name = ${name}
                AND parent_id IS NULL
              LIMIT 1`
        : sql`SELECT id FROM chat_folders
              WHERE user_id = ${params.prodUserId}
                AND root_folder_id = ${params.rootFolderId}
                AND name = ${name}
                AND parent_id = ${parentId}
              LIMIT 1`,
    );
    expect(
      rows.rows.length,
      `${params.rootFolderId}/${walked.join("/")} folder must exist on hermes`,
    ).toBeGreaterThan(0);
    parentId = rows.rows[0]!.id;
  }

  expect(
    parentId,
    `folder chain ${params.rootFolderId}/${params.folderChain.join("/")} resolved to no folder`,
  ).toBeTruthy();
  await assertProdDbHasThread(params.threadId, parentId!);
  if (params.minMessages !== undefined) {
    await assertProdDbHasMessages(params.threadId, params.minMessages);
  }
}
