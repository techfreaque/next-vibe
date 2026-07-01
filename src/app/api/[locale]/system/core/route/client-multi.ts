/**
 * Client Multi-Method Handler
 * Creates type-safe multi-method handlers for client-side routes
 * Mirrors server multi.ts structure
 */

import type { CreateApiEndpointAny } from "../../types/endpoint-base";
import { Methods } from "../../types/enums";
import type {
  ClientHandlerFunction,
  ClientHandlerReturnType,
} from "./client-handler";
import { clientEndpointHandler } from "./client-handler";

/**
 * Base constraint for client endpoint definitions
 */
export type ClientEndpointDefinitionsConstraint = {
  readonly [K in Methods]?: K extends Methods ? CreateApiEndpointAny : never;
};

/**
 * Client handler configuration that matches server MethodHandlerConfig structure
 */
export interface ClientMethodHandlerConfig<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
> {
  handler: ClientHandlerFunction<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput
  >;
}

/**
 * Type-safe configuration for client handlers
 * Matches server EndpointHandlerConfig structure
 */
export type ClientEndpointHandlerConfig<
  T extends ClientEndpointDefinitionsConstraint,
> = {
  endpoint: T;
} & {
  [K in Methods]?: K extends keyof T
    ? T[K] extends CreateApiEndpointAny
      ? ClientMethodHandlerConfig<
          T[K]["types"]["RequestOutput"],
          T[K]["types"]["ResponseOutput"],
          T[K]["types"]["UrlVariablesOutput"]
        >
      : never
    : never;
};

/**
 * Return type for client endpoints handler
 */
type ClientEndpointsHandlerReturn<
  T extends ClientEndpointDefinitionsConstraint,
> = {
  [K in keyof T]: T[K] extends CreateApiEndpointAny
    ? ClientHandlerReturnType<
        T[K]["types"]["RequestOutput"],
        T[K]["types"]["ResponseOutput"],
        T[K]["types"]["UrlVariablesOutput"]
      >
    : never;
};

/**
 * Creates handlers for multiple HTTP methods from client endpoint definitions
 * Mirrors server endpointsHandler structure
 *
 * @param config - Configuration object with endpoint definitions and handlers
 * @returns Object with handlers for each method
 *
 * @example
 * ```ts
 * export const { GET, POST } = clientEndpointsHandler({
 *   endpoint: definitions,
 *   [Methods.GET]: {
 *     handler: ({ logger, locale }) =>
 *       Repository.getFavorites(logger, locale),
 *   },
 *   [Methods.POST]: {
 *     handler: ({ data, logger, locale }) =>
 *       Repository.createFavorite(data, logger, locale),
 *   },
 * });
 * ```
 */
export function clientEndpointsHandler<
  T extends ClientEndpointDefinitionsConstraint,
>(config: ClientEndpointHandlerConfig<T>): ClientEndpointsHandlerReturn<T> {
  const result = {} as ClientEndpointsHandlerReturn<T>;

  // Iterate through all possible HTTP methods
  for (const method of Object.values(Methods)) {
    const methodConfig = config[method];
    const endpoint = config.endpoint[method];

    if (methodConfig && endpoint) {
      // Create handler for this method
      result[method as keyof T] = clientEndpointHandler({
        endpoint,
        handler: methodConfig.handler,
      }) as ClientEndpointsHandlerReturn<T>[keyof T];
    }
  }

  return result;
}
