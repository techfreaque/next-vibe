/**
 * Error Logs Database Schema
 * Stores truncated backend error logs for monitoring.
 * Privacy-first: messages and stack traces are truncated on write.
 * Cleaned up by a daily task (7-day retention).
 */

import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

/** Max characters for the truncated error message */
export const MAX_MESSAGE_LENGTH = 500;

/** Max characters for the truncated stack trace */
export const MAX_STACK_LENGTH = 1000;

/**
 * Error log source — where the error originated
 */
export const ErrorLogSourceDB = ["backend", "task", "chat"] as const;

/**
 * Error log level
 */
export const ErrorLogLevelDB = ["error", "warn"] as const;

/**
 * Structured metadata for error logs (privacy-safe, no PII)
 */
interface ErrorLogMetadata {
  /** HTTP status code if applicable */
  statusCode?: number;
  /** Model ID if AI-related */
  model?: string;
  /** Tool name if tool-related */
  tool?: string;
  /** Task ID if task-related */
  taskId?: string;
  /** Thread ID if chat-related */
  threadId?: string;
  /** Additional key-value pairs */
  [key: string]: string | number | boolean | undefined;
}

/**
 * Error Logs Table
 * Stores truncated backend errors for monitoring and pattern detection.
 */
export const errorLogs = pgTable(
  "error_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    /** Where the error originated */
    source: text("source", { enum: ErrorLogSourceDB }).notNull(),

    /** Error severity level */
    level: text("level", { enum: ErrorLogLevelDB }).notNull(),

    /** Truncated error message (max 500 chars) */
    message: text("message").notNull(),

    /** The API endpoint or task that produced the error */
    endpoint: text("endpoint"),

    /** Error type classification (e.g. "INTERNAL_ERROR", "VALIDATION_FAILED") */
    errorType: text("error_type"),

    /** HTTP status code or error code */
    errorCode: text("error_code"),

    /** Truncated stack trace — first few frames only (max 1000 chars) */
    stackTrace: text("stack_trace"),

    /** Structured metadata — no PII, just classification data */
    metadata: jsonb("metadata").$type<ErrorLogMetadata>().default({}),

    /** When the error occurred */
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    createdAtIdx: index("error_logs_created_at_idx").on(table.createdAt),
    sourceIdx: index("error_logs_source_idx").on(table.source),
    endpointIdx: index("error_logs_endpoint_idx").on(table.endpoint),
    errorTypeIdx: index("error_logs_error_type_idx").on(table.errorType),
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
