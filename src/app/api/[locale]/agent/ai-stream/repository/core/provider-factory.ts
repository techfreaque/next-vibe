import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { JSONValue } from "ai";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import {
  ApiProvider,
  type ModelOption,
} from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { createFreedomGPT } from "../../providers/freedomgpt";
import { createGabAI } from "../../providers/gab-ai";
import { createUncensoredAI } from "../../providers/uncensored-ai";
import { createVeniceAI } from "../../providers/venice-ai";

/**
 * Recursively sort object keys for stable JSON serialization (cache-friendly)
 * Also handles strings that contain JSON (like tool args/results)
 */
function sortObjectKeys(obj: JSONValue): JSONValue {
  if (obj === null) {
    return obj;
  }

  // Handle strings that might contain JSON
  if (typeof obj === "string") {
    // Try to parse as JSON and sort if successful
    if (
      (obj.startsWith("{") && obj.endsWith("}")) ||
      (obj.startsWith("[") && obj.endsWith("]"))
    ) {
      try {
        const parsed = JSON.parse(obj) as JSONValue;
        const sorted = sortObjectKeys(parsed);
        return JSON.stringify(sorted);
      } catch {
        // Not valid JSON, return as-is
        return obj;
      }
    }
    return obj;
  }

  if (typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  const sorted: Record<string, JSONValue> = {};
  for (const key of Object.keys(obj).toSorted()) {
    const value = obj[key];
    if (value !== undefined) {
      sorted[key] = sortObjectKeys(value);
    }
  }
  return sorted;
}

export class ProviderFactory {
  static getProviderForModel(
    modelOption: ModelOption,
    logger: EndpointLogger,
  ): ReturnType<
    | typeof createOpenRouter
    | typeof createUncensoredAI
    | typeof createFreedomGPT
    | typeof createGabAI
    | typeof createVeniceAI
  > {
    switch (modelOption.apiProvider) {
      case ApiProvider.UNCENSORED_AI:
        return createUncensoredAI(logger);

      case ApiProvider.FREEDOMGPT:
        return createFreedomGPT(logger);

      case ApiProvider.GAB_AI:
        return createGabAI(logger);

      case ApiProvider.VENICE_AI:
        return createVeniceAI(logger);

      default: {
        // Custom fetch wrapper that normalizes request body for stable caching
        const customFetch = async (
          url: string | Request | URL,
          options?: RequestInit,
        ): Promise<Response> => {
          // Sort all object keys in request body for stable caching
          let normalizedBody = options?.body;
          if (options?.body && typeof options.body === "string") {
            const parsed = JSON.parse(options.body) as JSONValue;

            // 1. Inject cache_control to last tool for Anthropic prompt caching
            // AI SDK doesn't support tool-level cache_control, so we inject it here
            if (
              parsed &&
              typeof parsed === "object" &&
              !Array.isArray(parsed) &&
              "tools" in parsed &&
              Array.isArray(parsed.tools) &&
              parsed.tools.length > 0
            ) {
              const tools = parsed.tools as Array<Record<string, JSONValue>>;
              const lastTool = tools[tools.length - 1];

              if (lastTool && typeof lastTool === "object") {
                lastTool.cache_control = {
                  type: "ephemeral",
                  ttl: "1h",
                };
              }
            }

            // 2. Inject cache_control with strategic breakpoints for 20-block lookback
            // Strategy: 3 fixed markers every ~20 messages + 1 moving marker on last message
            // This handles Anthropic's 20-block lookback limit (max 4 markers total)
            if (
              parsed &&
              typeof parsed === "object" &&
              !Array.isArray(parsed) &&
              "messages" in parsed &&
              Array.isArray(parsed.messages) &&
              parsed.messages.length > 0
            ) {
              const messages = parsed.messages as Array<
                Record<string, JSONValue>
              >;

              // Remove ALL cache_control from messages (clean slate)
              for (const msg of messages) {
                if (msg && typeof msg === "object" && "cache_control" in msg) {
                  delete msg.cache_control;
                }
              }

              const cacheControl = {
                type: "ephemeral" as const,
                ttl: "1h" as const,
              };

              // Marker 1: Position 0 (system prompt) - ALWAYS
              if (messages[0] && typeof messages[0] === "object") {
                messages[0].cache_control = cacheControl;
                logger.info(
                  "[CACHE DEBUG] Injected cache_control at position 0 (system)",
                  {},
                );
              }

              // Marker 2: Position ~20 (bridge for 20-block lookback)
              // Only add if we have 30+ messages
              if (
                messages.length > 30 &&
                messages[20] &&
                typeof messages[20] === "object"
              ) {
                messages[20].cache_control = cacheControl;
                logger.info(
                  "[CACHE DEBUG] Injected cache_control at position 20 (bridge)",
                  {},
                );
              }

              // Marker 3: Position ~40 (bridge for longer conversations)
              // Only add if we have 50+ messages
              if (
                messages.length > 50 &&
                messages[40] &&
                typeof messages[40] === "object"
              ) {
                messages[40].cache_control = cacheControl;
                logger.info(
                  "[CACHE DEBUG] Injected cache_control at position 40 (bridge)",
                  {},
                );
              }

              // Marker 4: LAST message (moving marker) - ALWAYS
              const lastIdx = messages.length - 1;
              const lastMessage = messages[lastIdx];
              if (lastMessage && typeof lastMessage === "object") {
                lastMessage.cache_control = cacheControl;
              }
            }

            const sorted = sortObjectKeys(parsed);
            normalizedBody = JSON.stringify(sorted);
          }

          return fetch(url, { ...options, body: normalizedBody });
        };

        return createOpenRouter({
          apiKey: agentEnv.OPENROUTER_API_KEY,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- OpenRouter expects typeof fetch but we need custom wrapper
          fetch: customFetch as any,
        });
      }
    }
  }
}
