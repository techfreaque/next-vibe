import { validateData } from "../../core/core-utils/validation";
import { type CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import { Methods } from "../../core/definition/enums";
import { coreClientEnv as envClient, platform } from "../../core/env-client";
import type { CountryLanguage } from "../../core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import { parseError } from "../../core/utils/parse-error";
import { scopedTranslation as authScopedTranslation } from "../../identity/auth/i18n";
import { AuthClientRepository } from "../../identity/auth/repository-client";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import { Platform } from "../../platforms/platforms";
import { getCookie } from "next-vibe/ui/lib/cookies";
import { scopedTranslation as hooksTranslation } from "./i18n";

import {
  BEARER_LEAD_ID_SEPARATOR,
  CSRF_TOKEN_COOKIE_NAME,
  CSRF_TOKEN_HEADER_NAME,
} from "@/env/constants";

import { containsFile, objectToFormData } from "./api-utils-shared";

const MUTATING_METHODS = new Set([
  Methods.POST,
  Methods.PUT,
  Methods.DELETE,
  Methods.PATCH,
]);

async function getCsrfToken(): Promise<string | null> {
  return (await getCookie(CSRF_TOKEN_COOKIE_NAME)) ?? null;
}

function isJsonObject(value: WidgetData): value is Record<string, WidgetData> {
  return (
    value !== null &&
    value !== undefined &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof File) &&
    !(value instanceof Blob) &&
    !(value instanceof Date)
  );
}

function buildUrl<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  locale: CountryLanguage,
  requestData: TEndpoint["types"]["RequestOutput"],
  pathParams: TEndpoint["types"]["UrlVariablesOutput"],
  logger: EndpointLogger,
): { url: string; missingParam?: string } {
  let url = `${envClient.NEXT_PUBLIC_APP_URL}/api/${locale}`;

  for (const segment of endpoint.path) {
    const isBracketParam = segment.startsWith("[") && segment.endsWith("]");
    const isColonParam = segment.startsWith(":");
    if (isBracketParam || isColonParam) {
      const paramName = isBracketParam
        ? segment.slice(1, -1)
        : segment.slice(1);
      const paramValue = pathParams?.[paramName as keyof typeof pathParams];
      if (paramValue === undefined) {
        logger.error("callApi: Missing URL path parameter", {
          paramName,
          endpoint: endpoint.path.join("/"),
          availableParams: pathParams ? Object.keys(pathParams) : [],
        });
        return { url, missingParam: paramName };
      }
      url += `/${encodeURIComponent(String(paramValue))}`;
    } else {
      url += `/${segment}`;
    }
  }

  if (
    endpoint.method === Methods.GET &&
    requestData &&
    typeof requestData === "object"
  ) {
    const searchParams = new URLSearchParams();

    function flattenObject(obj: Record<string, WidgetData>, prefix = ""): void {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (value === undefined || value === null) {
          continue;
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            continue;
          }
          value.forEach((item, index) => {
            if (isJsonObject(item)) {
              flattenObject(item, `${fullKey}[${index}]`);
            } else {
              searchParams.append(`${fullKey}[${index}]`, String(item));
            }
          });
        } else if (isJsonObject(value)) {
          const hasNonNullValues = Object.values(value).some(
            (v) => v !== undefined && v !== null,
          );
          if (hasNonNullValues) {
            flattenObject(value, fullKey);
          }
        } else {
          searchParams.append(fullKey, String(value));
        }
      }
    }

    if (isJsonObject(requestData)) {
      flattenObject(requestData);
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return { url };
}

function buildBody<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  requestData: TEndpoint["types"]["RequestOutput"],
): string | FormData | undefined {
  if (endpoint.method === Methods.GET || requestData === undefined) {
    return undefined;
  }
  if (containsFile(requestData) && isJsonObject(requestData)) {
    return objectToFormData(requestData);
  }
  return JSON.stringify(requestData);
}

export async function callApi<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  logger: EndpointLogger,
  user: JwtPayloadType,
  locale: CountryLanguage,
  requestData: TEndpoint["types"]["RequestOutput"],
  pathParams: TEndpoint["types"]["UrlVariablesOutput"],
): Promise<ResponseType<TEndpoint["types"]["ResponseOutput"]>> {
  logger.debug("callApi", {
    endpoint: endpoint.path.join("/"),
    method: endpoint.method,
    pathParams,
  });

  let shouldUseClientRoute = false;

  if (endpoint.useClientRoute) {
    const clientRouteCheck = endpoint.useClientRoute as (props: {
      data: TEndpoint["types"]["RequestOutput"];
      urlPathParams: TEndpoint["types"]["UrlVariablesOutput"];
      locale: CountryLanguage;
      logger: EndpointLogger;
    }) => boolean | Promise<boolean>;
    shouldUseClientRoute = await clientRouteCheck({
      data: requestData,
      urlPathParams: pathParams,
      locale,
      logger,
    });
  }

  if (!shouldUseClientRoute && endpoint.allowedClientRoles) {
    const { filterUserPermissionRoles, UserPermissionRole } =
      await import("../../identity/roles/enum");
    const clientPermissionRoles = filterUserPermissionRoles(
      endpoint.allowedClientRoles,
    );
    if (
      user.isPublic &&
      clientPermissionRoles.includes(UserPermissionRole.PUBLIC)
    ) {
      shouldUseClientRoute = true;
    } else if (
      user.roles?.some((role) => clientPermissionRoles.includes(role))
    ) {
      shouldUseClientRoute = true;
    }
  }

  if (shouldUseClientRoute) {
    const { endpointToToolName } = await import("../../core/core-utils/path");
    const { getClientRouteHandler } = await import("@/generated/routes/client");
    const pathKey = endpointToToolName(endpoint);
    const handlerObject = await getClientRouteHandler(pathKey);
    if (handlerObject?.handler) {
      return handlerObject.handler({
        data: requestData,
        urlPathParams: pathParams,
        locale,
        logger,
        user,
      });
    }
    logger.warn(
      "Client handler not found, falling back to server API",
      pathKey,
    );
  }

  const { url, missingParam } = buildUrl(
    endpoint,
    locale,
    requestData,
    pathParams,
    logger,
  );
  if (missingParam) {
    return fail({
      message: hooksTranslation
        .scopedT(locale)
        .t("apiUtils.errors.missingUrlParam", {
          param: missingParam,
          path: endpoint.path.join("/"),
        }),
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
    });
  }

  const postBody = buildBody(endpoint, requestData);

  try {
    const headers: Record<string, string> =
      postBody instanceof FormData
        ? {}
        : { "Content-Type": "application/json" };

    if (MUTATING_METHODS.has(endpoint.method)) {
      const csrfToken = await getCsrfToken();
      if (csrfToken) {
        headers[CSRF_TOKEN_HEADER_NAME] = csrfToken;
      }
    }

    if (platform.isReactNative) {
      const { t: authT } = authScopedTranslation.scopedT(locale);
      const storedToken = await AuthClientRepository.getAuthToken(
        logger,
        authT,
      );
      const leadId = user?.leadId;
      if (storedToken.success && storedToken.data && leadId) {
        headers.Authorization = `Bearer ${storedToken.data}${BEARER_LEAD_ID_SEPARATOR}${leadId}`;
        logger.debug(
          "Added Authorization header for React Native authentication",
        );
      } else if (leadId) {
        headers.Authorization = `Bearer ${BEARER_LEAD_ID_SEPARATOR}${leadId}`;
        logger.debug("Added public leadId-only Authorization header");
      }
    }

    const options: RequestInit = {
      method: endpoint.method,
      headers,
      credentials: "include",
    };

    if (endpoint.method !== Methods.GET && postBody) {
      options.body = postBody;
    }

    // oxlint-disable-next-line restricted/no-raw-fetch
    const response = await fetch(url, options);
    const json = (await response.json()) as ResponseType<
      TEndpoint["types"]["ResponseOutput"]
    >;

    if (!response.ok) {
      if (!json.success && json.message) {
        return json;
      }
      return fail({
        message: hooksTranslation
          .scopedT(locale)
          .t("apiUtils.errors.httpStatus", { status: response.status, url }),
        errorType: ErrorResponseTypes.HTTP_ERROR,
      });
    }

    if (json.success) {
      const validationResponse = validateData(
        json.data,
        endpoint.responseSchema,
        logger,
        Platform.NEXT_API,
        `${endpoint.path.join("/")}/${endpoint.method}`,
        locale,
      );
      if (!validationResponse.success) {
        return fail({
          message: hooksTranslation
            .scopedT(locale)
            .t("apiUtils.errors.responseValidation", {
              error: validationResponse.message,
            }),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      return { success: true, data: validationResponse.data };
    }

    if (!json.success && "errorType" in json) {
      return json;
    }

    return fail({
      message: hooksTranslation
        .scopedT(locale)
        .t("apiUtils.errors.malformedResponse", { url }),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  } catch (error) {
    return fail({
      message: hooksTranslation
        .scopedT(locale)
        .t("apiUtils.errors.requestFailed", {
          path: endpoint.path.join("/"),
          error: parseError(error).message,
        }),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
