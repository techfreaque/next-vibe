/**
 * Remote Connection Database Schema
 *
 * Two tables:
 * - `instance_identities` — per-user self-identity records (who am I?)
 * - `remote_connections`  — actual outbound connections with tokens (who do I talk to?)
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
  /** Pre-translated category label (e.g. "Chat", "System") */
  category?: string;
  /** Pre-translated tag labels */
  tags?: string[];
  /** Tool aliases (e.g. ["web-search"]) — first alias is preferred name */
  aliases?: string[];
  /** Credit cost per invocation (0 = free). Defaults to 0 when absent. */
  credits?: number;
}

// ─── Shared Types ─────────────────────────────────────────────────────────────

export type ConnectionHealth =
  | "healthy"
  | "warning"
  | "critical"
  | "disconnected";

// ─── Instance Identities ──────────────────────────────────────────────────────
// Per-user self-identity records. Replaces the old token="self" pattern.
// Each user can have their own instance identities (e.g. "hermes", "thea").

export const instanceIdentities = pgTable(
  "instance_identities",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Owner
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Canonical identifier for this instance (e.g. "hermes", "thea")
    instanceId: text("instance_id").notNull(),

    // Whether this is the default identity for this user
    isDefault: boolean("is_default").notNull().default(false),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    unique("instance_identities_user_instance_unique").on(
      t.userId,
      t.instanceId,
    ),
  ],
);

export const instanceIdentitiesRelations = relations(
  instanceIdentities,
  ({ one }) => ({
    user: one(users, {
      fields: [instanceIdentities.userId],
      references: [users.id],
    }),
  }),
);

export const selectInstanceIdentitySchema =
  createSelectSchema(instanceIdentities);
export const insertInstanceIdentitySchema =
  createInsertSchema(instanceIdentities);
export type InstanceIdentity = z.infer<typeof selectInstanceIdentitySchema>;
export type NewInstanceIdentity = z.infer<typeof insertInstanceIdentitySchema>;

// ─── Remote Connections ───────────────────────────────────────────────────────
// Actual outbound connections with encrypted JWT tokens.
// No more token="self" rows — those live in instance_identities.

export const remoteConnections = pgTable(
  "remote_connections",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Owner
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Local label for the remote (e.g. "thea" when hermes connects to thea)
    instanceId: text("instance_id").notNull(),

    // Remote instance URL (e.g. "https://unbottled.ai")
    remoteUrl: text("remote_url").notNull(),

    // JWT token from remote login (encrypted with AES-256-GCM)
    token: text("token"),

    // Lead cookie ID preserved across token refreshes
    leadId: text("lead_id"),

    // URL of the local instance (cloud-side records: so cloud knows where local lives)
    localUrl: text("local_url"),

    // The instanceId the remote uses to identify itself (from register endpoint)
    remoteInstanceId: text("remote_instance_id"),

    // Whether the local instance is directly reachable via HTTP (not behind NAT).
    // Set at connect time by pinging localUrl; re-checked on each sync.
    // true  → prefer direct HTTP for remote tool calls (fast path).
    // false → fall back to task-queue pull (~1 min latency).
    isDirectlyAccessible: boolean("is_directly_accessible")
      .notNull()
      .default(false),

    // Whether this connection is active
    isActive: boolean("is_active").notNull().default(true),

    // Whether this is the default connection for --remote (one per user)
    isDefault: boolean("is_default").notNull().default(false),

    // Last time a sync was triggered
    lastSyncedAt: timestamp("last_synced_at"),

    // Tool manifest snapshot — updated on capability version change
    capabilities: jsonb("capabilities").$type<RemoteToolCapability[]>(),

    // Build version string from remote (git SHA / package version)
    capabilitiesVersion: text("capabilities_version"),

    // SHA256 of sorted "id:updatedAt" pairs for shared memories
    memoriesHash: text("memories_hash"),

    // Last memoriesHash received from the remote side
    remoteMemoriesHash: text("remote_memories_hash"),

    // ISO timestamp — return REMOTE_TOOL_CALL tasks after this cursor
    taskCursor: text("task_cursor"),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    unique("remote_connections_user_instance_unique").on(
      t.userId,
      t.instanceId,
    ),
  ],
);

export const remoteConnectionsRelations = relations(
  remoteConnections,
  ({ one }) => ({
    user: one(users, {
      fields: [remoteConnections.userId],
      references: [users.id],
    }),
  }),
);

export const selectRemoteConnectionSchema =
  createSelectSchema(remoteConnections);
export const insertRemoteConnectionSchema =
  createInsertSchema(remoteConnections);
export type RemoteConnection = z.infer<typeof selectRemoteConnectionSchema>;
export type NewRemoteConnection = z.infer<typeof insertRemoteConnectionSchema>;
