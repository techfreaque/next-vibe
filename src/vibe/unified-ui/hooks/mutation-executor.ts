import { z } from "zod";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import { EndpointErrorTypes } from "../../core/definition/enums";
import type { CountryLanguage } from "../../core/i18n/core/config";
import type {
  ErrorResponseType,
  ResponseType,
} from "../../core/route/response.schema";
import { ErrorResponseTypes, fail } from "../../core/route/response.schema";
import { isErrorResponseType, parseError } from "../../core/utils/parse-error";
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

/**
 * Turn an exception thrown while running a mutation into the endpoint's
 * SERVER_ERROR-flavoured fail() response.
 */
export function buildMutationExceptionResponse(
  endpoint: CreateApiEndpointAny,
  locale: CountryLanguage,
  parsedError: Error,
): ErrorResponseType {
  const serverErrorConfig =
    endpoint.errorTypes?.[EndpointErrorTypes.SERVER_ERROR];
  const { t } = endpoint.scopedTranslation.scopedT(locale);
  const errorMessage = t(serverErrorConfig?.description);

  // The endpoint's declared description is placeholder-free by contract, so
  // it rides in as an already-translated `reason` rather than gaining one.
  return fail({
    message: hooksTranslation
      .scopedT(locale)
      .t("apiUtils.errors.endpointFailed", {
        reason: errorMessage,
        path: endpoint.path.join("/"),
        error: parsedError.message,
      }),
    errorType: ErrorResponseTypes.INTERNAL_ERROR,
  });
}

/**
 * Settle a React Query `mutateAsync` call into the `ResponseType` contract.
 *
 * useApiMutation's mutationFn throws the ErrorResponseType so React Query's
 * isError/onError/error state work, which makes RQ's own `mutateAsync` REJECT
 * on failure. Callers are typed (and written) against
 * `Promise<ResponseType<T>>`, so failure must come back as a resolved value:
 * a rejected ErrorResponseType is returned as-is, anything else (a bug in a
 * callback, an RQ internal) becomes a fail() via `onUnexpected` so no caller
 * can leak an unhandled rejection.
 */
export async function settleMutationResult<TResponse>(
  run: () => Promise<ResponseType<TResponse>>,
  onUnexpected: (parsedError: Error) => ErrorResponseType,
): Promise<ResponseType<TResponse>> {
  try {
    return await run();
  } catch (error) {
    if (isErrorResponseType(error)) {
      return error;
    }
    return onUnexpected(parseError(error));
  }
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

  let phase: "load-client" | "call-api" | "on-error" | "on-success" =
    "load-client";
  try {
    const callApi = await loadCallApi();
    phase = "call-api";
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
        phase = "on-error";
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
      phase = "on-success";
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
    const errorResponse = buildMutationExceptionResponse(
      endpoint,
      locale,
      parsedError,
    );

    logger.error("Mutation failed", parsedError, {
      endpoint: endpoint.path.join("/"),
      method: endpoint.method,
      phase,
      errorKey: errorResponse.errorType.errorKey,
      status: errorResponse.errorType.errorCode,
    });

    if (options.onError && phase !== "on-error") {
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
