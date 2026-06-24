import "server-only";

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { toPosixPath } from "@/app/api/[locale]/system/generators/shared/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";

import type {
  VibeDepsRequestOutput,
  VibeDepsResponseOutput,
} from "./definition";
import type { CheckVibeDepsT } from "./i18n";

const PROJECT_ROOT = process.cwd();
const SRC_ROOT = join(PROJECT_ROOT, "src");

// Graph key = posix path relative to PROJECT_ROOT, e.g. "src/config/constants.ts"
// For files inside src/app/api/[locale]/, next-vibe/* aliases resolve to the same key.

// Canonical src-relative prefix used in graph keys
const SRC_PREFIX = "src/";

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
// Order matters: more specific first
const ALIAS_PREFIXES: ReadonlyArray<{ alias: string; resolved: string }> = [
  // next-vibe/* → src/app/api/[locale]/*  (same tree as @/app/api/[locale]/*)
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
 *                     "next-vibe/foo" → "src/app/api/[locale]/foo"
 *   - Relative imports: "../bar", "./baz" → resolved against the importer's dir
 *
 * The returned path has no extension — callers try .ts / .tsx / /index.ts etc.
 */
function resolveImport(
  importPath: string,
  importerAbsPath: string,
): string | null {
  // Alias prefixes
  for (const { alias, resolved } of ALIAS_PREFIXES) {
    if (importPath.startsWith(alias)) {
      return resolved + importPath.slice(alias.length);
    }
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

interface GraphNode {
  imports: Set<string>;
  importedBy: Set<string>;
}

type Graph = Map<string, GraphNode>;

function buildGraph(files: string[]): Graph {
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

    // Also register the [locale]-relative variant so next-vibe/* aliases match
    // e.g. key = "src/app/api/[locale]/user/auth/types.ts"
    //      → also index "src/app/api/[locale]/user/auth/types" (handled above via noExt)
    // next-vibe/user/auth/types → resolved to "src/app/api/[locale]/user/auth/types"
    // that's already the key's noExt form — nothing extra needed.
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

export class VibeDepsRepository {
  static async execute(
    data: VibeDepsRequestOutput,
    logger: EndpointLogger,
    t: CheckVibeDepsT,
  ): Promise<ResponseType<VibeDepsResponseOutput>> {
    try {
      const { focus, mode, depth, limit } = data;
      const effectiveDepth = depth ?? 1;
      const effectiveLimit = limit ?? 100;

      // Scan all of src/
      const allFiles = scanTsFiles(SRC_ROOT);
      const graph = buildGraph(allFiles);

      // Always write the full file-level dependencies.json
      writeDependenciesJson(graph, logger);

      // Build the view graph (may be a category rollup)
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

      const sliced = keys.slice(0, effectiveLimit);
      const entries = sliced.map((key) => {
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
        entries,
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
