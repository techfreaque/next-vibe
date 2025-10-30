/**
 * Endpoint Handler Implementation
 * Main function for creating type-safe multi-method handlers
 */
import "server-only";

import type { Prettify } from "next-vibe/shared/types/utils";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type { CreateApiEndpoint } from "../../endpoint/create";
import { Methods } from "../../types/enums";
import type {
  EndpointHandlerConfig,
  EndpointsHandlerReturn,
} from "../../types/handler";
import { endpointHandler } from "./single";

export function endpointsHandler<const T>(
  config: EndpointHandlerConfig<T>,
): Prettify<EndpointsHandlerReturn<T>> {
  const { endpoint: definitions, ...methodConfigs } = config;

  // Extract available methods from definitions
  const availableMethods = Object.keys(
    definitions as Record<
      string,
      CreateApiEndpoint<
        string,
        Methods,
        readonly (typeof UserRoleValue)[],
        Record<string, string | number | boolean | null>
      >
    >,
  ).filter((key) => Object.values(Methods).includes(key as Methods)) as Array<
    keyof T & Methods
  >;

  // Build handlers for each method
  interface HandlerEntry {
    method: keyof T & Methods;
    handler: ReturnType<typeof endpointHandler>;
  }

  const handlers: HandlerEntry[] = [];

  for (const method of availableMethods) {
    const endpoint = definitions[method] as CreateApiEndpoint<
      string,
      Methods,
      readonly (typeof UserRoleValue)[],
      Record<string, string | number | boolean | null>
    >;
    const methodConfig = methodConfigs[method];

    if (!endpoint || !methodConfig) {
      continue;
    }

    // Create handler with proper email/sms structure
    // endpointHandler now infers types from options.endpoint
    const handler = endpointHandler({
      endpoint,
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

    handlers.push({ method, handler });
  }

  // Build result from handlers
  const methodHandlers = Object.fromEntries(
    handlers.map(({ method, handler }) => [method, handler[method]])
  );

  const trpcHandlers = Object.fromEntries(
    handlers.map(({ method, handler }) => [method, handler.tools.trpc])
  );

  const cliHandlers = Object.fromEntries(
    handlers.map(({ method, handler }) => [method, handler.tools.cli])
  );

  return {
    ...methodHandlers,
    tools: {
      trpc: trpcHandlers,
      cli: cliHandlers,
    },
    definitions,
    methods: availableMethods,
  } as Prettify<EndpointsHandlerReturn<T>>;
}
