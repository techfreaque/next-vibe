/**
 * Favorites Summary Formatter
 * Isomorphic functions that work on both client and server
 * IMPORTANT: No database imports or server-only code allowed
 */

/* eslint-disable i18next/no-literal-string */

export interface FavoriteSummaryItem {
  id: string;
  name: string;
  characterId: string;
  /** Localized character display name (resolved from i18n or custom character name) */
  characterName: string | null;
  modelId: string | null;
  modelInfo: string;
  isActive: boolean;
  position: number;
  useCount: number;
  lastUsedAt: Date | string | null;
}

/** Max characters for the full favorites summary (approx 1k tokens) */
const FAVORITES_BUDGET = 2000;

/**
 * Format a single favorite as a full line.
 */
function fullLine(fav: FavoriteSummaryItem): string {
  const active = fav.isActive ? " [ACTIVE]" : "";
  const model = fav.modelId ? `model:${fav.modelId}` : `model:${fav.modelInfo}`;
  const uses = fav.useCount > 0 ? ` uses:${fav.useCount}` : "";
  const lastUsed = fav.lastUsedAt
    ? ` last:${typeof fav.lastUsedAt === "string" ? fav.lastUsedAt.slice(0, 10) : fav.lastUsedAt.toISOString().slice(0, 10)}`
    : "";
  const charLabel = fav.characterName
    ? `char:${fav.characterName} (${fav.characterId})`
    : `char:${fav.characterId}`;
  return `- [${fav.id.slice(-8)}] ${fav.name}${active} | ${charLabel} | ${model}${uses}${lastUsed}`;
}

/**
 * Format a single favorite as a compact line.
 */
function compactLine(fav: FavoriteSummaryItem): string {
  const active = fav.isActive ? " ★" : "";
  return `- [${fav.id.slice(-8)}] ${fav.name}${active}`;
}

/**
 * Format favorites list into a system prompt summary string.
 * Single source of truth (isomorphic — works on client and server).
 *
 * Strategy:
 * - Active favorite first, then by position
 * - Full lines up to budget, then compact, then hard cut
 */
export function formatFavoritesSummary(
  favorites: FavoriteSummaryItem[],
): string {
  if (favorites.length === 0) {
    return "";
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
    ? ` — active: "${activeFav.name}" (${activeFav.modelId ?? activeFav.modelInfo})`
    : "";

  const header = `## Favorites (${favorites.length})${activeNote}`;
  const footer = `\nTools: agent_chat_favorites_GET (list) · agent_chat_favorites_create_POST (create) · agent_chat_favorites_[id]_PATCH (edit) · agent_chat_favorites_[id]_DELETE (delete)\n\n**Self-management:** After completing the user's request, keep favorites tidy — suggest removing unused ones, renaming for clarity, or creating new ones based on patterns you notice.`;

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
      `[... ${hiddenCount} more favorite${hiddenCount === 1 ? "" : "s"} not shown — use agent_chat_favorites_GET for the full list]`,
    );
  }
  parts.push(footer);

  return parts.join("\n");
}
