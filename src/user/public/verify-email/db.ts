// One dispatch per account and address. The row also prevents repeat banner mail.
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "next-vibe/identity/user/db";

export const accountEmailChallenges = pgTable("account_email_challenges", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  codeHash: text("code_hash").notNull(),
  sentAt: timestamp("sent_at").notNull(),
  attempts: integer("attempts").notNull().default(0),
  messageId: text("message_id"),
  deliveryFailed: boolean("delivery_failed").notNull().default(false),
  bounced: boolean("bounced").notNull().default(false),
});
