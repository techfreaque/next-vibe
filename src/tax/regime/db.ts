import {
  date,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "next-vibe/identity/user/db";

import { companies } from "@/companies/db";

import { CompanyTaxRegimeDB } from "./enum";

export const companyTaxRegimes = pgTable(
  "company_tax_regimes",
  {
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    effectiveFrom: date("effective_from").notNull(),
    regime: text("regime", { enum: CompanyTaxRegimeDB }).notNull(),
    recordedBy: uuid("recorded_by").references(() => users.id, {
      onDelete: "set null",
    }),
    recordedAt: timestamp("recorded_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.companyId, table.effectiveFrom] })],
);
