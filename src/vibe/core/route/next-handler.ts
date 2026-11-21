/**
 * Next.js Handler Creation
 * Thin adapter that extracts Next.js request data and delegates to shared generic handler
 * Handles ONLY Next.js-specific concerns: NextRequest parsing, NextResponse wrapping, streaming
 */

import { coreEnv } from "next-vibe/core/env";
import {
  DefaultFolderId,
  FIXTURE_SCOPE_HEADER,
} from "next-vibe/core/execution-context";
import { Environment } from "next-vibe/env/env-util";
import type { NextRequest } from "next-vibe/ui/lib/request";
import { NextResponse } from "next-vibe/ui/lib/request";

import {
  CSRF_REJECTED_HEADER_NAME,
  CSRF_RETRY_HEADER_NAME,
  CSRF_TOKEN_COOKIE_NAME,
  LEAD_ID_COOKIE_NAME,
  REQUEST_ID_HEADER_NAME,
} from "@/env/constants";

import { createEndpointLogger } from "../../logger/server";
import { Platform } from "../../platforms/platforms";
import { trackInFlightRequest } from "../../platforms/web/in-flight-requests";
import type { CreateApiEndpointAny } from "../definition/endpoint-base";
import { Methods } from "../definition/enums";
import type { CountryLanguage } from "../i18n/core/config";
import { scopedTranslation as sharedScopedTranslation } from "../i18n/shared";
import { parseError } from "../utils/parse-error";
import {
  bytesToMegabytes,
  isContentLengthTooLarge,
  MAX_REQUEST_BODY_BYTES,
  MAX_UPLOAD_MEGABYTES,
} from "./body-limit";
import { validateCsrf } from "./csrf";
import { ErrorResponseError } from "./error-response-error";
import { type ApiHandlerOptions, createGenericHandler } from "./handler";
import { parseRequestBody, parseSearchParams } from "./next-request-parser";
import { wrapErrorResponse, wrapSuccessResponse } from "./next-response";
import {
  ErrorResponseTypes,
  fail,
  isContentResponse,
  isFileResponse,
  isStreamingResponse,
  type ResponseType,
} from "./response.schema";

/** How many cookies named `name` the raw Cookie header carries. */
function countCookies(cookieHeader: string | null, name: string): number {
  if (!cookieHeader) {
    return 0;
  }
  return cookieHeader
    .split(";")
    .filter((part) => part.trim().startsWith(`${name}=`)).length;
}

/**
 * File responses carry user uploads (chat attachments, avatars) on our own
 * origin. An SVG/HTML/XML file opened directly would run its script as
 * unbottled.ai (stored XSS that also reads the csrf cookie), so active types
 * get an opaque-origin sandbox; nothing gets MIME-sniffed into one.
 */
const ACTIVE_CONTENT_TYPE_PATTERN = /svg|html|xml|javascript/i;
export function fileResponseSecurityHeaders(
  contentType: string,
): Record<string, string> {
  const headers: Record<string, string> = {
    "X-Content-Type-Options": "nosniff",
  };
  if (ACTIVE_CONTENT_TYPE_PATTERN.test(contentType)) {
    headers["Content-Security-Policy"] = "sandbox";
  }
  return headers;
}

/** Client-minted ids are uuids; accept any short token, never arbitrary text. */
const REQUEST_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;
const TRANSPORT_TRACE_ENDPOINTS = new Set([
  "credits",
  "user/public/login",
  "user/public/signup",
  "leads/tracking",
  "vibe/agent/ai-stream/stream",
  "vibe/agent/skills/[id]",
]);

/**
 * Correlation id for this request: the browser's x-request-id when present
 * and well-formed (so its error report and these rows match), else minted
 * here so server-only rows of one request still group together.
 */
export function resolveRequestId(request: NextRequest): string {
  const fromClient = request.headers.get(REQUEST_ID_HEADER_NAME);
  if (fromClient && REQUEST_ID_PATTERN.test(fromClient)) {
    return fromClient;
  }
  return crypto.randomUUID();
}

/**
 * API handler return type
 * Supports:
 * - Standard JSON responses (NextResponse<ResponseType<TResponseOutput>>)
 * - Streaming responses (Response)
 * - File responses (NextResponse<Buffer | ReadableStream | Blob>)
 */
export type NextHandlerReturnType<TResponseOutput, TUrlVariablesInput> = (
  request: NextRequest,
  {
    params,
  }: { params: Promise<TUrlVariablesInput & { locale: CountryLanguage }> },
) => Promise<
  | NextResponse<ResponseType<TResponseOutput> | Buffer | ReadableStream | Blob>
  | Response
>;

/**
 * Create a Next.js route handler
 * Thin wrapper that extracts NextRequest data and delegates to shared generic handler
 * @param options - API handler options
 * @returns Next.js route handler function
 */
export function createNextHandler<T extends CreateApiEndpointAny>(
  options: ApiHandlerOptions<T>,
): NextHandlerReturnType<
  T["types"]["ResponseOutput"],
  T["types"]["UrlVariablesOutput"]
> {
  const { endpoint } = options;
  const endpointPath = endpoint.path.join("/");
  const traceTransport = TRANSPORT_TRACE_ENDPOINTS.has(endpointPath);

  // Create the shared generic handler (handles auth, permissions, validation, business logic, email)
  const genericHandler = createGenericHandler(options);

  return async (
    request: NextRequest,
    {
      params,
    }: {
      params: Promise<
        T["types"]["UrlVariablesOutput"] & { locale: CountryLanguage }
      >;
    },
  ) => {
    // Extract Next.js-specific data
    const { locale, ...resolvedParams } = await params;
    const urlPathParams = resolvedParams as T["types"]["UrlVariablesOutput"];
    const requestId = resolveRequestId(request);
    const logger = createEndpointLogger(false, locale, { requestId });
    const traceStartedAt = traceTransport ? Date.now() : null;
    const traceContext = {
      requestId,
      endpoint: endpointPath,
      method: endpoint.method,
    };
    let traceStage = "csrf";
    let responseStatus: number | null = null;

    // Counted until the handler returns: the deploy drain waits for these
    // (a recreate mid image-generation POST used to answer a bare 502).
    const endInFlight = trackInFlightRequest();
    try {
      if (traceStartedAt !== null) {
        logger.info("API transport entered handler", traceContext);
      }
      // CSRF double-submit validation for mutating browser requests
      const csrfCheck = validateCsrf(request, endpoint.method);
      const csrfRetry = request.headers.get(CSRF_RETRY_HEADER_NAME) === "1";
      if (!csrfCheck.valid) {
        // Our own client always echoes the cookie, so a rejection means the
        // page could not read it (duplicate cookie, foreign frame/webview)
        // or the request was not ours: say which from the wire.
        logger.warn("[CSRF] Mutating request rejected", {
          reason: csrfCheck.reason,
          endpoint: endpoint.path.join("/"),
          method: endpoint.method,
          csrfCookieCount: countCookies(
            request.headers.get("cookie"),
            CSRF_TOKEN_COOKIE_NAME,
          ),
          secFetchSite: request.headers.get("sec-fetch-site"),
          secFetchMode: request.headers.get("sec-fetch-mode"),
          hasOrigin: request.headers.get("origin") !== null,
          hasRequestId: request.headers.get(REQUEST_ID_HEADER_NAME) !== null,
          hasLeadCookie: request.cookies.has(LEAD_ID_COOKIE_NAME),
          csrfRetry,
        });
        const { t: sharedT } = sharedScopedTranslation.scopedT(locale);
        const csrfResponse = wrapErrorResponse(
          // `errorTypes.forbidden` is the generic ErrorResponseTypes label and
          // renders param-free, so the CSRF reason gets its own key.
          fail({
            message: sharedT("errors.csrfFailedDetail", {
              reason: csrfCheck.reason ?? sharedT("errors.csrfReasonUnknown"),
            }),
            errorType: ErrorResponseTypes.FORBIDDEN,
          }),
          logger,
          locale,
          endpoint,
          request,
        );
        // Machine-readable marker: callApi re-reads the cookie and retries
        // once (a parallel response re-stamped the token between its cookie
        // read and the send).
        csrfResponse.headers.set(CSRF_REJECTED_HEADER_NAME, csrfCheck.reason);
        responseStatus = csrfResponse.status;
        return csrfResponse;
      }
      if (csrfCheck.fetchMetadataFallback) {
        logger.info("[CSRF] Same-origin request accepted by Fetch Metadata", {
          reason: csrfCheck.fetchMetadataFallback,
          endpoint: endpoint.path.join("/"),
          method: endpoint.method,
          csrfRetry,
        });
      } else if (csrfRetry && csrfCheck.checked) {
        logger.info("[CSRF] Retried request passed validation", {
          endpoint: endpoint.path.join("/"),
          method: endpoint.method,
        });
      }

      // The proxy truncates bodies above MAX_REQUEST_BODY_BYTES, so parsing
      // would yield `{}` and a misleading "every field missing" validation
      // error. Name the real cause instead.
      const contentLength = request.headers.get("content-length");
      if (
        endpoint.method !== Methods.GET &&
        isContentLengthTooLarge(contentLength)
      ) {
        logger.warn("Request body exceeds proxy limit", {
          contentLength,
          limit: MAX_REQUEST_BODY_BYTES,
          contentType: request.headers.get("content-type") ?? "(none)",
        });
        const { t: sharedT } = sharedScopedTranslation.scopedT(locale);
        const response = wrapErrorResponse(
          fail({
            message: sharedT("errors.uploadTooLargeDetail", {
              size: bytesToMegabytes(Number(contentLength)),
              limit: MAX_UPLOAD_MEGABYTES,
            }),
            errorType: ErrorResponseTypes.INVALID_PAYLOAD_ERROR,
          }),
          logger,
          locale,
          endpoint,
          request,
        );
        responseStatus = response.status;
        return response;
      }

      // Extract raw request data WITHOUT validation
      // genericHandler will handle all validation
      traceStage = "request-body";
      const requestData =
        endpoint.method === Methods.GET
          ? parseSearchParams(request.nextUrl.searchParams)
          : await parseRequestBody(request, logger);

      // Call shared generic handler (does auth, permissions, validation, business logic, email, SMS)
      traceStage = "endpoint";
      const result = await genericHandler({
        data: requestData as T["types"]["RequestOutput"],
        urlPathParams,
        locale,
        logger,
        platform: Platform.NEXT_API,
        request, // Pass NextRequest for auth context
        toolExecutionContext: {
          // Live web request — under fixtures only when a dev/test browser
          // E2E run opts in via FIXTURE_SCOPE_HEADER (ignored in prod).
          fixtureScopeId:
            coreEnv.NODE_ENV === Environment.DEVELOPMENT ||
            coreEnv.NODE_ENV === Environment.TEST
              ? (request.headers.get(FIXTURE_SCOPE_HEADER) ?? undefined)
              : undefined,
          rootFolderId: DefaultFolderId.PRIVATE,
          threadId: undefined,
          // no user context — UTC (dates not user-facing here)
          timezone: "UTC",
          aiMessageId: undefined,
          skillId: undefined,
          headless: undefined,
          subAgentDepth: 0,
          voiceEnabled: false,
          currentToolMessageId: undefined,
          callerToolCallId: undefined,
          pendingToolMessages: undefined,
          duplicateToolCallKeys: undefined,
          executeClaimCount: undefined,
          pendingTimeoutMs: undefined,
          leafMessageId: undefined,
          waitingForRemoteResult: undefined,
          favoriteId: undefined,
          abortSignal: request.signal,
          callerCallbackMode: undefined,
          onEscalatedTaskCancel: undefined,
          escalateToTask: undefined,
          isRevival: undefined,
        },
      });

      // Handle file responses - return immediately
      // Use native Response with ArrayBuffer body to ensure Content-Length is
      // preserved (NextResponse + Blob/Uint8Array triggers chunked encoding,
      // which breaks <audio>/<video> elements that need Content-Length for duration).
      if (isFileResponse(result)) {
        responseStatus = 200;
        logger.debug("Returning file response");
        const body = Buffer.isBuffer(result.buffer)
          ? Uint8Array.from(result.buffer)
          : result.buffer instanceof Blob
            ? await result.buffer.arrayBuffer()
            : result.buffer;
        return new Response(body, {
          status: 200,
          headers: {
            "Content-Type": result.contentType,
            ...fileResponseSecurityHeaders(result.contentType),
            ...result.headers,
          },
        });
      }

      // Handle streaming responses (Next.js-specific)
      if (isStreamingResponse(result)) {
        responseStatus = result.response.status;
        logger.debug("Returning streaming response");
        return result.response;
      }

      // Handle content responses - return content blocks as JSON
      if (isContentResponse(result)) {
        responseStatus = 200;
        logger.debug("Returning content response");
        // Keep the marker on the wire: EndpointRenderer only renders content
        // blocks (images!) when it sees `isContentResponse` in the data.
        return NextResponse.json({
          success: true,
          data: { isContentResponse: true, content: result.content },
        });
      }

      // Handle errors - wrap in NextResponse
      if (!result.success) {
        const response = wrapErrorResponse(
          result,
          logger,
          locale,
          endpoint,
          request,
        );
        responseStatus = response.status;
        return response;
      }

      // Wrap validated success result in NextResponse
      responseStatus = 200;
      return wrapSuccessResponse(
        result.data as T["types"]["ResponseOutput"],
        200,
      );
    } catch (error) {
      // Handle ErrorResponseError - return the contained proper error response
      if (error instanceof ErrorResponseError) {
        logger.debug("ErrorResponseError caught", {
          errorType: error.errorResponse.errorType,
        });
        const response = wrapErrorResponse(
          error.errorResponse,
          logger,
          locale,
          endpoint,
          request,
        );
        responseStatus = response.status;
        return response;
      }

      // Handle unexpected errors
      logger.error("Unexpected error in Next.js handler", parseError(error));
      const { t: sharedT } = sharedScopedTranslation.scopedT(locale);
      const response = wrapErrorResponse(
        // `errorTypes.internal_error` is the generic ErrorResponseTypes label
        // and renders param-free, so the thrown detail gets its own key.
        fail({
          message: sharedT("errors.internalDetail", {
            error: parseError(error).message,
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        }),
        logger,
        locale,
        endpoint,
        request,
      );
      responseStatus = response.status;
      return response;
    } finally {
      endInFlight();
      if (traceStartedAt !== null) {
        logger.info("API transport left handler", {
          ...traceContext,
          handlerStage: traceStage,
          responseStatus,
          clientDisconnected: request.signal.aborted,
          elapsedMs: Date.now() - traceStartedAt,
        });
      }
    }
  };
}
