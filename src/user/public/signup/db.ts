import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { leads } from "next-vibe/identity/lead/db";

import { SignupBounceReasonDB } from "./bounce-reason";
import type { SignupPostRequestOutput } from "./definition";

export const pendingSignups = pgTable(
  "pending_signups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    privateName: text("private_name").notNull(),
    publicName: text("public_name").notNull(),
    subscribeToNewsletter: boolean("subscribe_to_newsletter").notNull(),
    referralCode: text("referral_code"),
    supportedSkillId: uuid("supported_skill_id"),
    localFavorites:
      jsonb("local_favorites").$type<
        NonNullable<SignupPostRequestOutput["localFavorites"]>
      >(),
    callbackUrl: text("callback_url"),
    locale: text("locale").$type<CountryLanguage>().notNull(),
    signupIp: text("signup_ip"),
    codeHash: text("code_hash").notNull(),
    tokenHash: text("token_hash").notNull().unique(),
    attempts: integer("attempts").notNull().default(0),
    expiresAt: timestamp("expires_at").notNull(),
    sentAt: timestamp("sent_at").notNull(),
    messageId: text("message_id"),
    deliveryFailed: boolean("delivery_failed").notNull().default(false),
    bounced: boolean("bounced").notNull().default(false),
    bounceReason: text("bounce_reason", { enum: SignupBounceReasonDB }),
  },
  (table) => [
    index("pending_signups_email_idx").on(table.email),
    index("pending_signups_expiry_idx").on(table.expiresAt),
  ],
);

export type PendingSignup = typeof pendingSignups.$inferSelect;

// One short-lived row per lead, address and IP for each dispatch. Rotation
// and address correction must share the same rolling budgets as initial mail.
export const signupMailAttempts = pgTable(
  "signup_mail_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scope: text("scope").notNull(),
    sentAt: timestamp("sent_at").notNull(),
  },
  (table) => [
    index("signup_mail_scope_time_idx").on(table.scope, table.sentAt),
    index("signup_mail_time_idx").on(table.sentAt),
  ],
);
