/**
 * Messenger Provider Registry
 * Returns the correct MessengerProvider instance for a given channel/account.
 * This is the single entry point for the rest of the system to get a provider.
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";

import { messengerAccounts } from "../accounts/db";
import { MessengerProvider as MessengerProviderEnum } from "../accounts/enum";
import { MessageChannel } from "../accounts/enum";
import { resendProvider } from "./email/resend";
import { smtpProvider } from "./email/smtp";
import { scopedTranslation as providerScopedTranslation } from "./i18n";
import { SmsMessengerProvider } from "./sms/twilio";
import { TelegramMessengerProvider } from "./telegram/telegram-bot";
import type { MessengerProvider } from "./provider";
import { WhatsAppMessengerProvider } from "./whatsapp/whatsapp-business";

/**
 * Get provider for a given messenger_accounts row ID (unified accounts table).
 */
export async function getProviderByMessengerAccountId(
  accountId: string,
): Promise<ResponseType<MessengerProvider>> {
  const { t } = providerScopedTranslation.scopedT("en-US");
  const [account] = await db
    .select({
      channel: messengerAccounts.channel,
      provider: messengerAccounts.provider,
    })
    .from(messengerAccounts)
    .where(eq(messengerAccounts.id, accountId))
    .limit(1);

  if (!account) {
    return fail({
      message: t("providers.errors.accountNotFound"),
      errorType: ErrorResponseTypes.NOT_FOUND,
    });
  }

  return {
    success: true,
    data: resolveProviderFromAccount(
      account.channel,
      account.provider,
      accountId,
    ),
  };
}

/**
 * Get the default email provider.
 * Prefers SMTP (full inbox support). Falls back to Resend if RESEND_API_KEY set and no SMTP accounts.
 */
export function getDefaultEmailProvider(): MessengerProvider {
  if (process.env.RESEND_API_KEY && !process.env.SMTP_HOST) {
    return resendProvider;
  }
  return smtpProvider;
}

/**
 * Resolve a provider from channel + provider enum values + account ID.
 */
function resolveProviderFromAccount(
  channel: string,
  provider: string,
  accountId: string,
): MessengerProvider {
  if (channel === MessageChannel.EMAIL) {
    if (provider === MessengerProviderEnum.RESEND) {
      return resendProvider;
    }
    return smtpProvider;
  }

  if (channel === MessageChannel.WHATSAPP) {
    return new WhatsAppMessengerProvider(accountId);
  }

  if (channel === MessageChannel.TELEGRAM) {
    return new TelegramMessengerProvider(accountId);
  }

  // SMS (TWILIO / AWS_SNS / MESSAGEBIRD / HTTP)
  return new SmsMessengerProvider(accountId);
}

/**
 * Get provider by channel — returns the default provider for that channel.
 * For SMS/WhatsApp/Telegram, caller must supply an accountId.
 */
export function getProviderByChannel(
  channel: string,
  accountId?: string,
): MessengerProvider {
  switch (channel) {
    case MessageChannel.EMAIL:
      return getDefaultEmailProvider();
    case MessageChannel.SMS:
      return new SmsMessengerProvider(accountId ?? "");
    case MessageChannel.WHATSAPP:
      return new WhatsAppMessengerProvider(accountId ?? "");
    case MessageChannel.TELEGRAM:
      return new TelegramMessengerProvider(accountId ?? "");
    default:
      return getDefaultEmailProvider();
  }
}
