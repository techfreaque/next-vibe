/**
 * OpenRouter provider-routing preferences for chat completions.
 *
 * Every OpenRouter chat request routes by price: OpenRouter tries the
 * cheapest host first and keeps falling back to the next one, so availability
 * stays what it was. Billing is unchanged (OpenRouter's real `usage.cost`).
 * A per-request pin (`order` / `only` already in the body) wins: price
 * sorting is then left out so the pinned order holds.
 */

import "server-only";

import type { JSONValue } from "ai";

export interface JsonRecord {
  [key: string]: JSONValue;
}

export function isJsonRecord(
  value: JSONValue | undefined,
): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Chat completion bodies carry `messages`; embeddings/images do not. */
export function isChatCompletionBody(body: JsonRecord): boolean {
  return Array.isArray(body["messages"]);
}

/** Add `provider: { sort: "price", allow_fallbacks: true }` (in place). */
export function applyPriceRouting(body: JsonRecord): void {
  const existing = body["provider"];
  const provider: JsonRecord = isJsonRecord(existing) ? { ...existing } : {};
  const pinned =
    provider["order"] !== undefined || provider["only"] !== undefined;
  if (!pinned && provider["sort"] === undefined) {
    provider["sort"] = "price";
  }
  if (provider["allow_fallbacks"] === undefined) {
    provider["allow_fallbacks"] = true;
  }
  body["provider"] = provider;
}

/** Copy of `body` that skips `host` (OpenRouter accepts the display name it reports). */
export function withIgnoredProvider(
  body: JsonRecord,
  host: string,
): JsonRecord {
  const existing = body["provider"];
  const provider: JsonRecord = isJsonRecord(existing) ? { ...existing } : {};
  const ignore = Array.isArray(provider["ignore"])
    ? provider["ignore"].filter((v): v is string => typeof v === "string")
    : [];
  if (!ignore.includes(host)) {
    ignore.push(host);
  }
  provider["ignore"] = ignore;
  return { ...body, provider };
}
