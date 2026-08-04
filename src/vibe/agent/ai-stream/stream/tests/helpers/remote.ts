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
import type { ResponseType } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { expect } from "vitest";

import {
  type DefaultFolderId,
  rootlessToolExecutionContext,
} from "../../../../../core/execution-context";

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
   * (remote-folder suites route their streams through it).
   */
  createRemoteFolder?: boolean;
  /** Remote credit floor (default 20000). */
  credits?: number;
  /**
   * Connection loopLocation setting: 'caller' = loop-local topology (loop
   * runs here, tools execute remotely). Stamped on the connection at connect;
   * REMOTE/<hermes> threads created afterwards keep loop_instance_id NULL.
   */
  loopLocation?: "target" | "caller";
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
      // Sync scope = EXACTLY what the suite tests. Remote-folder suites mirror a
      // thread + its ancestor folder chain to the peer, so they MUST enable
      // `threads` sync: folder-created / thread-updated are `syncDomain:"threads"`
      // remote events, dropped at the bridge when the connection's syncScope has
      // threads:false (the default). Without it the mirrored thread lands at the
      // REMOTE root with an empty folder chain. Favorites stays on (placement UX).
      // Plain direct/relay suites enable nothing — their threads never mirror.
      const connectOptions = {
        ...(options.loopLocation ? { loopLocation: options.loopLocation } : {}),
        ...(options.createRemoteFolder
          ? { syncScope: { favorites: true, threads: true } }
          : {}),
      };
      if (transport === "direct-http") {
        await remoteSetup.disconnectFromHermes(testUser.id);
        await remoteSetup.connectToHermes(testUser, url, connectOptions);
      } else {
        await remoteSetup.disconnectFromHermesLocalAi(testUser, url);
        await remoteSetup.connectToHermesLocalAi(testUser, url, connectOptions);
      }

      if (options.afterConnect) {
        await options.afterConnect(testUser);
      }

      if (options.createRemoteFolder) {
        const { getOrCreateFolder } =
          await import("../../../testing/headless-test-runner");
        const { DefaultFolderId: FolderIds } =
          await import("../../../../../core/execution-context");
        // Build REMOTE/<instance>/private — the peer's own-thread landing lives
        // under `private` (mirror subtree segment). The base suite then nests
        // tests/<case> below this, so a case thread sits at
        // REMOTE/<instance>/private/tests/<case>. Landing on the peer resolves
        // to its OWN private/tests/<case> (own-thread restore).
        const instanceFolderId = await getOrCreateFolder(
          testUser,
          FolderIds.REMOTE,
          remoteSetup.HERMES_INSTANCE_ID,
          null,
        );
        localFolderId = await getOrCreateFolder(
          testUser,
          FolderIds.REMOTE,
          "private",
          instanceFolderId,
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

      // Let the connect-time full sync settle before the first stream. The
      // pull-on-connect exchange (hundreds of rows both ways) otherwise runs
      // CONCURRENTLY with the first tests, hammering both instances exactly
      // while the first relayed stream's events are in flight — the observed
      // cause of lost message-created events at suite start.
      {
        const { isSyncSlotBusy } =
          await import("next-vibe/remote-connection/sync/repository");
        const syncKey = `${testUser.id}:${remoteSetup.HERMES_INSTANCE_ID}`;
        const settleStart = Date.now();
        let sawBusy = false;
        // Short grace window to let a sync slot APPEAR (connect kicks the pull
        // asynchronously). If none shows up within the grace, the pull already
        // finished before we started polling — exit immediately instead of
        // burning a fixed 20s. Once we DO see a busy slot, wait for it to clear.
        const GRACE_MS = 1_500;
        for (;;) {
          const busy = isSyncSlotBusy(syncKey);
          sawBusy = sawBusy || busy;
          if (!busy) {
            // Idle now: done if we ever saw it busy (it just cleared) OR the
            // grace window elapsed with no sync ever starting (already settled).
            if (sawBusy || Date.now() - settleStart > GRACE_MS) {
              break;
            }
          }
          if (Date.now() - settleStart > 120_000) {
            break;
          }
          await new Promise<void>((resolve) => {
            setTimeout(resolve, 100);
          });
        }
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

/**
 * Find-or-create a folder NAME chain ON A REMOTE INSTANCE through the REAL
 * folder endpoints (list + create), dispatched over the connection exactly
 * like the product UI does. NO direct DB writes — end to end or nothing.
 * Returns the leaf folder id on the remote.
 */
export async function getOrCreateRemoteFolderChain(params: {
  user: JwtPrivatePayloadType;
  instanceId: string;
  rootFolderId: DefaultFolderId;
  names: readonly string[];
}): Promise<string> {
  const { sendTestRequest } =
    await import("next-vibe/tooling/testing/testing-suite/send-test-request");
  const listDef = (
    await import("../../../../chat/folders/[rootFolderId]/definition")
  ).default;
  const createDef = (
    await import("../../../../chat/folders/[rootFolderId]/create/definition")
  ).default;
  let parentId: string | null = null;
  for (const name of params.names) {
    const listResult = await sendTestRequest({
      toolExecutionContext: rootlessToolExecutionContext(),
      endpoint: listDef.GET,
      urlPathParams: { rootFolderId: params.rootFolderId },
      user: params.user,
      instanceId: params.instanceId,
    });
    const folders =
      listResult.success && Array.isArray(listResult.data?.["folders"])
        ? (listResult.data["folders"] as Array<{
            id: string;
            name: string;
            parentId: string | null;
          }>)
        : [];
    const existing = folders.find(
      (f) => f.name === name && (f.parentId ?? null) === parentId,
    );
    if (existing) {
      parentId = existing.id;
      continue;
    }
    const createResult: ResponseType<Record<string, WidgetData>> =
      await sendTestRequest({
        toolExecutionContext: rootlessToolExecutionContext(),
        endpoint: createDef.POST,
        data: { name, parentId: parentId ?? undefined },
        urlPathParams: { rootFolderId: params.rootFolderId },
        user: params.user,
        instanceId: params.instanceId,
      });
    expect(
      createResult.success,
      `remote folder create failed for "${name}": ${!createResult.success ? createResult.message : ""}`,
    ).toBe(true);
    const folderId: WidgetData = createResult.success
      ? createResult.data?.["folderId"]
      : undefined;
    expect(
      typeof folderId === "string" && folderId.length > 0,
      `remote folder create returned no folderId for "${name}"`,
    ).toBe(true);
    parentId = String(folderId);
  }
  expect(parentId, "remote folder chain must resolve").toBeTruthy();
  return parentId ?? "";
}
