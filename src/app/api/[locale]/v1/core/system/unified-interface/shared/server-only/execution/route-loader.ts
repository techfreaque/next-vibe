/**
 * Route Module Loader
 * Shared utility for loading route modules across platforms
 * Supports both registry-based (Next.js bundle) and dynamic import (CLI/runtime)
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "../../logger/endpoint";
import type { Methods } from "../../types/enums";
import type { RouteModule } from "../../types/handler";

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
  /** Whether to try registry first (default: true) */
  tryRegistry?: boolean;
  /** Whether to fallback to dynamic import (default: true) */
  fallbackToDynamic?: boolean;
}

/**
 * Route loading result
 */
export interface RouteLoaderResult<TRequestData = unknown> {
  /** Loaded route module */
  module: RouteModule<TRequestData> | null;
  /** Where the module was loaded from */
  source: "registry" | "dynamic" | null;
  /** Error if loading failed */
  error?: string;
}

/**
 * Load route module with fallback strategy
 * 1. Try registry (generated route-handlers) for Next.js server bundle
 * 2. Fallback to dynamic import for CLI/runtime context
 */
/**
 * Normalize route path to registry format
 * Converts:
 * - Absolute filesystem paths: /home/user/project/src/app/api/[locale]/v1/core/system/help/route.ts
 * - Module paths: @/app/api/[locale]/v1/core/system/help/route
 * To: core/system/help
 */
function normalizeRoutePath(routePath: string): string {
  // If it's already in the correct format, return it
  if (!routePath.includes("/") || routePath.startsWith("core/")) {
    return routePath;
  }

  // Extract path from filesystem path or module path
  const match = routePath.match(/\/v1\/(.+?)(?:\/route(?:\.ts)?)?$/);
  if (match) {
    return match[1];
  }

  // Fallback: return as-is
  return routePath;
}

export async function loadRouteModule<TRequestData = unknown>(
  options: RouteLoaderOptions,
  logger: EndpointLogger,
): Promise<RouteLoaderResult<TRequestData>> {
  const {
    routePath: originalRoutePath,
    method,
    alias,
    tryRegistry = true,
    fallbackToDynamic = true,
  } = options;

  // Normalize the route path for registry lookup
  const normalizedPath = normalizeRoutePath(originalRoutePath);
  const routePath = originalRoutePath; // Keep original for dynamic import

  logger.debug(`[Route Loader] Loading route module`, {
    routePath,
    normalizedPath,
    method,
    alias,
  });

  let routeModule: RouteModule<TRequestData> | null = null;
  let source: "registry" | "dynamic" | null = null;

  // Try registry first (for Next.js server bundle)
  if (tryRegistry) {
    try {
      const { getRouteHandler } = await import(
        "@/app/api/[locale]/v1/core/system/generated/route-handlers"
      );
      const handler = await getRouteHandler(normalizedPath);
      if (handler) {
        routeModule = handler as RouteModule<TRequestData>;
        source = "registry";
        logger.debug(`[Route Loader] Route module loaded from registry`);
      }
    } catch (registryError) {
      logger.debug(`[Route Loader] Registry not available, will try fallback`, {
        error: parseError(registryError),
      });
    }
  }

  // Fallback to dynamic import (for CLI context)
  if (!routeModule && fallbackToDynamic) {
    try {
      logger.debug(`[Route Loader] Attempting dynamic import`, { routePath });
      const imported = (await import(routePath)) as RouteModule<TRequestData>;
      routeModule = imported;
      source = "dynamic";
      logger.debug(`[Route Loader] Route module loaded via dynamic import`);
    } catch (importError) {
      const errorMessage = parseError(importError);
      logger.error(`[Route Loader] Failed to load route module`, {
        routePath,
        normalizedPath,
        error: errorMessage,
        errorType: typeof importError,
        errorDetails: importError,
      });
      return {
        module: null,
        source: null,
        error: errorMessage.message || String(importError),
      };
    }
  }

  if (!routeModule) {
    logger.warn(`[Route Loader] No route module found`, {
      routePath,
      method,
    });
    return {
      module: null,
      source: null,
      error: "Route module not found",
    };
  }

  logger.debug(`[Route Loader] Route module loaded successfully`, {
    source,
    hasTools: !!routeModule.tools,
  });

  return {
    module: routeModule,
    source,
  };
}

/**
 * Extract handler from route module by platform and method
 */
export function extractHandlerFromModule<THandler = unknown>(
  module: RouteModule<unknown>,
  platform: "cli" | "ai" | "mcp",
  method: Methods | string,
  logger: EndpointLogger,
): THandler | null {
  logger.debug(`[Route Loader] Extracting ${platform} handler`, {
    method,
    hasTools: !!module.tools,
    hasPlatform: !!(module.tools as Record<string, unknown>)?.[platform],
  });

  const platformHandlers = (module.tools as Record<string, unknown>)?.[
    platform
  ];

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
    const handler = (platformHandlers as Record<string, unknown>)[method];
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
  THandler = unknown,
  TRequestData = unknown,
>(
  options: RouteLoaderOptions,
  platform: "cli" | "ai" | "mcp",
  logger: EndpointLogger,
): Promise<{
  handler: THandler | null;
  module: RouteModule<TRequestData> | null;
  source: "registry" | "dynamic" | null;
  error?: string;
}> {
  const loadResult = await loadRouteModule<TRequestData>(options, logger);

  if (!loadResult.module || loadResult.error) {
    return {
      handler: null,
      module: null,
      source: null,
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
    source: loadResult.source,
  };
}
