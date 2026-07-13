import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
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

import type { AgentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";

import { callApi } from "./call-api";

interface MutationExecutorOptions<TRequest, TResponse, TUrlVariables> {
  onSuccess?: (context: {
    requestData: TRequest;
    urlPathParams: TUrlVariables;
    responseData: TResponse;
    logger: EndpointLogger;
    user: JwtPayloadType;
    locale: CountryLanguage;
    availability: AgentEnvAvailability;
  }) => void | ErrorResponseType | Promise<void | ErrorResponseType>;

  onError?: (context: {
    error: ErrorResponseType;
    requestData: TRequest;
    urlPathParams: TUrlVariables;
    logger: EndpointLogger;
  }) => void | Promise<void>;
}

export async function executeMutation<TEndpoint extends CreateApiEndpointAny>({
  endpoint,
  logger,
  requestData: initialRequestData,
  pathParams,
  locale,
  options = {},
  user,
  availability,
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
  options?: MutationExecutorOptions<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["ResponseOutput"],
    TEndpoint["types"]["UrlVariablesOutput"]
  >;
}): Promise<ResponseType<TEndpoint["types"]["ResponseOutput"]>> {
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Infrastructure: Schema type cast requires 'unknown' for runtime type compatibility
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
        availability,
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

    const errorResponse: ErrorResponseType = fail({
      message: errorMessage,
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        error: parsedError.message,
        endpoint: endpoint.path.join("/"),
      },
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
