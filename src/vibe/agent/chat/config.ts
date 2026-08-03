/**
 * Chat Folder Configuration
 * Default folder definitions and utilities
 */

import {
  CORTEX_DELETE_ALIAS,
  CORTEX_EDIT_ALIAS,
  CORTEX_EXEC_ALIAS,
  CORTEX_LIST_ALIAS,
  CORTEX_MKDIR_ALIAS,
  CORTEX_MOVE_ALIAS,
  CORTEX_READ_ALIAS,
  CORTEX_SEARCH_ALIAS,
  CORTEX_TREE_ALIAS,
  CORTEX_WRITE_ALIAS,
} from "../cortex/constants";
import { DefaultFolderId } from "../../core/execution-context";
import { EXECUTE_TOOL_ALIAS } from "next-vibe/execute-tool/constants";
import {
  type UserPermissionRoleValue,
  UserRole,
} from "next-vibe/identity/roles/enum";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";

import type { ChatTranslationKey } from "@/_pages/chat/i18n";

/** Root folder options shared by the get/patch/delete rootFolderId SELECT fields. */
export const rootFolderIdOptions = [
  { value: DefaultFolderId.PRIVATE, label: "config.folders.private" as const },
  { value: DefaultFolderId.SHARED, label: "config.folders.shared" as const },
  { value: DefaultFolderId.PUBLIC, label: "config.folders.public" as const },
  {
    value: DefaultFolderId.BACKGROUND,
    label: "config.folders.background" as const,
  },
  {
    value: DefaultFolderId.INCOGNITO,
    label: "config.folders.incognito" as const,
  },
  { value: DefaultFolderId.REMOTE, label: "config.folders.remote" as const },
];

/**
 * Tool IDs denied per folder type. Stacked onto deniedToolIds in stream-setup.
 * Admin-only tools (campaign-starter, leads-import, etc.) are already gated by allowedRoles
 * and don't need explicit denial here.
 */
export const FOLDER_DENIED_TOOL_IDS: Partial<
  Record<DefaultFolderId, readonly string[]>
> = {
  [DefaultFolderId.INCOGNITO]: [
    // Task infrastructure - results can't route back to localStorage-only threads
    "coding-agent",
    CORTEX_EXEC_ALIAS,
    EXECUTE_TOOL_ALIAS,
    "await-task",
    "complete-task",
    "cron-create",
    "execute-task",
    "task-sync",
    // Cortex - requires authenticated user + server-side storage
    CORTEX_LIST_ALIAS,
    CORTEX_READ_ALIAS,
    CORTEX_WRITE_ALIAS,
    CORTEX_EDIT_ALIAS,
    CORTEX_MKDIR_ALIAS,
    CORTEX_MOVE_ALIAS,
    CORTEX_DELETE_ALIAS,
    CORTEX_TREE_ALIAS,
    CORTEX_SEARCH_ALIAS,
  ],
  [DefaultFolderId.PUBLIC]: [
    "coding-agent",
    CORTEX_EXEC_ALIAS,
    EXECUTE_TOOL_ALIAS,
    "await-task",
    "complete-task",
    "cron-create",
    "execute-task",
    "task-sync",
    // Cortex - requires authenticated user + server-side storage
    CORTEX_LIST_ALIAS,
    CORTEX_READ_ALIAS,
    CORTEX_WRITE_ALIAS,
    CORTEX_EDIT_ALIAS,
    CORTEX_MKDIR_ALIAS,
    CORTEX_MOVE_ALIAS,
    CORTEX_DELETE_ALIAS,
    CORTEX_TREE_ALIAS,
    CORTEX_SEARCH_ALIAS,
  ],
};

/**
 * Callback modes blocked per folder type. Enforced at schema injection
 * (AI never sees them) and execution time (defense in depth).
 */
export const FOLDER_BLOCKED_CALLBACK_MODES: Partial<
  Record<DefaultFolderId, readonly string[]>
> = {
  [DefaultFolderId.INCOGNITO]: ["detach", "wakeUp"],
  [DefaultFolderId.PUBLIC]: ["detach", "wakeUp"],
};

/**
 * Whether remote tools (instanceId__toolName) are allowed for this folder type.
 * Explicit false = blocked. Absent = allowed (default).
 */
export const FOLDER_ALLOWS_REMOTE_TOOLS: Partial<
  Record<DefaultFolderId, false>
> = {
  [DefaultFolderId.INCOGNITO]: false,
  [DefaultFolderId.PUBLIC]: false,
};

/**
 * Default folder configuration with all metadata
 * These folders are created automatically for all users
 */
export interface DefaultFolderConfig {
  /** Folder ID (string, not UUID) */
  id: DefaultFolderId;

  /** Translation key for folder name */
  translationKey: ChatTranslationKey;

  /** Icon identifier (lucide icon name or si icon name) */
  icon: IconKey;

  /** Translation key for folder description */
  descriptionKey: ChatTranslationKey;

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
 * Keyed by folder ID for clean direct access
 */
export const DEFAULT_FOLDER_CONFIGS = {
  [DefaultFolderId.PRIVATE]: {
    id: DefaultFolderId.PRIVATE,
    translationKey: "common.privateChats",
    icon: "lock",
    descriptionKey: "folders.privateDescription",
    order: 0,
    color: "sky", // Softer blue for private/secure
    rolesView: [], // Owner only
    rolesManage: [], // Owner only
    rolesCreateThread: [], // Owner only
    rolesPost: [], // Owner only
    rolesModerate: [], // Owner only
    rolesAdmin: [], // Owner only
  },
  [DefaultFolderId.INCOGNITO]: {
    id: DefaultFolderId.INCOGNITO,
    translationKey: "common.incognitoChats",
    icon: "shield-plus",
    descriptionKey: "folders.incognitoDescription",
    order: 1,
    color: "purple", // Purple for incognito/private
    rolesView: [], // Local only
    rolesManage: [], // Local only
    rolesCreateThread: [], // Local only
    rolesPost: [], // Local only
    rolesModerate: [], // Local only
    rolesAdmin: [], // Local only
  },
  [DefaultFolderId.SHARED]: {
    id: DefaultFolderId.SHARED,
    translationKey: "common.sharedChats",
    icon: "users",
    descriptionKey: "folders.sharedDescription",
    order: 2,
    color: "teal", // Collaborative teal for shared
    rolesView: [], // Will be set via share links
    rolesManage: [], // Will be set via share links
    rolesCreateThread: [], // Will be set via share links
    rolesPost: [], // Will be set via share links
    rolesModerate: [], // Will be set via share links
    rolesAdmin: [], // Will be set via share links
  },
  [DefaultFolderId.PUBLIC]: {
    id: DefaultFolderId.PUBLIC,
    translationKey: "common.publicChats",
    icon: "1a",
    descriptionKey: "folders.publicDescription",
    order: 3,
    color: "amber", // Premium gold/amber for public 1A
    rolesView: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN], // Visible to all
    rolesManage: [UserRole.ADMIN], // Only admins can manage folder
    rolesCreateThread: [UserRole.ADMIN], // Only authenticated users can create threads in root public folder
    rolesPost: [UserRole.ADMIN], // Everyone can post
    rolesModerate: [UserRole.PARTNER_ADMIN, UserRole.ADMIN], // Moderators and admins can moderate
    rolesAdmin: [UserRole.ADMIN], // Only admins can delete
  },
  [DefaultFolderId.BACKGROUND]: {
    id: DefaultFolderId.BACKGROUND,
    translationKey: "common.backgroundChats",
    icon: "clock",
    descriptionKey: "folders.backgroundDescription",
    order: 4,
    color: "green", // Green for automated/background tasks
    rolesView: [UserRole.CUSTOMER, UserRole.ADMIN], // Customers see their own threads, admins see all
    rolesManage: [UserRole.ADMIN], // Only admins can manage the folder
    rolesCreateThread: [UserRole.CUSTOMER, UserRole.ADMIN], // Cron system creates on behalf of user
    rolesPost: [UserRole.CUSTOMER, UserRole.ADMIN], // Users can post in their own cron threads
    rolesModerate: [UserRole.ADMIN], // Only admins
    rolesAdmin: [UserRole.ADMIN], // Only admins
  },
  [DefaultFolderId.REMOTE]: {
    id: DefaultFolderId.REMOTE,
    translationKey: "common.remoteChats",
    icon: "plug",
    descriptionKey: "folders.remoteDescription",
    order: 5,
    color: "indigo",
    rolesView: [UserRole.ADMIN], // Admin-only: local instance owners + connected remote instances
    rolesManage: [UserRole.ADMIN],
    rolesCreateThread: [UserRole.ADMIN],
    rolesPost: [UserRole.ADMIN],
    rolesModerate: [UserRole.ADMIN],
    rolesAdmin: [UserRole.ADMIN],
  },
} as const satisfies Record<DefaultFolderId, DefaultFolderConfig>;

/**
 * Check if a folder ID is a default system folder
 * @param folderId - Folder ID to check
 * @returns True if the folder is a default system folder
 */
export function isDefaultFolderId(
  folderId: string,
): folderId is DefaultFolderId {
  return (Object.values(DefaultFolderId) as string[]).includes(folderId);
}

/**
 * Get default folder config by ID
 * @param folderId - Default folder ID
 * @returns Default folder configuration or undefined
 */
export function getDefaultFolderConfig(
  folderId: string,
): DefaultFolderConfig | undefined {
  if (!isDefaultFolderId(folderId)) {
    return undefined;
  }
  return DEFAULT_FOLDER_CONFIGS[folderId];
}

/**
 * Check if a folder is incognito (localStorage only)
 * @param folderId - Folder ID to check
 * @returns True if the folder is incognito
 */
export function isIncognitoFolder(folderId: string): boolean {
  return folderId === DefaultFolderId.INCOGNITO;
}
