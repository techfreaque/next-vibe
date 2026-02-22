/**
 * Chat System Constants
 * Centralized constants for chat system including storage keys, limits, and defaults
 */

import { CONTACT_FORM_ALIAS } from "../../contact/definition";
import { aliasToPathMap } from "../../system/generated/endpoint";
import { TOOL_HELP_ALIAS } from "../../system/help/constants";
import { FETCH_URL_ALIAS } from "../fetch-url-content/definition";
import { SEARCH_ALIAS } from "../search/brave/definition";
import {
  MEMORY_DELETE_ALIAS,
  MEMORY_UPDATE_ALIAS,
} from "./memories/[id]/definition";
import { MEMORY_ADD_ALIAS } from "./memories/create/definition";
import { MEMORY_LIST_ALIAS } from "./memories/definition";
import { EXECUTE_TOOL_ALIAS } from "../../system/unified-interface/ai/execute-tool/definition";

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
  aliasToPathMap[SEARCH_ALIAS],
  aliasToPathMap[FETCH_URL_ALIAS],
  aliasToPathMap[MEMORY_LIST_ALIAS],
  aliasToPathMap[MEMORY_ADD_ALIAS],
  aliasToPathMap[MEMORY_UPDATE_ALIAS],
  aliasToPathMap[MEMORY_DELETE_ALIAS],
  aliasToPathMap[CONTACT_FORM_ALIAS],
] as const;
