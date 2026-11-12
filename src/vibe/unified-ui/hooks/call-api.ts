import { getCookie } from "next-vibe/ui/lib/cookies";
import { getCurrentPathname } from "next-vibe/ui/lib/location";

import {
  BEARER_LEAD_ID_SEPARATOR,
  CSRF_TOKEN_COOKIE_NAME,
  CSRF_TOKEN_HEADER_NAME,
  REQUEST_ID_HEADER_NAME,
} from "@/env/constants";

import { validateData } from "../../core/core-utils/validation";
import { type CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import { Methods } from "../../core/definition/enums";
import { coreClientEnv as envClient, platform } from "../../core/env-client";
import type { CountryLanguage } from "../../core/i18n/core/config";
import {
  type ErrorResponseType,
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import { parseError } from "../../core/utils/parse-error";
import { scopedTranslation as authScopedTranslation } from "../../identity/auth/i18n";
import { AuthClientRepository } from "../../identity/auth/repository-client";
import type { JwtPayloadType } from "../../identity/auth/types";
import { CLIENT_LOG_PATH } from "../../logger/error-monitor/client-log/constants";
import type { EndpointLogger } from "../../logger/types";
import { mintRequestId, withLogContext } from "../../logger/with-log-context";
import { Platform } from "../../platforms/platforms";
import { containsFile, objectToFormData } from "./api-utils-shared";
import { scopedTranslation as hooksTranslation } from "./i18n";

const MUTATING_METHODS = new Set([
  Methods.POST,
  Methods.PUT,
  Methods.DELETE,
  Methods.PATCH,
]);

async function getCsrfToken(logger: EndpointLogger): Promise<string | null> {
  return (await getCookie(CSRF_TOKEN_COOKIE_NAME, logger)) ?? null;
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
      // An empty/null id must fail here: `/skills/` silently resolves to the
      // LIST route, whose response then fails the by-id schema with a
      // confusing "icon/name/tagline: expected string" validation error.
      if (
        paramValue === undefined ||
        paramValue === null ||
        String(paramValue) === ""
      ) {
        logger.error("callApi: Missing URL path parameter", {
          paramName,
          endpoint: endpoint.path.join("/"),
          availableParams: pathParams ? Object.keys(pathParams) : [],
          receivedValue:
            paramValue === undefined ? "undefined" : JSON.stringify(paramValue),
          // Which widget fired the call - the bug is always in the caller.
          callerStack: new Error().stack?.slice(0, 800),
          // Minified prod stacks rarely name the widget; the page does.
          pagePath: platform.isBrowser ? getCurrentPathname() : null,
          method: endpoint.method,
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

/**
 * What happened on the wire, filled in by callApiInner so the central failure
 * report can say more than the ErrorResponseType carries.
 */
interface CallDiagnostics {
  status?: number;
  transport?: "http" | "client-route";
  redirected?: boolean;
  thrown?: Error;
  /** The failure was already logged with full detail at its origin. */
  alreadyLogged?: boolean;
  /** Sent as x-request-id; the server stamps it on its rows for this call. */
  requestId: string;
}

const CLIENT_LOG_ENDPOINT_PATH = CLIENT_LOG_PATH.join("/");

/**
 * Auth/permission denials a logged-out visitor gets by design (the client
 * probes /me and role-gated endpoints on public pages). The server marks these
 * `expected` and logs them at debug; mirror that so every anonymous page view
 * doesn't become an error row. A logged-IN user getting one is a real auth
 * drop and IS reported.
 */
const PUBLIC_EXPECTED_ERROR_KEYS = new Set<string>([
  ErrorResponseTypes.AUTH_ERROR.errorKey,
  ErrorResponseTypes.UNAUTHORIZED.errorKey,
  ErrorResponseTypes.FORBIDDEN.errorKey,
]);

/**
 * Central report for EVERY failed endpoint call made from a widget/hook
 * (useEndpoint, executeQuery, executeMutation all land here), so no caller
 * that just toasts or ignores `success === false` can hide a failure.
 * 5xx / network / unknown -> error; 4xx -> warn.
 */
function reportApiFailure(
  endpoint: CreateApiEndpointAny,
  logger: EndpointLogger,
  user: JwtPayloadType,
  response: ErrorResponseType,
  diag: CallDiagnostics,
  durationMs: number,
): void {
  const endpointPath = endpoint.path.join("/");
  if (diag.alreadyLogged || endpointPath === CLIENT_LOG_ENDPOINT_PATH) {
    return;
  }
  // Wire responses aren't re-validated: a non-2xx body can be
  // {success:false, message} with no errorType at all.
  const errorType: ErrorResponseType["errorType"] | undefined =
    response.errorType;
  const errorKey = errorType?.errorKey ?? "errorTypes.unknown_error";
  const errorCode = errorType?.errorCode ?? diag.status ?? 500;
  // TWO_FACTOR_REQUIRED is a 202 login step, not a failure
  if (errorKey === ErrorResponseTypes.TWO_FACTOR_REQUIRED.errorKey) {
    return;
  }
  if (user.isPublic && PUBLIC_EXPECTED_ERROR_KEYS.has(errorKey)) {
    logger.debug("callApi: expected public-user denial", {
      endpoint: endpointPath,
      errorKey,
    });
    return;
  }
  const status = diag.status ?? null;
  const isAbort = diag.thrown?.name === "AbortError";
  const isServerSide =
    !isAbort &&
    (diag.thrown !== undefined ||
      (status !== null && status >= 500) ||
      errorCode >= 500);
  const context = {
    endpoint: `${endpointPath}/${endpoint.method}`,
    alias: endpoint.aliases?.[0] ?? null,
    method: endpoint.method,
    status,
    errorKey,
    errorCode,
    // Translated, display-ready text (field list for validation errors)
    errorMessage: String(response.message).slice(0, 500),
    causeKey: response.cause?.errorType?.errorKey ?? null,
    transport: diag.transport ?? "http",
    redirected: diag.redirected ?? null,
    durationMs,
    isPublicUser: user.isPublic,
    // Match against the server's error_logs rows for the same request
    requestId: diag.requestId,
  };
  if (isServerSide) {
    logger.error(
      `Endpoint call failed: ${endpointPath}/${endpoint.method}`,
      diag.thrown ?? context,
      ...(diag.thrown ? [context] : []),
    );
    return;
  }
  logger.warn(
    `Endpoint call rejected: ${endpointPath}/${endpoint.method}`,
    context,
    ...(diag.thrown ? [diag.thrown] : []),
  );
}

export async function callApi<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  logger: EndpointLogger,
  user: JwtPayloadType,
  locale: CountryLanguage,
  requestData: TEndpoint["types"]["RequestOutput"],
  pathParams: TEndpoint["types"]["UrlVariablesOutput"],
): Promise<ResponseType<TEndpoint["types"]["ResponseOutput"]>> {
  const requestId = mintRequestId();
  const diag: CallDiagnostics = { requestId };
  const startedAt = Date.now();
  // Every log line of this call (non-JSON body, schema mismatch, central
  // failure report, client-route handler logs) carries the request id.
  const callLogger = withLogContext(logger, { requestId });
  const result = await callApiInner(
    endpoint,
    callLogger,
    user,
    locale,
    requestData,
    pathParams,
    diag,
  );
  if (!result.success) {
    try {
      reportApiFailure(
        endpoint,
        // Plain logger: the context record already carries requestId
        logger,
        user,
        result,
        diag,
        Date.now() - startedAt,
      );
    } catch {
      // Reporting must never turn a handled failure into a thrown one
    }
  }
  return result;
}

async function callApiInner<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  logger: EndpointLogger,
  user: JwtPayloadType,
  locale: CountryLanguage,
  requestData: TEndpoint["types"]["RequestOutput"],
  pathParams: TEndpoint["types"]["UrlVariablesOutput"],
  diag: CallDiagnostics,
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
      diag.transport = "client-route";
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
    // buildUrl already logged it with caller stack + page path
    diag.alreadyLogged = true;
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

    headers[REQUEST_ID_HEADER_NAME] = diag.requestId;

    if (MUTATING_METHODS.has(endpoint.method)) {
      const csrfToken = await getCsrfToken(logger);
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
    diag.status = response.status;
    diag.redirected = response.redirected;
    // A proxy/gateway error (502/503 "Service Unavailable") has a plain-text
    // body — report the HTTP status, not a JSON parse error.
    const isJsonBody = (response.headers.get("content-type") ?? "").includes(
      "application/json",
    );
    if (!isJsonBody) {
      // Also covers a 200 HTML page: fetch follows redirects, so a request
      // bounced to a page (or a proxy maintenance page served as 200) used to
      // surface only as "Unexpected token '<' ... is not valid JSON". Record
      // where it actually landed so the next one is traceable.
      logger.error("callApi: non-JSON response", {
        endpoint: `${endpoint.path.join("/")}/${endpoint.method}`,
        status: response.status,
        contentType: response.headers.get("content-type"),
        redirected: response.redirected,
        finalUrl: response.redirected ? response.url : null,
      });
      diag.alreadyLogged = true;
      return fail({
        message: hooksTranslation
          .scopedT(locale)
          .t("apiUtils.errors.httpStatus", { status: response.status, url }),
        errorType: ErrorResponseTypes.HTTP_ERROR,
      });
    }
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
      // Content responses (text + image blocks, see createContentResponse)
      // have no schema'd fields — validation would strip them to {} and the
      // page would render nothing. Pass them through for ContentBlocksRenderer.
      if (
        typeof json.data === "object" &&
        json.data !== null &&
        "isContentResponse" in json.data
      ) {
        return json;
      }
      const validationResponse = validateData(
        json.data,
        endpoint.responseSchema,
        logger,
        Platform.NEXT_API,
        `${endpoint.path.join("/")}/${endpoint.method}`,
        locale,
      );
      if (!validationResponse.success) {
        // validateData logged the failing paths; add the HTTP side + route
        logger.error(
          `callApi: response failed schema validation: ${endpoint.path.join("/")}/${endpoint.method}`,
          {
            endpoint: `${endpoint.path.join("/")}/${endpoint.method}`,
            status: response.status,
            errorMessage: String(validationResponse.message).slice(0, 500),
          },
        );
        diag.alreadyLogged = true;
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
    // Network failure, timeout, CORS, aborted request or JSON parse error -
    // reported by callApi() with the Error itself (name + stack).
    diag.thrown = error instanceof Error ? error : new Error(String(error));
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
