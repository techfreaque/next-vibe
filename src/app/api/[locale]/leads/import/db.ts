/**
 * CSV Import Database Schema
 * Database tables for CSV import functionality
 */

import { relations } from "drizzle-orm";
import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { CountriesArr, LanguagesArr } from "@/i18n/core/config";

import { users } from "../../user/db";
import {
  EmailCampaignStage,
  EmailCampaignStageDB,
  LeadSource,
  LeadSourceDB,
  LeadStatus,
  LeadStatusDB,
} from "../enum";
import { CsvImportJobStatus, CsvImportJobStatusDB } from "./enum";

/**
 * CSV Import Jobs Table
 * Stores CSV files for chunked processing
 */
export const csvImportJobs = pgTable("csv_import_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  fileName: text("file_name").notNull(),
  fileContent: text("file_content").notNull(), // Base64 encoded CSV content
  uploadedBy: uuid("uploaded_by")
    .notNull()
    .references(() => users.id),

  // Processing configuration
  skipDuplicates: boolean("skip_duplicates").notNull().default(true),
  updateExisting: boolean("update_existing").notNull().default(false),
  defaultCountry: text("default_country", { enum: CountriesArr }).notNull(),
  defaultLanguage: text("default_language", { enum: LanguagesArr }).notNull(),
  defaultStatus: text("default_status", { enum: LeadStatusDB }).notNull().default(LeadStatus.NEW),
  defaultCampaignStage: text("default_campaign_stage", {
    enum: EmailCampaignStageDB,
  })
    .notNull()
    .default(EmailCampaignStage.NOT_STARTED),
  defaultSource: text("default_source", { enum: LeadSourceDB })
    .notNull()
    .default(LeadSource.CSV_IMPORT),

  // Processing status
  status: text("status", { enum: CsvImportJobStatusDB })
    .notNull()
    .default(CsvImportJobStatus.PENDING),
  totalRows: integer("total_rows"),
  processedRows: integer("processed_rows").notNull().default(0),
  successfulImports: integer("successful_imports").notNull().default(0),
  failedImports: integer("failed_imports").notNull().default(0),
  duplicateEmails: integer("duplicate_emails").notNull().default(0),

  // Processing metadata
  currentBatchStart: integer("current_batch_start").notNull().default(0),
  batchSize: integer("batch_size").notNull().default(2000),
  importErrors: jsonb("import_errors").$type<string[]>().notNull().default([]),
  importSummary: jsonb("import_summary")
    .$type<Record<string, string | number | boolean>>()
    .notNull()
    .default({}),

  // Error handling
  error: text("error"),
  retryCount: integer("retry_count").notNull().default(0),
  maxRetries: integer("max_retries").notNull().default(3),

  // Domain information (which domain this import is for)
  domain: text("domain").notNull(), // e.g., "leads", "contacts", "users"
  domainConfig: jsonb("domain_config")
    .$type<Record<string, string | number | boolean | null>>()
    .notNull()
    .default({}),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

/**
 * Import Batches Table
 * Tracks immediate (non-chunked) imports and their results
 */
export const importBatches = pgTable("import_batches", {
  id: uuid("id").primaryKey().defaultRandom(),
  fileName: text("file_name").notNull(),
  uploadedBy: uuid("uploaded_by")
    .notNull()
    .references(() => users.id),

  // Processing results
  totalRows: integer("total_rows").notNull(),
  successfulImports: integer("successful_imports").notNull().default(0),
  failedImports: integer("failed_imports").notNull().default(0),
  duplicateEmails: integer("duplicate_emails").notNull().default(0),
  importErrors: jsonb("import_errors").$type<string[]>().notNull().default([]),
  importSummary: jsonb("import_summary")
    .$type<Record<string, string | number | boolean>>()
    .notNull()
    .default({}),

  // Domain information
  domain: text("domain").notNull(), // e.g., "leads", "contacts", "users"
  domainConfig: jsonb("domain_config")
    .$type<Record<string, string | number | boolean | null>>()
    .notNull()
    .default({}),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Relations
 */
export const csvImportJobsRelations = relations(csvImportJobs, ({ one }) => ({
  uploadedByUser: one(users, {
    fields: [csvImportJobs.uploadedBy],
    references: [users.id],
  }),
}));

export const importBatchesRelations = relations(importBatches, ({ one }) => ({
  uploadedByUser: one(users, {
    fields: [importBatches.uploadedBy],
    references: [users.id],
  }),
}));

/**
 * Zod Schemas
 */
export const selectCsvImportJobSchema = createSelectSchema(csvImportJobs);
export const insertCsvImportJobSchema = createInsertSchema(csvImportJobs);
export const selectImportBatchSchema = createSelectSchema(importBatches);
export const insertImportBatchSchema = createInsertSchema(importBatches);

/**
 * Types
 */
export type CsvImportJob = typeof csvImportJobs.$inferSelect;
export type NewCsvImportJob = typeof csvImportJobs.$inferInsert;
export type ImportBatch = typeof importBatches.$inferSelect;
export type NewImportBatch = typeof importBatches.$inferInsert;
