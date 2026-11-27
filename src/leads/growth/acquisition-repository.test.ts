import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { GraphResolution } from "next-vibe/dataflow/enum";

import { PaymentStatus } from "@/payment/enum";

import { AcquisitionMetric, AcquisitionSource } from "./acquisition";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));

const visitor = "45c83992-bbe4-496a-82a0-2d84e837e001";
const converted = "45c83992-bbe4-496a-82a0-2d84e837e002";
const search = "45c83992-bbe4-496a-82a0-2d84e837e003";
const account = "45c83992-bbe4-496a-82a0-2d84e837e004";
const owner = "45c83992-bbe4-496a-82a0-2d84e837e005";
const codeId = "45c83992-bbe4-496a-82a0-2d84e837e006";
const range = {
  from: new Date("2026-11-10T00:00:00Z"),
  to: new Date("2026-11-12T23:59:59Z"),
};

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE leads (
      id uuid PRIMARY KEY, created_at timestamp, signed_up_at timestamp,
      converted_user_id uuid, referral_code text, metadata jsonb,
      is_bot boolean NOT NULL DEFAULT false
    );
    CREATE TABLE users (id uuid PRIMARY KEY, created_at timestamp, creator_slug text);
    CREATE TABLE growth_journeys (
      lead_id uuid PRIMARY KEY, user_id uuid, first_chat_at timestamp,
      first_landing_path text, first_touch_at timestamp, first_source text, first_medium text,
      first_campaign text, first_referrer_host text, first_ref_code text,
      last_landing_path text, last_touch_at timestamp, last_source text, last_medium text,
      last_campaign text, last_referrer_host text, last_ref_code text
    );
    CREATE TABLE user_lead_links (lead_id uuid, user_id uuid, link_reason text, linked_at timestamp);
    CREATE TABLE referral_codes (id uuid PRIMARY KEY, code text UNIQUE, owner_user_id uuid);
    CREATE TABLE user_referrals (referred_user_id uuid, referral_code_id uuid, created_at timestamp);
    CREATE TABLE lead_referrals (id uuid PRIMARY KEY, lead_id uuid, referral_code_id uuid, created_at timestamp);
    CREATE TABLE chat_threads (id uuid PRIMARY KEY, user_id uuid, lead_id uuid);
    CREATE TABLE chat_messages (thread_id uuid, role text, is_ai boolean, created_at timestamp, author_id text);
    CREATE TABLE custom_skills (user_id uuid);
    CREATE TABLE payment_transactions (user_id uuid, currency text, amount numeric, status text, created_at timestamp);
  `);
  await pg.query(`
    INSERT INTO leads VALUES
      ($1, '2026-11-10', null, null, null, null),
      ($2, '2026-11-10', '2026-11-11', $4, null, null),
      ($3, '2026-11-10', null, null, null, '{"createdFromTracking":true,"referer":"https://www.google.at/search?q=private","userAgent":"Mozilla/5.0"}');
  `, [visitor, converted, search, account]);
  await pg.query(`
    INSERT INTO users VALUES ($1, '2026-11-11', null), ($2, '2026-10-01', 'sample-creator')
  `, [account, owner]);
  await pg.query(`
    INSERT INTO referral_codes VALUES ($1, 'CREATOR', $2)
  `, [codeId, owner]);
  await pg.query(`
    INSERT INTO growth_journeys
      (lead_id, first_landing_path, first_touch_at, first_ref_code, first_source, first_medium, first_campaign)
      VALUES ($1, '/story', '2026-11-10', 'CREATOR', 'reddit', 'social', 'Launch')
  `, [visitor]);
  await pg.query(`
    INSERT INTO growth_journeys (lead_id, user_id, first_touch_at, first_chat_at)
      VALUES ($1, $2, '2026-11-11', NULL)
  `, [converted, account]);
  await pg.query("INSERT INTO chat_threads VALUES ($1, $2, NULL)", [converted, account]);
  await pg.query(
    "INSERT INTO chat_messages VALUES ($1, 'user', false, '2026-11-11', $2)",
    [converted, account],
  );
  await pg.query("INSERT INTO user_referrals VALUES ($1, $2, '2026-11-11')", [account, codeId]);
  const migration = await Bun.file(
    "drizzle/20261120011649_curious_vindicator.sql",
  ).text();
  await pg.exec(migration);
  await pg.query(`
    INSERT INTO growth_visits (lead_id, visited_at, source, medium, campaign, ref_code)
      VALUES ($1, '2026-11-12', 'reddit', 'social', 'Launch', 'CREATOR')
  `, [visitor]);
  await pg.query(`
    INSERT INTO payment_transactions VALUES
      ($1, 'EUR', 12, $2, '2026-11-11'),
      ($1, 'USD', 20, $2, '2026-11-12'),
      ($1, 'EUR', 99, $3, '2026-11-12')
  `, [account, PaymentStatus.SUCCEEDED, PaymentStatus.FAILED]);
});

afterAll(async () => {
  await pg.close();
});

test("keeps measured referral visits, signup credit and paid activity separate", async () => {
  const { AcquisitionRepository } = await import("./acquisition-repository");
  const report = await AcquisitionRepository.summary({
    range,
    filters: { refCode: "CREATOR", sourceType: AcquisitionSource.CREATOR },
    currency: "EUR",
    page: 1,
  });
  expect(report.rows).toHaveLength(2);
  expect(report.totals).toMatchObject({
    visits: 2, leads: 2, signups: 1, firstChats: 1, payers: 1, revenue: 12,
  });
  expect(report.rows[0]).toMatchObject({
    source: "reddit", medium: "social", campaign: "Launch",
    visits: 2, leads: 1, signups: 0, payers: 0, revenue: 0,
  });
  expect(report.rows[1]).toMatchObject({
    source: null, visits: 0, leads: 1, signups: 1,
    firstChats: 1, payers: 1, revenue: 12,
  });
  const matching = await pg.query<{ id: string }>(
    "SELECT id FROM growth_visits WHERE referrer_host = 'google.at'",
  );
  expect(matching.rows).toHaveLength(1);
  const searchReport = await AcquisitionRepository.summary({
    range,
    filters: { sourceType: AcquisitionSource.SEARCH, referrerHost: "www.google.at" },
    currency: "EUR",
    page: 1,
  });
  expect(searchReport.rows[0]).toMatchObject({ visits: 1, leads: 1, referrerHost: "google.at" });
  const referralTotals = await AcquisitionRepository.referralCodeSummary(["CREATOR"], "USD");
  expect(referralTotals.get("CREATOR")).toMatchObject({
    visits: 2, leads: 2, firstChats: 1, payers: 1, revenue: 20,
  });
  const breakdown = await AcquisitionRepository.leadDetails([converted, search], "USD");
  expect(breakdown.get(converted)).toMatchObject({ visits: 0, signups: 1, payers: 1, revenue: 20, currency: "USD" });
  expect(breakdown.get(search)).toMatchObject({ sourceType: AcquisitionSource.SEARCH, visits: 1 });
  for (const [metric, total] of [
    [AcquisitionMetric.VISITS, 2],
    [AcquisitionMetric.SIGNUPS, 1],
    [AcquisitionMetric.PAYERS, 1],
    [AcquisitionMetric.REVENUE, 12],
  ] as const) {
    const series = await AcquisitionRepository.series({
      range,
      resolution: GraphResolution.ONE_DAY,
      filters: { refCode: "CREATOR" },
      currency: "EUR",
      metric,
    });
    expect(series.reduce((sum, point) => sum + point.value, 0)).toBe(total);
  }
});

test("per-source split adds up to the unfiltered series", async () => {
  const { AcquisitionRepository } = await import("./acquisition-repository");
  for (const metric of [
    AcquisitionMetric.VISITS,
    AcquisitionMetric.SIGNUPS,
    AcquisitionMetric.PAYERS,
  ]) {
    const total = await AcquisitionRepository.series({
      range,
      resolution: GraphResolution.ONE_DAY,
      filters: {},
      currency: "EUR",
      metric,
    });
    const rows = await AcquisitionRepository.seriesBySource({
      range,
      resolution: GraphResolution.ONE_DAY,
      currency: "EUR",
      metric,
    });
    expect(rows.reduce((sum, row) => sum + Number(row.value), 0)).toBe(
      total.reduce((sum, point) => sum + point.value, 0),
    );
  }
  const signups = await AcquisitionRepository.seriesBySource({
    range,
    resolution: GraphResolution.ONE_DAY,
    currency: "EUR",
    metric: AcquisitionMetric.SIGNUPS,
  });
  expect(signups).toEqual([
    expect.objectContaining({ sourceType: AcquisitionSource.CREATOR, value: 1 }),
  ]);
});

test("cohort conversion counts each first visit and excludes signup-only referral credit", async () => {
  const { QueryReferralsConversionRateRepository } =
    await import("@/referral/data-sources/referrals-conversion-rate/repository");
  const { QueryReferralsLeadClicksRepository } =
    await import("@/referral/data-sources/referrals-lead-clicks/repository");
  const period = { range, resolution: GraphResolution.ONE_DAY };
  const clicks = await QueryReferralsLeadClicksRepository.queryReferralsLeadClicks(period);
  const conversion = await QueryReferralsConversionRateRepository.queryReferralsConversionRate(period);
  expect(clicks.success && clicks.data.result.reduce((sum, point) => sum + point.value, 0)).toBe(2);
  expect(conversion.success && conversion.data.result.every((point) => point.value === 0)).toBe(true);
});

test("excludes is_bot flagged crawler leads and their visits from growth stats and referral clicks", async () => {
  const botLead = "45c83992-bbe4-496a-82a0-2d84e837e099";
  await pg.query(
    `INSERT INTO leads (id, created_at, referral_code, metadata, is_bot)
     VALUES ($1, '2026-11-11', 'CREATOR', '{"userAgent":"Googlebot/2.1"}'::jsonb, true)`,
    [botLead],
  );
  await pg.query(
    `INSERT INTO growth_visits (lead_id, visited_at, source, medium, campaign, ref_code)
     VALUES ($1, '2026-11-11', 'reddit', 'social', 'Launch', 'CREATOR')`,
    [botLead],
  );
  await pg.query(
    `INSERT INTO lead_referrals (id, lead_id, referral_code_id, created_at)
     VALUES ('45c83992-bbe4-496a-82a0-2d84e837e098', $1, $2, '2026-11-11')`,
    [botLead, codeId],
  );

  const { AcquisitionRepository } = await import("./acquisition-repository");
  const report = await AcquisitionRepository.summary({
    range,
    filters: { refCode: "CREATOR", sourceType: AcquisitionSource.CREATOR },
    currency: "EUR",
    page: 1,
  });
  expect(report.totals).toMatchObject({
    visits: 2,
    leads: 2,
    signups: 1,
    firstChats: 1,
    payers: 1,
    revenue: 12,
  });

  const referralTotals = await AcquisitionRepository.referralCodeSummary(
    ["CREATOR"],
    "USD",
  );
  expect(referralTotals.get("CREATOR")).toMatchObject({
    visits: 2,
    leads: 2,
  });

  const { QueryReferralsLeadClicksRepository } =
    await import("@/referral/data-sources/referrals-lead-clicks/repository");
  const clicks =
    await QueryReferralsLeadClicksRepository.queryReferralsLeadClicks({
      range,
      resolution: GraphResolution.ONE_DAY,
    });
  expect(
    clicks.success &&
      clicks.data.result.reduce((sum, point) => sum + point.value, 0),
  ).toBe(2);

  // Put both first visits in the same bucket and credit the human visit.
  await pg.query(
    "UPDATE growth_visits SET visited_at = '2026-11-10' WHERE lead_id = $1",
    [botLead],
  );
  await pg.query("UPDATE growth_journeys SET user_id = NULL WHERE lead_id = $1", [converted]);
  await pg.query("UPDATE growth_journeys SET user_id = $1 WHERE lead_id = $2", [account, visitor]);
  const { QueryReferralsConversionRateRepository } =
    await import("@/referral/data-sources/referrals-conversion-rate/repository");
  const conversion =
    await QueryReferralsConversionRateRepository.queryReferralsConversionRate({
      range,
      resolution: GraphResolution.ONE_DAY,
    });
  expect(conversion.success && conversion.data.result[0]?.value).toBe(100);

  // Explicit leadDetails lookup still inspects a flagged lead when requested by ID
  const details = await AcquisitionRepository.leadDetails([botLead], "USD");
  expect(details.get(botLead)).toMatchObject({ visits: 1 });
});

test("prefers journeys, then the earliest signup link, then the earliest legacy conversion", async () => {
  const ids = Array.from(
    { length: 10 },
    (_, index) => `45c83992-bbe4-496a-82a0-2d84e837e${index + 100}`,
  );
  const [
    journeyUser, linkedUser, legacyUser, journeyLead, otherJourneyLead,
    earliestLink, laterLink, linkedLegacy, earliestLegacy, laterLegacy,
  ] = ids;
  await pg.query(
    `INSERT INTO users (id, created_at)
     VALUES ($1, '2026-09-01'), ($2, '2026-09-01'), ($3, '2026-09-01')`,
    [journeyUser, linkedUser, legacyUser],
  );
  await pg.query(
    `INSERT INTO leads (id, created_at, signed_up_at, converted_user_id)
     VALUES ($1, '2026-09-01', null, null),
            ($2, '2026-09-01', null, null),
            ($3, '2026-09-01', null, null),
            ($4, '2026-09-01', null, null),
            ($5, '2026-09-01', '2026-09-02', $8),
            ($6, '2026-09-01', '2026-09-02', $9),
            ($7, '2026-09-02', '2026-09-02', $9)`,
    [journeyLead, otherJourneyLead, earliestLink, laterLink, linkedLegacy,
      earliestLegacy, laterLegacy, linkedUser, legacyUser],
  );
  await pg.query(
    "INSERT INTO growth_journeys (lead_id, user_id) VALUES ($1, $2)",
    [journeyLead, journeyUser],
  );
  await pg.query(
    `INSERT INTO user_lead_links (lead_id, user_id, link_reason, linked_at)
     VALUES ($1, $4, 'signup', '2026-09-01'),
            ($2, $5, 'signup', '2026-09-01'),
            ($3, $5, 'signup', '2026-09-02')`,
    [otherJourneyLead, earliestLink, laterLink, journeyUser, linkedUser],
  );

  const { AcquisitionRepository } = await import("./acquisition-repository");
  const details = await AcquisitionRepository.leadDetails(ids.slice(3), "EUR");
  expect(ids.slice(3).map((id) => details.get(id)?.signups)).toEqual([
    1, 0, 1, 0, 0, 1, 0,
  ]);
});
