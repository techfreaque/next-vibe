/**
 * IMAP Sync Repository
 * Data access layer for IMAP synchronization operations
 */

import "server-only";

import { eq, inArray } from "drizzle-orm";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "../../../user/auth/definition";
import { imapAccounts } from "../../messages/db";
import { ImapOverallSyncStatus, ImapSyncStatus } from "../enum";
import { imapSyncRepository as imapSyncServiceRepository } from "../sync-service/repository";
import type {
  ImapSyncGetRequestTypeOutput,
  ImapSyncGetResponseTypeOutput,
  ImapSyncPostRequestOutput,
  ImapSyncPostResponseOutput,
} from "./definition";

/**
 * IMAP Sync Repository Interface
 */
export interface ImapSyncRepository {
  startSync(
    data: ImapSyncPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapSyncPostResponseOutput>>;

  getSyncStatus(
    data: ImapSyncGetRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapSyncGetResponseTypeOutput>>;
}

/**
 * IMAP Sync Repository Implementation
 */
class ImapSyncRepositoryImpl implements ImapSyncRepository {
  /**
   * Start IMAP sync operation
   */
  async startSync(
    data: ImapSyncPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapSyncPostResponseOutput>> {
    try {
      logger.info("Starting IMAP sync operation", {
        accountIds: data.accountIds,
        userId: user.id,
      });

      // Validate account IDs if provided
      let accountsToSync = [];
      if (data.accountIds && data.accountIds.length > 0) {
        accountsToSync = await db
          .select()
          .from(imapAccounts)
          .where(inArray(imapAccounts.id, data.accountIds));

        if (accountsToSync.length !== data.accountIds.length) {
          return createErrorResponse(
            "app.api.v1.core.emails.imapClient.sync.post.errors.validation.title",
            ErrorResponseTypes.VALIDATION_FAILED,
          );
        }
      } else {
        // Sync all enabled accounts
        accountsToSync = await db
          .select()
          .from(imapAccounts)
          .where(eq(imapAccounts.enabled, true));
      }

      if (accountsToSync.length === 0) {
        return createSuccessResponse({
          accountsProcessed: 0,
          foldersProcessed: 0,
          messagesProcessed: 0,
          messagesAdded: 0,
          messagesUpdated: 0,
          messagesDeleted: 0,
          errors: [],
          duration: 0,
        });
      }

      const startTime = new Date();
      const results = {
        accountsProcessed: 0,
        foldersProcessed: 0,
        messagesProcessed: 0,
        messagesAdded: 0,
        messagesUpdated: 0,
        messagesDeleted: 0,
        errors: [] as ErrorResponseType[],
      };

      // Process each account
      for (const account of accountsToSync) {
        try {
          logger.info("Processing account", {
            accountId: account.id,
            email: account.email,
          });

          // Update account sync status to syncing
          await db
            .update(imapAccounts)
            .set({
              syncStatus: ImapSyncStatus.SYNCING,
              lastSyncAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(imapAccounts.id, account.id));

          const syncResult = await imapSyncServiceRepository.syncAccount(
            { account },
            user,
            locale,
            logger,
          );

          if (syncResult.success) {
            results.accountsProcessed +=
              syncResult.data.results.accountsProcessed;
            results.foldersProcessed +=
              syncResult.data.results.foldersProcessed;
            results.messagesProcessed +=
              syncResult.data.results.messagesProcessed;
            results.messagesAdded += syncResult.data.results.messagesAdded;
            results.messagesUpdated += syncResult.data.results.messagesUpdated;
            results.messagesDeleted += syncResult.data.results.messagesDeleted;
            // Add ErrorResponseType objects directly
            results.errors.push(...syncResult.data.results.errors);
          } else {
            results.errors.push(
              createErrorResponse(
                "app.api.v1.core.emails.imapClient.sync.post.errors.server.title",
                ErrorResponseTypes.SERVER_ERROR,
                { error: syncResult.error },
              ),
            );
          }

          // Update account sync status to synced
          await db
            .update(imapAccounts)
            .set({
              syncStatus: ImapSyncStatus.SYNCED,
              syncError: null,
              updatedAt: new Date(),
            })
            .where(eq(imapAccounts.id, account.id));

          logger.info("Account sync completed", { accountId: account.id });
        } catch (error) {
          logger.error("Error syncing account", {
            accountId: account.id,
            error,
          });

          // Update account sync status to error
          await db
            .update(imapAccounts)
            .set({
              syncStatus: ImapSyncStatus.ERROR,
              syncError: parseError(error).message,
              updatedAt: new Date(),
            })
            .where(eq(imapAccounts.id, account.id));

          results.errors.push(
            createErrorResponse(
              "app.api.v1.core.emails.imapClient.sync.post.errors.server.title",
              ErrorResponseTypes.SERVER_ERROR,
              parseError(error),
            ),
          );
        }
      }

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      return createSuccessResponse({
        ...results,
        duration,
      });
    } catch (error) {
      logger.error("Error in IMAP sync operation", error);
      return createErrorResponse(
        "app.api.v1.core.emails.imapClient.sync.post.errors.server.title",
        ErrorResponseTypes.SERVER_ERROR,
        parseError(error),
      );
    }
  }

  /**
   * Get sync status for all accounts
   */
  async getSyncStatus(
    data: ImapSyncGetRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapSyncGetResponseTypeOutput>> {
    try {
      logger.info("Getting IMAP sync status", { userId: user.id });

      const accounts = await db
        .select({
          id: imapAccounts.id,
          email: imapAccounts.email,
          syncStatus: imapAccounts.syncStatus,
          lastSyncAt: imapAccounts.lastSyncAt,
          syncError: imapAccounts.syncError,
        })
        .from(imapAccounts)
        .where(eq(imapAccounts.enabled, true));

      // Determine overall status
      let overallStatus: typeof ImapOverallSyncStatus;
      if (accounts.some((acc) => acc.syncStatus === ImapSyncStatus.SYNCING)) {
        overallStatus = ImapOverallSyncStatus.RUNNING;
      } else if (
        accounts.some((acc) => acc.syncStatus === ImapSyncStatus.ERROR)
      ) {
        overallStatus = ImapOverallSyncStatus.FAILED;
      } else {
        overallStatus = ImapOverallSyncStatus.COMPLETED;
      }

      // Find most recent sync time
      const lastSyncTimes = accounts
        .map((acc) => acc.lastSyncAt)
        .filter((time) => time !== null)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      const lastSyncAt =
        lastSyncTimes.length > 0 ? lastSyncTimes[0].toISOString() : null;

      return createSuccessResponse({
        accounts: accounts.map((acc) => ({
          id: acc.id,
          email: acc.email,
          syncStatus: acc.syncStatus || ImapSyncStatus.PENDING,
          lastSyncAt: acc.lastSyncAt?.toISOString() || null,
          syncError: acc.syncError,
        })),
        overallStatus,
        lastSyncAt,
      });
    } catch (error) {
      logger.error("Error getting IMAP sync status", error);
      return createErrorResponse(
        "app.api.v1.core.emails.imapClient.sync.get.errors.server.title",
        ErrorResponseTypes.SERVER_ERROR,
        parseError(error),
      );
    }
  }
}

/**
 * Export singleton instance
 */
export const imapSyncRepository = new ImapSyncRepositoryImpl();
