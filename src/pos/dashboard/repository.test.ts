import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { CompanyMemberRole } from "@/companies/enum";
import { PosOrderStatus, PosSessionStatus } from "../enum";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));
const user = crypto.randomUUID(),
  company = crypto.randomUUID(),
  other = crypto.randomUUID();
const logger = createEndpointLogger(false, defaultLocale);
beforeAll(async () => {
  await pg.exec(`
 create table companies(id uuid primary key, name text, currency text, is_active boolean);
 create table company_members(user_id uuid,company_id uuid,is_active boolean,role text);
 create table pos_terminals(id uuid primary key, company_id uuid,name text,location text,currency text,is_active boolean);
 create table pos_sessions(id uuid primary key,terminal_id uuid,status text);
 create table pos_orders(session_id uuid,currency text,status text,total numeric(12,4),updated_at timestamp,created_at timestamp,id uuid default gen_random_uuid());
 create table pos_refunds(id uuid primary key default gen_random_uuid(),order_id uuid,currency text,total numeric(12,4),created_at timestamp);
 `);
  await pg.query(
    "insert into companies values ($1,'Shop','EUR',true),($2,'Other','EUR',true)",
    [company, other],
  );
  await pg.query("insert into company_members values ($1,$2,true,$3)", [
    user,
    company,
    CompanyMemberRole.VIEWER,
  ]);
  for (const [companyId, currency, total] of [
    [company, "EUR", "7.2500"],
    [company, "USD", "15.1251"],
    [other, "EUR", "88.0000"],
  ]) {
    const shop = crypto.randomUUID(),
      session = crypto.randomUUID();
    await pg.query(
      "insert into pos_terminals values ($1,$2,'Till',null,$3,true)",
      [shop, companyId, currency],
    );
    await pg.query("insert into pos_sessions values ($1,$2,$3)", [
      session,
      shop,
      PosSessionStatus.CLOSED,
    ]);
    await pg.query(
      "insert into pos_orders values ($1,$2,$3,$4,current_timestamp,current_date-1),($1,$2,$3,99,current_date-1,current_date-1),($1,$2,$5,64,now(),now())",
      [
        session,
        currency,
        PosOrderStatus.COMPLETED,
        total,
        PosOrderStatus.VOIDED,
      ],
    );
  }
  // One refund today on a Shop EUR sale, one yesterday, one for the other company.
  await pg.query(`
    insert into pos_refunds(order_id,currency,total,created_at)
    select o.id, o.currency, 2.5, t.at
    from pos_orders o
    join pos_sessions s on s.id = o.session_id
    join pos_terminals p on p.id = s.terminal_id
    cross join (values (now()), (current_date - 1)) as t(at)
    where o.status = '${PosOrderStatus.COMPLETED}' and o.total = 7.25
    union all
    select o.id, o.currency, 9, now()
    from pos_orders o
    where o.total = 88`);
}, 30_000);
afterAll(() => pg.close());
test("today's completed sales include closed drawers and remain separate by company and currency", async () => {
  const { PosDashboardRepository } = await import("./repository");
  const result = await PosDashboardRepository.getDashboard(
    user,
    logger,
    defaultLocale,
    company,
  );
  expect(result.success).toBe(true);
  if (!result.success) return;
  expect(result.data).toMatchObject({
    todayOrderCount: 2,
    openSessionsCount: 0,
    currency: "EUR",
    todaySalesTotal: 7.25,
    refundsToday: { amount: 2.5, count: 1 },
    salesByCurrency: [
      { currency: "EUR", amount: 7.25 },
      { currency: "USD", amount: 15.1251 },
    ],
  });
  expect(
    (
      await PosDashboardRepository.getDashboard(
        user,
        logger,
        defaultLocale,
        other,
      )
    ).success,
  ).toBe(false);
});
