import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import {
  AccountSubtype,
  JournalEntryStatus,
  LineType,
} from "@/chart-of-accounts/enum";
import { CompanyMemberRole } from "@/companies/enum";

import { BANK_STATEMENT_HEADER } from "./csv";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));

const companyId = crypto.randomUUID();
const otherCompanyId = crypto.randomUUID();
const accountId = crypto.randomUUID();
const secondAccountId = crypto.randomUUID();
const foreignAccountId = crypto.randomUUID();
const accountantId = crypto.randomUUID();
const viewerId = crypto.randomUUID();
const logger = createEndpointLogger(false, defaultLocale);

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE users (id uuid PRIMARY KEY);
    CREATE TABLE companies (id uuid PRIMARY KEY, is_active boolean, currency text, name text);
    CREATE TABLE company_members (
      id uuid DEFAULT gen_random_uuid(), company_id uuid, user_id uuid,
      role text, is_active boolean, invited_by_user_id uuid, joined_at timestamp,
      created_at timestamp, updated_at timestamp
    );
    CREATE TABLE account_nodes (
      id uuid PRIMARY KEY, company_id uuid, name text, subtype text,
      is_active boolean, is_postable boolean
    );
    CREATE TABLE journal_entries (
      id uuid PRIMARY KEY, company_id uuid, entry_number text, description text,
      date timestamp, status text, reversed_by_id uuid, source_id uuid,
      source_type text NOT NULL DEFAULT 'manual' 
    );
    CREATE TABLE journal_entry_lines (
      id uuid PRIMARY KEY, journal_entry_id uuid, account_id uuid,
      currency text, type text, amount numeric(14,4), description text
    );
    INSERT INTO users VALUES ('${accountantId}'), ('${viewerId}');
    INSERT INTO companies VALUES ('${companyId}', true, 'EUR', 'Ledger Studio'), ('${otherCompanyId}', true, 'EUR', 'Foreign company');
    INSERT INTO company_members (company_id, user_id, role, is_active) VALUES
      ('${companyId}', '${accountantId}', '${CompanyMemberRole.ACCOUNTANT}', true),
      ('${companyId}', '${viewerId}', '${CompanyMemberRole.VIEWER}', true);
    INSERT INTO account_nodes VALUES
      ('${accountId}', '${companyId}', 'Main bank', '${AccountSubtype.BANK}', true, true),
      ('${secondAccountId}', '${companyId}', 'Secondary bank', '${AccountSubtype.BANK}', true, true),
      ('${foreignAccountId}', '${otherCompanyId}', 'Foreign bank', '${AccountSubtype.BANK}', true, true);
  `);
  await pg.exec(
    await Bun.file(
      new URL(
        "../../../drizzle/20261125195059_broad_lyja.sql",
        import.meta.url,
      ),
    ).text(),
  );
  await pg.exec(`
    ALTER TABLE bank_statement_lines
      ADD COLUMN value_date date,
      ADD COLUMN native_amount numeric(14,4),
      ADD COLUMN native_currency text,
      ADD COLUMN fee_amount numeric(14,4),
      ADD COLUMN fee_currency text,
      ADD COLUMN source_format text,
      ADD COLUMN source_feed text,
      ADD COLUMN source_reference text,
      ADD COLUMN stable_fingerprint text,
      ADD COLUMN description text,
      ADD COLUMN counterparty text,
      ADD COLUMN adjustment_journal_entry_id uuid,
      ADD COLUMN adjustment_reversal_entry_id uuid,
      ADD COLUMN supplier_bill_id uuid,
      ADD COLUMN match_kind text;
    CREATE TABLE finance_bank_feed_mappings (
      consent_account_id uuid, actor_id uuid, company_id uuid, account_id uuid
    );
    CREATE TABLE bank_account_reconciliation_settings (
      account_id uuid PRIMARY KEY, company_id uuid, booked_currency text,
      foreign_currency text, max_fx_difference numeric(14,4), max_fx_bps int,
      max_date_distance_days int, gain_account_id uuid, loss_account_id uuid,
      fee_account_id uuid, configured_by_user_id uuid, updated_at timestamp
    );
  `);
});
afterAll(() => pg.close());

function csv(...rows: string[]): string {
  return `${BANK_STATEMENT_HEADER}\n${rows.join("\n")}\n`;
}

it("imports exact rows once per bank account and rolls back conflicting batches", async () => {
  const { BankReconciliationRepository: Bank } = await import("./repository");
  const submit = (text: string, account = accountId, user = accountantId) =>
    Bank.importStatement(
      user,
      { companyId, accountId: account, csv: text },
      logger,
      defaultLocale,
    );
  const one = csv("bank:stable,2026-11-25,+12.3456,EUR");
  expect((await submit(one, foreignAccountId)).success).toBe(false);
  expect((await submit(one, accountId, viewerId)).success).toBe(false);
  const imports = await Promise.all([submit(one), submit(one)]);
  expect(
    imports.filter((result) => result.success && result.data.imported === 1),
  ).toHaveLength(1);
  expect(
    imports.filter((result) => result.success && result.data.skipped === 1),
  ).toHaveLength(1);

  const conflict = csv(
    "bank:fresh,2026-11-26,12.3456,EUR",
    "bank:stable,2026-11-25,12.3457,EUR",
  );
  expect((await submit(conflict)).success).toBe(false);
  expect((await submit(csv("bank:currency,2026-11-25,4,USD"))).success).toBe(
    false,
  );
  expect((await submit(one, secondAccountId)).success).toBe(true);

  const list = await Bank.listOpen(
    viewerId,
    { companyId, accountId, page: 1 },
    logger,
    defaultLocale,
  );
  expect(list).toMatchObject({
    success: true,
    data: {
      selectedCompanyName: "Ledger Studio",
      selectedAccountName: "Main bank",
      lines: [{ transactionId: "bank:stable", amount: "12.3456" }],
      total: 1,
    },
  });
  const { rows } = await pg.query<{
    account_id: string;
    imported_by_user_id: string;
  }>(
    "SELECT account_id, imported_by_user_id FROM bank_statement_lines WHERE transaction_id = 'bank:stable'",
  );
  expect(rows).toHaveLength(2);
  expect(rows.every((row) => row.imported_by_user_id === accountantId)).toBe(
    true,
  );
  await expect(
    pg.query(
      `INSERT INTO bank_statement_lines (company_id, account_id, transaction_id, booked_date, amount, currency)
      VALUES ($1, $2, 'bank:stable', '2026-11-25', 5, 'EUR')`,
      [companyId, accountId],
    ),
  ).rejects.toThrow();
});

async function addJournalLeg(
  name: string,
  type: typeof LineType.DEBIT | typeof LineType.CREDIT,
  scope = companyId,
  ledgerAccount = accountId,
  currency = "EUR",
  status: string = JournalEntryStatus.POSTED,
  amount = "24.1234",
): Promise<string> {
  const entryId = crypto.randomUUID();
  const lineId = crypto.randomUUID();
  await pg.query(
    `INSERT INTO journal_entries (id, company_id, entry_number, date, description, status)
      VALUES ($1, $2, $3, '2026-11-24', 'Synthetic journal', $4)`,
    [entryId, scope, name, status],
  );
  await pg.query(
    `INSERT INTO journal_entry_lines (id, journal_entry_id, account_id, currency, type, amount)
      VALUES ($1, $2, $3, $4, $5, $6)`,
    [lineId, entryId, ledgerAccount, currency, type, amount],
  );
  return lineId;
}

it("matches only an equal signed bank leg and records confirmation without writing the ledger", async () => {
  const { BankReconciliationRepository: Bank } = await import("./repository");
  const imported = await Bank.importStatement(
    accountantId,
    {
      companyId,
      accountId,
      csv: csv(
        "in:1,2026-11-25,+24.1234,EUR",
        "in:2,2026-11-25,+24.1234,EUR",
        "out:1,2026-11-25,-24.1234,EUR",
      ),
    },
    logger,
    defaultLocale,
  );
  expect(imported.success).toBe(true);
  const { rows } = await pg.query<{ id: string; transaction_id: string }>(
    "SELECT id, transaction_id FROM bank_statement_lines WHERE transaction_id IN ('in:1','in:2','out:1') ORDER BY transaction_id",
  );
  const [first, second, outbound] = rows;
  expect(first?.id).toBeDefined();
  expect(second?.id).toBeDefined();
  expect(outbound?.id).toBeDefined();
  const inboundLeg = await addJournalLeg("JE-inbound", LineType.DEBIT);
  const outboundLeg = await addJournalLeg("JE-outbound", LineType.CREDIT);
  const wrongScope = await addJournalLeg(
    "JE-other-company",
    LineType.DEBIT,
    otherCompanyId,
  );
  const wrongAccount = await addJournalLeg(
    "JE-other-account",
    LineType.DEBIT,
    companyId,
    secondAccountId,
  );
  const wrongCurrency = await addJournalLeg(
    "JE-other-currency",
    LineType.DEBIT,
    companyId,
    accountId,
    "USD",
  );
  const draftLeg = await addJournalLeg(
    "JE-draft",
    LineType.DEBIT,
    companyId,
    accountId,
    "EUR",
    JournalEntryStatus.DRAFT,
  );
  const wrongPrecision = await addJournalLeg(
    "JE-other-amount",
    LineType.DEBIT,
    companyId,
    accountId,
    "EUR",
    JournalEntryStatus.POSTED,
    "24.1235",
  );
  const invalidDebit = await addJournalLeg(
    "JE-negative-posted",
    LineType.DEBIT,
    companyId,
    accountId,
    "EUR",
    JournalEntryStatus.POSTED,
    "-24.1234",
  );
  const before = await pg.query("SELECT * FROM journal_entries ORDER BY id");
  const beforeLines = await pg.query(
    "SELECT * FROM journal_entry_lines ORDER BY id",
  );

  const matches = await Bank.findCandidates(
    viewerId,
    { companyId },
    { lineId: first.id },
    logger,
    defaultLocale,
  );
  expect(matches).toMatchObject({
    success: true,
    data: { matches: [{ id: inboundLeg }], canMatch: false },
  });
  if (matches.success) {
    expect(matches.data.matches).toHaveLength(1);
  }

  const match = (
    lineId: string,
    journalLineId: string,
    confirm = true,
    user = accountantId,
  ) =>
    Bank.match(
      user,
      { companyId, journalLineId, confirm },
      { lineId },
      logger,
      defaultLocale,
    );
  for (const candidate of [
    outboundLeg,
    wrongScope,
    wrongAccount,
    wrongCurrency,
    draftLeg,
    wrongPrecision,
  ]) {
    expect((await match(first.id, candidate)).success).toBe(false);
  }
  expect((await match(first.id, inboundLeg, false)).success).toBe(false);
  expect((await match(first.id, inboundLeg, true, viewerId)).success).toBe(
    false,
  );

  const concurrent = await Promise.all([
    match(first.id, inboundLeg),
    match(second.id, inboundLeg),
  ]);
  expect(concurrent.filter((result) => result.success)).toHaveLength(1);
  const winner = concurrent[0]?.success ? first.id : second.id;
  const original = concurrent[0].success ? concurrent[0] : concurrent[1];
  expect(await match(winner, inboundLeg)).toEqual(original);
  expect((await match(outbound.id, invalidDebit)).success).toBe(false);
  expect((await match(outbound.id, outboundLeg)).success).toBe(true);

  const audit = await pg.query<{
    matched_by_user_id: string;
    matched_at: string;
  }>(
    "SELECT matched_by_user_id, matched_at FROM bank_statement_lines WHERE id IN ($1, $2)",
    [winner, outbound.id],
  );
  expect(audit.rows).toHaveLength(2);
  expect(
    audit.rows.every(
      (row) =>
        row.matched_by_user_id === accountantId && Boolean(row.matched_at),
    ),
  ).toBe(true);
  expect(await pg.query("SELECT * FROM journal_entries ORDER BY id")).toEqual(
    before,
  );
  expect(
    await pg.query("SELECT * FROM journal_entry_lines ORDER BY id"),
  ).toEqual(beforeLines);

  const loser = winner === first.id ? second.id : first.id;
  await expect(
    pg.query(
      "UPDATE bank_statement_lines SET matched_journal_line_id = $1 WHERE id = $2",
      [inboundLeg, loser],
    ),
  ).rejects.toThrow();
});
