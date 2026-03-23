/**
 * Vibe Frame - Database Schema
 *
 * Exchange tokens: short-lived (30s), single-use tokens that the config API
 * mints server-side and embeds in iframe URLs. Middleware redeems them on first
 * request to set lead_id + auth cookies without exposing real secrets in URLs.
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { leads } from "../../../leads/db";

export const frameExchangeTokens = pgTable("frame_exchange_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),

  /**
   * The lead this token was minted for.
   * Nullable: if the host page doesn't provide a leadId, the middleware
   * creates a new lead on first iframe load (token carries only authToken).
   */
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }),

  /** Opaque random token embedded in ?et= URL param */
  token: text("token").notNull().unique(),

  /** JWT auth token to set as cookie on redemption (optional - public users have none) */
  authToken: text("auth_token"),

  /** Token expires 30 seconds after minting */
  expiresAt: timestamp("expires_at").notNull(),

  /** Set when token is redeemed - prevents replay */
  usedAt: timestamp("used_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const selectFrameExchangeTokenSchema =
  createSelectSchema(frameExchangeTokens);
export const insertFrameExchangeTokenSchema =
  createInsertSchema(frameExchangeTokens);

export type FrameExchangeToken = z.infer<typeof selectFrameExchangeTokenSchema>;
export type NewFrameExchangeToken = z.infer<
  typeof insertFrameExchangeTokenSchema
>;
