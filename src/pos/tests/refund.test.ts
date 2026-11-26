import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { createEndpointLogger } from "next-vibe/logger/server";

import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
  PeriodStatus,
} from "@/chart-of-accounts/enum";
import { CompanyMemberRole } from "@/companies/enum";
import { ProductType } from "@/products/enum";

import { PosOrderStatus, PosPaymentMethod, PosSessionStatus } from "../enum";
import { planPosRefund } from "../order/[orderId]/refund/amounts";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));

const company = crypto.randomUUID(),
  user = crypto.randomUUID(),
  terminal = crypto.randomUUID(),
  session = crypto.randomUUID(),
  emptyTerminal = crypto.randomUUID(),
  emptySession = crypto.randomUUID(),
  cashAccount = crypto.randomUUID(),
  warehouse = crypto.randomUUID(),
  product = crypto.randomUUID();
const logger = createEndpointLogger(false, defaultLocale);

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE company_tax_regimes (company_id uuid NOT NULL, effective_from date NOT NULL, regime text NOT NULL, recorded_by uuid, recorded_at timestamp DEFAULT now(), PRIMARY KEY (company_id, effective_from));
    CREATE TABLE companies (id uuid PRIMARY KEY, currency text, name text, country text, is_active boolean NOT NULL DEFAULT true);
    CREATE TABLE pos_fiscal_providers (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid NOT NULL UNIQUE,
      adapter text NOT NULL, device_kind text NOT NULL DEFAULT 'enums.deviceKind.orp',
      cash_register_code text NOT NULL, is_enabled boolean NOT NULL DEFAULT false,
      certified_until date, settings jsonb NOT NULL DEFAULT '{}'::jsonb, created_by uuid,
      created_at timestamp NOT NULL DEFAULT now(), updated_at timestamp NOT NULL DEFAULT now()
    );
    CREATE TABLE users (id uuid PRIMARY KEY, private_name text NOT NULL);
    CREATE TABLE company_members (id uuid, company_id uuid, user_id uuid, is_active boolean, role text, invited_by_user_id uuid, joined_at timestamp, created_at timestamp, updated_at timestamp);
    CREATE TABLE account_nodes (
      id uuid PRIMARY KEY, company_id uuid NOT NULL, code text NOT NULL,
      name text NOT NULL, type text NOT NULL, subtype text NOT NULL,
      is_active boolean NOT NULL DEFAULT true, is_postable boolean NOT NULL DEFAULT true
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
      amount numeric(14, 4) NOT NULL, description text,
      currency text NOT NULL, sort_order integer NOT NULL DEFAULT 0, created_at timestamp DEFAULT now()
    );
    CREATE TABLE pos_terminals(id uuid PRIMARY KEY, company_id uuid, cash_account_node_id uuid, warehouse_id uuid, currency text, name text DEFAULT 'Counter');
    CREATE TABLE pos_sessions(id uuid PRIMARY KEY, terminal_id uuid, cashier_user_id uuid, status text, opened_at timestamp DEFAULT now(), opening_float numeric, closing_float numeric, closed_at timestamp);
    CREATE TABLE pos_orders(id uuid PRIMARY KEY, session_id uuid, customer_id uuid, status text, order_number text, currency text, subtotal numeric, tax_amount numeric, total numeric, journal_entry_id uuid, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), tax_exemption_notice text, line_settlement text);
    CREATE TABLE pos_order_items(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid, product_id uuid, description text, quantity numeric, unit_price numeric, tax_rate numeric, tax_amount numeric, line_total numeric, sort_order int, created_at timestamp, updated_at timestamp);
    CREATE TABLE pos_payments(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid, method text, amount numeric, change numeric, account_node_id uuid, reference text, created_at timestamp DEFAULT now());
    CREATE TABLE pos_refunds(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL, session_id uuid, refund_number text NOT NULL, method text NOT NULL, currency text NOT NULL, subtotal numeric(12,4) NOT NULL, tax_amount numeric(12,4) NOT NULL, total numeric(12,4) NOT NULL, reason text NOT NULL, journal_entry_id uuid, created_by_user_id uuid NOT NULL, created_at timestamp NOT NULL DEFAULT now());
    CREATE TABLE pos_refund_lines(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), refund_id uuid NOT NULL REFERENCES pos_refunds(id), order_item_id uuid NOT NULL REFERENCES pos_order_items(id), quantity numeric(12,4) NOT NULL, line_total numeric(12,4) NOT NULL, tax_amount numeric(12,4) NOT NULL, created_at timestamp NOT NULL DEFAULT now());
    CREATE TABLE warehouses(id uuid PRIMARY KEY, company_id uuid NOT NULL, is_active boolean NOT NULL);
    CREATE TABLE catalog_products(id uuid PRIMARY KEY, company_id uuid, owner_user_id uuid, type text NOT NULL);
    CREATE TABLE stock_levels(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), warehouse_id uuid NOT NULL,
      product_id uuid NOT NULL, quantity_on_hand numeric NOT NULL,
      quantity_reserved numeric NOT NULL DEFAULT 0, quantity_on_order numeric NOT NULL DEFAULT 0,
      reorder_point numeric, reorder_quantity numeric, unit_cost numeric, updated_at timestamp,
      UNIQUE(warehouse_id, product_id)
    );
    CREATE TABLE stock_movements(
      id uuid PRIMARY KEY, warehouse_id uuid NOT NULL, product_id uuid NOT NULL,
      type text, quantity numeric, unit_cost numeric, reference text, source_id uuid,
      source_type text, notes text, created_by_user_id uuid, created_at timestamp DEFAULT now()
    );
    INSERT INTO users (id, private_name) VALUES ('${user}', 'Fixture cashier');
    INSERT INTO companies(id, currency, name) VALUES ('${company}', 'EUR', 'Shop');
    INSERT INTO company_members(company_id, user_id, role, is_active) VALUES ('${company}', '${user}', '${CompanyMemberRole.MEMBER}', true);
    INSERT INTO account_nodes(id, company_id, code, name, type, subtype) VALUES
      ('${cashAccount}', '${company}', '1000', 'Till', 'asset', '${AccountSubtype.CASH}'),
      (gen_random_uuid(), '${company}', '1100', 'Bank', 'asset', '${AccountSubtype.BANK}'),
      (gen_random_uuid(), '${company}', '2000', 'VAT', 'liability', '${AccountSubtype.VAT_PAYABLE}'),
      (gen_random_uuid(), '${company}', '4000', 'Sales', 'revenue', '${AccountSubtype.REVENUE_SALES}');
    INSERT INTO accounting_periods(company_id, name, start_date, end_date) VALUES ('${company}', 'Open', current_date - 10, current_date + 10);
    INSERT INTO warehouses VALUES ('${warehouse}', '${company}', true);
    INSERT INTO catalog_products VALUES ('${product}', '${company}', null, '${ProductType.PHYSICAL}');
    INSERT INTO stock_levels(warehouse_id, product_id, quantity_on_hand, unit_cost) VALUES ('${warehouse}', '${product}', 10, 4);
    INSERT INTO pos_terminals(id, company_id, cash_account_node_id, warehouse_id, currency) VALUES
      ('${terminal}', '${company}', '${cashAccount}', '${warehouse}', 'EUR'),
      ('${emptyTerminal}', '${company}', '${cashAccount}', null, 'EUR');
    INSERT INTO pos_sessions(id, terminal_id, cashier_user_id, status, opening_float) VALUES
      ('${session}', '${terminal}', '${user}', '${PosSessionStatus.OPEN}', 50),
      ('${emptySession}', '${emptyTerminal}', '${crypto.randomUUID()}', '${PosSessionStatus.OPEN}', 0);
  `);
}, 30_000);
afterAll(() => pg.close());

/** Open order with two units of the stocked product at 10 + 23 % VAT. */
async function openOrder(sessionId = session): Promise<{
  orderId: string;
  itemId: string;
}> {
  const orderId = crypto.randomUUID();
  const itemId = crypto.randomUUID();
  await pg.query(
    "INSERT INTO pos_orders(id, session_id, status, order_number, currency, subtotal, tax_amount, total) VALUES ($1, $2, $3, 'POS-T', 'EUR', 20, 4.6, 24.6)",
    [orderId, sessionId, PosOrderStatus.OPEN],
  );
  await pg.query(
    "INSERT INTO pos_order_items(id, order_id, product_id, description, quantity, unit_price, tax_rate, tax_amount, line_total, sort_order) VALUES ($1, $2, $3, 'Notebook', 2, 10, 0.23, 4.6, 24.6, 0)",
    [itemId, orderId, product],
  );
  return { orderId, itemId };
}

async function tender(
  orderId: string,
  amount: number,
  method: typeof PosPaymentMethod.CASH | typeof PosPaymentMethod.CARD,
): Promise<string | undefined> {
  const { PosOrderAddPaymentRepository } =
    await import("../order/[orderId]/add-payment/repository");
  const result = await PosOrderAddPaymentRepository.addPayment(
    {
      details: {
        orderId,
        method,
        amount,
        change: undefined,
        reference: undefined,
        accountNodeId: undefined,
      },
    },
    user,
    logger,
  );
  return result.success ? result.data.result.id : undefined;
}

async function complete(orderId: string): Promise<boolean> {
  const { PosOrderCompleteRepository } =
    await import("../order/[orderId]/complete/repository");
  return (
    await PosOrderCompleteRepository.completeOrder({ orderId }, user, logger)
  ).success;
}

async function refund(
  orderId: string,
  request: {
    lines?: { orderItemId: string; quantity: number }[];
    method: (typeof PosPaymentMethod)[keyof typeof PosPaymentMethod];
    sessionId?: string;
  },
): Promise<
  Awaited<
    ReturnType<
      typeof import("../order/[orderId]/refund/repository").PosOrderRefundRepository.refundOrder
    >
  >
> {
  const { PosOrderRefundRepository } =
    await import("../order/[orderId]/refund/repository");
  return PosOrderRefundRepository.refundOrder(
    {
      lines: request.lines,
      method: request.method,
      sessionId: request.sessionId,
      reason: "Customer returned it",
    },
    orderId,
    user,
    logger,
  );
}

async function stockOnHand(): Promise<number> {
  const { rows } = await pg.query<{ q: string }>(
    "SELECT quantity_on_hand AS q FROM stock_levels WHERE product_id = $1",
    [product],
  );
  return Number(rows[0]?.q);
}

async function journalLines(
  journalEntryId: string | null,
): Promise<{ type: string; subtype: string; amount: number }[]> {
  const { rows } = await pg.query<{
    type: string;
    subtype: string;
    amount: string;
  }>(
    "SELECT l.type, a.subtype, l.amount FROM journal_entry_lines l JOIN account_nodes a ON a.id = l.account_id WHERE l.journal_entry_id = $1 ORDER BY l.sort_order",
    [journalEntryId],
  );
  return rows.map((row) => ({ ...row, amount: Number(row.amount) }));
}

function balanced(lines: { type: string; amount: number }[]): boolean {
  const debit = lines
    .filter((line) => line.type === LineType.DEBIT)
    .reduce((sum, line) => sum + Math.round(line.amount * 100), 0);
  const credit = lines
    .filter((line) => line.type === LineType.CREDIT)
    .reduce((sum, line) => sum + Math.round(line.amount * 100), 0);
  return debit > 0 && debit === credit;
}

let saleId = "";
let saleItemId = "";

test("remove-payment takes a mistyped tender back off an open sale", async () => {
  const { PosOrderRemovePaymentRepository } =
    await import("../order/[orderId]/remove-payment/repository");
  const { orderId, itemId } = await openOrder();
  saleId = orderId;
  saleItemId = itemId;

  const wrongCard = await tender(orderId, 20, PosPaymentMethod.CARD);
  expect(wrongCard).toBeDefined();
  if (!wrongCard) {
    return;
  }
  const missing = await PosOrderRemovePaymentRepository.removePayment(
    { paymentId: crypto.randomUUID() },
    orderId,
    user,
    logger,
  );
  expect(!missing.success && missing.errorType.errorCode).toBe(
    ErrorResponseTypes.NOT_FOUND.errorCode,
  );
  const foreign = await PosOrderRemovePaymentRepository.removePayment(
    { paymentId: wrongCard },
    orderId,
    crypto.randomUUID(),
    logger,
  );
  expect(foreign.success).toBe(false);

  const removed = await PosOrderRemovePaymentRepository.removePayment(
    { paymentId: wrongCard },
    orderId,
    user,
    logger,
  );
  expect(removed).toMatchObject({
    success: true,
    data: {
      result: {
        paymentId: wrongCard,
        sessionId: session,
        totalPaid: 0,
        outstanding: 24.6,
        remainingPayments: 0,
      },
    },
  });
  // Back to the item-edit state: settled from items, no tender left.
  const { rows } = await pg.query<{ n: string; total: string }>(
    "SELECT (SELECT count(*)::text FROM pos_payments WHERE order_id = $1) AS n, total FROM pos_orders WHERE id = $1",
    [orderId],
  );
  expect(rows).toEqual([{ n: "0", total: "24.6" }]);

  // Cash 30 for 24.60: change 5.40, completion posts and issues 2 units.
  expect(await tender(orderId, 30, PosPaymentMethod.CASH)).toBeDefined();
  expect(await complete(orderId)).toBe(true);
  expect(await stockOnHand()).toBe(8);

  // A completed sale no longer accepts payment removal.
  const { rows: payments } = await pg.query<{ id: string }>(
    "SELECT id FROM pos_payments WHERE order_id = $1",
    [orderId],
  );
  const late = await PosOrderRemovePaymentRepository.removePayment(
    { paymentId: payments[0]?.id ?? "" },
    orderId,
    user,
    logger,
  );
  expect(!late.success && late.errorType.errorCode).toBe(
    ErrorResponseTypes.CONFLICT.errorCode,
  );
});

test("partial cash refund pays out of the open drawer, reverses the books and restocks", async () => {
  const partial = await refund(saleId, {
    lines: [{ orderItemId: saleItemId, quantity: 1 }],
    method: PosPaymentMethod.CASH,
  });
  expect(partial).toMatchObject({
    success: true,
    data: {
      result: {
        sessionId: session,
        subtotal: 10,
        taxAmount: 2.3,
        total: 12.3,
        refundedTotal: 12.3,
        fullyRefunded: false,
        stockReturned: 1,
      },
    },
  });
  if (!partial.success) {
    return;
  }
  const lines = await journalLines(partial.data.result.journalEntryId);
  expect(lines).toEqual([
    { type: LineType.DEBIT, subtype: AccountSubtype.REVENUE_SALES, amount: 10 },
    { type: LineType.DEBIT, subtype: AccountSubtype.VAT_PAYABLE, amount: 2.3 },
    { type: LineType.CREDIT, subtype: AccountSubtype.CASH, amount: 12.3 },
  ]);
  expect(balanced(lines)).toBe(true);
  expect(await stockOnHand()).toBe(9);
  // The sale stays a completed sale on its own date.
  const { rows } = await pg.query<{ status: string }>(
    "SELECT status FROM pos_orders WHERE id = $1",
    [saleId],
  );
  expect(rows).toEqual([{ status: PosOrderStatus.COMPLETED }]);
});

test("refunds cannot exceed what was sold minus earlier refunds", async () => {
  const over = await refund(saleId, {
    lines: [{ orderItemId: saleItemId, quantity: 2 }],
    method: PosPaymentMethod.CARD,
  });
  expect(!over.success && over.errorType.errorCode).toBe(
    ErrorResponseTypes.CONFLICT.errorCode,
  );
  const foreignLine = await refund(saleId, {
    lines: [{ orderItemId: crypto.randomUUID(), quantity: 1 }],
    method: PosPaymentMethod.CARD,
  });
  expect(!foreignLine.success && foreignLine.errorType.errorCode).toBe(
    ErrorResponseTypes.VALIDATION_ERROR.errorCode,
  );
});

test("full refund of the rest lands exactly on the sale total", async () => {
  const rest = await refund(saleId, { method: PosPaymentMethod.CARD });
  expect(rest).toMatchObject({
    success: true,
    data: {
      result: {
        sessionId: null,
        total: 12.3,
        refundedTotal: 24.6,
        fullyRefunded: true,
        stockReturned: 1,
      },
    },
  });
  if (!rest.success) {
    return;
  }
  const lines = await journalLines(rest.data.result.journalEntryId);
  expect(balanced(lines)).toBe(true);
  expect(lines.at(-1)).toEqual({
    type: LineType.CREDIT,
    subtype: AccountSubtype.BANK,
    amount: 12.3,
  });
  expect(await stockOnHand()).toBe(10);

  const again = await refund(saleId, { method: PosPaymentMethod.CARD });
  expect(!again.success && again.errorType.errorCode).toBe(
    ErrorResponseTypes.CONFLICT.errorCode,
  );

  const { PosOrderRefundRepository } =
    await import("../order/[orderId]/refund/repository");
  const summary = await PosOrderRefundRepository.getRefunds(
    saleId,
    user,
    logger,
  );
  expect(summary).toMatchObject({
    success: true,
    data: {
      result: {
        total: 24.6,
        refundedTotal: 24.6,
        refundableTotal: 0,
        journalPosted: true,
        lines: [{ quantity: 2, refundedQuantity: 2, refundableQuantity: 0 }],
      },
    },
  });
  if (summary.success) {
    expect(summary.data.result.refunds).toHaveLength(2);
  }
  const { rows } = await pg.query<{ total: string }>(
    "SELECT sum(total) AS total FROM pos_refunds WHERE order_id = $1",
    [saleId],
  );
  expect(Number(rows[0]?.total)).toBe(24.6);
});

test("cash refunds need cash in the drawer", async () => {
  const { orderId } = await openOrder(emptySession);
  expect(await tender(orderId, 24.6, PosPaymentMethod.CARD)).toBeDefined();
  expect(await complete(orderId)).toBe(true);
  const short = await refund(orderId, { method: PosPaymentMethod.CASH });
  expect(!short.success && short.errorType.errorCode).toBe(
    ErrorResponseTypes.CONFLICT.errorCode,
  );
  const { rows } = await pg.query<{ n: string }>(
    "SELECT count(*)::text AS n FROM pos_refunds WHERE order_id = $1",
    [orderId],
  );
  expect(rows).toEqual([{ n: "0" }]);
});

test("session close subtracts cash refunds from the expected drawer", async () => {
  const { PosSessionGetRepository } =
    await import("../session/[sessionId]/get/repository");
  const open = await PosSessionGetRepository.getSession(session, user, logger);
  expect(open).toMatchObject({
    success: true,
    data: {
      result: {
        cashierName: "Fixture cashier",
        cashSalesTotal: 24.6,
        cashRefundsTotal: 12.3,
        expectedCash: 62.3,
      },
    },
  });
  const { PosSessionCloseRepository } =
    await import("../session/close/repository");
  const closed = await PosSessionCloseRepository.closeSession(
    { details: { sessionId: session, closingFloat: 62.3 } },
    user,
    logger,
  );
  expect(closed).toMatchObject({
    success: true,
    data: {
      result: {
        openingFloat: 50,
        cashSalesTotal: 24.6,
        cashRefundsTotal: 12.3,
        expectedFloat: 62.3,
        variance: 0,
        orderCount: 1,
      },
    },
  });
});

test("cumulative planning never drifts from the sale total", () => {
  const source = [
    {
      orderItemId: "a",
      quantity: 3,
      lineTotal: 10,
      taxAmount: 1.87,
      refundedQuantity: 0,
      refundedLineTotal: 0,
      refundedTaxAmount: 0,
    },
  ];
  const order = { subtotal: 8.13, taxAmount: 1.87, total: 10 };
  let prior = { subtotal: 0, taxAmount: 0, total: 0 };
  let refunded = 0;
  let refundedLineTotal = 0;
  let refundedTaxAmount = 0;
  const totals: number[] = [];
  for (let step = 0; step < 3; step += 1) {
    const plan = planPosRefund(
      [
        {
          ...source[0],
          refundedQuantity: refunded,
          refundedLineTotal,
          refundedTaxAmount,
        },
      ],
      [{ orderItemId: "a", quantity: 1 }],
      order,
      prior,
    );
    expect(plan.ok).toBe(true);
    if (!plan.ok) {
      return;
    }
    totals.push(plan.total);
    refunded += 1;
    refundedLineTotal += plan.lines[0]?.lineTotal ?? 0;
    refundedTaxAmount += plan.lines[0]?.taxAmount ?? 0;
    prior = {
      subtotal: prior.subtotal + plan.subtotal,
      taxAmount: prior.taxAmount + plan.taxAmount,
      total: prior.total + plan.total,
    };
  }
  expect(totals).toEqual([3.33, 3.34, 3.33]);
  expect(Math.round(prior.total * 100)).toBe(1000);
  expect(Math.round(prior.taxAmount * 100)).toBe(187);
});
