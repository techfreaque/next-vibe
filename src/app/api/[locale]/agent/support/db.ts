/**
 * Support Sessions Database Schema
 *
 * Tracks admin-to-admin support sessions across vibe instances.
 * Thread lives on the remote (unbottled.ai) via ws-provider.
 * The initiating local admin opens the thread; remote admins join.
 */

import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { users } from "@/app/api/[locale]/user/db";

// ─── Status Enum ─────────────────────────────────────────────────────────────

export const SupportSessionStatusDB = ["pending", "active", "closed"] as const;

export type SupportSessionStatus = (typeof SupportSessionStatusDB)[number];

// ─── Table ───────────────────────────────────────────────────────────────────

export const supportSessions = pgTable(
  "support_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Thread on the remote instance (created via ws-provider)
    threadId: uuid("thread_id").references(() => chatThreads.id, {
      onDelete: "cascade",
    }),

    // Admin who opened the session (on their local instance)
    initiatorId: uuid("initiator_id").references(() => users.id, {
      onDelete: "cascade",
    }),

    // NEXT_PUBLIC_PROJECT_URL of the initiating instance
    initiatorInstanceUrl: text("initiator_instance_url"),

    // Supporter who joined (null until joined)
    supporterId: uuid("supporter_id").references(() => users.id, {
      onDelete: "set null",
    }),

    // remoteConnections.remoteUrl of the supporter's instance
    supporterInstanceUrl: text("supporter_instance_url"),

    // Session state
    status: text("status", { enum: SupportSessionStatusDB })
      .notNull()
      .default("pending"),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("support_sessions_status_idx").on(table.status),
    index("support_sessions_thread_id_idx").on(table.threadId),
    index("support_sessions_initiator_instance_idx").on(
      table.initiatorInstanceUrl,
    ),
  ],
);

// ─── Relations ───────────────────────────────────────────────────────────────

export const supportSessionsRelations = relations(
  supportSessions,
  ({ one }) => ({
    thread: one(chatThreads, {
      fields: [supportSessions.threadId],
      references: [chatThreads.id],
    }),
    initiator: one(users, {
      fields: [supportSessions.initiatorId],
      references: [users.id],
      relationName: "supportSessionInitiator",
    }),
    supporter: one(users, {
      fields: [supportSessions.supporterId],
      references: [users.id],
      relationName: "supportSessionSupporter",
    }),
  }),
);

// ─── Types ───────────────────────────────────────────────────────────────────

export const insertSupportSessionSchema = createInsertSchema(supportSessions);
export const selectSupportSessionSchema = createSelectSchema(supportSessions);

export type SupportSession = z.infer<typeof selectSupportSessionSchema>;
export type InsertSupportSession = z.infer<typeof insertSupportSessionSchema>;
