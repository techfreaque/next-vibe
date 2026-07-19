/**
 * Endpoint-framework domain generator (single entry).
 *
 * Owns all generation derived from endpoint definitions: the endpoint registry,
 * per-locale endpoints meta, route handlers (+ ws-channels), client routes, and the
 * category registry. These share the definition scan/parse — running them from one
 * generator keeps that computation shared. The endpoint-registry group runs in a
 * fixed order (historically sequential to dodge a Bun TDZ race).
 */

import "server-only";

import type { GeneratorDefinition } from "next-vibe/core/generators/shared/shared-inputs";
import { findFilesRecursively } from "next-vibe/core/generators/shared/utils";

import { getApiDir } from "@/env/paths";

import { generateCategoryIndex } from "./generator-category-index";
import { generateClientRoutes } from "./generator-client-routes";
import { generateEndpoint } from "./generator-endpoint";
import { generateEndpointsMeta } from "./generator-endpoints-meta";
import { generateRouteHandlers } from "./generator-route-handlers";

export const generator: GeneratorDefinition = {
  key: "endpoint-framework",
  phase: "def-scan",
  needs: { definitionModules: true },
  cacheKey: "endpoints",
  findInputs(live) {
    const apiDir = getApiDir();
    if (live) {
      return [...live.definitionFiles, ...live.routeFiles].toSorted();
    }
    return [
      ...findFilesRecursively(apiDir, "definition.ts"),
      ...findFilesRecursively(apiDir, "route.ts"),
    ].toSorted();
  },
  async generate(ctx) {
    // Endpoint-registry group — fixed order (Bun TDZ safety on definition init).
    const meta = await generateEndpointsMeta(ctx);
    const endpoint = await generateEndpoint(ctx);
    const routes = await generateRouteHandlers(ctx);
    const client = await generateClientRoutes(ctx);
    const category = await generateCategoryIndex(ctx);

    return {
      summary: [
        meta.summary,
        endpoint.summary,
        routes.summary,
        client.summary,
        category.summary,
      ].join("; "),
      counts: {
        ...meta.counts,
        ...endpoint.counts,
        ...routes.counts,
        ...client.counts,
        ...category.counts,
      },
    };
  },
};
