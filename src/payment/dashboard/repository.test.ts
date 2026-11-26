import { PGlite } from "@electric-sql/pglite";
import { expect, it, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import { CompanyMemberRole } from "@/companies/enum";

import { BillStatus, InvoiceStatus } from "../enum";

it("keeps dashboard amounts separated by currency and excludes bills already paid or still in draft", async () => {
  const pg = new PGlite();
  mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));
  const companyId = crypto.randomUUID();
  const userId = crypto.randomUUID();
  const invoiceId = crypto.randomUUID();
  const accountId = crypto.randomUUID();
  const paymentId = crypto.randomUUID();

  try {
    await pg.exec(`
      CREATE TABLE companies (id uuid PRIMARY KEY, currency text);
      CREATE TABLE company_members (
        id uuid DEFAULT gen_random_uuid(), company_id uuid, user_id uuid,
        role text, is_active boolean, invited_by_user_id uuid, joined_at timestamp,
        created_at timestamp, updated_at timestamp
      );
      CREATE TABLE payment_invoices (
        id uuid DEFAULT gen_random_uuid(), company_id uuid, currency text, status text,
        amount numeric(10,2), invoice_number text, invoice_sequence_number int, due_date timestamp,
        metadata jsonb, created_at timestamp DEFAULT now()
      );
      CREATE TABLE account_nodes (id uuid PRIMARY KEY, company_id uuid, subtype text);
      CREATE TABLE journal_entries (
        id uuid PRIMARY KEY, source_id uuid, company_id uuid, source_type text,
        status text, reversal_of_id uuid, reversed_by_id uuid
      );
      CREATE TABLE journal_entry_lines (journal_entry_id uuid, account_id uuid, currency text, type text, amount numeric(14,4));
      CREATE TABLE payment_bills (company_id uuid, currency text, status text, total numeric(12,4));
      CREATE TABLE payment_estimates (
        id uuid DEFAULT gen_random_uuid(), company_id uuid, currency text, status text,
        total numeric(12,4), estimate_number text, customer_name text,
        valid_until timestamp, created_at timestamp
      );
      CREATE TABLE users (id uuid PRIMARY KEY, private_name text, public_name text);
      INSERT INTO companies VALUES ('${companyId}', 'EUR');
      INSERT INTO company_members (company_id, user_id, role, is_active)
        VALUES ('${companyId}', '${userId}', '${CompanyMemberRole.VIEWER}', true);
      INSERT INTO payment_invoices (company_id, currency, status, amount, due_date) VALUES
        ('${companyId}', 'USD', '${InvoiceStatus.OPEN}', 250, '2100-01-01'),
        ('${companyId}', 'EUR', '${InvoiceStatus.DRAFT}', 80, NULL),
        ('${companyId}', 'EUR', '${InvoiceStatus.PAID}', 60, NULL);
      INSERT INTO payment_invoices (id, company_id, currency, status, amount, due_date, invoice_number, metadata, created_at) VALUES
        ('${invoiceId}', '${companyId}', 'EUR', '${InvoiceStatus.OPEN}', 100, '2000-01-01', 'INV-7', '{"customerName": "Lipa Studio"}', '2001-01-01');
      INSERT INTO payment_invoices (company_id, currency, status, amount, metadata) VALUES
        ('${companyId}', 'EUR', '${InvoiceStatus.OPEN}', -10, '{"originalInvoiceId": "${invoiceId}"}');
      INSERT INTO account_nodes VALUES ('${accountId}', '${companyId}', '${AccountSubtype.ACCOUNTS_RECEIVABLE}');
      INSERT INTO journal_entries (id, source_id, company_id, source_type, status) VALUES
        ('${paymentId}', '${invoiceId}', '${companyId}', '${JournalSourceType.AR_PAYMENT}', '${JournalEntryStatus.POSTED}');
      INSERT INTO journal_entry_lines VALUES
        ('${paymentId}', '${accountId}', 'EUR', '${LineType.CREDIT}', 20);
      INSERT INTO payment_bills VALUES
        ('${companyId}', 'EUR', '${BillStatus.APPROVED}', 45),
        ('${companyId}', 'EUR', '${BillStatus.DRAFT}', 900),
        ('${companyId}', 'EUR', '${BillStatus.PAID}', 700),
        ('${companyId}', 'PLN', '${BillStatus.RECEIVED}', 120);
    `);
    const { PaymentDashboardRepository } = await import("./repository");
    const logger = createEndpointLogger(false, defaultLocale);
    const response = await PaymentDashboardRepository.getDashboard(
      userId,
      { companyId },
      logger,
    );
    expect(response).toMatchObject({
      success: true,
      data: {
        currency: "EUR",
        openInvoices: { count: 2, total: 70 },
        overdueInvoices: { count: 1, total: 70 },
        unpaidBills: { count: 2, total: 45 },
        draftInvoices: { count: 1 },
        byCurrency: [
          { currency: "EUR", open: 70, overdue: 70, unpaid: 45 },
          { currency: "PLN", open: 0, overdue: 0, unpaid: 120 },
          { currency: "USD", open: 250, overdue: 0, unpaid: 0 },
        ],
      },
    });
    const recent = response.success ? response.data.recentInvoices : [];
    expect(recent.find((row) => row.id === invoiceId)).toMatchObject({
      invoiceNumber: "INV-7",
      customerName: "Lipa Studio",
      amountDue: 70,
      isOverdue: true,
    });
  } finally {
    await pg.close();
  }
});
