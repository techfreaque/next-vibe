/**
 * Definition Loader
 * Shared utility for loading endpoint definitions from route modules
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "../../logger/endpoint";
import type { Methods } from "../../types/enums";
import type { DefinitionModule } from "../../types/handler";
import { loadRouteModule } from "./route-loader";

/**
 * Definition loading options
 */
export interface DefinitionLoaderOptions {
  /** Route path to load */
  routePath: string;
  /** HTTP method */
  method: Methods | string;
  /** Whether to try registry first (default: true) */
  tryRegistry?: boolean;
  /** Whether to fallback to dynamic import (default: true) */
  fallbackToDynamic?: boolean;
  /** Whether to try definition file as fallback (default: true) */
  tryDefinitionFile?: boolean;
}

/**
 * Definition loading result
 */
// eslint-disable-next-line no-restricted-syntax -- Infrastructure: Dynamic module loading requires 'unknown' for runtime type discovery
export interface DefinitionLoaderResult<TEndpoint = unknown> {
  /** Loaded endpoint definition */
  definition: TEndpoint | null;
  /** Where the definition was loaded from */
  source: "route-module" | "definition-file" | null;
  /** Error if loading failed */
  error?: string;
}

/**
 * Extract definition from route module
 */
// eslint-disable-next-line no-restricted-syntax -- Infrastructure: Definition extraction requires 'unknown' for flexible module structure
function extractDefinitionFromModule<TEndpoint = unknown>(
  // eslint-disable-next-line no-restricted-syntax
  module: { [key: string]: unknown },
  method: Methods | string,
  logger: EndpointLogger,
): TEndpoint | null {
  // Get the definitions from the tools export (new structure)
  const tools = module.tools as
    | {
        definitions?: { [key: string]: TEndpoint };
      }
    | undefined;

  if (tools?.definitions) {
    const definitions = tools.definitions;
    const definition =
      definitions[method] || definitions.POST || definitions.GET || null;

    if (definition) {
      logger.debug(`[Definition Loader] Found definition in route module`, {
        method,
      });
      return definition as TEndpoint;
    }
  }

  return null;
}

/**
 * Load definition from definition file (fallback)
 */
// eslint-disable-next-line no-restricted-syntax -- Infrastructure: Export validation requires 'unknown' for runtime structure checking
async function loadDefinitionFromFile<TEndpoint = unknown>(
  routePath: string,
  method: Methods | string,
  logger: EndpointLogger,
): Promise<TEndpoint | null> {
  const definitionPath = routePath.replace("/route.ts", "/definition.ts");

  try {
    const definitionImport = (await import(definitionPath)) as DefinitionModule;
    const definitions = definitionImport.default;

    if (definitions?.[method]) {
      const endpoint = definitions[method];
      if (endpoint) {
        logger.debug(
          `[Definition Loader] Found definition in definition file`,
          { method, definitionPath },
        );
        return endpoint as TEndpoint;
      }
    }
  } catch (error) {
    logger.debug(`[Definition Loader] No definition file found`, {
      definitionPath,
      error: parseError(error),
    });
  }

  return null;
}

/**
 * Load endpoint definition from route
 * 1. Try to load from route module (route.ts -> tools.definitions)
 * 2. Fallback to definition file (definition.ts)
 */
// eslint-disable-next-line no-restricted-syntax -- Infrastructure: Definition type extraction requires 'unknown' for generic module support
export async function loadEndpointDefinition<TEndpoint = unknown>(
  options: DefinitionLoaderOptions,
  logger: EndpointLogger,
): Promise<DefinitionLoaderResult<TEndpoint>> {
  const {
    routePath,
    method,
    tryRegistry = true,
    fallbackToDynamic = true,
    tryDefinitionFile = true,
  } = options;

  logger.debug(`[Definition Loader] Loading endpoint definition`, {
    routePath,
    method,
  });

  // Try to load from route module first
  const moduleResult = await loadRouteModule(
    {
      routePath,
      method,
      tryRegistry,
      fallbackToDynamic,
    },
    logger,
  );

  if (moduleResult.module) {
    const definition = extractDefinitionFromModule<TEndpoint>(
      // eslint-disable-next-line no-restricted-syntax -- Infrastructure: Type parameter requires 'unknown' for generic definition loading
      // eslint-disable-next-line no-restricted-syntax -- Infrastructure: Cache key generation requires 'unknown' for flexible type support
      moduleResult.module as unknown as Record<string, unknown>,
      method,
      logger,
    );

    if (definition) {
      return {
        definition,
        source: "route-module",
      };
    }
  }

  // Fallback to definition file
  if (tryDefinitionFile) {
    const definition = await loadDefinitionFromFile<TEndpoint>(
      routePath,
      method,
      logger,
    );

    if (definition) {
      return {
        definition,
        source: "definition-file",
      };
    }
  }

  logger.debug(`[Definition Loader] No definition found`, {
    routePath,
    method,
  });

  return {
    definition: null,
    source: null,
    error: "Definition not found",
  };
}
