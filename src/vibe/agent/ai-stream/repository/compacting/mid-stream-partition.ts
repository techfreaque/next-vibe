/**
 * Split accumulated step messages for mid-stream compacting into
 * system / head (kept verbatim) / middle (summarized) / recent (kept verbatim).
 *
 * Pure so the cut rules are unit-testable: every tool call kept verbatim must
 * keep its tool result, or the next step dies with AI_MissingToolResultsError.
 */

import type { ModelMessage } from "ai";

import { findUnansweredToolCalls } from "../loop/tool-pairing";

/** How many recent non-system messages to preserve verbatim (not summarized). */
export const RECENT_TURNS_TO_KEEP = 8;

export interface MidStreamPartition {
  systemMessages: ModelMessage[];
  /** Original task prompt, plus the tool results its tool calls need. */
  head: ModelMessage[];
  middleTurns: ModelMessage[];
  recentTurns: ModelMessage[];
}

function hasToolCalls(message: ModelMessage | undefined): boolean {
  return (
    message?.role === "assistant" &&
    Array.isArray(message.content) &&
    message.content.some((part) => part.type === "tool-call")
  );
}

export function partitionForMidStreamCompacting(
  stepMessages: readonly ModelMessage[],
): MidStreamPartition {
  const systemMessages = stepMessages.filter((m) => m.role === "system");
  const nonSystemMessages = stepMessages.filter((m) => m.role !== "system");

  // Always preserve the first non-system message (the original task prompt)
  // verbatim. After an earlier compacting it is NOT a user message: history
  // starts at the stored summary (an assistant text), and the next turn's
  // tool calls get merged into it by toAiSdkMessages - so it can carry tool
  // calls whose results are the following `tool` messages. Keep those results
  // with it, never summarize them away (prod 2026-11-25: a kept head call
  // without its result killed the turn with AI_MissingToolResultsError).
  let headEnd = Math.min(1, nonSystemMessages.length);
  while (nonSystemMessages[headEnd]?.role === "tool") {
    headEnd++;
  }
  const head = nonSystemMessages.slice(0, headEnd);
  const afterHead = nonSystemMessages.slice(headEnd);

  // Take the last RECENT_TURNS_TO_KEEP messages as the "recent" tail. The cut
  // must land on a clean boundary:
  // 1. Never start `recentTurns` on a `tool` result - it needs its preceding
  //    `assistant` tool-call message (AI_MissingToolResultsError otherwise).
  // 2. Never END `middleTurns` on an `assistant` with tool-call parts - it
  //    needs the following `tool` results (AI_InvalidPromptError otherwise).
  let cutIndex = Math.max(0, afterHead.length - RECENT_TURNS_TO_KEEP);
  while (cutIndex > 0 && afterHead[cutIndex]?.role === "tool") {
    cutIndex--;
  }
  while (cutIndex > 0 && hasToolCalls(afterHead[cutIndex - 1])) {
    cutIndex--;
    while (cutIndex > 0 && afterHead[cutIndex]?.role === "tool") {
      cutIndex--;
    }
  }

  return {
    systemMessages,
    head,
    middleTurns: afterHead.slice(0, cutIndex),
    recentTurns: afterHead.slice(cutIndex),
  };
}

/** The prompt the next step will see after compacting with this summary. */
export function buildMidStreamCompactedMessages(
  partition: MidStreamPartition,
  compactedSummary: string,
): ModelMessage[] {
  return [
    ...partition.systemMessages,
    ...partition.head,
    {
      role: "system" as const,
      content: `Previous conversation summary:\n\n${compactedSummary}`,
    },
    ...partition.recentTurns,
  ];
}

/** Tool calls the compacted prompt would leave without a result (empty = safe). */
export function unansweredAfterCompacting(
  partition: MidStreamPartition,
): ReturnType<typeof findUnansweredToolCalls> {
  return findUnansweredToolCalls(
    buildMidStreamCompactedMessages(partition, ""),
  );
}
