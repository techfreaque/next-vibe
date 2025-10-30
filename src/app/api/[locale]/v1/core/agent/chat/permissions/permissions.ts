/**
 * Chat Permission System
 * Implements permission checks for folders, threads, and messages
 * Based on the permission model defined in README.md
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
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
 * Check if user is a moderator of a folder OR any of its parent folders (recursive)
 * Moderator permissions are inherited from parent folders
 */
export function isFolderModeratorRecursive(
  userId: string,
  folder: ChatFolder,
  allFolders: Record<string, ChatFolder>,
): boolean {
  // Check if user is a direct moderator of this folder
  if (isFolderModerator(userId, folder)) {
    return true;
  }

  // Check parent folders recursively
  if (folder.parentId) {
    const parentFolder = allFolders[folder.parentId];
    if (parentFolder) {
      return isFolderModeratorRecursive(userId, parentFolder, allFolders);
    }
  }

  return false;
}

/**
 * Check if user is a moderator of a thread OR its parent folder (recursive)
 * Thread moderator permissions are inherited from folder moderators
 */
export function isThreadModeratorRecursive(
  userId: string,
  thread: ChatThread,
  folder: ChatFolder | null,
  allFolders: Record<string, ChatFolder>,
): boolean {
  // Check if user is a direct moderator of this thread
  if (isThreadModerator(userId, thread)) {
    return true;
  }

  // Check if user is a moderator of the parent folder (recursive)
  if (folder) {
    return isFolderModeratorRecursive(userId, folder, allFolders);
  }

  return false;
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
 * Check if user can create a folder (forum-style permissions)
 * - PRIVATE/SHARED: Any authenticated user can create
 * - PUBLIC: ADMIN only can create ROOT folders (parentId === null)
 * - PUBLIC: Any authenticated user can create SUBfolders (parentId !== null)
 * - INCOGNITO: Not allowed on server
 *
 * @param parentId - If null, creating a root folder; otherwise creating a subfolder
 */
export async function canCreateFolder(
  user: JwtPayloadType,
  rootFolderId: string,
  logger: EndpointLogger,
  parentId?: string | null,
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

  // PUBLIC folders: ADMIN only for root folders, anyone for subfolders
  if (rootFolderId === "public") {
    // If creating a root folder/thread in public (parentId is null)
    if (!parentId) {
      return await isAdmin(userId, logger);
    }
    // If creating a subfolder, allowed for any authenticated user
    return true;
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
 * - ADMIN: Can delete any folder (full delete rights)
 * - Owner: Can delete their own folders
 * - Moderator (PUBLIC only): Can delete folders they moderate (changes visibility)
 */
export async function canDeleteFolder(
  user: JwtPayloadType,
  folder: ChatFolder,
  logger: EndpointLogger,
  allFolders?: Record<string, ChatFolder>,
): Promise<boolean> {
  if (user.isPublic) {
    return false;
  }

  const userId = user.id;
  if (!userId) {
    return false;
  }

  // Admin can delete anything
  if (await isAdmin(userId, logger)) {
    return true;
  }

  // Owner can delete their own folders
  if (isOwner(userId, folder.userId)) {
    return true;
  }

  // Moderators in PUBLIC folders can "delete" (change visibility)
  if (folder.rootFolderId === "public" && allFolders) {
    return isFolderModeratorRecursive(userId, folder, allFolders);
  }

  return false;
}

/**
 * Check if user can manage folder permissions (add/remove moderators)
 * - ADMIN: Can manage permissions for any folder
 * - Owner: Can manage permissions for their own folders
 */
export async function canManageFolder(
  user: JwtPayloadType,
  folder: ChatFolder,
  logger: EndpointLogger,
): Promise<boolean> {
  if (user.isPublic) {
    return false;
  }

  const userId = user.id;
  if (!userId) {
    return false;
  }

  // Admin can manage any folder
  if (await isAdmin(userId, logger)) {
    return true;
  }

  // Owner can manage their own folders
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
 * - PUBLIC: PUBLIC users (anonymous), owner, moderators, or all authenticated users
 */
export function canWriteThread(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
): boolean {
  // PUBLIC users can write to PUBLIC threads only
  if (user.isPublic) {
    return thread.rootFolderId === "public";
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
 * - ADMIN: Can delete any thread (full delete rights)
 * - PRIVATE: Owner only
 * - SHARED: Owner only
 * - PUBLIC: Owner, moderators (recursive from folder), or admins
 */
export async function canDeleteThread(
  user: JwtPayloadType,
  thread: ChatThread,
  logger: EndpointLogger,
  folder?: ChatFolder | null,
  allFolders?: Record<string, ChatFolder>,
): Promise<boolean> {
  if (user.isPublic) {
    return false;
  }

  const userId = user.id;
  if (!userId) {
    return false;
  }

  // Admin can delete anything
  if (await isAdmin(userId, logger)) {
    return true;
  }

  // Owner can always delete
  if (isOwner(userId, thread.userId)) {
    return true;
  }

  // PUBLIC threads: moderators can delete (check recursive)
  if (thread.rootFolderId === "public" && allFolders) {
    return isThreadModeratorRecursive(userId, thread, folder || null, allFolders);
  }

  return false;
}

/**
 * Check if user can manage thread permissions (add/remove moderators)
 * - ADMIN: Can manage permissions for any thread
 * - Owner: Can manage permissions for their own threads
 */
export async function canManageThread(
  user: JwtPayloadType,
  thread: ChatThread,
  logger: EndpointLogger,
): Promise<boolean> {
  if (user.isPublic) {
    return false;
  }

  const userId = user.id;
  if (!userId) {
    return false;
  }

  // Admin can manage any thread
  if (await isAdmin(userId, logger)) {
    return true;
  }

  // Owner can manage their own threads
  return isOwner(userId, thread.userId);
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
