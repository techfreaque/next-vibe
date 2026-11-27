/**
 * Subscription provider switch tables
 *
 * subscription_provider_switches: one row per switch checkout. Holds the old
 * subscription, the carry-over rule and, once paid, the new period, so the
 * webhook and the success redirect (which can race) compute the same period
 * and only the first one cancels the old plan.
 *
 * subscription_switch_notices: the one-time "move your plan" mail. The unique
 * user_id is the send-once guarantee.
 */

import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "next-vibe/identity/user/db";

import { PaymentProviderDB } from "../../payment/enum";
import {
  OldPlanCancelModeDB,
  SwitchCarryOverDB,
  SwitchNoticeStatus,
  SwitchNoticeStatusDB,
  SwitchStatus,
  SwitchStatusDB,
} from "./enum";

export const subscriptionProviderSwitches = pgTable(
  "subscription_provider_switches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fromProvider: text("from_provider", { enum: PaymentProviderDB }).notNull(),
    fromSubscriptionId: text("from_subscription_id").notNull(),
    toProvider: text("to_provider", { enum: PaymentProviderDB }).notNull(),
    toSubscriptionId: text("to_subscription_id"),
    carryOver: text("carry_over", { enum: SwitchCarryOverDB }).notNull(),
    /** When billing on the new provider begins (old paid period end, or now). */
    billingStartAt: timestamp("billing_start_at", {
      withTimezone: true,
    }).notNull(),
    status: text("status", { enum: SwitchStatusDB })
      .notNull()
      .default(SwitchStatus.PENDING),
    cancelMode: text("cancel_mode", { enum: OldPlanCancelModeDB }),
    newPeriodStart: timestamp("new_period_start", { withTimezone: true }),
    newPeriodEnd: timestamp("new_period_end", { withTimezone: true }),
    cancelError: text("cancel_error"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("subscription_provider_switches_user_id_idx").on(table.userId),
    index("subscription_provider_switches_from_sub_idx").on(
      table.fromSubscriptionId,
    ),
  ],
);

export const subscriptionSwitchNotices = pgTable(
  "subscription_switch_notices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    subscriptionId: text("subscription_id").notNull(),
    status: text("status", { enum: SwitchNoticeStatusDB })
      .notNull()
      .default(SwitchNoticeStatus.SENDING),
    error: text("error"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
);

export type SubscriptionProviderSwitch =
  typeof subscriptionProviderSwitches.$inferSelect;
export type SubscriptionSwitchNotice =
  typeof subscriptionSwitchNotices.$inferSelect;
