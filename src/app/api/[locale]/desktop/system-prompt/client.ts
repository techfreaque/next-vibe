"use client";

import type { SystemPromptClientParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

import { DesktopPlatform } from "./prompt";
import type { DesktopData } from "./prompt";

// Desktop env detection requires server-side process.env — not available client-side.
// Return null so the fragment is skipped in client-rendered debug panels.
export function useDesktopData(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params: SystemPromptClientParams,
): DesktopData {
  return {
    isAdmin: false,
    desktopEnv: null,
    platform: DesktopPlatform.UNKNOWN,
    monitors: [],
  };
}
