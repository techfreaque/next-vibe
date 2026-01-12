/**
 * Next.js Handler Creation
 * Thin adapter that extracts Next.js request data and delegates to shared generic handler
 * Handles ONLY Next.js-specific concerns: NextRequest parsing, NextResponse wrapping, streaming
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parseError } from "next-vibe/shared/utils/parse-error";

import {
  ErrorResponseError,
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
import type { CountryLanguage } from "@/i18n/core/config";

import {
  type ApiHandlerOptions,
  createGenericHandler,
} from "../shared/endpoints/route/handler";
import { createEndpointLogger } from "../shared/logger/endpoint";
import type { CreateApiEndpointAny } from "../shared/types/endpoint";
import { Methods } from "../shared/types/enums";
import { Platform } from "../shared/types/platform";

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
    T
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
      });

      // Handle file responses - return immediately
      if (isFileResponse(result)) {
        logger.info("Returning file response");
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
        logger.info("Returning streaming response");
        return result.response;
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
      return wrapErrorResponse(
        {
          success: false,
          message: "app.api.shared.errorTypes.internal_error",
          errorType: {
            errorKey: "app.api.shared.errorTypes.internal_error",
            errorCode: 500,
          },
          messageParams: {
            error: parseError(error).message,
          },
        },
        locale,
        logger,
      );
    }
  };
}
