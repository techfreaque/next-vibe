/**
 * Instance-independent storage URL references (pure, client-safe).
 *
 * A chat storage file is identified by `{threadId}/{filename}` alone. The host
 * that served it is NOT part of its identity: persisting an absolute URL bakes
 * in whichever base URL the writing process resolved (a prod image once baked
 * `http://localhost:3000`), and a route move (`/agent/...` →
 * `/vibe/agent/...`) strands every stored link. So:
 *
 * - Writers persist the PORTABLE form: a root-relative path on the canonical
 *   route (`buildStorageFilePath`).
 * - Readers resolve it on the SERVING instance at read/render time
 *   (`resolveStorageUrl` server-side, `resolveMediaSrc` in UI).
 * - Legacy absolute URLs (any host, legacy route) normalize to the same
 *   portable form via `toPortableStorageUrl` / `rewriteStorageUrlsInText`.
 */

import { z } from "zod";

/** Canonical route of the thread-files endpoint (locale-agnostic file serving). */
export const STORAGE_FILES_ROUTE =
  "/api/en-GLOBAL/vibe/agent/chat/threads/files";

/**
 * Any storage-file URL: optional `scheme://host`, any locale segment, legacy
 * (`/agent/...`) or current (`/vibe/agent/...`) route. Groups: 1 threadId,
 * 2 filename (`{fileId}.{ext}`). Query/fragment stay outside the match.
 */
const STORAGE_URL_SOURCE =
  "(?:https?:\\/\\/[^\\s/\"'()<>\\[\\]\\\\]+)?\\/api\\/[A-Za-z]{2}-[A-Za-z]+(?:\\/vibe)?\\/agent\\/chat\\/threads\\/files\\/([A-Za-z0-9_-]+)\\/([A-Za-z0-9_-]+\\.[A-Za-z0-9]+)";

const STORAGE_URL_EXACT = new RegExp(`^${STORAGE_URL_SOURCE}(?=[?#]|$)`);

/** Root-relative, host-free storage path: the form to persist. */
export function buildStorageFilePath(
  threadId: string,
  filename: string,
): string {
  return `${STORAGE_FILES_ROUTE}/${threadId}/${filename}`;
}

/** True for a storage-file URL in any form (relative, any host, legacy route). */
export function isStorageUrl(url: string): boolean {
  return STORAGE_URL_EXACT.test(url);
}

/**
 * Normalize a storage-file URL to its portable root-relative form on the
 * canonical route. Non-storage URLs (third-party, data URIs) return unchanged.
 */
export function toPortableStorageUrl(url: string): string {
  const match = STORAGE_URL_EXACT.exec(url);
  if (!match?.[1] || !match[2]) {
    return url;
  }
  return `${buildStorageFilePath(match[1], match[2])}${url.slice(match[0].length)}`;
}

/**
 * Rewrite every storage-file URL inside free text (markdown content, tool
 * output) to its portable form. Idempotent.
 */
export function rewriteStorageUrlsInText(text: string): string {
  return text.replace(new RegExp(STORAGE_URL_SOURCE, "g"), (match) =>
    toPortableStorageUrl(match),
  );
}

/** Every storage-file URL inside free text, in order of appearance. */
export function findStorageUrls(text: string): string[] {
  return text.match(new RegExp(STORAGE_URL_SOURCE, "g")) ?? [];
}

/**
 * Request-field schema for media URLs an AI or user passes back in: an
 * absolute URL OR a portable storage path (what tool results now return).
 * Replaces `z.string().url()`, which rejects root-relative storage paths.
 */
export const mediaUrlSchema = z
  .string()
  .refine((value) => isStorageUrl(value) || URL.canParse(value), {
    message: "Expected an absolute URL or a storage file path",
  });
