/**
 * IMAP Messages Repository
 * Data access layer for IMAP message management functionality
 */

import "server-only";

import { and, asc, count, desc, eq, gte, ilike, lte, or } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import { type Email, emails, imapAccounts } from "../../messages/db";
import {
  ImapAccountFilter,
  ImapMessageSortField,
  ImapMessageStatusFilter,
  ImapSyncStatus,
  SortOrder,
} from "../enum";
import type { ImapMessagesListGetResponseOutput } from "./list/definition";
import type { ImapMessageSyncPostResponseOutput } from "./sync/definition";

// Local type definitions to replace problematic imports
interface ImapMessageResponseType {
  id: string;
  subject: string;
  senderName: string | null;
  senderEmail: string;
  recipientName: string | null;
  recipientEmail: string;
  isRead: boolean;
  isFlagged: boolean;
  hasAttachments: boolean;
  messageSize: number | null;
  sentAt: string | null;
  accountId: string;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ImapMessageQueryType {
  accountId?: string;
  folderId?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface ImapMessageSyncType {
  accountId: string;
  folderId?: string;
  force?: boolean;
}

export interface ImapMessagesRepository {
  listMessages(
    data: ImapMessageQueryType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapMessagesListGetResponseOutput>>;

  getMessageById(
    data: { id: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapMessageResponseType>>;

  updateMessage(
    data: { messageId: string; updates: Partial<ImapMessageResponseType> },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapMessageResponseType>>;

  syncMessages(
    data: ImapMessageSyncType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapMessageSyncPostResponseOutput>>;

  updateMessageSyncStatus(
    data: { messageId: string; syncStatus: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ success: boolean }>>;

  updateMessageReadStatus(
    data: { messageId: string; isRead: boolean },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ success: boolean }>>;
}

/**
 * IMAP Messages Repository Implementation
 */
class ImapMessagesRepositoryImpl implements ImapMessagesRepository {
  /**
   * Format IMAP message for response
   */
  private formatMessageResponse(message: Email): ImapMessageResponseType {
    return {
      id: message.id,
      subject: message.subject || "",
      senderName: message.senderName || null,
      senderEmail: message.senderEmail,
      recipientName: message.recipientName || null,
      recipientEmail: message.recipientEmail,
      isRead: message.isRead || false,
      isFlagged: message.isFlagged || false,
      hasAttachments: message.hasAttachments || false,
      messageSize: message.messageSize || null,
      sentAt: message.sentAt?.toISOString() || null,
      accountId: message.imapAccountId || "",
      folderId: message.imapFolderId || null,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString(),
    };
  }

  /**
   * List IMAP messages with filtering and pagination
   */
  async listMessages(
    data: ImapMessageQueryType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapMessagesListGetResponseOutput>> {
    try {
      logger.debug(
        "app.api.v1.core.emails.imapClient.messages.list.info.start",
        {
          ...data,
          userId: user.id,
        },
      );

      const {
        page = 1,
        limit = 20,
        status = ImapMessageStatusFilter.ALL,
        sortBy: querySortBy = ImapMessageSortField.SENT_AT,
        sortOrder: querySortOrder = SortOrder.DESC,
        accountId,
        folderId,
        search,
        dateFrom,
        dateTo,
      } = data;

      const safeLimit = Math.min(limit, 100);
      const offset = (page - 1) * safeLimit;

      // Build where conditions
      const whereConditions = [];

      // Account filter - only filter if not "all"
      if (accountId && accountId !== (ImapAccountFilter.ALL as string)) {
        whereConditions.push(eq(emails.imapAccountId, accountId));
      }

      // Folder filter
      if (folderId) {
        whereConditions.push(eq(emails.imapFolderId, folderId));
      }

      // Search filter - comprehensive search across all relevant fields
      if (search) {
        const searchTerm = `%${search.toLowerCase()}%`;
        whereConditions.push(
          or(
            ilike(emails.subject, searchTerm),
            ilike(emails.bodyText, searchTerm),
            ilike(emails.bodyHtml, searchTerm),
            ilike(emails.senderEmail, searchTerm),
            ilike(emails.senderName, searchTerm),
            ilike(emails.recipientEmail, searchTerm),
            ilike(emails.recipientName, searchTerm),
          ),
        );
      }

      // Status filters
      if (status && status !== ImapMessageStatusFilter.ALL) {
        switch (status) {
          case ImapMessageStatusFilter.READ:
            whereConditions.push(eq(emails.isRead, true));
            break;
          case ImapMessageStatusFilter.UNREAD:
            whereConditions.push(eq(emails.isRead, false));
            break;
          case ImapMessageStatusFilter.FLAGGED:
            whereConditions.push(eq(emails.isFlagged, true));
            break;
          case ImapMessageStatusFilter.DRAFT:
            whereConditions.push(eq(emails.isDraft, true));
            break;
          case ImapMessageStatusFilter.UNFLAGGED:
            whereConditions.push(eq(emails.isFlagged, false));
            break;
          case ImapMessageStatusFilter.HAS_ATTACHMENTS:
            whereConditions.push(eq(emails.hasAttachments, true));
            break;
          case ImapMessageStatusFilter.NO_ATTACHMENTS:
            whereConditions.push(eq(emails.hasAttachments, false));
            break;
          case ImapMessageStatusFilter.DELETED:
            whereConditions.push(eq(emails.isDeleted, true));
            break;

          default:
            break;
        }
      }

      // Date range filter
      if (dateFrom) {
        whereConditions.push(gte(emails.sentAt, new Date(dateFrom)));
      }
      if (dateTo) {
        // Add one day to include the entire end date
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        whereConditions.push(lte(emails.sentAt, endDate));
      }

      const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Get total count
      const [{ count: totalCount }] = await db
        .select({ count: count() })
        .from(emails)
        .where(whereClause);

      // Determine sort order
      const sortBy = querySortBy;
      const sortOrder = querySortOrder;

      let orderByClause;
      switch (sortBy) {
        case ImapMessageSortField.SUBJECT:
          orderByClause =
            sortOrder === SortOrder.ASC
              ? asc(emails.subject)
              : desc(emails.subject);
          break;
        case ImapMessageSortField.CREATED_AT:
          orderByClause =
            sortOrder === SortOrder.ASC
              ? asc(emails.createdAt)
              : desc(emails.createdAt);
          break;
        case ImapMessageSortField.SENT_AT:
          orderByClause =
            sortOrder === SortOrder.ASC
              ? asc(emails.sentAt)
              : desc(emails.sentAt);
          break;
        case ImapMessageSortField.IS_READ:
          orderByClause =
            sortOrder === SortOrder.ASC
              ? asc(emails.isRead)
              : desc(emails.isRead);
          break;
        case ImapMessageSortField.IS_FLAGGED:
          orderByClause =
            sortOrder === SortOrder.ASC
              ? asc(emails.isFlagged)
              : desc(emails.isFlagged);
          break;
        case ImapMessageSortField.MESSAGE_SIZE:
          orderByClause =
            sortOrder === SortOrder.ASC
              ? asc(emails.messageSize)
              : desc(emails.messageSize);
          break;
        case ImapMessageSortField.RECIPIENT_NAME:
          orderByClause =
            sortOrder === SortOrder.ASC
              ? asc(emails.recipientName)
              : desc(emails.recipientName);
          break;
        case ImapMessageSortField.RECIPIENT_EMAIL:
          orderByClause =
            sortOrder === SortOrder.ASC
              ? asc(emails.recipientEmail)
              : desc(emails.recipientEmail);
          break;
        case ImapMessageSortField.SENDER_EMAIL:
          orderByClause =
            sortOrder === SortOrder.ASC
              ? asc(emails.senderEmail)
              : desc(emails.senderEmail);
          break;
        case ImapMessageSortField.SENDER_NAME:
          orderByClause =
            sortOrder === SortOrder.ASC
              ? asc(emails.senderName)
              : desc(emails.senderName);
          break;
        default: // sentAt
          orderByClause =
            sortOrder === SortOrder.ASC
              ? asc(emails.sentAt)
              : desc(emails.sentAt);
      }

      // Get messages with pagination
      const messages = await db
        .select()
        .from(emails)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset);

      const totalPages = Math.ceil(totalCount / limit);

      return createSuccessResponse({
        messages: messages.map((message) =>
          this.formatMessageResponse(message),
        ),
        total: totalCount,
        pageNumber: page,
        pageLimit: limit,
        totalPages,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error(
        "app.api.v1.core.emails.imapClient.messages.list.error.server",
        parsedError,
      );
      return createErrorResponse(
        "app.api.v1.core.emails.imapClient.messages.list.get.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  /**
   * Get IMAP message by ID
   */
  async getMessageById(
    data: { id: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapMessageResponseType>> {
    try {
      logger.debug("Getting IMAP message by ID", { id: data.id });

      const [message] = await db
        .select()
        .from(emails)
        .where(eq(emails.id, data.id))
        .limit(1);

      if (!message) {
        return createErrorResponse(
          "app.api.v1.core.emails.imapClient.imapErrors.messages.get.error.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse(this.formatMessageResponse(message));
    } catch (error) {
      logger.error("Error getting IMAP message by ID", error);
      return createErrorResponse(
        "app.api.v1.core.emails.imapClient.imapErrors.messages.get.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Update IMAP message
   */
  async updateMessage(
    data: { messageId: string; updates: Partial<ImapMessageResponseType> },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapMessageResponseType>> {
    try {
      logger.debug("Updating IMAP message", {
        messageId: data.messageId,
        updates: data.updates,
      });

      // Check if message exists
      const [existingMessage] = await db
        .select()
        .from(emails)
        .where(eq(emails.id, data.messageId))
        .limit(1);

      if (!existingMessage) {
        return createErrorResponse(
          "app.api.v1.core.emails.imapClient.imapErrors.messages.get.error.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Prepare update data - only allow certain fields to be updated
      const updateData: Partial<typeof emails.$inferInsert> = {};

      if (data.updates.isRead !== undefined) {
        updateData.isRead = data.updates.isRead;
      }

      if (data.updates.isFlagged !== undefined) {
        updateData.isFlagged = data.updates.isFlagged;
      }

      if (data.updates.subject !== undefined) {
        updateData.subject = data.updates.subject;
      }

      // Update the message
      const [updatedMessage] = await db
        .update(emails)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(emails.id, data.messageId))
        .returning();

      if (!updatedMessage) {
        return createErrorResponse(
          "app.api.v1.core.emails.imapClient.imapErrors.messages.get.error.server.title",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }

      return createSuccessResponse(this.formatMessageResponse(updatedMessage));
    } catch (error) {
      logger.error("Error updating IMAP message", error);
      return createErrorResponse(
        "app.api.v1.core.emails.imapClient.imapErrors.messages.get.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Sync IMAP messages
   */
  async syncMessages(
    data: ImapMessageSyncType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapMessageSyncPostResponseOutput>> {
    try {
      logger.debug("Syncing IMAP messages", { data, userId: user.id });

      // Implement actual message sync using the sync service
      const { imapSyncRepository } = await import("../sync-service/repository");

      if (data.accountId) {
        // Get the account first
        const account = await db
          .select()
          .from(imapAccounts)
          .where(eq(imapAccounts.id, data.accountId))
          .limit(1);

        if (account.length === 0) {
          return createErrorResponse(
            "app.api.v1.core.emails.imapClient.imapErrors.accounts.get.error.not_found.title",
            ErrorResponseTypes.NOT_FOUND,
          );
        }

        // Note: syncRepository methods expect full CountryLanguage format
        // but this repository uses Countries type - map accordingly
        // eslint-disable-next-line i18next/no-literal-string
        const fullLocale = `en-${locale}` as CountryLanguage;

        // Sync the specific account
        const syncResult = await imapSyncRepository.syncAccount(
          { account: account[0] },
          user,
          fullLocale,
          logger,
        );

        if (syncResult.success) {
          const rawErrors = syncResult.data.result?.results?.errors ?? [];
          return createSuccessResponse({
            success: true,
            message:
              "app.api.v1.core.emails.imapClient.messages.sync.response.success.message",
            results: {
              messagesProcessed:
                syncResult.data.result?.results?.messagesProcessed ?? 0,
              messagesAdded:
                syncResult.data.result?.results?.messagesAdded ?? 0,
              messagesUpdated:
                syncResult.data.result?.results?.messagesUpdated ?? 0,
              messagesDeleted:
                syncResult.data.result?.results?.messagesDeleted ?? 0,
              duration: syncResult.data.result?.results?.duration ?? 0,
            },
            errors: rawErrors.map((err) => ({
              code: err.errorType?.errorKey ?? "UNKNOWN_ERROR",
              message: err.message,
            })),
          });
        } else {
          return createErrorResponse(
            "app.api.v1.core.emails.imapClient.imapErrors.sync.message.failed",
            ErrorResponseTypes.INTERNAL_ERROR,
          );
        }
      } else {
        // Sync all accounts
        // eslint-disable-next-line i18next/no-literal-string
        const fullLocale = `en-${locale}` as CountryLanguage;

        const syncResult = await imapSyncRepository.syncAllAccounts(
          {},
          user,
          fullLocale,
          logger,
        );

        if (syncResult.success) {
          const rawErrors = syncResult.data.result?.results?.errors ?? [];
          return createSuccessResponse({
            success: true,
            message:
              "app.api.v1.core.emails.imapClient.messages.sync.response.success.message",
            results: {
              messagesProcessed:
                syncResult.data.result?.results?.messagesProcessed ?? 0,
              messagesAdded:
                syncResult.data.result?.results?.messagesAdded ?? 0,
              messagesUpdated:
                syncResult.data.result?.results?.messagesUpdated ?? 0,
              messagesDeleted:
                syncResult.data.result?.results?.messagesDeleted ?? 0,
              duration: syncResult.data.result?.results?.duration ?? 0,
            },
            errors: rawErrors.map((err) => ({
              code: err.errorType?.errorKey ?? "UNKNOWN_ERROR",
              message: err.message,
            })),
          });
        } else {
          return createErrorResponse(
            "app.api.v1.core.emails.imapClient.imapErrors.sync.message.failed",
            ErrorResponseTypes.INTERNAL_ERROR,
          );
        }
      }
    } catch (error) {
      logger.error("Error syncing IMAP messages", error);
      return createErrorResponse(
        "app.api.v1.core.emails.imapClient.imapErrors.sync.post.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Update message sync status
   */
  async updateMessageSyncStatus(
    data: { messageId: string; syncStatus: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ success: boolean }>> {
    try {
      logger.debug("Updating message sync status", {
        messageId: data.messageId,
        syncStatus: data.syncStatus,
      });

      // Validate sync status is a valid enum value
      const validStatuses = [
        ImapSyncStatus.PENDING,
        ImapSyncStatus.SYNCING,
        ImapSyncStatus.SYNCED,
        ImapSyncStatus.ERROR,
      ];

      const syncStatus = validStatuses.includes(
        data.syncStatus as typeof ImapSyncStatus.PENDING,
      )
        ? (data.syncStatus as
            | typeof ImapSyncStatus.PENDING
            | typeof ImapSyncStatus.SYNCING
            | typeof ImapSyncStatus.SYNCED
            | typeof ImapSyncStatus.ERROR)
        : ImapSyncStatus.PENDING;

      const [updatedMessage] = await db
        .update(emails)
        .set({
          syncStatus,
          lastSyncAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(emails.id, data.messageId))
        .returning();

      if (!updatedMessage) {
        return createErrorResponse(
          "app.api.v1.core.emails.imapClient.imapErrors.messages.get.error.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse({ success: true });
    } catch (error) {
      logger.error("Error updating message sync status", error);
      return createErrorResponse(
        "app.api.v1.core.emails.imapClient.imapErrors.messages.get.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Mark message as read/unread
   */
  async updateMessageReadStatus(
    data: { messageId: string; isRead: boolean },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ success: boolean }>> {
    try {
      logger.debug("Updating message read status", {
        messageId: data.messageId,
        isRead: data.isRead,
      });

      const [updatedMessage] = await db
        .update(emails)
        .set({
          isRead: data.isRead,
          updatedAt: new Date(),
        })
        .where(eq(emails.id, data.messageId))
        .returning();

      if (!updatedMessage) {
        return createErrorResponse(
          "app.api.v1.core.emails.imapClient.imapErrors.messages.get.error.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse({ success: true });
    } catch (error) {
      logger.error("Error updating message read status", error);
      return createErrorResponse(
        "app.api.v1.core.emails.imapClient.imapErrors.messages.get.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

/**
 * Export singleton instance
 */
export const imapMessagesRepository = new ImapMessagesRepositoryImpl();
