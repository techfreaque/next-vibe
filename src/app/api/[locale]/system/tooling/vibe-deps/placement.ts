import "server-only";

/**
 * Placement model for the vibe restructure (see docs/plans/vibe-src-restructure.md).
 *
 * GOVERNING RULE (Max): `vibe deps` is a TODO LIST — it NEVER blanket-ignores.
 * Every file and every cross-scope edge gets a status. The whitelist marks things
 * RESOLVED; everything else stays actionable. `packages/` is not ignored — it's a
 * "known relocation, later" list item. Cross-domain imports are not noise — each
 * is a CANDIDATE for moving into vibe (engine or elsewhere) and must be explicitly
 * whitelisted ("allowed, stays") or it shows up as a move candidate.
 *
 * Scope for THIS round: full reorg WITHIN `system/`.
 *   - api/system/ is treated as the future `vibe/` folder.
 *   - packages/ stays as-is for now (relocation deferred — still listed).
 *   - endpoints/utils/primitives/tools INSIDE system may move; nothing leaves system.
 *
 * In-tool constants (not config, not file markers):
 *   1. PLACED_FILES — files already in their correct final position (RESOLVED).
 *   2. AREA_RULES — system sub-path → target vibe area (where an un-placed file goes).
 *   3. ALLOWED_EDGES — explicit allowed cross-scope import patterns (e.g. a
 *      repository importing shared code). Reported as "allowed", never hidden.
 *   4. CROSS_DOMAIN_WHITELIST — cross-domain imports reviewed and deliberately
 *      kept as-is. Anything cross-domain NOT here is flagged as a move candidate.
 */

/** Top-level src prefix that maps to the future vibe/ framework folder. */
export const SYSTEM_ROOT = "src/app/api/[locale]/system/";

/** The tool's own files — the one true skip (analyzing itself is noise). */
export const SELF_ROOT = "src/app/api/[locale]/system/tooling/vibe-deps/";

/**
 * Target vibe areas. Each maps a set of current `system/`-relative sub-paths to
 * the area they belong in after the reorg. First matching rule wins (order = most
 * specific first). Path is system-relative, e.g. "unified-interface/execute-tool".
 */
export interface AreaRule {
  /** Destination vibe area (folder name under the future vibe/). */
  area: string;
  /** system-relative path prefixes that route to this area. */
  match: ReadonlyArray<string>;
  /** Short why, shown in the move report. */
  note: string;
}

export const AREA_RULES: ReadonlyArray<AreaRule> = [
  {
    area: "engine/execute-tool",
    match: ["unified-interface/execute-tool"],
    note: "universal tool executor",
  },
  {
    area: "engine/discovery",
    match: ["help", "category.ts"],
    note: "help / tool discovery / category registry",
  },
  {
    area: "dataflow",
    match: ["unified-interface/graph-seeds.ts", "unified-interface/vibe-sense"],
    note: "vibe-sense graph engine + seeds",
  },
  {
    area: "engine",
    match: ["unified-interface/i18n"],
    note: "engine's own i18n strings",
  },
  {
    area: "engine",
    match: [
      "unified-interface/shared/endpoints",
      "unified-interface/shared/field",
      "unified-interface/shared/field-config",
      "unified-interface/shared/widgets",
      "unified-interface/shared/types",
      "unified-interface/shared/env",
      "unified-interface/shared/utils",
      "unified-interface/shared/search",
      "unified-interface/shared/server-only",
    ],
    note: "endpoint+widget engine core",
  },
  {
    area: "platforms",
    match: [
      "unified-interface/react",
      "unified-interface/cli",
      "unified-interface/mcp",
      "unified-interface/ai",
      "unified-interface/react-native",
      "unified-interface/tanstack-start",
      "unified-interface/trpc",
      "unified-interface/next-api",
      "unified-interface/electron",
      "unified-interface/vibe-frame",
    ],
    note: "per-surface adapter",
  },
  {
    area: "ui",
    match: ["unified-interface/unified-ui"],
    note: "widget renderers",
  },
  {
    area: "realtime",
    match: ["unified-interface/websocket"],
    note: "ws transport + remote-event bridge",
  },
  {
    area: "scheduling",
    match: ["unified-interface/tasks"],
    note: "tasks: cron/pulse/runner",
  },
  {
    area: "database",
    match: ["db"],
    note: "db wiring + migrate/seed/sql",
  },
  {
    area: "runtime",
    match: ["server", "middleware", "settings"],
    note: "server lifecycle + middleware + settings",
  },
  {
    area: "logger",
    match: ["logger"],
    note: "logger surface",
  },
  {
    area: "tooling/check",
    match: ["check"],
    note: "checker tooling",
  },
  {
    area: "tooling/generators",
    match: ["generators"],
    note: "codegen",
  },
  {
    area: "generated",
    match: ["generated"],
    note: "generated output → top-level src/generated",
  },
  {
    area: "tooling/builder",
    match: ["builder"],
    note: "build orchestration",
  },
  {
    area: "tooling/release",
    match: ["release-tool"],
    note: "release tooling",
  },
  {
    area: "tooling/launchpad",
    match: ["launchpad"],
    note: "multi-repo orchestration",
  },
  {
    area: "tooling/guard",
    match: ["guard"],
    note: "sandbox/process guard",
  },
];

/**
 * Files that "just move" wholesale to a different package/area and are NOT
 * whitelisted-in-place — they're a known relocation, flagged separately so the
 * move report distinguishes "reorganize" from "lift to another package".
 */
export const KNOWN_RELOCATIONS: ReadonlyArray<{
  matchPrefix: string;
  to: string;
  note: string;
}> = [
  {
    matchPrefix: "src/config",
    to: "next-vibe/config",
    note: "framework config → vibe/config (later)",
  },
];

/**
 * Files already in their correct FINAL position — the tool stays silent on these.
 * Whitelisted file-by-file as the reorg lands. Graph keys (src-relative posix).
 *
 * Starts effectively empty (the reorg hasn't begun); grows as files are moved
 * into place. The complement of this set within system/ is the move list.
 */
export const PLACED_FILES: ReadonlySet<string> = new Set<string>([
  // (none yet — populated as the system/ reorg proceeds)
]);

/**
 * Cross-domain / cross-scope edges reviewed and deliberately ALLOWED (kept as-is).
 * Two kinds:
 *   - rule patterns: structural allowances, e.g. any file importing the shared
 *     response/utils primitives, or a repository importing its own domain's shared.
 *   - explicit edges: a specific importer→target pair that's fine.
 * Anything cross-domain NOT matched here surfaces as a move CANDIDATE, never hidden.
 */
export interface AllowedEdgeRule {
  /** Substring the TARGET (imported file) must contain. */
  targetContains: string;
  /** Optional substring the SOURCE (importer) must contain. */
  sourceContains?: string;
  note: string;
}

export const ALLOWED_EDGES: ReadonlyArray<AllowedEdgeRule> = [
  // Shared response/error contract — every file legitimately depends on it.
  {
    targetContains: "shared/types/response.schema",
    note: "core response contract",
  },
  { targetContains: "shared/utils", note: "shared utils primitive" },
  // i18n engine is a framework primitive everything uses.
  { targetContains: "i18n/core/", note: "i18n engine primitive" },
  // The endpoint engine types are framework-core; allowed from anywhere for now.
  {
    targetContains: "unified-interface/shared/types/enums",
    note: "engine enums primitive",
  },
];

/**
 * Cross-domain imports explicitly whitelisted as reviewed-and-fine (importer →
 * target file substrings). Distinct from ALLOWED_EDGES: these are case-by-case
 * decisions, each a deliberate "stays" rather than "move to vibe".
 */
export const CROSS_DOMAIN_WHITELIST: ReadonlyArray<{
  sourceContains: string;
  targetContains: string;
  note: string;
}> = [
  // (populated as cross-domain edges are reviewed)
];

export interface MoveTarget {
  /** Destination area, or null when no rule matches (needs a human decision). */
  area: string | null;
  note: string;
  kind: "reorganize" | "relocate";
}

/**
 * Per-file status verdict. NOTHING is silently ignored — every file resolves to
 * one of these, which is what makes the report a complete TODO list.
 */
export type FileStatus =
  | "self" // the deps tool's own files — the only true skip
  | "placed" // whitelisted: already in final position (resolved)
  | "needs-move" // in system scope, not yet placed → has a destination
  | "relocate-later" // packages/ etc. — known relocation, deferred (still listed)
  | "domain"; // outside system, a product domain (not this round's move)

/** The tool's own files — the single legitimate skip. */
export function isSelf(key: string): boolean {
  return key.startsWith(SELF_ROOT);
}

/** Is this key inside the system/ scope for this round? */
export function isInSystem(key: string): boolean {
  return key.startsWith(SYSTEM_ROOT);
}

/** True when the file is whitelisted as already in its final position. */
export function isPlaced(key: string): boolean {
  return PLACED_FILES.has(key);
}

/**
 * A file is "at target" when its system-relative path already begins with the
 * area it resolves to — i.e. it has been moved into its intra-system home. This
 * auto-whitelists moved files without listing each one; the reorg is done when
 * nothing in system/ is left classified needs-move.
 */
/** All distinct target area names (system-relative), longest first. */
const TARGET_AREAS: ReadonlyArray<string> = [
  ...new Set(AREA_RULES.map((r) => r.area)),
].toSorted((a, b) => b.length - a.length);

export function isAtTarget(key: string): boolean {
  if (!isInSystem(key)) {
    return false;
  }
  const sysRel = key.slice(SYSTEM_ROOT.length);
  return TARGET_AREAS.some(
    (area) => sysRel === area || sysRel.startsWith(`${area}/`),
  );
}

/** Classify every file — the basis of the complete TODO list. */
export function classifyFile(key: string): FileStatus {
  if (isSelf(key)) {
    return "self";
  }
  if (isPlaced(key) || isAtTarget(key)) {
    return "placed";
  }
  for (const rel of KNOWN_RELOCATIONS) {
    if (key.startsWith(rel.matchPrefix)) {
      return "relocate-later";
    }
  }
  if (isInSystem(key)) {
    return "needs-move";
  }
  return "domain";
}

/** Resolve where a not-yet-placed file should move. */
export function resolveMoveTarget(key: string): MoveTarget {
  for (const rel of KNOWN_RELOCATIONS) {
    if (key.startsWith(rel.matchPrefix)) {
      return { area: rel.to, note: rel.note, kind: "relocate" };
    }
  }
  if (isInSystem(key)) {
    const sysRel = key.slice(SYSTEM_ROOT.length);
    for (const rule of AREA_RULES) {
      if (rule.match.some((m) => sysRel === m || sysRel.startsWith(`${m}/`))) {
        return { area: rule.area, note: rule.note, kind: "reorganize" };
      }
    }
    return {
      area: null,
      note: "no area rule — needs decision",
      kind: "reorganize",
    };
  }
  return { area: null, note: "outside system scope", kind: "reorganize" };
}

/** Is an import edge an explicitly allowed cross-scope pattern? Returns the note. */
export function allowedEdgeNote(source: string, target: string): string | null {
  for (const r of ALLOWED_EDGES) {
    if (
      target.includes(r.targetContains) &&
      (!r.sourceContains || source.includes(r.sourceContains))
    ) {
      return r.note;
    }
  }
  for (const w of CROSS_DOMAIN_WHITELIST) {
    if (
      source.includes(w.sourceContains) &&
      target.includes(w.targetContains)
    ) {
      return w.note;
    }
  }
  return null;
}
