/**
 * Messaging Send Service
 * Sends messages via a configured messenger account (SMS, WhatsApp, Telegram, Email).
 * Routes through messenger_accounts (unified table) + MessengerProvider interface.
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { messengerAccounts } from "../../accounts/db";
import { emails } from "../../messages/db";
import { MessageStatus, MessageType } from "../../messages/enum";
import { getProviderByMessengerAccountId } from "../../providers/registry";
import { scopedTranslation } from "../i18n";

export interface SendMessagingParams {
  /** Target phone/chat ID or email address */
  to: string;
  /** Message text content */
  message: string;
  /** Account ID — now references messenger_accounts.id */
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
 * Send a message via a configured messenger account.
 * Looks up from messenger_accounts, resolves the correct MessengerProvider,
 * sends, and records in the emails table.
 */
export async function sendViaMessagingAccount(
  params: SendMessagingParams,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<SendMessagingResult>> {
  const { t } = scopedTranslation.scopedT(locale);
  try {
    // 1. Resolve provider through unified registry (reads messenger_accounts)
    const providerResult = await getProviderByMessengerAccountId(
      params.messagingAccountId,
    );

    if (!providerResult.success) {
      return fail({
        message: t("send.errors.accountNotFound", {
          accountId: params.messagingAccountId,
        }),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const provider = providerResult.data;

    // 2. Look up account metadata from messenger_accounts
    const [account] = await db
      .select()
      .from(messengerAccounts)
      .where(eq(messengerAccounts.id, params.messagingAccountId))
      .limit(1);

    if (!account) {
      return fail({
        message: t("send.errors.accountNotFound", {
          accountId: params.messagingAccountId,
        }),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    logger.debug("Sending message via provider", {
      accountId: account.id,
      channel: account.channel,
      provider: provider.name,
      to: params.to,
    });

    // 3. Send via unified provider interface
    const sendResult = await provider.send(
      {
        to: params.to,
        text: params.message,
        subject: params.subject,
        leadId: params.leadId,
        userId: params.userId,
      },
      logger,
      locale,
    );

    if (!sendResult.success) {
      // Record failed attempt
      await db.insert(emails).values({
        subject: params.subject ?? params.message.substring(0, 100),
        recipientEmail: params.to,
        senderEmail: account.fromId ?? "unknown",
        type: MessageType.TRANSACTIONAL,
        status: MessageStatus.FAILED,
        channel: account.channel,
        toPhone: params.to,
        fromPhone: account.fromId,
        accountId: account.id,
        userId: params.userId,
        leadId: params.leadId,
        error: sendResult.message,
        sentAt: new Date(),
      });

      return fail({
        message: t("send.errors.sendFailed"),
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
        type: MessageType.TRANSACTIONAL,
        status: MessageStatus.SENT,
        channel: account.channel,
        toPhone: params.to,
        fromPhone: account.fromId,
        accountId: account.id,
        userId: params.userId,
        leadId: params.leadId,
        messageId: externalId,
        sentAt: new Date(),
      })
      .returning({ id: emails.id });

    if (!emailRecord) {
      logger.warn("Message sent but record creation failed", { externalId });
      return success({ messageId: externalId, emailRecordId: "unknown" });
    }

    // 5. Update account usage stats in messenger_accounts
    await db
      .update(messengerAccounts)
      .set({
        messagesSentTotal: sql`messages_sent_total + 1`,
        messagesSentToday: sql`messages_sent_today + 1`,
        lastUsedAt: new Date(),
        consecutiveFailures: 0,
        updatedAt: new Date(),
      })
      .where(eq(messengerAccounts.id, account.id));

    logger.info("Message sent via provider", {
      accountId: account.id,
      provider: provider.name,
      externalId,
      emailRecordId: emailRecord.id,
    });

    return success({ messageId: externalId, emailRecordId: emailRecord.id });
  } catch (error) {
    logger.error("Error sending message", parseError(error));
    return fail({
      message: t("send.errors.unexpected", {
        error: parseError(error).message,
      }),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
