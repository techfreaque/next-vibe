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
import type { Task } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";
import { env } from "@/config/env";

import { getSchedule } from "./config";

const emailCampaignsTask: Task = {
  type: "cron",
  name: "lead-email-campaigns",
  routeId: "leads_campaigns_email-campaigns_POST",
  description: "app.api.leads.campaigns.emailCampaigns.task.description",
  schedule:
    env.NODE_ENV === Environment.PRODUCTION
      ? getSchedule()
      : CRON_SCHEDULES.EVERY_3_MINUTES,
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  priority: CronTaskPriority.HIGH,
  timeout: TASK_TIMEOUTS.EXTENDED,
  defaultConfig: { batchSize: 100, maxEmailsPerRun: 500, dryRun: false },
};

export const tasks: Task[] = [emailCampaignsTask];

export default tasks;
