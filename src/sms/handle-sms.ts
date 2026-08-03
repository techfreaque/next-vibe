/// <reference types="node" />
import { performance } from "node:perf_hooks";

import type { UndefinedType } from "next-vibe/core/definition/common.schema";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import type { TParams } from "next-vibe/core/i18n/core/static-types";
import type { InferJwtPayloadTypeFromRoles } from "next-vibe/core/route/handler-roles";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/core/route/response.schema";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { smsEnv } from "./env";
import { scopedTranslation } from "./i18n";
import { batchSendSms, sendSms } from "./send-sms";
import type {
  ProviderBaseOptions,
  SendSmsParams,
  SmsConfig,
  SmsHandlerOptions,
} from "./utils";

/**
 * Processes and handles SMS messages triggered by API responses
 */
export async function handleSms<TEndpoint extends CreateApiEndpointAny>({
  sms,
  user,
  responseData,
  urlPathParams,
  requestData,
  options,
  t,
  locale,
  logger,
}: {
  sms: SmsConfig<TEndpoint> | undefined;
  user: InferJwtPayloadTypeFromRoles<TEndpoint["allowedRoles"]>;
  responseData: TEndpoint["types"]["ResponseOutput"];
  urlPathParams: TEndpoint["types"]["UrlVariablesOutput"];
  requestData: TEndpoint["types"]["RequestOutput"];
  options?: SmsHandlerOptions;
  t: (
    key: TEndpoint["types"]["ScopedTranslationKey"],
    params?: TParams,
  ) => TranslatedKeyType;
  locale: CountryLanguage;
  logger: EndpointLogger;
}): Promise<ResponseType<UndefinedType>> {
  const { t: tSms } = scopedTranslation.scopedT(locale);
  const startTime = options?.logPerformance ? performance.now() : null;
  const errors: ErrorResponseType[] = [];
  let processedCount = 0;
  const maxMessageLength =
    options?.maxMessageLength || parseInt(smsEnv.SMS_MAX_LENGTH || "160", 10);

  if (!sms?.afterHandlerSms || sms.afterHandlerSms.length === 0) {
    return { success: true, data: undefined };
  }

  logger.debug(`Processing ${sms.afterHandlerSms.length} SMS handlers`);

  try {
    await Promise.all(
      sms.afterHandlerSms.map(async (smsData) => {
        try {
          const result = await smsData.render({
            user,
            urlPathParams,
            requestData,
            responseData,
            t: t,
            locale: locale,
            logger,
          });

          if (!result.success) {
            if (!smsData.ignoreErrors) {
              errors.push(
                fail({
                  message: tSms("sms.error.rendering_failed", {
                    error: result.message,
                  }),
                  errorType: ErrorResponseTypes.SMS_ERROR,
                }),
              );
            }
            return;
          }

          // Handle both single messages and batch messages
          if (Array.isArray(result.data)) {
            const messages: SendSmsParams[] = result.data.map((msg) => {
              // Create a properly typed SMS params object with conditional properties
              const smsParams: SendSmsParams = {
                to: msg.to,
                message:
                  options?.enableTruncation &&
                  msg.message.length > maxMessageLength
                    ? `${msg.message.slice(0, maxMessageLength - 3)}...`
                    : msg.message,
                // Only include 'from' if it exists
                ...(msg.from && { from: msg.from }),
              };

              // Only include options if there are any to include
              if (msg.options) {
                // Build options object with only defined properties
                const optionsObj: Partial<ProviderBaseOptions> = {};

                if (msg.options.provider) {
                  optionsObj.provider = msg.options.provider;
                }
                if (msg.options.type) {
                  optionsObj.type = msg.options.type;
                }
                if (msg.options.datacoding) {
                  optionsObj.datacoding = msg.options.datacoding;
                }

                smsParams.options = optionsObj;
              }

              return smsParams;
            });

            const batchResult = await batchSendSms(messages, logger, locale);
            processedCount += messages.length;

            if (!batchResult.success && !smsData.ignoreErrors) {
              errors.push(
                fail({
                  message: tSms("sms.error.batch_send_failed", {
                    error: batchResult.message,
                  }),
                  errorType: ErrorResponseTypes.SMS_ERROR,
                }),
              );
            }
          } else {
            const smsParams: SendSmsParams = {
              ...result.data,
              message:
                options?.enableTruncation &&
                result.data.message.length > maxMessageLength
                  ? `${result.data.message.slice(0, maxMessageLength - 3)}...`
                  : result.data.message,
            };

            const smsResponse = await sendSms(smsParams, logger, locale);
            processedCount++;

            if (!smsData.ignoreErrors && !smsResponse.success) {
              errors.push(
                fail({
                  message: tSms("sms.error.send_failed", {
                    error: smsResponse.message,
                  }),
                  errorType: ErrorResponseTypes.SMS_ERROR,
                }),
              );
            }
          }
        } catch (error) {
          const parsedError = parseError(error);
          logger.error(parsedError.message, parsedError);

          if (!smsData.ignoreErrors) {
            errors.push(
              fail({
                message: tSms("sms.error.rendering_failed", {
                  error: parsedError.message,
                }),
                errorType: ErrorResponseTypes.SMS_ERROR,
              }),
            );
          }
        }
      }),
    );
  } catch (error) {
    logger.error("Error sending SMS:", parseError(error));
    errors.push(
      fail({
        message: tSms("sms.error.unexpected_error", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.SMS_ERROR,
      }),
    );
  }

  if (startTime !== null) {
    const duration = performance.now() - startTime;
    logger.debug(
      `SMS processing completed in ${duration.toFixed(2)}ms. Processed: ${processedCount}, Errors: ${errors.length}`,
    );
  }

  if (errors.length > 0) {
    logger.error("SMS errors", {
      errorCount: errors.length,
      errors: errors.map((e) => e.message),
    });
    return fail({
      message: tSms("sms.error.batch_delivery_failed", {
        errorCount: errors.length,
      }),
      errorType: ErrorResponseTypes.SMS_ERROR,
    });
  }

  return { success: true, data: undefined };
}
