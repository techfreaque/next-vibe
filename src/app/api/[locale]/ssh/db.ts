/**
 * SSH Connections Database Schema
 * Only SSH mode connections are persisted. Local mode uses the current process user.
 * Sessions are in-memory only (see repository.ts).
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "@/app/api/[locale]/user/db";

import { ClusterRole, ClusterRoleDB, SshAuthTypeDB } from "./enum";

/**
 * SSH Connections Table
 * Stores saved SSH connection configs (encrypted credentials).
 */
export const sshConnections = pgTable("ssh_connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  host: text("host").notNull(),
  port: integer("port").notNull().default(22),
  username: text("username").notNull(),
  authType: text("auth_type", { enum: SshAuthTypeDB }).notNull(),
  // AES-256-GCM encrypted: "iv:authTag:ciphertext" all hex-encoded
  encryptedSecret: text("encrypted_secret").notNull(),
  // Optional encrypted passphrase for private key
  encryptedPassphrase: text("encrypted_passphrase"),
  // Stored on first successful connect, checked on every reconnect
  fingerprint: text("fingerprint"),
  isDefault: boolean("is_default").notNull().default(false),
  // Cluster role for k8s provisioning via infra module
  clusterRole: text("cluster_role", { enum: ClusterRoleDB })
    .notNull()
    .default(ClusterRole.NONE),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sshConnectionsRelations = relations(
  sshConnections,
  ({ many }) => ({
    mounts: many(sshConnectionMounts),
  }),
);

export const insertSshConnectionSchema = createInsertSchema(sshConnections);
export const selectSshConnectionSchema = createSelectSchema(sshConnections);

export type SshConnection = z.infer<typeof selectSshConnectionSchema>;
export type NewSshConnection = z.infer<typeof insertSshConnectionSchema>;

/**
 * SSH Connection Mounts Table
 * Directory bookmarks per connection. Each path is unique per user+connection.
 * Cortex segment = path basename: /ssh/<slug>/<basename>/
 * Terminal still has full machine access; mounts are bookmarks only.
 */
export const sshConnectionMounts = pgTable("ssh_connection_mounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  connectionId: uuid("connection_id")
    .notNull()
    .references(() => sshConnections.id, { onDelete: "cascade" }),
  // Human-readable name, defaults to path basename. Shown in cortex as /ssh/<slug>/<name>/
  name: text("name").notNull(),
  // Absolute path on the machine, e.g. /home/max/project. Unique per user+connection.
  // Cortex segment derived: path.split('/').filter(Boolean).at(-1)
  path: text("path").notNull(),
  // Whether this is the default mount (one per connection; sets initial CWD for new terminals)
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sshConnectionMountsRelations = relations(
  sshConnectionMounts,
  ({ one }) => ({
    connection: one(sshConnections, {
      fields: [sshConnectionMounts.connectionId],
      references: [sshConnections.id],
    }),
    user: one(users, {
      fields: [sshConnectionMounts.userId],
      references: [users.id],
    }),
  }),
);

export const insertSshConnectionMountSchema =
  createInsertSchema(sshConnectionMounts);
export const selectSshConnectionMountSchema =
  createSelectSchema(sshConnectionMounts);

export type SshConnectionMount = z.infer<typeof selectSshConnectionMountSchema>;
export type NewSshConnectionMount = z.infer<
  typeof insertSshConnectionMountSchema
>;
