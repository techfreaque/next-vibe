import "server-only";

/**
 * Cortex Shared Repository
 * Path utilities and common operations for the virtual filesystem
 */

import { and, eq, like, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import type { CountryLanguage } from "@/i18n/core/config";

import { cortexNodes, type CortexNode } from "./db";
import { CortexNodeType } from "./enum";
import { scopedTranslation } from "./i18n";

/** Maximum path length */
const MAX_PATH_LENGTH = 1024;

/** Maximum nesting depth */
const MAX_DEPTH = 20;

/** Reserved mount prefixes — these paths resolve to existing tables, not cortex_nodes */
export const VIRTUAL_MOUNTS = [
  "/threads",
  "/skills",
  "/favorites",
  "/tasks",
  "/uploads",
  "/searches",
  "/gens",
] as const;

/** Virtual mounts that support write-through (write/edit/delete/move) */
export const WRITABLE_MOUNTS = ["/skills"] as const;

/** The document workspace prefix — canonical English, stored in cortex_nodes */
export const DOCUMENTS_PREFIX = "/documents";

/** The memories prefix — canonical English, stored in cortex_nodes */
export const MEMORIES_PREFIX = "/memories";

/** All native writable prefixes (stored in cortex_nodes, not virtual mounts) */
export const NATIVE_WRITABLE_PREFIXES = [
  DOCUMENTS_PREFIX,
  MEMORIES_PREFIX,
] as const;

/**
 * Get the locale-aware roots for memories and documents.
 * These are the paths users and AI should use in their locale.
 * Cached per-locale to avoid repeated i18n lookups.
 */
export function getLocaleRootsSync(locale: CountryLanguage): {
  memories: string;
  documents: string;
} {
  const { t } = scopedTranslation.scopedT(locale);
  return {
    memories: `/${t("scaffold.roots.memories" as never)}`,
    documents: `/${t("scaffold.roots.documents" as never)}`,
  };
}

/**
 * Check if a path is under a native writable prefix, accepting both canonical
 * (English) paths and locale-aware paths.
 * Returns the canonical prefix if writable, null otherwise.
 */
export function getCanonicalWritablePrefix(
  path: string,
  locale?: CountryLanguage,
): string | null {
  // Check English canonical first
  for (const prefix of NATIVE_WRITABLE_PREFIXES) {
    if (path === prefix || path.startsWith(`${prefix}/`)) {
      return prefix;
    }
  }
  // Check locale-aware roots if locale provided
  if (locale) {
    const roots = getLocaleRootsSync(locale);
    if (path === roots.memories || path.startsWith(`${roots.memories}/`)) {
      return MEMORIES_PREFIX;
    }
    if (path === roots.documents || path.startsWith(`${roots.documents}/`)) {
      return DOCUMENTS_PREFIX;
    }
  }
  return null;
}

/**
 * Normalize a locale-aware path to its canonical English equivalent.
 * e.g. /erinnerungen/identität/name.md → /memories/identity/name.md
 * Only remaps the ROOT segment; subdirectory names are preserved as-is.
 * If the path is already canonical (or not locale-specific), returns as-is.
 */
export function normalizeToCanonicalPath(
  path: string,
  locale: CountryLanguage,
): string {
  const roots = getLocaleRootsSync(locale);
  // Remap locale root → canonical root (only root segment)
  if (path === roots.memories) {
    return MEMORIES_PREFIX;
  }
  if (path.startsWith(`${roots.memories}/`)) {
    return MEMORIES_PREFIX + path.slice(roots.memories.length);
  }
  if (path === roots.documents) {
    return DOCUMENTS_PREFIX;
  }
  if (path.startsWith(`${roots.documents}/`)) {
    return DOCUMENTS_PREFIX + path.slice(roots.documents.length);
  }
  return path;
}

/**
 * Convert a canonical path back to locale-aware path for display.
 * e.g. /memories/identity → /erinnerungen/identity (for DE locale)
 * Note: only the ROOT segment is localized; file/subdir names stay as stored.
 */
export function canonicalToLocalePath(
  path: string,
  locale: CountryLanguage,
): string {
  const roots = getLocaleRootsSync(locale);
  if (path === MEMORIES_PREFIX) {
    return roots.memories;
  }
  if (path.startsWith(`${MEMORIES_PREFIX}/`)) {
    return roots.memories + path.slice(MEMORIES_PREFIX.length);
  }
  if (path === DOCUMENTS_PREFIX) {
    return roots.documents;
  }
  if (path.startsWith(`${DOCUMENTS_PREFIX}/`)) {
    return roots.documents + path.slice(DOCUMENTS_PREFIX.length);
  }
  return path;
}

/**
 * Normalize a path: resolve "..", ensure leading "/", remove trailing "/", collapse "//"
 */
export function normalizePath(raw: string): string {
  // Ensure leading slash
  let path = raw.startsWith("/") ? raw : `/${raw}`;

  // Collapse multiple slashes
  path = path.replace(/\/+/g, "/");

  // Remove trailing slash (except for root)
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  // Resolve ".." segments
  const segments = path.split("/").filter(Boolean);
  const resolved: string[] = [];
  for (const seg of segments) {
    if (seg === "..") {
      resolved.pop();
    } else if (seg !== ".") {
      resolved.push(seg);
    }
  }

  return `/${resolved.join("/")}`;
}

/**
 * Validate a path is safe and well-formed
 */
export function isValidPath(path: string): boolean {
  if (path.length > MAX_PATH_LENGTH) {
    return false;
  }
  if (!path.startsWith("/")) {
    return false;
  }
  if (path.includes("..")) {
    return false;
  }
  if (path.includes("//")) {
    return false;
  }

  const segments = path.split("/").filter(Boolean);
  if (segments.length > MAX_DEPTH) {
    return false;
  }

  // No empty or whitespace-only segments
  for (const seg of segments) {
    if (seg.trim().length === 0) {
      return false;
    }
    // No control characters — intentional use of control char regex
    // eslint-disable-next-line no-control-regex
    if (/[\x00-\x1f\x7f]/.test(seg)) {
      return false;
    }
    // No SQL LIKE wildcards in path segments
    if (/[%_]/.test(seg)) {
      return false;
    }
  }

  return true;
}

/**
 * Check if a path is writable (under /documents/ or /memories/, canonical or locale-aware).
 * Pass locale to also accept locale-aware paths (e.g. /erinnerungen/, /dokumente/).
 */
export function isWritablePath(path: string, locale: CountryLanguage): boolean {
  return getCanonicalWritablePrefix(path, locale) !== null;
}

/**
 * Check if a path is under a writable virtual mount (write-through to native repo)
 */
export function isVirtualWritable(path: string): boolean {
  return WRITABLE_MOUNTS.some(
    (mount) => path === mount || path.startsWith(`${mount}/`),
  );
}

/**
 * Check if a path is a virtual mount (resolved from existing tables).
 * Locale-aware paths for memories/documents are NOT virtual mounts.
 */
export function isVirtualMount(path: string, locale: CountryLanguage): boolean {
  if (path === "/") {
    return true;
  }
  // If it's a writable native path (incl. locale variants), not a virtual mount
  if (locale && getCanonicalWritablePrefix(path, locale) !== null) {
    return false;
  }
  if (getCanonicalWritablePrefix(path) !== null) {
    return false;
  }
  return VIRTUAL_MOUNTS.some(
    (mount) => path === mount || path.startsWith(`${mount}/`),
  );
}

/**
 * Get the mount prefix for a path, or null if unrecognized.
 * Pass locale to also recognize locale-aware paths (returns canonical prefix).
 */
export function getMountPrefix(
  path: string,
  locale: CountryLanguage,
):
  | (typeof VIRTUAL_MOUNTS)[number]
  | (typeof NATIVE_WRITABLE_PREFIXES)[number]
  | null {
  // Check canonical native writable prefixes first
  for (const prefix of NATIVE_WRITABLE_PREFIXES) {
    if (path === prefix || path.startsWith(`${prefix}/`)) {
      return prefix;
    }
  }
  // Check locale-aware roots → return canonical
  if (locale) {
    const canonicalPrefix = getCanonicalWritablePrefix(path, locale);
    if (canonicalPrefix) {
      return canonicalPrefix as (typeof NATIVE_WRITABLE_PREFIXES)[number];
    }
  }
  for (const mount of VIRTUAL_MOUNTS) {
    if (path === mount || path.startsWith(`${mount}/`)) {
      return mount;
    }
  }
  return null;
}

/**
 * Get parent path: "/documents/notes/meeting.md" -> "/documents/notes"
 */
export function parentPath(path: string): string {
  const lastSlash = path.lastIndexOf("/");
  if (lastSlash <= 0) {
    return "/";
  }
  return path.slice(0, lastSlash);
}

/**
 * Get basename: "/documents/notes/meeting.md" -> "meeting.md"
 */
export function basename(path: string): string {
  const lastSlash = path.lastIndexOf("/");
  return path.slice(lastSlash + 1);
}

/**
 * Get depth: "/" = 0, "/a" = 1, "/a/b" = 2
 */
export function pathDepth(path: string): number {
  if (path === "/") {
    return 0;
  }
  return path.split("/").filter(Boolean).length;
}

/**
 * Parse YAML-style frontmatter from markdown content.
 * Returns the extracted key-value pairs and the body without frontmatter.
 */
export function parseFrontmatter(content: string): {
  frontmatter: Record<string, string | number | boolean | null>;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const yamlBlock = match[1];
  const body = match[2];
  const frontmatter: Record<string, string | number | boolean | null> = {};

  for (const line of yamlBlock.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) {
      continue;
    }
    const key = line.slice(0, colonIdx).trim();
    const rawValue = line.slice(colonIdx + 1).trim();

    if (!key) {
      continue;
    }

    // Parse value types
    if (rawValue === "true") {
      frontmatter[key] = true;
    } else if (rawValue === "false") {
      frontmatter[key] = false;
    } else if (rawValue === "null" || rawValue === "") {
      frontmatter[key] = null;
    } else if (/^-?\d+(\.\d+)?$/.test(rawValue)) {
      frontmatter[key] = Number(rawValue);
    } else {
      // Strip surrounding quotes
      frontmatter[key] =
        rawValue.startsWith('"') && rawValue.endsWith('"')
          ? rawValue.slice(1, -1)
          : rawValue;
    }
  }

  return { frontmatter, body };
}

/**
 * Get a Cortex node by user + path
 */
export async function getNode(
  userId: string,
  path: string,
): Promise<CortexNode | null> {
  const rows = await db
    .select()
    .from(cortexNodes)
    .where(and(eq(cortexNodes.userId, userId), eq(cortexNodes.path, path)))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * Check if a path exists for a user
 */
export async function pathExists(
  userId: string,
  path: string,
): Promise<boolean> {
  const rows = await db
    .select({ id: cortexNodes.id })
    .from(cortexNodes)
    .where(and(eq(cortexNodes.userId, userId), eq(cortexNodes.path, path)))
    .limit(1);
  return rows.length > 0;
}

/**
 * List direct children of a directory path
 */
export async function listChildren(
  userId: string,
  dirPath: string,
): Promise<CortexNode[]> {
  const prefix = dirPath === "/" ? "/" : `${dirPath}/`;
  const targetDepth = pathDepth(dirPath) + 1;

  const rows = await db
    .select()
    .from(cortexNodes)
    .where(
      and(
        eq(cortexNodes.userId, userId),
        dirPath === "/" ? sql`true` : like(cortexNodes.path, `${prefix}%`),
        // Filter to exact depth in SQL (count slashes = target depth)
        sql`(LENGTH(${cortexNodes.path}) - LENGTH(REPLACE(${cortexNodes.path}, '/', ''))) = ${targetDepth}`,
      ),
    )
    .orderBy(cortexNodes.sortOrder, cortexNodes.path);

  return rows;
}

/**
 * Ensure all parent directories exist for a path, creating them if needed.
 * Accepts canonical English paths only (normalize before calling).
 * Returns the number of directories created.
 */
export async function ensureParentDirs(
  userId: string,
  filePath: string,
): Promise<number> {
  const parent = parentPath(filePath);

  // Find the root prefix for this path (canonical only)
  const rootPrefix = NATIVE_WRITABLE_PREFIXES.find(
    (prefix) => filePath === prefix || filePath.startsWith(`${prefix}/`),
  );
  if (!rootPrefix || parent === "/" || parent === rootPrefix) {
    return 0;
  }

  // Collect all ancestor paths that need to exist
  const ancestors: string[] = [];
  let current = parent;
  while (current !== "/" && current.length > rootPrefix.length) {
    ancestors.unshift(current);
    current = parentPath(current);
  }

  let created = 0;
  for (const ancestorPath of ancestors) {
    const result = await db
      .insert(cortexNodes)
      .values({
        userId,
        path: ancestorPath,
        nodeType: CortexNodeType.DIR,
        content: null,
        size: 0,
      })
      .onConflictDoNothing()
      .returning({ id: cortexNodes.id });
    if (result.length > 0) {
      created++;
    }
  }
  return created;
}
