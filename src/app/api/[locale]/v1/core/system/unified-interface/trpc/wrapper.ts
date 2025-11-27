/**
 * tRPC Procedure Wrapper
 * Wraps genericHandlers into tRPC procedures
 */

import { TRPCError } from "@trpc/server";
import {
  ErrorResponseTypes,
  isStreamingResponse,
} from "next-vibe/shared/types/response.schema";

import { publicProcedure } from "./setup";
import { Platform } from "../shared/types/platform";
import type {
  ToolsObject,
  EndpointDefinitionsConstraint,
} from "../shared/endpoints/route/multi";

/**
 * Wraps tools object (route exports with genericHandlers) into tRPC procedures
 * Maintains type safety for each method
 */
export function wrapToolsForTRPC<T extends EndpointDefinitionsConstraint>(
  tools: ToolsObject<T>,
): {
  [K in keyof T]: ReturnType<typeof publicProcedure.query>;
} {
  return Object.fromEntries(
    Object.entries(tools).map(([method, genericHandler]) => [
      method,
      publicProcedure.query(async ({ input, ctx }) => {
        // Extract typed input
        const typedInput = input as
          | {
              data?: Record<string, unknown>;
              urlPathParams?: Record<string, unknown>;
            }
          | undefined;
        const data = typedInput?.data ?? {};
        const urlPathParams = typedInput?.urlPathParams ?? {};

        // Call genericHandler - handles auth, permissions, validation, business logic, email, SMS
        const result = await genericHandler({
          data,
          urlPathParams,
          locale: ctx.locale,
          logger: ctx.logger,
          platform: Platform.TRPC,
          request: ctx.request,
        });

        // Streaming not supported in tRPC
        if (isStreamingResponse(result)) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: ctx.t(
              "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.general.internal_server_error",
              {},
            ),
          });
        }

        // Handle errors with translation and chaining
        if (!result.success) {
          const errorType =
            result.errorType || ErrorResponseTypes.INTERNAL_ERROR;

          // Build error chain
          const errorParts: string[] = [
            ctx.t(result.message, result.messageParams),
          ];
          let currentCause = result.cause;
          let depth = 0;
          while (currentCause && !currentCause.success && depth < 10) {
            errorParts.push(
              `${"  ".repeat(depth + 1)}${ctx.t(currentCause.message, currentCause.messageParams)}`,
            );
            currentCause = currentCause.cause;
            depth++;
          }

          throw new TRPCError({
            code:
              errorType === ErrorResponseTypes.UNAUTHORIZED
                ? "UNAUTHORIZED"
                : errorType === ErrorResponseTypes.FORBIDDEN
                  ? "FORBIDDEN"
                  : errorType === ErrorResponseTypes.NOT_FOUND
                    ? "NOT_FOUND"
                    : errorType === ErrorResponseTypes.VALIDATION_ERROR ||
                        errorType === ErrorResponseTypes.INVALID_REQUEST_ERROR
                      ? "BAD_REQUEST"
                      : errorType === ErrorResponseTypes.CONFLICT
                        ? "CONFLICT"
                        : "INTERNAL_SERVER_ERROR",
            message: errorParts.join("\n"),
          });
        }

        return result.data;
      }),
    ]),
  ) as { [K in keyof T]: ReturnType<typeof publicProcedure.query> };
}
