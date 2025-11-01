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
 * Checks allowedRoles field to determine visibility
 * - Owner can always read
 * - Moderators (in moderatorIds) can always read
 * - If allowedRoles is not empty, user's role must be in the list
 * - If allowedRoles is empty, only owner and moderators can read
 */
export async function canReadFolder(
  user: JwtPayloadType,
  folder: ChatFolder,
  logger: EndpointLogger,
): Promise<boolean> {
  const userId = user.id;

  // Owner can always read
  if (userId && isOwner(userId, folder.userId)) {
    return true;
  }

  // Moderators can always read (for SHARED folders)
  if (userId && folder.moderatorIds && Array.isArray(folder.moderatorIds)) {
    if (folder.moderatorIds.includes(userId)) {
      return true;
    }
  }

  // Check allowedRoles
  if (folder.allowedRoles && folder.allowedRoles.length > 0) {
    // Public users
    if (user.isPublic) {
      return folder.allowedRoles.includes(UserRole.PUBLIC);
    }

    // Authenticated users - check their roles
    if (userId) {
      const userRoles = await userRolesRepository.getUserRoles(userId, logger);
      if (userRoles.success && userRoles.data) {
        return folder.allowedRoles.some((role) =>
          userRoles.data!.includes(role),
        );
      }
    }
  }

  // Empty allowedRoles = owner and moderators only
  return false;
}

/**
 * Check if user can create a folder
 * - PRIVATE: Any authenticated user can create subfolders
 * - SHARED: Any authenticated user can create subfolders
 * - PUBLIC: Only ADMIN users can create subfolders in PUBLIC root (top-level)
 *           For subfolders within PUBLIC folders, check parent folder's allowedRoles
 * - INCOGNITO: Not allowed on server
 *
 * Note: The 4 root folders (private, shared, public, incognito) are DEFAULT folders
 * that cannot be created by users. All user-created folders are subfolders within
 * one of these root folders.
 *
 * @param parentId - Parent folder ID (can be null for top-level subfolders in a root folder)
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

  // PUBLIC root folder: Only ADMIN can create top-level folders (parentId is null)
  if (rootFolderId === "public" && !parentId) {
    return await isAdmin(userId, logger);
  }

  // For PUBLIC subfolders (parentId is not null), only moderators can create subfolders
  if (rootFolderId === "public" && parentId) {
    // Get parent folder to check permissions
    const { chatFolders } = await import("../db");
    const { db } = await import("../../../system/db");
    const { eq } = await import("drizzle-orm");

    const [parentFolder] = await db
      .select()
      .from(chatFolders)
      .where(eq(chatFolders.id, parentId))
      .limit(1);

    if (!parentFolder) {
      logger.error("Parent folder not found", { parentId });
      return false;
    }

    // Only moderators can create subfolders in PUBLIC folders
    // Regular users and admins cannot create subfolders unless they are moderators
    const isModerator = isFolderModerator(userId, parentFolder);
    logger.debug("PUBLIC subfolder creation permission check", {
      userId,
      parentFolderId: parentId,
      isModerator,
    });
    return isModerator;
  }

  // All authenticated users can create subfolders in PRIVATE or SHARED root folders
  // The 4 root folders themselves are default folders and cannot be created by users
  return true;
}

/**
 * Check if user can write to a folder (create threads)
 * - PRIVATE: Owner only
 * - SHARED: Owner or link holders (not implemented yet)
 * - PUBLIC: Owner, moderators, or all authenticated users (for subfolders)
 *           Only ADMIN can create threads in PUBLIC root (when folder.parentId is null)
 * - INCOGNITO: Local only (not applicable for server-side checks)
 */
export async function canWriteFolder(
  user: JwtPayloadType,
  folder: ChatFolder | null,
  logger: EndpointLogger,
): Promise<boolean> {
  // Public users cannot write to server-side folders
  if (user.isPublic) {
    return false;
  }

  const userId = user.id;
  if (!userId) {
    return false;
  }

  // If no folder specified (creating thread in root), check root folder permissions
  if (!folder) {
    return false;
  }

  // Owner can always write
  if (isOwner(userId, folder.userId)) {
    return true;
  }

  // PUBLIC folders: Check allowedRoles to determine write access
  if (folder.rootFolderId === "public") {
    logger.debug("Checking PUBLIC folder write permission", {
      folderId: folder.id,
      folderName: folder.name,
      parentId: folder.parentId,
      userId,
      allowedRoles: folder.allowedRoles,
    });

    // Moderators can always write
    if (isFolderModerator(userId, folder)) {
      logger.debug("PUBLIC folder - moderator access granted");
      return true;
    }

    // Check allowedRoles
    if (folder.allowedRoles && folder.allowedRoles.length > 0) {
      // Get user's roles and check if any match the folder's allowedRoles
      const userRoles = await userRolesRepository.getUserRoles(userId, logger);
      if (userRoles.success && userRoles.data) {
        const hasMatchingRole = folder.allowedRoles.some((role) =>
          userRoles.data!.includes(role),
        );
        logger.debug("PUBLIC folder - role check", {
          userRoles: userRoles.data,
          folderAllowedRoles: folder.allowedRoles,
          hasMatchingRole,
        });
        return hasMatchingRole;
      }
    }

    // Empty allowedRoles = owner only (already checked above)
    logger.debug("PUBLIC folder - no matching roles, denying access");
    return false;
  }

  // SHARED folders: owner and moderators can write
  if (folder.rootFolderId === "shared") {
    // Moderators can write to SHARED folders
    if (isFolderModerator(userId, folder)) {
      logger.debug("SHARED folder - moderator access granted");
      return true;
    }
    // Non-moderators cannot write
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
 * Check if user can update a folder (rename, change icon, etc.)
 * - ADMIN: Can update any folder
 * - Owner: Can update their own folders
 * - Moderators: Can update folders they moderate (for SHARED and PUBLIC folders)
 */
export async function canUpdateFolder(
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

  // Admin can update any folder
  if (await isAdmin(userId, logger)) {
    return true;
  }

  // Owner can update their own folders
  if (isOwner(userId, folder.userId)) {
    return true;
  }

  // Moderators can update folders they moderate
  if (isFolderModerator(userId, folder)) {
    return true;
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
 * Checks thread's allowedRoles first, then inherits from folder permissions
 */
export async function canReadThread(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
): Promise<boolean> {
  const userId = user.id;

  // Log permission check details for debugging
  logger.debug("canReadThread check", {
    threadId: thread.id,
    threadUserId: thread.userId,
    threadRootFolderId: thread.rootFolderId,
    threadFolderId: thread.folderId,
    threadAllowedRoles: thread.allowedRoles,
    userId,
    userIsPublic: user.isPublic,
    folderAllowedRoles: folder?.allowedRoles,
  });

  // Owner can always read
  if (userId && isOwner(userId, thread.userId)) {
    logger.debug("canReadThread: owner access granted");
    return true;
  }

  // Moderators can always read (for SHARED threads)
  if (userId && thread.moderatorIds && Array.isArray(thread.moderatorIds)) {
    if (thread.moderatorIds.includes(userId)) {
      logger.debug("canReadThread: moderator access granted");
      return true;
    }
  }

  // Published threads can be read by anyone (including public users)
  // This is for SHARED folders where published=true means public read access via link
  if (thread.published) {
    logger.debug("canReadThread: published thread, granting read access");
    return true;
  }

  // Check thread's allowedRoles first
  if (thread.allowedRoles && thread.allowedRoles.length > 0) {
    logger.debug("canReadThread: checking thread allowedRoles", {
      allowedRoles: thread.allowedRoles,
    });

    // Public users
    if (user.isPublic) {
      const hasPublicRole = thread.allowedRoles.includes(UserRole.PUBLIC);
      logger.debug("canReadThread: public user check", { hasPublicRole });
      return hasPublicRole;
    }

    // Authenticated users - check their roles
    if (userId) {
      const userRoles = await userRolesRepository.getUserRoles(userId, logger);
      if (userRoles.success && userRoles.data) {
        const hasMatchingRole = thread.allowedRoles.some((role) =>
          userRoles.data!.includes(role),
        );
        logger.debug("canReadThread: authenticated user role check", {
          userRoles: userRoles.data,
          threadAllowedRoles: thread.allowedRoles,
          hasMatchingRole,
        });
        return hasMatchingRole;
      }
    }
  }

  // If thread has no allowedRoles, inherit from folder
  if (folder) {
    logger.debug("canReadThread: checking folder permissions");
    return await canReadFolder(user, folder, logger);
  }

  // Empty allowedRoles and no folder = owner only
  logger.debug("canReadThread: no allowedRoles and no folder, denying access");
  return false;
}

/**
 * Check if user can write to a thread (create messages)
 * - PRIVATE: Owner only
 * - SHARED: Owner, moderators, or published thread readers
 * - PUBLIC: Anyone who can read the thread (including public users)
 */
export async function canWriteThread(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
): Promise<boolean> {
  // PUBLIC threads: anyone who can read can also write (reply)
  // This allows public users to reply to messages in PUBLIC threads
  if (thread.rootFolderId === "public") {
    logger.debug("Checking PUBLIC thread write permission", {
      threadId: thread.id,
      isPublic: user.isPublic,
      userId: user.id,
    });

    // Check if user can read the thread - if yes, they can also write
    const canRead = await canReadThread(user, thread, folder, logger);
    if (canRead) {
      logger.debug("PUBLIC thread - read access grants write access");
      return true;
    }
    return false;
  }

  // For non-PUBLIC threads, public users cannot write
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

  // Moderators can always write (for SHARED and PUBLIC threads)
  if (isThreadModerator(userId, thread)) {
    return true;
  }

  // SHARED threads: check folder permissions (which checks moderators)
  if (thread.rootFolderId === "shared") {
    if (folder) {
      return await canWriteFolder(user, folder, logger);
    }
    // If no folder, already checked moderator above
    return false;
  }

  // If folder is provided, check folder permissions
  if (folder) {
    return await canWriteFolder(user, folder, logger);
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
 * Check if user can update a thread (rename, change settings, etc.)
 * - ADMIN: Can update any thread
 * - Owner: Can update their own threads
 * - Moderators: Can update threads they moderate (thread-level or folder-level for SHARED and PUBLIC threads)
 */
export async function canUpdateThread(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
): Promise<boolean> {
  if (user.isPublic) {
    return false;
  }

  const userId = user.id;
  if (!userId) {
    return false;
  }

  // Admin can update any thread
  if (await isAdmin(userId, logger)) {
    return true;
  }

  // Owner can update their own threads
  if (isOwner(userId, thread.userId)) {
    return true;
  }

  // Thread-level moderators can update threads they moderate
  if (isThreadModerator(userId, thread)) {
    return true;
  }

  // Folder-level moderators can update threads in folders they moderate (for SHARED and PUBLIC threads)
  if (
    folder &&
    (thread.rootFolderId === "shared" || thread.rootFolderId === "public") &&
    isFolderModerator(userId, folder)
  ) {
    logger.debug("canUpdateThread: folder moderator access granted");
    return true;
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
 * Check if user can read a message
 * Inherits from thread permissions
 */
export async function canReadMessage(
  user: JwtPayloadType,
  message: ChatMessage,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
): Promise<boolean> {
  // Messages inherit thread permissions
  return await canReadThread(user, thread, folder, logger);
}

/**
 * Check if user can create a message in a thread
 * Inherits from thread permissions
 */
export async function canWriteMessage(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
): Promise<boolean> {
  // Messages inherit thread write permissions
  return await canWriteThread(user, thread, folder, logger);
}

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
 * - Owner can delete their own messages
 * - Thread moderators can delete any message
 * - Folder moderators can delete any message
 * - Admins can delete any message
 */
export async function canDeleteMessage(
  user: JwtPayloadType,
  message: ChatMessage,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
): Promise<boolean> {
  if (user.isPublic) {
    return false;
  }

  const userId = user.id;
  if (!userId) {
    return false;
  }

  // Owner can delete their own messages
  if (message.authorId && isOwner(userId, message.authorId)) {
    return true;
  }

  // Thread moderators can delete
  if (isThreadModerator(userId, thread)) {
    return true;
  }

  // Folder moderators can delete
  if (folder && isFolderModerator(userId, folder)) {
    return true;
  }

  // Admins can delete
  return await isAdmin(userId, logger);
}
