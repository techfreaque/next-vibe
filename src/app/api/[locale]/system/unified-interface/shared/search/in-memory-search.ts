/**
 * Shared in-memory search utility with scored multi-field ranking.
 *
 * Scoring per field:
 *   - Exact full match on field value  → weight × 3.0
 *   - All query terms present          → weight × 2.0
 *   - Each term present individually   → weight × 1.0
 *
 * Items with score 0 are filtered out. Results are sorted descending by score.
 * Multi-word queries work because each term is scored independently.
 */

export interface SearchField<T> {
  /** Extract the searchable string(s) from the item */
  get: (item: T) => string | string[];
  /** Higher weight = stronger signal. Suggested: name=1.0, tagline=0.5, description=0.3, tags=0.2 */
  weight: number;
}

export interface SearchOptions<T> {
  fields: SearchField<T>[];
  query: string;
}

/**
 * Convenience factory to create a SearchField without triggering
 * explicit-function-return-type lint errors at call sites.
 */
export function searchField<T>(
  get: (item: T) => string | string[],
  weight: number,
): SearchField<T> {
  return { get, weight };
}

/**
 * Search and rank items by relevance to the query.
 *
 * query syntax (plain text, space-separated words):
 *   - Single word:  "image"        → items containing "image" in any field
 *   - Multi-word:   "image gen"    → items where both "image" AND "gen" appear (in any field)
 *   - Case-insensitive, substring match (no regex, no boolean operators)
 *
 * Returns a new array sorted by score descending, filtered to score > 0.
 * If query is empty or whitespace-only, returns items unchanged.
 */
export function searchItems<T>(items: T[], options: SearchOptions<T>): T[] {
  const { fields, query } = options;
  const normalized = query.toLowerCase().trim();

  if (!normalized) {
    return items;
  }

  const terms = normalized.split(/\s+/).filter(Boolean);

  const scored = items.map((item) => {
    let score = 0;

    for (const field of fields) {
      const raw = field.get(item);
      const values = Array.isArray(raw) ? raw : [raw];

      for (const value of values) {
        const v = value.toLowerCase();

        // Exact full match — highest signal
        if (v === normalized) {
          score += field.weight * 3.0;
          continue;
        }

        // All terms present — strong signal
        const allPresent = terms.every((term) => v.includes(term));
        if (allPresent) {
          score += field.weight * 2.0;
          continue;
        }

        // Partial — score per matching term
        for (const term of terms) {
          if (v.includes(term)) {
            score += field.weight * 1.0;
          }
        }
      }
    }

    return { item, score };
  });

  return scored
    .filter(({ score }) => score > 0)
    .toSorted((a, b) => b.score - a.score)
    .map(({ item }) => item);
}
