/**
 * Query key builder - SINGLE source of truth
 *
 * Uses: endpoint.path + endpoint.method + urlPathParams + cacheKey request fields
 */

import type { z } from "zod";

import { parseError } from "@/app/api/[locale]/shared/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { InferSchemaFromField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { FieldUsage } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import type { FormQueryParams } from "./store";

/**
 * Flatten intersection types to plain objects so conditional type checks
 * like `extends { includeInCacheKey: true }` work on intersected field configs.
 * Mirrors the Normalize helper in endpoint.ts.
 */
type Normalize<T> = { [K in keyof T]: T[K] };

/**
 * Extract the exact type of only the request fields that have includeInCacheKey: true.
 *
 * If no children have includeInCacheKey: true, resolves to `undefined`.
 * If some children have it, resolves to an object with exactly those keys and their
 * inferred RequestData types — same inference as the full RequestOutput but filtered.
 *
 * Uses Normalize<> on both the parent fields and each child so that intersection
 * types (produced by requestField etc.) are flattened before pattern matching.
 */
export type CacheKeyRequestData<TEndpoint extends CreateApiEndpointAny> =
  Normalize<TEndpoint["fields"]> extends { children: infer C }
    ? {
        [K in keyof C as Normalize<C[K]> extends { includeInCacheKey: true }
          ? K
          : never]: z.output<
          InferSchemaFromField<C[K], FieldUsage.RequestData>
        >;
      } extends infer R
      ? [keyof R] extends [never]
        ? undefined
        : R
      : undefined
    : undefined;

/**
 * Build cache/storage key - SINGLE implementation
 *
 * Format: prefix-path-method[-urlPathParams][-cacheKeyFields]
 */
export function buildKey<
  TEndpoint extends CreateApiEndpointAny,
  TUrlPathParams,
>(
  prefix: string,
  endpoint: TEndpoint,
  urlPathParams: TUrlPathParams,
  logger: EndpointLogger,
  requestData: CacheKeyRequestData<TEndpoint>,
): string {
  const baseKey = `${prefix}-${endpoint.path.join("-")}-${endpoint.method}`;

  // Build suffix parts: urlPathParams + cacheKey request fields
  const parts: string[] = [];

  // 1. urlPathParams
  if (
    urlPathParams !== undefined &&
    urlPathParams !== null &&
    !(
      typeof urlPathParams === "object" &&
      !Array.isArray(urlPathParams) &&
      Object.keys(urlPathParams as Record<string, TUrlPathParams>).length === 0
    )
  ) {
    try {
      parts.push(
        typeof urlPathParams === "object"
          ? JSON.stringify(urlPathParams)
          : String(urlPathParams),
      );
    } catch (error) {
      logger.error("Failed to serialize urlPathParams", parseError(error));
      parts.push("[error]");
    }
  }

  // 2. Request fields marked includeInCacheKey: true
  // endpoint.fields is an ObjectWidgetConfig with children (a Record of field definitions)
  if (requestData) {
    const children =
      "children" in endpoint.fields
        ? (endpoint.fields.children as Record<
            string,
            { includeInCacheKey?: boolean }
          >)
        : undefined;
    if (children) {
      const cacheKeyFields: FormQueryParams = {};
      const data = requestData as FormQueryParams;
      for (const [key, field] of Object.entries(children)) {
        if (field.includeInCacheKey && key in data) {
          cacheKeyFields[key] = data[key];
        }
      }
      if (Object.keys(cacheKeyFields).length > 0) {
        try {
          parts.push(JSON.stringify(cacheKeyFields));
        } catch (error) {
          logger.error(
            "Failed to serialize cacheKey request fields",
            parseError(error),
          );
          parts.push("[error]");
        }
      }
    }
  }

  return parts.length > 0 ? `${baseKey}-${parts.join("-")}` : baseKey;
}
