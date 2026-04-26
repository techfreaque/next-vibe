/**
 * Remote Connection Database Schema
 *
 * Two tables:
 * - `instance_identities` - per-user self-identity records (who am I?)
 * - `remote_connections`  - actual outbound connections with tokens (who do I talk to?)
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
import { z } from "zod";

import { WidgetDataSchema } from "@/app/api/[locale]/system/unified-interface/shared/types/json";

import { users } from "@/app/api/[locale]/user/db";

/**
 * Zod schema for a serialized tool manifest entry - one per tool on the remote instance.
 * Stored in the capabilities jsonb column.
 *
 * `fields` is the serialized definition fields (render refs stripped, all translatable
 * strings pre-resolved for the target locale).
 * `instanceId` is tagged by the receiving side at sync time - not set by the generator.
 */
export const RemoteToolCapabilitySchema = z.object({
  toolName: z.string(),
  title: z.string(),
  description: z.string(),
  fields: WidgetDataSchema,
  executionMode: z.literal("via-execute-route"),
  isAsync: z.literal(true),
  instanceId: z.string(),
  /** Pre-translated category label (e.g. "Chat", "System") */
  category: z.string().optional(),
  /** Pre-translated tag labels */
  tags: z.array(z.string()).optional(),
  /** Tool aliases (e.g. ["web-search"]) - first alias is preferred name */
  aliases: z.array(z.string()).optional(),
  /** Credit cost per invocation (0 = free). Defaults to 0 when absent. */
  credits: z.number().optional(),
});

/** Inferred type from schema - single source of truth */
export type RemoteToolCapability = z.infer<typeof RemoteToolCapabilitySchema>;

// ─── Shared Types ─────────────────────────────────────────────────────────────

export const ConnectionHealthSchema = z.enum([
  "healthy",
  "warning",
  "critical",
  "disconnected",
]);
export type ConnectionHealth = z.infer<typeof ConnectionHealthSchema>;

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
// No more token="self" rows - those live in instance_identities.

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
    token: text("token").notNull(),

    // Lead cookie ID preserved across token refreshes
    leadId: text("lead_id").notNull(),

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

    // Tool manifest snapshot - updated on capability version change
    capabilities: jsonb("capabilities").$type<RemoteToolCapability[]>(),

    // Build version string from remote (git SHA / package version)
    capabilitiesVersion: text("capabilities_version"),

    // Unified sync hashes - JSONB { memories: "sha256...", documents: "sha256...", skills: "sha256..." }
    syncHashes: jsonb("sync_hashes").$type<Record<string, string>>(),

    // Last sync hashes received from the remote side
    remoteSyncHashes:
      jsonb("remote_sync_hashes").$type<Record<string, string>>(),

    // ISO timestamp - return REMOTE_TOOL_CALL tasks after this cursor
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
