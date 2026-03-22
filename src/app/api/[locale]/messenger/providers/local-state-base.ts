/**
 * LocalStateProvider — abstract base for providers that manage inbox state
 * in the local DB only, with no remote server to sync against.
 *
 * All inbox operations (listInbox, listFolders, moveMessage, markRead) are
 * implemented purely against the DB. Providers with a remote server (e.g. SMTP+IMAP)
 * extend this class and override individual methods to also apply changes remotely.
 */

import "server-only";

/* eslint-disable @typescript-eslint/no-unused-vars */

import { and, eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { emails, messengerFolders } from "../messages/db";
import { messengerAccounts } from "../accounts/db";
import type { MessageChannelValue } from "../accounts/enum";
import type {
  InboxFolder,
  InboxMessage,
  MessengerProvider,
  SendMessageInput,
  SendMessageResult,
} from "./provider";
import { scopedTranslation as providerScopedTranslation } from "./i18n";

export abstract class LocalStateProvider implements MessengerProvider {
  abstract readonly channel: typeof MessageChannelValue;
  abstract readonly name: string;

  /**
   * No remote folder sync — all inbox ops use local DB state.
   * Override to true in providers that sync with a remote server (e.g. IMAP).
   */
  readonly supportsRemoteFolders: boolean = false;

  abstract send(
    input: SendMessageInput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SendMessageResult>>;

  async listInbox(
    accountId: string,
    folderPath: string | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<InboxMessage[]>> {
    const { t } = providerScopedTranslation.scopedT(locale);
    try {
      const [rawAccount] = await db
        .select({ id: messengerAccounts.id })
        .from(messengerAccounts)
        .where(eq(messengerAccounts.id, accountId))
        .limit(1);

      if (!rawAccount) {
        return fail({
          message: t("providers.errors.smtpAccountNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const rows = await db
        .select({
          id: emails.id,
          uid: emails.uid,
          subject: emails.subject,
          senderEmail: emails.senderEmail,
          recipientEmail: emails.recipientEmail,
          sentAt: emails.sentAt,
          bodyText: emails.bodyText,
          bodyHtml: emails.bodyHtml,
          isRead: emails.isRead,
          isFlagged: emails.isFlagged,
          threadId: emails.threadId,
          inReplyTo: emails.inReplyTo,
          folderId: emails.folderId,
        })
        .from(emails)
        .where(and(eq(emails.accountId, accountId)))
        .limit(100);

      const folderMap = new Map<string, string>();
      if (rows.some((r) => r.folderId)) {
        await db
          .select({ id: messengerFolders.id, path: messengerFolders.path })
          .from(messengerFolders)
          .where(eq(messengerFolders.accountId, accountId))
          .then((folders) =>
            folders.forEach((f) => folderMap.set(f.id, f.path)),
          );
      }

      const messages: InboxMessage[] = rows
        .filter((r) => {
          if (!folderPath) {
            return true;
          }
          const path = r.folderId ? folderMap.get(r.folderId) : undefined;
          return path === folderPath;
        })
        .map((r) => ({
          uid: r.uid ?? 0,
          messageId: r.id,
          subject: r.subject ?? "",
          from: r.senderEmail ?? "",
          to: r.recipientEmail ?? "",
          date: r.sentAt ?? new Date(),
          bodyText: r.bodyText ?? undefined,
          bodyHtml: r.bodyHtml ?? undefined,
          isRead: r.isRead ?? false,
          isFlagged: r.isFlagged ?? false,
          folderId: r.folderId ?? undefined,
          folderPath: r.folderId ? folderMap.get(r.folderId) : undefined,
          threadId: r.threadId ?? undefined,
          inReplyTo: r.inReplyTo ?? undefined,
        }));

      logger.debug("provider.listInbox", { accountId, count: messages.length });
      return success(messages);
    } catch (error) {
      logger.error("provider.listInbox.error", parseError(error));
      return fail({
        message: t("providers.errors.smtpListInboxFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  async listFolders(
    accountId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<InboxFolder[]>> {
    const { t } = providerScopedTranslation.scopedT(locale);
    try {
      const rows = await db
        .select()
        .from(messengerFolders)
        .where(eq(messengerFolders.accountId, accountId));

      const folders: InboxFolder[] = rows.map((f) => ({
        id: f.id,
        path: f.path,
        name: f.name,
        displayName: f.displayName ?? f.name,
        specialUseType: f.specialUseType ?? undefined,
        messageCount: f.messageCount ?? 0,
        unseenCount: f.unseenCount ?? 0,
      }));

      return success(folders);
    } catch (error) {
      logger.error("provider.listFolders.error", parseError(error));
      return fail({
        message: t("providers.errors.smtpListFoldersFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Move a message to a different folder — DB only.
   * Providers with remote sync (e.g. IMAP) override this to also apply on server.
   */
  async moveMessage(
    accountId: string,
    uid: number,
    fromFolder: string,
    toFolder: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    const { t } = providerScopedTranslation.scopedT(locale);
    try {
      // Resolve target folder ID from path
      const [targetFolderRow] = await db
        .select({ id: messengerFolders.id })
        .from(messengerFolders)
        .where(
          and(
            eq(messengerFolders.accountId, accountId),
            eq(messengerFolders.path, toFolder),
          ),
        )
        .limit(1);

      if (!targetFolderRow) {
        return fail({
          message: t("providers.errors.smtpMoveMessageFailed"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      await db
        .update(emails)
        .set({ folderId: targetFolderRow.id, updatedAt: new Date() })
        .where(and(eq(emails.accountId, accountId), eq(emails.uid, uid)));

      logger.debug("provider.moveMessage", {
        accountId,
        uid,
        fromFolder,
        toFolder,
      });
      return success(undefined);
    } catch (error) {
      logger.error("provider.moveMessage.error", parseError(error));
      return fail({
        message: t("providers.errors.smtpMoveMessageFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Mark a message read/unread — DB only.
   * Providers with remote sync (e.g. IMAP) override this to also apply on server.
   */
  async markRead(
    accountId: string,
    uid: number,
    folderPath: string,
    isRead: boolean,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    const { t } = providerScopedTranslation.scopedT(locale);
    try {
      await db
        .update(emails)
        .set({ isRead, updatedAt: new Date() })
        .where(and(eq(emails.accountId, accountId), eq(emails.uid, uid)));

      logger.debug("provider.markRead", { accountId, uid, isRead });
      return success(undefined);
    } catch (error) {
      logger.error("provider.markRead.error", parseError(error));
      return fail({
        message: t("providers.errors.smtpMarkReadFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
