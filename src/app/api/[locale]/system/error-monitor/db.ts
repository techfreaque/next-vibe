/**
 * Error Logs Database Schema
 * Single table for all error monitoring - one row per unique error (fingerprint).
 * Privacy-first: messages and stack traces are truncated on write.
 * Cleaned up by a daily task (6-month / 100K row retention).
 */

import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import type { LoggerMetadata } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

/** Max characters for the truncated error message */
export const MAX_MESSAGE_LENGTH = 500;

/** Max characters for the truncated stack trace */
export const MAX_STACK_LENGTH = 1000;

/**
 * Error Logs Table
 * One row per unique error (fingerprint). Occurrences are counted, not duplicated.
 * On write: upsert by fingerprint - increment occurrences, update timestamp.
 * Resolve/reopen: flip the resolved flag on the single row.
 */
export const errorLogs = pgTable(
  "error_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    /** Truncated error message (max 500 chars) */
    message: text("message").notNull(),

    /** Error type classification (e.g. "INTERNAL_ERROR", "Error") */
    errorType: text("error_type"),

    /** Truncated stack trace - first few frames only (max 1000 chars) */
    stackTrace: text("stack_trace"),

    /** Raw logger metadata payload */
    metadata: jsonb("metadata").$type<LoggerMetadata[]>().default([]),

    /** Deduplication fingerprint - hash of errorType + message prefix (unique) */
    fingerprint: text("fingerprint").notNull().unique(),

    /** Number of occurrences this row represents (>1 after dedup merges) */
    occurrences: integer("occurrences").notNull().default(1),

    /** Whether this error has been resolved/acknowledged */
    resolved: boolean("resolved").notNull().default(false),

    /** When this error was first seen (set on INSERT, never updated) */
    firstSeen: timestamp("first_seen").defaultNow().notNull(),

    /** When this error was last seen (updated on each upsert) */
    createdAt: timestamp("created_at").defaultNow().notNull(),
    /** Log level */
    level: text("level", {
      enum: ["error", "warn"],
    })
      .notNull()
      .default("error"),
  },
  (table) => ({
    createdAtIdx: index("error_logs_created_at_idx").on(table.createdAt),
    errorTypeIdx: index("error_logs_error_type_idx").on(table.errorType),
    fingerprintIdx: uniqueIndex("error_logs_fingerprint_idx").on(
      table.fingerprint,
    ),
    resolvedIdx: index("error_logs_resolved_idx").on(table.resolved),
  }),
);

/**
 * Zod schemas for validation
 */
export const insertErrorLogSchema = createInsertSchema(errorLogs);
export const selectErrorLogSchema = createSelectSchema(errorLogs);

/**
 * Type exports
 */
export type ErrorLog = z.infer<typeof selectErrorLogSchema>;
export type NewErrorLog = z.infer<typeof insertErrorLogSchema>;
