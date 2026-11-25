import { PGlite } from "@electric-sql/pglite";
import { beforeAll, afterAll, test, expect, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { CompanyMemberRole } from "@/companies/enum";
const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));
const company = crypto.randomUUID(),
  other = crypto.randomUUID(),
  actor = crypto.randomUUID(),
  a = crypto.randomUUID(),
  b = crypto.randomUUID(),
  foreign = crypto.randomUUID(),
  item = crypto.randomUUID(),
  otherItem = crypto.randomUUID();
const logger = createEndpointLogger(false, defaultLocale);
beforeAll(async () => {
  await pg.exec(`CREATE TABLE company_members(id uuid,company_id uuid,user_id uuid,role text,is_active boolean,invited_by_user_id uuid,joined_at timestamp,created_at timestamp,updated_at timestamp);
 CREATE TABLE companies(id uuid PRIMARY KEY,is_active boolean,currency text);
 CREATE TABLE warehouses(id uuid PRIMARY KEY,company_id uuid,is_active boolean,name text);
 CREATE TABLE catalog_products(id uuid PRIMARY KEY,company_id uuid,owner_user_id uuid,name text);
 CREATE TABLE stock_levels(id uuid PRIMARY KEY default gen_random_uuid(),warehouse_id uuid,product_id uuid,quantity_on_hand numeric,quantity_reserved numeric,quantity_on_order numeric default 0,reorder_point numeric,unit_cost numeric,updated_at timestamp default now());
 CREATE TABLE warehouse_transfers(id uuid PRIMARY KEY,company_id uuid,status text);
 INSERT INTO companies VALUES ('${company}',true,'EUR'),('${other}',true,'USD');
 INSERT INTO company_members(company_id,user_id,role,is_active) VALUES ('${company}','${actor}','${CompanyMemberRole.VIEWER}',true);
 INSERT INTO warehouses VALUES ('${a}','${company}',true,'Main'),('${b}','${company}',true,'Annex'),('${foreign}','${other}',true,'Outside');
 INSERT INTO catalog_products VALUES ('${item}','${company}',null,'Notebook'),('${otherItem}','${other}',null,'Outside product');
 INSERT INTO stock_levels(warehouse_id,product_id,quantity_on_hand,quantity_reserved,reorder_point,unit_cost) VALUES
 ('${a}','${item}',4.4,4.4,1,12.34),('${b}','${item}',8.2,2.1,2,12.34),('${a}','${otherItem}',1,1,null,3),('${foreign}','${otherItem}',10,0,null,15);
 `);
});
afterAll(() => pg.close());
test("stock list scopes warehouse, product names and currency and preserves decimal availability", async () => {
  const { InventoryStockListRepository } = await import("./repository");
  const read = (
    companyId?: string,
    warehouseId?: string,
  ): ReturnType<typeof InventoryStockListRepository.listStock> =>
    InventoryStockListRepository.listStock(
      { companyId, warehouseId, productId: undefined },
      actor,
      logger,
    );
  const result = await read(company);
  expect(result.success).toBe(true);
  if (!result.success) {
    return;
  }
  expect(result.data.stockLevels).toHaveLength(3);
  expect(
    result.data.stockLevels.find((row) => row.warehouseId === b),
  ).toMatchObject({
    productName: "Notebook",
    quantityAvailable: 6.1,
    stockValue: 101.188,
    currency: "EUR",
    isLowStock: false,
  });
  expect(
    result.data.stockLevels.find((row) => row.productId === otherItem)
      ?.productName,
  ).toBeNull();
  expect((await read(other)).success).toBe(false);
  expect((await read(company, foreign)).success).toBe(false);
  const all = await read();
  expect(all.success && all.data.stockLevels.length).toBe(3);
});
test("dashboard counts a product only once across warehouses and subtracts reservations", async () => {
  const { InventoryDashboardRepository } =
    await import("../../dashboard/repository");
  const result = await InventoryDashboardRepository.getDashboard(
    actor,
    { companyId: company },
    logger,
  );
  expect(result.success && result.data).toMatchObject({
    inStockCount: 1,
    outOfStockCount: 1,
    lowStockCount: 1,
    pendingTransferCount: 0,
    warehouseCount: 2,
  });
  expect(result.success && result.data.attention?.length).toBe(2);
});
