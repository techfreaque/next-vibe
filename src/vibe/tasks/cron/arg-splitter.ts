/**
 * Cron Task Arg Splitter
 * Splits merged flat args (defaultUrlPathParams + defaultConfig) into
 * urlPathParams and data using the endpoint's requestUrlPathParamsSchema.
 */

import "server-only";

import type { WidgetData } from "../../core/utils/json";

import { getEndpoint } from "@/generated/endpoints/endpoint";

/**
 * Split flat merged args into urlPathParams + data using the endpoint's
 * requestUrlPathParamsSchema. Keys that the schema recognises go to urlPathParams;
 * everything else goes to data.
 */
export async function splitTaskArgs(
  path: string,
  mergedArgs: Record<string, WidgetData>,
): Promise<{
  urlPathParams: Record<string, WidgetData>;
  data: Record<string, WidgetData>;
}> {
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
