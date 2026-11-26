/**
 * POS fiscal receipts schema (eKasa, zákon 384/2025 Z. z. o evidencii tržieb)
 *
 * pos_fiscal_providers: one fiscal cash register (ORP) connection per company.
 * pos_fiscal_receipts: one fiscal receipt per completed POS order, queued for
 * registration with the provider (online UID or offline PKP/OKP).
 *
 * We hold no certified CHDÚ (chránené dátové úložisko): the certified ORP/SORP
 * or provider stores the legal copy. These rows are our normalized mirror and
 * the retry queue.
 */

import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "next-vibe/identity/user/db";

import { companies } from "@/companies/db";

import { posOrders } from "../db";
import {
  FiscalAdapterDB,
  FiscalDeviceKind,
  FiscalDeviceKindDB,
  FiscalReceiptStatus,
  FiscalReceiptStatusDB,
} from "./enum";
import type { FiscalReceiptData } from "./receipt-data";

/**
 * Default time to send an offline receipt to eKasa: 96 hours from the first
 * attempt (zákon 384/2025 § 3 ods. 1). Configurable per provider.
 */
export const DEFAULT_OFFLINE_DEADLINE_HOURS = 96;

/**
 * Provider settings. Never store secrets here: only a label or a reference
 * to where the key/certificate is kept (secret store, device keystore).
 */
export interface FiscalProviderSettings {
  credentialRef: string | null;
  offlineDeadlineHours: number;
}

export const posFiscalProviders = pgTable(
  "pos_fiscal_providers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    adapter: text("adapter", { enum: FiscalAdapterDB }).notNull(),
    deviceKind: text("device_kind", { enum: FiscalDeviceKindDB })
      .notNull()
      .default(FiscalDeviceKind.ORP),
    // kód pokladnice eKasa assigned by the Finančná správa
    cashRegisterCode: text("cash_register_code").notNull(),
    isEnabled: boolean("is_enabled").notNull().default(false),
    certifiedUntil: date("certified_until"),
    settings: jsonb("settings")
      .$type<FiscalProviderSettings>()
      .notNull()
      .default({
        credentialRef: null,
        offlineDeadlineHours: DEFAULT_OFFLINE_DEADLINE_HOURS,
      }),
    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [unique("uq_pos_fiscal_providers_company").on(table.companyId)],
);

export const posFiscalReceipts = pgTable(
  "pos_fiscal_receipts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    orderId: uuid("order_id")
      .notNull()
      .unique("uq_pos_fiscal_receipts_order")
      .references(() => posOrders.id, { onDelete: "restrict" }),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => posFiscalProviders.id, { onDelete: "restrict" }),
    status: text("status", { enum: FiscalReceiptStatusDB })
      .notNull()
      .default(FiscalReceiptStatus.PENDING),
    // poradové číslo dokladu, sequential per company
    receiptNumber: integer("receipt_number").notNull(),
    issuedAt: timestamp("issued_at").notNull(),
    payload: jsonb("payload").$type<FiscalReceiptData>().notNull(),
    uid: text("uid"),
    pkp: text("pkp"),
    okp: text("okp"),
    qrData: text("qr_data"),
    attempts: integer("attempts").notNull().default(0),
    lastError: text("last_error"),
    sendDeadline: timestamp("send_deadline"),
    // set by the queue the first time a receipt is still unregistered past sendDeadline
    deadlineMissedAt: timestamp("deadline_missed_at"),
    registeredAt: timestamp("registered_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_pos_fiscal_receipts_company_status").on(
      table.companyId,
      table.status,
    ),
    unique("uq_pos_fiscal_receipts_company_number").on(
      table.companyId,
      table.receiptNumber,
    ),
  ],
);

export type PosFiscalProvider = typeof posFiscalProviders.$inferSelect;
export type NewPosFiscalProvider = typeof posFiscalProviders.$inferInsert;
export type PosFiscalReceipt = typeof posFiscalReceipts.$inferSelect;
export type NewPosFiscalReceipt = typeof posFiscalReceipts.$inferInsert;
