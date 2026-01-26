/**
 * API Handler Implementation
 * Main function for creating API handlers that support Next.js, tRPC, and CLI
 */

import "server-only";

import {
  createNextHandler,
  type NextHandlerReturnType,
} from "../../../next-api/handler";
import type { CreateApiEndpointAny } from "../../types/endpoint-base";
import {
  type ApiHandlerOptions,
  createGenericHandler,
  type GenericHandlerReturnType,
} from "./handler";

/**
 * API handler return type that supports both Next.js and tRPC
 */
type EndpointHandlerReturn<TEndpoint extends CreateApiEndpointAny> = {
  [K in TEndpoint["method"]]: NextHandlerReturnType<
    TEndpoint["types"]["ResponseOutput"],
    TEndpoint["types"]["UrlVariablesOutput"]
  >;
} & {
  tools: {
    [K in TEndpoint["method"]]: GenericHandlerReturnType<
      TEndpoint["types"]["RequestOutput"],
      TEndpoint["types"]["ResponseOutput"],
      TEndpoint["types"]["UrlVariablesOutput"],
      TEndpoint["allowedRoles"]
    >;
  };
  definitions: TEndpoint;
};

/**
 * Create an API route handler that supports both Next.js, tRPC, and CLI
 * @param options - API handler options
 * @returns Object with both Next.js handler, tRPC procedure, and CLI handler
 *
 * Type parameters are inferred from options.endpoint.types for proper type flow
 */
export function endpointHandler<T extends CreateApiEndpointAny>(
  options: ApiHandlerOptions<
    T["types"]["RequestOutput"],
    T["types"]["ResponseOutput"],
    T["types"]["UrlVariablesOutput"],
    T["allowedRoles"],
    T
  >,
): EndpointHandlerReturn<T> {
  const nextHandler = createNextHandler(options);
  const genericHandler = createGenericHandler(options);
  const method = options.endpoint.method;

  return {
    [method]: nextHandler,
    tools: {
      [method]: genericHandler,
    },
    definitions: options.endpoint,
  } as EndpointHandlerReturn<T>;
}
