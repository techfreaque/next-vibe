import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { createEndpointLogger } from "next-vibe/logger/server";

import { BillStatus } from "@/payment/enum";

import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
} from "../../enum";
import { type AgingBucket, billAgingBucket } from "./model";
import { PayablesAgingRepository } from "./repository";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));

const companyId = crypto.randomUUID();
const otherCompanyId = crypto.randomUUID();
const userId = crypto.randomUUID();
const otherUserId = crypto.randomUUID();
const payableAccount = crypto.randomUUID();
const otherPayableAccount = crypto.randomUUID();
const agingDate = "2026-11-25";
const logger = createEndpointLogger(false, defaultLocale);

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE companies (id uuid PRIMARY KEY, name text, currency text, is_active boolean);
    CREATE TABLE company_members (company_id uuid, user_id uuid, is_active boolean);
    CREATE TABLE payment_bills (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid NOT NULL, supplier_name text NOT NULL,
      supplier_vat_number text, bill_number text, bill_date timestamp, due_date timestamp,
      currency text, status text, total numeric(12,4), paid_at timestamp
    );
    CREATE TABLE account_nodes (id uuid PRIMARY KEY, company_id uuid, subtype text);
    CREATE TABLE journal_entries (
      id uuid PRIMARY KEY, company_id uuid, source_id uuid, source_type text, status text,
      reversal_of_id uuid, reversed_by_id uuid
    );
    CREATE TABLE journal_entry_lines (
      journal_entry_id uuid, account_id uuid, amount numeric(14,4), currency text, type text
    );
  `);
  await pg.query(
    "INSERT INTO companies VALUES ($1,'Alpine','EUR',true), ($2,'Other company','EUR',true)",
    [companyId, otherCompanyId],
  );
  await pg.query(
    "INSERT INTO company_members VALUES ($1,$2,true),($3,$4,true)",
    [companyId, userId, otherCompanyId, otherUserId],
  );
  await pg.query("INSERT INTO account_nodes VALUES ($1,$2,$5),($3,$4,$5)", [
    payableAccount,
    companyId,
    otherPayableAccount,
    otherCompanyId,
    AccountSubtype.ACCOUNTS_PAYABLE,
  ]);
});
afterAll(() => pg.close());

async function addBill({
  number,
  total,
  due,
  supplier = "Alpine Suppliers",
  vat = "DE 123.45",
  currency = "EUR",
  status = BillStatus.APPROVED,
  company = companyId,
  paidAt = null,
}: {
  number: string;
  total: string;
  due: string | null;
  supplier?: string;
  vat?: string | null;
  currency?: string;
  status?: string;
  company?: string;
  paidAt?: string | null;
}): Promise<string> {
  const id = crypto.randomUUID();
  await pg.query(
    `INSERT INTO payment_bills (
      id, company_id, supplier_name, supplier_vat_number, bill_number, bill_date,
      due_date, currency, status, total, paid_at
    ) VALUES ($1,$2,$3,$4,$5,'2026-07-10',$6,$7,$8,$9,$10)`,
    [id, company, supplier, vat, number, due, currency, status, total, paidAt],
  );
  return id;
}

async function addPayment({
  billId,
  amount,
  currency = "EUR",
  sourceCompany = companyId,
  account = payableAccount,
  reversedBy = null,
  reversalOf = null,
  journalStatus = JournalEntryStatus.POSTED,
  id = crypto.randomUUID(),
}: {
  billId: string;
  amount: string;
  currency?: string;
  sourceCompany?: string;
  account?: string;
  reversedBy?: string | null;
  reversalOf?: string | null;
  journalStatus?: string;
  id?: string;
}): Promise<string> {
  await pg.query("INSERT INTO journal_entries VALUES ($1,$2,$3,$4,$5,$6,$7)", [
    id,
    sourceCompany,
    billId,
    JournalSourceType.AP_PAYMENT,
    journalStatus,
    reversalOf,
    reversedBy,
  ]);
  await pg.query("INSERT INTO journal_entry_lines VALUES ($1,$2,$3,$4,$5)", [
    id,
    account,
    amount,
    currency,
    LineType.DEBIT,
  ]);
  return id;
}

test("moves between aging bands at UTC day boundaries and separates missing due dates", () => {
  const day = Date.parse(agingDate);
  expect(billAgingBucket(null, day)).toBe("undated");
  const cases: readonly [number, AgingBucket][] = [
    [0, "current"],
    [1, "days1to30"],
    [30, "days1to30"],
    [31, "days31to60"],
    [60, "days31to60"],
    [61, "days61to90"],
    [90, "days61to90"],
    [91, "over90"],
  ];
  for (const [offset, expected] of cases) {
    const due = new Date(day - offset * 86_400_000 + 23 * 3_600_000);
    expect(billAgingBucket(due, day)).toBe(expected);
  }
});

test("summarizes only matching company and currency with supplier grouping and exact cents", async () => {
  await addBill({ number: "PAST-30", total: "100.0050", due: "2026-10-26" });
  await addBill({
    number: "NO-DUE",
    total: "4.3333",
    due: null,
    vat: "de-12345",
  });
  const partial = await addBill({
    number: "PARTIAL",
    total: "50.1050",
    due: agingDate,
    vat: "DE12345",
  });
  const cleared = await addBill({
    number: "CLEARED",
    total: "48.0000",
    due: agingDate,
  });
  await addPayment({ billId: cleared, amount: "48.0000" });
  await addPayment({ billId: partial, amount: "10.0050" });
  await addPayment({ billId: partial, amount: "15.0000", currency: "PLN" });
  await addPayment({
    billId: partial,
    amount: "15.0000",
    sourceCompany: otherCompanyId,
    account: otherPayableAccount,
  });
  await addPayment({
    billId: partial,
    amount: "15.0000",
    account: otherPayableAccount,
  });
  const reversalId = crypto.randomUUID();
  const reversedPayment = await addPayment({
    billId: partial,
    amount: "15.0000",
    reversedBy: reversalId,
  });
  await addPayment({
    billId: partial,
    amount: "15.0000",
    id: reversalId,
    reversalOf: reversedPayment,
  });
  await addPayment({
    billId: partial,
    amount: "15.0000",
    journalStatus: JournalEntryStatus.DRAFT,
  });
  await addBill({
    number: "ANOTHER-ENTITY",
    total: "2.1111",
    due: "2026-08-25",
    vat: "DE99999",
  });
  await addBill({
    number: "WAITING",
    total: "52.6750",
    due: "2026-10-25",
    status: BillStatus.RECEIVED,
  });
  await addBill({
    number: "NEEDS-LINES",
    total: "0",
    due: null,
    status: BillStatus.RECEIVED,
  });
  await addBill({
    number: "DISPUTED",
    total: "85.7550",
    due: agingDate,
    status: BillStatus.DISPUTED,
  });
  await addBill({
    number: "DRAFT",
    total: "300",
    due: agingDate,
    status: BillStatus.DRAFT,
  });
  await addBill({
    number: "PAID",
    total: "180",
    due: agingDate,
    status: BillStatus.PAID,
  });
  await addBill({
    number: "STALE",
    total: "100",
    due: agingDate,
    paidAt: "2026-11-15",
  });
  await addBill({
    number: "FOREIGN-CURRENCY",
    total: "10.005",
    due: agingDate,
    currency: "PLN",
  });
  await addBill({
    number: "FOREIGN-COMPANY",
    total: "999.999",
    due: agingDate,
    company: otherCompanyId,
  });

  const report = await PayablesAgingRepository.getPayablesAging(
    { agingDate },
    logger,
    userId,
    defaultLocale,
  );
  expect(report.success).toBe(true);
  if (!report.success) {
    return;
  }
  expect(report.data.reportCompanyId).toBe(companyId);
  expect(report.data.reportCurrency).toBe("EUR");
  expect(report.data.approved.suppliers).toHaveLength(2);
  expect(
    report.data.approved.suppliers[0]?.bills.map(
      ({ billNumber }) => billNumber,
    ),
  ).toEqual(["PAST-30", "PARTIAL", "NO-DUE"]);
  expect(report.data.approved.totals).toEqual({
    current: 4010,
    days1to30: 10001,
    days31to60: 0,
    days61to90: 0,
    over90: 211,
    undated: 433,
    total: 14655,
  });
  expect(report.data.received.totals.total).toBe(5268);
  expect(report.data.disputed.totals.total).toBe(8576);
  expect(report.data.disputed.suppliers[0]?.bills[0]?.billNumber).toBe(
    "DISPUTED",
  );
  expect(report.data.received.totals.days31to60).toBe(5268);
  expect(
    report.data.received.suppliers[0]?.bills.map(
      ({ billNumber }) => billNumber,
    ),
  ).toEqual(["WAITING", "NEEDS-LINES"]);

  const alternate = await PayablesAgingRepository.getPayablesAging(
    { companyId, agingDate, currency: "PLN" },
    logger,
    userId,
    defaultLocale,
  );
  expect(alternate.success && alternate.data.approved.totals.total).toBe(1001);
});

test("rejects explicit unauthorized companies and needs a choice for multiple memberships", async () => {
  const denied = await PayablesAgingRepository.getPayablesAging(
    { companyId: otherCompanyId, agingDate },
    logger,
    userId,
    defaultLocale,
  );
  expect(denied.success).toBe(false);
  if (!denied.success) {
    expect(denied.errorType).toBe(ErrorResponseTypes.FORBIDDEN);
  }
  await pg.query("INSERT INTO company_members VALUES ($1,$2,true)", [
    otherCompanyId,
    userId,
  ]);
  const unselected = await PayablesAgingRepository.getPayablesAging(
    { agingDate },
    logger,
    userId,
    defaultLocale,
  );
  expect(unselected.success).toBe(true);
  if (unselected.success) {
    expect(unselected.data.reportCompanyId).toBeNull();
    expect(unselected.data.approved.suppliers).toEqual([]);
    expect(unselected.data.received.suppliers).toEqual([]);
  }
});
