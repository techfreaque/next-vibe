import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import type { OrderCreateResponseOutput } from "./create/definition";
import { CompanyMemberRole } from "@/companies/enum";
const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));
const company = crypto.randomUUID(),
  user = crypto.randomUUID(),
  vendor = crypto.randomUUID(),
  otherVendor = crypto.randomUUID();
const logger = createEndpointLogger(false, defaultLocale);
beforeAll(async () => {
  await pg.exec(`create table companies(id uuid primary key,is_active boolean);
 create table company_members(id uuid,company_id uuid,user_id uuid,role text,is_active boolean,invited_by_user_id uuid,joined_at timestamp,created_at timestamp,updated_at timestamp);
 create table purchasing_vendors(id uuid primary key,company_id uuid,is_active boolean);
 create table warehouses(id uuid primary key,company_id uuid,is_active boolean);
 create table catalog_products(id uuid primary key,company_id uuid,owner_user_id uuid);
 create table purchase_orders(id uuid primary key default gen_random_uuid(),company_id uuid,vendor_id uuid,po_number text,status text,currency text,expected_delivery_date timestamp,delivery_warehouse_id uuid,notes text,subtotal numeric,tax_amount numeric,total numeric,bill_id uuid,created_by_user_id uuid,confirmed_at timestamp,received_at timestamp,created_at timestamp default now(),updated_at timestamp default now(),unique(company_id,po_number));
 create table purchase_order_lines(id uuid primary key default gen_random_uuid(),po_id uuid,description text check(description <> 'invalid line'),product_id uuid,quantity numeric,unit_price numeric,tax_rate numeric,tax_amount numeric,line_total numeric,sort_order int,quantity_received numeric,created_at timestamp,updated_at timestamp);
 insert into companies values ('${company}',true);
 insert into company_members(company_id,user_id,role,is_active) values ('${company}','${user}','${CompanyMemberRole.MEMBER}',true);
 insert into purchasing_vendors values ('${vendor}','${company}',true),('${otherVendor}',gen_random_uuid(),true);`);
});
afterAll(() => pg.close());
async function create(): Promise<ResponseType<OrderCreateResponseOutput>> {
  const { OrderCreateRepository } = await import("./create/repository");
  return OrderCreateRepository.createOrder(
    user,
    {
      companyId: company,
      vendorId: vendor,
      currency: "EUR",
      notes: undefined,
      expectedDeliveryDate: undefined,
      deliveryWarehouseId: undefined,
    },
    logger,
  );
}
test("creates unique order numbers under concurrency and refuses foreign references", async () => {
  const [first, second] = await Promise.all([create(), create()]);
  expect(first.success && second.success).toBe(true);
  if (!first.success || !second.success) {
    return;
  }
  expect(first.data.result.poNumber).not.toBe(second.data.result.poNumber);
  const { OrderUpdateRepository } = await import("./[poId]/update/repository");
  const updated = await OrderUpdateRepository.updateOrder(
    first.data.result.id,
    user,
    {
      vendorId: otherVendor,
      lines: undefined,
      notes: undefined,
      currency: undefined,
      expectedDeliveryDate: undefined,
      deliveryWarehouseId: undefined,
    },
    logger,
  );
  expect(updated.success).toBe(false);
});
test("replacement rollback preserves the prior draft, rounded totals and send lock", async () => {
  const created = await create();
  expect(created.success).toBe(true);
  if (!created.success) {
    return;
  }
  const id = created.data.result.id;
  const { OrderLineAddRepository } = await import("./line/add/repository");
  const add = (
    quantity: number,
  ): ReturnType<typeof OrderLineAddRepository.addLine> =>
    OrderLineAddRepository.addLine(
      id,
      user,
      {
        itemDescription: "Fabric",
        productId: undefined,
        quantity,
        unitPrice: 0.015,
        taxRate: 0.25,
      },
      logger,
    );
  const added = await add(0.01);
  expect(added.success && added.data.result).toMatchObject({
    subtotal: 0.0002,
    taxAmount: 0.0001,
    total: 0.0003,
  });
  const { OrderUpdateRepository } = await import("./[poId]/update/repository");
  const failed = await OrderUpdateRepository.updateOrder(
    id,
    user,
    {
      vendorId: undefined,
      lines: [
        {
          description: "invalid line",
          productId: undefined,
          quantity: 1,
          unitPrice: 10,
          taxRate: 0,
          sortOrder: undefined,
        },
      ],
      notes: undefined,
      currency: undefined,
      expectedDeliveryDate: undefined,
      deliveryWarehouseId: undefined,
    },
    logger,
  );
  expect(failed.success).toBe(false);
  expect(
    (
      await pg.query(
        "SELECT description FROM purchase_order_lines WHERE po_id=$1",
        [id],
      )
    ).rows,
  ).toEqual([{ description: "Fabric" }]);
  const { OrderSendRepository } = await import("./[poId]/send/repository");
  const sent = await Promise.all([
    OrderSendRepository.sendOrder(id, user, logger),
    OrderSendRepository.sendOrder(id, user, logger),
  ]);
  expect(sent.filter((result) => result.success)).toHaveLength(1);
  expect((await add(1)).success).toBe(false);
  const { OrderCancelRepository } = await import("./[poId]/cancel/repository");
  const { OrderConfirmRepository } =
    await import("./[poId]/confirm/repository");
  const settled = await Promise.all([
    OrderCancelRepository.cancelOrder(id, user, logger),
    OrderConfirmRepository.confirmOrder(id, user, logger),
  ]);
  expect(settled.filter((result) => result.success)).toHaveLength(1);
});
