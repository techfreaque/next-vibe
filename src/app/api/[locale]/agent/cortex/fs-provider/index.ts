/**
 * Cortex Filesystem Provider - Guard & Path Mapping
 *
 * In preview mode for admin users, Cortex operations read/write the `data/`
 * directory on disk instead of PostgreSQL.
 */

import "server-only";

import { resolve } from "node:path";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";

import { normalizePath } from "../repository";

/**
 * Bivariant translation function type for filesystem providers.
 * Uses method shorthand so scoped `t` with narrower key unions satisfies this constraint.
 */
export interface FsTranslate {
  t(key: string, params?: Record<string, string>): TranslatedKeyType;
}

/**
 * Check if a caught error is a Node.js filesystem error with a specific code.
 * Replaces `(error as NodeJS.ErrnoException).code === "..."` assertions.
 */
export function hasErrCode(
  error: NodeJS.ErrnoException,
  code: string,
): boolean {
  return error.code === code;
}

/**
 * Root of the filesystem-backed Cortex data directory.
 * Lives at `<project-root>/data/`.
 */
export const DATA_ROOT = resolve(process.cwd(), "data");

/**
 * Returns true when Cortex should use the filesystem backend.
 * Conditions: admin user AND one of:
 *   - IS_PREVIEW_MODE=true  (set by `vibe --local`)
 *   - NEXT_PUBLIC_LOCAL_MODE=true  (explicit local mode flag)
 *   - NODE_ENV=development  (local dev server)
 */
export function isFilesystemMode(user: JwtPrivatePayloadType): boolean {
  if (user.isPublic || !user.roles.includes(UserPermissionRole.ADMIN)) {
    return false;
  }
  return (
    process.env["IS_PREVIEW_MODE"] === "true" ||
    process.env["NEXT_PUBLIC_LOCAL_MODE"] === "true" ||
    process.env["NODE_ENV"] === "development"
  );
}

/**
 * Map a Cortex path to an absolute filesystem path under `data/`.
 *
 * @example cortexPathToDisk("/documents/notes/meeting.md") → "<cwd>/data/documents/notes/meeting.md"
 */
export function cortexPathToDisk(cortexPath: string): string {
  const normalized = normalizePath(cortexPath);
  return resolve(DATA_ROOT, normalized.slice(1));
}

/**
 * Convert an absolute disk path back to a Cortex path.
 *
 * @example diskPathToCortex("<cwd>/data/documents/notes/meeting.md") → "/documents/notes/meeting.md"
 */
export function diskPathToCortex(diskPath: string): string {
  const relative = diskPath.slice(DATA_ROOT.length);
  return relative || "/";
}
