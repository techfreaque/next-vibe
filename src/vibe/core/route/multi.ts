import "server-only";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { Methods } from "next-vibe/core/definition/enums";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
/**
 * Endpoint Handler Implementation
 * Main function for creating type-safe multi-method handlers
 */
import type { NextRequest, NextResponse } from "next-vibe/ui/lib/request";

import type { GenericHandlerReturnType, MethodHandlerConfig } from "./handler";
import type { NextHandlerReturnType } from "./next-handler";
import type { ResponseType } from "./response.schema";
import { endpointHandler } from "./single";

/**
 * Base constraint for endpoint definitions
 * Endpoints must have CreateApiEndpoint values for any Methods keys
 */
export type EndpointDefinitionsConstraint = {
  readonly [K in Methods]?: K extends Methods ? CreateApiEndpointAny : never;
};

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
      ? MethodHandlerConfig<T[K]>
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
    ? GenericHandlerReturnType<T[K]>
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
  [K in keyof T]: T[K] extends CreateApiEndpointAny
    ? (
        request: NextRequest,
        context: {
          params: Promise<Record<string, string> & { locale: CountryLanguage }>;
        },
      ) => Promise<
        | NextResponse<
            | ResponseType<T[K]["types"]["ResponseOutput"]>
            | Buffer
            | ReadableStream
            | Blob
          >
        | Response
      >
    : never;
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
  type FlexibleResult = Record<
    string,
    | NextHandlerReturnType<
        ResponseType<Record<string, string | number | boolean>>,
        Record<string, string> & { locale: CountryLanguage }
      >
    | Record<string, GenericHandlerReturnType<CreateApiEndpointAny>>
  > & {
    tools: Record<string, GenericHandlerReturnType<CreateApiEndpointAny>>;
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
        email: methodConfig.email
          ? { afterHandlerEmails: methodConfig.email }
          : undefined,
        sms: methodConfig.sms
          ? { afterHandlerSms: methodConfig.sms }
          : undefined,
        requestDefaults: methodConfig.requestDefaults,
        fieldDefaults: methodConfig.fieldDefaults,
      });
      result[Methods.GET] = handler[Methods.GET];
      result.tools[Methods.GET] = handler.tools[Methods.GET];
      // typeof-function narrows out ChannelResolverField's compile-time
      // MissingChannelDeclaration brand (an object sentinel that no real value
      // ever holds) — only an actual resolver fn reaches the runtime assignment.
      if (typeof methodConfig.resolveChannel === "function") {
        result.tools[Methods.GET].resolveChannel = methodConfig.resolveChannel;
      }
      if (methodConfig.onRemoteEvent) {
        result.tools[Methods.GET].onRemoteEvent = methodConfig.onRemoteEvent;
      }
      // Exposed for dispatchers (execute-tool remote dispatch) to pre-resolve
      // caller-context defaults before shipping the call to a peer.
      if (methodConfig.fieldDefaults) {
        result.tools[Methods.GET].fieldDefaults = methodConfig.fieldDefaults;
      }
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
        email: methodConfig.email
          ? { afterHandlerEmails: methodConfig.email }
          : undefined,
        sms: methodConfig.sms
          ? { afterHandlerSms: methodConfig.sms }
          : undefined,
        requestDefaults: methodConfig.requestDefaults,
        fieldDefaults: methodConfig.fieldDefaults,
      });
      result[Methods.POST] = handler[Methods.POST];
      result.tools[Methods.POST] = handler.tools[Methods.POST];
      if (typeof methodConfig.resolveChannel === "function") {
        result.tools[Methods.POST].resolveChannel = methodConfig.resolveChannel;
      }
      if (methodConfig.onRemoteEvent) {
        result.tools[Methods.POST].onRemoteEvent = methodConfig.onRemoteEvent;
      }
      if (methodConfig.fieldDefaults) {
        result.tools[Methods.POST].fieldDefaults = methodConfig.fieldDefaults;
      }
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
        email: methodConfig.email
          ? { afterHandlerEmails: methodConfig.email }
          : undefined,
        sms: methodConfig.sms
          ? { afterHandlerSms: methodConfig.sms }
          : undefined,
        requestDefaults: methodConfig.requestDefaults,
        fieldDefaults: methodConfig.fieldDefaults,
      });
      result[Methods.PUT] = handler[Methods.PUT];
      result.tools[Methods.PUT] = handler.tools[Methods.PUT];
      if (typeof methodConfig.resolveChannel === "function") {
        result.tools[Methods.PUT].resolveChannel = methodConfig.resolveChannel;
      }
      if (methodConfig.onRemoteEvent) {
        result.tools[Methods.PUT].onRemoteEvent = methodConfig.onRemoteEvent;
      }
      if (methodConfig.fieldDefaults) {
        result.tools[Methods.PUT].fieldDefaults = methodConfig.fieldDefaults;
      }
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
        email: methodConfig.email
          ? { afterHandlerEmails: methodConfig.email }
          : undefined,
        sms: methodConfig.sms
          ? { afterHandlerSms: methodConfig.sms }
          : undefined,
        requestDefaults: methodConfig.requestDefaults,
        fieldDefaults: methodConfig.fieldDefaults,
      });
      result[Methods.PATCH] = handler[Methods.PATCH];
      result.tools[Methods.PATCH] = handler.tools[Methods.PATCH];
      if (typeof methodConfig.resolveChannel === "function") {
        result.tools[Methods.PATCH].resolveChannel =
          methodConfig.resolveChannel;
      }
      if (methodConfig.onRemoteEvent) {
        result.tools[Methods.PATCH].onRemoteEvent = methodConfig.onRemoteEvent;
      }
      if (methodConfig.fieldDefaults) {
        result.tools[Methods.PATCH].fieldDefaults = methodConfig.fieldDefaults;
      }
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
        email: methodConfig.email
          ? { afterHandlerEmails: methodConfig.email }
          : undefined,
        sms: methodConfig.sms
          ? { afterHandlerSms: methodConfig.sms }
          : undefined,
        requestDefaults: methodConfig.requestDefaults,
        fieldDefaults: methodConfig.fieldDefaults,
      });
      result[Methods.DELETE] = handler[Methods.DELETE];
      result.tools[Methods.DELETE] = handler.tools[Methods.DELETE];
      if (typeof methodConfig.resolveChannel === "function") {
        result.tools[Methods.DELETE].resolveChannel =
          methodConfig.resolveChannel;
      }
      if (methodConfig.onRemoteEvent) {
        result.tools[Methods.DELETE].onRemoteEvent = methodConfig.onRemoteEvent;
      }
      if (methodConfig.fieldDefaults) {
        result.tools[Methods.DELETE].fieldDefaults = methodConfig.fieldDefaults;
      }
    }
  }

  return result as EndpointsHandlerReturn<T>;
}
