import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { ContactStatus, ContactStatusDB } from "./enum";

// Database enums

/**
 * Contact table schema
 * Database schema for contact form submissions
 */
export const contacts = pgTable("contact", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status", { enum: ContactStatusDB }).notNull().default(ContactStatus.NEW),
  userId: uuid("user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Zod schemas for contact table
 */
export const insertContactSchema = createInsertSchema(contacts);
export const selectContactSchema = createSelectSchema(contacts);

/**
 * TypeScript types
 */
export type Contact = z.infer<typeof selectContactSchema>;
export type NewContact = z.infer<typeof insertContactSchema>;

// Legacy exports for backward compatibility
export const contactTable = contacts;
export type InsertContactType = NewContact;
export type SelectContactType = Contact;
