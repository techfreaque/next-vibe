/**
 * Email Campaigns Task (Unified Format)
 * Automated email campaign processing for lead nurturing
 */
import "server-only";

import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { Environment } from "next-vibe/shared/utils/env-util";

import {
  CRON_SCHEDULES,
  TASK_TIMEOUTS,
} from "@/app/api/[locale]/system/unified-interface/tasks/constants";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { Task } from "@/app/api/[locale]/system/unified-interface/tasks/types/repository";
import { env } from "@/config/env";

import { getDefaultConfig, getSchedule } from "./config";
import { execute } from "./email-campaigns.cron";

const emailCampaignsTask: Task = {
  type: "cron",
  name: "lead-email-campaigns",
  description:
    "Send automated email campaigns to leads based on their stage and timing",
  schedule:
    env.NODE_ENV === Environment.PRODUCTION
      ? getSchedule()
      : CRON_SCHEDULES.EVERY_3_MINUTES,
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  priority: CronTaskPriority.HIGH,
  timeout: TASK_TIMEOUTS.EXTENDED,

  run: async ({ logger }) => {
    const config = getDefaultConfig();
    const startTime = new Date();

    const result = await execute({
      taskId: "lead-email-campaigns",
      taskName: "lead-email-campaigns",
      config,
      logger,
      startTime,
      isDryRun: config.dryRun,
      isManual: false,
    });

    if (!result.success) {
      return fail({
        message:
          "app.api.leads.campaigns.emailCampaigns.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        cause: result,
      });
    }
  },

  onError: ({ error, logger }) => {
    logger.error("Email campaigns task error", parseError(error));
  },
};

export const tasks: Task[] = [emailCampaignsTask];

export default tasks;
