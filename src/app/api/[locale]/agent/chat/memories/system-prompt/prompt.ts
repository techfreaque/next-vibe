/* eslint-disable i18next/no-literal-string */

import type { SystemPromptFragment } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import {
  MEMORY_DELETE_ALIAS,
  MEMORY_UPDATE_ALIAS,
} from "@/app/api/[locale]/agent/chat/memories/[id]/constants";
import { MEMORY_LIST_ALIAS } from "@/app/api/[locale]/agent/chat/memories/constants";
import { MEMORY_ADD_ALIAS } from "@/app/api/[locale]/agent/chat/memories/create/constants";
import type { MemoriesList } from "@/app/api/[locale]/agent/chat/memories/definition";
import { MEMORY_SEARCH_ALIAS } from "@/app/api/[locale]/agent/chat/memories/search/constants";

export interface MemoriesData {
  memories: MemoriesList;
  /** Max total tokens for all memory content (null = use default) */
  memoryLimit: number | null;
  /** Whether the user is near the memory token limit (>= 90%) */
  nearLimit?: boolean;
  /** Current total token usage */
  totalTokens?: number;
}

/** Default total char budget when no limit is configured (~1000 tokens) */
const DEFAULT_MEMORY_BUDGET_TOKENS = 1000;
const CHARS_PER_TOKEN = 4;

export const memoriesFragment: SystemPromptFragment<MemoriesData> = {
  id: "memories",
  placement: "trailing",
  priority: 200,
  build: (data) => {
    const { memories, memoryLimit, nearLimit, totalTokens } = data;
    const totalBudgetTokens = memoryLimit ?? DEFAULT_MEMORY_BUDGET_TOKENS;
    const totalBudgetChars = totalBudgetTokens * CHARS_PER_TOKEN;

    const management = `**Memory tools:** \`${MEMORY_ADD_ALIAS}\` (new facts) · \`${MEMORY_UPDATE_ALIAS} id=N\` (merge/fix, or hide with isArchived) · \`${MEMORY_DELETE_ALIAS} id=N\` (remove) · \`${MEMORY_LIST_ALIAS}\` (full detail) · \`${MEMORY_SEARCH_ALIAS}\` (search)
**Store proactively:** name, preferences, goals, expertise, ongoing projects, communication style. Don't wait to be asked.
**Self-manage:** consolidate duplicates (>80% overlap → UPDATE highest-priority first, then DELETE or archive leftovers). Archive low-value memories with \`isArchived=true\` to hide them without losing them.`;

    const nearLimitNotice =
      nearLimit && totalTokens !== undefined
        ? `\n⚠️ **Memory near limit** (${totalTokens.toLocaleString()} / 10,000 tokens used). Consolidate or archive old memories before adding new ones.\n`
        : "";

    if (memories.length === 0) {
      return `## User Memories (0)
No memories yet - store useful facts immediately as you learn them.

${management}`;
    }

    // Sort by priority desc, then newest first
    const sorted = [...memories].toSorted((a, b) => {
      const pDiff = (b.priority ?? 0) - (a.priority ?? 0);
      if (pDiff !== 0) {
        return pDiff;
      }
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    // Equal truncation: each memory gets the same char budget
    const perMemoryBudget = Math.floor(totalBudgetChars / sorted.length);

    const lines = sorted.map((m) => {
      const tagStr =
        m.tags && m.tags.length > 0 ? ` [${m.tags.join(",")}]` : "";
      const prefix = `[${m.id}|P:${m.priority ?? 0}] `;
      const suffix = tagStr;
      const contentBudget = perMemoryBudget - prefix.length - suffix.length - 1;
      const content =
        contentBudget > 0 && m.content.length > contentBudget
          ? `${m.content.slice(0, contentBudget - 1)}…`
          : m.content;
      return `${prefix}${content}${suffix}`;
    });

    return `## User Memories (${memories.length})
${nearLimitNotice}${lines.join("\n")}

${management}`;
  },
};
