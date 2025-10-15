/**
 * Leads Database Schema
 * Drizzle ORM schema definitions for lead management system
 */

import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { Countries, Languages } from "@/i18n/core/config";

import { users } from "../user/db";
import {
  EmailCampaignStage,
  EmailCampaignStageDB,
  EmailJourneyVariantDB,
  EmailProvider,
  EmailProviderDB,
  EmailStatus,
  EmailStatusDB,
  EngagementTypesDB,
  LeadSourceDB,
  LeadStatus,
  LeadStatusDB,
} from "./enum";

// Create country and language enums from i18n config
export const countryEnum = pgEnum(
  "country",
  Object.values(Countries) as [string, ...string[]],
);
export const languageEnum = pgEnum(
  "language",
  Object.values(Languages) as [string, ...string[]],
);

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
  country: countryEnum("country").notNull(),
  language: languageEnum("language").notNull(),

  // Lead qualification
  status: text("status", { enum: LeadStatusDB })
    .notNull()
    .default(LeadStatus.NEW),
  source: text("source", { enum: LeadSourceDB }),
  notes: text("notes"),

  convertedUserId: uuid("converted_user_id").references(() => users.id),
  convertedAt: timestamp("converted_at"),

  // Event timestamps for statistics tracking
  signedUpAt: timestamp("signed_up_at"),
  consultationBookedAt: timestamp("consultation_booked_at"),
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
 * Zod Schemas
 */
export const selectLeadSchema = createSelectSchema(leads);
export const insertLeadSchema = createInsertSchema(leads);
export const selectEmailCampaignSchema = createSelectSchema(emailCampaigns);
export const insertEmailCampaignSchema = createInsertSchema(emailCampaigns);
export const selectLeadEngagementSchema = createSelectSchema(leadEngagements);
export const insertLeadEngagementSchema = createInsertSchema(leadEngagements);

/**
 * Types
 */
export type Lead = z.infer<typeof selectLeadSchema>;
export type NewLead = z.infer<typeof insertLeadSchema>;
export type EmailCampaign = z.infer<typeof selectEmailCampaignSchema>;
export type NewEmailCampaign = z.infer<typeof insertEmailCampaignSchema>;
export type LeadEngagement = z.infer<typeof selectLeadEngagementSchema>;
export type NewLeadEngagement = z.infer<typeof insertLeadEngagementSchema>;
