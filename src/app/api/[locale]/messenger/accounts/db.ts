/**
 * Unified Messenger Accounts Database Schema
 *
 * Single table replacing smtp_accounts, imap_accounts, and messaging_accounts.
 * All platforms share typed nullable columns — no JSONB credential blobs.
 *
 * Channel discriminator determines which fields are applicable:
 *   EMAIL  → smtp_* outbound fields + imap_* inbound fields + email routing fields
 *   SMS    → api_token, api_secret, from_id, webhook_url
 *   WHATSAPP → api_token, api_secret, from_id, webhook_url
 *   TELEGRAM → api_token, webhook_url
 */

import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import type { Countries, Languages } from "@/i18n/core/config";

import type { EmailCampaignStage, EmailJourneyVariant } from "../../leads/enum";
import { users } from "../../user/db";
import {
  EmailImapAuthMethodDB,
  EmailSecurityTypeDB,
} from "../providers/email/enum";
import {
  MessengerAccountStatus,
  MessengerAccountStatusDB,
  MessengerHealthStatusDB,
  MessengerProviderDB,
} from "./enum";
import type { CampaignType } from "./enum";
import { MessageChannelDB } from "./enum";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety maintained through
 * Drizzle's enum constraint and Zod validation.
 */

export const messengerAccounts = pgTable(
  "messenger_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // ── Identity ─────────────────────────────────────────────────────────────
    name: text("name").notNull(),
    description: text("description"),

    // ── Channel + Provider discriminators ────────────────────────────────────
    channel: text("channel", { enum: MessageChannelDB }).notNull(),
    provider: text("provider", { enum: MessengerProviderDB }).notNull(),

    // ── Outbound SMTP credentials (EMAIL/SMTP only) ───────────────────────────
    smtpHost: text("smtp_host"),
    smtpPort: integer("smtp_port"),
    smtpSecurityType: text("smtp_security_type", {
      enum: EmailSecurityTypeDB,
    }),
    smtpUsername: text("smtp_username"),
    smtpPassword: text("smtp_password"),
    smtpFromEmail: text("smtp_from_email"),
    smtpFromName: text("smtp_from_name"),
    smtpConnectionTimeout: integer("smtp_connection_timeout"),
    smtpMaxConnections: integer("smtp_max_connections"),
    smtpRateLimitPerHour: integer("smtp_rate_limit_per_hour"),

    // ── API credentials (EMAIL API providers + SMS/WhatsApp/Telegram) ─────────
    // Used by: Resend, SES, Mailgun, SendGrid, Mailjet, Postmark → apiKey
    //          Twilio, MessageBird, AWS SNS, HTTP → apiToken + apiSecret
    //          WhatsApp Business → apiToken + apiSecret
    //          Telegram Bot → apiToken
    apiKey: text("api_key"), // single-key API providers (Resend, SES, etc.)
    apiToken: text("api_token"), // primary credential (Twilio, WhatsApp, Telegram)
    apiSecret: text("api_secret"), // secondary credential (Twilio auth token)
    fromId: text("from_id"), // phone number, sender ID, bot username
    webhookUrl: text("webhook_url"), // for inbound message callbacks

    // ── Inbound IMAP config (EMAIL channel only) ──────────────────────────────
    imapHost: text("imap_host"),
    imapPort: integer("imap_port"),
    imapSecure: boolean("imap_secure"),
    imapUsername: text("imap_username"),
    imapPassword: text("imap_password"),
    imapAuthMethod: text("imap_auth_method", {
      enum: EmailImapAuthMethodDB,
    }),
    imapConnectionTimeout: integer("imap_connection_timeout"),
    imapKeepAlive: boolean("imap_keep_alive"),
    imapSyncEnabled: boolean("imap_sync_enabled").default(false),
    imapSyncInterval: integer("imap_sync_interval"), // seconds
    imapMaxMessages: integer("imap_max_messages"),
    imapSyncFolders: jsonb("imap_sync_folders").$type<string[]>(),
    imapLastSyncAt: timestamp("imap_last_sync_at"),
    imapSyncError: text("imap_sync_error"),
    imapIsConnected: boolean("imap_is_connected").default(false),

    // ── Email routing (EMAIL channel only) ───────────────────────────────────
    campaignTypes: jsonb("campaign_types")
      .$type<(typeof CampaignType)[keyof typeof CampaignType][]>()
      .default([]),
    emailJourneyVariants: jsonb("email_journey_variants")
      .$type<(typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant][]>()
      .default([]),
    emailCampaignStages: jsonb("email_campaign_stages")
      .$type<(typeof EmailCampaignStage)[keyof typeof EmailCampaignStage][]>()
      .default([]),
    countries: jsonb("countries").$type<Countries[]>().default([]),
    languages: jsonb("languages").$type<Languages[]>().default([]),
    isExactMatch: boolean("is_exact_match").default(false),
    weight: integer("weight").default(1),
    isFailover: boolean("is_failover").default(false),
    failoverPriority: integer("failover_priority").default(0),

    // ── Status + health ───────────────────────────────────────────────────────
    status: text("status", { enum: MessengerAccountStatusDB })
      .notNull()
      .default(MessengerAccountStatus.INACTIVE),
    isDefault: boolean("is_default").default(false),
    priority: integer("priority").default(0),
    healthStatus: text("health_status", { enum: MessengerHealthStatusDB }),
    consecutiveFailures: integer("consecutive_failures").default(0),
    lastFailureAt: timestamp("last_failure_at"),
    lastFailureReason: text("last_failure_reason"),
    lastHealthCheck: timestamp("last_health_check"),

    // ── Usage stats ───────────────────────────────────────────────────────────
    messagesSentToday: integer("messages_sent_today").default(0),
    messagesSentTotal: integer("messages_sent_total").default(0),
    lastUsedAt: timestamp("last_used_at"),

    // ── Audit ─────────────────────────────────────────────────────────────────
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameUniqueConstraint: unique("messenger_accounts_name_unique").on(
      table.name,
    ),
    channelIdx: index("messenger_accounts_channel_idx").on(table.channel),
    providerIdx: index("messenger_accounts_provider_idx").on(table.provider),
    statusIdx: index("messenger_accounts_status_idx").on(table.status),
    isDefaultIdx: index("messenger_accounts_is_default_idx").on(
      table.isDefault,
    ),
    priorityIdx: index("messenger_accounts_priority_idx").on(table.priority),
    createdByIdx: index("messenger_accounts_created_by_idx").on(
      table.createdBy,
    ),
    lastHealthCheckIdx: index("messenger_accounts_last_health_check_idx").on(
      table.lastHealthCheck,
    ),
    lastUsedAtIdx: index("messenger_accounts_last_used_at_idx").on(
      table.lastUsedAt,
    ),
  }),
);

export const selectMessengerAccountSchema =
  createSelectSchema(messengerAccounts);
export const insertMessengerAccountSchema =
  createInsertSchema(messengerAccounts);

export type MessengerAccount = typeof messengerAccounts.$inferSelect;
export type NewMessengerAccount = typeof messengerAccounts.$inferInsert;
