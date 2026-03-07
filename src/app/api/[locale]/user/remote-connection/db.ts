/**
 * User Remote Connection Database Schema
 * Stores per-user remote instance connection config (URL + JWT token)
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "@/app/api/[locale]/user/db";

/** Recursive JSON-serializable value — used for opaque jsonb blobs */
type JsonPrimitive = string | number | boolean | null;
export interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];
type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * Serialized tool manifest entry — one per tool on the remote instance.
 * Stored in the capabilities jsonb column.
 */
export interface RemoteToolCapability {
  toolName: string;
  title: string;
  description: string;
  /**
   * Serialized definition fields (render refs stripped, all translatable strings
   * pre-resolved for the target locale). inputSchema is derivable from fields
   * via generateSchemaForUsage — not stored separately.
   */
  fields: JsonObject;
  executionMode: "via-execute-route";
  isAsync: true;
  /** Tagged by the receiving side at sync time — not set by the generator */
  instanceId: string;
}

/**
 * User Remote Connection Table
 * One record per user+instance — supports multiple remote instances per user.
 * Token is stored as-is (caller responsible for secure transport).
 */
export const userRemoteConnections = pgTable(
  "user_remote_connections",
  {
    // Primary key
    id: uuid("id").primaryKey().defaultRandom(),

    // Owner
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // User-chosen identifier for this instance (e.g. "hermes", "raspi")
    instanceId: text("instance_id").notNull().default("hermes"),

    // User-chosen friendly display name (e.g. "My Work Laptop")
    friendlyName: text("friendly_name").notNull().default("hermes"),

    // Remote instance URL (e.g. "https://unbottled.ai")
    remoteUrl: text("remote_url").notNull(),

    // JWT token from remote login (null on cloud-side records — cloud never calls local)
    token: text("token"),

    // Lead cookie ID preserved across token refreshes (local-side only)
    leadId: text("lead_id"),

    // URL of the local instance (cloud-side records only — so cloud knows where local lives)
    localUrl: text("local_url"),

    // Whether this connection is active
    isActive: boolean("is_active").notNull().default(true),

    // Last time a sync was triggered
    lastSyncedAt: timestamp("last_synced_at"),

    // Tool manifest snapshot from local instance — updated on capability version change
    capabilities: jsonb("capabilities").$type<RemoteToolCapability[]>(),

    // Build version string from local instance (git SHA / package version)
    // Changes only on deploy — used to skip unchanged capability snapshots
    capabilitiesVersion: text("capabilities_version"),

    // SHA256 of sorted "id:updatedAt" pairs for all shared memories on this side
    // Stored so the sync handler can diff without a full table scan
    memoriesHash: text("memories_hash"),

    // Last memoriesHash received from the remote side — for diffing their state
    remoteMemoriesHash: text("remote_memories_hash"),

    // ISO timestamp — return REMOTE_TOOL_CALL tasks created after this cursor on next sync
    taskCursor: text("task_cursor"),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    unique("user_remote_connections_user_instance_unique").on(
      t.userId,
      t.instanceId,
    ),
  ],
);

/**
 * Relations
 */
export const userRemoteConnectionsRelations = relations(
  userRemoteConnections,
  ({ one }) => ({
    user: one(users, {
      fields: [userRemoteConnections.userId],
      references: [users.id],
    }),
  }),
);

/**
 * Schema for selecting remote connections
 */
export const selectUserRemoteConnectionSchema = createSelectSchema(
  userRemoteConnections,
);

/**
 * Schema for inserting remote connections
 */
export const insertUserRemoteConnectionSchema = createInsertSchema(
  userRemoteConnections,
);

/**
 * Type for remote connection model
 */
export type UserRemoteConnection = z.infer<
  typeof selectUserRemoteConnectionSchema
>;

/**
 * Type for new remote connection model
 */
export type NewUserRemoteConnection = z.infer<
  typeof insertUserRemoteConnectionSchema
>;
