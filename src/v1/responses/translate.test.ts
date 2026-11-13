/**
 * Responses API translator: request items -> model messages, tool kinds ->
 * output items, neutral stream events -> the Responses SSE sequence Codex CLI
 * parses (output_item.added/done, deltas, response.completed with usage).
 */

import { describe, expect, it } from "vitest";

import type { V1ContentEvent, V1Totals } from "../shared/execution";
import { encodeReasoningReplay } from "../shared/reasoning-replay";
import {
  convertResponsesInput,
  convertResponsesToolChoice,
  convertResponsesTools,
  outputItemsFromParts,
  type ResponseEcho,
  responsesStreamEncoder,
  toolCallItem,
} from "./translate";

const totals: V1Totals = {
  inputTokens: 120,
  outputTokens: 30,
  cachedInputTokens: 20,
  reasoningTokens: 5,
  credits: 0.01,
};

const echo: ResponseEcho = {
  id: "resp_test",
  createdAt: 1,
  model: "deepseek-v4.1-flash",
  instructions: null,
  toolChoice: "auto",
  tools: [],
  parallelToolCalls: false,
  temperature: null,
  topP: null,
  maxOutputTokens: null,
  reasoning: null,
  store: false,
};

interface SseEvent {
  type: string;
  sequence_number: number;
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

describe("convertResponsesInput", () => {
  it("maps a Codex-style conversation, merging assistant pieces and tool results", () => {
    const converted = convertResponsesInput({
      instructions: "You are Codex.",
      text: null,
      input: [
        {
          type: "message",
          role: "developer",
          content: [{ type: "input_text", text: "<permissions>" }],
        },
        {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: "List files" }],
        },
        {
          type: "reasoning",
          summary: [{ type: "summary_text", text: "short" }],
          encrypted_content: encodeReasoningReplay("full reasoning", {
            openrouter: { reasoning_details: [{ type: "reasoning.text" }] },
          }),
        },
        {
          type: "function_call",
          call_id: "call_a",
          name: "shell",
          arguments: '{"command":["ls"]}',
        },
        {
          type: "function_call",
          call_id: "call_b",
          name: "shell",
          arguments: "not json",
        },
        { type: "function_call_output", call_id: "call_a", output: "a.txt" },
        {
          type: "function_call_output",
          call_id: "call_b",
          output: [{ type: "input_text", text: "b.txt" }],
        },
        { type: "web_search_call" },
        {
          type: "message",
          role: "assistant",
          content: [{ type: "output_text", text: "Done." }],
        },
      ],
    });
    expect(converted.ok).toBe(true);
    if (!converted.ok) {
      return;
    }
    const [system1, system2, user, assistant, tool, final] = converted.messages;
    expect(system1).toEqual({ role: "system", content: "You are Codex." });
    expect(system2).toEqual({ role: "system", content: "<permissions>" });
    expect(user).toEqual({
      role: "user",
      content: [{ type: "text", text: "List files" }],
    });
    expect(assistant).toEqual({
      role: "assistant",
      content: [
        {
          type: "reasoning",
          text: "full reasoning",
          providerOptions: {
            openrouter: { reasoning_details: [{ type: "reasoning.text" }] },
          },
        },
        {
          type: "tool-call",
          toolCallId: "call_a",
          toolName: "shell",
          input: { command: ["ls"] },
        },
        // invalid JSON from the model replays as the raw string
        {
          type: "tool-call",
          toolCallId: "call_b",
          toolName: "shell",
          input: "not json",
        },
      ],
    });
    expect(tool).toEqual({
      role: "tool",
      content: [
        {
          type: "tool-result",
          toolCallId: "call_a",
          toolName: "shell",
          output: { type: "text", value: "a.txt" },
        },
        {
          type: "tool-result",
          toolCallId: "call_b",
          toolName: "shell",
          output: { type: "text", value: "b.txt" },
        },
      ],
    });
    expect(final).toEqual({
      role: "assistant",
      content: [{ type: "text", text: "Done." }],
    });
    expect(converted.messages).toHaveLength(6);
    expect(converted.estimatedInputTokens).toBeGreaterThan(0);
  });

  it("mid-conversation developer messages become user turns", () => {
    const converted = convertResponsesInput({
      instructions: null,
      text: null,
      input: [
        { role: "user", content: "hi" },
        { role: "assistant", content: "hello" },
        { role: "developer", content: "model switched" },
      ],
    });
    expect(converted.ok && converted.messages.map((m) => m.role)).toEqual([
      "user",
      "assistant",
      "user",
    ]);
  });

  it("maps custom and local_shell calls with their outputs", () => {
    const converted = convertResponsesInput({
      instructions: null,
      text: null,
      input: [
        { role: "user", content: "patch it" },
        {
          type: "custom_tool_call",
          call_id: "c1",
          name: "apply_patch",
          input: "*** Begin Patch",
        },
        { type: "custom_tool_call_output", call_id: "c1", output: "ok" },
        {
          type: "local_shell_call",
          call_id: "s1",
          action: { type: "exec", command: ["ls"], working_directory: "/w" },
        },
        { type: "function_call_output", call_id: "s1", output: "x" },
      ],
    });
    expect(converted.ok).toBe(true);
    if (!converted.ok) {
      return;
    }
    expect(converted.messages[1]).toEqual({
      role: "assistant",
      content: [
        {
          type: "tool-call",
          toolCallId: "c1",
          toolName: "apply_patch",
          input: { input: "*** Begin Patch" },
        },
      ],
    });
    expect(converted.messages[3]).toEqual({
      role: "assistant",
      content: [
        {
          type: "tool-call",
          toolCallId: "s1",
          toolName: "local_shell",
          input: { command: ["ls"], workdir: "/w" },
        },
      ],
    });
    expect(converted.messages[4]).toMatchObject({
      role: "tool",
      content: [{ toolCallId: "s1", toolName: "local_shell" }],
    });
  });

  it("a string input is one user message; a bad image is rejected with its param", () => {
    const simple = convertResponsesInput({
      instructions: null,
      text: null,
      input: "hello",
    });
    expect(simple.ok && simple.messages).toEqual([
      { role: "user", content: [{ type: "text", text: "hello" }] },
    ]);
    const bad = convertResponsesInput({
      instructions: null,
      text: null,
      input: [
        {
          role: "user",
          content: [{ type: "input_image", image_url: "file:///etc/passwd" }],
        },
      ],
    });
    expect(bad).toEqual({ ok: false, param: "input[0].content" });
  });

  it("json_schema text format becomes an instruction", () => {
    const converted = convertResponsesInput({
      instructions: null,
      text: {
        format: { type: "json_schema", name: "out", schema: { type: "object" } },
      },
      input: "x",
    });
    expect(
      converted.ok &&
        typeof converted.messages[0]?.content === "string" &&
        converted.messages[0].content.includes('"type":"object"'),
    ).toBe(true);
  });
});

describe("tools", () => {
  it("keeps function/custom/local_shell tools and skips hosted ones", () => {
    const set = convertResponsesTools([
      {
        type: "function",
        name: "shell",
        description: "Run",
        parameters: { type: "object" },
        strict: false,
      },
      {
        type: "custom",
        name: "apply_patch",
        description: "Patch files",
        format: { type: "grammar", syntax: "lark", definition: "start: x" },
      },
      { type: "local_shell" },
      { type: "web_search" },
      { type: "image_generation" },
    ]);
    expect(set.tools.map((tool) => tool.name)).toEqual([
      "shell",
      "apply_patch",
      "local_shell",
    ]);
    expect(set.tools[1]?.description).toContain("start: x");
    expect(set.tools[1]?.parameters).toMatchObject({ required: ["input"] });
    expect([...set.kinds.entries()]).toEqual([
      ["shell", "function"],
      ["apply_patch", "custom"],
      ["local_shell", "local_shell"],
    ]);
  });

  it("maps tool_choice", () => {
    expect(convertResponsesToolChoice("required")).toBe("required");
    expect(convertResponsesToolChoice({ type: "function", name: "x" })).toEqual({
      toolName: "x",
    });
    expect(convertResponsesToolChoice({ type: "web_search" })).toBe("auto");
    expect(convertResponsesToolChoice(null)).toBeUndefined();
  });

  it("turns model calls back into the item type of their tool", () => {
    expect(
      toolCallItem("ctc_1", "c1", "apply_patch", '{"input":"*** Begin"}', "custom"),
    ).toMatchObject({ type: "custom_tool_call", call_id: "c1", input: "*** Begin" });
    expect(
      toolCallItem("lsh_1", "s1", "local_shell", '{"command":"ls -la"}', "local_shell"),
    ).toMatchObject({
      type: "local_shell_call",
      call_id: "s1",
      action: { type: "exec", command: ["bash", "-lc", "ls -la"] },
    });
    expect(toolCallItem("fc_1", "f1", "shell", "", "function")).toMatchObject({
      type: "function_call",
      arguments: "{}",
    });
  });

  it("non-streaming output keeps model order", () => {
    const items = outputItemsFromParts(
      [
        { type: "reasoning", text: "think", replay: undefined },
        { type: "text", text: "Let me look." },
        { type: "tool-call", id: "call_1", name: "shell", arguments: "{}" },
        { type: "tool-call", id: "call_2", name: "shell", arguments: "{}" },
      ],
      new Map([["shell", "function"]]),
    );
    expect(items.map((item) => item["type"])).toEqual([
      "reasoning",
      "message",
      "function_call",
      "function_call",
    ]);
    expect(items[2]).toMatchObject({ call_id: "call_1" });
    expect(items[3]).toMatchObject({ call_id: "call_2" });
  });
});

describe("responsesStreamEncoder", () => {
  function run(
    events: V1ContentEvent[],
    finish: "stop" | "length" | "tool_calls" | "fail",
    kinds = new Map<string, "function" | "custom" | "local_shell">([
      ["shell", "function"],
      ["apply_patch", "custom"],
    ]),
  ): SseEvent[] {
    const encoder = responsesStreamEncoder(echo, kinds);
    let text = encoder.start();
    for (const event of events) {
      text += encoder.event(event);
    }
    text +=
      finish === "fail"
        ? encoder.fail("provider down", totals)
        : encoder.finish(finish, totals);
    return parseSse(text);
  }

  it("emits the full item lifecycle for reasoning, text and tool calls", () => {
    const events = run(
      [
        { type: "reasoning", text: "Thinking" },
        { type: "reasoning", text: " more" },
        { type: "reasoning-end", replay: { x: { sig: "s" } } },
        { type: "text", text: "Hi " },
        { type: "text", text: "there" },
        { type: "tool-call-start", id: "call_1", name: "shell" },
        { type: "tool-call-delta", id: "call_1", argumentsDelta: '{"command":' },
        { type: "tool-call-start", id: "call_2", name: "apply_patch" },
        { type: "tool-call-delta", id: "call_1", argumentsDelta: '["ls"]}' },
        { type: "tool-call-delta", id: "call_2", argumentsDelta: '{"input":"P"}' },
        { type: "tool-call-end", id: "call_1" },
        { type: "tool-call-end", id: "call_2" },
      ],
      "tool_calls",
    );
    expect(events.map((e) => e.sequence_number)).toEqual(
      events.map((_, i) => i),
    );
    expect(events.map((e) => e.type)).toEqual([
      "response.created",
      "response.in_progress",
      "response.output_item.added",
      "response.reasoning_summary_part.added",
      "response.reasoning_summary_text.delta",
      "response.reasoning_summary_text.delta",
      "response.reasoning_summary_text.done",
      "response.reasoning_summary_part.done",
      "response.output_item.done",
      "response.output_item.added",
      "response.content_part.added",
      "response.output_text.delta",
      "response.output_text.delta",
      "response.output_text.done",
      "response.content_part.done",
      "response.output_item.done",
      "response.output_item.added",
      "response.function_call_arguments.delta",
      "response.function_call_arguments.delta",
      "response.function_call_arguments.done",
      "response.output_item.done",
      "response.output_item.added",
      "response.output_item.done",
      "response.completed",
    ]);
    const doneItems = events
      .filter((e) => e.type === "response.output_item.done")
      .map((e) => e["item"]);
    expect(doneItems[0]).toMatchObject({
      type: "reasoning",
      summary: [{ type: "summary_text", text: "Thinking more" }],
    });
    expect(doneItems[1]).toMatchObject({
      type: "message",
      role: "assistant",
      content: [{ type: "output_text", text: "Hi there" }],
    });
    expect(doneItems[2]).toMatchObject({
      type: "function_call",
      call_id: "call_1",
      name: "shell",
      arguments: '{"command":["ls"]}',
    });
    expect(doneItems[3]).toMatchObject({
      type: "custom_tool_call",
      call_id: "call_2",
      input: "P",
    });
    const completed = events.at(-1)?.["response"];
    expect(completed).toMatchObject({
      id: "resp_test",
      status: "completed",
      usage: {
        input_tokens: 120,
        input_tokens_details: { cached_tokens: 20 },
        output_tokens: 30,
        output_tokens_details: { reasoning_tokens: 5 },
        total_tokens: 150,
      },
    });
    expect(
      (completed as { output: Array<{ type: string }> }).output.map(
        (item) => item.type,
      ),
    ).toEqual(["reasoning", "message", "function_call", "custom_tool_call"]);
  });

  it("closes calls that never got an end event and reports length as incomplete", () => {
    const events = run(
      [
        { type: "tool-call-start", id: "call_1", name: "shell" },
        { type: "tool-call-delta", id: "call_1", argumentsDelta: "{}" },
      ],
      "length",
    );
    expect(events.at(-2)?.type).toBe("response.output_item.done");
    expect(events.at(-1)).toMatchObject({
      type: "response.incomplete",
      response: {
        status: "incomplete",
        incomplete_details: { reason: "max_output_tokens" },
      },
    });
  });

  it("a provider error ends with response.failed", () => {
    const events = run([{ type: "text", text: "partial" }], "fail");
    expect(events.at(-1)).toMatchObject({
      type: "response.failed",
      response: {
        status: "failed",
        error: { code: "server_error", message: "provider down" },
      },
    });
  });

  it("heartbeats are valid in-progress events", () => {
    const encoder = responsesStreamEncoder(echo, new Map());
    const [beat] = parseSse(encoder.heartbeat());
    expect(beat).toMatchObject({
      type: "response.in_progress",
      response: { id: "resp_test" },
    });
  });
});

describe("tool result ordering", () => {
  it("moves a user note between a call and its output to after the output (Codex apply_patch warning)", () => {
    const converted = convertResponsesInput({
      instructions: null,
      text: null,
      input: [
        { role: "user", content: "edit" },
        { type: "function_call", call_id: "c1", name: "exec_command", arguments: "{}" },
        { role: "user", content: "Warning: use the apply_patch tool" },
        { type: "function_call_output", call_id: "c1", output: "ok" },
        { type: "function_call", call_id: "c2", name: "exec_command", arguments: "{}" },
      ],
    });
    expect(converted.ok && converted.messages.map((m) => m.role)).toEqual([
      "user",
      "assistant",
      "tool",
      "user",
      "assistant",
      "tool",
    ]);
    // the unanswered trailing call gets a stand-in result, orphans are dropped
    expect(converted.ok && converted.messages[5]).toMatchObject({
      role: "tool",
      content: [{ toolCallId: "c2", output: { type: "text" } }],
    });
    const orphan = convertResponsesInput({
      instructions: null,
      text: null,
      input: [
        { role: "user", content: "hi" },
        { type: "function_call_output", call_id: "gone", output: "x" },
      ],
    });
    expect(orphan.ok && orphan.messages.map((m) => m.role)).toEqual(["user"]);
  });
});
