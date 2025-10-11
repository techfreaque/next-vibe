import { performance } from "node:perf_hooks";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/schema";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { UndefinedType } from "../../shared/types/common.schema";
import type {
  ErrorResponseType,
  ResponseType,
} from "../../shared/types/response.schema";
import {
  createErrorResponse,
  ErrorResponseTypes,
} from "../../shared/types/response.schema";
import { parseError } from "../../shared/utils";
import { env } from "../env";
import { batchSendSms, sendSms } from "./send-sms";
import type {
  SendSmsParams,
  SmsFunctionType,
  SmsHandlerOptions,
} from "./utils";

/**
 * Processes and handles SMS messages triggered by API responses
 */
export async function handleSms<TRequest, TResponse, TUrlVariables>({
  sms,
  user,
  responseData,
  urlVariables,
  requestData,
  options,
  t,
  locale,
  logger,
}: {
  sms:
    | {
        afterHandlerSms?: {
          ignoreErrors?: boolean;
          render: SmsFunctionType<TRequest, TResponse, TUrlVariables>;
        }[];
      }
    | undefined;
  user: JwtPayloadType;
  responseData: TResponse;
  urlVariables: TUrlVariables;
  requestData: TRequest;
  options?: SmsHandlerOptions;
  t: TFunction;
  locale: CountryLanguage;
  logger: EndpointLogger;
}): Promise<ResponseType<UndefinedType>> {
  const startTime = options?.logPerformance ? performance.now() : null;
  const errors: ErrorResponseType[] = [];
  let processedCount = 0;
  const maxMessageLength =
    options?.maxMessageLength || parseInt(env.SMS_MAX_LENGTH || "160", 10);

  // Provide default values for t and locale if not provided
  const defaultT: TFunction = (key: string) => key;
  const defaultLocale: CountryLanguage = "en-GLOBAL";
  const tFunction = t || defaultT;
  const currentLocale = locale || defaultLocale;

  if (!sms?.afterHandlerSms || sms.afterHandlerSms.length === 0) {
    return { success: true, data: undefined };
  }

  logger.debug(`Processing ${sms.afterHandlerSms.length} SMS handlers`);

  try {
    await Promise.all(
      sms.afterHandlerSms.map(async (smsData) => {
        try {
          const renderResult = await smsData.render({
            user,
            urlVariables,
            requestData,
            responseData,
            t: tFunction,
            locale: currentLocale,
          });

          if (!renderResult.success) {
            if (!smsData.ignoreErrors) {
              errors.push(
                createErrorResponse(
                  "sms.errors.rendering_failed",
                  ErrorResponseTypes.SMS_ERROR,
                  { error: renderResult.message },
                ),
              );
            }
            return;
          }

          // Handle both single messages and batch messages
          if (Array.isArray(renderResult.data)) {
            const messages: SendSmsParams[] = renderResult.data.map((msg) => {
              // Create a properly typed SMS params object with conditional properties
              const smsParams: SendSmsParams = {
                to: msg.to,
                message:
                  options?.enableTruncation &&
                  msg.message.length > maxMessageLength
                    ? `${msg.message.substring(0, maxMessageLength - 3)}...`
                    : msg.message,
                // Only include 'from' if it exists
                ...(msg.from && { from: msg.from }),
              };

              // Only include options if there are any to include
              if (msg.options) {
                // Build options object with only defined properties
                const optionsObj: any = {};

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

            const batchResult = await batchSendSms(messages);
            processedCount += messages.length;

            if (!batchResult.success && !smsData.ignoreErrors) {
              errors.push(
                createErrorResponse(
                  "sms.errors.batch_send_failed",
                  ErrorResponseTypes.SMS_ERROR,
                  { error: batchResult.message },
                ),
              );
            }
          } else {
            const _smsData: SendSmsParams = {
              ...renderResult.data,
              message:
                options?.enableTruncation &&
                renderResult.data.message.length > maxMessageLength
                  ? `${renderResult.data.message.substring(
                      0,
                      maxMessageLength - 3,
                    )}...`
                  : renderResult.data.message,
            };

            const smsResponse = await sendSms(_smsData);
            processedCount++;

            if (!smsData.ignoreErrors && !smsResponse.success) {
              errors.push(
                createErrorResponse(
                  "sms.errors.send_failed",
                  ErrorResponseTypes.SMS_ERROR,
                  { error: smsResponse.message },
                ),
              );
            }
          }
        } catch (error) {
          const errorMessage = `Error processing SMS renderer: ${
            error instanceof Error ? error.message : "Unknown error"
          }`;
          logger.error(errorMessage, error);

          if (!smsData.ignoreErrors) {
            errors.push(
              createErrorResponse(
                "sms.errors.rendering_failed",
                ErrorResponseTypes.SMS_ERROR,
                { error: errorMessage },
              ),
            );
          }
        }
      }),
    );
  } catch (error) {
    logger.error("Error sending SMS:", error);
    errors.push(
      createErrorResponse(
        "sms.errors.delivery_failed",
        ErrorResponseTypes.SMS_ERROR,
        { error: parseError(error).message },
      ),
    );
  }

  if (startTime !== null) {
    const duration = performance.now() - startTime;
    logger.debug(
      `SMS processing completed in ${duration.toFixed(2)}ms. Processed: ${processedCount}, Errors: ${errors.length}`,
    );
  }

  if (errors.length) {
    logger.error("SMS errors", errors);
    return createErrorResponse(
      "sms.errors.delivery_failed",
      ErrorResponseTypes.SMS_ERROR,
      { errorMessage: errors.join(", ") },
    );
  }

  return { success: true, data: undefined };
}
