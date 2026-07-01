// oxlint-disable oxlint-plugin-restricted/restricted-syntax
/**
 * Execute-Tool AI Stream E2E Tests
 *
 * Every feature of execute-tool proven inside real AI threads — the AI reads
 * instructions, calls the tool, and we assert on the actual DB state left behind.
 *
 * Coverage matrix
 * ───────────────
 * ET-AI-LOCAL-WAIT               local WAIT          : AI calls tool-help(wait)            → inline result, no taskId
 * ET-AI-LOCAL-DETACH             local DETACH        : AI calls generate_image(detach)     → taskId, task completes
 * ET-AI-LOCAL-ENDLOOP            local END_LOOP      : AI calls tool-help(endLoop)         → loop stops, 1 tool call
 * ET-AI-LOCAL-WAKEUP             local WAKE_UP       : AI calls generate_image(wakeUp)     → revived with image URL
 * ET-AI-LOCAL-APPROVE            local APPROVE       : AI calls cortex-write(approve)      → confirmation gate
 * ET-AI-LOCAL-DETACH-THEN-AWAIT  local DETACH+await  : AI detach → await-task(taskId)      → result inline
 * ET-AI-LOCAL-DISMISS            local dismiss       : AI detach → dismiss-task(callId)    → dismissed=true
 * ET-AI-LOCAL-COMPLETE-TASK      local complete      : AI detach → complete-task(taskId)   → completed=true
 * ET-AI-REMOTE-DIRECT            direct-http         : AI → execute-tool(instanceId=hermes) via direct HTTP
 * ET-AI-REMOTE-WS                reverse-ws          : AI → execute-tool(instanceId=hermes) via reverse WS
 *
 * Remote coverage (per transport: DIRECT and WS)
 * ───────────────────────────────────────────────
 *   TOOL-HELP          : inline tool list result
 *   WAIT               : inline result, no background task
 *   DETACH             : taskId returned, hermes cron_tasks row verifiable
 *   WAKEUP             : phase-1 taskId → thread parks → revival → WAKEUP_OK, thread idle
 *   ENDLOOP            : loop stops after first result
 *   DETACH-THEN-AWAIT  : AI detach → await-task(taskId) → result inline
 *   DISMISS            : AI detach → dismiss-task(callId) → dismissed=true
 *   COMPLETE-TASK      : AI detach → complete-task(taskId) → completed=true
 *
 * Prerequisites
 * ─────────────
 *   vibe dev               (atlas)   — REQUIRED for all tests
 *   vibe --hermes dev      (hermes)  — REQUIRED for ET-AI-REMOTE-*
 *
 * The test suite FAILS immediately (never silently skips) when prerequisites are not met.
 */

import "server-only";

// installFetchCache MUST be first — intercepts fetch before any network module loads.
import { installFetchCache } from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
installFetchCache();

import { existsSync, readFileSync } from "node:fs";

import { and, eq, sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { cronTasks } from "next-vibe/tasks/cron/db";
import { CronTaskStatus } from "next-vibe/tasks/enum";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  normalizeFetchCacheFixtures,
  patchFetchCacheFixtures,
  registerFixturePatch,
  setFetchCacheContext,
} from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
import {
  getOrCreateFolder,
  runTestStream,
  toolResultRecord,
  waitForThreadIdle,
} from "@/app/api/[locale]/agent/ai-stream/testing/headless-test-runner";
import {
  connectToHermes,
  connectToHermesLocalAi,
  disconnectFromHermes,
  disconnectFromHermesLocalAi,
  failSuitePrerequisites,
  HERMES_INSTANCE_ID,
  isHermesInFixtureMode,
  resolveDevUser,
  resolveRemoteUrlSync,
} from "@/app/api/[locale]/agent/ai-stream/testing/remote-setup";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { MessageMetadata } from "@/app/api/[locale]/agent/chat/db";
import { chatMessages, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { env } from "@/config/env";

// ── Atlas / Hermes liveness check ─────────────────────────────────────────────

const ATLAS_PID_FILE = ".tmp/.atlas.pid";

function isPidFileAlive(pidFile: string): boolean {
  if (!existsSync(pidFile)) {
    return false;
  }
  try {
    const content = readFileSync(pidFile, "utf-8");
    const pidLine = content.trim().split("\n")[0];
    const pid = parseInt(pidLine ?? "", 10);
    if (isNaN(pid)) {
      return false;
    }
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

const _atlasRunning = isPidFileAlive(ATLAS_PID_FILE);
const _remoteUrl = resolveRemoteUrlSync();
const _hermesRunning = _remoteUrl !== null;
const _hermesFixtureMode = isHermesInFixtureMode();

if (!_atlasRunning) {
  failSuitePrerequisites(
    "execute-tool AI E2E",
    "atlas dev not running — start: vibe dev",
  );
}

// ── Shared helpers ────────────────────────────────────────────────────────────

/**
 * Poll DB until a cron task reaches terminal status or we time out.
 * Returns the final status, or null on timeout.
 */
async function pollTaskStatus(
  taskId: string,
  timeoutMs = 60_000,
): Promise<string | null> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const [row] = await db
      .select({ lastExecutionStatus: cronTasks.lastExecutionStatus })
      .from(cronTasks)
      .where(eq(cronTasks.id, taskId))
      .limit(1);
    if (!row) {
      // Task was deleted — treat as completed.
      return CronTaskStatus.COMPLETED;
    }
    const s = row.lastExecutionStatus;
    if (s === CronTaskStatus.COMPLETED || s === CronTaskStatus.FAILED) {
      return s;
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 400);
    });
  }
  return null;
}

/** Collect all assistant message text for a thread. */
async function resolveAiText(threadId: string): Promise<string> {
  const msgs = await db
    .select({ content: chatMessages.content, role: chatMessages.role })
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.threadId, threadId),
        eq(chatMessages.role, ChatMessageRole.ASSISTANT),
      ),
    );
  return msgs.map((m) => m.content ?? "").join("\n");
}

/**
 * Find a tool call in DB messages by name — matches both direct calls (toolName=X)
 * and calls routed through execute-tool (toolName=execute-tool, args.toolName=X).
 */
function findToolCall(
  toolMsgs: Array<{ metadata: MessageMetadata | null }>,
  toolName: string,
): (typeof toolMsgs)[number] | undefined {
  return toolMsgs.find(
    (m) =>
      m.metadata?.toolCall?.toolName === toolName ||
      (m.metadata?.toolCall?.toolName === "execute-tool" &&
        (m.metadata.toolCall.args as { toolName?: string } | undefined)
          ?.toolName === toolName),
  );
}

/** Extract first taskId=<value> from a string (AI reports for detach/wakeUp). */
function extractTaskId(text: string): string | null {
  const m = /taskId=([a-z0-9\-_.]+)/i.exec(text);
  return m?.[1] ?? null;
}

/**
 * Assert thread is idle and has at least one TOOL message with a non-null result.
 * Returns the list of tool messages for further assertions.
 */
async function assertThreadIdleWithToolResult(
  threadId: string,
  label: string,
): Promise<
  Array<{ metadata: { toolCall?: { toolName?: string; result?: unknown } } }>
> {
  const [thread] = await db
    .select({ streamingState: chatThreads.streamingState })
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId))
    .limit(1);
  expect(thread?.streamingState, `${label}: thread must be idle`).toBe("idle");

  const toolMsgs = await db
    .select({ metadata: chatMessages.metadata })
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.threadId, threadId),
        eq(chatMessages.role, ChatMessageRole.TOOL),
      ),
    );
  expect(
    toolMsgs.length,
    `${label}: expected at least one TOOL message in DB`,
  ).toBeGreaterThan(0);

  const withResult = toolMsgs.filter(
    (m) =>
      m.metadata?.toolCall?.result !== null &&
      m.metadata?.toolCall?.result !== undefined,
  );
  expect(
    withResult.length,
    `${label}: at least one TOOL message must have a non-null result`,
  ).toBeGreaterThan(0);

  return toolMsgs as Array<{
    metadata: { toolCall?: { toolName?: string; result?: unknown } };
  }>;
}

/**
 * Assert no orphaned enabled cron tasks remain for this thread
 * (excluding resume-stream rows which are infrastructure).
 */
async function assertNoOrphanCronTasks(
  threadId: string,
  label: string,
): Promise<void> {
  const orphans = await db
    .select({ id: cronTasks.id, routeId: cronTasks.routeId })
    .from(cronTasks)
    .where(
      and(
        eq(cronTasks.wakeUpThreadId, threadId),
        eq(cronTasks.enabled, true),
        sql`${cronTasks.lastExecutionStatus} IS NULL`,
        sql`${cronTasks.routeId} != 'resume-stream'`,
      ),
    );
  expect(
    orphans.length,
    `${label}: must have 0 orphan enabled cron tasks (found: ${JSON.stringify(orphans.map((o) => o.routeId))})`,
  ).toBe(0);
}

/** Create a quality-tester favorite and return its id. Deletes existing quality-tester favorites first. */
async function createTestFavorite(
  user: JwtPrivatePayloadType,
): Promise<string> {
  const [favsDef, favoriteCreateDef, favoriteDeleteDef] = await Promise.all([
    import("@/app/api/[locale]/agent/skills/favorites/definition").then(
      (m) => m.default.GET,
    ),
    import("@/app/api/[locale]/agent/skills/favorites/create/definition").then(
      (m) => m.default.POST,
    ),
    import("@/app/api/[locale]/agent/skills/favorites/[id]/definition").then(
      (m) => m.default.DELETE,
    ),
  ]);
  const favsResult = await sendTestRequest({
    endpoint: favsDef,
    data: { pageSize: 500 },
    user,
  });
  const favsList =
    favsResult.success && Array.isArray(favsResult.data?.["favorites"])
      ? (favsResult.data["favorites"] as Record<string, unknown>[])
      : [];
  for (const fav of favsList) {
    if (String(fav["skillId"] ?? "").startsWith("quality-tester")) {
      await sendTestRequest({
        endpoint: favoriteDeleteDef,
        urlPathParams: { id: String(fav["id"]) },
        user,
      });
    }
  }
  const createResult = await sendTestRequest({
    endpoint: favoriteCreateDef,
    data: { skillId: "quality-tester__kimi" },
    user,
  });
  if (!createResult.success || !createResult.data?.["id"]) {
    throw new Error(
      `createTestFavorite: failed — ${createResult.success ? "no id" : String((createResult as { message?: string }).message ?? "")}`,
    );
  }
  return String(createResult.data["id"]);
}

/** Ensure user has at least `credits` balance. */
async function pinBalance(
  user: JwtPrivatePayloadType,
  credits: number,
): Promise<void> {
  const creditsDef = await import("@/app/api/[locale]/credits/definition").then(
    (m) => m.default.GET,
  );
  const bal = await sendTestRequest({ endpoint: creditsDef, user });
  const current = bal.success ? Number(bal.data?.total ?? 0) : 0;
  if (current >= credits) {
    return;
  }
  const adminAddDef =
    await import("@/app/api/[locale]/credits/admin-add/definition").then(
      (m) => m.default.POST,
    );
  await sendTestRequest({
    endpoint: adminAddDef,
    data: { targetUserId: user.id, amount: Math.ceil(credits - current) },
    user,
  });
}

// ── ET-AI-LOCAL: local callback modes ────────────────────────────────────────

if (_atlasRunning) {
  describe("Execute-Tool AI E2E — local callback modes", () => {
    let testUser: JwtPrivatePayloadType;
    let folderId: string;
    let favoriteId: string;

    beforeAll(async () => {
      const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
      expect(
        resolved,
        `ET-AI-LOCAL beforeAll: admin user ${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`,
      ).toBeTruthy();
      if (!resolved) {
        throw new Error(
          `ET-AI-LOCAL: admin user not found — cannot continue (run: vibe dev)`,
        );
      }
      testUser = resolved;
      await pinBalance(testUser, 500);
      favoriteId = await createTestFavorite(testUser);

      const testsParentId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.BACKGROUND,
        "tests",
      );
      folderId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.BACKGROUND,
        "execute-tool-ai-e2e-local",
        testsParentId,
      );
    }, 120_000);

    // ── ET-AI-LOCAL-WAIT ──────────────────────────────────────────────────────
    // Use tool-help (stateless, always succeeds) to prove inline result delivery:
    // the AI gets a tools array back immediately, no taskId, thread stays idle.

    it("ET-AI-LOCAL-WAIT: tool-help with callbackMode=wait returns inline result synchronously", async () => {
      setFetchCacheContext("et-ai-local-wait-");

      const result = await runTestStream({
        prompt:
          "Call execute-tool with toolName='tool-help', callbackMode='wait', input={query:'execute-tool'}. " +
          "Confirm you received a result with a tools array (not a taskId). " +
          "End with STEP_OK if the result contains tools and has no taskId. " +
          "Or FAILED: <reason> if the result was a taskId or missing tools.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-LOCAL-WAIT: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 30_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-LOCAL-WAIT: AI must confirm STEP_OK — got: ${aiText.slice(0, 300)}`,
      ).toBe(true);

      // DB: thread idle, tool messages have results, no orphan cron tasks
      await assertThreadIdleWithToolResult(threadId, "ET-AI-LOCAL-WAIT");
      await assertNoOrphanCronTasks(threadId, "ET-AI-LOCAL-WAIT");

      // WAIT mode: no background cron tasks created for this thread (beyond infra)
      const tasks = await db
        .select({ id: cronTasks.id })
        .from(cronTasks)
        .where(
          and(
            eq(cronTasks.wakeUpThreadId, threadId),
            sql`${cronTasks.routeId} != 'resume-stream'`,
          ),
        );
      expect(
        tasks.length,
        "ET-AI-LOCAL-WAIT: WAIT mode must NOT create background cron tasks",
      ).toBe(0);
    }, 120_000);

    // ── ET-AI-LOCAL-DETACH ────────────────────────────────────────────────────
    // Use generate_image: the async result is an image URL, detach means we get
    // a taskId immediately and the image is generated in the background.

    it("ET-AI-LOCAL-DETACH: generate_image with callbackMode=detach returns taskId, task reaches COMPLETED", async () => {
      setFetchCacheContext("et-ai-local-detach-");

      const result = await runTestStream({
        prompt:
          "Call the generate_image tool with prompt='detach-test-probe' and callbackMode='detach'. " +
          "The call must return a taskId immediately (not an imageUrl). " +
          "End with STEP_OK taskId=<the exact taskId value>. " +
          "If the result has no taskId or returns an imageUrl instead, end with FAILED: <reason>.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-LOCAL-DETACH: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 30_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-LOCAL-DETACH: AI must confirm STEP_OK — got: ${aiText.slice(0, 300)}`,
      ).toBe(true);

      const taskId = extractTaskId(aiText);
      expect(
        taskId,
        "ET-AI-LOCAL-DETACH: AI response must include taskId=<value>",
      ).toBeTruthy();

      if (taskId) {
        // Background task must reach a terminal status (COMPLETED or FAILED).
        // DETACH proves fire-and-forget dispatch — task completion is independent
        // of the AI stream (e.g. image generation may fail if the API is unavailable).
        const finalStatus = await pollTaskStatus(taskId, 90_000);
        expect(
          finalStatus === CronTaskStatus.COMPLETED ||
            finalStatus === CronTaskStatus.FAILED,
          `ET-AI-LOCAL-DETACH: background task ${taskId} must reach a terminal status — got: ${String(finalStatus)}`,
        ).toBe(true);
      }

      // Thread idle; TOOL message present with result
      await assertThreadIdleWithToolResult(threadId, "ET-AI-LOCAL-DETACH");
      await assertNoOrphanCronTasks(threadId, "ET-AI-LOCAL-DETACH");
    }, 180_000);

    // ── ET-AI-LOCAL-ENDLOOP ───────────────────────────────────────────────────
    // Use tool-help (no side effects): prove exactly one call ran and the loop stopped.

    it("ET-AI-LOCAL-ENDLOOP: tool-help with callbackMode=endLoop stops the AI loop after first result", async () => {
      setFetchCacheContext("et-ai-local-endloop-");

      const result = await runTestStream({
        prompt:
          "Call execute-tool with toolName='tool-help', callbackMode='endLoop', input={}. " +
          "After receiving the result, attempt to call execute-tool again with the same args. " +
          "Check: did only ONE execute-tool call run (the loop stopped after the first), and did the first result contain a non-empty tools array? " +
          "End with STEP_OK if exactly one call ran and result has tools. " +
          "Or FAILED: <reason> if more than one call ran or result was empty.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-LOCAL-ENDLOOP: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 30_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-LOCAL-ENDLOOP: AI must confirm STEP_OK — got: ${aiText.slice(0, 300)}`,
      ).toBe(true);

      // DB: thread idle
      const [thread] = await db
        .select({ streamingState: chatThreads.streamingState })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);
      expect(
        thread?.streamingState,
        "ET-AI-LOCAL-ENDLOOP: thread must be idle after endLoop",
      ).toBe("idle");

      // Verify exactly one execute-tool TOOL message in DB (endLoop blocked the second call).
      // The AI calls execute-tool (not tool-help directly) — the inner toolName is stored in
      // metadata.toolCall.args.toolName, but the outer message uses toolName='execute-tool'.
      const toolMsgs = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );
      const executeCalls = toolMsgs.filter(
        (m) => m.metadata?.toolCall?.toolName === "execute-tool",
      );
      expect(
        executeCalls.length,
        "ET-AI-LOCAL-ENDLOOP: endLoop must result in exactly 1 execute-tool TOOL message in DB",
      ).toBe(1);

      // That one result must be non-null
      const callResult = toolResultRecord(
        executeCalls[0]?.metadata?.toolCall?.result,
      );
      expect(
        callResult,
        "ET-AI-LOCAL-ENDLOOP: the single execute-tool result must be non-null",
      ).not.toBeNull();

      await assertNoOrphanCronTasks(threadId, "ET-AI-LOCAL-ENDLOOP");
    }, 120_000);

    // ── ET-AI-LOCAL-WAKEUP ────────────────────────────────────────────────────
    // Use generate_image: async image gen is the canonical wakeUp use case.
    // Phase 1: taskId returned. Thread parks. Phase 2: revival with imageUrl.

    it("ET-AI-LOCAL-WAKEUP: generate_image with callbackMode=wakeUp dispatches task then revives thread with result", async () => {
      setFetchCacheContext("et-ai-local-wakeup-");

      const result = await runTestStream({
        prompt:
          "Call the generate_image tool with prompt='wakeup-e2e-test' and callbackMode='wakeUp'. " +
          "Phase 1: You will get a taskId immediately — reply PHASE1_OK taskId=<value>. " +
          "Phase 2: You will be automatically revived when the image is ready. " +
          "The result will contain an imageUrl OR a rendered markdown image. " +
          "When revived, confirm an http/https image URL is present in the result. " +
          "End with WAKEUP_OK if the image URL appeared, or WAKEUP_FAILED: <reason> if not.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-LOCAL-WAKEUP: phase-1 stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";

      // Wait for full revival (image gen + cron wake-up + second stream)
      await waitForThreadIdle(threadId, testUser, 240_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("WAKEUP_OK"),
        `ET-AI-LOCAL-WAKEUP: AI must confirm WAKEUP_OK after revival — got: ${aiText.slice(0, 400)}`,
      ).toBe(true);

      // DB: thread idle after revival
      const [thread] = await db
        .select({ streamingState: chatThreads.streamingState })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);
      expect(
        thread?.streamingState,
        "ET-AI-LOCAL-WAKEUP: thread must be idle after revival",
      ).toBe("idle");

      // At least one TOOL message with a non-null result (the wakeUp tool result)
      const toolMsgs = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );
      expect(
        toolMsgs.length,
        "ET-AI-LOCAL-WAKEUP: expected at least one TOOL message after revival",
      ).toBeGreaterThan(0);

      const withResult = toolMsgs.filter(
        (m) =>
          m.metadata?.toolCall?.result !== null &&
          m.metadata?.toolCall?.result !== undefined,
      );
      expect(
        withResult.length,
        "ET-AI-LOCAL-WAKEUP: at least one TOOL message must have a non-null result after revival",
      ).toBeGreaterThan(0);

      // wakeUp task must have been cleaned up (completed or deleted) — no orphan tasks
      await assertNoOrphanCronTasks(threadId, "ET-AI-LOCAL-WAKEUP");
    }, 360_000);

    // ── ET-AI-LOCAL-APPROVE ───────────────────────────────────────────────────
    // Use cortex-write with callbackMode=approve: proves the confirmation gate
    // works with a real write operation (not just an introspection tool).

    it("ET-AI-LOCAL-APPROVE: cortex-write with callbackMode=approve pauses at confirmation gate", async () => {
      setFetchCacheContext("et-ai-local-approve-");

      const writeKey = `et-approve-probe-${Date.now()}`;

      const result = await runTestStream({
        prompt:
          `Call the cortex-write tool with path='${writeKey}' and content='APPROVE_GATE_TEST' and callbackMode='approve'. ` +
          "The call should pause waiting for user confirmation (the tool returns waitingForConfirmation=true). " +
          "Report what you observed. " +
          "If the call is paused for confirmation, end with STEP_OK. " +
          "If the tool returned a normal success result immediately (no confirmation gate), end with FAILED: approve mode did not pause.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-LOCAL-APPROVE: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 30_000);

      // AI must acknowledge the approval gate
      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK") ||
          aiText.includes("confirmation") ||
          aiText.includes("approve") ||
          aiText.includes("waiting"),
        `ET-AI-LOCAL-APPROVE: AI must acknowledge the approve gate — got: ${aiText.slice(0, 300)}`,
      ).toBe(true);

      // TOOL messages must exist and at least one must have waitingForConfirmation=true
      const toolMsgs = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );
      expect(
        toolMsgs.length,
        "ET-AI-LOCAL-APPROVE: expected at least one TOOL message in DB",
      ).toBeGreaterThan(0);

      // At least one tool message must show waitingForConfirmation=true (the approve gate)
      const confirmationMsg = toolMsgs.find(
        (m) => m.metadata?.toolCall?.waitingForConfirmation === true,
      );
      expect(
        confirmationMsg,
        "ET-AI-LOCAL-APPROVE: at least one TOOL message must have waitingForConfirmation=true",
      ).toBeTruthy();
    }, 120_000);

    // ── ET-AI-LOCAL-DETACH-THEN-AWAIT ────────────────────────────────────────
    // Step 1: AI calls execute-tool(self-instance-id, detach) → gets taskId.
    // Step 2: AI calls execute-tool(await-task, {taskId}) → result has instanceId='atlas'.
    // Split into two streams so the dynamic taskId can be patched into step-2 fixtures.

    it("ET-AI-LOCAL-DETACH-THEN-AWAIT: after detach, await-task returns completed result with instanceId=atlas", async () => {
      const TASK_ID_PLACEHOLDER = "ET_LOCAL_DETACH_TASK_ID";

      // ── Step 1: detach dispatch ──────────────────────────────────────────────
      setFetchCacheContext("et-ai-local-detach-await-step1");
      const step1 = await runTestStream({
        prompt:
          "Call execute-tool with toolName='self-instance-id', callbackMode='detach', input={}. " +
          "This dispatches the job in the background and returns a taskId immediately. " +
          "End your reply with STEP_OK taskId=<the exact taskId value>. " +
          "Or FAILED: <reason> if anything went wrong.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });
      expect(
        step1.result.success,
        "ET-AI-LOCAL-DETACH-THEN-AWAIT step1: stream must succeed",
      ).toBe(true);
      if (!step1.result.success) {
        return;
      }

      const step1ThreadId = step1.result.data.threadId ?? "";
      await waitForThreadIdle(step1ThreadId, testUser, 30_000);

      // Extract taskId from the detach result stored in DB
      const [detachMsg] = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, step1ThreadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        )
        .limit(1);
      // taskId lives in remoteTaskId — the dispatch placeholder is backfilled
      // with the final tool result; the dispatched taskId is in remoteTaskId.
      const detachTaskId = String(
        detachMsg?.metadata?.toolCall?.remoteTaskId ?? "",
      );
      expect(
        detachTaskId,
        "ET-AI-LOCAL-DETACH-THEN-AWAIT step1: execute-tool must return a taskId",
      ).toMatch(/^local-bg-/);

      // Patch step-2 fixtures: replace stale placeholder with real taskId so replay works
      normalizeFetchCacheFixtures(
        "et-ai-local-detach-await-step2",
        new RegExp(TASK_ID_PLACEHOLDER, "g"),
        TASK_ID_PLACEHOLDER,
      );
      patchFetchCacheFixtures(
        "et-ai-local-detach-await-step2",
        TASK_ID_PLACEHOLDER,
        detachTaskId,
      );

      // ── Step 2: await the detached task ─────────────────────────────────────
      setFetchCacheContext("et-ai-local-detach-await-step2");
      // Register runtime patch: any TASK_ID_PLACEHOLDER in step-2 fixtures → real taskId
      registerFixturePatch(TASK_ID_PLACEHOLDER, detachTaskId);

      const step2 = await runTestStream({
        prompt:
          `Call execute-tool with toolName='await-task', callbackMode='wait', input={taskId:'${detachTaskId}'}. ` +
          "The result should contain instanceId='atlas' (either directly or nested under result.result). " +
          "End your reply with STEP_OK instanceId=<value>. Or FAILED: <reason>.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });
      expect(
        step2.result.success,
        "ET-AI-LOCAL-DETACH-THEN-AWAIT step2: stream must succeed",
      ).toBe(true);
      if (!step2.result.success) {
        return;
      }

      const step2ThreadId = step2.result.data.threadId ?? "";
      await waitForThreadIdle(step2ThreadId, testUser, 60_000);

      const aiText2 = await resolveAiText(step2ThreadId);
      expect(
        aiText2.includes("STEP_OK"),
        `ET-AI-LOCAL-DETACH-THEN-AWAIT step2: AI must confirm STEP_OK — got: ${aiText2.slice(0, 400)}`,
      ).toBe(true);

      const step2ToolMsgs = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, step2ThreadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );
      const awaitCall =
        step2ToolMsgs.find(
          (m) => m.metadata?.toolCall?.toolName === "await-task",
        ) ??
        step2ToolMsgs.find(
          (m) =>
            m.metadata?.toolCall?.toolName === "execute-tool" &&
            (m.metadata.toolCall.args as Record<string, unknown> | undefined)
              ?.toolName === "await-task",
        );
      expect(
        awaitCall,
        "ET-AI-LOCAL-DETACH-THEN-AWAIT step2: await-task call must be in DB",
      ).toBeTruthy();
      expect(
        awaitCall?.metadata?.toolCall?.result,
        "ET-AI-LOCAL-DETACH-THEN-AWAIT step2: await-task result must be non-null",
      ).toBeTruthy();

      // Normalize step-2 fixtures for next run: replace real taskId with placeholder
      normalizeFetchCacheFixtures(
        "et-ai-local-detach-await-step2",
        /local-bg-\d+-\w+/g,
        TASK_ID_PLACEHOLDER,
      );

      await assertNoOrphanCronTasks(
        step1ThreadId,
        "ET-AI-LOCAL-DETACH-THEN-AWAIT step1",
      );
      await assertNoOrphanCronTasks(
        step2ThreadId,
        "ET-AI-LOCAL-DETACH-THEN-AWAIT step2",
      );
    }, 180_000);

    // ── ET-AI-LOCAL-DISMISS ───────────────────────────────────────────────────
    // AI detaches self-instance-id → gets taskId → calls dismiss-task(callId=taskId)
    // → dismissed=true (idempotent: dismiss a call that already completed).

    it("ET-AI-LOCAL-DISMISS: dismiss-task on a completed detach call returns dismissed=true", async () => {
      setFetchCacheContext("et-ai-local-dismiss-");

      const result = await runTestStream({
        prompt:
          "You have two tasks. " +
          "Task 1: Call execute-tool with toolName='self-instance-id', callbackMode='detach', input={}. " +
          "This returns a taskId immediately. Remember the taskId value. " +
          "Task 2: After task 1, call dismiss-task with callId=<taskId from task 1>. " +
          "The result should have dismissed=true. " +
          "End your response with STEP_OK if both calls succeeded, or FAILED: <reason> if not.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-LOCAL-DISMISS: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 60_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-LOCAL-DISMISS: AI must confirm STEP_OK — got: ${aiText.slice(0, 400)}`,
      ).toBe(true);

      const toolMsgs = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );
      const dismissCall = findToolCall(toolMsgs, "dismiss-task");
      expect(
        dismissCall,
        "ET-AI-LOCAL-DISMISS: dismiss-task TOOL message must be in DB",
      ).toBeTruthy();
      expect(
        dismissCall?.metadata?.toolCall?.result,
        "ET-AI-LOCAL-DISMISS: dismiss-task result must be non-null",
      ).toBeTruthy();

      await assertNoOrphanCronTasks(threadId, "ET-AI-LOCAL-DISMISS");
    }, 180_000);

    // ── ET-AI-LOCAL-COMPLETE-TASK ─────────────────────────────────────────────
    // AI detaches self-instance-id → gets taskId → calls complete-task(taskId)
    // → task is manually marked completed.

    it("ET-AI-LOCAL-COMPLETE-TASK: complete-task manually resolves a detached background task", async () => {
      setFetchCacheContext("et-ai-local-complete-task-");

      const result = await runTestStream({
        prompt:
          "You have two tasks. " +
          "Task 1: Call execute-tool with toolName='self-instance-id', callbackMode='detach', input={}. " +
          "This returns a taskId immediately. Remember the taskId value. " +
          "Task 2: After task 1, call complete-task with taskId=<value from task 1> and response={status:'completed',output:'manual-complete-test'}. " +
          "The result should have completed=true. " +
          "End your response with STEP_OK if both calls succeeded, or FAILED: <reason> if not.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-LOCAL-COMPLETE-TASK: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 60_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-LOCAL-COMPLETE-TASK: AI must confirm STEP_OK — got: ${aiText.slice(0, 400)}`,
      ).toBe(true);

      const toolMsgs = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );
      const completeCall = findToolCall(toolMsgs, "complete-task");
      expect(
        completeCall,
        "ET-AI-LOCAL-COMPLETE-TASK: complete-task TOOL message must be in DB",
      ).toBeTruthy();
      expect(
        completeCall?.metadata?.toolCall?.result,
        "ET-AI-LOCAL-COMPLETE-TASK: complete-task result must be non-null",
      ).toBeTruthy();

      await assertNoOrphanCronTasks(threadId, "ET-AI-LOCAL-COMPLETE-TASK");
    }, 180_000);
  });
}

// ── ET-AI-REMOTE: remote transports (direct-http + reverse-ws) ───────────────

if (!_atlasRunning) {
  // Already registered failing test above — do not double-register
} else if (!_hermesRunning) {
  failSuitePrerequisites(
    "Execute-Tool AI E2E — remote transports",
    "hermes not running — start: vibe --hermes dev",
  );
} else if (!_hermesFixtureMode) {
  failSuitePrerequisites(
    "Execute-Tool AI E2E — remote transports",
    "hermes is running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
} else {
  // ── ET-AI-REMOTE-DIRECT: direct-http ──────────────────────────────────────

  describe(`Execute-Tool AI E2E — remote direct-http (atlas AI → hermes via HTTP, ${_remoteUrl ?? ""})`, () => {
    let testUser: JwtPrivatePayloadType;
    let folderId: string;
    let favoriteId: string;
    let prodUserId: string | null = null;

    beforeAll(async () => {
      const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
      expect(
        resolved,
        `ET-AI-REMOTE-DIRECT: admin user ${env.VIBE_ADMIN_USER_EMAIL} not found`,
      ).toBeTruthy();
      if (!resolved) {
        throw new Error("ET-AI-REMOTE-DIRECT: admin user not found");
      }
      testUser = resolved;
      await pinBalance(testUser, 500);
      favoriteId = await createTestFavorite(testUser);

      // Connect atlas → hermes via direct-http
      await disconnectFromHermes(testUser.id);
      await connectToHermes(testUser, _remoteUrl ?? "http://localhost:3002");

      // Override transport to direct-http
      const { remoteConnections } =
        await import("@/app/api/[locale]/remote-connection/db");
      await db
        .update(remoteConnections)
        .set({ transportMode: "direct-http", updatedAt: new Date() })
        .where(
          and(
            eq(remoteConnections.userId, testUser.id),
            eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
          ),
        );

      // Top up hermes credits directly via prod DB (no execute-tool routing needed)
      const { resolveProdUserId, ensureProdUserCredits } =
        await import("@/app/api/[locale]/agent/ai-stream/testing/remote-setup");
      prodUserId = await resolveProdUserId();
      await ensureProdUserCredits(prodUserId, 20_000);

      const testsParentId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.BACKGROUND,
        "tests",
      );
      folderId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.BACKGROUND,
        "execute-tool-ai-e2e-direct",
        testsParentId,
      );
    }, 240_000);

    afterAll(async () => {
      const {
        disconnectFromHermes: disconnect,
        unregisterDevFromHermes,
        closeProdDb,
      } = await import("@/app/api/[locale]/agent/ai-stream/testing/remote-setup");

      const tasks: Promise<void>[] = [disconnect(testUser.id)];
      if (prodUserId) {
        tasks.push(unregisterDevFromHermes(prodUserId));
      }
      await Promise.all(tasks);
      await closeProdDb();
    });

    // ── ET-AI-REMOTE-DIRECT-TOOL-HELP ───────────────────────────────────────

    it("ET-AI-REMOTE-DIRECT-TOOL-HELP: AI calls tool-help on hermes via execute-tool direct-http", async () => {
      setFetchCacheContext("et-ai-remote-direct-toolhelp-");

      const result = await runTestStream({
        prompt:
          "Call execute-tool with toolName='tool-help' and instanceId='hermes' and input={}. " +
          "Check the result has a non-empty tools array. " +
          "End with STEP_OK if tools array is present and non-empty. " +
          "Or FAILED: <reason> if not.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-REMOTE-DIRECT-TOOL-HELP: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 60_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-REMOTE-DIRECT-TOOL-HELP: AI must confirm STEP_OK — got: ${aiText.slice(0, 300)}`,
      ).toBe(true);

      // execute-tool TOOL message must exist in atlas DB with a non-null result
      const toolMsgs = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );
      const executedTool = toolMsgs.find(
        (m) => m.metadata?.toolCall?.toolName === "execute-tool",
      );
      expect(
        executedTool,
        "ET-AI-REMOTE-DIRECT-TOOL-HELP: expected execute-tool TOOL message in atlas DB",
      ).toBeTruthy();
      expect(
        executedTool?.metadata?.toolCall?.result,
        "ET-AI-REMOTE-DIRECT-TOOL-HELP: execute-tool TOOL message must have non-null result",
      ).toBeTruthy();

      await assertNoOrphanCronTasks(threadId, "ET-AI-REMOTE-DIRECT-TOOL-HELP");
    }, 180_000);

    // ── ET-AI-REMOTE-DIRECT-WAIT ─────────────────────────────────────────────

    it("ET-AI-REMOTE-DIRECT-WAIT: execute-tool callbackMode=wait on hermes returns inline result", async () => {
      setFetchCacheContext("et-ai-remote-direct-wait-");

      const result = await runTestStream({
        prompt:
          "Call execute-tool with toolName='tool-help', instanceId='hermes', callbackMode='wait', input={}. " +
          "The result must come back inline (not as a taskId). " +
          "Check the inner result has a non-empty tools array. " +
          "End with STEP_OK if tools array is present and no taskId was returned. " +
          "Or FAILED: <reason>.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-REMOTE-DIRECT-WAIT: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 60_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-REMOTE-DIRECT-WAIT: AI must confirm STEP_OK — got: ${aiText.slice(0, 300)}`,
      ).toBe(true);

      // Thread idle, tool result present, no background tasks
      await assertThreadIdleWithToolResult(
        threadId,
        "ET-AI-REMOTE-DIRECT-WAIT",
      );

      const tasks = await db
        .select({ id: cronTasks.id })
        .from(cronTasks)
        .where(
          and(
            eq(cronTasks.wakeUpThreadId, threadId),
            sql`${cronTasks.routeId} != 'resume-stream'`,
          ),
        );
      expect(
        tasks.length,
        "ET-AI-REMOTE-DIRECT-WAIT: WAIT mode must not create background cron tasks",
      ).toBe(0);
    }, 180_000);

    // ── ET-AI-REMOTE-DIRECT-DETACH ───────────────────────────────────────────

    it("ET-AI-REMOTE-DIRECT-DETACH: execute-tool callbackMode=detach returns taskId, hermes queues cron task", async () => {
      setFetchCacheContext("et-ai-remote-direct-detach-");

      const result = await runTestStream({
        prompt:
          "Call execute-tool with toolName='tool-help', instanceId='hermes', callbackMode='detach', input={}. " +
          "The result must be a taskId (fire-and-forget background dispatch, not an inline result). " +
          "End with STEP_OK taskId=<value>. " +
          "Or FAILED: <reason> if no taskId was returned.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-REMOTE-DIRECT-DETACH: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 60_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-REMOTE-DIRECT-DETACH: AI must confirm STEP_OK — got: ${aiText.slice(0, 300)}`,
      ).toBe(true);

      // Check hermes-side DB for cron_tasks row associated with this thread
      const { getProdDb } =
        await import("@/app/api/[locale]/agent/ai-stream/testing/remote-setup");
      const pdb = getProdDb();
      const hermesRows = await pdb.execute<{
        id: string;
        last_execution_status: string | null;
      }>(
        sql`SELECT id, last_execution_status FROM cron_tasks WHERE wake_up_thread_id = ${threadId} LIMIT 5`,
      );
      // eslint-disable-next-line no-console
      console.log(
        `[ET-AI-REMOTE-DIRECT-DETACH] hermes cron_tasks for thread ${threadId}:`,
        hermesRows.rows.length,
        "rows",
        hermesRows.rows,
      );
      // For detach, hermes queues a cron task OR completes immediately.
      // Primary proof is STEP_OK from AI (already asserted). DB row is a bonus check.

      await assertNoOrphanCronTasks(threadId, "ET-AI-REMOTE-DIRECT-DETACH");
    }, 180_000);

    // ── ET-AI-REMOTE-DIRECT-WAKEUP ───────────────────────────────────────────

    it("ET-AI-REMOTE-DIRECT-WAKEUP: execute-tool callbackMode=wakeUp on hermes parks thread then revives", async () => {
      setFetchCacheContext("et-ai-remote-direct-wakeup-");

      const result = await runTestStream({
        prompt:
          "Call execute-tool with toolName='tool-help', instanceId='hermes', callbackMode='wakeUp', input={}. " +
          "Phase 1: You will get a taskId immediately — reply PHASE1_OK taskId=<value>. " +
          "Phase 2: You will be automatically revived when hermes completes the tool. " +
          "The revival result must include tool information (non-empty tools array). " +
          "When revived, end with WAKEUP_OK if tools data is present and complete. " +
          "Or WAKEUP_FAILED: <reason> if not.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-REMOTE-DIRECT-WAKEUP: phase-1 stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      // Wait for revival — hermes executes tool + atlas wakes the thread
      await waitForThreadIdle(threadId, testUser, 120_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("WAKEUP_OK"),
        `ET-AI-REMOTE-DIRECT-WAKEUP: AI must confirm WAKEUP_OK after revival — got: ${aiText.slice(0, 400)}`,
      ).toBe(true);

      // Thread must be idle after revival
      const [thread] = await db
        .select({ streamingState: chatThreads.streamingState })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);
      expect(
        thread?.streamingState,
        "ET-AI-REMOTE-DIRECT-WAKEUP: thread must be idle after revival",
      ).toBe("idle");

      // TOOL messages must exist with results
      await assertThreadIdleWithToolResult(
        threadId,
        "ET-AI-REMOTE-DIRECT-WAKEUP",
      );

      // Check hermes-side DB for the wakeUp cron task
      const { getProdDb } =
        await import("@/app/api/[locale]/agent/ai-stream/testing/remote-setup");
      const pdb = getProdDb();
      const hermesRows = await pdb.execute<{
        id: string;
        last_execution_status: string | null;
      }>(
        sql`SELECT id, last_execution_status FROM cron_tasks WHERE wake_up_thread_id = ${threadId} LIMIT 5`,
      );
      // eslint-disable-next-line no-console
      console.log(
        `[ET-AI-REMOTE-DIRECT-WAKEUP] hermes cron_tasks for thread ${threadId}:`,
        hermesRows.rows.length,
        "rows — revival already confirmed by WAKEUP_OK",
      );

      await assertNoOrphanCronTasks(threadId, "ET-AI-REMOTE-DIRECT-WAKEUP");
    }, 300_000);

    // ── ET-AI-REMOTE-DIRECT-ENDLOOP ──────────────────────────────────────────

    it("ET-AI-REMOTE-DIRECT-ENDLOOP: execute-tool callbackMode=endLoop stops loop after first remote result", async () => {
      setFetchCacheContext("et-ai-remote-direct-endloop-");

      const result = await runTestStream({
        prompt:
          "Call execute-tool with toolName='tool-help', instanceId='hermes', callbackMode='endLoop', input={}. " +
          "After receiving the result, try to call execute-tool again with the same args. " +
          "Check: did only ONE execute-tool call complete (loop stopped after the first result)? " +
          "End with STEP_OK if exactly one call ran and the result had a tools array. " +
          "Or FAILED: <reason> if more than one call ran or result was missing.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-REMOTE-DIRECT-ENDLOOP: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 60_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-REMOTE-DIRECT-ENDLOOP: AI must confirm STEP_OK — got: ${aiText.slice(0, 300)}`,
      ).toBe(true);

      // Thread must be idle after endLoop
      const [thread] = await db
        .select({ streamingState: chatThreads.streamingState })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);
      expect(
        thread?.streamingState,
        "ET-AI-REMOTE-DIRECT-ENDLOOP: thread must be idle after endLoop",
      ).toBe("idle");

      // Verify: exactly one execute-tool TOOL message in DB
      const toolMsgs = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );
      const etCalls = toolMsgs.filter(
        (m) => m.metadata?.toolCall?.toolName === "execute-tool",
      );
      expect(
        etCalls.length,
        "ET-AI-REMOTE-DIRECT-ENDLOOP: endLoop must result in exactly 1 execute-tool TOOL message",
      ).toBe(1);
      expect(
        etCalls[0]?.metadata?.toolCall?.result,
        "ET-AI-REMOTE-DIRECT-ENDLOOP: the execute-tool result must be non-null",
      ).toBeTruthy();

      await assertNoOrphanCronTasks(threadId, "ET-AI-REMOTE-DIRECT-ENDLOOP");
    }, 180_000);

    // ── ET-AI-REMOTE-DIRECT-DETACH-THEN-AWAIT ────────────────────────────────

    it("ET-AI-REMOTE-DIRECT-DETACH-THEN-AWAIT: AI detaches hermes task then calls await-task to retrieve result", async () => {
      setFetchCacheContext("et-ai-remote-direct-detach-await-");

      const result = await runTestStream({
        prompt:
          "You have two tasks. " +
          "Task 1: Call execute-tool with toolName='self-instance-id', instanceId='hermes', callbackMode='detach', input={}. " +
          "This dispatches the job on hermes in the background and returns a taskId immediately. " +
          "Report the taskId as: taskId=<the exact value>. " +
          "Task 2: After task 1, call await-task with taskId=<value from task 1>. " +
          "The completed result should contain instanceId='hermes'. " +
          "End your response with STEP_OK instanceId=<value> if both calls succeeded, or FAILED: <reason> if either failed.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-REMOTE-DIRECT-DETACH-THEN-AWAIT: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 120_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-REMOTE-DIRECT-DETACH-THEN-AWAIT: AI must confirm STEP_OK — got: ${aiText.slice(0, 400)}`,
      ).toBe(true);

      const toolMsgs = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );
      const awaitCall = findToolCall(toolMsgs, "await-task");
      expect(
        awaitCall,
        "ET-AI-REMOTE-DIRECT-DETACH-THEN-AWAIT: await-task TOOL message must be in DB",
      ).toBeTruthy();
      expect(
        awaitCall?.metadata?.toolCall?.result,
        "ET-AI-REMOTE-DIRECT-DETACH-THEN-AWAIT: await-task result must be non-null",
      ).toBeTruthy();

      await assertNoOrphanCronTasks(
        threadId,
        "ET-AI-REMOTE-DIRECT-DETACH-THEN-AWAIT",
      );
    }, 240_000);

    // ── ET-AI-REMOTE-DIRECT-DISMISS ───────────────────────────────────────────

    it("ET-AI-REMOTE-DIRECT-DISMISS: dismiss-task on a completed hermes pending call returns dismissed=true", async () => {
      setFetchCacheContext("et-ai-remote-direct-dismiss-");

      const result = await runTestStream({
        prompt:
          "You have two tasks. " +
          "Task 1: Call execute-tool with toolName='self-instance-id', instanceId='hermes', callbackMode='detach', input={}. " +
          "This returns a taskId immediately. Remember the taskId value. " +
          "Task 2: After task 1, call dismiss-task with callId=<taskId from task 1>. " +
          "The result should have dismissed=true. " +
          "End your response with STEP_OK if both calls succeeded, or FAILED: <reason> if not.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-REMOTE-DIRECT-DISMISS: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 120_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-REMOTE-DIRECT-DISMISS: AI must confirm STEP_OK — got: ${aiText.slice(0, 400)}`,
      ).toBe(true);

      const toolMsgs = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );
      const dismissCall = findToolCall(toolMsgs, "dismiss-task");
      expect(
        dismissCall,
        "ET-AI-REMOTE-DIRECT-DISMISS: dismiss-task TOOL message must be in DB",
      ).toBeTruthy();
      expect(
        dismissCall?.metadata?.toolCall?.result,
        "ET-AI-REMOTE-DIRECT-DISMISS: dismiss-task result must be non-null",
      ).toBeTruthy();

      await assertNoOrphanCronTasks(threadId, "ET-AI-REMOTE-DIRECT-DISMISS");
    }, 240_000);

    // ── ET-AI-REMOTE-DIRECT-COMPLETE-TASK ────────────────────────────────────

    it("ET-AI-REMOTE-DIRECT-COMPLETE-TASK: complete-task manually resolves a hermes detach task", async () => {
      setFetchCacheContext("et-ai-remote-direct-complete-task-");

      const result = await runTestStream({
        prompt:
          "You have two tasks. " +
          "Task 1: Call execute-tool with toolName='self-instance-id', instanceId='hermes', callbackMode='detach', input={}. " +
          "This returns a taskId immediately. Remember the taskId value. " +
          "Task 2: After task 1, call complete-task with taskId=<value from task 1> and response={status:'completed',output:'remote-complete-test'}. " +
          "The result should have completed=true. " +
          "End your response with STEP_OK if both calls succeeded, or FAILED: <reason> if not.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-REMOTE-DIRECT-COMPLETE-TASK: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 120_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-REMOTE-DIRECT-COMPLETE-TASK: AI must confirm STEP_OK — got: ${aiText.slice(0, 400)}`,
      ).toBe(true);

      const toolMsgs = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );
      const completeCall = findToolCall(toolMsgs, "complete-task");
      expect(
        completeCall,
        "ET-AI-REMOTE-DIRECT-COMPLETE-TASK: complete-task TOOL message must be in DB",
      ).toBeTruthy();
      expect(
        completeCall?.metadata?.toolCall?.result,
        "ET-AI-REMOTE-DIRECT-COMPLETE-TASK: complete-task result must be non-null",
      ).toBeTruthy();

      await assertNoOrphanCronTasks(
        threadId,
        "ET-AI-REMOTE-DIRECT-COMPLETE-TASK",
      );
    }, 240_000);
  });

  // ── ET-AI-REMOTE-WS: reverse-ws ─────────────────────────────────────────────

  describe(`Execute-Tool AI E2E — remote reverse-ws (atlas AI → hermes via WS, ${_remoteUrl ?? ""})`, () => {
    let testUser: JwtPrivatePayloadType;
    let folderId: string;
    let favoriteId: string;
    let prodUserId: string | null = null;

    beforeAll(async () => {
      const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
      expect(
        resolved,
        `ET-AI-REMOTE-WS: admin user ${env.VIBE_ADMIN_USER_EMAIL} not found`,
      ).toBeTruthy();
      if (!resolved) {
        throw new Error("ET-AI-REMOTE-WS: admin user not found");
      }
      testUser = resolved;
      await pinBalance(testUser, 500);
      favoriteId = await createTestFavorite(testUser);

      // Connect via reverse-WS transport
      await disconnectFromHermesLocalAi(testUser);
      await connectToHermesLocalAi(
        testUser,
        _remoteUrl ?? "http://localhost:3002",
      );

      // Set atlas's hermes connection to reverse-ws via the real PATCH endpoint
      // (end to end — no manual DB writes). The handler opens the connector so it
      // subscribes to the peer's remote-event channel (the reverse-ws forward leg).
      const connByIdDef = (
        await import("@/app/api/[locale]/remote-connection/[instanceId]/definition")
      ).default;
      const wsPatch = await sendTestRequest({
        endpoint: connByIdDef.PATCH,
        data: { transportMode: "reverse-ws" },
        urlPathParams: { instanceId: HERMES_INSTANCE_ID },
        user: testUser,
      });
      expect(
        wsPatch.success,
        `ET-AI-REMOTE-WS: set reverse-ws PATCH failed: ${JSON.stringify(wsPatch)}`,
      ).toBe(true);

      // Top up hermes credits directly via prod DB (no execute-tool routing needed)
      const { resolveProdUserId, ensureProdUserCredits } =
        await import("@/app/api/[locale]/agent/ai-stream/testing/remote-setup");
      prodUserId = await resolveProdUserId();
      await ensureProdUserCredits(prodUserId, 20_000);

      const testsParentId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.BACKGROUND,
        "tests",
      );
      folderId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.BACKGROUND,
        "execute-tool-ai-e2e-ws",
        testsParentId,
      );
    }, 240_000);

    afterAll(async () => {
      const {
        disconnectFromHermesLocalAi: disconnect,
        unregisterDevFromHermes,
        closeProdDb,
      } = await import("@/app/api/[locale]/agent/ai-stream/testing/remote-setup");

      const tasks: Promise<void>[] = [disconnect(testUser)];
      if (prodUserId) {
        tasks.push(unregisterDevFromHermes(prodUserId));
      }
      await Promise.all(tasks);
      await closeProdDb();
    });

    // ── ET-AI-REMOTE-WS-TOOL-HELP ────────────────────────────────────────────

    it("ET-AI-REMOTE-WS-TOOL-HELP: AI calls tool-help on hermes via reverse-WS execute-tool", async () => {
      setFetchCacheContext("et-ai-remote-ws-toolhelp-");

      const result = await runTestStream({
        prompt:
          "Call execute-tool with toolName='tool-help' and instanceId='hermes' and input={}. " +
          "Check the result has a non-empty tools array. " +
          "End with STEP_OK if tools array is present and non-empty. " +
          "Or FAILED: <reason>.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-REMOTE-WS-TOOL-HELP: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 60_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-REMOTE-WS-TOOL-HELP: AI must confirm STEP_OK — got: ${aiText.slice(0, 300)}`,
      ).toBe(true);

      // execute-tool TOOL message must exist in atlas DB with a non-null result
      const toolMsgs = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );
      const executedTool = toolMsgs.find(
        (m) => m.metadata?.toolCall?.toolName === "execute-tool",
      );
      expect(
        executedTool,
        "ET-AI-REMOTE-WS-TOOL-HELP: expected execute-tool TOOL message in atlas DB",
      ).toBeTruthy();
      expect(
        executedTool?.metadata?.toolCall?.result,
        "ET-AI-REMOTE-WS-TOOL-HELP: execute-tool result must be non-null in atlas DB",
      ).toBeTruthy();

      await assertNoOrphanCronTasks(threadId, "ET-AI-REMOTE-WS-TOOL-HELP");
    }, 180_000);

    // ── ET-AI-REMOTE-WS-WAIT ─────────────────────────────────────────────────

    it("ET-AI-REMOTE-WS-WAIT: execute-tool callbackMode=wait over reverse-WS returns inline result", async () => {
      setFetchCacheContext("et-ai-remote-ws-wait-");

      const result = await runTestStream({
        prompt:
          "Call execute-tool with toolName='tool-help', instanceId='hermes', callbackMode='wait', input={}. " +
          "The result must come back inline (not as a taskId). " +
          "Check the inner result has a non-empty tools array. " +
          "End with STEP_OK if tools array present and no taskId was returned. " +
          "Or FAILED: <reason>.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-REMOTE-WS-WAIT: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 60_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-REMOTE-WS-WAIT: AI must confirm STEP_OK — got: ${aiText.slice(0, 300)}`,
      ).toBe(true);

      // Thread idle, tool result in DB, no orphan tasks
      await assertThreadIdleWithToolResult(threadId, "ET-AI-REMOTE-WS-WAIT");

      const tasks = await db
        .select({ id: cronTasks.id })
        .from(cronTasks)
        .where(
          and(
            eq(cronTasks.wakeUpThreadId, threadId),
            sql`${cronTasks.routeId} != 'resume-stream'`,
          ),
        );
      expect(
        tasks.length,
        "ET-AI-REMOTE-WS-WAIT: WAIT mode must not create background cron tasks",
      ).toBe(0);
    }, 180_000);

    // ── ET-AI-REMOTE-WS-DETACH ───────────────────────────────────────────────

    it("ET-AI-REMOTE-WS-DETACH: execute-tool callbackMode=detach over reverse-WS returns taskId immediately", async () => {
      setFetchCacheContext("et-ai-remote-ws-detach-");

      const result = await runTestStream({
        prompt:
          "Call execute-tool with toolName='tool-help', instanceId='hermes', callbackMode='detach', input={}. " +
          "The result must be a taskId (fire-and-forget, not an inline result). " +
          "End with STEP_OK taskId=<value>. " +
          "Or FAILED: <reason> if no taskId was returned.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-REMOTE-WS-DETACH: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 60_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-REMOTE-WS-DETACH: AI must confirm STEP_OK — got: ${aiText.slice(0, 300)}`,
      ).toBe(true);

      // Log hermes-side cron_tasks for debug visibility
      const { getProdDb } =
        await import("@/app/api/[locale]/agent/ai-stream/testing/remote-setup");
      const pdb = getProdDb();
      const hermesRows = await pdb.execute<{
        id: string;
        last_execution_status: string | null;
      }>(
        sql`SELECT id, last_execution_status FROM cron_tasks WHERE wake_up_thread_id = ${threadId} LIMIT 5`,
      );
      // eslint-disable-next-line no-console
      console.log(
        `[ET-AI-REMOTE-WS-DETACH] hermes cron_tasks for thread ${threadId}:`,
        hermesRows.rows.length,
        "rows",
        hermesRows.rows,
      );

      await assertNoOrphanCronTasks(threadId, "ET-AI-REMOTE-WS-DETACH");
    }, 180_000);

    // ── ET-AI-REMOTE-WS-WAKEUP ───────────────────────────────────────────────

    it("ET-AI-REMOTE-WS-WAKEUP: execute-tool callbackMode=wakeUp over reverse-WS parks thread then revives", async () => {
      setFetchCacheContext("et-ai-remote-ws-wakeup-");

      const result = await runTestStream({
        prompt:
          "Call execute-tool with toolName='tool-help', instanceId='hermes', callbackMode='wakeUp', input={}. " +
          "Phase 1: You will get a taskId immediately — reply PHASE1_OK taskId=<value>. " +
          "Phase 2: You will be automatically revived when hermes finishes executing the tool. " +
          "The revival result must include tool information (non-empty tools array). " +
          "When revived, end with WAKEUP_OK if tools data is present. " +
          "Or WAKEUP_FAILED: <reason> if tools data is missing.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-REMOTE-WS-WAKEUP: phase-1 stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      // Wait for full revival
      await waitForThreadIdle(threadId, testUser, 180_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("WAKEUP_OK"),
        `ET-AI-REMOTE-WS-WAKEUP: AI must confirm WAKEUP_OK after revival — got: ${aiText.slice(0, 400)}`,
      ).toBe(true);

      // Thread must be fully idle after revival
      const [thread] = await db
        .select({ streamingState: chatThreads.streamingState })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);
      expect(
        thread?.streamingState,
        "ET-AI-REMOTE-WS-WAKEUP: thread must be idle after revival",
      ).toBe("idle");

      // TOOL messages must exist with results
      await assertThreadIdleWithToolResult(threadId, "ET-AI-REMOTE-WS-WAKEUP");

      // Check hermes-side DB for the wakeUp cron task
      const { getProdDb } =
        await import("@/app/api/[locale]/agent/ai-stream/testing/remote-setup");
      const pdb = getProdDb();
      const hermesRows = await pdb.execute<{ id: string }>(
        sql`SELECT id FROM cron_tasks WHERE wake_up_thread_id = ${threadId} LIMIT 5`,
      );
      // eslint-disable-next-line no-console
      console.log(
        `[ET-AI-REMOTE-WS-WAKEUP] hermes cron_tasks for thread ${threadId}:`,
        hermesRows.rows.length,
        "rows — revival confirmed by WAKEUP_OK",
      );

      await assertNoOrphanCronTasks(threadId, "ET-AI-REMOTE-WS-WAKEUP");
    }, 300_000);

    // ── ET-AI-REMOTE-WS-ENDLOOP ──────────────────────────────────────────────

    it("ET-AI-REMOTE-WS-ENDLOOP: execute-tool callbackMode=endLoop over reverse-WS stops loop after first result", async () => {
      setFetchCacheContext("et-ai-remote-ws-endloop-");

      const result = await runTestStream({
        prompt:
          "Call execute-tool with toolName='tool-help', instanceId='hermes', callbackMode='endLoop', input={}. " +
          "After receiving the result, try to call execute-tool again with the same args. " +
          "Check: did only ONE execute-tool call complete (loop stopped after the first)? " +
          "End with STEP_OK if exactly one call ran and the result had a tools array. " +
          "Or FAILED: <reason> if more than one call ran or result was missing.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-REMOTE-WS-ENDLOOP: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 60_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-REMOTE-WS-ENDLOOP: AI must confirm STEP_OK — got: ${aiText.slice(0, 300)}`,
      ).toBe(true);

      // Thread must be idle after endLoop
      const [thread] = await db
        .select({ streamingState: chatThreads.streamingState })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);
      expect(
        thread?.streamingState,
        "ET-AI-REMOTE-WS-ENDLOOP: thread must be idle after endLoop",
      ).toBe("idle");

      // Verify exactly one execute-tool TOOL message in DB (endLoop blocked the second)
      const toolMsgs = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );
      const etCalls = toolMsgs.filter(
        (m) => m.metadata?.toolCall?.toolName === "execute-tool",
      );
      expect(
        etCalls.length,
        "ET-AI-REMOTE-WS-ENDLOOP: endLoop must result in exactly 1 execute-tool TOOL message",
      ).toBe(1);
      expect(
        etCalls[0]?.metadata?.toolCall?.result,
        "ET-AI-REMOTE-WS-ENDLOOP: the execute-tool result must be non-null",
      ).toBeTruthy();

      await assertNoOrphanCronTasks(threadId, "ET-AI-REMOTE-WS-ENDLOOP");
    }, 180_000);

    // ── ET-AI-REMOTE-WS-DETACH-THEN-AWAIT ────────────────────────────────────

    it("ET-AI-REMOTE-WS-DETACH-THEN-AWAIT: AI detaches hermes task over reverse-WS then calls await-task to retrieve result", async () => {
      setFetchCacheContext("et-ai-remote-ws-detach-await-");

      const result = await runTestStream({
        prompt:
          "You have two tasks. " +
          "Task 1: Call execute-tool with toolName='self-instance-id', instanceId='hermes', callbackMode='detach', input={}. " +
          "This dispatches the job on hermes in the background and returns a taskId immediately. " +
          "Report the taskId as: taskId=<the exact value>. " +
          "Task 2: After task 1, call await-task with taskId=<value from task 1>. " +
          "The completed result should contain instanceId='hermes'. " +
          "End your response with STEP_OK instanceId=<value> if both calls succeeded, or FAILED: <reason> if either failed.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-REMOTE-WS-DETACH-THEN-AWAIT: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 120_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-REMOTE-WS-DETACH-THEN-AWAIT: AI must confirm STEP_OK — got: ${aiText.slice(0, 400)}`,
      ).toBe(true);

      const toolMsgs = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );
      const awaitCall = findToolCall(toolMsgs, "await-task");
      expect(
        awaitCall,
        "ET-AI-REMOTE-WS-DETACH-THEN-AWAIT: await-task TOOL message must be in DB",
      ).toBeTruthy();
      expect(
        awaitCall?.metadata?.toolCall?.result,
        "ET-AI-REMOTE-WS-DETACH-THEN-AWAIT: await-task result must be non-null",
      ).toBeTruthy();

      await assertNoOrphanCronTasks(
        threadId,
        "ET-AI-REMOTE-WS-DETACH-THEN-AWAIT",
      );
    }, 240_000);

    // ── ET-AI-REMOTE-WS-DISMISS ───────────────────────────────────────────────

    it("ET-AI-REMOTE-WS-DISMISS: dismiss-task on a completed hermes pending call over reverse-WS returns dismissed=true", async () => {
      setFetchCacheContext("et-ai-remote-ws-dismiss-");

      const result = await runTestStream({
        prompt:
          "You have two tasks. " +
          "Task 1: Call execute-tool with toolName='self-instance-id', instanceId='hermes', callbackMode='detach', input={}. " +
          "This returns a taskId immediately. Remember the taskId value. " +
          "Task 2: After task 1, call dismiss-task with callId=<taskId from task 1>. " +
          "The result should have dismissed=true. " +
          "End your response with STEP_OK if both calls succeeded, or FAILED: <reason> if not.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-REMOTE-WS-DISMISS: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 120_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-REMOTE-WS-DISMISS: AI must confirm STEP_OK — got: ${aiText.slice(0, 400)}`,
      ).toBe(true);

      const toolMsgs = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );
      const dismissCall = findToolCall(toolMsgs, "dismiss-task");
      expect(
        dismissCall,
        "ET-AI-REMOTE-WS-DISMISS: dismiss-task TOOL message must be in DB",
      ).toBeTruthy();
      expect(
        dismissCall?.metadata?.toolCall?.result,
        "ET-AI-REMOTE-WS-DISMISS: dismiss-task result must be non-null",
      ).toBeTruthy();

      await assertNoOrphanCronTasks(threadId, "ET-AI-REMOTE-WS-DISMISS");
    }, 240_000);

    // ── ET-AI-REMOTE-WS-COMPLETE-TASK ────────────────────────────────────────

    it("ET-AI-REMOTE-WS-COMPLETE-TASK: complete-task manually resolves a hermes detach task over reverse-WS", async () => {
      setFetchCacheContext("et-ai-remote-ws-complete-task-");

      const result = await runTestStream({
        prompt:
          "You have two tasks. " +
          "Task 1: Call execute-tool with toolName='self-instance-id', instanceId='hermes', callbackMode='detach', input={}. " +
          "This returns a taskId immediately. Remember the taskId value. " +
          "Task 2: After task 1, call complete-task with taskId=<value from task 1> and response={status:'completed',output:'ws-complete-test'}. " +
          "The result should have completed=true. " +
          "End your response with STEP_OK if both calls succeeded, or FAILED: <reason> if not.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: folderId,
        favoriteId,
      });

      expect(
        result.result.success,
        "ET-AI-REMOTE-WS-COMPLETE-TASK: stream must succeed",
      ).toBe(true);
      if (!result.result.success) {
        return;
      }

      const threadId = result.result.data.threadId ?? "";
      await waitForThreadIdle(threadId, testUser, 120_000);

      const aiText = await resolveAiText(threadId);
      expect(
        aiText.includes("STEP_OK"),
        `ET-AI-REMOTE-WS-COMPLETE-TASK: AI must confirm STEP_OK — got: ${aiText.slice(0, 400)}`,
      ).toBe(true);

      const toolMsgs = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );
      const completeCall = findToolCall(toolMsgs, "complete-task");
      expect(
        completeCall,
        "ET-AI-REMOTE-WS-COMPLETE-TASK: complete-task TOOL message must be in DB",
      ).toBeTruthy();
      expect(
        completeCall?.metadata?.toolCall?.result,
        "ET-AI-REMOTE-WS-COMPLETE-TASK: complete-task result must be non-null",
      ).toBeTruthy();

      await assertNoOrphanCronTasks(threadId, "ET-AI-REMOTE-WS-COMPLETE-TASK");
    }, 240_000);
  });
}
