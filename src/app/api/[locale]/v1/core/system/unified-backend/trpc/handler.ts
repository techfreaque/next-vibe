/**
 * tRPC Handler Creation
 * Creates tRPC procedures from API handler options using unified core logic
 */

import {
  ErrorResponseTypes,
  isStreamingResponse,
} from "next-vibe/shared/types/response.schema";

import {
  convertToTRPCError,
  handleNextVibeResponse,
} from "../../unified-ui/react/trpc-trpc";
import type { TRPCContext } from "../../unified-ui/react/trpc-trpc-context";
import { validateTrpcRequestData } from "../../unified-ui/react/trpc-validation";
import { createEndpointLogger } from "../shared/endpoint-logger";
import type { Methods } from "../shared/enums";
import { authenticateUser, executeHandler } from "../shared/execution-core";
import type {
  ApiHandlerOptions,
  TrpcHandlerReturnType as TrpcHandlerType,
} from "../shared/handler-types";

/**
 * Create a tRPC procedure
 * @param options - API handler options
 * @returns tRPC procedure function
 */
export function createTRPCHandler<
  TRequestInput,
  TRequestOutput,
  TResponseInput,
  TResponseOutput,
  TUrlVariablesInput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly string[],
  TFields,
>(
  options: ApiHandlerOptions<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput,
    TExampleKey,
    TMethod,
    TUserRoleValue,
    TFields,
    TRequestInput,
    TResponseInput,
    TUrlVariablesInput
  >,
): TrpcHandlerType<TRequestOutput, TResponseOutput, TUrlVariablesOutput> {
  const { endpoint, handler } = options;

  return async (
    input: TRequestOutput & { urlPathParams?: TUrlVariablesOutput },
    ctx: TRPCContext<Record<string, string>, readonly string[]>,
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
          ctx.t(
            "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.unauthorized",
          ),
        );
      }

      // Validate request data using unified core
      const logger = createEndpointLogger(false, Date.now(), ctx.locale);

      // tRPC data is already validated by tRPC's own validators
      // We validate again to ensure it matches our endpoint schema
      // TypeScript structural typing: input contains all properties of TRequestOutput plus optional urlPathParams
      // So we can pass input directly where TRequestOutput is expected
      const validationResult = validateTrpcRequestData<
        TExampleKey,
        TMethod,
        TUserRoleValue,
        TFields,
        TRequestInput,
        TRequestOutput,
        TResponseInput,
        TResponseOutput,
        TUrlVariablesInput,
        TUrlVariablesOutput
      >(
        endpoint,
        {
          method: endpoint.method,
          requestData: input,
          urlParameters: (input.urlPathParams ?? {}) as TUrlVariablesOutput,
          locale: ctx.locale,
        },
        logger,
      );

      if (!validationResult.success) {
        // eslint-disable-next-line no-restricted-syntax
        throw convertToTRPCError(
          ErrorResponseTypes.INVALID_REQUEST_ERROR,
          ctx.t(
            "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.invalid_request_data",
          ),
        );
      }

      // Execute handler using unified core
      const result = await executeHandler({
        endpoint,
        handler,
        validatedData: validationResult.data.requestData,
        urlPathParams: validationResult.data.urlPathParams,
        user: authResult.data,
        t: ctx.t,
        locale: ctx.locale,
        request: ctx.request,
        logger,
      });

      // Check if this is a streaming response
      if (isStreamingResponse(result)) {
        // tRPC doesn't support streaming responses directly
        // This should not happen as tRPC endpoints should not return streaming responses
        logger.error(
          "tRPC endpoint returned streaming response - not supported",
        );
        // eslint-disable-next-line no-restricted-syntax
        throw convertToTRPCError(
          ErrorResponseTypes.INTERNAL_ERROR,
          ctx.t(
            "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.general.internal_server_error",
          ),
        );
      }

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
        ctx.t(
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.general.internal_server_error",
        ),
      );
    }
  };
}
