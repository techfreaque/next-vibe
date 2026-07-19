/**
 * API Handler Implementation
 * Main function for creating API handlers that support Next.js, tRPC, and CLI
 */

import "server-only";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";

import {
  type ApiHandlerOptions,
  createGenericHandler,
  type GenericHandlerReturnType,
} from "./handler";
// TYPE-ONLY on purpose. ./next-handler pulls the Next.js request/response layer
// (NextRequest/NextResponse via ui/lib/request). Every route.ts calls
// endpointHandler, so importing it for VALUE here dragged that layer into every
// surface — including the CLI and MCP, which only ever touch `tools` and never
// invoke the Next handler at all. The implementation is loaded on first
// invocation instead (see below).
import type { NextHandlerReturnType } from "./next-handler";

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
    [K in TEndpoint["method"]]: GenericHandlerReturnType<TEndpoint>;
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
  options: ApiHandlerOptions<T>,
): EndpointHandlerReturn<T> {
  // The Next handler is built on first REQUEST, not at module load. Next.js calls
  // this exactly as before; a CLI/MCP process never calls it, so ./next-handler —
  // and the Next.js request/response layer behind it — is never loaded there.
  // Cached after the first call so per-request cost stays a map lookup.
  let builtNextHandler: NextHandlerReturnType<
    T["types"]["ResponseOutput"],
    T["types"]["UrlVariablesOutput"]
  > | null = null;
  const nextHandler: NextHandlerReturnType<
    T["types"]["ResponseOutput"],
    T["types"]["UrlVariablesOutput"]
  > = async (request, ctx) => {
    if (!builtNextHandler) {
      const { createNextHandler } = await import("./next-handler");
      builtNextHandler = createNextHandler(options);
    }
    return builtNextHandler(request, ctx);
  };

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
