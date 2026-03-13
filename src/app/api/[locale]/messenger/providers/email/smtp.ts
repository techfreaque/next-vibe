/**
 * SMTP Provider
 * Wraps the existing SmtpRepository + ImapConnectionRepository to implement
 * the MessengerProvider interface for the EMAIL channel via SMTP/IMAP.
 */

import "server-only";

import Imap from "imap";
import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

import { imapFolders, toImapShape } from "./imap-client/db";
import { messengerAccounts } from "../../accounts/db";
import { emails } from "../../messages/db";
import { CampaignType } from "../../accounts/enum";
import { scopedTranslation as smtpScopedTranslation } from "./smtp-client/i18n";
import { SmtpRepository } from "./smtp-client/repository";
import type { SmtpSelectionCriteria } from "./smtp-client/repository";
import type {
  InboxFolder,
  InboxMessage,
  MessengerProvider,
  SendMessageInput,
  SendMessageResult,
} from "../provider";
import { MessageChannel } from "../../accounts/enum";
import { scopedTranslation as providerScopedTranslation } from "../i18n";

// Well-known system user UUID — used for service-layer sends (not tied to a real user)
const SYSTEM_UUID = "00000000-0000-0000-0000-000000000001";

const SERVICE_USER: JwtPrivatePayloadType = {
  id: SYSTEM_UUID,
  leadId: SYSTEM_UUID,
  isPublic: false,
  roles: [UserPermissionRole.ADMIN],
};

export class SmtpMessengerProvider implements MessengerProvider {
  readonly channel = MessageChannel.EMAIL;
  readonly name = "SMTP";

  async send(
    input: SendMessageInput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SendMessageResult>> {
    const { t: smtpT } = smtpScopedTranslation.scopedT(locale);
    const { t } = providerScopedTranslation.scopedT(locale);
    const { language, country } = getLanguageAndCountryFromLocale(locale);

    const selectionCriteria: SmtpSelectionCriteria = {
      campaignType: CampaignType.TRANSACTIONAL,
      emailJourneyVariant: null,
      emailCampaignStage: null,
      country,
      language,
    };

    const result = await SmtpRepository.sendEmail(
      {
        to: input.to,
        toName: input.toName,
        subject: input.subject ?? "(no subject)",
        html: input.html ?? `<p>${input.text}</p>`,
        text: input.text,
        replyTo: input.replyTo,
        unsubscribeUrl: input.unsubscribeUrl,
        senderName: input.senderName ?? "Messenger",
        selectionCriteria,
        leadId: input.leadId,
        campaignId: input.campaignId,
      },
      SERVICE_USER,
      smtpT,
      logger,
    );

    if (!result.success || !result.data) {
      return fail({
        message: result.message ?? t("providers.errors.smtpSendFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    return success({
      messageId: result.data.messageId,
      accountId: result.data.accountId,
      accountName: result.data.accountName,
      accepted: result.data.accepted,
      rejected: result.data.rejected,
      providerResponse: result.data.response,
    });
  }

  async listInbox(
    accountId: string,
    folderPath: string | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<InboxMessage[]>> {
    const { t } = providerScopedTranslation.scopedT(locale);
    try {
      const [rawAccount] = await db
        .select()
        .from(messengerAccounts)
        .where(eq(messengerAccounts.id, accountId))
        .limit(1);

      if (!rawAccount) {
        return fail({
          message: t("providers.errors.smtpAccountNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const targetFolder = folderPath ?? "INBOX";

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
          .select({ id: imapFolders.id, path: imapFolders.path })
          .from(imapFolders)
          .where(eq(imapFolders.accountId, accountId))
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
          return path === targetFolder;
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

      logger.debug("smtp.provider.listInbox", {
        accountId,
        count: messages.length,
      });
      return success(messages);
    } catch (error) {
      logger.error("smtp.provider.listInbox.error", parseError(error));
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
        .from(imapFolders)
        .where(eq(imapFolders.accountId, accountId));

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
      logger.error("smtp.provider.listFolders.error", parseError(error));
      return fail({
        message: t("providers.errors.smtpListFoldersFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

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
      const [rawAccount] = await db
        .select()
        .from(messengerAccounts)
        .where(eq(messengerAccounts.id, accountId))
        .limit(1);

      if (!rawAccount) {
        return fail({
          message: t("providers.errors.smtpAccountNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const account = toImapShape(rawAccount);

      await new Promise<void>((resolve, reject) => {
        const imap = new Imap({
          user: account.username,
          password: account.password,
          host: account.host,
          port: account.port,
          tls: account.secure,
          tlsOptions: { rejectUnauthorized: false },
          connTimeout: 10000,
          authTimeout: 5000,
        });

        imap.once("ready", () => {
          imap.openBox(fromFolder, false, (openErr) => {
            if (openErr) {
              imap.end();
              reject(openErr);
              return;
            }
            imap.move([uid], toFolder, (moveErr) => {
              imap.end();
              if (moveErr) {
                reject(moveErr);
              } else {
                resolve();
              }
            });
          });
        });

        imap.once("error", (err: Error) => reject(err));
        imap.connect();
      });

      logger.debug("smtp.provider.moveMessage", {
        accountId,
        uid,
        fromFolder,
        toFolder,
      });
      return success(undefined);
    } catch (error) {
      logger.error("smtp.provider.moveMessage.error", parseError(error));
      return fail({
        message: t("providers.errors.smtpMoveMessageFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

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
      const [rawAccount] = await db
        .select()
        .from(messengerAccounts)
        .where(eq(messengerAccounts.id, accountId))
        .limit(1);

      if (!rawAccount) {
        return fail({
          message: t("providers.errors.smtpAccountNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const account = toImapShape(rawAccount);

      await new Promise<void>((resolve, reject) => {
        const imap = new Imap({
          user: account.username,
          password: account.password,
          host: account.host,
          port: account.port,
          tls: account.secure,
          tlsOptions: { rejectUnauthorized: false },
          connTimeout: 10000,
          authTimeout: 5000,
        });

        imap.once("ready", () => {
          imap.openBox(folderPath, false, (openErr) => {
            if (openErr) {
              imap.end();
              reject(openErr);
              return;
            }
            const flag = "\\Seen";
            if (isRead) {
              imap.addFlags([uid], flag, (err) => {
                imap.end();
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            } else {
              imap.delFlags([uid], flag, (err) => {
                imap.end();
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            }
          });
        });

        imap.once("error", (err: Error) => reject(err));
        imap.connect();
      });

      // Sync to DB
      await db
        .update(emails)
        .set({ isRead, updatedAt: new Date() })
        .where(and(eq(emails.accountId, accountId), eq(emails.uid, uid)));

      logger.debug("smtp.provider.markRead", { accountId, uid, isRead });
      return success(undefined);
    } catch (error) {
      logger.error("smtp.provider.markRead.error", parseError(error));
      return fail({
        message: t("providers.errors.smtpMarkReadFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

export const smtpProvider = new SmtpMessengerProvider();
