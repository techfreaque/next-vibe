import "server-only";

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { toPosixPath } from "next-vibe/tooling/generators/shared/utils";

import type { VibeDepsConfig, VibeDepsViolationKind } from "./config-types";
import type {
  VibeDepsRequestOutput,
  VibeDepsResponseOutput,
} from "./definition";
import type { CheckVibeDepsT } from "./i18n";
import {
  allowedEdgeNote,
  classifyFile,
  isSelf,
  resolveMoveTarget,
} from "./placement";
import {
  buildUsageIndex,
  extractSymbols,
  type SymbolDef,
  usageFor,
} from "./symbols";

const PROJECT_ROOT = process.cwd();
const SRC_ROOT = join(PROJECT_ROOT, "src");

// Graph key = posix path relative to PROJECT_ROOT, e.g. "src/config/constants.ts"
// For files inside src/app/api/[locale]/, next-vibe/* aliases resolve to the same key.

// Canonical src-relative prefix used in graph keys
const SRC_PREFIX = "src/";

// Sentinel "package" name for any file not owned by a declared package root.
const APP_PSEUDO_PACKAGE = "app";

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  ".dist",
  "generated",
  ".tmp",
  "todelete",
  "test-project",
]);

const SKIP_FILE_SUFFIXES = [
  ".test.ts",
  ".test.tsx",
  ".spec.ts",
  ".spec.tsx",
  ".d.ts",
];

// tsconfig alias prefixes → resolved src-relative prefix
// Order matters: more specific first.
// next-vibe/* is a 2-candidate alias: system-first, then locale-root
// (mirrors tsconfig "next-vibe/*": [system/*, [locale]/*]). The system tree
// owns ui/, unified-ui/, etc., so the system candidate must be tried first.
const ALIAS_PREFIXES: ReadonlyArray<{ alias: string; resolved: string }> = [
  // next-vibe/* → src/app/api/[locale]/system/*  (framework tree, tried first)
  { alias: "next-vibe/", resolved: "src/app/api/[locale]/system/" },
  // next-vibe/* → src/app/api/[locale]/*  (locale-root fallback)
  { alias: "next-vibe/", resolved: "src/app/api/[locale]/" },
  // @/* → src/*
  { alias: "@/", resolved: "src/" },
];

function scanTsFiles(dir: string, results: string[] = []): string[] {
  if (!existsSync(dir)) {
    return results;
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        scanTsFiles(join(dir, entry.name), results);
      }
    } else if (entry.isFile()) {
      const name = entry.name;
      if (
        (name.endsWith(".ts") || name.endsWith(".tsx")) &&
        !SKIP_FILE_SUFFIXES.some((s) => name.endsWith(s))
      ) {
        results.push(toPosixPath(join(dir, name)));
      }
    }
  }
  return results;
}

/**
 * Resolve an import path to a project-root-relative posix path (no leading slash).
 * Returns null for external npm packages.
 *
 * Handles:
 *   - Alias imports:  "@/foo/bar"  →  "src/foo/bar"
 *                     "next-vibe/foo" → "src/app/api/[locale]/system/foo"
 *                                       (system-first, then [locale]/foo)
 *   - Relative imports: "../bar", "./baz" → resolved against the importer's dir
 *
 * The returned path has no extension — callers try .ts / .tsx / /index.ts etc.
 */
const RESOLVE_EXTS = [".ts", ".tsx", "/index.ts", "/index.tsx", ""] as const;

/** True when a src-relative (no-extension) candidate resolves to a real file. */
function fileExistsWithExt(srcRelPath: string): boolean {
  const abs = join(PROJECT_ROOT, srcRelPath);
  return RESOLVE_EXTS.some((ext) => existsSync(abs + ext));
}

function resolveImport(
  importPath: string,
  importerAbsPath: string,
): string | null {
  // Alias prefixes. A prefix may have multiple candidates (e.g. next-vibe/*
  // resolves system-first then locale-root); pick the first candidate that
  // resolves to a real file, else fall back to the first candidate so the
  // graph still records a (possibly unresolved) edge.
  const matches = ALIAS_PREFIXES.filter((p) => importPath.startsWith(p.alias));
  if (matches.length > 0) {
    let firstCandidate: string | null = null;
    for (const { alias, resolved } of matches) {
      const candidate = resolved + importPath.slice(alias.length);
      firstCandidate ??= candidate;
      if (fileExistsWithExt(candidate)) {
        return candidate;
      }
    }
    return firstCandidate;
  }

  // Relative imports
  if (importPath.startsWith(".")) {
    const absDir = dirname(importerAbsPath);
    const absResolved = resolve(absDir, importPath);
    const rel = relative(PROJECT_ROOT, absResolved);
    return toPosixPath(rel);
  }

  // External npm package — skip
  return null;
}

const IMPORT_RE =
  /(?:(?:import|export)\s+(?:type\s+)?[\s\S]*?from\s+|require\s*\(\s*|import\s*\(\s*)['"]([^'"]+)['"]/g;

function extractImports(source: string): string[] {
  const found = new Set<string>();
  let m: RegExpExecArray | null;
  IMPORT_RE.lastIndex = 0;
  while ((m = IMPORT_RE.exec(source)) !== null) {
    if (m[1]) {
      found.add(m[1]);
    }
  }
  return [...found];
}

/** Convert absolute posix file path → graph key (src-relative posix). */
function toGraphKey(absPath: string): string {
  const srcPrefix = `${toPosixPath(SRC_ROOT)}/`;
  if (absPath.startsWith(srcPrefix)) {
    return SRC_PREFIX + absPath.slice(srcPrefix.length);
  }
  return absPath;
}

/** Top-level category: first path segment after src/ for locale files, else first segment. */
function getCat(key: string): string {
  // "src/app/api/[locale]/user/auth/..." → "user"
  const localeKey = "src/app/api/[locale]/";
  if (key.startsWith(localeKey)) {
    return key.slice(localeKey.length).split("/")[0] ?? key;
  }
  // "src/config/constants.ts" → "src/config"
  const parts = key.split("/");
  return parts.slice(0, 2).join("/");
}

function matchesFocus(key: string, focus: string): boolean {
  return key.includes(focus);
}

// ============================================================
// Package boundary configuration
// ============================================================

/** Built-in fallback used when vibe-deps.config.ts is absent or unloadable. */
const DEFAULT_CONFIG: VibeDepsConfig = {
  packages: [
    { name: "vibe-core", roots: [] },
    {
      name: "vibe-ui",
      roots: [
        "src/app/api/[locale]/system/ui/web",
        "src/app/api/[locale]/system/ui/native",
        "src/app/api/[locale]/system/ui/cli",
        "src/app/api/[locale]/system/ui/tanstack",
      ],
    },
    {
      name: "vibe-unified-ui",
      roots: ["src/app/api/[locale]/system/unified-ui"],
    },
  ],
  allow: {
    "vibe-core": [],
    "vibe-ui": ["vibe-core"],
    "vibe-unified-ui": ["vibe-ui", "vibe-core"],
  },
  severity: {
    "out-of-package": "warn",
    "cross-package": "error",
    "reverse-direction": "error",
  },
};

function loadConfig(logger: EndpointLogger): VibeDepsConfig {
  const configPath = resolve(PROJECT_ROOT, "vibe-deps.config.ts");
  if (!existsSync(configPath)) {
    logger.info("vibe-deps: no vibe-deps.config.ts, using built-in default");
    return DEFAULT_CONFIG;
  }
  try {
    // Same convention as check.config.ts: require the TS file (Bun runs TS).
    const required: { default?: VibeDepsConfig } = require(configPath);
    const exported = required.default ?? DEFAULT_CONFIG;
    if (!Array.isArray(exported.packages)) {
      logger.error("vibe-deps: vibe-deps.config.ts malformed, using default");
      return DEFAULT_CONFIG;
    }
    return exported;
  } catch (err) {
    logger.error("vibe-deps: failed to load config", parseError(err));
    return DEFAULT_CONFIG;
  }
}

/**
 * Resolve which declared package owns a graph key.
 * A file belongs to the package whose longest matching root prefixes its key.
 * Returns APP_PSEUDO_PACKAGE for files not under any declared root.
 *
 * Exported for unit testing.
 */
export function getPackageOf(key: string, config: VibeDepsConfig): string {
  let best: { name: string; len: number } | null = null;
  for (const pkg of config.packages) {
    for (const root of pkg.roots) {
      const prefix = root.endsWith("/") ? root : `${root}/`;
      if ((key === root || key.startsWith(prefix)) && root.length > 0) {
        if (!best || root.length > best.len) {
          best = { name: pkg.name, len: root.length };
        }
      }
    }
  }
  return best ? best.name : APP_PSEUDO_PACKAGE;
}

/** Layer index of a package within the declared order (lower = more foundational). */
function layerIndex(config: VibeDepsConfig, name: string): number {
  const i = config.packages.findIndex((p) => p.name === name);
  return i;
}

/**
 * Classify a single edge (source → target) against the boundary config.
 * Returns null when the edge is legal or internal to a package / app↔app.
 *
 * Exported for unit testing.
 */
export function classifyEdge(
  sourcePkg: string,
  targetPkg: string,
  config: VibeDepsConfig,
): VibeDepsViolationKind | null {
  // Same package, or both plain app code — not a package-boundary concern.
  if (sourcePkg === targetPkg) {
    return null;
  }

  // Edge originates inside a declared package.
  const sourceIsPkg = sourcePkg !== APP_PSEUDO_PACKAGE;
  const targetIsPkg = targetPkg !== APP_PSEUDO_PACKAGE;

  if (sourceIsPkg && !targetIsPkg) {
    // Package reaching out into ordinary app code: the move-blocking violation.
    return "out-of-package";
  }

  if (sourceIsPkg && targetIsPkg) {
    const allowed = config.allow[sourcePkg] ?? [];
    if (allowed.includes(targetPkg)) {
      return null; // legal cross-package edge
    }
    // Illegal cross-package edge. If the source sits *above* the target in the
    // layer order yet isn't allowed, OR the target sits above the source
    // (lower layer importing higher = reverse), distinguish the two.
    const srcLayer = layerIndex(config, sourcePkg);
    const tgtLayer = layerIndex(config, targetPkg);
    if (srcLayer >= 0 && tgtLayer >= 0 && tgtLayer > srcLayer) {
      return "reverse-direction";
    }
    return "cross-package";
  }

  // App code importing a package, or app↔app — not a violation we track.
  return null;
}

/**
 * Classify an edge given the two file keys directly (resolves packages first).
 * Exported for unit testing.
 */
export function classifyEdgeByKey(
  sourceKey: string,
  targetKey: string,
  config: VibeDepsConfig,
): VibeDepsViolationKind | null {
  return classifyEdge(
    getPackageOf(sourceKey, config),
    getPackageOf(targetKey, config),
    config,
  );
}

interface GraphNode {
  imports: Set<string>;
  importedBy: Set<string>;
}

type Graph = Map<string, GraphNode>;

function buildGraph(files: string[], sourcesOut?: Map<string, string>): Graph {
  const graph: Graph = new Map();

  // Build path index: src-relative path variants (no ext, /index, etc.) → graph key
  const pathIndex = new Map<string, string>();

  for (const file of files) {
    const posix = toPosixPath(file);
    const key = toGraphKey(posix);
    graph.set(key, { imports: new Set(), importedBy: new Set() });

    // Register lookup variants (all without leading slash, src-relative)
    const noExt = key.replace(/\.(tsx?)$/, "");
    pathIndex.set(key, key); // full key with ext
    pathIndex.set(noExt, key); // without ext
    if (noExt.endsWith("/index")) {
      pathIndex.set(noExt.slice(0, -6), key); // without /index
    }
  }

  // Parse imports and build edges
  for (const file of files) {
    const posix = toPosixPath(file);
    const sourceKey = toGraphKey(posix);

    let source: string;
    try {
      source = readFileSync(file, "utf8");
    } catch {
      continue;
    }

    // Capture source for downstream symbol analysis (single read pass).
    if (sourcesOut) {
      sourcesOut.set(sourceKey, source);
    }

    for (const imp of extractImports(source)) {
      const resolved = resolveImport(imp, posix);
      if (!resolved) {
        continue;
      }

      const targetKey =
        pathIndex.get(resolved) ??
        pathIndex.get(`${resolved}.ts`) ??
        pathIndex.get(`${resolved}.tsx`) ??
        pathIndex.get(`${resolved}/index.ts`) ??
        pathIndex.get(`${resolved}/index.tsx`) ??
        pathIndex.get(`${resolved}.ts`.replace(".ts.ts", ".ts")) ??
        pathIndex.get(`${resolved}.tsx`.replace(".tsx.tsx", ".tsx"));

      if (targetKey && targetKey !== sourceKey) {
        graph.get(sourceKey)!.imports.add(targetKey);
        graph.get(targetKey)!.importedBy.add(sourceKey);
      }
    }
  }

  return graph;
}

function buildCategoryGraph(graph: Graph): Graph {
  const catGraph: Graph = new Map();

  for (const [key, node] of graph) {
    const cat = getCat(key);
    if (!catGraph.has(cat)) {
      catGraph.set(cat, { imports: new Set(), importedBy: new Set() });
    }
    const catNode = catGraph.get(cat)!;
    for (const imp of node.imports) {
      const impCat = getCat(imp);
      if (impCat !== cat) {
        catNode.imports.add(impCat);
      }
    }
    for (const importer of node.importedBy) {
      const importerCat = getCat(importer);
      if (importerCat !== cat) {
        catNode.importedBy.add(importerCat);
      }
    }
  }

  return catGraph;
}

function graphToJson(
  graph: Graph,
): Record<string, { imports: string[]; importedBy: string[] }> {
  const out: Record<string, { imports: string[]; importedBy: string[] }> = {};
  for (const [key, node] of graph) {
    out[key] = {
      imports: [...node.imports].toSorted(),
      importedBy: [...node.importedBy].toSorted(),
    };
  }
  return out;
}

function writeDependenciesJson(graph: Graph, logger: EndpointLogger): void {
  try {
    const outPath = join(PROJECT_ROOT, "dependencies.json");
    const data = {
      generatedAt: new Date().toISOString(),
      totalFiles: graph.size,
      totalEdges: [...graph.values()].reduce((s, n) => s + n.imports.size, 0),
      graph: graphToJson(graph),
    };
    writeFileSync(outPath, JSON.stringify(data, null, 2), "utf8");
    logger.info(`vibe-deps: wrote ${outPath}`);
  } catch (err) {
    logger.error(
      "vibe-deps: failed to write dependencies.json",
      parseError(err),
    );
  }
}

// ============================================================
// Result entry shape
// ============================================================

interface DepsEntry {
  path: string;
  imports: string[];
  importedBy: string[];
  importCount: number;
  importedByCount: number;
  isUnused: boolean;
  // Boundary/layer/shared-candidate context (optional, mode-dependent):
  sourcePackage?: string;
  targetPackage?: string;
  violationKind?: VibeDepsViolationKind;
  // Files driving this entry (importers that violate / packages depending on it).
  offenders?: string[];
  // Move/symbol lens context (optional, mode-dependent):
  moveTo?: string; // destination area for needs-move
  moveNote?: string; // why / which rule
  moveKind?: "reorganize" | "relocate";
  symbol?: string; // unused-symbols: the dead export name
  symbolKind?: string; // class / function / const / type / static-method
  symbolOwner?: string; // owning class for static methods
}

interface PackageGroup {
  package: string;
  violationCount: number;
  entries: DepsEntry[];
}

interface ViolationSummary {
  outOfPackage: number;
  crossPackage: number;
  reverseDirection: number;
  total: number;
}

function emptyViolations(): ViolationSummary {
  return { outOfPackage: 0, crossPackage: 0, reverseDirection: 0, total: 0 };
}

// ============================================================
// Lens: boundaries / layers
// ============================================================

interface BoundaryEdge {
  sourcePkg: string;
  targetPkg: string;
  source: string; // importing file
  target: string; // imported file
  kind: VibeDepsViolationKind;
}

/** Walk the whole graph and collect every package-boundary-violating edge. */
function collectBoundaryEdges(
  graph: Graph,
  config: VibeDepsConfig,
): BoundaryEdge[] {
  const edges: BoundaryEdge[] = [];
  for (const [source, node] of graph) {
    const sourcePkg = getPackageOf(source, config);
    if (sourcePkg === APP_PSEUDO_PACKAGE) {
      continue; // only edges leaving a declared package matter
    }
    for (const target of node.imports) {
      const targetPkg = getPackageOf(target, config);
      const kind = classifyEdge(sourcePkg, targetPkg, config);
      if (kind && config.severity[kind] !== "off") {
        edges.push({ sourcePkg, targetPkg, source, target, kind });
      }
    }
  }
  return edges;
}

/**
 * Boundaries lens: group out-of-package + cross-package edges per source
 * package, rolled up by *target file* (the shared dependency), most-pulled
 * target first — that ranking is the "pull this into a package" signal.
 */
function buildBoundaryGroups(
  edges: BoundaryEdge[],
  onlyPackage: string | undefined,
): PackageGroup[] {
  // package → target → { kind, targetPkg, offenders:Set }
  const byPkg = new Map<
    string,
    Map<
      string,
      {
        kind: VibeDepsViolationKind;
        targetPkg: string;
        offenders: Set<string>;
      }
    >
  >();

  for (const e of edges) {
    if (onlyPackage && e.sourcePkg !== onlyPackage) {
      continue;
    }
    let targets = byPkg.get(e.sourcePkg);
    if (!targets) {
      targets = new Map();
      byPkg.set(e.sourcePkg, targets);
    }
    const existing = targets.get(e.target);
    if (existing) {
      existing.offenders.add(e.source);
    } else {
      targets.set(e.target, {
        kind: e.kind,
        targetPkg: e.targetPkg,
        offenders: new Set([e.source]),
      });
    }
  }

  const groups: PackageGroup[] = [];
  for (const [pkg, targets] of byPkg) {
    const entries: DepsEntry[] = [];
    for (const [target, info] of targets) {
      const offenders = [...info.offenders].toSorted();
      entries.push({
        path: target,
        imports: [],
        importedBy: offenders,
        importCount: 0,
        importedByCount: offenders.length,
        isUnused: false,
        sourcePackage: pkg,
        targetPackage: info.targetPkg,
        violationKind: info.kind,
        offenders,
      });
    }
    // Most-pulled target first.
    entries.sort((a, b) =>
      b.importedByCount !== a.importedByCount
        ? b.importedByCount - a.importedByCount
        : a.path.localeCompare(b.path),
    );
    const violationCount = entries.reduce((s, e) => s + e.importedByCount, 0);
    groups.push({ package: pkg, violationCount, entries });
  }

  // Most-violating package first.
  groups.sort((a, b) => b.violationCount - a.violationCount);
  return groups;
}

/**
 * Layers lens: only cross-package + reverse-direction edges (illegal direction
 * between two declared packages). One entry per offending edge.
 */
function buildLayerEntries(
  edges: BoundaryEdge[],
  onlyPackage: string | undefined,
): DepsEntry[] {
  const entries: DepsEntry[] = [];
  for (const e of edges) {
    if (e.kind === "out-of-package") {
      continue;
    }
    if (onlyPackage && e.sourcePkg !== onlyPackage) {
      continue;
    }
    entries.push({
      path: e.target,
      imports: [],
      importedBy: [e.source],
      importCount: 0,
      importedByCount: 1,
      isUnused: false,
      sourcePackage: e.sourcePkg,
      targetPackage: e.targetPkg,
      violationKind: e.kind,
      offenders: [e.source],
    });
  }
  entries.sort((a, b) => a.path.localeCompare(b.path));
  return entries;
}

/**
 * Shared-candidates lens: app-code files ranked by how many *package* files
 * import them. High count = a primitive the packages already depend on and
 * that should move into a package (vibe-core).
 */
function buildSharedCandidates(
  graph: Graph,
  config: VibeDepsConfig,
): DepsEntry[] {
  const entries: DepsEntry[] = [];
  for (const [key, node] of graph) {
    if (getPackageOf(key, config) !== APP_PSEUDO_PACKAGE) {
      continue; // candidate must currently live in app code
    }
    const pkgImporters = [...node.importedBy].filter(
      (imp) => getPackageOf(imp, config) !== APP_PSEUDO_PACKAGE,
    );
    if (pkgImporters.length === 0) {
      continue;
    }
    const sorted = pkgImporters.toSorted();
    entries.push({
      path: key,
      imports: [...node.imports].toSorted(),
      importedBy: sorted,
      importCount: node.imports.size,
      importedByCount: pkgImporters.length,
      isUnused: false,
      offenders: sorted,
    });
  }
  entries.sort((a, b) =>
    b.importedByCount !== a.importedByCount
      ? b.importedByCount - a.importedByCount
      : a.path.localeCompare(b.path),
  );
  return entries;
}

/**
 * Importers lens: for a focused file, break its importedBy down by package /
 * category so "central vibe" vs "domain-specific cross-import" is visible.
 */
function buildImporterBreakdown(
  graph: Graph,
  config: VibeDepsConfig,
  focusKeys: string[],
): DepsEntry[] {
  const entries: DepsEntry[] = [];
  for (const focusKey of focusKeys) {
    const node = graph.get(focusKey);
    if (!node) {
      continue;
    }
    // group importers by package-or-category
    const byGroup = new Map<string, string[]>();
    for (const imp of node.importedBy) {
      const pkg = getPackageOf(imp, config);
      const group = pkg === APP_PSEUDO_PACKAGE ? getCat(imp) : pkg;
      const arr = byGroup.get(group) ?? [];
      arr.push(imp);
      byGroup.set(group, arr);
    }
    const groupList = [...byGroup.entries()].toSorted((a, b) =>
      b[1].length !== a[1].length
        ? b[1].length - a[1].length
        : a[0].localeCompare(b[0]),
    );
    for (const [group, importers] of groupList) {
      entries.push({
        path: `${focusKey}  ◂ ${group}`,
        imports: [],
        importedBy: importers.toSorted(),
        importCount: 0,
        importedByCount: importers.length,
        isUnused: false,
        targetPackage: group,
        offenders: importers.toSorted(),
      });
    }
  }
  return entries;
}

// ============================================================
// Lens: needs-move (the reorg move-list driver)
// ============================================================

/**
 * For every file in scope that is NOT already placed, report where it should
 * move. Ordered top-to-bottom by destination area, then path — so the output
 * reads as the move list to execute. Files already in their correct final
 * position (the in-tool whitelist) are silent.
 */
function buildNeedsMove(graph: Graph): DepsEntry[] {
  const entries: DepsEntry[] = [];
  for (const key of graph.keys()) {
    const status = classifyFile(key);
    // The TODO list covers everything actionable. The ONLY silent skips are the
    // tool's own files and files already placed (resolved). `needs-move` and
    // `relocate-later` both appear — packages/ is listed, never blanket-ignored.
    if (status === "self" || status === "placed" || status === "domain") {
      continue;
    }
    const target = resolveMoveTarget(key);
    const node = graph.get(key)!;
    entries.push({
      path: key,
      imports: [],
      importedBy: [...node.importedBy].toSorted(),
      importCount: node.imports.size,
      importedByCount: node.importedBy.size,
      isUnused: node.importedBy.size === 0,
      moveTo: target.area ?? "(undecided)",
      moveNote: target.note,
      moveKind: target.kind,
    });
  }
  // Group by destination area (the move batches), then path.
  entries.sort((a, b) => {
    const aa = a.moveTo ?? "";
    const bb = b.moveTo ?? "";
    return aa !== bb ? aa.localeCompare(bb) : a.path.localeCompare(b.path);
  });
  return entries;
}

// ============================================================
// Lens: cross-domain candidates (entanglements to review)
// ============================================================

/**
 * Every cross-domain import edge that is NOT an allowed pattern. Each is a
 * candidate to move into vibe (engine/core) or otherwise decouple — surfaced as
 * a TODO, never hidden. Grouped by target (the shared thing being reached for),
 * most-reached first — that ranking is the "promote this" signal.
 *
 * "domain" here = top-level category from getCat(); an edge crossing categories
 * where neither side is the same is cross-domain. Allowed framework primitives
 * (response.schema, shared utils, i18n core, engine enums) are reported under a
 * separate allowed tally so the count of *real* candidates is honest.
 */
function buildCrossDomain(graph: Graph): {
  entries: DepsEntry[];
  allowedCount: number;
} {
  // target → { cat, importers:Map<sourceCat, Set<file>> }
  const byTarget = new Map<string, { importers: Map<string, Set<string>> }>();
  let allowedCount = 0;

  for (const [source, node] of graph) {
    if (isSelf(source)) {
      continue;
    }
    const srcCat = getCat(source);
    for (const target of node.imports) {
      if (isSelf(target)) {
        continue;
      }
      const tgtCat = getCat(target);
      if (srcCat === tgtCat) {
        continue; // intra-domain — fine
      }
      if (allowedEdgeNote(source, target)) {
        allowedCount++;
        continue; // explicitly allowed primitive — counted, not listed
      }
      let rec = byTarget.get(target);
      if (!rec) {
        rec = { importers: new Map() };
        byTarget.set(target, rec);
      }
      const set = rec.importers.get(srcCat) ?? new Set<string>();
      set.add(source);
      rec.importers.set(srcCat, set);
    }
  }

  const entries: DepsEntry[] = [];
  for (const [target, rec] of byTarget) {
    const allImporters = [...rec.importers.values()].flatMap((s) => [...s]);
    const fromCats = [...rec.importers.keys()].toSorted();
    entries.push({
      path: target,
      imports: [],
      importedBy: allImporters.toSorted(),
      importCount: 0,
      importedByCount: allImporters.length,
      isUnused: false,
      targetPackage: getCat(target),
      // reuse moveNote to carry the "reached from N domains" signal
      moveNote: `from ${String(fromCats.length)} domains: ${fromCats.join(", ")}`,
      offenders: allImporters.toSorted(),
    });
  }
  // Most-reached target first (strongest candidate to promote).
  entries.sort((a, b) =>
    b.importedByCount !== a.importedByCount
      ? b.importedByCount - a.importedByCount
      : a.path.localeCompare(b.path),
  );
  return { entries, allowedCount };
}

// ============================================================
// Lens: unused public surface (dead exports + dead static methods)
// ============================================================

/**
 * Flag exported symbols and static methods that nothing references (dead public
 * surface), plus whole files with zero importers. Regex-based — reported as
 * review signals, conservative (under-reports rather than over-claims dead code).
 * `onlyScope` restricts to a path prefix (default: system/ for the reorg).
 */
function buildUnusedSymbols(
  sources: ReadonlyMap<string, string>,
  graph: Graph,
  onlyScope: string | undefined,
  includeSingleUse: boolean,
): DepsEntry[] {
  const index = buildUsageIndex(sources);
  const entries: DepsEntry[] = [];

  for (const [file, src] of sources) {
    if (isSelf(file)) {
      continue;
    }
    if (onlyScope && !file.includes(onlyScope)) {
      continue;
    }
    const symbols: SymbolDef[] = extractSymbols(file, src);
    for (const sym of symbols) {
      // Skip endpoint-boilerplate exports that the framework wires by convention
      // (route handlers, definitions) — they look "unused" but are loaded dynamically.
      if (sym.name === "POST" || sym.name === "GET" || sym.name === "default") {
        continue;
      }
      const usage = usageFor(sym, index);
      const threshold = includeSingleUse ? 1 : 0;
      if (usage.usageCount <= threshold) {
        entries.push({
          path: file,
          imports: [],
          importedBy: usage.usedInFiles,
          importCount: 0,
          importedByCount: usage.usageCount,
          isUnused: usage.usageCount === 0,
          symbol: sym.name,
          symbolKind: sym.kind,
          symbolOwner: sym.owner,
          offenders: usage.usedInFiles,
        });
      }
    }
  }

  // Dead files (zero importers) within scope, as their own entries.
  for (const [key, node] of graph) {
    if (isSelf(key) || node.importedBy.size !== 0) {
      continue;
    }
    if (onlyScope && !key.includes(onlyScope)) {
      continue;
    }
    entries.push({
      path: key,
      imports: [...node.imports].toSorted(),
      importedBy: [],
      importCount: node.imports.size,
      importedByCount: 0,
      isUnused: true,
      symbol: "(whole file)",
      symbolKind: "file",
    });
  }

  // Most-dead first: 0-use before 1-use, then by path.
  entries.sort((a, b) =>
    a.importedByCount !== b.importedByCount
      ? a.importedByCount - b.importedByCount
      : a.path.localeCompare(b.path),
  );
  return entries;
}

function summarize(edges: BoundaryEdge[]): ViolationSummary {
  let outOfPackage = 0;
  let crossPackage = 0;
  let reverseDirection = 0;
  for (const e of edges) {
    if (e.kind === "out-of-package") {
      outOfPackage++;
    } else if (e.kind === "cross-package") {
      crossPackage++;
    } else {
      reverseDirection++;
    }
  }
  return {
    outOfPackage,
    crossPackage,
    reverseDirection,
    total: outOfPackage + crossPackage + reverseDirection,
  };
}

function writeBoundariesJson(
  groups: PackageGroup[],
  summary: ViolationSummary,
  config: VibeDepsConfig,
  logger: EndpointLogger,
): void {
  try {
    const outPath = join(PROJECT_ROOT, "dependencies-boundaries.json");
    const data = {
      generatedAt: new Date().toISOString(),
      packages: config.packages.map((p) => ({ name: p.name, roots: p.roots })),
      allow: config.allow,
      summary,
      groups: groups.map((g) => ({
        package: g.package,
        violationCount: g.violationCount,
        targets: g.entries.map((e) => ({
          target: e.path,
          kind: e.violationKind,
          importerCount: e.importedByCount,
          importers: e.importedBy,
        })),
      })),
    };
    writeFileSync(outPath, JSON.stringify(data, null, 2), "utf8");
    logger.info(`vibe-deps: wrote ${outPath}`);
  } catch (err) {
    logger.error(
      "vibe-deps: failed to write dependencies-boundaries.json",
      parseError(err),
    );
  }
}

// ============================================================
// Repository
// ============================================================

export class VibeDepsRepository {
  static async execute(
    data: VibeDepsRequestOutput,
    logger: EndpointLogger,
    t: CheckVibeDepsT,
  ): Promise<ResponseType<VibeDepsResponseOutput>> {
    try {
      const { focus, mode, depth, limit, package: onlyPackage } = data;
      const effectiveDepth = depth ?? 1;
      const effectiveLimit = limit ?? 100;
      const view = mode ?? "files";

      // Scan all of src/. Capture sources only for symbol-level modes (reuses
      // the single read pass instead of re-reading every file).
      const needsSources = mode === "unused-symbols" || mode === "needs-move";
      const sources = needsSources ? new Map<string, string>() : undefined;
      const allFiles = scanTsFiles(SRC_ROOT);
      const graph = buildGraph(allFiles, sources);

      // Always write the full file-level dependencies.json
      writeDependenciesJson(graph, logger);

      // Whole-graph stats (always from the full file graph)
      const totalFiles = graph.size;
      let totalEdges = 0;
      let unusedCount = 0;
      for (const node of graph.values()) {
        totalEdges += node.imports.size;
        if (node.importedBy.size === 0) {
          unusedCount++;
        }
      }

      // ── Reorg move-list ─────────────────────────────────────
      if (mode === "needs-move") {
        const entries = buildNeedsMove(graph).slice(0, effectiveLimit);
        logger.info(`vibe-deps: needs-move — ${entries.length} files to move`);
        return success({
          view,
          entries,
          groups: [],
          violations: emptyViolations(),
          totalFiles,
          totalEdges,
          unusedCount,
        });
      }

      // ── Cross-domain candidates (entanglements to review) ──
      if (mode === "cross-domain") {
        const { entries, allowedCount } = buildCrossDomain(graph);
        const sliced = entries.slice(0, effectiveLimit);
        logger.info(
          `vibe-deps: cross-domain — ${entries.length} candidate targets, ${allowedCount} allowed edges`,
        );
        return success({
          view,
          entries: sliced,
          groups: [],
          violations: emptyViolations(),
          totalFiles,
          totalEdges,
          unusedCount,
        });
      }

      // ── Unused public surface (dead exports + static methods + files) ──
      if (mode === "unused-symbols") {
        const scope = focus ? toPosixPath(focus) : "system/";
        const entries = buildUnusedSymbols(
          sources!,
          graph,
          scope,
          /* includeSingleUse */ false,
        ).slice(0, effectiveLimit);
        logger.info(
          `vibe-deps: unused-symbols — ${entries.length} dead symbols/files in ${scope}`,
        );
        return success({
          view,
          entries,
          groups: [],
          violations: emptyViolations(),
          totalFiles,
          totalEdges,
          unusedCount,
        });
      }

      // ── Package-boundary modes ──────────────────────────────
      if (
        mode === "boundaries" ||
        mode === "layers" ||
        mode === "shared-candidates" ||
        mode === "importers"
      ) {
        const config = loadConfig(logger);

        if (mode === "shared-candidates") {
          const candidates = buildSharedCandidates(graph, config);
          const sliced = candidates.slice(0, effectiveLimit);
          logger.info(
            `vibe-deps: ${candidates.length} shared candidates (package-imported app files)`,
          );
          return success({
            view,
            entries: sliced,
            groups: [],
            violations: {
              outOfPackage: 0,
              crossPackage: 0,
              reverseDirection: 0,
              total: 0,
            },
            totalFiles,
            totalEdges,
            unusedCount,
          });
        }

        if (mode === "importers") {
          if (!focus) {
            return fail({
              message: t("errors.validation.description"),
              errorType: ErrorResponseTypes.BAD_REQUEST,
            });
          }
          const normalizedFocus = toPosixPath(focus);
          const focusKeys = [...graph.keys()].filter((k) =>
            matchesFocus(k, normalizedFocus),
          );
          if (focusKeys.length === 0) {
            return fail({
              message: t("errors.notFound.description"),
              messageParams: { focus },
              errorType: ErrorResponseTypes.NOT_FOUND,
            });
          }
          const entries = buildImporterBreakdown(
            graph,
            config,
            focusKeys.slice(0, 25),
          ).slice(0, effectiveLimit);
          return success({
            view,
            entries,
            groups: [],
            violations: {
              outOfPackage: 0,
              crossPackage: 0,
              reverseDirection: 0,
              total: 0,
            },
            totalFiles,
            totalEdges,
            unusedCount,
          });
        }

        // boundaries | layers
        const edges = collectBoundaryEdges(graph, config);
        const summary = summarize(edges);

        if (mode === "layers") {
          const entries = buildLayerEntries(edges, onlyPackage).slice(
            0,
            effectiveLimit,
          );
          logger.info(
            `vibe-deps: layers — ${summary.crossPackage} cross-package, ${summary.reverseDirection} reverse-direction`,
          );
          return success({
            view,
            entries,
            groups: [],
            violations: summary,
            totalFiles,
            totalEdges,
            unusedCount,
          });
        }

        // boundaries
        const groups = buildBoundaryGroups(edges, onlyPackage);
        writeBoundariesJson(groups, summary, config, logger);
        // Flatten a bounded number of entries for surfaces that ignore groups.
        const flatEntries = groups
          .flatMap((g) => g.entries)
          .slice(0, effectiveLimit);
        logger.info(
          `vibe-deps: boundaries — ${summary.total} violations (${summary.outOfPackage} out, ${summary.crossPackage} cross, ${summary.reverseDirection} reverse) across ${groups.length} packages`,
        );
        return success({
          view,
          entries: flatEntries,
          groups: groups.map((g) => ({
            package: g.package,
            violationCount: g.violationCount,
            entries: g.entries.slice(0, effectiveLimit),
          })),
          violations: summary,
          totalFiles,
          totalEdges,
          unusedCount,
        });
      }

      // ── Legacy file / category / unused modes ───────────────
      const viewGraph =
        mode === "categories" ? buildCategoryGraph(graph) : graph;

      // Apply focus filter
      let keys = [...viewGraph.keys()];
      if (focus) {
        const normalizedFocus = toPosixPath(focus);
        const focusMatches = keys.filter((k) =>
          matchesFocus(k, normalizedFocus),
        );
        if (focusMatches.length === 0) {
          return fail({
            message: t("errors.notFound.description"),
            messageParams: { focus },
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        // Expand outward by depth
        if (effectiveDepth > 0) {
          const expanded = new Set(focusMatches);
          let frontier = new Set(focusMatches);
          for (let d = 0; d < effectiveDepth; d++) {
            const next = new Set<string>();
            for (const key of frontier) {
              const node = viewGraph.get(key);
              if (!node) {
                continue;
              }
              for (const imp of node.imports) {
                if (!expanded.has(imp)) {
                  expanded.add(imp);
                  next.add(imp);
                }
              }
              for (const importer of node.importedBy) {
                if (!expanded.has(importer)) {
                  expanded.add(importer);
                  next.add(importer);
                }
              }
            }
            frontier = next;
            if (frontier.size === 0) {
              break;
            }
          }
          keys = [...expanded];
        } else {
          keys = focusMatches;
        }
      }

      // Filter unused-only mode
      if (mode === "unused") {
        keys = keys.filter((k) => {
          const node = viewGraph.get(k);
          return node && node.importedBy.size === 0;
        });
      }

      // Sort by importedBy desc (most-depended-on first), then alphabetical
      keys.sort((a, b) => {
        const aNode = viewGraph.get(a)!;
        const bNode = viewGraph.get(b)!;
        const diff = bNode.importedBy.size - aNode.importedBy.size;
        return diff !== 0 ? diff : a.localeCompare(b);
      });

      const sliced = keys.slice(0, effectiveLimit);
      const entries: DepsEntry[] = sliced.map((key) => {
        const node = viewGraph.get(key)!;
        const imports = [...node.imports].toSorted();
        const importedBy = [...node.importedBy].toSorted();
        return {
          path: key,
          imports,
          importedBy,
          importCount: imports.length,
          importedByCount: importedBy.length,
          isUnused: importedBy.length === 0,
        };
      });

      logger.info(
        `vibe-deps: ${totalFiles} files, ${totalEdges} edges, ${unusedCount} unused`,
      );

      return success({
        view,
        entries,
        groups: [],
        violations: {
          outOfPackage: 0,
          crossPackage: 0,
          reverseDirection: 0,
          total: 0,
        },
        totalFiles,
        totalEdges,
        unusedCount,
      });
    } catch (error) {
      logger.error("vibe-deps error", parseError(error));
      return fail({
        message: t("errors.internal.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
