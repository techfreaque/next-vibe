/**
 * Shared utility for building React Query cache keys
 * This ensures consistency between useApiQuery and updateEndpointData
 */

import type { QueryKey } from "@tanstack/react-query";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { type Methods } from "../../../shared/enums";

type SerializableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | SerializableObject
  | SerializableValue[];

interface SerializableObject {
  [key: string]: SerializableValue;
}

/**
 * Build a stable query key for React Query cache
 * Used by both useApiQuery and updateEndpointData to ensure cache key consistency
 *
 * @param endpoint - The endpoint definition with path and method
 * @param requestData - Optional request data (query params)
 * @param urlPathParams - Optional URL path parameters
 * @param customQueryKey - Optional custom query key override
 * @param logger - Optional logger for error reporting
 * @returns A stable query key array
 */
export function buildQueryKey<TRequestData, TUrlPathParams>(
  endpoint: {
    readonly path: readonly string[];
    readonly method: Methods;
  },
  logger: EndpointLogger,
  requestData: TRequestData,
  urlPathParams: TUrlPathParams,
  customQueryKey: QueryKey,
): QueryKey {
  // If custom query key is provided, use it
  if (customQueryKey) {
    return customQueryKey;
  }

  // Auto-generate key from endpoint definition
  const defaultKey = `query-${endpoint.path.join("-")}-${endpoint.method}`;
  const endpointKey = defaultKey;

  // Create a stable representation of the request data
  let requestDataKey: string | undefined;
  if (requestData !== undefined && requestData !== null) {
    try {
      // For objects, create a stable JSON representation
      if (typeof requestData === "object") {
        // Filter out internal properties and handle circular references
        const safeRequestData = JSON.stringify(
          requestData,
          (key: string, value: SerializableValue) => {
            // Skip internal properties
            if (key.startsWith("_")) {
              return undefined;
            }
            // Handle circular references and complex objects
            if (typeof value === "object" && value !== null) {
              // Return a simplified version of objects
              const valueAsObject = value as SerializableObject;
              if (Object.keys(valueAsObject).length > 0) {
                // Create a safe representation of the object
                const safeObject: SerializableObject = {};
                // Filter and transform entries
                for (const [k, v] of Object.entries(valueAsObject)) {
                  if (!k.startsWith("_")) {
                    safeObject[k] =
                      // eslint-disable-next-line i18next/no-literal-string
                      typeof v === "function" ? "[Function]" : v;
                  }
                }
                return safeObject;
              } else {
                return value;
              }
            }
            return value;
          },
        );
        requestDataKey = safeRequestData;
      } else {
        // For primitives, use string representation
        requestDataKey = String(requestData);
      }
    } catch (err) {
      // If JSON stringification fails, use a fallback
      if (logger) {
        logger.error("Failed to stringify request data", parseError(err));
      }
      requestDataKey =
        typeof requestData === "object"
          ? Object.keys(requestData as object)
              .toSorted()
              .join(",")
          : String(requestData);
    }
  }

  // Create a stable representation of URL parameters
  let urlPathParamsKey: string | undefined;
  if (urlPathParams !== undefined && urlPathParams !== null) {
    try {
      // For objects, create a stable JSON representation
      if (typeof urlPathParams === "object") {
        // Filter out internal properties and handle circular references
        urlPathParamsKey = JSON.stringify(
          urlPathParams,
          (key: string, value: SerializableValue) => {
            // Skip internal properties
            if (key.startsWith("_")) {
              return undefined;
            }
            // Handle circular references and complex objects
            if (typeof value === "object" && value !== null) {
              // Return a simplified version of objects
              const valueAsObject = value as SerializableObject;
              if (Object.keys(valueAsObject).length > 0) {
                // Create a safe representation of the object
                const safeObject: SerializableObject = {};
                // Filter and transform entries
                for (const [k, v] of Object.entries(valueAsObject)) {
                  if (!k.startsWith("_")) {
                    safeObject[k] =
                      // eslint-disable-next-line i18next/no-literal-string
                      typeof v === "function" ? "[Function]" : v;
                  }
                }
                return safeObject;
              } else {
                return value;
              }
            }
            return value;
          },
        );
      } else {
        // For primitives, use string representation
        urlPathParamsKey = String(urlPathParams);
      }
    } catch (err) {
      // If JSON stringification fails, use a fallback
      if (logger) {
        logger.error("Failed to stringify URL parameters", parseError(err));
      }
      urlPathParamsKey =
        typeof urlPathParams === "object"
          ? Object.keys(urlPathParams as object)
              .toSorted()
              .join(",")
          : String(urlPathParams);
    }
  }

  // Return the query key built from the components
  return [endpointKey, requestDataKey, urlPathParamsKey];
}
