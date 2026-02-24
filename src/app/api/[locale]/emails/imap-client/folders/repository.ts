/**
 * IMAP Folders Repository
 * Data access layer for IMAP folder management functionality
 */

import "server-only";

import { and, count, desc, eq, ilike } from "drizzle-orm";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ImapFolder } from "../db";
import { imapAccounts, imapFolders } from "../db";
import { ImapSyncStatus, ImapSyncStatusFilter } from "../enum";
import { scopedTranslation } from "./i18n";
import type { ImapFoldersListResponseOutput } from "./list/definition";
import type { FoldersSyncResponseOutput } from "./sync/definition";

interface ImapFolderQueryType {
  accountId?: string;
  search?: string;
  syncStatus?: string[];
  specialUseType?: string[];
  page?: number;
  limit?: number;
  sortBy?: string[];
  sortOrder?: string[];
}

interface ImapFolderSyncType {
  accountId: string;
  folderId?: string;
  force?: boolean;
}

// Removed unused SyncAccountFoldersResult and SyncResults interfaces
// Using FoldersSyncResponseOutput from definition instead

/**
 * Sync Service Result Interface (partial result from sync service)
 */
interface SyncServiceResult {
  foldersProcessed?: number;
  foldersAdded?: number;
  foldersUpdated?: number;
  foldersDeleted?: number;
  duration?: number;
}

export interface ImapFoldersRepository {
  listFolders(
    data: ImapFolderQueryType,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapFoldersListResponseOutput>>;

  getFolderById(
    data: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapFoldersListResponseOutput["folders"][number]>>;

  syncFolders(
    data: ImapFolderSyncType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FoldersSyncResponseOutput>>;

  getFoldersByAccountId(
    data: { accountId: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapFoldersListResponseOutput>>;

  updateFolderSyncStatus(
    folderId: string,
    syncStatus: string,
    syncError: ErrorResponseType | null,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ success: boolean }>>;

  updateFolderMessageCounts(
    folderId: string,
    counts: { totalMessages: number; unreadMessages: number },
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ success: boolean }>>;
}

/**
 * IMAP Folders Repository Implementation
 */
class ImapFoldersRepositoryImpl implements ImapFoldersRepository {
  /**
   * Format IMAP folder for response matching definition.ts structure
   */
  private formatFolderResponse(
    folder: ImapFolder,
  ): ImapFoldersListResponseOutput["folders"][number] {
    return {
      id: folder.id,
      name: folder.name,
      displayName: folder.displayName || null,
      path: folder.path,
      isSelectable: folder.isSelectable || true,
      hasChildren: folder.hasChildren || false,
      specialUseType: folder.specialUseType || null,
      messageCount: folder.messageCount || 0,
      unseenCount: folder.unseenCount || 0,
      syncStatus: folder.syncStatus || ImapSyncStatus.PENDING,
      createdAt: folder.createdAt.toISOString(),
    };
  }

  /**
   * List IMAP folders with filtering and pagination
   */
  async listFolders(
    data: ImapFolderQueryType,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapFoldersListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      logger.debug("Listing IMAP folders", {
        accountId: data.accountId,
        userId: user.id,
      });

      const page = data.page || 1;
      const limit = Math.min(data.limit || 20, 100);
      const offset = (page - 1) * limit;

      // Build where conditions
      const whereConditions: ReturnType<typeof eq>[] = [];

      // Account filter (required)
      if (data.accountId) {
        whereConditions.push(eq(imapFolders.accountId, data.accountId));
      }

      // Search filter
      if (data.search) {
        const searchTerm = `%${data.search.toLowerCase()}%`;
        whereConditions.push(ilike(imapFolders.name, searchTerm));
      }

      // Sync status filter (now supports arrays)
      if (data.syncStatus && data.syncStatus.length > 0) {
        // Filter out 'ALL' option and use the first status for now
        // TODO: Implement proper array-based filtering with OR conditions
        const firstStatus = data.syncStatus[0];
        if (firstStatus && firstStatus !== ImapSyncStatusFilter.ALL) {
          const syncStatusValue =
            firstStatus === ImapSyncStatusFilter.PENDING
              ? ImapSyncStatus.PENDING
              : firstStatus === ImapSyncStatusFilter.SYNCING
                ? ImapSyncStatus.SYNCING
                : firstStatus === ImapSyncStatusFilter.SYNCED
                  ? ImapSyncStatus.SYNCED
                  : firstStatus === ImapSyncStatusFilter.ERROR
                    ? ImapSyncStatus.ERROR
                    : ImapSyncStatus.PENDING;
          whereConditions.push(eq(imapFolders.syncStatus, syncStatusValue));
        }
      }

      // Special use type filter
      if (data.specialUseType && data.specialUseType.length > 0) {
        // TODO: Implement proper array-based filtering with OR conditions
        // For now, using first value
        // whereConditions.push(eq(imapFolders.specialUseType, data.specialUseType[0]));
      }

      const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Get total count
      const [{ count: totalCount }] = await db
        .select({ count: count() })
        .from(imapFolders)
        .where(whereClause);

      // Get folders with pagination
      const folders = await db
        .select()
        .from(imapFolders)
        .where(whereClause)
        .orderBy(desc(imapFolders.createdAt))
        .limit(limit)
        .offset(offset);

      const totalPages = Math.ceil(totalCount / limit);

      return success({
        folders: folders.map((folder) => this.formatFolderResponse(folder)),
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
        },
      });
    } catch (error) {
      logger.error("Failed to list IMAP folders", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Get IMAP folder by ID
   */
  async getFolderById(
    data: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapFoldersListResponseOutput["folders"][number]>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      logger.debug("Getting IMAP folder by ID", {
        id: data.id,
        userId: user.id,
      });

      const [folder] = await db
        .select()
        .from(imapFolders)
        .where(eq(imapFolders.id, data.id))
        .limit(1);

      if (!folder) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(this.formatFolderResponse(folder));
    } catch (error) {
      logger.error("Error fetching IMAP folder", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Sync IMAP folders
   */
  async syncFolders(
    data: ImapFolderSyncType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FoldersSyncResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      logger.debug("Syncing IMAP folders for account", {
        accountId: data.accountId,
      });

      // Implement actual folder sync using the sync service
      const { imapSyncRepository } = await import("../sync-service/repository");

      if (data.accountId) {
        // Get the account first
        const account = await db
          .select()
          .from(imapAccounts)
          .where(eq(imapAccounts.id, data.accountId))
          .limit(1);

        if (account.length === 0) {
          return fail({
            message: t("errors.accountNotFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        // Sync folders for the specific account
        const syncResult = await imapSyncRepository.syncAccountFolders(
          { account: account[0] },
          logger,
          locale,
        );

        if (syncResult.success && syncResult.data?.result) {
          // Extract sync result data - the sync service returns a SyncServiceResult type
          const result = syncResult.data.result as SyncServiceResult;

          const syncResults: FoldersSyncResponseOutput = {
            foldersProcessed:
              typeof result.foldersProcessed === "number"
                ? result.foldersProcessed
                : 0,
            foldersAdded:
              typeof result.foldersAdded === "number" ? result.foldersAdded : 0,
            foldersUpdated:
              typeof result.foldersUpdated === "number"
                ? result.foldersUpdated
                : 0,
            foldersDeleted:
              typeof result.foldersDeleted === "number"
                ? result.foldersDeleted
                : 0,
            duration: typeof result.duration === "number" ? result.duration : 0,
            success: true,
          };
          return success(syncResults);
        }
        return fail({
          message: t("errors.syncFailed.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      return fail({
        message: t("errors.missingAccount.title"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    } catch (error) {
      logger.error("Failed to sync IMAP folders", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Get folders by account ID
   */
  async getFoldersByAccountId(
    data: { accountId: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapFoldersListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      logger.debug("Getting IMAP folders by account", {
        accountId: data.accountId,
        userId: user.id,
      });

      const folders = await db
        .select()
        .from(imapFolders)
        .where(eq(imapFolders.accountId, data.accountId))
        .orderBy(imapFolders.path);

      return success({
        folders: folders.map((folder) => this.formatFolderResponse(folder)),
        pagination: {
          page: 1,
          limit: folders.length,
          total: folders.length,
          totalPages: 1,
        },
      });
    } catch (error) {
      logger.error("Failed to get IMAP folders by account", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Update folder sync status
   */
  async updateFolderSyncStatus(
    folderId: string,
    syncStatus: keyof typeof ImapSyncStatus,
    syncError: ErrorResponseType | null,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ success: boolean }>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      logger.debug("Updating IMAP folder sync status", {
        folderId,
        syncStatus,
        userId: user.id,
      });

      const [updatedFolder] = await db
        .update(imapFolders)
        .set({
          syncStatus: ImapSyncStatus[syncStatus],
          syncError,
          lastSyncAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(imapFolders.id, folderId))
        .returning();

      if (!updatedFolder) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({ success: true });
    } catch (error) {
      logger.error(
        "Failed to update IMAP folder sync status",
        parseError(error),
      );
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Update folder message counts
   */
  async updateFolderMessageCounts(
    folderId: string,
    counts: { totalMessages: number; unreadMessages: number },
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ success: boolean }>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      logger.debug("Updating IMAP folder message counts", {
        folderId,
        counts,
        userId: user.id,
      });

      const [updatedFolder] = await db
        .update(imapFolders)
        .set({
          messageCount: counts.totalMessages,
          unseenCount: counts.unreadMessages,
          updatedAt: new Date(),
        })
        .where(eq(imapFolders.id, folderId))
        .returning();

      if (!updatedFolder) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({ success: true });
    } catch (error) {
      logger.error(
        "Failed to update IMAP folder message counts",
        parseError(error),
      );
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}

/**
 * Export singleton instance
 */
export const imapFoldersRepository = new ImapFoldersRepositoryImpl();
