"use client";

import type { SystemPromptClientParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

import type { WebData } from "./prompt";

/**
 * Client-side web data stub for system prompt.
 * Returns defaults — the server injects actual data per turn.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Client stub; params unused, server injects data per turn
export function useWebData(params: SystemPromptClientParams): WebData {
  return {
    hasBrowser: false,
    isCloud: true,
  };
}
