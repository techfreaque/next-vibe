/**
 * Messenger Messages Database Schema
 * Unified table for all channels: email, SMS, WhatsApp, Telegram.
 *
 * messenger_folders — inbox folders (IMAP or any channel that has folders)
 * messenger_messages — all sent/received messages across all channels
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

import { messengerAccounts } from "../accounts/db";
import { MessageChannel, MessageChannelDB } from "../accounts/enum";
import {
  MessageStatus,
  MessageStatusDB,
  MessageSyncStatus,
  MessageSyncStatusDB,
  MessageTypeDB,
  SpecialFolderTypeDB,
} from "./enum";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */

/**
 * Messenger Folders Table
 * Channel-agnostic inbox folders (IMAP, WhatsApp labels, Telegram chats, etc.)
 */
export const messengerFolders = pgTable(
  "messenger_folders",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Folder identification
    name: text("name").notNull(),
    displayName: text("display_name"),
    path: text("path").notNull(),
    delimiter: text("delimiter").default("/"),

    // Folder attributes
    isSelectable: boolean("is_selectable").default(true),
    hasChildren: boolean("has_children").default(false),
    specialUseType: text("special_use_type", { enum: SpecialFolderTypeDB }),

    // Sync metadata (IMAP UIDVALIDITY / UIDNEXT)
    uidValidity: integer("uid_validity"),
    uidNext: integer("uid_next"),
    messageCount: integer("message_count").default(0),
    unseenCount: integer("unseen_count").default(0),

    // Account association
    accountId: uuid("account_id")
      .notNull()
      .references(() => messengerAccounts.id, { onDelete: "cascade" }),

    // Sync tracking
    lastSyncAt: timestamp("last_sync_at"),
    syncStatus: text("sync_status", { enum: MessageSyncStatusDB }).default(
      MessageSyncStatus.PENDING,
    ),
    syncError: json("sync_error"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    accountIdIdx: index("messenger_folders_account_id_idx").on(table.accountId),
    pathIdx: index("messenger_folders_path_idx").on(table.path),
    specialUseIdx: index("messenger_folders_special_use_idx").on(
      table.specialUseType,
    ),
  }),
);

/**
 * Messenger Messages Table
 * Unified table for all messages across all channels.
 */
export const emails = pgTable(
  "emails",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Content
    subject: text("subject").notNull(),
    recipientEmail: text("recipient_email").notNull(),
    recipientName: text("recipient_name"),
    senderEmail: text("sender_email").notNull(),
    senderName: text("sender_name"),

    // Classification
    type: text("type", { enum: MessageTypeDB }).notNull(),
    templateName: text("template_name"),
    templateId: text("template_id"),
    templateVersion: text("template_version"),
    propsSnapshot:
      json("props_snapshot").$type<Record<string, string | number | boolean>>(),
    locale: text("locale"),

    // Status
    status: text("status", { enum: MessageStatusDB })
      .notNull()
      .default(MessageStatus.PENDING),

    // Engagement tracking
    sentAt: timestamp("sent_at"),
    deliveredAt: timestamp("delivered_at"),
    openedAt: timestamp("opened_at"),
    clickedAt: timestamp("clicked_at"),
    bouncedAt: timestamp("bounced_at"),
    unsubscribedAt: timestamp("unsubscribed_at"),

    error: text("error"),
    retryCount: text("retry_count").default("0"),
    processingTimeMs: integer("processing_time_ms"),
    deliveryTimeMs: integer("delivery_time_ms"),

    // Relations
    userId: uuid("user_id"),
    leadId: uuid("lead_id"),

    // Channel — single discriminator
    channel: text("channel", { enum: MessageChannelDB })
      .notNull()
      .default(MessageChannel.EMAIL),

    // Unified account reference (replaces smtpAccountId / imapAccountId / messagingAccountId)
    accountId: uuid("account_id"),

    // Phone fields (SMS, WhatsApp, Telegram)
    fromPhone: text("from_phone"),
    toPhone: text("to_phone"),

    // Inbox/IMAP fields (channel-agnostic naming)
    uid: integer("uid"),
    messageId: text("message_id"),
    folderId: uuid("folder_id"),

    // Body (for inbox sync)
    bodyText: text("body_text"),
    bodyHtml: text("body_html"),
    headers: json("headers").$type<Record<string, string>>().default({}),

    // Flags
    isRead: boolean("is_read").default(false),
    isFlagged: boolean("is_flagged").default(false),
    isDeleted: boolean("is_deleted").default(false),
    isDraft: boolean("is_draft").default(false),
    isAnswered: boolean("is_answered").default(false),

    // Threading
    inReplyTo: text("in_reply_to"),
    references: text("references"),
    threadId: text("thread_id"),

    // Size and attachments
    messageSize: integer("message_size"),
    hasAttachments: boolean("has_attachments").default(false),
    attachmentCount: integer("attachment_count").default(0),

    // Sync metadata
    lastSyncAt: timestamp("last_sync_at"),
    syncStatus: text("sync_status", { enum: MessageSyncStatusDB }).default(
      MessageSyncStatus.PENDING,
    ),
    syncError: text("sync_error"),

    metadata: json("metadata")
      .$type<Record<string, string | number | boolean | null | undefined>>()
      .default({}),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    recipientEmailIdx: index("emails_recipient_email_idx").on(
      table.recipientEmail,
    ),
    statusIdx: index("emails_status_idx").on(table.status),
    typeIdx: index("emails_type_idx").on(table.type),
    sentAtIdx: index("emails_sent_at_idx").on(table.sentAt),
    templateIdIdx: index("emails_template_id_idx").on(table.templateId),
    localeIdx: index("emails_locale_idx").on(table.locale),
    userIdIdx: index("emails_user_id_idx").on(table.userId),
    leadIdIdx: index("emails_lead_id_idx").on(table.leadId),
    createdAtIdx: index("emails_created_at_idx").on(table.createdAt),
    uidIdx: index("emails_uid_idx").on(table.uid),
    messageIdIdx: index("emails_message_id_idx").on(table.messageId),
    folderIdIdx: index("emails_folder_id_idx").on(table.folderId),
    accountIdIdx: index("emails_account_id_idx").on(table.accountId),
    channelIdx: index("emails_channel_idx").on(table.channel),
    toPhoneIdx: index("emails_to_phone_idx").on(table.toPhone),
    isReadIdx: index("emails_is_read_idx").on(table.isRead),
    isFlaggedIdx: index("emails_is_flagged_idx").on(table.isFlagged),
    threadIdIdx: index("emails_thread_id_idx").on(table.threadId),
    lastSyncAtIdx: index("emails_last_sync_at_idx").on(table.lastSyncAt),
  }),
);

export const messengerFoldersRelations = relations(
  messengerFolders,
  ({ one }) => ({
    account: one(messengerAccounts, {
      fields: [messengerFolders.accountId],
      references: [messengerAccounts.id],
    }),
  }),
);

export const emailsRelations = relations(emails, ({ one }) => ({
  folder: one(messengerFolders, {
    fields: [emails.folderId],
    references: [messengerFolders.id],
  }),
  account: one(messengerAccounts, {
    fields: [emails.accountId],
    references: [messengerAccounts.id],
  }),
}));

export const insertEmailSchema = createInsertSchema(emails);
export const selectEmailSchema = createSelectSchema(emails);
export const selectMessengerFolderSchema = createSelectSchema(messengerFolders);
export const insertMessengerFolderSchema = createInsertSchema(messengerFolders);

export type Email = typeof emails.$inferSelect;
export type NewEmail = typeof emails.$inferInsert;
export type MessengerFolder = typeof messengerFolders.$inferSelect;
export type NewMessengerFolder = typeof messengerFolders.$inferInsert;
