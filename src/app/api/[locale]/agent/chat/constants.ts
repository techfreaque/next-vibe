/**
 * Chat System Constants
 * Centralized constants for chat system including storage keys, limits, and defaults
 */

import { envClient } from "@/config/env-client";

import { CONTACT_FORM_ALIAS } from "../../contact/definition";
import { aliasToPathMap } from "../../system/generated/endpoint";
import { TOOL_HELP_ALIAS } from "../../system/help/constants";
import { EXECUTE_TOOL_ALIAS } from "../../system/unified-interface/ai/execute-tool/constants";
import { FETCH_URL_ALIAS } from "../fetch-url-content/definition";
import { BRAVE_SEARCH_ALIAS } from "../search/brave/definition";
import {
  MEMORY_DELETE_ALIAS,
  MEMORY_UPDATE_ALIAS,
} from "./memories/[id]/definition";
import { MEMORY_ADD_ALIAS } from "./memories/create/definition";
import { MEMORY_LIST_ALIAS } from "./memories/definition";

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
 * Default AI tools enabled for new chats
 * These tools are enabled by default when creating a new chat or resetting tools
 */
export const DEFAULT_TOOL_IDS = [
  aliasToPathMap[TOOL_HELP_ALIAS],
  aliasToPathMap[EXECUTE_TOOL_ALIAS],
  aliasToPathMap[BRAVE_SEARCH_ALIAS],
  aliasToPathMap[FETCH_URL_ALIAS],
  aliasToPathMap[MEMORY_LIST_ALIAS],
  aliasToPathMap[MEMORY_ADD_ALIAS],
  aliasToPathMap[MEMORY_UPDATE_ALIAS],
  aliasToPathMap[MEMORY_DELETE_ALIAS],
  aliasToPathMap[CONTACT_FORM_ALIAS],
] as const;

/**
 * Additional tools pinned for local/admin instances (Hermes).
 * These are appended to DEFAULT_TOOL_IDS when running in local mode.
 */
const LOCAL_ADMIN_EXTRA_TOOL_IDS = [
  aliasToPathMap["claude-code"],
  aliasToPathMap["sql"],
  aliasToPathMap["rebuild"],
  aliasToPathMap["cron-dashboard"],
  aliasToPathMap["chrome"],
  aliasToPathMap["complete-task"],
] as const;

/**
 * Get the effective default pinned tool IDs based on environment and role.
 * - Local mode + admin: base defaults + dev tools (claude-code, sql, rebuild, etc.)
 * - All other cases: base defaults only
 *
 * When `isAdmin` is not provided, defaults to `true` in local mode (the common case
 * for self-hosted instances where only admin uses the AI).
 */
export function getDefaultToolIds(isAdmin?: boolean): readonly string[] {
  const effectiveAdmin = isAdmin ?? envClient.NEXT_PUBLIC_LOCAL_MODE;
  if (envClient.NEXT_PUBLIC_LOCAL_MODE && effectiveAdmin) {
    return [...DEFAULT_TOOL_IDS, ...LOCAL_ADMIN_EXTRA_TOOL_IDS.filter(Boolean)];
  }
  return DEFAULT_TOOL_IDS;
}
