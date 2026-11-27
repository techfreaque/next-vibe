import type { DefaultFolderId } from "next-vibe/core/execution-context";

import { DEFAULT_FOLDER_CONFIGS } from "../../../../../../chat/config";

/**
 * Space colors. Same per-root palette as the committed root picker and the
 * compose button (chat/folders widget ROOT_FOLDER_COLOR_MAP), so a space keeps
 * one color everywhere in the app. Class names stay literal for Tailwind.
 */
export interface SpaceTone {
  /** Selected surface: tinted fill + readable text. */
  tint: string;
}

/* eslint-disable i18next/no-literal-string */
const ZINC: SpaceTone = {
  tint: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
};

const TONES: Record<string, SpaceTone> = {
  sky: {
    tint: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  },
  teal: {
    tint: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  },
  amber: {
    tint: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  purple: {
    tint: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  },
  zinc: ZINC,
  green: {
    tint: "bg-green-500/15 text-success-foreground",
  },
  indigo: {
    tint: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  },
};
/* eslint-enable i18next/no-literal-string */

export function spaceTone(id: DefaultFolderId): SpaceTone {
  return TONES[DEFAULT_FOLDER_CONFIGS[id]?.color ?? "zinc"] ?? ZINC;
}
