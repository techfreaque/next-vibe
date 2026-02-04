/**
 * Client-Side Route Handler
 * Type-safe handler for client-side routes that use localStorage/IndexedDB
 * Mirrors server route handler structure but runs in browser
 */

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../logger/endpoint";
import type { CreateApiEndpointAny } from "../../types/endpoint-base";

/**
 * Client handler function type - runs in browser, no auth required
 * Returns standard ResponseType (no streaming/file support on client)
 */
export type ClientHandlerFunction<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
> = (props: {
  data: TRequestOutput;
  urlPathParams: TUrlVariablesOutput;
  locale: CountryLanguage;
  logger: EndpointLogger;
}) => Promise<ResponseType<TResponseOutput>> | ResponseType<TResponseOutput>;

/**
 * Client handler options - simplified version of ApiHandlerOptions
 */
export interface ClientHandlerOptions<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TEndpoint extends CreateApiEndpointAny,
> {
  endpoint: TEndpoint;
  handler: ClientHandlerFunction<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput
  >;
}

/**
 * Client handler return type
 */
export interface ClientHandlerReturnType<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
> {
  endpoint: CreateApiEndpointAny;
  handler: ClientHandlerFunction<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput
  >;
}

/**
 * Create a client-side route handler
 * @param options - Client handler options
 * @returns Handler object with endpoint and handler function
 */
export function clientEndpointHandler<T extends CreateApiEndpointAny>(
  options: ClientHandlerOptions<
    T["types"]["RequestOutput"],
    T["types"]["ResponseOutput"],
    T["types"]["UrlVariablesOutput"],
    T
  >,
): ClientHandlerReturnType<
  T["types"]["RequestOutput"],
  T["types"]["ResponseOutput"],
  T["types"]["UrlVariablesOutput"]
> {
  return {
    endpoint: options.endpoint,
    handler: options.handler,
  };
}

/**
 * Helper to create multiple client handlers for an endpoint
 */
export function clientEndpointsHandler<
  T extends Partial<Record<string, CreateApiEndpointAny>>,
>(handlers: {
  [K in keyof T]: T[K] extends CreateApiEndpointAny
    ? ClientHandlerOptions<
        T[K]["types"]["RequestOutput"],
        T[K]["types"]["ResponseOutput"],
        T[K]["types"]["UrlVariablesOutput"],
        T[K]
      >
    : never;
}): {
  [K in keyof T]: T[K] extends CreateApiEndpointAny
    ? ClientHandlerReturnType<
        T[K]["types"]["RequestOutput"],
        T[K]["types"]["ResponseOutput"],
        T[K]["types"]["UrlVariablesOutput"]
      >
    : never;
} {
  type ResultType = {
    [K in keyof T]: T[K] extends CreateApiEndpointAny
      ? ClientHandlerReturnType<
          T[K]["types"]["RequestOutput"],
          T[K]["types"]["ResponseOutput"],
          T[K]["types"]["UrlVariablesOutput"]
        >
      : never;
  };

  const result = {} as ResultType;

  for (const method of Object.keys(handlers)) {
    const config = handlers[method];
    if (config) {
      result[method as keyof T] = clientEndpointHandler(
        config as ClientHandlerOptions<
          CreateApiEndpointAny["types"]["RequestOutput"],
          CreateApiEndpointAny["types"]["ResponseOutput"],
          CreateApiEndpointAny["types"]["UrlVariablesOutput"],
          CreateApiEndpointAny
        >,
      ) as ResultType[keyof T];
    }
  }

  return result;
}
