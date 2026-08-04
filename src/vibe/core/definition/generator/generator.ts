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

import { GENERATED_DIR, getApiDir } from "@/env/paths";

import type { GeneratorDefinition } from "../../generators/shared/shared-inputs";
import { findFilesRecursively } from "../../generators/shared/utils";
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
  /**
   * Only the artefacts written on EVERY successful run. The per-locale meta
   * files under endpoints/meta/ and the ws-channel registries are deliberately
   * absent: meta paths depend on the configured locales, and ws-channels is
   * realtime-gated (a build without realtime never writes it). Listing either
   * would make the existence check fail permanently and the cache never hit.
   */
  output: [
    `${GENERATED_DIR}/endpoints/endpoint.ts`,
    `${GENERATED_DIR}/endpoints/endpoint-dev.ts`,
    `${GENERATED_DIR}/endpoints/alias-map.ts`,
    `${GENERATED_DIR}/endpoints/alias-map-dev.ts`,
    `${GENERATED_DIR}/endpoints/hot-paths.ts`,
    `${GENERATED_DIR}/endpoints/hot-paths-dev.ts`,
    `${GENERATED_DIR}/routes/handlers.ts`,
    `${GENERATED_DIR}/routes/handlers-dev.ts`,
    `${GENERATED_DIR}/routes/hot-paths.ts`,
    `${GENERATED_DIR}/routes/hot-paths-dev.ts`,
    `${GENERATED_DIR}/routes/client.ts`,
    `${GENERATED_DIR}/categories/registry.ts`,
  ],
  async generate(ctx) {
    // Endpoint-registry group — fixed order (Bun TDZ safety on definition init).
    const meta = await generateEndpointsMeta(ctx);
    const endpoint = await generateEndpoint(ctx);
    const routes = await generateRouteHandlers(ctx);
    const client = await generateClientRoutes(ctx);
    const category = await generateCategoryIndex(ctx);

    const parts = [meta, endpoint, routes, client, category];

    // A sub-generator's `failed` is a hard stop (e.g. the fail-closed WS channel
    // guard check), and it has to reach the orchestrator. Aggregating only the
    // summaries swallowed it: the run was recorded as successful and markDone
    // cached the fingerprint, so the very next run skipped the gate entirely —
    // the summary string said "failed" while nothing acted on it.
    const failures = parts
      .map((p) => p.failed)
      .filter((f): f is string => f !== undefined);

    return {
      ...(failures.length > 0 ? { failed: failures.join("; ") } : {}),
      summary: parts.map((p) => p.summary).join("; "),
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
