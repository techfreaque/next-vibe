/**
 * Email Agent Processing Repository
 * Data access layer for email agent processing functionality
 */

import "server-only";

import { and, eq, or, sql } from "drizzle-orm";
import { withTransaction } from "next-vibe/server/db/repository-helpers";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import { emails } from "../../emails/messages/db";
import { emailAgentProcessing, type NewEmailAgentProcessing } from "../db";
import { EmailAgentStatus, ProcessingPriority } from "../enum";
import type {
  EmailAgentProcessingPostRequestTypeOutput,
  EmailAgentProcessingPostResponseTypeOutput,
} from "./definition";

/**
 * Email Agent Processing Repository Interface
 */
export interface EmailAgentProcessingRepository {
  processEmails(
    data: EmailAgentProcessingPostRequestTypeOutput,
    logger: EndpointLogger,
    userId?: string,
  ): Promise<ResponseType<EmailAgentProcessingPostResponseTypeOutput>>;
}

/**
 * Email Agent Processing Repository Implementation
 */
class EmailAgentProcessingRepositoryImpl
  implements EmailAgentProcessingRepository
{
  /**
   * Get emails for processing
   */
  private async getEmailsForProcessing(
    accountIds?: string[],
    emailIds?: string[],
    limit = 100,
  ): Promise<Array<{ id: string; subject: string; recipientEmail: string }>> {
    const conditions = [];

    if (emailIds && emailIds.length > 0) {
      conditions.push(or(...emailIds.map((id) => eq(emails.id, id))));
    }

    if (accountIds && accountIds.length > 0) {
      conditions.push(
        or(...accountIds.map((id) => eq(emails.imapAccountId, id))),
      );
    }

    const results = await db
      .select({
        id: emails.id,
        subject: emails.subject,
        recipientEmail: emails.recipientEmail,
      })
      .from(emails)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit);

    return results;
  }

  /**
   * Process emails through the agent pipeline
   */
  async processEmails(
    data: EmailAgentProcessingPostRequestTypeOutput,
    logger: EndpointLogger,
    userId?: string,
  ): Promise<ResponseType<EmailAgentProcessingPostResponseTypeOutput>> {
    try {
      logger.debug("api.agent.process.start", { data, userId });

      return await withTransaction(logger, async (tx) => {
        // Get emails to process
        const emailsToProcess = await this.getEmailsForProcessing(
          data.accountIds,
          data.emailIds,
          100, // Max batch size
        );

        if (emailsToProcess.length === 0) {
          return createSuccessResponse({
            processedEmails: 0,
            hardRulesResults: [],
            aiProcessingResults: [],
            confirmationRequests: [],
            errors: [],
            summary: {
              totalProcessed: 0,
              hardRulesApplied: 0,
              aiActionsRecommended: 0,
              confirmationsRequired: 0,
              errorsEncountered: 0,
            },
          });
        }

        // Create or update processing records
        const processingRecords: NewEmailAgentProcessing[] =
          emailsToProcess.map((email) => ({
            emailId: email.id,
            status: EmailAgentStatus.PENDING,
            priority: data.priority?.[0] || ProcessingPriority.NORMAL,
            processingAttempts: 0,
          }));

        // Insert processing records (or update if exists)
        await tx
          .insert(emailAgentProcessing)
          .values(processingRecords)
          .onConflictDoUpdate({
            target: emailAgentProcessing.emailId,
            set: {
              status: EmailAgentStatus.PENDING,
              priority: data.priority?.[0] || ProcessingPriority.NORMAL,
              processingAttempts: sql`${emailAgentProcessing.processingAttempts} + 1`,
              updatedAt: new Date(),
            },
          });

        // For now, return success with empty results
        // The actual processing will be done by cron jobs
        return createSuccessResponse({
          processedEmails: emailsToProcess.length,
          hardRulesResults: [],
          aiProcessingResults: [],
          confirmationRequests: [],
          errors: [],
          summary: {
            totalProcessed: emailsToProcess.length,
            hardRulesApplied: 0,
            aiActionsRecommended: 0,
            confirmationsRequired: 0,
            errorsEncountered: 0,
          },
        });
      });
    } catch (error) {
      logger.error("", error);
      return createErrorResponse(
        "imapErrors.agent.processing.error.server.description",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

/**
 * Email Agent Processing Repository Instance
 */
export const emailAgentProcessingRepository =
  new EmailAgentProcessingRepositoryImpl();
