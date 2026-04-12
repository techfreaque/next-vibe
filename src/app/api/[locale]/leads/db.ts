/**
 * Leads Database Schema
 * Drizzle ORM schema definitions for lead management system
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
import type { z } from "zod";

import { CountriesArr, LanguagesArr } from "@/i18n/core/config";

import { CampaignType, CampaignTypeDB } from "../messenger/accounts/enum";
import {
  MessageStatus as EmailStatus,
  MessageStatusDB as EmailStatusDB,
} from "../messenger/messages/enum";
import { users } from "../user/db";
import {
  DeviceTypeDB,
  EmailCampaignStage,
  EmailCampaignStageDB,
  EmailJourneyVariantDB,
  EmailProvider,
  EmailProviderDB,
  EngagementTypesDB,
  LeadSourceDB,
  LeadStatus,
  LeadStatusDB,
} from "./enum";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */

/**
 * Leads Table
 * Stores potential customers and their information
 */
export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique(),
  businessName: text("business_name").notNull(),
  contactName: text("contact_name"),
  phone: text("phone"),
  website: text("website"),

  // Location and language
  country: text("country", { enum: CountriesArr }).notNull(),
  language: text("language", { enum: LanguagesArr }).notNull(),

  // IP tracking for free tier credits
  ipAddress: text("ip_address"),

  // Device / browser identity (latest, from user agent parsing)
  userAgent: text("user_agent"),
  deviceType: text("device_type", { enum: DeviceTypeDB }),
  browser: text("browser"),
  os: text("os"),

  // Referral tracking (first-touch, immutable)
  referralCode: text("referral_code"),

  // Skill attribution - the skill that brought this lead to the platform (last-write-wins before signup)
  // Stored as plain text (UUID or built-in skill id), no FK since built-in skills have no DB row
  skillId: text("skill_id"),

  // Lead qualification
  status: text("status", { enum: LeadStatusDB })
    .notNull()
    .default(LeadStatus.NEW),
  source: text("source", { enum: LeadSourceDB }).notNull(),
  notes: text("notes"),

  convertedUserId: uuid("converted_user_id").references(() => users.id),
  convertedAt: timestamp("converted_at"),

  // Event timestamps for statistics tracking
  signedUpAt: timestamp("signed_up_at"),
  subscriptionConfirmedAt: timestamp("subscription_confirmed_at"),
  bouncedAt: timestamp("bounced_at"), // When lead email bounced
  invalidAt: timestamp("invalid_at"), // When lead was marked as invalid

  // Email campaign tracking
  currentCampaignStage: text("current_campaign_stage", {
    enum: EmailCampaignStageDB,
  }).default(EmailCampaignStage.NOT_STARTED),
  emailJourneyVariant: text("email_journey_variant", {
    enum: EmailJourneyVariantDB,
  }),
  campaignStartedAt: timestamp("campaign_started_at"),
  emailsSent: integer("emails_sent").notNull().default(0),
  lastEmailSentAt: timestamp("last_email_sent_at"),
  unsubscribedAt: timestamp("unsubscribed_at"),

  // Engagement metrics
  emailsOpened: integer("emails_opened").notNull().default(0),
  emailsClicked: integer("emails_clicked").notNull().default(0),
  lastEngagementAt: timestamp("last_engagement_at"),

  // Metadata
  metadata: jsonb("metadata")
    .$type<Record<string, string | number | boolean | null>>()
    .notNull()
    .default({}),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Email Campaigns Table
 * Tracks individual email sends to leads
 */
export const emailCampaigns = pgTable("email_campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),

  // Campaign details
  campaignType: text("campaign_type", { enum: CampaignTypeDB })
    .notNull()
    .default(CampaignType.LEAD_CAMPAIGN),
  stage: text("stage", { enum: EmailCampaignStageDB }).notNull(),
  journeyVariant: text("journey_variant", {
    enum: EmailJourneyVariantDB,
  }).notNull(),
  subject: text("subject").notNull(),
  templateName: text("template_name").notNull(),

  // Scheduling
  scheduledAt: timestamp("scheduled_at").notNull(),
  sentAt: timestamp("sent_at"),

  // Status and tracking
  status: text("status", { enum: EmailStatusDB })
    .notNull()
    .default(EmailStatus.PENDING),
  emailProvider: text("email_provider", { enum: EmailProviderDB }).default(
    EmailProvider.SMTP,
  ),
  externalId: text("external_id"), // Provider's email ID
  smtpAccountId: uuid("smtp_account_id"), // SMTP account used for sending

  // Engagement tracking
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  unsubscribedAt: timestamp("unsubscribed_at"),
  bouncedAt: timestamp("bounced_at"),

  // Error handling
  error: text("error"),
  retryCount: integer("retry_count").notNull().default(0),

  // Metadata
  metadata: jsonb("metadata")
    .$type<Record<string, string | number | boolean>>()
    .notNull()
    .default({}),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Lead Engagements Table
 * Tracks individual engagement events for leads
 */
export const leadEngagements = pgTable("lead_engagements", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  campaignId: uuid("campaign_id").references(() => emailCampaigns.id, {
    onDelete: "set null",
  }),

  // Engagement details
  engagementType: text("engagement_type", {
    enum: EngagementTypesDB,
  }).notNull(),

  // Tracking information
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),

  // Metadata
  metadata: jsonb("metadata")
    .$type<Record<string, string | number | boolean>>()
    .notNull()
    .default({}),

  // Timestamps
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Relations
 */
export const leadsRelations = relations(leads, ({ one, many }) => ({
  convertedUser: one(users, {
    fields: [leads.convertedUserId],
    references: [users.id],
  }),
  emailCampaigns: many(emailCampaigns),
  engagements: many(leadEngagements),
  userLeadLinks: many(userLeadLinks),
}));

export const emailCampaignsRelations = relations(
  emailCampaigns,
  ({ one, many }) => ({
    lead: one(leads, {
      fields: [emailCampaigns.leadId],
      references: [leads.id],
    }),
    engagements: many(leadEngagements),
  }),
);

export const leadEngagementsRelations = relations(
  leadEngagements,
  ({ one }) => ({
    lead: one(leads, {
      fields: [leadEngagements.leadId],
      references: [leads.id],
    }),
    campaign: one(emailCampaigns, {
      fields: [leadEngagements.campaignId],
      references: [emailCampaigns.id],
    }),
  }),
);

/**
 * Lead-to-Lead Links Table
 * Tracks direct connections between leads (e.g., from track page, referrals)
 * Used for credit pool sharing before user signup
 */
export const leadLeadLinks = pgTable(
  "lead_lead_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId1: uuid("lead_id_1")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    leadId2: uuid("lead_id_2")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    linkReason: text("link_reason")
      .$type<"track_page" | "referral" | "manual" | "test" | "ip_match">()
      .notNull(),
    linkedAt: timestamp("linked_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("uq_lead_lead_link").on(table.leadId1, table.leadId2),
    index("idx_lead_lead_links_lead1").on(table.leadId1),
    index("idx_lead_lead_links_lead2").on(table.leadId2),
  ],
);

/**
 * User Lead Links Table
 * Tracks user-to-lead relationships
 */
export const userLeadLinks = pgTable(
  "user_lead_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    linkReason: text("link_reason")
      .$type<"signup" | "login" | "merge" | "manual">()
      .notNull(),
    linkedAt: timestamp("linked_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("uq_user_lead_link").on(table.userId, table.leadId),
    index("idx_user_lead_links_user").on(table.userId),
    index("idx_user_lead_links_lead").on(table.leadId),
  ],
);

/**
 * Relations
 */
export const leadLeadLinksRelations = relations(leadLeadLinks, ({ one }) => ({
  lead1: one(leads, {
    fields: [leadLeadLinks.leadId1],
    references: [leads.id],
  }),
  lead2: one(leads, {
    fields: [leadLeadLinks.leadId2],
    references: [leads.id],
  }),
}));

export const userLeadLinksRelations = relations(userLeadLinks, ({ one }) => ({
  user: one(users, {
    fields: [userLeadLinks.userId],
    references: [users.id],
  }),
  lead: one(leads, {
    fields: [userLeadLinks.leadId],
    references: [leads.id],
  }),
}));

/**
 * Email Journey Variants Table
 * Stores admin-registered journey variant metadata.
 * Source code stays in /journeys/*.email.tsx - this table controls activation,
 * weights, and display metadata without requiring a full deploy for config changes.
 */
export const emailJourneyVariants = pgTable(
  "email_journey_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    variantKey: text("variant_key").notNull().unique(),
    displayName: text("display_name").notNull(),
    description: text("description"),
    weight: integer("weight").notNull().default(33),
    active: boolean("active").notNull().default(true),
    campaignType: text("campaign_type", { enum: CampaignTypeDB }),
    sourceFilePath: text("source_file_path"),
    senderName: text("sender_name"),
    companyName: text("company_name"),
    companyEmail: text("company_email"),
    checkErrors: jsonb("check_errors").$type<string[]>().notNull().default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_email_journey_variants_variant_key").on(table.variantKey),
    index("idx_email_journey_variants_active").on(table.active),
  ],
);

/**
 * Zod Schemas
 */
export const selectLeadSchema = createSelectSchema(leads);
export const insertLeadSchema = createInsertSchema(leads);
export const selectEmailCampaignSchema = createSelectSchema(emailCampaigns);
export const insertEmailCampaignSchema = createInsertSchema(emailCampaigns);
export const selectLeadEngagementSchema = createSelectSchema(leadEngagements);
export const insertLeadEngagementSchema = createInsertSchema(leadEngagements);
export const selectLeadLeadLinkSchema = createSelectSchema(leadLeadLinks);
export const insertLeadLeadLinkSchema = createInsertSchema(leadLeadLinks);
export const selectUserLeadLinkSchema = createSelectSchema(userLeadLinks);
export const insertUserLeadLinkSchema = createInsertSchema(userLeadLinks);
export const selectEmailJourneyVariantSchema =
  createSelectSchema(emailJourneyVariants);
export const insertEmailJourneyVariantSchema =
  createInsertSchema(emailJourneyVariants);

/**
 * Types
 */
export type Lead = z.infer<typeof selectLeadSchema>;
export type NewLead = z.infer<typeof insertLeadSchema>;
export type EmailCampaign = z.infer<typeof selectEmailCampaignSchema>;
export type NewEmailCampaign = z.infer<typeof insertEmailCampaignSchema>;
export type LeadEngagement = z.infer<typeof selectLeadEngagementSchema>;
export type NewLeadEngagement = z.infer<typeof insertLeadEngagementSchema>;
export type LeadLeadLink = z.infer<typeof selectLeadLeadLinkSchema>;
export type NewLeadLeadLink = z.infer<typeof insertLeadLeadLinkSchema>;
export type UserLeadLink = z.infer<typeof selectUserLeadLinkSchema>;
export type NewUserLeadLink = z.infer<typeof insertUserLeadLinkSchema>;
export type EmailJourneyVariantRecord = z.infer<
  typeof selectEmailJourneyVariantSchema
>;
export type NewEmailJourneyVariantRecord = z.infer<
  typeof insertEmailJourneyVariantSchema
>;
