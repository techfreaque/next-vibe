/**
 * Offline IP -> country database (one row per source).
 *
 * Kept in Postgres, not on disk: every app node (S1, S2, self-hosted) reads
 * the same copy, and only the task-runner node downloads updates.
 * `data` = gzip + base64 of the compact table (see ./compact.ts), ~2 MB.
 */

import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const geoIpDatabases = pgTable("geo_ip_databases", {
  /** Source id, e.g. "dbip-country-lite" */
  id: text("id").primaryKey(),
  /** Source release, e.g. "2026-11" */
  version: text("version").notNull(),
  data: text("data").notNull(),
  v4Ranges: integer("v4_ranges").notNull(),
  v6Ranges: integer("v6_ranges").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const selectGeoIpDatabaseSchema = createSelectSchema(geoIpDatabases);
export type GeoIpDatabase = z.infer<typeof selectGeoIpDatabaseSchema>;
