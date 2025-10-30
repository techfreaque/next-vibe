/**
 * API Handler Implementation
 * Main function for creating API handlers that support Next.js, tRPC, and CLI
 */

import "server-only";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { createCliHandler } from "../../../cli/executor";
import { createNextHandler } from "../../../next-api/handler";
import { createTRPCHandler } from "../../../trpc/handler";
import type { Methods } from "../../types/enums";
import type {
  ApiHandlerOptions,
  EndpointHandlerReturn,
} from "../../types/handler";

/**
 * Create an API route handler that supports both Next.js, tRPC, and CLI
 * @param options - API handler options
 * @returns Object with both Next.js handler, tRPC procedure, and CLI handler
 *
 * Type parameters are inferred from options.endpoint.types for proper type flow
 */
export function endpointHandler<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TOptions extends ApiHandlerOptions<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput,
    string,
    Methods,
    readonly UserRoleValue[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >,
>(
  options: TOptions,
): TOptions["endpoint"] extends {
  types: {
    RequestOutput: infer TRequestOutput;
    ResponseOutput: infer TResponseOutput;
    UrlVariablesOutput: infer TUrlVariablesOutput;
  };
  method: infer TMethod extends Methods;
  allowedRoles: infer TUserRoleValue extends readonly UserRoleValue[];
}
  ? EndpointHandlerReturn<
      TRequestOutput,
      TResponseOutput,
      TUrlVariablesOutput,
      TMethod,
      TUserRoleValue
    >
  : never {
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
  } as TOptions["endpoint"] extends {
    types: {
      RequestOutput: infer TRequestOutput;
      ResponseOutput: infer TResponseOutput;
      UrlVariablesOutput: infer TUrlVariablesOutput;
    };
    method: infer TMethod extends Methods;
    allowedRoles: infer TUserRoleValue extends
      readonly UserRoleValue[];
  }
    ? EndpointHandlerReturn<
        TRequestOutput,
        TResponseOutput,
        TUrlVariablesOutput,
        TMethod,
        TUserRoleValue
      >
    : never;
}
