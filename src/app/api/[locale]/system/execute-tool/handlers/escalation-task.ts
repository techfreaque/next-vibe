/**
 * Creates a cronTask row for self-escalating tools (SSH, coding agent, etc.)
 * that discover during execution they need more time than the stream timeout.
 *
 * This is intentionally NOT an execute-tool DETACH/WAKE_UP goroutine — it is
 * a revival-context carrier for a tool already running in its own goroutine.
 * The task row lives only long enough for handleTaskCompletion to read the
 * wakeUp context and schedule resume-stream.
 *
 * Stream-state wiring (waitingForRemoteResult, pendingTimeoutMs, WS events,
 * cancel handler) remains in ai-stream/repository/core/escalation-handler.ts.
 */

import "server-only";

import { db } from "next-vibe/database";
import { cronTasks } from "next-vibe/tasks/cron/db";
import {
  CronTaskPriority,
  CronTaskStatus,
  TaskCategory,
  TaskOutputMode,
} from "next-vibe/tasks/enum";

export async function createEscalationTask(opts: {
  callbackMode: string;
  displayName?: string;
  threadId: string | null;
  toolMessageId: string | null;
  leafMessageId: string | null;
  modelId: string | null;
  skillId: string | null;
  favoriteId: string | null;
  subAgentDepth: number;
  userId: string;
}): Promise<string> {
  const taskId = `escalated-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await db.insert(cronTasks).values({
    id: taskId,
    shortId: taskId,
    routeId: "escalated-tool",
    displayName: opts.displayName ?? `Escalated: ${taskId}`,
    category: TaskCategory.SYSTEM,
    schedule: "* * * * *",
    priority: CronTaskPriority.HIGH,
    enabled: false,
    runOnce: true,
    lastExecutionStatus: CronTaskStatus.RUNNING,
    taskInput: {},
    wakeUpCallbackMode: opts.callbackMode,
    wakeUpThreadId: opts.threadId,
    wakeUpToolMessageId: opts.toolMessageId,
    wakeUpLeafMessageId: opts.leafMessageId,
    wakeUpModelId: opts.modelId,
    wakeUpSkillId: opts.skillId,
    wakeUpFavoriteId: opts.favoriteId,
    wakeUpSubAgentDepth: opts.subAgentDepth,
    outputMode: TaskOutputMode.STORE_ONLY,
    notificationTargets: [],
    tags: ["escalated", "local"],
    userId: opts.userId,
  });

  return taskId;
}
