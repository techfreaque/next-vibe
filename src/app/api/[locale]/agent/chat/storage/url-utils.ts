import { envClient } from "@/config/env-client";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

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
): Promise<string | null> {
  const parsed = parseStorageUrl(url);
  if (!parsed) {
    // External URL - plain fetch, no auth concern
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
