/**
 * Garbled-output guard + price routing at the fetch layer: a broken host's
 * attempt is dropped and re-run once with that host ignored; clean streams
 * pass through byte for byte; the chat loop's replace marker reaches the AI
 * SDK as a `raw` part through the real OpenRouter provider.
 */

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { describe, expect, it } from "bun:test";

import {
  type FetchFn,
  fetchWithGarbledGuard,
  GARBLED_REPLACE_HEADER,
  garbledRetryMarkerSchema,
  INITIAL_HOLD_CHARS,
} from "./garbled-guard";
import { applyPriceRouting, type JsonRecord } from "./routing";

const logger = createEndpointLogger(false, defaultLocale);
const encoder = new TextEncoder();

function chunk(
  provider: string,
  delta: { content?: string; reasoning?: string },
): string {
  return `data: ${JSON.stringify({
    id: `gen-${provider}`,
    provider,
    model: "deepseek/deepseek-v4.1-flash-1017",
    choices: [{ index: 0, delta }],
  })}\n\n`;
}

function finish(provider: string): string {
  return (
    `data: ${JSON.stringify({
      id: `gen-${provider}`,
      provider,
      choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15,
        cost: 0.0001,
      },
    })}\n\n` + "data: [DONE]\n\n"
  );
}

function sse(events: string[]): Response {
  return new Response(
    new ReadableStream<Uint8Array>({
      start(controller): void {
        for (const event of events) {
          controller.enqueue(encoder.encode(event));
        }
        controller.close();
      },
    }),
    { status: 200, headers: { "content-type": "text/event-stream" } },
  );
}

function interruptedSse(events: string[]): Response {
  const chunks = events.values();
  return new Response(
    new ReadableStream<Uint8Array>({
      pull(controller): void {
        const next = chunks.next();
        if (next.done) {
          controller.error(new Error("fixture upstream body interrupted"));
          return;
        }
        controller.enqueue(encoder.encode(next.value));
      },
    }),
    { headers: { "content-type": "text/event-stream" } },
  );
}

/** Words → content chunks of a few chars, like a real stream. */
function words(provider: string, text: string): string[] {
  return (text.match(/[\s\S]{1,6}/gu) ?? []).map((part) =>
    chunk(provider, { content: part }),
  );
}

const CLEAN_ANSWER =
  "Quantum computers use qubits, which can hold a superposition of 0 and 1. This lets some problems, like factoring and simulating molecules, run much faster than on classical machines. ".repeat(
    2,
  );
const DSML =
  '<｜DSML｜ calls>\n<｜DSML｜ invoke name="execute-tool">\n<｜DSML｜ parameter name="toolName" string="true">rename-thread</｜DSML｜ parameter>';

interface Recorded {
  readonly bodies: JsonRecord[];
  readonly headers: Headers[];
}

function fakeFetch(responses: (() => Response)[]): FetchFn & Recorded {
  const bodies: JsonRecord[] = [];
  const headers: Headers[] = [];
  let call = 0;
  const fn = async (
    _url: string | Request | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    bodies.push(JSON.parse(String(init?.body)));
    headers.push(new Headers(init?.headers));
    const next = responses[call++];
    if (!next) {
      return new Response("no more responses", { status: 500 });
    }
    return next();
  };
  return Object.assign(fn, { bodies, headers });
}

function chatBody(stream = true): JsonRecord {
  const body: JsonRecord = {
    model: "deepseek/deepseek-v4.1-flash-1017",
    stream,
    messages: [{ role: "user", content: "Explain quantum computing briefly." }],
  };
  applyPriceRouting(body);
  return body;
}

async function run(
  fetchImpl: FetchFn,
  replaceAfterRelease: boolean,
  body = chatBody(),
): Promise<string> {
  const res = await fetchWithGarbledGuard(
    "https://openrouter.ai/api/v1/chat/completions",
    { method: "POST" },
    body,
    {
      fetchImpl,
      logger,
      serialize: (b) => JSON.stringify(b),
      replaceAfterRelease,
    },
  );
  return res.text();
}

describe("price routing", () => {
  it("adds sort=price with fallbacks", () => {
    expect(chatBody()["provider"]).toEqual({
      sort: "price",
      allow_fallbacks: true,
    });
  });
  it("keeps a pinned provider order", () => {
    const body: JsonRecord = {
      messages: [],
      provider: { order: ["deepinfra"], allow_fallbacks: false },
    };
    applyPriceRouting(body);
    expect(body["provider"]).toEqual({
      order: ["deepinfra"],
      allow_fallbacks: false,
    });
  });
});

describe("garbled guard: streaming", () => {
  it("clean stream passes through byte for byte, one request", async () => {
    const events = [...words("Wafer", CLEAN_ANSWER), finish("Wafer")];
    const fetchImpl = fakeFetch([() => sse(events)]);
    expect(await run(fetchImpl, true)).toBe(events.join(""));
    expect(fetchImpl.bodies.length).toBe(1);
  });

  it("garbled inside the hold: invisible retry with the host ignored", async () => {
    const bad = [
      ...words("BadHost", "Sure. "),
      ...words("BadHost", DSML),
      finish("BadHost"),
    ];
    const good = [...words("Wafer", CLEAN_ANSWER), finish("Wafer")];
    const fetchImpl = fakeFetch([() => sse(bad), () => sse(good)]);
    const out = await run(fetchImpl, false);
    expect(out).toBe(good.join(""));
    expect(out).not.toContain("BadHost");
    expect(fetchImpl.bodies.length).toBe(2);
    expect(fetchImpl.bodies[1]?.["provider"]).toEqual({
      sort: "price",
      allow_fallbacks: true,
      ignore: ["BadHost"],
    });
  });

  it("garbled after release: marker, then the retry (chat loop)", async () => {
    const bad = [
      ...words("BadHost", CLEAN_ANSWER),
      ...words("BadHost", DSML),
      finish("BadHost"),
    ];
    const good = [...words("Wafer", CLEAN_ANSWER), finish("Wafer")];
    const fetchImpl = fakeFetch([() => sse(bad), () => sse(good)]);
    const out = await run(fetchImpl, true);
    expect(CLEAN_ANSWER.length).toBeGreaterThan(INITIAL_HOLD_CHARS);
    const markerAt = out.indexOf("unbottled_garbled_retry");
    expect(markerAt).toBeGreaterThan(0);
    expect(out.slice(markerAt)).toContain(good.join(""));
    expect(out).not.toContain("DSML");
    expect(out).not.toContain('"cost":0.0001,"prompt_tokens":10,"total_tokens":15},"provider":"BadHost"');
    // The garbled attempt's usage chunk never reaches the SDK: only the retry bills.
    expect(out.split('"finish_reason":"stop"').length - 1).toBe(1);
  });

  it("garbled after release without a marker consumer: pass through", async () => {
    const bad = [
      ...words("BadHost", CLEAN_ANSWER),
      ...words("BadHost", DSML),
      finish("BadHost"),
    ];
    const fetchImpl = fakeFetch([() => sse(bad)]);
    expect(await run(fetchImpl, false)).toBe(bad.join(""));
    expect(fetchImpl.bodies.length).toBe(1);
  });

  it("retries at most once", async () => {
    const bad = (host: string): string[] => [
      ...words(host, DSML),
      finish(host),
    ];
    const fetchImpl = fakeFetch([
      () => sse(bad("BadHost")),
      () => sse(bad("OtherBad")),
    ]);
    const out = await run(fetchImpl, true);
    expect(out).toBe(bad("OtherBad").join(""));
    expect(fetchImpl.bodies.length).toBe(2);
  });
});

describe("garbled guard: non-streaming (/v1 generate)", () => {
  function json(provider: string, content: string): Response {
    return new Response(
      JSON.stringify({
        id: "gen-1",
        provider,
        choices: [{ index: 0, message: { role: "assistant", content } }],
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  }
  it("garbled answer is re-run on another host", async () => {
    const fetchImpl = fakeFetch([
      () => json("BadHost", `Ok. ${DSML}`),
      () => json("Wafer", "Clean answer."),
    ]);
    const out = await run(fetchImpl, false, chatBody(false));
    expect(out).toContain("Clean answer.");
    expect(fetchImpl.bodies[1]?.["provider"]).toEqual({
      sort: "price",
      allow_fallbacks: true,
      ignore: ["BadHost"],
    });
  });
  it("clean answer returns unchanged", async () => {
    const fetchImpl = fakeFetch([() => json("Wafer", "Clean answer.")]);
    expect(await run(fetchImpl, false, chatBody(false))).toContain(
      "Clean answer.",
    );
    expect(fetchImpl.bodies.length).toBe(1);
  });
});

describe("garbled guard through the real OpenRouter provider", () => {
  it("retries an interrupted HTTP 200 stream on a different host", async () => {
    const upstream = fakeFetch([
      () => interruptedSse(words("BadHost", CLEAN_ANSWER)),
      () => sse([chunk("Wafer", { content: "Recovered answer." }), finish("Wafer")]),
    ]);
    const text = await run(upstream, true);
    expect(text).toContain('"rule":"upstream-body-read"');
    expect(text).toContain("Recovered answer.");
    expect(upstream.bodies[1]?.["provider"]).toEqual({
      sort: "price",
      allow_fallbacks: true,
      ignore: ["BadHost"],
    });
  });

  it("leaves an interrupted stream visible without retrying an emitted tool call", async () => {
    const tool = 'data: {"provider":"BadHost","choices":[{"delta":{"tool_calls":[{}]}}]}\n\n';
    const upstream = fakeFetch([() => interruptedSse([tool])]);
    await expect(run(upstream, true)).rejects.toThrow("fixture upstream body interrupted");
    expect(upstream.bodies).toHaveLength(1);
  });

  it("SDK sees the retry; the marker arrives as a raw part", async () => {
    const bad = [
      ...words("BadHost", CLEAN_ANSWER),
      ...words("BadHost", DSML),
      finish("BadHost"),
    ];
    const good = [...words("Wafer", "Fresh clean answer."), finish("Wafer")];
    const upstream = fakeFetch([() => sse(bad), () => sse(good)]);

    const provider = createOpenRouter({
      apiKey: "test",
      fetch: Object.assign(async (url: string | URL | Request, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        const replace = headers.get(GARBLED_REPLACE_HEADER) === "1";
        headers.delete(GARBLED_REPLACE_HEADER);
        const body: JsonRecord = JSON.parse(String(init?.body));
        applyPriceRouting(body);
        return fetchWithGarbledGuard(url, { ...init, headers }, body, {
          fetchImpl: upstream,
          logger,
          serialize: (b) => JSON.stringify(b),
          replaceAfterRelease: replace,
        });
      }, { preconnect: fetch.preconnect }),
    });
    const result = streamText({
      model: provider.chat("deepseek/deepseek-v4.1-flash-1017"),
      prompt: "Explain quantum computing briefly.",
      includeRawChunks: true,
      headers: { [GARBLED_REPLACE_HEADER]: "1" },
    });

    let text = "";
    let textAfterMarker = "";
    let markers = 0;
    let errors = 0;
    for await (const part of result.fullStream) {
      if (part.type === "raw") {
        if (garbledRetryMarkerSchema.safeParse(part.rawValue).success) {
          markers++;
        }
      } else if (part.type === "text-delta") {
        text += part.text;
        if (markers > 0) {
          textAfterMarker += part.text;
        }
      } else if (part.type === "error") {
        errors++;
      }
    }
    expect(errors).toBe(0);
    expect(markers).toBe(1);
    expect(textAfterMarker).toBe("Fresh clean answer.");
    expect(text).not.toContain("DSML");
    // The opt-in header never leaves the wrapper.
    expect(upstream.headers[0]?.get(GARBLED_REPLACE_HEADER)).toBeNull();
    expect(upstream.bodies[0]?.["provider"]).toEqual({
      sort: "price",
      allow_fallbacks: true,
    });
    const usage = await result.usage;
    expect(usage.outputTokens).toBe(5);
  });
});
