import { type CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { EndpointErrorTypes } from "next-vibe/core/definition/enums";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/core/route/response.schema";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { scopedTranslation as sharedScopedTranslation } from "@/app/[locale]/shared/i18n";
import type { AgentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";

import { callApi } from "./call-api";

export interface QueryExecutorOptions<TRequest, TResponse, TUrlVariables> {
  onSuccess?: (
    context: {
      requestData: TRequest;
      urlPathParams: TUrlVariables;
      responseData: TResponse;
    },
    user: JwtPayloadType,
    logger: EndpointLogger,
  ) => void | ErrorResponseType | Promise<void | ErrorResponseType>;

  onError?: (context: {
    error: ErrorResponseType;
    requestData: TRequest;
    urlPathParams: TUrlVariables;
  }) => void | Promise<void>;
}

export async function executeQuery<TEndpoint extends CreateApiEndpointAny>({
  endpoint,
  logger,
  requestData: initialRequestData,
  pathParams,
  locale,
  user,
  availability,
  options = {},
}: {
  endpoint: TEndpoint;
  logger: EndpointLogger;
  requestData: TEndpoint["types"]["RequestOutput"] extends never
    ? undefined
    : TEndpoint["types"]["RequestOutput"];
  pathParams: TEndpoint["types"]["UrlVariablesOutput"] extends never
    ? undefined
    : TEndpoint["types"]["UrlVariablesOutput"];
  locale: CountryLanguage;
  user: JwtPayloadType;
  availability: AgentEnvAvailability;
  options?: QueryExecutorOptions<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["ResponseOutput"],
    TEndpoint["types"]["UrlVariablesOutput"]
  >;
}): Promise<ResponseType<TEndpoint["types"]["ResponseOutput"]>> {
  let requestData = initialRequestData;

  const isUndefinedSchema =
    endpoint.requestSchema.safeParse(undefined).success &&
    !endpoint.requestSchema.safeParse({}).success;

  const requestSchema = endpoint.requestSchema as z.ZodTypeAny;
  const isEmptyObjectSchema =
    requestSchema instanceof z.ZodObject &&
    Object.keys(requestSchema.shape || {}).length === 0;

  if (
    isUndefinedSchema &&
    typeof requestData === "object" &&
    requestData !== null
  ) {
    requestData = undefined as TEndpoint["types"]["RequestOutput"];
  }

  if (isEmptyObjectSchema && requestData === undefined) {
    requestData = {} as TEndpoint["types"]["RequestOutput"];
  }

  const isNeverSchema = requestSchema instanceof z.ZodNever;

  if (!isNeverSchema) {
    const requestValidation = requestSchema.safeParse(requestData);

    if (!requestValidation.success) {
      logger.error("executeQuery: request validation failed", {
        endpointPath: endpoint.path.join("/"),
        error: requestValidation.error.message,
      });

      const validationErrorConfig =
        endpoint.errorTypes?.[EndpointErrorTypes.VALIDATION_FAILED];

      const { t: sharedT } = sharedScopedTranslation.scopedT(locale);
      const message = validationErrorConfig?.description
        ? endpoint.scopedTranslation
            .scopedT(locale)
            .t(validationErrorConfig.description)
        : sharedT("errors.validationFailed.description");

      const errorResponse = fail({
        message,
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
        messageParams: {
          endpoint: endpoint.path.join("/"),
          error: requestValidation.error.message,
        },
      });

      if (options.onError) {
        options.onError({
          error: errorResponse,
          requestData,
          urlPathParams: pathParams,
        });
      }

      return errorResponse;
    }
  }

  try {
    const response = await callApi(
      endpoint,
      logger,
      user,
      locale,
      requestData,
      pathParams,
      availability,
    );

    if (!response.success) {
      if (options.onError) {
        options.onError({
          error: response,
          requestData,
          urlPathParams: pathParams,
        });
      }
      return response;
    }

    if (options.onSuccess) {
      const onSuccessResult = await options.onSuccess(
        {
          requestData,
          urlPathParams: pathParams,
          responseData: response.data as TEndpoint["types"]["ResponseOutput"],
        },
        user,
        logger,
      );

      if (onSuccessResult) {
        if (options.onError) {
          options.onError({
            error: onSuccessResult,
            requestData,
            urlPathParams: pathParams,
          });
        }
        return onSuccessResult;
      }
    }

    return response as ResponseType<TEndpoint["types"]["ResponseOutput"]>;
  } catch (err) {
    const parsedError = parseError(err);

    const serverErrorConfig =
      endpoint.errorTypes?.[EndpointErrorTypes.SERVER_ERROR];
    const networkErrorConfig =
      endpoint.errorTypes?.[EndpointErrorTypes.NETWORK_ERROR];

    const isNetworkError =
      parsedError.message.toLowerCase().includes("network") ||
      parsedError.message.toLowerCase().includes("fetch");
    const errorConfig = isNetworkError ? networkErrorConfig : serverErrorConfig;

    const { t: sharedT3 } = sharedScopedTranslation.scopedT(locale);
    const message = errorConfig?.description
      ? endpoint.scopedTranslation.scopedT(locale).t(errorConfig.description)
      : sharedT3("errors.serverError.description");

    const errorResponse = fail({
      message,
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        error: parsedError.message,
        endpoint: endpoint.path.join("/"),
      },
    });

    if (options.onError) {
      options.onError({
        error: errorResponse,
        requestData,
        urlPathParams: pathParams,
      });
    }

    return errorResponse;
  }
}
