import { envClient } from "@/config/env-client";

import { getStorageAdapter } from "./index";

/**
 * Converts a relative storage URL to an absolute URL by prepending NEXT_PUBLIC_APP_URL.
 * Used so that AI models, SSE events, and external consumers see fully-qualified URLs.
 * If the URL is already absolute (starts with http:// or https://) it is returned as-is.
 */
export function makeAbsoluteStorageUrl(relativeUrl: string): string {
  if (relativeUrl.startsWith("http://") || relativeUrl.startsWith("https://")) {
    return relativeUrl;
  }

  // Remove trailing slash from app URL before joining
  const base = envClient.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  return `${base}${relativeUrl}`;
}

/**
 * The pattern for storage file URLs is:
 *   /api/{locale}/agent/chat/threads/files/{threadId}/{filename}
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
 * Resolve a file URL to base64 data. Tries direct storage access first
 * (bypasses HTTP auth), then falls back to HTTP fetch for external URLs.
 *
 * Use this instead of bare `fetch(url)` when loading generated media
 * (images/video/audio) for AI model consumption. The direct storage path
 * avoids the authentication requirement on the file-serving endpoint and
 * works reliably in both dev (localhost) and production (CDN/S3) contexts.
 */
export async function fetchStorageFileAsBase64(
  url: string,
): Promise<string | null> {
  // Try direct storage access if the URL matches our storage URL pattern
  const parsed = parseStorageUrl(url);
  if (parsed) {
    try {
      const storage = getStorageAdapter();
      const base64 = await storage.readFileAsBase64(
        parsed.fileId,
        parsed.threadId,
      );
      if (base64) {
        return base64;
      }
    } catch {
      // Fall through to HTTP fetch
    }
  }

  // HTTP fetch fallback for external URLs or when direct storage access fails
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString("base64");
  } catch {
    return null;
  }
}
