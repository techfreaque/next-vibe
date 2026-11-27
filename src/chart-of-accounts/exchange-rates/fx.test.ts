/**
 * Multi-Currency Ledger & FX Engine Tests
 *
 * Covers:
 * 1. ECB daily XML parsing, upsert, direct/inverse/cross-EUR rate resolution, and manual override precedence
 * 2. Foreign-currency auto-posting into functional EUR amounts
 * 3. Realized FX gain & loss computation on AR and AP settlements
 * 4. Period-end unrealized FX revaluation (preview, post, next-day auto-reversal)
 * 5. Multi-currency Trial Balance aggregating EUR + USD entries in balanced functional currency
 */

import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it, mock } from "bun:test";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { CompanyMemberRole } from "@/companies/enum";

import { exchangeRates, journalEntryLines } from "../db";
import {
  AccountSubtype,
  AccountType,
  JournalSourceType,
  LineType,
  PeriodStatus,
} from "../enum";

const pg = new PGlite();
const testDb = drizzle(pg);
mock.module("next-vibe/database", () => ({ db: testDb }));

const {
  lookupExchangeRate,
  parseEcbDailyXml,
  syncEcbDailyRates,
} = await import("./ecb");
const { postJournalEntry } = await import("../shared/auto-post");
const { buildRealizedFxSettlement } = await import("../shared/fx-settlement");
const { runUnrealizedFxRevaluation } = await import("../revaluation/engine");
const { TrialBalanceRepository } = await import(
  "../reports/trial-balance/repository"
);

const logger = createEndpointLogger(false, defaultLocale);
const userId = crypto.randomUUID();
const companyId = crypto.randomUUID();
const arAccountId = crypto.randomUUID();
const revAccountId = crypto.randomUUID();
const bankAccountId = crypto.randomUUID();
const fxGainAccountId = crypto.randomUUID();
const fxLossAccountId = crypto.randomUUID();

const SAMPLE_ECB_XML = `<?xml version="1.0" encoding="UTF-8"?>
<gesmes:Envelope xmlns:gesmes="http://www.gesmes.org/xml/2002-08-01" xmlns="http://www.ecb.int/vocabulary/2002-08-01/eurofxref">
  <Cube>
    <Cube time='2026-01-10'>
      <Cube currency='USD' rate='1.1000'/>
      <Cube currency='GBP' rate='0.8500'/>
      <Cube currency='CZK' rate='25.000'/>
    </Cube>
  </Cube>
</gesmes:Envelope>`;

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE users (id uuid PRIMARY KEY);
    CREATE TABLE companies (
      id uuid PRIMARY KEY, name text NOT NULL, is_active boolean DEFAULT true,
      currency text DEFAULT 'EUR', country text DEFAULT 'DE'
    );
    CREATE TABLE company_members (
      id uuid DEFAULT gen_random_uuid(), company_id uuid, user_id uuid,
      role text, is_active boolean DEFAULT true, invited_by_user_id uuid,
      joined_at timestamp, created_at timestamp, updated_at timestamp
    );
    CREATE TABLE exchange_rates (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      base_currency text NOT NULL, quote_currency text NOT NULL,
      rate numeric(16,8) NOT NULL, rate_date date NOT NULL,
      source text NOT NULL DEFAULT 'ECB',
      created_by_user_id uuid, created_at timestamp DEFAULT now(),
      UNIQUE (base_currency, quote_currency, rate_date, source)
    );
    CREATE TABLE account_nodes (
      id uuid PRIMARY KEY, company_id uuid NOT NULL, code text NOT NULL,
      name text NOT NULL, type text NOT NULL, subtype text NOT NULL,
      is_active boolean DEFAULT true, is_postable boolean DEFAULT true,
      is_system boolean DEFAULT false, sort_order int DEFAULT 0
    );
    CREATE TABLE accounting_periods (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id uuid NOT NULL, name text NOT NULL,
      start_date timestamp NOT NULL, end_date timestamp NOT NULL,
      status text NOT NULL, closed_at timestamp, closed_by_user_id uuid,
      created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now()
    );
    CREATE TABLE journal_entries (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id uuid NOT NULL, period_id uuid NOT NULL,
      entry_number text NOT NULL, date timestamp NOT NULL,
      description text NOT NULL, memo text, status text NOT NULL,
      source_type text NOT NULL, source_id uuid,
      reversal_of_id uuid, reversed_by_id uuid,
      posted_at timestamp DEFAULT now(), posted_by_user_id uuid,
      created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now()
    );
    CREATE TABLE journal_entry_lines (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      journal_entry_id uuid NOT NULL, account_id uuid NOT NULL,
      type text NOT NULL, amount numeric(14,4) NOT NULL,
      currency text NOT NULL,
      functional_amount numeric(14,4),
      functional_currency text,
      exchange_rate numeric(16,8),
      description text, sort_order int NOT NULL DEFAULT 0,
      created_at timestamp DEFAULT now()
    );
    INSERT INTO users VALUES ('${userId}');
    INSERT INTO companies (id, name, currency) VALUES ('${companyId}', 'FX GmbH', 'EUR');
    INSERT INTO company_members (company_id, user_id, role, is_active) VALUES
      ('${companyId}', '${userId}', '${CompanyMemberRole.ACCOUNTANT}', true);
    INSERT INTO account_nodes (id, company_id, code, name, type, subtype) VALUES
      ('${arAccountId}', '${companyId}', '1400', 'Accounts Receivable', '${AccountType.ASSET}', '${AccountSubtype.ACCOUNTS_RECEIVABLE}'),
      ('${bankAccountId}', '${companyId}', '1200', 'Bank', '${AccountType.ASSET}', '${AccountSubtype.BANK}'),
      ('${revAccountId}', '${companyId}', '8400', 'Sales Revenue', '${AccountType.REVENUE}', '${AccountSubtype.REVENUE_SALES}'),
      ('${fxGainAccountId}', '${companyId}', '2660', 'FX Gains', '${AccountType.REVENUE}', '${AccountSubtype.FINANCIAL_INCOME}'),
      ('${fxLossAccountId}', '${companyId}', '2150', 'FX Losses', '${AccountType.EXPENSE}', '${AccountSubtype.FINANCIAL_EXPENSE}');
    INSERT INTO accounting_periods (company_id, name, start_date, end_date, status) VALUES
      ('${companyId}', 'FY 2026', '2026-01-01T00:00:00Z', '2026-12-31T23:59:59Z', '${PeriodStatus.OPEN}'),
      ('${companyId}', 'FY 2027', '2027-01-01T00:00:00Z', '2027-12-31T23:59:59Z', '${PeriodStatus.OPEN}');
  `);
});

afterAll(async () => {
  await pg.close();
});

describe("ECB XML parser & exchange rate lookup", () => {
  it("parses ECB XML, upserts rates, resolves inverse/cross-EUR and prefers MANUAL overrides", async () => {
    const parsed = parseEcbDailyXml(SAMPLE_ECB_XML);
    expect(parsed?.rateDate).toBe("2026-01-10");
    expect(parsed?.rates.length).toBe(3);

    const synced = await syncEcbDailyRates(logger, SAMPLE_ECB_XML);
    expect(synced?.upsertedCount).toBe(3);

    // Inverse lookup: USD -> EUR = 1 / 1.1 = 0.90909091
    const usdToEur = await lookupExchangeRate(
      testDb,
      "USD",
      "EUR",
      "2026-01-12",
    );
    expect(usdToEur).not.toBeNull();
    expect(usdToEur?.rate).toBeCloseTo(1 / 1.1, 6);
    expect(usdToEur?.source).toBe("ECB");

    // Cross-rate via EUR: USD -> GBP = (1/1.1) * 0.85
    const usdToGbp = await lookupExchangeRate(
      testDb,
      "USD",
      "GBP",
      "2026-01-12",
    );
    expect(usdToGbp?.rate).toBeCloseTo(0.85 / 1.1, 5);

    // Manual override on same date wins over ECB
    await testDb.insert(exchangeRates).values({
      baseCurrency: "EUR",
      quoteCurrency: "USD",
      rate: 1.0,
      rateDate: "2026-01-10",
      source: "MANUAL",
    });
    const manualWins = await lookupExchangeRate(
      testDb,
      "USD",
      "EUR",
      "2026-01-10",
    );
    expect(manualWins?.source).toBe("MANUAL");
    expect(manualWins?.rate).toBe(1);
  });
});

describe("Realized FX gains & losses", () => {
  it("builds balanced AR gain and AP loss settlement lines in functional currency", () => {
    // Invoice of 1000 USD booked at 0.90 EUR/USD (900 EUR), settled at 0.95 EUR/USD (950 EUR) -> 50 EUR gain
    const arGain = buildRealizedFxSettlement({
      side: "AR",
      amount: 1000,
      transactionCurrency: "USD",
      functionalCurrency: "EUR",
      historicalRate: 0.9,
      settlementRate: 0.95,
      bankOrCashSubtype: AccountSubtype.BANK,
      controlAccountId: arAccountId,
    });
    expect(arGain.historicalFunctional).toBe(900);
    expect(arGain.settlementFunctional).toBe(950);
    expect(arGain.fxGainOrLoss).toBe(50);
    expect(arGain.lines.length).toBe(3);
    expect(arGain.lines[2]?.subtype).toBe(AccountSubtype.FINANCIAL_INCOME);
    expect(arGain.lines[2]?.type).toBe(LineType.CREDIT);

    // AP bill of 1000 USD booked at 0.90 EUR/USD (900 EUR), paid at 0.96 EUR/USD (960 EUR) -> -60 EUR loss
    const apLoss = buildRealizedFxSettlement({
      side: "AP",
      amount: 1000,
      transactionCurrency: "USD",
      functionalCurrency: "EUR",
      historicalRate: 0.9,
      settlementRate: 0.96,
      bankOrCashSubtype: AccountSubtype.BANK,
      controlAccountId: arAccountId,
    });
    expect(apLoss.fxGainOrLoss).toBe(-60);
    expect(apLoss.lines[2]?.subtype).toBe(AccountSubtype.FINANCIAL_EXPENSE);
    expect(apLoss.lines[2]?.type).toBe(LineType.DEBIT);
  });
});

describe("Multi-currency posting, revaluation, and functional-currency reports", () => {
  it("posts USD + EUR entries, revalues open USD AR at year-end, and balances Trial Balance in EUR", async () => {
    // Clean manual override from earlier test & insert deterministic rates:
    // 2026-06-01: 1 USD = 0.90 EUR; 2026-12-31: 1 USD = 0.95 EUR
    await testDb.insert(exchangeRates).values([
      {
        baseCurrency: "USD",
        quoteCurrency: "EUR",
        rate: 0.9,
        rateDate: "2026-06-01",
        source: "MANUAL",
      },
      {
        baseCurrency: "USD",
        quoteCurrency: "EUR",
        rate: 0.95,
        rateDate: "2026-12-31",
        source: "MANUAL",
      },
    ]);

    // Post a 1000 USD receivable on 2026-06-01 (translates to 900 EUR)
    const usdEntryId = await testDb.transaction((tx) =>
      postJournalEntry(
        {
          companyId,
          date: new Date("2026-06-01T00:00:00Z"),
          description: "USD consulting invoice",
          sourceType: JournalSourceType.AR_INVOICE,
          sourceId: crypto.randomUUID(),
          postedByUserId: userId,
          lines: [
            {
              subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
              type: LineType.DEBIT,
              amount: 1000,
              currency: "USD",
            },
            {
              subtype: AccountSubtype.REVENUE_SALES,
              type: LineType.CREDIT,
              amount: 1000,
              currency: "USD",
            },
          ],
          logger,
        },
        tx,
      ),
    );
    expect(usdEntryId).toBeTruthy();

    const usdLines = await testDb
      .select()
      .from(journalEntryLines)
      .where(eq(journalEntryLines.journalEntryId, usdEntryId!));
    expect(usdLines.length).toBe(2);
    expect(usdLines[0]?.functionalCurrency).toBe("EUR");
    expect(usdLines[0]?.functionalAmount).toBe(900);

    // Also post a regular 500 EUR domestic entry
    const eurEntryId = await testDb.transaction((tx) =>
      postJournalEntry(
        {
          companyId,
          date: new Date("2026-06-15T00:00:00Z"),
          description: "EUR domestic sale",
          sourceType: JournalSourceType.AR_INVOICE,
          sourceId: crypto.randomUUID(),
          postedByUserId: userId,
          lines: [
            {
              subtype: AccountSubtype.BANK,
              type: LineType.DEBIT,
              amount: 500,
              currency: "EUR",
            },
            {
              subtype: AccountSubtype.REVENUE_SALES,
              type: LineType.CREDIT,
              amount: 500,
              currency: "EUR",
            },
          ],
          logger,
        },
        tx,
      ),
    );
    expect(eurEntryId).toBeTruthy();

    // Preview year-end FX revaluation at 2026-12-31 (0.95 -> +50 EUR unrealized gain on 1000 USD AR)
    const preview = await runUnrealizedFxRevaluation({
      companyId,
      asOfDate: "2026-12-31",
      dryRun: true,
      postReversalNextDay: true,
      userId,
      logger,
    });
    expect(preview?.items.length).toBe(1);
    expect(preview?.items[0]?.unrealizedGainLoss).toBe(50);
    expect(preview?.journalEntryId).toBeNull();

    // Post revaluation + next-day auto-reversal (2027-01-01)
    const posted = await runUnrealizedFxRevaluation({
      companyId,
      asOfDate: "2026-12-31",
      dryRun: false,
      postReversalNextDay: true,
      userId,
      logger,
    });
    expect(posted?.totalUnrealizedGainLoss).toBe(50);
    expect(posted?.journalEntryId).toBeTruthy();
    expect(posted?.reversalEntryId).toBeTruthy();

    // Trial Balance as of 2026-12-31 aggregates EUR + USD in EUR functional currency and balances!
    const tb = await TrialBalanceRepository.getTrialBalance(
      { companyId, asOfDate: "2026-12-31" },
      logger,
      { id: userId, isPublic: false, leadId: "lead-1", roles: [] },
      defaultLocale,
    );
    expect(tb.success).toBe(true);
    if (!tb.success) {
      return;
    }
    expect(tb.data.reportCurrency).toBe("EUR");
    expect(tb.data.isBalanced).toBe(true);
    // 900 (USD AR) + 500 (EUR Bank) + 50 (Revaluation) = 1450 EUR
    expect(tb.data.totalDebits).toBe(1450);
    expect(tb.data.totalCredits).toBe(1450);
    const arRow = tb.data.accounts.find((a) => a.accountId === arAccountId);
    expect(arRow?.name).toContain("USD");
    expect(arRow?.balance).toBe(950);
  });
});
