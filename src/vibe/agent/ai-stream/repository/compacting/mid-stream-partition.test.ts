import { describe, expect, it } from "bun:test";
import type { ModelMessage } from "ai";

import { findUnansweredToolCalls } from "../loop/tool-pairing";
import {
  buildMidStreamCompactedMessages,
  partitionForMidStreamCompacting,
  unansweredAfterCompacting,
} from "./mid-stream-partition";

function call(id: string): ModelMessage {
  return {
    role: "assistant",
    content: [
      { type: "tool-call", toolCallId: id, toolName: "execute-tool", input: {} },
    ],
  };
}

function result(id: string): ModelMessage {
  return {
    role: "tool",
    content: [
      {
        type: "tool-result",
        toolCallId: id,
        toolName: "execute-tool",
        output: { type: "text", value: "ok" },
      },
    ],
  };
}

/** A tool step: one assistant with N calls, then one tool message per result. */
function step(prefix: string, count: number): ModelMessage[] {
  const ids = Array.from({ length: count }, (_, i) => `${prefix}-${i}`);
  return [
    {
      role: "assistant",
      content: ids.map((id) => ({
        type: "tool-call" as const,
        toolCallId: id,
        toolName: "execute-tool",
        input: {},
      })),
    },
    ...ids.map(result),
  ];
}

describe("partitionForMidStreamCompacting", () => {
  // Prod 2026-11-25 (thread 5fa0b649): the history started at an earlier
  // compacting summary, and the next turn's first tool call was merged into
  // that summary assistant message. Mid-stream compacting kept that message
  // verbatim as the "task prompt" but summarized its tool result away ->
  // AI_MissingToolResultsError for chatcmpl-tool-bf3782eb1e6ff3b2.
  const history: ModelMessage[] = [
    { role: "system", content: "[Context: ...]" },
    {
      role: "assistant",
      content: [
        { type: "text", text: "Previous summary" },
        {
          type: "tool-call",
          toolCallId: "chatcmpl-tool-bf3782eb1e6ff3b2",
          toolName: "execute-tool",
          input: {},
        },
      ],
    },
    result("chatcmpl-tool-bf3782eb1e6ff3b2"),
    call("a34c"),
    result("a34c"),
    { role: "assistant", content: "earlier answer" },
    { role: "user", content: "next question" },
    ...step("s0", 10),
    ...step("s1", 8),
    ...step("s2", 7),
  ];

  it("keeps the tool results of a head message that carries tool calls", () => {
    const partition = partitionForMidStreamCompacting(history);
    expect(partition.head).toHaveLength(2);
    expect(partition.head[1]?.role).toBe("tool");
    expect(partition.middleTurns.length).toBeGreaterThan(0);
    expect(unansweredAfterCompacting(partition)).toEqual([]);
    const compacted = buildMidStreamCompactedMessages(partition, "summary");
    expect(findUnansweredToolCalls(compacted)).toEqual([]);
  });

  it("keeps a plain user task prompt as the only head message", () => {
    const partition = partitionForMidStreamCompacting([
      { role: "user", content: "task" },
      ...step("a", 2),
      ...step("b", 2),
      ...step("c", 2),
      ...step("d", 2),
    ]);
    expect(partition.head).toEqual([{ role: "user", content: "task" }]);
    expect(partition.recentTurns[0]?.role).toBe("assistant");
    expect(unansweredAfterCompacting(partition)).toEqual([]);
  });
});
