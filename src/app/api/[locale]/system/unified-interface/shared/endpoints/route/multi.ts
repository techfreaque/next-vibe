import "server-only";

/**
 * Endpoint Handler Implementation
 * Main function for creating type-safe multi-method handlers
 */
import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CreateApiEndpointAny } from "../../types/endpoint";
import { Methods } from "../../types/enums";
import type {
  GenericHandlerReturnType as GenericHandlerReturnTypeImport,
  MethodHandlerConfig,
} from "./handler";
import { endpointHandler } from "./single";

/**
 * Base constraint for endpoint definitions
 * All endpoint objects must be a partial record of Methods to CreateApiEndpoint
 */
export type EndpointDefinitionsConstraint = Partial<
  Record<Methods, CreateApiEndpointAny>
>;

/**
 * Type-safe configuration that enforces handler types match endpoint types
 * Uses conditional types to extract exact types from each endpoint
 * Only requires handlers for methods that exist in the endpoint definition
 * Handlers receive OUTPUT types (validated data) and return OUTPUT types
 */
export type EndpointHandlerConfig<T extends EndpointDefinitionsConstraint> = {
  endpoint: T;
} & {
  [K in Methods]?: K extends keyof T
    ? T[K] extends CreateApiEndpointAny
      ? MethodHandlerConfig<
          T[K]["types"]["RequestOutput"],
          T[K]["types"]["ResponseOutput"],
          T[K]["types"]["UrlVariablesOutput"],
          T[K]["allowedRoles"]
        >
      : never
    : never;
};

/**
 * Type for tools object exported from route handlers
 * Contains method handlers (GET, POST, etc.) with their specific types
 * T must be a partial record of Methods to endpoint definitions with proper structure
 */
export type ToolsObject<T extends EndpointDefinitionsConstraint> = {
  [K in keyof T]: T[K] extends CreateApiEndpointAny
    ? GenericHandlerReturnTypeImport<
        T[K]["types"]["RequestOutput"],
        T[K]["types"]["ResponseOutput"],
        T[K]["types"]["UrlVariablesOutput"],
        T[K]["allowedRoles"]
      >
    : never;
};

/**
 * Return type for endpointsHandler with proper Next.js handler types
 * CLI handlers receive RAW input data (TRequestOutput, TUrlVariablesOutput)
 * tRPC handlers receive RAW input data (TRequestOutput, TUrlVariablesOutput)
 * Next.js handlers work with raw request objects
 * All return VALIDATED response data (TResponseOutput) or streaming/file responses
 */
type EndpointsHandlerReturn<T extends EndpointDefinitionsConstraint> = {
  [K in keyof T]: undefined;
} & {
  tools: ToolsObject<T>;
};

/**
 * Creates handlers for multiple HTTP methods from endpoint definitions
 * Returns an object with Next.js handlers, generic tool handlers, and definitions
 *
 * Note: We use direct endpointHandler calls instead of a helper function because
 * endpointHandler has complex type inference that extracts types from the endpoint.
 * TypeScript can properly infer types when we call endpointHandler directly with
 * the specific endpoint and handler, but not when we try to abstract it into a
 * generic helper function.
 */
export function endpointsHandler<const T extends EndpointDefinitionsConstraint>(
  config: EndpointHandlerConfig<T>,
): EndpointsHandlerReturn<T> {
  const { endpoint: definitions, ...methodConfigs } = config;

  // Build the result object dynamically with flexible typing
  // We construct the result object gradually and assert the final type at return
  // This pattern is necessary because TypeScript cannot properly track conditional
  // types during dynamic object construction
  type FlexibleResult = Record<string, undefined> & {
    tools: Record<
      string,
      GenericHandlerReturnTypeImport<
        Record<string, string | number | boolean>,
        ResponseType<Record<string, string | number | boolean>>,
        Record<string, string> & { locale: CountryLanguage },
        readonly UserRoleValue[]
      >
    >;
  };

  const result: FlexibleResult = {
    tools: {} as FlexibleResult["tools"],
  } as FlexibleResult;

  // Process GET method
  if (Methods.GET in definitions && Methods.GET in methodConfigs) {
    const endpoint = definitions[Methods.GET];
    const methodConfig = methodConfigs[Methods.GET];
    if (endpoint && methodConfig && "handler" in methodConfig) {
      const handler = endpointHandler({
        endpoint,
        handler: methodConfig.handler,
      });
      result[Methods.GET] = undefined;
      result.tools[Methods.GET] = handler.tools[Methods.GET];
    }
  }

  // Process POST method
  if (Methods.POST in definitions && Methods.POST in methodConfigs) {
    const endpoint = definitions[Methods.POST];
    const methodConfig = methodConfigs[Methods.POST];
    if (endpoint && methodConfig && "handler" in methodConfig) {
      const handler = endpointHandler({
        endpoint,
        handler: methodConfig.handler,
      });
      result[Methods.POST] = undefined;
      result.tools[Methods.POST] = handler.tools[Methods.POST];
    }
  }

  // Process PUT method
  if (Methods.PUT in definitions && Methods.PUT in methodConfigs) {
    const endpoint = definitions[Methods.PUT];
    const methodConfig = methodConfigs[Methods.PUT];
    if (endpoint && methodConfig && "handler" in methodConfig) {
      const handler = endpointHandler({
        endpoint,
        handler: methodConfig.handler,
      });
      result[Methods.PUT] = handler[Methods.PUT];
      result.tools[Methods.PUT] = handler.tools[Methods.PUT];
    }
  }

  // Process PATCH method
  if (Methods.PATCH in definitions && Methods.PATCH in methodConfigs) {
    const endpoint = definitions[Methods.PATCH];
    const methodConfig = methodConfigs[Methods.PATCH];
    if (endpoint && methodConfig && "handler" in methodConfig) {
      const handler = endpointHandler({
        endpoint,
        handler: methodConfig.handler,
      });
      result[Methods.PATCH] = handler[Methods.PATCH];
      result.tools[Methods.PATCH] = handler.tools[Methods.PATCH];
    }
  }

  // Process DELETE method
  if (Methods.DELETE in definitions && Methods.DELETE in methodConfigs) {
    const endpoint = definitions[Methods.DELETE];
    const methodConfig = methodConfigs[Methods.DELETE];
    if (endpoint && methodConfig && "handler" in methodConfig) {
      const handler = endpointHandler({
        endpoint,
        handler: methodConfig.handler,
      });
      result[Methods.DELETE] = handler[Methods.DELETE];
      result.tools[Methods.DELETE] = handler.tools[Methods.DELETE];
    }
  }

  return result as EndpointsHandlerReturn<T>;
}
