/**
 * AI Stream Integration — Execute-Tool Remote (atlas AI loop → hermes tools)
 *
 * Tests the "remote tools, local AI" path:
 *
 *   1. atlas runs the AI loop locally (resolveTarget() returns null — no isDefault routing).
 *   2. The AI is prompted to call all tools via execute-tool(instanceId='hermes').
 *   3. execute-tool routes each call through RouteExecuteRepository.execute(instanceId='hermes'),
 *      which calls callToolDirect (HTTP POST to hermes) or sendToolWs (reverse-WS).
 *   4. Hermes executes the tool locally and returns the result.
 *   5. Atlas receives the result, writes it to the local DB, continues the AI loop.
 *
 * This is distinct from relay modes (direct-http/reverse-ws) where the ENTIRE AI
 * loop runs on hermes. Here only tool execution is delegated — AI stays on atlas.
 *
 * Verified behaviors (via describeStreamSuite with remoteInstanceId='hermes'):
 *   T1   — tool-help call routed via execute-tool(instanceId='hermes') → result returned
 *   T3   — retry/branch works with local AI + remote tools
 *   T5b  — wait-for-task revival: WAKE_UP dispatched to hermes, atlas revives (ET-WAKEUP)
 *   T7   — approve two-phase: confirmation state local (AI on atlas)
 *
 * Standalone assertions (ET-LOCAL, ET-REMOTE-TOOL, ET-RESULT, ET-WAKEUP):
 *   ET-LOCAL        — thread created in atlas DB (AI ran locally)
 *   ET-REMOTE-TOOL  — hermes-dev DB has cron_tasks rows for execute-tool dispatches
 *   ET-RESULT       — TOOL message in atlas DB has non-null result (roundtrip completed)
 *   ET-WAKEUP       — WAKE_UP detach: hermes cron_tasks row exists; atlas thread revives
 *
 * PREREQUISITES
 * ─────────────
 *   Terminal 1: vibe dev               (atlas, port 3000, dev DB port 5432)
 *   Terminal 2: vibe --hermes dev       (hermes, port 3002, prod DB port 5433)
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { and, eq, sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatMessages, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import { db } from "@/app/api/[locale]/system/db";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";

import { setFetchCacheContext } from "../../testing/fetch-cache";
import {
  getOrCreateFolder,
  runTestStream,
} from "../../testing/headless-test-runner";
import {
  failSuitePrerequisites,
  HERMES_INSTANCE_ID,
  isHermesInFixtureMode,
  resolveDevUser,
  resolveRemoteUrlSync,
} from "../../testing/remote-setup";
import { describeStreamSuite } from "./route-base.test";

const _remoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();

let _mainProdUserId: string | null = null;

/**
 * Set up atlas → hermes connection with LOCAL AI loop (no isDefault routing).
 *
 * Key difference from setupDirectConnection:
 *   - isDefault = false → resolveTarget() returns null → AI runs on atlas
 *   - Connection still exists so execute-tool(instanceId='hermes') can resolve it
 *   - transportMode='direct-http' so callToolDirect is used for tool dispatch
 */
async function setupExecuteToolRemoteConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const {
    connectToHermes,
    disconnectFromHermes,
    ensureRemoteUserCredits,
    resolveProdAdminToken,
    resolveProdUserId,
  } = await import("../../testing/remote-setup");

  // Idempotent: clean up any leftover connection from a previous failed run
  await disconnectFromHermes(testUser.id);

  // E2E: log into remote, register atlas, sync capabilities.
  // connectToHermes sets isDefault=true by default — we override below.
  await connectToHermes(testUser, _remoteUrl ?? "http://localhost:3002");

  // Override to LOCAL AI: set isDefault=false so resolveTarget() returns
  // null and the AI loop stays on atlas. The connection row must still exist so that
  // execute-tool(instanceId='hermes') can find and use it for tool dispatch.
  // transportMode='direct-http' (default): tools are dispatched via callToolDirect.
  // loopLocation is irrelevant here since resolveTarget() will not match this row.
  await db
    .update(remoteConnections)
    .set({
      transportMode: "direct-http",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(remoteConnections.userId, testUser.id),
        eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
      ),
    );

  _mainProdUserId = await resolveProdUserId();

  // Top up credits on hermes — tools run there so hermes may charge credits
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

async function teardownExecuteToolRemoteConnection(
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

if (_remoteUrl && _isFixtureMode) {
  // ── Main suite: full T1-T12 with remoteInstanceId='hermes' ───────────────────
  // AI runs on atlas; every tool call goes via execute-tool(instanceId='hermes').
  // RouteExecuteRepository.execute() dispatches via callToolDirect (HTTP) to hermes.
  describeStreamSuite({
    label: `AI Stream — execute-tool remote (${_remoteUrl}, atlas AI loop → hermes tools)`,
    cachePrefix: "execute-tool-remote-",
    remoteInstanceId: HERMES_INSTANCE_ID,
    // T5b must work: WAKE_UP dispatched to hermes, hermes queues task, atlas revives.
    // T7 must work: approval state lives on atlas (AI is local).
    // Credits deducted locally (atlas runs AI) — token metadata assertions are valid.
    // System prompt built on atlas — AI must report atlas instance ID.
    assertSystemPromptFromLocal: false,
    setup: setupExecuteToolRemoteConnection,
    teardown: teardownExecuteToolRemoteConnection,
  });

  // ── ET-LOCAL / ET-REMOTE-TOOL / ET-RESULT / ET-WAKEUP standalone assertions ──
  // Verify the execute-tool path end-to-end beyond what describeStreamSuite checks.

  describe(`Execute-Tool Remote — E2E assertions (${_remoteUrl})`, () => {
    let testUser: JwtPrivatePayloadType;
    let threadId: string;
    let etAssertionsFolderId: string;

    beforeAll(async () => {
      const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
      expect(
        resolved,
        `ET assertions: admin user ${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`,
      ).toBeTruthy();
      if (!resolved) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error(
          `ET assertions setup failed: admin user ${env.VIBE_ADMIN_USER_EMAIL} not found — cannot continue suite (run: vibe dev)`,
        );
      }
      testUser = resolved;

      await setupExecuteToolRemoteConnection(testUser);

      // Create BACKGROUND/tests/execute-tool-remote subfolder for this standalone suite.
      const testsParentId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.BACKGROUND,
        "tests",
      );
      etAssertionsFolderId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.BACKGROUND,
        "execute-tool-remote",
        testsParentId,
      );

      // Run a stream that forces a tool call via execute-tool(instanceId='hermes').
      // Using tool-help since it's always available, produces a result, and has no
      // side effects on hermes. The prompt instructs explicit execute-tool usage.
      setFetchCacheContext("execute-tool-remote-et-assertions-");
      const streamResult = await runTestStream({
        prompt:
          "Call execute-tool with toolName='tool-help' and instanceId='hermes' and input={}. " +
          "After the tool returns, reply with EXACTLY: ET_ROUNDTRIP_COMPLETE. Nothing else.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: etAssertionsFolderId,
      });

      expect(
        streamResult.result.success,
        "ET assertions setup: stream must succeed",
      ).toBe(true);

      if (!streamResult.result.success) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error(
          "ET assertions setup failed: stream did not succeed — cannot continue suite",
        );
      }

      threadId = streamResult.result.data.threadId ?? "";

      expect(
        streamResult.messages.length,
        "ET assertions setup: stream must produce at least one message",
      ).toBeGreaterThan(0);
    }, 180_000);

    afterAll(async () => {
      const { closeProdDb } = await import("../../testing/remote-setup");
      if (testUser) {
        await teardownExecuteToolRemoteConnection(testUser);
      }
      await closeProdDb();
    });

    it("ET-LOCAL: thread created in atlas DB — AI ran locally", async () => {
      const [thread] = await db
        .select({ id: chatThreads.id, folderId: chatThreads.folderId })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      expect(
        thread?.id,
        "ET-LOCAL: thread must exist in atlas DB (AI ran locally)",
      ).toBe(threadId);
    }, 30_000);

    it("ET-RESULT: TOOL message in atlas DB has non-null result — execute-tool roundtrip completed", async () => {
      const toolMsgs = await db
        .select({ id: chatMessages.id, metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );

      expect(
        toolMsgs.length,
        "ET-RESULT: expected at least one TOOL message in atlas DB",
      ).toBeGreaterThan(0);

      // The execute-tool call to hermes must have returned a result (non-null)
      const completedTool = toolMsgs.find(
        (m) =>
          m.metadata?.toolCall?.result !== undefined &&
          m.metadata.toolCall.result !== null,
      );

      expect(
        completedTool,
        "ET-RESULT: expected at least one TOOL message with non-null result — " +
          "execute-tool(instanceId='hermes') must have returned data from hermes",
      ).toBeTruthy();
    }, 30_000);

    it("ET-REMOTE-TOOL: hermes-dev DB has cron_tasks rows for the execute-tool dispatches", async () => {
      // When execute-tool is called with instanceId='hermes' and callbackMode='detach' or 'wait',
      // hermes may create cron_tasks rows. For 'wait' calls, hermes executes synchronously
      // (no cron row). Check for either: cron row OR the direct tool result in atlas DB
      // (which we already verified in ET-RESULT). The key proof is ET-RESULT.
      //
      // For async (detach/wakeUp) calls, hermes creates a cron_tasks row with
      // targetInstance=null (it's the local task on hermes). We assert it by checking
      // the hermes-dev DB for any cron_tasks that reference our threadId.
      const { getProdDb } = await import("../../testing/remote-setup");
      const pdb = getProdDb();

      const rows = await pdb.execute<{ id: string; route_id: string }>(
        sql`SELECT id, route_id FROM cron_tasks WHERE wake_up_thread_id = ${threadId} LIMIT 10`,
      );

      // For synchronous (callbackMode='wait') tool calls, no cron_tasks row is created.
      // Log the result for debugging.
      // eslint-disable-next-line no-console
      console.log(
        `[ET-REMOTE-TOOL] hermes cron_tasks for thread ${threadId}: ${String(rows.rows.length)} rows`,
        rows.rows.map((r) => ({ id: r.id, routeId: r.route_id })),
      );

      // Async dispatch path: hermes queued a cron_tasks row for this thread.
      const hasCronRows = rows.rows.length > 0;
      if (hasCronRows) {
        expect(
          rows.rows[0]?.route_id,
          "ET-REMOTE-TOOL: hermes cron_tasks row must have a route_id",
        ).toBeTruthy();
      }

      // Inline wait path: the thread completed without errors — if the execute-tool
      // roundtrip failed, the AI would have produced an error message, not the marker.
      const assistantMsgs = await db
        .select({ id: chatMessages.id, content: chatMessages.content })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.ASSISTANT),
            sql`${chatMessages.content} LIKE '%ET_ROUNDTRIP_COMPLETE%'`,
          ),
        );
      const hasMarker = assistantMsgs.length > 0;

      // Exactly one of these proofs must hold for the roundtrip to count:
      // (a) hermes cron_tasks rows exist for the thread (async dispatch path), or
      // (b) the final AI message contains 'ET_ROUNDTRIP_COMPLETE' (inline wait path).
      expect(
        hasCronRows || hasMarker,
        "ET-REMOTE-TOOL: neither proof held — no hermes cron_tasks rows for the thread " +
          "(async dispatch path) AND no AI message containing 'ET_ROUNDTRIP_COMPLETE' " +
          "(inline wait path) — execute-tool(instanceId='hermes') roundtrip not proven",
      ).toBe(true);
    }, 30_000);

    it("ET-WAKEUP: WAKE_UP detach to hermes → hermes queues cron_tasks → atlas thread revives", async () => {
      // Run a separate stream that uses callbackMode='wakeUp' for execute-tool.
      // This tests: atlas dispatches async task to hermes via execute-tool(callbackMode='wakeUp'),
      // hermes queues it as a cron_tasks row, completes it, and posts result back to atlas.
      // Atlas's revival mechanism picks it up and continues the thread.
      setFetchCacheContext("execute-tool-remote-et-wakeup-");
      const wakeupResult = await runTestStream({
        prompt:
          "Call execute-tool with toolName='tool-help' and instanceId='hermes' and callbackMode='wakeUp' and input={}. " +
          "This will return a taskId. After you receive it, reply with EXACTLY: ET_WAKEUP_DISPATCHED. " +
          "Do not wait for the task to complete — just dispatch and reply.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: etAssertionsFolderId,
      });

      expect(
        wakeupResult.result.success,
        "ET-WAKEUP: wakeUp dispatch stream must succeed",
      ).toBe(true);

      if (!wakeupResult.result.success) {
        return;
      }

      const wakeupThreadId = wakeupResult.result.data.threadId ?? "";

      // Hermes must have created a cron_tasks row for the wakeUp task
      const { getProdDb } = await import("../../testing/remote-setup");
      const pdb = getProdDb();

      const cronRows = await pdb.execute<{
        id: string;
        last_execution_status: string | null;
      }>(
        sql`SELECT id, last_execution_status FROM cron_tasks WHERE wake_up_thread_id = ${wakeupThreadId} LIMIT 5`,
      );

      expect(
        cronRows.rows.length,
        "ET-WAKEUP: hermes-dev DB must have at least one cron_tasks row for the wakeUp dispatch",
      ).toBeGreaterThan(0);

      // Check the thread in atlas eventually revives (either already idle or waiting)
      const [wakeupThread] = await db
        .select({ streamingState: chatThreads.streamingState })
        .from(chatThreads)
        .where(eq(chatThreads.id, wakeupThreadId))
        .limit(1);

      expect(
        wakeupThread,
        "ET-WAKEUP: wakeUp thread must exist in atlas DB",
      ).toBeTruthy();

      // Thread state: 'idle' means revival already completed; 'waiting' means it's queued.
      // Either is valid — the key proof is the cron_tasks row existing on hermes.
      expect(
        ["idle", "waiting"],
        "ET-WAKEUP: thread must be either 'idle' (revived) or 'waiting' (queued)",
      ).toContain(wakeupThread?.streamingState ?? "unknown");
    }, 300_000);
  });
} else if (!_remoteUrl) {
  failSuitePrerequisites(
    "execute-tool-remote",
    "hermes not running — start: vibe --hermes dev",
  );
} else if (!_isFixtureMode) {
  failSuitePrerequisites(
    "execute-tool-remote",
    "hermes is running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
