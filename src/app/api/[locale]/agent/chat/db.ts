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

import { relations, sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { leads } from "@/app/api/[locale]/leads/db";
import type { MessageResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import { users } from "@/app/api/[locale]/user/db";
import { type UserPermissionRoleValue } from "@/app/api/[locale]/user/user-roles/enum";

import type { DefaultFolderId } from "./config";
import { ChatMessageRoleDB, ThreadStatusDB } from "./enum";
import type { IconKey } from "./model-access/icons";
import type { ModelId } from "./model-access/models";

/**
 * Thread metadata structure
 */
interface ThreadMetadata {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  customSettings?: {
    key: string;
    value: string | number | boolean;
  }[];
}

/**
 * Tool call result type
 */
export type ToolCallResult =
  | string
  | number
  | boolean
  | null
  | { [key: string]: ToolCallResult }
  | ToolCallResult[];

export interface ToolCall {
  toolName: string;
  args: ToolCallResult;
  result?: ToolCallResult;
  error?: MessageResponseType; // Structured error with translation key and params
  executionTime?: number;
  creditsUsed?: number;
  requiresConfirmation?: boolean;
  isConfirmed?: boolean;
  waitingForConfirmation?: boolean; // True when stream is paused waiting for user confirmation
}

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
  toolName: string;
  args: ToolCallResult;
  result?: ToolCallResult;
  error?: MessageResponseType; // Structured error with translation key and params
  executionTime?: number;
  creditsUsed?: number;
  requiresConfirmation?: boolean;
  isConfirmed?: boolean;
}

/**
 * Message metadata structure
 * Can contain different metadata types depending on message role
 */
export interface MessageMetadata {
  // Token and generation info (for ASSISTANT messages)
  generationTime?: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  finishReason?: string;
  streamingTime?: number;

  // Reasoning metadata (for ASSISTANT messages with reasoning)
  isReasoning?: boolean;
  isStreaming?: boolean;

  // Voice input metadata (for USER messages with audio input)
  isTranscribing?: boolean;

  // Tool call metadata (for TOOL messages)
  toolCall?: ToolCall;

  // Attachments
  attachments?: {
    id: string;
    url: string;
    filename: string;
    mimeType: string;
    size: number;
    data?: string; // base64 data for incognito mode
  }[];

  // Voting
  voterIds?: string[];
  voteDetails?: Array<{
    userId: string;
    vote: "up" | "down";
    timestamp: number;
  }>;
}

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
    defaultModel: text("default_model").$type<ModelId | null>(), // ModelId
    defaultCharacter: text("default_tone"), // Character ID (can be default character or custom UUID)
    systemPrompt: text("system_prompt"),

    // Metadata
    pinned: boolean("pinned").default(false).notNull(),
    archived: boolean("archived").default(false).notNull(),
    tags: jsonb("tags").$type<string[]>().default([]),
    preview: text("preview"), // First user message preview
    metadata: jsonb("metadata").$type<ThreadMetadata>().default({}),

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
      sql`to_tsvector('english', ${table.title} || ' ' || COALESCE(${table.preview}, '') || ' ' || COALESCE(${table.systemPrompt}, ''))`,
    ),
    // Additional indexes for common queries
    userIdIdx: index("chat_threads_user_id_idx").on(table.userId),
    rootFolderIdIdx: index("chat_threads_root_folder_id_idx").on(
      table.rootFolderId,
    ),
    folderIdIdx: index("chat_threads_folder_id_idx").on(table.folderId),
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
    content: text("content").notNull(),

    // Threading/branching - self-reference requires AnyPgColumn to break circular inference
    parentId: uuid("parent_id").references((): AnyPgColumn => chatMessages.id, {
      onDelete: "cascade",
    }),
    depth: integer("depth").default(0).notNull(),

    // Message sequencing - links messages that are part of the same AI response
    // All messages in a sequence share the same sequenceId (first message's ID)
    sequenceId: uuid("sequence_id"),

    // Author information (for multi-user support)
    authorId: text("author_id"), // User ID or "local"
    authorName: text("author_name"),
    authorAvatar: text("author_avatar"),
    authorColor: text("author_color"),
    isAI: boolean("is_ai").default(false).notNull(),

    // AI-specific fields
    model: text("model").$type<ModelId | null>(), // ModelId if AI message
    character: text("tone"),

    // Error information (for error messages)
    errorType: text("error_type"),
    errorMessage: text("error_message"),
    errorCode: text("error_code"),

    // Metadata
    edited: boolean("edited").default(false).notNull(),
    originalId: uuid("original_id"), // If this is an edit
    tokens: integer("tokens"),
    metadata: jsonb("metadata").$type<MessageMetadata>().default({}),

    // Voting
    upvotes: integer("upvotes").default(0).notNull(),
    downvotes: integer("downvotes").default(0).notNull(),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

    // Full-text search vector (auto-generated by trigger)
    searchVector: text("search_vector"),
  },
  (table) => ({
    // GIN index for full-text search performance
    searchVectorIdx: index("chat_messages_search_vector_idx").using(
      "gin",
      sql`to_tsvector('english', ${table.content})`,
    ),
    // Additional indexes for common queries
    threadIdIdx: index("chat_messages_thread_id_idx").on(table.threadId),
    parentIdIdx: index("chat_messages_parent_id_idx").on(table.parentId),
    roleIdx: index("chat_messages_role_idx").on(table.role),
    createdAtIdx: index("chat_messages_created_at_idx").on(table.createdAt),
  }),
);

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

export const selectChatMessageSchema = createSelectSchema(chatMessages);
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

export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = z.infer<typeof insertChatMessageSchema>;

export type ThreadShareLink = z.infer<typeof selectThreadShareLinkSchema>;
export type NewThreadShareLink = z.infer<typeof insertThreadShareLinkSchema>;
