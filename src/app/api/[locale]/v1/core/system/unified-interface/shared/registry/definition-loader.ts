/**
 * Definition Loader
 * DEPRECATED: Use endpointRegistry directly instead
 * This file maintained for backwards compatibility
 */

import type { EndpointLogger } from "../logger/endpoint";
import type { Methods } from "../types/enums";
import type { CreateApiEndpointAny } from "../types/endpoint";
import { endpointRegistry } from "./endpoint-registry";

/**
 * Definition loading options
 */
export interface DefinitionLoaderOptions {
  /** Route path to load */
  routePath: string;
  /** HTTP method */
  method: Methods | string;
}

/**
 * Definition loading result
 */
// eslint-disable-next-line no-restricted-syntax -- Infrastructure: Dynamic module loading requires 'unknown' for runtime type discovery
export interface DefinitionLoaderResult<TEndpoint = unknown> {
  /** Loaded endpoint definition */
  definition: TEndpoint | null;
  /** Where the definition was loaded from */
  source: "generated-index" | null;
  /** Error if loading failed */
  error?: string;
}

/**
 * Load endpoint definition using EndpointRegistry
 * @deprecated Use endpointRegistry.loadDefinition() directly
 */
export async function loadEndpointDefinition<
  TEndpoint extends CreateApiEndpointAny = CreateApiEndpointAny,
>(
  options: DefinitionLoaderOptions,
  logger: EndpointLogger,
): Promise<DefinitionLoaderResult<TEndpoint>> {
  return endpointRegistry.loadDefinition<TEndpoint>(options, logger);
}
