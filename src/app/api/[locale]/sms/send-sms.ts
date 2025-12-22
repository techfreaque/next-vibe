import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { smsEnv } from "./env";
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
  const name = providerName ?? smsEnv.SMS_PROVIDER ?? SmsProviders.TWILIO;

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
      // Fallback to Twilio for unsupported providers
      provider = getTwilioProvider();
      break;
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
  logger: EndpointLogger,
  providerName?: SmsProviders,
): {
  valid: boolean;
  reason?: string;
} {
  // Use provider's validation if available
  const provider = getSmsProvider(providerName);
  if (provider.validatePhoneNumber) {
    return provider.validatePhoneNumber(phoneNumber, logger);
  }

  // Use the shared validation helper
  return validateE164PhoneNumber(phoneNumber, provider.name);
}

/**
 * Sends an SMS using the configured provider with retry logic
 */
export async function sendSms(
  params: SendSmsParams,
  logger: EndpointLogger,
): Promise<ResponseType<SmsResult>> {
  const maxAttempts =
    params.retry?.attempts ||
    parseInt(smsEnv.SMS_MAX_RETRY_ATTEMPTS || "3", 10);
  const delayMs =
    params.retry?.delayMs || parseInt(smsEnv.SMS_RETRY_DELAY_MS || "1000", 10);

  // Validate phone number
  const validation = validatePhoneNumber(params.to, logger);
  if (!validation.valid) {
    logger.error("app.api.sms.sms.error.invalid_phone_format", {
      to: params.to,
      reason: validation.reason,
    });
    return fail({
      message: "app.api.sms.sms.error.invalid_phone_format",
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
      messageParams: {
        reason: validation.reason || "",
      },
    });
  }

  try {
    const provider = getSmsProvider(params.options?.provider);
    logger.debug("Sending SMS via provider", {
      provider: provider.name,
      to: params.to,
    });

    // Use default from number if not provided
    const smsParams: SendSmsParams = {
      ...params,

      from: params.from || smsEnv.SMS_FROM_NUMBER,
    };

    let lastError: Error | undefined;

    // Implement retry logic
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await provider.sendSms(smsParams, logger);

        if (result.success) {
          logger.info("SMS sent successfully", {
            to: params.to,
            messageId: result.data.messageId,
            attempt,
          });
          return result;
        }

        lastError = new Error(result.message);
        logger.warn("SMS send attempt failed", {
          attempt,
          error: result.message,
        });

        if (attempt < maxAttempts) {
          // Wait before retry - fix promise executor issue
          await new Promise<void>((resolve) => {
            setTimeout(resolve, delayMs);
          });
        }
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error("error.general.unknown");
        logger.error("SMS send attempt exception", {
          error: parseError(error),
          attempt,
        });
        if (attempt < maxAttempts) {
          // Wait before retry - fix promise executor issue
          await new Promise<void>((resolve) => {
            setTimeout(resolve, delayMs);
          });
        }
      }
    }

    // If we get here, all attempts failed
    logger.error("app.api.sms.sms.error.delivery_failed", {
      to: params.to,
      attempts: maxAttempts,
    });
    return fail({
      message: "app.api.sms.sms.error.delivery_failed",
      errorType: ErrorResponseTypes.SMS_ERROR,
      messageParams: {
        errorMessage: lastError?.message ?? "",
      },
    });
  } catch (error) {
    logger.error("app.api.sms.sms.error.unexpected_error", parseError(error));
    return fail({
      message: "app.api.sms.sms.error.unexpected_error",
      errorType: ErrorResponseTypes.SMS_ERROR,
      messageParams: {
        errorMessage: error instanceof Error ? error.message : "",
      },
    });
  }
}

/**
 * Batch send SMS messages to multiple recipients
 */
export async function batchSendSms(
  messages: SendSmsParams[],
  logger: EndpointLogger,
): Promise<
  ResponseType<{
    results: Array<{
      to: string;
      success: boolean;
      messageId: string | undefined;
      error: string | undefined;
    }>;
  }>
> {
  logger.info("Sending batch SMS", { count: messages.length });

  const results = await Promise.all(
    messages.map(async (params) => {
      const result = await sendSms(params, logger);
      const to = params.to;
      const success = result.success;
      const messageId = result.success ? result.data.messageId : undefined;
      const errorMessage: string | undefined = result.success
        ? undefined
        : (result.message as string);

      return {
        to,
        success,
        messageId,
        error: errorMessage,
      };
    }),
  );

  const failureCount = results.filter((r) => !r.success).length;

  if (failureCount === results.length) {
    logger.error("app.api.sms.sms.error.all_failed", {
      totalResults: results.length,
    });
    return fail({
      message: "app.api.sms.sms.error.all_failed",
      errorType: ErrorResponseTypes.SMS_ERROR,
      messageParams: {
        totalResults: results.length.toString(),
      },
    });
  }

  if (failureCount > 0) {
    logger.warn("app.api.sms.sms.error.partial_failure", {
      failureCount,
      totalCount: results.length,
    });
    return fail({
      message: "app.api.sms.sms.error.partial_failure",
      errorType: ErrorResponseTypes.SMS_ERROR,
      messageParams: {
        failureCount: failureCount.toString(),
        totalCount: results.length.toString(),
      },
    });
  }

  logger.info("Batch SMS sent successfully", { count: messages.length });
  return success({ results });
}
