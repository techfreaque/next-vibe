/**
 * Tool-call delta buffer: the AI SDK finalizes a streamed tool call on the
 * first parsable prefix of its arguments. Prod 2026-11-26/27: Kimi K3 on
 * OpenRouter (Wafer) recorded 120+ calls as `{"toolName": "<tool>"}` with the
 * nested input missing. The buffer holds tool deltas until the finish chunk,
 * repairs split arguments, drops nameless calls and re-sends NanoGPT's
 * malformed-tool-call attempts once.
 */

import { OpenAICompatibleChatLanguageModel } from "@ai-sdk/openai-compatible";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { jsonSchema, streamText, tool } from "ai";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { describe, expect, it } from "bun:test";

import {
  GARBLED_REPLACE_HEADER,
  garbledRetryMarkerSchema,
} from "../openrouter/garbled-guard";
import {
  repairToolArguments,
  takeToolCallWireEvidence,
  withBufferedToolCalls,
} from "./tool-call-delta-buffer";

const logger = createEndpointLogger(false, defaultLocale);
const encoder = new TextEncoder();

function sse(events: readonly string[]): Response {
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

function data(payload: { [key: string]: string | number | null | object }): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

function toolDelta(
  index: number,
  args: string,
  head?: { id: string; name: string },
): string {
  return data({
    id: "gen-1",
    provider: "Wafer",
    model: "moonshotai/kimi-k3",
    choices: [
      {
        index: 0,
        delta: {
          tool_calls: [
            head
              ? {
                  index,
                  id: head.id,
                  type: "function",
                  function: { name: head.name, arguments: args },
                }
              : { index, function: { arguments: args } },
          ],
        },
        finish_reason: null,
      },
    ],
  });
}

function text(content: string): string {
  return data({
    id: "gen-1",
    provider: "Wafer",
    choices: [{ index: 0, delta: { content }, finish_reason: null }],
  });
}

function finish(reason: string): string {
  return (
    data({
      id: "gen-1",
      provider: "Wafer",
      choices: [{ index: 0, delta: {}, finish_reason: reason }],
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
    }) + "data: [DONE]\n\n"
  );
}

const executeTool = tool({
  description: "Run a tool",
  inputSchema: jsonSchema<{ toolName: string; input?: { title: string } }>({
    type: "object",
    properties: {
      toolName: { type: "string" },
      input: { type: "object" },
    },
    required: ["toolName"],
  }),
});

async function openRouterToolInputs(upstream: Response): Promise<{
  inputs: string[];
  errors: number;
}> {
  const provider = createOpenRouter({
    apiKey: "test",
    fetch: Object.assign(
      async (): Promise<Response> =>
        withBufferedToolCalls(upstream, { provider: "OpenRouter", logger }),
      { preconnect: fetch.preconnect },
    ),
  });
  const result = streamText({
    model: provider.chat("moonshotai/kimi-k3"),
    prompt: "Rename the thread.",
    tools: { "execute-tool": executeTool },
  });
  const inputs: string[] = [];
  let errors = 0;
  for await (const part of result.fullStream) {
    if (part.type === "tool-call") {
      inputs.push(JSON.stringify(part.input));
    } else if (part.type === "error" || part.type === "tool-error") {
      errors++;
    }
  }
  return { inputs, errors };
}

describe("repairToolArguments", () => {
  it("leaves valid JSON alone", () => {
    expect(repairToolArguments('{"a":1}')).toEqual({
      text: '{"a":1}',
      repair: "none",
    });
  });

  it("rejoins an object closed before its remaining members", () => {
    const { text: repaired, repair } = repairToolArguments(
      '{"toolName": "rename-thread"}, "input": {"title": "Trip"}}',
    );
    expect(repair).toBe("premature-close");
    expect(JSON.parse(repaired)).toEqual({
      toolName: "rename-thread",
      input: { title: "Trip" },
    });
  });

  it("keeps the fuller object of a repeated call", () => {
    const { text: repaired, repair } = repairToolArguments(
      '{"toolName": "rename-thread"}{"toolName": "rename-thread", "input": {"title": "Trip"}}',
    );
    expect(repair).toBe("repeated-object");
    expect(JSON.parse(repaired)).toEqual({
      toolName: "rename-thread",
      input: { title: "Trip" },
    });
  });

  it("reports other broken JSON unchanged", () => {
    expect(repairToolArguments('{"a": "unterminated').repair).toBe(
      "unparsable",
    );
  });
});

describe("withBufferedToolCalls through the OpenRouter SDK", () => {
  it("delivers the complete arguments when a prefix was already valid JSON", async () => {
    const { inputs, errors } = await openRouterToolInputs(
      sse([
        text("Done."),
        toolDelta(0, '{"toolName": "rename-thread"}', {
          id: "call-split-1",
          name: "execute-tool",
        }),
        toolDelta(0, ', "input": {"title": "Trip plan"}}'),
        finish("tool_calls"),
      ]),
    );
    expect(errors).toBe(0);
    expect(inputs).toEqual([
      JSON.stringify({ toolName: "rename-thread", input: { title: "Trip plan" } }),
    ]);
    expect(takeToolCallWireEvidence("call-split-1")).toMatchObject({
      provider: "OpenRouter",
      host: "Wafer",
      deltaCount: 2,
      repair: "premature-close",
    });
  });

  it("streams a normal call unchanged and keeps parallel calls apart", async () => {
    const { inputs, errors } = await openRouterToolInputs(
      sse([
        toolDelta(0, '{"toolName": "rena', { id: "a", name: "execute-tool" }),
        toolDelta(0, 'me-thread", "input": {"title": "A"}}'),
        toolDelta(1, '{"toolName": "web-search"}', {
          id: "b",
          name: "execute-tool",
        }),
        finish("tool_calls"),
      ]),
    );
    expect(errors).toBe(0);
    expect(inputs).toEqual([
      JSON.stringify({ toolName: "rename-thread", input: { title: "A" } }),
      JSON.stringify({ toolName: "web-search" }),
    ]);
    expect(takeToolCallWireEvidence("a")?.repair).toBe("none");
  });

  it("drops a call without a function name instead of failing the turn", async () => {
    const { inputs, errors } = await openRouterToolInputs(
      sse([
        text("Here you go."),
        data({
          id: "gen-1",
          choices: [
            {
              index: 0,
              delta: {
                tool_calls: [
                  {
                    index: 0,
                    id: "nameless",
                    type: "function",
                    function: { arguments: '{"title": "x"}' },
                  },
                ],
              },
            },
          ],
        }),
        finish("tool_calls"),
      ]),
    );
    expect(errors).toBe(0);
    expect(inputs).toEqual([]);
  });
});

describe("malformed tool call retry (NanoGPT shape)", () => {
  const malformed = data({
    error: {
      message:
        "Partial response received, but the final tool call was malformed and was not executed.",
    },
  });

  function nanoModel(responses: Array<() => Response>): {
    model: OpenAICompatibleChatLanguageModel;
    calls: { count: number };
  } {
    const calls = { count: 0 };
    const fetchImpl = async (
      _input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      const headers = new Headers(init?.headers);
      const replaceVisible = headers.get(GARBLED_REPLACE_HEADER) === "1";
      const next = (): Response => {
        const make = responses[calls.count];
        calls.count += 1;
        return make ? make() : sse([finish("stop")]);
      };
      return withBufferedToolCalls(next(), {
        provider: "NanoGPT",
        logger,
        retry: { replaceVisible, resend: async () => next() },
      });
    };
    return {
      calls,
      model: new OpenAICompatibleChatLanguageModel("z-ai/glm-5.3-uncensored", {
        provider: "nano-gpt",
        headers: (): Record<string, string> => ({}),
        url: ({ path }) => `https://nano.test${path}`,
        fetch: Object.assign(fetchImpl, { preconnect: fetch.preconnect }),
      }),
    };
  }

  it("re-sends once and the replace marker drops the failed attempt's text", async () => {
    const { model, calls } = nanoModel([
      () =>
        sse([
          text("Writing the file now."),
          toolDelta(0, '{"toolName": "cortex-write", "input": {"pa', {
            id: "w1",
            name: "execute-tool",
          }),
          malformed,
        ]),
      () =>
        sse([
          text("Writing it."),
          toolDelta(0, '{"toolName": "rename-thread", "input": {"title": "Notes"}}', {
            id: "w2",
            name: "execute-tool",
          }),
          finish("tool_calls"),
        ]),
    ]);
    const result = streamText({
      model,
      prompt: "Save a note.",
      tools: { "execute-tool": executeTool },
      includeRawChunks: true,
      headers: { [GARBLED_REPLACE_HEADER]: "1" },
    });
    let markers = 0;
    let errors = 0;
    let textAfterMarker = "";
    const inputs: string[] = [];
    for await (const part of result.fullStream) {
      if (part.type === "raw") {
        if (garbledRetryMarkerSchema.safeParse(part.rawValue).success) {
          markers++;
        }
      } else if (part.type === "text-delta" && markers > 0) {
        textAfterMarker += part.text;
      } else if (part.type === "tool-call") {
        inputs.push(JSON.stringify(part.input));
      } else if (part.type === "error") {
        errors++;
      }
    }
    expect(calls.count).toBe(2);
    expect(errors).toBe(0);
    expect(markers).toBe(1);
    expect(textAfterMarker).toBe("Writing it.");
    expect(inputs).toEqual([
      JSON.stringify({ toolName: "rename-thread", input: { title: "Notes" } }),
    ]);
  });

  it("retries only once, then passes the error through", async () => {
    const { model, calls } = nanoModel([
      () => sse([malformed]),
      () => sse([malformed]),
    ]);
    const result = streamText({ model, prompt: "Save a note." });
    let errors = 0;
    for await (const part of result.fullStream) {
      if (part.type === "error") {
        errors++;
      }
    }
    expect(calls.count).toBe(2);
    expect(errors).toBe(1);
  });

  it("does not retry visible text without the replace opt-in", async () => {
    const { model, calls } = nanoModel([
      () => sse([text("Partial."), malformed]),
    ]);
    const result = streamText({ model, prompt: "Save a note." });
    let errors = 0;
    for await (const part of result.fullStream) {
      if (part.type === "error") {
        errors++;
      }
    }
    expect(calls.count).toBe(1);
    expect(errors).toBe(1);
  });

  it("re-sends once when the upstream closes the socket mid-body", async () => {
    let sent = false;
    const broken = (): Response =>
      new Response(
        new ReadableStream<Uint8Array>({
          pull(controller): void {
            if (sent) {
              controller.error(new TypeError("terminated"));
              return;
            }
            sent = true;
            controller.enqueue(encoder.encode(text("Half an ans")));
          },
        }),
        { status: 200, headers: { "content-type": "text/event-stream" } },
      );
    const { model, calls } = nanoModel([
      broken,
      () => sse([text("Full answer."), finish("stop")]),
    ]);
    const result = streamText({
      model,
      prompt: "Hi",
      includeRawChunks: true,
      headers: { [GARBLED_REPLACE_HEADER]: "1" },
    });
    let markers = 0;
    let errors = 0;
    let textAfterMarker = "";
    for await (const part of result.fullStream) {
      if (part.type === "raw") {
        if (garbledRetryMarkerSchema.safeParse(part.rawValue).success) {
          markers++;
        }
      } else if (part.type === "text-delta" && markers > 0) {
        textAfterMarker += part.text;
      } else if (part.type === "error") {
        errors++;
      }
    }
    expect(calls.count).toBe(2);
    expect(errors).toBe(0);
    expect(markers).toBe(1);
    expect(textAfterMarker).toBe("Full answer.");
  });

  it("re-sends a busy error part after a short pause", async () => {
    const { model, calls } = nanoModel([
      () =>
        sse([
          data({
            error: {
              message:
                "The requested service is temporarily unavailable. Please try again later.",
            },
          }),
        ]),
      () => sse([text("Recovered."), finish("stop")]),
    ]);
    const result = streamText({ model, prompt: "Hi" });
    let answer = "";
    let errors = 0;
    for await (const part of result.fullStream) {
      if (part.type === "text-delta") {
        answer += part.text;
      } else if (part.type === "error") {
        errors++;
      }
    }
    expect(calls.count).toBe(2);
    expect(errors).toBe(0);
    expect(answer).toBe("Recovered.");
  });
});
