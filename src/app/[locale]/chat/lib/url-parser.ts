/**
 * URL Parser
 * Utilities for parsing chat URL paths
 */

import {
  DEFAULT_FOLDER_IDS,
  isDefaultFolderId,
} from "@/app/api/[locale]/v1/core/agent/chat/config";

import type { DefaultFolderId } from "../shared/types";

/**
 * Parsed URL result
 */
export interface ParsedChatUrl {
  initialRootFolderId: DefaultFolderId;
  initialSubFolderId: string | null;
  initialThreadId: string | null;
}

/**
 * Check if a string is a valid UUID
 */
export function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    str,
  );
}

/**
 * Parse chat URL path
 * URL structure: /threads/[rootId] OR /threads/[rootId]/[subFolderId] OR /threads/[rootId]/[subFolderId]/[threadId]
 */
export function parseChatUrl(urlPath: string[] | undefined): ParsedChatUrl {
  // Default values
  const defaultResult: ParsedChatUrl = {
    initialRootFolderId: DEFAULT_FOLDER_IDS.PRIVATE,
    initialSubFolderId: null,
    initialThreadId: null,
  };

  // If no URL path, return defaults
  if (!urlPath || urlPath.length === 0) {
    return defaultResult;
  }

  // First segment should be a root folder - validate it
  const firstSegment = urlPath[0];
  if (!firstSegment || !isDefaultFolderId(firstSegment)) {
    // Invalid root folder ID, return defaults
    return defaultResult;
  }

  const rootId: DefaultFolderId = firstSegment;
  const lastSegment = urlPath[urlPath.length - 1];

  // Check if last segment is "new" (new thread)
  if (lastSegment === "new") {
    // URL is /rootId/new or /rootId/subfolderId/new
    const subFolderId = urlPath.length >= 3 ? urlPath[1] : null;
    return {
      initialRootFolderId: rootId,
      initialSubFolderId: subFolderId,
      initialThreadId: "new",
    };
  }

  // Check if last segment is a thread by checking UUID format
  if (isUUID(lastSegment)) {
    // Last segment is a thread (UUID format)
    // URL is /rootId/threadId or /rootId/subfolderId/threadId
    const threadId = lastSegment;
    const subFolderId = urlPath.length >= 3 ? urlPath[1] : null;
    return {
      initialRootFolderId: rootId,
      initialSubFolderId: subFolderId,
      initialThreadId: threadId,
    };
  }

  // Last segment is a sub folder (or just root if length is 1)
  // URL is /rootId or /rootId/subfolderId
  // IMPORTANT: Check if urlPath[1] is a root folder ID - if so, it's NOT a subfolder
  const secondSegment = urlPath.length >= 2 ? urlPath[1] : null;
  const isSecondSegmentRootFolder =
    secondSegment === "private" ||
    secondSegment === "shared" ||
    secondSegment === "public" ||
    secondSegment === "incognito";

  const subFolderId =
    secondSegment && !isSecondSegmentRootFolder ? secondSegment : null;

  return {
    initialRootFolderId: rootId,
    initialSubFolderId: subFolderId,
    initialThreadId: null,
  };
}

/**
 * Build chat URL path from components
 */
export function buildChatUrl(
  rootFolderId: DefaultFolderId,
  subFolderId: string | null,
  threadId: string | null,
): string {
  const parts = ["/threads", rootFolderId];

  if (subFolderId) {
    parts.push(subFolderId);
  }

  if (threadId) {
    parts.push(threadId);
  }

  return parts.join("/");
}
