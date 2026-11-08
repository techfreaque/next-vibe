/**
 * Lifecycle Journeys Database Schema
 *
 * lifecycle_enrollments: one row per (contact email, journey). Unique, so a contact
 * can never be enrolled twice in the same journey. A partial unique index allows
 * only ONE active enrollment per contact.
 * lifecycle_sends: one row per (enrollment, step). Unique, so a step can never be
 * sent twice. The row is claimed BEFORE the mail leaves.
 * lifecycle_settings: single global row. Defaults to PAUSED.
 */

import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { leads } from "next-vibe/identity/lead/db";
import { users } from "next-vibe/identity/user/db";
import type { z } from "zod";

import {
  LifecycleEnrollmentStatus,
  LifecycleEnrollmentStatusDB,
  LifecycleExitReasonDB,
  LifecycleJourneyDB,
  LifecycleSendStatus,
  LifecycleSendStatusDB,
} from "./enum";

export const lifecycleEnrollments = pgTable(
  "lifecycle_enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Lower-cased contact email - the identity of a contact. */
    email: text("email").notNull(),
    journey: text("journey", { enum: LifecycleJourneyDB }).notNull(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    leadId: uuid("lead_id").references(() => leads.id, {
      onDelete: "set null",
    }),
    locale: text("locale").$type<CountryLanguage>().notNull(),
    status: text("status", { enum: LifecycleEnrollmentStatusDB })
      .notNull()
      .default(LifecycleEnrollmentStatus.ACTIVE),
    /** Number of steps already sent == index of the next step. */
    nextStep: integer("next_step").notNull().default(0),
    nextDueAt: timestamp("next_due_at", { withTimezone: true }).notNull(),
    lastSentAt: timestamp("last_sent_at", { withTimezone: true }),
    failCount: integer("fail_count").notNull().default(0),
    exitReason: text("exit_reason", { enum: LifecycleExitReasonDB }),
    exitedAt: timestamp("exited_at", { withTimezone: true }),
    /** Set when the journey goal was reached (first chat, purchase, signup). */
    convertedAt: timestamp("converted_at", { withTimezone: true }),
    fromBackfill: boolean("from_backfill").notNull().default(false),
    enrolledAt: timestamp("enrolled_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_lifecycle_enrollment_email_journey").on(
      table.email,
      table.journey,
    ),
    uniqueIndex("uq_lifecycle_enrollment_one_active")
      .on(table.email)
      .where(
        sql`${table.status} = ${sql.raw(`'${LifecycleEnrollmentStatus.ACTIVE}'`)}`,
      ),
    index("idx_lifecycle_enrollment_due").on(table.status, table.nextDueAt),
    index("idx_lifecycle_enrollment_user").on(table.userId),
  ],
);

export const lifecycleSends = pgTable(
  "lifecycle_sends",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enrollmentId: uuid("enrollment_id")
      .notNull()
      .references(() => lifecycleEnrollments.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    step: integer("step").notNull(),
    status: text("status", { enum: LifecycleSendStatusDB })
      .notNull()
      .default(LifecycleSendStatus.PENDING),
    messageId: text("message_id"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_lifecycle_send_enrollment_step").on(
      table.enrollmentId,
      table.step,
    ),
    index("idx_lifecycle_send_email").on(table.email, table.sentAt),
  ],
);

export const lifecycleSettings = pgTable("lifecycle_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  /** Global kill switch. TRUE = nothing is enrolled or sent. Default TRUE. */
  paused: boolean("paused").notNull().default(true),
  minHoursBetweenEmails: integer("min_hours_between_emails")
    .notNull()
    .default(48),
  /** Throttle: max lifecycle emails per task run. */
  maxSendsPerRun: integer("max_sends_per_run").notNull().default(25),
  /** Registered users need marketing consent (or a confirmed newsletter opt-in). */
  requireUserMarketingConsent: boolean("require_user_marketing_consent")
    .notNull()
    .default(true),
  /** The scheduled task only auto-enrolls contacts whose trigger is this recent. Older ones go through the backfill. */
  autoEnrollWindowDays: integer("auto_enroll_window_days")
    .notNull()
    .default(14),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const selectLifecycleEnrollmentSchema =
  createSelectSchema(lifecycleEnrollments);
export const insertLifecycleEnrollmentSchema =
  createInsertSchema(lifecycleEnrollments);
export const selectLifecycleSendSchema = createSelectSchema(lifecycleSends);
export const selectLifecycleSettingsSchema =
  createSelectSchema(lifecycleSettings);

export type LifecycleEnrollment = typeof lifecycleEnrollments.$inferSelect;
export type NewLifecycleEnrollment = z.infer<
  typeof insertLifecycleEnrollmentSchema
>;
export type LifecycleSend = z.infer<typeof selectLifecycleSendSchema>;
export type LifecycleSettings = z.infer<typeof selectLifecycleSettingsSchema>;
