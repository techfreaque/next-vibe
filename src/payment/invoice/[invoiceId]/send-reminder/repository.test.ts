import { PGlite } from "@electric-sql/pglite";
import { beforeAll, afterAll, expect, test, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { CompanyMemberRole } from "@/companies/enum";
import {
  AccountSubtype,
  JournalSourceType,
  JournalEntryStatus,
  LineType,
} from "@/chart-of-accounts/enum";
import { InvoiceStatus } from "../../../enum";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));
const company = crypto.randomUUID(),
  other = crypto.randomUUID(),
  accountant = crypto.randomUUID(),
  owner = crypto.randomUUID(),
  viewer = crypto.randomUUID(),
  invoice = crypto.randomUUID(),
  personal = crypto.randomUUID(),
  account = crypto.randomUUID(),
  entry = crypto.randomUUID();
const logger = createEndpointLogger(false, defaultLocale);
beforeAll(async () => {
  await pg.exec(`
 create table companies(id uuid primary key,name text,currency text,is_active boolean);
 create table company_members(id uuid,company_id uuid,user_id uuid,role text,is_active boolean);
 create table users(id uuid primary key);
 create table payment_invoices(id uuid primary key,user_id uuid,company_id uuid,provider_invoice_id text,invoice_number text,invoice_sequence_number int,amount numeric,currency text,status text,invoice_url text,invoice_pdf text,due_date timestamp,paid_at timestamp,callback_token text,notes text,journal_entry_id uuid,metadata jsonb,created_at timestamp default now(),updated_at timestamp);
 create table account_nodes(id uuid primary key,company_id uuid,subtype text);
 create table journal_entries(id uuid,company_id uuid,source_id uuid,source_type text,status text,reversal_of_id uuid,reversed_by_id uuid);
 create table journal_entry_lines(journal_entry_id uuid,account_id uuid,type text,currency text,amount numeric);
 insert into companies values ('${company}','Studio Linden','EUR',true),('${other}','Other','EUR',true);
 insert into users values ('${owner}'),('${viewer}'),('${accountant}');
 insert into company_members(company_id,user_id,role,is_active) values ('${company}','${accountant}','${CompanyMemberRole.ACCOUNTANT}',true),('${company}','${viewer}','${CompanyMemberRole.VIEWER}',true);
 insert into payment_invoices(id,user_id,company_id,provider_invoice_id,invoice_number,amount,currency,status,due_date) values
 ('${invoice}','${owner}','${company}','local','INV-1042',120,'EUR','${InvoiceStatus.OPEN}',current_date-3),
 ('${personal}','${owner}',null,'Legacy-1',null,45,'USD','${InvoiceStatus.OPEN}',current_date-1);
 insert into payment_invoices(id,user_id,company_id,amount,currency,status,metadata) values (gen_random_uuid(),'${owner}','${company}',-8.75,'EUR','${InvoiceStatus.OPEN}','{"originalInvoiceId":"${invoice}"}');
 insert into account_nodes values ('${account}','${company}','${AccountSubtype.ACCOUNTS_RECEIVABLE}');
 insert into journal_entries values ('${entry}','${company}','${invoice}','${JournalSourceType.AR_PAYMENT}','${JournalEntryStatus.POSTED}',null,null);
 insert into journal_entry_lines values ('${entry}','${account}','${LineType.CREDIT}','EUR',25.75);
 `);
  // Applied from the same additive migration used on Atlas.
  await pg.exec(
    await Bun.file("drizzle/20261125203808_moaning_quentin_quire.sql").text(),
  );
}, 30_000);
afterAll(() => pg.close());
async function prepare(userId: string, id: string, note?: string) {
  const { InvoiceSendReminderRepository } = await import("./repository");
  return InvoiceSendReminderRepository.sendReminder(
    userId,
    { invoiceId: id },
    { message: note },
    logger,
  );
}

test("captures only the outstanding balance after receipts and credits and safely replays a duplicate draft", async () => {
  const [a, b] = await Promise.all([
    prepare(accountant, invoice, "Reference 42"),
    prepare(accountant, invoice, " Reference 42 "),
  ]);
  expect(a.success && a.data.draft).toMatchObject({
    invoiceNumber: "INV-1042",
    currency: "EUR",
    amount: "85.50",
    issuerName: "Studio Linden",
    note: "Reference 42",
  });
  expect(a.success && b.success && a.data.draft?.id === b.data.draft?.id).toBe(
    true,
  );
  const { listInvoiceReminders } = await import("./history");
  expect(await listInvoiceReminders(invoice, company)).toHaveLength(1);
  expect(await listInvoiceReminders(invoice, other)).toEqual([]);
  expect((await prepare(viewer, invoice)).success).toBe(false);
  expect((await prepare(owner, invoice)).success).toBe(false);
});

test("legacy owner can prepare a personal reminder and today's due date and paid balances are excluded", async () => {
  expect((await prepare(accountant, personal)).success).toBe(false);
  const ok = await prepare(owner, personal);
  expect(ok.success && ok.data.draft).toMatchObject({
    invoiceNumber: "Legacy-1",
    amount: "45.00",
    currency: "USD",
    issuerName: null,
  });
  await pg.query(
    "update payment_invoices set due_date=current_date where id=$1",
    [personal],
  );
  expect((await prepare(owner, personal)).success).toBe(false);
  await pg.query(
    "update payment_invoices set status=$1,due_date=current_date-2 where id=$2",
    [InvoiceStatus.PAID, personal],
  );
  expect((await prepare(owner, personal)).success).toBe(false);
});
