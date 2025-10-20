/**
 * Campaign Starter Cron Task
 * Responsible for starting lead campaigns by transitioning leads from NEW to PENDING status
 * and marking them ready for the email campaign system
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  type CronSettings,
  getDefaultConfig,
  getDefaultCronSettings,
} from "./campaign-starter-config/default-config";
import { campaignStarterConfigRepository } from "./campaign-starter-config/repository";
import { campaignStarterRepository } from "./repository";
import {
  campaignStarterConfigSchema,
  type CampaignStarterConfigType,
  type CampaignStarterResultType,
} from "./types";

// System user for cron tasks (public token without user ID)
// Using a special system leadId for cron jobs
const SYSTEM_LEAD_ID = "00000000-0000-0000-0000-000000000000";
const SYSTEM_USER: JwtPayloadType = {
  isPublic: true,
  leadId: SYSTEM_LEAD_ID,
};

// Define task execution types inline
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

/**
 * Ensure configuration exists in database
 * Creates default configuration if it doesn't exist
 */

/**
 * Campaign Starter Cron Task Definition
 */
export const taskDefinition: CronTaskDefinition = {
  // Task metadata
  name: "lead-campaign-starter",
  description:
    "Start campaigns for new leads by transitioning them to PENDING status",

  // Scheduling and execution configuration - environment-specific
  ...getDefaultCronSettings(),

  // Task-specific configuration
  defaultConfig: getDefaultConfig(),
};

/**
 * Campaign Starter Task Execution Function
 */
export async function execute(
  context: CronTaskExecutionContext,
): Promise<ResponseType<CampaignStarterResultType>> {
  const startTime = Date.now();
  const { logger, taskId } = context;

  try {
    // Ensure config exists in database and get current config
    const configResult =
      await campaignStarterConfigRepository.ensureConfigExists(
        SYSTEM_USER,
        "en-GLOBAL",
        logger,
      );

    if (!configResult.success || !configResult.data) {
      return createErrorResponse(
        "app.api.v1.core.leads.leadsErrors.campaigns.common.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: "Failed to load configuration" },
      );
    }

    const config = configResult.data;
    const now = new Date();

    // Check if current time is within enabled hours and days
    const currentDay = now.getUTCDay() || 7; // Convert Sunday (0) to 7
    const currentHour = now.getUTCHours();

    if (!config.enabledDays.includes(currentDay)) {
      return createSuccessResponse({
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
      return createSuccessResponse({
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

    // Calculate minimum age cutoff
    const minAgeDate = new Date();
    minAgeDate.setHours(minAgeDate.getHours() - config.minAgeHours);

    // TODO: Update distribution calculation to use repository
    // const distribution = calculateDistribution(config, taskDefinition.schedule);
    // const distribution = { runsPerWeek: 168, runsPerDay: 24 }; // Temporary placeholder - unused for now

    // Process each configured locale
    for (const [localeKey, weeklyQuota] of Object.entries(
      config.leadsPerWeek,
    )) {
      const locale = localeKey as CountryLanguage;
      const weeklyQuotaNum = typeof weeklyQuota === "number" ? weeklyQuota : 0;

      // TODO: Update locale quota calculation to use repository
      // const localeInfo = await calculateLocaleQuota(locale, weeklyQuota, config, distribution, now);
      const localeInfo = {
        baseLeadsPerRun: weeklyQuotaNum / 7,
        adjustedLeadsPerRun: 0,
        failedLeadsCount: 0,
      }; // Temporary placeholder

      // TODO: Update failed leads count to use repository
      // const failedLeadsCountResult = await campaignStarterRepository.getFailedLeadsCount(locale, logger);
      // const failedLeadsCount = failedLeadsCountResult.success ? failedLeadsCountResult.data : 0;
      const failedLeadsCount = 0; // Temporary placeholder

      // Calculate adjusted quota (base + failed leads to rebalance)
      const adjustedLeadsPerRun = localeInfo.baseLeadsPerRun + failedLeadsCount;

      // Update locale info with rebalancing data
      localeInfo.failedLeadsCount = failedLeadsCount;
      localeInfo.adjustedLeadsPerRun = adjustedLeadsPerRun;

      // TODO: Update process locale leads to use repository
      await campaignStarterRepository.processLocaleLeads(
        locale,
        adjustedLeadsPerRun,
        minAgeDate,
        config,
        result,
        logger,
      );

      // TODO: Update mark failed leads as processed to use repository
      // if (failedLeadsCount > 0) {
      //   await campaignStarterRepository.markFailedLeadsAsProcessed(locale, logger);
      // }
    }

    const executionTimeMs = Date.now() - startTime;
    result.executionTimeMs = executionTimeMs;

    return createSuccessResponse(result);
  } catch (error) {
    const executionTimeMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error("Campaign starter task failed", {
      taskId,
      error: errorMessage,
      executionTimeMs,
    });

    return createErrorResponse(
      "app.api.v1.core.leads.leadsErrors.campaigns.common.error.server.title",
      ErrorResponseTypes.INTERNAL_ERROR,
      { error: errorMessage, executionTimeMs },
    );
  }
}

/**
 * Campaign Starter Task Validation Function
 */
export function validate(
  context: CronTaskExecutionContext,
): ResponseType<boolean> {
  const { config, logger } = context;

  try {
    // Validate configuration
    const validation = campaignStarterConfigSchema.safeParse(config);
    if (!validation.success) {
      const errorDetails = validation.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`,
      );
      const errorMessage = errorDetails.join(", ");

      logger.error("Campaign starter configuration validation failed", {
        errorCount: validation.error.issues.length,
        errorMessage: errorMessage,
      });

      return createErrorResponse(
        "app.api.v1.core.leads.leadsErrors.campaigns.common.error.validation.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: errorMessage },
      );
    }

    // Get typed config after successful validation
    const typedConfig = validation.data;

    // Validate business logic
    if (typedConfig.enabledHours.start >= typedConfig.enabledHours.end) {
      return createErrorResponse(
        "app.api.v1.core.leads.leadsErrors.campaigns.common.error.validation.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: "Start hour must be less than end hour" },
      );
    }

    if (typedConfig.enabledDays.length === 0) {
      return createErrorResponse(
        "app.api.v1.core.leads.leadsErrors.campaigns.common.error.validation.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: "At least one enabled day must be specified" },
      );
    }

    return createSuccessResponse(true);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("Campaign starter validation error", { error: errorMessage });

    return createErrorResponse(
      "app.api.v1.core.leads.leadsErrors.campaigns.common.error.validation.title",
      ErrorResponseTypes.INTERNAL_ERROR,
      { error: errorMessage },
    );
  }
}

/**
 * Campaign Starter Task Rollback Function
 */
export function rollback(
  context: CronTaskExecutionContext,
): ResponseType<boolean> {
  const { logger } = context;

  // Campaign starter changes are tracked in database and don't need rollback
  // The email campaign system will handle the actual email sending
  logger.info(
    "Rollback not applicable for campaign starter - status changes are tracked in database",
  );
  return createSuccessResponse(true);
}
