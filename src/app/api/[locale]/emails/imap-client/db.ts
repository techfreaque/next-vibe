/**
 * IMAP Client Database Schema
 * Database schema for IMAP account configurations and folder management
 */

import { relations } from "drizzle-orm";
import { boolean, index, integer, json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";

import {
  ImapAuthMethod,
  ImapAuthMethodDB,
  ImapSpecialUseTypeDB,
  ImapSyncStatus,
  ImapSyncStatusDB,
} from "./enum";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */

/**
 * IMAP Accounts Table
 * Stores IMAP account configurations
 */
export const imapAccounts = pgTable(
  "imap_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Account identification
    name: text("name").notNull(), // User-friendly name
    email: text("email").notNull().unique(),

    // IMAP connection settings
    host: text("host").notNull(),
    port: integer("port").notNull().default(993),
    secure: boolean("secure").default(true), // Use TLS/SSL

    // Authentication
    username: text("username").notNull(),
    password: text("password").notNull(), // Should be encrypted in production
    authMethod: text("auth_method", { enum: ImapAuthMethodDB }).default(ImapAuthMethod.PLAIN),

    // Connection settings
    connectionTimeout: integer("connection_timeout").default(30000),
    keepAlive: boolean("keep_alive").default(true),

    // Sync configuration
    enabled: boolean("enabled").default(true),
    syncInterval: integer("sync_interval").default(60), // seconds
    maxMessages: integer("max_messages").default(1000), // per folder
    syncFolders: json("sync_folders").$type<string[]>().default([]), // folders to sync

    // User association (cross-repository reference handled at application layer)
    userId: uuid("user_id"),

    // Status tracking
    lastSyncAt: timestamp("last_sync_at"),
    syncStatus: text("sync_status", { enum: ImapSyncStatusDB }).default(ImapSyncStatus.PENDING),
    syncError: text("sync_error"),
    isConnected: boolean("is_connected").default(false),

    // Audit fields
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("imap_accounts_email_idx").on(table.email),
    userIdIdx: index("imap_accounts_user_id_idx").on(table.userId),
    enabledIdx: index("imap_accounts_enabled_idx").on(table.enabled),
    lastSyncIdx: index("imap_accounts_last_sync_idx").on(table.lastSyncAt),
  }),
);

/**
 * IMAP Folders Table
 * Stores IMAP folder information for each email account
 */
export const imapFolders = pgTable(
  "imap_folders",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Folder identification
    name: text("name").notNull(), // e.g., "INBOX", "Sent", "Drafts"
    displayName: text("display_name"), // Human-readable name
    path: text("path").notNull(), // Full IMAP path
    delimiter: text("delimiter").default("/"), // Folder delimiter

    // Folder attributes
    isSelectable: boolean("is_selectable").default(true),
    hasChildren: boolean("has_children").default(false),
    isSpecialUse: boolean("is_special_use").default(false), // INBOX, Sent, etc.
    specialUseType: text("special_use_type", { enum: ImapSpecialUseTypeDB }),

    // IMAP sync metadata
    uidValidity: integer("uid_validity"), // IMAP UIDVALIDITY
    uidNext: integer("uid_next"), // IMAP UIDNEXT
    messageCount: integer("message_count").default(0),
    recentCount: integer("recent_count").default(0),
    unseenCount: integer("unseen_count").default(0),

    // Account association
    accountId: uuid("account_id")
      .notNull()
      .references(() => imapAccounts.id, { onDelete: "cascade" }),

    // Sync tracking
    lastSyncAt: timestamp("last_sync_at"),
    syncStatus: text("sync_status", { enum: ImapSyncStatusDB }).default(ImapSyncStatus.PENDING),
    syncError: json("sync_error").$type<ErrorResponseType | null>(),

    // Audit fields
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    accountIdIdx: index("imap_folders_account_id_idx").on(table.accountId),
    pathIdx: index("imap_folders_path_idx").on(table.path),
    nameIdx: index("imap_folders_name_idx").on(table.name),
    specialUseIdx: index("imap_folders_special_use_idx").on(table.specialUseType),
    lastSyncIdx: index("imap_folders_last_sync_idx").on(table.lastSyncAt),
  }),
);

/**
 * IMAP Accounts Relations
 * Cross-repository relations are handled at the application layer
 */
export const imapAccountsRelations = relations(imapAccounts, ({ many }) => ({
  folders: many(imapFolders),
}));

/**
 * IMAP Folders Relations
 */
export const imapFoldersRelations = relations(imapFolders, ({ one }) => ({
  account: one(imapAccounts, {
    fields: [imapFolders.accountId],
    references: [imapAccounts.id],
  }),
}));

/**
 * Zod Schemas
 */
export const selectImapAccountSchema = createSelectSchema(imapAccounts);
export const insertImapAccountSchema = createInsertSchema(imapAccounts);
export const selectImapFolderSchema = createSelectSchema(imapFolders);
export const insertImapFolderSchema = createInsertSchema(imapFolders);

/**
 * Type Exports
 */
export type ImapAccount = typeof imapAccounts.$inferSelect;
export type NewImapAccount = typeof imapAccounts.$inferInsert;
export type ImapFolder = typeof imapFolders.$inferSelect;
export type NewImapFolder = typeof imapFolders.$inferInsert;
