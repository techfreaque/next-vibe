/**
 * Public Free-Tier Daily Cap Database Schema
 * Single-row table tracking the global daily spend cap for non-paying users
 */

import { customType, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

/**
 * Custom numeric type that returns numbers instead of strings
 */
const numericNumber = customType<{
  data: number;
  driverData: string;
}>({
  dataType() {
    return "numeric(10, 6)";
  },
  toDriver(value: number): string {
    return value.toString();
  },
  fromDriver(value: string): number {
    return Number(value);
  },
});

/**
 * Public Free-Tier Daily Cap Table
 *
 * ARCHITECTURE: Single row, always upserted on app start via seed.
 * - spendToday: incremented on every free-tier credit deduction
 * - capAmount: admin-configurable limit; default from PUBLIC_FREE_TIER_DAILY_CAP env var
 * - lastResetAt: timestamp of last midnight reset (done lazily or by cron)
 *
 * "Free-tier user" = pool where ALL wallets have balance === 0 (no paid credits).
 * Race conditions are intentionally ignored here — minor over-spend is acceptable.
 */
export const publicFreeTierDailyCap = pgTable("public_free_tier_daily_cap", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Running spend since lastResetAt — zeroed at midnight
  spendToday: numericNumber("spend_today").notNull().default(0),

  // Configurable daily limit (updated via POST endpoint)
  capAmount: numericNumber("cap_amount").notNull().default(500),

  // When spendToday was last zeroed (midnight server time)
  lastResetAt: timestamp("last_reset_at").defaultNow().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const selectPublicCapSchema = createSelectSchema(publicFreeTierDailyCap);
export const insertPublicCapSchema = createInsertSchema(publicFreeTierDailyCap);

export type PublicFreeTierDailyCap = z.infer<typeof selectPublicCapSchema>;
export type NewPublicFreeTierDailyCap = z.infer<typeof insertPublicCapSchema>;
