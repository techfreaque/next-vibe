// oxlint-disable oxlint-plugin-restricted/restricted-syntax
/**
 * Execute-Tool E2E Tests
 *
 * Covers every local callback mode with concrete assertions, plus pending-call
 * lifecycle helpers and dismiss-task, and remote dispatch (guarded by live Hermes).
 *
 * ET-LOCAL-*   : local execution, all five callbackModes
 * ET-PENDING-* : pending-call registry lifecycle
 * ET-DISMISS-* : dismiss-task endpoint
 * ET-REMOTE-*  : remote dispatch (skipped when Hermes is not running)
 */

import "server-only";

// installFetchCache MUST be called before any other imports.
import { installFetchCache } from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
installFetchCache();

import { eq } from "drizzle-orm";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { setFetchCacheContext } from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
import {
  HERMES_INSTANCE_ID,
  resolveRemoteUrlSync,
} from "@/app/api/[locale]/agent/ai-stream/testing/remote-setup";
import {
  DefaultFolderId,
  makeHeadlessContext,
} from "@/app/api/[locale]/agent/chat/config";
import { resolveTestAdminUser } from "@/app/api/[locale]/system/check/testing/testing-suite/resolve-test-user";
import { db } from "@/app/api/[locale]/system/db";
import helpEndpoints from "@/app/api/[locale]/system/help/definition";
import { createEndpointLogger } from "@/app/api/[locale]/system/logger/server";
import type { AiT } from "@/app/api/[locale]/system/unified-interface/ai/i18n";
import {
  awaitPendingCallResult,
  completePendingCall,
  discardPendingCall,
  getPendingCall,
  registerPendingCall,
  setPendingCallRevival,
} from "@/app/api/[locale]/system/unified-interface/execute-tool/pending-calls";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import type { CronTaskStatusValue } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { CronTaskStatus } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { defaultLocale } from "@/i18n/core/config";

import { CallbackMode } from "../constants";
import { DismissTaskRepository } from "../dismiss-task/repository";
import { RouteExecuteRepository } from "../repository";

// ── Remote URL guard ──────────────────────────────────────────────────────────

const _resolvedRemoteUrl = resolveRemoteUrlSync();

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeLogger(): ReturnType<typeof createEndpointLogger> {
  return createEndpointLogger(false, Date.now(), defaultLocale);
}

/** Poll DB until task reaches a terminal status or we time out. */
async function pollTaskCompletion(
  taskId: string,
  timeoutMs = 8000,
): Promise<typeof CronTaskStatusValue | null> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const [row] = await db
      .select({ lastExecutionStatus: cronTasks.lastExecutionStatus })
      .from(cronTasks)
      .where(eq(cronTasks.id, taskId))
      .limit(1);
    if (!row) {
      // Task deleted (happens when wakeUp goroutine finishes and cleans up).
      return CronTaskStatus.COMPLETED;
    }
    const s = row.lastExecutionStatus;
    if (s === CronTaskStatus.COMPLETED || s === CronTaskStatus.FAILED) {
      return s;
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 200);
    });
  }
  return null;
}

/** Get AI i18n t() for error message construction in dismiss-task. */
async function getAiT(): Promise<AiT> {
  const { scopedTranslation } =
    await import("@/app/api/[locale]/system/unified-interface/ai/i18n");
  return scopedTranslation.scopedT(defaultLocale).t;
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe("Execute-Tool E2E", () => {
  let testUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    testUser = await resolveTestAdminUser();
  });

  // ════════════════════════════════════════════════════════════════════════════
  // LOCAL CALLBACK MODES
  // ════════════════════════════════════════════════════════════════════════════

  // ── ET-LOCAL-WAIT ─────────────────────────────────────────────────────────
  // WAIT: blocks until tool completes, returns result inline (no taskId).

  it("ET-LOCAL-WAIT: WAIT returns result inline, no taskId", async () => {
    setFetchCacheContext("et-local-wait");

    const result = await RouteExecuteRepository.runInProcess({
      toolName: "tool-help",
      input: { query: "execute-tool", page: 1, pageSize: 5 },
      callbackMode: CallbackMode.WAIT,
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      streamContext: makeHeadlessContext(),
      platform: Platform.AI,
    });

    expect(
      result.success,
      `ET-LOCAL-WAIT failed: ${JSON.stringify(result)}`,
    ).toBe(true);
    if (!result.success) {
      throw new Error(result.message);
    }

    const data = result.data as Record<string, unknown>;
    // WAIT wraps the tool's data in { result: ... }
    expect(data, "WAIT response must have a result field").toHaveProperty(
      "result",
    );
    // No taskId for synchronous result
    expect(data.taskId, "WAIT must not return taskId").toBeUndefined();
  });

  // ── ET-LOCAL-END-LOOP ──────────────────────────────────────────────────────
  // END_LOOP: identical to WAIT for local tools — returns result inline, no taskId.
  // (The AI SDK signals end-of-tool-loop via the tool call's result shape.)

  it("ET-LOCAL-END-LOOP: END_LOOP returns result inline like WAIT, no taskId", async () => {
    setFetchCacheContext("et-local-end-loop");

    const result = await RouteExecuteRepository.runInProcess({
      toolName: "tool-help",
      input: { query: "execute-tool", page: 1, pageSize: 5 },
      callbackMode: CallbackMode.END_LOOP,
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      streamContext: makeHeadlessContext(),
      platform: Platform.AI,
    });

    expect(
      result.success,
      `ET-LOCAL-END-LOOP failed: ${JSON.stringify(result)}`,
    ).toBe(true);
    if (!result.success) {
      throw new Error(result.message);
    }

    const data = result.data as Record<string, unknown>;
    expect(data, "END_LOOP response must have a result field").toHaveProperty(
      "result",
    );
    expect(data.taskId, "END_LOOP must not return taskId").toBeUndefined();
  });

  // ── ET-LOCAL-APPROVE ──────────────────────────────────────────────────────
  // APPROVE: returns placeholder immediately with waiting_for_confirmation,
  // no taskId (stream aborts at finish-step; real result arrives after user confirms).

  it("ET-LOCAL-APPROVE: APPROVE returns waiting_for_confirmation placeholder, no taskId", async () => {
    setFetchCacheContext("et-local-approve");

    const result = await RouteExecuteRepository.runInProcess({
      toolName: "tool-help",
      input: { query: "execute-tool", page: 1, pageSize: 5 },
      callbackMode: CallbackMode.APPROVE,
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      streamContext: makeHeadlessContext(),
      platform: Platform.AI,
    });

    expect(
      result.success,
      `ET-LOCAL-APPROVE failed: ${JSON.stringify(result)}`,
    ).toBe(true);
    if (!result.success) {
      throw new Error(result.message);
    }

    const data = result.data as Record<string, unknown>;
    // APPROVE returns { result: { status: "waiting_for_confirmation", toolName } }
    expect(data, "APPROVE response must have a result field").toHaveProperty(
      "result",
    );
    const inner = data.result as Record<string, unknown>;
    expect(
      inner.status,
      "APPROVE result.status must be waiting_for_confirmation",
    ).toBe("waiting_for_confirmation");
    expect(
      inner.toolName,
      "APPROVE result.toolName must be the executed tool",
    ).toBeTruthy();
    expect(data.taskId, "APPROVE must not return taskId").toBeUndefined();
  });

  // ── ET-LOCAL-DETACH ───────────────────────────────────────────────────────
  // DETACH: returns taskId immediately; task executes async; polling DB shows completion.

  it("ET-LOCAL-DETACH: DETACH returns taskId immediately, task completes async", async () => {
    setFetchCacheContext("et-local-detach");

    const ctx = {
      ...makeHeadlessContext(),
      threadId: `thread-detach-test-${Date.now()}`,
    };

    const result = await RouteExecuteRepository.runInProcess({
      toolName: "tool-help",
      input: { query: "execute-tool", page: 1, pageSize: 5 },
      callbackMode: CallbackMode.DETACH,
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      streamContext: ctx,
      platform: Platform.AI,
    });

    expect(
      result.success,
      `ET-LOCAL-DETACH failed: ${JSON.stringify(result)}`,
    ).toBe(true);
    if (!result.success) {
      throw new Error(result.message);
    }

    const data = result.data as Record<string, unknown>;
    // DETACH must return a taskId (the local cron task created for background execution)
    expect(data.taskId, "DETACH must return a taskId").toBeTruthy();
    expect(typeof data.taskId, "taskId must be a string").toBe("string");
    // Should include a hint about await-task
    expect(data.hint, "DETACH must include a hint string").toBeTruthy();
    // Must NOT return inline result
    expect(data.result, "DETACH must not return inline result").toBeUndefined();

    const taskId = data.taskId as string;

    // Poll for task completion — goroutine runs async
    const finalStatus = await pollTaskCompletion(taskId, 10000);
    expect(
      finalStatus,
      `DETACH task did not complete within 10s (got ${String(finalStatus)})`,
    ).toBe(CronTaskStatus.COMPLETED);
  }, 15000);

  // ── ET-LOCAL-WAKE-UP ──────────────────────────────────────────────────────
  // WAKE_UP: returns taskId immediately; task row created RUNNING;
  // goroutine executes tool and then calls handleTaskCompletion which flips task to COMPLETED.

  it("ET-LOCAL-WAKE-UP: WAKE_UP returns taskId, task completes and is cleaned up", async () => {
    setFetchCacheContext("et-local-wakeup");

    const ctx = {
      ...makeHeadlessContext(),
      threadId: `thread-wakeup-test-${Date.now()}`,
    };

    const result = await RouteExecuteRepository.runInProcess({
      toolName: "tool-help",
      input: { query: "execute-tool", page: 1, pageSize: 5 },
      callbackMode: CallbackMode.WAKE_UP,
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      streamContext: ctx,
      platform: Platform.AI,
    });

    expect(
      result.success,
      `ET-LOCAL-WAKE-UP failed: ${JSON.stringify(result)}`,
    ).toBe(true);
    if (!result.success) {
      throw new Error(result.message);
    }

    const data = result.data as Record<string, unknown>;
    // WAKE_UP must return a taskId
    expect(data.taskId, "WAKE_UP must return a taskId").toBeTruthy();
    expect(typeof data.taskId, "taskId must be a string").toBe("string");
    expect(data.hint, "WAKE_UP must include a hint string").toBeTruthy();
    // Must NOT return inline result
    expect(
      data.result,
      "WAKE_UP must not return inline result",
    ).toBeUndefined();

    const taskId = data.taskId as string;

    // Poll for task completion — wakeUp goroutine runs async then self-deletes
    const finalStatus = await pollTaskCompletion(taskId, 10000);
    // COMPLETED means either row has status=COMPLETED or was deleted (goroutine self-cleanup)
    expect(
      finalStatus,
      `WAKE_UP task did not complete within 10s (got ${String(finalStatus)})`,
    ).toBe(CronTaskStatus.COMPLETED);
  }, 15000);

  // ── ET-LOCAL-DETACH-THEN-AWAIT-TASK ──────────────────────────────────────
  // DETACH returns taskId. After task completes, await-task returns the result inline.
  // This is the AI's "I need the result" flow.

  it("ET-LOCAL-DETACH-THEN-AWAIT-TASK: await-task returns completed result after DETACH", async () => {
    setFetchCacheContext("et-local-detach-wait");

    const detachResult = await RouteExecuteRepository.runInProcess({
      toolName: "tool-help",
      input: { query: "execute-tool", page: 1, pageSize: 5 },
      callbackMode: CallbackMode.DETACH,
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      streamContext: makeHeadlessContext(),
      platform: Platform.AI,
    });

    expect(
      detachResult.success,
      `DETACH failed: ${JSON.stringify(detachResult)}`,
    ).toBe(true);
    if (!detachResult.success) {
      throw new Error(detachResult.message);
    }

    const { taskId } = detachResult.data as { taskId: string; hint: string };
    expect(taskId, "DETACH must return a taskId").toBeTruthy();

    // Wait for the goroutine to complete the task
    const finalStatus = await pollTaskCompletion(taskId, 10000);
    expect(finalStatus, "DETACH task must complete before await-task").toBe(
      CronTaskStatus.COMPLETED,
    );

    // Now call await-task — should return the stored result inline
    const { AwaitTaskRepository } =
      await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/repository");
    const { scopedTranslation: tasksScopedT } =
      await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/i18n");
    const t = tasksScopedT.scopedT(defaultLocale).t;
    const waitCtx = makeHeadlessContext();

    const waitResult = await AwaitTaskRepository.awaitTask(
      { taskId },
      testUser,
      makeLogger(),
      t,
      waitCtx,
    );

    expect(
      waitResult.success,
      `await-task failed: ${JSON.stringify(waitResult)}`,
    ).toBe(true);
    if (!waitResult.success) {
      throw new Error(waitResult.message);
    }

    expect(
      waitResult.data.waiting,
      "await-task on completed task must NOT be waiting",
    ).toBe(false);
    expect(waitResult.data.status, "await-task status must be completed").toBe(
      CronTaskStatus.COMPLETED,
    );
  }, 15000);

  // ── ET-LOCAL-WAKE-UP-THEN-AWAIT-TASK ─────────────────────────────────────
  // WAKE_UP dispatches to background; after task completes, await-task returns inline.

  it("ET-LOCAL-WAKE-UP-THEN-AWAIT-TASK: await-task intercepts completed result after WAKE_UP", async () => {
    setFetchCacheContext("et-local-wakeup-await");

    const ctx = {
      ...makeHeadlessContext(),
      threadId: `thread-wakeup-await-test-${Date.now()}`,
    };

    const wakeUpResult = await RouteExecuteRepository.runInProcess({
      toolName: "tool-help",
      input: { query: "execute-tool", page: 1, pageSize: 5 },
      callbackMode: CallbackMode.WAKE_UP,
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      streamContext: ctx,
      platform: Platform.AI,
    });

    expect(
      wakeUpResult.success,
      `WAKE_UP failed: ${JSON.stringify(wakeUpResult)}`,
    ).toBe(true);
    if (!wakeUpResult.success) {
      throw new Error(wakeUpResult.message);
    }

    const { taskId } = wakeUpResult.data as { taskId: string; hint: string };
    expect(taskId, "WAKE_UP must return a taskId").toBeTruthy();

    // Wait for the goroutine to complete the task
    const finalStatus = await pollTaskCompletion(taskId, 10000);
    expect(finalStatus, "WAKE_UP task must complete before await-task").toBe(
      CronTaskStatus.COMPLETED,
    );

    // Now call await-task — should return the stored result inline
    const { AwaitTaskRepository } =
      await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/repository");
    const { scopedTranslation: tasksScopedT } =
      await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/i18n");
    const t = tasksScopedT.scopedT(defaultLocale).t;

    const awaitResult = await AwaitTaskRepository.awaitTask(
      { taskId },
      testUser,
      makeLogger(),
      t,
      makeHeadlessContext(),
    );

    expect(
      awaitResult.success,
      `await-task failed: ${JSON.stringify(awaitResult)}`,
    ).toBe(true);
    if (!awaitResult.success) {
      throw new Error(awaitResult.message);
    }

    expect(
      awaitResult.data.waiting,
      "await-task on completed WAKE_UP task must NOT be waiting",
    ).toBe(false);
    expect(awaitResult.data.status, "await-task status must be completed").toBe(
      CronTaskStatus.COMPLETED,
    );
    expect(
      awaitResult.data.result,
      "await-task on completed WAKE_UP task must have a result",
    ).toBeDefined();
    expect(
      awaitResult.data.originalToolName,
      "await-task must report originalToolName",
    ).toBeTruthy();
  }, 15000);

  // ── ET-LOCAL-AWAIT-TASK-NOT-FOUND ─────────────────────────────────────────
  // Calling await-task with a non-existent taskId must return NOT_FOUND failure.

  it("ET-LOCAL-AWAIT-TASK-NOT-FOUND: await-task with unknown taskId returns NOT_FOUND failure", async () => {
    setFetchCacheContext("et-local-await-not-found");

    const { AwaitTaskRepository } =
      await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/repository");
    const { scopedTranslation: tasksScopedT } =
      await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/i18n");
    const t = tasksScopedT.scopedT(defaultLocale).t;

    const result = await AwaitTaskRepository.awaitTask(
      { taskId: `nonexistent-task-id-${Date.now()}` },
      testUser,
      makeLogger(),
      t,
      makeHeadlessContext(),
    );

    expect(
      result.success,
      "await-task with unknown taskId must return success=false",
    ).toBe(false);
    if (result.success) {
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
      throw new Error("Expected failure but got success");
    }
    expect(result.errorType, "error type must be NOT_FOUND").toBe(
      ErrorResponseTypes.NOT_FOUND,
    );
    expect(result.message, "failure must include a message").toBeTruthy();
  });

  // ── ET-LOCAL-INVALID-TOOL ─────────────────────────────────────────────────
  // Requesting a non-existent toolName must fail cleanly (no throw).

  it("ET-LOCAL-INVALID-TOOL: unknown toolName returns failure, does not throw", async () => {
    setFetchCacheContext("et-local-invalid");

    const result = await RouteExecuteRepository.runInProcess({
      toolName: "this-tool-does-not-exist-xyz-abc",
      input: {},
      callbackMode: CallbackMode.WAIT,
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      streamContext: makeHeadlessContext(),
      platform: Platform.AI,
    });

    expect(result.success, "Unknown tool must return success=false").toBe(
      false,
    );
    if (result.success) {
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
      throw new Error("Expected failure but got success");
    }
    expect(result.message, "Failure must include a message").toBeTruthy();
  });

  // ── ET-LOCAL-INCOGNITO-BLOCKS-REMOTE ──────────────────────────────────────
  // INCOGNITO folder blocks all remote tool dispatch.

  it("ET-LOCAL-INCOGNITO-BLOCKS-REMOTE: remote tool blocked in incognito folder", async () => {
    setFetchCacheContext("et-local-incognito");

    const result = await RouteExecuteRepository.runInProcess({
      toolName: "tool-help",
      input: { query: "test", page: 1, pageSize: 5 },
      instanceId: "some-remote-instance",
      callbackMode: CallbackMode.WAIT,
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      streamContext: {
        ...makeHeadlessContext(),
        rootFolderId: DefaultFolderId.INCOGNITO,
      },
      platform: Platform.AI,
    });

    expect(result.success, "Remote tool in INCOGNITO must be blocked").toBe(
      false,
    );
    if (result.success) {
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
      throw new Error("Expected failure but got success");
    }
  });

  // ── ET-LOCAL-TYPED-WAIT ───────────────────────────────────────────────────
  // runInProcessTyped with no callbackMode: typed response, no wrapping.

  it("ET-LOCAL-TYPED-WAIT: runInProcessTyped without callbackMode returns typed tool data", async () => {
    setFetchCacheContext("et-local-typed-wait");

    const result = await RouteExecuteRepository.runInProcessTyped({
      definition: helpEndpoints.GET,
      input: { query: "execute-tool", page: 1, pageSize: 5 },
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      platform: Platform.AI,
    });

    expect(
      result.success,
      `runInProcessTyped failed: ${JSON.stringify(result)}`,
    ).toBe(true);
    if (!result.success) {
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
      throw new Error(result.message);
    }

    // tool-help returns { tools: [...], totalCount: N, ... }
    expect(result.data, "typed result must have data").toBeDefined();
    expect(
      Array.isArray(result.data.tools),
      "tool-help must return tools array",
    ).toBe(true);
    expect(
      typeof result.data.totalCount,
      "tool-help must return totalCount",
    ).toBe("number");
  });

  // ── ET-LOCAL-TYPED-DETACH ─────────────────────────────────────────────────
  // runInProcessTyped with DETACH: routes through execute() which returns { taskId }.

  it("ET-LOCAL-TYPED-DETACH: runInProcessTyped with DETACH callbackMode returns taskId", async () => {
    setFetchCacheContext("et-local-typed-detach");

    const result = await RouteExecuteRepository.runInProcessTyped({
      definition: helpEndpoints.GET,
      input: { query: "execute-tool", page: 1, pageSize: 5 },
      callbackMode: CallbackMode.DETACH,
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      platform: Platform.AI,
    });

    expect(
      result.success,
      `runInProcessTyped DETACH failed: ${JSON.stringify(result)}`,
    ).toBe(true);
    if (!result.success) {
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
      throw new Error(result.message);
    }

    // When routed through execute(), DETACH wraps in {taskId, hint}
    const data = result.data as unknown as Record<string, unknown>;
    expect(
      data.taskId,
      "DETACH via runInProcessTyped must return taskId",
    ).toBeTruthy();
    expect(
      data.hint,
      "DETACH via runInProcessTyped must return hint",
    ).toBeTruthy();

    // Clean up DB row
    if (data.taskId) {
      await db
        .delete(cronTasks)
        .where(eq(cronTasks.id, data.taskId as string))
        .catch(() => undefined);
    }
  });

  // ════════════════════════════════════════════════════════════════════════════
  // PENDING-CALL REGISTRY LIFECYCLE
  // ════════════════════════════════════════════════════════════════════════════

  it("ET-PENDING-CALL-LIFECYCLE: register → getPendingCall → discard", () => {
    const callId = `test-pending-${Date.now()}`;
    let deadlineFired = false;

    registerPendingCall({
      callId,
      instanceId: "atlas",
      toolName: "test-tool",
      threadId: "thread-test-1",
      toolMessageId: "msg-test-1",
      deadlineMs: 30_000,
      onDeadline: async () => {
        deadlineFired = true;
      },
    });

    const entry = getPendingCall(callId);
    expect(
      entry,
      "getPendingCall must find the registered entry",
    ).not.toBeNull();
    expect(entry!.callId, "callId must match").toBe(callId);
    expect(entry!.threadId, "threadId must match").toBe("thread-test-1");
    expect(entry!.toolMessageId, "toolMessageId must match").toBe("msg-test-1");
    expect(entry!.result, "result must be null (unresolved)").toBeNull();

    discardPendingCall(callId);

    expect(
      getPendingCall(callId),
      "entry must be gone after discard",
    ).toBeNull();
    expect(deadlineFired, "deadline must not have fired").toBe(false);
  });

  // ════════════════════════════════════════════════════════════════════════════
  // DISMISS-TASK
  // ════════════════════════════════════════════════════════════════════════════

  it("ET-DISMISS-TASK: dismisses a registered pending call, returns dismissed=true", async () => {
    const callId = `dismiss-test-${Date.now()}`;

    registerPendingCall({
      callId,
      instanceId: "atlas",
      toolName: "test-tool",
      threadId: null,
      toolMessageId: null,
      deadlineMs: 30_000,
      onDeadline: async () => undefined,
    });

    expect(
      getPendingCall(callId),
      "entry must exist before dismiss",
    ).not.toBeNull();

    const t = await getAiT();
    const result = await DismissTaskRepository.dismissTask(
      { callId },
      makeLogger(),
      testUser,
      t,
    );

    expect(
      result.success,
      `dismiss-task failed: ${JSON.stringify(result)}`,
    ).toBe(true);
    if (!result.success) {
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
      throw new Error(result.message);
    }
    expect(result.data.dismissed, "dismissed must be true").toBe(true);

    // Entry must be gone from registry
    expect(
      getPendingCall(callId),
      "entry must be removed from registry after dismiss",
    ).toBeNull();
  });

  it("ET-DISMISS-IDEMPOTENT: dismissing unknown callId returns success (idempotent)", async () => {
    const t = await getAiT();
    const result = await DismissTaskRepository.dismissTask(
      { callId: `nonexistent-${Date.now()}` },
      makeLogger(),
      testUser,
      t,
    );

    expect(
      result.success,
      `dismiss-task idempotent failed: ${JSON.stringify(result)}`,
    ).toBe(true);
    if (!result.success) {
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
      throw new Error(result.message);
    }
    expect(
      result.data.dismissed,
      "dismissed must be true for unknown callId",
    ).toBe(true);
  });

  // ════════════════════════════════════════════════════════════════════════════
  // COMPLETE-PENDING-CALL — outcome variants
  // ════════════════════════════════════════════════════════════════════════════

  it("ET-COMPLETE-UNKNOWN: completePendingCall returns kind=unknown for unregistered callId", () => {
    const outcome = completePendingCall(`never-registered-${Date.now()}`, {
      status: "completed",
      output: null,
    });
    expect(outcome.kind, "must be unknown for unregistered call").toBe(
      "unknown",
    );
  });

  it("ET-COMPLETE-SUCCESS: completePendingCall completes a pending entry, returns revival+ids", () => {
    const callId = `complete-success-${Date.now()}`;
    registerPendingCall({
      callId,
      instanceId: "atlas",
      toolName: "test-tool",
      threadId: "thread-A",
      toolMessageId: "msg-A",
      deadlineMs: 30_000,
      onDeadline: async () => undefined,
    });

    const outcome = completePendingCall(callId, {
      status: "completed",
      output: { answer: "42" },
    });

    expect(outcome.kind, "must be completed").toBe("completed");
    if (outcome.kind !== "completed") {
      throw new Error("unreachable — narrowing for TS");
    }
    expect(outcome.threadId, "threadId must carry through").toBe("thread-A");
    expect(outcome.toolMessageId, "toolMessageId must carry through").toBe(
      "msg-A",
    );
    expect(outcome.revival, "revival must be null (none set)").toBeNull();

    // Entry must still be queryable (tombstone TTL not elapsed)
    const entry = getPendingCall(callId);
    expect(entry, "tombstoned entry must still be queryable").not.toBeNull();
    expect(entry!.result?.status, "result status must be completed").toBe(
      "completed",
    );
    expect(entry!.result?.output, "result output must match").toEqual({
      answer: "42",
    });

    discardPendingCall(callId);
  });

  it("ET-COMPLETE-DUPLICATE: second completePendingCall on same callId returns kind=duplicate", () => {
    const callId = `complete-duplicate-${Date.now()}`;
    registerPendingCall({
      callId,
      instanceId: "atlas",
      toolName: "test-tool",
      threadId: null,
      toolMessageId: null,
      deadlineMs: 30_000,
      onDeadline: async () => undefined,
    });

    const first = completePendingCall(callId, {
      status: "completed",
      output: null,
    });
    expect(first.kind, "first completion must succeed").toBe("completed");

    const second = completePendingCall(callId, {
      status: "failed",
      output: null,
    });
    expect(second.kind, "second completion must be duplicate").toBe(
      "duplicate",
    );

    // Result must still be from the first completion
    const entry = getPendingCall(callId);
    expect(entry!.result?.status, "result must reflect first completion").toBe(
      "completed",
    );

    discardPendingCall(callId);
  });

  // ════════════════════════════════════════════════════════════════════════════
  // SET-REVIVAL — attach revival target before completion
  // ════════════════════════════════════════════════════════════════════════════

  it("ET-SET-REVIVAL: setPendingCallRevival attaches revival; completePendingCall returns it", () => {
    const callId = `revival-test-${Date.now()}`;
    registerPendingCall({
      callId,
      instanceId: "atlas",
      toolName: "test-tool",
      threadId: null,
      toolMessageId: null,
      deadlineMs: 30_000,
      onDeadline: async () => undefined,
    });

    const revival = {
      threadId: "thread-revival",
      toolMessageId: "msg-revival",
      callbackMode: "wakeUp",
      leafMessageId: "leaf-1",
      modelId: "gpt-4",
      skillId: null,
      favoriteId: null,
      subAgentDepth: 1,
      userId: "user-xyz",
    };

    const attached = setPendingCallRevival(callId, revival);
    expect(attached, "setPendingCallRevival must return true").toBe(true);

    const outcome = completePendingCall(callId, {
      status: "completed",
      output: null,
    });
    expect(outcome.kind, "must be completed").toBe("completed");
    if (outcome.kind !== "completed") {
      throw new Error("unreachable");
    }
    expect(
      outcome.revival,
      "revival must be present on outcome",
    ).not.toBeNull();
    expect(outcome.revival?.threadId, "revival threadId must match").toBe(
      "thread-revival",
    );
    expect(
      outcome.revival?.toolMessageId,
      "revival toolMessageId must match",
    ).toBe("msg-revival");

    discardPendingCall(callId);
  });

  it("ET-SET-REVIVAL-UNKNOWN: setPendingCallRevival returns false for unknown callId", () => {
    const attached = setPendingCallRevival(`never-registered-${Date.now()}`, {
      threadId: "t",
      toolMessageId: "m",
      callbackMode: "wakeUp",
      leafMessageId: null,
      modelId: null,
      skillId: null,
      favoriteId: null,
      subAgentDepth: 0,
      userId: "u",
    });
    expect(attached, "must return false for unknown call").toBe(false);
  });

  it("ET-SET-REVIVAL-ALREADY-DONE: setPendingCallRevival returns false after completion", () => {
    const callId = `revival-late-${Date.now()}`;
    registerPendingCall({
      callId,
      instanceId: "atlas",
      toolName: "test-tool",
      threadId: null,
      toolMessageId: null,
      deadlineMs: 30_000,
      onDeadline: async () => undefined,
    });
    completePendingCall(callId, { status: "completed", output: null });

    const attached = setPendingCallRevival(callId, {
      threadId: "t",
      toolMessageId: "m",
      callbackMode: "wakeUp",
      leafMessageId: null,
      modelId: null,
      skillId: null,
      favoriteId: null,
      subAgentDepth: 0,
      userId: "u",
    });
    expect(attached, "must return false on already-completed call").toBe(false);

    discardPendingCall(callId);
  });

  // ════════════════════════════════════════════════════════════════════════════
  // AWAIT-PENDING-CALL-RESULT — blocking waiter
  // ════════════════════════════════════════════════════════════════════════════

  it("ET-AWAIT-ALREADY-DONE: awaitPendingCallResult resolves immediately if already completed", async () => {
    const callId = `await-done-${Date.now()}`;
    registerPendingCall({
      callId,
      instanceId: "atlas",
      toolName: "test-tool",
      threadId: null,
      toolMessageId: null,
      deadlineMs: 30_000,
      onDeadline: async () => undefined,
    });
    completePendingCall(callId, { status: "completed", output: { x: "1" } });

    const result = await awaitPendingCallResult(callId, 5_000);
    expect(result, "must resolve immediately with result").not.toBeNull();
    expect(result!.status, "status must be completed").toBe("completed");
    expect(result!.output, "output must match").toEqual({ x: "1" });

    discardPendingCall(callId);
  });

  it("ET-AWAIT-UNKNOWN: awaitPendingCallResult returns null for unknown callId", async () => {
    const result = await awaitPendingCallResult(
      `never-registered-${Date.now()}`,
      100,
    );
    expect(result, "must return null for unknown call").toBeNull();
  });

  it("ET-AWAIT-TIMEOUT: awaitPendingCallResult returns null on timeout if call never completes", async () => {
    const callId = `await-timeout-${Date.now()}`;
    registerPendingCall({
      callId,
      instanceId: "atlas",
      toolName: "test-tool",
      threadId: null,
      toolMessageId: null,
      deadlineMs: 30_000,
      onDeadline: async () => undefined,
    });

    const result = await awaitPendingCallResult(callId, 50);
    expect(result, "must timeout and return null").toBeNull();

    discardPendingCall(callId);
  });

  it("ET-AWAIT-WAKEUP: awaitPendingCallResult resolves when completePendingCall fires", async () => {
    const callId = `await-wakeup-${Date.now()}`;
    registerPendingCall({
      callId,
      instanceId: "atlas",
      toolName: "test-tool",
      threadId: null,
      toolMessageId: null,
      deadlineMs: 30_000,
      onDeadline: async () => undefined,
    });

    // Start waiter BEFORE completion
    const waitPromise = awaitPendingCallResult(callId, 5_000);

    // Complete after a short delay
    setTimeout((): void => {
      completePendingCall(callId, { status: "failed", output: null });
    }, 20);

    const result = await waitPromise;
    expect(result, "waiter must wake up when call completes").not.toBeNull();
    expect(result!.status, "status must be failed").toBe("failed");

    discardPendingCall(callId);
  });

  it("ET-AWAIT-MULTI-WAITER: multiple awaiters all resolve when call completes", async () => {
    const callId = `await-multi-${Date.now()}`;
    registerPendingCall({
      callId,
      instanceId: "atlas",
      toolName: "test-tool",
      threadId: null,
      toolMessageId: null,
      deadlineMs: 30_000,
      onDeadline: async () => undefined,
    });

    const wait1 = awaitPendingCallResult(callId, 5_000);
    const wait2 = awaitPendingCallResult(callId, 5_000);
    const wait3 = awaitPendingCallResult(callId, 5_000);

    setTimeout((): void => {
      completePendingCall(callId, {
        status: "completed",
        output: { multi: "yes" },
      });
    }, 20);

    const [r1, r2, r3] = await Promise.all([wait1, wait2, wait3]);
    expect(r1, "waiter 1 must resolve").not.toBeNull();
    expect(r2, "waiter 2 must resolve").not.toBeNull();
    expect(r3, "waiter 3 must resolve").not.toBeNull();
    expect(r1!.output, "all waiters see same output").toEqual({ multi: "yes" });
    expect(r2!.output, "waiter 2 output").toEqual({ multi: "yes" });
    expect(r3!.output, "waiter 3 output").toEqual({ multi: "yes" });

    discardPendingCall(callId);
  });

  // ════════════════════════════════════════════════════════════════════════════
  // REMOTE TESTS (require live Hermes dev instance)
  // ════════════════════════════════════════════════════════════════════════════

  if (_resolvedRemoteUrl) {
    describe(`Remote dispatch → ${_resolvedRemoteUrl}`, () => {
      let _remoteConnectError: string | null = null;

      beforeAll(async () => {
        const { connectToHermes, disconnectFromHermes } =
          await import("@/app/api/[locale]/agent/ai-stream/testing/remote-setup");
        try {
          await disconnectFromHermes(testUser.id);
          await connectToHermes(testUser, _resolvedRemoteUrl);
        } catch (err) {
          _remoteConnectError = String(err);
        }
      }, 120_000);

      afterAll(async () => {
        const { disconnectFromHermes } =
          await import("@/app/api/[locale]/agent/ai-stream/testing/remote-setup");
        await disconnectFromHermes(testUser.id);
      }, 60_000);

      it("prerequisites: hermes connected", () => {
        if (_remoteConnectError) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(
            `Remote connection failed — run: vibe rebuild\n${_remoteConnectError}`,
          );
        }
      });

      function requireRemote(): void {
        if (_remoteConnectError) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(
            `Skipped — fix prerequisites test first: ${_remoteConnectError}`,
          );
        }
      }

      // ── ET-REMOTE-WAIT ─────────────────────────────────────────────────────
      // Remote WAIT: direct HTTP call, result returned inline with { result: ... }.

      it("ET-REMOTE-WAIT: remote WAIT returns result inline with result field", async () => {
        requireRemote();
        setFetchCacheContext("et-remote-wait");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: "tool-help",
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.WAIT,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-REMOTE-WAIT failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(data, "Remote WAIT must have result field").toHaveProperty(
          "result",
        );
        expect(
          data.taskId,
          "Remote WAIT must not return taskId",
        ).toBeUndefined();
      });

      // ── ET-REMOTE-END-LOOP ─────────────────────────────────────────────────
      // Remote END_LOOP: same as WAIT for remote — result inline.

      it("ET-REMOTE-END-LOOP: remote END_LOOP returns result inline, no taskId", async () => {
        requireRemote();
        setFetchCacheContext("et-remote-end-loop");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: "tool-help",
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.END_LOOP,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-REMOTE-END-LOOP failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(data, "Remote END_LOOP must have result field").toHaveProperty(
          "result",
        );
        expect(
          data.taskId,
          "Remote END_LOOP must not return taskId",
        ).toBeUndefined();
      });

      // ── ET-REMOTE-DETACH ───────────────────────────────────────────────────
      // Remote DETACH: fire-and-forget, returns { taskId, hint } immediately.

      it("ET-REMOTE-DETACH: remote DETACH returns taskId immediately, hint includes await-task", async () => {
        requireRemote();
        setFetchCacheContext("et-remote-detach");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: "tool-help",
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.DETACH,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-REMOTE-DETACH failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(data.taskId, "Remote DETACH must return taskId").toBeTruthy();
        expect(typeof data.taskId, "taskId must be a string").toBe("string");
        expect(data.hint, "Remote DETACH must return a hint").toBeTruthy();
        expect(
          data.result,
          "Remote DETACH must not return inline result",
        ).toBeUndefined();
      });

      // ── ET-REMOTE-WAKE-UP ──────────────────────────────────────────────────
      // Remote WAKE_UP: fire-and-forget, returns { taskId, hint }.

      it("ET-REMOTE-WAKE-UP: remote WAKE_UP returns taskId, hint mentions injection", async () => {
        requireRemote();
        setFetchCacheContext("et-remote-wakeup");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: "tool-help",
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.WAKE_UP,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-REMOTE-WAKE-UP failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(data.taskId, "Remote WAKE_UP must return taskId").toBeTruthy();
        expect(typeof data.taskId, "taskId must be a string").toBe("string");
        expect(data.hint, "Remote WAKE_UP must return a hint").toBeTruthy();
        expect(
          data.result,
          "Remote WAKE_UP must not return inline result",
        ).toBeUndefined();
      });

      // ── ET-REMOTE-PREFIXED ─────────────────────────────────────────────────
      // Prefixed toolName "hermes__tool-help" routes to hermes without explicit instanceId.

      it("ET-REMOTE-PREFIXED: hermes__tool-help prefix routes to hermes, WAIT returns result", async () => {
        requireRemote();
        setFetchCacheContext("et-remote-prefixed");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: `${HERMES_INSTANCE_ID}__tool-help`,
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          callbackMode: CallbackMode.WAIT,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-REMOTE-PREFIXED failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(
          data,
          "Prefixed remote WAIT must have result field",
        ).toHaveProperty("result");
      });

      // ── ET-REMOTE-APPROVE ──────────────────────────────────────────────────
      // Remote APPROVE via instanceId: returns placeholder immediately, no dispatch.

      it("ET-REMOTE-APPROVE: remote APPROVE returns waiting_for_confirmation placeholder, no taskId", async () => {
        requireRemote();
        setFetchCacheContext("et-remote-approve");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: "tool-help",
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.APPROVE,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-REMOTE-APPROVE failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(data, "Remote APPROVE must have result field").toHaveProperty(
          "result",
        );
        const inner = data.result as Record<string, unknown> | undefined;
        expect(inner, "Remote APPROVE result must be an object").toBeTruthy();
        expect(
          inner?.status,
          "Remote APPROVE result.status must be waiting_for_confirmation",
        ).toBe("waiting_for_confirmation");
        expect(
          inner?.toolName,
          "Remote APPROVE result.toolName must be set",
        ).toBeTruthy();
        expect(
          data.taskId,
          "Remote APPROVE must not return taskId",
        ).toBeUndefined();
      });

      // ── ET-REMOTE-APPROVE-PREFIXED ─────────────────────────────────────────
      // APPROVE via prefixed toolName: same placeholder behavior, no dispatch.

      it("ET-REMOTE-APPROVE-PREFIXED: prefixed APPROVE returns waiting_for_confirmation, no taskId", async () => {
        requireRemote();
        setFetchCacheContext("et-remote-approve-prefixed");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: `${HERMES_INSTANCE_ID}__tool-help`,
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          callbackMode: CallbackMode.APPROVE,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-REMOTE-APPROVE-PREFIXED failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(
          data,
          "Prefixed remote APPROVE must have result field",
        ).toHaveProperty("result");
        const inner = data.result as Record<string, unknown> | undefined;
        expect(
          inner,
          "Prefixed remote APPROVE result must be an object",
        ).toBeTruthy();
        expect(
          inner?.status,
          "Prefixed remote APPROVE result.status must be waiting_for_confirmation",
        ).toBe("waiting_for_confirmation");
        expect(
          inner?.toolName,
          "Prefixed remote APPROVE result.toolName must be set",
        ).toBeTruthy();
        expect(
          data.taskId,
          "Prefixed remote APPROVE must not return taskId",
        ).toBeUndefined();
      });

      // ── ET-REMOTE-END-LOOP-PREFIXED ───────────────────────────────────────
      // Same as WAIT-prefixed but END_LOOP callbackMode.

      it("ET-REMOTE-END-LOOP-PREFIXED: prefixed END_LOOP routes to hermes, returns result inline", async () => {
        requireRemote();
        setFetchCacheContext("et-remote-end-loop-prefixed");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: `${HERMES_INSTANCE_ID}__tool-help`,
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          callbackMode: CallbackMode.END_LOOP,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-REMOTE-END-LOOP-PREFIXED failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(
          data,
          "Prefixed remote END_LOOP must have result field",
        ).toHaveProperty("result");
        expect(
          data.taskId,
          "Prefixed remote END_LOOP must not return taskId",
        ).toBeUndefined();
      });

      // ── ET-REMOTE-DETACH-PREFIXED ─────────────────────────────────────────
      // DETACH via prefixed toolName: same { taskId, hint } shape as explicit instanceId.

      it("ET-REMOTE-DETACH-PREFIXED: prefixed DETACH returns taskId immediately, no inline result", async () => {
        requireRemote();
        setFetchCacheContext("et-remote-detach-prefixed");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: `${HERMES_INSTANCE_ID}__tool-help`,
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          callbackMode: CallbackMode.DETACH,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-REMOTE-DETACH-PREFIXED failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(
          data.taskId,
          "Prefixed remote DETACH must return taskId",
        ).toBeTruthy();
        expect(typeof data.taskId, "taskId must be a string").toBe("string");
        expect(
          data.hint,
          "Prefixed remote DETACH must return hint",
        ).toBeTruthy();
        expect(
          data.result,
          "Prefixed remote DETACH must not return inline result",
        ).toBeUndefined();
      });

      // ── ET-REMOTE-WAKE-UP-PREFIXED ────────────────────────────────────────
      // WAKE_UP via prefixed toolName: same { taskId, hint } shape.

      it("ET-REMOTE-WAKE-UP-PREFIXED: prefixed WAKE_UP returns taskId, no inline result", async () => {
        requireRemote();
        setFetchCacheContext("et-remote-wakeup-prefixed");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: `${HERMES_INSTANCE_ID}__tool-help`,
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          callbackMode: CallbackMode.WAKE_UP,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-REMOTE-WAKE-UP-PREFIXED failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(
          data.taskId,
          "Prefixed remote WAKE_UP must return taskId",
        ).toBeTruthy();
        expect(typeof data.taskId, "taskId must be a string").toBe("string");
        expect(
          data.hint,
          "Prefixed remote WAKE_UP must return hint",
        ).toBeTruthy();
        expect(
          data.result,
          "Prefixed remote WAKE_UP must not return inline result",
        ).toBeUndefined();
      });

      // ── ET-REMOTE-DETACH-THEN-AWAIT-TASK ─────────────────────────────────
      // Remote DETACH via explicit instanceId → await-task retrieves result.

      it("ET-REMOTE-DETACH-THEN-AWAIT-TASK: await-task returns completed result after remote DETACH", async () => {
        requireRemote();
        setFetchCacheContext("et-remote-detach-wait");

        const detachResult = await RouteExecuteRepository.runInProcess({
          toolName: "tool-help",
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.DETACH,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          detachResult.success,
          `Remote DETACH failed: ${JSON.stringify(detachResult)}`,
        ).toBe(true);
        if (!detachResult.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(detachResult.message);
        }

        const { taskId } = detachResult.data as {
          taskId: string;
          hint: string;
        };
        expect(taskId, "Remote DETACH must return taskId").toBeTruthy();

        // For remote DETACH, taskId is a pending-call ID (not a DB cron row).
        // Use awaitPendingCallResult to properly wait for the remote callback.
        const pendingResult = await awaitPendingCallResult(taskId, 15_000);
        expect(
          pendingResult,
          "Remote DETACH pending call must complete before await-task",
        ).not.toBeNull();
        expect(
          pendingResult?.status,
          "Remote DETACH pending call must complete with success",
        ).toBe("completed");

        const { AwaitTaskRepository } =
          await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/repository");
        const { scopedTranslation: tasksScopedT } =
          await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/i18n");
        const t = tasksScopedT.scopedT(defaultLocale).t;

        const waitResult = await AwaitTaskRepository.awaitTask(
          { taskId },
          testUser,
          makeLogger(),
          t,
          makeHeadlessContext(),
        );

        expect(
          waitResult.success,
          `await-task failed: ${JSON.stringify(waitResult)}`,
        ).toBe(true);
        if (!waitResult.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(waitResult.message);
        }
        expect(
          waitResult.data.waiting,
          "await-task on completed remote task must NOT be waiting",
        ).toBe(false);
        expect(
          waitResult.data.status,
          "await-task status must be completed",
        ).toBe(CronTaskStatus.COMPLETED);
      }, 30_000);

      // ── ET-REMOTE-DETACH-PREFIXED-THEN-AWAIT-TASK ────────────────────────
      // Remote DETACH via prefixed toolName → await-task retrieves result.
      // Separate code path: prefix splitting happens before instanceId resolution.

      it("ET-REMOTE-DETACH-PREFIXED-THEN-AWAIT-TASK: prefixed DETACH → await-task returns completed result", async () => {
        requireRemote();
        setFetchCacheContext("et-remote-detach-prefixed-wait");

        const detachResult = await RouteExecuteRepository.runInProcess({
          toolName: `${HERMES_INSTANCE_ID}__tool-help`,
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          callbackMode: CallbackMode.DETACH,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          detachResult.success,
          `Prefixed remote DETACH failed: ${JSON.stringify(detachResult)}`,
        ).toBe(true);
        if (!detachResult.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(detachResult.message);
        }

        const { taskId } = detachResult.data as {
          taskId: string;
          hint: string;
        };
        expect(
          taskId,
          "Prefixed remote DETACH must return taskId",
        ).toBeTruthy();

        const pendingResult = await awaitPendingCallResult(taskId, 15_000);
        expect(
          pendingResult,
          "Prefixed remote DETACH pending call must complete before await-task",
        ).not.toBeNull();
        expect(
          pendingResult?.status,
          "Prefixed remote DETACH pending call must complete with success",
        ).toBe("completed");

        const { AwaitTaskRepository } =
          await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/repository");
        const { scopedTranslation: tasksScopedT } =
          await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/i18n");
        const t = tasksScopedT.scopedT(defaultLocale).t;

        const waitResult = await AwaitTaskRepository.awaitTask(
          { taskId },
          testUser,
          makeLogger(),
          t,
          makeHeadlessContext(),
        );

        expect(
          waitResult.success,
          `await-task failed: ${JSON.stringify(waitResult)}`,
        ).toBe(true);
        if (!waitResult.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(waitResult.message);
        }
        expect(
          waitResult.data.waiting,
          "await-task on completed prefixed remote task must NOT be waiting",
        ).toBe(false);
        expect(
          waitResult.data.status,
          "await-task status must be completed",
        ).toBe(CronTaskStatus.COMPLETED);
      }, 30_000);

      // ── ET-REMOTE-WAKE-UP-THEN-AWAIT-TASK ────────────────────────────────
      // Remote WAKE_UP via explicit instanceId → await-task retrieves result.

      it("ET-REMOTE-WAKE-UP-THEN-AWAIT-TASK: await-task returns completed result after remote WAKE_UP", async () => {
        requireRemote();
        setFetchCacheContext("et-remote-wakeup-await");

        const wakeUpResult = await RouteExecuteRepository.runInProcess({
          toolName: "tool-help",
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.WAKE_UP,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          wakeUpResult.success,
          `Remote WAKE_UP failed: ${JSON.stringify(wakeUpResult)}`,
        ).toBe(true);
        if (!wakeUpResult.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(wakeUpResult.message);
        }

        const { taskId } = wakeUpResult.data as {
          taskId: string;
          hint: string;
        };
        expect(taskId, "Remote WAKE_UP must return taskId").toBeTruthy();

        const pendingResult = await awaitPendingCallResult(taskId, 15_000);
        expect(
          pendingResult,
          "Remote WAKE_UP pending call must complete before await-task",
        ).not.toBeNull();
        expect(
          pendingResult?.status,
          "Remote WAKE_UP pending call must complete with success",
        ).toBe("completed");

        const { AwaitTaskRepository } =
          await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/repository");
        const { scopedTranslation: tasksScopedT } =
          await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/i18n");
        const t = tasksScopedT.scopedT(defaultLocale).t;

        const waitResult = await AwaitTaskRepository.awaitTask(
          { taskId },
          testUser,
          makeLogger(),
          t,
          makeHeadlessContext(),
        );

        expect(
          waitResult.success,
          `await-task failed: ${JSON.stringify(waitResult)}`,
        ).toBe(true);
        if (!waitResult.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(waitResult.message);
        }
        expect(
          waitResult.data.waiting,
          "await-task on completed remote WAKE_UP task must NOT be waiting",
        ).toBe(false);
        expect(
          waitResult.data.status,
          "await-task status must be completed",
        ).toBe(CronTaskStatus.COMPLETED);
      }, 30_000);

      // ── ET-REMOTE-CLI ──────────────────────────────────────────────────────
      // CLI surface also routes remote tools correctly.

      it("ET-REMOTE-CLI: CLI platform remote WAIT returns result inline", async () => {
        requireRemote();
        setFetchCacheContext("et-remote-cli");

        const result = await RouteExecuteRepository.runInProcessTyped({
          definition: helpEndpoints.GET,
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.WAIT,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          platform: Platform.CLI,
        });

        expect(
          result.success,
          `ET-REMOTE-CLI failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        // runInProcessTyped unwraps the { result: ... } wrapper — returns raw endpoint data.
        // For help endpoint: { tools: [...], totalCount: N, ... }
        const data = result.data as Record<string, unknown>;
        expect(
          data,
          "Remote CLI WAIT must have tools field (raw endpoint data)",
        ).toHaveProperty("tools");
        expect(Array.isArray(data.tools), "tools must be an array").toBe(true);
      });

      // ── ET-REMOTE-CLI-PREFIXED ────────────────────────────────────────────
      // CLI surface with prefixed toolName (hermes__tool-help): same routing path as AI,
      // prefix splits before instanceId resolution, result wrapped in { result: ... }.

      it("ET-REMOTE-CLI-PREFIXED: CLI platform prefixed WAIT returns result field", async () => {
        requireRemote();
        setFetchCacheContext("et-remote-cli-prefixed");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: `${HERMES_INSTANCE_ID}__tool-help`,
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          callbackMode: CallbackMode.WAIT,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.CLI,
        });

        expect(
          result.success,
          `ET-REMOTE-CLI-PREFIXED failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(
          data,
          "Prefixed remote CLI WAIT must have result field",
        ).toHaveProperty("result");
        expect(
          data.taskId,
          "Prefixed remote CLI WAIT must not return taskId",
        ).toBeUndefined();
      });
    });
  } else {
    it("ET-REMOTE-*: Hermes not running — remote tests skipped (run: vibe --hermes dev)", () => {
      // Explicit skip marker so the suite still shows something.
      expect(true).toBe(true);
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // REMOTE TESTS — REVERSE-WS TRANSPORT
  // Same as direct-http block above but using connectToHermesLocalAi():
  //   atlas sends tool-execute-request over reverse-WS hub channel,
  //   hermes executes, publishes tool-execute-result back on hub,
  //   connector receives via onRemoteEvent["tool-execute-result"] → completePendingCall.
  // ════════════════════════════════════════════════════════════════════════════

  if (_resolvedRemoteUrl) {
    describe(`Remote dispatch reverse-WS → ${_resolvedRemoteUrl}`, () => {
      let _remoteConnectError: string | null = null;

      beforeAll(async () => {
        const { connectToHermesLocalAi, disconnectFromHermes } =
          await import("@/app/api/[locale]/agent/ai-stream/testing/remote-setup");
        try {
          await disconnectFromHermes(testUser.id);
          await connectToHermesLocalAi(testUser, _resolvedRemoteUrl);
        } catch (err) {
          _remoteConnectError = String(err);
        }
      }, 120_000);

      afterAll(async () => {
        const { disconnectFromHermesLocalAi, closeProdDb } =
          await import("@/app/api/[locale]/agent/ai-stream/testing/remote-setup");
        await disconnectFromHermesLocalAi(testUser, _resolvedRemoteUrl);
        await closeProdDb();
      }, 60_000);

      it("prerequisites: hermes connected via reverse-WS", () => {
        if (_remoteConnectError) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(
            `Reverse-WS connection failed — run: vibe --hermes dev\n${_remoteConnectError}`,
          );
        }
      });

      function requireReverseWs(): void {
        if (_remoteConnectError) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(
            `Skipped — fix prerequisites test first: ${_remoteConnectError}`,
          );
        }
      }

      // ── ET-RWS-WAIT ───────────────────────────────────────────────────────
      // WAIT via reverse-WS: hub dispatches tool-execute-request; hermes executes
      // and publishes tool-execute-result back on hub; pending call completes inline.

      it("ET-RWS-WAIT: reverse-WS WAIT returns result inline, no taskId", async () => {
        requireReverseWs();
        setFetchCacheContext("et-rws-wait");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: "tool-help",
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.WAIT,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-RWS-WAIT failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(data, "Reverse-WS WAIT must have result field").toHaveProperty(
          "result",
        );
        expect(
          data.taskId,
          "Reverse-WS WAIT must not return taskId",
        ).toBeUndefined();
      }, 60_000);

      // ── ET-RWS-END-LOOP ───────────────────────────────────────────────────

      it("ET-RWS-END-LOOP: reverse-WS END_LOOP returns result inline, no taskId", async () => {
        requireReverseWs();
        setFetchCacheContext("et-rws-end-loop");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: "tool-help",
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.END_LOOP,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-RWS-END-LOOP failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(
          data,
          "Reverse-WS END_LOOP must have result field",
        ).toHaveProperty("result");
        expect(
          data.taskId,
          "Reverse-WS END_LOOP must not return taskId",
        ).toBeUndefined();
      }, 60_000);

      // ── ET-RWS-DETACH ─────────────────────────────────────────────────────

      it("ET-RWS-DETACH: reverse-WS DETACH returns taskId immediately, hint includes await-task", async () => {
        requireReverseWs();
        setFetchCacheContext("et-rws-detach");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: "tool-help",
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.DETACH,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-RWS-DETACH failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(
          data.taskId,
          "Reverse-WS DETACH must return taskId",
        ).toBeTruthy();
        expect(typeof data.taskId, "taskId must be a string").toBe("string");
        expect(data.hint, "Reverse-WS DETACH must return hint").toBeTruthy();
        expect(
          data.result,
          "Reverse-WS DETACH must not return inline result",
        ).toBeUndefined();
      }, 60_000);

      // ── ET-RWS-WAKE-UP ────────────────────────────────────────────────────

      it("ET-RWS-WAKE-UP: reverse-WS WAKE_UP returns taskId, hint mentions injection", async () => {
        requireReverseWs();
        setFetchCacheContext("et-rws-wakeup");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: "tool-help",
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.WAKE_UP,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-RWS-WAKE-UP failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(
          data.taskId,
          "Reverse-WS WAKE_UP must return taskId",
        ).toBeTruthy();
        expect(typeof data.taskId, "taskId must be a string").toBe("string");
        expect(data.hint, "Reverse-WS WAKE_UP must return hint").toBeTruthy();
        expect(
          data.result,
          "Reverse-WS WAKE_UP must not return inline result",
        ).toBeUndefined();
      }, 60_000);

      // ── ET-RWS-APPROVE ────────────────────────────────────────────────────
      // APPROVE via reverse-WS: returns waiting_for_confirmation placeholder,
      // no taskId (stream aborts at finish-step; real result arrives after confirmation).

      it("ET-RWS-APPROVE: reverse-WS APPROVE returns waiting_for_confirmation placeholder, no taskId", async () => {
        requireReverseWs();
        setFetchCacheContext("et-rws-approve");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: "tool-help",
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.APPROVE,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-RWS-APPROVE failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        const inner = data.result as Record<string, unknown> | undefined;
        expect(inner, "Reverse-WS APPROVE must have result field").toBeTruthy();
        expect(
          inner?.status,
          "Reverse-WS APPROVE result.status must be waiting_for_confirmation",
        ).toBe("waiting_for_confirmation");
        expect(
          inner?.toolName,
          "Reverse-WS APPROVE result.toolName must be set",
        ).toBeTruthy();
        expect(
          data.taskId,
          "Reverse-WS APPROVE must not return taskId",
        ).toBeUndefined();
      }, 60_000);

      // ── ET-RWS-APPROVE-PREFIXED ───────────────────────────────────────────
      // APPROVE via prefixed toolName over reverse-WS: placeholder returned, no dispatch.

      it("ET-RWS-APPROVE-PREFIXED: prefixed APPROVE via reverse-WS returns waiting_for_confirmation, no taskId", async () => {
        requireReverseWs();
        setFetchCacheContext("et-rws-approve-prefixed");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: `${HERMES_INSTANCE_ID}__tool-help`,
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          callbackMode: CallbackMode.APPROVE,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-RWS-APPROVE-PREFIXED failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(
          data,
          "Prefixed reverse-WS APPROVE must have result field",
        ).toHaveProperty("result");
        const inner = data.result as Record<string, unknown> | undefined;
        expect(
          inner,
          "Prefixed reverse-WS APPROVE result must be an object",
        ).toBeTruthy();
        expect(
          inner?.status,
          "Prefixed reverse-WS APPROVE result.status must be waiting_for_confirmation",
        ).toBe("waiting_for_confirmation");
        expect(
          inner?.toolName,
          "Prefixed reverse-WS APPROVE result.toolName must be set",
        ).toBeTruthy();
        expect(
          data.taskId,
          "Prefixed reverse-WS APPROVE must not return taskId",
        ).toBeUndefined();
      }, 60_000);

      // ── ET-RWS-PREFIXED ───────────────────────────────────────────────────
      // Prefixed toolName "hermes__tool-help" routes to hermes via reverse-WS without explicit instanceId.

      it("ET-RWS-PREFIXED: hermes__tool-help prefix routes to hermes via reverse-WS, WAIT returns result", async () => {
        requireReverseWs();
        setFetchCacheContext("et-rws-prefixed");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: `${HERMES_INSTANCE_ID}__tool-help`,
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          callbackMode: CallbackMode.WAIT,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-RWS-PREFIXED failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(
          data,
          "Prefixed reverse-WS WAIT must have result field",
        ).toHaveProperty("result");
      }, 60_000);

      // ── ET-RWS-END-LOOP-PREFIXED ──────────────────────────────────────────
      // Prefixed END_LOOP via reverse-WS: result inline, no taskId.

      it("ET-RWS-END-LOOP-PREFIXED: prefixed END_LOOP via reverse-WS returns result inline, no taskId", async () => {
        requireReverseWs();
        setFetchCacheContext("et-rws-end-loop-prefixed");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: `${HERMES_INSTANCE_ID}__tool-help`,
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          callbackMode: CallbackMode.END_LOOP,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-RWS-END-LOOP-PREFIXED failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(
          data,
          "Prefixed reverse-WS END_LOOP must have result field",
        ).toHaveProperty("result");
        expect(
          data.taskId,
          "Prefixed reverse-WS END_LOOP must not return taskId",
        ).toBeUndefined();
      }, 60_000);

      // ── ET-RWS-DETACH-PREFIXED ────────────────────────────────────────────
      // Prefixed DETACH via reverse-WS: { taskId, hint }, no inline result.

      it("ET-RWS-DETACH-PREFIXED: prefixed DETACH via reverse-WS returns taskId, no inline result", async () => {
        requireReverseWs();
        setFetchCacheContext("et-rws-detach-prefixed");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: `${HERMES_INSTANCE_ID}__tool-help`,
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          callbackMode: CallbackMode.DETACH,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-RWS-DETACH-PREFIXED failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(
          data.taskId,
          "Prefixed reverse-WS DETACH must return taskId",
        ).toBeTruthy();
        expect(typeof data.taskId, "taskId must be a string").toBe("string");
        expect(
          data.hint,
          "Prefixed reverse-WS DETACH must return hint",
        ).toBeTruthy();
        expect(
          data.result,
          "Prefixed reverse-WS DETACH must not return inline result",
        ).toBeUndefined();
      }, 60_000);

      // ── ET-RWS-WAKE-UP-PREFIXED ───────────────────────────────────────────
      // Prefixed WAKE_UP via reverse-WS: { taskId, hint }, no inline result.

      it("ET-RWS-WAKE-UP-PREFIXED: prefixed WAKE_UP via reverse-WS returns taskId, no inline result", async () => {
        requireReverseWs();
        setFetchCacheContext("et-rws-wakeup-prefixed");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: `${HERMES_INSTANCE_ID}__tool-help`,
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          callbackMode: CallbackMode.WAKE_UP,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          result.success,
          `ET-RWS-WAKE-UP-PREFIXED failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(
          data.taskId,
          "Prefixed reverse-WS WAKE_UP must return taskId",
        ).toBeTruthy();
        expect(typeof data.taskId, "taskId must be a string").toBe("string");
        expect(
          data.hint,
          "Prefixed reverse-WS WAKE_UP must return hint",
        ).toBeTruthy();
        expect(
          data.result,
          "Prefixed reverse-WS WAKE_UP must not return inline result",
        ).toBeUndefined();
      }, 60_000);

      // ── ET-RWS-DETACH-THEN-AWAIT-TASK ────────────────────────────────────
      // Reverse-WS DETACH via explicit instanceId → await-task retrieves result.

      it("ET-RWS-DETACH-THEN-AWAIT-TASK: await-task returns completed result after reverse-WS DETACH", async () => {
        requireReverseWs();
        setFetchCacheContext("et-rws-detach-wait");

        const detachResult = await RouteExecuteRepository.runInProcess({
          toolName: "tool-help",
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.DETACH,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          detachResult.success,
          `Reverse-WS DETACH failed: ${JSON.stringify(detachResult)}`,
        ).toBe(true);
        if (!detachResult.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(detachResult.message);
        }

        const { taskId } = detachResult.data as {
          taskId: string;
          hint: string;
        };
        expect(taskId, "Reverse-WS DETACH must return taskId").toBeTruthy();

        const pendingResult = await awaitPendingCallResult(taskId, 15_000);
        expect(
          pendingResult,
          "Reverse-WS DETACH pending call must complete before await-task",
        ).not.toBeNull();
        expect(
          pendingResult?.status,
          "Reverse-WS DETACH pending call must complete with success",
        ).toBe("completed");

        const { AwaitTaskRepository } =
          await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/repository");
        const { scopedTranslation: tasksScopedT } =
          await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/i18n");
        const t = tasksScopedT.scopedT(defaultLocale).t;

        const waitResult = await AwaitTaskRepository.awaitTask(
          { taskId },
          testUser,
          makeLogger(),
          t,
          makeHeadlessContext(),
        );

        expect(
          waitResult.success,
          `await-task failed: ${JSON.stringify(waitResult)}`,
        ).toBe(true);
        if (!waitResult.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(waitResult.message);
        }
        expect(
          waitResult.data.waiting,
          "await-task on completed reverse-WS task must NOT be waiting",
        ).toBe(false);
        expect(
          waitResult.data.status,
          "await-task status must be completed",
        ).toBe(CronTaskStatus.COMPLETED);
      }, 60_000);

      // ── ET-RWS-DETACH-PREFIXED-THEN-AWAIT-TASK ───────────────────────────
      // Reverse-WS DETACH via prefixed toolName → await-task retrieves result.
      // Separate code path: prefix splitting happens before instanceId resolution.

      it("ET-RWS-DETACH-PREFIXED-THEN-AWAIT-TASK: prefixed DETACH via reverse-WS → await-task returns completed result", async () => {
        requireReverseWs();
        setFetchCacheContext("et-rws-detach-prefixed-wait");

        const detachResult = await RouteExecuteRepository.runInProcess({
          toolName: `${HERMES_INSTANCE_ID}__tool-help`,
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          callbackMode: CallbackMode.DETACH,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          detachResult.success,
          `Prefixed reverse-WS DETACH failed: ${JSON.stringify(detachResult)}`,
        ).toBe(true);
        if (!detachResult.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(detachResult.message);
        }

        const { taskId } = detachResult.data as {
          taskId: string;
          hint: string;
        };
        expect(
          taskId,
          "Prefixed reverse-WS DETACH must return taskId",
        ).toBeTruthy();

        const pendingResult = await awaitPendingCallResult(taskId, 15_000);
        expect(
          pendingResult,
          "Prefixed reverse-WS DETACH pending call must complete before await-task",
        ).not.toBeNull();
        expect(
          pendingResult?.status,
          "Prefixed reverse-WS DETACH pending call must complete with success",
        ).toBe("completed");

        const { AwaitTaskRepository } =
          await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/repository");
        const { scopedTranslation: tasksScopedT } =
          await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/i18n");
        const t = tasksScopedT.scopedT(defaultLocale).t;

        const waitResult = await AwaitTaskRepository.awaitTask(
          { taskId },
          testUser,
          makeLogger(),
          t,
          makeHeadlessContext(),
        );

        expect(
          waitResult.success,
          `await-task failed: ${JSON.stringify(waitResult)}`,
        ).toBe(true);
        if (!waitResult.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(waitResult.message);
        }
        expect(
          waitResult.data.waiting,
          "await-task on completed prefixed reverse-WS task must NOT be waiting",
        ).toBe(false);
        expect(
          waitResult.data.status,
          "await-task status must be completed",
        ).toBe(CronTaskStatus.COMPLETED);
      }, 60_000);

      // ── ET-RWS-WAKE-UP-THEN-AWAIT-TASK ───────────────────────────────────
      // Reverse-WS WAKE_UP via explicit instanceId → await-task retrieves result.

      it("ET-RWS-WAKE-UP-THEN-AWAIT-TASK: await-task returns completed result after reverse-WS WAKE_UP", async () => {
        requireReverseWs();
        setFetchCacheContext("et-rws-wakeup-await");

        const wakeUpResult = await RouteExecuteRepository.runInProcess({
          toolName: "tool-help",
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.WAKE_UP,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(
          wakeUpResult.success,
          `Reverse-WS WAKE_UP failed: ${JSON.stringify(wakeUpResult)}`,
        ).toBe(true);
        if (!wakeUpResult.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(wakeUpResult.message);
        }

        const { taskId } = wakeUpResult.data as {
          taskId: string;
          hint: string;
        };
        expect(taskId, "Reverse-WS WAKE_UP must return taskId").toBeTruthy();

        const pendingResult = await awaitPendingCallResult(taskId, 15_000);
        expect(
          pendingResult,
          "Reverse-WS WAKE_UP pending call must complete before await-task",
        ).not.toBeNull();
        expect(
          pendingResult?.status,
          "Reverse-WS WAKE_UP pending call must complete with success",
        ).toBe("completed");

        const { AwaitTaskRepository } =
          await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/repository");
        const { scopedTranslation: tasksScopedT } =
          await import("@/app/api/[locale]/system/unified-interface/execute-tool/await-task/i18n");
        const t = tasksScopedT.scopedT(defaultLocale).t;

        const waitResult = await AwaitTaskRepository.awaitTask(
          { taskId },
          testUser,
          makeLogger(),
          t,
          makeHeadlessContext(),
        );

        expect(
          waitResult.success,
          `await-task failed: ${JSON.stringify(waitResult)}`,
        ).toBe(true);
        if (!waitResult.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(waitResult.message);
        }
        expect(
          waitResult.data.waiting,
          "await-task on completed reverse-WS WAKE_UP task must NOT be waiting",
        ).toBe(false);
        expect(
          waitResult.data.status,
          "await-task status must be completed",
        ).toBe(CronTaskStatus.COMPLETED);
      }, 60_000);

      // ── ET-RWS-CLI ────────────────────────────────────────────────────────
      // CLI surface with explicit instanceId routes via reverse-WS, returns raw data.

      it("ET-RWS-CLI: CLI platform reverse-WS WAIT returns raw endpoint data", async () => {
        requireReverseWs();
        setFetchCacheContext("et-rws-cli");

        const result = await RouteExecuteRepository.runInProcessTyped({
          definition: helpEndpoints.GET,
          input: { query: "execute-tool", page: 1, pageSize: 5 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.WAIT,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          platform: Platform.CLI,
        });

        expect(
          result.success,
          `ET-RWS-CLI failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
          throw new Error(result.message);
        }

        const data = result.data as Record<string, unknown>;
        expect(
          data,
          "Reverse-WS CLI WAIT must have tools field (raw endpoint data)",
        ).toHaveProperty("tools");
        expect(Array.isArray(data.tools), "tools must be an array").toBe(true);
      }, 60_000);
    });
  }
});
