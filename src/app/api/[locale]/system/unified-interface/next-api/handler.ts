/**
 * Next.js Handler Creation
 * Thin adapter that extracts Next.js request data and delegates to shared generic handler
 * Handles ONLY Next.js-specific concerns: NextRequest parsing, NextResponse wrapping, streaming
 */

// Side-effect: registers global error sink so all logger.error() calls persist to error_logs
import "../shared/logger/error-persist";

import type { NextRequest } from "next-vibe-ui/lib/request";
import { NextResponse } from "next-vibe-ui/lib/request";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { scopedTranslation as sharedScopedTranslation } from "@/app/api/[locale]/shared/i18n";
import {
  ErrorResponseError,
  ErrorResponseTypes,
  fail,
  isContentResponse,
  isFileResponse,
  isStreamingResponse,
  type ResponseType,
} from "@/app/api/[locale]/shared/types/response.schema";
import {
  parseRequestBody,
  parseSearchParams,
} from "@/app/api/[locale]/system/unified-interface/next-api/request-parser";
import {
  wrapErrorResponse,
  wrapSuccessResponse,
} from "@/app/api/[locale]/system/unified-interface/next-api/response";
import {
  CSRF_TOKEN_COOKIE_NAME,
  CSRF_TOKEN_HEADER_NAME,
} from "@/config/constants";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  type ApiHandlerOptions,
  createGenericHandler,
} from "../shared/endpoints/route/handler";
import { createEndpointLogger } from "../shared/logger/endpoint";
import type { CreateApiEndpointAny } from "../shared/types/endpoint-base";
import { Methods } from "../shared/types/enums";
import { Platform } from "../shared/types/platform";

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
function validateCsrf(request: NextRequest, method: Methods): boolean {
  if (!MUTATING_METHODS.has(method)) {
    return true;
  }
  // Bearer-token auth (React Native, server-to-server) - not vulnerable to CSRF
  if (request.headers.get("authorization")) {
    return true;
  }
  const cookieToken = request.cookies.get(CSRF_TOKEN_COOKIE_NAME)?.value;
  if (!cookieToken) {
    // No CSRF cookie - must be a non-browser client (CLI, MCP, server). Allow.
    return true;
  }
  const headerToken = request.headers.get(CSRF_TOKEN_HEADER_NAME);
  return !!headerToken && headerToken === cookieToken;
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
  options: ApiHandlerOptions<
    T["types"]["RequestOutput"],
    T["types"]["ResponseOutput"],
    T["types"]["UrlVariablesOutput"],
    T["allowedRoles"],
    T,
    Platform,
    T["types"]["ScopedTranslationKey"]
  >,
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
    const logger = createEndpointLogger(false, Date.now(), locale);

    try {
      // CSRF double-submit validation for mutating browser requests
      if (!validateCsrf(request, endpoint.method as Methods)) {
        const { t: sharedT } = sharedScopedTranslation.scopedT(locale);
        return wrapErrorResponse(
          fail({
            message: sharedT("errorTypes.forbidden"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          }),
          locale,
          logger,
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
        streamContext: {
          rootFolderId: DefaultFolderId.PRIVATE,
          threadId: undefined,
          aiMessageId: undefined,
          skillId: undefined,
          modelId: undefined,
          headless: undefined,
          currentToolMessageId: undefined,
          callerToolCallId: undefined,
          pendingToolMessages: undefined,
          pendingTimeoutMs: undefined,
          leafMessageId: undefined,
          waitingForRemoteResult: undefined,
          favoriteId: undefined,
          abortSignal: request.signal,
          callerCallbackMode: undefined,
          onEscalatedTaskCancel: undefined,
          escalateToTask: undefined,
        },
      });

      // Handle file responses - return immediately
      if (isFileResponse(result)) {
        logger.debug("Returning file response");
        const body = Buffer.isBuffer(result.buffer)
          ? new Blob([new Uint8Array(result.buffer)])
          : result.buffer;
        return new NextResponse(body, {
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
        return NextResponse.json({
          success: true,
          data: { content: result.content },
        });
      }

      // Handle errors - wrap in NextResponse
      if (!result.success) {
        return wrapErrorResponse(result, locale, logger);
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
        return wrapErrorResponse(error.errorResponse, locale, logger);
      }

      // Handle unexpected errors
      logger.error("Unexpected error in Next.js handler", parseError(error));
      const { t: sharedT } = sharedScopedTranslation.scopedT(locale);
      return wrapErrorResponse(
        fail({
          message: sharedT("errorTypes.internal_error"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error: parseError(error).message,
          },
        }),
        locale,
        logger,
      );
    }
  };
}
