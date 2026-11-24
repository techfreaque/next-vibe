/**
 * Prompt-engineered tool calling stream (Venice, FreedomGPT, Gab, Uncensored).
 * Prod 2026-11-16: Venice Uncensored looped inside a <tool_calls> block for
 * 5 minutes (~110k hidden tokens, finish=length), the user saw nothing and
 * was billed for all of it. A "<" at a chunk edge also hid the rest of a
 * normal answer for good.
 */

import { describe, expect, it, mock } from "bun:test";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import {
  forwardableEnd,
  MAX_TOOL_CALL_MARKUP_CHARS,
  processStreamingResponseWithToolCalls,
} from "./streaming-tool-call-processor";

import { generateToolSystemPrompt } from "./tool-calling-prompt-engineering";

const logger = createEndpointLogger(false, defaultLocale);

interface ParsedChunk {
  choices?: Array<{
    delta?: {
      content?: string;
      tool_calls?: Array<{ function: { name: string; arguments: string } }>;
    };
    finish_reason?: string;
  }>;
}

/** Builds an upstream SSE body from content pieces + a finish reason. */
function upstream(
  pieces: readonly string[],
  finishReason: string,
  pull?: { count: number },
): Response {
  const lines = [
    ...pieces.map(
      (content) =>
        `data: ${JSON.stringify({ id: "x", choices: [{ index: 0, delta: { content } }] })}\n\n`,
    ),
    `data: ${JSON.stringify({ id: "x", choices: [{ index: 0, delta: {}, finish_reason: finishReason }] })}\n\n`,
    `data: ${JSON.stringify({ id: "x", choices: [], usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 } })}\n\n`,
    "data: [DONE]\n\n",
  ];
  const encoder = new TextEncoder();
  let index = 0;
  return new Response(
    new ReadableStream({
      pull(controller): void {
        if (pull) {
          pull.count += 1;
        }
        const line = lines[index];
        index += 1;
        if (line === undefined) {
          controller.close();
          return;
        }
        controller.enqueue(encoder.encode(line));
      },
    }),
  );
}

async function run(response: Response): Promise<{
  text: string;
  toolCalls: string[];
  finishReason: string | undefined;
}> {
  const out = await processStreamingResponseWithToolCalls(
    response,
    logger,
    "test",
    true,
  );
  const raw = await out.text();
  let text = "";
  const toolCalls: string[] = [];
  let finishReason: string | undefined;
  for (const line of raw.split("\n")) {
    if (!line.startsWith("data: ") || line === "data: [DONE]") {
      continue;
    }
    const chunk = JSON.parse(line.slice(6)) as ParsedChunk;
    const choice = chunk.choices?.[0];
    text += choice?.delta?.content ?? "";
    for (const call of choice?.delta?.tool_calls ?? []) {
      toolCalls.push(call.function.name);
    }
    if (choice?.finish_reason) {
      finishReason = choice.finish_reason;
    }
  }
  return { text, toolCalls, finishReason };
}

describe("generateToolSystemPrompt", () => {
  it("includes examples only for tools offered to this model", () => {
    const promptFor = (name: string): string =>
      generateToolSystemPrompt([{ type: "function", function: { name } }]);
    const limited = promptFor("execute-tool");
    expect(limited).toContain("execute-tool");
    expect(limited).not.toContain("cortex-write");
    expect(limited).not.toContain("web-search");
    expect(limited).not.toContain("fetch-url-content");
    expect(promptFor("cortex-write")).toContain('{"name":"cortex-write","arguments":');
  });
});

describe("forwardableEnd", () => {
  it("holds back a partial tag that may still grow", () => {
    expect(forwardableEnd("Hello <to", 0)).toEqual({
      end: 6,
      confirmed: false,
    });
  });

  it("forwards a < that can no longer become the tag", () => {
    expect(forwardableEnd("a < b", 0)).toEqual({ end: 5, confirmed: false });
  });

  it("confirms a full tag", () => {
    expect(forwardableEnd('Hi <tool_calls>[{"name"', 0)).toEqual({
      end: 3,
      confirmed: true,
    });
  });
});

describe("processStreamingResponseWithToolCalls", () => {
  it("releases text after a < split across chunks", async () => {
    const result = await run(upstream(["x <", " 5 and done."], "stop"));
    expect(result.text).toBe("x < 5 and done.");
    expect(result.finishReason).toBe("stop");
  });

  it("releases a trailing partial tag at the end", async () => {
    const result = await run(upstream(["Answer <"], "stop"));
    expect(result.text).toBe("Answer <");
  });

  it("parses a tool call and hides its markup", async () => {
    const result = await run(
      upstream(
        [
          "On it. <tool",
          '_calls>[{"name": "generate_image", "arguments": {"prompt": "cactus"}}]',
          "</tool_calls>",
        ],
        "stop",
      ),
    );
    expect(result.text).toBe("On it. ");
    expect(result.toolCalls).toEqual(["generate_image"]);
    expect(result.finishReason).toBe("tool_calls");
  });

  it("reports the shape of rejected markup without its arguments", async () => {
    const warn = mock(() => undefined);
    const response = await processStreamingResponseWithToolCalls(
      upstream(['<tool_calls>{"name":"example","arguments":{"value":"private fixture"}}</tool_calls>'], "stop"),
      { ...logger, warn }, "test", true,
    );
    await response.text();
    expect(warn).toHaveBeenCalledWith("[test] Tool-call markup did not parse", expect.objectContaining({
      markupBoundary: { endsWithArray: false, endsWithObject: true, endsWithCodeFence: false },
      markupBodyKind: "object", hasJsonNameField: true, hasJsonArgumentsField: true,
    }));
    expect(JSON.stringify(warn.mock.calls)).not.toContain("private fixture");
  });

  it("cuts a runaway tool-call block and stops reading upstream", async () => {
    const filler = "a".repeat(10_000);
    const pieces = [
      '<tool_calls>[{"name": "generate_image", "arguments": {"prompt": "',
      ...Array.from(
        { length: Math.ceil(MAX_TOOL_CALL_MARKUP_CHARS / 10_000) + 20 },
        () => filler,
      ),
    ];
    const pull = { count: 0 };
    const result = await run(upstream(pieces, "length", pull));
    expect(result.text).toBe("");
    expect(result.toolCalls).toEqual([]);
    expect(result.finishReason).toBe("length");
    // Stopped shortly after the cap, not after all pieces + finish + usage.
    expect(pull.count).toBeLessThan(pieces.length);
  });
});
