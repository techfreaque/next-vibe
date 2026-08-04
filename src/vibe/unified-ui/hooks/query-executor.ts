import { z } from "zod";

import { scopedTranslation as sharedScopedTranslation } from "@/_pages/shared/i18n";

import { type CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import { EndpointErrorTypes } from "../../core/definition/enums";
import type { CountryLanguage } from "../../core/i18n/core/config";
import type {
  ErrorResponseType,
  ResponseType,
} from "../../core/route/response.schema";
import { ErrorResponseTypes, fail } from "../../core/route/response.schema";
import { parseError } from "../../core/utils/parse-error";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import type { callApi as CallApiFn } from "./call-api";
import { scopedTranslation as hooksTranslation } from "./i18n";

interface QueryExecutorOptions<TRequest, TResponse, TUrlVariables> {
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

// Resolved at CALL time, not import time. Bun links the entire static import
// graph before any module body runs, so the CLI override plugin registered in
// vibe-runtime.ts has not been installed yet when a top-level
// `import { callApi } from "./call-api"` is resolved — the web (HTTP) build wins
// and the CLI ends up making loopback requests to a server that is not running.
// A dynamic import resolves after registration, which is exactly why lazily
// imported widgets already got their .cli.tsx counterparts.
async function loadCallApi(): Promise<typeof CallApiFn> {
  const mod = await import("./call-api");
  return mod.callApi;
}

export async function executeQuery<TEndpoint extends CreateApiEndpointAny>({
  endpoint,
  logger,
  requestData: initialRequestData,
  pathParams,
  locale,
  user,
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

      // `message` is whichever error-type description the endpoint declared -
      // already translated in its own scope, so it rides in as `reason` rather
      // than gaining a placeholder it cannot carry.
      const errorResponse = fail({
        message: hooksTranslation
          .scopedT(locale)
          .t("apiUtils.errors.endpointFailed", {
            reason: message,
            path: endpoint.path.join("/"),
            error: requestValidation.error.message,
          }),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
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
    const callApi = await loadCallApi();
    const response = await callApi(
      endpoint,
      logger,
      user,
      locale,
      requestData,
      pathParams,
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
      message: hooksTranslation
        .scopedT(locale)
        .t("apiUtils.errors.endpointFailed", {
          reason: message,
          path: endpoint.path.join("/"),
          error: parsedError.message,
        }),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
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
