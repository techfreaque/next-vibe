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

import type { ClientPromptCache } from "../shared/prompt-cache";

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

/** Both SDK adapters flatten assistant text and omit function-tool cache markers. */
export function applyClientCache(
  body: JsonRecord,
  cache: ClientPromptCache,
): void {
  if (cache.control) {
    body.cache_control = cache.control;
  }
  if (Array.isArray(body.tools)) {
    for (const entry of body.tools) {
      if (
        isJsonRecord(entry) &&
        isJsonRecord(entry.function) &&
        typeof entry.function.name === "string"
      ) {
        const control = cache.tools.get(entry.function.name);
        if (control) {
          entry.cache_control = control;
        }
      }
    }
  }
  if (!Array.isArray(body.messages)) {
    return;
  }
  const system = cache.messages.filter((message) => message.role === "system");
  const users = cache.messages.filter((message) => message.role === "user");
  let systemIndex = 0;
  let userIndex = 0;
  for (const message of body.messages) {
    if (!isJsonRecord(message)) {
      continue;
    }
    const original =
      message.role === "system" || message.role === "developer"
        ? system[systemIndex++]
        : message.role === "user"
          ? users[userIndex++]
          : undefined;
    if (!original) {
      continue;
    }
    const parts = original.content;
    const messageControl = original.providerOptions?.openrouter?.cacheControl;
    if (typeof message.content === "string") {
      const control =
        messageControl ||
        (Array.isArray(parts) && parts.length === 1
          ? parts[0]?.providerOptions?.openrouter?.cacheControl
          : undefined);
      if (control) {
        message.content = [
          { type: "text", text: message.content, cache_control: control },
        ];
        delete message.cache_control;
      }
    } else if (Array.isArray(message.content) && Array.isArray(parts)) {
      for (const [index, wire] of message.content.entries()) {
        const control = parts[index]?.providerOptions?.openrouter?.cacheControl;
        if (isJsonRecord(wire) && control) {
          wire.cache_control = control;
        }
      }
    }
  }
  const assistants = cache.messages.filter(
    (message) => message.role === "assistant",
  );
  let index = 0;
  for (const message of body.messages) {
    if (!isJsonRecord(message) || message.role !== "assistant") {
      continue;
    }
    const parts = assistants[index++]?.content;
    if (!Array.isArray(parts)) {
      continue;
    }
    const textParts = parts.filter((part) => part.type === "text");
    if (
      textParts.some(
        (part) => part.providerOptions?.openrouter?.cacheControl,
      ) &&
      message.content === textParts.map((part) => part.text).join("")
    ) {
      message.content = textParts.map((part) => {
        const control = part.providerOptions?.openrouter?.cacheControl;
        return {
          type: "text",
          text: part.text,
          ...(control ? { cache_control: control } : {}),
        };
      });
    }
    if (Array.isArray(message.tool_calls)) {
      for (const call of message.tool_calls) {
        if (isJsonRecord(call)) {
          const part = parts.find(
            (candidate) =>
              candidate.type === "tool-call" &&
              candidate.toolCallId === call.id,
          );
          const control =
            part?.type === "tool-call"
              ? part.providerOptions?.openrouter?.cacheControl
              : undefined;
          if (control) {
            call.cache_control = control;
          }
        }
      }
    }
  }
}
