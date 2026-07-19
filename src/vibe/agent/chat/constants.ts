/**
 * Chat System Constants
 * Centralized constants for chat system including storage keys, limits, and defaults
 */

import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole, UserRole } from "next-vibe/identity/roles/enum";

import {
  DEFAULT_AI_PINNED_IDS,
  DEFAULT_WEB_PINNED_IDS,
} from "@/generated/endpoints/meta/default-pins";

import { CODING_AGENT_ALIAS } from "../coding-agent/constants";
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
import { DefaultFolderId } from "./config";

/**
 * Storage keys for localStorage persistence
 */
export const STORAGE_KEYS = {
  FAVORITE_CHARACTERS: "chat-favorites-v2",
  FAVORITE_MODELS: "chat-favorite-models",
  RECENT_SELECTIONS: "chat-recent-selections",
  DEFAULT_BUDGET: "chat-default-budget",
  ONBOARDING_COMPLETED: "chat-onboarding-completed",
  SELECTOR_ONBOARDING_COMPLETED: "chat-selector-onboarding-v2",
  COMPANION_CHOICE: "chat-companion-choice",
  /** Last UUID skillId that a public user favorited - used for signup attribution */
  LAST_ATTRIBUTED_SKILL: "chat-last-attributed-skill",
} as const;

/**
 * Chat system constraints and limits
 */
export const CHAT_CONSTANTS = {
  /** Default thread title translation key */
  DEFAULT_THREAD_TITLE: "app.chat.common.newChat",
} as const;

/**
 * Agent message content length limit
 */
export const AGENT_MESSAGE_LENGTH = 40000; // TODO find a better way and also better error

/**
 * Default remote tools made available (enabled) when a remote instance is connected.
 * These are unprefixed tool IDs - the instanceId prefix (e.g. "hermes__") is added
 * at connect time when writing into the user's availableTools setting.
 */
export const DEFAULT_REMOTE_TOOL_IDS = [
  CODING_AGENT_ALIAS,
  CORTEX_EXEC_ALIAS,
] as const;

/**
 * Default remote tools pinned into the AI context window on connect.
 * Empty by default - remote tools start as available-only.
 */
export const DEFAULT_REMOTE_PINNED_IDS: readonly string[] = [];

/**
 * Convenience wrapper: derive role flags from a JWT payload and return the
 * role-appropriate default AI-pinned tool IDs.
 * Reads from the generated default-pins.ts - no manual alias lists needed.
 */
export function getDefaultToolIdsForUser(
  user: JwtPayloadType,
): readonly string[] {
  if (user.isPublic) {
    return getDefaultToolIds(false, false);
  }
  const isAdmin = user.roles.includes(UserPermissionRole.ADMIN);
  return getDefaultToolIds(isAdmin, !isAdmin);
}

/**
 * Convenience wrapper: return the role-appropriate default web-sidebar-pinned tool IDs.
 */
export function getDefaultWebPinnedIdsForUser(
  user: JwtPayloadType,
): readonly string[] {
  const role = user.isPublic
    ? UserRole.PUBLIC
    : user.roles.includes(UserPermissionRole.ADMIN)
      ? UserRole.ADMIN
      : UserRole.CUSTOMER;
  return DEFAULT_WEB_PINNED_IDS[role] ?? [];
}

/**
 * Folder-aware default pinned tool IDs.
 * Incognito and public folders strip all cortex tools from the defaults
 * because cortex requires authenticated server-side storage.
 */
export function getDefaultToolIdsForFolder(
  user: JwtPayloadType,
  rootFolderId: string,
): readonly string[] {
  const base = getDefaultToolIdsForUser(user);
  if (
    rootFolderId === DefaultFolderId.INCOGNITO ||
    rootFolderId === DefaultFolderId.PUBLIC
  ) {
    const cortexAliases = new Set([
      CORTEX_LIST_ALIAS,
      CORTEX_READ_ALIAS,
      CORTEX_WRITE_ALIAS,
      CORTEX_EDIT_ALIAS,
      CORTEX_MKDIR_ALIAS,
      CORTEX_MOVE_ALIAS,
      CORTEX_DELETE_ALIAS,
      CORTEX_TREE_ALIAS,
      CORTEX_SEARCH_ALIAS,
    ]);
    return base.filter((id) => !cortexAliases.has(id));
  }
  return base;
}

/**
 * Get the effective default AI-pinned tool IDs based on user role and environment.
 * Reads from the generated default-pins.ts. In local mode, the ADMIN role already
 * includes sql and rebuild from their defaultAiPinned flags.
 */
export function getDefaultToolIds(
  isAdmin?: boolean,
  isCustomer?: boolean,
): readonly string[] {
  const effectiveAdmin = isAdmin ?? envClient.NEXT_PUBLIC_LOCAL_MODE;
  if (effectiveAdmin) {
    return DEFAULT_AI_PINNED_IDS[UserRole.ADMIN] ?? [];
  }
  if (isCustomer) {
    return DEFAULT_AI_PINNED_IDS[UserRole.CUSTOMER] ?? [];
  }
  return DEFAULT_AI_PINNED_IDS[UserRole.PUBLIC] ?? [];
}
