/**
 * Email Agent Classification Task (Unified Format)
 * Processes emails through the multi-stage pipeline (hard rules + AI processing)
 *
 * This file follows the unified task format as specified in spec.md
 */

import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { z } from "zod";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import {
  CRON_SCHEDULES,
  TASK_TIMEOUTS,
} from "@/app/api/[locale]/v1/core/system/tasks/constants";
import { CronTaskPriority } from "@/app/api/[locale]/v1/core/system/tasks/enum";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { env } from "next-vibe/server/env";

import { emails } from "../../emails/messages/db";
import {
  type AiProcessingResult as DbAiProcessingResult,
  type AiToolCall as DbAiToolCall,
  emailAgentProcessing,
  type HardRulesResult as DbHardRulesResult,
  humanConfirmationRequests,
} from "../db";
import {
  ConfirmationStatus,
  EmailAgentActionType,
  EmailAgentStatus,
  ProcessingPriority,
} from "../enum";
import type {
  AiProcessingResult as ServiceAiProcessingResult,
  AiToolCall as ServiceAiToolCall,
} from "../services/ai-processing";
import { aiProcessingService } from "../services/ai-processing";
import type { HardRulesResult as ServiceHardRulesResult } from "../services/hard-rules";
import { hardRulesService } from "../services/hard-rules";

/**
 * Constants for task metadata
 */
const TASK_DESCRIPTION = "tasks.email_agent_classification.description";
const STAGE_HARD_RULES = "tasks.email_agent_classification.stage.hard_rules";
const STAGE_AI_PROCESSING =
  "tasks.email_agent_classification.stage.ai_processing";
const ERROR_HARD_RULES_FAILED =
  "tasks.email_agent_classification.error.hard_rules_failed";
const ERROR_AI_PROCESSING_FAILED =
  "tasks.email_agent_classification.error.ai_processing_failed";
const ERROR_UNKNOWN = "tasks.email_agent_classification.error.unknown";

/**
 * Constants for tool type comparison
 */
const TOOL_TYPE_EMAIL_RESPONSE = "EMAIL_RESPONSE";

/**
 * Task Configuration Schema
 */
export const taskConfigSchema = z.object({
  maxEmailsPerRun: z.number().min(1).max(100),
  enableHardRules: z.boolean(),
  enableAiProcessing: z.boolean(),
  dryRun: z.boolean(),
  priorityFilter: z
    .array(
      z.enum([
        ProcessingPriority.LOW,
        ProcessingPriority.NORMAL,
        ProcessingPriority.HIGH,
        ProcessingPriority.URGENT,
      ]),
    )
    .optional(),
});

export type TaskConfigType = z.infer<typeof taskConfigSchema>;

/**
 * Task Result Schema
 */
export const taskResultSchema = z.object({
  emailsProcessed: z.number(),
  hardRulesApplied: z.number(),
  aiProcessingCompleted: z.number(),
  confirmationRequestsCreated: z.number(),
  errors: z.array(
    z.object({
      emailId: z.string(),
      stage: z.string(),
      error: z.string(),
    }),
  ),
  summary: z.object({
    totalProcessed: z.number(),
    pendingCount: z.number(),
    completedCount: z.number(),
    failedCount: z.number(),
    awaitingConfirmationCount: z.number(),
  }),
});

export type TaskResultType = z.infer<typeof taskResultSchema>;

/**
 * Convert service types to database types
 */
function convertHardRulesResult(
  serviceResult: ServiceHardRulesResult,
): DbHardRulesResult {
  return {
    ...serviceResult,
    actions: serviceResult.actions.map((action) => ({
      ...action,
      metadata: action.metadata
        ? Object.fromEntries(
            Object.entries(action.metadata).map(([k, v]) => [k, String(v)]),
          )
        : undefined,
    })),
  };
}

function convertAiProcessingResult(
  serviceResult: ServiceAiProcessingResult,
): DbAiProcessingResult {
  return {
    ...serviceResult,
    toolCalls: serviceResult.toolCalls.map((toolCall) => ({
      ...toolCall,
      parameters: Object.fromEntries(
        Object.entries(toolCall.parameters).map(([k, v]) => [k, String(v)]),
      ),
    })),
  };
}

function convertAiToolCall(serviceToolCall: ServiceAiToolCall): DbAiToolCall {
  return {
    ...serviceToolCall,
    parameters: Object.fromEntries(
      Object.entries(serviceToolCall.parameters).map(([k, v]) => [
        k,
        String(v),
      ]),
    ),
  };
}

/**
 * Email Agent Classification Task Implementation
 */
async function executeEmailClassification(
  context: TaskExecutionContext<TaskConfigType>,
): Promise<ResponseType<TaskResultType>> {
  const config = context.config;
  const { logger } = context;

  logger.info("Starting email agent classification task", { config });

  let emailsProcessed = 0;
  let hardRulesApplied = 0;
  let aiProcessingCompleted = 0;
  let confirmationRequestsCreated = 0;
  const errors: TaskResultType["errors"] = [];

  try {
    // Step 1: Get emails pending processing
    const pendingEmails = await db
      .select({
        processing: emailAgentProcessing,
        email: emails,
      })
      .from(emailAgentProcessing)
      .innerJoin(emails, eq(emailAgentProcessing.emailId, emails.id))
      .where(
        and(
          eq(emailAgentProcessing.status, EmailAgentStatus.PENDING),
          config.priorityFilter && config.priorityFilter.length > 0
            ? inArray(emailAgentProcessing.priority, config.priorityFilter)
            : undefined,
        ),
      )
      .limit(config.maxEmailsPerRun);

    logger.info(`Found ${pendingEmails.length} emails pending processing`);

    // Step 2: Process each email through the pipeline
    for (const { processing, email } of pendingEmails) {
      try {
        emailsProcessed++;
        logger.debug(`Processing email ${email.id}`, {
          subject: email.subject,
          from: email.senderEmail,
          status: processing.status,
        });

        // Update status to processing
        if (!config.dryRun) {
          await db
            .update(emailAgentProcessing)
            .set({
              status: EmailAgentStatus.PROCESSING,
              lastProcessedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(emailAgentProcessing.id, processing.id));
        }

        // Stage 1: Hard Rules Processing
        if (config.enableHardRules) {
          const hardRulesResult = await hardRulesService.processEmail({
            email,
            headers: (email.headers as Record<string, string>) || {},
            bodyText: email.bodyText || undefined,
            bodyHtml: email.bodyHtml || undefined,
          });

          if (hardRulesResult.success) {
            hardRulesApplied++;

            if (!config.dryRun) {
              await db
                .update(emailAgentProcessing)
                .set({
                  status: EmailAgentStatus.HARD_RULES_COMPLETE,
                  hardRulesResult: convertHardRulesResult(hardRulesResult.data),
                  hardRulesProcessedAt: new Date(),
                  updatedAt: new Date(),
                })
                .where(eq(emailAgentProcessing.id, processing.id));
            }

            logger.debug(`Hard rules completed for email ${email.id}`, {
              actionsCount: hardRulesResult.data.actions.length,
              bounceDetected: hardRulesResult.data.bounceDetected,
              spamDetected: hardRulesResult.data.spamDetected,
            });

            // If hard rules found definitive actions (bounce/spam), skip AI processing
            if (
              hardRulesResult.data.bounceDetected ||
              hardRulesResult.data.spamDetected
            ) {
              if (!config.dryRun) {
                await db
                  .update(emailAgentProcessing)
                  .set({
                    status: EmailAgentStatus.COMPLETED,
                    completedAt: new Date(),
                    updatedAt: new Date(),
                  })
                  .where(eq(emailAgentProcessing.id, processing.id));
              }
              continue;
            }
          } else {
            errors.push({
              emailId: email.id,
              stage: STAGE_HARD_RULES,
              error: hardRulesResult.message || ERROR_HARD_RULES_FAILED,
            });
            logger.error(`Hard rules failed for email ${email.id}`, {
              error: hardRulesResult.message,
            });
          }
        }

        // Stage 2: AI Processing
        if (config.enableAiProcessing) {
          // Convert HardRulesResult to the format expected by AI processing
          const hardRulesForAi = processing.hardRulesResult
            ? {
                processed: processing.hardRulesResult.processed,
                bounceDetected:
                  processing.hardRulesResult.bounceDetected || false,
                spamDetected: processing.hardRulesResult.spamDetected || false,
                deliveryFailureReason:
                  processing.hardRulesResult.deliveryFailureReason || "",
                actionsCount: processing.hardRulesResult.actions?.length || 0,
              }
            : undefined;

          const aiResult = await aiProcessingService.processEmail({
            email,
            headers: (email.headers as Record<string, string>) || {},
            bodyText: email.bodyText || undefined,
            bodyHtml: email.bodyHtml || undefined,
            hardRulesResult: hardRulesForAi,
          });

          if (aiResult.success) {
            aiProcessingCompleted++;

            if (!config.dryRun) {
              await db
                .update(emailAgentProcessing)
                .set({
                  status: EmailAgentStatus.AI_PROCESSING,
                  aiProcessingResult: convertAiProcessingResult(aiResult.data),
                  aiProcessedAt: new Date(),
                  updatedAt: new Date(),
                })
                .where(eq(emailAgentProcessing.id, processing.id));
            }

            logger.debug(`AI processing completed for email ${email.id}`, {
              actionsCount: aiResult.data.recommendedActions.length,
              toolCallsCount: aiResult.data.toolCalls.length,
              confidence: aiResult.data.confidence,
            });

            // Create confirmation requests for actions requiring approval
            const confirmationToolCalls = aiResult.data.toolCalls.filter(
              (tc: ServiceAiToolCall) => tc.requiresConfirmation,
            );

            for (const toolCall of confirmationToolCalls) {
              if (!config.dryRun) {
                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

                await db.insert(humanConfirmationRequests).values({
                  emailId: email.id,
                  processingId: processing.id,
                  actionType:
                    toolCall.toolType === TOOL_TYPE_EMAIL_RESPONSE
                      ? EmailAgentActionType.RESPOND_TO_EMAIL
                      : EmailAgentActionType.ESCALATE_TO_HUMAN,
                  toolCall: convertAiToolCall(toolCall),
                  reasoning: toolCall.reasoning,
                  expiresAt,
                  status: ConfirmationStatus.PENDING,
                });

                confirmationRequestsCreated++;
              }
            }

            // Update final status
            const finalStatus =
              confirmationToolCalls.length > 0
                ? EmailAgentStatus.AWAITING_CONFIRMATION
                : EmailAgentStatus.COMPLETED;

            if (!config.dryRun) {
              await db
                .update(emailAgentProcessing)
                .set({
                  status: finalStatus,
                  ...(finalStatus === EmailAgentStatus.COMPLETED && {
                    completedAt: new Date(),
                  }),
                  updatedAt: new Date(),
                })
                .where(eq(emailAgentProcessing.id, processing.id));
            }
          } else {
            errors.push({
              emailId: email.id,
              stage: STAGE_AI_PROCESSING,
              error: aiResult.message || ERROR_AI_PROCESSING_FAILED,
            });
            logger.error(`AI processing failed for email ${email.id}`, {
              error: aiResult.message,
            });
          }
        }
      } catch (error) {
        errors.push({
          emailId: email.id,
          stage: STAGE_AI_PROCESSING,
          error: error instanceof Error ? error.message : ERROR_UNKNOWN,
        });

        logger.error(`Error processing email ${email.id}`, {
          error: error instanceof Error ? error.message : ERROR_UNKNOWN,
        });

        // Mark as failed
        if (!config.dryRun) {
          await db
            .update(emailAgentProcessing)
            .set({
              status: EmailAgentStatus.FAILED,
              lastError: error instanceof Error ? error.message : ERROR_UNKNOWN,
              lastErrorAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(emailAgentProcessing.emailId, email.id));
        }
      }
    }

    // Step 3: Get summary statistics
    const [summaryStats] = await db
      .select({
        pending: db.$count(
          emailAgentProcessing,
          eq(emailAgentProcessing.status, EmailAgentStatus.PENDING),
        ),
        completed: db.$count(
          emailAgentProcessing,
          eq(emailAgentProcessing.status, EmailAgentStatus.COMPLETED),
        ),
        failed: db.$count(
          emailAgentProcessing,
          eq(emailAgentProcessing.status, EmailAgentStatus.FAILED),
        ),
        awaitingConfirmation: db.$count(
          emailAgentProcessing,
          eq(
            emailAgentProcessing.status,
            EmailAgentStatus.AWAITING_CONFIRMATION,
          ),
        ),
      })
      .from(emailAgentProcessing);

    const result: TaskResultType = {
      emailsProcessed,
      hardRulesApplied,
      aiProcessingCompleted,
      confirmationRequestsCreated,
      errors,
      summary: {
        totalProcessed: emailsProcessed,
        pendingCount: summaryStats?.pending || 0,
        completedCount: summaryStats?.completed || 0,
        failedCount: summaryStats?.failed || 0,
        awaitingConfirmationCount: summaryStats?.awaitingConfirmation || 0,
      },
    };

    logger.info("Email classification task completed", result.summary);
    return createSuccessResponse(result);
  } catch (error) {
    logger.error("Email classification task failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return createErrorResponse(
      "email.errors.sending_failed",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
}

/**
 * Validate function for the task
 */
async function validateEmailClassification(): Promise<ResponseType<boolean>> {
  try {
    // Basic validation - check if database is accessible
    await db.select().from(emails).limit(1);
    return createSuccessResponse(true);
  } catch {
    return createErrorResponse(
      "email.errors.sending_failed",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
}

/**
 * Rollback function for the task
 */
function rollbackEmailClassification(): ResponseType<boolean> {
  // No rollback needed for classification task
  return createSuccessResponse(true);
}

/**
 * Email Agent Classification Task (Unified Format)
 */
const emailAgentClassificationTask: Task = {
  type: "cron",
  name: "email-agent-classification",
  description: TASK_DESCRIPTION,
  schedule: CRON_SCHEDULES.EVERY_3_MINUTES, // Every 3 minutes
  category: "agent",
  enabled: false,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.LONG, // 10 minutes

  run: async (logger: EndpointLogger) => {
    logger.info("agent.classification.task.start");

    try {
      // Create a mock execution context for the task
      const context: TaskExecutionContext<TaskConfigType> = {
        config: {
          maxEmailsPerRun: 50,
          enableHardRules: true,
          enableAiProcessing: true,
          dryRun: false,
        },
        logger,
      };

      const result = await executeEmailClassification(context);

      if (result.success) {
        logger.info("agent.classification.task.completed", result.data);
      } else {
        logger.error("agent.classification.task.failed", result.error);
        throw new Error(
          result.error?.message || "Email agent classification failed",
        );
      }
    } catch (error) {
      logger.error("agent.classification.task.error", error);
      throw error;
    }
  },

  onError: async (error: Error, logger: EndpointLogger) => {
    logger.error("agent.classification.task.onError", error);
  },
};

/**
 * Export all tasks for agent classification subdomain
 */
export const tasks: Task[] = [emailAgentClassificationTask];

export default tasks;

/**
 * Legacy exports for backward compatibility
 */
export const taskDefinition = {
  name: "email-agent-classification",
  description: TASK_DESCRIPTION,
  version: "1.0.0",
  schedule: CRON_SCHEDULES.EVERY_3_MINUTES, // Every 3 minutes
  timezone: "UTC",
  enabled: false,
  timeout: TASK_TIMEOUTS.LONG, // 10 minutes
  retries: 2,
  retryDelay: 1000,
  priority: CronTaskPriority.MEDIUM,
  defaultConfig: {
    maxEmailsPerRun: 50,
    enableHardRules: true,
    enableAiProcessing: true,
    dryRun: false,
  },
  configSchema: taskConfigSchema,
  resultSchema: taskResultSchema,
  tags: ["email", "agent", "classification"],
  dependencies: [],
};

export const execute = executeEmailClassification;
export const validate = validateEmailClassification;
export const rollback = rollbackEmailClassification;
