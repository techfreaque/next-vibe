/**
 * Chat Permission System
 * Implements permission checks for folders, threads, and messages
 * Based on the permission model defined in README.md
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { userRolesRepository } from "@/app/api/[locale]/v1/core/user/user-roles/repository";

import type { ChatFolder, ChatMessage, ChatThread } from "../db";

/**
 * Check if user is an admin
 */
export async function isAdmin(
  userId: string,
  logger: EndpointLogger,
): Promise<boolean> {
  const hasAdminRole = await userRolesRepository.hasRole(
    userId,
    UserRole.ADMIN,
    logger,
  );
  return hasAdminRole.success && hasAdminRole.data;
}

/**
 * Check if user is a moderator of a folder
 */
export function isFolderModerator(userId: string, folder: ChatFolder): boolean {
  if (!folder.moderatorIds || !Array.isArray(folder.moderatorIds)) {
    return false;
  }
  return folder.moderatorIds.includes(userId);
}

/**
 * Check if user is a moderator of a thread
 */
export function isThreadModerator(userId: string, thread: ChatThread): boolean {
  if (!thread.moderatorIds || !Array.isArray(thread.moderatorIds)) {
    return false;
  }
  return thread.moderatorIds.includes(userId);
}

/**
 * Check if user is the owner of a resource
 */
export function isOwner(userId: string, resourceUserId: string): boolean {
  return userId === resourceUserId;
}

// ============================================================================
// FOLDER PERMISSIONS
// ============================================================================

/**
 * Check if user can read a folder
 * - PRIVATE: Owner only
 * - SHARED: Owner or link holders (not implemented yet)
 * - PUBLIC: All authenticated users
 * - INCOGNITO: Local only (not applicable for server-side checks)
 */
export function canReadFolder(
  user: JwtPayloadType,
  folder: ChatFolder,
): boolean {
  // Public users cannot read server-side folders
  if (user.isPublic) {
    return false;
  }

  const userId = user.id;
  if (!userId) {
    return false;
  }

  // Owner can always read
  if (isOwner(userId, folder.userId)) {
    return true;
  }

  // PUBLIC folders: all authenticated users can read
  if (folder.rootFolderId === "public") {
    return true;
  }

  // SHARED folders: check share token or allowed users (future implementation)
  if (folder.rootFolderId === "shared") {
    // Share token and allowedUserIds check not yet implemented
    return false;
  }

  // PRIVATE folders: owner only
  return false;
}

/**
 * Check if user can create a folder
 * - PRIVATE/SHARED: Any authenticated user
 * - PUBLIC: Admin only
 * - INCOGNITO: Not allowed on server
 */
export async function canCreateFolder(
  user: JwtPayloadType,
  rootFolderId: string,
  logger: EndpointLogger,
): Promise<boolean> {
  // Public users cannot create folders on server
  if (user.isPublic) {
    return false;
  }

  const userId = user.id;
  if (!userId) {
    return false;
  }

  // Incognito folders cannot be created on server
  if (rootFolderId === "incognito") {
    return false;
  }

  // PUBLIC folders: admin only
  if (rootFolderId === "public") {
    return await isAdmin(userId, logger);
  }

  // PRIVATE/SHARED folders: any authenticated user
  return true;
}

/**
 * Check if user can write to a folder (create threads)
 * - PRIVATE: Owner only
 * - SHARED: Owner or link holders (not implemented yet)
 * - PUBLIC: Owner, moderators, or all authenticated users
 * - INCOGNITO: Local only (not applicable for server-side checks)
 */
export function canWriteFolder(
  user: JwtPayloadType,
  folder: ChatFolder,
): boolean {
  // Public users cannot write to server-side folders
  if (user.isPublic) {
    return false;
  }

  const userId = user.id;
  if (!userId) {
    return false;
  }

  // Owner can always write
  if (isOwner(userId, folder.userId)) {
    return true;
  }

  // PUBLIC folders: moderators or all authenticated users can write
  if (folder.rootFolderId === "public") {
    return isFolderModerator(userId, folder) || true; // All authenticated users can write
  }

  // SHARED folders: check share token or allowed users (future implementation)
  if (folder.rootFolderId === "shared") {
    // Share token and allowedUserIds check not yet implemented
    return false;
  }

  // PRIVATE folders: owner only
  return false;
}

/**
 * Check if user can delete a folder
 * - Owner only for all folder types
 */
export function canDeleteFolder(
  user: JwtPayloadType,
  folder: ChatFolder,
): boolean {
  if (user.isPublic) {
    return false;
  }

  const userId = user.id;
  if (!userId) {
    return false;
  }

  return isOwner(userId, folder.userId);
}

/**
 * Check if user can manage folder permissions (add/remove moderators)
 * - Owner only
 */
export function canManageFolder(
  user: JwtPayloadType,
  folder: ChatFolder,
): boolean {
  if (user.isPublic) {
    return false;
  }

  const userId = user.id;
  if (!userId) {
    return false;
  }

  return isOwner(userId, folder.userId);
}

// ============================================================================
// THREAD PERMISSIONS
// ============================================================================

/**
 * Check if user can read a thread
 * Inherits from folder permissions
 */
export function canReadThread(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
): boolean {
  // Public users can read public threads
  if (user.isPublic && thread.rootFolderId === "public") {
    return true;
  }

  // Authenticated users: check folder permissions
  if (!user.isPublic && user.id) {
    const userId = user.id;

    // Owner can always read
    if (isOwner(userId, thread.userId)) {
      return true;
    }

    // PUBLIC threads: all authenticated users can read
    if (thread.rootFolderId === "public") {
      return true;
    }

    // If folder is provided, check folder permissions
    if (folder) {
      return canReadFolder(user, folder);
    }
  }

  return false;
}

/**
 * Check if user can write to a thread (create messages)
 * - PRIVATE: Owner only
 * - SHARED: Owner or link holders (not implemented yet)
 * - PUBLIC: Owner, moderators, or all authenticated users
 */
export function canWriteThread(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
): boolean {
  // Public users cannot write
  if (user.isPublic) {
    return false;
  }

  const userId = user.id;
  if (!userId) {
    return false;
  }

  // Owner can always write
  if (isOwner(userId, thread.userId)) {
    return true;
  }

  // PUBLIC threads: moderators or all authenticated users can write
  if (thread.rootFolderId === "public") {
    return isThreadModerator(userId, thread) || true; // All authenticated users can write
  }

  // If folder is provided, check folder permissions
  if (folder) {
    return canWriteFolder(user, folder);
  }

  // PRIVATE threads: owner only
  return false;
}

/**
 * Check if user can delete a thread
 * - PRIVATE: Owner only
 * - SHARED: Owner only
 * - PUBLIC: Owner or moderators
 */
export function canDeleteThread(
  user: JwtPayloadType,
  thread: ChatThread,
): boolean {
  if (user.isPublic) {
    return false;
  }

  const userId = user.id;
  if (!userId) {
    return false;
  }

  // Owner can always delete
  if (isOwner(userId, thread.userId)) {
    return true;
  }

  // PUBLIC threads: moderators can delete
  if (thread.rootFolderId === "public") {
    return isThreadModerator(userId, thread);
  }

  return false;
}

// ============================================================================
// MESSAGE PERMISSIONS
// ============================================================================

/**
 * Check if user can edit a message
 * - Own messages: Yes (if owner or author)
 * - Others' messages: Only if moderator in public threads
 */
export function canEditMessage(
  user: JwtPayloadType,
  message: ChatMessage,
  thread: ChatThread,
): boolean {
  if (user.isPublic) {
    return false;
  }

  const userId = user.id;
  if (!userId) {
    return false;
  }

  // Author can edit own message
  if (message.authorId === userId) {
    return true;
  }

  // PUBLIC threads: moderators can edit others' messages
  if (thread.rootFolderId === "public") {
    return isThreadModerator(userId, thread);
  }

  return false;
}

/**
 * Check if user can delete a message
 * - Own messages: Yes (if author)
 * - Others' messages: Only if moderator or thread owner in public threads
 */
export function canDeleteMessage(
  user: JwtPayloadType,
  message: ChatMessage,
  thread: ChatThread,
): boolean {
  if (user.isPublic) {
    return false;
  }

  const userId = user.id;
  if (!userId) {
    return false;
  }

  // Author can delete own message
  if (message.authorId === userId) {
    return true;
  }

  // Thread owner can delete any message
  if (isOwner(userId, thread.userId)) {
    return true;
  }

  // PUBLIC threads: moderators can delete others' messages
  if (thread.rootFolderId === "public") {
    return isThreadModerator(userId, thread);
  }

  return false;
}
