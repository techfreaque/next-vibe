/**
 * Shared arg-splitting utility
 *
 * When an AI model or MCP client calls a tool, all arguments arrive as a single
 * flat object (the intersection of requestSchema + requestUrlPathParamsSchema).
 * This utility splits them back into the two buckets the handler expects.
 *
 * Algorithm:
 *  1. Resolve toolName / alias → canonical path via getFullPath
 *  2. Load the endpoint definition via getEndpoint
 *  3. safeParse mergedArgs through requestUrlPathParamsSchema — matching keys go to urlPathParams
 *  4. Everything else goes to data
 *
 * If the endpoint cannot be resolved the entire object is passed as data (safe fallback).
 */

import {
  getEndpoint,
  getFullPath,
} from "@/app/api/[locale]/system/generated/endpoint";
import type { CliRequestData } from "@/app/api/[locale]/system/unified-interface/cli/runtime/parsing";

export interface SplitArgsResult {
  urlPathParams: CliRequestData;
  data: CliRequestData;
}

/**
 * Split a flat merged-args object into urlPathParams + data using the
 * endpoint's requestUrlPathParamsSchema.
 *
 * @param toolName - canonical path OR alias (e.g. "tool-help", "agent_search_brave_GET")
 * @param mergedArgs - flat combined args from AI / MCP
 */
export async function splitArgs(
  toolName: string,
  mergedArgs: CliRequestData,
): Promise<SplitArgsResult> {
  const path = getFullPath(toolName);
  if (path === null) {
    return { urlPathParams: {}, data: mergedArgs };
  }

  const definition = await getEndpoint(path);
  if (!definition) {
    return { urlPathParams: {}, data: mergedArgs };
  }

  const urlParseResult =
    definition.requestUrlPathParamsSchema.safeParse(mergedArgs);
  const urlPathParams: CliRequestData = urlParseResult.success
    ? (urlParseResult.data as CliRequestData)
    : {};

  const urlKeySet = new Set(Object.keys(urlPathParams));
  const data: CliRequestData = {};
  for (const [key, value] of Object.entries(mergedArgs)) {
    if (!urlKeySet.has(key)) {
      data[key] = value as CliRequestData[string];
    }
  }

  return { urlPathParams, data };
}
