import { PGlite } from "@electric-sql/pglite";
import { beforeAll, afterAll, test, expect, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { createEndpointLogger } from "next-vibe/logger/server";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
  PeriodStatus,
} from "@/chart-of-accounts/enum";
import { CompanyMemberRole } from "@/companies/enum";
import { ProductType } from "@/products/enum";
import { LINE_SETTLEMENT_V1 } from "@/tax/line-settlement";
import { CompanyTaxRegime } from "@/tax/regime/enum";
import { PosOrderStatus, PosPaymentMethod, PosSessionStatus } from "../enum";
const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));
const company = crypto.randomUUID(),
  user = crypto.randomUUID(),
  terminal = crypto.randomUUID(),
  session = crypto.randomUUID(),
  cash = crypto.randomUUID(),
  sales = crypto.randomUUID();
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
    CREATE TABLE company_members (id uuid, company_id uuid, user_id uuid, is_active boolean, role text,invited_by_user_id uuid,joined_at timestamp,created_at timestamp,updated_at timestamp);
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
      amount numeric(14, 4) NOT NULL,
      description text CHECK (description <> 'reject-this-line'),
      currency text NOT NULL, functional_amount numeric(14, 4), functional_currency text, exchange_rate numeric(18, 8), sort_order integer NOT NULL DEFAULT 0, created_at timestamp DEFAULT now()
    );

 CREATE TABLE pos_terminals(id uuid PRIMARY KEY, company_id uuid,cash_account_node_id uuid,warehouse_id uuid,currency text,name text DEFAULT 'Counter');
 CREATE TABLE pos_sessions(id uuid PRIMARY KEY,terminal_id uuid,status text,opening_float numeric,closing_float numeric,closed_at timestamp);
 CREATE TABLE pos_orders(id uuid PRIMARY KEY,session_id uuid,customer_id uuid,status text,order_number text,currency text,subtotal numeric,tax_amount numeric,total numeric,journal_entry_id uuid,created_at timestamp,updated_at timestamp,tax_exemption_notice text,line_settlement text);
 CREATE TABLE pos_order_items(id uuid PRIMARY KEY default gen_random_uuid(),order_id uuid,product_id uuid,description text,quantity numeric,unit_price numeric,tax_rate numeric,tax_amount numeric,line_total numeric,sort_order int,created_at timestamp,updated_at timestamp);
 CREATE TABLE pos_payments(id uuid PRIMARY KEY default gen_random_uuid(),order_id uuid,method text,amount numeric,change numeric,account_node_id uuid,reference text,created_at timestamp default now());
 CREATE TABLE pos_refunds(id uuid PRIMARY KEY default gen_random_uuid(),order_id uuid,session_id uuid,method text,currency text,total numeric,created_at timestamp default now());
 CREATE TABLE warehouses(id uuid PRIMARY KEY, company_id uuid NOT NULL, is_active boolean NOT NULL, negative_stock_policy text NOT NULL DEFAULT 'BLOCK');
 CREATE TABLE catalog_products(id uuid PRIMARY KEY, company_id uuid, owner_user_id uuid, type text NOT NULL);
 CREATE TABLE stock_levels(
   id uuid PRIMARY KEY default gen_random_uuid(), warehouse_id uuid NOT NULL,
   product_id uuid NOT NULL, quantity_on_hand numeric NOT NULL,
   quantity_reserved numeric NOT NULL default 0, quantity_on_order numeric NOT NULL default 0,
   reorder_point numeric, reorder_quantity numeric, unit_cost numeric, updated_at timestamp,
   UNIQUE(warehouse_id, product_id)
 );
 CREATE TABLE stock_movements(
   id uuid PRIMARY KEY, warehouse_id uuid NOT NULL, product_id uuid NOT NULL,
   type text, quantity numeric, unit_cost numeric, reference text, source_id uuid,
   source_type text, notes text, created_by_user_id uuid, created_at timestamp default now()
 );
 INSERT INTO companies(id,currency,name) VALUES ('${company}','EUR','Shop');
 INSERT INTO company_members(company_id,user_id,role,is_active) VALUES ('${company}','${user}','${CompanyMemberRole.MEMBER}',true);
 INSERT INTO pos_terminals (id,company_id,cash_account_node_id,currency) VALUES ('${terminal}','${company}',null,'EUR');
 INSERT INTO pos_sessions VALUES ('${session}','${terminal}','${PosSessionStatus.OPEN}',30,null,null);
 `);
});
afterAll(() => pg.close());
async function order(total: number, tax = 0): Promise<string> {
  const id = crypto.randomUUID();
  await pg.query(
    "INSERT INTO pos_orders(id,session_id,status,order_number,currency,subtotal,tax_amount,total) VALUES ($1,$2,$3,'POS-1','EUR',$4,$5,$6)",
    [id, session, PosOrderStatus.OPEN, total - tax, tax, total],
  );
  return id;
}
async function complete(id: string, actor = user): Promise<boolean> {
  const { PosOrderCompleteRepository } =
    await import("../order/[orderId]/complete/repository");
  return (
    await PosOrderCompleteRepository.completeOrder(
      { orderId: id },
      actor,
      logger,
    )
  ).success;
}
async function tender(
  id: string,
  amount: number,
  method:
    | typeof PosPaymentMethod.CARD
    | typeof PosPaymentMethod.CASH = PosPaymentMethod.CASH,
  change?: number,
): Promise<boolean> {
  const { PosOrderAddPaymentRepository } =
    await import("../order/[orderId]/add-payment/repository");
  const result = await PosOrderAddPaymentRepository.addPayment(
    {
      details: {
        orderId: id,
        method,
        amount,
        change,
        reference: undefined,
        accountNodeId: undefined,
      },
    },
    user,
    logger,
  );
  return result.success;
}
test("rounds stored line net and tax once and recalculates after removal", async () => {
  const id = await order(0);
  const { PosOrderAddItemRepository } =
    await import("../order/[orderId]/add-item/repository");
  const { PosOrderRemoveItemRepository } =
    await import("../order/[orderId]/remove-item/repository");
  const { PosOrderVoidRepository } =
    await import("../order/[orderId]/void/repository");
  const added = await PosOrderAddItemRepository.addItem(
    {
      orderId: id,
      item: {
        description: "Measured sale",
        productId: undefined,
        quantity: 1.2345,
        unitPrice: 2.3456,
        taxRate: 0.23,
      },
    },
    user,
    logger,
  );
  expect(added.success).toBe(true);
  if (!added.success) {
    return;
  }
  expect(added.data.result.taxAmount).toBe(0.666);
  expect(added.data.result.lineTotal).toBe(3.5616);
  expect(added.data.result.orderTotal).toBe(3.56);
  const removed = await PosOrderRemoveItemRepository.removeItem(
    { details: { orderId: id, itemId: added.data.result.id } },
    user,
    logger,
  );
  expect(removed.success).toBe(true);
  expect(
    (
      await pg.query("SELECT total::int AS total FROM pos_orders WHERE id=$1", [
        id,
      ])
    ).rows,
  ).toEqual([{ total: 0 }]);
  expect(
    (await PosOrderVoidRepository.voidOrder({ orderId: id }, user, logger))
      .success,
  ).toBe(true);
});
test("retains input precision and applies the elected exemption to cent-settled lines", async () => {
  const id = await order(0);
  await pg.query("UPDATE pos_orders SET line_settlement=$2 WHERE id=$1", [
    id, LINE_SETTLEMENT_V1,
  ]);
  const { PosOrderAddItemRepository } =
    await import("../order/[orderId]/add-item/repository");
  await pg.query(
    "INSERT INTO company_tax_regimes(company_id,effective_from,regime) VALUES ($1,'2000-01-01',$2)",
    [company, CompanyTaxRegime.DE_SMALL_BUSINESS],
  );
  try {
    const item = {
      description: "Measured exempt item",
      productId: undefined,
      quantity: 1.2345,
      unitPrice: 2.3456,
    };
    const incompatible = await PosOrderAddItemRepository.addItem(
      { orderId: id, item: { ...item, taxRate: 0.23 } }, user, logger,
    );
    expect(incompatible.success).toBe(false);
    const added = await PosOrderAddItemRepository.addItem(
      { orderId: id, item: { ...item, taxRate: 0 } }, user, logger,
    );
    expect(added).toMatchObject({
      success: true,
      data: { result: {
        quantity: 1.2345, unitPrice: 2.3456, taxAmount: 0,
        lineTotal: 2.9, orderTotal: 2.9,
      } },
    });
  } finally {
    await pg.query("DELETE FROM pos_order_items WHERE order_id=$1", [id]);
    await pg.query("DELETE FROM pos_orders WHERE id=$1", [id]);
    await pg.query("DELETE FROM company_tax_regimes WHERE company_id=$1", [company]);
  }
});

test("validates change and only counts cash retained on a standalone terminal", async () => {
  const id = await order(12);
  expect(await tender(id, 20, PosPaymentMethod.CARD)).toBe(false);
  expect(await tender(id, 12, PosPaymentMethod.CASH, 14)).toBe(false);
  expect(await tender(id, 20)).toBe(true);
  const { PosOrderVoidRepository } =
    await import("../order/[orderId]/void/repository");
  const { PosOrderRemoveItemRepository } =
    await import("../order/[orderId]/remove-item/repository");
  expect(
    (await PosOrderVoidRepository.voidOrder({ orderId: id }, user, logger))
      .success,
  ).toBe(false);
  const blockedItemChange = await PosOrderRemoveItemRepository.removeItem(
    { details: { orderId: id, itemId: crypto.randomUUID() } },
    user,
    logger,
  );
  expect(
    !blockedItemChange.success && blockedItemChange.errorType?.errorCode,
  ).toBe(ErrorResponseTypes.CONFLICT.errorCode);
  expect(await complete(id, crypto.randomUUID())).toBe(false);
  expect(await complete(id)).toBe(true);
  expect(await tender(id, 10)).toBe(false);
  expect(
    (
      await pg.query(
        "SELECT change::int AS change FROM pos_payments WHERE order_id=$1",
        [id],
      )
    ).rows,
  ).toEqual([{ change: 8 }]);
});
test("configured company requires balanced VAT posting, posts once, and reconciles the drawer net of change", async () => {
  await pg.query(
    "INSERT INTO account_nodes(id,company_id,code,name,type,subtype) VALUES ($1,$2,'1000','Till','asset',$3),($4,$2,'4000','Sales','revenue',$5)",
    [cash, company, AccountSubtype.CASH, sales, AccountSubtype.REVENUE_SALES],
  );
  await pg.query(
    "INSERT INTO accounting_periods(company_id,name,start_date,end_date) VALUES ($1,'Open',current_date-10,current_date+10)",
    [company],
  );
  const id = await order(123, 23);
  await pg.query(
    "INSERT INTO pos_payments(order_id,method,amount,change) VALUES ($1,$2,130,0)",
    [id, PosPaymentMethod.CASH],
  );
  expect(await complete(id)).toBe(false);
  expect(
    (await pg.query("SELECT id FROM journal_entries WHERE source_id=$1", [id]))
      .rows,
  ).toEqual([]);
  await pg.query(
    "INSERT INTO account_nodes(id,company_id,code,name,type,subtype) VALUES (gen_random_uuid(),$1,'2000','Tax','liability',$2)",
    [company, AccountSubtype.VAT_PAYABLE],
  );
  expect(
    (await Promise.all([complete(id), complete(id)])).filter(Boolean),
  ).toHaveLength(1);
  expect(
    (
      await pg.query(
        "SELECT type,amount::int AS amount FROM journal_entry_lines ORDER BY amount DESC",
      )
    ).rows,
  ).toEqual([
    { type: LineType.DEBIT, amount: 123 },
    { type: LineType.CREDIT, amount: 100 },
    { type: LineType.CREDIT, amount: 23 },
  ]);
  const { PosSessionCloseRepository } =
    await import("../session/close/repository");
  const foreignOrder = crypto.randomUUID();
  await pg.query(
    "insert into pos_orders(id,session_id,status,currency,total) values ($1,$2,$3,'USD',8)",
    [foreignOrder, session, PosOrderStatus.COMPLETED],
  );
  await pg.query(
    "insert into pos_payments(order_id,amount,change,method) values ($1,8,0,$2)",
    [foreignOrder, PosPaymentMethod.CASH],
  );
  expect(
    (
      await PosSessionCloseRepository.closeSession(
        { details: { sessionId: session, closingFloat: 165 } },
        user,
        logger,
      )
    ).success,
  ).toBe(false);
  expect(
    (await pg.query("select status from pos_sessions where id=$1", [session]))
      .rows,
  ).toEqual([{ status: PosSessionStatus.OPEN }]);
  await pg.query("update pos_payments set method=$2 where order_id=$1", [
    foreignOrder,
    PosPaymentMethod.CARD,
  ]);
  const closed = await PosSessionCloseRepository.closeSession(
    { details: { sessionId: session, closingFloat: 165 } },
    user,
    logger,
  );
  expect(closed.success && closed.data.result.cashSalesTotal).toBe(135);
  expect(closed.success && closed.data.result.variance).toBe(0);
});


test("rolls back a prior stock issue and posted journal when the second SKU is short", async () => {
  const warehouse = crypto.randomUUID();
  const stockSession = crypto.randomUUID();
  const stockTerminal = crypto.randomUUID();
  const first = "00000000-0000-4000-8000-000000000001";
  const second = "00000000-0000-4000-8000-000000000002";
  const service = "00000000-0000-4000-8000-000000000003";
  const id = await order(8);

  await pg.query("INSERT INTO warehouses VALUES ($1,$2,true)", [warehouse, company]);
  await pg.query(
    "INSERT INTO catalog_products VALUES ($1,$4,$5,$6),($2,$4,$5,$6),($3,$4,$5,$7)",
    [first, second, service, company, user, ProductType.PHYSICAL, ProductType.SERVICE],
  );
  await pg.query(
    "INSERT INTO stock_levels(warehouse_id,product_id,quantity_on_hand,quantity_reserved) VALUES ($1,$2,5,0),($1,$3,2,2),($1,$4,0,0)",
    [warehouse, first, second, service],
  );
  await pg.query(
    "INSERT INTO pos_terminals(id,company_id,currency,warehouse_id) VALUES ($1,$2,'EUR',$3)",
    [stockTerminal, company, warehouse],
  );
  await pg.query(
    "INSERT INTO pos_sessions(id,terminal_id,status,opening_float) VALUES ($1,$2,$3,0)",
    [stockSession, stockTerminal, PosSessionStatus.OPEN],
  );
  await pg.query("UPDATE pos_orders SET session_id=$1 WHERE id=$2", [stockSession, id]);
  await pg.query(
    "INSERT INTO pos_order_items(order_id,product_id,quantity) VALUES ($1,$2,1),($1,$2,1),($1,$3,1),($1,$4,1)",
    [id, first, second, service],
  );
  expect(await tender(id, 8)).toBe(true);
  expect(await complete(id)).toBe(false);
  expect((await pg.query("SELECT id FROM stock_movements WHERE source_id=$1", [id])).rows).toEqual([]);
  expect((await pg.query("SELECT id FROM journal_entries WHERE source_id=$1", [id])).rows).toEqual([]);
  expect((await pg.query("SELECT status FROM pos_orders WHERE id=$1", [id])).rows).toEqual([{ status: PosOrderStatus.OPEN }]);
  expect((await pg.query("SELECT quantity_on_hand::int AS quantity FROM stock_levels WHERE product_id=$1", [first])).rows).toEqual([{ quantity: 5 }]);

  await pg.query("UPDATE stock_levels SET quantity_reserved=1 WHERE product_id=$1", [second]);
  expect(await complete(id)).toBe(true);
  expect(await complete(id)).toBe(false);
  expect((await pg.query(
    "SELECT product_id,quantity::int,source_type FROM stock_movements WHERE source_id=$1 ORDER BY product_id",
    [id],
  )).rows).toEqual([
    { product_id: first, quantity: -2, source_type: "POS_ORDER" },
    { product_id: second, quantity: -1, source_type: "POS_ORDER" },
  ]);
  expect((await pg.query("SELECT id FROM journal_entries WHERE source_id=$1", [id])).rows).toHaveLength(1);
});

test("normalizes untendered legacy orders to cents but keeps recorded fractional tender exact", async () => {
  const precisionSession = crypto.randomUUID();
  await pg.query(
    "INSERT INTO pos_sessions(id,terminal_id,status,opening_float) VALUES ($1,$2,$3,0)",
    [precisionSession, terminal, PosSessionStatus.OPEN],
  );
  const untendered = await order(24.5877, 4.5977);
  const alreadyTendered = await order(24.5877, 4.5977);
  await pg.query(
    "UPDATE pos_orders SET session_id=$1 WHERE id IN ($2,$3)",
    [precisionSession, untendered, alreadyTendered],
  );

  expect(await tender(untendered, 25.001)).toBe(false);
  expect(await tender(untendered, 25)).toBe(true);
  expect(
    (await pg.query(
      "SELECT total::text, tax_amount::text FROM pos_orders WHERE id=$1",
      [untendered],
    )).rows,
  ).toEqual([{ total: "24.59", tax_amount: "4.6" }]);
  expect(
    (await pg.query("SELECT change::text FROM pos_payments WHERE order_id=$1", [untendered])).rows,
  ).toEqual([{ change: "0.41" }]);
  expect(await complete(untendered)).toBe(true);
  expect(
    (await pg.query(
      "SELECT l.amount::text FROM journal_entry_lines l JOIN journal_entries j ON l.journal_entry_id = j.id WHERE j.source_id=$1 ORDER BY l.amount DESC",
      [untendered],
    )).rows,
  ).toEqual([{ amount: "24.5900" }, { amount: "19.9900" }, { amount: "4.6000" }]);

  await pg.query(
    "INSERT INTO pos_payments(order_id,method,amount,change) VALUES ($1,$2,25,0.4123)",
    [alreadyTendered, PosPaymentMethod.CASH],
  );
  expect(await complete(alreadyTendered)).toBe(false);
  expect((await pg.query("SELECT id FROM journal_entries WHERE source_id=$1", [alreadyTendered])).rows).toEqual([]);
  expect(
    (await pg.query("SELECT total::text FROM pos_orders WHERE id=$1", [alreadyTendered])).rows,
  ).toEqual([{ total: "24.5877" }]);
  expect(
    (await pg.query("SELECT change::text FROM pos_payments WHERE order_id=$1", [alreadyTendered])).rows,
  ).toEqual([{ change: "0.4123" }]);
});

test("rejects incompatible ledger currency before tender and rechecks after later company changes", async () => {
  const currencySession = crypto.randomUUID();
  await pg.query(
    "INSERT INTO pos_sessions(id,terminal_id,status,opening_float) VALUES ($1,$2,$3,0)",
    [currencySession, terminal, PosSessionStatus.OPEN],
  );
  const foreign = await order(8);
  const original = await order(8);
  await pg.query(
    "UPDATE pos_orders SET session_id=$1 WHERE id IN ($2,$3)",
    [currencySession, foreign, original],
  );
  await pg.query("UPDATE pos_orders SET currency='USD' WHERE id=$1", [foreign]);
  expect(await tender(foreign, 8, PosPaymentMethod.CARD)).toBe(false);
  expect(
    (await pg.query("SELECT id FROM pos_payments WHERE order_id=$1", [foreign])).rows,
  ).toEqual([]);

  expect(await tender(original, 8)).toBe(true);
  await pg.query("UPDATE companies SET currency='USD' WHERE id=$1", [company]);
  try {
    expect(await complete(original)).toBe(false);
    expect(
      (await pg.query("SELECT id FROM journal_entries WHERE source_id=$1", [original])).rows,
    ).toEqual([]);
    expect(
      (await pg.query("SELECT amount::int AS amount, change::int AS change FROM pos_payments WHERE order_id=$1", [original])).rows,
    ).toEqual([{ amount: 8, change: 0 }]);
  } finally {
    await pg.query("UPDATE companies SET currency='EUR' WHERE id=$1", [company]);
  }
  expect(await complete(original)).toBe(true);
});
