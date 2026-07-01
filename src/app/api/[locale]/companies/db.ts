/**
 * Companies database schema
 * Defines the database tables for company management, membership, and CRM association
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { leads } from "next-vibe/identity/lead/db";
import type { z } from "zod";

import { users } from "../user/db";
import { CompanyMemberRole, CompanyMemberRoleDB, CompanyTypeDB } from "./enum";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */

/**
 * Companies Table
 * Core company entity — billing, legal, and organizational identity
 */
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type", { enum: CompanyTypeDB }).notNull(),
  vatNumber: text("vat_number"),
  taxId: text("tax_id"),
  registrationNumber: text("registration_number"),
  country: text("country"),
  currency: text("currency").default("EUR"),
  fiscalYearStart: integer("fiscal_year_start").default(1), // 1-12, month number

  // Address
  addressLine1: text("address_line1"),
  addressLine2: text("address_line2"),
  city: text("city"),
  region: text("region"),
  postalCode: text("postal_code"),

  // Contact
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  logoUrl: text("logo_url"),

  // Ownership
  ownerUserId: uuid("owner_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),

  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Company Members Table
 * Maps users to companies with a role — a user can belong to many companies
 */
export const companyMembers = pgTable(
  "company_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: CompanyMemberRoleDB })
      .notNull()
      .default(CompanyMemberRole.MEMBER),
    isActive: boolean("is_active").notNull().default(true),
    invitedByUserId: uuid("invited_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [unique("uq_company_member").on(table.companyId, table.userId)],
);

/**
 * Company Leads Table
 * Associates leads (prospects) with a company for CRM tracking
 */
export const companyLeads = pgTable(
  "company_leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    role: text("role").default("PROSPECT"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [unique("uq_company_lead").on(table.companyId, table.leadId)],
);

/**
 * Relations
 */
export const companiesRelations = relations(companies, ({ one, many }) => ({
  owner: one(users, {
    fields: [companies.ownerUserId],
    references: [users.id],
    relationName: "companyOwner",
  }),
  members: many(companyMembers),
  companyLeads: many(companyLeads),
}));

export const companyMembersRelations = relations(companyMembers, ({ one }) => ({
  company: one(companies, {
    fields: [companyMembers.companyId],
    references: [companies.id],
  }),
  user: one(users, {
    fields: [companyMembers.userId],
    references: [users.id],
    relationName: "companyMemberUser",
  }),
  invitedBy: one(users, {
    fields: [companyMembers.invitedByUserId],
    references: [users.id],
    relationName: "companyMemberInviter",
  }),
}));

export const companyLeadsRelations = relations(companyLeads, ({ one }) => ({
  company: one(companies, {
    fields: [companyLeads.companyId],
    references: [companies.id],
  }),
  lead: one(leads, {
    fields: [companyLeads.leadId],
    references: [leads.id],
  }),
}));

/**
 * Zod Schemas
 */
export const selectCompanySchema = createSelectSchema(companies);
export const insertCompanySchema = createInsertSchema(companies);

export const selectCompanyMemberSchema = createSelectSchema(companyMembers);
export const insertCompanyMemberSchema = createInsertSchema(companyMembers);

export const selectCompanyLeadSchema = createSelectSchema(companyLeads);
export const insertCompanyLeadSchema = createInsertSchema(companyLeads);

/**
 * Types
 */
export type Company = z.infer<typeof selectCompanySchema>;
export type NewCompany = z.infer<typeof insertCompanySchema>;

export type CompanyMember = z.infer<typeof selectCompanyMemberSchema>;
export type NewCompanyMember = z.infer<typeof insertCompanyMemberSchema>;

export type CompanyLead = z.infer<typeof selectCompanyLeadSchema>;
export type NewCompanyLead = z.infer<typeof insertCompanyLeadSchema>;
