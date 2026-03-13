/**
 * IMAP Client Database Schema
 * Database schema for IMAP folder management.
 *
 * imap_accounts table has been removed. All IMAP account data lives in messenger_accounts.
 * Use toImapShape() to convert a MessengerAccount row to the ImapAccountShape expected by IMAP services.
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";

import { messengerAccounts } from "../../../accounts/db";
import type { ImapAuthMethodValue, ImapSyncStatusValue } from "./enum";
import {
  ImapAuthMethod,
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
 * ImapAccountShape — normalized view of a MessengerAccount's IMAP fields.
 * Used everywhere the old ImapAccount type was used in IMAP services.
 */
export interface ImapAccountShape {
  id: string;
  name: string;
  email: string; // smtpFromEmail used as email identity
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  authMethod: typeof ImapAuthMethodValue;
  connectionTimeout: number;
  keepAlive: boolean;
  enabled: boolean;
  syncInterval: number;
  maxMessages: number;
  syncFolders: string[];
  lastSyncAt: Date | null;
  syncStatus: typeof ImapSyncStatusValue;
  syncError: string | null;
  isConnected: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Map a MessengerAccount row to ImapAccountShape for use in IMAP services.
 */
export function toImapShape(
  account: typeof messengerAccounts.$inferSelect,
): ImapAccountShape {
  return {
    id: account.id,
    name: account.name,
    email: account.smtpFromEmail ?? account.imapUsername ?? "",
    host: account.imapHost ?? "",
    port: account.imapPort ?? 993,
    secure: account.imapSecure ?? true,
    username: account.imapUsername ?? "",
    password: account.imapPassword ?? "",
    authMethod: account.imapAuthMethod ?? ImapAuthMethod.PLAIN,
    connectionTimeout: account.imapConnectionTimeout ?? 30000,
    keepAlive: account.imapKeepAlive ?? true,
    enabled: account.imapSyncEnabled ?? false,
    syncInterval: account.imapSyncInterval ?? 60,
    maxMessages: account.imapMaxMessages ?? 1000,
    syncFolders: account.imapSyncFolders ?? ["INBOX"],
    lastSyncAt: account.imapLastSyncAt,
    syncStatus: ImapSyncStatus.PENDING, // messenger_accounts doesn't track IMAP sync status separately
    syncError: account.imapSyncError,
    isConnected: account.imapIsConnected ?? false,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}

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

    // Account association — references messenger_accounts (unified table)
    accountId: uuid("account_id")
      .notNull()
      .references(() => messengerAccounts.id, { onDelete: "cascade" }),

    // Sync tracking
    lastSyncAt: timestamp("last_sync_at"),
    syncStatus: text("sync_status", { enum: ImapSyncStatusDB }).default(
      ImapSyncStatus.PENDING,
    ),
    syncError: json("sync_error").$type<ErrorResponseType | null>(),

    // Audit fields
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    accountIdIdx: index("imap_folders_account_id_idx").on(table.accountId),
    pathIdx: index("imap_folders_path_idx").on(table.path),
    nameIdx: index("imap_folders_name_idx").on(table.name),
    specialUseIdx: index("imap_folders_special_use_idx").on(
      table.specialUseType,
    ),
    lastSyncIdx: index("imap_folders_last_sync_idx").on(table.lastSyncAt),
  }),
);

/**
 * IMAP Folders Relations — accountId now references messenger_accounts
 */
export const imapFoldersRelations = relations(imapFolders, ({ one }) => ({
  account: one(messengerAccounts, {
    fields: [imapFolders.accountId],
    references: [messengerAccounts.id],
  }),
}));

/**
 * Zod Schemas
 */
export const selectImapFolderSchema = createSelectSchema(imapFolders);
export const insertImapFolderSchema = createInsertSchema(imapFolders);

/**
 * Type Exports
 */
export type ImapFolder = typeof imapFolders.$inferSelect;
export type NewImapFolder = typeof imapFolders.$inferInsert;
