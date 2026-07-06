/**
 * Remote Connection Database Schema
 *
 * Two tables:
 * - `instance_identities` - per-user self-identity records (who am I?)
 * - `remote_connections`  - actual outbound connections with tokens (who do I talk to?)
 */

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { WidgetData } from "next-vibe/core/utils/json";
import { users } from "next-vibe/identity/user/db";
import { z } from "zod";

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
  titleShort: z.string().optional(),
  description: z.string(),
  // The field tree is consumed as an opaque JSON value (schema generation,
  // gate lookups). JSON.parse already guarantees JSON shape — deep zod
  // traversal of multi-megabyte snapshots is skipped.
  fields: z.custom<WidgetData>((v) => v !== undefined),
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

/**
 * How this instance communicates with the remote.
 *
 * reverse-ws   — local opens persistent outbound WS to remote; all traffic flows
 *                over it (tool dispatch, tool results, stream events, sync).
 * direct-http  — both instances publicly reachable; per-request HTTP, no persistent
 *                socket. Short-lived WS per streaming session.
 */
export const TransportModeSchema = z.enum(["reverse-ws", "direct-http"]);
export type TransportMode = z.infer<typeof TransportModeSchema>;

/** Thread mirroring policy — see remoteConnections.threadMirrorMode. */
export const ThreadMirrorModeSchema = z.enum(["both", "off"]);
export type ThreadMirrorMode = z.infer<typeof ThreadMirrorModeSchema>;
export type TransportModeValue = TransportMode;

/** Which data providers are synced over this connection. */
/**
 * The complete set of cross-instance sync domains. Each has a syncScope toggle on
 * the connection and a SyncProvider. An event's `syncDomain` must be one of these
 * — a non-existent domain (one without settings) is a compile error.
 */
export const SYNC_DOMAINS = [
  "memories",
  "documents",
  "skills",
  "favorites",
  "threads",
] as const;

export type SyncDomain = (typeof SYNC_DOMAINS)[number];

export const SyncScopeSchema = z
  .object({
    memories: z.boolean().default(false),
    documents: z.boolean().default(false),
    skills: z.boolean().default(false),
    favorites: z.boolean().default(false),
    threads: z.boolean().default(false),
  })
  .catchall(z.boolean());
export type SyncScope = z.infer<typeof SyncScopeSchema>;

export const DEFAULT_SYNC_SCOPE: SyncScope = {
  memories: false,
  documents: false,
  skills: false,
  favorites: false,
  threads: false,
};

/**
 * Per-domain sync cursors. Each domain stores its own cursor type.
 *
 * Standard domains (memories, documents, skills, favorites):
 *   { updatedAt: string }  — ISO timestamp, max across rows
 *
 * Threads domain:
 *   { threadsCursor: string, messageCursors: Record<threadId, string> }
 */
export const StandardSyncCursorSchema = z.object({
  updatedAt: z.string(),
});
export type StandardSyncCursor = z.infer<typeof StandardSyncCursorSchema>;

export const ThreadsSyncCursorSchema = z.object({
  threadsCursor: z.string(),
  messageCursors: z.record(z.string(), z.string()),
});
export type ThreadsSyncCursor = z.infer<typeof ThreadsSyncCursorSchema>;

export type SyncCursor = StandardSyncCursor | ThreadsSyncCursor;

/**
 * Where tools and the system prompt come from for AI stream requests routed
 * to this connection.
 *
 * local  — local tool schemas + system prompt are sent to the remote provider
 *          in the stream initiation POST body (default).
 * remote — remote provider resolves its own tools and system prompt; nothing
 *          extra is sent.
 * both   — local schemas are sent; remote merges them with its own.
 */
/**
 * Where the AI inference loop runs for streams in this connection's folder.
 *
 * server — relay to remote; remote runs the AI loop (default).
 * client — run AI loop locally; routing rule match is still possible but relay is skipped.
 */
export const LoopLocationSchema = z.enum(["client", "server"]);
export type LoopLocation = z.infer<typeof LoopLocationSchema>;

export const ToolSourceSchema = z.enum(["local", "remote", "both"]);
export type ToolSource = z.infer<typeof ToolSourceSchema>;

// ─── Instance Identities ──────────────────────────────────────────────────────
// Per-user self-identity record. One row per user — their canonical instance name.

export const instanceIdentities = pgTable("instance_identities", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Owner — unique: exactly one identity per user
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),

  // Canonical identifier for this instance (e.g. "hermes", "thea")
  instanceId: text("instance_id").notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

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

    // The PEER-side userId (the same account has a different userId on each
    // instance's DB). Learned once on the connect/register handshake and stable
    // thereafter. Lets the reverse-ws connector subscribe to the peer's concrete
    // `user/{remoteUserId}` channel directly — the bridge transport is a regular
    // scope:"user" event, so it rides that channel like any other.
    remoteUserId: text("remote_user_id"),

    // ── Transport configuration ─────────────────────────────────────────────

    /**
     * How THIS side reaches the remote (our send leg).
     * Auto-detected on connect (ping → direct-http if reachable, else reverse-ws).
     */
    transportMode: text("transport_mode", {
      enum: ["reverse-ws", "direct-http"],
    })
      .notNull()
      .default("reverse-ws"),

    /**
     * How the REMOTE reaches THIS side (the peer's send leg — mirror of the
     * peer's own transportMode). Kept in sync with the peer on connect/edit.
     * Drives which side opens the reverse-ws connector: a side opens an outbound
     * connector (subscribing to the peer's hub) exactly when the peer reaches it
     * via reverse-ws, i.e. remoteTransportMode === "reverse-ws".
     */
    remoteTransportMode: text("remote_transport_mode", {
      enum: ["reverse-ws", "direct-http"],
    })
      .notNull()
      .default("direct-http"),

    /**
     * Which data providers sync over this connection.
     */
    syncScope: jsonb("sync_scope").$type<SyncScope>(),

    /**
     * Thread mirroring policy for this connection — OVERRIDES thread-domain
     * remote events and the relay's landing persistence:
     *   'both' (default) — threads mirror in both directions; relay landings
     *                      persist on the executor.
     *   'off'            — no thread events cross; relay landings stay
     *                      transient (no persisted executor copy).
     * Later also settable per thread folder.
     */
    threadMirrorMode: text("thread_mirror_mode", {
      enum: ["both", "off"],
    })
      .notNull()
      .default("both"),

    // ── Connection state ────────────────────────────────────────────────────

    // Whether this connection is active
    isActive: boolean("is_active").notNull().default(true),

    /**
     * System-created reverse entry — set by the register endpoint on the target instance.
     * Never shown in UI. Never opens an outbound WS.
     * Can make remote calls using the reverse token.
     */
    isReverseEntry: boolean("is_reverse_entry").notNull().default(false),

    /**
     * Whether this connection can be used for AI inference (ws-provider mode).
     * When true, AI streams can be relayed through this connection's reverse-WS
     * to let the remote instance run the LLM loop.
     * Any user can enable this on their own connection.
     */
    isInferenceProvider: boolean("is_inference_provider")
      .notNull()
      .default(false),

    /**
     * Admin-only: when true, ALL AI stream requests on this instance route through
     * this connection regardless of per-user routing rules or model cost.
     * At most one connection can have this true at a time (enforced in repository).
     * Read at request time — no restart needed to apply changes.
     */
    forceSystemProvider: boolean("force_system_provider")
      .notNull()
      .default(false),

    // Timestamp of the last successful WS connection (health indicator).
    // Updated by RemoteConnectionManager when a connection establishes.
    wsConnectedAt: timestamp("ws_connected_at"),

    // Last time a sync was triggered
    lastSyncedAt: timestamp("last_synced_at"),

    /**
     * ATTESTED transport of the most recent outbound dispatch over this
     * connection — written by the transport primitive that actually carried
     * the call (never by configuration). Tests and observers verify the leg
     * really used here.
     */
    lastTransportUsed: text("last_transport_used", {
      enum: ["reverse-ws", "direct-http"],
    }),
    lastTransportUsedAt: timestamp("last_transport_used_at"),

    // Tool manifest snapshot - updated on capability version change
    capabilities: jsonb("capabilities").$type<RemoteToolCapability[]>(),

    // Build version string from remote (git SHA / package version)
    capabilitiesVersion: text("capabilities_version"),
    /**
     * Version of OUR capability snapshot that the peer has confirmed storing.
     * Capabilities are sent only when this differs from the local generated
     * version — once per change, never per exchange.
     */
    sentCapabilitiesVersion: text("sent_capabilities_version"),

    // Per-domain sync cursors — advanced after each successful pull
    syncCursors: jsonb("sync_cursors").$type<Record<string, SyncCursor>>(),

    // Per-domain push cursors — high-water mark of OUR data already pushed to
    // this remote. Connect-time push sends only records newer than this, making
    // push-pull bidirectional in one round trip (sync/spec.md).
    pushCursors: jsonb("push_cursors").$type<Record<string, SyncCursor>>(),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    unique("remote_connections_user_instance_unique").on(
      t.userId,
      t.instanceId,
    ),
    // At most one inference provider across the entire instance
    uniqueIndex("remote_connections_one_inference_provider")
      .on(t.isInferenceProvider)
      .where(sql`${t.isInferenceProvider} = true`),
    // At most one forced system provider across the entire instance
    uniqueIndex("remote_connections_one_force_system_provider")
      .on(t.forceSystemProvider)
      .where(sql`${t.forceSystemProvider} = true`),
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
