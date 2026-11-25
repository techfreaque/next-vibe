import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { CompanyMemberRole } from "@/companies/enum";
import { BillStatus } from "@/payment/enum";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));
const company = crypto.randomUUID();
const other = crypto.randomUUID();
const viewer = crypto.randomUUID();
const vendor = crypto.randomUUID();
const order = crypto.randomUUID();
const openUsd = crypto.randomUUID();
const logger = createEndpointLogger(false, defaultLocale);

beforeAll(async () => {
  await pg.exec(`
    create table companies(id uuid primary key,is_active boolean,name text,currency text);
    create table company_members(id uuid,company_id uuid,user_id uuid,role text,is_active boolean,invited_by_user_id uuid,joined_at timestamp,created_at timestamp,updated_at timestamp);
    create table purchasing_vendors(id uuid,company_id uuid,name text,is_active boolean);
    create table purchase_orders(id uuid default gen_random_uuid(), company_id uuid, vendor_id uuid, po_number text, status text,currency text,expected_delivery_date timestamp,total numeric,created_at timestamp default now());
    create table purchase_order_lines(po_id uuid, quantity numeric,quantity_received numeric,line_total numeric);
    create table payment_bills(company_id uuid,status text,paid_at timestamp,currency text,total numeric);
    insert into companies values ('${company}',true,'Mill','PLN'),('${other}',true,'Other','EUR');
    insert into company_members(company_id,user_id,role,is_active) values ('${company}','${viewer}','${CompanyMemberRole.VIEWER}',true);
    insert into purchasing_vendors values ('${vendor}','${company}','Mill',true);
    insert into purchase_orders(id,company_id,vendor_id,po_number,status,currency,expected_delivery_date,total) values
      ('${order}','${company}','${vendor}','PO-1','PARTIALLY_RECEIVED','EUR',current_date,36.9),
      ('${openUsd}','${company}','${vendor}','PO-2','SENT','USD',current_date + 7,46);
    insert into purchase_orders(company_id,status,currency,expected_delivery_date,total) values
      ('${company}','DRAFT','EUR',current_date,1000),('${other}','CONFIRMED','EUR',current_date,9000);
    insert into purchase_order_lines values ('${order}',3,1,36.9),('${openUsd}',2,0,46);
    insert into payment_bills values ('${company}','${BillStatus.PAID}',now(),'EUR',11.19),('${company}','${BillStatus.APPROVED}',now(),'EUR',12),('${other}','${BillStatus.PAID}',now(),'EUR',100),('${company}','${BillStatus.PAID}',date_trunc('month',now())-interval '1 day','EUR',7);
  `);
});
afterAll(() => pg.close());

test("partial order value, settled bills and delivery dates stay within company, currency and UTC periods", async () => {
  const { PurchasingDashboardRepository } = await import("./repository");
  const result = await PurchasingDashboardRepository.getDashboard(
    viewer,
    { companyId: company },
    logger,
  );
  expect(result.success).toBe(true);
  if (!result.success) return;
  expect(result.data).toMatchObject({
    draftCount: 1,
    awaitingReceiptCount: 2,
    activeVendorCount: 1,
    dueThisWeekCount: 1,
    moneyByCurrency: [
      { currency: "EUR", openValue: 24.6, settledBills: 11.19 },
      { currency: "PLN", openValue: 0, settledBills: 0 },
      { currency: "USD", openValue: 46, settledBills: 0 },
    ],
  });
  expect(result.data.deliveries?.map((row) => row.number)).toEqual([
    "PO-1",
    "PO-2",
  ]);
  expect(result.data.deliveries?.[0].supplier).toBe("Mill");
  expect(
    (
      await PurchasingDashboardRepository.getDashboard(
        viewer,
        { companyId: other },
        logger,
      )
    ).success,
  ).toBe(false);
});
