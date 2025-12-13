/**
 * IMAP Sync Repository
 * Data access layer for IMAP synchronization operations
 */

import "server-only";

import { eq, inArray } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { JwtPayloadType } from "../../../user/auth/types";
import { imapAccounts } from "../db";
import { ImapSyncStatus } from "../enum";
import { imapSyncRepository as imapSyncServiceRepository } from "../sync-service/repository";
import type {
  ImapSyncGetResponseOutput,
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
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapSyncPostResponseOutput>>;

  getSyncStatus(
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): ResponseType<ImapSyncGetResponseOutput>;
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
          return fail({
            message: "app.api.emails.imapClient.sync.errors.validation.title",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
      } else {
        // Sync all enabled accounts
        accountsToSync = await db
          .select()
          .from(imapAccounts)
          .where(eq(imapAccounts.enabled, true));
      }

      if (accountsToSync.length === 0) {
        return success({
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
        errors: [] as Array<{ code: string; message: string }>,
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
            logger,
          );

          if (syncResult.success) {
            results.accountsProcessed +=
              syncResult.data.result.results.accountsProcessed;
            results.foldersProcessed +=
              syncResult.data.result.results.foldersProcessed;
            results.messagesProcessed +=
              syncResult.data.result.results.messagesProcessed;
            results.messagesAdded +=
              syncResult.data.result.results.messagesAdded;
            results.messagesUpdated +=
              syncResult.data.result.results.messagesUpdated;
            results.messagesDeleted +=
              syncResult.data.result.results.messagesDeleted;

            // Convert error objects to simple error format
            // Note: errors might be in different format, handle gracefully
            if (
              syncResult.data.result.results.errors &&
              syncResult.data.result.results.errors.length > 0
            ) {
              syncResult.data.result.results.errors.forEach((err) => {
                results.errors.push({
                  code: "SYNC_ERROR",
                  // eslint-disable-next-line i18next/no-literal-string
                  message: err.message || "Unknown sync error",
                });
              });
            }
          } else {
            results.errors.push({
              code: "SYNC_ERROR",
              message: syncResult.message,
            });
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
          const parsedError = parseError(error);
          logger.error("Error syncing account", {
            accountId: account.id,
            error: parsedError,
          });

          // Update account sync status to error
          await db
            .update(imapAccounts)
            .set({
              syncStatus: ImapSyncStatus.ERROR,
              syncError: parsedError.message,
              updatedAt: new Date(),
            })
            .where(eq(imapAccounts.id, account.id));

          results.errors.push({
            code: "ACCOUNT_SYNC_ERROR",
            message: parsedError.message,
          });
        }
      }

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      return success({
        ...results,
        duration,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Error in IMAP sync operation", parsedError);
      return fail({
        message: "app.api.emails.imapClient.sync.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  /**
   * Get sync status for all accounts
   * Note: Returns same format as POST to match type definition
   */
  getSyncStatus(
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): ResponseType<ImapSyncGetResponseOutput> {
    try {
      logger.info("Getting IMAP sync status", { userId: user.id });

      // Since GET returns same type as POST, return an empty sync result
      // In a real implementation, this might fetch recent sync statistics
      return success({
        accountsProcessed: 0,
        foldersProcessed: 0,
        messagesProcessed: 0,
        messagesAdded: 0,
        messagesUpdated: 0,
        messagesDeleted: 0,
        duration: 0,
        errors: [],
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Error getting IMAP sync status", parsedError);
      return fail({
        message: "app.api.emails.imapClient.sync.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}

/**
 * Export singleton instance
 */
export const imapSyncRepository = new ImapSyncRepositoryImpl();
