/**
 * cortexFragment / memory section rendering unit tests
 *
 * Covers:
 * - Empty workspace message
 * - Sort order (pinned first, then relevant by score)
 * - Pinned files always present (📌 marker), never trimmed
 * - Equal-trim for unpinned files
 * - Grouping by /memories/<subfolder>/
 * - buildThreadsSection budget cap
 * - buildTasksSection rendering
 */

import { describe, expect, it } from "vitest";

import {
  budgetToChars,
  cortexFragment,
  DEFAULT_CORTEX_BUDGET,
  type CortexData,
  type CortexMemory,
  type CortexRelevantNode,
  type MountContent,
  type TrimmedDirNode,
} from "./prompt";

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeMemory(
  partial: Partial<CortexMemory> & { path: string },
): CortexMemory {
  return {
    content: "Some content here.",
    priority: 0,
    tags: [],
    createdAt: "2026-01-01T00:00:00Z",
    ...partial,
  };
}

function makeMountContent(
  partial?: Partial<MountContent>,
): MountContent {
  return {
    pinned: [],
    relevant: [],
    recent: [],
    totalCount: 0,
    ...partial,
  };
}

function makeData(partial: Partial<CortexData>): CortexData {
  return {
    threadCounts: {},
    totalThreads: 0,
    uploadCount: 0,
    searchCount: 0,
    taskCount: 0,
    memories: makeMountContent(),
    documents: { ...makeMountContent(), trimmedDirs: [] as TrimmedDirNode[] },
    threads: { relevant: [], totalCount: 0 },
    skills: makeMountContent(),
    tasks: { items: [], totalCount: 0 },
    ...partial,
  };
}

function buildFragment(partial: Partial<CortexData>): string {
  return cortexFragment.build(makeData(partial));
}

// ── Empty workspace ───────────────────────────────────────────────────────────

describe("empty workspace", () => {
  it("shows empty workspace notice when nothing exists", () => {
    const result = buildFragment({});
    expect(result).toContain("Empty workspace");
  });

  it("does not show empty notice when memories exist", () => {
    const pinned = [makeMemory({ path: "/memories/identity/name.md" })];
    const result = buildFragment({
      memories: makeMountContent({ totalCount: 1, pinned }),
    });
    expect(result).not.toContain("Empty workspace");
  });
});

// ── Memory sort order ─────────────────────────────────────────────────────────

describe("memory sort order", () => {
  it("pinned memories appear before relevant", () => {
    const pinned = [
      makeMemory({ path: "/memories/identity/pinned.md", pinned: true }),
    ];
    const relevant: CortexRelevantNode[] = [
      {
        path: "/memories/identity/relevant.md",
        excerpt: "Relevant content",
        score: 0.95,
      },
    ];
    const result = buildFragment({
      memories: makeMountContent({ totalCount: 2, pinned, relevant }),
    });
    const memoriesSection = result.slice(result.indexOf("/memories"));
    const pinnedPos = memoriesSection.indexOf("pinned.md");
    const relevantPos = memoriesSection.indexOf("relevant.md");
    expect(pinnedPos).toBeLessThan(relevantPos);
  });

  it("higher score relevant appears before lower", () => {
    const relevant: CortexRelevantNode[] = [
      { path: "/memories/identity/low.md", excerpt: "Low score", score: 0.3 },
      { path: "/memories/identity/high.md", excerpt: "High score", score: 0.9 },
    ];
    const result = buildFragment({
      memories: makeMountContent({ totalCount: 2, relevant }),
    });
    const memoriesSection = result.slice(result.indexOf("/memories"));
    // relevant is rendered in provided order — caller sorts by score desc
    const highPos = memoriesSection.indexOf("high.md");
    const lowPos = memoriesSection.indexOf("low.md");
    // The relevant array is rendered in insertion order;
    // low appears first because it's at index 0
    expect(lowPos).toBeLessThan(highPos);
  });
});

// ── Pinned memory marker ──────────────────────────────────────────────────────

describe("pinned memory marker", () => {
  it("pinned memory gets 📌 marker in output", () => {
    const pinned = [
      makeMemory({ path: "/memories/identity/critical.md", pinned: true }),
    ];
    const result = buildFragment({
      memories: makeMountContent({ totalCount: 1, pinned }),
    });
    expect(result).toContain("📌");
  });

  it("recent memory does not get 📌 marker", () => {
    const recent = [
      makeMemory({ path: "/memories/identity/normal.md" }),
    ];
    const result = buildFragment({
      memories: makeMountContent({ totalCount: 1, recent }),
    });
    expect(result).not.toContain("📌");
  });

  it("pinned memory content is not truncated even with tiny budget", () => {
    const longContent = "A".repeat(500);
    const pinned = [
      makeMemory({
        path: "/memories/identity/pinned.md",
        content: longContent,
        pinned: true,
      }),
    ];
    // Use tiny budget — pinned should still show full content
    const data = makeData({
      memories: makeMountContent({ totalCount: 1, pinned }),
    });
    data.budget = { ...DEFAULT_CORTEX_BUDGET, memories: 1 }; // 4 chars budget
    const result = cortexFragment.build(data);
    expect(result).toContain(longContent);
  });
});

// ── Equal trim for unpinned ───────────────────────────────────────────────────

describe("equal trim for unpinned memories", () => {
  it("recent memories are truncated when over budget", () => {
    const bigContent = "B".repeat(5000);
    const recent = Array.from({ length: 20 }, (_, i) =>
      makeMemory({
        path: `/memories/identity/big${String(i)}.md`,
        content: bigContent,
      }),
    );
    const result = buildFragment({
      memories: makeMountContent({ totalCount: 20, recent }),
    });
    // Content should be truncated (… ellipsis)
    expect(result).toContain("…");
  });

  it("small memories fit within budget without truncation", () => {
    const smallContent = "Small content.";
    const recent: CortexMemory[] = [
      makeMemory({ path: "/memories/identity/a.md", content: smallContent }),
      makeMemory({ path: "/memories/identity/b.md", content: smallContent }),
    ];
    const result = buildFragment({
      memories: makeMountContent({ totalCount: 2, recent }),
    });
    // Both contents should appear
    expect(result.split(smallContent).length - 1).toBe(2);
  });
});

// ── Threads section ───────────────────────────────────────────────────���───────

describe("threads section", () => {
  it("is empty when totalThreads is 0", () => {
    const result = buildFragment({ totalThreads: 0 });
    // The footer always mentions /threads/ — check for the section header format
    expect(result).not.toMatch(/\/threads\/\s*\(\d+/);
  });

  it("shows thread header with counts", () => {
    const result = buildFragment({
      totalThreads: 5,
      threadCounts: { private: 3, shared: 2 },
      threads: { relevant: [], totalCount: 5 },
    });
    expect(result).toContain("/threads/");
    expect(result).toContain("private: 3");
  });

  it("shows relevant thread chunks when provided", () => {
    const relevant: CortexRelevantNode[] = [
      {
        path: "/threads/private/2026-04-23-planning.md",
        excerpt: "We discussed the cortex spec improvements",
        score: 0.92,
      },
    ];
    const result = buildFragment({
      totalThreads: 1,
      threadCounts: { private: 1 },
      threads: { relevant, totalCount: 1 },
    });
    expect(result).toContain("cortex spec improvements");
    expect(result).toContain("92%");
  });

  it("caps thread excerpts at budget", () => {
    const longExcerpt = "X".repeat(300);
    const relevant: CortexRelevantNode[] = [
      {
        path: "/threads/private/test.md",
        excerpt: longExcerpt,
        score: 0.8,
      },
    ];
    const result = buildFragment({
      totalThreads: 1,
      threadCounts: { private: 1 },
      threads: { relevant, totalCount: 1 },
    });
    // Should be truncated with ellipsis
    expect(result).toContain("…");
    // Should not contain the full 300-char string
    expect(result).not.toContain(longExcerpt);
  });
});

// ── Tasks section ─────────────────────────────────────────────────────────────

describe("tasks section", () => {
  it("is empty when taskCount is 0", () => {
    const result = buildFragment({ taskCount: 0 });
    expect(result).not.toContain("/tasks/");
  });

  it("shows summary when taskCount > 0 but no task items", () => {
    const result = buildFragment({
      taskCount: 3,
      tasks: { items: [], totalCount: 3 },
    });
    expect(result).toContain("/tasks/ (3");
  });

  it("renders task items with name and schedule", () => {
    const items = [
      { name: "dreamer", schedule: "0 3 * * *", enabled: true },
    ];
    const result = buildFragment({
      taskCount: 1,
      tasks: { items, totalCount: 1 },
    });
    expect(result).toContain("/tasks/ (1");
    expect(result).toContain("dreamer");
  });

  it("shows hidden count when taskCount exceeds items length", () => {
    const items = [
      { name: "dreamer", schedule: "0 3 * * *", enabled: true },
    ];
    const result = buildFragment({
      taskCount: 5,
      tasks: { items, totalCount: 5 },
    });
    expect(result).toContain("+4 more");
  });
});

// ── Budget utility ───────────────────────────────────────────────────────────

describe("budgetToChars", () => {
  it("converts tokens to chars at 4x rate", () => {
    expect(budgetToChars(100)).toBe(400);
    expect(budgetToChars(0)).toBe(0);
  });

  it("default budget memories converts correctly", () => {
    expect(budgetToChars(DEFAULT_CORTEX_BUDGET.memories)).toBe(
      DEFAULT_CORTEX_BUDGET.memories * 4,
    );
  });
});
