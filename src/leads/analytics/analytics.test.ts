import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
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
      referral_code text, converted_user_id uuid, signed_up_at timestamp,
      geo_country text, metadata jsonb NOT NULL DEFAULT '{}'::jsonb
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
    CREATE TABLE signup_events (lead_id uuid, pending_id uuid, type text, occurred_at timestamp, dedupe_key text);
    CREATE TABLE pending_signups (id uuid PRIMARY KEY, lead_id uuid, expires_at timestamp);
    CREATE TABLE lead_engagements (lead_id uuid, engagement_type text, metadata jsonb, created_at timestamp);
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
    -- Visitor country from the IP differs from the locale region on purpose.
    UPDATE leads SET geo_country = 'BR' WHERE id = '${id(1)}';
    UPDATE leads SET geo_country = 'ZZ' WHERE id = '${id(2)}';
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
  // 12 scripts + Meta; the lead without a user agent is unknown, not a bot.
  expect(core.kpis.botLeads.value).toBe(13);
  expect(core.kpis.unknownLeads.value).toBe(1);
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

test("acquisition renders the response dimension in CLI and MCP breakdown headers", async () => {
  await import("next-vibe/platforms/cli/runtime/cli-widget-plugin");
  const { CliResultFormatter } = await import(
    "next-vibe/unified-ui/renderers/cli/response/result-formatter"
  );
  const { default: definition } = await import("./acquisition/definition");
  const { AcquisitionReportRepository } = await import(
    "./acquisition/repository"
  );
  const logger = createEndpointLogger(false, defaultLocale);
  const { t } = definition.GET.scopedTranslation.scopedT(defaultLocale);
  const window = {
    range: AnalyticsRange.CUSTOM,
    from: "2026-11-15",
    to: "2026-11-21",
  };

  const defaultReport = await AcquisitionReportRepository.getReport(
    definition.GET.requestSchema.parse(window),
    t,
    logger,
  );
  expect(defaultReport.success && defaultReport.data.dimensionUsed).toBe(
    LeadDimension.CHANNEL,
  );

  const report = await AcquisitionReportRepository.getReport(
    definition.GET.requestSchema.parse({
      ...window,
      dimension: LeadDimension.COUNTRY,
    }),
    t,
    logger,
  );
  expect(report.success).toBe(true);
  if (!report.success) {
    return;
  }
  const data = definition.GET.responseSchema.parse(report.data);
  expect(data.dimensionUsed).toBe(LeadDimension.COUNTRY);
  expect(data.breakdown.map((row) => row.key)).toContain("BR");

  for (const platform of [Platform.CLI, Platform.MCP]) {
    const output = await CliResultFormatter.renderWithEndpoint(
      data,
      definition.GET,
      defaultLocale,
      logger,
      { isPublic: true, leadId: id(1), roles: [] },
      platform,
    );
    expect(output).toMatch(/Visitor country\s*\|?\s*Leads/);
  }
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
  ).toBe(13);
  expect(
    await run(
      matchingLeadIdsSql({ createdFrom: "2026-11-15", createdTo: "2026-11-21", traffic: TrafficFilter.UNKNOWN }),
    ),
  ).toBe(1);
  expect(
    await run(
      matchingLeadIdsSql({ createdFrom: "2026-11-15", createdTo: "2026-11-21", traffic: TrafficFilter.NOT_BOTS }),
    ),
  ).toBe(3);
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
  // country = visitor country from the IP, localeCountry = chosen locale region
  expect(await run(matchingLeadIdsSql({ country: "br" }))).toBe(1);
  expect(await run(matchingLeadIdsSql({ country: "DE" }))).toBe(0);
  expect(await run(matchingLeadIdsSql({ localeCountry: "de" }))).toBe(1);
});

test("country breakdown uses the visitor country, locale region stays its own dimension", async () => {
  const { computeAcquisitionBreakdown } = await import(
    "./acquisition/repository"
  );
  const countries = await computeAcquisitionBreakdown(
    win,
    {},
    LeadDimension.COUNTRY,
  );
  const byCountry = new Map(countries.map((row) => [row.key, row.metrics.leads]));
  expect(byCountry.get("BR")).toBe(1);
  expect(byCountry.get("ZZ")).toBe(1);
  expect(byCountry.get("DE")).toBeUndefined();
  const locales = await computeAcquisitionBreakdown(
    win,
    {},
    LeadDimension.LOCALE_COUNTRY,
  );
  expect(new Map(locales.map((row) => [row.key, row.metrics.leads])).get("DE")).toBe(1);
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

/**
 * Production shape (2026-11-22): the lead-id middleware stored the user agent
 * and IP only in leads.metadata, the typed columns stayed NULL on every row.
 * Window Oct 1-7 (previous Sep 24-30) keeps these rows out of the tests above.
 */
const octWin = resolveAnalyticsWindow(
  { range: AnalyticsRange.CUSTOM, from: "2026-10-01", to: "2026-10-07" },
  now,
);

async function seedProductionShape(): Promise<void> {
  const chrome =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.0.0 Safari/537.36";
  const meta = "meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)";
  const lead = (n: number, at: string, ua: string | null, ip: string): string =>
    `('${id(n)}', '${at}', 'US', '', '${JSON.stringify({ anonymous: true, userAgent: ua, ipAddress: ip })}'::jsonb)`;
  await pg.exec(`
    INSERT INTO leads (id, created_at, country, business_name, metadata) VALUES
      ${lead(101, "2026-10-02 10:00:00", chrome, "198.51.100.7")},
      ${lead(102, "2026-10-02 11:00:00", chrome, "198.51.100.8")},
      ${lead(103, "2026-10-03 09:00:00", chrome, "198.51.100.9")},
      ${lead(104, "2026-10-03 09:30:00", chrome, "198.51.100.10")},
      ${lead(105, "2026-10-03 10:00:00", meta, "57.141.20.5")},
      ${lead(106, "2026-10-03 10:01:00", meta, "57.141.20.6")},
      ${lead(107, "2026-10-04 08:00:00", null, "192.0.2.1")},
      ${lead(108, "2026-10-05 08:00:00", chrome, "198.51.100.11")},
      ${lead(111, "2026-09-25 10:00:00", chrome, "198.51.100.20")},
      ${lead(112, "2026-09-25 10:00:00", meta, "57.141.20.7")},
      ${lead(113, "2026-09-26 10:00:00", meta, "57.141.20.8")};
    -- 904: one person on three devices (three leads), signed up and paid.
    INSERT INTO users VALUES ('${id(904)}', '2026-10-02 10:05:00', true);
    UPDATE leads SET converted_user_id = '${id(904)}' WHERE id IN ('${id(101)}', '${id(102)}', '${id(103)}');
    INSERT INTO payment_transactions (user_id, amount, currency, status, created_at)
      VALUES ('${id(904)}', 20, 'USD', '${PaymentStatus.SUCCEEDED}', '2026-10-02 12:00:00');
    -- 903: account from August that only logged in on a new device in October.
    -- Attaching it to that journey stamps signed_up_at, which is not a signup.
    INSERT INTO users VALUES ('${id(903)}', '2026-08-01 10:00:00', true);
    INSERT INTO growth_journeys (lead_id, user_id, first_channel, first_channel_type, first_touch_at, signed_up_at)
      VALUES ('${id(104)}', '${id(903)}', 'direct', 'enums.channelType.direct', '2026-10-03 09:30:00', '2026-10-03 09:31:00');
    -- 905: account with no lead at all (confirmation opened elsewhere).
    INSERT INTO users VALUES ('${id(905)}', '2026-10-04 12:00:00', false);
    -- Signup steps: backfill rows (failures only) before live tracking began
    -- on Oct 3, then one live signup that confirmed.
    INSERT INTO pending_signups VALUES ('${id(701)}', '${id(108)}', '2026-10-05 09:00:00');
    INSERT INTO signup_events VALUES
      ('${id(107)}', '${id(702)}', 'events.started', '2026-10-01 08:00:00', 'backfill-started:${id(702)}'),
      ('${id(107)}', '${id(702)}', 'events.expired', '2026-10-01 09:00:00', 'expired:${id(702)}:1'),
      ('${id(108)}', '${id(703)}', 'events.started', '2026-10-05 08:01:00', NULL),
      ('${id(108)}', '${id(703)}', 'events.emailSent', '2026-10-05 08:01:01', NULL),
      ('${id(108)}', '${id(703)}', 'events.confirmed', '2026-10-05 08:03:00', 'confirmed:${id(703)}');
    -- Conversion walls: one guest blocked twice (counts once), one account,
    -- one consent decline, and a website visit that is no wall.
    INSERT INTO lead_engagements VALUES
      ('${id(105)}', 'enums.engagementTypes.creditWall', '{"custom_who":"guest","custom_via":"client"}', '2026-10-03 11:00:00'),
      ('${id(105)}', 'enums.engagementTypes.creditWall', '{"custom_who":"guest","custom_via":"server"}', '2026-10-03 11:05:00'),
      ('${id(101)}', 'enums.engagementTypes.creditWall', '{"custom_who":"account"}', '2026-10-04 11:00:00'),
      ('${id(106)}', 'enums.engagementTypes.consentDeclined', '{"custom_who":"guest","custom_prompt":"send"}', '2026-10-04 12:00:00'),
      ('${id(106)}', 'enums.engagementTypes.websiteVisit', '{}', '2026-10-04 12:00:00');
  `);
}

test("metadata-only user agents: humans, bots and unknown with previous period", async () => {
  await seedProductionShape();
  const { computeAcquisitionCore, computeAcquisitionBreakdown } = await import(
    "./acquisition/repository"
  );
  const core = await computeAcquisitionCore(octWin, {});
  expect(core.kpis.humanLeads.value).toBe(5);
  expect(core.kpis.botLeads.value).toBe(2);
  expect(core.kpis.unknownLeads.value).toBe(1);
  expect(core.kpis.humanLeads.previous).toBe(1);
  expect(core.kpis.botLeads.previous).toBe(2);
  expect(core.kpis.unknownLeads.previous).toBe(0);
  // Account creation is the signup: 904 and the lead-less 905, not 903.
  expect(core.kpis.signups.value).toBe(2);
  expect(core.kpis.signups.previous).toBe(0);
  expect(core.kpis.payers.value).toBe(1);

  const agents = await computeAcquisitionBreakdown(
    octWin,
    {},
    LeadDimension.BOT_FAMILY,
  );
  const byKey = new Map(agents.map((row) => [row.key, row.metrics.leads]));
  expect(byKey.get(BotFamily.HUMAN)).toBe(5);
  expect(byKey.get(BotFamily.META)).toBe(2);
  expect(byKey.get(BotFamily.NO_UA)).toBe(1);

  const devices = await computeAcquisitionBreakdown(
    octWin,
    {},
    LeadDimension.DEVICE,
  );
  const deviceKeys = new Map(devices.map((row) => [row.key, row.metrics.leads]));
  expect(deviceKeys.get("leadAnalytics.device.desktop")).toBe(5);
  expect(deviceKeys.get("leadAnalytics.device.bot")).toBe(2);

  const { matchingLeadIdsSql } = await import("./segment-sql");
  const { db } = await import("next-vibe/database");
  const prefix = matchingLeadIdsSql({ ipPrefix: "57.141.20.0/24" });
  expect(prefix ? (await db.execute(prefix)).rows.length : -1).toBe(4);
});

test("funnel counts people once and tracked signup steps only", async () => {
  const { FunnelReportRepository } = await import("./funnel/repository");
  const { default: definition } = await import("./funnel/definition");
  const logger = createEndpointLogger(false, defaultLocale);
  const { t } = definition.GET.scopedTranslation.scopedT(defaultLocale);
  const result = await FunnelReportRepository.getReport(
    definition.GET.requestSchema.parse({
      range: AnalyticsRange.CUSTOM,
      from: "2026-10-01",
      to: "2026-10-07",
    }),
    t,
    logger,
  );
  expect(result.success).toBe(true);
  if (!result.success) {
    return;
  }
  const step = (key: string): number | undefined =>
    result.data.steps.find((entry) => entry.key === key)?.value;
  expect(step("leads")).toBe(8);
  expect(step("humans")).toBe(6);
  // Three leads of one paying account: one signup, one payer. The August
  // account logging in on a new device is not a conversion.
  expect(step("signups")).toBe(1);
  expect(step("payers")).toBe(1);
  const signup = (key: string): number | undefined =>
    result.data.signupSteps.find((entry) => entry.key === key)?.value;
  expect(signup("started")).toBe(1);
  expect(signup("confirmed")).toBe(1);
  expect(signup("expired")).toBe(0);
  expect(result.data.signupTrackedSince).toBe("2026-10-05");
  expect(result.data.previousSignupSteps).toBeNull();
  const wall = (key: string): number | undefined =>
    result.data.wallSteps.find((entry) => entry.key === key)?.value;
  expect(wall("creditWallGuests")).toBe(1);
  expect(wall("creditWallAccounts")).toBe(1);
  expect(wall("consentDeclined")).toBe(1);
  expect(result.data.wallTrackedSince).toBe("2026-10-03");
  expect(result.data.previousWallSteps).toBeNull();
});
