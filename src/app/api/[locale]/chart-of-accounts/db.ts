/**
 * Chart of Accounts database schema
 * Double-entry accounting foundation: templates, account nodes, periods, journal entries
 */

import {
  boolean,
  customType,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "next-vibe/identity/user/db";
import type { z } from "zod";

import {
  AccountSubtypeDB,
  AccountTypeDB,
  JournalEntryStatus,
  JournalEntryStatusDB,
  JournalSourceType,
  JournalSourceTypeDB,
  LineTypeDB,
  PeriodStatus,
  PeriodStatusDB,
} from "./enum";

/**
 * Custom numeric type that returns numbers instead of strings
 * Used for monetary amounts - numeric(14, 4) for high-precision accounting
 */
const numericNumber = customType<{
  data: number;
  driverData: string;
}>({
  dataType() {
    return "numeric(14, 4)";
  },
  toDriver(value: number): string {
    return value.toString();
  },
  fromDriver(value: string): number {
    return Number(value);
  },
});

/**
 * CoA Templates table
 * Built-in country-specific chart of accounts templates (seeded, not per-company)
 */
export const coaTemplates = pgTable("coa_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  country: text("country").notNull(), // "AT" | "DE" | "XX"
  name: text("name").notNull(),
  description: text("description"),
  isDefault: boolean("is_default").notNull().default(false),
  version: text("version").notNull().default("1.0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * CoA Template Nodes table
 * The actual account definitions within a template
 */
export const coaTemplateNodes = pgTable(
  "coa_template_nodes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    templateId: uuid("template_id")
      .notNull()
      .references(() => coaTemplates.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    name: text("name").notNull(),
    nameDe: text("name_de"),
    namePl: text("name_pl"),
    type: text("type", { enum: AccountTypeDB }).notNull(),
    subtype: text("subtype", { enum: AccountSubtypeDB }).notNull(),
    parentCode: text("parent_code"), // references another node's code in same template
    isPostable: boolean("is_postable").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [unique("uq_template_node_code").on(table.templateId, table.code)],
);

/**
 * Account Nodes table
 * Per-company chart of accounts (copied from template + custom accounts)
 * Note: companyId is plain uuid until companies module is created (Wave 1A)
 */
export const accountNodes = pgTable(
  "account_nodes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull(),
    templateNodeId: uuid("template_node_id").references(
      () => coaTemplateNodes.id,
      { onDelete: "set null" },
    ),
    code: text("code").notNull(),
    name: text("name").notNull(),
    type: text("type", { enum: AccountTypeDB }).notNull(),
    subtype: text("subtype", { enum: AccountSubtypeDB }).notNull(),
    parentId: uuid("parent_id"), // self-reference; resolved in application layer
    isPostable: boolean("is_postable").notNull().default(true),
    isActive: boolean("is_active").notNull().default(true),
    isSystem: boolean("is_system").notNull().default(false),
    description: text("description"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("uq_account_node_code").on(table.companyId, table.code),
    index("idx_account_nodes_company").on(table.companyId),
    index("idx_account_nodes_parent").on(table.parentId),
  ],
);

/**
 * Accounting Periods table
 * Fiscal periods per company
 * Note: companyId is plain uuid until companies module is created
 */
export const accountingPeriods = pgTable(
  "accounting_periods",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull(),
    name: text("name").notNull(), // e.g. "January 2026"
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    status: text("status", { enum: PeriodStatusDB })
      .notNull()
      .default(PeriodStatus.OPEN),
    closedAt: timestamp("closed_at"),
    closedByUserId: uuid("closed_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("idx_accounting_periods_company").on(table.companyId)],
);

/**
 * Journal Entries table
 * One entry per financial event
 */
export const journalEntries = pgTable(
  "journal_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull(),
    periodId: uuid("period_id")
      .notNull()
      .references(() => accountingPeriods.id, { onDelete: "restrict" }),
    entryNumber: text("entry_number").notNull(),
    date: timestamp("date").notNull(),
    description: text("description").notNull(),
    memo: text("memo"),
    status: text("status", { enum: JournalEntryStatusDB })
      .notNull()
      .default(JournalEntryStatus.DRAFT),
    reversalOfId: uuid("reversal_of_id"), // self-reference; resolved in application layer
    reversedById: uuid("reversed_by_id"), // self-reference; resolved in application layer
    postedAt: timestamp("posted_at"),
    postedByUserId: uuid("posted_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    sourceType: text("source_type", { enum: JournalSourceTypeDB })
      .notNull()
      .default(JournalSourceType.MANUAL),
    sourceId: uuid("source_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_journal_entries_company_period").on(
      table.companyId,
      table.periodId,
    ),
    index("idx_journal_entries_company_date").on(table.companyId, table.date),
    index("idx_journal_entries_source").on(table.sourceId),
  ],
);

/**
 * Journal Entry Lines table
 * Debit/credit lines — must balance per entry (total debits = total credits)
 */
export const journalEntryLines = pgTable(
  "journal_entry_lines",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    journalEntryId: uuid("journal_entry_id")
      .notNull()
      .references(() => journalEntries.id, { onDelete: "cascade" }),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accountNodes.id, { onDelete: "restrict" }),
    type: text("type", { enum: LineTypeDB }).notNull(),
    amount: numericNumber("amount").notNull(), // always positive
    currency: text("currency").notNull(),
    description: text("description"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_journal_entry_lines_entry_sort").on(
      table.journalEntryId,
      table.sortOrder,
    ),
    index("idx_journal_entry_lines_account").on(table.accountId),
  ],
);

// ---- Zod schemas ----

export const insertCoaTemplateSchema = createInsertSchema(coaTemplates);
export const selectCoaTemplateSchema = createSelectSchema(coaTemplates);

export const insertCoaTemplateNodeSchema = createInsertSchema(coaTemplateNodes);
export const selectCoaTemplateNodeSchema = createSelectSchema(coaTemplateNodes);

export const insertAccountNodeSchema = createInsertSchema(accountNodes);
export const selectAccountNodeSchema = createSelectSchema(accountNodes);

export const insertAccountingPeriodSchema =
  createInsertSchema(accountingPeriods);
export const selectAccountingPeriodSchema =
  createSelectSchema(accountingPeriods);

export const insertJournalEntrySchema = createInsertSchema(journalEntries);
export const selectJournalEntrySchema = createSelectSchema(journalEntries);

export const insertJournalEntryLineSchema =
  createInsertSchema(journalEntryLines);
export const selectJournalEntryLineSchema =
  createSelectSchema(journalEntryLines);

// ---- Types ----

export type CoaTemplate = z.infer<typeof selectCoaTemplateSchema>;
export type NewCoaTemplate = z.infer<typeof insertCoaTemplateSchema>;

export type CoaTemplateNode = z.infer<typeof selectCoaTemplateNodeSchema>;
export type NewCoaTemplateNode = z.infer<typeof insertCoaTemplateNodeSchema>;

export type AccountNode = z.infer<typeof selectAccountNodeSchema>;
export type NewAccountNode = z.infer<typeof insertAccountNodeSchema>;

export type AccountingPeriod = z.infer<typeof selectAccountingPeriodSchema>;
export type NewAccountingPeriod = z.infer<typeof insertAccountingPeriodSchema>;

export type JournalEntry = z.infer<typeof selectJournalEntrySchema>;
export type NewJournalEntry = z.infer<typeof insertJournalEntrySchema>;

export type JournalEntryLine = z.infer<typeof selectJournalEntryLineSchema>;
export type NewJournalEntryLine = z.infer<typeof insertJournalEntryLineSchema>;
