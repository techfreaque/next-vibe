/**
 * Campaign Starter Task (Unified Format)
 * Starts campaigns for new leads by transitioning them to PENDING status
 */
import "server-only";

import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { Environment } from "next-vibe/shared/utils/env-util";

import { CRON_SCHEDULES } from "@/app/api/[locale]/system/unified-interface/tasks/constants";
import { TaskCategory } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { Task } from "@/app/api/[locale]/system/unified-interface/tasks/types/repository";
import { env } from "@/config/env";

import { execute, taskDefinition } from "./campaign-starter.cron";

const campaignStarterTask: Task = {
  type: "cron",
  name: taskDefinition.name,
  description: taskDefinition.description,
  schedule:
    env.NODE_ENV === Environment.PRODUCTION
      ? taskDefinition.schedule
      : CRON_SCHEDULES.EVERY_3_MINUTES,
  category: TaskCategory.MAINTENANCE,
  enabled: taskDefinition.enabled,
  priority: taskDefinition.priority,
  timeout: taskDefinition.timeout,

  run: async ({ logger }) => {
    const startTime = new Date();

    const result = await execute({
      taskId: taskDefinition.name,
      taskName: taskDefinition.name,
      config: taskDefinition.defaultConfig,
      logger,
      startTime,
      isDryRun: taskDefinition.defaultConfig.dryRun,
      isManual: false,
    });

    if (!result.success) {
      return fail({
        message:
          "app.api.leads.leadsErrors.campaigns.common.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        cause: result,
      });
    }
  },

  onError: ({ error, logger }) => {
    logger.error("Campaign starter task error", parseError(error));
  },
};

export const tasks: Task[] = [campaignStarterTask];

export default tasks;
