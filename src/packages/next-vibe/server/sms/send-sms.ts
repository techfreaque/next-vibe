import "server-only";

import type { ResponseType } from "../../shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "../../shared/types/response.schema";
import { debugLogger, errorLogger } from "../../shared/utils/logger";
import { env } from "../env";
import { getAwsSnsProvider } from "./providers/aws-sns";
import { getHttpProvider } from "./providers/http";
import { getMessageBirdProvider } from "./providers/messagebird";
import { getTwilioProvider } from "./providers/twilio";
import type { SendSmsParams, SmsProvider, SmsResult } from "./utils";
import { SmsProviders, validateE164PhoneNumber } from "./utils";

/**
 * Cache to store provider instances
 */
const providerCache: Record<string, SmsProvider> = {};

/**
 * Gets the configured SMS provider based on environment settings
 * Uses a cache to avoid recreating providers
 */
export function getSmsProvider(providerName?: SmsProviders): SmsProvider {
  const name = providerName ?? env.SMS_PROVIDER ?? SmsProviders.TWILIO;

  // Return cached provider if available
  if (providerCache[name]) {
    return providerCache[name];
  }

  let provider: SmsProvider;

  switch (name.toLowerCase()) {
    case "twilio":
      provider = getTwilioProvider();
      break;
    case "aws":
    case "sns":
    case "aws-sns":
      provider = getAwsSnsProvider();
      break;
    case "messagebird":
      provider = getMessageBirdProvider();
      break;
    case "http":
      provider = getHttpProvider();
      break;
    default:
      // Using error code instead of string literal
      throw new Error(`error.general.unsupported_provider`);
  }

  // Cache the provider
  providerCache[name] = provider;
  return provider;
}

/**
 * Validates a phone number format
 * Using Zod validation for E.164 format (e.g., +14155552671)
 */
export function validatePhoneNumber(
  phoneNumber: string,
  providerName?: SmsProviders,
): {
  valid: boolean;
  reason?: string;
} {
  // Use provider's validation if available
  const provider = getSmsProvider(providerName);
  if (provider.validatePhoneNumber) {
    return provider.validatePhoneNumber(phoneNumber);
  }

  // Use the shared validation helper
  return validateE164PhoneNumber(phoneNumber, provider.name);
}

/**
 * Sends an SMS using the configured provider with retry logic
 */
export async function sendSms(
  params: SendSmsParams,
): Promise<ResponseType<SmsResult>> {
  const maxAttempts =
    params.retry?.attempts || parseInt(env.SMS_MAX_RETRY_ATTEMPTS || "3", 10);
  const delayMs =
    params.retry?.delayMs || parseInt(env.SMS_RETRY_DELAY_MS || "1000", 10);

  // Validate phone number
  const validation = validatePhoneNumber(params.to);
  if (!validation.valid) {
    return createErrorResponse(
      "sms.error.invalid_phone_format",
      ErrorResponseTypes.INVALID_REQUEST_ERROR,
      {
        reason: validation.reason || "",
      },
    );
  }

  try {
    const provider = getSmsProvider(params.options?.provider);
    debugLogger(`Sending SMS to ${params.to} using ${provider.name} provider`);

    // Use default from number if not provided
    const smsParams: SendSmsParams = {
      ...params,

      from: params.from || env.SMS_FROM_NUMBER,
    };

    let lastError: any;

    // Implement retry logic
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        debugLogger(`SMS attempt ${attempt}/${maxAttempts} to ${params.to}`);
        const result = await provider.sendSms(smsParams);

        if (result.success) {
          debugLogger(`SMS sent successfully to ${params.to}`, result.data);
          return result;
        }

        lastError = new Error(result.message);

        if (attempt < maxAttempts) {
          // Wait before retry - fix promise executor issue
          await new Promise<void>((resolve) => {
            setTimeout(resolve, delayMs);
          });
        }
      } catch (error) {
        lastError = error;
        if (attempt < maxAttempts) {
          // Wait before retry - fix promise executor issue
          await new Promise<void>((resolve) => {
            setTimeout(resolve, delayMs);
          });
        }
      }
    }

    // If we get here, all attempts failed
    errorLogger(
      `Failed to send SMS to ${params.to} after ${maxAttempts} attempts:`,
      lastError,
    );
    return createErrorResponse(
      "sms.error.delivery_failed",
      ErrorResponseTypes.SMS_ERROR,
      {
        errorMessage: lastError instanceof Error ? lastError.message : "",
      },
    );
  } catch (error) {
    errorLogger("Unexpected error sending SMS:", error);
    return createErrorResponse(
      "sms.error.unexpected_error",
      ErrorResponseTypes.SMS_ERROR,
      {
        errorMessage: error instanceof Error ? error.message : "",
      },
    );
  }
}

/**
 * Batch send SMS messages to multiple recipients
 */
export async function batchSendSms(messages: SendSmsParams[]): Promise<
  ResponseType<{
    results: Array<{
      to: string;
      success: boolean;
      messageId: string | undefined;
      error: string | undefined;
    }>;
  }>
> {
  const results: Array<{
    to: string;
    success: boolean;
    messageId: string | undefined;
    error: string | undefined;
  }> = await Promise.all(
    messages.map(async (params) => {
      const result = await sendSms(params);
      return {
        to: params.to,
        success: result.success,
        messageId: result.success ? result.data.messageId : undefined,
        error: result.success ? undefined : result.message,
      };
    }),
  );

  const failureCount = results.filter((r) => !r.success).length;

  if (failureCount === results.length) {
    return createErrorResponse(
      "sms.error.all_failed",
      ErrorResponseTypes.SMS_ERROR,
      {
        totalResults: results.length.toString(),
      },
    );
  }

  if (failureCount > 0) {
    return createErrorResponse(
      "sms.error.partial_failure",
      ErrorResponseTypes.SMS_ERROR,
      {
        failureCount: failureCount.toString(),
        totalCount: results.length.toString(),
      },
    );
  }
  return createSuccessResponse({ results });
}
