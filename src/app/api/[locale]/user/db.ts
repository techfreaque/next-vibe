/**
 * User database schema
 * Defines the structure of user-related tables
 */

import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { type CountryLanguage } from "@/i18n/core/config";

import { UserRoleDB } from "./user-roles/enum";

/**
 * Users table schema
 * NOTE: Users do NOT have a direct leadId - they can have multiple leads via user_leads table
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  privateName: text("private_name").notNull(),
  publicName: text("public_name").notNull(),

  locale: text("locale").$type<CountryLanguage>().notNull(),

  emailVerified: boolean("email_verified").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  marketingConsent: boolean("marketing_consent").default(false).notNull(),
  isBanned: boolean("is_banned").default(false).notNull(),
  bannedReason: text("banned_reason"),

  // Stripe integration
  stripeCustomerId: text("stripe_customer_id").unique(),

  // Avatar
  avatarUrl: text("avatar_url"),

  // Two-Factor Authentication
  twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
  twoFactorSecret: text("two_factor_secret"),

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
export type User = z.infer<typeof selectUserSchema> & {
  locale: CountryLanguage;
};

/**
 * Type for new user model
 */
export type NewUser = z.infer<typeof insertUserSchema> & {
  locale: CountryLanguage;
};

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
  // Note: userLeads relation is defined in leads/db.ts to avoid circular dependency
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
