/**
 * Chat Database Schema
 * Database tables for chat threads, folders, and messages
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

import type { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { users } from "@/app/api/[locale]/v1/core/user/db";

import { DEFAULT_FOLDER_IDS, type DefaultFolderId } from "./config";
import { ChatMessageRoleDB, ThreadStatusDB } from "./enum";

// Create array of root folder IDs for Drizzle enum
const RootFolderIdDB = [
  DEFAULT_FOLDER_IDS.PRIVATE,
  DEFAULT_FOLDER_IDS.SHARED,
  DEFAULT_FOLDER_IDS.PUBLIC,
  DEFAULT_FOLDER_IDS.INCOGNITO,
] as const;
import type { ModelId } from "./model-access/models";
import type { PersonaId } from "./personas/config";
import {
  type CustomPersona,
  customPersonas,
  customPersonasRelations,
  type NewCustomPersona,
} from "./personas/db";

/**
 * Folder metadata structure
 */
interface FolderMetadata {
  customColor?: string;
  customIcon?: string;
  sortPreference?: string;
  viewMode?: string;
}

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

/**
 * Widget metadata for tool result rendering
 */
export interface ToolCallWidgetMetadata {
  endpointId: string;
  responseFields: Array<{
    name: string;
    widgetType: WidgetType;
    label?: string;
    description?: string;
    layout?: Record<string, string | number | boolean>;
    validation?: Record<string, string | number | boolean>;
    options?: Array<{ value: string; label: string }>;
  }>;
}

/**
 * Tool call information
 */
export interface ToolCall {
  toolName: string;
  displayName: string;
  icon?: string;
  args: ToolCallResult; // Allow any JSON-serializable value
  result?: ToolCallResult;
  error?: string;
  executionTime?: number;
  widgetMetadata?: ToolCallWidgetMetadata;
  creditsUsed?: number;
}

/**
 * Tool cost information
 */
export interface ToolCost {
  toolName: string;
  credits: number;
}

/**
 * Message metadata structure
 */
export interface MessageMetadata {
  generationTime?: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  finishReason?: string;
  streamingTime?: number;
  toolCalls?: ToolCall[];
  toolCosts?: ToolCost[];
  attachments?: {
    id: string;
    type: string;
    url: string;
  }[];
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
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Root folder (constant: private, shared, public, incognito)
    rootFolderId: text("root_folder_id", { enum: RootFolderIdDB }).$type<DefaultFolderId>().notNull().default("private"),

    // Folder details
    name: text("name").notNull(),
    icon: text("icon"), // lucide icon name or si icon name
    color: text("color"), // hex color for visual distinction

    // Hierarchy - self-reference requires AnyPgColumn to break circular inference
    parentId: uuid("parent_id").references((): AnyPgColumn => chatFolders.id, {
      onDelete: "cascade",
    }),

    // UI state
    expanded: boolean("expanded").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),

    // Metadata
    metadata: jsonb("metadata").$type<FolderMetadata>().default({}),

    // Moderators (array of user IDs who can moderate this folder)
    moderatorIds: jsonb("moderator_ids").$type<string[]>().default([]),

    // Allowed roles (array of UserRole values who can see this folder)
    // If empty, inherits from rootFolderId defaults
    allowedRoles: jsonb("allowed_roles").$type<string[]>().default([]),

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
    // GIN index for array containment queries on allowedRoles
    allowedRolesIdx: index("chat_folders_allowed_roles_idx").using(
      "gin",
      table.allowedRoles,
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
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

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
    defaultPersona: text("default_tone").$type<PersonaId | null>(), // Persona (DB column is "default_tone" for backwards compatibility)
    systemPrompt: text("system_prompt"),

    // Metadata
    pinned: boolean("pinned").default(false).notNull(),
    archived: boolean("archived").default(false).notNull(),
    tags: jsonb("tags").$type<string[]>().default([]),
    preview: text("preview"), // First user message preview
    metadata: jsonb("metadata").$type<ThreadMetadata>().default({}),

    // Moderators (array of user IDs who can moderate this thread)
    moderatorIds: jsonb("moderator_ids").$type<string[]>().default([]),

    // Allowed roles (array of UserRole values who can see this thread)
    // If empty, inherits from parent folder's allowedRoles
    allowedRoles: jsonb("allowed_roles").$type<string[]>().default([]),

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
    // GIN index for array containment queries on allowedRoles
    allowedRolesIdx: index("chat_threads_allowed_roles_idx").using(
      "gin",
      table.allowedRoles,
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
    sequenceIndex: integer("sequence_index").default(0).notNull(), // Order within sequence

    // Author information (for multi-user support)
    authorId: text("author_id"), // User ID or "local"
    authorName: text("author_name"),
    authorAvatar: text("author_avatar"),
    authorColor: text("author_color"),
    isAI: boolean("is_ai").default(false).notNull(),

    // AI-specific fields
    model: text("model"), // ModelId if AI message
    persona: text("tone"), // Persona used (DB column is "tone" for backwards compatibility)

    // Error information (for error messages)
    errorType: text("error_type"),
    errorMessage: text("error_message"),
    errorCode: text("error_code"),

    // Metadata
    edited: boolean("edited").default(false).notNull(),
    originalId: uuid("original_id"), // If this is an edit
    tokens: integer("tokens"),
    collapsed: boolean("collapsed").default(false).notNull(),
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
}));

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

/**
 * Types
 */
export type ChatFolder = z.infer<typeof selectChatFolderSchema>;
export type NewChatFolder = z.infer<typeof insertChatFolderSchema>;

export type ChatThread = z.infer<typeof selectChatThreadSchema>;
export type NewChatThread = z.infer<typeof insertChatThreadSchema>;

export type ChatMessage = z.infer<typeof selectChatMessageSchema>;
export type NewChatMessage = z.infer<typeof insertChatMessageSchema>;

/**
 * Re-export custom personas table, relations and types
 * Note: Relations are also defined in personas/db.ts but re-exported here
 * for Drizzle's query API to work properly
 */
export { customPersonas };
export { customPersonasRelations };
export type { CustomPersona, NewCustomPersona };
