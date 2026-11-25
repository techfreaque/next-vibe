import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { createEndpointLogger } from "next-vibe/logger/server";

import {
  JournalEntryStatus,
  JournalSourceType,
} from "@/chart-of-accounts/enum";
import { BillStatus, InvoiceStatus } from "@/payment/enum";
import { PosOrderStatus } from "@/pos/enum";

import { scopedTranslation } from "../i18n";
import { TaxReportDirection } from "./enum";

const id = (n: number): string =>
  `00000000-0000-4000-8000-${n.toString().padStart(12, "0")}`;
const companyId = id(1);
const otherCompanyId = id(2);
const userId = id(3);
const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));
mock.module("@/companies/repository", () => ({
  CompanyAuthRepository: {
    requireMember: (actorId: string, requestedCompanyId: string) =>
      Promise.resolve(
        actorId === userId && requestedCompanyId === companyId
          ? success({})
          : fail({
              message: scopedTranslation
                .scopedT(defaultLocale)
                .t("report.errors.forbidden.title"),
              errorType: ErrorResponseTypes.FORBIDDEN,
            }),
      ),
  },
}));

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE companies (
      id uuid PRIMARY KEY, currency text, name text, is_active boolean NOT NULL DEFAULT true
    );
    CREATE TABLE company_members (company_id uuid, user_id uuid, is_active boolean);
    CREATE TABLE journal_entries (id uuid PRIMARY KEY, company_id uuid, date timestamp, status text, source_type text, source_id uuid);
    CREATE TABLE payment_invoices (
      id uuid PRIMARY KEY, company_id uuid, provider_invoice_id text, created_at timestamp,
      journal_entry_id uuid, currency text, status text
    );
    CREATE TABLE payment_invoice_lines (invoice_id uuid, tax_rate numeric(12,4), tax_amount numeric(12,4), line_total numeric(12,4));
    CREATE TABLE payment_bills (id uuid PRIMARY KEY, company_id uuid, bill_date timestamp, currency text, status text);
    CREATE TABLE payment_bill_lines (bill_id uuid, tax_rate numeric(12,4), tax_amount numeric(12,4), line_total numeric(12,4));
    CREATE TABLE pos_terminals (id uuid PRIMARY KEY, company_id uuid);
    CREATE TABLE pos_sessions (id uuid PRIMARY KEY, terminal_id uuid);
    CREATE TABLE pos_orders (
      id uuid PRIMARY KEY, session_id uuid, currency text, status text,
      updated_at timestamp, journal_entry_id uuid
    );
    CREATE TABLE pos_order_items (order_id uuid, tax_rate numeric(12,4), tax_amount numeric(12,4), line_total numeric(12,4));
    CREATE TABLE pos_payments (order_id uuid, amount numeric(12,4));

    INSERT INTO companies (id, currency, name) VALUES
      ('${companyId}', 'EUR', 'Alpha Company'), ('${otherCompanyId}', 'EUR', 'Beta Company');
    INSERT INTO company_members VALUES
      ('${companyId}', '${userId}', true), ('${otherCompanyId}', '${userId}', false);
    INSERT INTO journal_entries VALUES
      ('${id(41)}', '${companyId}', '2026-02-28 23:59:59', '${JournalEntryStatus.REVERSED}', '${JournalSourceType.AR_INVOICE}', '${id(11)}'),
      ('${id(42)}', '${otherCompanyId}', '2026-02-28', '${JournalEntryStatus.POSTED}', '${JournalSourceType.AR_INVOICE}', '${id(17)}');
    INSERT INTO payment_invoices VALUES
      ('${id(11)}', '${companyId}', 'INV-11', '2026-01-01', '${id(41)}', 'EUR', '${InvoiceStatus.OPEN}'),
      ('${id(12)}', '${companyId}', 'CN-12', '2026-02-28 18:00:00', null, 'EUR', '${InvoiceStatus.OPEN}'),
      ('${id(13)}', '${companyId}', 'INV-13', '2026-02-28', null, 'USD', '${InvoiceStatus.PAID}'),
      ('${id(14)}', '${companyId}', 'INV-14', '2026-02-28', null, 'EUR', '${InvoiceStatus.DRAFT}'),
      ('${id(15)}', '${companyId}', 'INV-15', '2026-02-28', null, 'EUR', '${InvoiceStatus.VOID}'),
      ('${id(16)}', '${otherCompanyId}', 'INV-16', '2026-02-28', null, 'EUR', '${InvoiceStatus.OPEN}'),
      ('${id(17)}', '${companyId}', 'INV-17', '2026-01-01', '${id(42)}', 'EUR', '${InvoiceStatus.OPEN}'),
      ('${id(18)}', '${companyId}', 'INV-18', '2026-03-01', null, 'EUR', '${InvoiceStatus.OPEN}'),
      ('${id(19)}', '${companyId}', 'INV-19', '2026-02-01', null, 'EUR', '${InvoiceStatus.UNCOLLECTIBLE}');
    INSERT INTO payment_invoice_lines VALUES
      ('${id(11)}', 0.2, 20, 120),
      ('${id(11)}', 0, 0, 50),
      ('${id(12)}', 20, -4, -24),
      ('${id(12)}', 0.2, -6, -36),
      ('${id(12)}', 0.8, -0.8, -100.8),
      ('${id(12)}', 0.8, 0, 0),
      ('${id(13)}', 0.15, 15, 115),
      ('${id(14)}', 0.2, 18, 108),
      ('${id(15)}', 0.2, 18, 108),
      ('${id(16)}', 0.2, 18, 108),
      ('${id(17)}', 0.2, 18, 108),
      ('${id(18)}', 0.2, 18, 108),
      ('${id(19)}', 0.2, 2.2222, 13.3333);
    INSERT INTO payment_bills VALUES
      ('${id(31)}', '${companyId}', '2026-02-28 23:59:59', 'EUR', '${BillStatus.APPROVED}'),
      ('${id(32)}', '${companyId}', '2026-02-28', 'EUR', '${BillStatus.DRAFT}'),
      ('${id(33)}', '${otherCompanyId}', '2026-02-28', 'EUR', '${BillStatus.PAID}');
    INSERT INTO payment_bill_lines VALUES
      ('${id(31)}', 0.2, 10, 60),
      ('${id(32)}', 0.2, 11, 66),
      ('${id(33)}', 0.2, 12, 72);

    INSERT INTO pos_terminals VALUES ('${id(51)}', '${companyId}'), ('${id(52)}', '${otherCompanyId}');
    INSERT INTO pos_sessions VALUES ('${id(53)}', '${id(51)}'), ('${id(54)}', '${id(52)}');
    INSERT INTO pos_orders VALUES
      ('${id(61)}', '${id(53)}', 'EUR', '${PosOrderStatus.COMPLETED}', '2026-04-30 23:59:59.999', null),
      ('${id(62)}', '${id(53)}', 'EUR', '${PosOrderStatus.OPEN}', '2026-04-30', null),
      ('${id(63)}', '${id(53)}', 'EUR', '${PosOrderStatus.VOIDED}', '2026-04-30', null),
      ('${id(64)}', '${id(53)}', 'EUR', '${PosOrderStatus.COMPLETED}', '2026-05-01', null),
      ('${id(65)}', '${id(54)}', 'EUR', '${PosOrderStatus.COMPLETED}', '2026-04-30', null),
      ('${id(66)}', '${id(53)}', 'USD', '${PosOrderStatus.COMPLETED}', '2026-04-30', null),
      ('${id(67)}', '${id(53)}', 'EUR', '${PosOrderStatus.COMPLETED}', '2026-04-01', '${id(71)}'),
      ('${id(68)}', '${id(53)}', 'EUR', '${PosOrderStatus.COMPLETED}', '2026-04-01', '${id(72)}'),
      ('${id(69)}', '${id(53)}', 'EUR', '${PosOrderStatus.COMPLETED}', '2026-03-31 23:59:59.999', null);
    INSERT INTO pos_order_items VALUES
      ('${id(61)}', 0.2, 2.2222, 13.3333),
      ('${id(61)}', 0.2, 0.0001, 0.0006),
      ('${id(61)}', 0, 0, 50),
      ('${id(62)}', 0.2, 20, 120),
      ('${id(63)}', 0.2, 20, 120),
      ('${id(64)}', 0.2, 20, 120),
      ('${id(65)}', 0.2, 20, 120),
      ('${id(66)}', 0.15, 15, 115),
      ('${id(67)}', 0.2, 20, 120),
      ('${id(68)}', 0.1, 3, 33),
      ('${id(69)}', 0.2, 20, 120);
    INSERT INTO pos_payments VALUES ('${id(61)}', 20), ('${id(61)}', 43.3339);
    INSERT INTO journal_entries VALUES
      ('${id(71)}', '${companyId}', '2026-04-01', '${JournalEntryStatus.POSTED}', '${JournalSourceType.POS_ORDER}', '${id(67)}'),
      ('${id(72)}', '${companyId}', '2026-04-01', '${JournalEntryStatus.POSTED}', '${JournalSourceType.POS_ORDER}', '${id(68)}');
    INSERT INTO payment_invoices VALUES
      ('${id(73)}', '${companyId}', 'INV-73', '2026-04-30', '${id(71)}', 'EUR', '${InvoiceStatus.PAID}'),
      ('${id(74)}', '${companyId}', 'INV-74', '2026-04-30', '${id(72)}', 'EUR', '${InvoiceStatus.OPEN}'),
      ('${id(75)}', '${otherCompanyId}', 'INV-75', '2026-04-30', '${id(72)}', 'EUR', '${InvoiceStatus.OPEN}');
    INSERT INTO payment_invoice_lines VALUES
      ('${id(73)}', 0.2, 20, 120),
      ('${id(75)}', 0.1, 3, 33);
  `);
});

test("counts completed till lines once in the selected currency and UTC range", async () => {
  const { TaxReportRepository } = await import("./repository");
  const logger = createEndpointLogger(false, defaultLocale);
  const filters = {
    companyId,
    dateFrom: new Date("2026-04-01"),
    dateTo: new Date("2026-04-30"),
  };
  const euro = await TaxReportRepository.getReport(
    filters,
    userId,
    logger,
    defaultLocale,
  );
  expect(euro.success).toBe(true);
  if (!euro.success) {
    return;
  }
  expect(euro.data.rows).toHaveLength(3);
  expect(euro.data.rows).toContainEqual({
    direction: TaxReportDirection.POS_SALES,
    rate: 0.1,
    taxableAmount: 30,
    taxAmount: 3,
  });
  expect(euro.data.rows).toContainEqual({
    direction: TaxReportDirection.POS_SALES,
    rate: 0.2,
    taxableAmount: 11.1116,
    taxAmount: 2.2223,
  });
  expect(euro.data.rows).toContainEqual({
    direction: TaxReportDirection.SALES,
    rate: 0.2,
    taxableAmount: 100,
    taxAmount: 20,
  });
  expect(euro.data.totals).toHaveLength(2);
  expect(euro.data.totals).toContainEqual({
    direction: TaxReportDirection.POS_SALES,
    taxableAmount: 41.1116,
    taxAmount: 5.2223,
  });
  const fixture = process.env.ERP_POS_TAX_FIXTURE;
  if (fixture) {
    await Bun.write(fixture, JSON.stringify(euro.data));
  }

  const usd = await TaxReportRepository.getReport(
    { ...filters, currency: "USD" },
    userId,
    logger,
    defaultLocale,
  );
  expect(usd).toMatchObject({
    success: true,
    data: {
      reportCurrency: "USD",
      rows: [
        {
          direction: TaxReportDirection.POS_SALES,
          rate: 0.15,
          taxableAmount: 100,
          taxAmount: 15,
        },
      ],
    },
  });
});

afterAll(async () => {
  await pg.close();
});

test("groups saved document-line tax by direction and rate within the company, date, and currency", async () => {
  const { TaxReportRepository } = await import("./repository");
  const logger = createEndpointLogger(false, defaultLocale);
  const filters = {
    companyId,
    dateFrom: new Date("2026-02-01"),
    dateTo: new Date("2026-02-28"),
  };
  const result = await TaxReportRepository.getReport(
    filters,
    userId,
    logger,
    defaultLocale,
  );
  expect(result).toMatchObject({
    success: true,
    data: {
      reportCompanyId: companyId,
      reportCompanyName: "Alpha Company",
      reportCurrency: "EUR",
      reportDateFrom: "2026-02-01",
      reportDateTo: "2026-02-28",
      totals: [
        {
          direction: TaxReportDirection.CREDIT_NOTES,
          taxableAmount: -150,
          taxAmount: -10.8,
        },
        {
          direction: TaxReportDirection.PURCHASES,
          taxableAmount: 50,
          taxAmount: 10,
        },
        {
          direction: TaxReportDirection.SALES,
          taxableAmount: 161.1111,
          taxAmount: 22.2222,
        },
      ],
      rows: [
        {
          direction: TaxReportDirection.CREDIT_NOTES,
          rate: 0.008,
          taxableAmount: -100,
          taxAmount: -0.8,
        },
        {
          direction: TaxReportDirection.CREDIT_NOTES,
          rate: 0.2,
          taxableAmount: -50,
          taxAmount: -10,
        },
        {
          direction: TaxReportDirection.CREDIT_NOTES,
          rate: null,
          taxableAmount: 0,
          taxAmount: 0,
        },
        {
          direction: TaxReportDirection.PURCHASES,
          rate: 0.2,
          taxableAmount: 50,
          taxAmount: 10,
        },
        {
          direction: TaxReportDirection.SALES,
          rate: 0,
          taxableAmount: 50,
          taxAmount: 0,
        },
        {
          direction: TaxReportDirection.SALES,
          rate: 0.2,
          taxableAmount: 111.1111,
          taxAmount: 22.2222,
        },
      ],
    },
  });

  const usd = await TaxReportRepository.getReport(
    { ...filters, currency: "USD" },
    userId,
    logger,
    defaultLocale,
  );
  expect(usd).toMatchObject({
    success: true,
    data: {
      reportCurrency: "USD",
      rows: [
        {
          direction: TaxReportDirection.SALES,
          rate: 0.15,
          taxableAmount: 100,
          taxAmount: 15,
        },
      ],
    },
  });

  const unauthorized = await TaxReportRepository.getReport(
    { ...filters, companyId: otherCompanyId },
    userId,
    logger,
    defaultLocale,
  );
  expect(unauthorized.success).toBe(false);
  const inverted = await TaxReportRepository.getReport(
    { ...filters, dateFrom: new Date("2026-03-01") },
    userId,
    logger,
    defaultLocale,
  );
  expect(inverted.success).toBe(false);
});

test("defaults to a single active company and asks for selection when ambiguous", async () => {
  const { TaxReportRepository } = await import("./repository");
  const logger = createEndpointLogger(false, defaultLocale);
  const implicit = await TaxReportRepository.getReport(
    {},
    userId,
    logger,
    defaultLocale,
  );
  expect(implicit).toMatchObject({
    success: true,
    data: { reportCompanyId: companyId, reportCurrency: "EUR" },
  });

  await pg.query(
    "update company_members set is_active = true where company_id = $1",
    [otherCompanyId],
  );
  const ambiguous = await TaxReportRepository.getReport(
    {},
    userId,
    logger,
    defaultLocale,
  );
  expect(ambiguous.success).toBe(false);
});

test("the endpoint normalizes date-picker values to the same UTC day as date-only input", async () => {
  const { default: definitions } = await import("./definition");
  const formSchema = definitions.GET.formSchema;
  const pickerValue = new Date(2026, 1, 28);
  const valid = formSchema.safeParse({
    companyId,
    dateFrom: pickerValue,
    dateTo: "2026-02-28",
  });
  expect(valid.success).toBe(true);
  expect(
    formSchema.safeParse({ companyId, dateFrom: "2026-02-30" }).success,
  ).toBe(false);
  if (valid.success) {
    expect(valid.data.dateFrom).toEqual(new Date("2026-02-28T00:00:00Z"));
    expect(valid.data.dateTo).toEqual(new Date("2026-02-28T00:00:00Z"));
  }
});
