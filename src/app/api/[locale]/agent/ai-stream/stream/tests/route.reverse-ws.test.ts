/**
 * AI Stream Integration - Reverse WS (NAT: WS reverse connector)
 *
 * Tests the reverse WS connector path for remote tool calls behind NAT:
 *
 *   1. execute-tool creates a cron task in hermes-dev's DB (targetInstance='hermes')
 *      AND broadcasts tool-execute-request on system/remote-tool-dispatch/{userId}
 *      (fire-and-forget - event is lost if hermes has no WS connection yet)
 *   2. Stream aborts → thread enters 'waiting' state
 *   3. runReverseWsPulse() PATCHes /user/remote-connection/hermes-dev on hermes (3001):
 *        - Sets isSystemProvider=true + reloads WsProviderConnector on hermes
 *        - Connector opens WS to hermes-dev, subscribes to dispatch channel
 *        - On open: flushPendingQueue() pulls pending tasks from hermes-dev's DB
 *          then executes each pending task immediately via handleToolExecuteRequest
 *          (bypasses the 60s cron delay - delivers the missed WS event)
 *   4. Hermes connector executes the tool, POSTs /report back to hermes-dev
 *   5. /report → handleTaskCompletion → revival fires → thread returns to 'idle'
 *
 * transportMode is forced to 'cloud-only' to prevent the direct-HTTP path from
 * bypassing the WS connector flow.
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { describe } from "bun:test";

import { db } from "@/app/api/[locale]/system/db";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import { and, eq, inArray } from "drizzle-orm";
import { describeStreamSuite } from "./route-base.test";
import {
  resolveRemoteUrl,
  VIBE_START_PID_FILE_PATH,
  VIBE_LOCAL_PID_FILE_PATH,
} from "../../testing/remote-setup";

const HERMES_INSTANCE_ID = "hermes";
/** instanceId used by hermes to refer to hermes-dev */
const HERMES_DEV_INSTANCE_ID = "hermes-dev";

/**
 * Resolved remote URL — set once before the suite runs.
 * Prefers port 3001 (vibe start), falls back to 3002 (vibe --local dev).
 */
let PROD_URL = "http://localhost:3001";

let _prodAdminToken: string | null = null;
let _prodUserId: string | null = null;

async function setupReverseWsConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const {
    connectToHermes,
    disconnectFromHermes,
    resolveProdUserId,
    resolveProdAdminToken,
    triggerPull,
  } = await import("../../testing/remote-setup");

  // Idempotent: clean up any leftover connection from a previous failed run
  await disconnectFromHermes(testUser.id);

  // E2E: log into prod, register hermes-dev on hermes, sync capabilities
  await connectToHermes(testUser, PROD_URL);

  // Ensure capabilities are populated before tests run
  await triggerPull();

  _prodUserId = await resolveProdUserId();
  _prodAdminToken = await resolveProdAdminToken(PROD_URL);

  // Force task-queue path: set cloud-only transport + enable task queue
  await db
    .update(remoteConnections)
    .set({ transportMode: "cloud-only", allowTaskQueue: true })
    .where(
      and(
        eq(remoteConnections.userId, testUser.id),
        eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
      ),
    );
}

async function teardownReverseWsConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const { disconnectFromHermes, unregisterDevFromHermes, closeProdDb } =
    await import("../../testing/remote-setup");

  // Disable isSystemProvider on hermes before disconnecting (best-effort)
  if (_prodAdminToken) {
    try {
      await fetch(
        `${PROD_URL}/api/en-US/user/remote-connection/${HERMES_DEV_INSTANCE_ID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // eslint-disable-next-line i18next/no-literal-string
            Authorization: `Bearer ${_prodAdminToken}`,
          },
          body: JSON.stringify({ isSystemProvider: false }),
          signal: AbortSignal.timeout(5_000),
        },
      );
    } catch {
      /* best-effort */
    }
  }

  const tasks: Promise<void>[] = [disconnectFromHermes(testUser.id)];
  if (_prodUserId) {
    tasks.push(unregisterDevFromHermes(_prodUserId));
  }
  await Promise.all(tasks);
  await closeProdDb();
  _prodUserId = null;
  _prodAdminToken = null;
}

/**
 * Reverse WS connector revival:
 *   1. PATCH /user/remote-connection/hermes-dev on hermes (3001) sets isSystemProvider=true.
 *      The PATCH handler calls reloadWsProviderConnector() on hermes:
 *        - Opens WS to hermes-dev, subscribes to system/remote-tool-dispatch/{userId}
 *        - On open: flushPendingQueue() pulls pending tasks from hermes-dev's DB,
 *          then immediately executes each one via handleToolExecuteRequest
 *          (the WS broadcast fired by execute-tool was lost since hermes wasn't connected;
 *           flushPendingQueue is the recovery path)
 *   2. Hermes connector executes the tool, POSTs /report to hermes-dev
 *   3. handleTaskCompletion → revival → thread exits 'waiting'
 *
 * In the test environment, hermes-dev has no WS server running (it is an in-process test,
 * not a live HTTP/WS server). So hermes's WS connector cannot open a connection to hermes-dev.
 * We work around this by:
 *   a. Calling triggerPull() in-process to push the pending task from hermes-dev's DB to
 *      hermes via the HTTP task-sync endpoint (outbound tasks are included in the sync body).
 *   b. Calling hermes's pulse/execute endpoint with force=true to run the task immediately
 *      (bypasses the 60s cron delay).
 *
 * We poll chatThreads.streamingState for up to 30s after pulse.
 */
async function runReverseWsPulse(threadId: string): Promise<void> {
  if (!_prodAdminToken) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      "runReverseWsPulse: no prod admin token - setupReverseWsConnection not called?",
    );
  }

  // Enable isSystemProvider on hermes's hermes-dev row + trigger connector reload.
  // reloadWsProviderConnector() opens WS → on-open flushPendingQueue pulls + executes tasks.
  const patchResp = await fetch(
    `${PROD_URL}/api/en-US/user/remote-connection/${HERMES_DEV_INSTANCE_ID}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${_prodAdminToken}`,
      },
      body: JSON.stringify({ isSystemProvider: true }),
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!patchResp.ok) {
    const body = await patchResp.text().catch(() => "unknown");
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `runReverseWsPulse: PATCH isSystemProvider failed ${String(patchResp.status)}: ${body}`,
    );
  }

  // eslint-disable-next-line no-console
  console.log("[runReverseWsPulse] isSystemProvider PATCH succeeded");

  // Push pending tasks from hermes-dev to hermes via the task-sync endpoint.
  // triggerPull() calls TaskSyncRepository.pullFromRemote() in-process: it collects all
  // cron_tasks where targetInstance='hermes' and includes them as outboundTasks in the
  // sync request body. Hermes upserts them into its local DB (enabled=true) so the pulse
  // can execute them.
  //
  // This is the workaround for the WS path: in production hermes's WsProviderConnector
  // opens WS to hermes-dev and calls flushPendingQueue on connect, which does the same
  // pullFromRemote. In tests, hermes-dev has no WS server, so we trigger the pull directly.
  const { triggerPull, getProdDb: getProdDbForSeed } =
    await import("../../testing/remote-setup");
  try {
    await triggerPull();
    // eslint-disable-next-line no-console
    console.log("[runReverseWsPulse] triggerPull succeeded");
  } catch (pullErr) {
    // Non-fatal: triggerPull errors are usually swallowed inside pullFromRemote already,
    // but log any unexpected throws here.
    // eslint-disable-next-line no-console
    console.warn(
      "[runReverseWsPulse] triggerPull threw (non-fatal):",
      pullErr instanceof Error ? pullErr.message : String(pullErr),
    );
  }

  // Direct DB seed: always ensure the pending task for this thread exists in hermes's DB.
  // triggerPull() uses HTTP which can silently fail (pullFromRemote swallows errors).
  // We write directly to hermes's DB as a reliable fallback so hermes can execute the task.
  {
    // First, disable stale remote tasks from PREVIOUS runs in hermes's DB so the pulse
    // doesn't waste time executing them before getting to the current test's task.
    const prodDbCleanup = getProdDbForSeed();
    const { sql: sqlCleanup } = await import("drizzle-orm");
    await prodDbCleanup.execute(
      sqlCleanup`UPDATE cron_tasks SET enabled = false, last_execution_status = 'status.cancelled', updated_at = NOW()
                 WHERE id LIKE 'remote-hermes-%' AND enabled = true AND last_execution_status IS NULL`,
    );
  }
  {
    const prodDbSeed = getProdDbForSeed();
    const { cronTasks: localCronTasksSeed } =
      await import("@/app/api/[locale]/system/unified-interface/tasks/cron/db");
    const { sql: sqlSeed, desc: descSeed } = await import("drizzle-orm");

    // Find all pending tasks for this thread created in the last 60 seconds.
    // No LIMIT - parallel batches (e.g. T8: tool-help + generate_image) create multiple tasks.
    // The 60s window excludes stale tasks from previous failed steps in the same session.
    const sixtySecondsAgoSeed = new Date(Date.now() - 60 * 1000);
    const pendingForHermes = await db
      .select()
      .from(localCronTasksSeed)
      .where(
        sqlSeed`${localCronTasksSeed.wakeUpThreadId} = ${threadId} AND ${localCronTasksSeed.targetInstance} = 'hermes' AND ${localCronTasksSeed.lastExecutionStatus} IS NULL AND ${localCronTasksSeed.runOnce} = true AND ${localCronTasksSeed.createdAt} >= ${sixtySecondsAgoSeed.toISOString()}`,
      )
      .orderBy(descSeed(localCronTasksSeed.createdAt));

    if (pendingForHermes.length > 0) {
      // eslint-disable-next-line no-console
      console.log(
        `[runReverseWsPulse] Direct DB seed: writing ${String(pendingForHermes.length)} task(s) to hermes DB`,
      );
      for (const task of pendingForHermes) {
        await prodDbSeed.execute(
          sqlSeed`INSERT INTO cron_tasks (
              id, short_id, route_id, display_name, category, schedule, priority,
              enabled, run_once, task_input,
              wake_up_callback_mode, wake_up_thread_id, wake_up_tool_message_id,
              wake_up_leaf_message_id, wake_up_model_id, wake_up_skill_id,
              wake_up_favorite_id, wake_up_sub_agent_depth,
              output_mode, notification_targets, tags, target_instance, user_id,
              created_at, updated_at
            ) VALUES (
              ${task.id}, ${task.shortId ?? task.id.slice(-8)}, ${task.routeId},
              ${task.displayName ?? task.routeId}, ${task.category}, ${task.schedule}, ${task.priority},
              true, true, ${JSON.stringify(task.taskInput ?? {})}::jsonb,
              ${task.wakeUpCallbackMode}, ${task.wakeUpThreadId}, ${task.wakeUpToolMessageId},
              ${task.wakeUpLeafMessageId}, ${task.wakeUpModelId}, ${task.wakeUpSkillId},
              ${task.wakeUpFavoriteId}, ${task.wakeUpSubAgentDepth ?? 0},
              ${task.outputMode ?? "store_only"}, '[]'::jsonb, ${JSON.stringify(task.tags ?? [])}::jsonb,
              null, ${_prodUserId ?? task.userId},
              NOW(), NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
              enabled = true,
              last_execution_status = NULL,
              updated_at = NOW()`,
        );
      }
      // eslint-disable-next-line no-console
      console.log("[runReverseWsPulse] Direct DB seed complete");
    }
  }

  // Find the task targeting hermes for this thread in hermes-dev's local DB.
  // We need the taskId and routeId so we can poll hermes's DB for completion.
  const { cronTasks: localCronTasks } =
    await import("@/app/api/[locale]/system/unified-interface/tasks/cron/db");
  const { sql: sqlExpr, desc: sqlDesc } = await import("drizzle-orm");

  // Fetch the most recent pending task(s) for this thread.
  // First, find the newest task's createdAt, then fetch all tasks created within 5 seconds
  // of it - this captures parallel batches (T8: tool-help + generate_image created
  // milliseconds apart) while excluding stale tasks from previous test steps that
  // failed and left their tasks with lastExecutionStatus=NULL.
  const allPendingTasks = await db
    .select({
      id: localCronTasks.id,
      routeId: localCronTasks.routeId,
      createdAt: localCronTasks.createdAt,
    })
    .from(localCronTasks)
    .where(
      sqlExpr`${localCronTasks.wakeUpThreadId} = ${threadId}
        AND ${localCronTasks.targetInstance} = 'hermes'
        AND ${localCronTasks.runOnce} = true
        AND ${localCronTasks.lastExecutionStatus} IS NULL`,
    )
    .orderBy(sqlDesc(localCronTasks.createdAt));

  // Find the newest task's timestamp, then keep only tasks created within 5s of it.
  // This isolates the current batch (created together by one AI turn) from older stale tasks.
  const newestCreatedAt = allPendingTasks[0]?.createdAt;
  const localTasks = newestCreatedAt
    ? allPendingTasks.filter(
        (t) =>
          t.createdAt !== null &&
          newestCreatedAt.getTime() - t.createdAt.getTime() < 5_000,
      )
    : allPendingTasks;

  // Cancel any stale tasks that were NOT selected (older null tasks from previous failed runs).
  const selectedIds = new Set(localTasks.map((t) => t.id));
  const staleIds = allPendingTasks
    .filter((t) => !selectedIds.has(t.id))
    .map((t) => t.id);
  if (staleIds.length > 0) {
    // eslint-disable-next-line no-console
    console.log(
      `[runReverseWsPulse] Cancelling ${String(staleIds.length)} stale task(s) from previous failed runs: ${staleIds.join(", ")}`,
    );
    await db
      .update(localCronTasks)
      .set({ lastExecutionStatus: "status.cancelled", enabled: false })
      .where(inArray(localCronTasks.id, staleIds));
  }

  if (localTasks.length === 0) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `runReverseWsPulse: no pending task found for thread ${threadId}`,
    );
  }

  // eslint-disable-next-line no-console
  console.log(
    `[runReverseWsPulse] Found ${String(localTasks.length)} pending task(s) for thread ${threadId}`,
  );

  const { getProdDb } = await import("../../testing/remote-setup");
  const prodDb = getProdDb();
  const {
    cronTasks: prodCronTasks,
    cronTaskExecutions: prodCronTaskExecutions,
    cronTasks: localCronTasksFull,
    dbUserIdToOwner,
  } = await import("@/app/api/[locale]/system/unified-interface/tasks/cron/db");

  const { createEndpointLogger } =
    await import("@/app/api/[locale]/system/unified-interface/shared/logger/server-logger");
  const { defaultLocale } = await import("@/i18n/core/config");
  const { handleTaskCompletion } =
    await import("@/app/api/[locale]/system/unified-interface/tasks/task-completion-handler");
  const { resolveTaskOwnerUser } =
    await import("@/app/api/[locale]/system/unified-interface/tasks/cron/resolve-task-user");
  const { CallbackMode } =
    await import("@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants");
  const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");

  // Process each pending task sequentially.
  // For parallel batches (e.g. T8: tool-help + generate_image both with callbackMode='wait'),
  // both create WAIT tasks simultaneously. We process them one at a time: execute each,
  // call handleTaskCompletion (inline for WAIT mode), then move to the next.
  // Each WAIT revival fires the headless AI with the results visible so far.
  let lastCallbackMode:
    | (typeof CallbackMode)[keyof typeof CallbackMode]
    | null = null;
  for (const localTask of localTasks) {
    // eslint-disable-next-line no-console
    console.log(
      `[runReverseWsPulse] Processing task ${localTask.id} (${localTask.routeId ?? "unknown"})`,
    );

    // Trigger hermes's cron pulse with force=true so it executes the pending task immediately,
      // bypassing the 60s schedule delay.
      //
      // Fire-and-forget: hermes will try to POST /report to localhost:3000 which fails in tests
      // since dev server is not running. We bridge the gap by polling hermes's DB for completion,
      // then calling processReport in-process once hermes has executed the task.
      const prodAdminToken = _prodAdminToken;
      // Await the pulse so we know when hermes has finished executing the task.
      // pulse/execute runs tasks synchronously and returns after they complete.
      // The /report POST back to localhost:3000 will fail (dev server not running),
      // but hermes still marks the task completed in its DB - we bridge from there.
      try {
        const pulseResp = await fetch(
          `${PROD_URL}/api/en-US/system/unified-interface/tasks/pulse/execute`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // eslint-disable-next-line i18next/no-literal-string
              Authorization: `Bearer ${prodAdminToken}`,
            },
            body: JSON.stringify({ force: true }),
            signal: AbortSignal.timeout(90_000),
          },
        );
        // eslint-disable-next-line no-console
        console.log(
          `[runReverseWsPulse] pulse/execute response: ${String(pulseResp.status)}`,
        );
      } catch (pulseErr) {
        // eslint-disable-next-line no-console
        console.warn(
          "[runReverseWsPulse] pulse/execute error (non-fatal, will poll):",
          pulseErr instanceof Error ? pulseErr.message : String(pulseErr),
        );
      }

      // eslint-disable-next-line no-console
      console.log(
        "[runReverseWsPulse] Hermes pulse complete - polling hermes DB for task completion",
      );

      // Poll hermes's DB (prod DB) for the task to complete.
      // Once hermes executes the task, last_execution_status transitions from NULL to a terminal status.
      // The report POST to hermes-dev (localhost:3000) will fail since dev server is not running,
      // so we call processReport in-process to bridge the gap.
      const taskDeadline = Date.now() + 120_000;
      let taskCompleted = false;

      while (Date.now() < taskDeadline) {
        const [prodTask] = await prodDb
          .select({
            lastExecutionStatus: prodCronTasks.lastExecutionStatus,
          })
          .from(prodCronTasks)
          .where(eq(prodCronTasks.id, localTask.id))
          .limit(1);

        if (
          prodTask?.lastExecutionStatus &&
          prodTask.lastExecutionStatus !== "status.running" &&
          prodTask.lastExecutionStatus !== "status.pending" &&
          prodTask.lastExecutionStatus !== "status.scheduled"
        ) {
          // eslint-disable-next-line no-console
          console.log(
            "[runReverseWsPulse] Hermes task completed:",
            prodTask.lastExecutionStatus,
          );
          taskCompleted = true;
          break;
        }

        await new Promise<void>((resolve) => {
          setTimeout(resolve, 500);
        });
      }

      if (!taskCompleted) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
        throw new Error(
          `runReverseWsPulse: hermes task ${localTask.id} did not complete within 120s`,
        );
      }

    // Fetch the execution result from hermes's DB so we can pass it to handleTaskCompletion.
    // This is the actual output from the tool execution (e.g. tool-help response).
    const [prodTask] = await prodDb
      .select({ lastExecutionStatus: prodCronTasks.lastExecutionStatus })
      .from(prodCronTasks)
      .where(eq(prodCronTasks.id, localTask.id))
      .limit(1);
    const taskStatus = prodTask?.lastExecutionStatus ?? "status.completed";

    // eslint-disable-next-line no-console
    console.log("[runReverseWsPulse] Hermes task completed:", taskStatus);

    const [prodExecution] = await prodDb
      .select({ result: prodCronTaskExecutions.result })
      .from(prodCronTaskExecutions)
      .where(eq(prodCronTaskExecutions.taskId, localTask.id))
      .limit(1);
    const taskExecutionOutput =
      prodExecution?.result !== null && prodExecution?.result !== undefined
        ? (prodExecution.result as Record<string, WidgetData>)
        : null;

    // Bridge: hermes can't POST /report to localhost:3000 (dev server down in tests).
    // Instead of calling processReport (which schedules a cron for the next pulse),
    // we call handleTaskCompletion directly with directResumeLocale so revival fires immediately.
    const reportLogger = createEndpointLogger(false, Date.now(), defaultLocale);

    const [localTaskFull] = await db
      .select()
      .from(localCronTasksFull)
      .where(eq(localCronTasksFull.id, localTask.id))
      .limit(1);

    if (!localTaskFull?.wakeUpToolMessageId) {
      // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
      throw new Error(
        `runReverseWsPulse: task ${localTask.id} has no wakeUpToolMessageId`,
      );
    }

    // eslint-disable-next-line no-console
    console.log(
      "[runReverseWsPulse] Calling handleTaskCompletion in-process for task:",
      localTask.id,
    );

    const owner = dbUserIdToOwner(localTaskFull.userId);
    const ownerContext = await resolveTaskOwnerUser(
      owner,
      defaultLocale,
      reportLogger,
    );

    if (!ownerContext) {
      // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
      throw new Error(
        `runReverseWsPulse: failed to resolve owner for task ${localTask.id}`,
      );
    }

    // Update task status in local DB to reflect remote completion.
    // Also store __result in taskInput so wait-for-task can return it inline
    // (in reverse-ws flow the result lives in hermes's cron_task_executions,
    // not the local DB - we bridge it here via the __result sentinel).
    await db
      .update(localCronTasksFull)
      .set({
        lastExecutionStatus: taskStatus,
        lastExecutedAt: new Date(),
        enabled: false,
        ...(taskExecutionOutput !== null
          ? { taskInput: { __result: taskExecutionOutput } }
          : {}),
      })
      .where(eq(localCronTasksFull.id, localTask.id));

    const rawCallbackMode = localTaskFull.wakeUpCallbackMode;
    // eslint-disable-next-line no-console
    console.log(
      "[runReverseWsPulse] Task wakeUpCallbackMode:",
      rawCallbackMode,
      "wakeUpToolMessageId:",
      localTaskFull.wakeUpToolMessageId,
      "wakeUpThreadId:",
      localTaskFull.wakeUpThreadId,
    );
    const callbackMode =
      rawCallbackMode === CallbackMode.WAIT
        ? CallbackMode.WAIT
        : rawCallbackMode === CallbackMode.DETACH
          ? CallbackMode.DETACH
          : rawCallbackMode === CallbackMode.END_LOOP
            ? CallbackMode.END_LOOP
            : rawCallbackMode === CallbackMode.WAKE_UP
              ? CallbackMode.WAKE_UP
              : rawCallbackMode === CallbackMode.APPROVE
                ? CallbackMode.APPROVE
                : null;
    lastCallbackMode = callbackMode;

    const revivalAbortController = new AbortController();
    await handleTaskCompletion({
      toolMessageId: localTaskFull.wakeUpToolMessageId,
      threadId: localTaskFull.wakeUpThreadId ?? threadId,
      callbackMode,
      status: taskStatus,
      output: taskExecutionOutput,
      taskId: localTask.id,
      modelId: localTaskFull.wakeUpModelId ?? null,
      skillId: localTaskFull.wakeUpSkillId ?? null,
      favoriteId: localTaskFull.wakeUpFavoriteId ?? null,
      leafMessageId: localTaskFull.wakeUpLeafMessageId ?? null,
      subAgentDepth: localTaskFull.wakeUpSubAgentDepth ?? 0,
      ownerUser: ownerContext.user,
      logger: reportLogger,
      directResumeLocale: defaultLocale,
      abortSignal: revivalAbortController.signal,
    });

    // eslint-disable-next-line no-console
    console.log(
      "[runReverseWsPulse] handleTaskCompletion completed - revival fired",
    );

    // For WAIT mode: handleTaskCompletion runs the resume-stream INLINE (awaited).
    // After it returns, the thread may be 'idle', 'streaming', or back in 'waiting'
    // (if the resumed AI immediately made another remote tool call). All outcomes valid.
    // Continue to the next task (if any) - each task fires its own inline revival.
    if (callbackMode === CallbackMode.WAIT) {
      const [thread] = await db
        .select({ streamingState: chatThreads.streamingState })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);
      // eslint-disable-next-line no-console
      console.log(
        "[runReverseWsPulse] Thread state after WAIT revival:",
        thread?.streamingState,
      );
      // Continue loop to process remaining parallel tasks
    }
  }

  // All tasks processed. For WAIT mode, all revivals ran inline - we're done.
  if (lastCallbackMode === CallbackMode.WAIT) {
    return;
  }

  // Poll chatThreads.streamingState until thread exits 'waiting'.
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    const [thread] = await db
      .select({ streamingState: chatThreads.streamingState })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);

    if (thread && thread.streamingState !== "waiting") {
      // eslint-disable-next-line no-console
      console.log(
        "[runReverseWsPulse] Thread exited waiting:",
        thread.streamingState,
      );
      return;
    }

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 200);
    });
  }

  // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
  throw new Error(
    `runReverseWsPulse: thread ${threadId} still in 'waiting' after processReport - revival did not fire`,
  );
}

const _resolvedRemoteUrl = await resolveRemoteUrl();
if (!_resolvedRemoteUrl) {
  // oxlint-disable-next-line restricted-syntax -- intentional hard fail: server required
  throw new Error(
    "AI Stream Integration - Reverse WS: no remote server reachable.\n" +
      "Start one of:\n" +
      "  vibe start        → http://localhost:3001\n" +
      "  vibe --local dev  → http://localhost:3002",
  );
}
PROD_URL = _resolvedRemoteUrl;

describeStreamSuite({
  label: `AI Stream Integration - Reverse WS (${_resolvedRemoteUrl}, NAT: WS reverse connector → hermes → /report)`,
  cachePrefix: "reverse-ws-",
  remoteInstanceId: HERMES_INSTANCE_ID,
  setup: setupReverseWsConnection,
  teardown: teardownReverseWsConnection,
  pulse: runReverseWsPulse,
});
