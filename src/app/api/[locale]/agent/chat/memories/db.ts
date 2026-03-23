/**
 * Memories Database Schema
 * Stores user and lead memories for persistent AI context
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

import { users } from "@/app/api/[locale]/user/db";

/**
 * Memory metadata structure
 */
interface MemoryMetadata {
  source?: string; // Where the memory came from (e.g., conversation, manual entry)
  confidence?: number; // How confident we are in this memory (0-1)
  lastAccessed?: string; // ISO timestamp of last access
  accessCount?: number; // Number of times this memory was accessed
  syncId?: string; // Stable UUID for cross-instance sync (Hermes ↔ Thea)
}

/**
 * Memories Table
 * Stores persistent facts about users that the AI should remember
 * Memories are automatically loaded into the system prompt for each AI interaction
 */
export const memories = pgTable("memories", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Owner - user who owns this memory
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Memory content
  content: text("content").notNull(), // The fact to remember (e.g., "Profession: Software engineer specializing in Python")
  tags: jsonb("tags").$type<string[]>().default([]).notNull(), // Tags for categorization (e.g., ["profession", "skills"])

  // Memory number - auto-incrementing per user starting from 0
  memoryNumber: integer("sequence_number").notNull(), // Maps to sequence_number in DB

  // Memory importance
  priority: integer("priority").default(0).notNull(), // Higher priority memories appear first in prompt

  // Visibility - public memories are included in public folder AI context
  isPublic: boolean("is_public").default(false).notNull(),

  // Archive - archived memories are excluded from AI context but not deleted
  isArchived: boolean("is_archived").default(false).notNull(),

  // Shared - synced between instances (Hermes ↔ Thea) via task-sync
  isShared: boolean("is_shared").default(false).notNull(),

  // Metadata
  metadata: jsonb("metadata").$type<MemoryMetadata>().default({}),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Relations
 */
export const memoriesRelations = relations(memories, ({ one }) => ({
  user: one(users, {
    fields: [memories.userId],
    references: [users.id],
  }),
}));

/**
 * Schema for selecting memories
 */
export const selectMemorySchema = createSelectSchema(memories);

/**
 * Schema for inserting memories
 */
export const insertMemorySchema = createInsertSchema(memories);

/**
 * Type for memory model
 */
export type Memory = z.infer<typeof selectMemorySchema>;

/**
 * Type for new memory model
 */
export type NewMemory = z.infer<typeof insertMemorySchema>;
