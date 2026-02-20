/**
 * SSH Connections Database Schema
 * Only SSH mode connections are persisted. Local mode uses the current process user.
 * Sessions are in-memory only (see repository.ts).
 */

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

import { SshAuthTypeDB } from "./enum";

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
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSshConnectionSchema = createInsertSchema(sshConnections);
export const selectSshConnectionSchema = createSelectSchema(sshConnections);

export type SshConnection = z.infer<typeof selectSshConnectionSchema>;
export type NewSshConnection = z.infer<typeof insertSshConnectionSchema>;
