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
import { afterAll, beforeAll, describe, expect, it } from "vitest";

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

      // Let the connect-time full sync settle before the first stream. The
      // pull-on-connect exchange (hundreds of rows both ways) otherwise runs
      // CONCURRENTLY with the first tests, hammering both instances exactly
      // while the first relayed stream's events are in flight — the observed
      // cause of lost message-created events at suite start.
      {
        const { isSyncSlotBusy } =
          await import("@/app/api/[locale]/remote-connection/sync/repository");
        const syncKey = `${testUser.id}:${remoteSetup.HERMES_INSTANCE_ID}`;
        const settleStart = Date.now();
        let sawBusy = false;
        for (;;) {
          const busy = isSyncSlotBusy(syncKey);
          sawBusy = sawBusy || busy;
          if (!busy && (sawBusy || Date.now() - settleStart > 20_000)) {
            break;
          }
          if (Date.now() - settleStart > 120_000) {
            break;
          }
          await new Promise<void>((resolve) => {
            setTimeout(resolve, 500);
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
 * Loop-on-client scenario: the CLOUD (hermes) ORIGINATES a stream in its
 * REMOTE/<clientId>/tests/<case> folder; the CLIENT (this side) executes the
 * loop. Returns everything the caller needs to assert the contract:
 *   • loop location — a new usage deduction lands on the LOCAL ledger
 *   • transport    — attested on both sides (relayTransport / relayArrivedVia)
 *   • folders      — cloud copy in REMOTE/<clientId>/…, client copy in
 *                    BACKGROUND/remote/<cloudId>/…
 */
export async function runLoopOnClientScenario(params: {
  testUser: JwtPrivatePayloadType;
  /** Transport the hermes→client relay leg must use (PATCHed + attested). */
  transport: "direct-http" | "reverse-ws";
  /** Case folder name, e.g. "loop-on-client-direct". */
  caseName: string;
  /** Fixture context for the client-side model call. */
  fetchCacheContext: string;
  prompt: string;
}): Promise<{
  threadId: string;
  prodUserId: string | null;
}> {
  const remoteSetup = await import("../../../testing/remote-setup");
  const { sendTestRequest } =
    await import("next-vibe/tooling/check/testing/testing-suite/send-test-request");
  const { setFetchCacheContext } = await import("../../../testing/fetch-cache");
  const { DefaultFolderId: FolderIds } =
    await import("@/app/api/[locale]/agent/chat/config");

  setFetchCacheContext(params.fetchCacheContext);

  const prodUserId = await remoteSetup.resolveProdUserId();
  expect(
    prodUserId,
    "loop-on-client: hermes prod user must resolve",
  ).toBeTruthy();

  // 1. The hermes→client leg must use the scenario's transport — update the
  //    HERMES-side connection row for this client.
  const connByIdDef = (
    await import("@/app/api/[locale]/remote-connection/[instanceId]/definition")
  ).default;
  const patchResult = await sendTestRequest({
    endpoint: connByIdDef.PATCH,
    data: { transportMode: params.transport },
    urlPathParams: { instanceId: remoteSetup.ATLAS_INSTANCE_ID },
    user: params.testUser,
    instanceId: remoteSetup.HERMES_INSTANCE_ID,
  });
  expect(
    patchResult.success,
    `loop-on-client: hermes-side transport PATCH failed: ${!patchResult.success ? patchResult.message : ""}`,
  ).toBe(true);

  // 2. Originator folder chain on hermes: REMOTE/<clientId>/tests/<case>.
  //    Created directly in the prod DB (deterministic, no extra wire deps).
  const pdb = remoteSetup.getProdDb();
  let parentId: string | null = null;
  for (const name of [
    remoteSetup.ATLAS_INSTANCE_ID,
    "tests",
    params.caseName,
  ]) {
    const found: { rows: Array<{ id: string }> } = await pdb.execute<{
      id: string;
    }>(
      parentId === null
        ? sql`SELECT id FROM chat_folders
              WHERE user_id = ${prodUserId} AND root_folder_id = ${FolderIds.REMOTE}
                AND name = ${name} AND parent_id IS NULL LIMIT 1`
        : sql`SELECT id FROM chat_folders
              WHERE user_id = ${prodUserId} AND root_folder_id = ${FolderIds.REMOTE}
                AND name = ${name} AND parent_id = ${parentId} LIMIT 1`,
    );
    if (found.rows[0]) {
      parentId = found.rows[0].id;
      continue;
    }
    const created: { rows: Array<{ id: string }> } = await pdb.execute<{
      id: string;
    }>(
      sql`INSERT INTO chat_folders (user_id, root_folder_id, name, parent_id)
          VALUES (${prodUserId}, ${FolderIds.REMOTE}, ${name}, ${parentId})
          RETURNING id`,
    );
    parentId = created.rows[0]?.id ?? null;
  }
  expect(
    parentId,
    "loop-on-client: hermes folder chain must exist",
  ).toBeTruthy();

  // 3. Originate the stream ON HERMES (routed execute-tool). Its relay branch
  //    resolves the REMOTE/<clientId> folder → relays the loop to this side.
  const streamDef = (
    await import("@/app/api/[locale]/agent/ai-stream/stream/definition")
  ).default;
  // Resolve the chat model from the SKILL VARIANT (options on the ai-stream,
  // like every client does) — tests never hard-code model names.
  const { resolveSkillVariant } =
    await import("@/app/api/[locale]/agent/skills/resolver");
  const { getBestChatModel } =
    await import("@/app/api/[locale]/agent/ai-stream/models");
  const { getInstanceAvailability } =
    await import("@/app/api/[locale]/agent/env-availability");
  const skillId = "quality-tester__budget";
  const variant = await resolveSkillVariant(skillId, null);
  const resolvedModel = variant?.modelSelection
    ? getBestChatModel(
        variant.modelSelection,
        params.testUser,
        await getInstanceAvailability(),
      )?.id
    : undefined;
  expect(
    resolvedModel,
    "loop-on-client: skill variant must resolve a chat model",
  ).toBeTruthy();
  const { ChatMessageRole } =
    await import("@/app/api/[locale]/agent/chat/enum");
  const { DEFAULT_TTS_VOICE_ID } =
    await import("@/app/api/[locale]/agent/text-to-speech/constants");
  const threadId = crypto.randomUUID();
  const streamResult = await sendTestRequest({
    endpoint: streamDef.POST,
    data: {
      operation: "send" as const,
      rootFolderId: FolderIds.REMOTE,
      subFolderId: parentId,
      threadId,
      userMessageId: crypto.randomUUID(),
      parentMessageId: null,
      leafMessageId: null,
      content: params.prompt,
      role: ChatMessageRole.USER,
      model: resolvedModel!,
      skill: skillId,
      favoriteConfig: null,
      toolConfirmations: null,
      messageHistory: [],
      attachments: [],
      resumeToken: null,
      voiceMode: { enabled: false, voice: DEFAULT_TTS_VOICE_ID },
      audioInput: { file: null },
      timezone: "UTC",
      imageSize: undefined,
      imageQuality: undefined,
      musicDuration: undefined,
      executionContext: { mode: "local" as const },
    },
    user: params.testUser,
    instanceId: remoteSetup.HERMES_INSTANCE_ID,
  });
  expect(
    streamResult.success,
    `loop-on-client: hermes-originated stream failed: ${!streamResult.success ? streamResult.message : ""}`,
  ).toBe(true);

  return { threadId, prodUserId };
}

/**
 * Register the loop-on-client suite: the CLOUD originates, the CLIENT runs the
 * loop. Asserts the full contract Max specified: loop location (local ledger),
 * ATTESTED transport on both sides, and thread placement on both sides
 * (cloud: REMOTE/<clientId>/…, client: BACKGROUND/remote/<cloudId>/…).
 */
export function describeLoopOnClientSuite(params: {
  label: string;
  transport: "direct-http" | "reverse-ws";
  caseName: string;
  fetchCacheContext: string;
  hooks: RemoteSuiteHooks;
}): void {
  const expectFn = expect;

  describe(params.label, () => {
    let testUser: JwtPrivatePayloadType;
    let threadId = "";
    let prodUserId: string | null = null;
    let localLedgerMarker: string | null = null;

    beforeAll(async () => {
      const remoteSetup = await import("../../../testing/remote-setup");
      const { env } = await import("@/config/env");
      const resolved = await remoteSetup.resolveDevUser(
        env.VIBE_ADMIN_USER_EMAIL,
      );
      expectFn(resolved, "admin user not found — run: vibe dev").toBeTruthy();
      if (!resolved) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error("loop-on-client setup failed: admin user not found");
      }
      testUser = resolved;

      await params.hooks.setup(testUser);

      const { readLocalDeductionMarker } = await import("./balance");
      localLedgerMarker = await readLocalDeductionMarker(testUser.id);

      const scenario = await runLoopOnClientScenario({
        testUser,
        transport: params.transport,
        caseName: params.caseName,
        fetchCacheContext: params.fetchCacheContext,
        prompt: "Reply with EXACTLY: LOC_OK. Nothing else.",
      });
      threadId = scenario.threadId;
      prodUserId = scenario.prodUserId;
    }, 600_000);

    afterAll(async () => {
      const { closeProdDb } = await import("../../../testing/remote-setup");
      if (testUser) {
        await params.hooks.teardown(testUser);
      }
      await closeProdDb();
    });

    it("LOC-1: loop ran on the CLIENT — local ledger has a new usage deduction", async () => {
      const { waitForLocalDeductionAfter } = await import("./balance");
      const deductions = await waitForLocalDeductionAfter(
        testUser.id,
        localLedgerMarker,
      );
      expectFn(
        deductions.length,
        `LOC-1: no new usage deduction on the client after marker ${String(localLedgerMarker)} — the loop did not run here`,
      ).toBeGreaterThan(0);
    }, 90_000);

    it(`LOC-2: dispatch transport ATTESTED = ${params.transport}`, async () => {
      // The DISPATCHING side (hermes, the originator) attests the leg on its
      // connection row toward the client — stamped by the transport primitive
      // that actually carried the relay, never by configuration.
      const remoteSetup = await import("../../../testing/remote-setup");
      const pdb = remoteSetup.getProdDb();
      const row: {
        rows: Array<{ transport: string | null; at: string | null }>;
      } = await pdb.execute<{ transport: string | null; at: string | null }>(
        sql`SELECT last_transport_used AS transport, last_transport_used_at::text AS at
            FROM remote_connections
            WHERE instance_id = ${remoteSetup.ATLAS_INSTANCE_ID}
            ORDER BY last_transport_used_at DESC NULLS LAST LIMIT 1`,
      );
      expectFn(
        row.rows[0]?.transport,
        `LOC-2: hermes must have ACTUALLY dispatched over '${params.transport}' — attested '${String(row.rows[0]?.transport)}'`,
      ).toBe(params.transport);
    }, 60_000);

    it(`LOC-3: cloud thread is in REMOTE/atlas/tests/${params.caseName}`, async () => {
      const remoteSetup = await import("../../../testing/remote-setup");
      const { DefaultFolderId: FolderIds } =
        await import("@/app/api/[locale]/agent/chat/config");
      await assertHermesFolderChainHasThread({
        prodUserId,
        rootFolderId: FolderIds.REMOTE,
        folderChain: [remoteSetup.ATLAS_INSTANCE_ID, "tests", params.caseName],
        threadId,
        minMessages: 2,
      });
    }, 60_000);

    it(`LOC-4: client thread is in BACKGROUND/remote/hermes/tests/${params.caseName}`, async () => {
      const remoteSetup = await import("../../../testing/remote-setup");
      const { db: localDb } = await import("next-vibe/database");
      const { DefaultFolderId: FolderIds } =
        await import("@/app/api/[locale]/agent/chat/config");
      // Walk the local folder chain name-by-name from the BACKGROUND root.
      let parentId: string | null = null;
      const walked: string[] = [];
      for (const name of [
        "remote",
        remoteSetup.HERMES_INSTANCE_ID,
        "tests",
        params.caseName,
      ]) {
        walked.push(name);
        const rows: { rows: Array<{ id: string }> } = await localDb.execute<{
          id: string;
        }>(
          parentId === null
            ? sql`SELECT id FROM chat_folders
                  WHERE root_folder_id = ${FolderIds.BACKGROUND}
                    AND name = ${name} AND parent_id IS NULL LIMIT 1`
            : sql`SELECT id FROM chat_folders
                  WHERE root_folder_id = ${FolderIds.BACKGROUND}
                    AND name = ${name} AND parent_id = ${parentId} LIMIT 1`,
        );
        expectFn(
          rows.rows.length,
          `LOC-4: BACKGROUND/${walked.join("/")} folder must exist on the client`,
        ).toBeGreaterThan(0);
        parentId = rows.rows[0]!.id;
      }
      const threadRows: { rows: Array<{ id: string }> } =
        await localDb.execute<{
          id: string;
        }>(
          sql`SELECT id FROM chat_threads
            WHERE id = ${threadId} AND folder_id = ${parentId} LIMIT 1`,
        );
      expectFn(
        threadRows.rows.length,
        "LOC-4: client thread must sit in the final folder of the chain",
      ).toBeGreaterThan(0);
    }, 60_000);

    it("LOC-5: both sides hold the messages", async () => {
      const remoteSetup = await import("../../../testing/remote-setup");
      await remoteSetup.assertProdDbHasMessages(threadId, 2);
      const { db: localDb } = await import("next-vibe/database");
      const rows: { rows: Array<{ n: string | number }> } =
        await localDb.execute<{ n: string | number }>(
          sql`SELECT COUNT(*) AS n FROM chat_messages WHERE thread_id = ${threadId}`,
        );
      const n = Number(rows.rows[0]?.n ?? 0);
      expectFn(
        n,
        "LOC-5: client must hold the messages",
      ).toBeGreaterThanOrEqual(2);
    }, 60_000);
  });
}
