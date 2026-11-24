import { expect, it } from "bun:test";

import { summarizePromptToolHistory } from "./prompt-size";

it("counts unanswered, unmatched and reused calls without exposing tool input or IDs", () => {
  const summary = summarizePromptToolHistory([
    {
      role: "assistant",
      content: [
        { type: "tool-call", toolCallId: "a", toolName: "one", input: {} },
        { type: "tool-call", toolCallId: "a", toolName: "one", input: {} },
      ],
    },
    {
      role: "tool",
      content: [
        {
          type: "tool-result",
          toolCallId: "a",
          toolName: "one",
          output: { type: "text", value: "private" },
        },
        {
          type: "tool-result",
          toolCallId: "b",
          toolName: "two",
          output: { type: "text", value: "private" },
        },
      ],
    },
  ]);
  expect(summary).toEqual({
    calls: 2,
    results: 2,
    unanswered: 1,
    unmatchedResults: 1,
    reusedCallIds: 1,
  });
});
