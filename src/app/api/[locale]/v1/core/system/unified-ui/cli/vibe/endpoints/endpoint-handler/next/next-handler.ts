/**
 * Next.js Handler Creation
 * Creates Next.js route handlers from API handler options using unified core logic
 */

import type { NextRequest } from "next/server";
import {
  createSuccessResponse,
  ErrorResponseTypes,
  isStreamingResponse,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import type { z } from "zod";

import type {
  EmailHandleRequestOutput,
  EmailHandleResponseOutput,
} from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/definition";
import { EmailHandlingRepositoryImpl } from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/repository";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { Methods } from "../../endpoint-types/core/enums";
import { authenticateUser, executeHandler } from "../core/handler-core";
import type { EndpointLogger } from "../logger";
import { createEndpointLogger } from "../logger/endpoint-logger";
import type { ApiHandlerOptions } from "../types";
import {
  createHTTPErrorResponse,
  createHTTPSuccessResponse,
} from "./endpoint-response";
import type { NextHandlerReturnType } from "./types";
import { validateNextRequestData } from "./validation";

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
  TRequestInput,
  TRequestOutput,
  TResponseInput,
  TResponseOutput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
  TFields,
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
        { platform: "next" },
        logger,
      );
      if (!authResult.success) {
        return createHTTPErrorResponse({
          message: "error.unauthorized",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
          logger,
        });
      }

      // Validate request data using unified core
      const validationResult = await validateNextRequestData<
        TRequestInput,
        TRequestOutput,
        TResponseInput,
        Record<string, string>,
        TUrlVariablesOutput,
        TExampleKey,
        TMethod,
        TUserRoleValue,
        TFields
      >(
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
        logger.error(
          `Validation error: ${validationResult.message} (${
            validationResult.messageParams
              ? JSON.stringify(validationResult.messageParams)
              : "No params"
          })`,
        );
        return createHTTPErrorResponse({
          message: "error.errors.invalid_request_data",
          errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
          messageParams: {
            message: validationResult.message,
          },
          logger,
        });
      }

      // Execute handler using unified core
      const result = await executeHandler({
        endpoint,
        handler,
        validatedData: validationResult.data.requestData,
        urlVariables: validationResult.data.urlVariables,
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
          logger,
        });
      }

      // Create success response with email handling
      return await createHTTPSuccessResponse<TResponseOutput>({
        data: result.data,
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
              urlVariables: validationResult.data.urlVariables,
              requestData: validationResult.data.requestData,
              t,
              locale: validationResult.data.locale,
            },
            logger,
          );
          return createSuccessResponse(undefined);
        },
        logger,
      });
    } catch (error) {
      // Handle unexpected errors
      // Handle unexpected errors - error details are included in messageParams
      return createHTTPErrorResponse({
        message: "error.general.internal_server_error",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parseError(error).message,
        },
        logger,
      });
    }
  };
}
