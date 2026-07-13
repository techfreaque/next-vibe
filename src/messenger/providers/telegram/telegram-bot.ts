/**
 * Telegram Bot Provider
 * Send-only provider for Telegram via bot API.
 * Inbox operations are not supported - handled by SendOnlyProvider base.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

import { MessageChannel } from "../../accounts/enum";
import { scopedTranslation as providerScopedTranslation } from "../../i18n";
import { sendViaMessagingAccount } from "../../messaging/send/service";
import type { SendMessageInput, SendMessageResult } from "../provider";
import { SendOnlyProvider } from "../send-only-base";

export class TelegramMessengerProvider extends SendOnlyProvider {
  readonly channel = MessageChannel.TELEGRAM;
  readonly name = "Telegram";

  constructor(private readonly messagingAccountId: string) {
    super();
  }

  async send(
    input: SendMessageInput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SendMessageResult>> {
    const { t } = providerScopedTranslation.scopedT(locale);
    const result = await sendViaMessagingAccount(
      {
        to: input.to,
        message: input.text,
        messagingAccountId: this.messagingAccountId,
        subject: input.subject,
        userId: input.userId,
        leadId: input.leadId,
      },
      logger,
      locale,
    );

    if (!result.success || !result.data) {
      return fail({
        message: result.message ?? t("providers.errors.telegramSendFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    return {
      success: true,
      data: {
        messageId: result.data.messageId,
        accountId: this.messagingAccountId,
        accountName: this.name,
        accepted: [input.to],
        rejected: [],
        providerResponse: result.data.messageId,
      },
    };
  }
}
