/**
 * Consultation Database Schema
 * Consultation booking and management
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "../user/db";
import {
  ConsultationOutcome,
  ConsultationOutcomeDB,
  ConsultationStatus,
  ConsultationStatusDB,
} from "./enum";
import { leads } from "../leads/db";

/**
 * Consultations table schema
 * Defines the structure of the consultations table in the database
 */
export const consultations = pgTable("consultations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  leadId: uuid("lead_id").references(() => leads.id),
  status: text("status", { enum: ConsultationStatusDB })
    .notNull()
    .default(ConsultationStatus.PENDING),
  preferredDate: timestamp("preferred_date"),
  preferredTime: text("preferred_time"),
  message: text("message"),
  isNotified: boolean("is_notified").notNull().default(false),
  scheduledDate: timestamp("scheduled_date"),
  scheduledTime: text("scheduled_time"),

  // Calendar integration fields
  calendarEventId: text("calendar_event_id"),
  meetingLink: text("meeting_link"),
  icsAttachment: text("ics_attachment"), // Base64 encoded ICS file

  // Stats tracking fields
  revenue: decimal("revenue", { precision: 10, scale: 2 }), // Revenue generated from consultation
  durationMinutes: integer("duration_minutes"), // Actual consultation duration
  outcome: text("outcome", { enum: ConsultationOutcomeDB }), // Consultation outcome (successful_conversion, follow_up_needed, etc.)
  consultantId: uuid("consultant_id").references(() => users.id), // Consultant who handled the consultation
  consultantName: text("consultant_name"), // Consultant name for performance tracking
  clientSatisfaction: decimal("client_satisfaction", {
    precision: 3,
    scale: 2,
  }), // Client satisfaction score (0-10)

  // Event timestamps for stats tracking
  completedAt: timestamp("completed_at"),
  cancelledAt: timestamp("cancelled_at"),
  noShowAt: timestamp("no_show_at"),
  rescheduledAt: timestamp("rescheduled_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schemas for validation with Zod
export const insertConsultationSchema = createInsertSchema(consultations);
export const selectConsultationSchema = createSelectSchema(consultations);

// Type definitions
export type Consultation = z.infer<typeof selectConsultationSchema>;
export type NewConsultation = z.infer<typeof insertConsultationSchema>;
