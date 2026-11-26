/**
 * OpenUncensored chat provider: the request goes to api.openuncensored.com
 * with the "cheapest" routing strategy, and the real per-call cost
 * (`ou.cost_usd`, documented in openuncensored.com/agents.md) is surfaced as
 * provider metadata so the turn bills real cost x markup. No network: the
 * provider fetch is faked.
 */

import { describe, expect, it } from "bun:test";
import { generateText, streamText } from "ai";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { readStepUpstreamCost } from "../repository/loop/token-accumulator";
import { createOpenUncensored, OPENUNCENSORED_BASE_URL } from "./openuncensored";
import { readOpenUncensoredCostUsd } from "./shared/upstream-cost";

const logger = createEndpointLogger(false, defaultLocale);

interface SeenRequest {
  url: string;
  headers: Headers;
}

function fakeFetch(
  seen: SeenRequest[],
  respond: () => Response,
): typeof globalThis.fetch {
  const handler = (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    seen.push({ url: String(input), headers: new Headers(init?.headers) });
    return Promise.resolve(respond());
  };
  return Object.assign(handler, { preconnect: fetch.preconnect });
}

const USAGE = { prompt_tokens: 12, completion_tokens: 3, total_tokens: 15 };

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

  it("streaming: cost from the chunk that carries it", async () => {
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
        choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
        usage: USAGE,
        ou: { cost_usd: 0.0000188 },
      },
    ];
    const body = `${chunks
      .map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`)
      .join("")}data: [DONE]\n\n`;
    const provider = createOpenUncensored(
      logger,
      fakeFetch(
        [],
        () =>
          new Response(body, {
            headers: { "content-type": "text/event-stream" },
          }),
      ),
    );
    const result = streamText({ model: provider.chat("m"), prompt: "Hi" });
    expect(await result.text).toBe("Hi");
    expect((await result.usage).inputTokens).toBe(12);
    expect(readStepUpstreamCost(await result.providerMetadata).costUsd).toBe(
      0.0000188,
    );
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
