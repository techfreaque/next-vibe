import { coreEnv } from "next-vibe/core/env";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

/**
 * Converts a relative storage URL to an absolute URL by prepending the app URL.
 * Used so that AI models, SSE events, and external consumers see fully-qualified URLs.
 * If the URL is already absolute (starts with http:// or https://) it is returned as-is.
 *
 * Uses the SERVER env (`coreEnv`, server-only), NOT the client env: this module
 * runs server-side only (storage adapters), and NEXT_PUBLIC_* values on the
 * client env are INLINED at build time. The Docker prod image is built with
 * placeholder env and no NEXT_PUBLIC_APP_URL, so the client value is baked to the
 * `http://localhost:3000` schema default and never patched at runtime (no sentinel
 * is injected for a key absent from the build env). `coreEnv` re-reads
 * `process.env.NEXT_PUBLIC_APP_URL` at runtime, so prod gets the real
 * `https://unbottled.ai` and dev keeps `http://localhost:3000` (incl. the
 * Hermes preview-port rewrite, which `coreEnv` applies identically).
 */
export function makeAbsoluteStorageUrl(relativeUrl: string): string {
  if (relativeUrl.startsWith("http://") || relativeUrl.startsWith("https://")) {
    return relativeUrl;
  }

  // Remove trailing slash from app URL before joining
  const base = coreEnv.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  return `${base}${relativeUrl}`;
}

/**
 * Absolute URL served by the thread-files endpoint
 * (vibe/agent/chat/threads/files/[threadId]/[filename]). Single source for
 * every storage adapter — a hand-built path that drifts from the endpoint's
 * route 404s every attachment.
 */
export function buildStorageFileUrl(
  threadId: string,
  filename: string,
): string {
  return makeAbsoluteStorageUrl(
    `/api/en-GLOBAL/vibe/agent/chat/threads/files/${threadId}/${filename}`,
  );
}

/**
 * The pattern for storage file URLs is:
 *   /api/{locale}/vibe/agent/chat/threads/files/{threadId}/{filename}
 * where filename is typically `{fileId}.{ext}`.
 *
 * Returns `{ threadId, fileId }` or null if the URL doesn't match.
 */
export function parseStorageUrl(
  url: string,
): { threadId: string; fileId: string } | null {
  // Match /agent/chat/threads/files/{threadId}/{fileId}.{ext}
  const match = /\/agent\/chat\/threads\/files\/([^/]+)\/([^/.]+)\.[^/]+$/.exec(
    url,
  );
  if (!match?.[1] || !match[2]) {
    return null;
  }
  return { threadId: match[1], fileId: match[2] };
}

/**
 * Resolve a storage URL to base64 data using the storage adapter directly.
 *
 * When `user` is provided, ownership is verified: the file's `uploadedBy` must
 * match `user.id`, or the user must be an ADMIN. Returns null if the file is not
 * found, ownership check fails, or the URL is not a recognised storage URL.
 *
 * For external URLs (non-storage), pass no user and use a plain fetch instead.
 */
export async function fetchStorageFileAsBase64(
  url: string,
  user?: JwtPayloadType,
  /** Fixture-aware fetch when called inside a stream; defaults to live fetch. */
  // oxlint-disable-next-line restricted/restricted-syntax -- live-fetch default for callers without a fixture chain
  fetchImpl: typeof globalThis.fetch = fetch,
): Promise<string | null> {
  const parsed = parseStorageUrl(url);
  if (!parsed) {
    // External URL — user/AI supplied, so never let it reach internal hosts
    // (cloud metadata, local services). Lazy: ssrf-guard is server-only.
    try {
      const { fetchPublicUrl } = await import("../../../core/utils/ssrf-guard");
      const response = await fetchPublicUrl(url, fetchImpl);
      if (!response?.ok) {
        return null;
      }
      const buffer = await response.arrayBuffer();
      return Buffer.from(buffer).toString("base64");
    } catch {
      return null;
    }
  }

  // Lazy import: adapters ← index ← url-utils is a module cycle; a static
  // import here TDZ-crashes SSR after partial HMR invalidation
  const { getStorageAdapter } = await import("./index");
  const storage = getStorageAdapter();

  // Verify ownership when a user is provided
  if (user) {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    if (!isAdmin) {
      const meta = await storage.getFileMetadata(parsed.fileId);
      if (!meta) {
        return null;
      }
      const userId = user.isPublic ? undefined : user.id;
      if (meta.uploadedBy !== userId) {
        return null;
      }
    }
  }

  try {
    return await storage.readFileAsBase64(parsed.fileId, parsed.threadId);
  } catch {
    return null;
  }
}

/** MIME type from a URL/file extension (for building data URIs). */
export function mimeFromUrl(url: string): string {
  const clean = url.split("?")[0]?.split("#")[0]?.toLowerCase() ?? "";
  const ext = clean.slice(clean.lastIndexOf(".") + 1);
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "mp3":
      return "audio/mpeg";
    case "wav":
      return "audio/wav";
    case "m4a":
      return "audio/mp4";
    default:
      return "image/png";
  }
}
