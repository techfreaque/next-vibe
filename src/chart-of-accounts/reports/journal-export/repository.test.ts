import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { CompanyMemberRole } from "@/companies/enum";

import { JournalEntryStatus, JournalSourceType, LineType } from "../../enum";
import {
  encodeJournalCsv,
  journalCsvCell,
  JOURNAL_EXPORT_MAX_BYTES,
  JOURNAL_EXPORT_MAX_ROWS,
} from "./csv";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));

const id = (n: number): string =>
  `00000000-0000-4000-8000-${n.toString().padStart(12, "0")}`;
const companyId = id(1);
const otherCompanyId = id(2);
const accountant = id(11);
const viewer = id(12);
const bank = id(21);
const sales = id(22);
const foreignAccount = id(23);
const entry = id(31);
const reversal = id(32);
const draft = id(33);
const foreignEntry = id(34);
const legacyCurrencyEntry = id(35);
const logger = createEndpointLogger(false, defaultLocale);
const november = {
  companyId,
  currency: "EUR",
  dateFrom: new Date("2026-11-30"),
  dateTo: new Date("2026-11-30"),
};

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE companies (id uuid PRIMARY KEY, name text);
    CREATE TABLE company_members (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid, user_id uuid,
      role text, is_active boolean, invited_by_user_id uuid, joined_at timestamp,
      created_at timestamp, updated_at timestamp
    );
    CREATE TABLE account_nodes (id uuid PRIMARY KEY, company_id uuid, code text, name text);
    CREATE TABLE journal_entries (
      id uuid PRIMARY KEY, company_id uuid, entry_number text, date timestamp,
      posted_at timestamp, source_type text, status text, description text,
      reversal_of_id uuid, reversed_by_id uuid
    );
    CREATE TABLE journal_entry_lines (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), journal_entry_id uuid, account_id uuid,
      type text, amount numeric(14,4), currency text, description text, sort_order integer
    );
    INSERT INTO companies VALUES ('${companyId}', 'Équipe du Sud'), ('${otherCompanyId}', 'Foreign company');
    INSERT INTO company_members (company_id, user_id, role, is_active) VALUES
      ('${companyId}', '${accountant}', '${CompanyMemberRole.ACCOUNTANT}', true),
      ('${companyId}', '${viewer}', '${CompanyMemberRole.VIEWER}', true);
    INSERT INTO account_nodes VALUES
      ('${bank}', '${companyId}', '221', 'Bank, "Europe"'),
      ('${sales}', '${companyId}', '701', '=Revenue'),
      ('${foreignAccount}', '${otherCompanyId}', '999', 'Other company account');
    INSERT INTO journal_entries VALUES
      ('${entry}', '${companyId}', 'JE-0001', '2026-11-30 23:59:59', '2026-12-01 01:00:00', '${JournalSourceType.MANUAL}', '${JournalEntryStatus.REVERSED}', 'Client "A", transaction', NULL, '${reversal}'),
      ('${reversal}', '${companyId}', 'JE-0002', '2026-12-01 00:00:00', '2026-12-01 02:00:00', '${JournalSourceType.MANUAL}', '${JournalEntryStatus.POSTED}', 'Reversal', '${entry}', NULL),
      ('${draft}', '${companyId}', 'JE-0003', '2026-11-30', NULL, '${JournalSourceType.MANUAL}', '${JournalEntryStatus.DRAFT}', 'Draft', NULL, NULL),
      ('${foreignEntry}', '${otherCompanyId}', 'JE-0004', '2026-11-30', NULL, '${JournalSourceType.MANUAL}', '${JournalEntryStatus.POSTED}', 'Wrong company', NULL, NULL),
      ('${legacyCurrencyEntry}', '${companyId}', 'JE-0005', '2026-11-30', NULL, '${JournalSourceType.MANUAL}', '${JournalEntryStatus.POSTED}', 'Foreign currency', NULL, NULL);
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, type, amount, currency, description, sort_order) VALUES
      ('${entry}', '${sales}', '${LineType.CREDIT}', 25.0125, 'EUR', E'Line one\\nLine two', 1),
      ('${entry}', '${bank}', '${LineType.DEBIT}', 25.0125, 'EUR', NULL, 0),
      ('${reversal}', '${bank}', '${LineType.CREDIT}', 25.0125, 'EUR', NULL, 0),
      ('${reversal}', '${sales}', '${LineType.DEBIT}', 25.0125, 'EUR', NULL, 1),
      ('${draft}', '${bank}', '${LineType.DEBIT}', 5, 'EUR', NULL, 0),
      ('${foreignEntry}', '${foreignAccount}', '${LineType.DEBIT}', 5, 'EUR', NULL, 0),
      ('${entry}', '${foreignAccount}', '${LineType.DEBIT}', 5, 'EUR', NULL, 2),
      ('${legacyCurrencyEntry}', '${bank}', '${LineType.DEBIT}', 5, 'JPY', NULL, 0);
  `);
});

afterAll(() => pg.close());

test("selects one company's posted accounting dates and currency with exact decimals and safe CSV cells", async () => {
  const { JournalExportRepository } = await import("./repository");
  const denied = await JournalExportRepository.exportJournal(
    november,
    viewer,
    logger,
    defaultLocale,
  );
  expect(denied.success).toBe(false);
  expect(
    (
      await JournalExportRepository.exportJournal(
        { ...november, companyId: otherCompanyId },
        accountant,
        logger,
        defaultLocale,
      )
    ).success,
  ).toBe(false);
  expect(
    (
      await JournalExportRepository.exportJournal(
        { ...november, dateFrom: new Date("2026-12-01") },
        accountant,
        logger,
        defaultLocale,
      )
    ).success,
  ).toBe(false);

  expect(
    (
      await JournalExportRepository.exportJournal(
        { ...november, currency: "../EUR" },
        accountant,
        logger,
        defaultLocale,
      )
    ).success,
  ).toBe(false);

  const legacyCurrency = await JournalExportRepository.exportJournal(
    { ...november, currency: "JPY" },
    accountant,
    logger,
    defaultLocale,
  );
  expect(legacyCurrency).toMatchObject({
    success: true,
    data: { currencyOut: "JPY", rowCount: 1, debitCount: 1, creditCount: 0 },
  });

  const originals = await JournalExportRepository.exportJournal(
    november,
    accountant,
    logger,
    defaultLocale,
  );
  expect(originals).toMatchObject({
    success: true,
    data: {
      rowCount: 2,
      debitCount: 1,
      creditCount: 1,
      filename: "journal-2026-11-30_2026-11-30-EUR.csv",
    },
  });
  if (!originals.success) {
    return;
  }
  const { csv } = originals.data;
  expect(csv.startsWith('\uFEFF"Entry number","Accounting date"')).toBe(true);
  const slovak = await JournalExportRepository.exportJournal(
    november,
    accountant,
    logger,
    "sk-SK",
  );
  expect(slovak.success).toBe(true);
  if (slovak.success) {
    expect(
      slovak.data.csv.startsWith(
        '\uFEFF"Číslo účtovného zápisu","Dátum účtovania"',
      ),
    ).toBe(true);
    expect(slovak.data.csv).toContain('"Mena","Má dať","Dal"');
  }
  expect(csv).toContain('"JE-0001","2026-11-30","2026-12-01T01:00:00.000Z"');
  expect(csv).toContain(
    '"Bank, ""Europe""","Client ""A"", transaction","","EUR",25.0125,\r\n',
  );
  expect(csv).toContain(
    '"\'=Revenue","Client ""A"", transaction","Line one\nLine two","EUR",,25.0125\r\n',
  );
  expect(csv.indexOf('"221"')).toBeLessThan(csv.indexOf('"701"'));
  for (const excluded of [
    "JE-0002",
    "JE-0003",
    "JE-0004",
    "JE-0005",
    "Other company account",
  ]) {
    expect(csv).not.toContain(excluded);
  }

  const combined = await JournalExportRepository.exportJournal(
    { ...november, dateTo: new Date("2026-12-01") },
    accountant,
    logger,
    defaultLocale,
  );
  expect(combined).toMatchObject({
    success: true,
    data: { rowCount: 4, debitCount: 2, creditCount: 2 },
  });
  if (combined.success) {
    expect(combined.data.csv).toContain('"JE-0002","2026-12-01"');
    const fixture = process.env.ERP_JOURNAL_EXPORT_FIXTURE;
    if (fixture) {
      await Bun.write(fixture, JSON.stringify(combined.data));
    }
  }
});

test("rejects an oversized export without returning a partial file", async () => {
  const { JournalExportRepository } = await import("./repository");
  await pg.query(
    `
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, type, amount, currency, sort_order)
    SELECT $1, $2, $3, 1, 'EUR', n FROM generate_series(1, $4) AS n
  `,
    [entry, bank, LineType.DEBIT, JOURNAL_EXPORT_MAX_ROWS],
  );
  const oversized = await JournalExportRepository.exportJournal(
    november,
    accountant,
    logger,
    defaultLocale,
  );
  expect(oversized).toMatchObject({
    success: false,
    errorType: { errorCode: 400 },
  });
  expect(oversized).not.toHaveProperty("data");
});

test("neutralizes formula prefixes and counts bytes in UTF-8", () => {
  for (const value of [
    "=SUM(1,2)",
    " @A1",
    "\ttext",
    "\n=SUM(1,2)",
    "+1",
    "-prefix",
  ]) {
    expect(journalCsvCell({ value })).toBe(`"'${value}"`);
  }
  expect(journalCsvCell({ value: "-0.0001", numeric: true })).toBe("-0.0001");
  expect(journalCsvCell({ value: "=1+2", numeric: true })).toBe(`"'=1+2"`);
  expect(
    encodeJournalCsv(
      ["Name"],
      [[{ value: "€".repeat(Math.ceil(JOURNAL_EXPORT_MAX_BYTES / 3)) }]],
    ),
  ).toBeNull();
});
