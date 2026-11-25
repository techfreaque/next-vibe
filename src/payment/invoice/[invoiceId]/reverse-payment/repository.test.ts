import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";

import { journalEntries, journalEntryLines } from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
  PeriodStatus,
} from "@/chart-of-accounts/enum";
import { CompanyMemberRole } from "@/companies/enum";

import { paymentInvoiceReceipts, paymentInvoices } from "../../../db";
import { InvoiceStatus, ManualPaymentMethod } from "../../../enum";

const pg = new PGlite();
const db = drizzle(pg);
mock.module("next-vibe/database", () => ({ db }));
const id = (n: number): string =>
  `00000000-0000-4000-8000-${n.toString().padStart(12, "0")}`;
const company = id(1);
const other = id(2);
const invoice = id(11);
const otherInvoice = id(12);
const foreignInvoice = id(13);
const accountant = id(21);
const viewer = id(22);
const bank = id(31);
const receivable = id(32);
const sales = id(33);
const issued = id(41);
const oldPeriod = id(51);
const newPeriod = id(52);
const now = new Date();
const earlier = new Date(now);
earlier.setUTCDate(now.getUTCDate() - 2);
const today = now.toISOString().slice(0, 10);
const oldDay = earlier.toISOString().slice(0, 10);
const logger = createEndpointLogger(false, defaultLocale);
const user: JwtPrivatePayloadType = {
  id: accountant,
  leadId: id(23),
  isPublic: false,
  roles: [UserRole.ADMIN],
};

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE companies (id uuid PRIMARY KEY, currency text, name text, is_active boolean);
    CREATE TABLE company_members (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid, user_id uuid,
      role text, is_active boolean, invited_by_user_id uuid, joined_at timestamp,
      created_at timestamp, updated_at timestamp
    );
    CREATE TABLE payment_invoices (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid, company_id uuid,
      provider_invoice_id text, invoice_number text, invoice_sequence_number int,
      amount numeric(10,2), currency text, status text, invoice_url text, invoice_pdf text,
      due_date timestamp, paid_at timestamp, callback_token text, notes text,
      journal_entry_id uuid, metadata jsonb, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now()
    );
    CREATE TABLE payment_bills (id uuid PRIMARY KEY, company_id uuid);
    CREATE TABLE pos_terminals (id uuid PRIMARY KEY, company_id uuid);
    CREATE TABLE pos_sessions (id uuid PRIMARY KEY, terminal_id uuid);
    CREATE TABLE pos_orders (id uuid PRIMARY KEY, session_id uuid);
    CREATE TABLE payment_invoice_lines (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), invoice_id uuid, description text,
      product_id uuid, quantity numeric(12,4), unit_price numeric(12,4), tax_rate numeric(12,4),
      tax_amount numeric(12,4), line_total numeric(12,4), sort_order int, created_at timestamp,
      updated_at timestamp
    );
    CREATE TABLE payment_invoice_receipts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), invoice_id uuid, scope_id uuid,
      is_company_scope boolean, receipt_key text, request_digest text, journal_entry_id uuid,
      response jsonb, created_at timestamp DEFAULT now(),
      UNIQUE (scope_id, is_company_scope, receipt_key)
    );
    CREATE TABLE payment_invoice_reminder_drafts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), invoice_id uuid, company_id uuid,
      prepared_at timestamp DEFAULT now(), due_date date, currency text, amount numeric(10,2), note text
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
    INSERT INTO companies VALUES ('${company}', 'EUR', 'Company', true), ('${other}', 'EUR', 'Other', true);
    INSERT INTO company_members (company_id, user_id, role, is_active) VALUES
      ('${company}', '${accountant}', '${CompanyMemberRole.ACCOUNTANT}', true),
      ('${company}', '${viewer}', '${CompanyMemberRole.VIEWER}', true);
    INSERT INTO account_nodes (id, company_id, subtype, code) VALUES
      ('${bank}', '${company}', '${AccountSubtype.BANK}', '221'),
      ('${receivable}', '${company}', '${AccountSubtype.ACCOUNTS_RECEIVABLE}', '411'),
      ('${sales}', '${company}', '${AccountSubtype.REVENUE_SALES}', '701');
    INSERT INTO accounting_periods (id, company_id, start_date, end_date, status) VALUES
      ('${oldPeriod}', '${company}', '${oldDay}', '${oldDay}', '${PeriodStatus.OPEN}'),
      ('${newPeriod}', '${company}', '${today}', '${today}', '${PeriodStatus.OPEN}');
    INSERT INTO payment_invoices (id, user_id, company_id, provider_invoice_id, amount, currency, status, journal_entry_id) VALUES
      ('${invoice}', '${accountant}', '${company}', 'INV-1', 100, 'EUR', '${InvoiceStatus.OPEN}', '${issued}'),
      ('${otherInvoice}', '${accountant}', '${company}', 'INV-2', 100, 'EUR', '${InvoiceStatus.OPEN}', NULL),
      ('${foreignInvoice}', '${viewer}', '${other}', 'INV-3', 100, 'EUR', '${InvoiceStatus.OPEN}', NULL);
    INSERT INTO journal_entries (id, company_id, period_id, entry_number, date, description, status, source_type, source_id)
    VALUES ('${issued}', '${company}', '${oldPeriod}', 'JE-TEST-0001', '${oldDay}', 'Issued invoice', '${JournalEntryStatus.POSTED}', '${JournalSourceType.AR_INVOICE}', '${invoice}');
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, type, amount, currency, sort_order) VALUES
      ('${issued}', '${receivable}', '${LineType.DEBIT}', 100, 'EUR', 0),
      ('${issued}', '${sales}', '${LineType.CREDIT}', 100, 'EUR', 1);
  `);
});
afterAll(() => pg.close());

test("a receipt reverses exactly once, reopens the invoice, and its old key cannot rebook it", async () => {
  const { InvoiceRecordPaymentRepository } =
    await import("../record-payment/repository");
  const { InvoiceGetRepository } = await import("../get/repository");
  const { InvoiceReversePaymentRepository } = await import("./repository");
  const { CoaJournalReverseRepository } =
    await import("@/chart-of-accounts/journal/[entryId]/reverse/repository");

  const oldPayment = {
    amount: 30,
    method: ManualPaymentMethod.BANK_TRANSFER,
    paidAt: new Date(oldDay),
    receiptKey: "bank-ref-001",
  };
  const record = await InvoiceRecordPaymentRepository.recordPayment(
    accountant,
    { invoiceId: invoice },
    oldPayment,
    logger,
    defaultLocale,
  );
  expect(record.success).toBe(true);
  const remainder = await InvoiceRecordPaymentRepository.recordPayment(
    accountant,
    { invoiceId: invoice },
    {
      amount: 70,
      method: ManualPaymentMethod.BANK_TRANSFER,
      receiptKey: "bank-ref-002",
    },
    logger,
    defaultLocale,
  );
  expect(remainder.success).toBe(true);
  const [receipt] = await db
    .select()
    .from(paymentInvoiceReceipts)
    .where(eq(paymentInvoiceReceipts.receiptKey, oldPayment.receiptKey));
  expect(receipt?.journalEntryId).toBeString();
  if (!receipt?.journalEntryId) {
    return;
  }

  const data = {
    paymentEntryId: receipt.journalEntryId,
    reason: "Bank returned the payment.",
  };
  const reverse = (invoiceId: string, userId: string, reversalDate?: Date) =>
    InvoiceReversePaymentRepository.reversePayment(
      invoiceId,
      { ...data, reversalDate },
      userId,
      logger,
      defaultLocale,
    );
  const generic = await CoaJournalReverseRepository.reverseEntry(
    { entryId: receipt.journalEntryId },
    user,
    logger,
    defaultLocale,
  );
  expect(generic).toMatchObject({
    success: false,
    errorType: { errorCode: 409 },
  });
  expect((await reverse(otherInvoice, accountant)).success).toBe(false);
  expect((await reverse(foreignInvoice, accountant)).success).toBe(false);
  expect((await reverse(invoice, viewer)).success).toBe(false);
  expect(
    (await reverse(invoice, accountant, new Date("2000-01-01"))).success,
  ).toBe(false);
  await pg.query("update accounting_periods set status = $1 where id = $2", [
    PeriodStatus.CLOSED,
    oldPeriod,
  ]);
  expect((await reverse(invoice, accountant, new Date(oldDay))).success).toBe(
    false,
  );

  const [first, second] = await Promise.all([
    reverse(invoice, accountant),
    reverse(invoice, accountant),
  ]);
  expect(first).toEqual(second);
  expect(first.success).toBe(true);
  if (!first.success) {
    return;
  }

  const [reversed] = await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.id, receipt.journalEntryId));
  const mirrors = await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.reversalOfId, receipt.journalEntryId));
  expect(reversed).toMatchObject({
    status: JournalEntryStatus.REVERSED,
    reversedById: first.data.reversalId,
  });
  expect(mirrors).toMatchObject([
    { id: first.data.reversalId, periodId: newPeriod, memo: data.reason },
  ]);
  const mirrorLines = await db
    .select()
    .from(journalEntryLines)
    .where(eq(journalEntryLines.journalEntryId, first.data.reversalId))
    .orderBy(journalEntryLines.sortOrder);
  expect(mirrorLines).toMatchObject([
    { accountId: bank, type: LineType.CREDIT, amount: 30, currency: "EUR" },
    {
      accountId: receivable,
      type: LineType.DEBIT,
      amount: 30,
      currency: "EUR",
    },
  ]);

  const replay = await InvoiceRecordPaymentRepository.recordPayment(
    accountant,
    { invoiceId: invoice },
    oldPayment,
    logger,
    defaultLocale,
  );
  expect(replay).toEqual(record);
  const originalPostings = await db
    .select()
    .from(journalEntries)
    .where(
      and(
        eq(journalEntries.sourceId, invoice),
        eq(journalEntries.sourceType, JournalSourceType.AR_PAYMENT),
      ),
    );
  expect(originalPostings).toHaveLength(2);
  const [updated] = await db
    .select()
    .from(paymentInvoices)
    .where(eq(paymentInvoices.id, invoice));
  expect(updated).toMatchObject({ status: InvoiceStatus.OPEN, paidAt: null });
  const history = await InvoiceGetRepository.getInvoice(
    accountant,
    { invoiceId: invoice },
    logger,
    defaultLocale,
  );
  expect(history).toMatchObject({
    success: true,
    data: {
      amountDue: 30,
      amountPaid: 70,
      receipts: [
        { reference: "bank-ref-002", reversed: false, amount: 70 },
        {
          reference: "bank-ref-001",
          reversed: true,
          amount: 30,
          reversalReason: data.reason,
          reversalEntryNumber: first.data.reversalEntryNumber,
        },
      ],
    },
  });
});

test("linked bill and POS postings require their document workflow while unrelated external references remain reversible", async () => {
  const { CoaJournalReverseRepository } =
    await import("@/chart-of-accounts/journal/[entryId]/reverse/repository");
  await pg.exec(`
    INSERT INTO payment_bills VALUES ('${id(61)}', '${company}');
    INSERT INTO pos_terminals VALUES ('${id(62)}', '${company}');
    INSERT INTO pos_sessions VALUES ('${id(63)}', '${id(62)}');
    INSERT INTO pos_orders VALUES ('${id(64)}', '${id(63)}');
    INSERT INTO journal_entries (id, company_id, period_id, entry_number, date, description, status, source_type, source_id) VALUES
      ('${id(71)}', '${company}', '${newPeriod}', 'JE-AP-1', '${today}', 'Linked bill', '${JournalEntryStatus.POSTED}', '${JournalSourceType.AP_PAYMENT}', '${id(61)}'),
      ('${id(72)}', '${company}', '${newPeriod}', 'JE-POS-1', '${today}', 'Linked POS order', '${JournalEntryStatus.POSTED}', '${JournalSourceType.POS_ORDER}', '${id(64)}'),
      ('${id(73)}', '${company}', '${newPeriod}', 'JE-EXT-1', '${today}', 'Old import', '${JournalEntryStatus.POSTED}', '${JournalSourceType.AR_PAYMENT}', '${foreignInvoice}');
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, type, amount, currency, sort_order) VALUES
      ('${id(73)}', '${bank}', '${LineType.DEBIT}', 5.125, 'EUR', 0),
      ('${id(73)}', '${receivable}', '${LineType.CREDIT}', 5.125, 'EUR', 1);
  `);
  const reverse = (entryId: string) =>
    CoaJournalReverseRepository.reverseEntry(
      { entryId },
      user,
      logger,
      defaultLocale,
    );
  expect(await reverse(id(71))).toMatchObject({
    success: false,
    errorType: { errorCode: 409 },
  });
  expect(await reverse(id(72))).toMatchObject({
    success: false,
    errorType: { errorCode: 409 },
  });
  const unrelated = await reverse(id(73));
  expect(unrelated.success).toBe(true);
  if (unrelated.success) {
    const mirror = await db
      .select()
      .from(journalEntryLines)
      .where(
        eq(journalEntryLines.journalEntryId, unrelated.data.reversalEntryId),
      )
      .orderBy(journalEntryLines.sortOrder);
    expect(mirror).toMatchObject([
      { amount: 5.125, accountId: bank, type: LineType.CREDIT },
      { amount: 5.125, accountId: receivable, type: LineType.DEBIT },
    ]);
  }
});
