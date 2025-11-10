import "server-only";

/**
 * Endpoint Handler Implementation
 * Main function for creating type-safe multi-method handlers
 */
import type { Prettify } from "next-vibe/shared/types/utils";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type { CliHandlerReturnType } from "../../../cli/executor-types";
import type { CreateApiEndpoint } from "../../endpoint/create";
import type { NextHandlerReturnType } from "../../../next-api/types";
import type { TrpcHandlerReturnType } from "../../../trpc/types";
import { Methods } from "../../types/enums";
import type {
  EndpointHandlerConfig,
  EndpointHandlerReturn,
  EndpointsHandlerReturn,
} from "../../types/handler";
import { endpointHandler } from "./single";
import type z from "zod";
import { type UnifiedField } from "../../types/endpoint";

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
        UnifiedField<z.ZodTypeAny>
      >
    >,
  ).filter((key) => Object.values(Methods).includes(key as Methods)) as Array<
    keyof T & Methods
  >;

  // Build handlers for each method
  // Type-safe handler entry using branded type
  interface HandlerEntry<M extends Methods> {
    method: M;
    handler: EndpointHandlerReturn<
      Record<string, string | number | boolean | null>,
      Record<string, string | number | boolean | null>,
      Record<string, string | number | boolean | null>,
      M,
      readonly (typeof UserRoleValue)[]
    >;
  }

  const handlers: HandlerEntry<keyof T & Methods>[] = [];

  for (const method of availableMethods) {
    // Preserve exact endpoint type for proper role inference
    // Use type assertion that maintains the specific allowedRoles tuple type
    const endpoint = definitions[
      method
    ] as T[typeof method] extends CreateApiEndpoint<
      infer TExampleKey extends string,
      infer TMethod extends Methods,
      infer TUserRoleValue extends readonly (typeof UserRoleValue)[],
      infer TFields extends UnifiedField<z.ZodTypeAny>
    >
      ? CreateApiEndpoint<TExampleKey, TMethod, TUserRoleValue, TFields>
      : CreateApiEndpoint<
          string,
          Methods,
          readonly (typeof UserRoleValue)[],
          UnifiedField<z.ZodTypeAny>
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

    handlers.push({ method, handler } as unknown as HandlerEntry<
      typeof method
    >);
  }

  // Build result from handlers with proper type preservation
  type MethodHandlers = {
    [K in keyof T & Methods]: NextHandlerReturnType<
      Record<string, string | number | boolean | null>,
      Record<string, string | number | boolean | null>
    >;
  };

  const methodHandlers = {} as MethodHandlers;
  for (const { method, handler } of handlers) {
    methodHandlers[method] = handler[method] as MethodHandlers[typeof method];
  }

  type TrpcHandlers = {
    [K in keyof T & Methods]: TrpcHandlerReturnType<
      Record<string, string | number | boolean | null>,
      Record<string, string | number | boolean | null>,
      Record<string, string | number | boolean | null>
    >;
  };

  const trpcHandlers = Object.fromEntries(
    handlers.map(({ method, handler }) => [method, handler.tools.trpc]),
  ) as TrpcHandlers;

  type CliHandlers = {
    [K in keyof T & Methods]: CliHandlerReturnType<
      Record<string, string | number | boolean | null>,
      Record<string, string | number | boolean | null>,
      Record<string, string | number | boolean | null>,
      readonly (typeof UserRoleValue)[]
    >;
  };

  const cliHandlers = Object.fromEntries(
    handlers.map(({ method, handler }) => [method, handler.tools.cli]),
  ) as CliHandlers;

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
