/// <reference types="node" />
import { performance } from "node:perf_hooks";

import type { UndefinedType } from "next-vibe/shared/types/common.schema";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import type { TParams } from "@/i18n/core/static-types";

import { smsEnv } from "./env";
import { smsScopedT } from "./i18n";
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
export async function handleSms<
  TRequest,
  TResponse,
  TUrlVariables,
  TScopedTranslationKey extends string,
>({
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
  sms:
    | SmsConfig<TRequest, TResponse, TUrlVariables, TScopedTranslationKey>
    | undefined;
  user: JwtPayloadType;
  responseData: TResponse;
  urlPathParams: TUrlVariables;
  requestData: TRequest;
  options?: SmsHandlerOptions;
  t: (key: TScopedTranslationKey, params?: TParams) => TranslatedKeyType;
  locale: CountryLanguage;
  logger: EndpointLogger;
}): Promise<ResponseType<UndefinedType>> {
  const { t: tSms } = smsScopedT(locale);
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
                  message: tSms("sms.error.rendering_failed"),
                  errorType: ErrorResponseTypes.SMS_ERROR,
                  messageParams: { error: result.message },
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
                  message: tSms("sms.error.batch_send_failed"),
                  errorType: ErrorResponseTypes.SMS_ERROR,
                  messageParams: { error: batchResult.message },
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
                  message: tSms("sms.error.send_failed"),
                  errorType: ErrorResponseTypes.SMS_ERROR,
                  messageParams: { error: smsResponse.message },
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
                message: tSms("sms.error.rendering_failed"),
                errorType: ErrorResponseTypes.SMS_ERROR,
                messageParams: { error: parsedError.message },
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
        message: tSms("sms.error.delivery_failed"),
        errorType: ErrorResponseTypes.SMS_ERROR,
        messageParams: { error: parseError(error).message },
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
      message: tSms("sms.error.delivery_failed"),
      errorType: ErrorResponseTypes.SMS_ERROR,
      messageParams: { errorCount: errors.length },
    });
  }

  return { success: true, data: undefined };
}
