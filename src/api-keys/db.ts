/**
 * User API keys - programmatic access to the OpenAI-compatible /v1 API.
 * Only the SHA-256 hash of a key is stored. The plaintext is shown once at creation.
 */

import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "next-vibe/identity/user/db";

export const userApiKeys = pgTable(
  "user_api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    /** Display prefix (first characters of the key) - safe to show in lists. */
    keyPrefix: text("key_prefix").notNull(),
    /** SHA-256 hex of the full key. Unique: lookup column for auth. */
    hashedKey: text("hashed_key").notNull().unique(),
    lastUsedAt: timestamp("last_used_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    revokedAt: timestamp("revoked_at"),
    /** Per-key request limit (requests per minute). */
    rateLimitPerMinute: integer("rate_limit_per_minute").notNull().default(60),
  },
  (table) => [index("user_api_keys_user_id_idx").on(table.userId)],
);

export type UserApiKey = typeof userApiKeys.$inferSelect;
export type NewUserApiKey = typeof userApiKeys.$inferInsert;
