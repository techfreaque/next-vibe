/**
 * Database Health Check Cron Task
 * Verifies the database connection is alive every minute.
 * Runs via the pulse runner like all other cron tasks.
 */

/* eslint-disable i18next/no-literal-string */

import "server-only";

import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import { rawPool } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { formatDatabase } from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";
import {
  CRON_SCHEDULES,
  TASK_TIMEOUTS,
} from "@/app/api/[locale]/system/unified-interface/tasks/constants";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { Task } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";

async function checkDatabaseHealth(logger: EndpointLogger): Promise<void> {
  await rawPool.query("SELECT 1");
  logger.debug(formatDatabase("Database health check - OK", "🗄️ "));
}

const dbHealthTask: Task = {
  type: "cron",
  name: "db-health-check",
  description:
    "app.api.system.unifiedInterface.tasks.dbHealthCheck.description",
  schedule: CRON_SCHEDULES.EVERY_MINUTE,
  category: TaskCategory.MONITORING,
  enabled: true,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.SHORT,

  run: async ({ logger }) => {
    try {
      await checkDatabaseHealth(logger);
    } catch (error) {
      logger.error("Database health check failed", parseError(error));
    }
  },

  onError: ({ error, logger }) => {
    logger.error("Database health check task error", parseError(error));
  },
};

export const tasks: Task[] = [dbHealthTask];
export default tasks;
