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
  domainOf,
  isCategoryImporter,
  isGeneratedImporter,
  isSelf,
  isUiPageImporter,
  placementOf,
  usageProfile,
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

// BLACKLIST, not whitelist: the scan walks the WHOLE PROJECT from cwd (so that
// root-level config files like release.config.ts / build.config.ts / vibe-
// deps.config.ts — which import types from src/ — count as importers and keep
// those types from looking dead). Only genuinely-irrelevant trees are skipped.
// Everything not listed IS scanned, including src/, scripts/, types/, root
// *.config.ts.
//
// SKIP_DIRS_ANYWHERE: names that can never hold app source, safe to skip at any
// depth (a `public/` build dir, `.git`, etc.). Kept minimal + unambiguous.
const SKIP_DIRS_ANYWHERE = new Set([
  "node_modules",
  ".git",
  ".next",
  ".next-prod",
  "dist",
  ".dist",
  // NOTE: "generated" is intentionally NOT skipped. Generated registries
  // (route-handlers, tasks-index, seeds, endpoint) are how the framework loads
  // route.ts / task.ts / definition.ts / seed files by convention — their
  // imports are the ONLY thing that keeps those files from looking "dead". We
  // scan generated as an IMPORTER source, but never propose a generated file
  // itself as a move/dead candidate (see isGenerated).
  ".tmp",
  "todelete",
  "test-project",
  ".vscode",
  ".idea",
  "coverage",
]);
// SKIP_DIRS_ROOT_ONLY: names that ARE legitimate path segments deeper in the
// tree (e.g. `user/public/`, an endpoint's `docs/`), so they must be skipped
// ONLY when they sit directly at the project root. Skipping them anywhere would
// wrongly drop real source subtrees (the bug this replaced: `public` matched
// `user/public/**`, hiding login/signup and their call sites → false deads).
const SKIP_DIRS_ROOT_ONLY = new Set([
  "docs",
  "public",
  "k8s",
  "memory",
  "false",
  "drizzle", // SQL migrations + meta journal, not TS importers of src
]);
// Retained for the test-file scan (which uses its own skip logic below).
const SKIP_DIRS = SKIP_DIRS_ANYWHERE;

/** Generated output — counts as an importer, never itself a candidate. */
function isGenerated(key: string): boolean {
  return key.includes("/generated/") || key.startsWith("src/generated/");
}

/**
 * Intentional PUBLIC API surface — the framework's widget / field-config /
 * UI-primitive trees. Their exports ARE the public contract (a widget component,
 * a *FieldConfig type, a shared schema) and are meant to be importable even when
 * no consumer currently does — many are also reached via `lazyWidget(() =>
 * import("./widget").then(m => m.XWidget))` or default-imported by the renderer,
 * so the static graph under-counts their real usage. NEVER suggest `unexport`
 * for these (dropping the export breaks the public surface, not a dead leak).
 * Truly-dead / whole-file-dead detection still applies.
 */
/** Exported for consumers OUTSIDE this codebase — skip all dead-symbol checks. */
function isVibeFrameExternalFile(key: string): boolean {
  return (
    key.endsWith("/system/platforms/vibe-frame/VibeFrameHost.tsx") ||
    key.endsWith("/system/platforms/vibe-frame/types.ts") ||
    key.endsWith("/system/platforms/vibe-frame/triggers.ts")
  );
}

/**
 * Public API surface: skip `unexport` classification (symbols here are
 * intentional contract even when not yet consumed by a static importer).
 */
function isPublicApiSurface(key: string): boolean {
  return key.includes("/system/unified-ui/") || isVibeFrameExternalFile(key);
}

/**
 * Framework entrypoints — loaded by CONVENTION (Next.js file-based routing or
 * the generated endpoint/route registry), not by a static import. A `route.ts`
 * / `page.tsx` at an app path is the framework's entry for that URL; "0 static
 * importers" is expected and does NOT mean dead. (This is not hiding: the file's
 * whole purpose is to be discovered by location.) Their exported symbols are
 * still checked for dead-symbol.
 */
// Files discovered BY CONVENTION (filename) by a generator's
// findFilesRecursively scan (see find-generator-inputs.ts) — the generated
// registry imports them, so they have no static importer of their own. Same
// "0 importers is expected" status as route.ts. Keep in sync with the
// convention scans in find-generator-inputs.ts.
const CONVENTION_LOADED_FILES = new Set([
  "route.ts",
  "route.tsx",
  "route-client.ts",
  "page.tsx",
  "layout.tsx",
  "category.ts", // → generated/categories/registry (category-index generator)
  "seeds.ts", // → seed registry
  "task.ts", // → task-index
  "task-runner.ts", // → task-index
  "skill.ts", // → skills-index
  "email.tsx", // → email-templates
  "prompt.ts", // → prompt-fragments
  "graph-seeds.ts", // → dataflow graph-seeds-index
]);

function isFrameworkEntrypoint(key: string): boolean {
  const base = key.slice(key.lastIndexOf("/") + 1);
  return CONVENTION_LOADED_FILES.has(base);
}

/**
 * Precise entrypoint rules — a file is loaded by a KNOWN framework/tool
 * mechanism (not a static import), so "0 importers" is expected and does NOT
 * mean dead. Each rule maps to one concrete loader; no fuzzy string matching
 * (that would false-negative real dead code). system-relative path (no ext).
 */
const SYSTEM_PREFIX = "src/app/api/[locale]/system/";
function isKnownEntrypoint(key: string): boolean {
  const sysRel = key.startsWith(SYSTEM_PREFIX)
    ? key.slice(SYSTEM_PREFIX.length).replace(/\.(tsx?)$/, "")
    : key.replace(/\.(tsx?)$/, "");
  return (
    // Compile-time TYPE-ASSERTION files — exhaustive checks / cross-platform
    // parity tests. They exist only to fail `tsc` if a contract drifts; nothing
    // imports them (that IS the point). Names: *.exhaustive-check, *index-test*,
    // *_index-test*, *-test-only.
    /(exhaustive-check|index-test|_index-test|-test-only|_index-tests)$/.test(
      sysRel,
    ) ||
    // oxlint JS plugins — loaded by oxlint via check.config.ts jsPlugins paths.
    /^tooling\/check\/oxlint\/plugins\/[^/]+\/src\/index$/.test(sysRel) ||
    // *.stub files — swapped in for their real module by a build alias
    // (next.config.ts / build.config.ts resolve.alias), referenced as an alias
    // VALUE string, not a normal import. e.g. McpResultFormatter.stub,
    // CliEndpointPage.stub. Never statically imported → 0 importers is expected.
    sysRel.endsWith(".stub") ||
    // ANY *.config file — consumed by its tool/runtime, never imported. Covers
    // every root-level config (build/check/vite/drizzle/release/vibe-deps/next/
    // …) without needing to enumerate each; new configs are entrypoints too.
    /(^|\/)[a-z0-9.-]+\.config$/.test(sysRel) ||
    // Root-level ambient type decls (global.d.ts, next-env.d.ts, *-env.d.ts) —
    // picked up by tsconfig, never imported.
    /(^|\/)[a-z0-9.-]*\.d$/.test(sysRel) ||
    // Electron bundle entrypoints — `bun build …/main.ts|preload.ts`.
    /^platforms\/electron\/(main|preload)$/.test(sysRel) ||
    // Vibe-frame browser bundles — build.config.ts inputs (embed script tags).
    /^platforms\/vibe-frame\/(embed|embed-package|inside-bridge)$/.test(
      sysRel,
    ) ||
    // The CLI runtime entry — invoked as the `vibe` bin, not imported.
    sysRel === "platforms/cli/vibe-runtime" ||
    // Node/Bun --require/--preload entry for the MCP server (see .mcp.*.json):
    // loaded by the runtime preload flag, never statically imported.
    sysRel === "platforms/cli/runtime/env-preload" ||
    // bun test preloads — referenced by bunfig.toml `preload`, never imported.
    /(^|\/)setup-tests$/.test(sysRel) ||
    // Launchpad + guard standalone scripts — spawned as processes.
    /^tooling\/launchpad\/src\/(index|scripts\/)/.test(sysRel) ||
    // Test fixtures — inputs for the builder's own tests, not app code.
    sysRel.includes("/test-files/") ||
    sysRel.includes("/testing/testing-suite/")
  );
}

/**
 * Platform UI mirror: files under system/ui/{cli,native,tanstack} are the
 * per-platform mirrors of system/ui/web/**, swapped in by the cli-widget-plugin
 * / bundler resolution (`next-vibe/ui/... → ui/cli/...`). They are never
 * imported directly, so they always show 0 importers — but a mirror is alive
 * iff its `ui/web/**` counterpart (same relative path) exists (the base the
 * plugin swaps). A mirror with NO web base is genuinely dead / native-only and
 * stays flagged (not hidden). Precise, not a blanket ignore.
 */
const UI_MIRROR_RE =
  /(src\/app\/api\/\[locale\]\/system\/ui\/)(cli|native|tanstack)\/(.+)$/;
function isUiMirrorWithWebBase(key: string): boolean {
  const m = UI_MIRROR_RE.exec(key);
  if (!m) {
    return false;
  }
  const webRel = `${m[1]}web/${m[3]}`.replace(/\.(tsx?)$/, "");
  return (
    existsSync(join(PROJECT_ROOT, `${webRel}.ts`)) ||
    existsSync(join(PROJECT_ROOT, `${webRel}.tsx`))
  );
}

/**
 * Collect files referenced by BUILD CONFIGS as real `src/….ts` paths: bundle
 * `input:`s AND `moduleAliases`/alias-stub values. A build.config only names
 * real build files, so ANY `"src/….ts"` literal in one is a genuine entrypoint/
 * stub — not imported, not dead. Also picks up the tsconfig `server-only` alias
 * stub. Precise (only build.config.ts + tsconfig*.json), no fuzzy matching.
 */
const SRC_PATH_LITERAL_RE = /["'](src\/[^"']+\.tsx?)["']/g;
function collectBuildInputs(sources: ReadonlyMap<string, string>): Set<string> {
  const inputs = new Set<string>();
  const addFrom = (src: string): void => {
    let m: RegExpExecArray | null;
    SRC_PATH_LITERAL_RE.lastIndex = 0;
    while ((m = SRC_PATH_LITERAL_RE.exec(src)) !== null) {
      inputs.add(toPosixPath(m[1]!));
    }
  };
  for (const [key, src] of sources) {
    if (key.endsWith("build.config.ts")) {
      addFrom(src);
    }
  }
  // Config files outside src/ (not in the scanned graph) — read them directly.
  for (const cfg of [
    "build.config.ts",
    "tsconfig.json",
    "tsconfig.tanstack.json",
  ]) {
    const p = join(PROJECT_ROOT, cfg);
    if (existsSync(p)) {
      // tsconfig paths use "./src/…"; normalize the leading "./".
      addFrom(readFileSync(p, "utf8").replace(/["']\.\/src\//g, '"src/'));
    }
  }
  return inputs;
}

/**
 * Files pulled in via `import * as X from "…"`. Every export of such a file is
 * reachable through the namespace (spread into drizzle(schema), re-exported,
 * etc.) but its individual names never appear in other files — so the
 * symbol-name usage index misses them. We treat ALL exports of a
 * namespace-imported file as used (no per-symbol dead check). Returns graph
 * keys. Resolution reuses resolveImport + the graph's own path lookup.
 */
const NAMESPACE_IMPORT_RE = /import\s+\*\s+as\s+\w+\s+from\s+['"]([^'"]+)['"]/g;
function collectNamespaceImported(
  sources: ReadonlyMap<string, string>,
  graphKeys: ReadonlySet<string>,
): Set<string> {
  const result = new Set<string>();
  const resolveToKey = (spec: string, importerKey: string): string | null => {
    const resolved = resolveImport(spec, join(PROJECT_ROOT, importerKey));
    if (!resolved) {
      return null;
    }
    for (const cand of [
      resolved,
      `${resolved}.ts`,
      `${resolved}.tsx`,
      `${resolved}/index.ts`,
      `${resolved}/index.tsx`,
    ]) {
      if (graphKeys.has(cand)) {
        return cand;
      }
    }
    return null;
  };
  for (const [importerKey, src] of sources) {
    let m: RegExpExecArray | null;
    NAMESPACE_IMPORT_RE.lastIndex = 0;
    while ((m = NAMESPACE_IMPORT_RE.exec(src)) !== null) {
      const key = resolveToKey(m[1]!, importerKey);
      if (key) {
        result.add(key);
      }
    }
  }
  return result;
}

/**
 * Framework-convention export that ships as a SET — flagging one member as dead
 * is noise (removing it breaks the contract's consistency). Matched by precise
 * name shape + location, never fuzzy:
 *   - route handlers: POST/GET/PUT/PATCH/DELETE/default (loaded by the registry)
 *   - createEndpoint type quad: <Name>{Request,Response}{Input,Output},
 *     <Name>UrlVariables{Input,Output}, <Name>{Request,Response}Data
 *   - i18n index contract (files under i18n/): <Name>TranslationKey and the
 *     `T`-suffixed scoped-translation alias (e.g. GeneratorsGenerateAllT)
 */
function isFrameworkBoilerplateSymbol(sym: SymbolDef, file: string): boolean {
  const n = sym.name;
  if (
    n === "POST" ||
    n === "GET" ||
    n === "PUT" ||
    n === "PATCH" ||
    n === "DELETE" ||
    n === "default"
  ) {
    return true;
  }
  // Endpoint type-quad: the halves ship together; only Output is usually read.
  if (
    /(?:Request|Response)(?:Input|Output)$/.test(n) ||
    /UrlVariables(?:Input|Output)$/.test(n) ||
    /(?:Request|Response)Data$/.test(n)
  ) {
    return true;
  }
  // i18n contract exports, only inside an i18n/ tree.
  if (file.includes("/i18n/")) {
    if (n.endsWith("TranslationKey") || /[A-Z]\w*T$/.test(n)) {
      return true;
    }
  }
  // Routing alias constants — used as string literals injected into category.ts
  // `allowedRoles` and nav config at runtime; the static import graph can't see
  // those call-sites. Convention: export names ending in `_ALIAS`.
  if (n.endsWith("_ALIAS")) {
    return true;
  }
  return false;
}

/**
 * Build the set of identifier words mentioned across ALL test/fixture files.
 * A symbol whose only reference is here is `test-only`, not dead. Scanned once,
 * lazily (the test files aren't in the main graph).
 */
function collectTestWords(): Set<string> {
  const words = new Set<string>();
  const WORD = /[A-Za-z_]\w*/g;
  // Also index `Owner.method` member expressions so a static method referenced
  // by tests (via its qualified name) is recognised — the bare method word alone
  // collides with common names (`run`/`stop`/`execute`) and would over-match.
  const MEMBER = /([A-Z][A-Za-z0-9_]*)\.([A-Za-z_]\w*)/g;
  for (const f of scanTestFiles(SRC_ROOT)) {
    let src: string;
    try {
      src = readFileSync(f, "utf8");
    } catch {
      continue;
    }
    let m: RegExpExecArray | null;
    WORD.lastIndex = 0;
    while ((m = WORD.exec(src)) !== null) {
      words.add(m[0]);
    }
    MEMBER.lastIndex = 0;
    while ((m = MEMBER.exec(src)) !== null) {
      words.add(`${m[1]}.${m[2]}`);
    }
  }
  return words;
}

/** Count whole-word occurrences of `name` in `src`. */
function countOccurrences(src: string, name: string): number {
  const re = new RegExp(
    `\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
    "g",
  );
  return (src.match(re) ?? []).length;
}

/** 1-based line numbers where whole-word `name` occurs in `src`. */
function occurrenceLines(src: string, name: string): number[] {
  const re = new RegExp(
    `\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
    "g",
  );
  const lines: number[] = [];
  const rows = src.split("\n");
  for (let i = 0; i < rows.length; i++) {
    re.lastIndex = 0;
    if (re.test(rows[i] ?? "")) {
      lines.push(i + 1);
    }
  }
  return lines;
}

/**
 * Build the set of graph keys that test/spec files import. The main graph
 * skips test files entirely, so a module imported ONLY by tests shows zero
 * importers and would be misreported as a DEAD FILE. Test infrastructure
 * (stream/tests/helpers/*, testing fixtures, bun preloads) exists exactly for
 * that purpose — such files are `test-only`, not dead. Uses the same
 * extract/resolve pipeline as the main graph.
 */
function collectTestImportedKeys(graph: Graph): Set<string> {
  const keys = new Set<string>();
  for (const f of scanTestFiles(SRC_ROOT)) {
    let src: string;
    try {
      src = readFileSync(f, "utf8");
    } catch {
      continue;
    }
    for (const imp of extractImports(src)) {
      const resolved = resolveImport(imp, toPosixPath(f));
      if (!resolved) {
        continue;
      }
      const candidates = [
        resolved,
        `${resolved}.ts`,
        `${resolved}.tsx`,
        `${resolved}/index.ts`,
        `${resolved}/index.tsx`,
      ];
      for (const c of candidates) {
        if (graph.has(c)) {
          keys.add(c);
          break;
        }
      }
    }
  }
  return keys;
}

/**
 * Per-domain CONVENTION files: discovered/imported by a central layer BY
 * DESIGN (the domain owns them, the central layer aggregates them). Moving
 * them "next to their consumer" would break the convention, so COLOCATE must
 * never propose it:
 *   - generator.ts          — domain codegen, aggregated by tooling/generators
 *   - sync-provider.ts      — domain sync, aggregated by remote-connection/sync
 *   - system-prompt/{prompt,server,client}.ts — domain prompt fragments,
 *     aggregated via generated/prompt-fragments
 *   - seeds.ts              — top-level domain seed file, aggregated by seed runner
 *   - seeds/*.ts            — sub-domain seed files, aggregated by seed runner
 */
const CONVENTION_FILE_RE =
  /(^|\/)(generator|sync-provider)\.tsx?$|(^|\/)system-prompt\/(prompt|server|client)\.tsx?$|(^|\/)seeds\/[^/]+\.tsx?$/;

/** Platform-override suffixes the bundler swaps in for the base module. */
const PLATFORM_VARIANT_RE = /\.(native|cli|web|ios|android)\.(tsx?)$/;

/**
 * A platform variant like `X.native.ts` / `X.cli.tsx` is resolved by the
 * bundler when `./X` is imported in that platform — it is NEVER statically
 * imported, so it always shows 0 importers. It is legitimately "used" iff its
 * base sibling `X.ts`/`X.tsx` exists (the module the bundler swaps). Only a
 * variant with NO base sibling is genuinely dead.
 */
function isPlatformVariantWithBase(key: string): boolean {
  const m = PLATFORM_VARIANT_RE.exec(key);
  if (!m) {
    return false;
  }
  const base = join(PROJECT_ROOT, key.replace(PLATFORM_VARIANT_RE, ""));
  return existsSync(`${base}.ts`) || existsSync(`${base}.tsx`);
}

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
  // Root-only skips (public/, docs/, drizzle/, …) apply just at the project
  // root; deeper, those same names are real source segments (user/public/**).
  const atProjectRoot = toPosixPath(dir) === toPosixPath(PROJECT_ROOT);
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS_ANYWHERE.has(entry.name)) {
        continue;
      }
      if (atProjectRoot && SKIP_DIRS_ROOT_ONLY.has(entry.name)) {
        continue;
      }
      scanTsFiles(join(dir, entry.name), results);
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

const TEST_SUFFIX_RE = /\.(test|spec)\.(tsx?)$/;
/**
 * Scan ONLY the test/spec files (which the main graph skips). Used to build a
 * separate test-usage index: a symbol referenced solely by tests is not dead —
 * it is `test-only` (its export exists to be tested). `test-project/` fixtures
 * are also scanned (they exercise the checker). Returns absolute-ish paths.
 */
function scanTestFiles(dir: string, results: string[] = []): string[] {
  if (!existsSync(dir)) {
    return results;
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      // Same skips as the main scan, EXCEPT keep test-project (its check.config
      // + fixtures reference real symbols) — only truly-irrelevant dirs drop.
      if (
        !SKIP_DIRS.has(entry.name) ||
        entry.name === "test-project" ||
        entry.name === "test-files"
      ) {
        scanTestFiles(join(dir, entry.name), results);
      }
    } else if (entry.isFile()) {
      const name = entry.name;
      if (
        TEST_SUFFIX_RE.test(name) ||
        // test-project's check.config.ts + fixtures aren't *.test but exercise
        // real exports; include any .ts/.tsx under a test-project/ path.
        (dir.includes("/test-project") && /\.(tsx?)$/.test(name))
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

// After `import(` / `require(`, allow whitespace AND inline block comments
// (e.g. `import(/* turbopackIgnore: true */ "…")`) before the specifier — the
// generated route-handlers use these, and missing them makes every route.ts
// loaded via the registry look dead.
const COMMENTS_WS = String.raw`(?:\s|/\*[^]*?\*/)*`;
// Five import shapes. Order matters: the bare/dynamic forms (specifier directly
// after the keyword) MUST be tried before the `from`-based form, whose
// `[\s\S]*?from` would otherwise swallow a bare `import "x"` line by scanning
// forward to the next statement's `from`.
//   import "…"                                 (side-effect / bare — NO `from`)
//   require("…")  /  import("…")               (dynamic, may have inline comments)
//   import X from "…"  /  export … from "…"   (named/default, has `from`)
const IMPORT_RE = new RegExp(
  String.raw`(?:` +
    String.raw`import\s+(?=['"])` + // bare side-effect: `import "x"`
    String.raw`|require\s*\(${COMMENTS_WS}` +
    String.raw`|import\s*\(${COMMENTS_WS}` +
    String.raw`|(?:import|export)\s+(?:type\s+)?[^;'"]*?from\s+` +
    String.raw`)['"]([^'"]+)['"]`,
  "g",
);

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
  // Project files outside src/ (root-level *.config.ts, scripts/, types/, …):
  // key = path relative to PROJECT_ROOT (e.g. "release.config.ts"), so they
  // participate in the graph as importers with a stable, non-absolute key.
  const rootPrefix = `${toPosixPath(PROJECT_ROOT)}/`;
  if (absPath.startsWith(rootPrefix)) {
    return absPath.slice(rootPrefix.length);
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

/** Sort entries by importer count desc, then path. */
function byImporterCount(a: DepsEntry, b: DepsEntry): number {
  return b.importedByCount !== a.importedByCount
    ? b.importedByCount - a.importedByCount
    : a.path.localeCompare(b.path);
}

/** Is a file in a settled/ignored area (never proposed for relocation)? */
function isIgnored(
  key: string,
  ignorePrefixes: ReadonlyArray<string>,
): boolean {
  return ignorePrefixes.some(
    (p) => key === p || key.startsWith(`${p}/`) || key.includes(`/${p}/`),
  );
}

/** Annotate a move note with "who uses it" so the layer is obvious at a glance. */
function withUsage(note: string, importers: ReadonlyArray<string>): string {
  const prof = usageProfile(importers);
  return `${note}  ·  used-by ${prof.usedByLabel}`;
}

/**
 * The relocation TODO list — no whitelist, computed from the graph. Every judged
 * file resolves to colocate / promote / (silent) in-place|unused.
 *
 * The result is CATEGORY-BALANCED: instead of one flat by-frequency list, we
 * return the top-N of EACH category interleaved (colocate first, then promote),
 * so the report shows a bit of every issue kind rather than 100 promotes burying
 * the colocates. Each entry's note carries a "used-by route:N repository:M …"
 * profile so you can tell what layer the file belongs to.
 *
 * `scope` restricts WHICH files are judged; importers are always read from the
 * FULL graph (cross-domain reach preserved). `ignorePrefixes` are settled areas
 * that still count as importers but are never themselves proposed to move.
 */
function buildNeedsMove(
  graph: Graph,
  scope: string,
  ignorePrefixes: ReadonlyArray<string>,
  perCategory: number,
): DepsEntry[] {
  const colocate: DepsEntry[] = [];
  const promote: DepsEntry[] = [];

  for (const key of graph.keys()) {
    if (isSelf(key) || isGenerated(key)) {
      continue;
    }
    if (scope && !key.includes(scope)) {
      continue;
    }
    if (isIgnored(key, ignorePrefixes)) {
      continue;
    }
    // Per-domain convention files (generator.ts, sync-provider.ts,
    // system-prompt fragments, seeds) are imported by a central aggregator BY
    // DESIGN — "move next to the consumer" would break the convention.
    if (CONVENTION_FILE_RE.test(key)) {
      continue;
    }
    const node = graph.get(key)!;
    // Filter out generated re-emitters and self — same as placementOf — so the
    // count shown matches the consumer set that drove the verdict.
    const importers = [...node.importedBy]
      .filter((i) => !isSelf(i) && !isGeneratedImporter(i))
      .toSorted();
    const verdict = placementOf(key, importers);
    if (verdict.kind === "in-place" || verdict.kind === "unused") {
      continue;
    }
    // For COLOCATE: list the actual importer files (not just the folder).
    // For PROMOTE: list the parent domains that import it.
    const colocateImporterNote =
      verdict.kind === "colocate" && verdict.usableImporters.length > 0
        ? `  ·  consumers: ${verdict.usableImporters.map((p) => p.slice(p.lastIndexOf("/") + 1).replace(/\.(ts|tsx)$/, "")).join(", ")}`
        : "";
    const promoteDomainNote =
      verdict.kind === "promote"
        ? `  ·  domains: ${verdict.importerDomainList.join(", ")}`
        : "";
    const noteExtra = colocateImporterNote || promoteDomainNote;
    const entry: DepsEntry = {
      path: key,
      imports: [],
      importedBy: importers,
      importCount: node.imports.size,
      importedByCount: importers.length,
      isUnused: importers.length === 0,
      moveTo: verdict.suggestedDir ?? "(undecided)",
      moveNote: `${withUsage(verdict.note, importers)}${noteExtra}`,
      moveKind: verdict.kind === "colocate" ? "reorganize" : "relocate",
      // Tag whether the file is already in system/ so PROMOTE can split sections.
      sourcePackage: verdict.alreadyVibe ? "system" : undefined,
    };
    (verdict.kind === "colocate" ? colocate : promote).push(entry);
  }

  colocate.sort(byImporterCount);
  promote.sort(byImporterCount);

  // Category-balanced: top-N of each, colocate first.
  return [...colocate.slice(0, perCategory), ...promote.slice(0, perCategory)];
}

// ============================================================
// Lens: cross-domain candidates (entanglements to review)
// ============================================================

/**
 * Every file reached across a DOMAIN boundary, ranked by how many distinct
 * domains reach it. No whitelist — every cross-domain target is a candidate.
 * The wider the spread, the stronger the "promote into vibe" signal.
 *
 * "domain" = domainOf() — a product domain (agent, leads, …) or a framework
 * area (system/core, system/ui, …). An edge crossing domains is cross-domain.
 * The `domainSpread` (distinct source domains) is the ranking key.
 */
function buildCrossDomain(
  graph: Graph,
  scope: string,
  ignorePrefixes: ReadonlyArray<string>,
): {
  entries: DepsEntry[];
  allowedCount: number;
} {
  // target → importers grouped by source domain
  const byTarget = new Map<string, Map<string, Set<string>>>();

  for (const [source, node] of graph) {
    if (isSelf(source)) {
      continue;
    }
    const srcDomain = domainOf(source);
    for (const target of node.imports) {
      if (isSelf(target) || isIgnored(target, ignorePrefixes)) {
        continue;
      }
      // Only judge targets in scope (default system/), but count every
      // cross-domain importer — including domain files reaching into system.
      if (scope && !target.includes(scope)) {
        continue;
      }
      if (domainOf(target) === srcDomain) {
        continue; // intra-domain — fine
      }
      let byDomain = byTarget.get(target);
      if (!byDomain) {
        byDomain = new Map();
        byTarget.set(target, byDomain);
      }
      const set = byDomain.get(srcDomain) ?? new Set<string>();
      set.add(source);
      byDomain.set(srcDomain, set);
    }
  }

  const entries: DepsEntry[] = [];
  for (const [target, byDomain] of byTarget) {
    const allImporters = [...byDomain.values()].flatMap((s) => [...s]);
    const fromDomains = [...byDomain.keys()].toSorted();
    entries.push({
      path: target,
      imports: [],
      importedBy: allImporters.toSorted(),
      importCount: fromDomains.length, // reuse as domainSpread
      importedByCount: allImporters.length,
      isUnused: false,
      targetPackage: domainOf(target),
      moveNote: `${String(fromDomains.length)} domains: ${fromDomains.join(", ")}  ·  used-by ${usageProfile(allImporters).usedByLabel}`,
      offenders: allImporters.toSorted(),
    });
  }
  // Widest domain spread first (strongest candidate to promote), then raw count.
  entries.sort((a, b) =>
    b.importCount !== a.importCount
      ? b.importCount - a.importCount
      : b.importedByCount !== a.importedByCount
        ? b.importedByCount - a.importedByCount
        : a.path.localeCompare(b.path),
  );
  return { entries, allowedCount: 0 };
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
  buildInputs: ReadonlySet<string>,
  namespaceImported: ReadonlySet<string>,
  testWords: ReadonlySet<string>,
): DepsEntry[] {
  const index = buildUsageIndex(sources);
  const entries: DepsEntry[] = [];

  for (const [file, src] of sources) {
    if (
      isSelf(file) ||
      isGenerated(file) ||
      isPlatformVariantWithBase(file) ||
      isUiMirrorWithWebBase(file) ||
      // Namespace-imported (`import * as X`) → every export reachable via the
      // namespace; the per-symbol name-usage index can't see those, so skip.
      namespaceImported.has(file) ||
      // Test infrastructure (tests/helpers, testing fixtures): every export
      // exists FOR tests — symbol-level "test-only" findings there are pure
      // noise, not actions.
      /\/(tests|testing)\//.test(file)
    ) {
      continue;
    }
    if (onlyScope && !file.includes(onlyScope)) {
      continue;
    }
    const symbols: SymbolDef[] = extractSymbols(file, src);
    for (const sym of symbols) {
      // Skip framework-CONVENTION exports that always ship as a set even when
      // only part is consumed — flagging them is noise, and removing one breaks
      // the contract's consistency. Precise name/location patterns, not fuzzy:
      //   • route handlers          POST / GET / PUT / PATCH / DELETE / default
      //   • createEndpoint type quad *RequestInput/Output, *ResponseInput/Output,
      //                              *UrlVariables*, *RequestData, *ResponseData
      //   • i18n index contract      *TranslationKey and the `T` alias, in i18n/
      if (isFrameworkBoilerplateSymbol(sym, file)) {
        continue;
      }
      const usage = usageFor(sym, index);
      const threshold = includeSingleUse ? 1 : 0;
      if (usage.usageCount <= threshold) {
        // Distinguish TRULY dead (no reference anywhere) from EXPORTED-BUT-ONLY-
        // USED-IN-ITS-OWN-FILE. The latter isn't dead — it's referenced locally,
        // it just shouldn't carry `export`. Different fix (drop the modifier),
        // so a different finding. Count in-file name occurrences beyond the
        // declaration; >0 ⇒ internal-only.
        // Match on the QUALIFIED name for static methods (`Owner.method`), never
        // the bare method name — a bare `run`/`stop`/`execute` collides with the
        // same word in unrelated files and would spuriously read as test-used or
        // in-file-used. Free functions/consts/types use their plain name.
        const refName =
          sym.kind === "static-method" && sym.owner
            ? `${sym.owner}.${sym.name}`
            : sym.name;
        // A test/fixture references it (tests are skipped from the graph). The
        // export is REACHED — dropping it would break the test import — so this
        // is NEVER `unexport`. It's `test-only`: the export exists to be tested
        // (legit coverage, or dead-code-with-a-test). Checked first so it wins.
        const testReferenced = usage.usageCount === 0 && testWords.has(refName);
        // Subtract the declaration only when the ref-name appears AT the decl.
        // Free fn/const/type: the decl line contains the name → subtract 1.
        // Static method: refName is the QUALIFIED `Owner.method`, but the decl
        // reads `static method(` (unqualified) — the qualified string never
        // appears there, so every hit is a real in-file call → subtract 0.
        const declHit = sym.kind === "static-method" ? 0 : 1;
        const inFileHits = countOccurrences(src, refName) - declHit;
        // Public-API-surface files: a symbol with in-file usage is intentional
        // exported contract (widget component / *FieldConfig / shared schema),
        // often reached via lazyWidget dynamic imports the graph can't see.
        // Skip it entirely — neither `unexport` nor dead. (A public-API symbol
        // with ZERO in-file usage still falls through to the dead-check below,
        // so genuinely-orphaned public files are still caught.)
        if (usage.usageCount === 0 && isPublicApiSurface(file)) {
          // vibe-frame extern files: skip ALL dead-symbol findings (exported for
          // consumers outside this codebase — static graph can't see those refs).
          // unified-ui / ui/renderers: only skip when there's an in-file use
          // (lazyWidget / default-import pattern); truly-orphaned symbols there
          // still surface.
          if (isVibeFrameExternalFile(file) || inFileHits > 0) {
            continue;
          }
        }
        // In-file usage: symbol appears somewhere inside its own file beyond
        // the declaration line. Covers types used as field types, return types,
        // parameter types, and class bodies — all invisible to cross-file import
        // graph but clearly active production code.
        const hasInFileUsage = inFileHits > 0;
        // Production-with-coverage: used in this file AND referenced by tests.
        // This is NOT dead and NOT test-only — it's a legitimately exported type
        // that tests happen to import. Silently skip it. Example: ConnectionConfig
        // appears 5× inside connector.ts as a type annotation AND is imported by
        // connector.test.ts to type-check the test fixture — neither dead nor
        // a candidate for unexport.
        if (usage.usageCount === 0 && hasInFileUsage && testReferenced) {
          continue;
        }
        // Used only in its OWN file → drop `export` (make unexported/private).
        const internalOnly =
          usage.usageCount === 0 && !testReferenced && hasInFileUsage;
        // test-only: only when no in-file usage at all. If in-file hits exist,
        // it's production code (handled above or as internalOnly).
        const testOnly = testReferenced && !hasInFileUsage;
        // A static method can only "drop export" by becoming `private`, which
        // compiles ONLY if every same-file reference sits inside the owning
        // class body. If the sole caller is a sibling module-level wrapper
        // (outside the class), `private` won't compile — the real fix is to
        // inline that wrapper, a different action. Distinguish the two so the
        // note is honest and actionable rather than a compile-breaking suggestion.
        const body = sym.ownerBody;
        const staticExtraClass =
          internalOnly &&
          sym.kind === "static-method" &&
          body !== undefined &&
          occurrenceLines(src, refName).some((l) => l < body[0] || l > body[1]);
        const status = testOnly
          ? "test-only"
          : staticExtraClass
            ? "inline-wrapper"
            : internalOnly
              ? "unexport"
              : null;
        entries.push({
          path: file,
          imports: [],
          importedBy: usage.usedInFiles,
          importCount: 0,
          importedByCount: usage.usageCount,
          isUnused: usage.usageCount === 0 && !internalOnly && !testOnly,
          symbol: sym.name,
          symbolKind: status ? `${sym.kind} (${status})` : sym.kind,
          symbolOwner: sym.owner,
          offenders: usage.usedInFiles,
          moveNote: staticExtraClass
            ? "only caller is a same-file sibling — inline the wrapper (`private` won't compile)"
            : internalOnly
              ? sym.kind === "static-method"
                ? "called only inside its own class — make `private`"
                : "used only in its own file — drop `export`"
              : testOnly
                ? "used only by tests — keep-for-coverage or remove source+test"
                : undefined,
        });
      }
    }
  }

  // Dead files (zero importers) within scope, as their own entries.
  // Files imported ONLY by test/spec files are NOT dead — the main graph skips
  // test files, so without this check every test-helper module would be
  // misreported. They get their own informational class instead.
  const testImportedKeys = collectTestImportedKeys(graph);
  for (const [key, node] of graph) {
    if (
      isSelf(key) ||
      isGenerated(key) ||
      isPlatformVariantWithBase(key) ||
      isUiMirrorWithWebBase(key) ||
      isFrameworkEntrypoint(key) ||
      isKnownEntrypoint(key) ||
      buildInputs.has(key) ||
      node.importedBy.size !== 0
    ) {
      continue;
    }
    if (onlyScope && !key.includes(onlyScope)) {
      continue;
    }
    const testOnlyFile = testImportedKeys.has(key);
    entries.push({
      path: key,
      imports: [...node.imports].toSorted(),
      importedBy: [],
      importCount: node.imports.size,
      importedByCount: 0,
      isUnused: !testOnlyFile,
      symbol: "(whole file)",
      symbolKind: testOnlyFile ? "file (test-only)" : "file",
      moveNote: testOnlyFile
        ? "imported only by tests — test infrastructure, not dead"
        : undefined,
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

// ============================================================
// Lens: report — the all-in-one prioritized TODO list
// ============================================================

/**
 * The single default view: every actionable finding across ALL lenses, grouped
 * into ordered TODO sections you can work top-down. Each section is a
 * PackageGroup (title + count + entries). Sections, in priority order:
 *
 *   1. COLOCATE   — file used from one folder, lives elsewhere → move next to it.
 *   2. PROMOTE    — shared across N domains → lift into a framework primitive.
 *   3. DEAD FILE  — zero importers (whole file unused).
 *   4. DEAD SYMBOL— exported symbol/static method nothing references.
 *
 * `scope` restricts which files are judged (default system/); importers are read
 * from the full graph. `ignorePrefixes` = settled areas, never proposed to move.
 */

/**
 * Reverse coupling: files OUTSIDE the scope that import heavily FROM it.
 *
 * When you run `vibe deps system/realtime`, `use-endpoint-subscription.ts` in
 * `system/platforms` imports `cache-merger`, `channel`, `client`, `types` — 4
 * realtime files. That's a strong signal the hook IS realtime code and belongs
 * colocated there. The forward lens only sees "cache-merger.ts is used by one
 * folder → move it there"; the reverse lens surfaces the full coupling: "that
 * consumer imports N files from your domain — consider pulling it in".
 *
 * Only surfaces files outside the scope with ≥2 distinct in-scope imports
 * (single-import coupling is expected and unactionable).
 */
function buildConsumerCoupling(graph: Graph, scope: string): DepsEntry[] {
  if (!scope) {
    return [];
  }
  const scopePrefix = scope.endsWith("/") ? scope : `${scope}/`;

  const outsiderImportCount = new Map<string, Set<string>>();
  for (const [key, node] of graph) {
    if (
      key.startsWith(scopePrefix) ||
      isSelf(key) ||
      isGeneratedImporter(key) ||
      isUiPageImporter(key)
    ) {
      continue;
    }
    for (const dep of node.imports) {
      if (dep.startsWith(scopePrefix)) {
        const set = outsiderImportCount.get(key) ?? new Set<string>();
        set.add(dep);
        outsiderImportCount.set(key, set);
      }
    }
  }

  const entries: DepsEntry[] = [];
  for (const [outsider, scopeImports] of outsiderImportCount) {
    if (scopeImports.size < 2) {
      continue;
    }
    const importedList = [...scopeImports].toSorted();
    const shortNames = importedList
      .map((p) => p.slice(scopePrefix.length).replace(/\.(ts|tsx)$/, ""))
      .join(", ");
    entries.push({
      path: outsider,
      imports: importedList,
      importedBy: [],
      importCount: scopeImports.size,
      importedByCount: scopeImports.size, // leading display count = how many scope files imported
      isUnused: false,
      moveTo: scopePrefix.slice(0, -1),
      moveNote: `imports ${shortNames}`,
    });
  }

  entries.sort(
    (a, b) => b.importCount - a.importCount || a.path.localeCompare(b.path),
  );
  return entries;
}

// Allowed import patterns for page.tsx files.
// A page is a thin shell: it calls a repository, gets a locale/user, passes to a client component.
// Anything beyond these is a violation — UI components, enums, db, utils, etc. belong in
// the repository, widget, or page-client.
// Graph keys are relative paths like:
//   "src/app/api/[locale]/user/repository.ts"
//   "src/app/[locale]/creator/[userId]/page-client.tsx"
//   "src/config/env.ts"
// The patterns below match against these resolved keys.
// Graph keys are relative paths like:
//   "src/app/api/[locale]/user/repository.ts"
//   "src/app/[locale]/creator/[userId]/page-client.tsx"
//   "src/config/env.ts"
// The patterns below match against these resolved keys.
const PAGE_ALLOWED_PATTERNS: ReadonlyArray<RegExp> = [
  // Generated shell pages are re-exports — not real pages to lint
  /src\/generated\//,
  // Sibling page-client / i18n (any depth)
  /\/page-client(\.(ts|tsx))?$/,
  /\/i18n(\/|\/index(\.(ts|tsx))?$|$)/,
  // Sibling _components/ — UI fragments co-located with the page
  /\/_components\//,
  // Framework auth + logger + platform boilerplate (graph key format: system/...)
  /system\/identity\/auth\/(repository|types)/,
  /system\/identity\/roles\/enum/,
  /system\/logger\/server/,
  /system\/core\/definition\/platform/,
  /system\/core\/i18n/,
  // Endpoint repository + definition (the only api imports a page may make directly)
  /src\/app\/api\/\[locale\]\/.*\/(repository|definition)(\.(ts|tsx))?$/,
  // Project-level config
  /src\/config\//,
];

function isPageAllowed(importKey: string): boolean {
  for (const pattern of PAGE_ALLOWED_PATTERNS) {
    if (pattern.test(importKey)) {
      return true;
    }
  }
  return false;
}

/**
 * page-violations mode: find page.tsx files that import something other than
 * repository.ts / definition.ts / i18n / page-client.tsx.
 *
 * A page must be a thin SSR shell. Business logic, UI, enums, db, and utils
 * belong in repository.ts or page-client.tsx — not in page.tsx.
 */
function buildPageViolations(graph: Graph, scope: string): DepsEntry[] {
  const PAGE_SUFFIX = "/page.tsx";
  const entries: DepsEntry[] = [];

  for (const [key, node] of graph) {
    if (!key.endsWith(PAGE_SUFFIX)) {
      continue;
    }
    // Generated shell pages are auto-exports — not real pages to lint
    if (key.includes("src/generated/")) {
      continue;
    }
    // Apply scope filter when given
    if (scope && !key.includes(scope)) {
      continue;
    }

    const violations: string[] = [];
    for (const imp of node.imports) {
      if (!isPageAllowed(imp)) {
        violations.push(imp);
      }
    }

    if (violations.length === 0) {
      continue;
    }

    entries.push({
      path: key,
      imports: violations,
      importedBy: [],
      importCount: violations.length,
      importedByCount: 0,
      isUnused: false,
      moveNote: violations
        .map((v) =>
          v.replace(/^src\/app\/api\/\[locale\]\//, "").replace(/^src\//, ""),
        )
        .join(", "),
    });
  }

  entries.sort(
    (a, b) => b.importCount - a.importCount || a.path.localeCompare(b.path),
  );
  return entries;
}

function buildReport(
  graph: Graph,
  sources: ReadonlyMap<string, string>,
  scope: string,
  ignorePrefixes: ReadonlyArray<string>,
  perSection: number,
): PackageGroup[] {
  const moves = buildNeedsMove(graph, scope, ignorePrefixes, 10_000);
  const colocate = moves.filter((e) => e.moveKind === "reorganize");
  const promote = moves.filter((e) => e.moveKind === "relocate");

  // Dead files + dead symbols (0-use only; single-use is noisier, left to the
  // dedicated mode). Split whole-file deaths from symbol deaths.
  const buildInputs = collectBuildInputs(sources);
  const nsImported = collectNamespaceImported(sources, new Set(graph.keys()));
  const testWords = collectTestWords();
  const dead = buildUnusedSymbols(
    sources,
    graph,
    scope || undefined,
    false,
    buildInputs,
    nsImported,
    testWords,
  );
  const deadFiles = dead.filter((e) => e.symbolKind === "file");
  const testOnlyFiles = dead.filter((e) => e.symbolKind === "file (test-only)");
  const deadSymbols = dead.filter(
    (e) => e.symbolKind !== "file" && e.symbolKind !== "file (test-only)",
  );

  const sections: PackageGroup[] = [];
  const add = (title: string, entries: DepsEntry[]): void => {
    if (entries.length === 0) {
      return;
    }
    sections.push({
      package: `${title}  (${String(entries.length)})`,
      violationCount: entries.length,
      entries: entries.slice(0, perSection),
    });
  };

  const coupling = buildConsumerCoupling(graph, scope);

  // Split PROMOTE into two distinct signals:
  //   MISPLACED: file NOT in system/, used cross-domain → actually move it into system/
  //   WIDE COUPLING: already in system/ (framework primitive), just informational for
  //     understanding which primitives are relied on and by which domains.
  const misplaced = promote.filter((e) => e.sourcePackage !== "system");
  const wideCoupling = promote.filter((e) => e.sourcePackage === "system");

  add("COLOCATE — used from one folder, move next to consumers", colocate);
  add("MISPLACED — used across domains, belongs in system/", misplaced);
  add(
    "WIDE COUPLING — framework primitive shared across domains (already in system/, informational)",
    wideCoupling,
  );
  add(
    "CONSUMER COUPLING — outside files importing ≥2 from this domain (consider moving them here)",
    coupling,
  );
  add("DEAD FILE — zero importers", deadFiles);
  add("TEST-ONLY FILE — imported only by tests (informational)", testOnlyFiles);
  add("DEAD SYMBOL — exported but never referenced", deadSymbols);
  return sections;
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
      const effectiveMode = mode ?? "report";
      const effectiveDepth = depth ?? 1;
      const effectiveLimit = limit ?? 100;
      const view = effectiveMode;

      // Scan the WHOLE PROJECT (cwd), not just src/ — root-level config files
      // (release.config.ts, build.config.ts, vibe-deps.config.ts, …) import
      // types from src/ and must count as importers, or those types look dead.
      // SKIP_DIRS blacklists the irrelevant trees. Capture sources only for
      // symbol-level modes (reuses the single read pass instead of re-reading
      // every file). `report` bundles the symbol-level dead-code lens, so it
      // needs sources too.
      const needsSources =
        effectiveMode === "unused-symbols" ||
        effectiveMode === "needs-move" ||
        effectiveMode === "report";
      const sources = needsSources ? new Map<string, string>() : undefined;
      const allFiles = scanTsFiles(PROJECT_ROOT);
      const graph = buildGraph(allFiles, sources);

      // Always write the full file-level dependencies.json
      writeDependenciesJson(graph, logger);

      // Whole-graph stats
      const totalFiles = graph.size;
      let totalEdges = 0;
      let unusedCount = 0;
      for (const node of graph.values()) {
        totalEdges += node.imports.size;
        if (node.importedBy.size === 0) {
          unusedCount++;
        }
      }

      // Scoped stats — when a focus path is given, compute counts only for
      // files under that path so the header reflects what you're actually looking at.
      let scopedFiles = totalFiles;
      let scopedEdges = totalEdges;
      let scopedUnused = unusedCount;

      // Relocation scope: which files the move/dead lenses JUDGE. Importers are
      // always read from the FULL graph (a file used from another area still
      // shows its true cross-area spread). The scope respects ANY path given:
      //   `vibe deps <path>`  → judge only files under that path
      //   `vibe deps`         → whole project (empty scope = judge everything)
      const moveScope = focus
        ? toPosixPath(focus)
            .replace(/^.*?\/src\//, "src/")
            .replace(/\/+$/, "")
        : "";

      if (moveScope) {
        scopedFiles = 0;
        scopedEdges = 0;
        scopedUnused = 0;
        for (const [k, node] of graph) {
          if (!k.includes(moveScope)) {
            continue;
          }
          scopedFiles++;
          scopedEdges += node.imports.size;
          if (node.importedBy.size === 0) {
            scopedUnused++;
          }
        }
      }

      const config = loadConfig(logger);
      const ignorePrefixes = (config.ignore ?? []).map((p) => toPosixPath(p));

      // ── All-in-one TODO report (default) ────────────────────
      if (effectiveMode === "report") {
        const groups = buildReport(
          graph,
          sources ?? new Map(),
          moveScope,
          ignorePrefixes,
          effectiveLimit,
        );
        const itemCount = groups.reduce((n, g) => n + g.violationCount, 0);
        logger.info(
          `vibe-deps: report — ${itemCount} findings across ${groups.length} sections`,
        );
        return success({
          view,
          entries: [],
          groups,
          violations: emptyViolations(),
          totalFiles: scopedFiles,
          totalEdges: scopedEdges,
          unusedCount: scopedUnused,
        });
      }

      // ── Reorg move-list ─────────────────────────────────────
      if (mode === "needs-move") {
        // Category-balanced: top `limit` of EACH category (colocate, promote).
        const entries = buildNeedsMove(
          graph,
          moveScope,
          ignorePrefixes,
          effectiveLimit,
        );
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
        const { entries, allowedCount } = buildCrossDomain(
          graph,
          moveScope,
          ignorePrefixes,
        );
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

      // ── Page architecture rule: page.tsx must only import repository/definition/i18n ──
      if (mode === "page-violations") {
        const entries = buildPageViolations(graph, moveScope);
        logger.info(
          `vibe-deps: page-violations — ${entries.length} page.tsx files with disallowed imports`,
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

      // ── Unused public surface (dead exports + static methods + files) ──
      if (mode === "unused-symbols") {
        const scope = focus ? toPosixPath(focus) : "";
        const entries = buildUnusedSymbols(
          sources!,
          graph,
          scope,
          /* includeSingleUse */ false,
          collectBuildInputs(sources!),
          collectNamespaceImported(sources!, new Set(graph.keys())),
          collectTestWords(),
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
        const normalizedFocus = toPosixPath(focus).replace(/\/+$/, "");
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

        // A DIRECTORY focus (matches a folder prefix / many files) is a SCOPE —
        // show exactly the files under it, never depth-expand into neighbouring
        // domains. Depth-expansion only makes sense to explore a single file's
        // neighbourhood, so it applies only to a pinpoint (single-file) focus.
        const isDirectoryScope =
          keys.some((k) => k.startsWith(`${normalizedFocus}/`)) ||
          focusMatches.length > 1;

        // Expand outward by depth
        if (effectiveDepth > 0 && !isDirectoryScope) {
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
