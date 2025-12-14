/**
 * Shared utility for building React Query cache keys
 * This ensures consistency between useApiQuery and updateEndpointData
 */

import type { QueryKey } from "@tanstack/react-query";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

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
 * Type guard to check if value is SerializableObject
 */
// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Type guard: Must accept unknown to narrow any value to SerializableObject. This is the standard TypeScript pattern for type guards.
function isSerializableObject(value: unknown): value is SerializableObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof File) &&
    !(value instanceof Blob)
  );
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
  customQueryKey?: QueryKey,
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
              if (Object.keys(valueAsObject).length) {
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
      if (isSerializableObject(requestData)) {
        requestDataKey = Object.keys(requestData).toSorted().join(",");
      } else {
        requestDataKey = String(requestData);
      }
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
              if (Object.keys(valueAsObject).length) {
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
      if (isSerializableObject(urlPathParams)) {
        urlPathParamsKey = Object.keys(urlPathParams).toSorted().join(",");
      } else {
        urlPathParamsKey = String(urlPathParams);
      }
    }
  }

  // Return the query key built from the components
  return [endpointKey, requestDataKey, urlPathParamsKey];
}
