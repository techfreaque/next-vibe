/**
 * Referral analytics queries against the real DB with an isolated fixture:
 * one partner code, two leads (three clicks), two referred accounts, one payer
 * with two payments (USD + EUR), earnings in every status, payouts.
 */

import "server-only";

import { sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import { AnalyticsRange } from "next-vibe/unified-ui/analytics/enum";
import { resolveAnalyticsWindow } from "next-vibe/unified-ui/analytics/window";
import { createEndpointLogger } from "next-vibe/logger/server";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { getReferralOverview } from "./overview";
import {
  queryCodeMetrics,
  queryPayoutStates,
  querySeries,
  queryTotals,
} from "./queries";

const logger = createEndpointLogger(false, defaultLocale);
const stamp = Date.now();
const DOMAIN = `@ref-analytics-${stamp}.test`;
const CODE = `RefAn${stamp}`;
const TAG = `ref-analytics-${stamp}`;

let codeId = "";

async function cleanup(): Promise<void> {
  await db.execute(sql`DELETE FROM leads WHERE metadata->>'seed' = ${TAG}`);
  await db.execute(sql`DELETE FROM users WHERE email LIKE ${`%${DOMAIN}`}`);
}

describe("referral analytics queries", () => {
  beforeAll(async () => {
    await cleanup();
    const { rows } = await db.execute<{ owner: string; a: string; b: string; code: string }>(sql`
      WITH owner AS (
        INSERT INTO users (email, password, private_name, public_name, locale)
        VALUES (${`owner${DOMAIN}`}, 'x', 'Owner', 'Owner', 'en-US') RETURNING id
      ), a AS (
        INSERT INTO users (email, password, private_name, public_name, locale, created_at)
        VALUES (${`a${DOMAIN}`}, 'x', 'A', 'A', 'en-US', now() - interval '3 days') RETURNING id
      ), b AS (
        INSERT INTO users (email, password, private_name, public_name, locale, created_at)
        VALUES (${`b${DOMAIN}`}, 'x', 'B', 'B', 'en-US', now() - interval '2 days') RETURNING id
      ), code AS (
        INSERT INTO referral_codes (code, owner_user_id, label)
        SELECT ${CODE}, id, 'Test label' FROM owner RETURNING id
      )
      SELECT (SELECT id FROM owner) AS owner, (SELECT id FROM a) AS a,
        (SELECT id FROM b) AS b, (SELECT id FROM code) AS code
    `);
    const ids = rows[0];
    if (!ids) {
      return;
    }
    codeId = ids.code;
    await db.execute(sql`
      WITH l1 AS (
        INSERT INTO leads (business_name, country, language, source, metadata, created_at)
        VALUES ('', 'US', 'en', 'enums.leadSource.website', ${JSON.stringify({ seed: TAG })}::jsonb, now() - interval '4 days')
        RETURNING id
      ), l2 AS (
        INSERT INTO leads (business_name, country, language, source, metadata, created_at)
        VALUES ('', 'US', 'en', 'enums.leadSource.website', ${JSON.stringify({ seed: TAG })}::jsonb, now() - interval '4 days')
        RETURNING id
      ), visits AS (
        INSERT INTO growth_visits (lead_id, visited_at, ref_code)
        SELECT id, now() - interval '4 days', lower(${CODE}) FROM l1
        UNION ALL SELECT id, now() - interval '4 days' + interval '1 hour', ${CODE} FROM l1
        UNION ALL SELECT id, now() - interval '4 days', ${CODE} FROM l2
        RETURNING 1
      ), credited AS (
        INSERT INTO lead_referrals (referral_code_id, lead_id, created_at)
        SELECT ${codeId}::uuid, id, now() - interval '4 days' FROM l1
        UNION ALL SELECT ${codeId}::uuid, id, now() - interval '4 days' FROM l2
        RETURNING 1
      )
      SELECT (SELECT count(*) FROM visits), (SELECT count(*) FROM credited)
    `);
    await db.execute(sql`
      INSERT INTO user_referrals (referrer_user_id, referred_user_id, referral_code_id, created_at) VALUES
        (${ids.owner}, ${ids.a}, ${codeId}, now() - interval '3 days'),
        (${ids.owner}, ${ids.b}, ${codeId}, now() - interval '2 days')
    `);
    await db.execute(sql`
      WITH p1 AS (
        INSERT INTO payment_transactions (user_id, amount, currency, status, created_at)
        VALUES (${ids.a}, 8.00, 'USD', 'enums.paymentStatus.succeeded', now() - interval '2 days') RETURNING id
      ), p2 AS (
        INSERT INTO payment_transactions (user_id, amount, currency, status, created_at)
        VALUES (${ids.a}, 10.00, 'EUR', 'enums.paymentStatus.succeeded', now() - interval '1 day') RETURNING id
      ), p3 AS (
        INSERT INTO payment_transactions (user_id, amount, currency, status, created_at)
        VALUES (${ids.b}, 8.00, 'USD', 'enums.paymentStatus.failed', now() - interval '1 day') RETURNING id
      )
      INSERT INTO referral_earnings (earner_user_id, source_user_id, transaction_id, level, amount_cents, currency, status, created_at)
      SELECT ${ids.owner}::uuid, ${ids.a}::uuid, id, 0, 80, 'CREDITS', 'enums.earningStatus.confirmed', now() - interval '2 days' FROM p1
      UNION ALL SELECT ${ids.owner}::uuid, ${ids.a}::uuid, id, 0, 108, 'CREDITS', 'enums.earningStatus.pending', now() - interval '1 day' FROM p2
      UNION ALL SELECT ${ids.owner}::uuid, ${ids.a}::uuid, id, 1, 54, 'CREDITS', 'enums.earningStatus.canceled', now() - interval '1 day' FROM p2
    `);
    await db.execute(sql`
      INSERT INTO payout_requests (user_id, amount_cents, currency, status, processed_at, created_at) VALUES
        (${ids.owner}, 4000, 'enums.payoutCurrency.usdc', 'enums.payoutStatus.completed', now() - interval '1 day', now() - interval '2 days'),
        (${ids.owner}, 4100, 'enums.payoutCurrency.btc', 'enums.payoutStatus.pending', NULL, now() - interval '1 hour')
    `);
  });

  afterAll(cleanup);

  const win = resolveAnalyticsWindow({ range: AnalyticsRange.LAST_7_DAYS });
  const range = { from: win.from, to: win.to };

  it("counts every metric per code", async () => {
    const [row] = await queryCodeMetrics({ codeId }, range);
    expect(row?.code).toBe(CODE);
    expect(row?.clicks).toBe(3);
    expect(row?.leads).toBe(2);
    expect(row?.signups).toBe(2);
    expect(row?.payers).toBe(1);
    // 800 USD cents + 10 EUR * 1.08 = 1880
    expect(row?.revenueCents).toBe(1880);
    expect(row?.commissionCents).toBe(188);
    expect(row?.pendingCents).toBe(108);
    expect(row?.confirmedCents).toBe(80);
    expect(row?.ownerPaidCents).toBe(4000);
  });

  it("matches the per-code row in the totals and ignores other windows", async () => {
    const totals = await queryTotals({ codeId }, range);
    expect(totals).toMatchObject({
      clicks: 3,
      leads: 2,
      signups: 2,
      payers: 1,
      revenueCents: 1880,
      commissionCents: 188,
      canceledCents: 54,
      payoutsPaidCents: 4000,
    });
    const old = await queryTotals(
      { codeId },
      { from: new Date("2020-01-01"), to: new Date("2020-02-01") },
    );
    expect(old.clicks + old.signups + old.revenueCents).toBe(0);
  });

  it("buckets the series", async () => {
    const series = await querySeries({ codeId }, range, "day");
    expect(series.clicks.reduce((s, r) => s + r.value, 0)).toBe(3);
    expect(series.revenue.reduce((s, r) => s + r.value, 0)).toBeCloseTo(18.8);
    expect(series.commission.reduce((s, r) => s + r.value, 0)).toBeCloseTo(1.88);
  });

  it("reports payout states for the scope", async () => {
    const states = await queryPayoutStates({ codeId });
    expect(states).toHaveLength(2);
  });

  it("filters by search on code, label and owner email", async () => {
    expect(await queryCodeMetrics({ search: CODE.toLowerCase() }, range)).toHaveLength(1);
    expect(await queryCodeMetrics({ search: `owner${DOMAIN}` }, range)).toHaveLength(1);
    expect(await queryCodeMetrics({ search: `${CODE}-none` }, range)).toHaveLength(0);
  });

  it("exposes the business overview contract", async () => {
    const result = await getReferralOverview(win, logger, { codeId });
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data.kpis.revenueUsd.value).toBeCloseTo(18.8);
    expect(result.data.kpis.clicks.previous).toBe(0);
    expect(result.data.pendingPayouts).toEqual({ count: 1, amountUsd: 41 });
    expect(result.data.topCodes[0]?.key).toBe(CODE);
  });
});
