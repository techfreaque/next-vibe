import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { success } from "next-vibe/core/route/response.schema";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";

import { BillStatus, InvoiceStatus } from "@/payment/enum";

import { accountingPeriods, journalEntries, journalEntryLines } from "../db";
import type { CoaJournalCreateRequestOutput } from "../journal/create/definition";
import {
  AccountSubtype,
  AccountType,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
  PeriodStatus,
} from "../enum";
import { formatJournalUnits } from "../shared/journal-validation";

const pg = new PGlite();
const db = drizzle(pg);
mock.module("next-vibe/database", () => ({ db }));
mock.module("@/companies/repository", () => ({
  CompanyAuthRepository: { requireMember: () => Promise.resolve(success({})) },
}));

const id = (n: number): string =>
  `00000000-0000-4000-8000-${n.toString().padStart(12, "0")}`;
const companyId = id(1);
const otherCompanyId = id(2);
const january = id(11);
const february = id(12);
const foreignPeriod = id(13);
const bank = id(21);
const sales = id(22);
const foreignBank = id(23);
const parentBank = id(24);
const logger = createEndpointLogger(false, defaultLocale);

test("journal totals display all four places beyond floating-point precision", () => {
  const money = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
  expect(formatJournalUnits(BigInt("20000000000000001"), money)).toBe(
    "2.000.000.000.000,0001",
  );
  expect(formatJournalUnits(BigInt(251_250), money)).toBe("25,125");
  expect(formatJournalUnits(BigInt(250_000), money)).toBe("25,00");
});

const user: JwtPrivatePayloadType = {
  id: id(31),
  leadId: id(32),
  isPublic: false,
  roles: [UserRole.ADMIN],
};

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE companies (id uuid PRIMARY KEY, currency text, name text, is_active boolean NOT NULL DEFAULT true);
    CREATE TABLE company_members (company_id uuid, user_id uuid, is_active boolean);
    CREATE TABLE payment_invoices (id uuid PRIMARY KEY, company_id uuid, amount numeric(10,2), currency text, status text, metadata jsonb);
    CREATE TABLE payment_bills (id uuid PRIMARY KEY, company_id uuid, total numeric(10,2), currency text, status text, paid_at timestamp);
    CREATE TABLE account_nodes (
      id uuid PRIMARY KEY, company_id uuid NOT NULL, code text NOT NULL,
      name text NOT NULL, type text NOT NULL, subtype text NOT NULL,
      is_active boolean NOT NULL DEFAULT true, is_postable boolean NOT NULL DEFAULT true,
      template_node_id uuid, parent_id uuid, is_system boolean DEFAULT false,
      description text, sort_order integer DEFAULT 0,
      created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now()
    );
    CREATE TABLE accounting_periods (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid NOT NULL,
      name text NOT NULL, start_date timestamp NOT NULL, end_date timestamp NOT NULL,
      status text NOT NULL DEFAULT '${PeriodStatus.OPEN}',
      closed_at timestamp, closed_by_user_id uuid,
      created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now()
    );
    CREATE TABLE journal_entries (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid NOT NULL,
      period_id uuid NOT NULL REFERENCES accounting_periods(id),
      entry_number text NOT NULL, date timestamp NOT NULL, description text NOT NULL,
      memo text, status text NOT NULL DEFAULT '${JournalEntryStatus.DRAFT}',
      reversal_of_id uuid, reversed_by_id uuid, posted_at timestamp, posted_by_user_id uuid,
      source_type text NOT NULL DEFAULT '${JournalSourceType.MANUAL}', source_id uuid,
      created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now()
    );
    CREATE TABLE journal_entry_lines (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      journal_entry_id uuid NOT NULL REFERENCES journal_entries(id),
      account_id uuid NOT NULL REFERENCES account_nodes(id), type text NOT NULL,
      amount numeric(14, 4) NOT NULL,
      description text CHECK (description <> 'reject-this-line'),
      currency text NOT NULL, sort_order integer NOT NULL DEFAULT 0, created_at timestamp DEFAULT now()
    );
    INSERT INTO companies (id, currency, name) VALUES
      ('${companyId}', 'EUR', 'Alpha Company'), ('${otherCompanyId}', 'EUR', 'Beta Company');
    INSERT INTO company_members VALUES
      ('${companyId}', '${user.id}', true), ('${otherCompanyId}', '${user.id}', false);
    INSERT INTO accounting_periods (id, company_id, name, start_date, end_date) VALUES
      ('${january}', '${companyId}', 'January', '2026-01-01', '2026-01-31'),
      ('${february}', '${companyId}', 'February', '2026-02-01', '2026-02-28'),
      ('${foreignPeriod}', '${otherCompanyId}', 'February', '2026-02-01', '2026-02-28');
    INSERT INTO account_nodes (id, company_id, code, name, type, subtype, is_postable) VALUES
      ('${bank}', '${companyId}', '1000', 'Cash at bank', '${AccountType.ASSET}', '${AccountSubtype.BANK}', true),
      ('${sales}', '${companyId}', '4000', 'Sales', '${AccountType.REVENUE}', '${AccountSubtype.REVENUE_SALES}', true),
      ('${foreignBank}', '${otherCompanyId}', '1000', 'Foreign bank', '${AccountType.ASSET}', '${AccountSubtype.BANK}', true),
      ('${parentBank}', '${companyId}', '0999', 'All bank accounts', '${AccountType.ASSET}', '${AccountSubtype.BANK}', false);
  `);
});

afterAll(async () => {
  await pg.close();
});

test("manual journal writes, period closing, and reversal preserve ledger history", async () => {
  const { CoaJournalCreateRepository } =
    await import("../journal/create/repository");
  const { CoaJournalPostRepository } =
    await import("../journal/[entryId]/post/repository");
  const { CoaJournalReverseRepository } =
    await import("../journal/[entryId]/reverse/repository");
  const { CoaPeriodCloseRepository } =
    await import("../period/[periodId]/close/repository");
  const { CoaPeriodCreateRepository } =
    await import("../period/create/repository");
  const { CoaLedgerRepository } =
    await import("../ledger/[accountId]/repository");
  const { TrialBalanceRepository } =
    await import("../reports/trial-balance/repository");

  const base = {
    companyId,
    periodId: january,
    date: new Date("2026-01-31T18:00:00Z"),
    description: "January sale",
    lines: [
      { accountId: bank, type: "DEBIT", amount: 25, currency: "EUR" },
      { accountId: sales, type: "CREDIT", amount: 25, currency: "EUR" },
    ],
  };
  const create = (data: CoaJournalCreateRequestOutput) =>
    CoaJournalCreateRepository.createEntry(data, user, logger, defaultLocale);
  const close = () =>
    CoaPeriodCloseRepository.closePeriod(january, user, logger, defaultLocale);
  const reverse = (entryId: string, date: string) =>
    CoaJournalReverseRepository.reverseEntry(
      { entryId, reversalDate: new Date(date) },
      user,
      logger,
      defaultLocale,
    );

  expect((await create({ ...base, periodId: foreignPeriod })).success).toBe(
    false,
  );
  expect(
    (await create({ ...base, date: new Date("2026-02-01") })).success,
  ).toBe(false);
  expect(
    (
      await create({
        ...base,
        lines: base.lines.map((line) => ({ ...line, accountId: foreignBank })),
      })
    ).success,
  ).toBe(false);
  expect(
    (
      await create({
        ...base,
        lines: base.lines.map((line) => ({ ...line, accountId: parentBank })),
      })
    ).success,
  ).toBe(false);
  expect(await db.select().from(journalEntries)).toHaveLength(0);

  const entry = await create({
    ...base,
    lines: base.lines.map((line) => ({ ...line, currency: undefined })),
  });
  expect(entry.success).toBe(true);
  if (!entry.success) {
    return;
  }
  expect((await close()).success).toBe(false);
  const post = () =>
    CoaJournalPostRepository.postEntry(
      entry.data.id,
      user,
      logger,
      defaultLocale,
    );
  const postResults = await Promise.all([post(), post()]);
  expect(postResults.filter((result) => result.success)).toHaveLength(1);
  expect((await close()).success).toBe(true);
  const [closed] = await db
    .select()
    .from(accountingPeriods)
    .where(eq(accountingPeriods.id, january));
  expect((await close()).success).toBe(true);
  const [retried] = await db
    .select()
    .from(accountingPeriods)
    .where(eq(accountingPeriods.id, january));
  expect(retried.closedAt).toEqual(closed.closedAt);
  expect((await create(base)).success).toBe(false);
  expect((await reverse(entry.data.id, "2026-01-31")).success).toBe(false);
  expect((await reverse(entry.data.id, "2026-01-30")).success).toBe(false);

  const { CoaPeriodListRepository } = await import("../period/list/repository");
  const { CoaAccountListRepository } =
    await import("../account/list/repository");
  const openPeriods = await CoaPeriodListRepository.listPeriods(
    { companyId, status: PeriodStatus.OPEN },
    user.id,
    logger,
    defaultLocale,
  );
  expect(openPeriods).toMatchObject({
    success: true,
    data: { periods: [{ id: february, companyId, status: PeriodStatus.OPEN }] },
  });
  const postingAccounts = await CoaAccountListRepository.listAccounts(
    { companyId, postableOnly: true },
    user.id,
    logger,
    defaultLocale,
  );
  expect(postingAccounts).toMatchObject({
    success: true,
    data: {
      total: 2,
      accounts: expect.arrayContaining(
        [{ id: bank }, { id: sales }].map((account) =>
          expect.objectContaining(account),
        ),
      ),
    },
  });

  const overlap = await CoaPeriodCreateRepository.createPeriod(
    {
      companyId,
      name: "Overlap",
      startDate: new Date("2026-02-28"),
      endDate: new Date("2026-03-10"),
    },
    user.id,
    logger,
    defaultLocale,
  );
  expect(overlap.success).toBe(false);

  const results = await Promise.all([
    reverse(entry.data.id, "2026-02-03T18:00:00Z"),
    reverse(entry.data.id, "2026-02-03T18:00:00Z"),
  ]);
  expect(results.filter((result) => result.success)).toHaveLength(1);
  const allEntries = await db
    .select()
    .from(journalEntries)
    .orderBy(journalEntries.date);
  expect(allEntries).toMatchObject([
    {
      periodId: january,
      status: JournalEntryStatus.REVERSED,
      entryNumber: "JE-2026-0001",
      reversedById: allEntries[1].id,
    },
    {
      periodId: february,
      status: JournalEntryStatus.POSTED,
      entryNumber: "JE-2026-0002",
      reversalOfId: entry.data.id,
    },
  ]);

  const historical = await TrialBalanceRepository.getTrialBalance(
    { companyId, asOfDate: new Date("2026-01-31") },
    logger,
    user,
    defaultLocale,
  );
  expect(historical).toMatchObject({
    success: true,
    data: { totalDebits: 25, totalCredits: 25, isBalanced: true },
  });
  const combined = await TrialBalanceRepository.getTrialBalance(
    { companyId, asOfDate: new Date("2026-02-03") },
    logger,
    user,
    defaultLocale,
  );
  expect(combined).toMatchObject({
    success: true,
    data: { totalDebits: 50, totalCredits: 50, isBalanced: true },
  });
  if (combined.success) {
    expect(
      combined.data.accounts.every((account) => account.balance === 0),
    ).toBe(true);
  }

  const secondPage = await CoaLedgerRepository.getLedger(
    bank,
    { page: 2, pageSize: 1 },
    user.id,
    logger,
    defaultLocale,
  );
  expect(secondPage).toMatchObject({
    success: true,
    data: { totalCount: 2, lines: [{ runningBalance: 0 }] },
  });
  const reversalOnly = await CoaLedgerRepository.getLedger(
    bank,
    {
      page: 1,
      pageSize: 20,
      dateFrom: new Date("2026-02-03"),
      dateTo: new Date("2026-02-03"),
    },
    user.id,
    logger,
    defaultLocale,
  );
  expect(reversalOnly).toMatchObject({
    success: true,
    data: { totalCount: 1, lines: [{ runningBalance: 0 }] },
  });
});

test("automatic journal posting skips nonpostable accounts and rolls back a failed line", async () => {
  const { autoPostJournalEntry } = await import("../shared/auto-post");
  const params = {
    companyId,
    date: new Date("2026-02-28T20:00:00Z"),
    description: "Payment",
    sourceType: JournalSourceType.AR_PAYMENT,
    sourceId: id(41),
    logger: { ...logger, error: mock() },
    lines: [
      {
        subtype: AccountSubtype.BANK,
        type: LineType.DEBIT,
        amount: 10,
        currency: "EUR",
      },
      {
        subtype: AccountSubtype.REVENUE_SALES,
        type: LineType.CREDIT,
        amount: 10,
        currency: "EUR",
      },
    ],
  };

  const rejected = await autoPostJournalEntry({
    ...params,
    lines: params.lines.map((line) => ({
      ...line,
      description: "reject-this-line",
    })),
  });
  expect(rejected).toBeNull();
  expect(params.logger.error).toHaveBeenCalledTimes(1);
  expect(
    await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.sourceId, params.sourceId)),
  ).toHaveLength(0);

  const posted = await autoPostJournalEntry(params);
  expect(typeof posted).toBe("string");
  if (posted) {
    const lines = await db
      .select()
      .from(journalEntryLines)
      .where(eq(journalEntryLines.journalEntryId, posted))
      .orderBy(journalEntryLines.sortOrder);
    expect(lines.map((line) => line.accountId)).toEqual([bank, sales]);
  }
});

test("accounting dashboard loads a single active company and its current open period", async () => {
  const { AccountingDashboardRepository } =
    await import("../dashboard/repository");
  const current = new Date();
  current.setUTCHours(0, 0, 0, 0);
  const future = new Date(current);
  future.setUTCDate(future.getUTCDate() + 1);

  await db.insert(accountingPeriods).values([
    {
      id: id(51),
      companyId,
      name: "Future period",
      startDate: future,
      endDate: future,
    },
    {
      id: id(52),
      companyId,
      name: "Current period",
      startDate: current,
      endDate: current,
    },
  ]);

  const dashboard = await AccountingDashboardRepository.getDashboard(
    {},
    logger,
    user,
    defaultLocale,
  );
  expect(dashboard).toMatchObject({
    success: true,
    data: {
      selectedCompanyId: companyId,
      selectedCompanyName: "Alpha Company",
      currentPeriodId: id(52),
      accountCount: 3,
    },
  });

  await pg.query(
    "update company_members set is_active = true where company_id = $1",
    [otherCompanyId],
  );
  const needsSelection = await AccountingDashboardRepository.getDashboard(
    {},
    logger,
    user,
    defaultLocale,
  );
  expect(needsSelection).toMatchObject({
    success: true,
    data: { selectedCompanyId: null },
  });
});

test("financial reports keep historic currencies separate and carry unclosed earnings into equity", async () => {
  const { BalanceSheetRepository } =
    await import("../reports/balance-sheet/repository");
  const { TrialBalanceRepository } =
    await import("../reports/trial-balance/repository");
  const { ProfitLossRepository } =
    await import("../reports/profit-loss/repository");

  const janEnd = new Date("2026-01-31");
  const beforeReversal = await BalanceSheetRepository.getBalanceSheet(
    { companyId, asOfDate: janEnd },
    logger,
    user,
    defaultLocale,
  );
  expect(beforeReversal).toMatchObject({
    success: true,
    data: {
      reportCurrency: "EUR",
      totalAssets: 25,
      totalEquity: 25,
      unclosedEarnings: 25,
      isBalanced: true,
    },
  });

  // Historic direct writes could hold a currency different from the company currency.
  await db.insert(journalEntries).values({
    id: id(61),
    companyId,
    periodId: february,
    entryNumber: "HISTORIC-USD",
    date: new Date("2026-02-04"),
    description: "Historic USD sale",
    status: JournalEntryStatus.POSTED,
  });
  await db.insert(journalEntryLines).values([
    {
      journalEntryId: id(61),
      accountId: bank,
      type: LineType.DEBIT,
      amount: 4.125,
      currency: "USD",
    },
    {
      journalEntryId: id(61),
      accountId: sales,
      type: LineType.CREDIT,
      amount: 4.125,
      currency: "USD",
    },
  ]);

  const scope = { companyId, asOfDate: new Date("2026-02-28") };
  const mixed = await TrialBalanceRepository.getTrialBalance(
    scope,
    logger,
    user,
    defaultLocale,
  );
  expect(mixed.success).toBe(false);
  const usd = await BalanceSheetRepository.getBalanceSheet(
    { ...scope, currency: "USD" },
    logger,
    user,
    defaultLocale,
  );
  expect(usd).toMatchObject({
    success: true,
    data: {
      reportCurrency: "USD",
      totalAssets: 4.125,
      totalEquity: 4.125,
      unclosedEarnings: 4.125,
      isBalanced: true,
    },
  });
  const nominal = await ProfitLossRepository.getProfitLoss(
    { companyId, from: new Date("2026-02-04"), to: new Date("2026-02-04") },
    logger,
    user,
    defaultLocale,
  );
  expect(nominal).toMatchObject({
    success: true,
    data: { reportCurrency: "USD", netProfit: 4.125 },
  });

  // A closing entry moves the earnings to an equity account exactly once.
  const retained = id(62);
  await pg.query(
    "insert into account_nodes (id, company_id, code, name, type, subtype) values ($1,$2,$3,$4,$5,$6)",
    [
      retained,
      companyId,
      "3000",
      "Retained earnings",
      AccountType.EQUITY,
      AccountSubtype.RETAINED_EARNINGS,
    ],
  );
  await db.insert(journalEntries).values({
    id: id(63),
    companyId,
    periodId: february,
    entryNumber: "HISTORIC-CLOSE",
    date: new Date("2026-02-05"),
    description: "Close earnings",
    status: JournalEntryStatus.POSTED,
  });
  await db.insert(journalEntryLines).values([
    {
      journalEntryId: id(63),
      accountId: sales,
      type: LineType.DEBIT,
      amount: 4.125,
      currency: "USD",
    },
    {
      journalEntryId: id(63),
      accountId: retained,
      type: LineType.CREDIT,
      amount: 4.125,
      currency: "USD",
    },
  ]);
  const closed = await BalanceSheetRepository.getBalanceSheet(
    { ...scope, currency: "USD" },
    logger,
    user,
    defaultLocale,
  );
  expect(closed).toMatchObject({
    success: true,
    data: {
      reportCurrency: "USD",
      totalEquity: 4.125,
      unclosedEarnings: 0,
      isBalanced: true,
    },
  });
});

test("dashboard money uses the company currency, live document balances and posted reversal movements", async () => {
  const { AccountingDashboardRepository } =
    await import("../dashboard/repository");
  const metricCompany = id(90);
  const periodId = id(91);
  const cashAccount = id(92);
  const revenueAccount = id(93);
  const receivableAccount = id(94);
  const payableAccount = id(95);
  const expenseAccount = id(96);
  const invoice = id(97);
  const bill = id(98);
  const today = new Date().toISOString().slice(0, 10);
  const monthStart = today.slice(0, 7) + "-01";

  await pg.exec(`
    INSERT INTO companies (id, currency, name) VALUES ('${metricCompany}', 'EUR', 'Metrics company');
    INSERT INTO company_members VALUES ('${metricCompany}', '${user.id}', true);
    INSERT INTO accounting_periods (id, company_id, name, start_date, end_date)
      VALUES ('${periodId}', '${metricCompany}', 'Finance', '${monthStart}', '${today}');
    INSERT INTO account_nodes (id, company_id, code, name, type, subtype) VALUES
      ('${cashAccount}', '${metricCompany}', '100', 'Cash', '${AccountType.ASSET}', '${AccountSubtype.CASH}'),
      ('${revenueAccount}', '${metricCompany}', '400', 'Sales', '${AccountType.REVENUE}', '${AccountSubtype.REVENUE_SALES}'),
      ('${receivableAccount}', '${metricCompany}', '110', 'Receivables', '${AccountType.ASSET}', '${AccountSubtype.ACCOUNTS_RECEIVABLE}'),
      ('${payableAccount}', '${metricCompany}', '200', 'Payables', '${AccountType.LIABILITY}', '${AccountSubtype.ACCOUNTS_PAYABLE}'),
      ('${expenseAccount}', '${metricCompany}', '500', 'Expense', '${AccountType.EXPENSE}', '${AccountSubtype.OTHER}');
    INSERT INTO payment_invoices VALUES
      ('${invoice}', '${metricCompany}', 100, 'EUR', '${InvoiceStatus.OPEN}', null),
      ('${id(99)}', '${metricCompany}', -20, 'EUR', '${InvoiceStatus.OPEN}', jsonb_build_object('originalInvoiceId', '${invoice}')),
      ('${id(100)}', '${metricCompany}', 1000, 'USD', '${InvoiceStatus.OPEN}', null),
      ('${id(101)}', '${otherCompanyId}', 1000, 'EUR', '${InvoiceStatus.OPEN}', null);
    INSERT INTO payment_bills VALUES
      ('${bill}', '${metricCompany}', 60, 'EUR', '${BillStatus.APPROVED}', null),
      ('${id(102)}', '${metricCompany}', 1000, 'USD', '${BillStatus.APPROVED}', null),
      ('${id(103)}', '${otherCompanyId}', 1000, 'EUR', '${BillStatus.APPROVED}', null),
      ('${id(104)}', '${metricCompany}', 1000, 'EUR', '${BillStatus.RECEIVED}', null);
    INSERT INTO journal_entries (id, company_id, period_id, entry_number, date, description, status, reversal_of_id, reversed_by_id, source_type, source_id) VALUES
      ('${id(110)}', '${metricCompany}', '${periodId}', 'B-110', '${monthStart}'::date - 1, 'Earlier', '${JournalEntryStatus.POSTED}', null, null, '${JournalSourceType.MANUAL}', null),
      ('${id(111)}', '${metricCompany}', '${periodId}', 'B-111', '${today}', 'Sale', '${JournalEntryStatus.POSTED}', null, null, '${JournalSourceType.MANUAL}', null),
      ('${id(112)}', '${metricCompany}', '${periodId}', 'B-112', '${today}', 'Original', '${JournalEntryStatus.REVERSED}', null, '${id(113)}', '${JournalSourceType.AP_PAYMENT}', '${bill}'),
      ('${id(113)}', '${metricCompany}', '${periodId}', 'B-113', '${today}', 'Reversal', '${JournalEntryStatus.POSTED}', '${id(112)}', null, '${JournalSourceType.AP_PAYMENT}', '${bill}'),
      ('${id(114)}', '${metricCompany}', '${periodId}', 'B-114', '${today}', 'Receipt', '${JournalEntryStatus.POSTED}', null, null, '${JournalSourceType.AR_PAYMENT}', '${invoice}'),
      ('${id(115)}', '${metricCompany}', '${periodId}', 'B-115', '${today}', 'Bill payment', '${JournalEntryStatus.POSTED}', null, null, '${JournalSourceType.AP_PAYMENT}', '${bill}'),
      ('${id(116)}', '${metricCompany}', '${periodId}', 'B-116', '${today}'::date + 1, 'Future', '${JournalEntryStatus.POSTED}', null, null, '${JournalSourceType.MANUAL}', null),
      ('${id(117)}', '${otherCompanyId}', '${foreignPeriod}', 'B-117', '${today}', 'Other company', '${JournalEntryStatus.POSTED}', null, null, '${JournalSourceType.MANUAL}', null),
      ('${id(118)}', '${metricCompany}', '${periodId}', 'B-118', '${today}', 'Expense', '${JournalEntryStatus.POSTED}', null, null, '${JournalSourceType.MANUAL}', null);
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, type, amount, currency) VALUES
      ('${id(110)}', '${cashAccount}', '${LineType.DEBIT}', 100, 'EUR'),
      ('${id(110)}', '${revenueAccount}', '${LineType.CREDIT}', 100, 'EUR'),
      ('${id(111)}', '${cashAccount}', '${LineType.DEBIT}', 150, 'EUR'),
      ('${id(111)}', '${revenueAccount}', '${LineType.CREDIT}', 150, 'EUR'),
      ('${id(111)}', '${cashAccount}', '${LineType.DEBIT}', 1000, 'USD'),
      ('${id(111)}', '${revenueAccount}', '${LineType.CREDIT}', 1000, 'USD'),
      ('${id(112)}', '${cashAccount}', '${LineType.CREDIT}', 50, 'EUR'),
      ('${id(112)}', '${payableAccount}', '${LineType.DEBIT}', 50, 'EUR'),
      ('${id(113)}', '${cashAccount}', '${LineType.DEBIT}', 50, 'EUR'),
      ('${id(113)}', '${payableAccount}', '${LineType.CREDIT}', 50, 'EUR'),
      ('${id(114)}', '${cashAccount}', '${LineType.DEBIT}', 30, 'EUR'),
      ('${id(114)}', '${receivableAccount}', '${LineType.CREDIT}', 30, 'EUR'),
      ('${id(115)}', '${cashAccount}', '${LineType.CREDIT}', 10, 'EUR'),
      ('${id(115)}', '${payableAccount}', '${LineType.DEBIT}', 10, 'EUR'),
      ('${id(116)}', '${cashAccount}', '${LineType.DEBIT}', 1000, 'EUR'),
      ('${id(117)}', '${foreignBank}', '${LineType.DEBIT}', 1000, 'EUR'),
      ('${id(118)}', '${expenseAccount}', '${LineType.DEBIT}', 25.1251, 'EUR'),
      ('${id(118)}', '${cashAccount}', '${LineType.CREDIT}', 25.1251, 'EUR');
  `);

  const dashboard = await AccountingDashboardRepository.getDashboard(
    { companyId: metricCompany },
    logger,
    user,
    defaultLocale,
  );
  expect(dashboard).toMatchObject({
    success: true,
    data: {
      currency: "EUR",
      selectedCompanyId: metricCompany,
      openReceivables: 50,
      approvedPayables: 50,
      cashBalance: 244.8749,
      monthToDateProfit: 124.8749,
    },
  });
  const fixture = process.env.ERP_DASHBOARD_KPI_FIXTURE;
  if (fixture && dashboard.success) {
    await Bun.write(fixture, JSON.stringify(dashboard.data));
  }

  const { CoaAccountListRepository } =
    await import("../account/list/repository");
  const accounts = await CoaAccountListRepository.listAccounts(
    { companyId: metricCompany },
    user.id,
    logger,
    defaultLocale,
  );
  expect(accounts.success).toBe(true);
  if (accounts.success) {
    expect(
      accounts.data.accounts.find((row) => row.id === cashAccount)?.balances,
    ).toEqual([
      { currency: "EUR", amount: 244.8749 },
      { currency: "USD", amount: 1000 },
    ]);
    const accountsFixture = process.env.ERP_CHART_ACCOUNTS_FIXTURE;
    if (accountsFixture) {
      await Bun.write(accountsFixture, JSON.stringify(accounts.data));
    }
  }
});
