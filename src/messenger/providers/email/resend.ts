/**
 * Resend Provider
 * Send-only email provider using the Resend SDK.
 * Inbox operations are not supported by Resend - handled by SendOnlyProvider base.
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";
import { Resend } from "resend";

import { messengerAccounts } from "../../accounts/db";
import {
  MessageChannel,
  MessengerAccountStatus,
  MessengerProvider as MessengerProviderEnum,
} from "../../accounts/enum";
import { messengerEnv } from "../../env";
import { scopedTranslation as providerScopedTranslation } from "../../i18n";
import { scopedTranslation as mailboxTranslation } from "../../system-mailbox/i18n";
import type { SendMessageInput, SendMessageResult } from "../provider";
import { SendOnlyProvider } from "../send-only-base";
import { buildListUnsubscribeHeaders } from "./list-unsubscribe";
import { isMailSinkActive, sinkMail } from "./mail-sink";
import {
  EMAIL_LOGO_CID,
  EMAIL_LOGO_CONTENT_TYPE,
  EMAIL_LOGO_FILENAME,
} from "./smtp-client/email-logo";
import { prepareEmailLogo } from "./smtp-client/inline-logo";

/** Resend client cache keyed by api key */
const clientCache = new Map<string, Resend>();

function getResendClient(apiKey: string): Resend {
  const cached = clientCache.get(apiKey);
  if (cached) {
    return cached;
  }
  const client = new Resend(apiKey);
  clientCache.set(apiKey, client);
  return client;
}

export class ResendMessengerProvider extends SendOnlyProvider {
  readonly channel = MessageChannel.EMAIL;
  readonly name = "Resend";

  async send(
    input: SendMessageInput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SendMessageResult>> {
    const { t } = providerScopedTranslation.scopedT(locale);
    const subject =
      input.subject ??
      mailboxTranslation.scopedT(locale).t("inbox.widget.noSubject");
    try {
      const [account] = await db
        .select()
        .from(messengerAccounts)
        .where(
          and(
            eq(messengerAccounts.channel, MessageChannel.EMAIL),
            eq(messengerAccounts.provider, MessengerProviderEnum.RESEND),
            eq(messengerAccounts.status, MessengerAccountStatus.ACTIVE),
          ),
        )
        .limit(1);

      const apiKey = account?.apiKey ?? messengerEnv.RESEND_API_KEY;
      if (!apiKey) {
        return fail({
          message: t("providers.errors.resendKeyNotConfigured"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const fromEmail =
        account?.smtpFromEmail ??
        messengerEnv.RESEND_FROM_EMAIL ??
        "noreply@example.com";
      const fromName = input.senderName ?? account?.name ?? "Messenger";

      const { html, logo } = await prepareEmailLogo(input.html);
      const headers = input.unsubscribeUrl
        ? buildListUnsubscribeHeaders(input.to, input.unsubscribeUrl)
        : undefined;

      // Non-production never calls the Resend API (see mail-sink.ts).
      if (isMailSinkActive()) {
        const sinked = await sinkMail(
          {
            from: `${fromName} <${fromEmail}>`,
            to: input.to,
            subject,
            text: input.text,
            html,
            replyTo: input.replyTo,
            headers,
            attachments: logo
              ? [
                  {
                    filename: EMAIL_LOGO_FILENAME,
                    content: logo,
                    cid: EMAIL_LOGO_CID,
                    contentType: EMAIL_LOGO_CONTENT_TYPE,
                  },
                ]
              : undefined,
          },
          logger,
        );
        return success({
          messageId: sinked.messageId,
          accountId: account?.id ?? "resend-env",
          accountName: account?.name ?? "Resend",
          accepted: sinked.accepted,
          rejected: [],
          providerResponse: sinked.response,
        });
      }

      const resend = getResendClient(apiKey);

      const { data, error } = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [input.to],
        subject,
        text: input.text,
        html,
        attachments: logo
          ? [
              {
                filename: EMAIL_LOGO_FILENAME,
                content: logo,
                contentId: EMAIL_LOGO_CID,
                contentType: EMAIL_LOGO_CONTENT_TYPE,
              },
            ]
          : undefined,
        replyTo: input.replyTo,
        headers,
      });

      if (error || !data) {
        logger.error("resend.provider.send.error", { error });
        return fail({
          message: t("providers.errors.resendSendFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info("resend.provider.send.success", {
        messageId: data.id,
        to: input.to,
      });

      return success({
        messageId: data.id,
        accountId: account?.id ?? "resend-env",
        accountName: account?.name ?? "Resend",
        accepted: [input.to],
        rejected: [],
        providerResponse: `id:${data.id}`,
      });
    } catch (error) {
      logger.error("resend.provider.send.exception", parseError(error));
      return fail({
        message: t("providers.errors.resendProviderError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

export const resendProvider = new ResendMessengerProvider();
