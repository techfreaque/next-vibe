/**
 * User database schema
 * Defines the structure of user-related tables
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { PreferredContactMethod, PreferredContactMethodDB } from "./enum";
import { UserRoleDB } from "./user-roles/enum";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */

/**
 * Users table schema
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id").unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  company: text("company").notNull(),
  phone: text("phone"),
  preferredContactMethod: text("preferred_contact_method", { enum: PreferredContactMethodDB })
    .notNull()
    .default(PreferredContactMethod.EMAIL),
  imageUrl: text("image_url"),

  // Profile information
  bio: text("bio"),
  website: text("website"),
  jobTitle: text("job_title"),
  emailVerified: boolean("email_verified").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),

  // Stripe integration
  stripeCustomerId: text("stripe_customer_id").unique(),

  // Audit fields
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Schema for selecting users
 */
export const selectUserSchema = createSelectSchema(users);

/**
 * Schema for inserting users
 */
export const insertUserSchema = createInsertSchema(users);

/**
 * Type for user model
 */
export type User = z.infer<typeof selectUserSchema>;

/**
 * Type for new user model
 */
export type NewUser = z.infer<typeof insertUserSchema>;

/**
 * User roles table schema
 */
export const userRoles = pgTable("user_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  role: text("role", { enum: UserRoleDB }).notNull(),
  assignedBy: uuid("assigned_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Schema for selecting user roles
 */
export const selectUserRoleSchema = createSelectSchema(userRoles);

/**
 * Schema for inserting user roles
 */
export const insertUserRoleSchema = createInsertSchema(userRoles);

/**
 * Type for user role model
 */
export type UserRole = z.infer<typeof selectUserRoleSchema>;

/**
 * Type for new user role model
 */
export type NewUserRole = z.infer<typeof insertUserRoleSchema>;

/**
 * User relations
 */
export const usersRelations = relations(users, ({ many }) => ({
  roles: many(userRoles),
}));

/**
 * User roles relations
 */
export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
}));
