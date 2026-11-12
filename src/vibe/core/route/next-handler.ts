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
  CSRF_TOKEN_COOKIE_NAME,
  CSRF_TOKEN_HEADER_NAME,
  REQUEST_ID_HEADER_NAME,
} from "@/env/constants";

import { createEndpointLogger } from "../../logger/server";
import { Platform } from "../../platforms/platforms";
import type { CreateApiEndpointAny } from "../definition/endpoint-base";
import { Methods } from "../definition/enums";
import type { CountryLanguage } from "../i18n/core/config";
import { scopedTranslation as sharedScopedTranslation } from "../i18n/shared";
import { parseError } from "../utils/parse-error";
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

const MUTATING_METHODS = new Set([
  Methods.POST,
  Methods.PUT,
  Methods.DELETE,
  Methods.PATCH,
]);

/**
 * Validate CSRF double-submit cookie for browser-originated mutating requests.
 *
 * Rules (fail-open for non-browser contexts):
 * - Skip if method is GET/HEAD/OPTIONS
 * - Skip if no csrf_token cookie present (server-to-server, CLI, native - no cookie)
 * - Skip if Authorization header present (bearer-token auth - not cookie-based)
 * - Reject if csrf_token cookie present but X-CSRF-Token header is missing or mismatched
 */
function validateCsrf(
  request: NextRequest,
  method: Methods,
): { valid: true } | { valid: false; reason: string } {
  if (!MUTATING_METHODS.has(method)) {
    return { valid: true };
  }
  // Bearer-token auth (React Native, server-to-server) - not vulnerable to CSRF
  if (request.headers.get("authorization")) {
    return { valid: true };
  }
  const cookieToken = request.cookies.get(CSRF_TOKEN_COOKIE_NAME)?.value;
  if (!cookieToken) {
    // No CSRF cookie - must be a non-browser client (CLI, MCP, server). Allow.
    return { valid: true };
  }
  const headerToken = request.headers.get(CSRF_TOKEN_HEADER_NAME);
  if (!headerToken) {
    return { valid: false, reason: "csrf_header_missing" };
  }
  if (headerToken !== cookieToken) {
    return { valid: false, reason: "csrf_token_mismatch" };
  }
  return { valid: true };
}

/** Client-minted ids are uuids; accept any short token, never arbitrary text. */
const REQUEST_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;

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

    try {
      // CSRF double-submit validation for mutating browser requests
      const csrfCheck = validateCsrf(request, endpoint.method as Methods);
      if (!csrfCheck.valid) {
        const { t: sharedT } = sharedScopedTranslation.scopedT(locale);
        return wrapErrorResponse(
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
      }

      // Extract raw request data WITHOUT validation
      // genericHandler will handle all validation
      const requestData =
        endpoint.method === Methods.GET
          ? parseSearchParams(request.nextUrl.searchParams)
          : await parseRequestBody(request, logger);

      // Call shared generic handler (does auth, permissions, validation, business logic, email, SMS)
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
            ...result.headers,
          },
        });
      }

      // Handle streaming responses (Next.js-specific)
      if (isStreamingResponse(result)) {
        logger.debug("Returning streaming response");
        return result.response;
      }

      // Handle content responses - return content blocks as JSON
      if (isContentResponse(result)) {
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
        return wrapErrorResponse(result, logger, locale, endpoint, request);
      }

      // Wrap validated success result in NextResponse
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
        return wrapErrorResponse(
          error.errorResponse,
          logger,
          locale,
          endpoint,
          request,
        );
      }

      // Handle unexpected errors
      logger.error("Unexpected error in Next.js handler", parseError(error));
      const { t: sharedT } = sharedScopedTranslation.scopedT(locale);
      return wrapErrorResponse(
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
    }
  };
}
