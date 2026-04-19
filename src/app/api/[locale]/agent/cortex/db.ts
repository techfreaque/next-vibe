/**
 * Cortex Database Schema
 * Stores user files, memories, and documents in a path-based personal filesystem
 */

import { relations } from "drizzle-orm";
import {
  customType,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "@/app/api/[locale]/user/db";

import { CortexNodeTypeDB, CortexSyncPolicyDB, CortexViewTypeDB } from "./enum";

/**
 * Custom pgvector type for embedding storage.
 * Stores float[] as vector(3072) in PostgreSQL (requires pgvector extension).
 * NULL when not yet embedded.
 */
const vector3072 = customType<{
  data: number[];
  driverData: string;
}>({
  dataType() {
    return "vector(3072)";
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
  fromDriver(value: string): number[] {
    // pgvector returns "[0.1,0.2,...]"
    return value.replace(/^\[/, "").replace(/]$/, "").split(",").map(Number);
  },
});

/**
 * Cortex Nodes Table
 * Stores both files and directories in a flat path-based structure.
 * /memories/* and /documents/* live here natively.
 * Virtual mounts (/threads/, /skills/, /tasks/) resolve from existing tables.
 */
export const cortexNodes = pgTable(
  "cortex_nodes",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Owner
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Filesystem identity
    path: text("path").notNull(), // e.g. "/memories/projects/ai.md" or "/documents/notes/meeting.md"
    nodeType: text("node_type", { enum: CortexNodeTypeDB }).notNull(),

    // File content (null for directories)
    content: text("content"),
    size: integer("size").notNull().default(0), // byte length, computed on write

    // Directory metadata
    viewType: text("view_type", { enum: CortexViewTypeDB }),
    icon: text("icon"), // IconKey, nullable

    // Structured data extracted from markdown frontmatter on write
    frontmatter: jsonb("frontmatter")
      .$type<Record<string, string | number | boolean | null>>()
      .default({})
      .notNull(),
    tags: jsonb("tags").$type<string[]>().default([]).notNull(),

    sortOrder: integer("sort_order").default(0).notNull(),

    // Embedding for semantic search (pgvector)
    embedding: vector3072("embedding"),

    // SHA-256 hash of text-to-embed (path + content) — skip redundant API calls
    contentHash: text("content_hash"),

    // Sync
    syncPolicy: text("sync_policy", { enum: CortexSyncPolicyDB }), // null = inherit from parent
    syncId: uuid("sync_id").defaultRandom(), // stable UUID for cross-instance dedup

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Critical: one path per user
    userPathUnique: uniqueIndex("cortex_nodes_user_path_idx").on(
      table.userId,
      table.path,
    ),
    // Fast user-scoped queries
    userIdIdx: index("cortex_nodes_user_id_idx").on(table.userId),
    // GIN for frontmatter JSONB queries (e.g. filter tasks by status)
    frontmatterIdx: index("cortex_nodes_frontmatter_idx").using(
      "gin",
      table.frontmatter,
    ),
    // Full-text search on content + path
    contentSearchIdx: index("cortex_nodes_content_search_idx").using(
      "gin",
      sql`to_tsvector('english', COALESCE(${table.content}, '') || ' ' || ${table.path})`,
    ),
  }),
);

/**
 * Relations
 */
export const cortexNodesRelations = relations(cortexNodes, ({ one }) => ({
  user: one(users, {
    fields: [cortexNodes.userId],
    references: [users.id],
  }),
}));

/**
 * Schema for selecting Cortex nodes
 */
export const selectCortexNodeSchema = createSelectSchema(cortexNodes);

/**
 * Schema for inserting Cortex nodes
 */
export const insertCortexNodeSchema = createInsertSchema(cortexNodes);

/**
 * Type for Cortex node model
 */
export type CortexNode = z.infer<typeof selectCortexNodeSchema>;

/**
 * Type for new Cortex node model
 */
export type NewCortexNode = z.infer<typeof insertCortexNodeSchema>;
