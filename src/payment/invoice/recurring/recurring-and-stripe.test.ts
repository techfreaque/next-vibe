/**
 * Tests for Recurring Invoices Engine + Per-Company Stripe Payment Links & Webhook Settlement.
 */

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
import {
  companyPaymentSettings,
  paymentInvoiceLines,
  paymentInvoiceReceipts,
  paymentInvoices,
  recurringInvoiceSchedules,
} from "@/payment/db";
import { InvoiceStatus } from "@/payment/enum";

const pg = new PGlite();
const testDb = drizzle(pg);
mock.module("next-vibe/database", () => ({ db: testDb }));

const { advanceRecurringDate, runDueRecurringInvoices } =
  await import("./engine");
const {
  ERP_INVOICE_CHECKOUT_TYPE,
  isErpInvoiceWebhook,
  prepareInvoiceStripeCheckout,
  settleErpInvoiceFromStripeWebhook,
} = await import("../stripe-checkout");

const logger = createEndpointLogger(false, defaultLocale);
const userId = crypto.randomUUID();
const companyId = crypto.randomUUID();
const disabledCompanyId = crypto.randomUUID();
const bankAccountId = crypto.randomUUID();
const arAccountId = crypto.randomUUID();

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE users (id uuid PRIMARY KEY);
    CREATE TABLE companies (
      id uuid PRIMARY KEY, name text, is_active boolean DEFAULT true,
      currency text DEFAULT 'EUR', country text DEFAULT 'DE', email text
    );
    CREATE TABLE account_nodes (
      id uuid PRIMARY KEY, company_id uuid, code text NOT NULL, name text NOT NULL,
      type text NOT NULL, subtype text, is_active boolean DEFAULT true,
      is_postable boolean DEFAULT true, is_system boolean DEFAULT false,
      sort_order int DEFAULT 0
    );
    CREATE TABLE accounting_periods (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id uuid NOT NULL, name text NOT NULL,
      start_date timestamp NOT NULL, end_date timestamp NOT NULL,
      status text NOT NULL DEFAULT 'open',
      closed_at timestamp, closed_by_user_id uuid,
      created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now()
    );
    CREATE TABLE journal_entries (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id uuid NOT NULL, period_id uuid NOT NULL,
      entry_number text NOT NULL, date timestamp NOT NULL,
      description text NOT NULL, memo text, status text NOT NULL DEFAULT 'posted',
      source_type text NOT NULL DEFAULT 'manual', source_id uuid,
      reversal_of_id uuid, reversed_by_id uuid, posted_by_user_id uuid,
      posted_at timestamp DEFAULT now(), created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );
    CREATE TABLE journal_entry_lines (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      journal_entry_id uuid NOT NULL, account_id uuid NOT NULL,
      type text NOT NULL, amount numeric(14,4) NOT NULL,
      currency text NOT NULL DEFAULT 'EUR',
      functional_amount numeric(14,4), functional_currency text,
      exchange_rate numeric(16,8), description text,
      sort_order int NOT NULL DEFAULT 0,
      created_at timestamp DEFAULT now()
    );
    CREATE TABLE exchange_rates (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      base_currency text NOT NULL, quote_currency text NOT NULL,
      rate numeric(16,8) NOT NULL, rate_date date NOT NULL,
      source text NOT NULL DEFAULT 'ECB', created_by_user_id uuid,
      created_at timestamp DEFAULT now()
    );
    CREATE TABLE payment_invoices (
      id uuid PRIMARY KEY, user_id uuid NOT NULL, company_id uuid,
      provider_invoice_id text NOT NULL, invoice_number text,
      invoice_sequence_number int, amount numeric(10,2) NOT NULL,
      currency text NOT NULL DEFAULT 'EUR', status text NOT NULL,
      invoice_url text, invoice_pdf text, due_date timestamp, paid_at timestamp,
      callback_token text, notes text, journal_entry_id uuid,
      metadata jsonb, created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );
    CREATE TABLE payment_invoice_lines (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      invoice_id uuid NOT NULL, description text NOT NULL, product_id uuid,
      quantity numeric(12,4) NOT NULL, unit_price numeric(12,4) NOT NULL,
      tax_rate numeric(6,4), tax_amount numeric(12,4) NOT NULL DEFAULT 0,
      line_total numeric(12,4) NOT NULL, sort_order int DEFAULT 0,
      created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now()
    );
    CREATE TABLE payment_invoice_receipts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      invoice_id uuid NOT NULL, scope_id uuid NOT NULL,
      is_company_scope boolean NOT NULL DEFAULT true,
      receipt_key text NOT NULL, request_digest text NOT NULL,
      journal_entry_id uuid, response jsonb NOT NULL,
      created_at timestamp DEFAULT now()
    );
    CREATE TABLE payment_credit_notes (
      id uuid PRIMARY KEY, company_id uuid NOT NULL, invoice_id uuid,
      credit_note_number text, amount numeric(12,4) NOT NULL,
      currency text NOT NULL DEFAULT 'EUR', status text NOT NULL,
      journal_entry_id uuid, created_at timestamp DEFAULT now()
    );
    CREATE TABLE company_payment_settings (
      company_id uuid PRIMARY KEY, bank_account_holder text,
      bank_iban text, bank_bic text, stripe_enabled boolean NOT NULL DEFAULT false,
      stripe_account_label text, stripe_clearing_account_id uuid,
      auto_book_stripe_payments boolean NOT NULL DEFAULT true,
      recurring_invoices_enabled boolean NOT NULL DEFAULT false,
      updated_by_user_id uuid, updated_at timestamp DEFAULT now()
    );
    CREATE TABLE recurring_invoice_schedules (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id uuid NOT NULL, created_by_user_id uuid,
      title text NOT NULL, customer_id uuid, customer_name text NOT NULL,
      customer_email text, currency text NOT NULL DEFAULT 'EUR',
      frequency text NOT NULL DEFAULT 'MONTHLY',
      next_run_date date NOT NULL, end_date date, due_days int NOT NULL DEFAULT 14,
      is_enabled boolean NOT NULL DEFAULT false,
      auto_issue boolean NOT NULL DEFAULT true,
      auto_send_email boolean NOT NULL DEFAULT false,
      notes text, line_templates jsonb NOT NULL DEFAULT '[]'::jsonb,
      last_run_at timestamp, last_invoice_id uuid,
      created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now()
    );
    INSERT INTO users VALUES ('${userId}');
    INSERT INTO companies (id, name, currency, country) VALUES
      ('${companyId}', 'Stripe GmbH', 'EUR', 'DE'),
      ('${disabledCompanyId}', 'OptOut GmbH', 'EUR', 'DE');
    INSERT INTO account_nodes (id, company_id, code, name, type, subtype) VALUES
      ('${bankAccountId}', '${companyId}', '1200', 'Stripe Clearing', '${AccountType.ASSET}', '${AccountSubtype.BANK}'),
      ('${arAccountId}', '${companyId}', '1400', 'Accounts Receivable', '${AccountType.ASSET}', '${AccountSubtype.ACCOUNTS_RECEIVABLE}');
    INSERT INTO accounting_periods (company_id, name, start_date, end_date, status) VALUES
      ('${companyId}', 'FY 2026', '2026-01-01T00:00:00Z', '2026-12-31T23:59:59Z', '${PeriodStatus.OPEN}');
  `);
});

afterAll(async () => {
  await pg.close();
});

describe("advanceRecurringDate", () => {
  it("clamps month-end dates properly across monthly, quarterly, yearly", () => {
    expect(advanceRecurringDate("2026-01-31", "MONTHLY")).toBe("2026-02-28");
    expect(advanceRecurringDate("2028-01-31", "MONTHLY")).toBe("2028-02-29");
    expect(advanceRecurringDate("2026-11-30", "QUARTERLY")).toBe("2027-02-28");
    expect(advanceRecurringDate("2024-02-29", "YEARLY")).toBe("2025-02-28");
  });
});

describe("Recurring invoices runner opt-in gate", () => {
  it("skips schedules when company_payment_settings.recurring_invoices_enabled is false", async () => {
    await testDb.insert(companyPaymentSettings).values({
      companyId: disabledCompanyId,
      stripeEnabled: false,
      recurringInvoicesEnabled: false,
    });
    await testDb.insert(recurringInvoiceSchedules).values({
      companyId: disabledCompanyId,
      createdByUserId: userId,
      title: "Monthly retainer",
      customerName: "Client A",
      currency: "EUR",
      frequency: "MONTHLY",
      nextRunDate: "2026-01-01",
      isEnabled: true,
      autoIssue: false,
      lineTemplates: [
        { description: "Retainer", quantity: 1, unitPrice: 500, taxRate: 0.19 },
      ],
    });

    const summary = await runDueRecurringInvoices({
      companyId: disabledCompanyId,
      asOfDate: "2026-01-15",
      dryRun: false,
      actorUserId: userId,
      logger,
    });
    expect(summary.processedCount).toBe(0);
  });

  it("creates draft invoice and advances schedule date when company opts in", async () => {
    await testDb.insert(companyPaymentSettings).values({
      companyId,
      stripeEnabled: true,
      stripeClearingAccountId: bankAccountId,
      autoBookStripePayments: true,
      recurringInvoicesEnabled: true,
    });
    const [schedule] = await testDb
      .insert(recurringInvoiceSchedules)
      .values({
        companyId,
        createdByUserId: userId,
        title: "Hosting subscription",
        customerName: "Client B",
        currency: "EUR",
        frequency: "MONTHLY",
        nextRunDate: "2026-01-31",
        endDate: "2026-02-28",
        isEnabled: true,
        autoIssue: false,
        lineTemplates: [
          { description: "Managed hosting", quantity: 2, unitPrice: 100, taxRate: 0.19 },
        ],
      })
      .returning();

    const preview = await runDueRecurringInvoices({
      companyId,
      asOfDate: "2026-02-01",
      dryRun: true,
      actorUserId: userId,
      logger,
    });
    expect(preview.processedCount).toBe(1);
    expect(preview.items[0]?.status).toBe("preview");
    expect(preview.items[0]?.nextRunDate).toBe("2026-02-28");

    const run = await runDueRecurringInvoices({
      companyId,
      asOfDate: "2026-02-01",
      dryRun: false,
      actorUserId: userId,
      logger,
    });
    expect(run.processedCount).toBe(1);
    expect(run.items[0]?.status).toBe("created");
    expect(run.items[0]?.invoiceId).toBeTruthy();

    const lines = await testDb
      .select()
      .from(paymentInvoiceLines)
      .where(eq(paymentInvoiceLines.invoiceId, run.items[0]!.invoiceId!));
    expect(lines.length).toBe(1);
    expect(lines[0]?.lineTotal).toBe(238);

    const [updatedSchedule] = await testDb
      .select()
      .from(recurringInvoiceSchedules)
      .where(eq(recurringInvoiceSchedules.id, schedule.id));
    expect(updatedSchedule?.nextRunDate).toBe("2026-02-28");
  });
});

describe("Stripe ERP invoice checkout & webhook settlement", () => {
  it("creates, reuses, and settles an ERP invoice idempotently, and flags conflicts", async () => {
    const invoiceId = crypto.randomUUID();
    await testDb.insert(paymentInvoices).values({
      id: invoiceId,
      userId,
      companyId,
      providerInvoiceId: `inv-${invoiceId}`,
      invoiceNumber: "INV-2026-0099",
      invoiceSequenceNumber: 99,
      amount: "119.00",
      currency: "EUR",
      status: InvoiceStatus.OPEN,
      metadata: { customerEmail: "buyer@example.com" },
    });

    let stripeCalls = 0;
    const mockStripe = {
      checkout: {
        sessions: {
          create: async () => {
            stripeCalls += 1;
            return {
              id: `cs_test_${stripeCalls}`,
              url: `https://checkout.stripe.com/c/pay/cs_test_${stripeCalls}`,
            };
          },
        },
      },
    };

    // First prepare creates a new checkout session
    const first = await prepareInvoiceStripeCheckout(
      invoiceId,
      logger,
      defaultLocale,
      mockStripe,
    );
    expect(first.success).toBe(true);
    if (!first.success) {
      return;
    }
    expect(first.data.reused).toBe(false);
    expect(first.data.amountCents).toBe(11900);
    expect(first.data.paymentUrl).toContain("cs_test_1");
    expect(stripeCalls).toBe(1);

    // Second prepare reuses the exact same session when open balance matches
    const second = await prepareInvoiceStripeCheckout(
      invoiceId,
      logger,
      defaultLocale,
      mockStripe,
    );
    expect(second.success).toBe(true);
    if (!second.success) {
      return;
    }
    expect(second.data.reused).toBe(true);
    expect(second.data.sessionId).toBe("cs_test_1");
    expect(stripeCalls).toBe(1);

    // Webhook routing guard
    const webhookEvent = {
      id: "cs_test_1",
      amount_total: 11900,
      currency: "eur",
      metadata: {
        type: ERP_INVOICE_CHECKOUT_TYPE,
        invoiceId,
        companyId,
      },
    };
    expect(isErpInvoiceWebhook(webhookEvent)).toBe(true);
    expect(isErpInvoiceWebhook({ id: "cs_other", metadata: {} })).toBe(false);

    // Settle via webhook -> marks PAID and posts balanced journal entry
    const settled = await settleErpInvoiceFromStripeWebhook(
      webhookEvent,
      logger,
    );
    expect(settled.success).toBe(true);
    if (!settled.success) {
      return;
    }
    expect(settled.data.handled).toBe(true);
    expect(settled.data.settled).toBe(true);
    expect(settled.data.conflict).toBe(false);
    expect(settled.data.journalEntryId).toBeTruthy();

    const [paidRow] = await testDb
      .select()
      .from(paymentInvoices)
      .where(eq(paymentInvoices.id, invoiceId));
    expect(paidRow?.status).toBe(InvoiceStatus.PAID);

    // Replay of the exact same session is idempotent (no duplicate receipts or conflict)
    const replay = await settleErpInvoiceFromStripeWebhook(
      webhookEvent,
      logger,
    );
    expect(replay.success).toBe(true);
    if (!replay.success) {
      return;
    }
    expect(replay.data.settled).toBe(true);
    expect(replay.data.conflict).toBe(false);

    const receipts = await testDb
      .select()
      .from(paymentInvoiceReceipts)
      .where(eq(paymentInvoiceReceipts.invoiceId, invoiceId));
    expect(receipts.length).toBe(1);

    // A DIFFERENT checkout session hitting the already-paid invoice flags a conflict
    const duplicatePay = await settleErpInvoiceFromStripeWebhook(
      { ...webhookEvent, id: "cs_test_duplicate_2" },
      logger,
    );
    expect(duplicatePay.success).toBe(true);
    if (!duplicatePay.success) {
      return;
    }
    expect(duplicatePay.data.settled).toBe(false);
    expect(duplicatePay.data.conflict).toBe(true);
  });
});
