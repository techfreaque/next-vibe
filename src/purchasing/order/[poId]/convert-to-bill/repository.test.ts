import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { CompanyMemberRole } from "@/companies/enum";
import { BillStatus } from "@/payment/enum";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));
const company = crypto.randomUUID(),
  vendor = crypto.randomUUID(),
  user = crypto.randomUUID();
const logger = createEndpointLogger(false, defaultLocale);

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE company_members(id uuid,company_id uuid,user_id uuid,role text,is_active boolean,invited_by_user_id uuid,joined_at timestamp,created_at timestamp,updated_at timestamp);
    CREATE TABLE purchasing_vendors(id uuid PRIMARY KEY,company_id uuid,name text,vat_number text,default_payment_terms_days int);
    CREATE TABLE purchase_orders(id uuid PRIMARY KEY,company_id uuid,vendor_id uuid,po_number text,status text,currency text,bill_id uuid,subtotal numeric,tax_amount numeric,total numeric,updated_at timestamp);
    CREATE TABLE purchase_order_lines(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),po_id uuid,description text,product_id uuid,quantity numeric,unit_price numeric,tax_rate numeric,tax_amount numeric,line_total numeric,sort_order int);
    CREATE TABLE payment_bills(id uuid PRIMARY KEY,company_id uuid,supplier_name text,supplier_vat_number text,bill_number text,bill_date timestamp,due_date timestamp,currency text,status text,subtotal numeric,tax_amount numeric,total numeric,notes text,journal_entry_id uuid,paid_at timestamp,metadata jsonb,created_at timestamp,updated_at timestamp);
    CREATE TABLE payment_bill_lines(id uuid DEFAULT gen_random_uuid(),bill_id uuid,description text CHECK(description <> 'broken'), product_id uuid,expense_account_id uuid,quantity numeric,unit_price numeric,tax_rate numeric,tax_amount numeric,line_total numeric,sort_order int,created_at timestamp,updated_at timestamp);
    INSERT INTO company_members(company_id,user_id,role,is_active) VALUES ('${company}','${user}','${CompanyMemberRole.MEMBER}',true);
    INSERT INTO purchasing_vendors VALUES ('${vendor}','${company}','Office supply',null,14);
  `);
});
afterAll(() => pg.close());

async function order(
  status: string,
  currency: string,
  description = "Stock",
): Promise<string> {
  const id = crypto.randomUUID();
  await pg.query(
    "INSERT INTO purchase_orders VALUES ($1,$2,$3,'PO-17',$4,$5,null,100,23,123,now())",
    [id, company, vendor, status, currency],
  );
  await pg.query(
    "INSERT INTO purchase_order_lines(po_id,description,quantity,unit_price,tax_rate,tax_amount,line_total,sort_order) VALUES ($1,$2,2,50,0.23,23,123,0)",
    [id, description],
  );
  return id;
}
test("concurrent conversion creates one received bill, preserves agreed line amounts and supplier terms", async () => {
  const { OrderConvertToBillRepository } = await import("./repository");
  const id = await order("RECEIVED", "EUR");
  const convert = (): ReturnType<
    typeof OrderConvertToBillRepository.convertToBill
  > => OrderConvertToBillRepository.convertToBill(id, user, logger);
  const results = await Promise.all([convert(), convert()]);
  expect(results.filter((r) => r.success)).toHaveLength(1);
  const { rows } = await pg.query(
    `SELECT b.bill_number,b.status,b.journal_entry_id,b.total::text,l.tax_amount::text,extract(day from b.due_date-b.bill_date)::int AS days
    FROM purchase_orders o JOIN payment_bills b ON b.id=o.bill_id JOIN payment_bill_lines l ON l.bill_id=b.id WHERE o.id=$1`,
    [id],
  );
  expect(rows).toEqual([
    {
      bill_number: "PO-17",
      status: BillStatus.RECEIVED,
      journal_entry_id: null,
      total: "123",
      tax_amount: "23",
      days: 14,
    },
  ]);
});
test("rejects an unreceived order and unsupported currency, rolls back a failed line insert", async () => {
  const { OrderConvertToBillRepository } = await import("./repository");
  for (const id of [
    await order("DRAFT", "EUR"),
    await order("RECEIVED", "CZK"),
    await order("RECEIVED", "EUR", "broken"),
  ]) {
    const result = await OrderConvertToBillRepository.convertToBill(
      id,
      user,
      logger,
    );
    expect(result.success).toBe(false);
    const bills = await pg.query(
      "SELECT id FROM payment_bills WHERE metadata->>'purchaseOrderId'=$1",
      [id],
    );
    expect(bills.rows).toHaveLength(0);
    const po = await pg.query(
      "SELECT bill_id FROM purchase_orders WHERE id=$1",
      [id],
    );
    expect(po.rows).toEqual([{ bill_id: null }]);
  }
});
