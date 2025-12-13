/**
 * Chat Permission System - 6-Role Model for Folders, 5-Role Model for Threads
 * Implements permission checks for folders, threads, and messages
 *
 * Folder Permission Types (6):
 * - rolesView: Who can view/read folder
 * - rolesManage: Who can edit folder and create subfolders
 * - rolesCreateThread: Who can create threads
 * - rolesPost: Who can post messages
 * - rolesModerate: Who can moderate/hide content
 * - rolesAdmin: Who can delete and manage permissions
 *
 * Thread Permission Types (5):
 * - rolesView: Who can view/read thread
 * - rolesEdit: Who can edit thread properties
 * - rolesPost: Who can post messages
 * - rolesModerate: Who can moderate/hide messages
 * - rolesAdmin: Who can delete and manage permissions
 *
 * Inheritance Rules:
 * - null = inherit from parent folder
 * - [] (empty array) = no roles allowed (explicit deny)
 * - [roles...] = explicit roles allowed
 * - Inheritance chain: thread → folder → parent folder → root folder → DEFAULT_FOLDER_CONFIGS
 */

import "server-only";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import {
  UserRole,
  type UserPermissionRoleValue,
} from "@/app/api/[locale]/user/user-roles/enum";
import { userRolesRepository } from "@/app/api/[locale]/user/user-roles/repository";

import { type DefaultFolderConfig, getDefaultFolderConfig } from "../config";
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
export function isOwner(
  userId: string,
  resourceUserId: string | null,
): boolean {
  if (!resourceUserId) {
    return false;
  }
  return userId === resourceUserId;
}

/**
 * Get effective roles for a permission type with inheritance
 * - null = inherit from parent folder
 * - [] (empty array) = no roles allowed (explicit deny)
 * - [roles...] = explicit roles allowed
 */
function getFolderPermissionValue(
  folder: ChatFolder,
  permissionType:
    | "rolesView"
    | "rolesManage"
    | "rolesCreateThread"
    | "rolesPost"
    | "rolesModerate"
    | "rolesAdmin",
): (typeof UserPermissionRoleValue)[] | null {
  return folder[permissionType] ?? null;
}

function getThreadPermissionValue(
  thread: ChatThread,
  permissionType:
    | "rolesView"
    | "rolesEdit"
    | "rolesPost"
    | "rolesModerate"
    | "rolesAdmin",
): (typeof UserPermissionRoleValue)[] | null {
  return thread[permissionType] ?? null;
}

function getPermissionValue(
  resource: ChatFolder | ChatThread,
  permissionType:
    | "rolesView"
    | "rolesManage"
    | "rolesEdit"
    | "rolesCreateThread"
    | "rolesPost"
    | "rolesModerate"
    | "rolesAdmin",
): (typeof UserPermissionRoleValue)[] | null {
  if ("parentId" in resource) {
    if (permissionType === "rolesEdit") {
      return null;
    }
    return getFolderPermissionValue(resource, permissionType);
  }

  if (
    permissionType === "rolesManage" ||
    permissionType === "rolesCreateThread"
  ) {
    return null;
  }
  return getThreadPermissionValue(resource, permissionType);
}

function getDefaultConfigValue(
  config: DefaultFolderConfig | undefined,
  permissionType:
    | "rolesView"
    | "rolesManage"
    | "rolesEdit"
    | "rolesCreateThread"
    | "rolesPost"
    | "rolesModerate"
    | "rolesAdmin",
): (typeof UserPermissionRoleValue)[] {
  if (!config) {
    return [];
  }

  if (permissionType === "rolesEdit") {
    return [];
  }

  return config[permissionType] ?? [];
}

export function getEffectiveRoles(
  resource: ChatFolder | ChatThread,
  permissionType:
    | "rolesView"
    | "rolesManage"
    | "rolesEdit"
    | "rolesCreateThread"
    | "rolesPost"
    | "rolesModerate"
    | "rolesAdmin",
  allFolders: Record<string, ChatFolder>,
): (typeof UserPermissionRoleValue)[] {
  // Get the permission value
  const roles = getPermissionValue(resource, permissionType);

  // If roles is an array (empty or not), use it directly (explicit override)
  if (Array.isArray(roles)) {
    return roles; // Could be [] (deny) or [roles...] (allow)
  }

  // If roles is null, inherit from parent
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
  return getDefaultConfigValue(rootConfig, permissionType);
}

/**
 * Check if user has permission based on role arrays
 * Handles both public and authenticated users
 */
export async function hasRolePermission(
  user: JwtPayloadType,
  effectiveRoles: (typeof UserPermissionRoleValue)[],
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
 * Check if user can view/read a folder
 * Uses rolesView with inheritance from parent folders
 * - Owner can always view
 * - Admin can always view
 * - Check rolesView (with inheritance) for role-based access
 */
export async function canViewFolder(
  user: JwtPayloadType,
  folder: ChatFolder,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  const userId = user.id;

  // Owner can always view
  if (userId && isOwner(userId, folder.userId)) {
    return true;
  }

  // Admin can always view
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  // Get effective rolesView (with inheritance)
  const effectiveRoles = getEffectiveRoles(folder, "rolesView", allFolders);

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
  rootFolderId: DefaultFolderId,
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
      "rolesModerate",
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
 * Check if user can manage a folder (edit folder, create subfolders)
 * Uses rolesManage with inheritance from parent folders
 * - Owner can always manage
 * - Admin can always manage
 * - Check rolesManage (with inheritance) for role-based access
 */
export async function canManageFolder(
  user: JwtPayloadType,
  folder: ChatFolder | null,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  // If no folder specified, cannot manage
  if (!folder) {
    return false;
  }

  const userId = user.id;

  // Owner can always manage
  if (userId && isOwner(userId, folder.userId)) {
    return true;
  }

  // Admin can always manage
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  // Get effective rolesManage (with inheritance)
  const effectiveRoles = getEffectiveRoles(folder, "rolesManage", allFolders);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}

/**
 * Check if user can create threads in a folder
 * Uses rolesCreateThread with inheritance from parent folders
 * - Owner can always create threads
 * - Admin can always create threads
 * - Check rolesCreateThread (with inheritance) for role-based access
 */
export async function canCreateThreadInFolder(
  user: JwtPayloadType,
  folder: ChatFolder | null,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  // If no folder specified, cannot create thread
  if (!folder) {
    return false;
  }

  const userId = user.id;

  // Owner can always create threads
  if (userId && isOwner(userId, folder.userId)) {
    return true;
  }

  // Admin can always create threads
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  // Get effective rolesCreateThread (with inheritance)
  const effectiveRoles = getEffectiveRoles(
    folder,
    "rolesCreateThread",
    allFolders,
  );

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}

/**
 * Check if user can delete a folder
 * Uses rolesAdmin with inheritance from parent folders
 * - Owner can always delete
 * - Admin can always delete
 * - Check rolesAdmin (with inheritance) for role-based access
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

  // Get effective rolesAdmin (with inheritance)
  const effectiveRoles = getEffectiveRoles(folder, "rolesAdmin", allFolders);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}

/**
 * Check if user can hide/moderate a folder
 * Uses rolesModerate with inheritance from parent folders
 * - Owner can always hide
 * - Admin can always hide
 * - Check rolesModerate (with inheritance) for role-based access
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

  // Get effective rolesModerate (with inheritance)
  const effectiveRoles = getEffectiveRoles(folder, "rolesModerate", allFolders);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}

/**
 * Check if user can update a folder (rename, change icon, etc.)
 * Same as manage permission - uses rolesManage
 */
export async function canUpdateFolder(
  user: JwtPayloadType,
  folder: ChatFolder,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  return await canManageFolder(user, folder, logger, allFolders);
}

/**
 * Check if user can manage folder permissions
 * Uses rolesAdmin - only owner, admin, and users with rolesAdmin can manage permissions
 * Permission management is only available for PUBLIC root folder and its subfolders
 * Private, shared, and incognito folders don't support permission management
 */
export async function canManageFolderPermissions(
  user: JwtPayloadType,
  folder: ChatFolder,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  // Permission management is only available for PUBLIC root folder
  // Private, shared, and incognito folders are owner-only by design
  if (folder.rootFolderId !== "public") {
    return false;
  }

  const userId = user.id;

  // Owner can manage permissions
  if (userId && isOwner(userId, folder.userId)) {
    return true;
  }

  // Admin can manage permissions
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  // Check rolesAdmin permission
  const effectiveRoles = getEffectiveRoles(folder, "rolesAdmin", allFolders);
  return await hasRolePermission(user, effectiveRoles, logger);
}

// ============================================================================
// THREAD PERMISSIONS
// ============================================================================

/**
 * Check if user can view/read a thread
 * Uses rolesView with inheritance from parent folder
 * - Owner can always view
 * - Admin can always view
 * - Check rolesView (with inheritance) for role-based access
 */
export async function canViewThread(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  const userId = user.id;

  logger.debug("canViewThread: Checking permissions", {
    userId,
    threadId: thread.id,
    threadUserId: thread.userId,
    threadRootFolderId: thread.rootFolderId,
    folderId: thread.folderId,
    folderName: folder?.name,
  });

  // Owner can always view
  if (userId && isOwner(userId, thread.userId)) {
    logger.debug("canViewThread: User is owner", {
      userId,
      threadUserId: thread.userId,
    });
    return true;
  }

  // Admin can always view
  if (userId) {
    const isAdminUser = await isAdmin(userId, logger);
    logger.debug("canViewThread: Admin check", { userId, isAdminUser });
    if (isAdminUser) {
      return true;
    }
  }

  // Build folder map for inheritance
  const folderMap: Record<string, ChatFolder> = { ...allFolders };
  if (folder && folder.id) {
    folderMap[folder.id] = folder;
  }

  // Get effective rolesView (with inheritance from folder)
  const effectiveRoles = getEffectiveRoles(thread, "rolesView", folderMap);

  logger.debug("canViewThread: Checking role permission", {
    effectiveRoles,
    userId: user.id,
    isPublic: user.isPublic,
  });

  // Check if user has required role
  const hasPermission = await hasRolePermission(user, effectiveRoles, logger);

  logger.debug("canViewThread: Final result", {
    hasPermission,
    threadId: thread.id,
  });

  return hasPermission;
}

/**
 * Check if user can edit a thread (title, settings, etc.)
 * Uses rolesEdit with inheritance from parent folder
 * - Owner can always edit
 * - Admin can always edit
 * - Check rolesEdit (with inheritance) for role-based access
 */
export async function canEditThread(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  const userId = user.id;

  // Owner can always edit
  if (userId && isOwner(userId, thread.userId)) {
    return true;
  }

  // Admin can always edit
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  // Build folder map for inheritance
  const folderMap: Record<string, ChatFolder> = { ...allFolders };
  if (folder && folder.id) {
    folderMap[folder.id] = folder;
  }

  // Get effective rolesEdit (with inheritance from folder)
  const effectiveRoles = getEffectiveRoles(thread, "rolesEdit", folderMap);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}

/**
 * Check if user can post messages in a thread
 * Uses rolesPost with inheritance from parent folder
 * - Owner can always post
 * - Admin can always post
 * - Check rolesPost (with inheritance) for role-based access
 */
export async function canPostInThread(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  const userId = user.id;

  // Owner can always post
  if (userId && isOwner(userId, thread.userId)) {
    return true;
  }

  // Admin can always post
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  // Build folder map for inheritance
  const folderMap: Record<string, ChatFolder> = { ...allFolders };
  if (folder && folder.id) {
    folderMap[folder.id] = folder;
  }

  // Get effective rolesPost (with inheritance from folder)
  const effectiveRoles = getEffectiveRoles(thread, "rolesPost", folderMap);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}

/**
 * Check if user can delete a thread
 * Uses rolesAdmin with inheritance from parent folder
 * - Owner can always delete
 * - Admin can always delete
 * - Check rolesAdmin (with inheritance) for role-based access
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

  // Get effective rolesAdmin (with inheritance from folder)
  const effectiveRoles = getEffectiveRoles(thread, "rolesAdmin", folderMap);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}

/**
 * Check if user can hide/moderate a thread
 * Uses rolesModerate with inheritance from parent folder
 * - Owner can always hide
 * - Admin can always hide
 * - Check rolesModerate (with inheritance) for role-based access
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

  // Get effective rolesModerate (with inheritance from folder)
  const effectiveRoles = getEffectiveRoles(thread, "rolesModerate", folderMap);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}

/**
 * Check if user can update a thread (rename, change settings, etc.)
 * Same as edit permission - uses rolesEdit
 */
export async function canUpdateThread(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  return await canEditThread(user, thread, folder, logger, allFolders);
}

/**
 * Check if user can manage thread permissions
 * Uses rolesAdmin - only owner, admin, and users with rolesAdmin can manage permissions
 * Permission management is only available for PUBLIC root folder and its subfolders
 * Private, shared, and incognito threads don't support permission management
 */
export async function canManageThreadPermissions(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  // Permission management is only available for PUBLIC root folder
  // Private, shared, and incognito threads are owner-only by design
  if (thread.rootFolderId !== "public") {
    return false;
  }

  const userId = user.id;

  // Owner can manage permissions
  if (userId && isOwner(userId, thread.userId)) {
    return true;
  }

  // Admin can manage permissions
  if (userId && (await isAdmin(userId, logger))) {
    return true;
  }

  // Build folder map for inheritance
  const folderMap: Record<string, ChatFolder> = { ...allFolders };
  if (folder && folder.id) {
    folderMap[folder.id] = folder;
  }

  // Check rolesAdmin permission
  const effectiveRoles = getEffectiveRoles(thread, "rolesAdmin", folderMap);
  return await hasRolePermission(user, effectiveRoles, logger);
}

// ============================================================================
// MESSAGE PERMISSIONS
// ============================================================================

/**
 * Check if user can read a message
 * Inherits from thread view permissions
 */
export async function canReadMessage(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  // Messages inherit thread permissions
  return await canViewThread(user, thread, folder, logger, allFolders);
}

/**
 * Check if user can create a message in a thread (post messages)
 * Uses rolesPost with inheritance from parent folder
 * - Owner can always post
 * - Admin can always post
 * - Check rolesPost (with inheritance) for role-based access
 */
export async function canWriteMessage(
  user: JwtPayloadType,
  thread: ChatThread,
  folder: ChatFolder | null,
  logger: EndpointLogger,
  allFolders: Record<string, ChatFolder> = {},
): Promise<boolean> {
  return await canPostInThread(user, thread, folder, logger, allFolders);
}

/**
 * Check if user can delete a message
 * Uses thread's rolesAdmin permission (with inheritance)
 * - Author can delete their own messages
 * - Admin can delete any message
 * - Check rolesAdmin (with inheritance) for role-based access
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

  // Get effective rolesAdmin (with inheritance from folder)
  const effectiveRoles = getEffectiveRoles(thread, "rolesAdmin", folderMap);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}

/**
 * Check if user can hide/moderate a message
 * Uses thread's rolesModerate permission (with inheritance)
 * - Author can hide their own messages
 * - Admin can hide any message
 * - Check rolesModerate (with inheritance) for role-based access
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

  // Get effective rolesModerate (with inheritance from folder)
  const effectiveRoles = getEffectiveRoles(thread, "rolesModerate", folderMap);

  // Check if user has required role
  return await hasRolePermission(user, effectiveRoles, logger);
}
