/**
 * Emails Repository
 * Handles data operations for email metadata and analytics
 */

import "server-only";

import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { db } from "../../system/db";
import { SortOrder } from "../imap-client/enum";
import { MessageChannel, MessageChannelFilter } from "../messaging/enum";
import type {
  EmailGetGETResponseOutput,
  EmailGetGETUrlVariablesOutput,
} from "./[id]/definition";
import { emails, type NewEmail } from "./db";
import {
  EmailSortField,
  EmailStatusFilter,
  EmailTypeFilter,
  mapEmailStatusFilter,
  mapEmailTypeFilter,
} from "./enum";
import type {
  EmailsListRequestOutput,
  EmailsListResponseOutput,
} from "./list/definition";

/**
 * Emails Repository Interface
 */
export interface EmailsRepository {
  getEmails(
    data: EmailsListRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailsListResponseOutput>>;

  getEmailById(
    urlPathParams: EmailGetGETUrlVariablesOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailGetGETResponseOutput>>;

  create(
    data: NewEmail,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ id: string }>>;
}

/**
 * Emails Repository Implementation
 */
class EmailsRepositoryImpl implements EmailsRepository {
  /**
   * Get paginated list of emails with filtering and sorting
   */
  async getEmails(
    data: EmailsListRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailsListResponseOutput>> {
    try {
      logger.debug("Fetching emails with query", {
        ...data,
        userId: user.id,
      });

      // Extract filters and display options from nested structure
      const { search, status, type, channel } = data.filters || {};
      const dateRange = (
        data.filters as {
          dateRange?: { dateFrom?: string; dateTo?: string } | null | undefined;
        }
      )?.dateRange;

      const {
        page = 1,
        limit = 20,
        sortBy,
        sortOrder,
      } = data.displayOptions || {};

      // Extract date range if provided
      const dateFrom = dateRange?.dateFrom;
      const dateTo = dateRange?.dateTo;

      // Build where conditions
      const whereConditions = [];

      // Channel filter
      if (channel && channel !== MessageChannelFilter.ANY) {
        // Map MessageChannelFilter value to MessageChannel value
        const channelMap: Record<string, string> = {
          [MessageChannelFilter.EMAIL]: MessageChannel.EMAIL,
          [MessageChannelFilter.SMS]: MessageChannel.SMS,
          [MessageChannelFilter.WHATSAPP]: MessageChannel.WHATSAPP,
          [MessageChannelFilter.TELEGRAM]: MessageChannel.TELEGRAM,
        };
        const emailChannel = channelMap[channel];
        if (emailChannel) {
          whereConditions.push(
            eq(
              emails.channel,
              emailChannel as (typeof emails.channel)["_"]["data"],
            ),
          );
        }
      }

      // Status filter
      if (status && status !== EmailStatusFilter.ANY) {
        const emailStatus = mapEmailStatusFilter(status);
        if (emailStatus) {
          whereConditions.push(eq(emails.status, emailStatus));
        }
      }

      // Type filter
      if (type && type !== EmailTypeFilter.ANY) {
        const emailType = mapEmailTypeFilter(type);
        if (emailType) {
          whereConditions.push(eq(emails.type, emailType));
        }
      }

      // Search filter
      if (search) {
        whereConditions.push(
          or(
            ilike(emails.subject, `%${search}%`),
            ilike(emails.recipientEmail, `%${search}%`),
            sql`${emails.recipientName} ilike ${`%${search}%`}`,
            ilike(emails.senderEmail, `%${search}%`),
          ),
        );
      }

      // Date range filter
      if (dateFrom) {
        whereConditions.push(sql`${emails.createdAt} >= ${dateFrom}`);
      }
      if (dateTo) {
        whereConditions.push(sql`${emails.createdAt} <= ${dateTo}`);
      }

      const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Build sort order
      const getSortColumn = ():
        | typeof emails.subject
        | typeof emails.recipientEmail
        | typeof emails.recipientName
        | typeof emails.type
        | typeof emails.status
        | typeof emails.sentAt
        | typeof emails.createdAt => {
        switch (sortBy) {
          case EmailSortField.SUBJECT:
            return emails.subject;
          case EmailSortField.RECIPIENT_EMAIL:
            return emails.recipientEmail;
          case EmailSortField.RECIPIENT_NAME:
            return emails.recipientName;
          case EmailSortField.TYPE:
            return emails.type;
          case EmailSortField.STATUS:
            return emails.status;
          case EmailSortField.SENT_AT:
            return emails.sentAt;
          case EmailSortField.CREATED_AT:
          default:
            return emails.createdAt;
        }
      };

      const sortColumn = getSortColumn();
      const orderBy =
        sortOrder === SortOrder.ASC ? sortColumn : desc(sortColumn);

      // Get total count
      const [totalResult] = await db
        .select({ count: count() })
        .from(emails)
        .where(whereClause);

      const total = Number(totalResult.count);
      const totalPages = Math.ceil(total / limit);
      const offset = (page - 1) * limit;

      // Get emails
      const emailsResult = await db
        .select()
        .from(emails)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

      const emailsList = emailsResult.map((email) => ({
        emailCore: {
          id: email.id,
          subject: email.subject,
          status: email.status,
          channel: email.channel,
        },
        emailParties: {
          recipient: {
            recipientEmail: email.recipientEmail,
            recipientName: email.recipientName,
          },
          sender: {
            senderEmail: email.senderEmail,
            senderName: email.senderName,
          },
        },
        emailMetadata: {
          type: email.type,
          templateName: email.templateName,
          emailProvider: email.emailProvider,
          externalId: email.externalId,
        },
        emailEngagement: {
          sentAt: email.sentAt ?? null,
          deliveredAt: email.deliveredAt ?? null,
          openedAt: email.openedAt ?? null,
          clickedAt: email.clickedAt ?? null,
        },
        technicalDetails: {
          retryCount: Number(email.retryCount || 0),
          error: email.error,
          associatedIds: {
            userId: email.userId,
            leadId: email.leadId,
          },
          timestamps: {
            createdAt: email.createdAt,
            updatedAt: email.updatedAt,
          },
        },
      }));

      const response = {
        emails: emailsList,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
        filters: {
          status: status || EmailStatusFilter.ANY,
          type: type || EmailTypeFilter.ANY,
          search,
          dateFrom,
          dateTo,
        },
      };

      return success(response);
    } catch (error) {
      logger.error("Error fetching emails", parseError(error));
      return fail({
        message: "app.api.emails.messages.list.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Get email by ID
   */
  async getEmailById(
    urlPathParams: EmailGetGETUrlVariablesOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailGetGETResponseOutput>> {
    try {
      const emailId = urlPathParams.id;
      logger.debug("Fetching email by ID", {
        id: emailId,
        userId: user.id,
      });

      const [emailResult] = await db
        .select()
        .from(emails)
        .where(eq(emails.id, emailId));

      if (!emailResult) {
        return fail({
          message: "app.api.emails.messages.id.get.errors.not_found.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const email = {
        id: emailResult.id,
        subject: emailResult.subject,
        recipientEmail: emailResult.recipientEmail,
        recipientName: emailResult.recipientName,
        senderEmail: emailResult.senderEmail,
        senderName: emailResult.senderName,
        type: emailResult.type,
        templateName: emailResult.templateName,
        status: emailResult.status,
        emailProvider: emailResult.emailProvider,
        externalId: emailResult.externalId,
        sentAt: emailResult.sentAt ?? null,
        deliveredAt: emailResult.deliveredAt ?? null,
        openedAt: emailResult.openedAt ?? null,
        clickedAt: emailResult.clickedAt ?? null,
        bouncedAt: emailResult.bouncedAt ?? null,
        unsubscribedAt: emailResult.unsubscribedAt ?? null,
        error: emailResult.error,
        retryCount: Number(emailResult.retryCount || 0),
        userId: emailResult.userId,
        leadId: emailResult.leadId,
        metadata: emailResult.metadata || {},
        createdAt: emailResult.createdAt,
        updatedAt: emailResult.updatedAt,
      };

      return success({ email });
    } catch (error) {
      logger.error("Error fetching email by ID", parseError(error));
      return fail({
        message: "app.api.emails.messages.id.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Create a new email record
   */
  async create(
    data: NewEmail,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ id: string }>> {
    try {
      const [result] = await db
        .insert(emails)
        .values(data)
        .returning({ id: emails.id });

      if (!result) {
        return fail({
          message: "app.api.emails.messages.list.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({ id: result.id });
    } catch (error) {
      logger.error("Error creating email record", parseError(error));
      return fail({
        message: "app.api.emails.messages.list.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}

export const emailsRepository = new EmailsRepositoryImpl();

// Export as emailRepository for backwards compatibility with seeds
export const emailRepository = emailsRepository;
