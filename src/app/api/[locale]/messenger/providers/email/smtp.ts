/**
 * SMTP Provider
 * Wraps the existing SmtpRepository + ImapConnectionRepository to implement
 * the MessengerProvider interface for the EMAIL channel via SMTP/IMAP.
 *
 * Extends LocalStateProvider - listInbox and listFolders use DB state.
 * moveMessage and markRead additionally apply changes on the IMAP server.
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import Imap from "imap";
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

import { messengerAccounts } from "../../accounts/db";
import { CampaignType, MessageChannel } from "../../accounts/enum";
import { messengerFolders } from "../../messages/db";
import type { SpecialFolderTypeValue } from "../../messages/enum";
import { SpecialFolderType } from "../../messages/enum";
import { scopedTranslation as providerScopedTranslation } from "../i18n";
import { LocalStateProvider } from "../local-state-base";
import type { SendMessageInput, SendMessageResult } from "../provider";
import { toImapShape } from "./imap-client/db";
import { scopedTranslation as smtpScopedTranslation } from "./smtp-client/i18n";
import type { SmtpSelectionCriteria } from "./smtp-client/repository";
import { SmtpRepository } from "./smtp-client/repository";

// Well-known system user UUID - used for service-layer sends (not tied to a real user)
const SYSTEM_UUID = "00000000-0000-0000-0000-000000000001";

const SERVICE_USER: JwtPrivatePayloadType = {
  id: SYSTEM_UUID,
  leadId: SYSTEM_UUID,
  isPublic: false,
  roles: [UserPermissionRole.ADMIN],
};

export class SmtpMessengerProvider extends LocalStateProvider {
  readonly channel = MessageChannel.EMAIL;
  readonly name = "SMTP";
  readonly supportsRemoteFolders = true;

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

    // Append to IMAP Sent folder (fire-and-forget - don't fail the send)
    this.appendToSentFolder(
      result.data.accountId,
      {
        from: `${input.senderName ?? ""} <${result.data.accountName}>`,
        to: input.toName ? `${input.toName} <${input.to}>` : input.to,
        subject: input.subject ?? "(no subject)",
        html: input.html ?? `<p>${input.text}</p>`,
        text: input.text,
        messageId: result.data.messageId,
      },
      logger,
    ).catch((err) => {
      logger.warn("smtp.provider: failed to append to Sent folder", {
        accountId: result.data.accountId,
        error: parseError(err).message,
      });
    });

    return success({
      messageId: result.data.messageId,
      accountId: result.data.accountId,
      accountName: result.data.accountName,
      accepted: result.data.accepted,
      rejected: result.data.rejected,
      providerResponse: result.data.response,
    });
  }

  /**
   * Find the path of a folder by its special use type for a given account.
   */
  private async getFolderPath(
    accountId: string,
    specialUseType: typeof SpecialFolderTypeValue,
  ): Promise<string | null> {
    const [folder] = await db
      .select({ path: messengerFolders.path })
      .from(messengerFolders)
      .where(
        and(
          eq(messengerFolders.accountId, accountId),
          eq(messengerFolders.specialUseType, specialUseType),
        ),
      )
      .limit(1);
    return folder?.path ?? null;
  }

  /**
   * Append a sent message to the IMAP Sent folder.
   */
  private async appendToSentFolder(
    accountId: string,
    msg: {
      from: string;
      to: string;
      subject: string;
      html: string;
      text?: string;
      messageId: string;
    },
    logger: EndpointLogger,
  ): Promise<void> {
    const sentPath = await this.getFolderPath(
      accountId,
      SpecialFolderType.SENT,
    );
    if (!sentPath) {
      logger.debug("smtp.provider: no Sent folder found, skipping append", {
        accountId,
      });
      return;
    }

    const [rawAccount] = await db
      .select()
      .from(messengerAccounts)
      .where(eq(messengerAccounts.id, accountId))
      .limit(1);

    if (!rawAccount) {
      return;
    }

    const account = toImapShape(rawAccount);
    const date = new Date();
    const rawMessage = [
      `From: ${msg.from}`,
      `To: ${msg.to}`,
      `Subject: ${msg.subject}`,
      `Date: ${date.toUTCString()}`,
      `Message-ID: ${msg.messageId}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=utf-8`,
      ``,
      msg.html,
    ].join("\r\n");

    const targetMailbox: string = sentPath;
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
        imap.append(
          Buffer.from(rawMessage),
          { mailbox: targetMailbox, flags: ["\\Seen"], date },
          (err) => {
            imap.end();
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          },
        );
      });

      imap.once("error", (err: Error) => reject(err));
      imap.connect();
    });

    logger.debug("smtp.provider: appended message to Sent folder", {
      accountId,
      sentPath,
      messageId: msg.messageId,
    });
  }

  /**
   * Move message on the IMAP server, then update DB via base class.
   */
  override async moveMessage(
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

      // Update DB state via base class
      return super.moveMessage(
        accountId,
        uid,
        fromFolder,
        toFolder,
        logger,
        locale,
      );
    } catch (error) {
      logger.error("smtp.provider.moveMessage.error", parseError(error));
      return fail({
        message: t("providers.errors.smtpMoveMessageFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Mark read/unread on the IMAP server, then update DB via base class.
   */
  override async markRead(
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

      // Update DB state via base class
      return super.markRead(accountId, uid, folderPath, isRead, logger, locale);
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
