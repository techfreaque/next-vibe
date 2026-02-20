/**
 * Messaging Accounts Database Schema
 * Stores messaging provider credentials for SMS, WhatsApp, Telegram
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

import { users } from "../../user/db";
import {
  MessageChannelDB,
  MessagingAccountStatus,
  MessagingAccountStatusDB,
  MessagingProviderDB,
} from "./enum";

/**
 * Messaging Accounts Table
 * Stores provider credentials for SMS, WhatsApp, Telegram channels
 */
export const messagingAccounts = pgTable(
  "messaging_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Account identification
    name: text("name").notNull(),
    description: text("description"),

    // Channel and provider
    channel: text("channel", { enum: MessageChannelDB }).notNull(),
    provider: text("provider", { enum: MessagingProviderDB }).notNull(),

    // Credentials (should be encrypted in production)
    fromId: text("from_id"), // phone number, phone number ID, bot token prefix
    apiToken: text("api_token"), // primary credential
    apiSecret: text("api_secret"), // secondary credential (e.g. Twilio auth token)
    webhookUrl: text("webhook_url"), // for incoming messages

    // Status and health
    status: text("status", { enum: MessagingAccountStatusDB })
      .notNull()
      .default(MessagingAccountStatus.ACTIVE),
    isDefault: boolean("is_default").default(false),
    priority: integer("priority").default(0),

    // Health monitoring
    lastHealthCheck: timestamp("last_health_check"),
    consecutiveFailures: integer("consecutive_failures").default(0),
    lastFailureAt: timestamp("last_failure_at"),
    lastFailureReason: text("last_failure_reason"),

    // Usage statistics
    messagesSentToday: integer("messages_sent_today").default(0),
    messagesSentTotal: integer("messages_sent_total").default(0),
    lastUsedAt: timestamp("last_used_at"),

    // Extra config (provider-specific options)
    metadata: jsonb("metadata")
      .$type<Record<string, string | number | boolean>>()
      .default({}),

    // User association
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),

    // Audit fields
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameUniqueConstraint: unique("messaging_accounts_name_unique").on(
      table.name,
    ),
    channelIdx: index("messaging_accounts_channel_idx").on(table.channel),
    providerIdx: index("messaging_accounts_provider_idx").on(table.provider),
    statusIdx: index("messaging_accounts_status_idx").on(table.status),
    isDefaultIdx: index("messaging_accounts_is_default_idx").on(
      table.isDefault,
    ),
    createdByIdx: index("messaging_accounts_created_by_idx").on(
      table.createdBy,
    ),
  }),
);

/**
 * Zod Schemas
 */
export const selectMessagingAccountSchema =
  createSelectSchema(messagingAccounts);
export const insertMessagingAccountSchema =
  createInsertSchema(messagingAccounts);

/**
 * Type Exports
 */
export type MessagingAccount = typeof messagingAccounts.$inferSelect;
export type NewMessagingAccount = typeof messagingAccounts.$inferInsert;
