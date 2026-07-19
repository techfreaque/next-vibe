/**
 * Query key builder - SINGLE source of truth
 *
 * Uses: endpoint.path + endpoint.method + urlPathParams + cacheKey request fields
 */

import type { InferSchemaFromField } from "next-vibe/core/definition/endpoint";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { FieldUsage } from "next-vibe/core/definition/enums";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { z } from "zod";

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
 * inferred RequestData types - same inference as the full RequestOutput but filtered.
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
 * The record of cache-key request fields. Values are the scalars (optionally
 * null/undefined for nullish fields, and readonly scalar arrays such as a
 * multi-select `threadIds`) that an `includeInCacheKey` field can hold — exactly
 * what `buildKey` JSON-stringifies into the key.
 */
type CacheKeyScalar = string | number | boolean;
export type CacheKeyParamValue =
  | CacheKeyScalar
  | null
  | undefined
  | readonly CacheKeyScalar[];
export interface CacheKeyParams {
  readonly [key: string]: CacheKeyParamValue;
}

function isCacheKeyScalar(value: WidgetData): value is CacheKeyScalar {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

/**
 * Reduce a loose record to the cache-key param shape: keep scalars, null, and
 * arrays of scalars (the values an includeInCacheKey field can hold); drop
 * anything else. Used wherever a wire/runtime record must be presented as the
 * CacheKeyParams a channel is keyed on — the client subscribe descriptor and the
 * remote-event bridge's resolveChannel call — so both build the SAME key.
 */
export function toCacheKeyParams(
  record: Readonly<Record<string, WidgetData>>,
): CacheKeyParams {
  const out: Record<string, CacheKeyParamValue> = {};
  for (const [key, value] of Object.entries(record)) {
    if (isCacheKeyScalar(value) || value === null) {
      out[key] = value;
    } else if (Array.isArray(value) && value.every(isCacheKeyScalar)) {
      out[key] = value;
    }
  }
  return out;
}

/**
 * The honest INPUT type for buildKey/buildWsChannel: the endpoint's exact
 * cache-key fields when it declares any, otherwise the flat cache-key record.
 * `CacheKeyRequestData` alone narrows the no-fields / type-erased case to
 * `undefined`, but the builders read any flat record — so callers (notably the WS
 * channel descriptor at the CreateApiEndpointAny boundary) can pass a real record
 * with no cast. For concrete endpoints with cache-key fields this is exactly
 * `CacheKeyRequestData<TEndpoint>`.
 */
export type CacheKeyRequestInput<TEndpoint extends CreateApiEndpointAny> = [
  CacheKeyRequestData<TEndpoint>,
] extends [undefined]
  ? CacheKeyParams | undefined
  : CacheKeyRequestData<TEndpoint>;

/**
 * Build cache/storage key - SINGLE implementation
 *
 * Format: prefix-path-method[-urlPathParams][-cacheKeyFields]
 */
export function buildKey<TEndpoint extends CreateApiEndpointAny>(
  prefix: string,
  endpoint: TEndpoint,
  urlPathParams: TEndpoint["types"]["UrlVariablesOutput"],
  logger: EndpointLogger,
  requestData: CacheKeyRequestInput<TEndpoint>,
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
      Object.keys(urlPathParams as TEndpoint["types"]["UrlVariablesOutput"])
        .length === 0
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
        // Absent, undefined and null are all the SAME "not keyed" state — they
        // must produce identical keys. `{subFolderId: undefined}` serializing
        // differently from `{}` split the WS channel between subscriber and
        // emitter, silently dropping every event on that channel.
        if (
          field.includeInCacheKey &&
          data[key] !== undefined &&
          data[key] !== null
        ) {
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
