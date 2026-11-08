/**
 * Notifications database schema
 */

import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "next-vibe/identity/user/db";
import type { z } from "zod";

import { NotificationTypeDB } from "./enum";

/** Flat, JSON-safe facts about the event (task id, amount, thread id...). */
export type NotificationMetadata = Record<
  string,
  string | number | boolean | null
>;

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type", { enum: NotificationTypeDB }).notNull(),
    title: text("title").notNull(),
    body: text("body"),
    /** In-app href WITHOUT locale prefix, e.g. /threads/private/<id> */
    link: text("link"),
    read: boolean("read").notNull().default(false),
    /**
     * One notification per (user, dedupeKey). Event sources set it to a
     * stable id of the thing that happened (task id, earning id) so retries
     * and double-fired completions never produce duplicates.
     */
    dedupeKey: text("dedupe_key"),
    metadata: jsonb("metadata")
      .$type<NotificationMetadata>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("notifications_user_read_created_idx").on(
      table.userId,
      table.read,
      table.createdAt,
    ),
    uniqueIndex("notifications_user_dedupe_idx").on(
      table.userId,
      table.dedupeKey,
    ),
  ],
);

export const selectNotificationSchema = createSelectSchema(notifications);
export const insertNotificationSchema = createInsertSchema(notifications);

export type Notification = z.infer<typeof selectNotificationSchema>;
export type NewNotification = z.infer<typeof insertNotificationSchema>;
