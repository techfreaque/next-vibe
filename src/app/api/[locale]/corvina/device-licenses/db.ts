import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const corvinaDeviceSubscriptions = pgTable(
  "corvina_device_subscriptions",
  {
    id: serial("id").primaryKey(),
    logicalId: text("logical_id").notNull().unique(),
    orgResourceId: text("org_resource_id").notNull(),
    clientEmail: text("client_email"),
    trialStartDate: timestamp("trial_start_date"),
    subscriptionEndDate: timestamp("subscription_end_date"),
    reminderSentAt: timestamp("reminder_sent_at"),
    reminderCycleKey: text("reminder_cycle_key"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
);

export const corvinaPurchaseInquiries = pgTable("corvina_purchase_inquiries", {
  id: serial("id").primaryKey(),
  logicalId: text("logical_id").notNull(),
  orgResourceId: text("org_resource_id"),
  deviceLabel: text("device_label"),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  message: text("message"),
  requestedMonths: integer("requested_months"),
  status: text("status", { enum: ["new", "contacted", "completed"] })
    .notNull()
    .default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCorvinaDeviceSubscriptionSchema = createInsertSchema(
  corvinaDeviceSubscriptions,
);
export const selectCorvinaDeviceSubscriptionSchema = createSelectSchema(
  corvinaDeviceSubscriptions,
);
export const insertCorvinaPurchaseInquirySchema = createInsertSchema(
  corvinaPurchaseInquiries,
);
export const selectCorvinaPurchaseInquirySchema = createSelectSchema(
  corvinaPurchaseInquiries,
);

export type CorvinaDeviceSubscription = z.infer<
  typeof selectCorvinaDeviceSubscriptionSchema
>;
export type NewCorvinaDeviceSubscription = z.infer<
  typeof insertCorvinaDeviceSubscriptionSchema
>;
export type CorvinaPurchaseInquiry = z.infer<
  typeof selectCorvinaPurchaseInquirySchema
>;
export type NewCorvinaPurchaseInquiry = z.infer<
  typeof insertCorvinaPurchaseInquirySchema
>;

export type PurchaseInquiryStatusType = "new" | "contacted" | "completed";
