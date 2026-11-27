import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { CompanyMemberRole } from "@/companies/enum";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));
const company = crypto.randomUUID(),
  user = crypto.randomUUID(),
  warehouse = crypto.randomUUID(),
  destination = crypto.randomUUID(),
  product = crypto.randomUUID(),
  foreignProduct = crypto.randomUUID();
const logger = createEndpointLogger(false, defaultLocale);
beforeAll(async () => {
  await pg.exec(`
 CREATE TABLE companies(id uuid PRIMARY KEY,currency text);
 CREATE TABLE company_members(id uuid,company_id uuid,user_id uuid,role text,is_active boolean,invited_by_user_id uuid,joined_at timestamp,created_at timestamp,updated_at timestamp);
 CREATE TABLE warehouses(id uuid PRIMARY KEY,company_id uuid,is_active boolean,negative_stock_policy text NOT NULL DEFAULT 'BLOCK');
 CREATE TABLE catalog_products(id uuid PRIMARY KEY,company_id uuid,owner_user_id uuid);
 CREATE TABLE purchase_orders(id uuid PRIMARY KEY,company_id uuid,status text,delivery_warehouse_id uuid,po_number text,currency text,received_at timestamp,updated_at timestamp);
 CREATE TABLE purchase_order_lines(id uuid PRIMARY KEY,po_id uuid,product_id uuid,quantity numeric,quantity_received numeric,unit_price numeric);
 CREATE TABLE purchase_receipts(id uuid PRIMARY KEY,po_id uuid,warehouse_id uuid,received_by_user_id uuid,received_at timestamp,notes text, created_at timestamp);
 CREATE TABLE purchase_receipt_lines(id uuid default gen_random_uuid(),receipt_id uuid,po_line_id uuid,quantity_received numeric);
 CREATE TABLE stock_levels(id uuid default gen_random_uuid(),warehouse_id uuid,product_id uuid,quantity_on_hand numeric default 0,quantity_reserved numeric default 0,quantity_on_order numeric default 0,reorder_point numeric,reorder_quantity numeric,unit_cost numeric,updated_at timestamp,unique(warehouse_id,product_id));
 CREATE TABLE stock_movements(id uuid PRIMARY KEY,warehouse_id uuid,product_id uuid,type text,quantity numeric,unit_cost numeric,reference text,source_id uuid,source_type text,notes text,created_by_user_id uuid,created_at timestamp);
 CREATE TABLE warehouse_transfers(id uuid PRIMARY KEY default gen_random_uuid(),company_id uuid,from_warehouse_id uuid,to_warehouse_id uuid,status text default 'DRAFT',reference text,notes text,created_by_user_id uuid,completed_at timestamp,created_at timestamp,updated_at timestamp);
 CREATE TABLE warehouse_transfer_items(id uuid PRIMARY KEY default gen_random_uuid(),transfer_id uuid,product_id uuid,quantity_requested numeric,quantity_received numeric default 0);
 INSERT INTO companies VALUES ('${company}','EUR');
 INSERT INTO company_members(company_id,user_id,role,is_active) VALUES ('${company}','${user}','${CompanyMemberRole.ADMIN}',true);
 INSERT INTO warehouses VALUES ('${warehouse}','${company}',true),('${destination}','${company}',true);
 INSERT INTO catalog_products VALUES ('${product}','${company}',null),('${foreignProduct}',gen_random_uuid(),null);
 `);
});
afterAll(() => pg.close());
async function newOrder(
  productIds: string[],
  currency = "EUR",
  unitPrice = 10,
): Promise<{ orderId: string; lines: string[] }> {
  const orderId = crypto.randomUUID();
  await pg.query(
    "INSERT INTO purchase_orders VALUES ($1,$2,'SENT',$3,'PO-8',$4,null,now())",
    [orderId, company, warehouse, currency],
  );
  const lines: string[] = [];
  for (const productId of productIds) {
    const line = crypto.randomUUID();
    lines.push(line);
    await pg.query(
      "INSERT INTO purchase_order_lines VALUES ($1,$2,$3,2,0,$4)",
      [line, orderId, productId, unitPrice],
    );
  }
  return { orderId, lines };
}
async function receive(
  orderId: string,
  lines: string[],
  quantity: number,
): Promise<boolean> {
  const { OrderReceiveRepository } = await import("./repository");
  const result = await OrderReceiveRepository.receiveOrder(
    orderId,
    user,
    {
      notes: undefined,
      warehouseId: undefined,
      lines: lines.map((poLineId) => ({
        poLineId,
        quantityReceived: quantity,
      })),
    },
    logger,
  );
  return result.success;
}
test("validates order ownership of receipt lines, quantities and valuation currency before recording a receipt", async () => {
  const first = await newOrder([product]);
  const other = await newOrder([product], "USD");
  expect(await receive(first.orderId, other.lines, 1)).toBe(false);
  expect(
    await receive(first.orderId, [...first.lines, ...first.lines], 1),
  ).toBe(false);
  expect(await receive(first.orderId, first.lines, 3)).toBe(false);
  expect(await receive(first.orderId, first.lines, 0.00001)).toBe(false);
  expect(await receive(other.orderId, other.lines, 1)).toBe(false);
  expect((await pg.query("SELECT id FROM purchase_receipts")).rows).toEqual([]);
});
test("a foreign product rolls back every receipt, stock movement and line update in the order", async () => {
  const order = await newOrder([product, foreignProduct]);
  expect(await receive(order.orderId, order.lines, 1)).toBe(false);
  expect((await pg.query("SELECT id FROM stock_movements")).rows).toEqual([]);
  expect((await pg.query("SELECT id FROM purchase_receipts")).rows).toEqual([]);
  expect(
    (
      await pg.query(
        "SELECT quantity_received::int AS qty FROM purchase_order_lines WHERE po_id=$1",
        [order.orderId],
      )
    ).rows,
  ).toEqual([{ qty: 0 }, { qty: 0 }]);
});
test("concurrent final receipts create one movement and weight costs by units received", async () => {
  const order = await newOrder([product]);
  expect(await receive(order.orderId, order.lines, 1)).toBe(true);
  const attempts = await Promise.all([
    receive(order.orderId, order.lines, 1),
    receive(order.orderId, order.lines, 1),
  ]);
  expect(attempts.filter(Boolean)).toHaveLength(1);
  const second = await newOrder([product], "EUR", 20);
  expect(await receive(second.orderId, second.lines, 2)).toBe(true);
  expect(
    (
      await pg.query(
        "SELECT quantity_on_hand::int as qty,unit_cost::int as cost FROM stock_levels WHERE warehouse_id=$1 AND product_id=$2",
        [warehouse, product],
      )
    ).rows,
  ).toEqual([{ qty: 4, cost: 15 }]);
  expect(
    (
      await pg.query("SELECT status FROM purchase_orders WHERE id=$1", [
        order.orderId,
      ])
    ).rows,
  ).toEqual([{ status: "RECEIVED" }]);
});
test("warehouse transfers carry cost, reject duplicate dispatch, and roll back on a failed second line", async () => {
  const { InventoryTransferCreateRepository } =
    await import("@/inventory/transfer/create/repository");
  const { InventoryTransferDispatchRepository } =
    await import("@/inventory/transfer/[transferId]/dispatch/repository");
  const { InventoryTransferReceiveRepository } =
    await import("@/inventory/transfer/[transferId]/receive/repository");
  const create = await InventoryTransferCreateRepository.createTransfer(
    {
      companyId: company,
      fromWarehouseId: warehouse,
      toWarehouseId: destination,
      items: [{ productId: product, quantityRequested: 1 }],
      reference: undefined,
      notes: undefined,
    },
    user,
    logger,
  );
  expect(create.success).toBe(true);
  if (!create.success) {
    return;
  }
  const transferId = create.data.result.id;
  const attempt = (): ReturnType<
    typeof InventoryTransferDispatchRepository.dispatchTransfer
  > =>
    InventoryTransferDispatchRepository.dispatchTransfer(
      { transferId },
      user,
      logger,
    );
  const extra = crypto.randomUUID();
  await pg.query("INSERT INTO warehouse_transfer_items VALUES ($1,$2,$3,1,0)", [
    extra,
    transferId,
    foreignProduct,
  ]);
  expect((await attempt()).success).toBe(false);
  expect(
    (
      await pg.query("SELECT id FROM stock_movements WHERE source_id=$1", [
        transferId,
      ])
    ).rows,
  ).toEqual([]);
  await pg.query("DELETE FROM warehouse_transfer_items WHERE id=$1", [extra]);
  expect(
    (await Promise.all([attempt(), attempt()])).filter(
      (result) => result.success,
    ),
  ).toHaveLength(1);
  expect(
    (
      await InventoryTransferReceiveRepository.receiveTransfer(
        { transferId },
        user,
        logger,
      )
    ).success,
  ).toBe(true);
  expect(
    (
      await pg.query(
        "SELECT quantity_on_hand::int as qty,unit_cost::int as cost FROM stock_levels WHERE warehouse_id=$1",
        [destination],
      )
    ).rows,
  ).toEqual([{ qty: 1, cost: 15 }]);
});
