/**
 * Shared Generator Utilities
 * Simple utilities for all generators
 */

import "server-only";

import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

import { PATH_SEPARATOR } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";

/**
 * Default directories to exclude from scanning
 */
export const DEFAULT_EXCLUDE_DIRS = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  ".dist",
  "generated",
];

/**
 * Recursively find files with specific filename in a directory
 */
export function findFilesRecursively(
  dir: string,
  targetFilename: string,
  excludeDirs: string[] = DEFAULT_EXCLUDE_DIRS,
): string[] {
  const results: string[] = [];

  if (!existsSync(dir)) {
    return results;
  }

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    // Skip excluded directories
    if (entry.isDirectory() && excludeDirs.includes(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      // Recursively search subdirectories
      results.push(
        ...findFilesRecursively(fullPath, targetFilename, excludeDirs),
      );
    } else if (entry.isFile() && entry.name === targetFilename) {
      // Found a matching file
      results.push(fullPath);
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
 * Extract nested path segments from a file path
 * Example: src/app/api/[locale]/agent/chat/skills/definition.ts
 * Returns: ["agent", "chat", "characters"]
 */
export function extractNestedPath(
  filePath: string,
  startMarker = "[locale]",
  endMarker?: string,
): string[] {
  const pathParts = filePath.split("/");

  const startIndex = pathParts.findIndex((p) => p === startMarker);
  if (startIndex === -1) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Build-time generator that throws for invalid configuration at startup
    throw new Error(`Could not find ${startMarker} in path: ${filePath}`);
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
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Build-time generator that throws for invalid configuration at startup
      throw new Error(
        `Could not auto-detect end marker (definition.ts, route.ts, or route-client.ts) in path: ${filePath}`,
      );
    }
  }

  const endIndex = pathParts.findIndex((p) => p === actualEndMarker);
  if (endIndex === -1) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Build-time generator that throws for invalid configuration at startup
    throw new Error(`Could not find ${actualEndMarker} in path: ${filePath}`);
  }

  // Extract path segments between locale and the target file
  // Skip the [locale] marker itself, start from the next segment
  return pathParts.slice(startIndex + 1, endIndex);
}

/**
 * Extract module name from file path
 * Example: .../core/leads/seeds.ts -> "leads"
 * Example: .../core/emails/smtp-client/seeds.ts -> "smtp-client"
 */
export function extractModuleName(
  filePath: string,
  coreMarker = "core",
): string {
  const pathParts = filePath.split("/");
  const coreIndex = pathParts.findIndex((p) => p === coreMarker);

  if (coreIndex === -1 || coreIndex >= pathParts.length - 1) {
    return pathParts.at(-2) || "unknown";
  }

  const moduleParts = pathParts.slice(coreIndex + 1, pathParts.length - 1);
  return moduleParts.at(-1) || moduleParts.join("-");
}

/**
 * Write generated content to file
 */
export async function writeGeneratedFile(
  filePath: string,
  content: string,
  dryRun = false,
): Promise<void> {
  if (dryRun) {
    return;
  }

  const outputDir = dirname(filePath);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  await writeFile(filePath, content, "utf8");
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
 */
export function extractPathKey(
  filePath: string,
  startMarker = "[locale]",
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
// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- generic serializer accepts any value
function renderInline(value: unknown): string | null {
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
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- generic serializer
    const entries = Object.entries(value as Record<string, unknown>);
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
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- generic serializer accepts any value
  value: unknown,
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

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }

    // Try inline for all arrays — renderInline returns null for values that
    // can't be represented inline (e.g. nested objects that are too deep).
    // +1 for the trailing comma that the parent object will append
    const inlineParts = value.map(renderInline);
    if (inlineParts.every((p) => p !== null)) {
      const inline = `[${inlineParts.join(", ")}]`;
      if (prefixCols + inline.length + 1 <= PRINT_WIDTH) {
        return inline;
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
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- generic serializer
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, v]) => v !== undefined,
    );
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
 * nestedPath extracts segments after [locale], which we then append to the base path
 */
export function generateAbsoluteImportPath(
  filePath: string,
  fileType: "definition" | "route",
): string {
  const nestedPath = extractNestedPath(filePath);
  const pathStr = nestedPath.join("/");
  return `@/app/api/[locale]/${pathStr}/${fileType}`;
}
