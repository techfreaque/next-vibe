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

import type {
  NewEmail,
  NewMessengerFolder,
} from "@/app/api/[locale]/messenger/messages/db";
import {
  emails,
  messengerFolders,
} from "@/app/api/[locale]/messenger/messages/db";
import type { MessengerFolder } from "@/app/api/[locale]/messenger/messages/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { MessageType, SpecialFolderType } from "../../../../messages/enum";
import type { SpecialFolderTypeValue } from "../../../../messages/enum";
import { messengerAccounts } from "../../../../accounts/db";
import { MessengerAccountStatus } from "../../../../accounts/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import { MessageChannel } from "../../../../accounts/enum";
import { ImapConnectionRepository } from "../connection/repository";
import type { ImapAccountShape } from "../db";
import { toImapShape } from "../db";
import { ImapSpecialUseType, ImapSyncStatus } from "../enum";
import { scopedTranslation } from "../i18n";

/**
 * Map IMAP-specific special use type to the channel-agnostic SpecialFolderType.
 * IMAP uses JUNK; messenger_folders uses SPAM for the same concept.
 */
function toSpecialFolderType(
  imapType:
    | (typeof ImapSpecialUseType)[keyof typeof ImapSpecialUseType]
    | undefined,
): typeof SpecialFolderTypeValue | null {
  if (!imapType) {
    return null;
  }
  if (imapType === ImapSpecialUseType.JUNK) {
    return SpecialFolderType.SPAM;
  }
  // INBOX, SENT, DRAFTS, TRASH, ARCHIVE map 1:1
  return imapType as typeof SpecialFolderTypeValue;
}

interface SyncResult {
  success: boolean;
  message: TranslationKey;
  results: {
    accountsProcessed: number;
    foldersProcessed: number;
    messagesProcessed: number;
    foldersAdded: number;
    foldersUpdated: number;
    foldersDeleted: number;
    messagesAdded: number;
    messagesUpdated: number;
    messagesDeleted: number;
    duration: number;
    errors: ErrorResponseType[];
  };
}

interface ImapSyncResult {
  result: SyncResult;
}

/**
 * IMAP Sync Repository
 */
export class ImapSyncRepository {
  /**
   * IMAP Flag Constants
   */
  private static readonly IMAP_FLAGS = {
    SEEN: "\\Seen",
    FLAGGED: "\\Flagged",
    DELETED: "\\Deleted",
    DRAFT: "\\Draft",
    ANSWERED: "\\Answered",
  } as const;
  static async syncAllAccounts(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapSyncResult>> {
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

      // Get all enabled IMAP accounts from messenger_accounts
      const enabledRows = await db
        .select()
        .from(messengerAccounts)
        .where(
          and(
            eq(messengerAccounts.channel, MessageChannel.EMAIL),
            eq(messengerAccounts.status, MessengerAccountStatus.ACTIVE),
            eq(messengerAccounts.imapSyncEnabled, true),
          ),
        );

      const enabledAccounts: ImapAccountShape[] = enabledRows.map(toImapShape);

      logger.debug(`Found ${enabledAccounts.length} enabled IMAP accounts`);

      for (const account of enabledAccounts) {
        try {
          accountsProcessed++;
          logger.debug(`Syncing account: ${account.email}`);

          // Sync account
          const accountResult = await ImapSyncRepository.syncAccount(
            account,
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

            logger.debug(`Successfully synced account: ${account.email}`);
          } else {
            errors.push(
              fail({
                message: t("imap.sync.errors.account_failed"),
                errorType: ErrorResponseTypes.UNKNOWN_ERROR,
                messageParams: { error: accountResult.message },
              }),
            );

            // Update error state in messenger_accounts
            await db
              .update(messengerAccounts)
              .set({
                imapIsConnected: false,
                imapSyncError: accountResult.message,
                updatedAt: new Date(),
              })
              .where(eq(messengerAccounts.id, account.id));

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

          // Update error state in messenger_accounts
          await db
            .update(messengerAccounts)
            .set({
              imapIsConnected: false,
              imapSyncError: errorMessage,
              updatedAt: new Date(),
            })
            .where(eq(messengerAccounts.id, account.id));

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

  static async syncAccount(
    account: ImapAccountShape,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapSyncResult>> {
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
      logger.debug(`Starting sync for account: ${account.email}`);

      const connectionResult = await ImapConnectionRepository.testConnection(
        { account },
        logger,
        t,
      );
      if (!connectionResult.success) {
        return fail({
          message: t("imapErrors.connection.test.failed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          cause: connectionResult,
        });
      }

      const folderResult = await ImapSyncRepository.syncAccountFolders(
        account,
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

      const folders = await db
        .select()
        .from(messengerFolders)
        .where(eq(messengerFolders.accountId, account.id));

      for (const folder of folders) {
        try {
          const messageResult = await ImapSyncRepository.syncFolderMessages(
            account,
            folder,
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

      logger.debug(`Completed sync for account: ${account.email}`);
      return success({ result });
    } catch (error) {
      logger.error(`Error syncing account ${account.email}`, parseError(error));

      return fail({
        message: t("imapErrors.sync.account.failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async syncAccountFolders(
    account: ImapAccountShape,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapSyncResult>> {
    const { t } = scopedTranslation.scopedT(locale);
    const startTime = Date.now();
    let foldersProcessed = 0;
    let foldersAdded = 0;
    let foldersUpdated = 0;
    const errors: ErrorResponseType[] = [];

    try {
      logger.debug(`Syncing folders for account: ${account.email}`);

      const remoteFoldersResult = await ImapConnectionRepository.listFolders(
        { account },
        logger,
        t,
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
            .from(messengerFolders)
            .where(eq(messengerFolders.path, remoteFolder.path))
            .limit(1);

          if (existingFolder) {
            // Update existing folder
            await db
              .update(messengerFolders)
              .set({
                displayName: remoteFolder.displayName,
                delimiter: remoteFolder.delimiter,
                isSelectable: remoteFolder.isSelectable,
                hasChildren: remoteFolder.hasChildren,
                specialUseType: toSpecialFolderType(
                  remoteFolder.specialUseType,
                ),
                uidValidity: remoteFolder.uidValidity,
                uidNext: remoteFolder.uidNext,
                messageCount: remoteFolder.messageCount,
                recentCount: remoteFolder.recentCount,
                unseenCount: remoteFolder.unseenCount,
                syncStatus: ImapSyncStatus.SYNCED,
                lastSyncAt: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(messengerFolders.id, existingFolder.id));

            foldersUpdated++;
            logger.debug(`Updated folder: ${remoteFolder.name}`);
          } else {
            // Create new folder
            const newFolder: NewMessengerFolder = {
              name: remoteFolder.name,
              displayName: remoteFolder.displayName,
              path: remoteFolder.path,
              delimiter: remoteFolder.delimiter,
              isSelectable: remoteFolder.isSelectable,
              hasChildren: remoteFolder.hasChildren,
              specialUseType: toSpecialFolderType(remoteFolder.specialUseType),
              uidValidity: remoteFolder.uidValidity,
              uidNext: remoteFolder.uidNext,
              messageCount: remoteFolder.messageCount,
              recentCount: remoteFolder.recentCount,
              unseenCount: remoteFolder.unseenCount,
              accountId: account.id,
              syncStatus: ImapSyncStatus.SYNCED,
              lastSyncAt: new Date(),
            };

            await db.insert(messengerFolders).values(newFolder);
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

      logger.debug(`Completed folder sync for account: ${account.email}`);
      return success({ result });
    } catch (error) {
      logger.error(
        `Error syncing folders for account ${account.email}`,
        parseError(error),
      );

      return fail({
        message: t("imapErrors.sync.folder.failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async syncFolderMessages(
    account: ImapAccountShape,
    folder: MessengerFolder,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImapSyncResult>> {
    const { t } = scopedTranslation.scopedT(locale);
    const startTime = Date.now();
    let messagesProcessed = 0;
    let messagesAdded = 0;
    let messagesUpdated = 0;
    const errors: ErrorResponseType[] = [];

    try {
      logger.debug(`Syncing messages for folder: ${folder.name}`);

      // Get messages from IMAP server
      const remoteMessagesResponse =
        await ImapConnectionRepository.listMessages(
          {
            account,
            folderPath: folder.path,
            options: { limit: account.maxMessages || 1000 },
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
                eq(emails.uid, remoteMessage.uid),
                eq(emails.accountId, account.id),
                eq(emails.folderId, folder.id),
              ),
            )
            .limit(1);

          if (existingMessage) {
            // Update existing message flags and body if now available
            await db
              .update(emails)
              .set({
                subject: remoteMessage.subject,
                isRead: remoteMessage.flags.includes(
                  ImapSyncRepository.IMAP_FLAGS.SEEN,
                ),
                isFlagged: remoteMessage.flags.includes(
                  ImapSyncRepository.IMAP_FLAGS.FLAGGED,
                ),
                isDeleted: remoteMessage.flags.includes(
                  ImapSyncRepository.IMAP_FLAGS.DELETED,
                ),
                isDraft: remoteMessage.flags.includes(
                  ImapSyncRepository.IMAP_FLAGS.DRAFT,
                ),
                isAnswered: remoteMessage.flags.includes(
                  ImapSyncRepository.IMAP_FLAGS.ANSWERED,
                ),
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
              type: MessageType.USER_COMMUNICATION,
              subject: remoteMessage.subject,
              recipientEmail: remoteMessage.to,
              senderEmail: remoteMessage.from,
              uid: remoteMessage.uid,
              messageId: remoteMessage.messageId,
              folderId: folder.id,
              accountId: account.id,
              bodyText: remoteMessage.bodyText,
              bodyHtml: remoteMessage.bodyHtml,
              headers: remoteMessage.headers,
              isRead: remoteMessage.flags.includes(
                ImapSyncRepository.IMAP_FLAGS.SEEN,
              ),
              isFlagged: remoteMessage.flags.includes(
                ImapSyncRepository.IMAP_FLAGS.FLAGGED,
              ),
              isDeleted: remoteMessage.flags.includes(
                ImapSyncRepository.IMAP_FLAGS.DELETED,
              ),
              isDraft: remoteMessage.flags.includes(
                ImapSyncRepository.IMAP_FLAGS.DRAFT,
              ),
              isAnswered: remoteMessage.flags.includes(
                ImapSyncRepository.IMAP_FLAGS.ANSWERED,
              ),
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

      logger.debug(`Completed message sync for folder: ${folder.name}`);
      return success({ result });
    } catch (error) {
      logger.error(
        `Error syncing messages for folder ${folder.name}`,
        parseError(error),
      );

      return fail({
        message: t("imapErrors.sync.message.failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
