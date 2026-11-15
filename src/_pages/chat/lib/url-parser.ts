/**
 * URL Parser
 * Utilities for parsing chat URL paths
 */

import { isDefaultFolderId } from "next-vibe/agent/chat/config";
import { NEW_MESSAGE_ID } from "next-vibe/agent/chat/enum";
import { DefaultFolderId } from "next-vibe/core/execution-context";

/**
 * Parsed URL result
 */
interface ParsedChatUrl {
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
 * Folder ids are UUIDs. Anything else in a folder slot (`/threads/shared/1`,
 * typos, crawler junk) is dropped instead of reaching a uuid column, where
 * Postgres fails the whole page query ("invalid input syntax for type uuid").
 */
function folderSegment(segment: string | undefined): string | null {
  return segment && isUUID(segment) ? segment : null;
}

/**
 * Parse chat URL path
 * URL structure: /threads/[rootId] OR /threads/[rootId]/[subFolderId] OR /threads/[rootId]/[subFolderId]/[threadId]
 */
export function parseChatUrl(urlPath: string[] | undefined): ParsedChatUrl {
  // Default values
  const defaultResult: ParsedChatUrl = {
    initialRootFolderId: DefaultFolderId.PRIVATE,
    initialSubFolderId: null,
    initialThreadId: null,
  };

  // If no URL path, return defaults
  if (!urlPath || urlPath.length === 0) {
    return defaultResult;
  }

  // Reject static asset requests that got caught by the catch-all route
  // (e.g. installHook.js.map, favicon.ico)
  if (urlPath.some((segment) => segment.includes("."))) {
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
  if (lastSegment === NEW_MESSAGE_ID) {
    // URL is /rootId/new or /rootId/subfolderId/new
    const subFolderId = urlPath.length >= 3 ? folderSegment(urlPath[1]) : null;
    return {
      initialRootFolderId: rootId,
      initialSubFolderId: subFolderId,
      initialThreadId: NEW_MESSAGE_ID,
    };
  }

  // Check if last segment is a thread by checking UUID format
  if (isUUID(lastSegment)) {
    // Last segment is a thread (UUID format)
    // URL is /rootId/threadId or /rootId/subfolderId/threadId
    const threadId = lastSegment;
    const subFolderId = urlPath.length >= 3 ? folderSegment(urlPath[1]) : null;
    return {
      initialRootFolderId: rootId,
      initialSubFolderId: subFolderId,
      initialThreadId: threadId,
    };
  }

  // Last segment is a sub folder (or just root if length is 1)
  // URL is /rootId or /rootId/subfolderId
  // A root folder id (private/shared/...) is not a UUID, so it drops too.
  const subFolderId = urlPath.length >= 2 ? folderSegment(urlPath[1]) : null;

  return {
    initialRootFolderId: rootId,
    initialSubFolderId: subFolderId,
    initialThreadId: null,
  };
}
