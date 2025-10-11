/**
 * tRPC Handler Creation
 * Creates tRPC procedures from API handler options using unified core logic
 */

import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import type z from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type { UnifiedField } from "../../endpoint-types/core/types";
import type { Methods } from "../../endpoint-types/core/enums";
import { authenticateUser, executeHandler } from "../core/handler-core";
import { createEndpointLogger } from "../logger/endpoint-logger";
import type { ApiHandlerOptions } from "../types";
import { convertToTRPCError, handleNextVibeResponse } from "./trpc";
import type { TRPCContext } from "./trpc-context";
import type { TrpcHandlerReturnType as TrpcHandlerType } from "./types";
import { validateTrpcRequestData } from "./validation";

/**
 * Create a tRPC procedure
 * @param options - API handler options
 * @returns tRPC procedure function
 */
export function createTRPCHandler<
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
): TrpcHandlerType<TRequestOutput, TResponseOutput, TUrlVariablesOutput> {
  const { endpoint, handler } = options;

  return async (
    input: TRequestOutput & { urlVariables?: TUrlVariablesOutput },
    ctx: TRPCContext<Record<string, string>, readonly (typeof UserRoleValue)[]>,
  ): Promise<TResponseOutput> => {
    try {
      // tRPC procedure execution - debug info available in endpoint logger

      // Authenticate user using unified core with tRPC context
      const authResult = await authenticateUser(
        endpoint,
        {
          platform: "trpc",
          request: ctx.request,
        },
        createEndpointLogger(false, Date.now(), ctx.locale),
      );
      if (!authResult.success) {
        // eslint-disable-next-line no-restricted-syntax
        throw convertToTRPCError(
          ErrorResponseTypes.UNAUTHORIZED,
          ctx.t("error.unauthorized"),
        );
      }

      // Extract urlVariables from input for tRPC
      const { urlVariables, ...requestData } = input;

      // Validate request data using unified core
      const logger = createEndpointLogger(false, Date.now(), ctx.locale);
      const validationResult = validateTrpcRequestData(
        endpoint,
        {
          method: endpoint.method,
          requestData: requestData as TRequestOutput,
          urlParameters: (urlVariables || {}) as TUrlVariablesOutput,
          locale: ctx.locale,
        },
        logger,
      );

      if (!validationResult.success) {
        // eslint-disable-next-line no-restricted-syntax
        throw convertToTRPCError(
          ErrorResponseTypes.INVALID_REQUEST_ERROR,
          ctx.t("error.errors.invalid_request_data"),
        );
      }

      // Execute handler using unified core
      const result = await executeHandler({
        endpoint,
        handler,
        validatedData: validationResult.data.requestData,
        urlVariables: validationResult.data.urlVariables,
        user: authResult.data,
        t: ctx.t,
        locale: ctx.locale,
        request: ctx.request,
        logger,
      });

      // Handle the response using the existing tRPC response handler
      const handlerResponse = handleNextVibeResponse(result);
      return handlerResponse;
    } catch (error) {
      // If it's already a tRPC error, re-throw it
      if (error && typeof error === "object" && "code" in error) {
        // eslint-disable-next-line no-restricted-syntax
        throw error;
      }

      // Error details are handled by parseError and included in the response
      // eslint-disable-next-line no-restricted-syntax
      throw convertToTRPCError(
        ErrorResponseTypes.INTERNAL_ERROR,
        ctx.t("error.general.internal_server_error"),
      );
    }
  };
}
