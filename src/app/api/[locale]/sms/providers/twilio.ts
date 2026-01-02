/// <reference types="node" />
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { smsEnv } from "../env";
import type { SendSmsParams, SmsProvider, SmsResult } from "../utils";
import { SmsProviders } from "../utils";

// Define interfaces for Twilio responses
interface TwilioErrorResponse {
  message?: string;
  error_message?: string;
  code?: string | number;
  error_code?: string | number;
}

interface TwilioSuccessResponse {
  sid: string;
  status?: string;
  num_segments?: string;
  price?: string;
  price_unit?: string;
  direction?: string;
  uri?: string;
  account_sid?: string;
}

/**
 * Creates a Twilio SMS provider instance
 */
export function getTwilioProvider(): SmsProvider {
  const accountSid = smsEnv.TWILIO_ACCOUNT_SID;
  const authToken = smsEnv.TWILIO_AUTH_TOKEN;
  const region = smsEnv.TWILIO_REGION;

  return {
    name: SmsProviders.TWILIO,

    async sendSms(params: SendSmsParams, logger: EndpointLogger): Promise<ResponseType<SmsResult>> {
      try {
        // Validate credentials
        if (!accountSid) {
          return fail({
            message: "app.api.sms.sms.error.missing_recipient",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        if (!authToken) {
          return fail({
            message: "app.api.sms.sms.error.missing_recipient",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        // Cache API base URL
        const baseUrl = region
          ? `https://api.${region}.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
          : `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

        // Create authorization header value
        // eslint-disable-next-line i18next/no-literal-string
        const authHeader = `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;

        // Type guard for params
        if (!params || typeof params !== "object") {
          return fail({
            message: "app.api.sms.sms.error.invalid_phone_format",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        logger.debug("Sending SMS via Twilio", { to: params.to });

        // Validate required parameters
        if (!params.to) {
          return fail({
            message: "app.api.sms.sms.error.invalid_phone_format",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        // From phone number fallback with nullish coalescing
        const fromNumber = params.from ?? smsEnv.SMS_FROM_NUMBER;
        if (!fromNumber) {
          return fail({
            message: "app.api.sms.sms.error.invalid_phone_format",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        if (!params.message || typeof params.message !== "string" || params.message.trim() === "") {
          return fail({
            message: "app.api.sms.sms.error.empty_message",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        // Prepare request body
        const formData = new URLSearchParams({
          To: params.to,
          From: fromNumber,
          Body: params.message,
        });

        // Add any extra parameters from options with type safety
        if (params.options && typeof params.options === "object") {
          // Type guard for options
          const optionsEntries = Object.entries(params.options);

          optionsEntries.forEach(([key, value]) => {
            if (
              !["headers", "extraFields", "provider"].includes(key) &&
              (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
            ) {
              formData.append(key, String(value));
            }
          });
        }

        // Type-safe headers handling
        const headers: {
          "Content-Type": string;
          Authorization: string;
          [key: string]: string;
        } = {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: authHeader,
        };

        // Type-safe header merging
        if (params.options?.headers && typeof params.options.headers === "object") {
          // Type guard for headers
          const headersObj = params.options.headers;
          Object.entries(headersObj).forEach(([key, value]) => {
            if (typeof value === "string") {
              headers[key] = value;
            }
          });
        }

        // Make the API request
        const response = await fetch(baseUrl, {
          method: "POST",
          headers,
          body: formData.toString(),
        });

        // Handle API errors
        if (!response.ok) {
          let errorData: TwilioErrorResponse = {};
          try {
            errorData = (await response.json()) as TwilioErrorResponse;
          } catch {
            // Error parsing response, will use default error
          }

          const errorMessage =
            errorData.message ??
            errorData.error_message ??
            // eslint-disable-next-line i18next/no-literal-string -- Technical error message from Twilio API
            "Unknown Twilio error";

          const errorCode = errorData.code ?? errorData.error_code ?? response.status;

          return fail({
            message: "app.api.sms.sms.error.delivery_failed",
            errorType: ErrorResponseTypes.SMS_ERROR,
            messageParams: {
              error: errorMessage,
              errorCode,
            },
          });
        }

        // Parse successful response
        const data = (await response.json()) as TwilioSuccessResponse;

        // Build the response object with optional properties correctly handled
        const responseData: SmsResult = {
          messageId: data.sid,
          provider: SmsProviders.TWILIO,
          timestamp: new Date().toISOString(),
          to: params.to,
          ...(data.status && { status: data.status }),
          segments: data.num_segments ? parseInt(data.num_segments, 10) : 1,
          metadata: {
            ...(data.direction && { direction: data.direction }),
            ...(data.uri && { uri: data.uri }),
            ...(data.account_sid && { accountSid: data.account_sid }),
          },
        };

        // Add cost information if available
        if (data.price && data.price_unit) {
          responseData.cost = {
            amount: parseFloat(data.price),
            currency: data.price_unit,
          };
        }

        return {
          success: true,
          data: responseData,
        };
      } catch (error) {
        const errorMessage =
          // eslint-disable-next-line i18next/no-literal-string -- Technical error message from exception
          error instanceof Error ? error.message : "Unknown error";
        return fail({
          message: "app.api.sms.sms.error.delivery_failed",
          errorType: ErrorResponseTypes.SMS_ERROR,
          messageParams: {
            error: errorMessage,
          },
        });
      }
    },
  };
}
