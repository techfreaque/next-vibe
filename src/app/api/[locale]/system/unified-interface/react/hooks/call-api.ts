import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { validateData } from "next-vibe/shared/utils";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { Platform } from "../../shared/types/platform";

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { scopedTranslation as authScopedTranslation } from "@/app/api/[locale]/user/auth/i18n";
import { authClientRepository } from "@/app/api/[locale]/user/auth/repository-client";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import {
  BEARER_LEAD_ID_SEPARATOR,
  CSRF_TOKEN_COOKIE_NAME,
  CSRF_TOKEN_HEADER_NAME,
} from "@/config/constants";
import { envClient, platform } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

import { type CreateApiEndpointAny } from "../../shared/types/endpoint-base";
import { scopedTranslation as hooksTranslation } from "./i18n";
import { containsFile, objectToFormData } from "./api-utils-shared";

const MUTATING_METHODS = new Set([
  Methods.POST,
  Methods.PUT,
  Methods.DELETE,
  Methods.PATCH,
]);

function getCsrfToken(): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CSRF_TOKEN_COOKIE_NAME}=`));
  return match ? (match.split("=")[1] ?? null) : null;
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
      await import("@/app/api/[locale]/user/user-roles/enum");
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
    const { endpointToToolName } =
      await import("@/app/api/[locale]/system/unified-interface/shared/utils/path");
    const { getClientRouteHandler } =
      await import("@/app/api/[locale]/system/generated/route-handlers-client");
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
        .t("apiUtils.errors.internal_error"),
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
      messageParams: {
        paramName: missingParam,
        endpoint: endpoint.path.join("/"),
      },
    });
  }

  const postBody = buildBody(endpoint, requestData);

  try {
    const headers: Record<string, string> =
      postBody instanceof FormData
        ? {}
        : { "Content-Type": "application/json" };

    if (MUTATING_METHODS.has(endpoint.method)) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers[CSRF_TOKEN_HEADER_NAME] = csrfToken;
      }
    }

    if (platform.isReactNative) {
      const { t: authT } = authScopedTranslation.scopedT(locale);
      const storedToken = await authClientRepository.getAuthToken(
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
          .t("apiUtils.errors.http_error"),
        errorType: ErrorResponseTypes.HTTP_ERROR,
        messageParams: { statusCode: response.status, url },
      });
    }

    if (json.success) {
      const validationResponse = validateData(
        json.data,
        endpoint.responseSchema,
        logger,
        locale,
        Platform.NEXT_API,
        `${endpoint.path.join("/")}/${endpoint.method}`,
      );
      if (!validationResponse.success) {
        return fail({
          message: hooksTranslation
            .scopedT(locale)
            .t("apiUtils.errors.validation_error"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: { message: validationResponse.message },
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
        .t("apiUtils.errors.internal_error"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { url },
    });
  } catch (error) {
    return fail({
      message: hooksTranslation
        .scopedT(locale)
        .t("apiUtils.errors.internal_error"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        error: parseError(error).message,
        endpoint: endpoint.path.join("/"),
      },
    });
  }
}
