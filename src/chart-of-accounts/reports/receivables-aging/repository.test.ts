import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";

import { InvoiceStatus } from "@/payment/enum";

import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
} from "../../enum";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));
const company = crypto.randomUUID();
const other = crypto.randomUUID();
const customer = crypto.randomUUID();
const openInvoice = crypto.randomUUID();
const account = crypto.randomUUID();
const receipt = crypto.randomUUID();
const user: JwtPrivatePayloadType = {
  id: crypto.randomUUID(),
  leadId: crypto.randomUUID(),
  roles: [UserRole.ADMIN],
  isPublic: false,
};
const logger = createEndpointLogger(false, defaultLocale);

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE companies (id uuid PRIMARY KEY, name text, currency text, is_active boolean);
    CREATE TABLE company_members (company_id uuid, user_id uuid, is_active boolean);
    CREATE TABLE users (id uuid PRIMARY KEY, public_name text);
    CREATE TABLE payment_invoices (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid, invoice_number text,
      invoice_sequence_number int, amount numeric(10,2), currency text, status text, due_date timestamp, metadata jsonb);
    CREATE TABLE account_nodes (id uuid PRIMARY KEY, company_id uuid, subtype text);
    CREATE TABLE journal_entries (id uuid PRIMARY KEY, source_id uuid, source_type text, company_id uuid, status text, reversal_of_id uuid, reversed_by_id uuid);
    CREATE TABLE journal_entry_lines (account_id uuid, journal_entry_id uuid, amount numeric, currency text, type text);
    INSERT INTO companies VALUES ('${company}', 'Demo Co', 'EUR', true), ('${other}', 'Another Co', 'EUR', true);
    INSERT INTO company_members VALUES ('${company}', '${user.id}', true);
    INSERT INTO users VALUES ('${customer}', 'Atelier Nord');
    INSERT INTO payment_invoices (id, company_id, amount, currency, status, due_date, metadata, invoice_sequence_number)
      VALUES ('${openInvoice}', '${company}', 100.99, 'EUR', '${InvoiceStatus.OPEN}', '2026-11-24 20:59', '{"customerId":"${customer}"}', 42);
    INSERT INTO payment_invoices (company_id, amount, currency, status, due_date, metadata) VALUES
      ('${company}', -10.10, 'EUR', '${InvoiceStatus.OPEN}', null, '{"originalInvoiceId":"${openInvoice}"}'),
      ('${other}', -80, 'EUR', '${InvoiceStatus.OPEN}', null, '{"originalInvoiceId":"${openInvoice}"}'),
      ('${company}', 0.10, 'EUR', '${InvoiceStatus.OPEN}', '2026-11-25 23:59', null),
      ('${company}', 0.20, 'EUR', '${InvoiceStatus.OPEN}', null, null),
      ('${company}', 95, 'USD', '${InvoiceStatus.OPEN}', '2026-08-01', null),
      ('${other}', 1000, 'EUR', '${InvoiceStatus.OPEN}', null, null),
      ('${company}', 500, 'EUR', '${InvoiceStatus.DRAFT}', null, null),
      ('${company}', 500, 'EUR', '${InvoiceStatus.VOID}', null, null),
      ('${company}', 500, 'EUR', '${InvoiceStatus.PAID}', null, null);
    INSERT INTO account_nodes VALUES ('${account}', '${company}', '${AccountSubtype.ACCOUNTS_RECEIVABLE}');
    INSERT INTO journal_entries VALUES ('${receipt}', '${openInvoice}', '${JournalSourceType.AR_PAYMENT}', '${company}', '${JournalEntryStatus.POSTED}', null, null);
    INSERT INTO journal_entry_lines VALUES ('${account}', '${receipt}', 22.22, 'EUR', '${LineType.CREDIT}');
  `);
});
afterAll(() => pg.close());

test("reports unpaid amounts in company currency after linked credits and partial receipts", async () => {
  const { ReceivablesAgingRepository } = await import("./repository");
  const result = await ReceivablesAgingRepository.getReceivablesAging(
    { asOfDate: "2026-11-25" },
    logger,
    user,
    defaultLocale,
  );
  expect(result.success).toBe(true);
  if (!result.success) {
    return;
  }
  expect(result.data.reportCurrency).toBe("EUR");
  expect(result.data.totalsTotal).toBe(68.97);
  expect(result.data.totalsCurrent).toBe(0.3);
  expect(result.data.bucketsCurrentItems.map((row) => row.dueDate)).toContain(
    null,
  );
  expect(result.data.bucketsDays1to30Items).toMatchObject([
    {
      invoiceId: openInvoice,
      invoiceNumber: "INV-42",
      customerId: customer,
      customerName: "Atelier Nord",
      amount: 68.67,
    },
  ]);
});

test("switches denomination explicitly and refuses an unowned company", async () => {
  const { ReceivablesAgingRepository } = await import("./repository");
  const result = await ReceivablesAgingRepository.getReceivablesAging(
    { companyId: company, currency: "USD", asOfDate: "2026-11-25" },
    logger,
    user,
    defaultLocale,
  );
  expect(result.success && result.data.reportCurrency).toBe("USD");
  expect(result.success && result.data.totalsOver90).toBe(95);
  const forbidden = await ReceivablesAgingRepository.getReceivablesAging(
    { companyId: other },
    logger,
    user,
    defaultLocale,
  );
  expect(forbidden.success).toBe(false);
});

test("asks for an explicit company when the user owns multiple sets of books", async () => {
  const { ReceivablesAgingRepository } = await import("./repository");
  await pg.query("INSERT INTO company_members VALUES ($1,$2,true)", [
    other,
    user.id,
  ]);
  const result = await ReceivablesAgingRepository.getReceivablesAging(
    {},
    logger,
    user,
    defaultLocale,
  );
  expect(result.success && result.data.reportCompanyId).toBe(null);
  expect(result.success && result.data.reportCurrency).toBe(null);
  expect(result.success && result.data.totalsTotal).toBe(0);
});
