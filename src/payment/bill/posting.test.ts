import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import {
  AccountSubtype,
  AccountType,
  JournalEntryStatus,
  JournalSourceType,
  PeriodStatus,
} from "@/chart-of-accounts/enum";
import { CompanyMemberRole } from "@/companies/enum";

import { BillStatus } from "../enum";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));

const companyId = crypto.randomUUID();
const foreignCompanyId = crypto.randomUUID();
const userId = crypto.randomUUID();
const payableId = crypto.randomUUID();
const expenseId = crypto.randomUUID();
const vatId = crypto.randomUUID();
const bankId = crypto.randomUUID();
const foreignBankId = crypto.randomUUID();
const priorPeriod = crypto.randomUUID();
const validPeriod = crypto.randomUUID();
const logger = createEndpointLogger(false, defaultLocale);

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE company_tax_regimes (company_id uuid NOT NULL, effective_from date NOT NULL, regime text NOT NULL, recorded_by uuid, recorded_at timestamp DEFAULT now(), PRIMARY KEY (company_id, effective_from));
    CREATE TABLE companies (id uuid PRIMARY KEY, currency text);
    CREATE TABLE company_members (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid, user_id uuid,
      role text, is_active boolean, invited_by_user_id uuid, joined_at timestamp,
      created_at timestamp, updated_at timestamp
    );
    CREATE TABLE payment_bills (
      id uuid PRIMARY KEY, company_id uuid, supplier_name text,
      supplier_vat_number text, bill_number text, bill_date timestamp,
      due_date timestamp, currency text, status text, subtotal numeric(12,4),
      tax_amount numeric(12,4), total numeric(12,4), notes text, journal_entry_id uuid,
      paid_at timestamp, metadata jsonb, created_at timestamp, updated_at timestamp
    );
    CREATE TABLE payment_bill_lines (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), bill_id uuid, description text,
      product_id uuid, expense_account_id uuid, quantity numeric(12,4),
      unit_price numeric(12,4), tax_rate numeric(12,4), tax_amount numeric(12,4),
      line_total numeric(12,4), sort_order int DEFAULT 0, created_at timestamp,
      updated_at timestamp
    );
    CREATE TABLE account_nodes (
      id uuid PRIMARY KEY, company_id uuid, type text, subtype text, code text,
      is_active boolean DEFAULT true, is_postable boolean DEFAULT true
    );
    CREATE TABLE accounting_periods (
      id uuid PRIMARY KEY, company_id uuid, start_date timestamp, end_date timestamp, status text
    );
    CREATE TABLE journal_entries (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid, period_id uuid,
      entry_number text, date timestamp, description text, memo text, status text,
      reversal_of_id uuid, reversed_by_id uuid, posted_at timestamp, posted_by_user_id uuid,
      source_type text, source_id uuid, created_at timestamp, updated_at timestamp
    );
    CREATE TABLE journal_entry_lines (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), journal_entry_id uuid REFERENCES journal_entries(id),
      account_id uuid REFERENCES account_nodes(id), type text, amount numeric(14,4),
      currency text, description text, sort_order int, created_at timestamp
    );

    INSERT INTO companies VALUES ('${companyId}', 'EUR'), ('${foreignCompanyId}', 'EUR');
    INSERT INTO company_members (company_id, user_id, role, is_active)
      VALUES ('${companyId}', '${userId}', '${CompanyMemberRole.ACCOUNTANT}', true);
    INSERT INTO account_nodes (id, company_id, type, subtype, code) VALUES
      ('${expenseId}', '${companyId}', '${AccountType.EXPENSE}', '${AccountSubtype.OPEX}', '500'),
      ('${payableId}', '${companyId}', '${AccountType.LIABILITY}', '${AccountSubtype.ACCOUNTS_PAYABLE}', '321'),
      ('${vatId}', '${companyId}', '${AccountType.ASSET}', '${AccountSubtype.VAT_RECEIVABLE}', '343'),
      ('${bankId}', '${companyId}', '${AccountType.ASSET}', '${AccountSubtype.BANK}', '221'),
      ('${foreignBankId}', '${foreignCompanyId}', '${AccountType.ASSET}', '${AccountSubtype.BANK}', '221');
    INSERT INTO accounting_periods VALUES
      ('${priorPeriod}', '${companyId}', '2026-10-01', '2026-10-31', '${PeriodStatus.OPEN}'),
      ('${validPeriod}', '${companyId}', '2026-11-01', '2026-11-30', '${PeriodStatus.OPEN}');
  `);
});
afterAll(() => pg.close());

async function insertReceivedBill(currency = "EUR"): Promise<string> {
  const id = crypto.randomUUID();
  await pg.query(
    `INSERT INTO payment_bills
      (id, company_id, supplier_name, bill_date, currency, status, subtotal, tax_amount, total)
      VALUES ($1, $2, 'Supplier', '2026-11-30T15:00:00Z', $3, $4, 100.005, 23.0012, 123.0062)`,
    [id, companyId, currency, BillStatus.RECEIVED],
  );
  await pg.query(
    `INSERT INTO payment_bill_lines (bill_id, description, expense_account_id, tax_amount, line_total)
      VALUES ($1, 'Inventory handling', $2, 23.0012, 123.0062)`,
    [id, expenseId],
  );
  return id;
}

async function getBillPosting(billId: string) {
  const { rows } = await pg.query<{
    status: string;
    entryCount: number;
    lineCount: number;
  }>(
    `SELECT status,
      (SELECT COUNT(*)::int FROM journal_entries WHERE source_id = $1) AS "entryCount",
      (SELECT COUNT(*)::int FROM journal_entry_lines JOIN journal_entries
        ON journal_entry_id = journal_entries.id WHERE source_id = $1) AS "lineCount"
      FROM payment_bills WHERE id = $1`,
    [billId],
  );
  return rows[0];
}

it("posts approval and payment exactly once into the period covering each date", async () => {
  const { BillApproveRepository } =
    await import("./[billId]/approve/repository");
  const { BillPayRepository } = await import("./[billId]/pay/repository");
  const billId = await insertReceivedBill();
  const approve = () =>
    BillApproveRepository.approveBill(userId, { billId }, logger);
  const approvals = await Promise.all([approve(), approve()]);
  expect(approvals.filter(({ success }) => success)).toHaveLength(1);
  expect(await getBillPosting(billId)).toEqual({
    status: BillStatus.APPROVED,
    entryCount: 1,
    lineCount: 3,
  });

  const foreign = await BillPayRepository.payBill(
    userId,
    { billId },
    { accountNodeId: foreignBankId, paidAt: new Date("2026-11-30T16:00:00Z") },
    logger,
  );
  expect(foreign.success).toBe(false);
  const noPeriod = await BillPayRepository.payBill(
    userId,
    { billId },
    { paidAt: new Date("2026-12-01") },
    logger,
  );
  expect(noPeriod.success).toBe(false);
  expect(await getBillPosting(billId)).toEqual({
    status: BillStatus.APPROVED,
    entryCount: 1,
    lineCount: 3,
  });

  const pay = () =>
    BillPayRepository.payBill(
      userId,
      { billId },
      { accountNodeId: bankId, paidAt: new Date("2026-11-30T16:00:00Z") },
      logger,
    );
  const payments = await Promise.all([pay(), pay()]);
  expect(payments.filter(({ success }) => success)).toHaveLength(1);
  expect(await getBillPosting(billId)).toEqual({
    status: BillStatus.PAID,
    entryCount: 2,
    lineCount: 5,
  });

  const { rows } = await pg.query<{ period_id: string; source_type: string }>(
    "SELECT period_id, source_type FROM journal_entries WHERE source_id = $1 ORDER BY entry_number",
    [billId],
  );
  expect(rows).toEqual([
    { period_id: validPeriod, source_type: JournalSourceType.AP_BILL },
    { period_id: validPeriod, source_type: JournalSourceType.AP_PAYMENT },
  ]);
});

it("leaves a bill unchanged when VAT posting is unavailable, currency differs, or the journal lines fail to insert", async () => {
  const { BillApproveRepository } =
    await import("./[billId]/approve/repository");
  const approve = (billId: string) =>
    BillApproveRepository.approveBill(userId, { billId }, logger);
  const notPosted = {
    status: BillStatus.RECEIVED,
    entryCount: 0,
    lineCount: 0,
  };

  await pg.query("UPDATE account_nodes SET is_postable = false WHERE id = $1", [
    vatId,
  ]);
  const missingVatBill = await insertReceivedBill();
  expect((await approve(missingVatBill)).success).toBe(false);
  expect(await getBillPosting(missingVatBill)).toEqual(notPosted);
  await pg.query("UPDATE account_nodes SET is_postable = true WHERE id = $1", [
    vatId,
  ]);

  const foreignCurrencyBill = await insertReceivedBill("USD");
  expect((await approve(foreignCurrencyBill)).success).toBe(false);
  expect(await getBillPosting(foreignCurrencyBill)).toEqual(notPosted);

  const failingBill = await insertReceivedBill();
  await pg.exec(
    "ALTER TABLE journal_entry_lines ADD CONSTRAINT limit_test_line CHECK (amount < 100) NOT VALID",
  );
  try {
    expect((await approve(failingBill)).success).toBe(false);
    expect(await getBillPosting(failingBill)).toEqual(notPosted);
  } finally {
    await pg.exec(
      "ALTER TABLE journal_entry_lines DROP CONSTRAINT limit_test_line",
    );
  }
});

it("does not repost a received bill that already has a legacy approval entry", async () => {
  const { BillApproveRepository } =
    await import("./[billId]/approve/repository");
  const billId = await insertReceivedBill();
  await pg.query(
    `INSERT INTO journal_entries (company_id, source_type, source_id, status, entry_number)
      VALUES ($1, $2, $3, $4, 'LEGACY')`,
    [companyId, JournalSourceType.AP_BILL, billId, JournalEntryStatus.POSTED],
  );
  expect(
    (await BillApproveRepository.approveBill(userId, { billId }, logger))
      .success,
  ).toBe(false);
  expect(await getBillPosting(billId)).toEqual({
    status: BillStatus.RECEIVED,
    entryCount: 1,
    lineCount: 0,
  });
});
