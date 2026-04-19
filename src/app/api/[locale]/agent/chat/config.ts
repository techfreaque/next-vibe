/**
 * Chat Folder Configuration
 * Default folder definitions and utilities
 */

import type { ChatTranslationKey } from "@/app/[locale]/chat/i18n";
import type { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import type { CallbackModeValue } from "@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import {
  type UserPermissionRoleValue,
  UserRole,
} from "@/app/api/[locale]/user/user-roles/enum";

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

  /** Cron folder - threads created by scheduled AI agent tasks */
  CRON = "cron",
}

/**
 * Tool IDs denied per folder type. Stacked onto deniedToolIds in stream-setup.
 * Uses plain string aliases (not imports) to avoid circular deps - config.ts is foundational.
 * Admin-only tools (campaign-starter, leads-import, etc.) are already gated by allowedRoles
 * and don't need explicit denial here.
 */
export const FOLDER_DENIED_TOOL_IDS: Partial<
  Record<DefaultFolderId, readonly string[]>
> = {
  [DefaultFolderId.INCOGNITO]: [
    // Task infrastructure - results can't route back to localStorage-only threads
    "coding-agent", // escalateToTask + spawns OS processes
    "ssh-exec", // escalates long commands to cron tasks
    "execute-tool", // creates remote cron tasks (PUBLIC-accessible)
    "wait-for-task", // monitors tasks (useless without detach/wakeUp)
    "complete-task", // forges task completion
    "cron-create", // direct task creation
    "execute-task", // runs stored tasks
    "task-sync", // syncs remote instance tasks
  ],
  [DefaultFolderId.PUBLIC]: [
    "coding-agent",
    "ssh-exec",
    "execute-tool",
    "wait-for-task",
    "complete-task",
    "cron-create",
    "execute-task",
    "task-sync",
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
 * Stream Context - rich context passed to tool executions during AI streaming.
 * Replaces the old single `rootFolderId` parameter with a structured object
 * so handlers know which thread/message/model they're operating in.
 */
export interface ToolExecutionContext {
  /** Which root folder the conversation lives in */
  rootFolderId: DefaultFolderId;
  /** Thread ID of the active conversation */
  threadId: string | undefined;
  /** The assistant message ID currently being generated */
  aiMessageId: string | undefined;
  /**
   * The tool message ID for the current tool call being executed.
   * Set by tools-loader execute() wrapper from pendingToolMessages.get(toolCallId)
   * before calling each tool's execute(). Parallel-safe via per-call injection.
   * Used by execute-tool and wait-for-task to record which DB row to update.
   */
  currentToolMessageId: string | undefined;
  /**
   * Read-only reference to StreamContext.pendingToolMessages.
   * Keyed by AI SDK toolCallId. Set once in stream-setup and never replaced.
   * tools-loader inject currentToolMessageId from this map before each execute() call.
   * Not present in non-streaming contexts (cron, headless).
   */
  pendingToolMessages:
    | ReadonlyMap<
        string,
        {
          messageId: string;
          toolCallData?: {
            parentId: string | null;
            toolCall?: { requiresConfirmation?: boolean };
          };
        }
      >
    | undefined;
  /**
   * When set, finish-step-handler starts a timeout of this many ms using the
   * stream's abort controller. Used for remote queue path and wait-for-task.
   * Direct HTTP wait mode does NOT use this - the HTTP connection is the timeout.
   */
  pendingTimeoutMs: number | undefined;
  /**
   * Stream timeout from the called tool's endpoint definition (streamTimeoutMs).
   * Injected by tools-loader before execute() is called.
   * undefined = use default (90_000). 0 = no timeout (long-running tools).
   */
  callerTimeoutMs?: number;
  /**
   * The branch leaf message ID at the time this tool call was initiated.
   * Set by tools-loader from PendingToolData.toolCallData.parentId before each execute() call.
   * Stored on wakeUp task rows so resume-stream can append the deferred result to the
   * correct branch even if the user has switched to a different branch in the meantime.
   */
  leafMessageId: string | undefined;
  /**
   * The active favorite ID - allows resume-stream to reload the exact same
   * model + character config when restarting a dead stream after a remote tool result.
   */
  favoriteId: string | undefined;

  /**
   * The effective resolved skill for this stream.
   * This is the post-resolution value (from favorite or explicit override).
   */
  skillId: string | undefined;
  /**
   * When set, all media gen tools (image/music/video) must use this provider.
   * Mirrors the chat model providerOverride so the full stream uses one provider.
   */
  providerOverride: ApiProvider | undefined;
  /** Whether this is a headless/cron invocation */
  headless: boolean | undefined;
  /**
   * Sub-agent nesting depth. 0 = top-level (user-facing or cron).
   * Incremented each time ai-run spawns a child stream.
   * Revival / wakeUp streams inherit the parent's depth (they continue, not nest).
   */
  subAgentDepth: number;
  /** Whether this is a revival stream (resume-stream after wakeUp task completed). */
  isRevival: boolean | undefined;
  /**
   * Mutable signal set by remote tools with callbackMode=wait.
   * Stream layer checks this after tool-result to pause and wait for /report.
   */
  waitingForRemoteResult: boolean | undefined;
  /**
   * Set by escalateToTask(callbackMode=wait) to trigger endLoop semantics:
   * wait for all parallel tools to finish, then stop the AI loop without a
   * new request. Bridged to StreamContext.shouldStopLoop in index.ts.
   * Optional - only present in streaming contexts (bridged via defineProperty).
   */
  shouldStopLoop?: boolean;
  /**
   * The stream's abort signal - set when streaming, undefined for non-stream contexts.
   * Tool executions check this before starting to bail out if the stream was cancelled.
   */
  abortSignal: AbortSignal;
  /**
   * The AI SDK toolCallId for the current tool call being executed.
   * Set by tools-loader execute() wrapper from options.toolCallId before calling execute().
   * Used by execute-tool to look up the correct toolMessageId for parallel tool calls.
   * Not present in non-streaming contexts (cron, headless).
   */
  callerToolCallId: string | undefined;
  /**
   * The callbackMode the AI caller requested for the current tool call.
   * Set by execute-tool before invoking the tool handler so long-running tools
   * (like claude-code interactive) can pass it to escalateToTask() and honour
   * the exact semantics the caller expects (wait/wakeUp/detach/endLoop).
   * Undefined outside of execute-tool invocations.
   */
  callerCallbackMode: CallbackModeValue | undefined;
  /**
   * Call this from inside a long-running tool execute() to escape the 90s stream timeout.
   * Creates a task row with the requested callbackMode and stops the stream cleanly:
   * - wait: sets shouldStopLoop (endLoop semantics, all parallel tools finish first)
   * - wakeUp/detach: sets waitingForRemoteResult (REMOTE_TOOL_WAIT, stream aborts immediately)
   * Also wires cancel propagation. The tool continues running after this returns.
   * When the tool finishes, call onComplete() - or for tools that delegate completion
   * to an external process (e.g. claude-code calling complete-task), ignore onComplete.
   * Only available in streaming contexts - undefined for cron/headless invocations.
   *
   * Usage:
   *   if (context.streamContext.escalateToTask) {
   *     const { taskId, onComplete } = await context.streamContext.escalateToTask({
   *       callbackMode: context.streamContext.callerCallbackMode,
   *       displayName: "My long task",
   *     });
   *     // ... do long-running work ...
   *     await onComplete({ success: true, data: result });
   *   }
   */
  escalateToTask:
    | ((options?: {
        /** callbackMode to honour - defaults to wakeUp for backward compat */
        callbackMode?: CallbackModeValue;
        /** Human-readable name shown in task dashboard */
        displayName?: string;
      }) => Promise<{
        taskId: string;
        onComplete: (result: {
          success: boolean;
          data?: Record<string, WidgetData>;
          message?: string;
        }) => Promise<void>;
      }>)
    | undefined;
  /**
   * Set by escalateToTask when a task is in flight.
   * Called by the abort signal listener when USER_CANCELLED fires so the task
   * row is marked CANCELLED and the UI unlocks for a new message.
   * Cleared after the cancel runs (or after onComplete).
   */
  onEscalatedTaskCancel: (() => Promise<void>) | undefined;
  /**
   * Set by escalateToTask() immediately after inserting the task row.
   * Cleared by stream-part-handler once it backfills wakeUpToolMessageId with
   * the actual TOOL message ID (which is created after escalateToTask returns).
   * This bridges the timing gap between escalation and TOOL message creation.
   */
  pendingEscalatedTaskId?: string | undefined;
  /**
   * Cancels the pending stream timeout timer set by finish-step-handler.
   * Called by the stream's finally block so the 90s timer doesn't fire
   * after the stream has already ended naturally (e.g. wakeUp mode where
   * the AI writes a response and the loop exits cleanly).
   */
  cancelPendingStreamTimer?: (() => void) | undefined;
  /**
   * Tool message IDs of wakeUp calls that were intercepted by wait-for-task.
   * The stream's finally block skips revival for these so the AI doesn't wake up
   * again after wait-for-task already delivered the result inline.
   */
  suppressedWakeUpToolMessageIds?: Set<string>;
  /**
   * Emit a partial tool result to the parent thread's WS channel and persist to DB.
   * The tool message stays in "Executing" state but result data is available to the widget.
   * Called by long-running tools (e.g. ai-run) to stream intermediate state before completion.
   * Only available in streaming contexts - undefined for cron/headless invocations.
   */
  emitPartialToolResult?: (partialResult: WidgetData) => Promise<void>;
}

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
  [DefaultFolderId.CRON]: {
    id: DefaultFolderId.CRON,
    translationKey: "common.cronChats",
    icon: "clock",
    descriptionKey: "folders.cronDescription",
    order: 4,
    color: "green", // Green for automated/cron tasks
    rolesView: [UserRole.ADMIN], // Only admins can view
    rolesManage: [UserRole.ADMIN], // Only admins can manage
    rolesCreateThread: [UserRole.ADMIN], // Only admins can create threads
    rolesPost: [UserRole.ADMIN], // Only admins can post
    rolesModerate: [UserRole.ADMIN], // Only admins
    rolesAdmin: [UserRole.ADMIN], // Only admins
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
