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
    CREATE TABLE companies (id uuid PRIMARY KEY, currency text, name text, is_active boolean NOT NULL DEFAULT true);
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
      currency text NOT NULL, sort_order integer NOT NULL DEFAULT 0, created_at timestamp DEFAULT now()
    );

 CREATE TABLE pos_terminals(id uuid PRIMARY KEY, company_id uuid,cash_account_node_id uuid,currency text);
 CREATE TABLE pos_sessions(id uuid PRIMARY KEY,terminal_id uuid,status text,opening_float numeric,closing_float numeric,closed_at timestamp);
 CREATE TABLE pos_orders(id uuid PRIMARY KEY,session_id uuid,customer_id uuid,status text,order_number text,currency text,subtotal numeric,tax_amount numeric,total numeric,journal_entry_id uuid,created_at timestamp,updated_at timestamp);
 CREATE TABLE pos_order_items(id uuid PRIMARY KEY default gen_random_uuid(),order_id uuid,product_id uuid,description text,quantity numeric,unit_price numeric,tax_rate numeric,tax_amount numeric,line_total numeric,sort_order int,created_at timestamp,updated_at timestamp);
 CREATE TABLE pos_payments(id uuid PRIMARY KEY default gen_random_uuid(),order_id uuid,method text,amount numeric,change numeric,account_node_id uuid,reference text,created_at timestamp default now());
 INSERT INTO companies(id,currency,name) VALUES ('${company}','EUR','Shop');
 INSERT INTO company_members(company_id,user_id,role,is_active) VALUES ('${company}','${user}','${CompanyMemberRole.MEMBER}',true);
 INSERT INTO pos_terminals VALUES ('${terminal}','${company}',null,'EUR');
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
  expect(added.data.result.orderTotal).toBe(3.5616);
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
