/**
 * Emails Database Schema
 * Database schema for storing email metadata
 */

import { relations } from "drizzle-orm";
import { boolean, index, integer, json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { ImapLoggingLevel } from "../imap-client/config/enum";
import { imapAccounts, imapFolders } from "../imap-client/db";
import { ImapSyncStatus, ImapSyncStatusDB } from "../imap-client/enum";
import { smtpAccounts } from "../smtp-client/db";
import { EmailProvider, EmailStatus, EmailStatusDB, EmailTypeDB } from "./enum";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */

/**
 * Emails Table
 * Stores metadata for all emails sent through the system
 */
export const emails = pgTable(
  "emails",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Email content
    subject: text("subject").notNull(),
    recipientEmail: text("recipient_email").notNull(),
    recipientName: text("recipient_name"),
    senderEmail: text("sender_email").notNull(),
    senderName: text("sender_name"),

    // Email classification
    type: text("type", { enum: EmailTypeDB }).notNull(),
    templateName: text("template_name"),

    // Template versioning (for audit trail and compliance)
    templateId: text("template_id"), // Template ID (e.g., "leads-welcome")
    templateVersion: text("template_version"), // Semantic version (e.g., "1.2.3")
    propsSnapshot: json("props_snapshot").$type<Record<string, string | number | boolean>>(), // Props used to render
    locale: text("locale"), // Locale used for rendering (e.g., "en-US")

    // Status and tracking
    status: text("status", { enum: EmailStatusDB }).notNull().default(EmailStatus.PENDING),

    // Provider information
    emailProvider: text("email_provider").default(EmailProvider.SMTP),
    externalId: text("external_id"), // Provider's email ID

    // Engagement tracking
    sentAt: timestamp("sent_at"),
    deliveredAt: timestamp("delivered_at"),
    openedAt: timestamp("opened_at"),
    clickedAt: timestamp("clicked_at"),
    bouncedAt: timestamp("bounced_at"),
    unsubscribedAt: timestamp("unsubscribed_at"),

    // Error handling
    error: text("error"),
    retryCount: text("retry_count").default("0"),

    // Performance tracking for stats
    processingTimeMs: integer("processing_time_ms"), // Time to process email (ms)
    deliveryTimeMs: integer("delivery_time_ms"), // Time from sent to delivered (ms)

    // Relations
    userId: uuid("user_id"), // If sent to a user
    leadId: uuid("lead_id"), // If sent to a lead

    // SMTP-specific fields
    smtpAccountId: uuid("smtp_account_id"), // Reference to SMTP account used for sending

    // IMAP-specific fields
    imapUid: integer("imap_uid"), // IMAP UID
    imapMessageId: text("imap_message_id"), // Message-ID header
    imapFolderId: uuid("imap_folder_id"), // Reference to IMAP folder
    imapAccountId: uuid("imap_account_id"), // Reference to IMAP account

    // Email content (for IMAP sync)
    bodyText: text("body_text"), // Plain text body
    bodyHtml: text("body_html"), // HTML body
    headers: json("headers").$type<Record<string, string>>().default({}), // Email headers

    // Email flags and status
    isRead: boolean("is_read").default(false),
    isFlagged: boolean("is_flagged").default(false),
    isDeleted: boolean("is_deleted").default(false),
    isDraft: boolean("is_draft").default(false),
    isAnswered: boolean("is_answered").default(false),

    // Threading
    inReplyTo: text("in_reply_to"), // In-Reply-To header
    references: text("references"), // References header
    threadId: text("thread_id"), // Conversation thread ID

    // Size and attachments
    messageSize: integer("message_size"), // Size in bytes
    hasAttachments: boolean("has_attachments").default(false),
    attachmentCount: integer("attachment_count").default(0),

    // Sync metadata
    lastSyncAt: timestamp("last_sync_at"),
    syncStatus: text("sync_status", { enum: ImapSyncStatusDB }).default(ImapSyncStatus.PENDING),
    syncError: text("sync_error"),

    // Additional metadata
    metadata: json("metadata")
      .$type<Record<string, string | number | boolean | null | undefined>>()
      .default({}),

    // Audit fields
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    recipientEmailIdx: index("emails_recipient_email_idx").on(table.recipientEmail),
    statusIdx: index("emails_status_idx").on(table.status),
    typeIdx: index("emails_type_idx").on(table.type),
    sentAtIdx: index("emails_sent_at_idx").on(table.sentAt),
    templateIdIdx: index("emails_template_id_idx").on(table.templateId),
    templateVersionIdx: index("emails_template_version_idx").on(table.templateVersion),
    localeIdx: index("emails_locale_idx").on(table.locale),
    userIdIdx: index("emails_user_id_idx").on(table.userId),
    leadIdIdx: index("emails_lead_id_idx").on(table.leadId),
    createdAtIdx: index("emails_created_at_idx").on(table.createdAt),
    // IMAP-specific indexes
    imapUidIdx: index("emails_imap_uid_idx").on(table.imapUid),
    imapMessageIdIdx: index("emails_imap_message_id_idx").on(table.imapMessageId),
    imapFolderIdIdx: index("emails_imap_folder_id_idx").on(table.imapFolderId),
    smtpAccountIdIdx: index("emails_smtp_account_id_idx").on(table.smtpAccountId),
    imapAccountIdIdx: index("emails_imap_account_id_idx").on(table.imapAccountId),
    isReadIdx: index("emails_is_read_idx").on(table.isRead),
    isFlaggedIdx: index("emails_is_flagged_idx").on(table.isFlagged),
    threadIdIdx: index("emails_thread_id_idx").on(table.threadId),
    lastSyncAtIdx: index("emails_last_sync_at_idx").on(table.lastSyncAt),
  }),
);

/**
 * Email Relations
 * Cross-repository relations are handled at the application layer
 */
export const emailsRelations = relations(emails, ({ one }) => ({
  imapFolder: one(imapFolders, {
    fields: [emails.imapFolderId],
    references: [imapFolders.id],
  }),
  smtpAccount: one(smtpAccounts, {
    fields: [emails.smtpAccountId],
    references: [smtpAccounts.id],
  }),
  imapAccount: one(imapAccounts, {
    fields: [emails.imapAccountId],
    references: [imapAccounts.id],
  }),
}));

/**
 * IMAP Server Configuration Table
 * Stores global IMAP server configuration settings
 */
export const imapServerConfigs = pgTable("imap_server_configs", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Server settings
  enabled: boolean("enabled").notNull().default(true),
  maxConcurrentConnections: integer("max_concurrent_connections").notNull().default(10),
  connectionTimeout: integer("connection_timeout").notNull().default(30000),
  keepAlive: boolean("keep_alive").notNull().default(true),
  poolIdleTimeout: integer("pool_idle_timeout").notNull().default(300000),

  // Sync settings
  syncEnabled: boolean("sync_enabled").notNull().default(true),
  syncInterval: integer("sync_interval").notNull().default(60), // seconds
  batchSize: integer("batch_size").notNull().default(100),
  maxMessages: integer("max_messages").notNull().default(1000),
  concurrentAccounts: integer("concurrent_accounts").notNull().default(5),

  // Performance settings
  cacheEnabled: boolean("cache_enabled").notNull().default(true),
  cacheTtl: integer("cache_ttl").notNull().default(300000), // 5 minutes
  cacheMaxSize: integer("cache_max_size").notNull().default(1000),
  memoryThreshold: integer("memory_threshold").notNull().default(80), // percentage

  // Resilience settings
  circuitBreakerEnabled: boolean("circuit_breaker_enabled").notNull().default(true),
  circuitBreakerThreshold: integer("circuit_breaker_threshold").notNull().default(5),
  circuitBreakerTimeout: integer("circuit_breaker_timeout").notNull().default(60000),
  retryMaxAttempts: integer("retry_max_attempts").notNull().default(3),
  retryDelay: integer("retry_delay").notNull().default(5000),

  // Monitoring settings
  metricsEnabled: boolean("metrics_enabled").notNull().default(true),
  healthCheckInterval: integer("health_check_interval").notNull().default(30000),
  alertingEnabled: boolean("alerting_enabled").notNull().default(true),

  // Rate limiting settings
  rateLimitingEnabled: boolean("rate_limiting_enabled").notNull().default(true),
  maxRequests: integer("max_requests").notNull().default(100),
  rateLimitWindow: integer("rate_limit_window").notNull().default(60000), // 1 minute

  // Development settings
  debugMode: boolean("debug_mode").notNull().default(false),
  dryRun: boolean("dry_run").notNull().default(false),
  logLevel: text("log_level").notNull().default(ImapLoggingLevel.INFO), // Use enum for log level

  // Audit fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * IMAP Sync Cron Configuration Table
 * Stores configuration settings for the IMAP sync cron job
 */
export const imapSyncConfigs = pgTable("imap_sync_configs", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Sync configuration settings
  maxAccountsPerRun: integer("max_accounts_per_run").notNull().default(5),
  maxMessagesPerFolder: integer("max_messages_per_folder").notNull().default(1000),
  batchSize: integer("batch_size").notNull().default(100),
  enableBidirectionalSync: boolean("enable_bidirectional_sync").notNull().default(true),
  syncFlags: boolean("sync_flags").notNull().default(true),
  syncDeleted: boolean("sync_deleted").notNull().default(false),
  dryRun: boolean("dry_run").notNull().default(false),
  forceSync: boolean("force_sync").notNull().default(false),

  // Performance settings
  connectionTimeout: integer("connection_timeout").notNull().default(30000),
  maxRetries: integer("max_retries").notNull().default(3),
  retryDelay: integer("retry_delay").notNull().default(5000),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * IMAP Server Configuration Relations
 */
export const imapServerConfigsRelations = relations(imapServerConfigs, () => ({
  // No direct relations for now, but could add audit logs or user associations
}));

/**
 * IMAP Sync Configuration Relations
 */
export const imapSyncConfigsRelations = relations(imapSyncConfigs, () => ({
  // No direct relations for now, but could add audit logs or user associations
}));
export const insertEmailSchema = createInsertSchema(emails);
export const selectImapFolderSchema = createSelectSchema(imapFolders);
export const insertImapFolderSchema = createInsertSchema(imapFolders);
export const selectImapAccountSchema = createSelectSchema(imapAccounts);
export const insertImapAccountSchema = createInsertSchema(imapAccounts);
export const selectImapServerConfigSchema = createSelectSchema(imapServerConfigs);
export const insertImapServerConfigSchema = createInsertSchema(imapServerConfigs);
export const selectImapSyncConfigSchema = createSelectSchema(imapSyncConfigs);
export const insertImapSyncConfigSchema = createInsertSchema(imapSyncConfigs);

/**
 * Zod Schemas
 */
export const selectEmailSchema = createSelectSchema(emails);

/**
 * Type Exports
 */
export type Email = typeof emails.$inferSelect;
export type NewEmail = typeof emails.$inferInsert;
export type ImapFolder = typeof imapFolders.$inferSelect;
export type NewImapFolder = typeof imapFolders.$inferInsert;
export type ImapAccount = typeof imapAccounts.$inferSelect;
export type NewImapAccount = typeof imapAccounts.$inferInsert;
export type ImapServerConfig = typeof imapServerConfigs.$inferSelect;
export type NewImapServerConfig = typeof imapServerConfigs.$inferInsert;
export type ImapSyncConfig = typeof imapSyncConfigs.$inferSelect;
export type NewImapSyncConfig = typeof imapSyncConfigs.$inferInsert;
