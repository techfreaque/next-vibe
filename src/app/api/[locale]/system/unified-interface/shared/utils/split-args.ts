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
 *  3. safeParse mergedArgs through requestUrlPathParamsSchema - matching keys go to urlPathParams
 *  4. Everything else goes to data
 *
 * If the endpoint cannot be resolved the entire object is passed as data (safe fallback).
 */

import { getEndpoint } from "@/app/api/[locale]/system/generated/endpoint";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";

import { getFullPath } from "./path";

export interface SplitArgsResult {
  urlPathParams: Record<string, WidgetData>;
  data: Record<string, WidgetData>;
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
  mergedArgs: Record<string, WidgetData>,
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
  const urlPathParams: Record<string, WidgetData> = urlParseResult.success
    ? (urlParseResult.data as Record<string, WidgetData>)
    : {};

  const urlKeySet = new Set(Object.keys(urlPathParams));
  const data: Record<string, WidgetData> = {};
  for (const [key, value] of Object.entries(mergedArgs)) {
    if (!urlKeySet.has(key)) {
      data[key] = value;
    }
  }

  return { urlPathParams, data };
}
