/**
 * Next.js Handler Creation
 * Creates Next.js route handlers from API handler options using unified core logic
 */

import type { NextRequest } from "next/server";
import {
  success,
  ErrorResponseTypes,
  isStreamingResponse,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import type { z } from "zod";

import { EmailHandlingRepositoryImpl } from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/repository";
import type {
  EmailHandleRequestOutput,
  EmailHandleResponseOutput,
} from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/types";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import {
  createHTTPErrorResponse,
  createHTTPSuccessResponse,
} from "../../unified-interface/react/next-endpoint-response";
import { validateNextRequestData } from "../../unified-interface/react/next-validation";
import type { EndpointLogger } from "../shared/logger/endpoint";
import { createEndpointLogger } from "../shared/logger/endpoint";
import {
  authenticateUser,
  executeHandler,
} from "../shared/server-only/execution/core";
import type { Methods } from "../shared/types/enums";
import type {
  ApiHandlerOptions,
  NextHandlerReturnType,
} from "../shared/types/handler";
import { type UnifiedField } from "../shared/types/endpoint";

// Create email handling repository instance
const emailHandlingRepository = new EmailHandlingRepositoryImpl();

// Utility function to handle emails after successful API response
async function handleEmails<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
>(
  data: EmailHandleRequestOutput<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput
  >,
  logger: EndpointLogger,
): Promise<ResponseType<EmailHandleResponseOutput>> {
  return await emailHandlingRepository.handleEmails(
    data,
    data.user,
    data.locale,
    logger,
  );
}

/**
 * Create a Next.js route handler
 * @param options - API handler options
 * @returns Next.js route handler function
 */
export function createNextHandler<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
  TFields extends UnifiedField<z.ZodTypeAny>,
>(
  options: ApiHandlerOptions<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput,
    TExampleKey,
    TMethod,
    TUserRoleValue,
    TFields
  >,
): NextHandlerReturnType<TResponseOutput, TUrlVariablesOutput> {
  const { endpoint, handler, email } = options;

  return async (
    request: NextRequest,
    {
      params,
    }: {
      params: Promise<TUrlVariablesOutput & { locale: CountryLanguage }>;
    },
  ) => {
    // Get locale and translation function
    const { locale, ...resolvedParams } = await params;
    const urlParameters = resolvedParams as TUrlVariablesOutput;
    const logger = createEndpointLogger(false, Date.now(), locale);
    const { t } = simpleT(locale);
    try {
      // Authenticate user using unified core with Next.js context
      const authResult = await authenticateUser(
        endpoint,
        { platform: "next", locale },
        logger,
      );
      if (!authResult.success) {
        return createHTTPErrorResponse({
          message: authResult.message,
          errorType: authResult.errorType,
          messageParams: authResult.messageParams,
          cause: authResult.cause,
          logger,
        });
      }

      // Validate request data using unified core
      const validationResult = await validateNextRequestData(
        endpoint,
        {
          method: endpoint.method,
          urlParameters: urlParameters as Record<string, string>,
          request,
          locale,
        },
        logger,
      );

      if (!validationResult.success) {
        return createHTTPErrorResponse({
          message: validationResult.message,
          errorType: validationResult.errorType,
          messageParams: validationResult.messageParams,
          cause: validationResult.cause,
          logger,
        });
      }

      // Execute handler using unified core
      const result = await executeHandler({
        endpoint,
        handler,
        validatedData: validationResult.data.requestData as TRequestOutput,
        urlPathParams: validationResult.data
          .urlPathParams as TUrlVariablesOutput,
        user: authResult.data,
        t,
        locale: validationResult.data.locale,
        request,
        logger,
      });

      // Check if this is a streaming response
      if (isStreamingResponse(result)) {
        // Return the streaming response directly without wrapping
        logger.info("Returning streaming response");
        return result.response;
      }

      if (!result.success) {
        return createHTTPErrorResponse({
          message: result.message,
          errorType: result.errorType,
          messageParams: result.messageParams,
          cause: result.cause,
          logger,
        });
      }

      // Create success response with email handling
      return await createHTTPSuccessResponse<TResponseOutput>({
        data: result.data as TResponseOutput,
        schema: endpoint.responseSchema as z.ZodType<TResponseOutput>,
        status: 200,
        onSuccess: async (data) => {
          await handleEmails<
            TRequestOutput,
            TResponseOutput,
            TUrlVariablesOutput
          >(
            {
              email,
              user: authResult.data,
              responseData: data,
              urlPathParams: validationResult.data
                .urlPathParams as TUrlVariablesOutput,
              requestData: validationResult.data.requestData as TRequestOutput,
              t,
              locale: validationResult.data.locale,
            },
            logger,
          );
          return success(undefined);
        },
        logger,
      });
    } catch (error) {
      // Handle unexpected errors
      // Handle unexpected errors - error details are included in messageParams
      return createHTTPErrorResponse({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parseError(error).message,
        },
        logger,
      });
    }
  };
}
