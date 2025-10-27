/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Route Handler Registry for AI Tool Execution
 *
 * This file provides static imports of all route handlers to avoid
 * dynamic import issues in the Next.js server bundle.
 */


import type { RouteModule } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/handler-types";

import * as braveSearchRoute from "@/app/api/[locale]/v1/core/agent/brave-search/route";

/**
 * Route handler registry
 * Maps route paths to their handler modules
 */
export const routeHandlerRegistry: Record<string, RouteModule> = {
  "/home/max/projects/next-vibe/src/app/api/[locale]/v1/core/agent/brave-search/route.ts":
    braveSearchRoute,
};

/**
 * Get route handler module by path
 */
export function getRouteHandler(routePath: string): RouteModule | null {
  return routeHandlerRegistry[routePath] || null;
}
