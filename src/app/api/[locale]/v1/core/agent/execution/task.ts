/**
 * Email Agent Execution Task (Unified Format)
 * Executes approved actions and tool calls, handles confirmations and cleanup
 *
 * This file follows the unified task format as specified in spec.md
 */

import "server-only";

import { and, eq, isNull, lt } from "drizzle-orm";
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
import type {
  Task,
  TaskExecutionContext,
} from "@/app/api/[locale]/v1/core/system/tasks/types/repository";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { env } from "@/config/env";

import { emails } from "../../emails/messages/db";
import { emailAgentProcessing, humanConfirmationRequests } from "../db";
import {
  ConfirmationStatus,
  EmailAgentStatus,
  EmailAgentToolType,
} from "../enum";

/**
 * Task Configuration Schema
 */
export const taskConfigSchema = z.object({
  maxActionsPerRun: z.number().min(1).max(100),
  enableToolExecution: z.boolean(),
  enableConfirmationCleanup: z.boolean(),
  confirmationExpiryHours: z.number().min(1).max(168), // 1 hour to 1 week
  dryRun: z.boolean(),
});

export type TaskConfigType = z.infer<typeof taskConfigSchema>;

/**
 * Task Result Schema
 */
export const taskResultSchema = z.object({
  actionsExecuted: z.number(),
  confirmationsProcessed: z.number(),
  confirmationsExpired: z.number(),
  errors: z.array(
    z.object({
      confirmationId: z.string(),
      stage: z.string(),
      error: z.string(),
    }),
  ),
  summary: z.object({
    totalProcessed: z.number(),
    pendingCount: z.number(),
    approvedCount: z.number(),
    rejectedCount: z.number(),
    expiredCount: z.number(),
  }),
});

export type TaskResultType = z.infer<typeof taskResultSchema>;

/**
 * Email Agent Execution Task Implementation
 */
async function executeEmailAgentExecution(
  context: TaskExecutionContext<TaskConfigType>,
): Promise<ResponseType<TaskResultType>> {
  const config = context.config;
  const logger = context.logger;

  logger.info("app.api.v1.core.system.tasks.cron.execution.start", { config });

  let actionsExecuted = 0;
  let confirmationsProcessed = 0;
  let confirmationsExpired = 0;
  const errors: TaskResultType["errors"] = [];

  try {
    // Step 1: Process approved confirmations
    if (config.enableToolExecution) {
      const approvedConfirmations = await db
        .select({
          confirmation: humanConfirmationRequests,
          email: emails,
          processing: emailAgentProcessing,
        })
        .from(humanConfirmationRequests)
        .innerJoin(emails, eq(humanConfirmationRequests.emailId, emails.id))
        .innerJoin(
          emailAgentProcessing,
          eq(humanConfirmationRequests.processingId, emailAgentProcessing.id),
        )
        .where(
          eq(humanConfirmationRequests.status, ConfirmationStatus.APPROVED),
        )
        .limit(config.maxActionsPerRun);

      logger.info("app.api.v1.core.system.tasks.cron.execution.found", {
        count: approvedConfirmations.length,
      });

      // Process each approved confirmation
      for (const { confirmation, email, processing } of approvedConfirmations) {
        try {
          confirmationsProcessed++;
          logger.debug(
            "app.api.v1.core.system.tasks.cron.execution.processing",
            {
              confirmationId: confirmation.id,
              emailId: email.id,
              actionType: confirmation.actionType,
            },
          );

          // Execute the tool call based on type
          if (
            confirmation.toolCall &&
            confirmation.toolCall.toolType === "EMAIL_RESPONSE"
          ) {
            // Execute email response
            logger.info(
              "app.api.v1.core.system.tasks.cron.execution.email_response",
              {
                confirmationId: confirmation.id,
                emailId: email.id,
              },
            );

            if (!config.dryRun) {
              // Mark confirmation as executed
              await db
                .update(humanConfirmationRequests)
                .set({
                  status: ConfirmationStatus.APPROVED,
                  executedAt: new Date(),
                  updatedAt: new Date(),
                })
                .where(eq(humanConfirmationRequests.id, confirmation.id));

              // Update processing status
              await db
                .update(emailAgentProcessing)
                .set({
                  status: EmailAgentStatus.COMPLETED,
                  completedAt: new Date(),
                  updatedAt: new Date(),
                })
                .where(eq(emailAgentProcessing.id, processing.id));

              actionsExecuted++;
            }
          } else {
            // Handle other tool types (escalation, etc.)
            logger.info(
              "app.api.v1.core.system.tasks.cron.execution.other_action",
              {
                confirmationId: confirmation.id,
                toolType: confirmation.toolCall?.toolType,
              },
            );

            if (!config.dryRun) {
              await db
                .update(humanConfirmationRequests)
                .set({
                  status: ConfirmationStatus.APPROVED,
                  executedAt: new Date(),
                  updatedAt: new Date(),
                })
                .where(eq(humanConfirmationRequests.id, confirmation.id));

              actionsExecuted++;
            }
          }
        } catch (error) {
          errors.push({
            confirmationId: confirmation.id,
            stage: "execution",
            error:
              error instanceof Error
                ? error.message
                : "app.api.v1.core.system.tasks.cron.execution.unknown_error",
          });

          logger.error("app.api.v1.core.system.tasks.cron.execution.error", {
            confirmationId: confirmation.id,
            error:
              error instanceof Error
                ? error.message
                : "app.api.v1.core.system.tasks.cron.execution.unknown_error",
          });
        }
      }
    }

    // Step 2: Clean up expired confirmations
    if (config.enableConfirmationCleanup) {
      const expiryDate = new Date();
      expiryDate.setHours(
        expiryDate.getHours() - config.confirmationExpiryHours,
      );

      const expiredConfirmations = await db
        .select()
        .from(humanConfirmationRequests)
        .where(
          and(
            eq(humanConfirmationRequests.status, ConfirmationStatus.PENDING),
            lt(humanConfirmationRequests.expiresAt, expiryDate),
          ),
        );

      logger.info("app.api.v1.core.system.tasks.cron.execution.expired_found", {
        count: expiredConfirmations.length,
      });

      if (!config.dryRun && expiredConfirmations.length > 0) {
        await db
          .update(humanConfirmationRequests)
          .set({
            status: ConfirmationStatus.EXPIRED,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(humanConfirmationRequests.status, ConfirmationStatus.PENDING),
              lt(humanConfirmationRequests.expiresAt, expiryDate),
            ),
          );

        confirmationsExpired = expiredConfirmations.length;
      }
    }

    // Step 3: Get summary statistics
    const [summaryStats] = await db
      .select({
        pending: db.$count(
          humanConfirmationRequests,
          eq(humanConfirmationRequests.status, ConfirmationStatus.PENDING),
        ),
        approved: db.$count(
          humanConfirmationRequests,
          eq(humanConfirmationRequests.status, ConfirmationStatus.APPROVED),
        ),
        rejected: db.$count(
          humanConfirmationRequests,
          eq(humanConfirmationRequests.status, ConfirmationStatus.REJECTED),
        ),
        expired: db.$count(
          humanConfirmationRequests,
          eq(humanConfirmationRequests.status, ConfirmationStatus.EXPIRED),
        ),
      })
      .from(humanConfirmationRequests);

    const result: TaskResultType = {
      actionsExecuted,
      confirmationsProcessed,
      confirmationsExpired,
      errors,
      summary: {
        totalProcessed: confirmationsProcessed,
        pendingCount: summaryStats?.pending || 0,
        approvedCount: summaryStats?.approved || 0,
        rejectedCount: summaryStats?.rejected || 0,
        expiredCount: summaryStats?.expired || 0,
      },
    };

    logger.info(
      "app.api.v1.core.system.tasks.cron.execution.completed",
      result.summary,
    );
    return createSuccessResponse(result);
  } catch (error) {
    logger.error("app.api.v1.core.system.tasks.cron.execution.failed", {
      error:
        error instanceof Error
          ? error.message
          : "app.api.v1.core.system.tasks.cron.execution.unknown_error",
    });

    return createErrorResponse(
      "error.default",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
}

/**
 * Validate function for the task
 */
async function validateEmailAgentExecution(): Promise<ResponseType<boolean>> {
  try {
    // Basic validation - check if database is accessible
    await db.select().from(humanConfirmationRequests).limit(1);
    return createSuccessResponse(true);
  } catch {
    return createErrorResponse(
      "error.default",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
}

/**
 * Rollback function for the task
 */
function rollbackEmailAgentExecution(): ResponseType<boolean> {
  // No rollback needed for execution task
  return createSuccessResponse(true);
}

/**
 * Email Agent Execution Task (Unified Format)
 */
const emailAgentExecutionTask: Task = {
  type: "cron",
  name: "email-agent-execution",
  description: "app.api.v1.core.system.tasks.cron.execution.description",
  schedule: CRON_SCHEDULES.EVERY_5_MINUTES, // Every 5 minutes
  category: "agent",
  enabled: false,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.LONG, // 10 minutes

  run: async (context: TaskExecutionContext<TaskConfigType>) => {
    const logger = context.logger;
    logger.info("agent.execution.task.start");

    try {
      const result = await executeEmailAgentExecution(context);

      if (result.success) {
        logger.info("agent.execution.task.completed", result.data);
        return result;
      } else {
        logger.error("agent.execution.task.failed", result.error);
        return result;
      }
    } catch (error) {
      logger.error("agent.execution.task.error", error);
      return createErrorResponse(
        "api.agent.execution.task.error",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  },

  onError: async (context: { error: Error; logger: EndpointLogger }) => {
    context.logger.error("agent.execution.task.onError", context.error);
  },
};

/**
 * Export all tasks for agent execution subdomain
 */
export const tasks: Task[] = [emailAgentExecutionTask];

export default tasks;

/**
 * Legacy exports for backward compatibility
 */
export const taskDefinition = {
  name: "email-agent-execution",
  description: "app.api.v1.core.system.tasks.cron.execution.description",
  version: "1.0.0",
  schedule: CRON_SCHEDULES.EVERY_5_MINUTES, // Every 5 minutes
  timezone: "UTC",
  enabled: false,
  timeout: TASK_TIMEOUTS.LONG, // 10 minutes
  retries: 2,
  retryDelay: 1000,
  priority: CronTaskPriority.MEDIUM,
  defaultConfig: {
    maxActionsPerRun: 20,
    enableToolExecution: true,
    enableConfirmationCleanup: true,
    confirmationExpiryHours: 24,
    dryRun: false,
  },
  configSchema: taskConfigSchema,
  resultSchema: taskResultSchema,
  tags: ["email", "agent", "execution"],
  dependencies: [],
};

export const execute = executeEmailAgentExecution;
export const validate = validateEmailAgentExecution;
export const rollback = rollbackEmailAgentExecution;
