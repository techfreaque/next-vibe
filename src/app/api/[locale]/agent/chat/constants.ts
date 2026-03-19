/**
 * Chat System Constants
 * Centralized constants for chat system including storage keys, limits, and defaults
 */

import { envClient } from "@/config/env-client";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { SSH_EXEC_ALIAS } from "../../ssh/exec/constants";
import { SSH_FILES_READ_ALIAS } from "../../ssh/files/read/constants";
import { SSH_FILES_WRITE_ALIAS } from "../../ssh/files/write/constants";
import { SQL_ALIAS } from "../../system/db/sql/constants";
import { TOOL_HELP_ALIAS } from "../../system/help/constants";
import { REBUILD_ALIAS } from "../../system/server/rebuild/constants";
import { EXECUTE_TOOL_ALIAS } from "../../system/unified-interface/ai/execute-tool/constants";
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
 * Default AI tools for public (unauthenticated) users.
 * Only includes tools accessible to PUBLIC role.
 */
export const DEFAULT_TOOL_IDS_PUBLIC = [
  TOOL_HELP_ALIAS,
  EXECUTE_TOOL_ALIAS,
  WAIT_FOR_TASK_ALIAS,
  BRAVE_SEARCH_ALIAS,
  KAGI_ALIAS,
  FETCH_URL_ALIAS,
  AI_RUN_ALIAS,
] as const;

/**
 * Default AI tools for customer (authenticated non-admin) users.
 * Adds memory tools, execute-tool, and wait-for-task on top of public defaults.
 */
export const DEFAULT_TOOL_IDS_CUSTOMER = [
  TOOL_HELP_ALIAS,
  EXECUTE_TOOL_ALIAS,
  WAIT_FOR_TASK_ALIAS,
  BRAVE_SEARCH_ALIAS,
  KAGI_ALIAS,
  FETCH_URL_ALIAS,
  MEMORY_ADD_ALIAS,
  MEMORY_UPDATE_ALIAS,
  MEMORY_DELETE_ALIAS,
  AI_RUN_ALIAS,
] as const;

/**
 * Default AI tools for admin users.
 * Adds claude-code and other admin-only tools on top of customer defaults.
 */
export const DEFAULT_TOOL_IDS_ADMIN = [
  TOOL_HELP_ALIAS,
  EXECUTE_TOOL_ALIAS,
  WAIT_FOR_TASK_ALIAS,
  BRAVE_SEARCH_ALIAS,
  KAGI_ALIAS,
  FETCH_URL_ALIAS,
  MEMORY_ADD_ALIAS,
  MEMORY_UPDATE_ALIAS,
  MEMORY_DELETE_ALIAS,
  CLAUDE_CODE_ALIAS,
  AI_RUN_ALIAS,
] as const;

/**
 * @deprecated Use DEFAULT_TOOL_IDS_ADMIN / DEFAULT_TOOL_IDS_CUSTOMER / DEFAULT_TOOL_IDS_PUBLIC
 * or call getDefaultToolIds() with the user's role instead.
 */
export const DEFAULT_TOOL_IDS = DEFAULT_TOOL_IDS_ADMIN;

/**
 * Default remote tools made available (enabled) when a remote instance is connected.
 * These are unprefixed tool IDs — the instanceId prefix (e.g. "hermes__") is added
 * at connect time when writing into the user's availableTools setting.
 *
 * Mirrors DEFAULT_TOOL_IDS: same pinned/available distinction, same reset-to-defaults
 * behaviour. User can add/remove tools and promote any to pinned via the tool settings UI.
 */
export const DEFAULT_REMOTE_TOOL_IDS = [
  CLAUDE_CODE_ALIAS,
  SSH_EXEC_ALIAS,
  SSH_FILES_READ_ALIAS,
  SSH_FILES_WRITE_ALIAS,
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
] as const;

/**
 * Convenience wrapper: derive role flags from a JWT payload and return the
 * role-appropriate default tool IDs.  Use this whenever you have a full user object.
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
 * Get the effective default pinned tool IDs based on user role and environment.
 *
 * Role-based defaults:
 * - ADMIN (or local mode): admin tool set + dev tools (claude-code, sql, rebuild, etc.)
 * - CUSTOMER (authenticated, non-admin): customer tool set (no claude-code)
 * - PUBLIC (unauthenticated): public tool set (search, fetch, ai-run, help only)
 *
 * Pass `isAdmin=true` / `isCustomer=true` flags derived from the JWT payload roles.
 * When neither flag is provided, defaults to admin in local mode.
 */
export function getDefaultToolIds(
  isAdmin?: boolean,
  isCustomer?: boolean,
): readonly string[] {
  const effectiveAdmin = isAdmin ?? envClient.NEXT_PUBLIC_LOCAL_MODE;
  if (effectiveAdmin) {
    if (envClient.NEXT_PUBLIC_LOCAL_MODE) {
      return [
        ...DEFAULT_TOOL_IDS_ADMIN,
        ...LOCAL_ADMIN_EXTRA_TOOL_IDS.filter(Boolean),
      ];
    }
    return DEFAULT_TOOL_IDS_ADMIN;
  }
  if (isCustomer) {
    return DEFAULT_TOOL_IDS_CUSTOMER;
  }
  return DEFAULT_TOOL_IDS_PUBLIC;
}
