/**
 * Email Campaigns Task
 * Pure metadata — dispatches to leads/campaigns/email-campaigns POST route via pulse runner.
 */
import "server-only";

import { Environment } from "next-vibe/shared/utils/env-util";

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
import { env } from "@/config/env";

import { getSchedule } from "./config";
import definitions from "./definition";
import { tools } from "./route";

const emailCampaignsTask = createCronTask(definitions.POST, tools.POST, {
  name: "lead-email-campaigns",
  description: "app.api.leads.campaigns.emailCampaigns.task.description",
  schedule:
    env.NODE_ENV === Environment.PRODUCTION
      ? getSchedule()
      : CRON_SCHEDULES.EVERY_3_MINUTES,
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  priority: CronTaskPriority.HIGH,
  timeout: TASK_TIMEOUTS.EXTENDED,
  defaultInput: { batchSize: 100, maxEmailsPerRun: 500, dryRun: false },
});

export const tasks: Task[] = [emailCampaignsTask];

export default tasks;
