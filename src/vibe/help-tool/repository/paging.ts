/**
 * Result-set size thresholds shared by every help surface.
 *
 * These are properties of how much detail a consumer can absorb, not of which
 * platforms a build ships — a fork with a different platform set still wants the
 * same "few results ⇒ full schemas, many results ⇒ categories only" ladder.
 */

export const COMPACT_DEFAULT_PAGE_SIZE = 100;
export const HUMAN_DEFAULT_PAGE_SIZE = 800;

/** If a filtered result set is ≤ this many tools, auto-upgrade to full detail (params + examples) */
export const COMPACT_FULL_DETAIL_THRESHOLD = 5;

/** For AI/MCP: if matchedCount exceeds this, return only categories (no tool names) to save tokens */
export const COMPACT_CATEGORY_ONLY_THRESHOLD = 100;
