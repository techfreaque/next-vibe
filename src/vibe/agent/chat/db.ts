/**
 * Chat Database Schema
 * Database tables for chat threads, folders, and messages
 *
 * PERMISSION SYSTEM OVERVIEW:
 *
 * Folders (6 permission types):
 * - rolesView: View/read folder → inherits to subfolders & threads
 * - rolesManage: Edit folder & create subfolders → inherits to subfolders only
 * - rolesCreateThread: Create threads → inherits to subfolders & threads
 * - rolesPost: Post messages → inherits to subfolders & threads
 * - rolesModerate: Moderate/hide content → inherits to subfolders & threads
 * - rolesAdmin: Delete & manage permissions → inherits to subfolders & threads
 *
 * Threads (5 permission types):
 * - rolesView: View/read thread & messages
 * - rolesEdit: Edit thread (title, settings)
 * - rolesPost: Post messages
 * - rolesModerate: Moderate/hide messages
 * - rolesAdmin: Delete thread & manage permissions
 *
 * Inheritance Rules:
 * - null = inherit from parent folder
 * - [] (empty array) = no roles allowed (explicit deny)
 * - [roles...] = explicit roles allowed
 * - Inheritance chain: thread → folder → parent folder → root folder → DEFAULT_FOLDER_CONFIGS
 * - Owner and Admin users bypass all permission checks
 */

import { getTableColumns, relations, sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  customType,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const vector1024 = customType<{
  data: number[];
  driverData: string;
}>({
  dataType() {
    return "vector(1024)";
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
  fromDriver(value: string): number[] {
    return value.replace(/^\[/, "").replace(/]$/, "").split(",").map(Number);
  },
});
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { MessageVariant } from "next-vibe/agent/ai-stream/repository/core/modality-resolver";
import type { Modality } from "next-vibe/agent/models/enum";
import type { ErrorResponseType } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { createRelationalDb } from "next-vibe/database/relational";
import type { CallbackModeValue } from "next-vibe/execute-tool/constants";
import { leads } from "next-vibe/identity/lead/db";
import { type UserPermissionRoleValue } from "next-vibe/identity/roles/enum";
import { users } from "next-vibe/identity/user/db";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";
import type { z } from "zod";

import type { FavoriteConfig } from "../skills/favorites/db";
import type { DefaultFolderId } from "./config";
import {
  ChatMessageRoleDB,
  ThreadStatusDB,
  ThreadStreamingState,
  ThreadStreamingStateDB,
} from "./enum";

/**
 * A tool call as persisted on a message and shipped over endpoint payloads.
 *
 * A type alias, NOT an interface: this rides an endpoint payload, so it must be
 * assignable to `WidgetData`, whose record arm is `{ [key: string]: WidgetData }`.
 * TypeScript grants an implicit index signature to object type aliases but never
 * to interfaces, so an interface here is unassignable at every erased payload
 * boundary (e.g. a route's onRemoteEvent vs OnRemoteEventDispatchMap).
 */
// eslint-disable-next-line typescript/consistent-type-definitions -- Must be a type alias, not an interface: only aliases get the implicit index signature that makes this assignable to WidgetData on an endpoint payload. See above.
export type ToolCall = {
  toolCallId: string; // AI SDK tool call ID (e.g., "toolu_bdrk_01X8QxqpkW7HVqYiChTpDLzN")
  toolName: string;
  args: WidgetData;
  result?: WidgetData;
  error?: ErrorResponseType; // Structured error with translation key, params, errorType, and optional nested cause
  executionTime?: number;
  creditsUsed?: number;
  requiresConfirmation?: boolean;
  isConfirmed?: boolean;
  waitingForConfirmation?: boolean; // True when stream is paused waiting for user confirmation
  /** For async remote tools: pending until /report backfills the result */
  status?: "pending" | "completed" | "failed";
  /** taskId of the remote cron task - set for async remote tool calls */
  remoteTaskId?: string;
  /** callbackMode used for this tool call - determines continuation behavior */
  callbackMode?: CallbackModeValue;
  /**
   * For deferred result messages (endLoop): the toolCallId of the
   * original pending call that this message supersedes. The original message
   * has no result; this message has both args (copied) and result. The AI
   * sees this as a fresh tool call+result pair (new unique toolCallId) and
   * the original pending call is suppressed from AI context.
   */
  originalToolCallId?: string;
  /**
   * True for deferred result messages - result arrived asynchronously after
   * the original stream ended (wakeUp/endLoop). UI shows a distinct badge.
   */
  isDeferred?: boolean;
  /** True when this is a partial/intermediate result - tool is still executing */
  isPartial?: boolean;
  /** True while the AI model is still streaming tool call arguments */
  isInputStreaming?: boolean;
  /** Raw accumulated argument text during streaming (before JSON parsing completes) */
  argsText?: string;
  /**
   * Set when the tool call was executed on a remote instance (e.g. "hermes").
   * Only present on tool messages that arrived via a remote relay — not on
   * locally-executed tool calls.
   */
  remoteInstanceId?: string;
  /**
   * pending-calls registry key for remote dispatches: written up front by an
   * inline WAIT (restart/cross-process anchor), by the WAIT→wakeUp
   * auto-upgrade, by wakeUp dispatches and by await-task parks — so
   * detach can cancel the revival and a result event landing in any
   * process can find the waiter.
   */
  pendingCallId?: string;
  /**
   * True while the pendingCallId anchor belongs to a LIVE inline WAIT (the
   * stream is blocked in awaitPendingCallResult, not parked). A sibling
   * process receiving the result must only persist the durable handoff row —
   * never fire a wakeUp revival (double delivery). Flipped to false when the
   * call parks (WAIT auto-upgrade / await-task).
   */
  pendingCallInline?: boolean;
};

/**
 * Tool cost information
 */
export interface ToolCost {
  toolName: string;
  credits: number;
}

/**
 * Reasoning metadata for thinking/reasoning messages
 */
export interface ReasoningMetadata {
  isReasoning: boolean;
  isStreaming?: boolean;
}

export interface ToolCallMetadata {
  toolCallId: string; // AI SDK tool call ID (e.g., "toolu_bdrk_01X8QxqpkW7HVqYiChTpDLzN")
  toolName: string;
  args: WidgetData;
  result?: WidgetData;
  error?: ErrorResponseType; // Structured error with translation key, params, errorType, and optional nested cause
  executionTime?: number;
  creditsUsed?: number;
  requiresConfirmation?: boolean;
  isConfirmed?: boolean;
}

/**
 * Message metadata structure
 * Can contain different metadata types depending on message role
 *
 * A type alias, NOT an interface: this rides an endpoint payload, so it must be
 * assignable to `WidgetData`, whose record arm is `{ [key: string]: WidgetData }`.
 * TypeScript grants an implicit index signature to object type aliases but never
 * to interfaces, so an interface here is unassignable at every erased payload
 * boundary (e.g. a route's onRemoteEvent vs OnRemoteEventDispatchMap).
 */
// eslint-disable-next-line typescript/consistent-type-definitions -- Must be a type alias, not an interface: only aliases get the implicit index signature that makes this assignable to WidgetData on an endpoint payload. See above.
export type MessageMetadata = {
  // Token and generation info (for ASSISTANT messages)
  generationTime?: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  cachedInputTokens?: number;
  cacheWriteTokens?: number;
  timeToFirstToken?: number;
  creditCost?: number;
  finishReason?: string;
  streamingTime?: number;

  // Reasoning metadata (for ASSISTANT messages with reasoning)
  isReasoning?: boolean;
  isStreaming?: boolean;
  /** Client-only: marks an optimistic placeholder added before server confirms */
  isOptimistic?: boolean;

  // Voice input metadata (for USER messages with audio input)
  isTranscribing?: boolean;

  // File attachment upload state (for USER messages with file attachments in server threads)
  isUploadingAttachments?: boolean;

  // Tool call metadata (for TOOL messages)
  toolCall?: ToolCall;

  // Compacting metadata (for ASSISTANT messages that contain compacted history)
  isCompacting?: boolean;
  compactingFailed?: boolean; // Set when compacting stream failed or was interrupted
  compactedMessageCount?: number;
  compactedTokenCount?: number;
  compactedTimeRange?: {
    start: string; // ISO timestamp
    end: string; // ISO timestamp
  };
  originalMessageIds?: string[]; // For audit/debugging
  /** True when one or more compacted messages contained generatedMedia or variants */
  containsMediaReferences?: boolean;

  // Attachments
  attachments?: {
    id: string;
    url: string;
    filename: string;
    mimeType: string;
    size: number;
    data?: string; // base64 data for incognito mode
  }[];

  // Chunk boundary flags (set server-side, cleared when adjacent chunk is loaded)
  hasOlderHistory?: boolean; // Oldest message in chunk: true if older chunks exist
  hasNewerHistory?: boolean; // Leaf message: true if a newer chunk exists beyond it
  newerAnchorId?: string | null; // ID of the compacting message that starts the newer chunk

  // Voting
  voterIds?: string[];
  voteDetails?: Array<{
    userId: string;
    vote: "up" | "down";
    timestamp: number;
  }>;

  // Generated media (for ASSISTANT messages from image/video generation)
  generatedMedia?: {
    type: "image" | "video" | "audio";
    /** CDN-hosted or provider URL of the generated media */
    url?: string;
    prompt: string;
    modelId: string;
    width?: number;
    height?: number;
    /** Duration in seconds (video only) */
    durationSeconds?: number;
    mimeType?: string;
    creditCost: number;
    /** Async generation status (video only) */
    status?: "pending" | "complete" | "failed";
  };

  // Modality provenance
  inputModality?: Modality;
  outputModality?: Modality;

  // Pipeline steps for multi-step turns (STT → LLM → TTS, translation → image-gen, etc.)
  pipelineSteps?: Array<{
    type: "stt" | "tts" | "vision" | "translation" | "routing" | "gap-fill";
    modelId: ChatModelId;
    creditCost: number;
    durationMs?: number;
  }>;

  // Gap-fill translations: each modality gap produces a variant stored here
  variants?: MessageVariant[];

  // Real-time gap-fill status - set on GAP_FILL_STARTED, cleared on GAP_FILL_COMPLETED.
  // Used to show labeled status chips ("Transcribing audio…", "Analyzing image…", etc.)
  gapFillStatus?: {
    bridgeType: "stt" | "vision" | "translation" | "tts";
    modality: Modality;
  } | null;

  // Queue metadata (for USER messages waiting to be processed while AI is streaming)
  isQueued?: boolean;
  /** Settings snapshot for queued messages - used when auto-processing from queue */
  queuedSettings?: {
    model: ChatModelId;
    skill: string;
    rootFolderId: DefaultFolderId;
    subFolderId: string | null;
    voiceMode: { enabled: boolean };
    favoriteConfig: FavoriteConfig | null;
    timezone: string;
  };
};

/**
 * Chat Folders Table
 * Hierarchical folder structure for organizing threads
 */
export const chatFolders = pgTable(
  "chat_folders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // userId can be null for public/anonymous users creating folders in public root
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    // leadId is used to track public/anonymous users (required when userId is null)
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }),

    // Root folder (constant: private, shared, public, incognito)
    rootFolderId: text("root_folder_id").$type<DefaultFolderId>().notNull(),

    // Folder details
    name: text("name").notNull(),
    icon: text("icon").$type<IconKey | null>(),
    color: text("color"), // hex color for visual distinction

    // Hierarchy - self-reference requires AnyPgColumn to break circular inference
    parentId: uuid("parent_id").references((): AnyPgColumn => chatFolders.id, {
      onDelete: "cascade",
    }),

    // UI state
    expanded: boolean("expanded").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    pinned: boolean("pinned").default(false).notNull(),

    // Permission roles - 6-Role Model for Folders
    // null = inherit from parent folder
    // [] = no roles allowed (explicit deny)
    // [roles...] = explicit roles allowed
    // Each role array contains UserRole enum values

    // rolesView: Who can view/read the folder and its existence
    // Inherits to: subfolders, threads
    // Note: .$type<T[]> without | null, nullability inferred
    rolesView: jsonb("roles_view").$type<(typeof UserPermissionRoleValue)[]>(),

    // rolesManage: Who can edit/rename folder AND create subfolders
    // Inherits to: subfolders only (not threads)
    rolesManage:
      jsonb("roles_manage").$type<(typeof UserPermissionRoleValue)[]>(),

    // rolesCreateThread: Who can create new threads in this folder
    // Inherits to: subfolders, threads
    rolesCreateThread: jsonb("roles_create_thread").$type<
      (typeof UserPermissionRoleValue)[]
    >(),

    // rolesPost: Who can post messages in threads within this folder
    // Inherits to: subfolders, threads
    rolesPost: jsonb("roles_post").$type<(typeof UserPermissionRoleValue)[]>(),

    // rolesModerate: Who can moderate/hide content (messages, threads)
    // Inherits to: subfolders, threads
    rolesModerate:
      jsonb("roles_moderate").$type<(typeof UserPermissionRoleValue)[]>(),

    // rolesAdmin: Who can delete content and manage permissions
    // Inherits to: subfolders, threads
    rolesAdmin:
      jsonb("roles_admin").$type<(typeof UserPermissionRoleValue)[]>(),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Indexes for common queries
    userIdIdx: index("chat_folders_user_id_idx").on(table.userId),
    rootFolderIdIdx: index("chat_folders_root_folder_id_idx").on(
      table.rootFolderId,
    ),
    parentIdIdx: index("chat_folders_parent_id_idx").on(table.parentId),
    sortOrderIdx: index("chat_folders_sort_order_idx").on(table.sortOrder),
    // GIN indexes for array containment queries on role fields
    rolesViewIdx: index("chat_folders_roles_view_idx").using(
      "gin",
      table.rolesView,
    ),
    rolesManageIdx: index("chat_folders_roles_manage_idx").using(
      "gin",
      table.rolesManage,
    ),
    rolesCreateThreadIdx: index("chat_folders_roles_create_thread_idx").using(
      "gin",
      table.rolesCreateThread,
    ),
    rolesPostIdx: index("chat_folders_roles_post_idx").using(
      "gin",
      table.rolesPost,
    ),
    rolesModerateIdx: index("chat_folders_roles_moderate_idx").using(
      "gin",
      table.rolesModerate,
    ),
    rolesAdminIdx: index("chat_folders_roles_admin_idx").using(
      "gin",
      table.rolesAdmin,
    ),
  }),
);

/**
 * Chat Threads Table
 * Represents individual chat conversations
 */
export const chatThreads = pgTable(
  "chat_threads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // userId can be null for public/anonymous users posting in public folders
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    // leadId is used to track public/anonymous users (required when userId is null)
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }),

    // Thread details
    title: text("title").notNull(),

    // Root folder (constant: private, shared, public, incognito)
    rootFolderId: text("root_folder_id").$type<DefaultFolderId>().notNull(),

    // Subfolder (UUID reference to chat_folders table, can be null for root-level threads)
    folderId: uuid("folder_id").references(() => chatFolders.id, {
      onDelete: "set null",
    }),

    // Status
    status: text("status", { enum: ThreadStatusDB })
      .notNull()
      .default(ThreadStatusDB[0]),

    // Settings
    defaultModel: text("default_model").$type<ChatModelId | null>(), // ModelId
    defaultSkill: text("default_tone"), // Skill ID (can be default character or custom UUID)
    systemPrompt: text("system_prompt"),

    // Ordering within a folder (alongside sibling folders)
    sortOrder: integer("sort_order").default(0).notNull(),

    // Metadata
    pinned: boolean("pinned").default(false).notNull(),
    archived: boolean("archived").default(false).notNull(),
    tags: jsonb("tags").$type<string[]>().default([]),
    description: text("description"),
    // Permission roles - 5-Role Model for Threads
    // null = inherit from parent folder
    // [] = no roles allowed (explicit deny)
    // [roles...] = explicit roles allowed
    // Each role array contains UserRole enum values

    // rolesView: Who can view/read the thread and its messages
    // Note: .$type<T[]> without | null, nullability inferred
    rolesView: jsonb("roles_view").$type<(typeof UserPermissionRoleValue)[]>(),

    // rolesEdit: Who can edit the thread (title, settings, etc.)
    rolesEdit: jsonb("roles_edit").$type<(typeof UserPermissionRoleValue)[]>(),

    // rolesPost: Who can post messages in this thread
    rolesPost: jsonb("roles_post").$type<(typeof UserPermissionRoleValue)[]>(),

    // rolesModerate: Who can moderate/hide messages in this thread
    rolesModerate:
      jsonb("roles_moderate").$type<(typeof UserPermissionRoleValue)[]>(),

    // rolesAdmin: Who can delete the thread and manage permissions
    rolesAdmin:
      jsonb("roles_admin").$type<(typeof UserPermissionRoleValue)[]>(),

    // Published status (for SHARED folders - allows public read access via link)
    published: boolean("published").default(false).notNull(),

    streamingState: text("streaming_state", { enum: ThreadStreamingStateDB })
      .$type<ThreadStreamingState>()
      .default(ThreadStreamingState.IDLE)
      .notNull(),
    // Owner of the current 'streaming' claim — one ID per stream execution.
    // A finishing stream may only clear streamingState when this still matches
    // its own run ID; a stale finalizer (late revival, superseded turn) must
    // never clobber the successor stream's claim. NULL = no owner (idle, or a
    // reconciler cleared it).
    streamingRunId: text("streaming_run_id"),

    // ── Cross-instance identity (placement is DATA — it replicates verbatim; ──
    // ── these columns carry ownership/routing, never the folder path)       ──
    // Owning instance as THIS instance names it (remote_connections.instance_id).
    // NULL = this instance originated the thread. Placement (rootFolderId +
    // folder-name chain) is origin-authoritative and identical on every copy.
    originInstanceId: text("origin_instance_id"),
    // Where this thread's AI loop runs by default (a connection's instance_id).
    // NULL = locally. Per-stream request field overrides; the column persists
    // the choice for follow-up turns.
    loopInstanceId: text("loop_instance_id"),
    // Whether this thread may leave the instance via thread sync at all.
    // Transient plumbing threads (tool executions, cron runs) set false —
    // an explicit flag, never derived from folder names.
    syncEligible: boolean("sync_eligible").default(true).notNull(),
    // Spawning thread when this thread is a SUB-STREAM/SUB-AGENT (ai-run child,
    // image-gen LLM sub-stream). NULL for user-facing / top-level threads. Real
    // provenance data: lets sub-agent runs be traced to their caller and the
    // fixture engine walk child → parent → root to find the run's counter. Not
    // set for relay MIRRORS (same logical thread — that lineage is
    // originInstanceId), only for genuinely spawned child threads.
    parentThreadId: uuid("parent_thread_id"),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

    // Full-text search vector (auto-generated by trigger)
    searchVector: text("search_vector"),
  },
  (table) => ({
    // GIN index for full-text search performance
    searchVectorIdx: index("chat_threads_search_vector_idx").using(
      "gin",
      sql`to_tsvector('english', ${table.title} || ' ' || COALESCE(${table.description}, '') || ' ' || COALESCE(${table.systemPrompt}, ''))`,
    ),
    // Additional indexes for common queries
    userIdIdx: index("chat_threads_user_id_idx").on(table.userId),
    rootFolderIdIdx: index("chat_threads_root_folder_id_idx").on(
      table.rootFolderId,
    ),
    folderIdIdx: index("chat_threads_folder_id_idx").on(table.folderId),
    originInstanceIdIdx: index("chat_threads_origin_instance_id_idx").on(
      table.originInstanceId,
    ),
    loopInstanceIdIdx: index("chat_threads_loop_instance_id_idx").on(
      table.loopInstanceId,
    ),
    statusIdx: index("chat_threads_status_idx").on(table.status),
    createdAtIdx: index("chat_threads_created_at_idx").on(table.createdAt),
    updatedAtIdx: index("chat_threads_updated_at_idx").on(table.updatedAt),
    // GIN indexes for array containment queries on role fields
    rolesViewIdx: index("chat_threads_roles_view_idx").using(
      "gin",
      table.rolesView,
    ),
    rolesEditIdx: index("chat_threads_roles_edit_idx").using(
      "gin",
      table.rolesEdit,
    ),
    rolesPostIdx: index("chat_threads_roles_post_idx").using(
      "gin",
      table.rolesPost,
    ),
    rolesModerateIdx: index("chat_threads_roles_moderate_idx").using(
      "gin",
      table.rolesModerate,
    ),
    rolesAdminIdx: index("chat_threads_roles_admin_idx").using(
      "gin",
      table.rolesAdmin,
    ),
  }),
);

/**
 * Chat Messages Table
 * Individual messages within threads, supporting branching/threading
 */
export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    threadId: uuid("thread_id")
      .notNull()
      .references(() => chatThreads.id, { onDelete: "cascade" }),

    // Message content
    role: text("role", { enum: ChatMessageRoleDB }).notNull(),
    content: text("content"), // Nullable: tool messages have null content, assistant messages can be null if no text before tool calls

    // Threading/branching - self-reference requires AnyPgColumn to break circular inference
    parentId: uuid("parent_id").references((): AnyPgColumn => chatMessages.id, {
      onDelete: "cascade",
    }),

    // Message sequencing - links messages that are part of the same AI response
    // All messages in a sequence share the same sequenceId (first message's ID)
    sequenceId: uuid("sequence_id"),

    // Author information (for multi-user support)
    authorId: text("author_id"), // User ID or "local"
    authorName: text("author_name"), // Snapshot of display name at message creation time (null for anonymous/incognito)
    isAI: boolean("is_ai").default(false).notNull(),

    // AI-specific fields
    model: text("model").$type<ChatModelId | null>(), // ModelId if AI message
    skill: text("tone"),

    // Error information (for error messages)
    errorType: text("error_type"),
    errorMessage: text("error_message"),
    errorCode: text("error_code"),

    // Metadata
    metadata: jsonb("metadata").$type<MessageMetadata>().default({}),

    // Voting
    upvotes: integer("upvotes").default(0).notNull(),
    downvotes: integer("downvotes").default(0).notNull(),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

    // Full-text search vector (auto-generated by trigger)
    searchVector: text("search_vector"),

    // Semantic embedding for vector search (fire-and-forget after message write)
    embedding: vector1024("embedding"),
    // SHA-256 hash of embedded text — skip redundant API calls when content unchanged
    embeddingHash: text("embedding_hash"),
  },
  (table) => ({
    // GIN index for full-text search performance
    searchVectorIdx: index("chat_messages_search_vector_idx").using(
      "gin",
      sql`to_tsvector('english', COALESCE(${table.content}, ''))`,
    ),
    // Additional indexes for common queries
    threadIdIdx: index("chat_messages_thread_id_idx").on(table.threadId),
    parentIdIdx: index("chat_messages_parent_id_idx").on(table.parentId),
    roleIdx: index("chat_messages_role_idx").on(table.role),
    createdAtIdx: index("chat_messages_created_at_idx").on(table.createdAt),
  }),
);

/**
 * All chatMessages columns EXCEPT the heavy search-only ones: the 1024-dim
 * `embedding` vector, its `embeddingHash`, and the full-text `searchVector`.
 * Use this in EVERY `.select()` on chatMessages — a bare `.select()` /
 * `.select()`-all pulls the vector (~4KB/row) into app memory for nothing.
 * Only the embedding writer (message-embed.ts) and the in-DB vector search read
 * those columns, and they do so explicitly. `ChatMessage` still types them as
 * present (nullable), so consumers that never touch them are unaffected.
 */
const {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  embedding: _cmEmbedding,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  embeddingHash: _cmEmbeddingHash,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchVector: _cmSearchVector,
  ...CHAT_MESSAGE_COLUMNS_REST
} = getTableColumns(chatMessages);
export const CHAT_MESSAGE_COLUMNS = CHAT_MESSAGE_COLUMNS_REST;

/**
 * Thread Share Links Table
 * Share links for threads in SHARED folders
 * Allows controlled access to threads via unique tokens
 */
export const threadShareLinks = pgTable(
  "thread_share_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Thread being shared
    threadId: uuid("thread_id")
      .notNull()
      .references(() => chatThreads.id, { onDelete: "cascade" }),

    // User who created the share link
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Unique share token (used in URL)
    token: text("token").notNull().unique(),

    // Optional label/description for the link
    label: text("label"),

    // Permission settings
    // View only (default) or allow posting
    allowPosting: boolean("allow_posting").default(false).notNull(),

    // Allow unauthenticated users (public link) or require sign-in
    requireAuth: boolean("require_auth").default(false).notNull(),

    // Link status
    active: boolean("active").default(true).notNull(),

    // Usage tracking
    accessCount: integer("access_count").default(0).notNull(),
    lastAccessedAt: timestamp("last_accessed_at"),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    threadIdIdx: index("thread_share_links_thread_id_idx").on(table.threadId),
    tokenIdx: index("thread_share_links_token_idx").on(table.token),
    createdByIdx: index("thread_share_links_created_by_idx").on(
      table.createdBy,
    ),
    activeIdx: index("thread_share_links_active_idx").on(table.active),
  }),
);

/**
 * Relations
 */
export const chatFoldersRelations = relations(chatFolders, ({ one, many }) => ({
  user: one(users, {
    fields: [chatFolders.userId],
    references: [users.id],
  }),
  parent: one(chatFolders, {
    fields: [chatFolders.parentId],
    references: [chatFolders.id],
    relationName: "folderHierarchy",
  }),
  children: many(chatFolders, {
    relationName: "folderHierarchy",
  }),
  threads: many(chatThreads),
}));

export const chatThreadsRelations = relations(chatThreads, ({ one, many }) => ({
  user: one(users, {
    fields: [chatThreads.userId],
    references: [users.id],
  }),
  folder: one(chatFolders, {
    fields: [chatThreads.folderId],
    references: [chatFolders.id],
  }),
  messages: many(chatMessages),
  shareLinks: many(threadShareLinks),
}));

export const threadShareLinksRelations = relations(
  threadShareLinks,
  ({ one }) => ({
    thread: one(chatThreads, {
      fields: [threadShareLinks.threadId],
      references: [chatThreads.id],
    }),
    creator: one(users, {
      fields: [threadShareLinks.createdBy],
      references: [users.id],
    }),
  }),
);

export const chatMessagesRelations = relations(
  chatMessages,
  ({ one, many }) => ({
    thread: one(chatThreads, {
      fields: [chatMessages.threadId],
      references: [chatThreads.id],
    }),
    parent: one(chatMessages, {
      fields: [chatMessages.parentId],
      references: [chatMessages.id],
      relationName: "messageTree",
    }),
    children: many(chatMessages, {
      relationName: "messageTree",
    }),
  }),
);

/**
 * Schemas for validation
 */
export const selectChatFolderSchema = createSelectSchema(chatFolders);
export const insertChatFolderSchema = createInsertSchema(chatFolders);

export const selectChatThreadSchema = createSelectSchema(chatThreads);
export const insertChatThreadSchema = createInsertSchema(chatThreads);

/**
 * Message select schema WITHOUT the storage-only vector columns — API responses
 * and app types never carry the 1024-dim `embedding`, its `embeddingHash`, or
 * the `searchVector`. Matches `ChatMessage` and `CHAT_MESSAGE_COLUMNS`.
 */
export const selectChatMessageSchema = createSelectSchema(chatMessages).omit({
  embedding: true,
  embeddingHash: true,
  searchVector: true,
});
export const insertChatMessageSchema = createInsertSchema(chatMessages);

export const selectThreadShareLinkSchema = createSelectSchema(threadShareLinks);
export const insertThreadShareLinkSchema = createInsertSchema(threadShareLinks);

/**
 * Types
 */
export type ChatFolder = z.infer<typeof selectChatFolderSchema> & {
  rootFolderId: DefaultFolderId;
  icon: IconKey | null;
  canManage?: boolean;
  canCreateThread?: boolean;
  canModerate?: boolean;
  canDelete?: boolean;
  canManagePermissions?: boolean;
};
export type NewChatFolder = z.infer<typeof insertChatFolderSchema>;

export type ChatThread = z.infer<typeof selectChatThreadSchema> & {
  rootFolderId: DefaultFolderId;
  canEdit?: boolean;
  canPost?: boolean;
  canModerate?: boolean;
  canDelete?: boolean;
  canManagePermissions?: boolean;
};
export type NewChatThread = z.infer<typeof insertChatThreadSchema>;

/**
 * App-facing message row. Excludes the storage-only columns — the 1024-dim
 * `embedding`, its `embeddingHash`, and the `searchVector` — which no app code
 * ever reads (only the embedding writer and the in-DB vector search touch them,
 * explicitly). Selecting with `CHAT_MESSAGE_COLUMNS` yields exactly this shape,
 * so every consumer aligns and the heavy columns can never accidentally load.
 */
export type ChatMessage = Omit<
  typeof chatMessages.$inferSelect,
  "embedding" | "embeddingHash" | "searchVector"
>;
export type NewChatMessage = z.infer<typeof insertChatMessageSchema>;

export type ThreadShareLink = z.infer<typeof selectThreadShareLinkSchema>;
export type NewThreadShareLink = z.infer<typeof insertThreadShareLinkSchema>;

/**
 * Chat relational client — the only client that carries the chat schema, so it
 * is the one that serves `db.query.chatMessages` / relational chat queries.
 * The default `db` from `next-vibe/database` has no schema and cannot. Use
 * `chatDb.query.*` for relational reads; keep using `db.select()` elsewhere.
 */
export const chatDb = createRelationalDb({
  chatFolders,
  chatThreads,
  chatMessages,
  threadShareLinks,
  chatFoldersRelations,
  chatThreadsRelations,
  chatMessagesRelations,
  threadShareLinksRelations,
});
