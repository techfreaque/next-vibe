import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { createEndpointLogger } from "next-vibe/logger/server";

import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
  PeriodStatus,
} from "@/chart-of-accounts/enum";
import { CompanyMemberRole } from "@/companies/enum";
import { InvoiceStatus, ManualPaymentMethod } from "@/payment/enum";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));

const companyId = crypto.randomUUID();
const ownerId = crypto.randomUUID();
const accountantId = crypto.randomUUID();
const receivableId = crypto.randomUUID();
const bankId = crypto.randomUUID();
const logger = createEndpointLogger(false, defaultLocale);

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE companies (id uuid PRIMARY KEY, currency text, name text, is_active boolean);
    CREATE TABLE company_members (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid, user_id uuid,
      role text, is_active boolean, invited_by_user_id uuid, joined_at timestamp,
      created_at timestamp, updated_at timestamp
    );
    CREATE TABLE payment_invoices (
      id uuid PRIMARY KEY, user_id uuid, company_id uuid,
      provider_invoice_id text, invoice_number text, invoice_sequence_number int,
      amount numeric(10,2), currency text, status text, invoice_url text, invoice_pdf text,
      due_date timestamp, paid_at timestamp, callback_token text, notes text,
      journal_entry_id uuid, metadata jsonb, created_at timestamp DEFAULT now(), updated_at timestamp
    );
    CREATE TABLE payment_invoice_receipts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), invoice_id uuid NOT NULL REFERENCES payment_invoices(id),
      scope_id uuid NOT NULL, is_company_scope boolean NOT NULL, receipt_key text NOT NULL,
      request_digest text NOT NULL, journal_entry_id uuid, response jsonb NOT NULL,
      created_at timestamp NOT NULL DEFAULT now(), UNIQUE(scope_id, is_company_scope, receipt_key)
    );
    CREATE TABLE account_nodes (
      id uuid PRIMARY KEY, company_id uuid, subtype text, code text,
      is_active boolean DEFAULT true, is_postable boolean DEFAULT true
    );
    CREATE TABLE accounting_periods (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid,
      start_date timestamp, end_date timestamp, status text
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

    INSERT INTO companies VALUES ('${companyId}', 'EUR', 'Company', true);
    INSERT INTO company_members (company_id, user_id, role, is_active)
      VALUES ('${companyId}', '${accountantId}', '${CompanyMemberRole.ACCOUNTANT}', true);
    INSERT INTO account_nodes (id, company_id, subtype, code) VALUES
      ('${receivableId}', '${companyId}', '${AccountSubtype.ACCOUNTS_RECEIVABLE}', '411'),
      ('${bankId}', '${companyId}', '${AccountSubtype.BANK}', '221');
    INSERT INTO accounting_periods (company_id, start_date, end_date, status)
      VALUES ('${companyId}', '2020-01-01', '2100-12-31', '${PeriodStatus.OPEN}');
  `);
});
afterAll(() => pg.close());

async function insertOpenInvoice(scope: string | null): Promise<string> {
  const id = crypto.randomUUID();
  const journalId = scope === null ? null : crypto.randomUUID();
  await pg.query(
    `INSERT INTO payment_invoices (id, user_id, company_id, amount, currency, status, journal_entry_id)
     VALUES ($1, $2, $3, 100, 'EUR', $4, $5)`,
    [id, ownerId, scope, InvoiceStatus.OPEN, journalId],
  );
  if (journalId) {
    await pg.query(
      `INSERT INTO journal_entries (id, company_id, status, source_type, source_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        journalId,
        scope,
        JournalEntryStatus.POSTED,
        JournalSourceType.AR_INVOICE,
        id,
      ],
    );
    await pg.query(
      `INSERT INTO journal_entry_lines (journal_entry_id, account_id, type, amount, currency)
       VALUES ($1, $2, $3, 100, 'EUR')`,
      [journalId, receivableId, LineType.DEBIT],
    );
  }
  return id;
}

async function receiptState(invoiceId: string) {
  const { rows } = await pg.query<{
    status: string;
    payments: number;
    receipts: number;
    linked: number;
  }>(
    `SELECT status,
        (SELECT count(*)::int FROM journal_entries WHERE source_id = $1 AND source_type = $2) AS payments,
        (SELECT count(*)::int FROM payment_invoice_receipts WHERE invoice_id = $1) AS receipts,
        (SELECT count(*)::int FROM payment_invoice_receipts receipt
          JOIN journal_entries journal ON receipt.journal_entry_id = journal.id
          WHERE receipt.invoice_id = $1 AND journal.source_id = $1 AND journal.source_type = $2) AS linked
      FROM payment_invoices WHERE id = $1`,
    [invoiceId, JournalSourceType.AR_PAYMENT],
  );
  return rows[0];
}

it("returns the stored outcome for same-key races, rejects mismatches and retains paid replays", async () => {
  const { InvoiceRecordPaymentRepository } = await import("./repository");
  const invoiceId = await insertOpenInvoice(companyId);
  const siblingId = await insertOpenInvoice(companyId);
  const post = (
    amount: number,
    receiptKey?: string,
    id = invoiceId,
    paidAt?: Date,
  ) =>
    InvoiceRecordPaymentRepository.recordPayment(
      accountantId,
      { invoiceId: id },
      { amount, receiptKey, paidAt, method: ManualPaymentMethod.BANK_TRANSFER },
      logger,
    );

  const one = () => post(20, "bank:partial-1");
  const concurrent = await Promise.all([one(), one()]);
  expect(concurrent[0]?.success).toBe(true);
  expect(concurrent[1]).toEqual(concurrent[0]);
  expect(await receiptState(invoiceId)).toEqual({
    status: InvoiceStatus.OPEN,
    payments: 1,
    receipts: 1,
    linked: 1,
  });

  expect(await post(21, "bank:partial-1")).toMatchObject({
    success: false,
    errorType: ErrorResponseTypes.CONFLICT,
  });
  expect(await post(20, "bank:partial-1", siblingId)).toMatchObject({
    success: false,
    errorType: ErrorResponseTypes.CONFLICT,
  });
  expect(await receiptState(siblingId)).toEqual({
    status: InvoiceStatus.OPEN,
    payments: 0,
    receipts: 0,
    linked: 0,
  });

  expect((await post(20, "bank:partial-2")).success).toBe(true);
  expect((await post(10)).success).toBe(true);
  const settled = await post(
    50,
    "bank:final",
    invoiceId,
    new Date("2026-11-25T20:00:00+01:00"),
  );
  expect(settled.success).toBe(true);
  expect(
    await post(50, "bank:final", invoiceId, new Date("2026-11-25T19:00:00Z")),
  ).toEqual(settled);
  expect(
    await post(50, "bank:final", invoiceId, new Date("2026-11-25T19:00:01Z")),
  ).toMatchObject({
    success: false,
    errorType: ErrorResponseTypes.CONFLICT,
  });
  expect(await one()).toEqual(concurrent[0]);
  expect(await post(10, "bank:extra")).toMatchObject({
    success: false,
    errorType: ErrorResponseTypes.CONFLICT,
  });
  expect(await receiptState(invoiceId)).toEqual({
    status: InvoiceStatus.PAID,
    payments: 4,
    receipts: 3,
    linked: 3,
  });
});

it("allows a corrected posting configuration to retry the same key after a failure", async () => {
  const { InvoiceRecordPaymentRepository } = await import("./repository");
  const invoiceId = await insertOpenInvoice(companyId);
  const pay = () =>
    InvoiceRecordPaymentRepository.recordPayment(
      accountantId,
      { invoiceId },
      {
        amount: 20,
        receiptKey: "bank:setup-retry",
        method: ManualPaymentMethod.BANK_TRANSFER,
      },
      logger,
    );
  await pg.query("UPDATE account_nodes SET is_postable = false WHERE id = $1", [
    bankId,
  ]);
  try {
    expect((await pay()).success).toBe(false);
    expect(await receiptState(invoiceId)).toEqual({
      status: InvoiceStatus.OPEN,
      payments: 0,
      receipts: 0,
      linked: 0,
    });
  } finally {
    await pg.query(
      "UPDATE account_nodes SET is_postable = true WHERE id = $1",
      [bankId],
    );
  }

  expect((await pay()).success).toBe(true);
  expect(await receiptState(invoiceId)).toEqual({
    status: InvoiceStatus.OPEN,
    payments: 1,
    receipts: 1,
    linked: 1,
  });
});

it("preserves full-settlement behavior for owner-only legacy invoices and scopes keys per invoice", async () => {
  const { InvoiceRecordPaymentRepository } = await import("./repository");
  const firstId = await insertOpenInvoice(null);
  const secondId = await insertOpenInvoice(null);
  const pay = (invoiceId: string, amount: number, userId = ownerId) =>
    InvoiceRecordPaymentRepository.recordPayment(
      userId,
      { invoiceId },
      {
        amount,
        receiptKey: "legacy",
        method: ManualPaymentMethod.BANK_TRANSFER,
      },
      logger,
    );

  expect((await pay(firstId, 10)).success).toBe(false);
  const first = await pay(firstId, 100);
  expect(first.success).toBe(true);
  expect(await pay(firstId, 100)).toEqual(first);
  expect(await pay(firstId, 100, accountantId)).toMatchObject({
    success: false,
    errorType: ErrorResponseTypes.FORBIDDEN,
  });
  expect((await pay(secondId, 100)).success).toBe(true);
  expect(await receiptState(firstId)).toEqual({
    status: InvoiceStatus.PAID,
    payments: 0,
    receipts: 1,
    linked: 0,
  });
  expect(await receiptState(secondId)).toEqual({
    status: InvoiceStatus.PAID,
    payments: 0,
    receipts: 1,
    linked: 0,
  });
});

it("accepts only one concurrent use of a key across two invoices in the same company", async () => {
  const { InvoiceRecordPaymentRepository } = await import("./repository");
  const firstId = await insertOpenInvoice(companyId);
  const secondId = await insertOpenInvoice(companyId);
  const pay = (invoiceId: string) =>
    InvoiceRecordPaymentRepository.recordPayment(
      accountantId,
      { invoiceId },
      {
        amount: 20,
        receiptKey: "bank:concurrent-company-duplicate",
        method: ManualPaymentMethod.BANK_TRANSFER,
      },
      logger,
    );

  const results = await Promise.all([pay(firstId), pay(secondId)]);
  expect(results.filter(({ success }) => success)).toHaveLength(1);
  expect(results.find(({ success }) => !success)).toMatchObject({
    success: false,
    errorType: ErrorResponseTypes.CONFLICT,
  });
  const first = await receiptState(firstId);
  const second = await receiptState(secondId);
  expect((first?.payments ?? 0) + (second?.payments ?? 0)).toBe(1);
  expect((first?.receipts ?? 0) + (second?.receipts ?? 0)).toBe(1);
  expect((first?.linked ?? 0) + (second?.linked ?? 0)).toBe(1);
});
