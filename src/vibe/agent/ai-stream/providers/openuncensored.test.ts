/**
 * OpenUncensored chat provider: the request goes to api.openuncensored.com
 * with the "cheapest" routing strategy. Non-streaming uses the provider's
 * reported cost. Streaming uses the final usage and serving host's tariff.
 */

import { describe, expect, it } from "bun:test";
import { generateText, streamText, tool } from "ai";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { z } from "zod";

import { OPENUNCENSORED_BASE_URL } from "../../models/model-prices/providers/openuncensored";
import { ApiProvider, upstreamCostToCredits } from "../../models/models";
import { ChatModelId, chatModelOptionsPool } from "../models";
import {
  readStepUpstreamCost,
  TokenAccumulator,
} from "../repository/loop/token-accumulator";
import { createOpenUncensored } from "./openuncensored";
import { readOpenUncensoredCostUsd } from "./shared/upstream-cost";

const logger = createEndpointLogger(false, defaultLocale);

interface SeenRequest {
  url: string;
  headers: Headers;
  body: BodyInit | null | undefined;
}

function fakeFetch(
  seen: SeenRequest[],
  respond: (request: SeenRequest) => Response,
): typeof globalThis.fetch {
  const handler = (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const request = {
      url: String(input),
      headers: new Headers(init?.headers),
      body: init?.body,
    };
    seen.push(request);
    return Promise.resolve(respond(request));
  };
  return Object.assign(handler, { preconnect: fetch.preconnect });
}

const USAGE = { prompt_tokens: 12, completion_tokens: 3, total_tokens: 15 };
const BILLING_ROUTE = chatModelOptionsPool.find(
  (option) =>
    option.id === ChatModelId.GLM_5_3_UNCENSORED &&
    option.apiProvider === ApiProvider.OPENUNCENSORED,
);

describe("readOpenUncensoredCostUsd", () => {
  it("reads ou.cost_usd, ignores missing or zero costs", () => {
    expect(readOpenUncensoredCostUsd({ ou: { cost_usd: 0.000021 } })).toBe(
      0.000021,
    );
    expect(readOpenUncensoredCostUsd({ ou: { cost_usd: 0 } })).toBeNull();
    expect(readOpenUncensoredCostUsd({ ou: { model: "x" } })).toBeNull();
    expect(readOpenUncensoredCostUsd({ usage: USAGE })).toBeNull();
    expect(readOpenUncensoredCostUsd("nope")).toBeNull();
  });
});

describe("OpenUncensored chat model", () => {
  it("non-streaming: cheapest strategy header and real cost", async () => {
    const seen: SeenRequest[] = [];
    const provider = createOpenUncensored(
      logger,
      fakeFetch(seen, () =>
        Response.json({
          id: "chatcmpl-1",
          object: "chat.completion",
          created: 1,
          model: "glm-5.3-uncensored",
          choices: [
            {
              index: 0,
              message: { role: "assistant", content: "Hi" },
              finish_reason: "stop",
            },
          ],
          usage: USAGE,
          ou: { model: "glm-5.3-uncensored", cost_usd: 0.000021 },
        }),
      ),
    );
    const result = await generateText({
      model: provider.chat("glm-5.3-uncensored"),
      prompt: "Say hi",
    });
    expect(result.text).toBe("Hi");
    expect(seen[0]?.url).toBe(`${OPENUNCENSORED_BASE_URL}/chat/completions`);
    expect(seen[0]?.headers.get("x-ou-strategy")).toBe("cheapest");
    expect(readStepUpstreamCost(result.providerMetadata).costUsd).toBe(
      0.000021,
    );
  });

  it("streams usage and bills the host that served the response", async () => {
    const seen: SeenRequest[] = [];
    const chunks = [
      {
        id: "c",
        object: "chat.completion.chunk",
        created: 1,
        model: "m",
        choices: [{ index: 0, delta: { content: "Hi" } }],
      },
      {
        id: "c",
        object: "chat.completion.chunk",
        created: 1,
        model: "m",
        choices: [
          {
            index: 0,
            delta: {
              tool_calls: [
                {
                  index: 0,
                  id: "call_1",
                  type: "function",
                  function: { name: "lookup", arguments: "{}" },
                },
              ],
            },
            finish_reason: "tool_calls",
          },
        ],
      },
      {
        choices: [],
        usage: {
          ...USAGE,
          prompt_tokens_details: { cached_tokens: 2 },
        },
      },
    ];
    const body = `${chunks
      .map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`)
      .join("")}data: [DONE]\n\n`;
    const provider = createOpenUncensored(
      logger,
      fakeFetch(seen, ({ url }) =>
        url.endsWith("/chat/completions")
          ? new Response(body, {
              headers: {
                "content-type": "text/event-stream",
                "X-OU-Model": "glm-5.3-uncensored",
                "X-OU-Provider": "served-host",
              },
            })
          : Response.json({
              id: "glm-5.3-uncensored",
              providers: [
                {
                  name: "cheapest-host",
                  status: "online",
                  pricing: { input_per_mtok: 0.1, output_per_mtok: 0.2 },
                },
                {
                  name: "served-host",
                  status: "degraded",
                  pricing: {
                    input_per_mtok: 1,
                    output_per_mtok: 2,
                    cache_read_per_mtok: 0.25,
                  },
                },
              ],
            }),
      ),
    );
    const result = streamText({
      model: provider.chat("requested-alias"),
      prompt: "Hi",
      tools: { lookup: tool({ inputSchema: z.object({}) }) },
    });
    expect(await result.text).toBe("Hi");
    expect(await result.toolCalls).toMatchObject([{ toolName: "lookup" }]);
    expect((await result.usage).inputTokens).toBe(12);
    const requestBody = seen[0]?.body;
    expect(
      typeof requestBody === "string" ? JSON.parse(requestBody) : null,
    ).toMatchObject({ stream: true, stream_options: { include_usage: true } });
    expect(seen[1]?.url).toBe(
      `${OPENUNCENSORED_BASE_URL}/models/glm-5.3-uncensored`,
    );
    expect(seen[1]?.headers.has("authorization")).toBe(false);

    const metadata = await result.providerMetadata;
    const upstream = readStepUpstreamCost(metadata);
    expect(upstream.provider).toBe("served-host");
    const costUsd = (10 * 1 + 2 * 0.25 + 3 * 2) / 1_000_000;
    expect(upstream.costUsd).toBeCloseTo(costUsd, 12);

    if (!BILLING_ROUTE) {
      expect.unreachable("missing OpenUncensored GLM 5.3 route");
    }
    const charge = TokenAccumulator.chargeSingleCall(
      BILLING_ROUTE,
      {
        inputTokens: 12,
        outputTokens: 3,
        cachedInputTokens: 2,
        cacheWriteTokens: 0,
      },
      metadata,
      logger,
    );
    expect(charge.credits).toBe(upstreamCostToCredits(costUsd));
    expect(charge.credits).toBeGreaterThan(0);
    expect(charge.upstreamCost).toMatchObject({
      billingBasis: "upstream_cost",
      upstreamProvider: "served-host",
    });
  });

  it("keeps delivered text billable when the usage chunk is missing", async () => {
    if (!BILLING_ROUTE) {
      expect.unreachable("missing OpenUncensored GLM 5.3 route");
    }
    const chunk = {
      choices: [{ index: 0, delta: { content: "Hi" }, finish_reason: "stop" }],
    };
    const provider = createOpenUncensored(
      logger,
      fakeFetch(
        [],
        () =>
          new Response(`data: ${JSON.stringify(chunk)}\n\ndata: [DONE]\n\n`, {
            headers: { "content-type": "text/event-stream" },
          }),
      ),
    );
    const result = streamText({
      model: provider.chat(BILLING_ROUTE.providerModel),
      prompt: "Hi",
    });
    expect(await result.text).toBe("Hi");
    const usage = await result.usage;
    const metadata = await result.providerMetadata;
    expect(usage.outputTokens).toBe(1);
    expect(readStepUpstreamCost(metadata).reportedUsage).toMatchObject({
      estimatedOutput: true,
    });

    const charge = TokenAccumulator.chargeSingleCall(
      BILLING_ROUTE,
      {
        inputTokens: usage.inputTokens ?? 0,
        outputTokens: usage.outputTokens ?? 0,
        cachedInputTokens: 0,
        cacheWriteTokens: 0,
      },
      metadata,
      logger,
    );
    expect(charge.credits).toBeGreaterThan(0);
  });

  it("non-streaming without ou.cost_usd: bills serving host from response headers", async () => {
    const seen: SeenRequest[] = [];
    const provider = createOpenUncensored(
      logger,
      fakeFetch(seen, ({ url }) =>
        url.endsWith("/chat/completions")
          ? Response.json(
              {
                id: "chatcmpl-host-1",
                object: "chat.completion",
                created: 1,
                model: "deepseek-v4.1-flash-uncensored",
                choices: [
                  {
                    index: 0,
                    message: { role: "assistant", content: "Described." },
                    finish_reason: "stop",
                  },
                ],
                usage: USAGE,
              },
              {
                headers: {
                  "X-OU-Model": "deepseek-v4.1-flash-uncensored",
                  "X-OU-Provider": "self-hosted-deepseek",
                },
              },
            )
          : Response.json({
              id: "deepseek-v4.1-flash-uncensored",
              providers: [
                {
                  name: "self-hosted-deepseek",
                  status: "online",
                  pricing: {
                    input_per_mtok: 0.28,
                    output_per_mtok: 1.12,
                    cache_read_per_mtok: 0.007,
                  },
                },
              ],
            }),
      ),
    );
    const result = await generateText({
      model: provider.chat("deepseek-v4.1-flash-uncensored"),
      prompt: "Describe image",
    });
    const upstream = readStepUpstreamCost(result.providerMetadata);
    expect(upstream.provider).toBe("self-hosted-deepseek");
    expect(upstream.costUsd).toBeCloseTo((12 * 0.28 + 3 * 1.12) / 1_000_000, 12);
  });

  it("no reported cost: listed-price fallback (no cost metadata)", async () => {
    const provider = createOpenUncensored(
      logger,
      fakeFetch([], () =>
        Response.json({
          id: "chatcmpl-2",
          object: "chat.completion",
          created: 1,
          model: "m",
          choices: [
            {
              index: 0,
              message: { role: "assistant", content: "Hi" },
              finish_reason: "stop",
            },
          ],
          usage: USAGE,
        }),
      ),
    );
    const result = await generateText({
      model: provider.chat("m"),
      prompt: "Hi",
    });
    expect(readStepUpstreamCost(result.providerMetadata).costUsd).toBeNull();
  });
});
