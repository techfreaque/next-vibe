/**
 * Chat Configuration
 * Central configuration for chat system including default folders, constants, and system settings
 */

import type { TranslationKey } from "@/i18n/core/static-types";
import {
  type UserPermissionRoleValue,
  UserRole,
} from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type { IconValue } from "./model-access/icons";

/**
 * Default folder IDs
 * These are special system folder IDs that exist outside the database
 * They use simple string IDs (not UUIDs) for easy reference
 */
export enum DefaultFolderId {
  /** Private folder - user-only access, server-stored */
  PRIVATE = "private",

  /** Shared folder - link-based sharing */
  SHARED = "shared",

  /** Public folder - forum-style with moderation */
  PUBLIC = "public",

  /** Incognito folder - localStorage only, never sent to server */
  INCOGNITO = "incognito",
}

/**
 * Default folder configuration with all metadata
 * These folders are created automatically for all users
 */
export interface DefaultFolderConfig {
  /** Folder ID (string, not UUID) */
  id: DefaultFolderId;

  /** Translation key for folder name */
  translationKey: TranslationKey;

  /** Icon identifier (lucide icon name or si icon name) */
  icon: IconValue;

  /** Translation key for folder description */
  descriptionKey: TranslationKey;

  /** Display order (0-based) */
  order: number;

  /** Color identifier for UI theming */
  color: string;

  /** Default permission roles for folders in this root folder */
  /** Roles that can view/read this folder and its contents */
  rolesView: (typeof UserPermissionRoleValue)[];
  /** Roles that can edit folder and create subfolders */
  rolesManage: (typeof UserPermissionRoleValue)[];
  /** Roles that can create threads in this folder */
  rolesCreateThread: (typeof UserPermissionRoleValue)[];
  /** Roles that can post messages in threads */
  rolesPost: (typeof UserPermissionRoleValue)[];
  /** Roles that can moderate/hide content in this folder */
  rolesModerate: (typeof UserPermissionRoleValue)[];
  /** Roles that can delete content and manage permissions */
  rolesAdmin: (typeof UserPermissionRoleValue)[];
}

/**
 * Default folder configurations
 * Defines all system folders with their metadata
 */
export const DEFAULT_FOLDER_CONFIGS: readonly DefaultFolderConfig[] = [
  {
    id: DefaultFolderId.PRIVATE,
    translationKey: "app.chat.common.privateChats",
    icon: "lock",
    descriptionKey: "app.chat.folders.privateDescription",
    order: 0,
    color: "sky", // Softer blue for private/secure
    rolesView: [], // Owner only
    rolesManage: [], // Owner only
    rolesCreateThread: [], // Owner only
    rolesPost: [], // Owner only
    rolesModerate: [], // Owner only
    rolesAdmin: [], // Owner only
  },
  {
    id: DefaultFolderId.INCOGNITO,
    translationKey: "app.chat.common.incognitoChats",
    icon: "shield-plus",
    descriptionKey: "app.chat.folders.incognitoDescription",
    order: 1,
    color: "purple", // Purple for incognito/private
    rolesView: [], // Local only
    rolesManage: [], // Local only
    rolesCreateThread: [], // Local only
    rolesPost: [], // Local only
    rolesModerate: [], // Local only
    rolesAdmin: [], // Local only
  },
  {
    id: DefaultFolderId.SHARED,
    translationKey: "app.chat.common.sharedChats",
    icon: "users",
    descriptionKey: "app.chat.folders.sharedDescription",
    order: 2,
    color: "teal", // Collaborative teal for shared
    rolesView: [], // Will be set via share links
    rolesManage: [], // Will be set via share links
    rolesCreateThread: [], // Will be set via share links
    rolesPost: [], // Will be set via share links
    rolesModerate: [], // Will be set via share links
    rolesAdmin: [], // Will be set via share links
  },
  {
    id: DefaultFolderId.PUBLIC,
    translationKey: "app.chat.common.publicChats",
    icon: "1a",
    descriptionKey: "app.chat.folders.publicDescription",
    order: 3,
    color: "amber", // Premium gold/amber for public 1A
    rolesView: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN], // Visible to all
    rolesManage: [UserRole.ADMIN], // Only admins can manage folder
    rolesCreateThread: [UserRole.ADMIN], // Only authenticated users can create threads in root public folder
    rolesPost: [UserRole.ADMIN], // Everyone can post
    rolesModerate: [UserRole.PARTNER_ADMIN, UserRole.ADMIN], // Moderators and admins can moderate
    rolesAdmin: [UserRole.ADMIN], // Only admins can delete
  },
] as const;

/**
 * Check if a folder ID is a default system folder
 * @param folderId - Folder ID to check
 * @returns True if the folder is a default system folder
 */
export function isDefaultFolderId(
  folderId: string,
): folderId is DefaultFolderId {
  return Object.values(DefaultFolderId).includes(folderId as DefaultFolderId);
}

/**
 * Get default folder config by ID
 * @param folderId - Default folder ID
 * @returns Default folder configuration or undefined
 */
export function getDefaultFolderConfig(
  folderId: string,
): DefaultFolderConfig | undefined {
  return DEFAULT_FOLDER_CONFIGS.find((config) => config.id === folderId);
}

/**
 * Check if a folder is incognito (localStorage only)
 * @param folderId - Folder ID to check
 * @returns True if the folder is incognito
 */
export function isIncognitoFolder(folderId: string): boolean {
  return folderId === DefaultFolderId.INCOGNITO;
}

/**
 * Chat system constants
 */
export const CHAT_CONSTANTS = {
  /** Maximum message content length */
  MAX_MESSAGE_LENGTH: 10000,

  /** Maximum thread title length */
  MAX_THREAD_TITLE_LENGTH: 200,

  /** Maximum folder name length */
  MAX_FOLDER_NAME_LENGTH: 100,

  /** Default thread title translation key */
  DEFAULT_THREAD_TITLE: "app.chat.common.newChat",

  /** Maximum depth for message threading/branching */
  MAX_MESSAGE_DEPTH: 10,
} as const;
