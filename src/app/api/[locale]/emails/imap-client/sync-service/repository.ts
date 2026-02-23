/**
 * IMAP Sync Repository
 * Core service for synchronizing IMAP accounts, folders, and messages
 */

import "server-only";

import { and, eq } from "drizzle-orm";
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

import type { NewEmail } from "@/app/api/[locale]/emails/messages/db";
import { emails } from "@/app/api/[locale]/emails/messages/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { EmailType } from "../../messages/enum";
import { imapConnectionRepository } from "../connection/repository";
import type { NewImapFolder } from "../db";
import { imapAccounts, imapFolders } from "../db";
import { ImapSyncStatus } from "../enum";
import { scopedTranslation } from "../i18n";
import type {
  SyncAccountFoldersRequestOutput,
  SyncAccountFoldersResponseOutput,
  SyncAccountRequestOutput,
  SyncAccountResponseOutput,
  SyncAllAccountsResponseOutput,
  SyncFolderMessagesRequestOutput,
  SyncFolderMessagesResponseOutput,
  SyncResult,
} from "./types";

/**
 * IMAP Flag Constants
 */
const IMAP_FLAGS = {
  SEEN: "\\Seen",
  FLAGGED: "\\Flagged",
  DELETED: "\\Deleted",
  DRAFT: "\\Draft",
  ANSWERED: "\\Answered",
} as const;

/**
 * IMAP Sync Repository Interface
 */
export interface ImapSyncRepository {
  syncAllAccounts(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SyncAllAccountsResponseOutput>>;

  syncAccount(
    data: SyncAccountRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SyncAccountResponseOutput>>;

  syncAccountFolders(
    data: SyncAccountFoldersRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SyncAccountFoldersResponseOutput>>;

  syncFolderMessages(
    data: SyncFolderMessagesRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SyncFolderMessagesResponseOutput>>;
}

/**
 * IMAP Sync Repository Implementation
 */
export class ImapSyncRepositoryImpl implements ImapSyncRepository {
  /**
   * Sync all enabled IMAP accounts
   */
  async syncAllAccounts(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SyncAllAccountsResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const startTime = Date.now();
    let accountsProcessed = 0;
    let foldersProcessed = 0;
    let messagesProcessed = 0;
    let foldersAdded = 0;
    let foldersUpdated = 0;
    let foldersDeleted = 0;
    let messagesAdded = 0;
    let messagesUpdated = 0;
    let messagesDeleted = 0;
    const errors: ErrorResponseType[] = [];

    try {
      logger.debug("Starting sync for all enabled IMAP accounts");

      // Get all enabled accounts
      const enabledAccounts = await db
        .select()
        .from(imapAccounts)
        .where(eq(imapAccounts.enabled, true));

      logger.debug(`Found ${enabledAccounts.length} enabled IMAP accounts`);

      for (const account of enabledAccounts) {
        try {
          accountsProcessed++;
          logger.debug(`Syncing account: ${account.email}`);

          // Update account sync status
          await db
            .update(imapAccounts)
            .set({
              syncStatus: ImapSyncStatus.SYNCING,
              syncError: null,
            })
            .where(eq(imapAccounts.id, account.id));

          // Sync account
          const accountResult = await this.syncAccount(
            { account },
            logger,
            locale,
          );

          if (accountResult.success) {
            foldersProcessed +=
              accountResult.data.result.results.foldersProcessed;
            messagesProcessed +=
              accountResult.data.result.results.messagesProcessed;
            foldersAdded += accountResult.data.result.results.foldersAdded;
            foldersUpdated += accountResult.data.result.results.foldersUpdated;
            foldersDeleted += accountResult.data.result.results.foldersDeleted;
            messagesAdded += accountResult.data.result.results.messagesAdded;
            messagesUpdated +=
              accountResult.data.result.results.messagesUpdated;
            messagesDeleted +=
              accountResult.data.result.results.messagesDeleted;
            errors.push(...accountResult.data.result.results.errors);

            // Update account sync status to success
            await db
              .update(imapAccounts)
              .set({
                syncStatus: ImapSyncStatus.SYNCED,
                lastSyncAt: new Date(),
                syncError: null,
                isConnected: true,
              })
              .where(eq(imapAccounts.id, account.id));

            logger.debug(`Successfully synced account: ${account.email}`);
          } else {
            errors.push(
              fail({
                message: t("imap.sync.errors.account_failed"),
                errorType: ErrorResponseTypes.UNKNOWN_ERROR,
                messageParams: { error: accountResult.message },
              }),
            );

            // Update account sync status to error
            await db
              .update(imapAccounts)
              .set({
                syncStatus: ImapSyncStatus.ERROR,
                syncError: accountResult.message,
                isConnected: false,
              })
              .where(eq(imapAccounts.id, account.id));

            logger.error(
              `Failed to sync account: ${account.email}`,
              accountResult.message,
            );
          }
        } catch (error) {
          const errorMessage = parseError(error).message;
          errors.push(
            fail({
              message: t("imapErrors.sync.account.failed"),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
              messageParams: { error: errorMessage },
            }),
          );

          // Update account sync status to error
          await db
            .update(imapAccounts)
            .set({
              syncStatus: ImapSyncStatus.ERROR,
              syncError: errorMessage,
              isConnected: false,
            })
            .where(eq(imapAccounts.id, account.id));

          logger.error(
            `Error syncing account ${account.email}`,
            parseError(error),
          );
        }
      }

      const duration = Date.now() - startTime;
      const isSuccessful = errors.length === 0;

      const result: SyncResult = {
        success: isSuccessful,
        message: isSuccessful
          ? t("imap.sync.messages.accounts.success")
          : t("imap.sync.messages.accounts.successWithErrors"),
        results: {
          accountsProcessed,
          foldersProcessed,
          messagesProcessed,
          foldersAdded,
          foldersUpdated,
          foldersDeleted,
          messagesAdded,
          messagesUpdated,
          messagesDeleted,
          duration,
          errors,
        },
      };

      logger.debug("Completed sync for all accounts");
      return success({ result });
    } catch (error) {
      logger.error("Error in syncAllAccounts", parseError(error));

      return fail({
        message: t("imapErrors.sync.failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Sync a specific IMAP account
   */
  async syncAccount(
    data: SyncAccountRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SyncAccountResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const startTime = Date.now();
    let foldersProcessed = 0;
    let messagesProcessed = 0;
    let foldersAdded = 0;
    let foldersUpdated = 0;
    let foldersDeleted = 0;
    let messagesAdded = 0;
    let messagesUpdated = 0;
    let messagesDeleted = 0;
    const errors: ErrorResponseType[] = [];

    try {
      logger.debug(`Starting sync for account: ${data.account.email}`);

      // Test connection first
      const connectionResult = await imapConnectionRepository.testConnection(
        { account: data.account },
        logger,
        t, // connection is internal to sync-service, accepts t from same scope
      );
      if (!connectionResult.success) {
        return fail({
          message: t("imapErrors.connection.test.failed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          cause: connectionResult,
        });
      }

      // Sync folders
      const folderResult = await this.syncAccountFolders(
        { account: data.account },
        logger,
        locale,
      );
      if (folderResult.success) {
        foldersProcessed += folderResult.data.result.results.foldersProcessed;
        foldersAdded += folderResult.data.result.results.foldersAdded;
        foldersUpdated += folderResult.data.result.results.foldersUpdated;
        foldersDeleted += folderResult.data.result.results.foldersDeleted;
      } else {
        errors.push(
          fail({
            message: t("imapErrors.sync.folder.failed"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          }),
        );
      }

      // Sync messages for each folder
      const folders = await db
        .select()
        .from(imapFolders)
        .where(eq(imapFolders.accountId, data.account.id));

      for (const folder of folders) {
        try {
          const messageResult = await this.syncFolderMessages(
            { account: data.account, folder },
            logger,
            locale,
          );
          if (messageResult.success) {
            messagesProcessed +=
              messageResult.data.result.results.messagesProcessed;
            messagesAdded += messageResult.data.result.results.messagesAdded;
            messagesUpdated +=
              messageResult.data.result.results.messagesUpdated;
            messagesDeleted +=
              messageResult.data.result.results.messagesDeleted;
            errors.push(...messageResult.data.result.results.errors);
          } else {
            errors.push(
              fail({
                message: t("imap.sync.errors.message_sync_failed"),
                errorType: ErrorResponseTypes.UNKNOWN_ERROR,
              }),
            );
          }
        } catch (error) {
          logger.error("Error syncing folder messages", parseError(error));
          errors.push(
            fail({
              message: t("imap.sync.errors.message_sync_error"),
              errorType: ErrorResponseTypes.UNKNOWN_ERROR,
            }),
          );
          logger.error(
            `Error syncing folder ${folder.name}`,
            parseError(error),
          );
        }
      }

      const duration = Date.now() - startTime;
      const isSuccessful = errors.length === 0;

      const result: SyncResult = {
        success: isSuccessful,
        message: isSuccessful
          ? t("imap.sync.messages.account.success")
          : t("imap.sync.messages.account.successWithErrors"),
        results: {
          accountsProcessed: 1,
          foldersProcessed,
          messagesProcessed,
          foldersAdded,
          foldersUpdated,
          foldersDeleted,
          messagesAdded,
          messagesUpdated,
          messagesDeleted,
          duration,
          errors,
        },
      };

      logger.debug(`Completed sync for account: ${data.account.email}`);
      return success({ result });
    } catch (error) {
      logger.error(
        `Error syncing account ${data.account.email}`,
        parseError(error),
      );

      return fail({
        message: t("imapErrors.sync.account.failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Sync folders for an account
   */
  async syncAccountFolders(
    data: SyncAccountFoldersRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SyncAccountFoldersResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const startTime = Date.now();
    let foldersProcessed = 0;
    let foldersAdded = 0;
    let foldersUpdated = 0;
    const errors: ErrorResponseType[] = [];

    try {
      logger.debug(`Syncing folders for account: ${data.account.email}`);

      // Get folders from IMAP server
      const remoteFoldersResult = await imapConnectionRepository.listFolders(
        { account: data.account },
        logger,
        t, // connection is internal to sync-service, accepts t from same scope
      );

      if (!remoteFoldersResult.success) {
        return fail({
          message: t("imapErrors.connection.folders.list.failed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          cause: remoteFoldersResult,
        });
      }

      const remoteFolders = remoteFoldersResult.data.folders;

      for (const remoteFolder of remoteFolders) {
        try {
          foldersProcessed++;

          // Check if folder exists in database
          const [existingFolder] = await db
            .select()
            .from(imapFolders)
            .where(eq(imapFolders.path, remoteFolder.path))
            .limit(1);

          if (existingFolder) {
            // Update existing folder
            await db
              .update(imapFolders)
              .set({
                displayName: remoteFolder.displayName,
                delimiter: remoteFolder.delimiter,
                isSelectable: remoteFolder.isSelectable,
                hasChildren: remoteFolder.hasChildren,
                isSpecialUse: remoteFolder.isSpecialUse,
                specialUseType: remoteFolder.specialUseType,
                uidValidity: remoteFolder.uidValidity,
                uidNext: remoteFolder.uidNext,
                messageCount: remoteFolder.messageCount,
                recentCount: remoteFolder.recentCount,
                unseenCount: remoteFolder.unseenCount,
                syncStatus: ImapSyncStatus.SYNCED,
                lastSyncAt: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(imapFolders.id, existingFolder.id));

            foldersUpdated++;
            logger.debug(`Updated folder: ${remoteFolder.name}`);
          } else {
            // Create new folder
            const newFolder: NewImapFolder = {
              name: remoteFolder.name,
              displayName: remoteFolder.displayName,
              path: remoteFolder.path,
              delimiter: remoteFolder.delimiter,
              isSelectable: remoteFolder.isSelectable,
              hasChildren: remoteFolder.hasChildren,
              isSpecialUse: remoteFolder.isSpecialUse,
              specialUseType: remoteFolder.specialUseType,
              uidValidity: remoteFolder.uidValidity,
              uidNext: remoteFolder.uidNext,
              messageCount: remoteFolder.messageCount,
              recentCount: remoteFolder.recentCount,
              unseenCount: remoteFolder.unseenCount,
              accountId: data.account.id,
              syncStatus: ImapSyncStatus.SYNCED,
              lastSyncAt: new Date(),
            };

            await db.insert(imapFolders).values(newFolder);
            foldersAdded++;
            logger.debug(`Added folder: ${remoteFolder.name}`);
          }
        } catch (error) {
          logger.error("Error syncing folder", parseError(error));
          errors.push(
            fail({
              message: t("imap.sync.errors.folder_sync_failed"),
              errorType: ErrorResponseTypes.UNKNOWN_ERROR,
              messageParams: { error: parseError(error).message },
            }),
          );
          logger.error(
            `Error syncing folder ${remoteFolder.name}`,
            parseError(error),
          );
        }
      }

      const duration = Date.now() - startTime;
      const isSuccessful = errors.length === 0;

      const result: SyncResult = {
        success: isSuccessful,
        message: isSuccessful
          ? t("imap.sync.messages.folders.success")
          : t("imap.sync.messages.folders.successWithErrors"),
        results: {
          accountsProcessed: 0,
          foldersProcessed,
          messagesProcessed: 0,
          foldersAdded,
          foldersUpdated,
          foldersDeleted: 0,
          messagesAdded: 0,
          messagesUpdated: 0,
          messagesDeleted: 0,
          duration,
          errors,
        },
      };

      logger.debug(`Completed folder sync for account: ${data.account.email}`);
      return success({ result });
    } catch (error) {
      logger.error(
        `Error syncing folders for account ${data.account.email}`,
        parseError(error),
      );

      return fail({
        message: t("imapErrors.sync.folder.failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Sync messages for a folder
   */
  async syncFolderMessages(
    data: SyncFolderMessagesRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SyncFolderMessagesResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const startTime = Date.now();
    let messagesProcessed = 0;
    let messagesAdded = 0;
    let messagesUpdated = 0;
    const errors: ErrorResponseType[] = [];

    try {
      logger.debug(`Syncing messages for folder: ${data.folder.name}`);

      // Get messages from IMAP server
      const remoteMessagesResponse =
        await imapConnectionRepository.listMessages(
          {
            account: data.account,
            folderPath: data.folder.path,
            options: { limit: data.account.maxMessages || 1000 },
          },
          logger,
          t, // connection is internal to sync-service, accepts t from same scope
        );
      if (!remoteMessagesResponse.success) {
        return fail({
          message: t("imapErrors.connection.messages.list.failed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          cause: remoteMessagesResponse,
        });
      }
      const remoteMessages = remoteMessagesResponse.data.messages;

      for (const remoteMessage of remoteMessages) {
        try {
          messagesProcessed++;

          // Check if message exists by UID + account (more reliable than message-id)
          const [existingMessage] = await db
            .select()
            .from(emails)
            .where(
              and(
                eq(emails.imapUid, remoteMessage.uid),
                eq(emails.imapAccountId, data.account.id),
                eq(emails.imapFolderId, data.folder.id),
              ),
            )
            .limit(1);

          if (existingMessage) {
            // Update existing message flags and body if now available
            await db
              .update(emails)
              .set({
                subject: remoteMessage.subject,
                isRead: remoteMessage.flags.includes(IMAP_FLAGS.SEEN),
                isFlagged: remoteMessage.flags.includes(IMAP_FLAGS.FLAGGED),
                isDeleted: remoteMessage.flags.includes(IMAP_FLAGS.DELETED),
                isDraft: remoteMessage.flags.includes(IMAP_FLAGS.DRAFT),
                isAnswered: remoteMessage.flags.includes(IMAP_FLAGS.ANSWERED),
                messageSize: remoteMessage.size,
                hasAttachments: remoteMessage.hasAttachments,
                attachmentCount: remoteMessage.attachmentCount,
                ...(remoteMessage.bodyText && {
                  bodyText: remoteMessage.bodyText,
                }),
                ...(remoteMessage.bodyHtml && {
                  bodyHtml: remoteMessage.bodyHtml,
                }),
                syncStatus: ImapSyncStatus.SYNCED,
                lastSyncAt: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(emails.id, existingMessage.id));

            messagesUpdated++;
          } else {
            // Create new message
            const newMessage: NewEmail = {
              type: EmailType.USER_COMMUNICATION,
              subject: remoteMessage.subject,
              recipientEmail: remoteMessage.to,
              senderEmail: remoteMessage.from,
              imapUid: remoteMessage.uid,
              imapMessageId: remoteMessage.messageId,
              imapFolderId: data.folder.id,
              imapAccountId: data.account.id,
              bodyText: remoteMessage.bodyText,
              bodyHtml: remoteMessage.bodyHtml,
              headers: remoteMessage.headers,
              isRead: remoteMessage.flags.includes(IMAP_FLAGS.SEEN),
              isFlagged: remoteMessage.flags.includes(IMAP_FLAGS.FLAGGED),
              isDeleted: remoteMessage.flags.includes(IMAP_FLAGS.DELETED),
              isDraft: remoteMessage.flags.includes(IMAP_FLAGS.DRAFT),
              isAnswered: remoteMessage.flags.includes(IMAP_FLAGS.ANSWERED),
              messageSize: remoteMessage.size,
              hasAttachments: remoteMessage.hasAttachments,
              attachmentCount: remoteMessage.attachmentCount,
              sentAt: remoteMessage.date,
              syncStatus: ImapSyncStatus.SYNCED,
              lastSyncAt: new Date(),
            };

            await db.insert(emails).values(newMessage);
            messagesAdded++;
          }
        } catch (error) {
          logger.error("Error syncing message", parseError(error));
          errors.push(
            fail({
              message: t("imapErrors.sync.message.failed"),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            }),
          );
          logger.error(
            `Error syncing message ${remoteMessage.messageId}`,
            parseError(error),
          );
        }
      }

      const duration = Date.now() - startTime;
      const isSuccessful = errors.length === 0;

      const result: SyncResult = {
        success: isSuccessful,
        message: isSuccessful
          ? t("imap.sync.messages.messages.success")
          : t("imap.sync.messages.messages.successWithErrors"),
        results: {
          accountsProcessed: 0,
          foldersProcessed: 0,
          messagesProcessed,
          foldersAdded: 0,
          foldersUpdated: 0,
          foldersDeleted: 0,
          messagesAdded,
          messagesUpdated,
          messagesDeleted: 0,
          duration,
          errors,
        },
      };

      logger.debug(`Completed message sync for folder: ${data.folder.name}`);
      return success({ result });
    } catch (error) {
      logger.error(
        `Error syncing messages for folder ${data.folder.name}`,
        parseError(error),
      );

      return fail({
        message: t("imapErrors.sync.message.failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

// Export singleton instance
export const imapSyncRepository = new ImapSyncRepositoryImpl();
