/**
 * WhatsApp Business Cloud API Provider
 * Uses Meta's WhatsApp Business Cloud API to send messages
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

interface WhatsAppErrorResponse {
  error?: {
    message?: string;
    code?: number;
    type?: string;
  };
}

interface WhatsAppSuccessResponse {
  messages?: Array<{ id: string }>;
}

/**
 * Creates a WhatsApp Business Cloud API provider instance
 */
export function getWhatsAppProvider(
  phoneNumberId?: string,
  accessToken?: string,
): SmsProvider {
  return {
    name: SmsProviders.WHATSAPP,

    async sendSms(
      params: SendSmsParams,
      logger: EndpointLogger,
    ): Promise<ResponseType<SmsResult>> {
      const numId = phoneNumberId ?? smsEnv.WHATSAPP_PHONE_NUMBER_ID;
      const token = accessToken ?? smsEnv.WHATSAPP_ACCESS_TOKEN;

      if (!numId || !token) {
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

      logger.debug("Sending message via WhatsApp Business API", {
        to: params.to,
        phoneNumberId: numId,
      });

      try {
        const url = `https://graph.facebook.com/v18.0/${numId}/messages`;

        const body = JSON.stringify({
          messaging_product: "whatsapp",
          to: params.to,
          type: "text",
          text: { body: params.message },
        });

        const response = await fetch(url, {
          method: "POST",
          headers: {
            // eslint-disable-next-line i18next/no-literal-string
            "Content-Type": "application/json",
            // eslint-disable-next-line i18next/no-literal-string
            Authorization: `Bearer ${token}`,
          },
          body,
        });

        if (!response.ok) {
          let errorData: WhatsAppErrorResponse = {};
          try {
            errorData = (await response.json()) as WhatsAppErrorResponse;
          } catch {
            // ignore JSON parse errors
          }

          return fail({
            message: "app.api.sms.sms.error.delivery_failed",
            errorType: ErrorResponseTypes.SMS_ERROR,
            messageParams: {
              error:
                errorData.error?.message ??
                // eslint-disable-next-line i18next/no-literal-string
                `HTTP ${response.status}`,
            },
          });
        }

        const data = (await response.json()) as WhatsAppSuccessResponse;
        const messageId = data.messages?.[0]?.id ?? "unknown";

        return {
          success: true,
          data: {
            messageId,
            provider: SmsProviders.WHATSAPP,
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
