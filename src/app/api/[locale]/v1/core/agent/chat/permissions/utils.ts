/**
 * Chat Permission Utilities
 * Functions for checking user permissions across folders, threads, and messages
 */

import "server-only";

import type {
  ChatFolder,
  ChatMessage,
  ChatThread,
} from "@/app/api/[locale]/v1/core/agent/chat/db";
import { FolderType } from "@/app/api/[locale]/v1/core/agent/chat/enum";

/**
 * Check if a folder is of a specific type
 */
function isFolderType(folder: ChatFolder, type: string): boolean {
  return folder.folderType === type;
}

/**
 * Check if user or lead is the owner of a folder
 */
function isOwner(
  userId: string | null,
  leadId: string | null,
  folder: ChatFolder,
): boolean {
  if (userId !== null && folder.userId === userId) {
    return true;
  }
  if (leadId !== null && folder.leadId === leadId) {
    return true;
  }
  return false;
}

/**
 * Check if user is a moderator of a folder
 * Note: Only authenticated users can be moderators, not leads
 */
export function isModerator(
  userId: string | null,
  folder: ChatFolder,
): boolean {
  if (!userId) {
    return false;
  }
  const moderatorIds = (folder.moderatorIds as string[]) || [];
  return moderatorIds.includes(userId);
}

/**
 * Check if user has access via share token
 * Note: This should be called after validating the share token from the request
 */
function hasShareAccess(
  userId: string | null,
  folder: ChatFolder,
  shareToken?: string,
): boolean {
  if (!isFolderType(folder, FolderType.SHARED)) {
    return false;
  }
  if (!folder.shareToken) {
    return false;
  }

  // If share token matches, check if there are user restrictions
  if (shareToken && folder.shareToken === shareToken) {
    const allowedUserIds = (folder.allowedUserIds as string[]) || [];
    // If no restrictions, anyone with the link can access
    if (allowedUserIds.length === 0) {
      return true;
    }
    // If restrictions exist, check if user is in the list
    return userId !== null && allowedUserIds.includes(userId);
  }

  return false;
}

/**
 * Check if user or lead can read a folder
 */
export function canReadFolder(
  userId: string | null,
  leadId: string | null,
  folder: ChatFolder,
  shareToken?: string,
): boolean {
  // Incognito folders are never accessible via API
  if (isFolderType(folder, FolderType.INCOGNITO)) {
    return false;
  }

  // Owner can always read
  if (isOwner(userId, leadId, folder)) {
    return true;
  }

  // Public folders are readable by all authenticated users AND leads
  if (isFolderType(folder, FolderType.PUBLIC) && folder.isPublic) {
    return userId !== null || leadId !== null;
  }

  // Shared folders are readable by share token holders
  if (isFolderType(folder, FolderType.SHARED)) {
    return hasShareAccess(userId, folder, shareToken);
  }

  // Private folders are only readable by owner
  return false;
}

/**
 * Check if user or lead can write to a folder (create threads/messages)
 */
export function canWriteFolder(
  userId: string | null,
  leadId: string | null,
  folder: ChatFolder,
  shareToken?: string,
): boolean {
  // Must be authenticated (user) or have leadId to write
  if (!userId && !leadId) {
    return false;
  }

  // Incognito folders are never accessible via API
  if (isFolderType(folder, FolderType.INCOGNITO)) {
    return false;
  }

  // Owner can always write
  if (isOwner(userId, leadId, folder)) {
    return true;
  }

  // Moderators can write to public folders (only authenticated users can be moderators)
  if (
    userId &&
    isFolderType(folder, FolderType.PUBLIC) &&
    isModerator(userId, folder)
  ) {
    return true;
  }

  // Public folders are writable by all authenticated users AND leads
  if (isFolderType(folder, FolderType.PUBLIC) && folder.isPublic) {
    return true;
  }

  // Shared folders are writable by share token holders (only authenticated users)
  if (userId && isFolderType(folder, FolderType.SHARED)) {
    return hasShareAccess(userId, folder, shareToken);
  }

  // Private folders are only writable by owner
  return false;
}

/**
 * Check if user or lead can delete a folder
 */
export function canDeleteFolder(
  userId: string | null,
  leadId: string | null,
  folder: ChatFolder,
): boolean {
  // Only owner can delete folders
  return isOwner(userId, leadId, folder);
}

/**
 * Check if user or lead can manage folder permissions (change settings, add moderators, etc.)
 */
export function canManageFolder(
  userId: string | null,
  leadId: string | null,
  folder: ChatFolder,
): boolean {
  // Only owner can manage folder permissions
  return isOwner(userId, leadId, folder);
}

/**
 * Check if user or lead can read a thread
 */
export function canReadThread(
  userId: string | null,
  leadId: string | null,
  thread: ChatThread,
  folder: ChatFolder,
  shareToken?: string,
): boolean {
  // Thread permissions inherit from folder
  return canReadFolder(userId, leadId, folder, shareToken);
}

/**
 * Check if user or lead can write to a thread (add messages)
 */
export function canWriteThread(
  userId: string | null,
  leadId: string | null,
  thread: ChatThread,
  folder: ChatFolder,
  shareToken?: string,
): boolean {
  // Thread permissions inherit from folder
  return canWriteFolder(userId, leadId, folder, shareToken);
}

/**
 * Check if user or lead can delete a thread
 */
export function canDeleteThread(
  userId: string | null,
  leadId: string | null,
  thread: ChatThread,
  folder: ChatFolder,
): boolean {
  // Owner can always delete
  if (isOwner(userId, leadId, folder)) {
    return true;
  }

  // Moderators can delete threads in public folders (only authenticated users)
  if (
    userId &&
    isFolderType(folder, FolderType.PUBLIC) &&
    isModerator(userId, folder)
  ) {
    return true;
  }

  // Thread owner can delete their own thread
  if (userId && thread.userId === userId) {
    return true;
  }
  if (leadId && thread.leadId === leadId) {
    return true;
  }

  return false;
}

/**
 * Check if user or lead can read a message
 */
export function canReadMessage(
  userId: string | null,
  leadId: string | null,
  message: ChatMessage,
  thread: ChatThread,
  folder: ChatFolder,
  shareToken?: string,
): boolean {
  // Message permissions inherit from thread/folder
  return canReadThread(userId, leadId, thread, folder, shareToken);
}

/**
 * Check if user or lead can edit a message
 */
export function canEditMessage(
  userId: string | null,
  leadId: string | null,
  message: ChatMessage,
  folder: ChatFolder,
): boolean {
  if (!userId && !leadId) {
    return false;
  }

  // Owner can edit any message
  if (isOwner(userId, leadId, folder)) {
    return true;
  }

  // Moderators can edit any message in public folders (only authenticated users)
  if (
    userId &&
    isFolderType(folder, FolderType.PUBLIC) &&
    isModerator(userId, folder)
  ) {
    return true;
  }

  // Users/leads can edit their own messages
  return message.authorId === userId || message.authorId === leadId;
}

/**
 * Check if user or lead can delete a message
 */
export function canDeleteMessage(
  userId: string | null,
  leadId: string | null,
  message: ChatMessage,
  folder: ChatFolder,
): boolean {
  if (!userId && !leadId) {
    return false;
  }

  // Owner can delete any message
  if (isOwner(userId, leadId, folder)) {
    return true;
  }

  // Moderators can delete any message in public folders (only authenticated users)
  if (
    userId &&
    isFolderType(folder, FolderType.PUBLIC) &&
    isModerator(userId, folder)
  ) {
    return true;
  }

  // Users/leads can delete their own messages
  return message.authorId === userId || message.authorId === leadId;
}

/**
 * Check if user or lead can vote on a message
 */
export function canVoteMessage(
  userId: string | null,
  leadId: string | null,
  message: ChatMessage,
  folder: ChatFolder,
  shareToken?: string,
): boolean {
  // Must be authenticated or have leadId to vote
  if (!userId && !leadId) {
    return false;
  }

  // Can't vote on your own messages
  if (message.authorId === userId || message.authorId === leadId) {
    return false;
  }

  // Voting permissions inherit from folder read permissions
  return canReadFolder(userId, leadId, folder, shareToken);
}

/**
 * Generate a secure share token for shared folders
 */
export async function generateShareToken(): Promise<string> {
  const crypto = await import("node:crypto");
  return crypto.randomBytes(32).toString("base64url");
}

/**
 * Validate share token format
 */
export function isValidShareToken(token: string): boolean {
  // Base64url tokens should be 43 characters (32 bytes encoded)
  return /^[\w-]{43}$/.test(token);
}

/**
 * Check if a user has any elevated permissions in a folder
 * Note: Only authenticated users can have elevated permissions (owner/moderator)
 */
export function hasElevatedPermissions(
  userId: string | null,
  leadId: string | null,
  folder: ChatFolder,
): boolean {
  return (
    isOwner(userId, leadId, folder) ||
    (userId !== null && isModerator(userId, folder))
  );
}

/**
 * Get permission level for a user or lead in a folder
 */
export function getPermissionLevel(
  userId: string | null,
  leadId: string | null,
  folder: ChatFolder,
  shareToken?: string,
): "owner" | "moderator" | "write" | "read" | "none" {
  if (!userId && !leadId) {
    // Check if anonymous read is allowed (future feature)
    if (isFolderType(folder, FolderType.PUBLIC) && folder.isPublic) {
      return "read";
    }
    return "none";
  }

  if (isOwner(userId, leadId, folder)) {
    return "owner";
  }
  if (userId && isModerator(userId, folder)) {
    return "moderator";
  }
  if (canWriteFolder(userId, leadId, folder, shareToken)) {
    return "write";
  }
  if (canReadFolder(userId, leadId, folder, shareToken)) {
    return "read";
  }
  return "none";
}
