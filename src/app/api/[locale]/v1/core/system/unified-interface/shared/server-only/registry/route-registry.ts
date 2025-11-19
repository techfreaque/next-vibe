/**
 * Route Registry
 * Single source of truth for loading route modules from generated index
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import {
  getRouteHandler,
  getAllRoutePaths,
  hasRoute,
} from "@/app/api/[locale]/v1/core/system/generated/route-handlers";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type { CreateApiEndpoint } from "../../endpoint/create";
import type { EndpointLogger } from "../../logger/endpoint";
import type { Methods } from "../../types/enums";
import type { RouteModule } from "../../types/handler";
import { normalizeRoutePath } from "../../registry/normalize-route-path";
import { type UnifiedField } from "../../types/endpoint";
import type z from "zod";

/**
 * Route loading options
 */
export interface RouteLoadOptions {
  /** Route path (can be filesystem path, normalized path, or alias) */
  routePath: string;
  /** HTTP method */
  method: Methods | string;
  /** Optional alias for logging */
  alias?: string;
}

/**
 * Route loading result
 */
export interface RouteLoadResult<
  TEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly UserRoleValue[],
    UnifiedField<z.ZodTypeAny>
  > = CreateApiEndpoint<
    string,
    Methods,
    readonly UserRoleValue[],
    UnifiedField<z.ZodTypeAny>
  >,
> {
  /** Loaded route module */
  module: RouteModule<TEndpoint> | null;
  /** Error if loading failed */
  error?: string;
}

/**
 * Route Registry Class
 * Centralized route module loading with normalization and caching
 */
export class RouteRegistry {
  /**
   * Load route module from generated index
   */
  async loadRoute<
    TEndpoint extends CreateApiEndpoint<
      string,
      Methods,
      readonly UserRoleValue[],
      UnifiedField<z.ZodTypeAny>
    > = CreateApiEndpoint<
      string,
      Methods,
      readonly UserRoleValue[],
      UnifiedField<z.ZodTypeAny>
    >,
  >(
    options: RouteLoadOptions,
    logger: EndpointLogger,
  ): Promise<RouteLoadResult<TEndpoint>> {
    const { routePath: originalPath, method, alias } = options;

    // Normalize the path
    const routePath = normalizeRoutePath(originalPath);

    logger.debug(`[Route Registry] Loading route module`, {
      originalPath,
      routePath,
      method,
      alias,
    });

    try {
      const handler = await getRouteHandler(routePath);

      if (!handler) {
        logger.warn(`[Route Registry] No route module found`, {
          originalPath,
          routePath,
          method,
        });
        return {
          module: null,
          error: "Route module not found in generated index",
        };
      }

      const routeModule = handler as RouteModule<TEndpoint>;

      logger.debug(`[Route Registry] Route module loaded successfully`, {
        hasTools: !!routeModule.tools,
      });

      return {
        module: routeModule,
      };
    } catch (error) {
      logger.error(`[Route Registry] Failed to load route module`, {
        originalPath,
        routePath,
        error: parseError(error).message,
      });

      return {
        module: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load route module",
      };
    }
  }

  /**
   * Get all available route paths
   */
  getAllPaths(): string[] {
    return getAllRoutePaths();
  }

  /**
   * Check if a route exists
   */
  hasRoute(path: string): boolean {
    const normalized = normalizeRoutePath(path);
    return hasRoute(normalized);
  }
}

/**
 * Singleton instance
 */
export const routeRegistry = new RouteRegistry();
