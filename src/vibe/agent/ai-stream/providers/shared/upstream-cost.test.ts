/**
 * NanoGPT and Venice report the real charge of every chat call (NanoGPT:
 * `x_nanogpt_pricing.costUsd` / `usage.cost`, Venice: `cost.usd`), on the
 * JSON body and on the last stream chunk. The providers must surface it as
 * provider metadata so the turn bills real cost x markup (readStepUpstreamCost).
 * Response shapes are the live ones captured 2026-11-17. No network: the
 * provider fetch is faked.
 */

import { describe, expect, it, spyOn } from "bun:test";
import { generateText, streamText } from "ai";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { readStepUpstreamCost } from "../../repository/loop/token-accumulator";
import { createNanoGPT } from "../nano-gpt";
import { createVeniceAI } from "../venice-ai";
import { readNanoGptCostUsd, readVeniceCostUsd } from "./upstream-cost";

const logger = createEndpointLogger(false, defaultLocale);

const NANO_USAGE = {
  prompt_tokens: 14,
  completion_tokens: 14,
  total_tokens: 28,
  cost: 0.000014,
  currency: "USD",
};
const NANO_PRICING = {
  amount: 0.000014,
  currency: "USD",
  cost: 0.000014,
  costUsd: 0.000014,
};

function fakeFetch(
  respond: (body: string) => Response,
): typeof globalThis.fetch {
  const handler = (
    _input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> =>
    Promise.resolve(
      respond(typeof init?.body === "string" ? init.body : "{}"),
    );
  return Object.assign(handler, { preconnect: fetch.preconnect });
}

function json(body: object): Response {
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
  });
}

function sse(chunks: readonly object[]): Response {
  const text = `${chunks
    .map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`)
    .join("")}data: [DONE]\n\n`;
  return new Response(text, {
    headers: { "content-type": "text/event-stream" },
  });
}

describe("cost readers", () => {
  it("NanoGPT: x_nanogpt_pricing first, usage.cost as fallback", () => {
    expect(
      readNanoGptCostUsd({ x_nanogpt_pricing: NANO_PRICING, usage: NANO_USAGE }),
    ).toBe(0.000014);
    expect(readNanoGptCostUsd({ usage: NANO_USAGE })).toBe(0.000014);
    expect(
      readNanoGptCostUsd({ usage: { cost: 0.2, currency: "EUR" } }),
    ).toBeNull();
    expect(readNanoGptCostUsd({ usage: { prompt_tokens: 1 } })).toBeNull();
    expect(readNanoGptCostUsd({ usage: { cost: 0 } })).toBeNull();
    expect(readNanoGptCostUsd("nope")).toBeNull();
  });

  it("Venice: cost.usd, none when paid in DIEM (usd 0)", () => {
    expect(readVeniceCostUsd({ cost: { usd: 0.0003238, diem: 0 } })).toBe(
      0.0003238,
    );
    expect(readVeniceCostUsd({ cost: { usd: 0, diem: 0.01 } })).toBeNull();
    expect(readVeniceCostUsd({ usage: { prompt_tokens: 1 } })).toBeNull();
  });
});

describe("NanoGPT chat model surfaces the real cost", () => {
  it("non-streaming", async () => {
    const provider = createNanoGPT(
      logger,
      fakeFetch(() =>
        json({
          id: "chatcmpl-1",
          object: "chat.completion",
          created: 1,
          model: "z-ai/glm-5.3-flash-uncensored",
          choices: [
            {
              index: 0,
              message: { role: "assistant", content: "Hi" },
              finish_reason: "stop",
            },
          ],
          usage: NANO_USAGE,
          x_nanogpt_pricing: NANO_PRICING,
        }),
      ),
    );
    const result = await generateText({
      model: provider.chat("z-ai/glm-5.3-flash-uncensored"),
      prompt: "Say hi",
    });
    expect(readStepUpstreamCost(result.providerMetadata).costUsd).toBe(
      0.000014,
    );
  });

  it("streaming: cost from the last chunk", async () => {
    const provider = createNanoGPT(
      logger,
      fakeFetch(() =>
        sse([
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
            x_nanogpt_pricing: { ...NANO_PRICING, costUsd: 0.0000188 },
            usage: { ...NANO_USAGE, cost: 0.0000188 },
          },
        ]),
      ),
    );
    const result = streamText({
      model: provider.chat("m"),
      prompt: "Say hi",
    });
    expect(await result.text).toBe("Hi");
    expect(readStepUpstreamCost(await result.providerMetadata).costUsd).toBe(
      0.0000188,
    );
  });
});

it("NanoGPT distinguishes text arrays from media in rejected requests", async () => {
  const errorLogger = createEndpointLogger(false, defaultLocale);
  const report = spyOn(errorLogger, "error").mockImplementation(() => {});
  const provider = createNanoGPT(
    errorLogger,
    fakeFetch(() =>
      new Response(
        JSON.stringify({ error: { message: "Model does not support image input" } }),
        { status: 400, headers: { "content-type": "application/json" } },
      ),
    ),
  );

  try {
    await expect(
      generateText({
        model: provider.chat("z-ai/glm-5.3-uncensored"),
        messages: [{
          role: "user",
          content: [
            { type: "text", text: "First part" },
            { type: "text", text: 'Literal JSON: {"type":"image_url"}' },
          ],
        }],
        maxRetries: 0,
      }),
    ).rejects.toBeDefined();
    expect(report).toHaveBeenCalledWith(
      "[NanoGPT] API Error",
      expect.objectContaining({
        model: "z-ai/glm-5.3-uncensored",
        requestShape: expect.objectContaining({
          parsed: true,
          messages: 1,
          multipartMessages: 1,
          textOnlyMultipartMessages: 1,
          images: 0,
        }),
      }),
    );
  } finally {
    report.mockRestore();
  }
});

describe("Venice chat model surfaces the real cost", () => {
  it("non-streaming", async () => {
    const provider = createVeniceAI(
      logger,
      fakeFetch(() =>
        json({
          id: "chatcmpl-v",
          object: "chat.completion",
          created: 1,
          model: "venice-uncensored-1-2",
          choices: [
            {
              index: 0,
              message: { role: "assistant", content: "Hello!" },
              finish_reason: "stop",
            },
          ],
          usage: {
            prompt_tokens: 1574,
            completion_tokens: 10,
            total_tokens: 1584,
          },
          cost: { usd: 0.0003238, diem: 0 },
        }),
      ),
    );
    const result = await generateText({
      model: provider.chat("venice-uncensored-1-2"),
      prompt: "Say hi",
    });
    expect(result.text).toBe("Hello!");
    expect(readStepUpstreamCost(result.providerMetadata).costUsd).toBe(
      0.0003238,
    );
  });

  it("streaming: cost from the usage-only chunk", async () => {
    const provider = createVeniceAI(
      logger,
      fakeFetch(() =>
        sse([
          {
            id: "v",
            object: "chat.completion.chunk",
            created: 1,
            model: "venice-uncensored-1-2",
            choices: [{ index: 0, delta: { content: "Hello" } }],
          },
          {
            id: "v",
            object: "chat.completion.chunk",
            created: 1,
            model: "venice-uncensored-1-2",
            choices: [{ index: 0, delta: { content: "" }, finish_reason: "stop" }],
          },
          {
            id: "v",
            object: "chat.completion.chunk",
            created: 1,
            model: "venice-uncensored-1-2",
            choices: [],
            usage: {
              prompt_tokens: 559,
              completion_tokens: 10,
              total_tokens: 569,
            },
            cost: { usd: 0.0001208, diem: 0 },
          },
        ]),
      ),
    );
    const result = streamText({
      model: provider.chat("venice-uncensored-1-2"),
      prompt: "Say hi",
    });
    expect(await result.text).toBe("Hello");
    expect(readStepUpstreamCost(await result.providerMetadata).costUsd).toBe(
      0.0001208,
    );
  });

  it("concurrent calls on one model keep their own cost", async () => {
    const provider = createVeniceAI(
      logger,
      fakeFetch((body) =>
        json({
          id: "x",
          object: "chat.completion",
          created: 1,
          model: "m",
          choices: [
            {
              index: 0,
              message: { role: "assistant", content: "ok" },
              finish_reason: "stop",
            },
          ],
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
          cost: { usd: body.includes("second") ? 0.002 : 0.001 },
        }),
      ),
    );
    const model = provider.chat("m");
    const [first, second] = await Promise.all([
      generateText({ model, prompt: "first" }),
      generateText({ model, prompt: "second" }),
    ]);
    expect(readStepUpstreamCost(first.providerMetadata).costUsd).toBe(0.001);
    expect(readStepUpstreamCost(second.providerMetadata).costUsd).toBe(0.002);
  });
});
