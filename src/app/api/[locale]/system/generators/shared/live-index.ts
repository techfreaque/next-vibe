/**
 * Live Index — In-memory file index for the smart dev watcher
 *
 * Maintained by the dev watcher across the lifetime of the dev server.
 * Surgically updated on each file change — no rescan needed.
 * Passed to generators so they skip their own discovery scans.
 */

import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { findFilesRecursively } from "./utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Which generator group a changed file belongs to
 */
export interface FileClass {
  /** definition.ts or route.ts — affects endpoint generators */
  endpoints?: boolean;
  /** route-client.ts — affects client-routes generator */
  clientRoutes?: boolean;
  /** task.ts or task-runner.ts — affects task-index generator */
  taskIndex?: boolean;
  /** seeds.ts — affects seeds generator */
  seeds?: boolean;
  /** email.tsx / *.email.tsx — affects email-templates generator */
  emailTemplates?: boolean;
}

/** Dirty flags — which generator groups need to run */
export interface DirtyFlags {
  endpoints: boolean;
  clientRoutes: boolean;
  taskIndex: boolean;
  seeds: boolean;
  emailTemplates: boolean;
}

/**
 * Live in-memory index maintained by the dev watcher.
 * All Sets contain absolute paths.
 */
export interface LiveIndex {
  // --- Endpoint generators (endpoints-index, endpoint, route-handlers) ---
  definitionFiles: Set<string>;
  routeFiles: Set<string>;

  // --- Client-routes generator ---
  clientRouteFiles: Set<string>;

  // --- Task-index generator ---
  taskFiles: Set<string>;
  taskRunnerFiles: Set<string>;

  // --- Seeds generator ---
  seedFiles: Set<string>;

  // --- Email-templates generator ---
  emailFiles: Set<string>;

  /**
   * Per-definition HTTP method cache.
   * key = absolute path to definition.ts
   * value = sorted array of method names e.g. ["GET", "POST"]
   */
  methodCache: Map<string, string[]>;

  /** Which generators need to run */
  dirty: DirtyFlags;
}

// ---------------------------------------------------------------------------
// HTTP method extraction (text-based, no dynamic import)
// ---------------------------------------------------------------------------

const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
] as const;

/**
 * Extract exported HTTP method names from a definition.ts file using regex.
 * Returns sorted array so comparisons are deterministic.
 *
 * Looks for patterns like:
 *   export const { GET, POST, tools } = endpointsHandler({...})
 *   or top-level keys in an object export: GET: { ... }, POST: { ... }
 */
export function extractMethodsFromFile(absPath: string): string[] {
  if (!existsSync(absPath)) {
    return [];
  }

  let content: string;
  try {
    content = readFileSync(absPath, "utf-8");
  } catch {
    return [];
  }

  const found = new Set<string>();

  for (const method of HTTP_METHODS) {
    // Match:  GET: {  or  GET:{  or  [Methods.GET]:  or  export ... GET ...
    const patterns = [
      // Object key pattern: `GET:` or `GET :` at start of line or after comma/brace
      new RegExp(`(?:^|[,{\\s])${method}\\s*:`, "m"),
      // Export destructure: `export const { GET, POST`
      new RegExp(`\\bexport\\s+const\\s+\\{[^}]*\\b${method}\\b`, "m"),
      // Methods enum: Methods.GET
      new RegExp(`Methods\\.${method}\\b`),
    ];

    if (patterns.some((re) => re.test(content))) {
      found.add(method);
    }
  }

  return [...found].toSorted();
}

// ---------------------------------------------------------------------------
// File classification
// ---------------------------------------------------------------------------

/**
 * Given a relative or absolute filename (as reported by fs.watch),
 * return which generator groups it affects — or null if irrelevant.
 */
export function classifyFile(filename: string): FileClass | null {
  // Skip generated, temp, and hidden files
  if (
    filename.includes("node_modules") ||
    filename.includes(".git") ||
    filename.includes(".next") ||
    filename.includes("generated") ||
    filename.includes(".tmp") ||
    filename.includes("~") ||
    filename.startsWith(".")
  ) {
    return null;
  }

  const base = filename.split("/").at(-1) ?? filename;

  if (base === "definition.ts") {
    return { endpoints: true };
  }
  if (base === "route.ts") {
    return { endpoints: true };
  }
  if (base === "route-client.ts") {
    return { clientRoutes: true };
  }
  if (base === "task.ts") {
    return { taskIndex: true };
  }
  if (base === "task-runner.ts") {
    return { taskIndex: true };
  }
  if (base === "seeds.ts") {
    return { seeds: true };
  }
  if (base === "email.tsx" || base.endsWith(".email.tsx")) {
    return { emailTemplates: true };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Build (initial full scan)
// ---------------------------------------------------------------------------

/** Base directory for API routes */
function getApiDir(): string {
  // eslint-disable-next-line i18next/no-literal-string
  return join(process.cwd(), "src", "app", "api", "[locale]");
}

/** Base directory for tasks (broader — includes all api/) */
function getApiRootDir(): string {
  // eslint-disable-next-line i18next/no-literal-string
  return join(process.cwd(), "src", "app", "api");
}

/**
 * Perform an initial full scan and return a populated LiveIndex.
 * Called once on dev server startup.
 */
export function buildLiveIndex(): LiveIndex {
  const apiDir = getApiDir();
  const apiRootDir = getApiRootDir();

  const definitionFiles = new Set(
    findFilesRecursively(apiDir, "definition.ts"),
  );
  const routeFiles = new Set(findFilesRecursively(apiDir, "route.ts"));
  const clientRouteFiles = new Set(
    findFilesRecursively(apiDir, "route-client.ts"),
  );
  const taskFiles = new Set(findFilesRecursively(apiRootDir, "task.ts"));
  const taskRunnerFiles = new Set(
    findFilesRecursively(apiRootDir, "task-runner.ts"),
  );
  const seedFiles = new Set(findFilesRecursively(apiDir, "seeds.ts"));

  const emailTsxFiles = findFilesRecursively(apiDir, "email.tsx");
  const emailDotTsxFiles = findFilesRecursively(apiDir, ".email.tsx").filter(
    (f) => !f.endsWith("/email.tsx"),
  );
  const emailFiles = new Set([...emailTsxFiles, ...emailDotTsxFiles]);

  // Build method cache for all definition files
  const methodCache = new Map<string, string[]>();
  for (const defFile of definitionFiles) {
    methodCache.set(defFile, extractMethodsFromFile(defFile));
  }

  const dirty: DirtyFlags = {
    endpoints: true,
    clientRoutes: true,
    taskIndex: true,
    seeds: true,
    emailTemplates: true,
  };

  return {
    definitionFiles,
    routeFiles,
    clientRouteFiles,
    taskFiles,
    taskRunnerFiles,
    seedFiles,
    emailFiles,
    methodCache,
    dirty,
  };
}

// ---------------------------------------------------------------------------
// Update (surgical per-file-change update)
// ---------------------------------------------------------------------------

/**
 * Surgically update the live index when a file changes.
 * Sets the appropriate dirty flags.
 *
 * @param index - The current live index (mutated in place)
 * @param eventType - "rename" (create/delete) or "change" (modify)
 * @param absPath - Absolute path to the changed file
 */
export function updateLiveIndex(
  index: LiveIndex,
  eventType: "rename" | "change",
  absPath: string,
): void {
  const base = absPath.split("/").at(-1) ?? "";
  const fileExists = existsSync(absPath);

  if (base === "definition.ts") {
    if (eventType === "rename") {
      if (fileExists) {
        index.definitionFiles.add(absPath);
      } else {
        index.definitionFiles.delete(absPath);
        index.methodCache.delete(absPath);
      }
    }
    // For both rename and change, refresh method cache
    if (fileExists) {
      const prevMethods = index.methodCache.get(absPath) ?? [];
      const newMethods = extractMethodsFromFile(absPath);
      index.methodCache.set(absPath, newMethods);
      // Only dirty if methods actually changed (or file was added/removed)
      if (
        eventType === "rename" ||
        prevMethods.join(",") !== newMethods.join(",")
      ) {
        index.dirty.endpoints = true;
      }
    } else {
      index.dirty.endpoints = true;
    }
    return;
  }

  if (base === "route.ts") {
    if (fileExists) {
      index.routeFiles.add(absPath);
    } else {
      index.routeFiles.delete(absPath);
    }
    index.dirty.endpoints = true;
    return;
  }

  if (base === "route-client.ts") {
    if (fileExists) {
      index.clientRouteFiles.add(absPath);
    } else {
      index.clientRouteFiles.delete(absPath);
    }
    index.dirty.clientRoutes = true;
    return;
  }

  if (base === "task.ts") {
    if (fileExists) {
      index.taskFiles.add(absPath);
    } else {
      index.taskFiles.delete(absPath);
    }
    index.dirty.taskIndex = true;
    return;
  }

  if (base === "task-runner.ts") {
    if (fileExists) {
      index.taskRunnerFiles.add(absPath);
    } else {
      index.taskRunnerFiles.delete(absPath);
    }
    index.dirty.taskIndex = true;
    return;
  }

  if (base === "seeds.ts") {
    if (fileExists) {
      index.seedFiles.add(absPath);
    } else {
      index.seedFiles.delete(absPath);
    }
    index.dirty.seeds = true;
    return;
  }

  if (base === "email.tsx" || base.endsWith(".email.tsx")) {
    if (fileExists) {
      index.emailFiles.add(absPath);
    } else {
      index.emailFiles.delete(absPath);
    }
    index.dirty.emailTemplates = true;
  }
}

/**
 * Reset all dirty flags after generators have run
 */
export function clearDirtyFlags(index: LiveIndex): void {
  index.dirty.endpoints = false;
  index.dirty.clientRoutes = false;
  index.dirty.taskIndex = false;
  index.dirty.seeds = false;
  index.dirty.emailTemplates = false;
}
