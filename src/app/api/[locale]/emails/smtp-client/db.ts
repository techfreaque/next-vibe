/**
 * SMTP Configuration Database Schema
 * Database schema for SMTP account configurations and management
 */

import { relations } from "drizzle-orm";
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
import type { CampaignType } from "./enum";
import {
  SmtpAccountStatus,
  SmtpAccountStatusDB,
  SmtpHealthStatusDB,
  SmtpSecurityType,
  SmtpSecurityTypeDB,
} from "./enum";

/**
 * SMTP Account Status Enum
 */

/**
 * SMTP Security Type Enum
 */

/**
 * SMTP Health Status Enum
 */

/**
 * SMTP Accounts Table
 * Stores SMTP account configurations for different purposes
 */
export const smtpAccounts = pgTable(
  "smtp_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Account identification
    name: text("name").notNull(), // User-friendly name
    description: text("description"), // Optional description

    // SMTP connection settings
    host: text("host").notNull(),
    port: integer("port").notNull().default(587),
    securityType: text("security_type", { enum: SmtpSecurityTypeDB })
      .notNull()
      .default(SmtpSecurityType.STARTTLS),

    // Authentication
    username: text("username").notNull(),
    password: text("password").notNull(), // Should be encrypted in production
    fromEmail: text("from_email").notNull(),

    // Connection settings
    connectionTimeout: integer("connection_timeout").default(30000),
    maxConnections: integer("max_connections").default(5),

    // Rate limiting settings
    rateLimitPerHour: integer("rate_limit_per_hour").default(600), // Max emails per hour

    // Status and health
    status: text("status", { enum: SmtpAccountStatusDB })
      .notNull()
      .default(SmtpAccountStatus.ACTIVE),
    isDefault: boolean("is_default").default(false), // Default account for purpose
    priority: integer("priority").default(0), // Higher number = higher priority

    // Health monitoring
    lastHealthCheck: timestamp("last_health_check"),
    healthCheckStatus: text("health_check_status", {
      enum: SmtpHealthStatusDB,
    }), // "healthy", "degraded", "unhealthy"
    consecutiveFailures: integer("consecutive_failures").default(0),
    lastFailureAt: timestamp("last_failure_at"),
    lastFailureReason: text("last_failure_reason"),

    // Usage statistics
    emailsSentToday: integer("emails_sent_today").default(0),
    emailsSentThisMonth: integer("emails_sent_this_month").default(0),
    totalEmailsSent: integer("total_emails_sent").default(0),
    lastUsedAt: timestamp("last_used_at"),

    // Configuration metadata
    metadata: jsonb("metadata").$type<Record<string, string | number | boolean>>().default({}),

    // Multi-select selection criteria fields (moved from nested object to top-level)
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

    // Advanced selection criteria options
    isExactMatch: boolean("is_exact_match").default(false),
    weight: integer("weight").default(1),
    isFailover: boolean("is_failover").default(false),
    failoverPriority: integer("failover_priority").default(0),

    // User association (who created/manages this account)
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),

    // Audit fields
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameUniqueConstraint: unique("smtp_accounts_name_unique").on(table.name),
    statusIdx: index("smtp_accounts_status_idx").on(table.status),
    isDefaultIdx: index("smtp_accounts_is_default_idx").on(table.isDefault),
    priorityIdx: index("smtp_accounts_priority_idx").on(table.priority),
    fromEmailIdx: index("smtp_accounts_from_email_idx").on(table.fromEmail),
    createdByIdx: index("smtp_accounts_created_by_idx").on(table.createdBy),
    lastHealthCheckIdx: index("smtp_accounts_last_health_check_idx").on(table.lastHealthCheck),
    lastUsedAtIdx: index("smtp_accounts_last_used_at_idx").on(table.lastUsedAt),
  }),
);

/**
 * SMTP Account Relations
 */
export const smtpAccountsRelations = relations(smtpAccounts, ({ one }) => ({
  createdByUser: one(users, {
    fields: [smtpAccounts.createdBy],
    references: [users.id],
  }),
  updatedByUser: one(users, {
    fields: [smtpAccounts.updatedBy],
    references: [users.id],
  }),
}));

/**
 * Zod Schemas
 */
export const selectSmtpAccountSchema = createSelectSchema(smtpAccounts);
export const insertSmtpAccountSchema = createInsertSchema(smtpAccounts);
/**
 * Type Exports
 */
export type SmtpAccount = typeof smtpAccounts.$inferSelect;
export type NewSmtpAccount = typeof smtpAccounts.$inferInsert;
