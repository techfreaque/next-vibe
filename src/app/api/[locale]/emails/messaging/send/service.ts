/**
 * Messaging Send Service
 * Sends messages via a configured messaging account (SMS, WhatsApp, Telegram)
 * Looks up credentials from the DB and routes to the correct provider.
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { getTelegramProvider } from "@/app/api/[locale]/sms/providers/telegram";
import { getWhatsAppProvider } from "@/app/api/[locale]/sms/providers/whatsapp";
import { getSmsProvider } from "@/app/api/[locale]/sms/send-sms";
import { SmsProviders } from "@/app/api/[locale]/sms/utils";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { emails } from "../../messages/db";
import { EmailStatus, EmailType } from "../../messages/enum";
import { messagingAccounts } from "../db";
import { MessagingProvider } from "../enum";

type EmailInsert = typeof emails.$inferInsert;

export interface SendMessagingParams {
  /** Target phone/chat ID */
  to: string;
  /** Message text content */
  message: string;
  /** Messaging account ID to use (from messaging_accounts table) */
  messagingAccountId: string;
  /** Optional subject (stored in the emails record) */
  subject?: string;
  /** Optional user ID association */
  userId?: string;
  /** Optional lead ID association */
  leadId?: string;
}

export interface SendMessagingResult {
  messageId: string;
  emailRecordId: string;
}

/**
 * Resolve provider name string to SmsProviders enum value
 */
function resolveProviderEnum(provider: string): SmsProviders {
  const map: Record<string, SmsProviders> = {
    [MessagingProvider.TWILIO]: SmsProviders.TWILIO,
    [MessagingProvider.AWS_SNS]: SmsProviders.AWS_SNS,
    [MessagingProvider.MESSAGEBIRD]: SmsProviders.MESSAGEBIRD,
    [MessagingProvider.HTTP]: SmsProviders.HTTP,
    [MessagingProvider.WHATSAPP_BUSINESS]: SmsProviders.WHATSAPP,
    [MessagingProvider.TELEGRAM_BOT]: SmsProviders.TELEGRAM,
  };
  return map[provider] ?? SmsProviders.TWILIO;
}

/**
 * Send a message via a configured messaging account.
 * Looks up the account from the DB, instantiates the provider with DB credentials,
 * sends the message, and records it in the emails table.
 */
export async function sendViaMessagingAccount(
  params: SendMessagingParams,
  logger: EndpointLogger,
): Promise<ResponseType<SendMessagingResult>> {
  try {
    // 1. Look up the messaging account
    const [account] = await db
      .select()
      .from(messagingAccounts)
      .where(eq(messagingAccounts.id, params.messagingAccountId))
      .limit(1);

    if (!account) {
      return fail({
        message: "app.api.emails.messaging.send.errors.accountNotFound",
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: { accountId: params.messagingAccountId },
      });
    }

    logger.debug("Sending message via account", {
      accountId: account.id,
      channel: account.channel,
      provider: account.provider,
      to: params.to,
    });

    // 2. Instantiate provider with DB credentials
    let smsProvider;
    const providerEnum = resolveProviderEnum(account.provider);

    switch (providerEnum) {
      case SmsProviders.WHATSAPP:
        smsProvider = getWhatsAppProvider(
          account.fromId ?? undefined,
          account.apiToken ?? undefined,
        );
        break;
      case SmsProviders.TELEGRAM:
        smsProvider = getTelegramProvider(account.apiToken ?? undefined);
        break;
      case SmsProviders.TWILIO:
      default:
        // Twilio uses env vars; use the shared factory
        smsProvider = getSmsProvider(SmsProviders.TWILIO);
        break;
    }

    // 3. Send the message
    const sendResult = await smsProvider.sendSms(
      {
        to: params.to,
        message: params.message,
        from: account.fromId ?? undefined,
      },
      logger,
    );

    if (!sendResult.success) {
      // Record failed attempt
      await db.insert(emails).values({
        subject: params.subject ?? params.message.substring(0, 100),
        recipientEmail: params.to,
        senderEmail: account.fromId ?? "unknown",
        type: EmailType.TRANSACTIONAL as EmailInsert["type"],
        status: EmailStatus.FAILED as EmailInsert["status"],
        channel: account.channel as EmailInsert["channel"],
        toPhone: params.to,
        fromPhone: account.fromId,
        messagingAccountId: account.id,
        userId: params.userId,
        leadId: params.leadId,
        error: sendResult.message as string,
        sentAt: new Date(),
      });

      return fail({
        message: sendResult.message as string,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const externalId = sendResult.data.messageId;

    // 4. Record in emails table
    const [emailRecord] = await db
      .insert(emails)
      .values({
        subject: params.subject ?? params.message.substring(0, 100),
        recipientEmail: params.to,
        senderEmail: account.fromId ?? "unknown",
        type: EmailType.TRANSACTIONAL as EmailInsert["type"],
        status: EmailStatus.SENT as EmailInsert["status"],
        channel: account.channel as EmailInsert["channel"],
        toPhone: params.to,
        fromPhone: account.fromId,
        messagingAccountId: account.id,
        userId: params.userId,
        leadId: params.leadId,
        externalId,
        sentAt: new Date(),
      })
      .returning({ id: emails.id });

    if (!emailRecord) {
      logger.warn("Message sent but email record creation failed", {
        externalId,
      });
      return success({ messageId: externalId, emailRecordId: "unknown" });
    }

    // 5. Update account usage stats
    await db
      .update(messagingAccounts)
      .set({
        messagesSentTotal: (account.messagesSentTotal ?? 0) + 1,
        messagesSentToday: (account.messagesSentToday ?? 0) + 1,
        lastUsedAt: new Date(),
        consecutiveFailures: 0,
        updatedAt: new Date(),
      })
      .where(eq(messagingAccounts.id, account.id));

    logger.info("Message sent successfully", {
      accountId: account.id,
      externalId,
      emailRecordId: emailRecord.id,
    });

    return success({ messageId: externalId, emailRecordId: emailRecord.id });
  } catch (error) {
    logger.error(
      "Error sending message via messaging account",
      parseError(error),
    );
    return fail({
      message: "app.api.emails.messaging.send.errors.unexpected",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { error: parseError(error).message },
    });
  }
}
