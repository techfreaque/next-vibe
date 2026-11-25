import { describe, expect, it, spyOn } from "bun:test";
import {
  ChatModelId,
  chatModelOptionsPool,
} from "next-vibe/agent/ai-stream/models";
import * as fixtureTransport from "next-vibe/agent/ai-stream/testing/fetch-cache";
import { agentEnv } from "next-vibe/agent/env";
import { ApiProvider } from "next-vibe/agent/models/models";
import { rootlessToolExecutionContext } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import {
  anthropicMessageSchema,
  anthropicSystemSchema,
  anthropicToolSchema,
} from "./messages/schema";
import {
  convertAnthropicMessages,
  convertAnthropicTools,
} from "./messages/translate";
import { aiSdkRunner } from "./shared/inference";

describe("public API prompt caching on the provider wire", () => {
  it("preserves explicit breakpoints and leaves an unmarked prompt eligible for automatic caching", async () => {
    const model = chatModelOptionsPool.find(
      (option) =>
        option.id === ChatModelId.CLAUDE_SONNET_5_5 &&
        option.apiProvider === ApiProvider.OPENROUTER,
    );
    expect(model).toBeDefined();
    if (!model) {
      return;
    }
    const bodies: string[] = [];
    const transport = spyOn(
      fixtureTransport,
      "createFixtureFetch",
    ).mockReturnValue(
      Object.assign(
        (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
          const url = input instanceof Request ? input.url : String(input);
          expect(new URL(url).pathname).toBe("/api/v1/chat/completions");
          bodies.push(typeof init?.body === "string" ? init.body : "");
          return Promise.resolve(
            Response.json({
              id: "synthetic-cache",
              model: model.providerModel,
              created: 1,
              choices: [
                {
                  index: 0,
                  message: { role: "assistant", content: "ok" },
                  finish_reason: "stop",
                },
              ],
              usage: {
                prompt_tokens: 1000,
                completion_tokens: 5,
                total_tokens: 1005,
                prompt_tokens_details: {
                  cached_tokens: 600,
                  cache_write_tokens: 200,
                },
                cost: 0.002,
                cache_discount: 0.001,
              },
            }),
          );
        },
        { preconnect: (): void => undefined },
      ),
    );
    const marker = { type: "ephemeral", ttl: "1h" } as const;
    const originalKey = agentEnv.OPENROUTER_API_KEY;
    try {
      agentEnv.OPENROUTER_API_KEY = "fixture-only";
      for (const mode of ["blocks", "automatic", "top-level"]) {
        const useCache = mode === "blocks";
        const hint = useCache ? { cache_control: marker } : {};
        const tools = [
          anthropicToolSchema.parse({
            name: "shared",
            input_schema: { type: "object", properties: {} },
            ...hint,
          }),
          anthropicToolSchema.parse({
            name: "other",
            input_schema: { type: "object", properties: {} },
          }),
        ];
        const parts = convertAnthropicMessages({
          system: anthropicSystemSchema.parse([
            { type: "text", text: "system", ...hint },
          ]),
          messages: [
            anthropicMessageSchema.parse({
              role: "user",
              content: [
                { type: "text", text: "shared text", ...hint },
                { type: "text", text: "suffix" },
              ],
            }),
            anthropicMessageSchema.parse({
              role: "assistant",
              content: [
                { type: "text", text: "answer", ...hint },
                { type: "text", text: "tail" },
              ],
            }),
            anthropicMessageSchema.parse({ role: "user", content: "continue" }),
          ],
          tools,
        });
        expect(parts.ok).toBe(true);
        if (!parts.ok) {
          return;
        }
        const result = await aiSdkRunner.generate({
          model,
          messages: parts.messages,
          cacheControl: mode === "top-level" ? marker : undefined,
          temperature: undefined,
          topP: undefined,
          maxOutputTokens: 16,
          stopSequences: undefined,
          abortSignal: undefined,
          tools: convertAnthropicTools(tools),
          toolChoice: undefined,
          logger: createEndpointLogger(false, defaultLocale),
          toolExecutionContext: rootlessToolExecutionContext(),
        });
        expect(result.usage).toMatchObject({
          inputTokens: 1000,
          cachedInputTokens: 600,
          cacheWriteTokens: 200,
          hourWriteTokens: mode === "automatic" ? 0 : 200,
        });
      }
      const marked = bodies[0] ?? "";
      expect(marked.match(/"cache_control"/g)).toHaveLength(4);
      expect(JSON.parse(marked)).toMatchObject({
        tools: [
          { function: { name: "shared" }, cache_control: marker },
          { function: { name: "other" } },
        ],
        messages: [
          {
            role: "system",
            content: [{ text: "system", cache_control: marker }],
          },
          {
            role: "user",
            content: [
              { text: "shared text", cache_control: marker },
              { text: "suffix" },
            ],
          },
          {
            role: "assistant",
            content: [
              { text: "answer", cache_control: marker },
              { text: "tail" },
            ],
          },
          { role: "user" },
        ],
      });
      expect(JSON.parse(bodies[2] ?? "{}")).toMatchObject({
        cache_control: marker,
      });
      expect(bodies[1]).not.toContain('"cache_control"');
    } finally {
      agentEnv.OPENROUTER_API_KEY = originalKey;
      transport.mockRestore();
    }
  });
});
