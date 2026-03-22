/**
 * IMAP Messages Repository
 * Data access layer for IMAP message management functionality
 */

import "server-only";

import { and, asc, count, desc, eq, gte, ilike, lte, or } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { type Email, emails } from "@/app/api/[locale]/messenger/messages/db";
import {
  MessageSyncStatus,
  MessageSyncStatusDB,
} from "@/app/api/[locale]/messenger/messages/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { messengerAccounts } from "../../../../accounts/db";
import { messengerFolders } from "../../../../messages/db";
import { toImapShape } from "../db";
import { smtpProvider } from "../../../../providers/email/smtp";
import {
  ImapAccountFilter,
  ImapMessageSortField,
  ImapMessageStatusFilter,
  SortOrder,
} from "../enum";
import { scopedTranslation } from "./i18n";

interface ImapMessageResponseType {
  id: string;
  subject: string;
  senderName: string | null;
  senderEmail: string;
  recipientName: string | null;
  recipientEmail: string;
  sentAt: string | null;
  receivedAt: string | null;
  isRead: boolean;
  isFlagged: boolean;
  hasAttachments: boolean;
  folderName: string;
  accountId?: string;
  size?: number;
  messageId?: string;
  uid?: number;
  folderId?: string;
  bodyText?: string;
  bodyHtml?: string;
  headers?: Record<string, string>;
  isDeleted?: boolean;
  isDraft?: boolean;
  isAnswered?: boolean;
  inReplyTo?: string;
  references?: string;
  threadId?: string;
  messageSize?: number;
  attachmentCount?: number;
  lastSyncAt?: string;
  syncStatus?: string;
  syncError?: string;
  createdAt: string;
  updatedAt: string;
}

interface ImapMessagesListResponseType {
  messages: ImapMessageResponseType[];
  total: number;
  pageNumber: number;
  pageLimit: number;
  totalPages: number;
}

interface ImapMessageWithWrapperType {
  message: ImapMessageResponseType;
}

interface ImapSyncResultType {
  success: boolean;
  message: string;
  results: {
    messagesProcessed: number;
    messagesAdded: number;
    messagesUpdated: number;
    messagesDeleted: number;
    duration: number;
  };
  errors: Array<{ code: string; message: string }>;
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
  threadId?: string;
}

interface ImapMessageSyncType {
  accountId: string;
  folderId?: string;
  force?: boolean;
}

interface ImapMessageStatusResult {
  success: boolean;
}

/**
 * IMAP Messages Repository
 */
export class ImapMessagesRepository {
  /**
   * Format IMAP message for response
   */
  private static formatMessageResponse(
    message: Email,
    folderName = "",
  ): ImapMessageResponseType {
    return {
      id: message.id,
      subject: message.subject || "",
      senderName: message.senderName || null,
      senderEmail: message.senderEmail,
      recipientName: message.recipientName || null,
      recipientEmail: message.recipientEmail,
      sentAt: message.sentAt?.toISOString() || null,
      receivedAt: message.deliveredAt?.toISOString() || null,
      isRead: message.isRead || false,
      isFlagged: message.isFlagged || false,
      hasAttachments: message.hasAttachments || false,
      folderName,
      accountId: message.accountId ?? undefined,
      size: message.messageSize ?? undefined,
      messageId: message.messageId ?? undefined,
      uid: message.uid ?? undefined,
      folderId: message.folderId ?? undefined,
      bodyText: message.bodyText ?? undefined,
      bodyHtml: message.bodyHtml ?? undefined,
      headers: message.headers ?? undefined,
      isDeleted: message.isDeleted ?? undefined,
      isDraft: message.isDraft ?? undefined,
      isAnswered: message.isAnswered ?? undefined,
      inReplyTo: message.inReplyTo ?? undefined,
      references: message.references ?? undefined,
      threadId: message.threadId ?? undefined,
      messageSize: message.messageSize ?? undefined,
      attachmentCount: message.attachmentCount ?? undefined,
      lastSyncAt: message.lastSyncAt?.toISOString(),
      syncStatus: message.syncStatus ?? undefined,
      syncError: message.syncError ?? undefined,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString(),
    };
  }

  /**
   * List IMAP messages with filtering and pagination
   */
  static async listMessages(
    data: ImapMessageQueryType,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapMessagesListResponseType>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      logger.debug("Listing IMAP messages", {
        ...data,
        userId: user.id,
      });

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
        threadId,
      } = data;

      const safeLimit = Math.min(limit, 100);
      const offset = (page - 1) * safeLimit;

      // Build where conditions
      const whereConditions = [];

      // Account filter - only filter if not "all"
      if (accountId && accountId !== (ImapAccountFilter.ALL as string)) {
        whereConditions.push(eq(emails.accountId, accountId));
      }

      // Folder filter
      if (folderId) {
        whereConditions.push(eq(emails.folderId, folderId));
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

      // Thread filter
      if (threadId) {
        whereConditions.push(eq(emails.threadId, threadId));
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

      // Get messages with pagination (join folder for folderName)
      const messagesWithFolders = await db
        .select({
          email: emails,
          folderName: messengerFolders.name,
        })
        .from(emails)
        .leftJoin(messengerFolders, eq(emails.folderId, messengerFolders.id))
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(safeLimit)
        .offset(offset);

      const totalPages = Math.ceil(totalCount / safeLimit);

      return success({
        messages: messagesWithFolders.map(({ email: message, folderName }) =>
          ImapMessagesRepository.formatMessageResponse(
            message,
            folderName ?? "",
          ),
        ),
        total: totalCount,
        pageNumber: page,
        pageLimit: limit,
        totalPages,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to list IMAP messages", parsedError);
      return fail({
        message: t("errors.list.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  /**
   * Get IMAP message by ID
   */
  static async getMessageById(
    data: { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapMessageResponseType>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      logger.debug("Getting IMAP message by ID", { id: data.id });

      const [row] = await db
        .select({ email: emails, folderName: messengerFolders.name })
        .from(emails)
        .leftJoin(messengerFolders, eq(emails.folderId, messengerFolders.id))
        .where(eq(emails.id, data.id))
        .limit(1);

      if (!row) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(
        ImapMessagesRepository.formatMessageResponse(
          row.email,
          row.folderName ?? "",
        ),
      );
    } catch (error) {
      logger.error("Error getting IMAP message by ID", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update IMAP message
   */
  static async updateMessage(
    data: { messageId: string; updates: Partial<ImapMessageResponseType> },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapMessageResponseType>> {
    const { t } = scopedTranslation.scopedT(locale);
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
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
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

      if (data.updates.isDeleted !== undefined) {
        updateData.isDeleted = data.updates.isDeleted;
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
        return fail({
          message: t("errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success(
        ImapMessagesRepository.formatMessageResponse(updatedMessage),
      );
    } catch (error) {
      logger.error("Error updating IMAP message", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get IMAP message by ID with formatted response
   */
  static async getMessageByIdFormatted(
    data: { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapMessageWithWrapperType>> {
    logger.debug("Getting message by ID", { id: data.id });
    const result = await ImapMessagesRepository.getMessageById(
      data,
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({
      message: result.data,
    });
  }

  /**
   * Update IMAP message with formatted response
   */
  static async updateMessageFormatted(
    data: { messageId: string; updates: Partial<ImapMessageResponseType> },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapMessageWithWrapperType>> {
    const result = await ImapMessagesRepository.updateMessage(
      data,
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({
      message: result.data,
    });
  }

  /**
   * Sync IMAP messages
   */
  static async syncMessages(
    data: ImapMessageSyncType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapSyncResultType>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      logger.debug("Syncing IMAP messages", {
        accountId: data.accountId,
        folderId: data.folderId,
        force: data.force,
      });

      // Implement actual message sync using the sync service
      const { ImapSyncRepository } = await import("../sync-service/repository");

      if (data.accountId) {
        // Get the account from messenger_accounts (unified table)
        const [messengerAccount] = await db
          .select()
          .from(messengerAccounts)
          .where(eq(messengerAccounts.id, data.accountId))
          .limit(1);

        if (!messengerAccount) {
          return fail({
            message: t("errors.accountNotFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        const account = toImapShape(messengerAccount);

        // Sync the specific account
        const syncResult = await ImapSyncRepository.syncAccount(
          account,
          logger,
          locale,
        );

        if (syncResult.success) {
          const rawErrors = syncResult.data.result?.results?.errors ?? [];
          return success({
            success: true,
            message: t("errors.syncSuccess.message"),
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
        }
        return fail({
          message: t("errors.syncFailed.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      // Sync all accounts
      const syncResult = await ImapSyncRepository.syncAllAccounts(
        logger,
        locale,
      );

      if (syncResult.success) {
        const rawErrors = syncResult.data.result?.results?.errors ?? [];
        return success({
          success: true,
          message: t("errors.syncSuccess.message"),
          results: {
            messagesProcessed:
              syncResult.data.result?.results?.messagesProcessed ?? 0,
            messagesAdded: syncResult.data.result?.results?.messagesAdded ?? 0,
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
      }
      return fail({
        message: t("errors.syncFailed.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    } catch (error) {
      logger.error("Error syncing IMAP messages", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update message sync status
   */
  static async updateMessageSyncStatus(
    data: { messageId: string; syncStatus: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapMessageStatusResult>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      logger.debug("Updating message sync status", {
        messageId: data.messageId,
        syncStatus: data.syncStatus,
      });

      // Validate sync status is a valid enum value
      const matchedStatus = MessageSyncStatusDB.find(
        (s) => s === data.syncStatus,
      );
      const syncStatus = matchedStatus ?? MessageSyncStatus.PENDING;

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
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({ success: true });
    } catch (error) {
      logger.error("Error updating message sync status", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Mark message as read/unread — updates DB and syncs to IMAP via provider
   */
  static async updateMessageReadStatus(
    data: { messageId: string; isRead: boolean },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapMessageStatusResult>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      logger.debug("Updating message read status", {
        messageId: data.messageId,
        isRead: data.isRead,
      });

      // Fetch the email to get IMAP metadata for provider sync
      const [existing] = await db
        .select({
          accountId: emails.accountId,
          uid: emails.uid,
          folderId: emails.folderId,
        })
        .from(emails)
        .where(eq(emails.id, data.messageId))
        .limit(1);

      // Update in DB
      const [updatedMessage] = await db
        .update(emails)
        .set({
          isRead: data.isRead,
          updatedAt: new Date(),
        })
        .where(eq(emails.id, data.messageId))
        .returning();

      if (!updatedMessage) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Sync to IMAP via provider if we have IMAP metadata
      if (existing?.accountId && existing.uid && existing.folderId) {
        const [folder] = await db
          .select({ path: messengerFolders.path })
          .from(messengerFolders)
          .where(eq(messengerFolders.id, existing.folderId))
          .limit(1);

        if (folder) {
          const markResult = await smtpProvider.markRead(
            existing.accountId,
            existing.uid,
            folder.path,
            data.isRead,
            logger,
            locale,
          );
          if (!markResult.success) {
            // Non-fatal — DB already updated, just log the IMAP sync failure
            logger.warn("IMAP markRead sync failed (DB already updated)", {
              messageId: data.messageId,
              error: markResult.message,
            });
          }
        }
      }

      return success({ success: true });
    } catch (error) {
      logger.error("Error updating message read status", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
