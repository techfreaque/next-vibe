/**
 * AI provider factory — resolves the correct provider client for a model,
 * binding the fixture record/replay fetch and injecting Anthropic prompt-cache
 * breakpoints on the OpenRouter path.
 * (Client-safe constants stay in ./constants.ts — widgets import them.)
 */

import "server-only";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { JSONValue } from "ai";
import type { ToolExecutionContext } from "../../../../core/execution-context";
import { agentEnv } from "../../../env";
import type { EndpointLogger } from "next-vibe/logger/types";

import { ApiProvider, type ModelOptionBase } from "../../../models/models";
import { createClaudeCode } from "../../providers/claude-code";
import { createFreedomGPT } from "../../providers/freedomgpt";
import { createGabAI } from "../../providers/gab-ai";
import { logProviderRequest } from "../../providers/shared/debug-file-logger";
import { createUncensoredAI } from "../../providers/uncensored-ai";
import { createVeniceAI } from "../../providers/venice-ai";
import { createFixtureFetch } from "../../testing/fetch-cache";
import { sortObjectKeysPreservingStrings } from "../loop/helpers";

export class ProviderFactory {
  static getProviderForModel(
    modelOption: ModelOptionBase,
    logger: EndpointLogger,
    /**
     * Fixture record/replay context of the execution chain (tests only) —
     * bound ONCE here into the provider's fetch. Absent = plain live fetch.
     */
    toolExecutionContext: ToolExecutionContext,
  ): ReturnType<
    | typeof createOpenRouter
    | typeof createUncensoredAI
    | typeof createFreedomGPT
    | typeof createGabAI
    | typeof createVeniceAI
    | typeof createClaudeCode
  > {
    const fetchImpl = createFixtureFetch(toolExecutionContext, logger);
    switch (modelOption.apiProvider) {
      case ApiProvider.CLAUDE_CODE:
        return createClaudeCode(logger, undefined, toolExecutionContext);

      case ApiProvider.UNCENSORED_AI:
        return createUncensoredAI(logger, fetchImpl);

      case ApiProvider.FREEDOMGPT:
        return createFreedomGPT(logger, fetchImpl);

      case ApiProvider.GAB_AI:
        return createGabAI(logger, fetchImpl);

      case ApiProvider.VENICE_AI:
        return createVeniceAI(logger, fetchImpl);

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

              // Anthropic allows max 4 cache_control blocks total.
              // The system prompt already gets one via providerOptions (loop.ts).
              // Plus the last tool gets one above. That's 2 already.
              // We add at most 2 more on messages here.

              // Marker 1: Position ~20 (bridge for 20-block lookback)
              // Only add if we have 30+ messages
              if (
                messages.length > 30 &&
                messages[20] &&
                typeof messages[20] === "object"
              ) {
                messages[20].cache_control = cacheControl;
              }

              // Marker 2: LAST message (moving marker) - ALWAYS
              const lastIdx = messages.length - 1;
              const lastMessage = messages[lastIdx];
              if (lastMessage && typeof lastMessage === "object") {
                lastMessage.cache_control = cacheControl;
              }
            }

            const sorted = sortObjectKeysPreservingStrings(parsed);
            normalizedBody = JSON.stringify(sorted);
          }

          logProviderRequest(
            "openrouter",
            (normalizedBody as string) ?? "null",
          );

          return fetchImpl(url, { ...options, body: normalizedBody });
        };

        return createOpenRouter({
          apiKey: agentEnv.OPENROUTER_API_KEY,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- OpenRouter expects typeof fetch but we need custom wrapper
          fetch: customFetch as any,
          headers: {
            "HTTP-Referer": "https://unbottled.ai",
            "X-Title": "Unbottled AI",
            "X-OpenRouter-Categories": "general-chat,roleplay,personal-agent",
          },
        });
      }
    }
  }
}
