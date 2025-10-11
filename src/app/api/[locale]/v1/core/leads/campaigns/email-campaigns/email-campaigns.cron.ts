/**
 * Email Campaigns Cron Job
 * Production-ready email campaign automation for lead nurturing
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { EmailCampaignStage } from "../../enum";
import { taskDefinition } from "./config";
import { emailCampaignsRepository } from "./repository";
import type { EmailCampaignConfigType, EmailCampaignResultType } from "./types";
import { createEmptyEmailCampaignResult } from "./types";

// Define task execution context inline
interface TaskLogger {
  info: (message: string, meta?: unknown) => void;
  warn: (message: string, meta?: unknown) => void;
  error: (message: string, meta?: unknown) => void;
  debug: (message: string, meta?: unknown) => void;
}

interface CronTaskExecutionContext {
  taskId: string;
  taskName: string;
  config: Record<string, unknown>;
  logger: TaskLogger;
  startTime: Date;
  isDryRun: boolean;
  isManual: boolean;
}

// Export the task definition
export { taskDefinition };

/**
 * Stage priority mapping for processing order
 */
const STAGE_PRIORITIES: Record<string, number> = {
  [EmailCampaignStage.INITIAL]: 1,
  [EmailCampaignStage.FOLLOWUP_1]: 2,
  [EmailCampaignStage.FOLLOWUP_2]: 3,
  [EmailCampaignStage.FOLLOWUP_3]: 4,
  [EmailCampaignStage.NURTURE]: 5,
  [EmailCampaignStage.REACTIVATION]: 6,
};

/**
 * Sort stages by priority for processing order
 */
function sortStagesByPriority(stages: string[]): string[] {
  return stages.sort((a, b) => {
    const priorityA = STAGE_PRIORITIES[a] ?? 999;
    const priorityB = STAGE_PRIORITIES[b] ?? 999;
    return priorityA - priorityB;
  });
}

/**
 * Check if a stage should be processed based on configuration
 */
function shouldProcessStage(
  stage: string,
  config: EmailCampaignConfigType,
): boolean {
  // Check if current time is within enabled hours
  const now = new Date();
  const currentHour = now.getHours();

  if (
    currentHour < config.enabledHours.start ||
    currentHour > config.enabledHours.end
  ) {
    return false;
  }

  // Check if current day is enabled (0 = Sunday, 1 = Monday, etc.)
  const currentDay = now.getDay();
  if (!config.enabledDays.includes(currentDay)) {
    return false;
  }

  return true;
}

/**
 * Merge campaign results from stage processing
 */
function mergeCampaignResults(
  globalResult: EmailCampaignResultType,
  stageResult: EmailCampaignResultType,
): void {
  globalResult.emailsScheduled += stageResult.emailsScheduled;
  globalResult.emailsSent += stageResult.emailsSent;
  globalResult.emailsFailed += stageResult.emailsFailed;
  globalResult.leadsProcessed += stageResult.leadsProcessed;
  globalResult.errors.push(...stageResult.errors);

  // Merge stage transitions
  Object.entries(stageResult.stageTransitions).forEach(([stage, count]) => {
    globalResult.stageTransitions[stage] =
      (globalResult.stageTransitions[stage] ?? 0) + count;
  });
}

/**
 * Process a single email campaign stage
 */
async function processEmailCampaignStage(
  stage: string,
  config: EmailCampaignConfigType,
  globalResult: EmailCampaignResultType,
  logger: TaskLogger,
): Promise<ResponseType<EmailCampaignResultType>> {
  try {
    logger.debug("Processing email campaign stage", { stage });

    const remainingEmailQuota =
      config.maxEmailsPerRun - globalResult.emailsSent;
    if (remainingEmailQuota <= 0) {
      logger.debug("No remaining email quota for stage", { stage });
      return createSuccessResponse(createEmptyEmailCampaignResult());
    }

    // Process the stage using the repository
    const stageResult = await emailCampaignsRepository.processStage(
      stage as EmailCampaignStage,
      {
        batchSize: Math.min(config.batchSize, remainingEmailQuota),
        dryRun: config.dryRun,
      },
      logger,
    );

    if (!stageResult.success) {
      logger.error("Stage processing failed", {
        stage,
        error: stageResult.message,
      });
      return createErrorResponse(
        "app.api.errors.email_campaign_stage_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { stage, error: stageResult.message },
      );
    }

    return createSuccessResponse(stageResult.data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("Error processing stage", { stage, error: errorMessage });

    return createErrorResponse(
      "app.api.errors.email_campaign_stage_error",
      ErrorResponseTypes.INTERNAL_ERROR,
      { stage, error: errorMessage },
    );
  }
}

/**
 * Validate email campaign task execution
 */
async function validateEmailCampaignTask(
  context: CronTaskExecutionContext<EmailCampaignConfigType>,
): Promise<ResponseType<boolean>> {
  const { config, logger } = context;

  try {
    // Basic configuration validation
    if (!config.enabledStages || config.enabledStages.length === 0) {
      logger.warn("No enabled stages configured");
      return createSuccessResponse(false);
    }

    if (config.maxEmailsPerRun <= 0) {
      logger.warn("Invalid maxEmailsPerRun configuration", {
        maxEmailsPerRun: config.maxEmailsPerRun,
      });
      return createSuccessResponse(false);
    }

    // Check if we're within enabled time window
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    if (
      currentHour < config.enabledHours.start ||
      currentHour > config.enabledHours.end
    ) {
      logger.debug("Outside enabled hours", {
        currentHour,
        enabledHours: config.enabledHours,
      });
      return createSuccessResponse(false);
    }

    if (!config.enabledDays.includes(currentDay)) {
      logger.debug("Outside enabled days", {
        currentDay,
        enabledDays: config.enabledDays,
      });
      return createSuccessResponse(false);
    }

    logger.debug("Email campaign task validation passed");
    return createSuccessResponse(true);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("Email campaign task validation failed", {
      error: errorMessage,
    });

    return createErrorResponse(
      "app.api.errors.email_campaign_validation_failed",
      ErrorResponseTypes.INTERNAL_ERROR,
      { error: errorMessage },
    );
  }
}

/**
 * Email Campaign Task Execution Function
 * Production-ready implementation with proper error handling and logging
 */
export async function execute(
  context: CronTaskExecutionContext<EmailCampaignConfigType>,
): Promise<ResponseType<EmailCampaignResultType>> {
  const { config, logger, taskId } = context;
  const startTime = Date.now();

  try {
    logger.info("Starting lead email campaigns task", {
      taskId,
      config: {
        batchSize: config.batchSize,
        maxEmailsPerRun: config.maxEmailsPerRun,
        dryRun: config.dryRun,
        enabledStages: config.enabledStages,
      },
    });

    const result = createEmptyEmailCampaignResult();

    // Get enabled stages sorted by priority
    const stagesToProcess = sortStagesByPriority(
      config.enabledStages.filter((stage) => shouldProcessStage(stage, config)),
    );

    logger.debug("Processing stages in order", {
      stages: stagesToProcess,
    });

    // Process each enabled stage
    for (const stage of stagesToProcess) {
      if (result.emailsSent >= config.maxEmailsPerRun) {
        logger.info("Max emails per run reached, stopping", {
          maxEmails: config.maxEmailsPerRun,
          emailsSent: result.emailsSent,
        });
        break;
      }

      logger.debug("Processing stage", { stage });

      const stageResult = await processEmailCampaignStage(
        stage,
        config,
        result,
        logger,
      );

      if (!stageResult.success) {
        logger.error("Stage processing failed", {
          stage,
          error: stageResult,
        });
        return stageResult;
      }

      // Merge stage results into global results
      mergeCampaignResults(result, stageResult.data);

      logger.debug("Stage completed", {
        stage,
        stageEmailsSent: stageResult.data.emailsSent,
        totalEmailsSent: result.emailsSent,
      });
    }

    const executionTimeMs = Date.now() - startTime;

    logger.info("Lead email campaigns task completed", {
      taskId,
      emailsScheduled: result.emailsScheduled,
      emailsSent: result.emailsSent,
      emailsFailed: result.emailsFailed,
      leadsProcessed: result.leadsProcessed,
      errorCount: result.errors.length,
      stageTransitions: result.stageTransitions,
      executionTimeMs,
    });

    return createSuccessResponse(result);
  } catch (error) {
    const executionTimeMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error("Lead email campaigns task failed", {
      taskId,
      error: errorMessage,
      executionTimeMs,
    });

    return createErrorResponse(
      "app.api.errors.lead_email_campaigns_task_failed",
      ErrorResponseTypes.INTERNAL_ERROR,
      { error: errorMessage, executionTimeMs },
    );
  }
}

/**
 * Email Campaign Task Validation Function
 * Validates that the email campaign task can run safely
 */
export async function validate(
  context: CronTaskExecutionContext<EmailCampaignConfigType>,
): Promise<ResponseType<boolean>> {
  return await validateEmailCampaignTask(context);
}

/**
 * Email Campaign Task Rollback Function
 * Defines rollback behavior for email campaigns (not applicable)
 */
export function rollback(
  context: CronTaskExecutionContext<EmailCampaignConfigType>,
): ResponseType<boolean> {
  const { logger } = context;

  // Email campaigns cannot be rolled back once sent
  // This is by design - emails are tracked in the database
  logger.info(
    "Rollback not applicable for email campaigns - emails are tracked in database",
  );
  return createSuccessResponse(true);
}
