/**
 * IMAP Sync Repository
 * Data access layer for IMAP synchronization operations
 */

import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { messengerAccounts } from "../../../../accounts/db";
import {
  MessageChannel,
  MessengerAccountStatus,
} from "../../../../accounts/enum";
import { toImapShape } from "../db";
import { ImapSyncRepository as ImapSyncServiceRepository } from "../sync-service/repository";
import type {
  ImapSyncPostRequestOutput,
  ImapSyncPostResponseOutput,
} from "./definition";
import type { ImapSyncT } from "./i18n";

/**
 * IMAP Sync Repository
 */
export class ImapSyncRepository {
  /**
   * Start IMAP sync operation
   */
  static async startSync(
    data: ImapSyncPostRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: ImapSyncT,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapSyncPostResponseOutput>> {
    try {
      logger.info("Starting IMAP sync operation", {
        accountIds: data.accountIds,
        userId: user.id,
      });

      // Validate account IDs if provided
      const accountIdList = data.accountIds
        ? data.accountIds.map((id) => id.trim()).filter(Boolean)
        : [];
      let rawRows: (typeof messengerAccounts.$inferSelect)[] = [];
      if (accountIdList.length > 0) {
        rawRows = await db
          .select()
          .from(messengerAccounts)
          .where(
            and(
              eq(messengerAccounts.channel, MessageChannel.EMAIL),
              inArray(messengerAccounts.id, accountIdList),
            ),
          );

        if (rawRows.length !== accountIdList.length) {
          return fail({
            message: t("post.errors.validation.title"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
      } else {
        // Sync all enabled EMAIL accounts with IMAP sync enabled
        rawRows = await db
          .select()
          .from(messengerAccounts)
          .where(
            and(
              eq(messengerAccounts.channel, MessageChannel.EMAIL),
              eq(messengerAccounts.status, MessengerAccountStatus.ACTIVE),
              eq(messengerAccounts.imapSyncEnabled, true),
            ),
          );
      }
      const accountsToSync = rawRows.map(toImapShape);

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
      const errors: Array<{ code: string; message: string }> = [];
      const results = {
        accountsProcessed: 0,
        foldersProcessed: 0,
        messagesProcessed: 0,
        messagesAdded: 0,
        messagesUpdated: 0,
        messagesDeleted: 0,
        errors,
      };

      // Process each account
      for (const account of accountsToSync) {
        try {
          logger.info("Processing account", {
            accountId: account.id,
            email: account.email,
          });

          // No intermediate status update - messenger_accounts doesn't have syncStatus field

          const syncResult = await ImapSyncServiceRepository.syncAccount(
            account,
            logger,
            locale,
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

          // Update IMAP connected status in messenger_accounts
          await db
            .update(messengerAccounts)
            .set({
              imapIsConnected: true,
              imapLastSyncAt: new Date(),
              imapSyncError: null,
              updatedAt: new Date(),
            })
            .where(eq(messengerAccounts.id, account.id));

          logger.info("Account sync completed", { accountId: account.id });
        } catch (error) {
          const parsedError = parseError(error);
          logger.error("Error syncing account", {
            accountId: account.id,
            error: parsedError,
          });

          // Update error state in messenger_accounts
          await db
            .update(messengerAccounts)
            .set({
              imapIsConnected: false,
              imapSyncError: parsedError.message,
              updatedAt: new Date(),
            })
            .where(eq(messengerAccounts.id, account.id));

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
        message: t("errors.server.detail_sync", { error: parsedError.message }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
