/**
 * Query key builder - SINGLE source of truth
 *
 * Uses ONLY: endpoint.path + endpoint.method + urlPathParams
 */

import { parseError } from "@/app/api/[locale]/shared/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

/**
 * Build cache/storage key - SINGLE implementation
 *
 * Format: prefix-path-method[-urlPathParams]
 *
 * @returns String key that can be used for:
 * - React Query cache (wrap in array: [buildKey(...)])
 * - Local storage keys (use directly: buildKey(...))
 * - Zustand store keys (use directly: buildKey(...))
 */
export function buildKey<TUrlPathParams>(
  prefix: string,
  endpoint: { readonly path: readonly string[]; readonly method: Methods },
  urlPathParams: TUrlPathParams,
  logger: EndpointLogger,
): string {
  const baseKey = `${prefix}-${endpoint.path.join("-")}-${endpoint.method}`;

  // Normalize empty objects to undefined
  if (urlPathParams === undefined || urlPathParams === null) {
    return baseKey;
  }

  // Check if it's an empty object
  if (
    typeof urlPathParams === "object" &&
    !Array.isArray(urlPathParams) &&
    Object.keys(urlPathParams).length === 0
  ) {
    return baseKey;
  }

  try {
    let serialized: string;
    if (typeof urlPathParams === "object") {
      serialized = JSON.stringify(urlPathParams);
    } else {
      serialized = String(urlPathParams);
    }
    return `${baseKey}-${serialized}`;
  } catch (error) {
    logger.error("Failed to serialize urlPathParams", parseError(error));
    return `${baseKey}-[error]`;
  }
}
