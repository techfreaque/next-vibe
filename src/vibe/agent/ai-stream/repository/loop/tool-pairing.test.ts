import { describe, expect, it } from "bun:test";
import type { ModelMessage } from "ai";

import {
  answerMissingToolResults,
  findUnansweredToolCalls,
  MISSING_TOOL_RESULT_TEXT,
} from "./tool-pairing";

const prompt: ModelMessage[] = [
  {
    role: "assistant",
    content: [
      { type: "text", text: "summary" },
      { type: "tool-call", toolCallId: "lost", toolName: "execute-tool", input: {} },
    ],
  },
  { role: "system", content: "Previous conversation summary:\n\n..." },
  {
    role: "assistant",
    content: [
      { type: "tool-call", toolCallId: "kept", toolName: "execute-tool", input: {} },
    ],
  },
  {
    role: "tool",
    content: [
      {
        type: "tool-result",
        toolCallId: "kept",
        toolName: "execute-tool",
        output: { type: "text", value: "ok" },
      },
    ],
  },
];

describe("tool-pairing", () => {
  it("names the call the AI SDK would reject, and what closed it", () => {
    expect(findUnansweredToolCalls(prompt)).toEqual([
      {
        toolCallId: "lost",
        toolName: "execute-tool",
        messageIndex: 0,
        closedBy: "system",
      },
    ]);
  });

  it("answers a missing result right after its call so the prompt is valid", () => {
    const repaired = answerMissingToolResults(
      prompt,
      findUnansweredToolCalls(prompt),
    );
    expect(findUnansweredToolCalls(repaired)).toEqual([]);
    expect(repaired).toHaveLength(prompt.length + 1);
    expect(repaired[1]).toEqual({
      role: "tool",
      content: [
        {
          type: "tool-result",
          toolCallId: "lost",
          toolName: "execute-tool",
          output: { type: "error-text", value: MISSING_TOOL_RESULT_TEXT },
        },
      ],
    });
  });

  it("ignores provider-executed calls and flags calls open at the end", () => {
    expect(
      findUnansweredToolCalls([
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              toolCallId: "p",
              toolName: "web_search",
              input: {},
              providerExecuted: true,
            },
            { type: "tool-call", toolCallId: "open", toolName: "x", input: {} },
          ],
        },
      ]).map((c) => [c.toolCallId, c.closedBy]),
    ).toEqual([["open", "end"]]);
  });
});
