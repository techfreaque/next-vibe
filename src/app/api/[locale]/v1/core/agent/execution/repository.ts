/**
 * Email Agent Execution Repository
 * Data access layer for email agent execution functionality
 */

import "server-only";

import { eq, inArray } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import { humanConfirmationRequests } from "../db";
import { ConfirmationStatus } from "../enum";
import type { EmailAgentExecutionPostRequestTypeOutput } from "./definition";
// Define types locally to avoid circular dependency issues
export interface TaskConfigType {
  maxActionsPerRun: number;
  enableToolExecution: boolean;
  enableConfirmationCleanup: boolean;
  confirmationExpiryHours: number;
  dryRun?: boolean;
}

export interface TaskResultType {
  actionsExecuted: number;
  confirmationsProcessed: number;
  confirmationsExpired: number;
  errors: Array<{
    confirmationId: string;
    action: string;
    error: string;
  }>;
  summary: {
    totalActionsExecuted: number;
    totalConfirmationsProcessed: number;
    totalConfirmationsExpired: number;
    failedActions: number;
    pendingConfirmations: number;
  };
}

/**
 * Email Agent Execution Repository Interface
 */
export interface EmailAgentExecutionRepository {
  triggerExecution(
    data: EmailAgentExecutionPostRequestTypeOutput,
    logger: EndpointLogger,
    userId?: string,
  ): Promise<ResponseType<TaskResultType>>;

  validateConfirmationsExist(
    confirmationIds: string[],
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>>;

  markConfirmationsForExecution(
    confirmationIds: string[],
    logger: EndpointLogger,
  ): Promise<ResponseType<number>>;
}

/**
 * Email Agent Execution Repository Implementation
 */
class EmailAgentExecutionRepositoryImpl
  implements EmailAgentExecutionRepository
{
  /**
   * Trigger email agent execution
   */
  async triggerExecution(
    data: EmailAgentExecutionPostRequestTypeOutput,
    logger: EndpointLogger,
    userId?: string,
  ): Promise<ResponseType<TaskResultType>> {
    try {
      logger.debug("app.api.v1.core.agent.execution.debug.trigger", {
        data,
        userId,
      });

      // If specific confirmation IDs are provided, validate they exist
      if (data.confirmationIds && data.confirmationIds.length > 0) {
        const validationResult = await this.validateConfirmationsExist(
          data.confirmationIds,
          logger,
        );
        if (!validationResult.success) {
          return validationResult as ResponseType<TaskResultType>;
        }

        // Mark specific confirmations for execution if they're approved
        const markResult = await this.markConfirmationsForExecution(
          data.confirmationIds,
          logger,
        );
        if (!markResult.success) {
          return markResult as ResponseType<TaskResultType>;
        }
      }

      // Prepare task configuration
      const taskConfig: TaskConfigType = {
        maxActionsPerRun: data.maxActionsPerRun || 50,
        enableToolExecution: data.enableToolExecution ?? true,
        enableConfirmationCleanup: data.enableConfirmationCleanup ?? true,
        confirmationExpiryHours: data.confirmationExpiryHours || 24,
        // dryRun is not available in the definition but kept for task config
      };

      // For now, return a simple success response indicating execution was triggered
      // TODO: Implement proper task execution once task dependencies are resolved
      logger.debug("app.api.v1.core.agent.execution.debug.triggered", {
        maxActionsPerRun: taskConfig.maxActionsPerRun,
        enableToolExecution: taskConfig.enableToolExecution,
        enableConfirmationCleanup: taskConfig.enableConfirmationCleanup,
        confirmationExpiryHours: taskConfig.confirmationExpiryHours,
      });

      return createSuccessResponse({
        actionsExecuted: 0,
        confirmationsProcessed: 0,
        confirmationsExpired: 0,
        errors: [],
        summary: {
          totalActionsExecuted: 0,
          totalConfirmationsProcessed: 0,
          totalConfirmationsExpired: 0,
          failedActions: 0,
          pendingConfirmations: 0,
        },
      });
    } catch (error) {
      logger.error(
        "app.api.v1.core.agent.execution.post.errors.server.description",
        error,
      );
      return createErrorResponse(
        "app.api.v1.core.agent.execution.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Validate that confirmation IDs exist
   */
  async validateConfirmationsExist(
    confirmationIds: string[],
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    try {
      const existingConfirmations = await db
        .select({ id: humanConfirmationRequests.id })
        .from(humanConfirmationRequests)
        .where(inArray(humanConfirmationRequests.id, confirmationIds));

      const existingIds = existingConfirmations.map((c) => c.id);
      const missingIds = confirmationIds.filter(
        (id) => !existingIds.includes(id),
      );

      if (missingIds.length > 0) {
        return createErrorResponse(
          "api.agent.execution.confirmations.not.found",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse(true);
    } catch (error) {
      logger.error("api.agent.execution.validation.error", error);
      return createErrorResponse(
        "api.agent.execution.validation.failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Mark confirmations for execution (ensure they're approved and not already executed)
   */
  async markConfirmationsForExecution(
    confirmationIds: string[],
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    try {
      let markedCount = 0;

      for (const confirmationId of confirmationIds) {
        // Check confirmation status
        const [confirmation] = await db
          .select()
          .from(humanConfirmationRequests)
          .where(eq(humanConfirmationRequests.id, confirmationId));

        if (!confirmation) {
          continue; // Skip if not found (already validated above)
        }

        // Only process approved confirmations that haven't been executed
        if (
          confirmation.status === ConfirmationStatus.APPROVED &&
          !confirmation.executedAt
        ) {
          markedCount++;
        } else if (confirmation.status !== ConfirmationStatus.APPROVED) {
          return createErrorResponse(
            "api.agent.execution.confirmation.not.approved",
            ErrorResponseTypes.CONFLICT,
          );
        } else if (confirmation.executedAt) {
          return createErrorResponse(
            "api.agent.execution.confirmation.already.executed",
            ErrorResponseTypes.CONFLICT,
          );
        }
      }

      return createSuccessResponse(markedCount);
    } catch (error) {
      logger.error("", error);
      return createErrorResponse(
        "api.agent.execution.marking.failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

/**
 * Email Agent Execution Repository Instance
 */
export const emailAgentExecutionRepository =
  new EmailAgentExecutionRepositoryImpl();
