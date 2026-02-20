/**
 * Email Campaigns Task (Unified Format)
 * Automated email campaign processing for lead nurturing
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
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  CRON_SCHEDULES,
  TASK_TIMEOUTS,
} from "@/app/api/[locale]/system/unified-interface/tasks/constants";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { Task } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";
import { env } from "@/config/env";

import { EmailCampaignStage } from "../../enum";
import { getDefaultConfig, getSchedule, taskDefinition } from "./config";
import { emailCampaignsRepository } from "./repository";
import type { EmailCampaignConfigType, EmailCampaignResultType } from "./types";
import {
  createEmptyEmailCampaignResult,
  emailCampaignConfigSchema,
} from "./types";

interface CronTaskExecutionContext {
  taskId: string;
  taskName: string;
  config: EmailCampaignConfigType;
  logger: EndpointLogger;
  startTime: Date;
  isDryRun: boolean;
  isManual: boolean;
}

export { taskDefinition };

const STAGE_PRIORITIES: Record<
  (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage],
  number
> = {
  [EmailCampaignStage.NOT_STARTED]: 0,
  [EmailCampaignStage.INITIAL]: 1,
  [EmailCampaignStage.FOLLOWUP_1]: 2,
  [EmailCampaignStage.FOLLOWUP_2]: 3,
  [EmailCampaignStage.FOLLOWUP_3]: 4,
  [EmailCampaignStage.NURTURE]: 5,
  [EmailCampaignStage.REACTIVATION]: 6,
};

function sortStagesByPriority(
  stages: Array<(typeof EmailCampaignStage)[keyof typeof EmailCampaignStage]>,
): Array<(typeof EmailCampaignStage)[keyof typeof EmailCampaignStage]> {
  return stages.toSorted((a, b) => {
    const priorityA = STAGE_PRIORITIES[a] ?? 999;
    const priorityB = STAGE_PRIORITIES[b] ?? 999;
    return priorityA - priorityB;
  });
}

function shouldProcessStage(config: EmailCampaignConfigType): boolean {
  const now = new Date();
  const currentHour = now.getUTCHours();

  if (
    currentHour < config.enabledHours.start ||
    currentHour > config.enabledHours.end
  ) {
    return false;
  }

  const currentDay = now.getUTCDay();
  if (!config.enabledDays.includes(currentDay)) {
    return false;
  }

  return true;
}

function mergeCampaignResults(
  globalResult: EmailCampaignResultType,
  stageResult: EmailCampaignResultType,
): void {
  globalResult.emailsScheduled += stageResult.emailsScheduled;
  globalResult.emailsSent += stageResult.emailsSent;
  globalResult.emailsFailed += stageResult.emailsFailed;
  globalResult.leadsProcessed += stageResult.leadsProcessed;
  globalResult.errors.push(...stageResult.errors);

  Object.entries(stageResult.stageTransitions).forEach(([stage, count]) => {
    globalResult.stageTransitions[stage] =
      (globalResult.stageTransitions[stage] ?? 0) + count;
  });
}

async function processEmailCampaignStage(
  stage: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage],
  config: EmailCampaignConfigType,
  globalResult: EmailCampaignResultType,
  logger: EndpointLogger,
): Promise<ResponseType<EmailCampaignResultType>> {
  try {
    logger.debug(`Processing email campaign stage: ${stage}`);

    const remainingEmailQuota =
      config.maxEmailsPerRun - globalResult.emailsSent;
    if (remainingEmailQuota <= 0) {
      logger.debug("No remaining email quota for stage", { stage });
      return success(createEmptyEmailCampaignResult());
    }

    const stageResult = await emailCampaignsRepository.processStage(
      stage,
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
      return fail({
        message:
          "app.api.leads.campaigns.emailCampaigns.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { stage, error: stageResult.message },
      });
    }

    return success(stageResult.data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("Error processing stage", { stage, message: errorMessage });

    return fail({
      message:
        "app.api.leads.campaigns.emailCampaigns.post.errors.server.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { stage, error: errorMessage },
    });
  }
}

async function execute(
  context: CronTaskExecutionContext,
): Promise<ResponseType<EmailCampaignResultType>> {
  const { config, logger, taskId } = context;
  const startTime = Date.now();

  try {
    logger.debug("Starting lead email campaigns task", { taskId });

    const result = createEmptyEmailCampaignResult();

    if (!shouldProcessStage(config)) {
      logger.debug("Outside enabled time window, skipping all stages");
      return success(result);
    }

    const bootstrapResult =
      await emailCampaignsRepository.bootstrapPendingLeads(
        config.batchSize,
        logger,
      );
    if (bootstrapResult.success && bootstrapResult.data > 0) {
      logger.info(`Bootstrapped ${bootstrapResult.data} pending leads`);
    }

    const stagesToProcess = sortStagesByPriority(config.enabledStages);

    logger.debug(`Processing stages: ${stagesToProcess.join(", ")}`);

    for (const stage of stagesToProcess) {
      if (result.emailsSent >= config.maxEmailsPerRun) {
        logger.info(
          `Max emails/run reached (${config.maxEmailsPerRun}), stopping`,
        );
        break;
      }

      logger.debug(`Processing stage: ${stage}`);

      const stageResult = await processEmailCampaignStage(
        stage,
        config,
        result,
        logger,
      );

      if (!stageResult.success) {
        logger.error(`Stage ${stage} failed: ${stageResult.message}`);
        return stageResult;
      }

      mergeCampaignResults(result, stageResult.data);

      if (
        stageResult.data.emailsSent > 0 ||
        stageResult.data.emailsFailed > 0
      ) {
        logger.info(
          `Stage ${stage}: ${stageResult.data.emailsSent} sent, ${stageResult.data.emailsFailed} failed`,
        );
      }
    }

    const executionTimeMs = Date.now() - startTime;

    if (
      result.emailsSent > 0 ||
      result.emailsFailed > 0 ||
      result.leadsProcessed > 0
    ) {
      logger.info(
        `Email campaigns: ${result.emailsSent} sent, ${result.emailsFailed} failed, ${result.leadsProcessed} processed (${executionTimeMs}ms)`,
      );
    }

    return success(result);
  } catch (error) {
    const executionTimeMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error("Lead email campaigns task failed", {
      taskId,
      error: errorMessage,
      executionTimeMs,
    });

    return fail({
      message:
        "app.api.leads.campaigns.emailCampaigns.post.errors.server.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { error: errorMessage, executionTimeMs },
    });
  }
}

async function loadConfig(): Promise<EmailCampaignConfigType> {
  try {
    const [task] = await db
      .select({ defaultConfig: cronTasks.defaultConfig })
      .from(cronTasks)
      .where(eq(cronTasks.name, "lead-email-campaigns"))
      .limit(1);

    if (task?.defaultConfig && Object.keys(task.defaultConfig).length > 0) {
      const merged = { ...getDefaultConfig(), ...task.defaultConfig };
      const parsed = emailCampaignConfigSchema.safeParse(merged);
      if (parsed.success) {
        return parsed.data;
      }
    }
  } catch {
    // Fall through to defaults
  }
  return getDefaultConfig();
}

const emailCampaignsTask: Task = {
  type: "cron",
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

  run: async ({ logger }) => {
    const [dbTask] = await db
      .select({ enabled: cronTasks.enabled })
      .from(cronTasks)
      .where(eq(cronTasks.name, "lead-email-campaigns"))
      .limit(1);

    if (dbTask && !dbTask.enabled) {
      return;
    }

    const config = await loadConfig();
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

    if (
      result.data.emailsSent > 0 ||
      result.data.emailsFailed > 0 ||
      result.data.leadsProcessed > 0
    ) {
      return success(result.data);
    }
  },

  onError: ({ error, logger }) => {
    logger.error("Email campaigns task error", parseError(error));
  },
};

export const tasks: Task[] = [emailCampaignsTask];

export default tasks;
