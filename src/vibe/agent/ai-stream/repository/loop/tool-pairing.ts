/**
 * Tool-call / tool-result pairing in a step prompt.
 *
 * The AI SDK rejects a prompt in which a (non provider-executed) tool call has
 * no tool result before the next user/system message or the end of the
 * prompt (AI_MissingToolResultsError, thrown while building the step request,
 * which kills the whole turn). These helpers mirror that exact rule so the
 * loop can name the offending call and answer it before the SDK throws.
 */

import type { ModelMessage } from "ai";

export interface UnansweredToolCall {
  toolCallId: string;
  toolName: string;
  /** Index of the assistant message that issued the call. */
  messageIndex: number;
  /** What closed the call without a result: a user/system message or the end of the prompt. */
  closedBy: "user" | "system" | "end";
}

/** Tool calls the AI SDK would reject as missing a result (same rule as convertToLanguageModelPrompt). */
export function findUnansweredToolCalls(
  messages: readonly ModelMessage[],
): UnansweredToolCall[] {
  const pending = new Map<string, { toolName: string; messageIndex: number }>();
  const unanswered: UnansweredToolCall[] = [];
  const close = (closedBy: UnansweredToolCall["closedBy"]): void => {
    for (const [toolCallId, call] of pending) {
      unanswered.push({ toolCallId, ...call, closedBy });
    }
    pending.clear();
  };
  messages.forEach((message, messageIndex) => {
    switch (message.role) {
      case "assistant":
        if (typeof message.content === "string") {
          return;
        }
        for (const part of message.content) {
          if (part.type === "tool-call" && !part.providerExecuted) {
            pending.set(part.toolCallId, {
              toolName: part.toolName,
              messageIndex,
            });
          }
        }
        return;
      case "tool":
        for (const part of message.content) {
          if (part.type === "tool-result") {
            pending.delete(part.toolCallId);
          }
        }
        return;
      case "user":
      case "system":
        if (pending.size > 0) {
          close(message.role);
        }
        return;
    }
  });
  if (pending.size > 0) {
    close("end");
  }
  return unanswered;
}

export const MISSING_TOOL_RESULT_TEXT =
  "No result for this call is available in the conversation context. Treat it as not executed; call the tool again if you still need its output.";

/**
 * Insert an error tool result right after the assistant message of every
 * unanswered call, so the prompt is valid. Returns a new array.
 */
export function answerMissingToolResults(
  messages: readonly ModelMessage[],
  unanswered: readonly UnansweredToolCall[],
): ModelMessage[] {
  const byMessage = new Map<number, UnansweredToolCall[]>();
  for (const call of unanswered) {
    byMessage.set(call.messageIndex, [
      ...(byMessage.get(call.messageIndex) ?? []),
      call,
    ]);
  }
  const repaired: ModelMessage[] = [];
  messages.forEach((message, index) => {
    repaired.push(message);
    const calls = byMessage.get(index);
    if (calls) {
      repaired.push({
        role: "tool",
        content: calls.map((call) => ({
          type: "tool-result" as const,
          toolCallId: call.toolCallId,
          toolName: call.toolName,
          output: {
            type: "error-text" as const,
            value: MISSING_TOOL_RESULT_TEXT,
          },
        })),
      });
    }
  });
  return repaired;
}
