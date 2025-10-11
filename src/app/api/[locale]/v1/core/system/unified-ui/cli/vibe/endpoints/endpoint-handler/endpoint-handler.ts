/**
 * API Handler Implementation
 * Main function for creating API handlers that support Next.js, tRPC, and CLI
 */

import "server-only";

import type z from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type { UnifiedField } from "../endpoint-types/core/types";
import type { Methods } from "../endpoint-types/core/enums";
import { createCliHandler } from "./cli/cli-handler";
import { createNextHandler } from "./next/next-handler";
import { createTRPCHandler } from "./trpc/trpc-handler";
import type { ApiHandlerOptions, EndpointHandlerReturn } from "./types";

/**
 * Create an API route handler that supports both Next.js, tRPC, and CLI
 * @param options - API handler options
 * @returns Object with both Next.js handler, tRPC procedure, and CLI handler
 */
export function endpointHandler<
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
): EndpointHandlerReturn<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TMethod,
  TUserRoleValue
> {
  // Create the Next.js handler
  const nextHandler = createNextHandler(options);

  // Create the tRPC procedure
  const trpcProcedure = createTRPCHandler(options);

  // Create the CLI handler
  const cliHandler = createCliHandler(options);

  const method = options.endpoint.method;

  return {
    [method]: nextHandler,
    tools: {
      trpc: trpcProcedure,
      cli: cliHandler,
    },
  } as EndpointHandlerReturn<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput,
    TMethod,
    TUserRoleValue
  >;
}
