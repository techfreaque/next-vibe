import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it, mock } from "bun:test";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import {
  AccountSubtype,
  AccountType,
  PeriodStatus,
} from "@/chart-of-accounts/enum";
import { CompanyMemberRole } from "@/companies/enum";
import { paymentBills, paymentInvoices } from "@/payment/db";
import { BillStatus, InvoiceStatus } from "@/payment/enum";

import { bankStatementLines, bankStatementLineSplits } from "../db";
import { BANK_STATEMENT_HEADER } from "../csv";

const pg = new PGlite();
const testDb = drizzle(pg);
mock.module("next-vibe/database", () => ({ db: testDb }));

const companyId = crypto.randomUUID();
const bankAccountId = crypto.randomUUID();
const arAccountId = crypto.randomUUID();
const apAccountId = crypto.randomUUID();
const feeAccountId = crypto.randomUUID();
const gainAccountId = crypto.randomUUID();
const lossAccountId = crypto.randomUUID();
const periodId = crypto.randomUUID();
const userId = crypto.randomUUID();
const invoice1Id = crypto.randomUUID();
const invoice2Id = crypto.randomUUID();
const bill1Id = crypto.randomUUID();
const logger = createEndpointLogger(false, defaultLocale);

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE users (id uuid PRIMARY KEY);
    CREATE TABLE companies (
      id uuid PRIMARY KEY,
      is_active boolean DEFAULT true,
      currency text DEFAULT 'EUR',
      name text NOT NULL
    );
    CREATE TABLE company_members (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id uuid NOT NULL,
      user_id uuid NOT NULL,
      role text NOT NULL,
      is_active boolean DEFAULT true,
      invited_by_user_id uuid,
      joined_at timestamp,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );
    CREATE TABLE account_nodes (
      id uuid PRIMARY KEY,
      company_id uuid NOT NULL,
      template_node_id uuid,
      code text NOT NULL,
      name text NOT NULL,
      type text NOT NULL,
      subtype text NOT NULL,
      is_active boolean DEFAULT true NOT NULL,
      is_postable boolean DEFAULT true NOT NULL,
      is_system boolean DEFAULT false NOT NULL,
      parent_id uuid,
      description text,
      sort_order int DEFAULT 0 NOT NULL,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );
    CREATE TABLE accounting_periods (
      id uuid PRIMARY KEY,
      company_id uuid NOT NULL,
      name text NOT NULL,
      start_date timestamp NOT NULL,
      end_date timestamp NOT NULL,
      status text NOT NULL,
      closed_at timestamp,
      closed_by_user_id uuid,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );
    CREATE TABLE journal_entries (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id uuid NOT NULL,
      period_id uuid,
      entry_number text NOT NULL,
      date timestamp NOT NULL,
      description text NOT NULL,
      memo text,
      status text NOT NULL,
      source_type text NOT NULL DEFAULT 'enums.journalSourceType.MANUAL',
      source_id uuid,
      reversal_of_id uuid,
      reversed_by_id uuid,
      posted_at timestamp,
      posted_by_user_id uuid,
      created_by_user_id uuid,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );
    CREATE TABLE journal_entry_lines (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      journal_entry_id uuid NOT NULL,
      account_id uuid NOT NULL,
      type text NOT NULL,
      amount numeric(14,4) NOT NULL,
      currency text NOT NULL,
      functional_amount numeric(14,4),
      functional_currency text,
      exchange_rate numeric(16,8),
      description text,
      sort_order int DEFAULT 0 NOT NULL,
      tax_rate_id uuid,
      created_at timestamp DEFAULT now()
    );
    CREATE TABLE payment_invoices (
      id uuid PRIMARY KEY,
      user_id uuid NOT NULL,
      company_id uuid,
      provider_invoice_id text NOT NULL,
      invoice_number text,
      invoice_sequence_number int,
      amount numeric(10,2) NOT NULL,
      currency text NOT NULL,
      status text NOT NULL,
      invoice_url text,
      invoice_pdf text,
      due_date timestamp,
      paid_at timestamp,
      callback_token text,
      notes text,
      journal_entry_id uuid,
      metadata jsonb,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );
    CREATE TABLE payment_bills (
      id uuid PRIMARY KEY,
      company_id uuid NOT NULL,
      supplier_name text NOT NULL,
      supplier_vat_number text,
      bill_number text NOT NULL,
      bill_date timestamp NOT NULL,
      due_date timestamp,
      currency text NOT NULL,
      subtotal numeric(12,4) NOT NULL,
      tax_amount numeric(12,4) NOT NULL,
      total numeric(12,4) NOT NULL,
      status text NOT NULL,
      paid_at timestamp,
      notes text,
      journal_entry_id uuid,
      metadata jsonb,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );
    CREATE TABLE purchasing_vendors (
      id uuid PRIMARY KEY,
      company_id uuid NOT NULL,
      name text NOT NULL,
      notes text,
      is_active boolean DEFAULT true NOT NULL,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );
    CREATE TABLE bank_statement_lines (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id uuid NOT NULL,
      account_id uuid NOT NULL,
      transaction_id text NOT NULL,
      booked_date date NOT NULL,
      amount numeric(14,4) NOT NULL,
      currency text NOT NULL,
      value_date date,
      native_amount numeric(14,4),
      native_currency text,
      fee_amount numeric(14,4),
      fee_currency text,
      source_format text,
      source_feed text,
      source_reference text,
      stable_fingerprint text,
      description text,
      counterparty text,
      imported_by_user_id uuid,
      imported_at timestamp DEFAULT now() NOT NULL,
      matched_journal_line_id uuid,
      adjustment_journal_entry_id uuid,
      adjustment_reversal_entry_id uuid,
      supplier_bill_id uuid,
      match_kind text,
      matched_by_user_id uuid,
      matched_at timestamp,
      UNIQUE (company_id, account_id, transaction_id)
    );
    CREATE TABLE bank_statement_line_splits (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      bank_statement_line_id uuid NOT NULL,
      company_id uuid NOT NULL,
      target_type text NOT NULL,
      journal_line_id uuid,
      invoice_id uuid,
      bill_id uuid,
      account_id uuid,
      amount numeric(14,4) NOT NULL,
      description text,
      created_journal_entry_id uuid,
      created_by_user_id uuid,
      created_at timestamp DEFAULT now() NOT NULL
    );
    CREATE TABLE bank_account_reconciliation_settings (
      account_id uuid PRIMARY KEY,
      company_id uuid NOT NULL,
      booked_currency text NOT NULL,
      foreign_currency text,
      max_fx_difference numeric(14,4),
      max_fx_bps int,
      max_date_distance_days int NOT NULL DEFAULT 7,
      gain_account_id uuid,
      loss_account_id uuid,
      fee_account_id uuid,
      configured_by_user_id uuid NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );
    CREATE TABLE finance_bank_feed_mappings (
      consent_account_id uuid,
      actor_id uuid,
      company_id uuid,
      account_id uuid
    );

    INSERT INTO users VALUES ('${userId}');
    INSERT INTO companies (id, is_active, currency, name)
      VALUES ('${companyId}', true, 'EUR', 'AutoMatch GmbH');
    INSERT INTO company_members (company_id, user_id, role, is_active)
      VALUES ('${companyId}', '${userId}', '${CompanyMemberRole.ACCOUNTANT}', true);
    INSERT INTO accounting_periods (id, company_id, name, start_date, end_date, status)
      VALUES ('${periodId}', '${companyId}', '2026-11', '2026-11-01T00:00:00Z', '2026-11-30T23:59:59Z', '${PeriodStatus.OPEN}');
    INSERT INTO account_nodes (id, company_id, code, name, type, subtype, is_active, is_postable) VALUES
      ('${bankAccountId}', '${companyId}', '1200', 'Business Bank', '${AccountType.ASSET}', '${AccountSubtype.BANK}', true, true),
      ('${arAccountId}', '${companyId}', '1400', 'Accounts Receivable', '${AccountType.ASSET}', '${AccountSubtype.ACCOUNTS_RECEIVABLE}', true, true),
      ('${apAccountId}', '${companyId}', '1600', 'Accounts Payable', '${AccountType.LIABILITY}', '${AccountSubtype.ACCOUNTS_PAYABLE}', true, true),
      ('${feeAccountId}', '${companyId}', '4970', 'Bank Fees', '${AccountType.EXPENSE}', '${AccountSubtype.FINANCIAL_EXPENSE}', true, true),
      ('${gainAccountId}', '${companyId}', '2660', 'FX Gain', '${AccountType.REVENUE}', '${AccountSubtype.FINANCIAL_INCOME}', true, true),
      ('${lossAccountId}', '${companyId}', '2150', 'FX Loss', '${AccountType.EXPENSE}', '${AccountSubtype.FINANCIAL_EXPENSE}', true, true);

    INSERT INTO payment_invoices (id, user_id, company_id, provider_invoice_id, invoice_number, amount, currency, status, due_date, metadata) VALUES
      ('${invoice1Id}', '${userId}', '${companyId}', 'INV-2026-0001', 'INV-2026-0001', 250.00, 'EUR', '${InvoiceStatus.OPEN}', '2026-11-20T00:00:00Z', '{"customerName":"Acme Client"}'::jsonb),
      ('${invoice2Id}', '${userId}', '${companyId}', 'INV-2026-0002', 'INV-2026-0002', 100.00, 'EUR', '${InvoiceStatus.OPEN}', '2026-11-22T00:00:00Z', '{"customerName":"Split Client"}'::jsonb);

    INSERT INTO payment_bills (id, company_id, supplier_name, bill_number, bill_date, due_date, currency, subtotal, tax_amount, total, status, metadata) VALUES
      ('${bill1Id}', '${companyId}', 'Cloud Host GmbH', 'BILL-2026-009', '2026-11-18T00:00:00Z', '2026-11-25T00:00:00Z', 'EUR', 80.0000, 0.0000, 80.0000, '${BillStatus.APPROVED}', '{"supplierIban":"DE89370400440532013000"}'::jsonb);
  `);
});

afterAll(() => pg.close());

describe("bank auto-match, split and reconciliation status", () => {
  it("auto-matches invoices and bills and splits a bank line across invoice + bank fee", async () => {
    const { BankReconciliationRepository } = await import("../repository");
    const { BankSplitRepository } = await import("../split-repository");

    const imported = await BankReconciliationRepository.importStatement(
      userId,
      {
        companyId,
        accountId: bankAccountId,
        csv: [
          BANK_STATEMENT_HEADER,
          "tx-inv-1,2026-11-20,+250.0000,EUR",
          "tx-bill-1,2026-11-21,-80.0000,EUR",
          "tx-split-1,2026-11-22,+95.0000,EUR",
        ].join("\n"),
      },
      logger,
      defaultLocale,
    );
    expect(imported.success).toBe(true);
    if (!imported.success) {
      return;
    }
    expect(imported.data.imported).toBe(3);

    // Enrich imported descriptions for reference & IBAN matching
    await testDb
      .update(bankStatementLines)
      .set({
        description: "SEPA credit INV-2026-0001",
        counterparty: "Acme Client",
      })
      .where(eq(bankStatementLines.transactionId, "tx-inv-1"));
    await testDb
      .update(bankStatementLines)
      .set({
        description: "Wire DE89370400440532013000 hosting",
        counterparty: "Cloud Host GmbH",
      })
      .where(eq(bankStatementLines.transactionId, "tx-bill-1"));

    // 1. Dry-run auto-match
    const dryRun = await BankReconciliationRepository.autoMatchAccount(
      userId,
      { companyId, accountId: bankAccountId, dryRun: true },
      logger,
      defaultLocale,
    );
    expect(dryRun.success).toBe(true);
    if (!dryRun.success) {
      return;
    }
    expect(dryRun.data.preview).toBe(true);
    expect(dryRun.data.matchedCount).toBe(2);
    expect(dryRun.data.invoiceMatches).toBe(1);
    expect(dryRun.data.billMatches).toBe(1);

    // 2. Apply auto-match
    const applied = await BankReconciliationRepository.autoMatchAccount(
      userId,
      { companyId, accountId: bankAccountId, dryRun: false },
      logger,
      defaultLocale,
    );
    expect(applied.success).toBe(true);
    if (!applied.success) {
      return;
    }
    expect(applied.data.preview).toBe(false);
    expect(applied.data.matchedCount).toBe(2);

    const [inv1] = await testDb
      .select()
      .from(paymentInvoices)
      .where(eq(paymentInvoices.id, invoice1Id));
    expect(inv1?.status).toBe(InvoiceStatus.PAID);

    const [bill1] = await testDb
      .select()
      .from(paymentBills)
      .where(eq(paymentBills.id, bill1Id));
    expect(bill1?.status).toBe(BillStatus.PAID);

    // 3. Split remaining line (+95 EUR = +100 EUR invoice2 - 5 EUR bank fee)
    const [splitLine] = await testDb
      .select()
      .from(bankStatementLines)
      .where(eq(bankStatementLines.transactionId, "tx-split-1"));
    expect(splitLine).toBeDefined();
    if (!splitLine) {
      return;
    }

    const splitResult = await BankSplitRepository.applySplit(
      userId,
      {
        companyId,
        lineId: splitLine.id,
        allocations: [
          {
            targetType: "invoice",
            targetId: invoice2Id,
            amount: "100.0000",
            description: "INV-2026-0002 settled",
          },
          {
            targetType: "account",
            targetId: feeAccountId,
            amount: "-5.0000",
            description: "Incoming wire fee",
          },
        ],
        confirm: true,
      },
      logger,
      defaultLocale,
    );
    expect(splitResult.success).toBe(true);
    if (!splitResult.success) {
      return;
    }
    expect(splitResult.data.splitCount).toBe(2);
    expect(splitResult.data.createdJournalEntryId).toBeTruthy();

    const [inv2] = await testDb
      .select()
      .from(paymentInvoices)
      .where(eq(paymentInvoices.id, invoice2Id));
    expect(inv2?.status).toBe(InvoiceStatus.PAID);

    const splits = await testDb
      .select()
      .from(bankStatementLineSplits)
      .where(eq(bankStatementLineSplits.bankStatementLineId, splitLine.id));
    expect(splits).toHaveLength(2);

    // 4. Verify reconciliation status per account
    const listed = await BankReconciliationRepository.listOpen(
      userId,
      { companyId, accountId: bankAccountId, status: "all", page: 1 },
      logger,
      defaultLocale,
    );
    expect(listed.success).toBe(true);
    if (!listed.success) {
      return;
    }
    expect(listed.data.reconciliationStatus).toBeDefined();
    expect(listed.data.reconciliationStatus?.totalLines).toBe(3);
    expect(listed.data.reconciliationStatus?.matchedLines).toBe(3);
    expect(listed.data.reconciliationStatus?.unmatchedLines).toBe(0);
    expect(listed.data.reconciliationStatus?.statementNetAmount).toBe(
      "265.0000",
    );
    expect(listed.data.reconciliationStatus?.ledgerBalance).toBe("265.0000");
    expect(listed.data.reconciliationStatus?.difference).toBe("0.0000");
  });
});
