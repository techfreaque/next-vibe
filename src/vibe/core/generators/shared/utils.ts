/**
 * Shared Generator Utilities
 * Simple utilities for all generators
 */

import "server-only";

import type { Dirent } from "node:fs";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { pathToFileURL } from "node:url";

import { PATH_SEPARATOR } from "../../core-utils/path";
import type { WidgetData } from "../../utils/json";

import {
  getApiDir,
  getSrcDir,
  PROJECT_IGNORE_DIRS,
  ROUTE_ANCHOR_SEGMENT,
} from "@/env/paths";

/**
 * Does `relPath` (POSIX, relative to the scan root) fall under an ignore pattern?
 *
 * Two pattern forms, matched against the PATH rather than the bare directory
 * name — a name-only test cannot express "the generated dir" without also
 * excluding every unrelated directory that happens to share the name:
 *
 *   `**` + `/name`  — a directory called `name` at any depth (`**​/node_modules`)
 *   `a/b/c`         — exactly that path, relative to the scan root
 *
 * Anything below a match is pruned too, so a matched directory is never entered.
 */
export function isIgnoredDir(
  relPath: string,
  patterns: readonly string[],
): boolean {
  const path = toPosixPath(relPath).replace(/^\.\//, "");
  const name = path.split("/").at(-1) ?? "";
  return patterns.some((pattern) => {
    if (pattern.startsWith("**/")) {
      return name === pattern.slice(3);
    }
    return path === pattern || path.startsWith(`${pattern}/`);
  });
}

/**
 * Normalize a path to use forward slashes regardless of platform.
 *
 * Generators downstream of file discovery do substring matching with "/"
 * separators (e.g. `defFile.replace("/definition.ts", "/route.ts")` and
 * `filePath.split("/")`). Returning POSIX-style paths from discovery keeps
 * those call sites working uniformly on Windows and Linux. Both runtimes accept
 * forward slashes for `fs.*` on Windows — but NOT for `import()`; see
 * {@link toImportUrl}.
 */
export function toPosixPath(p: string): string {
  return p.replaceAll("\\", "/");
}

/**
 * Convert an absolute path into a specifier `import()` will accept.
 *
 * Node's ESM loader reads a bare Windows path ("C:/x/y.ts") as the URL protocol
 * "c:" and rejects it — absolute paths must be file:// URLs. Bun accepts the
 * bare form, so any dynamic import of a discovered path works there and fails
 * on node unless it goes through here.
 */
export function toImportUrl(absolutePath: string): string {
  return pathToFileURL(absolutePath).href;
}

/**
 * Strip the project root (process.cwd()) prefix from a file path.
 *
 * Always compares POSIX-normalized forms so this works on Windows where
 * `process.cwd()` is `C:\foo` but the discovered file path is `C:/foo/...`.
 * Returns a POSIX-style path with no leading slash.
 */
export function stripProjectRoot(filePath: string): string {
  const posixCwd = toPosixPath(process.cwd());
  return toPosixPath(filePath).replace(posixCwd, "").replace(/^\//, "");
}

/**
 * Src-relative POSIX path, for embedding in generated files.
 *
 * Anything written into `GENERATED_DIR` is committed and read back on another
 * machine, another OS and another checkout directory, so an absolute path is
 * only ever correct on the machine that ran the generator. Anchoring on
 * {@link getSrcDir} keeps the value stable across checkouts; consumers
 * re-absolutize it against the same anchor at runtime (see the MCP hot-loader).
 */
export function toProjectRelativePath(filePath: string): string {
  return toPosixPath(relative(getSrcDir(), filePath));
}

/**
 * Recursively find files in a directory, by exact filename or by predicate.
 *
 * The predicate form exists for conventions that are a shape rather than a name
 * (`setup.ts` *and* `<name>.setup.ts`); pass a string for the common case.
 *
 * Returns POSIX-style paths (forward slashes) so callers can do the standard
 * `path.replace("/definition.ts", "/route.ts")` style matching on every OS.
 */
export function findFilesRecursively(
  dir: string,
  target: string | ((filename: string) => boolean),
  excludeDirs: readonly string[] = PROJECT_IGNORE_DIRS,
): string[] {
  const matches =
    typeof target === "string"
      ? (filename: string): boolean => filename === target
      : target;
  const results: string[] = [];

  if (!existsSync(dir)) {
    return results;
  }

  // A directory can vanish mid-walk — npm deletes staging directories in the
  // background, and an interrupted install leaves them around. One unreadable
  // directory must not take down the whole generator run.
  let entries: Dirent[];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  // Ignore patterns are relative to the SCAN ROOT, not to the directory being
  // read, so the root has to be carried down the recursion rather than
  // recomputed - otherwise `tools/pcvibe/generated` would only ever match if the
  // walk happened to start at the repo root.
  const root = getApiDir();

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      const rel = toPosixPath(relative(root, fullPath));
      if (isIgnoredDir(rel, excludeDirs)) {
        continue;
      }
      results.push(...findFilesRecursively(fullPath, matches, excludeDirs));
    } else if (entry.isFile() && matches(entry.name)) {
      results.push(toPosixPath(fullPath));
    }
  }

  return results.toSorted();
}

/**
 * Get relative import path from source file to output file
 */
export function getRelativeImportPath(
  sourceFile: string,
  outputFile: string,
): string {
  const outputDir = dirname(outputFile);
  let relativePath = relative(outputDir, sourceFile);

  // Remove .ts extension and normalize path separators
  relativePath = relativePath.replace(/\.ts$/, "").replaceAll("\\", "/");

  // Ensure it starts with ./ or ../
  if (!relativePath.startsWith(".")) {
    relativePath = `./${relativePath}`;
  }

  return relativePath;
}

/**
 * Extract nested path segments from a file path.
 *
 * Segments are everything between the anchor and the target file:
 *   src/[locale]/agent/chat/definition.ts (anchor "[locale]") -> ["agent","chat"]
 *   src/vibe/core/generators/definition.ts (anchor scan root) -> ["vibe","core","generators"]
 *
 * Anchor resolution, in order:
 *   1. a literal {@link ROUTE_ANCHOR_SEGMENT} segment
 *   2. the CONFIGURED scan root from env/paths ({@link getApiDir})
 *
 * (2) is what keeps this function layout-agnostic. Definitions do not always sit
 * under the anchor segment — a domain-driven tree has no `[locale]` in the path
 * at all, and a vendored copy may have no `src/` either. Anchoring the fallback
 * on the configured root keeps the segment semantics identical while letting the
 * root move, instead of hardcoding a directory name the framework does not own.
 */
export function extractNestedPath(
  filePath: string,
  startMarker: string = ROUTE_ANCHOR_SEGMENT,
  endMarker?: string,
): string[] {
  const pathParts = toPosixPath(filePath).split("/");

  let startIndex = pathParts.findIndex((p) => p === startMarker);
  if (startIndex === -1) {
    if (startMarker === ROUTE_ANCHOR_SEGMENT) {
      // No anchor segment: fall back to the configured scan root. The root's own
      // segments are not part of the route, so start just past its last one.
      const rootParts = toPosixPath(getApiDir()).split("/").filter(Boolean);
      const rootTail = rootParts.at(-1);
      const rootTailIndex =
        rootTail === undefined ? -1 : pathParts.lastIndexOf(rootTail);
      if (rootTailIndex === -1) {
        // eslint-disable-next-line restricted/no-throw -- Build-time generator that throws for invalid configuration at startup
        throw new Error(
          `Could not anchor path: ${filePath} is not under the configured scan root (${getApiDir()}), and has no ${ROUTE_ANCHOR_SEGMENT} segment`,
        );
      }
      startIndex = rootTailIndex;
    } else {
      // eslint-disable-next-line restricted/no-throw -- Build-time generator that throws for invalid configuration at startup
      throw new Error(`Could not find ${startMarker} in path: ${filePath}`);
    }
  }

  // If no end marker provided, auto-detect definition.ts, route.ts, or route-client.ts
  let actualEndMarker = endMarker;
  if (!actualEndMarker) {
    if (pathParts.includes("definition.ts")) {
      actualEndMarker = "definition.ts";
    } else if (pathParts.includes("route.ts")) {
      actualEndMarker = "route.ts";
    } else if (pathParts.includes("route-client.ts")) {
      actualEndMarker = "route-client.ts";
    } else {
      // eslint-disable-next-line restricted/no-throw -- Build-time generator that throws for invalid configuration at startup
      throw new Error(
        `Could not auto-detect end marker (definition.ts, route.ts, or route-client.ts) in path: ${filePath}`,
      );
    }
  }

  const endIndex = pathParts.findIndex((p) => p === actualEndMarker);
  if (endIndex === -1) {
    // eslint-disable-next-line restricted/no-throw -- Build-time generator that throws for invalid configuration at startup
    throw new Error(`Could not find ${actualEndMarker} in path: ${filePath}`);
  }

  // Extract path segments between the anchor and the target file
  return pathParts.slice(startIndex + 1, endIndex);
}

/**
 * Write `content` to `filePath` only when the bytes on disk differ.
 *
 * Generators re-emit byte-identical output on almost every run. An
 * unconditional write still bumps mtime, and the gen-cache fingerprints inputs
 * as "path:mtime:size" — so a generator that WRITES files another generator
 * SCANS AS INPUT re-dirties that generator on every run and the cache can never
 * settle. The scan root covers generated output as well as hand-written source
 * (route shells are emitted under it and match the same `route.ts` glob that
 * feeds the endpoint generators), so this is not hypothetical: it is why four
 * generators never reported `cached` on two consecutive no-change runs.
 * Skipping the no-op write keeps mtimes stable and lets the cache converge.
 *
 * Returns true when bytes were actually written.
 */
export function writeFileIfChanged(filePath: string, content: string): boolean {
  if (existsSync(filePath)) {
    try {
      if (readFileSync(filePath, "utf8") === content) {
        return false;
      }
    } catch {
      // Unreadable (permissions, partial write) — fall through and rewrite.
    }
  }

  const outputDir = dirname(filePath);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  writeFileSync(filePath, content, "utf8");
  return true;
}

/**
 * Write generated content to file.
 *
 * Content-conditional via {@link writeFileIfChanged}: identical output is not
 * rewritten, so mtimes stay stable across no-change runs.
 */
export function writeGeneratedFile(
  filePath: string,
  content: string,
  dryRun = false,
): Promise<void> {
  if (!dryRun) {
    writeFileIfChanged(filePath, content);
  }
  return Promise.resolve();
}

/**
 * Generate standard file header
 */
export function generateFileHeader(
  title: string,
  generatedBy: string,
  additionalInfo?: Record<string, string | number>,
): string {
  const lines = ["/**"];
  lines.push(` * ${title}`);
  lines.push(` * Generated by ${generatedBy}`);

  if (additionalInfo) {
    lines.push(" *");
    for (const [key, value] of Object.entries(additionalInfo)) {
      lines.push(` * ${key}: ${value}`);
    }
  }

  lines.push(" */");

  return lines.join("\n");
}

/**
 * Sanitize a path segment to remove invalid characters for tool names
 * Removes square brackets from dynamic routes like [id]
 * This must match the sanitization in endpointToToolName to ensure consistency
 */
function sanitizePathSegment(segment: string): string {
  // Remove square brackets to handle dynamic routes like [id]
  // Example: "[id]" becomes "id", "[threadId]" becomes "threadId"
  return segment.replaceAll(/\[|\]/g, "");
}

/**
 * Extract path from definition file for flat structure
 * Returns path only - no duplicate parameter format aliases
 * Real aliases come from definition files, not parameter format variations
 * Uses PATH_SEPARATOR constant for consistency
 * Sanitizes path segments to match endpointToToolName behavior
 *
 * The default anchor MUST stay {@link ROUTE_ANCHOR_SEGMENT} rather than a
 * hardcoded "[locale]". They are the same string in this layout, but only the
 * named constant lets {@link extractNestedPath} recognise the anchor as the
 * configured one and fall back to the scan root when a path does not contain it.
 * A literal defeats that branch and turns every anchor-less definition into a
 * hard throw — which is exactly what a vendored copy with a different anchor hits.
 */
export function extractPathKey(
  filePath: string,
  startMarker: string = ROUTE_ANCHOR_SEGMENT,
): { path: string } {
  const nestedPath = extractNestedPath(filePath, startMarker);
  // Sanitize each segment to remove brackets from dynamic routes
  const sanitizedPath = nestedPath.map(sanitizePathSegment);
  const path = sanitizedPath.join(PATH_SEPARATOR);
  return { path };
}

const PRINT_WIDTH = 80;
const INDENT_STR = "  ";

/**
 * Serialize a string value like Prettier:
 * - Prefer double quotes
 * - But use single quotes if the string contains double quotes and no single quotes
 *   (avoids backslash escaping, matching Prettier's `singleQuote: false` + avoidEscape behavior)
 */
function serializeString(s: string): string {
  const doubleCount = (s.match(/"/g) ?? []).length;
  const singleCount = (s.match(/'/g) ?? []).length;
  // Prettier's avoidEscape: use single quotes when there are more double quotes
  // than single quotes (minimizes the number of escapes needed).
  if (doubleCount > singleCount) {
    // Use single quotes to avoid escaping double quotes.
    // Still escape backslashes, newlines, etc., and single quotes inside.
    const escaped = s
      .replaceAll("\\", "\\\\")
      .replaceAll("'", "\\'")
      .replaceAll("\n", "\\n")
      .replaceAll("\r", "\\r")
      .replaceAll("\t", "\\t");
    return `'${escaped}'`;
  }
  return JSON.stringify(s);
}

/**
 * Render a value inline (single line, no trailing comma).
 * Returns null if the value contains nested multiline content.
 */
function renderInline(value: WidgetData): string | null {
  if (value === null) {
    return "null";
  }
  if (value === undefined) {
    return "undefined";
  }
  if (typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "string") {
    return serializeString(value);
  }
  if (value instanceof Date) {
    // Same shape JSON.stringify gives a Date — an ISO string literal.
    return serializeString(value.toISOString());
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    const parts = value.map(renderInline);
    if (parts.some((p) => p === null)) {
      return null;
    }
    return `[${parts.join(", ")}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return "{}";
    }
    const parts = entries.map(([k, v]) => {
      const key = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
      const val = renderInline(v);
      if (val === null) {
        return null;
      }
      return `${key}: ${val}`;
    });
    if (parts.some((p) => p === null)) {
      return null;
    }
    return `{ ${parts.join(", ")} }`;
  }
  return null;
}

/**
 * Serialize a value as TypeScript object literal syntax.
 *
 * Matches Prettier's default output style:
 * - Unquoted keys for valid JS identifiers
 * - Trailing commas after every value in objects and arrays
 * - Values that fit on one line (≤80 chars including `prefixCols` column offset) stay inline
 * - Long strings wrap with `key:\n  "value"` style
 * - Indentation: 2 spaces per level
 *
 * @param value       The value to serialize
 * @param indentLevel Current nesting level (controls indentation)
 * @param prefixCols  Columns already used on the current line before this value (e.g. `  key: `.length)
 */
export function jsonToTs(
  value: WidgetData,
  indentLevel = 0,
  prefixCols = 0,
): string {
  const indent = INDENT_STR.repeat(indentLevel);
  const childIndent = INDENT_STR.repeat(indentLevel + 1);

  if (value === null) {
    return "null";
  }
  if (value === undefined) {
    return "undefined";
  }
  if (typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "string") {
    return serializeString(value);
  }
  if (value instanceof Date) {
    // Same shape JSON.stringify gives a Date — an ISO string literal.
    return serializeString(value.toISOString());
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }

    // Try inline for all arrays - renderInline returns null for values that
    // can't be represented inline (e.g. nested objects that are too deep).
    // +1 for the trailing comma that the parent object will append
    // Prettier rule: multi-element arrays containing objects/arrays are always
    // expanded, even if they fit on one line. Single-element is fine inline.
    const hasMultipleComplexItems =
      value.length > 1 &&
      value.some(
        (v) =>
          v !== null &&
          typeof v === "object" &&
          (Array.isArray(v) || Object.keys(v).length > 0),
      );
    if (!hasMultipleComplexItems) {
      const inlineParts = value.map(renderInline);
      if (inlineParts.every((p) => p !== null)) {
        const inline = `[${inlineParts.join(", ")}]`;
        if (prefixCols + inline.length + 1 <= PRINT_WIDTH) {
          return inline;
        }
      }
    }

    // Multiline
    const lines = value.map((v) => {
      const rendered = jsonToTs(v, indentLevel + 1, childIndent.length);
      return `${childIndent}${rendered},`;
    });
    return `[\n${lines.join("\n")}\n${indent}]`;
  }

  if (typeof value === "object") {
    // Skip undefined values (same as JSON.stringify behavior)
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    if (entries.length === 0) {
      return "{}";
    }

    // Try inline first (Prettier collapses objects onto one line if they fit)
    const inlineAttempt = renderInline(value);
    if (inlineAttempt !== null) {
      // +1 for trailing comma
      if (prefixCols + inlineAttempt.length + 1 <= PRINT_WIDTH) {
        return inlineAttempt;
      }
    }

    const lines = entries.map(([k, v]) => {
      const key = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
      // prefix = childIndent + key + ": "
      const linePrefix = childIndent.length + key.length + 2;
      const rendered = jsonToTs(v, indentLevel + 1, linePrefix);
      // +1 for trailing comma
      const lineLen = linePrefix + rendered.length + 1;
      // Wrap string values when the line exceeds printWidth AND key.length >= 5.
      // The key.length >= 5 condition mirrors oxfmt's savings threshold: wrapping
      // saves (key.length + 1) chars from the line maximum; the formatter only
      // breaks when savings >= 6, i.e. key.length >= 5.
      if (
        typeof v === "string" &&
        lineLen > PRINT_WIDTH &&
        key.length >= 5 &&
        !rendered.includes("\n")
      ) {
        return `${childIndent}${key}:\n${childIndent}  ${rendered},`;
      }
      return `${childIndent}${key}: ${rendered},`;
    });

    return `{\n${lines.join("\n")}\n${indent}}`;
  }

  return String(value);
}

/**
 * Generate absolute import path for definition or route file
 * nestedPath extracts segments after src/, which we then append to the base path
 */
export function generateAbsoluteImportPath(
  filePath: string,
  fileType: "definition" | "route",
): string {
  const nestedPath = extractNestedPath(filePath);
  const pathStr = nestedPath.join("/");
  return `@/${pathStr}/${fileType}`;
}
