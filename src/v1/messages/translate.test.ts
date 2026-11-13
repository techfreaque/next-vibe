/**
 * Anthropic Messages translator: system/messages/tools -> model messages,
 * results -> content blocks, neutral stream events -> the Anthropic SSE
 * sequence Claude Code parses (one block open at a time, input_json_delta,
 * thinking + signature_delta, message_delta with stop_reason + usage).
 */

import { describe, expect, it } from "vitest";

import type { V1ContentEvent, V1Totals } from "../shared/execution";
import {
  decodeReasoningReplay,
  encodeReasoningReplay,
} from "../shared/reasoning-replay";
import {
  anthropicStreamEncoder,
  contentBlocksFromParts,
  convertAnthropicMessages,
  convertAnthropicToolChoice,
  convertAnthropicTools,
  referencedToolNames,
  stopReasonFor,
} from "./translate";

const totals: V1Totals = {
  inputTokens: 1_000,
  outputTokens: 50,
  cachedInputTokens: 400,
  reasoningTokens: 0,
  credits: 0.02,
};

interface SseEvent {
  type: string;
  index?: number;
  [key: string]: unknown;
}

function parseSse(text: string): SseEvent[] {
  return text
    .split("\n\n")
    .filter((chunk) => chunk.includes("data: "))
    .map((chunk) => {
      const eventLine = chunk.split("\n").find((l) => l.startsWith("event: "));
      const data = JSON.parse(
        chunk.slice(chunk.indexOf("data: ") + 6),
      ) as SseEvent;
      expect(eventLine).toBe(`event: ${data.type}`);
      return data;
    });
}

describe("convertAnthropicMessages", () => {
  it("maps a Claude Code turn: system blocks, tool_use, thinking, tool_result first", () => {
    const signature = encodeReasoningReplay(undefined, {
      openrouter: { reasoning_details: [{ type: "reasoning.text" }] },
    });
    const converted = convertAnthropicMessages({
      system: [
        { type: "text", text: "You are Claude Code." },
        { type: "text", text: "Be brief." },
      ],
      messages: [
        { role: "user", content: "Read notes.txt" },
        {
          role: "assistant",
          content: [
            { type: "thinking", thinking: "Use Read.", signature },
            { type: "text", text: "Reading." },
            {
              type: "tool_use",
              id: "functions.Read:0",
              name: "Read",
              input: { file_path: "notes.txt" },
            },
            {
              type: "tool_use",
              id: "toolu_2",
              name: "Bash",
              input: { command: "ls" },
            },
          ],
        },
        {
          role: "user",
          content: [
            { type: "text", text: "and summarize" },
            {
              type: "tool_result",
              tool_use_id: "functions.Read:0",
              content: [{ type: "text", text: "buy milk" }],
            },
            {
              type: "tool_result",
              tool_use_id: "toolu_2",
              content: "boom",
              is_error: true,
            },
          ],
        },
      ],
    });
    expect(converted.ok).toBe(true);
    if (!converted.ok) {
      return;
    }
    expect(converted.messages.map((m) => m.role)).toEqual([
      "system",
      "user",
      "assistant",
      "tool",
      "user",
    ]);
    expect(converted.messages[0]).toEqual({
      role: "system",
      content: "You are Claude Code.\n\nBe brief.",
    });
    expect(converted.messages[2]).toEqual({
      role: "assistant",
      content: [
        {
          type: "reasoning",
          text: "Use Read.",
          providerOptions: {
            openrouter: { reasoning_details: [{ type: "reasoning.text" }] },
          },
        },
        { type: "text", text: "Reading." },
        {
          type: "tool-call",
          toolCallId: "functions_Read_0",
          toolName: "Read",
          input: { file_path: "notes.txt" },
        },
        {
          type: "tool-call",
          toolCallId: "toolu_2",
          toolName: "Bash",
          input: { command: "ls" },
        },
      ],
    });
    expect(converted.messages[3]).toEqual({
      role: "tool",
      content: [
        {
          type: "tool-result",
          toolCallId: "functions_Read_0",
          toolName: "Read",
          output: { type: "text", value: "buy milk" },
        },
        {
          type: "tool-result",
          toolCallId: "toolu_2",
          toolName: "Bash",
          output: { type: "error-text", value: "boom" },
        },
      ],
    });
    expect(converted.messages[4]).toEqual({
      role: "user",
      content: [{ type: "text", text: "and summarize" }],
    });
  });

  it("keeps a real Anthropic signature for Claude models", () => {
    const converted = convertAnthropicMessages({
      messages: [
        { role: "user", content: "hi" },
        {
          role: "assistant",
          content: [{ type: "thinking", thinking: "x", signature: "EqQB..." }],
        },
      ],
    });
    expect(converted.ok && converted.messages[1]).toEqual({
      role: "assistant",
      content: [
        {
          type: "reasoning",
          text: "x",
          providerOptions: { anthropic: { signature: "EqQB..." } },
        },
      ],
    });
  });

  it("maps base64 images and tool_result images", () => {
    const converted = convertAnthropicMessages({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: "image/png", data: "AAAA" },
            },
          ],
        },
        {
          role: "assistant",
          content: [
            { type: "tool_use", id: "t1", name: "Screenshot", input: {} },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: "t1",
              content: [
                { type: "text", text: "here" },
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: "image/jpeg",
                    data: "BBBB",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
    expect(converted.ok).toBe(true);
    if (!converted.ok) {
      return;
    }
    expect(converted.messages[0]).toEqual({
      role: "user",
      content: [{ type: "image", image: "data:image/png;base64,AAAA" }],
    });
    expect(converted.messages[2]).toMatchObject({
      role: "tool",
      content: [
        {
          output: {
            type: "content",
            value: [
              { type: "text", text: "here" },
              {
                type: "file",
                data: { type: "data", data: "BBBB" },
                mediaType: "image/jpeg",
              },
            ],
          },
        },
      ],
    });
  });

  it("rejects an unusable image with its param", () => {
    expect(
      convertAnthropicMessages({
        messages: [
          {
            role: "user",
            content: [{ type: "image", source: { type: "file" } }],
          },
        ],
      }),
    ).toEqual({ ok: false, param: "messages[0].content" });
  });
});

describe("tools", () => {
  it("keeps client tools, skips server tools, maps tool_choice", () => {
    const tools = convertAnthropicTools([
      {
        name: "Read",
        description: "Read a file",
        input_schema: { type: "object" },
      },
      { type: "custom", name: "Bash", input_schema: { type: "object" } },
      { type: "web_search_20250305", name: "web_search" },
    ]);
    expect(tools.map((tool) => tool.name)).toEqual(["Read", "Bash"]);
    expect(convertAnthropicToolChoice({ type: "any" })).toBe("required");
    expect(convertAnthropicToolChoice({ type: "tool", name: "Read" })).toEqual({
      toolName: "Read",
    });
    expect(convertAnthropicToolChoice({ type: "none" })).toBe("none");
    expect(convertAnthropicToolChoice({ type: "auto" })).toBe("auto");
  });

  it("non-streaming content blocks + stop reasons", () => {
    const blocks = contentBlocksFromParts([
      { type: "reasoning", text: "hmm", replay: { a: { b: 1 } } },
      { type: "text", text: "Reading." },
      {
        type: "tool-call",
        id: "call:1",
        name: "Read",
        arguments: '{"file_path":"a"}',
      },
      { type: "tool-call", id: "call_2", name: "Bash", arguments: "[1]" },
    ]);
    expect(blocks[0]).toMatchObject({ type: "thinking", thinking: "hmm" });
    expect(
      decodeReasoningReplay(String(blocks[0]?.["signature"]))?.replay,
    ).toEqual({ a: { b: 1 } });
    expect(blocks[1]).toEqual({ type: "text", text: "Reading." });
    expect(blocks[2]).toEqual({
      type: "tool_use",
      id: "call_1",
      name: "Read",
      input: { file_path: "a" },
    });
    // tool_use input must be an object
    expect(blocks[3]).toMatchObject({ input: {} });
    expect(stopReasonFor("stop", true)).toBe("tool_use");
    expect(stopReasonFor("length", false)).toBe("max_tokens");
    expect(stopReasonFor("stop", false)).toBe("end_turn");
  });
});

describe("anthropicStreamEncoder", () => {
  function run(
    events: V1ContentEvent[],
    end: "stop" | "fail" = "stop",
  ): SseEvent[] {
    const encoder = anthropicStreamEncoder("claude-sonnet-4-5", 900);
    let text = encoder.start();
    for (const event of events) {
      text += encoder.event(event);
    }
    text +=
      end === "fail"
        ? encoder.fail("provider down", totals)
        : encoder.finish("stop", totals);
    return parseSse(text);
  }

  it("streams thinking, text and parallel tool calls as sequential blocks", () => {
    const events = run([
      { type: "reasoning", text: "Plan" },
      { type: "reasoning-end", replay: undefined },
      { type: "text", text: "Read" },
      { type: "text", text: "ing." },
      { type: "tool-call-start", id: "a", name: "Read" },
      { type: "tool-call-start", id: "b", name: "Bash" },
      { type: "tool-call-delta", id: "a", argumentsDelta: '{"file_path":' },
      { type: "tool-call-delta", id: "b", argumentsDelta: '{"command":"ls"}' },
      { type: "tool-call-delta", id: "a", argumentsDelta: '"x"}' },
      { type: "tool-call-end", id: "b" },
      { type: "tool-call-end", id: "a" },
    ]);
    expect(events.map((e) => e.type)).toEqual([
      "message_start",
      "ping",
      "content_block_start",
      "content_block_delta",
      "content_block_delta",
      "content_block_stop",
      "content_block_start",
      "content_block_delta",
      "content_block_delta",
      "content_block_stop",
      "content_block_start",
      "content_block_delta",
      "content_block_stop",
      "content_block_start",
      "content_block_delta",
      "content_block_stop",
      "message_delta",
      "message_stop",
    ]);
    // one block open at a time, indices in order
    const indices = events
      .filter((e) => e.type.startsWith("content_block"))
      .map((e) => e.index);
    expect(indices).toEqual([0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3]);
    expect(events[0]).toMatchObject({
      message: {
        type: "message",
        role: "assistant",
        model: "claude-sonnet-4-5",
        content: [],
        usage: { input_tokens: 900 },
      },
    });
    expect(events[2]).toMatchObject({
      content_block: { type: "thinking", thinking: "" },
    });
    expect(events[3]).toMatchObject({
      delta: { type: "thinking_delta", thinking: "Plan" },
    });
    expect(events[4]).toMatchObject({ delta: { type: "signature_delta" } });
    expect(events[10]).toMatchObject({
      content_block: { type: "tool_use", id: "b", name: "Bash", input: {} },
    });
    expect(events[11]).toMatchObject({
      delta: { type: "input_json_delta", partial_json: '{"command":"ls"}' },
    });
    expect(events[13]).toMatchObject({
      content_block: { type: "tool_use", id: "a", name: "Read" },
    });
    expect(events[14]).toMatchObject({
      delta: { partial_json: '{"file_path":"x"}' },
    });
    expect(events.at(-2)).toMatchObject({
      delta: { stop_reason: "tool_use", stop_sequence: null },
      usage: {
        input_tokens: 600,
        cache_read_input_tokens: 400,
        output_tokens: 50,
      },
    });
  });

  it("a tool call without arguments still sends a parseable object", () => {
    const events = run([
      { type: "tool-call-start", id: "a", name: "List" },
      { type: "tool-call-end", id: "a" },
    ]);
    expect(events[3]).toMatchObject({
      delta: { type: "input_json_delta", partial_json: "{}" },
    });
  });

  it("plain text ends with end_turn", () => {
    const events = run([{ type: "text", text: "Hi" }]);
    expect(events.at(-2)).toMatchObject({
      delta: { stop_reason: "end_turn" },
    });
  });

  it("a provider error ends with an Anthropic error event", () => {
    const events = run([{ type: "text", text: "partial" }], "fail");
    expect(events.at(-1)).toEqual({
      type: "error",
      error: { type: "api_error", message: "provider down" },
    });
    expect(events.at(-2)?.type).toBe("content_block_stop");
  });
});

describe("Claude Code specifics", () => {
  it("mid-conversation system entries become text after the conversation started", () => {
    const converted = convertAnthropicMessages({
      system: "base",
      messages: [
        { role: "user", content: "hi" },
        { role: "system", content: [{ type: "text", text: "# Environment" }] },
        { role: "system", content: [] },
      ],
    });
    expect(converted.ok && converted.messages).toEqual([
      { role: "system", content: "base" },
      {
        role: "user",
        content: [
          { type: "text", text: "hi" },
          { type: "text", text: "# Environment" },
        ],
      },
    ]);
  });

  it("deferred tools stay hidden until a tool_reference loads them", () => {
    const tools = [
      { name: "Read", input_schema: { type: "object" } },
      { name: "WebFetch", input_schema: { type: "object" }, defer_loading: true },
    ];
    expect(convertAnthropicTools(tools).map((tool) => tool.name)).toEqual(["Read"]);
    const messages = [
      { role: "user" as const, content: "fetch it" },
      {
        role: "assistant" as const,
        content: [{ type: "tool_use" as const, id: "t1", name: "ToolSearch", input: {} }],
      },
      {
        role: "user" as const,
        content: [
          {
            type: "tool_result" as const,
            tool_use_id: "t1",
            content: [{ type: "tool_reference" as const, tool_name: "WebFetch" }],
          },
        ],
      },
    ];
    expect(
      convertAnthropicTools(tools, referencedToolNames(messages)).map((tool) => tool.name),
    ).toEqual(["Read", "WebFetch"]);
  });

  it("thinking display omitted: no text on the wire, text replays from the signature", () => {
    const encoder = anthropicStreamEncoder("m", 1, true);
    const text =
      encoder.start() +
      encoder.event({ type: "reasoning", text: "secret plan" }) +
      encoder.event({ type: "reasoning-end", replay: undefined }) +
      encoder.finish("stop", totals);
    expect(text).not.toContain("secret plan");
    const signature = parseSse(text)
      .map((e) => e["delta"] as { type?: string; signature?: string } | undefined)
      .find((d) => d?.type === "signature_delta")?.signature;
    const converted = convertAnthropicMessages({
      messages: [
        { role: "user", content: "x" },
        { role: "assistant", content: [{ type: "thinking", thinking: "", signature: signature ?? "" }] },
      ],
    });
    expect(converted.ok && converted.messages[1]).toEqual({
      role: "assistant",
      content: [{ type: "reasoning", text: "secret plan" }],
    });
  });
});
