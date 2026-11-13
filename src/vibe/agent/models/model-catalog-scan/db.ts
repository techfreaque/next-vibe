/**
 * Model Catalog Scan Database Schema
 * One row per scan: the full report (new upstream models, price drift,
 * removed and deprecated ids) plus whether the ops email went out. Prod never
 * edits code from this; a coding session reads it via the endpoint.
 */

import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import type { CatalogReport } from "./schema";

export const modelCatalogScans = pgTable(
  "model_catalog_scans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    newModelCount: integer("new_model_count").notNull().default(0),
    priceChangeCount: integer("price_change_count").notNull().default(0),
    missingCount: integer("missing_count").notNull().default(0),
    deprecationCount: integer("deprecation_count").notNull().default(0),
    sourceErrorCount: integer("source_error_count").notNull().default(0),
    report: jsonb("report").$type<CatalogReport>().notNull(),
    /** Recipients the report email reached (empty = not sent) */
    emailedTo: jsonb("emailed_to").$type<string[]>().notNull().default([]),
    emailError: text("email_error"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    createdAtIdx: index("model_catalog_scans_created_at_idx").on(
      table.createdAt,
    ),
  }),
);

export const selectModelCatalogScanSchema =
  createSelectSchema(modelCatalogScans);
export const insertModelCatalogScanSchema =
  createInsertSchema(modelCatalogScans);

export type ModelCatalogScan = z.infer<typeof selectModelCatalogScanSchema>;
export type NewModelCatalogScan = z.infer<typeof insertModelCatalogScanSchema>;
