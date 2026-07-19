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

import type {
  GeneratorContext,
  GeneratorResult,
} from "next-vibe/core/generators/shared/shared-inputs";

import { generateCategoryIndex } from "./generator-category-index";
import { generateClientRoutes } from "./generator-client-routes";
import { generateEndpoint } from "./generator-endpoint";
import { generateEndpointsMeta } from "./generator-endpoints-meta";
import { generateRouteHandlers } from "./generator-route-handlers";

/** Run the full endpoint-framework generation for this domain. */
export async function generate(
  ctx: GeneratorContext,
): Promise<GeneratorResult> {
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
}
