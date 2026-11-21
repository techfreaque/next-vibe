import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { AnalyticsRange } from "next-vibe/unified-ui/analytics/enum";
import { resolveAnalyticsWindow } from "next-vibe/unified-ui/analytics/window";

import { CreditTransactionType } from "@/credits/enum";
import { PaymentStatus } from "@/payment/enum";

import {
  AbuseGroupBy,
  BotFamily,
  FunnelReach,
  LeadChannelFilter,
  LeadDimension,
  NONE_FILTER_VALUE,
  TrafficFilter,
} from "./enum";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));

const now = new Date("2026-11-21T12:00:00Z");
const win = resolveAnalyticsWindow(
  { range: AnalyticsRange.LAST_7_DAYS },
  now,
);

const id = (n: number): string =>
  `00000000-0000-4000-8000-${n.toString().padStart(12, "0")}`;

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE leads (
      id uuid PRIMARY KEY, created_at timestamp, country text, email text, business_name text,
      device_type text, browser text, os text, ip_address text, user_agent text,
      referral_code text, converted_user_id uuid, signed_up_at timestamp
    );
    CREATE TABLE users (id uuid PRIMARY KEY, created_at timestamp, email_verified boolean);
    CREATE TABLE growth_journeys (
      lead_id uuid PRIMARY KEY, user_id uuid, first_channel text, first_channel_type text,
      first_source text, first_medium text, first_campaign text, first_referrer_host text,
      first_landing_path text, first_ref_code text, first_touch_at timestamp,
      signed_up_at timestamp, first_chat_at timestamp, first_paid_at timestamp
    );
    CREATE TABLE growth_visits (id serial, lead_id uuid, visited_at timestamp);
    CREATE TABLE chat_threads (id serial, lead_id uuid, user_id uuid, created_at timestamp);
    CREATE TABLE payment_transactions (user_id uuid, amount numeric, currency text, status text, mode text DEFAULT 'enums.checkoutMode.subscription', created_at timestamp);
    CREATE TABLE credit_wallets (id uuid PRIMARY KEY, lead_id uuid, user_id uuid);
    CREATE TABLE credit_transactions (wallet_id uuid, type text, metadata jsonb, created_at timestamp);
    CREATE TABLE user_lead_links (lead_id uuid, user_id uuid);
    CREATE TABLE user_roles (user_id uuid, role text);
  `);
  const day = "2026-11-19 10:00:00";
  // 1: human via google, signed up + verified + paid
  // 2: human direct, chatted only, burned free credits
  // 3-14: python-requests burst from 203.0.113.0/24
  // 15: Meta crawler, 16: no UA, 17: Googlebot (old, previous window)
  await pg.exec(`
    INSERT INTO users VALUES ('${id(901)}', '${day}', true);
    INSERT INTO leads VALUES
      ('${id(1)}', '${day}', 'DE', 'a@x.test', 'a', 'enums.deviceType.desktop', 'Chrome', 'Windows', '81.2.3.4',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/142.0 Safari/537.36', NULL, '${id(901)}', '${day}'),
      ('${id(2)}', '${day}', 'US', NULL, 'b', 'enums.deviceType.mobile', 'Safari', 'iOS', '2001:db8:42:1::5',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) Safari/604.1', NULL, NULL, NULL),
      ('${id(15)}', '${day}', 'US', NULL, 'm', 'enums.deviceType.bot', NULL, NULL, '31.13.1.1',
        'facebookexternalhit/1.1', NULL, NULL, NULL),
      ('${id(16)}', '${day}', 'US', NULL, 'n', NULL, NULL, NULL, 'not-an-ip', NULL, NULL, NULL, NULL),
      ('${id(17)}', '2026-11-10 10:00:00', 'US', NULL, 'g', 'enums.deviceType.bot', NULL, NULL, '66.249.1.1',
        'Mozilla/5.0 (compatible; Googlebot/2.1)', NULL, NULL, NULL);
    INSERT INTO leads (id, created_at, country, business_name, ip_address, user_agent)
      SELECT ('00000000-0000-4000-8000-' || lpad(g::text, 12, '0'))::uuid, '2026-11-20 01:00:00'::timestamp + g * interval '1 minute',
        'US', 'burst', '203.0.113.' || g, 'python-requests/2.32.3'
      FROM generate_series(3, 14) g;
    INSERT INTO growth_journeys VALUES
      ('${id(1)}', '${id(901)}', 'google.com', 'enums.channelType.organic', NULL, NULL, NULL, 'google.com',
        '/en-US/story', NULL, '${day}', '${day}', '${day}', '2026-11-19 12:00:00'),
      ('${id(2)}', NULL, 'direct', 'enums.channelType.direct', NULL, NULL, NULL, NULL,
        '/en-US', NULL, '${day}', NULL, '${day}', NULL);
    INSERT INTO growth_visits (lead_id, visited_at) VALUES
      ('${id(1)}', '${day}'), ('${id(1)}', '2026-11-20 10:00:00'), ('${id(2)}', '${day}');
    INSERT INTO payment_transactions (user_id, amount, currency, status, created_at) VALUES ('${id(901)}', 8, 'USD', '${PaymentStatus.SUCCEEDED}', '2026-11-19 12:00:00');
    INSERT INTO credit_wallets VALUES ('${id(801)}', '${id(2)}', NULL);
    INSERT INTO credit_transactions VALUES
      ('${id(801)}', '${CreditTransactionType.USAGE}', '{"freeCreditsUsed": 1.5, "actorLeadId": "${id(2)}"}', '${day}'),
      ('${id(801)}', '${CreditTransactionType.USAGE}', '{"freeCreditsUsed": 0.5}', '${day}');
  `);
});

afterAll(async () => {
  await pg.close();
});

test("acquisition core counts humans, bots and funnel events in the window", async () => {
  const { computeAcquisitionCore } = await import("./acquisition/repository");
  const core = await computeAcquisitionCore(win, {});
  expect(core.kpis.humanLeads.value).toBe(2);
  expect(core.kpis.botLeads.value).toBe(14);
  expect(core.kpis.botLeads.previous).toBe(1);
  expect(core.kpis.visits.value).toBe(3);
  expect(core.kpis.visitors.value).toBe(2);
  expect(core.kpis.signups.value).toBe(1);
  expect(core.kpis.firstChats.value).toBe(2);
  expect(core.kpis.payers.value).toBe(1);
  const sum = (key: string): number =>
    (core.trend.series.find((entry) => entry.key === key)?.values ?? []).reduce(
      (total, value) => total + value,
      0,
    );
  expect(sum("humanLeads")).toBe(core.kpis.humanLeads.value);
  expect(sum("botLeads")).toBe(core.kpis.botLeads.value);
  expect(sum("signups")).toBe(core.kpis.signups.value);
  expect(sum("payers")).toBe(core.kpis.payers.value);
  expect(sum("visits")).toBe(core.kpis.visits.value);
  expect(core.kpis.humanVisits.value + core.kpis.botVisits.value).toBe(
    core.kpis.visits.value,
  );

  const humans = await computeAcquisitionCore(win, {
    traffic: TrafficFilter.HUMANS,
    channelType: LeadChannelFilter.ORGANIC,
  });
  expect(humans.kpis.humanLeads.value).toBe(1);
  expect(humans.kpis.botLeads.value).toBe(0);
});

test("breakdowns use filter-ready keys and classify bot families", async () => {
  const { computeAcquisitionBreakdown } = await import(
    "./acquisition/repository"
  );
  const channels = await computeAcquisitionBreakdown(
    win,
    {},
    LeadDimension.CHANNEL_TYPE,
  );
  const keys = channels.map((row) => row.key);
  expect(keys).toContain(LeadChannelFilter.UNATTRIBUTED);
  expect(keys).toContain(LeadChannelFilter.ORGANIC);
  const organic = channels.find((row) => row.key === LeadChannelFilter.ORGANIC);
  expect(organic?.metrics.revenueUsd).toBe(8);

  const agents = await computeAcquisitionBreakdown(
    win,
    {},
    LeadDimension.BOT_FAMILY,
  );
  const byKey = new Map(agents.map((row) => [row.key, row.metrics.leads]));
  expect(byKey.get(BotFamily.AUTOMATION)).toBe(12);
  expect(byKey.get(BotFamily.META)).toBe(1);
  expect(byKey.get(BotFamily.NO_UA)).toBe(1);
  expect(byKey.get(BotFamily.HUMAN)).toBe(2);

  const noSource = await computeAcquisitionBreakdown(
    win,
    { source: NONE_FILTER_VALUE },
    LeadDimension.SOURCE,
  );
  expect(noSource[0]?.metrics.leads).toBe(16);
});

test("abuse report flags the /24 burst and non-user free-credit burn", async () => {
  const { computeFlaggedSummary } = await import("./abuse/repository");
  const summary = await computeFlaggedSummary(
    win,
    {},
    AbuseGroupBy.IP_PREFIX,
    10,
  );
  expect(summary.flaggedClusters.value).toBe(1);
  expect(summary.topKey).toBe("203.0.113.0/24");
  expect(summary.topLeads).toBe(12);
});

test("list drill-down ids match the report filters", async () => {
  const { matchingLeadIdsSql } = await import("./segment-sql");
  const { db } = await import("next-vibe/database");
  const run = async (sqlQuery: ReturnType<typeof matchingLeadIdsSql>): Promise<number> => {
    if (!sqlQuery) {
      return -1;
    }
    const { rows } = await db.execute(sqlQuery);
    return rows.length;
  };
  expect(
    await run(
      matchingLeadIdsSql({ createdFrom: "2026-11-15", createdTo: "2026-11-21", traffic: TrafficFilter.BOTS }),
    ),
  ).toBe(14);
  expect(await run(matchingLeadIdsSql({ ipPrefix: "203.0.113.0/24" }))).toBe(12);
  expect(await run(matchingLeadIdsSql({ ipPrefix: "2001:db8:42::/48" }))).toBe(1);
  expect(
    await run(
      matchingLeadIdsSql({ reached: FunnelReach.PAID, reachedFrom: "2026-11-19", reachedTo: "2026-11-19" }),
    ),
  ).toBe(1);
  expect(
    await run(
      matchingLeadIdsSql({ reached: FunnelReach.VISITED, reachedFrom: "2026-11-20", reachedTo: "2026-11-20" }),
    ),
  ).toBe(1);
  expect(matchingLeadIdsSql({})).toBeNull();
});

test("overview topSources reconcile with the overview totals", async () => {
  const { getAcquisitionOverview } = await import("./overview");
  const logger = createEndpointLogger(false, defaultLocale);
  const { computeAcquisitionCore } = await import("./acquisition/repository");
  const core = await computeAcquisitionCore(win, {});
  const result = await getAcquisitionOverview(
    win,
    logger,
    defaultLocale,
  );
  expect(result.success).toBe(true);
  if (!result.success) {
    return;
  }
  const total = (metric: string): number =>
    result.data.topSources.reduce(
      (sum, row) => sum + (row.metrics[metric] ?? 0),
      0,
    );
  expect(total("leads")).toBe(core.kpis.humanLeads.value);
  expect(total("signups")).toBe(core.kpis.signups.value);
  expect(total("payers")).toBe(1);
  expect(total("revenueUsd")).toBe(8);
});
