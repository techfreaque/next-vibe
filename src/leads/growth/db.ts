/**
 * Growth Funnel Database Schema
 *
 * One journey row per lead: first-touch + last-touch attribution and the
 * timestamp of each funnel step. Step columns are write-once (COALESCE), so a
 * step can never be counted twice for the same journey.
 *
 * Privacy: no IP, no user agent, no full referrer URL, no query strings.
 * Only UTM values, the referrer HOST, the landing PATH and the ref code.
 */

import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import { leads } from "next-vibe/identity/lead/db";
import { users } from "next-vibe/identity/user/db";
import type { z } from "zod";

import { ChannelTypeDB, PaidKindDB } from "./enum";

/**
 * Campaign Links
 * Admin-built UTM links. `utm_id` on the generated URL carries the link id.
 */
export const growthCampaignLinks = pgTable(
  "growth_campaign_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    source: text("source").notNull(),
    medium: text("medium").notNull(),
    campaign: text("campaign").notNull(),
    content: text("content"),
    term: text("term"),
    destinationPath: text("destination_path").notNull().default("/"),
    refCode: text("ref_code"),
    visits: integer("visits").notNull().default(0),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("idx_growth_campaign_links_source").on(table.source)],
);

/**
 * Growth Journeys
 * First/last-touch attribution + funnel step timestamps, one row per lead.
 * userId is set at signup - the user inherits the lead's attribution.
 */
export const growthJourneys = pgTable(
  "growth_journeys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .unique()
      .references(() => leads.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .unique()
      .references(() => users.id, { onDelete: "set null" }),

    // First touch - set once, never overwritten
    firstChannel: text("first_channel").notNull(),
    firstChannelType: text("first_channel_type", {
      enum: ChannelTypeDB,
    }).notNull(),
    firstSource: text("first_source"),
    firstMedium: text("first_medium"),
    firstCampaign: text("first_campaign"),
    firstContent: text("first_content"),
    firstTerm: text("first_term"),
    firstReferrerHost: text("first_referrer_host"),
    firstLandingPath: text("first_landing_path"),
    firstRefCode: text("first_ref_code"),
    firstLinkId: uuid("first_link_id").references(
      () => growthCampaignLinks.id,
      { onDelete: "set null" },
    ),
    firstTouchAt: timestamp("first_touch_at").defaultNow().notNull(),

    // Last touch - updated by later visits that carry UTMs / ref / link id
    lastChannel: text("last_channel").notNull(),
    lastChannelType: text("last_channel_type", {
      enum: ChannelTypeDB,
    }).notNull(),
    lastSource: text("last_source"),
    lastMedium: text("last_medium"),
    lastCampaign: text("last_campaign"),
    lastContent: text("last_content"),
    lastTerm: text("last_term"),
    lastReferrerHost: text("last_referrer_host"),
    lastLandingPath: text("last_landing_path"),
    lastRefCode: text("last_ref_code"),
    lastLinkId: uuid("last_link_id").references(() => growthCampaignLinks.id, {
      onDelete: "set null",
    }),
    lastTouchAt: timestamp("last_touch_at").defaultNow().notNull(),

    // Funnel steps (first visit = firstTouchAt). Write-once.
    firstChatAt: timestamp("first_chat_at"),
    signedUpAt: timestamp("signed_up_at"),
    newsletterConfirmedAt: timestamp("newsletter_confirmed_at"),
    firstPaidAt: timestamp("first_paid_at"),
    firstPaidKind: text("first_paid_kind", { enum: PaidKindDB }),
    retainedAt: timestamp("retained_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_growth_journeys_first_channel").on(table.firstChannel),
    index("idx_growth_journeys_last_channel").on(table.lastChannel),
    index("idx_growth_journeys_first_link").on(table.firstLinkId),
    index("idx_growth_journeys_last_link").on(table.lastLinkId),
    index("idx_growth_journeys_first_touch_at").on(table.firstTouchAt),
  ],
);

/**
 * Channel Spend
 * What a channel cost in a period. One row per (channel, periodStart, currency).
 */
export const growthChannelSpend = pgTable(
  "growth_channel_spend",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    channel: text("channel").notNull(),
    periodStart: timestamp("period_start").notNull(),
    periodEnd: timestamp("period_end").notNull(),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency", { enum: CurrenciesArr }).notNull(),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("uq_growth_channel_spend_period").on(
      table.channel,
      table.periodStart,
      table.currency,
    ),
  ],
);

export const selectGrowthJourneySchema = createSelectSchema(growthJourneys);
export const insertGrowthJourneySchema = createInsertSchema(growthJourneys);
export const selectGrowthCampaignLinkSchema =
  createSelectSchema(growthCampaignLinks);
export const insertGrowthCampaignLinkSchema =
  createInsertSchema(growthCampaignLinks);
export const selectGrowthChannelSpendSchema =
  createSelectSchema(growthChannelSpend);
export const insertGrowthChannelSpendSchema =
  createInsertSchema(growthChannelSpend);

export type GrowthJourney = z.infer<typeof selectGrowthJourneySchema>;
export type NewGrowthJourney = z.infer<typeof insertGrowthJourneySchema>;
export type GrowthCampaignLink = z.infer<typeof selectGrowthCampaignLinkSchema>;
export type GrowthChannelSpend = z.infer<typeof selectGrowthChannelSpendSchema>;
