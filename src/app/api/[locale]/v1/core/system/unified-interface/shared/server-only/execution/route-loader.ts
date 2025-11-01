/**
 * Route Module Loader
 * DEPRECATED: Use routeRegistry directly instead
 * This file maintained for backwards compatibility
 */

import "server-only";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type { CreateApiEndpoint } from "../../endpoint/create";
import type { EndpointLogger } from "../../logger/endpoint";
import type { Methods } from "../../types/enums";
import type { RouteModule } from "../../types/handler";
import { routeRegistry } from "../registry/route-registry";

/**
 * Default request data type for route module constraints
 */
type DefaultRequestData = Record<string, string | number | boolean | null>;

/**
 * Route loading options
 */
export interface RouteLoaderOptions {
  /** Route path to load */
  routePath: string;
  /** HTTP method */
  method: Methods | string;
  /** Route alias (for logging) */
  alias?: string;
}

/**
 * Route loading result
 * TEndpoint defaults to any CreateApiEndpoint
 */
export interface RouteLoaderResult<
  TEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    DefaultRequestData
  > = CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    DefaultRequestData
  >,
> {
  /** Loaded route module */
  module: RouteModule<TEndpoint> | null;
  /** Error if loading failed */
  error?: string;
}

/**
 * Load route module using RouteRegistry
 * @deprecated Use routeRegistry.loadRoute() directly
 */
export async function loadRouteModule<
  TEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    DefaultRequestData
  > = CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    DefaultRequestData
  >,
>(
  options: RouteLoaderOptions,
  logger: EndpointLogger,
): Promise<RouteLoaderResult<TEndpoint>> {
  return routeRegistry.loadRoute<TEndpoint>(options, logger);
}

/**
 * Type for platform handler structure
 */
type PlatformHandlers =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((...args: any[]) => any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Record<string, (...args: any[]) => any>;

/**
 * Extract handler from route module by platform and method
 */
export function extractHandlerFromModule<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  THandler = (...args: any[]) => any,
  TEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    DefaultRequestData
  > = CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    DefaultRequestData
  >,
>(
  module: RouteModule<TEndpoint>,
  platform: "cli" | "ai" | "mcp",
  method: Methods | string,
  logger: EndpointLogger,
): THandler | null {
  logger.debug(`[Route Loader] Extracting ${platform} handler`, {
    method,
    hasTools: !!module.tools,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hasPlatform: !!(module.tools as Record<string, any>)?.[platform],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const platformHandlers = (module.tools as Record<string, any>)?.[
    platform
  ] as PlatformHandlers | undefined;

  if (!platformHandlers) {
    logger.warn(`[Route Loader] No ${platform} handlers found`);
    return null;
  }

  // Check for tools[platform][method] pattern (endpointsHandler)
  if (
    typeof platformHandlers === "object" &&
    platformHandlers !== null &&
    method in platformHandlers
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (platformHandlers as Record<string, any>)[method];
    logger.debug(`[Route Loader] Found ${platform} handler for method`, {
      method,
      handlerType: typeof handler,
    });
    if (typeof handler === "function") {
      return handler as THandler;
    }
  }

  // Fallback: Check if handler is directly at tools[platform] (single method routes)
  if (typeof platformHandlers === "function") {
    logger.debug(`[Route Loader] Found direct ${platform} handler`);
    return platformHandlers as THandler;
  }

  logger.warn(`[Route Loader] No ${platform} handler found for method`, {
    method,
  });
  return null;
}

/**
 * Load route module and extract handler in one call
 */
export async function loadRouteHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  THandler = (...args: any[]) => any,
  TEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    DefaultRequestData
  > = CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    DefaultRequestData
  >,
>(
  options: RouteLoaderOptions,
  platform: "cli" | "ai" | "mcp",
  logger: EndpointLogger,
): Promise<{
  handler: THandler | null;
  module: RouteModule<TEndpoint> | null;
  error?: string;
}> {
  const loadResult = await loadRouteModule<TEndpoint>(options, logger);

  if (!loadResult.module || loadResult.error) {
    return {
      handler: null,
      module: null,
      error: loadResult.error,
    };
  }

  const handler = extractHandlerFromModule<THandler>(
    loadResult.module,
    platform,
    options.method,
    logger,
  );

  return {
    handler,
    module: loadResult.module,
  };
}
