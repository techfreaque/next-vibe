/**
 * Campaign Starter Task (Unified Format)
 * Starts campaigns for new leads by transitioning them to PENDING status
 */
import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { Environment } from "next-vibe/shared/utils/env-util";

import { db } from "@/app/api/[locale]/system/db";
import { CRON_SCHEDULES } from "@/app/api/[locale]/system/unified-interface/tasks/constants";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import { TaskCategory } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { Task } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  type CronSettings,
  getDefaultConfig,
  getDefaultCronSettings,
} from "./campaign-starter-config/default-config";
import { CampaignStarterConfigRepository } from "./campaign-starter-config/repository";
import { CampaignStarterRepository } from "./repository";
import {
  type CampaignStarterConfigType,
  type CampaignStarterResultType,
} from "./types";

// System user for cron tasks (public token without user ID)
const SYSTEM_LEAD_ID = "00000000-0000-0000-0000-000000000000";
const SYSTEM_USER: JwtPayloadType = {
  isPublic: true,
  leadId: SYSTEM_LEAD_ID,
  roles: [UserPermissionRole.PUBLIC],
};

interface TaskLogger {
  info: (
    message: string,
    meta?: Record<string, string | number | boolean>,
  ) => void;
  warn: (
    message: string,
    meta?: Record<string, string | number | boolean>,
  ) => void;
  error: (
    message: string,
    meta?: Record<string, string | number | boolean>,
  ) => void;
  debug: (
    message: string,
    meta?: Record<string, string | number | boolean>,
  ) => void;
  vibe: (
    message: string,
    meta?: Record<string, string | number | boolean>,
  ) => void;
  isDebugEnabled: boolean;
}

interface CronTaskExecutionContext {
  taskId: string;
  taskName: string;
  config: CampaignStarterConfigType;
  logger: TaskLogger;
  startTime: Date;
  isDryRun: boolean;
  isManual: boolean;
}

interface CronTaskDefinition extends CronSettings {
  name: string;
  description: string;
  defaultConfig: CampaignStarterConfigType;
}

export const taskDefinition: CronTaskDefinition = {
  name: "lead-campaign-starter",
  description: "app.api.leads.campaigns.campaignStarter.task.description",
  ...getDefaultCronSettings(),
  defaultConfig: getDefaultConfig(),
};

async function execute(
  context: CronTaskExecutionContext,
): Promise<ResponseType<CampaignStarterResultType>> {
  const startTime = Date.now();
  const { logger, taskId } = context;

  try {
    const configResult =
      await CampaignStarterConfigRepository.ensureConfigExists(
        SYSTEM_USER,
        "en-GLOBAL",
        logger,
      );

    if (!configResult.success || !configResult.data) {
      return fail({
        message:
          "app.api.leads.leadsErrors.campaigns.common.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: "Failed to load configuration" },
      });
    }

    const config = configResult.data;
    const now = new Date();

    const currentDay = now.getUTCDay() || 7; // Convert Sunday (0) to 7
    const currentHour = now.getUTCHours();

    if (!config.enabledDays.includes(currentDay)) {
      return success({
        leadsProcessed: 0,
        leadsStarted: 0,
        leadsSkipped: 0,
        executionTimeMs: Date.now() - startTime,
        errors: [],
      });
    }

    if (
      currentHour < config.enabledHours.start ||
      currentHour > config.enabledHours.end
    ) {
      return success({
        leadsProcessed: 0,
        leadsStarted: 0,
        leadsSkipped: 0,
        executionTimeMs: Date.now() - startTime,
        errors: [],
      });
    }

    const result: CampaignStarterResultType = {
      leadsProcessed: 0,
      leadsStarted: 0,
      leadsSkipped: 0,
      executionTimeMs: 0,
      errors: [],
    };

    const minAgeDate = new Date();
    minAgeDate.setHours(minAgeDate.getHours() - config.minAgeHours);

    const daysFromMonday = now.getUTCDay() === 0 ? 6 : now.getUTCDay() - 1;
    const startOfWeek = new Date(now);
    startOfWeek.setUTCDate(now.getUTCDate() - daysFromMonday);
    startOfWeek.setUTCHours(0, 0, 0, 0);

    for (const [localeKey, weeklyQuota] of Object.entries(
      config.leadsPerWeek,
    )) {
      const locale = localeKey as CountryLanguage;
      const weeklyQuotaNum = typeof weeklyQuota === "number" ? weeklyQuota : 0;

      const startedThisWeek =
        await CampaignStarterRepository.getLeadsStartedThisWeek(
          locale,
          startOfWeek,
          logger,
        );
      const remainingQuota = Math.max(0, weeklyQuotaNum - startedThisWeek);

      logger.debug("Week-based quota check", {
        locale,
        weeklyQuota: weeklyQuotaNum,
        startedThisWeek,
        remainingQuota,
        weekStart: startOfWeek.toISOString(),
      });

      if (remainingQuota <= 0) {
        logger.debug("Weekly quota reached for locale, skipping", {
          locale,
          weeklyQuotaNum,
        });
        continue;
      }

      const failedLeadsCountResult =
        await CampaignStarterRepository.getFailedLeadsCount(locale, logger);
      const failedLeadsCount = failedLeadsCountResult.success
        ? failedLeadsCountResult.data
        : 0;

      const adjustedLeadsPerRun = remainingQuota + failedLeadsCount;

      await CampaignStarterRepository.processLocaleLeads(
        locale,
        adjustedLeadsPerRun,
        minAgeDate,
        config,
        result,
        logger,
      );

      if (failedLeadsCount > 0) {
        await CampaignStarterRepository.markFailedLeadsAsProcessed(
          locale,
          logger,
        );
      }
    }

    const executionTimeMs = Date.now() - startTime;
    result.executionTimeMs = executionTimeMs;

    return success(result);
  } catch (error) {
    const executionTimeMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error("Campaign starter task failed", {
      taskId,
      error: errorMessage,
      executionTimeMs,
    });

    return fail({
      message: "app.api.leads.leadsErrors.campaigns.common.error.server.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { error: errorMessage, executionTimeMs },
    });
  }
}

const campaignStarterTask: Task = {
  type: "cron",
  name: taskDefinition.name,
  description: taskDefinition.description,
  schedule:
    env.NODE_ENV === Environment.PRODUCTION
      ? taskDefinition.schedule
      : CRON_SCHEDULES.EVERY_3_MINUTES,
  category: TaskCategory.MAINTENANCE,
  enabled: false,
  priority: taskDefinition.priority,
  timeout: taskDefinition.timeout,

  run: async ({ logger }) => {
    const [dbTask] = await db
      .select({ enabled: cronTasks.enabled })
      .from(cronTasks)
      .where(eq(cronTasks.name, taskDefinition.name))
      .limit(1);

    if (dbTask && !dbTask.enabled) {
      logger.debug("Campaign starter task is disabled in DB, skipping");
      return;
    }

    const startTime = new Date();

    const configResult =
      await CampaignStarterConfigRepository.ensureConfigExists(
        {
          isPublic: true,
          leadId: SYSTEM_LEAD_ID,
          roles: [],
        },
        "en-GLOBAL",
        logger,
      );

    if (!configResult.success || !configResult.data) {
      return fail({
        message:
          "app.api.leads.leadsErrors.campaigns.common.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    if (!configResult.data.enabled) {
      logger.debug("Campaign starter task is disabled in configuration");
      return;
    }

    const result = await execute({
      taskId: taskDefinition.name,
      taskName: taskDefinition.name,
      config: configResult.data,
      logger,
      startTime,
      isDryRun: configResult.data.dryRun,
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

    if (result.data.leadsProcessed > 0 || result.data.leadsStarted > 0) {
      return success(result.data);
    }
  },

  onError: ({ error, logger }) => {
    logger.error("Campaign starter task error", parseError(error));
  },
};

export const tasks: Task[] = [campaignStarterTask];

export default tasks;
