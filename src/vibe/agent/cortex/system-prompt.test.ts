/**
 * Unit tests for the cortex system-prompt rendering functions.
 *
 * Pure functions only - no DB, no async, deterministic.
 *
 * Covers:
 * - cleanExcerpt: frontmatter stripping, heading stripping, newline/whitespace
 *   collapse, trimming, empty input.
 * - renderCortexTree: empty workspace, files + dirs, nesting, pin/score/badge
 *   markers, hidden counts, extra leaf lines (uploads/searches/gens).
 * - cortexFragment.build: unavailable note, empty-workspace notice, language
 *   note, embedded tree, identity/metadata.
 */

import { describe, expect, it } from "vitest";

import {
  cleanExcerpt,
  type CortexDirEntry,
  type CortexFileEntry,
  cortexFragment,
  type CortexRenderData,
  type CortexUnavailableData,
  renderCortexFragment,
  renderCortexTree,
} from "./system-prompt";

// ── Factory helpers (typed against the real current types) ────────────────────

function makeFile(
  partial: Partial<CortexFileEntry> & { path: string; displayName: string },
): CortexFileEntry {
  return {
    kind: "file",
    excerpt: "",
    ...partial,
  };
}

function makeDir(
  partial: Partial<CortexDirEntry> & { path: string; displayName: string },
): CortexDirEntry {
  return {
    kind: "dir",
    totalCount: 0,
    children: [],
    hiddenCount: 0,
    ...partial,
  };
}

const DEFAULT_LOCALE_ROOTS = { memories: "/memories", documents: "/documents" };

function makeData(
  partial: Partial<Omit<CortexRenderData, "localeRoots">> & {
    localeRoots?: CortexRenderData["localeRoots"];
  } = {},
): CortexRenderData {
  return {
    tree: [],
    threadCounts: {},
    totalThreads: 0,
    uploadCount: 0,
    searchCount: 0,
    genCount: 0,
    taskCount: 0,
    languageName: undefined,
    localeRoots: DEFAULT_LOCALE_ROOTS,
    ...partial,
  };
}

function buildFragment(partial: Parameters<typeof makeData>[0] = {}): string {
  return renderCortexFragment(makeData(partial));
}

function buildUnavailable(unavailableNote: string): string {
  const data: CortexUnavailableData = { unavailableNote };
  return renderCortexFragment(data);
}

// ── cleanExcerpt ──────────────────────────────────────────────────────────────

describe("cleanExcerpt", () => {
  it("returns plain text untouched (trimmed)", () => {
    expect(cleanExcerpt("Hello world")).toBe("Hello world");
  });

  it("returns empty string for empty input", () => {
    expect(cleanExcerpt("")).toBe("");
  });

  it("trims surrounding whitespace", () => {
    expect(cleanExcerpt("  padded text  ")).toBe("padded text");
  });

  it("strips YAML frontmatter", () => {
    const input = "---\ntitle: Foo\npinned: true\n---\nActual body text";
    expect(cleanExcerpt(input)).toBe("Actual body text");
  });

  it("strips a leading markdown heading", () => {
    const input = "# My Heading\nBody after heading";
    expect(cleanExcerpt(input)).toBe("Body after heading");
  });

  it("strips multi-level leading heading (###)", () => {
    expect(cleanExcerpt("### Deep heading\nbody")).toBe("body");
  });

  it("collapses internal newlines into ' · ' separators", () => {
    expect(cleanExcerpt("line one\nline two\nline three")).toBe(
      "line one · line two · line three",
    );
  });

  it("collapses repeated blank lines into a single separator", () => {
    expect(cleanExcerpt("first\n\n\nsecond")).toBe("first · second");
  });

  it("collapses runs of whitespace into single spaces", () => {
    expect(cleanExcerpt("too     many    spaces")).toBe("too many spaces");
  });

  it("strips frontmatter and heading together", () => {
    const input = "---\ntitle: X\n---\n# Title\nThe content body here";
    expect(cleanExcerpt(input)).toBe("The content body here");
  });

  it("does not strip a heading that is not at the start", () => {
    // After frontmatter strip the body begins with 'Intro', so the '#' line
    // in the middle is not a leading heading and survives (joined by ' · ').
    const input = "Intro line\n# Not leading\nmore";
    expect(cleanExcerpt(input)).toBe("Intro line · # Not leading · more");
  });

  it("handles content that is only frontmatter (empty body)", () => {
    expect(cleanExcerpt("---\ntitle: only\n---\n")).toBe("");
  });
});

// ── renderCortexTree: empty / leaf cases ──────────────────────────────────────

describe("renderCortexTree - empty and leaf cases", () => {
  it("renders only the root line for a completely empty workspace", () => {
    expect(renderCortexTree(makeData())).toBe("/ (cortex)");
  });

  it("omits dirs with zero totalCount and no children", () => {
    const data = makeData({
      tree: [makeDir({ path: "/memories", displayName: "memories/" })],
    });
    expect(renderCortexTree(data)).toBe("/ (cortex)");
  });

  it("appends uploads/searches/gens leaf lines at root", () => {
    const data = makeData({ uploadCount: 3, searchCount: 2, genCount: 1 });
    const out = renderCortexTree(data);
    expect(out).toBe(
      [
        "/ (cortex)",
        "├── /uploads/ (3 - images, documents, audio, video)",
        "├── /searches/ (2 - by month)",
        "└── /gens/ (1 - images, audio, video)",
      ].join("\n"),
    );
  });

  it("omits a leaf line whose count is zero", () => {
    const out = renderCortexTree(makeData({ uploadCount: 5 }));
    expect(out).toBe(
      "/ (cortex)\n└── /uploads/ (5 - images, documents, audio, video)",
    );
    expect(out).not.toContain("/searches/");
    expect(out).not.toContain("/gens/");
  });
});

// ── renderCortexTree: dirs + files ────────────────────────────────────────────

describe("renderCortexTree - dirs and files", () => {
  it("renders a dir header with its totalCount and a single file child", () => {
    const file = makeFile({
      path: "/memories/identity/name.md",
      displayName: "name.md",
      excerpt: "User is called Max",
    });
    const dir = makeDir({
      path: "/memories",
      displayName: "memories/",
      totalCount: 1,
      children: [file],
    });
    const out = renderCortexTree(makeData({ tree: [dir] }));
    expect(out).toBe(
      [
        "/ (cortex)",
        "└── memories/ (1)",
        "    └── name.md",
        "        User is called Max",
      ].join("\n"),
    );
  });

  it("renders a file with no excerpt on a single line", () => {
    const file = makeFile({
      path: "/memories/a.md",
      displayName: "a.md",
    });
    const dir = makeDir({
      path: "/memories",
      displayName: "memories/",
      totalCount: 1,
      children: [file],
    });
    const out = renderCortexTree(makeData({ tree: [dir] }));
    expect(out).toBe("/ (cortex)\n└── memories/ (1)\n    └── a.md");
  });

  it("uses countNote in place of totalCount when present", () => {
    const dir = makeDir({
      path: "/threads",
      displayName: "threads/",
      totalCount: 48,
      countNote: "48 · 4 archived",
      children: [],
    });
    const out = renderCortexTree(makeData({ tree: [dir] }));
    expect(out).toContain("threads/ (48 · 4 archived)");
  });

  it("renders multiple dirs with branch then last connectors", () => {
    const memDir = makeDir({
      path: "/memories",
      displayName: "memories/",
      totalCount: 1,
      children: [makeFile({ path: "/memories/a.md", displayName: "a.md" })],
    });
    const docDir = makeDir({
      path: "/documents",
      displayName: "documents/",
      totalCount: 1,
      children: [makeFile({ path: "/documents/b.md", displayName: "b.md" })],
    });
    const out = renderCortexTree(makeData({ tree: [memDir, docDir] }));
    expect(out).toBe(
      [
        "/ (cortex)",
        "├── memories/ (1)",
        "│   └── a.md",
        "└── documents/ (1)",
        "    └── b.md",
      ].join("\n"),
    );
  });

  it("renders +N more when a dir hides children", () => {
    const dir = makeDir({
      path: "/memories",
      displayName: "memories/",
      totalCount: 5,
      children: [makeFile({ path: "/memories/a.md", displayName: "a.md" })],
      hiddenCount: 4,
    });
    const out = renderCortexTree(makeData({ tree: [dir] }));
    expect(out).toBe(
      [
        "/ (cortex)",
        "└── memories/ (5)",
        "    ├── a.md",
        "    └── +4 more",
      ].join("\n"),
    );
  });

  it("renders a pinned file with the 📌 marker and no score", () => {
    const file = makeFile({
      path: "/memories/critical.md",
      displayName: "critical.md",
      pinned: true,
      score: 0.99,
    });
    const dir = makeDir({
      path: "/memories",
      displayName: "memories/",
      totalCount: 1,
      children: [file],
    });
    const out = renderCortexTree(makeData({ tree: [dir] }));
    expect(out).toContain("[📌] critical.md");
    // pinned suppresses the score badge
    expect(out).not.toContain("%");
  });

  it("renders a score percentage for unpinned scored files", () => {
    const file = makeFile({
      path: "/memories/relevant.md",
      displayName: "relevant.md",
      score: 0.834,
    });
    const dir = makeDir({
      path: "/memories",
      displayName: "memories/",
      totalCount: 1,
      children: [file],
    });
    const out = renderCortexTree(makeData({ tree: [dir] }));
    expect(out).toContain("relevant.md [83%]");
  });

  it("renders favored and created badges", () => {
    const dir = makeDir({
      path: "/skills",
      displayName: "skills/",
      totalCount: 3,
      children: [
        makeFile({
          path: "/skills/x.md",
          displayName: "x.md",
          favored: true,
          created: true,
        }),
        makeFile({ path: "/skills/y.md", displayName: "y.md", favored: true }),
        makeFile({ path: "/skills/z.md", displayName: "z.md", created: true }),
      ],
    });
    const out = renderCortexTree(makeData({ tree: [dir] }));
    expect(out).toContain("x.md (★ created)");
    expect(out).toContain("y.md (★)");
    expect(out).toContain("z.md (created)");
  });
});

// ── renderCortexTree: nesting (sub-directories) ───────────────────────────────

describe("renderCortexTree - nested sub-directories", () => {
  it("renders a sub-dir header with file count and its file children", () => {
    const subDir = makeDir({
      path: "/documents/inbox",
      displayName: "inbox/",
      totalCount: 2,
      children: [
        makeFile({ path: "/documents/inbox/a.md", displayName: "a.md" }),
        makeFile({ path: "/documents/inbox/b.md", displayName: "b.md" }),
      ],
    });
    const docDir = makeDir({
      path: "/documents",
      displayName: "documents/",
      totalCount: 2,
      children: [subDir],
    });
    const out = renderCortexTree(makeData({ tree: [docDir] }));
    expect(out).toBe(
      [
        "/ (cortex)",
        "└── documents/ (2)",
        "    └── inbox/ (2 files)",
        "        ├── a.md",
        "        └── b.md",
      ].join("\n"),
    );
  });

  it("renders +N more inside a sub-dir with hidden children", () => {
    const subDir = makeDir({
      path: "/documents/inbox",
      displayName: "inbox/",
      totalCount: 10,
      children: [
        makeFile({ path: "/documents/inbox/a.md", displayName: "a.md" }),
      ],
      hiddenCount: 9,
    });
    const docDir = makeDir({
      path: "/documents",
      displayName: "documents/",
      totalCount: 10,
      children: [subDir],
    });
    const out = renderCortexTree(makeData({ tree: [docDir] }));
    expect(out).toContain("inbox/ (10 files)");
    expect(out).toContain("+9 more");
  });
});

// ── renderCortexTree: special characters ──────────────────────────────────────

describe("renderCortexTree - special characters", () => {
  it("preserves special characters in display names and excerpts", () => {
    const file = makeFile({
      path: "/memories/weird-name (v2).md",
      displayName: "weird-name (v2).md",
      excerpt: "Excerpt with emoji 🚀 and symbols <>&",
    });
    const dir = makeDir({
      path: "/memories",
      displayName: "memories/",
      totalCount: 1,
      children: [file],
    });
    const out = renderCortexTree(makeData({ tree: [dir] }));
    expect(out).toContain("weird-name (v2).md");
    expect(out).toContain("Excerpt with emoji 🚀 and symbols <>&");
  });
});

// ── cortexFragment metadata ───────────────────────────────────────────────────

describe("cortexFragment metadata", () => {
  it("has the expected id, placement and priority", () => {
    expect(cortexFragment.id).toBe("cortex");
    expect(cortexFragment.placement).toBe("trailing");
    expect(cortexFragment.priority).toBe(190);
  });
});

// ── cortexFragment.build: unavailable ─────────────────────────────────────────

describe("cortexFragment.build - unavailable", () => {
  it("returns only the unavailable note when set", () => {
    const out = buildUnavailable("Cortex is disabled in incognito mode.");
    expect(out).toBe("## Cortex\nCortex is disabled in incognito mode.");
  });
});

// ── cortexFragment.build: empty workspace ─────────────────────────────────────

describe("cortexFragment.build - empty workspace", () => {
  it("shows the empty-workspace notice when nothing exists", () => {
    const out = buildFragment();
    expect(out).toContain("Empty workspace");
    expect(out).toContain("/memories/identity/ right now");
  });

  it("respects custom locale memories root in the empty notice", () => {
    const out = buildFragment({
      localeRoots: { memories: "/erinnerungen", documents: "/dokumente" },
    });
    expect(out).toContain("/erinnerungen/identity/ right now");
  });

  it("does not show the empty notice when memories exist", () => {
    const memDir = makeDir({
      path: "/memories",
      displayName: "memories/",
      totalCount: 1,
      children: [
        makeFile({
          path: "/memories/identity/name.md",
          displayName: "name.md",
          pinned: true,
        }),
      ],
    });
    const out = buildFragment({ tree: [memDir] });
    expect(out).not.toContain("Empty workspace");
  });

  it("does not show the empty notice when only uploads exist", () => {
    const out = buildFragment({ uploadCount: 1 });
    expect(out).not.toContain("Empty workspace");
  });
});

// ── cortexFragment.build: structure and content ───────────────────────────────

describe("cortexFragment.build - structure and content", () => {
  it("includes the cortex header and tool aliases", () => {
    const out = buildFragment();
    expect(out).toContain("## Cortex (Your Persistent Brain)");
    expect(out).toContain("cortex-write");
    expect(out).toContain("cortex-read");
    expect(out).toContain("cortex-search");
    expect(out).toContain("cortex-list");
  });

  it("embeds the rendered tree from renderCortexTree", () => {
    const dir = makeDir({
      path: "/memories",
      displayName: "memories/",
      totalCount: 1,
      children: [
        makeFile({
          path: "/memories/a.md",
          displayName: "a.md",
          excerpt: "hello",
        }),
      ],
    });
    const data = makeData({ tree: [dir] });
    const out = renderCortexFragment(data);
    expect(out).toContain(renderCortexTree(data));
    expect(out).toContain("memories/ (1)");
  });

  it("includes the language note only when languageName is set", () => {
    const withLang = buildFragment({ languageName: "German" });
    expect(withLang).toContain(
      "Write all content in German - the user's language.",
    );
    const withoutLang = buildFragment();
    expect(withoutLang).not.toContain("the user's language");
  });

  it("uses locale roots in the writable paths note", () => {
    const out = buildFragment({
      localeRoots: { memories: "/erinnerungen", documents: "/dokumente" },
      languageName: "German",
    });
    expect(out).toContain("/erinnerungen/ (knowledge)");
    expect(out).toContain("/dokumente/ (working files)");
  });

  it("defaults writable paths to /memories and /documents", () => {
    const out = buildFragment();
    expect(out).toContain("/memories/ (knowledge)");
    expect(out).toContain("/documents/ (working files)");
  });
});
