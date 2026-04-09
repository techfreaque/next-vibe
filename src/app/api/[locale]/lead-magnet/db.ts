/**
 * Lead Magnet database schema
 * Stores creator lead magnet configs and capture analytics
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { customSkills } from "@/app/api/[locale]/agent/chat/skills/db";
import { users } from "@/app/api/[locale]/user/db";

import { LeadMagnetCaptureStatus, LeadMagnetCaptureStatusDB } from "./enum";

/**
 * Lead Magnet Configs Table
 * One config per user - defines which email platform their leads go to
 */
export const leadMagnetConfigs = pgTable(
  "lead_magnet_configs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique() // One config per user
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(), // e.g. "klaviyo", "getresponse", etc.
    credentials: jsonb("credentials").notNull(), // encrypted provider credentials
    listId: text("list_id"), // optional target list/group within the provider
    headline: text("headline"), // e.g. "Get my AI prompt pack free"
    buttonText: text("button_text"), // e.g. "Get access →"
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("lead_magnet_configs_user_idx").on(t.userId)],
);

export const selectLeadMagnetConfigSchema =
  createSelectSchema(leadMagnetConfigs);
export const insertLeadMagnetConfigSchema =
  createInsertSchema(leadMagnetConfigs);
export type LeadMagnetConfig = typeof leadMagnetConfigs.$inferSelect;
export type NewLeadMagnetConfig = typeof leadMagnetConfigs.$inferInsert;

/**
 * Lead Magnet Captures Table
 * Analytics: one row per form submission
 */
export const leadMagnetCaptures = pgTable(
  "lead_magnet_captures",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    configId: uuid("config_id")
      .notNull()
      .references(() => leadMagnetConfigs.id, { onDelete: "cascade" }),
    skillId: uuid("skill_id").references(() => customSkills.id, {
      onDelete: "set null",
    }),
    email: text("email").notNull(),
    firstName: text("first_name").notNull(),
    status: text("status", { enum: LeadMagnetCaptureStatusDB })
      .notNull()
      .default(LeadMagnetCaptureStatus.SUCCESS),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("lead_magnet_captures_config_idx").on(t.configId),
    index("lead_magnet_captures_skill_idx").on(t.skillId),
    index("lead_magnet_captures_created_idx").on(t.createdAt),
  ],
);

export const selectLeadMagnetCaptureSchema =
  createSelectSchema(leadMagnetCaptures);
export const insertLeadMagnetCaptureSchema =
  createInsertSchema(leadMagnetCaptures);
export type LeadMagnetCapture = typeof leadMagnetCaptures.$inferSelect;
export type NewLeadMagnetCapture = typeof leadMagnetCaptures.$inferInsert;

/**
 * Relations
 */
export const leadMagnetConfigsRelations = relations(
  leadMagnetConfigs,
  ({ one, many }) => ({
    user: one(users, {
      fields: [leadMagnetConfigs.userId],
      references: [users.id],
    }),
    captures: many(leadMagnetCaptures),
  }),
);

export const leadMagnetCapturesRelations = relations(
  leadMagnetCaptures,
  ({ one }) => ({
    config: one(leadMagnetConfigs, {
      fields: [leadMagnetCaptures.configId],
      references: [leadMagnetConfigs.id],
    }),
    skill: one(customSkills, {
      fields: [leadMagnetCaptures.skillId],
      references: [customSkills.id],
    }),
  }),
);
