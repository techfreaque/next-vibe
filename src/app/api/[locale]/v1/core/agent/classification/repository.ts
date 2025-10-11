/**
 * Email Agent Classification Repository
 * Data access layer for email classification functionality
 */

import "server-only";

import { eq, inArray } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { emails } from "@/app/api/[locale]/v1/core/emails/messages/db";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import { emailAgentProcessing } from "../db";
import { EmailAgentStatus, ProcessingPriority } from "../enum";
import type { EmailAgentClassificationPostRequestTypeOutput } from "./definition";

// Define TaskResultType locally to avoid circular dependency with task.ts
export interface TaskResultType {
  emailsProcessed: number;
  hardRulesApplied: number;
  aiProcessingCompleted: number;
  confirmationRequestsCreated: number;
  errors: Array<{
    emailId: string;
    stage: string;
    error: string;
  }>;
  summary: {
    totalProcessed: number;
    pendingCount: number;
    completedCount: number;
    failedCount: number;
    awaitingConfirmationCount: number;
  };
}

/**
 * Email Agent Classification Repository Interface
 */
export interface EmailAgentClassificationRepository {
  triggerClassification(
    data: EmailAgentClassificationPostRequestTypeOutput,
    logger: EndpointLogger,
    userId?: string,
  ): Promise<ResponseType<TaskResultType>>;

  validateEmailsExist(
    emailIds: string[],
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>>;

  createProcessingRecords(
    emailIds: string[],
    priority: (typeof ProcessingPriority)[keyof typeof ProcessingPriority],
    forceReprocess: boolean,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>>;
}

/**
 * Email Agent Classification Repository Implementation
 */
class EmailAgentClassificationRepositoryImpl
  implements EmailAgentClassificationRepository
{
  /**
   * Trigger email classification
   */
  async triggerClassification(
    data: EmailAgentClassificationPostRequestTypeOutput,
    logger: EndpointLogger,
    userId?: string,
  ): Promise<ResponseType<TaskResultType>> {
    try {
      logger.debug("app.api.v1.core.agent.classification.debug.trigger", {
        data,
        userId,
      });

      // If specific email IDs are provided, validate they exist
      if (data.emailIds && data.emailIds.length > 0) {
        const validationResult = await this.validateEmailsExist(
          data.emailIds,
          logger,
        );
        if (!validationResult.success) {
          return validationResult as ResponseType<TaskResultType>;
        }
      }

      // If specific email IDs are provided, ensure processing records exist
      if (data.emailIds && data.emailIds.length > 0) {
        const priority = data.priorityFilter?.[0] || ProcessingPriority.NORMAL;
        const createResult = await this.createProcessingRecords(
          data.emailIds,
          priority,
          data.forceReprocess || false,
          logger,
        );

        if (!createResult.success) {
          return createResult as ResponseType<TaskResultType>;
        }
      }

      // For now, return a simple success response indicating classification was triggered
      // TODO: Implement proper task execution once TaskExecutionContext interface is resolved
      logger.debug("app.api.v1.core.agent.classification.debug.triggered", {
        maxEmailsPerRun: data.maxEmailsPerRun || 50,
        enableHardRules: data.enableHardRules ?? true,
        enableAiProcessing: data.enableAiProcessing ?? true,
        // Note: dryRun property is not available in the request definition
        priorityFilter: data.priorityFilter,
      });

      return createSuccessResponse({
        emailsProcessed: 0,
        hardRulesApplied: 0,
        aiProcessingCompleted: 0,
        confirmationRequestsCreated: 0,
        errors: [],
        summary: {
          totalProcessed: 0,
          pendingCount: 0,
          completedCount: 0,
          failedCount: 0,
          awaitingConfirmationCount: 0,
        },
      });
    } catch (error) {
      logger.error(
        "app.api.v1.core.agent.classification.post.errors.server.description",
        error,
      );
      return createErrorResponse(
        "app.api.v1.core.agent.classification.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Validate that email IDs exist
   */
  async validateEmailsExist(
    emailIds: string[],
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    try {
      const existingEmails = await db
        .select({ id: emails.id })
        .from(emails)
        .where(inArray(emails.id, emailIds));

      const existingIds = existingEmails.map((e: { id: string }) => e.id);
      const missingIds = emailIds.filter((id) => !existingIds.includes(id));

      if (missingIds.length > 0) {
        return createErrorResponse(
          "app.api.v1.core.agent.classification.post.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse(true);
    } catch (error) {
      logger.error(
        "app.api.v1.core.agent.classification.post.errors.validation.description",
        error,
      );
      return createErrorResponse(
        "app.api.v1.core.agent.classification.post.errors.validation.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Create processing records for emails
   */
  async createProcessingRecords(
    emailIds: string[],
    priority: (typeof ProcessingPriority)[keyof typeof ProcessingPriority],
    forceReprocess: boolean,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    try {
      let createdCount = 0;

      for (const emailId of emailIds) {
        // Check if processing record already exists
        const [existingRecord] = await db
          .select()
          .from(emailAgentProcessing)
          .where(eq(emailAgentProcessing.emailId, emailId));

        if (existingRecord) {
          if (forceReprocess) {
            // Reset existing record to pending
            await db
              .update(emailAgentProcessing)
              .set({
                status: EmailAgentStatus.PENDING,
                priority,
                lastError: null,
                lastErrorAt: null,
                updatedAt: new Date(),
              })
              .where(eq(emailAgentProcessing.emailId, emailId));
            createdCount++;
          }
        } else {
          // Create new processing record
          await db.insert(emailAgentProcessing).values({
            emailId,
            status: EmailAgentStatus.PENDING,
            priority,
          });
          createdCount++;
        }
      }

      return createSuccessResponse(createdCount);
    } catch (error) {
      logger.error(
        "app.api.v1.core.agent.classification.post.errors.server.description",
        error,
      );
      return createErrorResponse(
        "app.api.v1.core.agent.classification.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

/**
 * Email Agent Classification Repository Instance
 */
export const emailAgentClassificationRepository =
  new EmailAgentClassificationRepositoryImpl();
