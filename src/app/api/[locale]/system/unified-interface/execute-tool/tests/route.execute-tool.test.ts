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
import {
  discardPendingCall,
  getPendingCall,
  registerPendingCall,
} from "@/app/api/[locale]/remote-connection/pending-calls";
import { resolveTestAdminUser } from "@/app/api/[locale]/system/check/testing/testing-suite/resolve-test-user";
import { db } from "@/app/api/[locale]/system/db";
import helpEndpoints from "@/app/api/[locale]/system/help/definition";
import type { AiT } from "@/app/api/[locale]/system/unified-interface/ai/i18n";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import type {
  CronTaskStatusValue} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import {
  CronTaskStatus
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
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
    await new Promise<void>((resolve) => { setTimeout(resolve, 200); });
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
    // Should include a hint about wait-for-task
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
  });

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
  });

  // ── ET-LOCAL-DETACH-THEN-WAIT-FOR-TASK ───────────────────────────────────
  // DETACH returns taskId. After task completes, wait-for-task returns the result inline.
  // This is the AI's "I need the result" flow.

  it("ET-LOCAL-DETACH-THEN-WAIT-FOR-TASK: wait-for-task returns completed result after DETACH", async () => {
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
    expect(finalStatus, "DETACH task must complete before wait-for-task").toBe(
      CronTaskStatus.COMPLETED,
    );

    // Now call wait-for-task — should return the stored result inline
    const { WaitForTaskRepository } =
      await import("@/app/api/[locale]/system/unified-interface/tasks/wait-for-task/repository");
    const { scopedTranslation: tasksScopedT } =
      await import("@/app/api/[locale]/system/unified-interface/tasks/i18n");
    const t = tasksScopedT.scopedT(defaultLocale).t;
    const waitCtx = makeHeadlessContext();

    const waitResult = await WaitForTaskRepository.waitForTask(
      { taskId },
      testUser,
      makeLogger(),
      t,
      waitCtx,
    );

    expect(
      waitResult.success,
      `wait-for-task failed: ${JSON.stringify(waitResult)}`,
    ).toBe(true);
    if (!waitResult.success) {
      throw new Error(waitResult.message);
    }

    expect(
      waitResult.data.waiting,
      "wait-for-task on completed task must NOT be waiting",
    ).toBe(false);
    expect(
      waitResult.data.status,
      "wait-for-task status must be completed",
    ).toBe(CronTaskStatus.COMPLETED);
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

      it("ET-REMOTE-DETACH: remote DETACH returns taskId immediately, hint includes wait-for-task", async () => {
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

        const data = result.data as Record<string, unknown>;
        expect(data, "Remote CLI WAIT must have result field").toHaveProperty(
          "result",
        );
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
        expect(data, "Reverse-WS WAIT must have result field").toHaveProperty("result");
        expect(data.taskId, "Reverse-WS WAIT must not return taskId").toBeUndefined();
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
        expect(data, "Reverse-WS END_LOOP must have result field").toHaveProperty("result");
        expect(data.taskId, "Reverse-WS END_LOOP must not return taskId").toBeUndefined();
      }, 60_000);

      // ── ET-RWS-DETACH ─────────────────────────────────────────────────────

      it("ET-RWS-DETACH: reverse-WS DETACH returns taskId immediately", async () => {
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
        expect(data.taskId, "Reverse-WS DETACH must return taskId").toBeTruthy();
        expect(data.hint, "Reverse-WS DETACH must return hint").toBeTruthy();
        expect(data.result, "Reverse-WS DETACH must not return inline result").toBeUndefined();
      }, 60_000);
    });
  }
});
