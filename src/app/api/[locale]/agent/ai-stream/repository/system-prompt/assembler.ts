/**
 * System Prompt Assembler
 *
 * Isomorphic — no server-only imports. Works on both client and server.
 * Joins pre-built leading fragments into the final system prompt string.
 * Also builds the trailing system message injected before [Context:] each turn.
 *
 * All content lives in each module's system-prompt/prompt.ts.
 * This file only assembles — no hardcoded prompt content here.
 */

export const CONTINUE_CONVERSATION_PROMPT =
  "Respond to the previous AI message naturally, as if you were a user engaging with it. Provide your thoughts, feedback, or follow-up based on what was said. Do not ask questions or try to drive the conversation - simply respond to what the AI said.";

export function generateSystemPrompt(params: {
  leadingFragments: Array<{ priority: number; str: string }>;
}): string {
  const { leadingFragments } = params;
  return leadingFragments
    .toSorted((a, b) => a.priority - b.priority)
    .map((f) => f.str)
    .join("\n\n");
}

export function buildTrailingSystemMessage(params: {
  trailingFragments?: string[];
  completedTasksSummary?: string | null;
  voiceTranscription?: {
    wasTranscribed: boolean;
    confidence: number | null;
  } | null;
}): string {
  const currentParts: string[] = [];

  if (params.voiceTranscription?.wasTranscribed) {
    const confidence = params.voiceTranscription.confidence;
    const confidenceNote =
      confidence !== null && confidence !== undefined
        ? ` (confidence: ${Math.round(confidence * 100)}%)`
        : "";
    currentParts.push(
      `[STT] The preceding user message was transcribed from speech${confidenceNote}. It may contain transcription errors — interpret with flexibility for homophones, mis-heard words, missing punctuation, and minor word substitutions.`,
    );
  }

  if (params.completedTasksSummary?.trim()) {
    currentParts.push(params.completedTasksSummary.trim());
  }

  const stateParts = (params.trailingFragments ?? []).filter((s) => s?.trim());
  const allParts = [...currentParts];

  if (stateParts.length > 0) {
    allParts.push(
      `[State boundary: the following was captured before this turn and may reflect an earlier tool-loop state]\n\n${stateParts.join("\n\n")}`,
    );
  }

  return allParts.join("\n\n");
}
