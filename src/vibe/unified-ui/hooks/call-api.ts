import { getCookie } from "next-vibe/ui/lib/cookies";
import { getVisibilityState } from "next-vibe/ui/lib/dom";
import { getCurrentPathname, reloadPage } from "next-vibe/ui/lib/location";
import { isOnline } from "next-vibe/ui/lib/media";
import { getSessionItem, setSessionItem } from "next-vibe/ui/lib/storage";

import {
  BEARER_LEAD_ID_SEPARATOR,
  CSRF_REJECTED_HEADER_NAME,
  CSRF_RETRY_HEADER_NAME,
  CSRF_TOKEN_COOKIE_NAME,
  CSRF_TOKEN_HEADER_NAME,
  REQUEST_ID_HEADER_NAME,
} from "@/env/constants";

import { validateData } from "../../core/core-utils/validation";
import { type CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import { Methods } from "../../core/definition/enums";
import { coreClientEnv as envClient, platform } from "../../core/env-client";
import type { CountryLanguage } from "../../core/i18n/core/config";
import { errorResponseSchema } from "../../core/route/error-response.schema";
import {
  type ErrorResponseType,
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import {
  isBrowserNetworkLossMessage,
  parseError,
} from "../../core/utils/parse-error";
import { scopedTranslation as authScopedTranslation } from "../../identity/auth/i18n";
import { AuthClientRepository } from "../../identity/auth/repository-client";
import type { JwtPayloadType } from "../../identity/auth/types";
import { CLIENT_LOG_PATH } from "../../logger/error-monitor/client-log/constants";
import {
  navigationTimingEvidence,
  resourceTiming,
} from "../../logger/resource-diagnostics";
import type { EndpointLogger, LoggerMetadata } from "../../logger/types";
import { mintRequestId, withLogContext } from "../../logger/with-log-context";
import { Platform } from "../../platforms/platforms";
import {
  readEdgeRequestTimingHeader,
  readEdgeTimingHeader,
  readProxyTimingHeader,
} from "../../realtime/core/proxy-timing";
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
 * Short, sanitized look at a non-JSON body (HTML error/block page, proxy
 * text) for the failure log: the <title> and the first 200 chars of visible
 * text, with long tokens and emails redacted. Never throws.
 */
async function readNonJsonBodyPreview(
  response: Response,
): Promise<{ title: string | null; snippet: string | null }> {
  try {
    const raw = (await response.text()).slice(0, 20_000);
    const title = /<title[^>]*>([^<]{0,200})<\/title>/i.exec(raw)?.[1]?.trim();
    const snippet = raw
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .replace(/[A-Za-z0-9+/_=-]{24,}/g, "[redacted]")
      .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, "[email]")
      .trim()
      .slice(0, 200);
    return { title: title || null, snippet: snippet || null };
  } catch {
    // Body unreadable: the headers in the log still identify the sender
    return { title: null, snippet: null };
  }
}

/**
 * What happened on the wire, filled in by callApiInner so the central failure
 * report can say more than the ErrorResponseType carries.
 */
interface CallDiagnostics {
  startedAt: number;
  phase?: "prepare" | "fetch" | "response-body";
  status?: number;
  transport?: "http" | "client-route";
  redirected?: boolean;
  thrown?: Error;
  /** The failure was already logged with full detail at its origin. */
  alreadyLogged?: boolean;
  unexpectedHttpError?: boolean;
  /** Sent as x-request-id; the server stamps it on its rows for this call. */
  requestId: string;
  retryOf?: string;
  /** Kept in memory solely to find the browser timing for a failed fetch. */
  fetchUrl?: string;
  fetchStartedAt?: number;
  /**
   * What the client actually put on the wire (JSON chars / multipart parts),
   * so a server that saw an empty body is provably a transit loss.
   */
  requestBody?: { kind: "json" | "form-data"; size: number } | null;
  /** Edge `via` header of the response (Caddy) - which proxy chain answered. */
  via?: string | null;
  /** Page visibility when the call started (network-failure diagnosis). */
  visibilityAtStart?: string | null;
  /**
   * Mutating call: whether the page could read the CSRF cookie and sent the
   * X-CSRF-Token header (a csrf_header_missing 403 with false here = the
   * cookie is invisible to JS: duplicate/foreign-path cookie, webview).
   */
  csrfHeaderSent?: boolean | null;
}

let devFullReloadAt = 0;
if (typeof window !== "undefined" && import.meta.hot) {
  import.meta.hot.on("vite:beforeFullReload", () => {
    devFullReloadAt = Date.now();
  });
}

/** Page visibility, null outside a browser document (SSR, workers). */
function currentVisibility(): string | null {
  try {
    return getVisibilityState();
  } catch {
    return null;
  }
}

function browserOnline(): boolean {
  try {
    return isOnline();
  } catch {
    return true;
  }
}

// Browser-local correlation for simultaneous failed requests on one page.
let previousTransportFailure:
  | { requestId: string; reportedAt: number }
  | undefined;

/** Context for a fetch that threw (no HTTP response at all). */
function networkFailureContext(
  diag: CallDiagnostics,
  durationMs: number,
): Record<string, LoggerMetadata> {
  const reportedAt = Date.now();
  const previous = previousTransportFailure;
  const sincePrevious = previous ? reportedAt - previous.reportedAt : -1;
  if (typeof document !== "undefined") {
    previousTransportFailure = { requestId: diag.requestId, reportedAt };
  }
  const visibilityAtFailure = currentVisibility();
  const online = browserOnline();
  const { documentEdgeRequestId, documentEdgeTimingNode } =
    navigationTimingEvidence();
  return {
    documentEdgeRequestId,
    requestDocumentEdgeTimingNode: documentEdgeTimingNode,
    requestStartedAtMs: diag.startedAt,
    previousTransportFailureRequestId:
      typeof document !== "undefined" &&
      sincePrevious >= 0 &&
      sincePrevious <= 2000
        ? previous?.requestId
        : undefined,
    fetchTimingCandidate: {
      ...resourceTiming(diag.fetchUrl, diag.fetchStartedAt),
    },
    visibilityAtStart: diag.visibilityAtStart ?? null,
    visibilityAtFailure,
    online,
    ...(devFullReloadAt > 0 && devFullReloadAt >= diag.startedAt
      ? { devFullReloadDuringRequest: true }
      : {}),
    networkFailureKind: classifyNetworkFailure(
      durationMs,
      visibilityAtFailure,
      online,
    ),
  };
}

/** Record what the browser observed before fetch returned a response. */
function classifyNetworkFailure(
  durationMs: number,
  visibilityAtFailure: string | null,
  online: boolean,
): string {
  if (visibilityAtFailure === "hidden") {
    return "page-hidden";
  }
  if (!online) {
    return "offline";
  }
  if (durationMs < 100) {
    return "early-failure";
  }
  return "late-failure";
}

/** Size of a request body without reading files (multipart = sum of parts). */
function describeRequestBody(
  body: string | FormData | undefined,
): CallDiagnostics["requestBody"] {
  if (body === undefined) {
    return null;
  }
  if (typeof body === "string") {
    return { kind: "json", size: body.length };
  }
  let size = 0;
  try {
    body.forEach((value) => {
      size += typeof value === "string" ? value.length : value.size;
    });
  } catch {
    // React Native's FormData has no forEach: report the kind only
    return { kind: "form-data", size: -1 };
  }
  return { kind: "form-data", size };
}

const CLIENT_LOG_ENDPOINT_PATH = CLIENT_LOG_PATH.join("/");
const AUTH_REFRESH_KEY = "vibe-auth-refresh-at";
const AUTH_REFRESH_COOLDOWN_MS = 30_000;

function refreshBrowserIdentity(logger: EndpointLogger): void {
  // Several private queries can fail together. Keep the guard across the
  // reload too, in case a transient server failure leaves the page signed in.
  const lastRefresh = Number(getSessionItem(AUTH_REFRESH_KEY, logger));
  const now = Date.now();
  if (now - lastRefresh < AUTH_REFRESH_COOLDOWN_MS) {
    return;
  }
  setSessionItem(AUTH_REFRESH_KEY, String(now), logger);
  reloadPage();
}

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
  const noHttpResponse = diag.phase === "fetch" && status === null;
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
    errorCode: noHttpResponse ? null : errorCode,
    failurePhase: diag.phase ?? null,
    // Translated, display-ready text (field list for validation errors)
    errorMessage: String(response.message).slice(0, 500),
    causeKey: response.cause?.errorType?.errorKey ?? null,
    transport: diag.transport ?? "http",
    responseReceived: status !== null,
    responseTypeMissing: errorType === undefined,
    publicRoleDenial: response.publicRoleDenial === true,
    redirected: diag.redirected ?? null,
    durationMs,
    requestBodyKind: diag.requestBody?.kind ?? null,
    requestBodySize: diag.requestBody?.size ?? null,
    via: diag.via ?? null,
    isPublicUser: user.isPublic,
    // Match against the server's error_logs rows for the same request
    requestId: diag.requestId,
    retryOfRequestId: diag.retryOf ?? null,
    csrfHeaderSent: diag.csrfHeaderSent ?? null,
    ...(noHttpResponse && diag.thrown && !isAbort
      ? networkFailureContext(diag, durationMs)
      : {}),
  };
  if (isServerSide) {
    logger.error(
      `${noHttpResponse ? "Endpoint transport failed" : "Endpoint call failed"}: ${endpointPath}/${endpoint.method}`,
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
  onRequestId?: (requestId: string) => void,
): Promise<ResponseType<TEndpoint["types"]["ResponseOutput"]>> {
  let retryOf: string | undefined;
  for (;;) {
    const requestId = mintRequestId();
    onRequestId?.(requestId);
    const diag: CallDiagnostics = {
      requestId,
      retryOf,
      visibilityAtStart: currentVisibility(),
      startedAt: Date.now(),
    };
    const result = await callApiInner(
      endpoint,
      withLogContext(logger, { requestId }),
      user,
      locale,
      requestData,
      pathParams,
      diag,
    );
    if (result.success) {
      return result;
    }
    try {
      reportApiFailure(
        endpoint,
        // Plain logger: the context record already carries requestId
        logger,
        user,
        result,
        diag,
        Date.now() - diag.startedAt,
      );
    } catch {
      // Reporting must never turn a handled failure into a thrown one
    }
    // Query hooks return typed errors as data, so React Query does not retry
    // them. Give interrupted reads and malformed framework errors one retry.
    // The first attempt is reported whether the retry succeeds or fails.
    const lostResponse =
      diag.status === undefined &&
      diag.phase === "fetch" &&
      diag.thrown !== undefined &&
      isBrowserNetworkLossMessage(diag.thrown.message);
    if (
      retryOf === undefined &&
      endpoint.method === Methods.GET &&
      (lostResponse || diag.unexpectedHttpError) &&
      currentVisibility() === "visible" &&
      browserOnline()
    ) {
      retryOf = requestId;
      continue;
    }
    return result;
  }
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
  diag.requestBody =
    endpoint.method === Methods.GET ? null : describeRequestBody(postBody);

  try {
    diag.phase = "prepare";
    const headers: Record<string, string> = {
      // Keep the router's normal 404 when an API request reaches its page
      // fallback. The endpoint response itself still needs to be JSON.
      Accept: "application/json, */*;q=0.1",
      [REQUEST_ID_HEADER_NAME]: diag.requestId,
    };
    if (!(postBody instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const sentCsrfToken = MUTATING_METHODS.has(endpoint.method)
      ? await getCsrfToken(logger)
      : null;
    if (sentCsrfToken) {
      headers[CSRF_TOKEN_HEADER_NAME] = sentCsrfToken;
    }
    diag.csrfHeaderSent = MUTATING_METHODS.has(endpoint.method)
      ? sentCsrfToken !== null
      : null;

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

    diag.phase = "fetch";
    diag.fetchUrl = url;
    diag.fetchStartedAt = Date.now();
    // oxlint-disable-next-line restricted/no-raw-fetch
    let response = await fetch(url, options);
    diag.status = response.status;
    // CSRF race: a parallel response (first visit, or the 1-day cookie expired
    // in an idle tab) stamped a new token after we read the cookie, so this
    // request carried a token we did not echo. Re-read and retry once when the
    // cookie changed; a real forgery has no readable cookie to retry with.
    if (
      response.status === 403 &&
      response.headers.has(CSRF_REJECTED_HEADER_NAME)
    ) {
      const freshCsrfToken = await getCsrfToken(logger);
      if (freshCsrfToken && freshCsrfToken !== sentCsrfToken) {
        headers[CSRF_TOKEN_HEADER_NAME] = freshCsrfToken;
        headers[CSRF_RETRY_HEADER_NAME] = "1";
        diag.fetchStartedAt = Date.now();
        diag.csrfHeaderSent = true;
        // oxlint-disable-next-line restricted/no-raw-fetch
        response = await fetch(url, options);
      }
    }
    diag.status = response.status;
    diag.redirected = response.redirected;
    diag.via = response.headers.get("via");
    diag.phase = "response-body";
    diag.unexpectedHttpError = !response.redirected && response.status >= 500;
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
      // Who answered? Our edge always adds "via: 1.1 Caddy", our middleware
      // adds CORS on every /api/ passthrough and Next pages add x-powered-by.
      // None of them present => a third party (filtering proxy, captive
      // portal) answered. 2026-11-12: a stream POST got a 200 text/html page
      // we could not attribute because none of this was recorded.
      const h = response.headers;
      const body = await readNonJsonBodyPreview(response);
      logger.error("callApi: non-JSON response", {
        endpoint: `${endpoint.path.join("/")}/${endpoint.method}`,
        status: response.status,
        contentType: h.get("content-type"),
        redirected: response.redirected,
        finalUrl: response.url || null,
        responseType: response.type,
        via: h.get("via"),
        server: h.get("server"),
        poweredBy: h.get("x-powered-by"),
        servedBy: h.get("x-vibe-upstream") ?? h.get("x-served-by"),
        haUpstreamObserved: h.has("x-ha-upstream"),
        proxyTimingStage: readProxyTimingHeader(h.get("server-timing")),
        edgeTimingNode: readEdgeTimingHeader(h.get("server-timing")),
        edgeRequestId: readEdgeRequestTimingHeader(h.get("server-timing")),
        contentLength: h.get("content-length"),
        hasVibeCors: h.has("access-control-allow-credentials"),
        bodyTitle: body.title,
        bodySnippet: body.snippet,
        retryOfRequestId: diag.retryOf ?? null,
      });
      diag.alreadyLogged = true;
      if (!response.redirected && response.status === 404) {
        diag.unexpectedHttpError = true;
      }
      return fail({
        message: hooksTranslation
          .scopedT(locale)
          .t("apiUtils.errors.httpStatus", { status: response.status, url }),
        errorType: ErrorResponseTypes.HTTP_ERROR,
      });
    }
    const json: WidgetData = await response.json();
    const parsedError = errorResponseSchema.safeParse(json);

    if (!response.ok) {
      if (parsedError.success) {
        diag.unexpectedHttpError = false;
        if (
          platform.isBrowser &&
          !user.isPublic &&
          response.status === 403 &&
          parsedError.data.publicRoleDenial === true
        ) {
          refreshBrowserIdentity(logger);
        }
        return parsedError.data;
      }
      return fail({
        message: hooksTranslation
          .scopedT(locale)
          .t("apiUtils.errors.httpStatus", { status: response.status, url }),
        errorType: ErrorResponseTypes.HTTP_ERROR,
      });
    }

    if (isJsonObject(json) && json.success === true) {
      // Content responses (text + image blocks, see createContentResponse)
      // have no schema'd fields — validation would strip them to {} and the
      // page would render nothing. Pass them through for ContentBlocksRenderer.
      if (isJsonObject(json.data) && "isContentResponse" in json.data) {
        return { success: true, data: json.data };
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

    if (parsedError.success) {
      return parsedError.data;
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
