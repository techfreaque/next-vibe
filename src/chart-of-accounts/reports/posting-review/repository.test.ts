import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { createEndpointLogger } from "next-vibe/logger/server";

import { BillStatus, InvoiceStatus } from "@/payment/enum";

import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
} from "../../enum";
import { ReviewIssue, ReviewReason } from "./enum";
import { PostingReviewRepository } from "./repository";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));

const company = crypto.randomUUID();
const outsideCompany = crypto.randomUUID();
const actor = crypto.randomUUID();
const outsider = crypto.randomUUID();
const logger = createEndpointLogger(false, defaultLocale);
const receivable = crypto.randomUUID();
const payable = crypto.randomUUID();
const operating = crypto.randomUUID();
const foreignAccount = crypto.randomUUID();

type FixtureLine = {
  account: string;
  direction: string;
  amount: string;
  currency?: string;
};

async function journal({
  label,
  id = crypto.randomUUID(),
  tenant = company,
  status = JournalEntryStatus.POSTED,
  sourceType = JournalSourceType.MANUAL,
  sourceId = null,
  reversalOfId = null,
  reversedById = null,
  lines = [],
}: {
  label: string;
  id?: string;
  tenant?: string;
  status?: string;
  sourceType?: string;
  sourceId?: string | null;
  reversalOfId?: string | null;
  reversedById?: string | null;
  lines?: readonly FixtureLine[];
}): Promise<string> {
  await pg.query(
    `INSERT INTO journal_entries
      (id,company_id,entry_number,date,status,source_type,source_id,reversal_of_id,reversed_by_id)
      VALUES ($1,$2,$3,'2026-11-10',$4,$5,$6,$7,$8)`,
    [
      id,
      tenant,
      label,
      status,
      sourceType,
      sourceId,
      reversalOfId,
      reversedById,
    ],
  );
  for (const { account, direction, amount, currency = "EUR" } of lines) {
    await pg.query("INSERT INTO journal_entry_lines VALUES ($1,$2,$3,$4,$5)", [
      id,
      account,
      direction,
      amount,
      currency,
    ]);
  }
  return id;
}

function pair({
  debit = operating,
  credit = operating,
  amount = "10",
  otherAmount = amount,
  debitCurrency = "EUR",
  creditCurrency = debitCurrency,
}: {
  debit?: string;
  credit?: string;
  amount?: string;
  otherAmount?: string;
  debitCurrency?: string;
  creditCurrency?: string;
} = {}): FixtureLine[] {
  return [
    {
      account: debit,
      direction: LineType.DEBIT,
      amount,
      currency: debitCurrency,
    },
    {
      account: credit,
      direction: LineType.CREDIT,
      amount: otherAmount,
      currency: creditCurrency,
    },
  ];
}

async function invoice({
  id = crypto.randomUUID(),
  reference,
  posting = null,
  amount = "10",
  status = InvoiceStatus.OPEN,
  currency = "EUR",
  tenant = company,
  created = "2026-11-02",
}: {
  id?: string;
  reference: string;
  posting?: string | null;
  amount?: string;
  status?: string;
  currency?: string;
  tenant?: string;
  created?: string;
}): Promise<string> {
  await pg.query(
    `INSERT INTO payment_invoices
       (id,company_id,invoice_number,journal_entry_id,amount,status,currency,created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [id, tenant, reference, posting, amount, status, currency, created],
  );
  return id;
}

async function bill({
  id = crypto.randomUUID(),
  reference,
  posting = null,
  total = "20",
  status = BillStatus.APPROVED,
  tenant = company,
  date = "2026-11-05",
}: {
  id?: string;
  reference: string;
  posting?: string | null;
  total?: string;
  status?: string;
  tenant?: string;
  date?: string;
}): Promise<string> {
  await pg.query(
    `INSERT INTO payment_bills
       (id,company_id,bill_number,supplier_name,journal_entry_id,total,status,currency,bill_date)
     VALUES ($1,$2,$3,'Example Supplier',$4,$5,$6,'EUR',$7)`,
    [id, tenant, reference, posting, total, status, date],
  );
  return id;
}

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE companies (id uuid PRIMARY KEY, name text, currency text, is_active boolean);
    CREATE TABLE company_members (company_id uuid, user_id uuid, is_active boolean);
    CREATE TABLE account_nodes (id uuid PRIMARY KEY, company_id uuid, subtype text);
    CREATE TABLE journal_entries (
      id uuid PRIMARY KEY, company_id uuid, entry_number text, date timestamp,
      status text, source_type text, source_id uuid, reversal_of_id uuid, reversed_by_id uuid
    );
    CREATE TABLE journal_entry_lines (
      journal_entry_id uuid, account_id uuid, type text, amount numeric(14,4), currency text
    );
    CREATE TABLE payment_invoices (
      id uuid PRIMARY KEY, company_id uuid, invoice_number text, invoice_sequence_number int,
      journal_entry_id uuid, amount numeric(10,2), status text, currency text, created_at timestamp
    );
    CREATE TABLE payment_bills (
      id uuid PRIMARY KEY, company_id uuid, bill_number text, supplier_name text,
      journal_entry_id uuid, total numeric(12,4), status text, currency text, bill_date timestamp
    );
  `);
  await pg.query(
    "INSERT INTO companies VALUES ($1,'Example Company','EUR',true),($2,'Other Company','EUR',true)",
    [company, outsideCompany],
  );
  await pg.query(
    "INSERT INTO company_members VALUES ($1,$2,true),($3,$4,true)",
    [company, actor, outsideCompany, outsider],
  );
  await pg.query(
    "INSERT INTO account_nodes VALUES ($1,$2,$6),($3,$2,$7),($4,$2,$8),($5,$9,$8)",
    [
      receivable,
      company,
      payable,
      operating,
      foreignAccount,
      AccountSubtype.ACCOUNTS_RECEIVABLE,
      AccountSubtype.ACCOUNTS_PAYABLE,
      AccountSubtype.OPEX,
      outsideCompany,
    ],
  );

  await journal({ label: "NO-LINES" });
  await journal({
    label: "ONE-LINE",
    lines: [{ account: operating, direction: LineType.DEBIT, amount: "10" }],
  });
  await journal({
    label: "CROSS-CURRENCY",
    lines: pair({ creditCurrency: "USD" }),
  });
  await journal({
    label: "SUB-CENT",
    lines: pair({ amount: "1.0001", otherAmount: "1.0000" }),
  });
  await journal({
    label: "FOREIGN-ACCOUNT",
    lines: pair({ debit: foreignAccount }),
  });
  await journal({
    label: "BALANCED-IN-EACH-CURRENCY",
    lines: [...pair(), ...pair({ amount: "11", debitCurrency: "USD" })],
  });
  await journal({ label: "DRAFT", status: JournalEntryStatus.DRAFT });
  await journal({ label: "OTHER-COMPANY", tenant: outsideCompany });
  const corrected = await journal({ label: "LEGACY-CORRECTED" });
  await journal({ label: "CORRECTION", reversalOfId: corrected });
  const reversal = crypto.randomUUID();
  const reversed = await journal({
    label: "REVERSED-ORIGINAL",
    status: JournalEntryStatus.REVERSED,
    reversedById: reversal,
  });
  await journal({
    label: "PAIRED-REVERSAL",
    id: reversal,
    reversalOfId: reversed,
  });

  const validInvoice = crypto.randomUUID();
  const validInvoicePosting = await journal({
    label: "VALID-AR",
    sourceType: JournalSourceType.AR_INVOICE,
    sourceId: validInvoice,
    lines: pair({ debit: receivable }),
  });
  await invoice({
    id: validInvoice,
    reference: "AR-VALID",
    posting: validInvoicePosting,
  });

  const unlinkedInvoice = crypto.randomUUID();
  await invoice({
    id: unlinkedInvoice,
    reference: "AR-NO-BACKLINK",
    created: "2026-11-01",
  });
  await journal({
    label: "VALID-BUT-UNLINKED",
    sourceType: JournalSourceType.AR_INVOICE,
    sourceId: unlinkedInvoice,
    lines: pair({ debit: receivable }),
  });
  const foreignInvoice = crypto.randomUUID();
  const foreignPosting = await journal({
    label: "FOREIGN-POSTING",
    tenant: outsideCompany,
    sourceId: foreignInvoice,
    sourceType: JournalSourceType.AR_INVOICE,
  });
  await invoice({
    id: foreignInvoice,
    reference: "AR-FOREIGN",
    posting: foreignPosting,
    status: InvoiceStatus.PAID,
    created: "2026-11-03",
  });
  const wrongCurrency = crypto.randomUUID();
  const foreignCurrencyPosting = await journal({
    label: "WRONG-CURRENCY",
    sourceId: wrongCurrency,
    sourceType: JournalSourceType.AR_INVOICE,
    lines: pair({ debit: receivable, debitCurrency: "USD" }),
  });
  await invoice({
    id: wrongCurrency,
    reference: "AR-WRONG-CURRENCY",
    posting: foreignCurrencyPosting,
  });
  await invoice({ reference: "AR-DRAFT", status: InvoiceStatus.DRAFT });
  await invoice({ reference: "AR-VOID", status: InvoiceStatus.VOID });
  await invoice({ reference: "AR-CREDIT", amount: "-10" });
  await invoice({ reference: "AR-OTHER-COMPANY", tenant: outsideCompany });
  await invoice({ reference: "AR-ZERO", amount: "0" });

  const validBill = crypto.randomUUID();
  const validBillPosting = await journal({
    label: "VALID-AP",
    sourceId: validBill,
    sourceType: JournalSourceType.AP_BILL,
    lines: pair({ credit: payable, amount: "20" }),
  });
  await bill({
    id: validBill,
    reference: "AP-VALID",
    posting: validBillPosting,
    status: BillStatus.PAID,
  });
  await bill({ reference: "AP-UNLINKED", date: "2026-11-11" });
  const wrongControlBill = crypto.randomUUID();
  const wrongControlPosting = await journal({
    label: "AP-WRONG-CONTROL",
    sourceId: wrongControlBill,
    sourceType: JournalSourceType.AP_BILL,
    lines: pair({ credit: payable, amount: "19.9999" }),
  });
  await bill({
    id: wrongControlBill,
    reference: "AP-WRONG-CONTROL",
    posting: wrongControlPosting,
    date: "2026-11-10",
  });
  const wrongSourceBill = crypto.randomUUID();
  const wrongSourcePosting = await journal({
    label: "AP-PAYMENT-ONLY",
    sourceId: wrongSourceBill,
    sourceType: JournalSourceType.AP_PAYMENT,
    lines: pair({ debit: payable, amount: "20" }),
  });
  await bill({
    id: wrongSourceBill,
    reference: "AP-PAYMENT-ONLY",
    posting: wrongSourcePosting,
    status: BillStatus.PAID,
    date: "2026-11-09",
  });
  await bill({ reference: "AP-DRAFT", status: BillStatus.DRAFT });
  await bill({ reference: "AP-RECEIVED", status: BillStatus.RECEIVED });
  await bill({ reference: "AP-DISPUTED", status: BillStatus.DISPUTED });
  await bill({ reference: "AP-ZERO", total: "0" });
  await bill({ reference: "AP-OTHER-COMPANY", tenant: outsideCompany });
});
afterAll(() => pg.close());

test("reviews active original journals per currency at storage precision", async () => {
  const report = await PostingReviewRepository.review(
    { page: 1, pageSize: 25 },
    logger,
    actor,
    defaultLocale,
  );
  expect(report.success).toBe(true);
  if (!report.success) {
    return;
  }
  expect(report.data.reportCompanyId).toBe(company);
  expect(report.data.counts).toEqual({
    missingLines: 2,
    invalidLegs: 3,
    invoiceLinks: 3,
    billLinks: 3,
  });
  expect(
    report.data.rows
      .filter(({ kind }) => kind === ReviewIssue.MISSING_LINES)
      .map(({ reference }) => reference)
      .toSorted(),
  ).toEqual(["NO-LINES", "ONE-LINE"]);
  expect(
    report.data.rows
      .filter(({ kind }) => kind === ReviewIssue.INVALID_LEGS)
      .map(({ reference }) => reference)
      .toSorted(),
  ).toEqual(["CROSS-CURRENCY", "FOREIGN-ACCOUNT", "SUB-CENT"]);
  expect(report.data.matchedCount).toBe(11);
});

test("labels missing associations and invalid control legs distinctly", async () => {
  const report = await PostingReviewRepository.review(
    {
      companyId: company,
      page: 1,
      pageSize: 25,
      kind: ReviewIssue.INVOICE_LINK,
    },
    logger,
    actor,
    defaultLocale,
  );
  expect(report.success).toBe(true);
  if (!report.success) {
    return;
  }
  expect(
    report.data.rows.map(({ reference, reason, recordDate }) => ({
      reference,
      reason,
      recordDate,
    })),
  ).toEqual([
    {
      reference: "AR-FOREIGN",
      reason: ReviewReason.WRONG_POSTING,
      recordDate: "2026-11-03",
    },
    {
      reference: "AR-WRONG-CURRENCY",
      reason: ReviewReason.CONTROL_LEG,
      recordDate: "2026-11-02",
    },
    {
      reference: "AR-NO-BACKLINK",
      reason: ReviewReason.NO_BACKLINK,
      recordDate: "2026-11-01",
    },
  ]);
});

test("paginates a bounded issue filter without losing counts on an empty page", async () => {
  for (const { page, references } of [
    { page: 1, references: ["AP-UNLINKED", "AP-WRONG-CONTROL"] },
    { page: 2, references: ["AP-PAYMENT-ONLY"] },
    { page: 3, references: [] },
  ]) {
    const report = await PostingReviewRepository.review(
      { companyId: company, page, pageSize: 2, kind: ReviewIssue.BILL_LINK },
      logger,
      actor,
      defaultLocale,
    );
    expect(report.success).toBe(true);
    if (report.success) {
      expect(report.data.rows.map(({ reference }) => reference)).toEqual(
        references,
      );
      expect(report.data.matchedCount).toBe(3);
      expect(report.data.totalPages).toBe(2);
      expect(report.data.counts.invalidLegs).toBe(3);
    }
  }
});

test("denies other companies and prompts a multi-company member to choose", async () => {
  const denied = await PostingReviewRepository.review(
    { companyId: company, page: 1, pageSize: 25 },
    logger,
    outsider,
    defaultLocale,
  );
  expect(denied.success).toBe(false);
  if (!denied.success) {
    expect(denied.errorType).toBe(ErrorResponseTypes.FORBIDDEN);
  }

  await pg.query("INSERT INTO company_members VALUES ($1,$2,true)", [
    outsideCompany,
    actor,
  ]);
  const unscoped = await PostingReviewRepository.review(
    { page: 1, pageSize: 25 },
    logger,
    actor,
    defaultLocale,
  );
  expect(unscoped.success).toBe(true);
  if (unscoped.success) {
    expect(unscoped.data.reportCompanyId).toBeNull();
    expect(unscoped.data.rows).toEqual([]);
  }
});
