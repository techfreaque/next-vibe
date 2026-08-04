import { z } from "zod";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
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

interface MutationExecutorOptions<TRequest, TResponse, TUrlVariables> {
  onSuccess?: (context: {
    requestData: TRequest;
    urlPathParams: TUrlVariables;
    responseData: TResponse;
    logger: EndpointLogger;
    user: JwtPayloadType;
    locale: CountryLanguage;
  }) => void | ErrorResponseType | Promise<void | ErrorResponseType>;

  onError?: (context: {
    error: ErrorResponseType;
    requestData: TRequest;
    urlPathParams: TUrlVariables;
    logger: EndpointLogger;
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

export async function executeMutation<TEndpoint extends CreateApiEndpointAny>({
  endpoint,
  logger,
  requestData: initialRequestData,
  pathParams,
  locale,
  options = {},
  user,
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
  options?: MutationExecutorOptions<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["ResponseOutput"],
    TEndpoint["types"]["UrlVariablesOutput"]
  >;
}): Promise<ResponseType<TEndpoint["types"]["ResponseOutput"]>> {
  // eslint-disable-next-line restricted/no-unknown -- Infrastructure: Schema type cast requires 'unknown' for runtime type compatibility
  const requestSchema = endpoint.requestSchema as unknown as z.ZodTypeAny;
  const isUndefinedSchema =
    requestSchema.safeParse(undefined).success &&
    !requestSchema.safeParse({}).success;

  const isEmptyObjectSchema =
    requestSchema instanceof z.ZodObject &&
    Object.keys(requestSchema.shape).length === 0;

  let requestData = initialRequestData;

  if (
    isUndefinedSchema &&
    typeof requestData === "object" &&
    requestData !== null
  ) {
    logger.debug(
      "Converting object to undefined for endpoint with undefinedSchema",
      endpoint.path.join("/"),
    );
    requestData = undefined as TEndpoint["types"]["RequestOutput"];
  }

  if (isEmptyObjectSchema && requestData === undefined) {
    logger.debug(
      "Converting undefined to empty object for endpoint with empty object schema",
      endpoint.path.join("/"),
    );
    requestData = {} as TEndpoint["types"]["RequestOutput"];
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
        await options.onError({
          error: response,
          requestData,
          urlPathParams: pathParams,
          logger,
        });
      }
      return response;
    }

    if (options.onSuccess) {
      const callbackResult = await options.onSuccess({
        requestData,
        urlPathParams: pathParams,
        responseData: response.data,
        logger,
        user,
        locale,
      });

      if (callbackResult) {
        return callbackResult as ResponseType<
          TEndpoint["types"]["ResponseOutput"]
        >;
      }
    }

    return response;
  } catch (error) {
    const parsedError = parseError(error);

    const serverErrorConfig =
      endpoint.errorTypes?.[EndpointErrorTypes.SERVER_ERROR];
    const { t } = endpoint.scopedTranslation.scopedT(locale);
    const errorMessage = t(serverErrorConfig?.description);

    // The endpoint's declared description is placeholder-free by contract, so
    // it rides in as an already-translated `reason` rather than gaining one.
    const errorResponse: ErrorResponseType = fail({
      message: hooksTranslation
        .scopedT(locale)
        .t("apiUtils.errors.endpointFailed", {
          reason: errorMessage,
          path: endpoint.path.join("/"),
          error: parsedError.message,
        }),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });

    logger.error("Mutation failed", {
      endpoint: endpoint.path.join("/"),
      error: parsedError,
    });

    if (options.onError) {
      await options.onError({
        error: errorResponse,
        requestData,
        urlPathParams: pathParams,
        logger,
      });
    }

    return errorResponse;
  }
}
