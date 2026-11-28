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

import {
  generateToolSystemPrompt,
  parseToolCalls,
} from "./tool-calling-prompt-engineering";

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

async function run(
  response: Response,
  allowToolCalls = true,
): Promise<{
  text: string;
  toolCalls: string[];
  finishReason: string | undefined;
}> {
  const out = await processStreamingResponseWithToolCalls(
    response,
    logger,
    "test",
    true,
    undefined,
    allowToolCalls,
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

  it("joins adjacent tool-call arrays in the same block", async () => {
    const first = [{ name: "lookup", arguments: { text: 'Keep "] [" here' } }];
    const second = [{ name: "summarize", arguments: { text: "second call" } }];
    const markup = `<tool_calls>${JSON.stringify(first)}\n${JSON.stringify(second)}</tool_calls>`;
    const result = await run(upstream([markup], "stop"));

    expect(result.text).toBe("");
    expect(result.toolCalls).toEqual(["lookup", "summarize"]);
    expect(result.finishReason).toBe("tool_calls");
    expect(parseToolCalls(markup, logger).toolCalls).toEqual([
      ...first,
      ...second,
    ]);
  });

  it("rejects adjacent arrays when a call has malformed arguments", () => {
    const error = mock(() => undefined);
    const markup =
      '<tool_calls>[{"name":"lookup","arguments":{}}]\n[{"name":"summarize","arguments":"missing object"}]</tool_calls>';

    expect(parseToolCalls(markup, { ...logger, error }).toolCalls).toBeNull();
    expect(error).toHaveBeenCalledTimes(1);
  });

  it("reports the shape of rejected markup without its arguments", async () => {
    const warn = mock(() => undefined);
    const response = await processStreamingResponseWithToolCalls(
      upstream(['<tool_calls>{"tool":"example","arguments":{"value":"private fixture"}}</tool_calls>'], "stop"),
      { ...logger, warn }, "test", true,
    );
    await response.text();
    // A bare call object now parses; one without a tool name still cannot run.
    expect(warn).toHaveBeenCalledWith("[test] Tool-call markup did not parse", expect.objectContaining({
      markupBoundary: { endsWithArray: false, endsWithObject: true, endsWithCodeFence: false },
      markupBodyKind: "object", hasJsonNameField: false, hasJsonArgumentsField: true,
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

describe("parseToolCalls entry validation", () => {
  // Prod 2026-11-27: Uncensored LM sent rename-thread arguments without a
  // name; the nameless call made the AI SDK throw "Expected 'function.name'
  // to be a string." and the turn ended in an error bubble.
  it("drops an entry without a tool name and keeps the valid ones", () => {
    const { toolCalls, textContent } = parseToolCalls(
      'Answer.<tool_calls>[{"arguments": {"title": "Chapter one"}}, {"name": "web-search", "arguments": {"query": "x"}}]</tool_calls>',
      logger,
    );
    expect(textContent).toBe("Answer.");
    expect(toolCalls).toEqual([
      { name: "web-search", arguments: { query: "x" } },
    ]);
  });

  it("accepts OpenAI-style entries with string arguments", () => {
    const { toolCalls } = parseToolCalls(
      '<tool_calls>[{"function": {"name": "rename-thread", "arguments": "{\\"title\\": \\"Trip\\"}"}}, {"name": "fetch-url", "parameters": {"url": "https://a.b"}}]</tool_calls>',
      logger,
    );
    expect(toolCalls).toEqual([
      { name: "rename-thread", arguments: { title: "Trip" } },
      { name: "fetch-url", arguments: { url: "https://a.b" } },
    ]);
  });

  it("treats a block of only nameless entries as no tool call", () => {
    const { toolCalls } = parseToolCalls(
      '<tool_calls>[{"title": "Chapter one"}]</tool_calls>',
      logger,
    );
    expect(toolCalls).toBeNull();
  });

  it("parses an array missing its closing bracket and a bare call object", () => {
    const unclosed = parseToolCalls(
      'Ok.<tool_calls>[{"name": "web-search", "arguments": {"query": "x"}}</tool_calls>',
      logger,
    );
    expect(unclosed.toolCalls).toEqual([
      { name: "web-search", arguments: { query: "x" } },
    ]);
    const bare = parseToolCalls(
      '<tool_calls>{"name": "rename-thread", "arguments": {"title": "Trip"}}</tool_calls>',
      logger,
    );
    expect(bare.toolCalls).toEqual([
      { name: "rename-thread", arguments: { title: "Trip" } },
    ]);
  });

  it("drops tool-call markup and emits stop when allowToolCalls is false (toolChoice=none)", async () => {
    const result = await run(
      upstream(
        [
          "Here is the answer.",
          '<tool_calls>[{"name": "contact-form", "arguments": {"email": "a@b.c"}}]</tool_calls>',
        ],
        "stop",
      ),
      false,
    );
    expect(result.text).toBe("Here is the answer.");
    expect(result.toolCalls).toEqual([]);
    expect(result.finishReason).toBe("stop");
  });
});
