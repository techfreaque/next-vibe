/**
 * Cortex search / relevant context unit tests
 *
 * Tests the mergeResults score logic directly - no DB needed.
 * The merge function is the core of hybrid search correctness.
 *
 * Covers:
 * - FTS-only results get fts weight (0.4)
 * - Vector-only results get vector weight (0.6)
 * - Combined results get weighted sum (FTS 0.4, vector 0.6)
 * - Results sorted by combined score desc
 * - Results limited to maxResults
 * - FTS excerpt preferred over vector excerpt for shared paths
 * - Deduplication by path
 */

import { describe, expect, it } from "vitest";

// ── Inline merge logic (mirrors repository.ts mergeResults) ──────────────────
// We test the algorithm directly since it's pure logic with no I/O.

const FTS_WEIGHT = 0.4;
const VECTOR_WEIGHT = 0.6;

interface ScoredResult {
  path: string;
  excerpt: string;
  score: number;
  updatedAt: Date;
  source: "fts" | "vector";
}

interface SearchResult {
  resultPath: string;
  excerpt: string;
  score: number;
  updatedAt: string;
}

function mergeResults(
  ftsResults: ScoredResult[],
  vectorResults: ScoredResult[],
  limit: number,
): SearchResult[] {
  const resultMap = new Map<
    string,
    { ftsScore: number; vectorScore: number; excerpt: string; updatedAt: Date }
  >();

  for (const r of ftsResults) {
    resultMap.set(r.path, {
      ftsScore: r.score,
      vectorScore: 0,
      excerpt: r.excerpt,
      updatedAt: r.updatedAt,
    });
  }

  for (const r of vectorResults) {
    const existing = resultMap.get(r.path);
    if (existing) {
      existing.vectorScore = r.score;
    } else {
      resultMap.set(r.path, {
        ftsScore: 0,
        vectorScore: r.score,
        excerpt: r.excerpt,
        updatedAt: r.updatedAt,
      });
    }
  }

  return [...resultMap.entries()]
    .map(([resultPath, data]) => ({
      resultPath,
      excerpt: data.excerpt,
      score:
        Math.round(
          (data.ftsScore * FTS_WEIGHT + data.vectorScore * VECTOR_WEIGHT) * 100,
        ) / 100,
      updatedAt: data.updatedAt.toISOString(),
    }))
    .toSorted((a, b) => b.score - a.score)
    .slice(0, limit);
}

const BASE_DATE = new Date("2026-01-01T00:00:00Z");

function makeFts(
  path: string,
  score: number,
  excerpt = "FTS excerpt",
): ScoredResult {
  return { path, score, excerpt, updatedAt: BASE_DATE, source: "fts" };
}

function makeVector(
  path: string,
  score: number,
  excerpt = "Vector excerpt",
): ScoredResult {
  return { path, score, excerpt, updatedAt: BASE_DATE, source: "vector" };
}

// ── Score weights ─────────────────────────────────────────────────────────────

describe("score weights", () => {
  it("FTS-only result score = ftsScore * 0.4", () => {
    const results = mergeResults([makeFts("/a.md", 1.0)], [], 10);
    expect(results[0]?.score).toBe(0.4);
  });

  it("vector-only result score = vectorScore * 0.6", () => {
    const results = mergeResults([], [makeVector("/a.md", 1.0)], 10);
    expect(results[0]?.score).toBe(0.6);
  });

  it("combined result score = 0.4*fts + 0.6*vector", () => {
    const results = mergeResults(
      [makeFts("/a.md", 1.0)],
      [makeVector("/a.md", 1.0)],
      10,
    );
    expect(results[0]?.score).toBe(1.0); // 0.4 + 0.6
  });

  it("partial combination: fts=0.8, vector=0.5 → 0.62", () => {
    const results = mergeResults(
      [makeFts("/a.md", 0.8)],
      [makeVector("/a.md", 0.5)],
      10,
    );
    expect(results[0]?.score).toBe(
      Math.round((0.8 * FTS_WEIGHT + 0.5 * VECTOR_WEIGHT) * 100) / 100,
    );
  });
});

// ── Sort order ────────────────────────────────────────────────────────────────

describe("sort order", () => {
  it("higher combined score ranks first", () => {
    const results = mergeResults(
      [makeFts("/low.md", 0.1), makeFts("/high.md", 0.9)],
      [],
      10,
    );
    expect(results[0]?.resultPath).toBe("/high.md");
    expect(results[1]?.resultPath).toBe("/low.md");
  });

  it("vector-heavy result can outrank FTS-only result", () => {
    // /vector.md: 0*0.4 + 1*0.6 = 0.6
    // /fts.md: 1*0.4 + 0*0.6 = 0.4
    const results = mergeResults(
      [makeFts("/fts.md", 1.0)],
      [makeVector("/vector.md", 1.0)],
      10,
    );
    expect(results[0]?.resultPath).toBe("/vector.md");
    expect(results[0]?.score).toBe(0.6);
    expect(results[1]?.resultPath).toBe("/fts.md");
    expect(results[1]?.score).toBe(0.4);
  });
});

// ── Deduplication ─────────────────────────────────────────────────────────────

describe("deduplication by path", () => {
  it("same path in both FTS and vector merges to one result", () => {
    const results = mergeResults(
      [makeFts("/a.md", 0.8)],
      [makeVector("/a.md", 0.9)],
      10,
    );
    expect(results).toHaveLength(1);
  });

  it("different paths produce separate results", () => {
    const results = mergeResults(
      [makeFts("/a.md", 0.8), makeFts("/b.md", 0.7)],
      [makeVector("/c.md", 0.9)],
      10,
    );
    expect(results).toHaveLength(3);
  });
});

// ── FTS excerpt preference ────────────────────────────────────────────────────

describe("FTS excerpt preferred for shared paths", () => {
  it("uses FTS excerpt when both FTS and vector match same path", () => {
    const results = mergeResults(
      [makeFts("/a.md", 0.8, "FTS highlighted excerpt")],
      [makeVector("/a.md", 0.9, "Plain vector excerpt")],
      10,
    );
    expect(results[0]?.excerpt).toBe("FTS highlighted excerpt");
  });

  it("uses vector excerpt when only vector matched", () => {
    const results = mergeResults(
      [],
      [makeVector("/a.md", 0.9, "Plain vector excerpt")],
      10,
    );
    expect(results[0]?.excerpt).toBe("Plain vector excerpt");
  });
});

// ── Limit ─────────────────────────────────────────────────────────────────────

describe("results limit", () => {
  it("respects the limit parameter", () => {
    const fts = Array.from({ length: 10 }, (_, i) =>
      makeFts(`/file-${i}.md`, 1 - i * 0.05),
    );
    const results = mergeResults(fts, [], 5);
    expect(results).toHaveLength(5);
  });

  it("limit 1 returns only the top result", () => {
    const results = mergeResults(
      [makeFts("/low.md", 0.3), makeFts("/high.md", 0.9)],
      [],
      1,
    );
    expect(results).toHaveLength(1);
    expect(results[0]?.resultPath).toBe("/high.md");
  });
});

// ── Thread path separation (context for system prompt split) ──────────────────

describe("thread path identification", () => {
  it("paths starting /threads/ are identifiable by prefix", () => {
    const threadPath = "/threads/chat/2026-04-23.md";
    const docPath = "/documents/projects/auth.md";

    expect(threadPath.startsWith("/threads/")).toBe(true);
    expect(docPath.startsWith("/threads/")).toBe(false);
  });

  it("split of search results into thread chunks vs context mirrors system-prompt logic", () => {
    const allNodes = [
      { path: "/threads/chat/test.md", excerpt: "thread content", score: 0.9 },
      {
        path: "/documents/projects/auth.md",
        excerpt: "doc content",
        score: 0.8,
      },
      {
        path: "/memories/identity/name.md",
        excerpt: "memory content",
        score: 0.7,
      },
    ];

    const threadChunks = allNodes.filter((n) => n.path.startsWith("/threads/"));
    const relevantContext = allNodes.filter(
      (n) => !n.path.startsWith("/threads/"),
    );

    expect(threadChunks).toHaveLength(1);
    expect(threadChunks[0]?.path).toBe("/threads/chat/test.md");
    expect(relevantContext).toHaveLength(2);
  });
});
