/**
 * Telegram Bot API Provider
 * Uses Telegram's Bot API to send messages to a chat
 */

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { smsEnv } from "../env";
import type { SendSmsParams, SmsProvider, SmsResult } from "../utils";
import { SmsProviders } from "../utils";

interface TelegramErrorResponse {
  ok: false;
  description?: string;
  error_code?: number;
}

interface TelegramSuccessResponse {
  ok: true;
  result: {
    message_id: number;
  };
}

type TelegramResponse = TelegramErrorResponse | TelegramSuccessResponse;

/**
 * Creates a Telegram Bot API provider instance.
 * The `to` field in SendSmsParams is used as the Telegram chat_id.
 */
export function getTelegramProvider(botToken?: string): SmsProvider {
  return {
    name: SmsProviders.TELEGRAM,

    async sendSms(
      params: SendSmsParams,
      logger: EndpointLogger,
    ): Promise<ResponseType<SmsResult>> {
      const token = botToken ?? smsEnv.TELEGRAM_BOT_TOKEN;

      if (!token) {
        return fail({
          message: "app.api.sms.sms.error.missing_recipient",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      if (!params.to) {
        return fail({
          message: "app.api.sms.sms.error.invalid_phone_format",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      if (!params.message?.trim()) {
        return fail({
          message: "app.api.sms.sms.error.empty_message",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      logger.debug("Sending message via Telegram Bot API", {
        chatId: params.to,
      });

      try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        const body = JSON.stringify({
          chat_id: params.to,
          text: params.message,
          parse_mode: "HTML",
        });

        const response = await fetch(url, {
          method: "POST",
          headers: {
            // eslint-disable-next-line i18next/no-literal-string
            "Content-Type": "application/json",
          },
          body,
        });

        const data = (await response.json()) as TelegramResponse;

        if (!data.ok) {
          const errorData = data as TelegramErrorResponse;
          return fail({
            message: "app.api.sms.sms.error.delivery_failed",
            errorType: ErrorResponseTypes.SMS_ERROR,
            messageParams: {
              error:
                errorData.description ??
                // eslint-disable-next-line i18next/no-literal-string
                `Error ${errorData.error_code ?? "unknown"}`,
            },
          });
        }

        const successData = data as TelegramSuccessResponse;

        return {
          success: true,
          data: {
            messageId: String(successData.result.message_id),
            provider: SmsProviders.TELEGRAM,
            timestamp: new Date().toISOString(),
            to: params.to,
          },
        };
      } catch (error) {
        return fail({
          message: "app.api.sms.sms.error.delivery_failed",
          errorType: ErrorResponseTypes.SMS_ERROR,
          messageParams: {
            error:
              // eslint-disable-next-line i18next/no-literal-string
              error instanceof Error ? error.message : "Unknown error",
          },
        });
      }
    },
  };
}
