/**
 * Next.js Handler Creation
 * Thin adapter that extracts Next.js request data and delegates to shared generic handler
 * Handles ONLY Next.js-specific concerns: NextRequest parsing, NextResponse wrapping, streaming
 */

import type { NextRequest, NextResponse } from "next/server";
import {
  isStreamingResponse,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  wrapSuccessResponse,
  wrapErrorResponse,
} from "@/app/api/[locale]/system/unified-interface/next-api/response";
import {
  parseRequestBody,
  parseSearchParams,
} from "@/app/api/[locale]/system/unified-interface/next-api/request-parser";
import { createEndpointLogger } from "../shared/logger/endpoint";
import { Platform } from "../shared/types/platform";
import { Methods } from "../shared/types/enums";
import type { CreateApiEndpointAny } from "../shared/types/endpoint";
import {
  type ApiHandlerOptions,
  createGenericHandler,
} from "../shared/endpoints/route/handler";

/**
 * API handler return type
 * Supports both standard JSON responses (NextResponse) and streaming responses (Response)
 */
export type NextHandlerReturnType<TResponseOutput, TUrlVariablesInput> = (
  request: NextRequest,
  {
    params,
  }: { params: Promise<TUrlVariablesInput & { locale: CountryLanguage }> },
) => Promise<NextResponse<ResponseType<TResponseOutput>> | Response>;

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
    const urlPathParams =
      resolvedParams as unknown as T["types"]["UrlVariablesOutput"];
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
