/**
 * Newsletter Database Schema
 * Newsletter subscription management
 */

import { boolean, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import {
  NewsletterSubscriptionStatus,
  NewsletterSubscriptionStatusDB,
} from "./enum";
import { users } from "../user/db";


/**
 * Newsletter subscriptions table schema
 * Stores newsletter subscription information
 */
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  status: text("status", { enum: NewsletterSubscriptionStatusDB })
    .notNull()
    .default(NewsletterSubscriptionStatus.SUBSCRIBED),
  preferences: jsonb("preferences").default("[]"),
  subscriptionDate: timestamp("subscription_date", { withTimezone: true })
    .notNull()
    .defaultNow(),
  unsubscribedDate: timestamp("unsubscribed_date", { withTimezone: true }),
  lastEmailSentDate: timestamp("last_email_sent_date", { withTimezone: true }),
  bounceCount: text("bounce_count").default("0"),
  source: text("source").default("website"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  confirmationToken: text("confirmation_token"),
  marketingConsent: boolean("marketing_consent").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Newsletter campaigns table schema
 * Stores information about newsletter campaigns
 */
export const newsletterCampaigns = pgTable("newsletter_campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at"),
  scheduledFor: timestamp("scheduled_for"),
  recipientCount: text("recipient_count").default("0"),
  openCount: text("open_count").default("0"),
  clickCount: text("click_count").default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Newsletter campaign events table schema
 * Tracks events related to newsletter campaigns (opens, clicks, etc.)
 */
export const newsletterEvents = pgTable("newsletter_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  subscriptionId: uuid("subscription_id")
    .notNull()
    .references(() => newsletterSubscriptions.id),
  campaignId: uuid("campaign_id").references(() => newsletterCampaigns.id),
  eventType: text("event_type").notNull(), // open, click, bounce, complaint, etc.
  eventData: jsonb("event_data"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schemas for validation with Zod
export const selectNewsletterSubscriptionSchema = createSelectSchema(
  newsletterSubscriptions,
);
export const insertNewsletterSubscriptionSchema = createInsertSchema(
  newsletterSubscriptions,
);
export const selectNewsletterCampaignSchema =
  createSelectSchema(newsletterCampaigns);
export const insertNewsletterCampaignSchema =
  createInsertSchema(newsletterCampaigns);
export const selectNewsletterEventSchema = createSelectSchema(newsletterEvents);
export const insertNewsletterEventSchema = createInsertSchema(newsletterEvents);

// Type definitions
export type NewsletterSubscription = z.infer<
  typeof selectNewsletterSubscriptionSchema
>;
export type NewNewsletterSubscription = z.infer<
  typeof insertNewsletterSubscriptionSchema
>;
export type NewsletterCampaign = z.infer<typeof selectNewsletterCampaignSchema>;
export type NewNewsletterCampaign = z.infer<
  typeof insertNewsletterCampaignSchema
>;
export type NewsletterEvent = z.infer<typeof selectNewsletterEventSchema>;
export type NewNewsletterEvent = z.infer<typeof insertNewsletterEventSchema>;
