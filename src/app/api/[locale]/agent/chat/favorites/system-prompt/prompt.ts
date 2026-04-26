/* eslint-disable i18next/no-literal-string */

import type { SystemPromptFragment } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import { SKILL_CREATE_ALIAS, SKILLS_LIST_ALIAS } from "../../skills/constants";
import {
  FAVORITE_CREATE_ALIAS,
  FAVORITE_DELETE_ALIAS,
  FAVORITE_UPDATE_ALIAS,
  FAVORITES_LIST_ALIAS,
} from "../constants";

export interface FavoriteSummaryItem {
  id: string;
  name: string;
  skillId: string;
  /** Localized character display name (resolved from i18n or custom character name) */
  characterName: string | null;
  modelId: string | null;
  modelInfo: string;
  isActive: boolean;
  position: number;
  useCount: number;
  lastUsedAt: Date | string | null;
}

export interface FavoritesData {
  /** null = incognito/public context (fragment suppressed); [] = available but empty (shows setup guidance) */
  favorites: FavoriteSummaryItem[] | null;
}

/** Max characters for the full favorites summary (approx 1k tokens) */
const FAVORITES_BUDGET = 2000;

function fullLine(fav: FavoriteSummaryItem): string {
  const active = fav.isActive ? " [ACTIVE]" : "";
  const model = fav.modelId ? `model:${fav.modelId}` : `model:${fav.modelInfo}`;
  const uses = fav.useCount > 0 ? ` uses:${fav.useCount}` : "";
  const lastUsed = fav.lastUsedAt
    ? ` last:${typeof fav.lastUsedAt === "string" ? fav.lastUsedAt.slice(0, 10) : fav.lastUsedAt.toISOString().slice(0, 10)}`
    : "";
  const charLabel = fav.characterName
    ? `char:${fav.characterName} (${fav.skillId})`
    : `char:${fav.skillId}`;
  return `- [${fav.id}] ${fav.name}${active} | ${charLabel} | ${model}${uses}${lastUsed}`;
}

function compactLine(fav: FavoriteSummaryItem): string {
  const active = fav.isActive ? " ★" : "";
  return `- [${fav.id}] ${fav.name}${active}`;
}

export const favoritesFragment: SystemPromptFragment<FavoritesData> = {
  id: "favorites",
  placement: "trailing",
  priority: 300,
  // Suppressed — favorites are now shown in the unified cortex tree fragment
  condition: () => false,
  build: (data) => {
    const favorites = data.favorites ?? [];

    const footer = `\nTools: \`${FAVORITES_LIST_ALIAS}\` (list) · \`${FAVORITE_CREATE_ALIAS}\` (create) · \`${FAVORITE_UPDATE_ALIAS}\` (edit) · \`${FAVORITE_DELETE_ALIAS}\` (delete) · \`${SKILL_CREATE_ALIAS}\` (new character)

**Proactive optimization:** Continuously improve the user's character + favorites setup:
- Notice patterns: if the user keeps asking for a certain style, tone, or expertise → suggest a dedicated character + favorite
- Suggest model upgrades: if a favorite uses an expensive model for simple tasks, recommend a lighter one
- Keep favorites tidy: suggest removing unused ones, renaming for clarity, or consolidating similar setups
- When a character lacks tools it clearly needs, suggest adding them to the favorite's tool config`;

    if (favorites.length === 0) {
      return `## Favorites - Not Set Up Yet

You have no saved favorites. Favorites let you save character + model + tool combinations for instant reuse.

**Why set one up:**
- Switch between specialized personas (coder, writer, analyst) in one click
- Lock a preferred model per character - no manual selection each time
- Pre-configure which tools each persona can access
- Use \`favoriteId\` in API/CLI/cron calls for zero-config AI runs

**Quick setup:**
1. Help the user find or create a character that fits their workflow (\`${SKILLS_LIST_ALIAS}\`, \`${SKILL_CREATE_ALIAS}\`)
2. Create a favorite linking that character to a model (\`${FAVORITE_CREATE_ALIAS}\`)
3. Set it as active so it loads by default

**Proactive guidance:** When you notice the user repeatedly uses a specific model or asks for a particular style, suggest creating a character + favorite for it. A well-configured favorite eliminates repetitive setup.`;
    }

    // Sort: active first, then by position
    const sorted = [...favorites].toSorted((a, b) => {
      if (a.isActive && !b.isActive) {
        return -1;
      }
      if (!a.isActive && b.isActive) {
        return 1;
      }
      return a.position - b.position;
    });

    const activeFav = sorted.find((f) => f.isActive);
    const activeNote = activeFav
      ? ` - active: "${activeFav.name}" (${activeFav.modelId ?? activeFav.modelInfo})`
      : "";

    const header = `## Favorites (${favorites.length})${activeNote}`;

    const reserved = header.length + footer.length + 80;
    let remaining = FAVORITES_BUDGET - reserved;
    const lines: string[] = [];
    let hiddenCount = 0;

    for (const fav of sorted) {
      const full = fullLine(fav);
      const compact = compactLine(fav);
      if (remaining >= full.length + 1) {
        lines.push(full);
        remaining -= full.length + 1;
      } else if (remaining >= compact.length + 1) {
        lines.push(compact);
        remaining -= compact.length + 1;
      } else {
        hiddenCount++;
      }
    }

    const parts = [header, lines.join("\n")];
    if (hiddenCount > 0) {
      parts.push(
        `[... ${hiddenCount} more favorite${hiddenCount === 1 ? "" : "s"} not shown - use \`${FAVORITES_LIST_ALIAS}\` for the full list]`,
      );
    }
    parts.push(footer);

    return parts.join("\n");
  },
};
