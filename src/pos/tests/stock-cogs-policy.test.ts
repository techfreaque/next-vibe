import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
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
import { buildPosCogsLines } from "../order/stock";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));

const company = crypto.randomUUID(),
  user = crypto.randomUUID(),
  terminal = crypto.randomUUID(),
  session = crypto.randomUUID(),
  cashAccount = crypto.randomUUID(),
  cogsAccount = crypto.randomUUID(),
  inventoryAccount = crypto.randomUUID(),
  warehouse = crypto.randomUUID(),
  stockedProduct = crypto.randomUUID(),
  unstockedProduct = crypto.randomUUID();
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
    CREATE TABLE company_members (id uuid, company_id uuid, user_id uuid, is_active boolean, role text, invited_by_user_id uuid, joined_at timestamp, created_at timestamp, updated_at timestamp);
    CREATE TABLE users (id uuid PRIMARY KEY, private_name text NOT NULL);
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
      currency text NOT NULL, functional_amount numeric(14, 4), functional_currency text, exchange_rate numeric(18, 8), sort_order integer NOT NULL DEFAULT 0, created_at timestamp DEFAULT now()
    );
    CREATE TABLE pos_terminals(id uuid PRIMARY KEY, company_id uuid, cash_account_node_id uuid, warehouse_id uuid, currency text, name text DEFAULT 'Counter');
    CREATE TABLE pos_sessions(id uuid PRIMARY KEY, terminal_id uuid, cashier_user_id uuid, status text, opened_at timestamp DEFAULT now(), opening_float numeric, closing_float numeric, closed_at timestamp);
    CREATE TABLE pos_orders(id uuid PRIMARY KEY, session_id uuid, customer_id uuid, status text, order_number text, currency text, subtotal numeric, tax_amount numeric, total numeric, journal_entry_id uuid, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), tax_exemption_notice text, line_settlement text);
    CREATE TABLE pos_order_items(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid, product_id uuid, description text, quantity numeric, unit_price numeric, tax_rate numeric, tax_amount numeric, line_total numeric, sort_order int, created_at timestamp, updated_at timestamp);
    CREATE TABLE pos_payments(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid, method text, amount numeric, change numeric, account_node_id uuid, reference text, created_at timestamp DEFAULT now());
    CREATE TABLE pos_refunds(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL, session_id uuid, refund_number text NOT NULL, method text NOT NULL, currency text NOT NULL, subtotal numeric(12,4) NOT NULL, tax_amount numeric(12,4) NOT NULL, total numeric(12,4) NOT NULL, reason text NOT NULL, journal_entry_id uuid, created_by_user_id uuid NOT NULL, created_at timestamp NOT NULL DEFAULT now());
    CREATE TABLE pos_refund_lines(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), refund_id uuid NOT NULL REFERENCES pos_refunds(id), order_item_id uuid NOT NULL REFERENCES pos_order_items(id), quantity numeric(12,4) NOT NULL, line_total numeric(12,4) NOT NULL, tax_amount numeric(12,4) NOT NULL, created_at timestamp NOT NULL DEFAULT now());
    CREATE TABLE warehouses(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid NOT NULL, name text NOT NULL DEFAULT 'Main', code text NOT NULL DEFAULT 'WH-1', address text, is_active boolean NOT NULL DEFAULT true, is_default boolean NOT NULL DEFAULT true, negative_stock_policy text NOT NULL DEFAULT 'BLOCK', created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now());
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
    INSERT INTO companies(id, currency, name, country) VALUES ('${company}', 'EUR', 'Retail Shop', 'DE');
    INSERT INTO users(id, private_name) VALUES ('${user}', 'Cashier');
    INSERT INTO company_members(company_id, user_id, role, is_active) VALUES ('${company}', '${user}', '${CompanyMemberRole.ADMIN}', true);
    INSERT INTO account_nodes(id, company_id, code, name, type, subtype) VALUES
      ('${cashAccount}', '${company}', '1000', 'Till Cash', 'asset', '${AccountSubtype.CASH}'),
      (gen_random_uuid(), '${company}', '1200', 'Bank', 'asset', '${AccountSubtype.BANK}'),
      ('${inventoryAccount}', '${company}', '1400', 'Inventory', 'asset', '${AccountSubtype.INVENTORY}'),
      (gen_random_uuid(), '${company}', '1776', 'VAT Payable', 'liability', '${AccountSubtype.VAT_PAYABLE}'),
      (gen_random_uuid(), '${company}', '8400', 'Sales', 'revenue', '${AccountSubtype.REVENUE_SALES}'),
      ('${cogsAccount}', '${company}', '5000', 'Cost of Goods Sold', 'expense', '${AccountSubtype.COGS}');
    INSERT INTO accounting_periods(company_id, name, start_date, end_date) VALUES ('${company}', 'Open', current_date - 10, current_date + 10);
    INSERT INTO warehouses(id, company_id, name, code, is_active, is_default, negative_stock_policy)
      VALUES ('${warehouse}', '${company}', 'Shop Floor', 'SHOP', true, true, 'BLOCK');
    INSERT INTO catalog_products VALUES
      ('${stockedProduct}', '${company}', null, '${ProductType.PHYSICAL}'),
      ('${unstockedProduct}', '${company}', null, '${ProductType.PHYSICAL}');
    INSERT INTO stock_levels(warehouse_id, product_id, quantity_on_hand, unit_cost)
      VALUES ('${warehouse}', '${stockedProduct}', 3, 4.5);
    INSERT INTO pos_terminals(id, company_id, cash_account_node_id, warehouse_id, currency)
      VALUES ('${terminal}', '${company}', '${cashAccount}', '${warehouse}', 'EUR');
    INSERT INTO pos_sessions(id, terminal_id, cashier_user_id, status, opening_float)
      VALUES ('${session}', '${terminal}', '${user}', '${PosSessionStatus.OPEN}', 100);
  `);
}, 30_000);

afterAll(() => pg.close());

async function createOrder(opts: {
  productId: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  orderNumber: string;
}): Promise<{ orderId: string; orderItemId: string }> {
  const orderId = crypto.randomUUID();
  const orderItemId = crypto.randomUUID();
  const taxRate = opts.taxRate ?? 19;
  const subtotal = Math.round(opts.quantity * opts.unitPrice * 100) / 100;
  const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;
  await pg.query(
    "INSERT INTO pos_orders(id, session_id, status, order_number, currency, subtotal, tax_amount, total) VALUES ($1, $2, $3, $4, 'EUR', $5, $6, $7)",
    [
      orderId,
      session,
      PosOrderStatus.OPEN,
      opts.orderNumber,
      subtotal,
      taxAmount,
      total,
    ],
  );
  await pg.query(
    "INSERT INTO pos_order_items(id, order_id, product_id, description, quantity, unit_price, tax_rate, tax_amount, line_total, sort_order) VALUES ($1, $2, $3, 'Item', $4, $5, $6, $7, $8, 0)",
    [
      orderItemId,
      orderId,
      opts.productId,
      opts.quantity,
      opts.unitPrice,
      taxRate,
      taxAmount,
      subtotal,
    ],
  );
  await pg.query(
    "INSERT INTO pos_payments(order_id, method, amount, change) VALUES ($1, $2, $3, 0)",
    [orderId, PosPaymentMethod.CASH, total],
  );
  return { orderId, orderItemId };
}

test("buildPosCogsLines builds balanced sale and refund reversal lines", () => {
  const sale = buildPosCogsLines({
    totalCogs: 9,
    currency: "EUR",
    description: "POS-1 COGS",
  });
  expect(sale).toHaveLength(2);
  expect(sale[0]).toMatchObject({
    type: LineType.DEBIT,
    subtype: AccountSubtype.COGS,
    amount: 9,
  });
  expect(sale[1]).toMatchObject({
    type: LineType.CREDIT,
    subtype: AccountSubtype.INVENTORY,
    amount: 9,
  });

  const refund = buildPosCogsLines({
    totalCogs: 4.5,
    currency: "EUR",
    description: "POS-1-R1 COGS reversal",
    reverse: true,
  });
  expect(refund[0]).toMatchObject({
    type: LineType.DEBIT,
    subtype: AccountSubtype.INVENTORY,
    amount: 4.5,
  });
  expect(refund[1]).toMatchObject({
    type: LineType.CREDIT,
    subtype: AccountSubtype.COGS,
    amount: 4.5,
  });
  expect(
    buildPosCogsLines({ totalCogs: 0, currency: "EUR", description: "none" }),
  ).toHaveLength(0);
});

test("POS sale issues stock, posts balanced COGS/Inventory lines, and partial refund reverses COGS", async () => {
  const { PosOrderCompleteRepository } =
    await import("../order/[orderId]/complete/repository");
  const { PosOrderRefundRepository } =
    await import("../order/[orderId]/refund/repository");

  const { orderId, orderItemId } = await createOrder({
    productId: stockedProduct,
    quantity: 2,
    unitPrice: 10,
    orderNumber: "POS-COGS-1",
  });
  const completed = await PosOrderCompleteRepository.completeOrder(
    { orderId },
    user,
    logger,
  );
  expect(completed.success).toBe(true);
  if (!completed.success) {
    return;
  }
  const saleJeId = completed.data.result.journalEntryId;
  expect(saleJeId).toBeTruthy();

  const stockAfterSale = await pg.query<{ quantity_on_hand: string }>(
    "SELECT quantity_on_hand FROM stock_levels WHERE warehouse_id = $1 AND product_id = $2",
    [warehouse, stockedProduct],
  );
  expect(Number(stockAfterSale.rows[0]?.quantity_on_hand)).toBe(1);

  const saleLines = await pg.query<{
    account_id: string;
    type: string;
    amount: string;
  }>(
    "SELECT account_id, type, amount FROM journal_entry_lines WHERE journal_entry_id = $1",
    [saleJeId],
  );
  const cogsDebit = saleLines.rows.find(
    (r) => r.account_id === cogsAccount && r.type === LineType.DEBIT,
  );
  const invCredit = saleLines.rows.find(
    (r) => r.account_id === inventoryAccount && r.type === LineType.CREDIT,
  );
  expect(Number(cogsDebit?.amount)).toBe(9);
  expect(Number(invCredit?.amount)).toBe(9);

  const refund = await PosOrderRefundRepository.refundOrder(
    {
      method: PosPaymentMethod.CASH,
      reason: "Customer returned 1 unit",
      lines: [{ orderItemId, quantity: 1 }],
    },
    orderId,
    user,
    logger,
  );
  expect(refund.success).toBe(true);
  if (!refund.success) {
    return;
  }
  expect(refund.data.result.stockReturned).toBe(1);
  const refundJeId = refund.data.result.journalEntryId;
  expect(refundJeId).toBeTruthy();

  const stockAfterRefund = await pg.query<{ quantity_on_hand: string }>(
    "SELECT quantity_on_hand FROM stock_levels WHERE warehouse_id = $1 AND product_id = $2",
    [warehouse, stockedProduct],
  );
  expect(Number(stockAfterRefund.rows[0]?.quantity_on_hand)).toBe(2);

  const refundLines = await pg.query<{
    account_id: string;
    type: string;
    amount: string;
  }>(
    "SELECT account_id, type, amount FROM journal_entry_lines WHERE journal_entry_id = $1",
    [refundJeId],
  );
  const invDebit = refundLines.rows.find(
    (r) => r.account_id === inventoryAccount && r.type === LineType.DEBIT,
  );
  const cogsCredit = refundLines.rows.find(
    (r) => r.account_id === cogsAccount && r.type === LineType.CREDIT,
  );
  expect(Number(invDebit?.amount)).toBe(4.5);
  expect(Number(cogsCredit?.amount)).toBe(4.5);
});

test("negative stock policy BLOCK rejects oversell, while WARN and ALLOW permit negative stock", async () => {
  const { PosOrderCompleteRepository } =
    await import("../order/[orderId]/complete/repository");
  const { InventoryWarehouseUpdateRepository } =
    await import("@/inventory/warehouse/[warehouseId]/update/repository");
  const { InventoryWarehouseGetRepository } =
    await import("@/inventory/warehouse/[warehouseId]/get/repository");

  // Stocked product currently has 2 on hand; selling 5 under BLOCK must fail
  const blockedOrder = await createOrder({
    productId: stockedProduct,
    quantity: 5,
    unitPrice: 10,
    orderNumber: "POS-BLOCK-1",
  });
  const blocked = await PosOrderCompleteRepository.completeOrder(
    { orderId: blockedOrder.orderId },
    user,
    logger,
  );
  expect(blocked.success).toBe(false);

  // Switch warehouse policy to WARN via warehouse update repository
  const updated = await InventoryWarehouseUpdateRepository.updateWarehouse(
    warehouse,
    { negativeStockPolicy: "WARN" },
    user,
    logger,
  );
  expect(updated.success).toBe(true);
  if (updated.success) {
    expect(updated.data.result.negativeStockPolicy).toBe("WARN");
  }
  const fetched = await InventoryWarehouseGetRepository.getWarehouse(
    warehouse,
    user,
    logger,
  );
  expect(fetched.success && fetched.data.result.negativeStockPolicy).toBe(
    "WARN",
  );

  // Retry completing the same 5-unit order under WARN -> succeeds and goes to -3
  const warned = await PosOrderCompleteRepository.completeOrder(
    { orderId: blockedOrder.orderId },
    user,
    logger,
  );
  expect(warned.success).toBe(true);
  const levelAfterWarn = await pg.query<{ quantity_on_hand: string }>(
    "SELECT quantity_on_hand FROM stock_levels WHERE warehouse_id = $1 AND product_id = $2",
    [warehouse, stockedProduct],
  );
  expect(Number(levelAfterWarn.rows[0]?.quantity_on_hand)).toBe(-3);

  // Switch policy to ALLOW and sell a physical SKU that had no stock_levels row yet
  await InventoryWarehouseUpdateRepository.updateWarehouse(
    warehouse,
    { negativeStockPolicy: "ALLOW" },
    user,
    logger,
  );
  const unstockedOrder = await createOrder({
    productId: unstockedProduct,
    quantity: 2,
    unitPrice: 8,
    orderNumber: "POS-ALLOW-1",
  });
  const allowed = await PosOrderCompleteRepository.completeOrder(
    { orderId: unstockedOrder.orderId },
    user,
    logger,
  );
  expect(allowed.success).toBe(true);
  const unstockedLevel = await pg.query<{ quantity_on_hand: string }>(
    "SELECT quantity_on_hand FROM stock_levels WHERE warehouse_id = $1 AND product_id = $2",
    [warehouse, unstockedProduct],
  );
  expect(Number(unstockedLevel.rows[0]?.quantity_on_hand)).toBe(-2);
});
