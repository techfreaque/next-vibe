/**
 * Email Agent Status Repository
 * Data access layer for email agent status functionality
 */

import "server-only";

import { and, count, desc, eq, gte, lte, or } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import {
  emailAgentProcessing,
  humanConfirmationRequests,
  toDbEmailAgentStatus,
} from "../db";
import type { ProcessingPriority } from "../enum";
import {
  EmailAgentSortField,
  EmailAgentStatus,
  EmailAgentStatusFilter,
  SortOrder,
} from "../enum";
import type {
  EmailAgentStatusGetRequestTypeOutput,
  EmailAgentStatusGetResponseTypeOutput,
} from "./definition";

// Type mapping function for status conversion
function mapStatusToFilter(
  status: keyof typeof EmailAgentStatus,
): keyof typeof EmailAgentStatusFilter {
  // EmailAgentStatus and EmailAgentStatusFilter have the same values except for "ALL"
  // Safe conversion since the enum values are identical
  switch (status) {
    case EmailAgentStatus.PENDING:
      return EmailAgentStatusFilter.PENDING;
    case EmailAgentStatus.PROCESSING:
      return EmailAgentStatusFilter.PROCESSING;
    case EmailAgentStatus.HARD_RULES_COMPLETE:
      return EmailAgentStatusFilter.HARD_RULES_COMPLETE;
    case EmailAgentStatus.AI_PROCESSING:
      return EmailAgentStatusFilter.AI_PROCESSING;
    case EmailAgentStatus.AWAITING_CONFIRMATION:
      return EmailAgentStatusFilter.AWAITING_CONFIRMATION;
    case EmailAgentStatus.COMPLETED:
      return EmailAgentStatusFilter.COMPLETED;
    case EmailAgentStatus.FAILED:
      return EmailAgentStatusFilter.FAILED;
    case EmailAgentStatus.SKIPPED:
      return EmailAgentStatusFilter.SKIPPED;
    default:
      return EmailAgentStatusFilter.PENDING;
  }
}

function mapFilterToStatus(
  filter: keyof typeof EmailAgentStatusFilter,
): keyof typeof EmailAgentStatus | null {
  if (filter === EmailAgentStatusFilter.ALL) {
    return null; // No filtering
  }
  // Safe conversion since the enum values are identical (except ALL)
  switch (filter) {
    case EmailAgentStatusFilter.PENDING:
      return EmailAgentStatus.PENDING;
    case EmailAgentStatusFilter.PROCESSING:
      return EmailAgentStatus.PROCESSING;
    case EmailAgentStatusFilter.HARD_RULES_COMPLETE:
      return EmailAgentStatus.HARD_RULES_COMPLETE;
    case EmailAgentStatusFilter.AI_PROCESSING:
      return EmailAgentStatus.AI_PROCESSING;
    case EmailAgentStatusFilter.AWAITING_CONFIRMATION:
      return EmailAgentStatus.AWAITING_CONFIRMATION;
    case EmailAgentStatusFilter.COMPLETED:
      return EmailAgentStatus.COMPLETED;
    case EmailAgentStatusFilter.FAILED:
      return EmailAgentStatus.FAILED;
    case EmailAgentStatusFilter.SKIPPED:
      return EmailAgentStatus.SKIPPED;
    default:
      return EmailAgentStatus.PENDING;
  }
}

/**
 * Email Agent Status Repository Interface
 */
export interface EmailAgentStatusRepository {
  getProcessingStatus(
    data: EmailAgentStatusGetRequestTypeOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailAgentStatusGetResponseTypeOutput>>;
}

/**
 * Email Agent Status Repository Implementation
 */
class EmailAgentStatusRepositoryImpl implements EmailAgentStatusRepository {
  /**
   * Get processing status for emails
   */
  async getProcessingStatus(
    data: EmailAgentStatusGetRequestTypeOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailAgentStatusGetResponseTypeOutput>> {
    try {
      logger.debug("Getting email agent status", { data });

      // Build query conditions
      const conditions = [];

      if (data.emailId) {
        conditions.push(
          eq(emailAgentProcessing.emailId, data.emailId as string),
        );
      }

      if (data.status && (data.status as EmailAgentStatusFilter[]).length > 0) {
        const statusFilters = (data.status as EmailAgentStatusFilter[])
          .filter((s) => s !== EmailAgentStatusFilter.ALL)
          .map(mapFilterToStatus)
          .filter((s): s is keyof typeof EmailAgentStatus => s !== null);

        if (statusFilters.length > 0) {
          conditions.push(
            or(
              ...statusFilters.map((status) =>
                eq(emailAgentProcessing.status, toDbEmailAgentStatus(status)),
              ),
            ) as ReturnType<typeof eq>,
          );
        }
      }

      if (data.priority && data.priority !== "all") {
        conditions.push(
          eq(
            emailAgentProcessing.priority,
            data.priority as keyof typeof ProcessingPriority,
          ),
        );
      }

      if (data.dateFrom) {
        conditions.push(
          gte(
            emailAgentProcessing.createdAt,
            new Date(data.dateFrom as string),
          ),
        );
      }

      if (data.dateTo) {
        conditions.push(
          lte(emailAgentProcessing.createdAt, new Date(data.dateTo as string)),
        );
      }

      // Get total count
      const [totalResult] = await db
        .select({ count: count() })
        .from(emailAgentProcessing)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      const total = totalResult?.count || 0;
      const limit = (data.limit as number) || 50;
      const totalPages = Math.ceil(total / limit);

      // Get paginated results
      const getSortField = ():
        | typeof emailAgentProcessing.createdAt
        | typeof emailAgentProcessing.lastProcessedAt
        | typeof emailAgentProcessing.priority
        | typeof emailAgentProcessing.status
        | typeof emailAgentProcessing.emailId => {
        const primarySortField =
          data.sortBy && (data.sortBy as EmailAgentSortField[]).length > 0
            ? (data.sortBy as EmailAgentSortField[])[0]
            : EmailAgentSortField.CREATED_AT;
        switch (primarySortField) {
          case EmailAgentSortField.CREATED_AT:
            return emailAgentProcessing.createdAt;
          case EmailAgentSortField.LAST_PROCESSED_AT:
            return emailAgentProcessing.lastProcessedAt;
          case EmailAgentSortField.PRIORITY:
            return emailAgentProcessing.priority;
          case EmailAgentSortField.STATUS:
            return emailAgentProcessing.status;
          case EmailAgentSortField.EMAIL_ID:
            return emailAgentProcessing.emailId;
          default:
            return emailAgentProcessing.createdAt;
        }
      };

      const sortField = getSortField();
      const orderBy =
        data.sortOrder === SortOrder.ASC ? sortField : desc(sortField);

      const results = await db
        .select()
        .from(emailAgentProcessing)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(orderBy)
        .limit(limit)
        .offset((((data.page as number) || 1) - 1) * limit);

      // Get confirmation requests for these emails
      const emailIds = results.map((r) => r.emailId);
      const confirmationRequests =
        emailIds.length > 0
          ? await db
              .select()
              .from(humanConfirmationRequests)
              .where(
                or(
                  ...emailIds.map((id) =>
                    eq(humanConfirmationRequests.emailId, id),
                  ),
                ),
              )
          : [];

      // Map results to response format
      const items = results.map((processing) => ({
        emailId: processing.emailId,
        status: mapStatusToFilter(
          processing.status as keyof typeof EmailAgentStatus,
        ),
        lastProcessedAt: processing.lastProcessedAt?.toISOString() || null,
        hardRulesResult: processing.hardRulesResult || undefined,
        aiProcessingResult: processing.aiProcessingResult || undefined,
        confirmationRequests: confirmationRequests
          .filter((cr) => cr.emailId === processing.emailId)
          .map((cr) => ({
            id: cr.id,
            emailId: cr.emailId,
            actionType: cr.actionType,
            toolCall: cr.toolCall
              ? {
                  toolType: cr.toolCall.toolType,
                  requiresConfirmation:
                    cr.toolCall.requiresConfirmation.toString(),
                  reasoning: cr.toolCall.reasoning,
                  confidence: cr.toolCall.confidence.toString(),
                  ...cr.toolCall.parameters,
                }
              : undefined,
            reasoning: cr.reasoning,
            requestedAt: cr.requestedAt.toISOString(),
            expiresAt: cr.expiresAt.toISOString(),
            status: cr.status,
            metadata: cr.metadata || undefined,
          })),
        errors: (processing.errors as string[]) || [],
        priority: processing.priority,
        createdAt: processing.createdAt.toISOString(),
        updatedAt: processing.updatedAt.toISOString(),
      }));

      return createSuccessResponse({
        items,
        total,
        page: (data.page as number) || 1,
        limit: (data.limit as number) || 50,
        totalPages,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error("Failed to get email agent status", {
        error: errorMessage,
        data,
      });
      return createErrorResponse(
        "app.api.v1.core.agent.status.get.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: errorMessage },
      );
    }
  }
}

/**
 * Email Agent Status Repository Instance
 */
export const emailAgentStatusRepository = new EmailAgentStatusRepositoryImpl();
