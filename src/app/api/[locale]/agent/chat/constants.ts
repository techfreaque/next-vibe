/**
 * Chat System Constants
 * Centralized constants for chat system including storage keys, limits, and defaults
 */

import { envClient } from "@/config/env-client";

import { CONTACT_FORM_ALIAS } from "../../contact/constants";
import { SSH_EXEC_ALIAS } from "../../ssh/exec/constants";
import { SSH_FILES_READ_ALIAS } from "../../ssh/files/read/constants";
import { SSH_FILES_WRITE_ALIAS } from "../../ssh/files/write/constants";
import { SQL_ALIAS } from "../../system/db/sql/constants";
import { TOOL_HELP_ALIAS } from "../../system/help/constants";
import { REBUILD_ALIAS } from "../../system/server/rebuild/constants";
import { EXECUTE_TOOL_ALIAS } from "../../system/unified-interface/ai/execute-tool/constants";
import { COMPLETE_TASK_ALIAS } from "../../system/unified-interface/tasks/complete-task/constants";
import { CRON_DASHBOARD_ALIAS } from "../../system/unified-interface/tasks/cron/dashboard/constants";
import {
  CRON_CREATE_ALIAS,
  CRON_LIST_ALIAS,
} from "../../system/unified-interface/tasks/cron/tasks/constants";
import { WAIT_FOR_TASK_ALIAS } from "../../system/unified-interface/tasks/wait-for-task/constants";
import { AI_RUN_ALIAS } from "../ai-stream/run/constants";
import { CLAUDE_CODE_ALIAS } from "../claude-code/constants";
import { FETCH_URL_ALIAS } from "../fetch-url-content/constants";
import { BRAVE_SEARCH_ALIAS } from "../search/brave/constants";
import { KAGI_ALIAS } from "../search/kagi/constants";
import {
  MEMORY_DELETE_ALIAS,
  MEMORY_UPDATE_ALIAS,
} from "./memories/[id]/constants";
import { MEMORY_LIST_ALIAS } from "./memories/constants";
import { MEMORY_ADD_ALIAS } from "./memories/create/constants";

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
  TOOL_HELP_ALIAS,
  EXECUTE_TOOL_ALIAS,
  BRAVE_SEARCH_ALIAS,
  KAGI_ALIAS,
  FETCH_URL_ALIAS,
  MEMORY_LIST_ALIAS,
  MEMORY_ADD_ALIAS,
  MEMORY_UPDATE_ALIAS,
  MEMORY_DELETE_ALIAS,
  CONTACT_FORM_ALIAS,
  AI_RUN_ALIAS,
] as const;

/**
 * Default remote tools made available (enabled) when a remote instance is connected.
 * These are unprefixed tool IDs — the instanceId prefix (e.g. "hermes__") is added
 * at connect time when writing into the user's allowedTools setting.
 *
 * Mirrors DEFAULT_TOOL_IDS: same pinned/available distinction, same reset-to-defaults
 * behaviour. User can add/remove tools and promote any to pinned via the tool settings UI.
 */
export const DEFAULT_REMOTE_TOOL_IDS = [
  CLAUDE_CODE_ALIAS,
  CRON_LIST_ALIAS,
  CRON_CREATE_ALIAS,
  SSH_EXEC_ALIAS,
  SSH_FILES_READ_ALIAS,
  SSH_FILES_WRITE_ALIAS,
  MEMORY_LIST_ALIAS,
  MEMORY_ADD_ALIAS,
] as const;

/**
 * Default remote tools pinned into the AI context window on connect.
 * Empty by default — remote tools start as available-only (callable via execute-tool,
 * shown in help, but not auto-loaded into every AI context).
 * User can promote individual tools to pinned via the tool settings UI.
 */
export const DEFAULT_REMOTE_PINNED_IDS: readonly string[] = [];

/**
 * Additional tools pinned for local/admin instances (Hermes).
 * These are appended to DEFAULT_TOOL_IDS when running in local mode.
 */
const LOCAL_ADMIN_EXTRA_TOOL_IDS = [
  CLAUDE_CODE_ALIAS,
  SQL_ALIAS,
  REBUILD_ALIAS,
  CRON_DASHBOARD_ALIAS,
  COMPLETE_TASK_ALIAS,
  WAIT_FOR_TASK_ALIAS,
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
