/**
 * Business Info Database Schema
 * Business information table
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "../../user/db";
import {
  BusinessSize,
  BusinessSizeDB,
  BusinessType,
  BusinessTypeDB,
  Industry,
  IndustryDB,
} from "./enum";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */

/**
 * Business Info Database Schema
 * Business information table
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "../../user/db";
import {
  BusinessSize,
  BusinessSizeDB,
  BusinessType,
  BusinessTypeDB,
  Industry,
  IndustryDB,
} from "./enum";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */

/**
 * Business Info Database Schema
 * Core business information table
 */

import {
  integer,
  
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "@/app/api/[locale]/v1/core/user/db";

import { BusinessSizeDB, BusinessTypeDB, IndustryDB } from "./enum";

// Create database enums

/**
 * Business Info table for storing core business information
 * Handles basic business details for the business info form
 */
export const businessInfo = pgTable("business_info", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Core business information
  // companyName comes from users.company
  industry: text("industry", { enum: IndustryDB }), // technology, healthcare, retail, etc.
  businessType: text("business_type", { enum: BusinessTypeDB }), // agency, consulting, corporation, etc.
  businessSize: text("business_size", { enum: BusinessSizeDB }), // startup, small, medium, large, enterprise
  foundedYear: integer("founded_year"), // year as integer
  employeeCount: integer("employee_count"), // number of employees
  // Contact information
  businessEmail: text("business_email"), // business contact email
  businessPhone: text("business_phone"), // business phone number

  // Location details
  location: text("location"), // legacy combined location
  country: text("country"), // specific country
  city: text("city"), // specific city
  // website comes from users.website

  // Additional details
  description: text("description"), // business description
  productsServices: text("products_services"), // what they offer
  additionalNotes: text("additional_notes"), // extra information

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Zod Schemas
 */
export const selectBusinessInfoSchema = createSelectSchema(businessInfo);
export const insertBusinessInfoSchema = createInsertSchema(businessInfo);

/**
 * Types
 */
export type BusinessInfo = z.infer<typeof selectBusinessInfoSchema>;
export type NewBusinessInfo = z.infer<typeof insertBusinessInfoSchema>;
