/**
 * Chat Database Schema
 * Database tables for chat threads, folders, and messages
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "@/app/api/[locale]/v1/core/user/db";

import { ChatMessageRoleDB, ThreadStatusDB } from "./enum";

/**
 * Chat Folders Table
 * Hierarchical folder structure for organizing threads
 */
export const chatFolders = pgTable("chat_folders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Folder details
  name: text("name").notNull(),
  icon: text("icon"), // lucide icon name or si icon name
  color: text("color"), // hex color for visual distinction

  // Hierarchy
  parentId: uuid("parent_id").references((): any => chatFolders.id, {
    onDelete: "cascade",
  }),

  // UI state
  expanded: boolean("expanded").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),

  // Metadata
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Chat Threads Table
 * Represents individual chat conversations
 */
export const chatThreads = pgTable("chat_threads", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Thread details
  title: text("title").notNull(),
  folderId: uuid("folder_id").references(() => chatFolders.id, {
    onDelete: "set null",
  }),

  // Status
  status: text("status", { enum: ThreadStatusDB })
    .notNull()
    .default(ThreadStatusDB[0]),

  // Settings
  defaultModel: text("default_model"), // ModelId
  defaultTone: text("default_tone"), // Persona/tone
  systemPrompt: text("system_prompt"),

  // Metadata
  pinned: boolean("pinned").default(false).notNull(),
  archived: boolean("archived").default(false).notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  preview: text("preview"), // First user message preview
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Chat Messages Table
 * Individual messages within threads, supporting branching/threading
 */
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  threadId: uuid("thread_id")
    .notNull()
    .references(() => chatThreads.id, { onDelete: "cascade" }),

  // Message content
  role: text("role", { enum: ChatMessageRoleDB }).notNull(),
  content: text("content").notNull(),

  // Threading/branching
  parentId: uuid("parent_id").references((): any => chatMessages.id, {
    onDelete: "cascade",
  }),
  depth: integer("depth").default(0).notNull(),

  // Author information (for multi-user support)
  authorId: text("author_id"), // User ID or "local"
  authorName: text("author_name"),
  authorAvatar: text("author_avatar"),
  authorColor: text("author_color"),
  isAI: boolean("is_ai").default(false).notNull(),

  // AI-specific fields
  model: text("model"), // ModelId if AI message
  tone: text("tone"), // Persona/tone used

  // Error information (for error messages)
  errorType: text("error_type"),
  errorMessage: text("error_message"),
  errorCode: text("error_code"),

  // Metadata
  edited: boolean("edited").default(false).notNull(),
  originalId: uuid("original_id"), // If this is an edit
  tokens: integer("tokens"),
  collapsed: boolean("collapsed").default(false).notNull(),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

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

export const chatMessagesRelations = relations(chatMessages, ({ one, many }) => ({
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
}));

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

