/**
 * AI Stream Integration — WS-Provider (hermes 3002, transportMode='ws-provider')
 *
 * Tests the ws-provider transport mode:
 *
 *   1. atlas sets transportMode='ws-provider' on the connection to hermes.
 *   2. When a stream request arrives, atlas's stream-relay POSTs to hermes's
 *      /ws-provider/stream endpoint and subscribes to the thread channel via WS.
 *   3. Hermes runs the AI loop; when the AI calls a tool, hermes emits
 *      tool-execute-request on agent/chat/threads/{threadId}/messages.
 *   4. atlas's WS subscriber receives the request, executes the tool locally,
 *      and POSTs tool-execute-result back to hermes via /ws/broadcast.
 *   5. hermes resolves the pending promise, AI loop continues, emits stream events.
 *   6. atlas relays all events to the local client via MessageDbWriter.
 *
 * Provider-side storage rule: hermes never persists threads/messages for ws-provider
 * sessions (incognito folder). All persistence lives on atlas (threadMirrorMode='both').
 *
 * Verified behaviors (via describeStreamSuite):
 *   WP1  — basic stream runs to completion; thread is idle; messages in atlas DB
 *   WP2  — AI calls tool-execute-request; atlas executes and sends result; AI continues
 *
 * Standalone suite (WP3/WP4):
 *   WP3  — threadMirrorMode=both → thread + messages exist in atlas DB
 *   WP4  — provider stateless: prod DB has ZERO chatMessages for the thread
 *
 * PREREQUISITES
 * ─────────────
 *   Terminal 1: vibe dev               (atlas, port 3000, dev DB port 5432)
 *   Terminal 2: vibe --hermes dev       (hermes, port 3002, prod DB port 5433)
 */

import "server-only";

// AI SDK v2→v3 compat mode warning - provider works fine, SDK just prefers v3
// eslint-disable-next-line i18next/no-literal-string
globalThis.AI_SDK_LOG_WARNINGS = false;

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { and, eq, sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { chatMessages, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import { db } from "@/app/api/[locale]/system/db";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";

import { setFetchCacheContext } from "../../testing/fetch-cache";
import { runTestStream } from "../../testing/headless-test-runner";
import { resolveDevUser, resolveRemoteUrl } from "../../testing/remote-setup";
import { describeStreamSuite } from "./route-base.test";

const _remoteUrl = await resolveRemoteUrl();

const HERMES_INSTANCE_ID = "hermes";

let _mainProdUserId: string | null = null;

async function setupWsProviderConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const {
    connectToHermes,
    disconnectFromHermes,
    ensureRemoteUserCredits,
    resolveProdAdminToken,
    resolveProdUserId,
    triggerPull,
  } = await import("../../testing/remote-setup");

  // Idempotent: clean up any leftover connection from a previous failed run
  await disconnectFromHermes(testUser.id);

  // E2E: log into remote, register atlas, sync capabilities.
  // connectToHermes sets transportMode='direct-http', loopLocation='server',
  // toolSource='local', threadMirrorMode='both' by default.
  await connectToHermes(testUser, _remoteUrl ?? "http://localhost:3002");

  // Switch to ws-provider transport mode.
  // atlas will POST to hermes's /ws-provider/stream; hermes runs the AI loop
  // and dispatches tool-execute-request back to atlas via WS.
  await db
    .update(remoteConnections)
    .set({ transportMode: "ws-provider", updatedAt: new Date() })
    .where(
      and(
        eq(remoteConnections.userId, testUser.id),
        eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
      ),
    );

  // Ensure capabilities are populated before tests run
  await triggerPull();

  _mainProdUserId = await resolveProdUserId();

  // Top up credits on the remote so the AI loop does not fail mid-stream
  const remoteAdminToken = await resolveProdAdminToken(
    _remoteUrl ?? "http://localhost:3002",
  );
  await ensureRemoteUserCredits(
    _remoteUrl ?? "http://localhost:3002",
    remoteAdminToken,
    _mainProdUserId,
    20000,
  );
}

async function teardownWsProviderConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const { disconnectFromHermes, unregisterDevFromHermes } =
    await import("../../testing/remote-setup");

  const tasks: Promise<void>[] = [disconnectFromHermes(testUser.id)];
  if (_mainProdUserId) {
    tasks.push(unregisterDevFromHermes(_mainProdUserId));
  }
  await Promise.all(tasks);
  _mainProdUserId = null;
}

if (_remoteUrl) {
  // ── Main suite: full stream integration via describeStreamSuite ───────────────
  // Covers WP1 (basic stream) and WP2 (tool dispatch roundtrip) implicitly via
  // the T1 tool-help call in describeStreamSuite.
  describeStreamSuite({
    label: `AI Stream Integration — WS-Provider (${_remoteUrl}, transportMode='ws-provider')`,
    cachePrefix: "ws-provider-",
    // No remoteInstanceId: tools execute on atlas (local) via tool-execute-request
    // roundtrip; the AI calls them via the request name directly (no execute-tool wrapper).
    skipWaitForTaskTest: true,
    // Tool confirmations require local state. The AI runs on hermes remotely.
    skipApprovalTests: true,
    // Attachment metadata is processed on the provider (hermes) side only.
    skipAttachmentTests: true,
    // Credits are deducted on hermes (remote). Not visible in local testUser balance.
    skipTokenMetadataAssertions: true,
    // System prompt is built locally (atlas) and sent in the ws-provider/stream POST.
    assertSystemPromptFromLocal: true,
    setup: setupWsProviderConnection,
    teardown: teardownWsProviderConnection,
  });

  // ── WP3/WP4: Provider stateless — explicit prod DB assertions ─────────────────
  // Separately verify the incognito guarantee: hermes (ws-provider) NEVER persists
  // threads or messages. All persistence is on atlas.

  describe(`WS-Provider — provider stateless, no prod DB writes (${_remoteUrl})`, () => {
    let testUser: JwtPrivatePayloadType;
    let threadId: string;

    beforeAll(async () => {
      const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
      expect(
        resolved,
        `WP3/WP4: admin user ${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`,
      ).toBeTruthy();
      if (!resolved) {
        return;
      }
      testUser = resolved;

      // Connection may already be set up by the main describeStreamSuite;
      // calling again is idempotent (disconnects first, then reconnects).
      await setupWsProviderConnection(testUser);

      // Run a minimal stream to produce a thread we can query about
      setFetchCacheContext("ws-provider-wp3-wp4-");
      const streamResult = await runTestStream({
        prompt:
          "Reply with exactly: WP_STATELESS_CHECK. No tools, no explanation.",
        user: testUser,
      });

      expect(
        streamResult.result.success,
        "WP3/WP4 setup: stream must succeed",
      ).toBe(true);

      if (!streamResult.result.success) {
        return;
      }

      threadId = streamResult.result.data.threadId ?? "";

      expect(
        streamResult.messages.length,
        "WP3/WP4 setup: stream must produce at least one message",
      ).toBeGreaterThan(0);
    }, 120_000);

    afterAll(async () => {
      const { closeProdDb } = await import("../../testing/remote-setup");
      if (testUser) {
        await teardownWsProviderConnection(testUser);
      }
      await closeProdDb();
    });

    it("WP3: threadMirrorMode=both → thread + messages exist in atlas DB", async () => {
      const [thread] = await db
        .select({ id: chatThreads.id })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      expect(
        thread?.id,
        "WP3: thread must exist in atlas DB (threadMirrorMode=both)",
      ).toBe(threadId);

      const msgs = await db
        .select({ id: chatMessages.id })
        .from(chatMessages)
        .where(eq(chatMessages.threadId, threadId));

      expect(
        msgs.length,
        "WP3: messages must exist in atlas DB (threadMirrorMode=both)",
      ).toBeGreaterThan(0);
    }, 30_000);

    it("WP4: provider stateless → prod DB has ZERO chatMessages for the thread", async () => {
      const { getProdDb } = await import("../../testing/remote-setup");
      const pdb = getProdDb();

      const rows = await pdb.execute<{ id: string }>(
        sql`SELECT id FROM chat_messages WHERE thread_id = ${threadId} LIMIT 1`,
      );

      expect(
        rows.rows.length,
        "WP4: hermes (ws-provider) must NOT persist messages in prod DB — " +
          "provider-side incognito mode guarantees zero rows",
      ).toBe(0);
    }, 30_000);
  });
}
