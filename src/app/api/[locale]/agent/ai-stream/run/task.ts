/**
 * AI Heartbeat Cron Task
 * Runs a headless AI agent on a schedule to check system health,
 * work through tasks, and serve the human.
 *
 * Disabled by default — user must opt in via the cron task UI.
 * Uses the user's companion skill (default: Thea).
 * All runs persist in the CRON folder as background chats.
 */
import "server-only";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import {
  CRON_SCHEDULES,
  TASK_TIMEOUTS,
} from "@/app/api/[locale]/system/unified-interface/tasks/constants";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import {
  createCronTask,
  type Task,
} from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";

import { HISTORY_INTERVALS } from "../../../system/unified-interface/tasks/constants";
import aiRunDefinition from "./definition";
import { tools } from "./route";

const aiHeartbeatTask = createCronTask(aiRunDefinition.POST, tools.POST, {
  id: "ai-heartbeat",
  name: "run.task.name",
  description: "run.task.description",
  schedule: CRON_SCHEDULES.EVERY_4_HOURS,
  category: TaskCategory.SYSTEM,
  enabled: false,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.EXTENDED,
  historyInterval: HISTORY_INTERVALS.EVERY_HOUR,
  taskInput: {
    favoriteId: undefined,
    skill: "thea",
    prompt:
      "Run your scheduled heartbeat. Check system health via your tools, review pending tasks, and report anything that needs human attention. If you cannot reach the human (no email or messaging configured), mention that they should set up a contact method in their settings.",
    instructions:
      "You are running as a scheduled background agent (every 4 hours). Be concise and actionable. Use your tools to gather system state. If something needs human attention, try to contact them via email or messaging. You can spawn sub-agents via ai-run for complex work. All your conversations persist in the Cron folder — the human can review them anytime.",
    maxTurns: 5,
    rootFolderId: DefaultFolderId.CRON,
    appendThreadId: undefined,
    subFolderId: undefined,
    excludeMemories: false,
  },
});

export const tasks: Task[] = [aiHeartbeatTask];
export default tasks;
