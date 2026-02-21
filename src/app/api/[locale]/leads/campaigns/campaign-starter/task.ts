/**
 * Campaign Starter Task
 * Pure metadata — dispatches to leads/campaigns/campaign-starter POST route via pulse runner.
 */
import "server-only";

import { Environment } from "next-vibe/shared/utils/env-util";

import {
  CRON_SCHEDULES,
  TASK_TIMEOUTS,
} from "@/app/api/[locale]/system/unified-interface/tasks/constants";
import { TaskCategory } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import {
  createCronTask,
  type Task,
} from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";
import { env } from "@/config/env";

import { getDefaultCronSettings } from "./campaign-starter-config/default-config";
import definitions from "./definition";
import { tools } from "./route";

const cronSettings = getDefaultCronSettings();

const campaignStarterTask = createCronTask(definitions.POST, tools.POST, {
  name: "lead-campaign-starter",
  description: "app.api.leads.campaigns.campaignStarter.task.description",
  schedule:
    env.NODE_ENV === Environment.PRODUCTION
      ? cronSettings.schedule
      : CRON_SCHEDULES.EVERY_3_MINUTES,
  category: TaskCategory.MAINTENANCE,
  enabled: false,
  priority: cronSettings.priority,
  timeout: cronSettings.timeout ?? TASK_TIMEOUTS.MEDIUM,
  defaultInput: { dryRun: false },
});

export const tasks: Task[] = [campaignStarterTask];

export default tasks;
