/**
 * Emails Repository
 * Handles data operations for email metadata and analytics
 */

import "server-only";

import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { Countries, Languages } from "@/i18n/core/config";

import { SortOrder } from "../imap-client/enum";
import type {
  EmailGetGETRequestOutput,
  EmailGetGETResponseOutput,
} from "./[id]/definition";
import { emails } from "./db";
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
import { db } from "../../system/db";

// Define the proper type for locale to match standardized patterns
type CountryLanguage = `${Lowercase<Languages>}-${Countries}`;

/**
 * Emails Repository Interface
 */
export interface EmailsRepository {
  getEmails(
    data: EmailsListRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailsListResponseOutput>>;

  getEmailById(
    data: EmailGetGETRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailGetGETResponseOutput>>;
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
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailsListResponseOutput>> {
    try {
      logger.debug("Fetching emails with query", {
        ...data,
        userId: user.id,
      });

      // Extract filters and display options from nested structure
      const { search, status, type, dateRange } = data.filters || {};

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

      // Status filter
      if (status && status !== EmailStatusFilter.ALL) {
        const emailStatus = mapEmailStatusFilter(status);
        if (emailStatus) {
          whereConditions.push(eq(emails.status, emailStatus));
        }
      }

      // Type filter
      if (type && type !== EmailTypeFilter.ALL) {
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
            ilike(emails.recipientName ?? "", `%${search}%`),
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
        id: email.id,
        subject: email.subject,
        recipientEmail: email.recipientEmail,
        recipientName: email.recipientName,
        senderEmail: email.senderEmail,
        senderName: email.senderName,
        type: email.type,
        templateName: email.templateName,
        status: email.status,
        emailProvider: email.emailProvider,
        externalId: email.externalId,
        sentAt: email.sentAt?.toISOString() || null,
        deliveredAt: email.deliveredAt?.toISOString() || null,
        openedAt: email.openedAt?.toISOString() || null,
        clickedAt: email.clickedAt?.toISOString() || null,
        bouncedAt: email.bouncedAt?.toISOString() || null,
        unsubscribedAt: email.unsubscribedAt?.toISOString() || null,
        error: email.error,
        retryCount: Number(email.retryCount || 0),
        userId: email.userId,
        leadId: email.leadId,
        metadata: email.metadata || {},
        createdAt: email.createdAt.toISOString(),
        updatedAt: email.updatedAt.toISOString(),
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
          status: status || EmailStatusFilter.ALL,
          type: type || EmailTypeFilter.ALL,
          search,
          dateFrom,
          dateTo,
        },
      };

      return createSuccessResponse(response);
    } catch (error) {
      logger.error("Error fetching emails", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.emails.messages.list.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Get email by ID
   */
  async getEmailById(
    data: EmailGetGETRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailGetGETResponseOutput>> {
    try {
      logger.debug("Fetching email by ID", {
        id: (data as { id: string }).id,
        userId: user.id,
      });

      const [emailResult] = await db
        .select()
        .from(emails)
        .where(eq(emails.id, (data as { id: string }).id));

      if (!emailResult) {
        return createErrorResponse(
          "app.api.v1.core.emails.messages.id.get.errors.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
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
        sentAt: emailResult.sentAt?.toISOString() || null,
        deliveredAt: emailResult.deliveredAt?.toISOString() || null,
        openedAt: emailResult.openedAt?.toISOString() || null,
        clickedAt: emailResult.clickedAt?.toISOString() || null,
        bouncedAt: emailResult.bouncedAt?.toISOString() || null,
        unsubscribedAt: emailResult.unsubscribedAt?.toISOString() || null,
        error: emailResult.error,
        retryCount: Number(emailResult.retryCount || 0),
        userId: emailResult.userId,
        leadId: emailResult.leadId,
        metadata: emailResult.metadata || {},
        createdAt: emailResult.createdAt.toISOString(),
        updatedAt: emailResult.updatedAt.toISOString(),
      };

      return createSuccessResponse({ email });
    } catch (error) {
      logger.error("Error fetching email by ID", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.emails.messages.id.get.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }
}

export const emailsRepository = new EmailsRepositoryImpl();
