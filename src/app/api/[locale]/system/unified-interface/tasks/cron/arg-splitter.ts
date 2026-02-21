/**
 * Cron Task Arg Splitter
 * Splits merged flat args (defaultUrlPathParams + defaultConfig) into
 * urlPathParams and data using the endpoint's requestUrlPathParamsSchema.
 */

import "server-only";

import { getEndpoint } from "@/app/api/[locale]/system/generated/endpoint";

import type { JsonValue } from "../unified-runner/types";

/**
 * Split flat merged args into urlPathParams + data using the endpoint's
 * requestUrlPathParamsSchema. Keys that the schema recognises go to urlPathParams;
 * everything else goes to data.
 */
export async function splitTaskArgs(
  path: string,
  mergedArgs: Record<string, JsonValue>,
): Promise<{
  urlPathParams: Record<string, JsonValue>;
  data: Record<string, JsonValue>;
}> {
  const definition = await getEndpoint(path);
  if (!definition) {
    return { urlPathParams: {}, data: mergedArgs };
  }

  const urlParseResult =
    definition.requestUrlPathParamsSchema.safeParse(mergedArgs);
  const urlPathParams: Record<string, JsonValue> = urlParseResult.success
    ? (urlParseResult.data as Record<string, JsonValue>)
    : {};

  const urlKeySet = new Set(Object.keys(urlPathParams));
  const data: Record<string, JsonValue> = {};
  for (const [key, value] of Object.entries(mergedArgs)) {
    if (!urlKeySet.has(key)) {
      data[key] = value;
    }
  }

  return { urlPathParams, data };
}
