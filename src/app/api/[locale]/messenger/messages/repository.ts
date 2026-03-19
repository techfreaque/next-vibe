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
import type { CountryLanguage } from "@/i18n/core/config";

import { db } from "../../system/db";
import { MessageChannel, MessengerChannelFilter } from "../accounts/enum";
import type {
  EmailGetGETResponseOutput,
  EmailGetGETUrlVariablesOutput,
} from "./[id]/definition";
import { emails, type NewEmail } from "./db";
import {
  MessageSortField,
  MessageStatusFilter,
  MessageTypeFilter,
  SortOrder,
  mapMessageStatusFilter,
  mapMessageTypeFilter,
} from "./enum";
import type {
  EmailsListRequestOutput,
  EmailsListResponseOutput,
} from "./list/definition";
import { scopedTranslation } from "./list/i18n";

interface CreateEmailResult {
  id: string;
}

/**
 * Emails Repository Implementation
 */
export class EmailsRepository {
  /**
   * Get paginated list of emails with filtering and sorting
   */
  static async getEmails(
    data: EmailsListRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
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
      if (channel && channel !== MessengerChannelFilter.ANY) {
        // Map MessengerChannelFilter value to MessageChannel value
        const channelMap: Record<string, string> = {
          [MessengerChannelFilter.EMAIL]: MessageChannel.EMAIL,
          [MessengerChannelFilter.SMS]: MessageChannel.SMS,
          [MessengerChannelFilter.WHATSAPP]: MessageChannel.WHATSAPP,
          [MessengerChannelFilter.TELEGRAM]: MessageChannel.TELEGRAM,
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
      if (status && status !== MessageStatusFilter.ANY) {
        const emailStatus = mapMessageStatusFilter(status);
        if (emailStatus) {
          whereConditions.push(eq(emails.status, emailStatus));
        }
      }

      // Type filter
      if (type && type !== MessageTypeFilter.ANY) {
        const emailType = mapMessageTypeFilter(type);
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
          case MessageSortField.SUBJECT:
            return emails.subject;
          case MessageSortField.RECIPIENT_EMAIL:
            return emails.recipientEmail;
          case MessageSortField.RECIPIENT_NAME:
            return emails.recipientName;
          case MessageSortField.TYPE:
            return emails.type;
          case MessageSortField.STATUS:
            return emails.status;
          case MessageSortField.SENT_AT:
            return emails.sentAt;
          case MessageSortField.CREATED_AT:
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
          status: status || MessageStatusFilter.ANY,
          type: type || MessageTypeFilter.ANY,
          search,
          dateFrom,
          dateTo,
        },
      };

      return success(response);
    } catch (error) {
      logger.error("Error fetching emails", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Get email by ID
   */
  static async getEmailById(
    urlPathParams: EmailGetGETUrlVariablesOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<EmailGetGETResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
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
          message: t("errors.notFound.title"),
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
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Create a new email record
   */
  static async create(
    data: NewEmail,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CreateEmailResult>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [result] = await db
        .insert(emails)
        .values(data)
        .returning({ id: emails.id });

      if (!result) {
        return fail({
          message: t("errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({ id: result.id });
    } catch (error) {
      logger.error("Error creating email record", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
