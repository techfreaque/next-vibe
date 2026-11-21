import { sql } from "drizzle-orm";
import {
  check,
  doublePrecision,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { leads } from "next-vibe/identity/lead/db";
import { users } from "next-vibe/identity/user/db";

import { CREATE_KINDS } from "@/_pages/create/_shared/create-kinds";

import type { StudioSettings } from "./settings";

export const studioGenerations = pgTable(
  "studio_generations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }),
    kind: text("kind", { enum: CREATE_KINDS }).notNull(),
    model: text("model").notNull(),
    title: text("title").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    status: text("status", {
      enum: ["queued", "running", "saving", "completed", "failed"],
    }).notNull(),
    url: text("url"),
    transcript: text("transcript"),
    credits: doublePrecision("credits"),
    /** Request settings (model options, prompt) so a result can be run again. */
    settings: jsonb("settings").$type<StudioSettings>(),
  },
  (table) => [
    check(
      "studio_generations_single_owner",
      sql`num_nonnulls(${table.userId}, ${table.leadId}) = 1`,
    ),
    index("studio_generations_user_created_idx").on(
      table.userId,
      table.createdAt,
    ),
    index("studio_generations_lead_created_idx").on(
      table.leadId,
      table.createdAt,
    ),
  ],
);
