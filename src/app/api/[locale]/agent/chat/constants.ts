/**
 * Chat System Constants
 * Centralized constants for chat system including storage keys, limits, and defaults
 */

import { CONTACT_FORM_ALIAS } from "../../contact/definition";
import { aliasToPathMap } from "../../system/generated/endpoint";
import { SEARCH_ALIAS } from "../brave-search/definition";
import { FETCH_URL_ALIAS } from "../fetch-url-content/definition";
import {
  MEMORY_DELETE_ALIAS,
  MEMORY_UPDATE_ALIAS,
} from "./memories/[id]/definition";
import { MEMORY_ADD_ALIAS, MEMORY_LIST_ALIAS } from "./memories/definition";

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

/**
 * Default AI tools enabled for new chats
 * These tools are enabled by default when creating a new chat or resetting tools
 */
export const DEFAULT_TOOL_IDS = [
  aliasToPathMap[SEARCH_ALIAS],
  aliasToPathMap[FETCH_URL_ALIAS],
  aliasToPathMap[MEMORY_LIST_ALIAS],
  aliasToPathMap[MEMORY_ADD_ALIAS],
  aliasToPathMap[MEMORY_UPDATE_ALIAS],
  aliasToPathMap[MEMORY_DELETE_ALIAS],
  aliasToPathMap[CONTACT_FORM_ALIAS],
] as const;

/**
 * Default AI tools that require confirmation
 * These tools will prompt the user before execution when called by the AI
 */
export const DEFAULT_TOOL_CONFIRMATION_IDS = [
  aliasToPathMap[CONTACT_FORM_ALIAS],
] as const;
