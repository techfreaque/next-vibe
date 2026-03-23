/**
 * Resend Provider
 * Send-only email provider using the Resend SDK.
 * Inbox operations are not supported by Resend - handled by SendOnlyProvider base.
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { Resend } from "resend";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { messengerAccounts } from "../../accounts/db";
import {
  MessageChannel,
  MessengerAccountStatus,
  MessengerProvider as MessengerProviderEnum,
} from "../../accounts/enum";
import { scopedTranslation as providerScopedTranslation } from "../i18n";
import type { SendMessageInput, SendMessageResult } from "../provider";
import { SendOnlyProvider } from "../send-only-base";

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

      const apiKey = account?.apiKey ?? process.env.RESEND_API_KEY;
      if (!apiKey) {
        return fail({
          message: t("providers.errors.resendKeyNotConfigured"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const fromEmail =
        account?.smtpFromEmail ??
        process.env.RESEND_FROM_EMAIL ??
        "noreply@example.com";
      const fromName = input.senderName ?? account?.name ?? "Messenger";

      const resend = getResendClient(apiKey);

      const { data, error } = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [input.to],
        subject: input.subject ?? "(no subject)",
        text: input.text,
        html: input.html,
        replyTo: input.replyTo,
        headers: input.unsubscribeUrl
          ? { "List-Unsubscribe": `<${input.unsubscribeUrl}>` }
          : undefined,
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
