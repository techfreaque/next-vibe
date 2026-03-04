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
  /** JSON Schema draft-7 for the tool's input */
  inputSchema: JsonObject;
  /** Serialized definition fields (render refs stripped by JSON.stringify) */
  fields: JsonObject;
  executionMode: "via-execute-route";
  isAsync: true;
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

    // JWT token from remote login
    token: text("token").notNull(),

    // Lead cookie ID preserved across token refreshes
    leadId: text("lead_id"),

    // Whether this connection is active
    isActive: boolean("is_active").notNull().default(true),

    // Last time a sync was triggered
    lastSyncedAt: timestamp("last_synced_at"),

    // Tool manifest snapshot from local instance — updated on each pulse
    capabilities: jsonb("capabilities").$type<RemoteToolCapability[]>(),

    // SHA256 of capabilities JSON — used to skip unchanged snapshots
    capabilitiesHash: text("capabilities_hash"),

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
