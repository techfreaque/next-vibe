/**
 * Endpoint Handler Implementation
 * Main function for creating type-safe multi-method handlers
 */
import "server-only";

import type { Prettify } from "next-vibe/shared/types/utils";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { Methods } from "../endpoint-types/core/enums";
import type { CreateApiEndpoint } from "../endpoint-types/endpoint/create";
import { endpointHandler } from "./endpoint-handler";
import type { EndpointHandlerConfig, EndpointsHandlerReturn } from "./types";

export function endpointsHandler<T>(
  config: EndpointHandlerConfig<T>,
): Prettify<EndpointsHandlerReturn<T>> {
  const { endpoint: definitions, ...methodHandlers } = config;

  // Extract available methods from definitions
  const availableMethods = Object.keys(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    definitions as Record<
      string,
      CreateApiEndpoint<string, Methods, readonly (typeof UserRoleValue)[], any>
    >,
  ).filter((key) => Object.values(Methods).includes(key as Methods)) as Array<
    keyof T & Methods
  >;

  // Initialize result with proper structure
  const result = {
    tools: {
      trpc: {},
      cli: {},
    },
    definitions,
    methods: availableMethods,
  } as EndpointsHandlerReturn<T>;

  // Process each method and merge handler results
  for (const method of availableMethods) {
    const endpoint = definitions[method];
    const methodConfig = methodHandlers[method];

    if (!endpoint || !methodConfig) {
      continue;
    }

    // Create handler with proper email/sms structure
    // endpointHandler now infers types from options.endpoint
    const handler = endpointHandler({
      endpoint: endpoint,
      handler: methodConfig.handler,
      email: methodConfig.email
        ? {
            afterHandlerEmails: methodConfig.email,
          }
        : undefined,
      sms: methodConfig.sms
        ? {
            afterHandlerSms: methodConfig.sms,
          }
        : undefined,
    });

    // Merge the handler result into our result
    // The handler returns { [method]: nextHandler, tools: { trpc, cli } }
    result[method] = handler[method as keyof typeof handler];

    // Merge tools separately to avoid overwriting
    Object.assign(result.tools.trpc, handler.tools.trpc);

    // For CLI, assign the handler to the specific method
    result.tools.cli[method] = handler.tools.cli;
  }

  return result as Prettify<EndpointsHandlerReturn<T>>;
}
