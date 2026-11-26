import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { createEndpointLogger } from "next-vibe/logger/server";

import { CompanyMemberRole } from "@/companies/enum";
import { LINE_SETTLEMENT_V1 } from "@/tax/line-settlement";

import { BillStatus } from "../../enum";
import type { BillCreateRequestOutput } from "./definition";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));
const companyId = crypto.randomUUID();
const foreignCompanyId = crypto.randomUUID();
const userId = crypto.randomUUID();
const vendorId = crypto.randomUUID();
const foreignVendorId = crypto.randomUUID();
const logger = createEndpointLogger(false, defaultLocale);

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE companies (id uuid PRIMARY KEY, currency text, name text, is_active boolean);
    CREATE TABLE company_members (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid, user_id uuid,
      role text, is_active boolean, invited_by_user_id uuid, joined_at timestamp,
      created_at timestamp, updated_at timestamp
    );
    CREATE TABLE purchasing_vendors (id uuid PRIMARY KEY, company_id uuid, name text, vat_number text, is_active boolean, default_payment_terms_days int);
    CREATE TABLE payment_bills (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid, supplier_name text,
      supplier_vat_number text, bill_number text, bill_date timestamp, due_date timestamp,
      currency text, status text DEFAULT '${BillStatus.DRAFT}', subtotal numeric(12,4),
      tax_amount numeric(12,4), total numeric(12,4), notes text, journal_entry_id uuid,
      paid_at timestamp, metadata jsonb, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now()
    );
    CREATE TABLE payment_bill_lines (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), bill_id uuid REFERENCES payment_bills(id),
      description text CHECK (description <> 'Reject this line'), product_id uuid,
      expense_account_id uuid, quantity numeric(12,4), unit_price numeric(12,4),
      tax_rate numeric(12,4), tax_amount numeric(12,4), line_total numeric(12,4),
      sort_order int, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now()
    );
    INSERT INTO companies VALUES ('${companyId}', 'EUR', 'Manual company', true);
    INSERT INTO company_members (company_id, user_id, role, is_active)
      VALUES ('${companyId}', '${userId}', '${CompanyMemberRole.ACCOUNTANT}', true);
    INSERT INTO purchasing_vendors VALUES
      ('${vendorId}', '${companyId}', 'Synthetic Parts Supplier', 'ATU12345678', true, 30),
      ('${foreignVendorId}', '${foreignCompanyId}', 'Foreign supplier', 'DE123456789', true, 60);
  `);
});
afterAll(() => pg.close());

function base(): BillCreateRequestOutput {
  return {
    companyId,
    supplierName: "Manual supplier",
    billDate: new Date("2026-11-25"),
    dueDate: new Date("2026-12-25"),
    currency: "EUR",
    billNumber: "BILL-42",
  };
}

it("saves supplier snapshot, item rows and settled cent totals together", async () => {
  const { BillCreateRepository } = await import("./repository");
  const result = await BillCreateRepository.createBill(
    userId,
    {
      ...base(),
      vendorId,
      supplierName: undefined,
      lineItems: [
        {
          description: "Components",
          quantity: 2,
          unitPrice: 12.3456,
          taxRate: 0.2,
        },
        {
          description: "Handling",
          quantity: 1.5,
          unitPrice: 4.0102,
          taxRate: 0.1,
        },
      ],
    },
    logger,
  );
  expect(result).toMatchObject({
    success: true,
    data: {
      supplierNameResponse: "Synthetic Parts Supplier",
      status: BillStatus.DRAFT,
      subtotal: 30.71,
      taxAmount: 5.54,
      total: 36.25,
      currencyResponse: "EUR",
    },
  });
  if (result.success) {
    const bill = await pg.query<{
      supplier_vat_number: string;
      metadata: { vendorId: string; lineSettlement: typeof LINE_SETTLEMENT_V1 };
    }>(
      "SELECT supplier_vat_number, metadata FROM payment_bills WHERE id = $1",
      [result.data.id],
    );
    expect(bill.rows).toEqual([
      {
        supplier_vat_number: "ATU12345678",
        metadata: { vendorId, lineSettlement: LINE_SETTLEMENT_V1 },
      },
    ]);
    const lines = await pg.query<{
      description: string;
      tax_amount: string;
      line_total: string;
    }>(
      "SELECT description, tax_amount, line_total FROM payment_bill_lines WHERE bill_id = $1 ORDER BY sort_order",
      [result.data.id],
    );
    expect(lines.rows).toEqual([
      {
        description: "Components",
        tax_amount: "4.9400",
        line_total: "29.6300",
      },
      { description: "Handling", tax_amount: "0.6000", line_total: "6.6200" },
    ]);
  }
});

it("keeps no-line creation compatible and rejects wrong-scope suppliers and invalid amounts", async () => {
  const { BillCreateRepository } = await import("./repository");
  const submit = (data: BillCreateRequestOutput) =>
    BillCreateRepository.createBill(userId, data, logger);
  expect(await submit(base())).toMatchObject({
    success: true,
    data: {
      supplierNameResponse: "Manual supplier",
      subtotal: 0,
      taxAmount: 0,
      total: 0,
    },
  });
  expect(await submit({ ...base(), vendorId: foreignVendorId })).toMatchObject({
    success: false,
    errorType: ErrorResponseTypes.NOT_FOUND,
  });
  expect(await submit({ ...base(), supplierName: undefined })).toMatchObject({
    success: false,
    errorType: ErrorResponseTypes.VALIDATION_ERROR,
  });
  const line = {
    description: "Invalid",
    quantity: 1,
    unitPrice: 1,
    taxRate: 0.2,
  };
  for (const invalid of [
    { ...line, quantity: 0.00001 },
    { ...line, quantity: 99_999_999, unitPrice: 2 },
    { ...line, unitPrice: -1 },
    { ...line, taxRate: 1.2 },
  ]) {
    expect(await submit({ ...base(), lineItems: [invalid] })).toMatchObject({
      success: false,
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
    });
  }
  expect(
    await submit({ ...base(), billDate: new Date("invalid") }),
  ).toMatchObject({
    success: false,
    errorType: ErrorResponseTypes.VALIDATION_ERROR,
  });
});

it("defaults missing bill and due dates from the UTC day and selected supplier terms", async () => {
  const { BillCreateRepository } = await import("./repository");
  const dayBefore = new Date().toISOString().slice(0, 10);
  const result = await BillCreateRepository.createBill(
    userId,
    {
      ...base(),
      billNumber: undefined,
      billDate: undefined,
      dueDate: undefined,
      vendorId,
    },
    logger,
  );
  expect(result.success).toBe(true);
  if (!result.success) {
    return;
  }
  const { rows } = await pg.query<{
    bill_day: string;
    due_day: string;
    terms_days: number;
  }>(
    "SELECT bill_date::date::text AS bill_day, due_date::date::text AS due_day, (due_date::date - bill_date::date)::int AS terms_days FROM payment_bills WHERE id = $1",
    [result.data.id],
  );
  expect(rows[0]).toMatchObject({ terms_days: 30 });
  expect([dayBefore, new Date().toISOString().slice(0, 10)]).toContain(
    rows[0]?.bill_day,
  );
  expect(rows[0]?.due_day).not.toBe(rows[0]?.bill_day);
});

it("preserves explicit due dates including a deliberately unset supplier due date", async () => {
  const { BillCreateRepository } = await import("./repository");
  for (const dueDate of [new Date("2026-11-28"), null]) {
    const result = await BillCreateRepository.createBill(
      userId,
      { ...base(), billNumber: undefined, dueDate, vendorId },
      logger,
    );
    expect(result.success).toBe(true);
    if (result.success) {
      const { rows } = await pg.query<{ due_day: string | null }>(
        "SELECT due_date::date::text AS due_day FROM payment_bills WHERE id = $1",
        [result.data.id],
      );
      expect(rows[0]?.due_day).toBe(
        dueDate?.toISOString().slice(0, 10) ?? null,
      );
    }
  }
});

it("rolls back the bill and all lines when an item insert fails", async () => {
  const { BillCreateRepository } = await import("./repository");
  const log = {
    ...logger,
    error: mock(logger.error).mockImplementation(() => undefined),
  };
  const rejected = await BillCreateRepository.createBill(
    userId,
    {
      ...base(),
      billNumber: "ROLLBACK-BILL",
      lineItems: [
        {
          description: "Allowed line",
          quantity: 1,
          unitPrice: 20,
          taxRate: 0.23,
        },
        {
          description: "Reject this line",
          quantity: 1,
          unitPrice: 30,
          taxRate: 0.1,
        },
      ],
    },
    log,
  );
  expect(rejected).toMatchObject({
    success: false,
    errorType: ErrorResponseTypes.INTERNAL_ERROR,
  });
  expect(
    await pg.query(
      "SELECT id FROM payment_bills WHERE bill_number = 'ROLLBACK-BILL'",
    ),
  ).toMatchObject({ rows: [] });
  expect(
    await pg.query(
      "SELECT id FROM payment_bill_lines WHERE description = 'Allowed line'",
    ),
  ).toMatchObject({ rows: [] });
});
