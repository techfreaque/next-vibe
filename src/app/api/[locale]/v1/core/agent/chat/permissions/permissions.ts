/**
 * Chat Permission System - 4-Role Model with Inheritance
 * Implements permission checks for folders, threads, and messages
 *
 * Permission Types:
 * - rolesRead: Who can view/read content
 * - rolesWrite: Who can create/write content
 * - rolesHide: Who can hide/moderate content
 * - rolesDelete: Who can delete content
 *
 * Inheritance Rules:
 * - Empty array [] = inherit from parent folder
 * - Non-empty array = explicit override (no inheritance)
 * - Inheritance chain: thread → folder → parent folder → root folder → DEFAULT_FOLDER_CONFIGS
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { userRolesRepository } from "@/app/api/[locale]/v1/core/user/user-roles/repository";

import { getDefaultFolderConfig } from "../config";
import type { ChatFolder, ChatMessage, ChatThread } from "../db";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

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
 * Check if user is the owner of a resource
 */
export function isOwner(userId: string, resourceUserId: string): boolean {
  return userId === resourceUserId;
}

/**
 * Get effective roles for a permission type with inheritance
 * If the resource has non-empty permission array, use it (no inheritance)
 * If empty, inherit from parent folder recursively up to root folder
 */
function getEffectiveRoles(
  resource: ChatFolder | ChatThread,
  permissionType: "rolesRead" | "rolesWrite" | "rolesHide" | "rolesDelete",
  allFolders: Record<string, ChatFolder>,
): string[] {
  // If resource has non-empty permission array, use it (explicit override)
  const roles = resource[permissionType];
  if (roles && Array.isArray(roles) && roles.length > 0) {
    return roles;
  }

  // Empty array - inherit from parent
  // If resource is a thread, check its parent folder
  if ("folderId" in resource && resource.folderId) {
    const parentFolder = allFolders[resource.folderId];
    if (parentFolder) {
      return getEffectiveRoles(parentFolder, permissionType, allFolders);
    }
  }

  // If resource is a folder, check its parent folder
  if ("parentId" in resource && resource.parentId) {
    const parentFolder = allFolders[resource.parentId];
    if (parentFolder) {
      return getEffectiveRoles(parentFolder, permissionType, allFolders);
    }
  }

  // Reached root folder - use DEFAULT_FOLDER_CONFIGS
  const rootFolderId = resource.rootFolderId;
  const rootConfig = getDefaultFolderConfig(rootFolderId);
  return rootConfig?.[permissionType] || [];
}

/**
 * Check if user has permission based on role arrays
 * Handles both public and authenticated users
 */
async function hasRolePermission(
  user: JwtPayloadType,
  effectiveRoles: string[],
  logger: EndpointLogger,
): Promise<boolean> {
  // Empty roles = owner only (already checked before this function)
  if (effectiveRoles.length === 0) {
    return false;
  }

  // Public users
  if (user.isPublic) {
    return effectiveRoles.includes(UserRole.PUBLIC);
  }

  // Authenticated users - check their roles
  if (user.id) {
    const userRoles = await userRolesRepository.getUserRoles(user.id, logger);
    if (userRoles.success && userRoles.data) {
      return effectiveRoles.some((role) => userRoles.data!.includes(role));
    }
  }

  return false;
}

// ============================================================================
// FOLDER PERMISSIONS
// ============================================================================

/**
 * Check if user can read a folder
 * Uses rolesRead with inheritance from parent folders
 * - Owner can always read
 * - Admin can always read
 * - Check rolesRead (with inheritance) for role-based access
 */
export async function canReadFolder(
  user: JwtPayloadType,
  folder: ChatFolder,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  const userId = user.id;

  // Owner can always read
  if (userId && isOwner(userId, folder.userId)) {
    return true;
  }

  // Admin can always read
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  // Get effective rolesRead (with inheritance)
  const effectiveRoles = getEffectiveRoles(folder, "rolesRead", allFolders);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
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

    // Only users with hide permission can create subfolders in PUBLIC folders
    // This replaces the old moderator check
    const allFolders = { [parentFolder.id]: parentFolder };
    const effectiveHideRoles = getEffectiveRoles(
      parentFolder,
      "rolesHide",
      allFolders,
    );
    const hasHidePermission = await hasRolePermission(
      user,
      effectiveHideRoles,
      logger,
    );
    logger.debug("PUBLIC subfolder creation permission check", {
      userId,
      parentFolderId: parentId,
      hasHidePermission,
    });
    return hasHidePermission;
  }

  // All authenticated users can create subfolders in PRIVATE or SHARED root folders
  // The 4 root folders themselves are default folders and cannot be created by users
  return true;
}

/**
 * Check if user can write to a folder (create threads)
 * Uses rolesWrite with inheritance from parent folders
 * - Owner can always write
 * - Admin can always write
 * - Check rolesWrite (with inheritance) for role-based access
 */
export async function canWriteFolder(
  user: JwtPayloadType,
  folder: ChatFolder | null,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  // If no folder specified, cannot write
  if (!folder) {
    return false;
  }

  const userId = user.id;

  // Owner can always write
  if (userId && isOwner(userId, folder.userId)) {
    return true;
  }

  // Admin can always write
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  // Get effective rolesWrite (with inheritance)
  const effectiveRoles = getEffectiveRoles(folder, "rolesWrite", allFolders);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}

/**
 * Check if user can delete a folder
 * Uses rolesDelete with inheritance from parent folders
 * - Owner can always delete
 * - Admin can always delete
 * - Check rolesDelete (with inheritance) for role-based access
 */
export async function canDeleteFolder(
  user: JwtPayloadType,
  folder: ChatFolder,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  const userId = user.id;

  // Owner can always delete
  if (userId && isOwner(userId, folder.userId)) {
    return true;
  }

  // Admin can always delete
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  // Get effective rolesDelete (with inheritance)
  const effectiveRoles = getEffectiveRoles(folder, "rolesDelete", allFolders);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}

/**
 * Check if user can hide/moderate a folder
 * Uses rolesHide with inheritance from parent folders
 * - Owner can always hide
 * - Admin can always hide
 * - Check rolesHide (with inheritance) for role-based access
 */
export async function canHideFolder(
  user: JwtPayloadType,
  folder: ChatFolder,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  const userId = user.id;

  // Owner can always hide
  if (userId && isOwner(userId, folder.userId)) {
    return true;
  }

  // Admin can always hide
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  // Get effective rolesHide (with inheritance)
  const effectiveRoles = getEffectiveRoles(folder, "rolesHide", allFolders);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}

/**
 * Check if user can update a folder (rename, change icon, etc.)
 * Same as write permission - uses rolesWrite
 */
export async function canUpdateFolder(
  user: JwtPayloadType,
  folder: ChatFolder,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  return await canWriteFolder(user, folder, logger, allFolders);
}

/**
 * Check if user can manage folder permissions
 * Only owner and admin can manage permissions
 */
export async function canManageFolder(
  user: JwtPayloadType,
  folder: ChatFolder,
  logger: EndpointLogger,
): Promise<boolean> {
  const userId = user.id;

  // Owner can manage
  if (userId && isOwner(userId, folder.userId)) {
    return true;
  }

  // Admin can manage
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  return false;
}

// ============================================================================
// THREAD PERMISSIONS
// ============================================================================

/**
 * Check if user can read a thread
 * Uses rolesRead with inheritance from parent folder
 * - Owner can always read
 * - Admin can always read
 * - Check rolesRead (with inheritance) for role-based access
 */
export async function canReadThread(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  const userId = user.id;

  // Owner can always read
  if (userId && isOwner(userId, thread.userId)) {
    return true;
  }

  // Admin can always read
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  // Build folder map for inheritance
  const folderMap: Record<string, ChatFolder> = { ...allFolders };
  if (folder && folder.id) {
    folderMap[folder.id] = folder;
  }

  // Get effective rolesRead (with inheritance from folder)
  const effectiveRoles = getEffectiveRoles(thread, "rolesRead", folderMap);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}

/**
 * Check if user can write to a thread (create messages)
 * Uses rolesWrite with inheritance from parent folder
 * - Owner can always write
 * - Admin can always write
 * - Check rolesWrite (with inheritance) for role-based access
 */
export async function canWriteThread(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  const userId = user.id;

  // Owner can always write
  if (userId && isOwner(userId, thread.userId)) {
    return true;
  }

  // Admin can always write
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  // Build folder map for inheritance
  const folderMap: Record<string, ChatFolder> = { ...allFolders };
  if (folder && folder.id) {
    folderMap[folder.id] = folder;
  }

  // Get effective rolesWrite (with inheritance from folder)
  const effectiveRoles = getEffectiveRoles(thread, "rolesWrite", folderMap);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}

/**
 * Check if user can delete a thread
 * Uses rolesDelete with inheritance from parent folder
 * - Owner can always delete
 * - Admin can always delete
 * - Check rolesDelete (with inheritance) for role-based access
 */
export async function canDeleteThread(
  user: JwtPayloadType,
  thread: ChatThread,
  logger: EndpointLogger,
  folder: ChatFolder | null = null,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  const userId = user.id;

  // Owner can always delete
  if (userId && isOwner(userId, thread.userId)) {
    return true;
  }

  // Admin can always delete
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  // Build folder map for inheritance
  const folderMap: Record<string, ChatFolder> = { ...allFolders };
  if (folder && folder.id) {
    folderMap[folder.id] = folder;
  }

  // Get effective rolesDelete (with inheritance from folder)
  const effectiveRoles = getEffectiveRoles(thread, "rolesDelete", folderMap);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}

/**
 * Check if user can hide/moderate a thread
 * Uses rolesHide with inheritance from parent folder
 * - Owner can always hide
 * - Admin can always hide
 * - Check rolesHide (with inheritance) for role-based access
 */
export async function canHideThread(
  user: JwtPayloadType,
  thread: ChatThread,
  logger: EndpointLogger,
  folder: ChatFolder | null = null,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  const userId = user.id;

  // Owner can always hide
  if (userId && isOwner(userId, thread.userId)) {
    return true;
  }

  // Admin can always hide
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  // Build folder map for inheritance
  const folderMap: Record<string, ChatFolder> = { ...allFolders };
  if (folder && folder.id) {
    folderMap[folder.id] = folder;
  }

  // Get effective rolesHide (with inheritance from folder)
  const effectiveRoles = getEffectiveRoles(thread, "rolesHide", folderMap);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}

/**
 * Check if user can update a thread (rename, change settings, etc.)
 * Same as write permission - uses rolesWrite
 */
export async function canUpdateThread(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  return await canWriteThread(user, thread, folder, logger, allFolders);
}

/**
 * Check if user can manage thread permissions
 * Only owner and admin can manage permissions
 */
export async function canManageThread(
  user: JwtPayloadType,
  thread: ChatThread,
  logger: EndpointLogger,
): Promise<boolean> {
  const userId = user.id;

  // Owner can manage
  if (userId && isOwner(userId, thread.userId)) {
    return true;
  }

  // Admin can manage
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  return false;
}

// ============================================================================
// MESSAGE PERMISSIONS
// ============================================================================

/**
 * Check if user can read a message
 * Inherits from thread read permissions
 */
export async function canReadMessage(
  user: JwtPayloadType,
  message: ChatMessage,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  // Messages inherit thread permissions
  return await canReadThread(user, thread, folder, logger, allFolders);
}

/**
 * Check if user can create a message in a thread
 * Inherits from thread write permissions
 */
export async function canWriteMessage(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  // Messages inherit thread write permissions
  return await canWriteThread(user, thread, folder, logger, allFolders);
}

/**
 * Check if user can delete a message
 * Uses thread's rolesDelete permission (with inheritance)
 * - Author can delete their own messages
 * - Admin can delete any message
 * - Check rolesDelete (with inheritance) for role-based access
 */
export async function canDeleteMessage(
  user: JwtPayloadType,
  message: ChatMessage,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  const userId = user.id;

  // Author can delete their own messages
  if (userId && message.authorId && isOwner(userId, message.authorId)) {
    return true;
  }

  // Admin can delete any message
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  // Build folder map for inheritance
  const folderMap: Record<string, ChatFolder> = { ...allFolders };
  if (folder && folder.id) {
    folderMap[folder.id] = folder;
  }

  // Get effective rolesDelete (with inheritance from folder)
  const effectiveRoles = getEffectiveRoles(thread, "rolesDelete", folderMap);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}

/**
 * Check if user can hide/moderate a message
 * Uses thread's rolesHide permission (with inheritance)
 * - Author can hide their own messages
 * - Admin can hide any message
 * - Check rolesHide (with inheritance) for role-based access
 */
export async function canHideMessage(
  user: JwtPayloadType,
  message: ChatMessage,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  const userId = user.id;

  // Author can hide their own messages
  if (userId && message.authorId && isOwner(userId, message.authorId)) {
    return true;
  }

  // Admin can hide any message
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  // Build folder map for inheritance
  const folderMap: Record<string, ChatFolder> = { ...allFolders };
  if (folder && folder.id) {
    folderMap[folder.id] = folder;
  }

  // Get effective rolesHide (with inheritance from folder)
  const effectiveRoles = getEffectiveRoles(thread, "rolesHide", folderMap);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}
