/**
 * Outreach CRM Database Schema
 *
 * Contacts we pitched (one row per lowercased email), every touch in either
 * direction, and the paid deals that came out of it. Deals link to the growth
 * funnel by campaign link / utm_campaign / ref code / channel, so spend can be
 * compared to the signups and revenue it actually brought.
 */

import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import type { z } from "zod";

import { growthCampaignLinks } from "../growth/db";
import {
  OutreachContactKind,
  OutreachContactKindDB,
  OutreachContactStatus,
  OutreachContactStatusDB,
  OutreachDealStatus,
  OutreachDealStatusDB,
  OutreachDirectionDB,
} from "./enum";

/**
 * Outreach Contacts
 * Counters (contactCount, first/last contact, last subject) are derived from
 * outbound touches and refreshed on every write.
 */
export const outreachContacts = pgTable(
  "outreach_contacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Always lowercased + trimmed */
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    kind: text("kind", { enum: OutreachContactKindDB })
      .notNull()
      .default(OutreachContactKind.OTHER),
    url: text("url"),
    /** Pitch angle of the first outreach, e.g. "B-audience-fit" */
    angle: text("angle"),
    status: text("status", { enum: OutreachContactStatusDB })
      .notNull()
      .default(OutreachContactStatus.SENT),
    firstContactAt: timestamp("first_contact_at"),
    lastContactAt: timestamp("last_contact_at"),
    lastReplyAt: timestamp("last_reply_at"),
    lastSubject: text("last_subject"),
    contactCount: integer("contact_count").notNull().default(0),
    notes: text("notes"),
    refCode: text("ref_code"),
    campaignLinkId: uuid("campaign_link_id").references(
      () => growthCampaignLinks.id,
      { onDelete: "set null" },
    ),
    /** Growth channel key (normalized utm_source), e.g. "youtube" */
    channel: text("channel"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_outreach_contacts_status").on(table.status),
    index("idx_outreach_contacts_last_contact_at").on(table.lastContactAt),
  ],
);

/**
 * Outreach Touches
 * One email in either direction. Imports dedupe on
 * (contact, direction, UTC day, subject).
 */
export const outreachTouches = pgTable(
  "outreach_touches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contactId: uuid("contact_id")
      .notNull()
      .references(() => outreachContacts.id, { onDelete: "cascade" }),
    at: timestamp("at").notNull(),
    direction: text("direction", { enum: OutreachDirectionDB }).notNull(),
    subject: text("subject").notNull().default(""),
    angle: text("angle"),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_outreach_touches_contact_at").on(table.contactId, table.at),
  ],
);

/**
 * Outreach Deals
 * Paid placements. liveAt (else committedAt, else createdAt) opens the
 * attribution window for payments.
 */
export const outreachDeals = pgTable(
  "outreach_deals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contactId: uuid("contact_id")
      .notNull()
      .references(() => outreachContacts.id, { onDelete: "restrict" }),
    /** What the money buys, e.g. "YouTube integration" */
    deliverable: text("deliverable").notNull(),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency", { enum: CurrenciesArr }).notNull(),
    status: text("status", { enum: OutreachDealStatusDB })
      .notNull()
      .default(OutreachDealStatus.PROPOSED),
    /** Growth channel key - same key growth_channel_spend.channel uses */
    channel: text("channel"),
    campaignLinkId: uuid("campaign_link_id").references(
      () => growthCampaignLinks.id,
      { onDelete: "set null" },
    ),
    utmCampaign: text("utm_campaign"),
    refCode: text("ref_code"),
    notes: text("notes"),
    liveAt: timestamp("live_at"),
    committedAt: timestamp("committed_at"),
    paidAt: timestamp("paid_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("idx_outreach_deals_contact").on(table.contactId)],
);

export const selectOutreachContactSchema = createSelectSchema(outreachContacts);
export const insertOutreachContactSchema = createInsertSchema(outreachContacts);
export const selectOutreachTouchSchema = createSelectSchema(outreachTouches);
export const insertOutreachTouchSchema = createInsertSchema(outreachTouches);
export const selectOutreachDealSchema = createSelectSchema(outreachDeals);
export const insertOutreachDealSchema = createInsertSchema(outreachDeals);

export type OutreachContact = z.infer<typeof selectOutreachContactSchema>;
export type NewOutreachContact = z.infer<typeof insertOutreachContactSchema>;
export type OutreachTouch = z.infer<typeof selectOutreachTouchSchema>;
export type NewOutreachTouch = z.infer<typeof insertOutreachTouchSchema>;
export type OutreachDeal = z.infer<typeof selectOutreachDealSchema>;
export type NewOutreachDeal = z.infer<typeof insertOutreachDealSchema>;
