/**
 * Credit usage report on production-shaped ledger rows:
 * - provider cost is only recorded since mid-Nov 2026, so a previous period
 *   without any costed row is "no data" (null), never "$0 cost";
 * - feature labels written in the request locale (legacy rows) fold onto the
 *   stable id new rows store, and the report labels it in the viewer's locale.
 */

import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { WEB_SEARCH_ALIAS } from "next-vibe/agent/web-search/constants";
import { createEndpointLogger } from "next-vibe/logger/server";
import { AnalyticsRange } from "next-vibe/unified-ui/analytics/enum";
import { resolveAnalyticsWindow } from "next-vibe/unified-ui/analytics/window";

import { CreditFundingType, CreditTransactionType } from "../../enum";
import { UsageActor, UsageCreditKind } from "./enum";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));

const id = (n: number): string =>
  `00000000-0000-4000-8000-${n.toString().padStart(12, "0")}`;

const win = resolveAnalyticsWindow(
  { range: AnalyticsRange.CUSTOM, from: "2026-11-15", to: "2026-11-21" },
  new Date("2026-11-22T12:00:00Z"),
);

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE credit_wallets (id uuid PRIMARY KEY, user_id uuid, lead_id uuid);
    CREATE TABLE credit_packs (id uuid PRIMARY KEY, type text);
    CREATE TABLE credit_transactions (
      id serial, wallet_id uuid, pack_id uuid, type text, amount numeric,
      metadata jsonb NOT NULL DEFAULT '{}'::jsonb, funding_type text,
      model_id text, feature text, created_at timestamp
    );
    CREATE TABLE user_lead_links (lead_id uuid, user_id uuid, linked_at timestamp);
    CREATE TABLE user_roles (user_id uuid, role text);
    CREATE TABLE users (id uuid PRIMARY KEY, email text);
  `);
  const usage = CreditTransactionType.USAGE;
  const free = CreditFundingType.FREE_ALLOWANCE;
  await pg.exec(`
    INSERT INTO credit_wallets VALUES ('${id(1)}', NULL, '${id(11)}');
    INSERT INTO credit_transactions (wallet_id, type, amount, metadata, funding_type, model_id, feature, created_at) VALUES
      -- previous period (Nov 8-14): real usage, no provider cost recorded yet
      ('${id(1)}', '${usage}', -500, '{}', '${free}', 'kimi-k3', NULL, '2026-11-10 10:00:00'),
      ('${id(1)}', '${usage}', -2, '{}', '${free}', NULL, 'Search the Web', '2026-11-10 11:00:00'),
      -- current period: half the usage has provider cost
      ('${id(1)}', '${usage}', -400, '{"upstreamCostUsd": 3}', '${free}', 'kimi-k3', NULL, '2026-11-18 10:00:00'),
      ('${id(1)}', '${usage}', -400, '{}', '${free}', 'kimi-k3', NULL, '2026-11-18 11:00:00'),
      ('${id(1)}', '${usage}', -1, '{}', '${free}', NULL, 'Search the Web', '2026-11-18 12:00:00'),
      ('${id(1)}', '${usage}', -1, '{}', '${free}', NULL, 'Im Web suchen', '2026-11-18 12:01:00'),
      ('${id(1)}', '${usage}', -1, '{}', '${free}', NULL, 'Rechercher sur le web', '2026-11-18 12:02:00'),
      ('${id(1)}', '${usage}', -1, '{}', '${free}', NULL, '${WEB_SEARCH_ALIAS}', '2026-11-19 12:00:00');
  `);
});

afterAll(async () => {
  await pg.close();
});

test("previous period without cost data has no cost comparison", async () => {
  const { CreditUsageReportRepository } = await import("./repository");
  const report = await CreditUsageReportRepository.build(win, {
    actor: UsageActor.ALL,
    creditKind: UsageCreditKind.ALL,
    includeInternal: false,
  });
  expect(report.kpis.creditsSpent.value).toBe(804);
  expect(report.kpis.creditsSpent.previous).toBe(502);
  expect(report.kpis.upstreamCostUsd.value).toBe(3);
  // Not $0: nothing was costed in the previous period.
  expect(report.kpis.upstreamCostUsd.previous).toBeNull();
  expect(report.kpis.marginUsd.previous).toBeNull();
  expect(report.kpis.marginPct.previous).toBeNull();
  expect(report.kpis.costedSpendUsd.value).toBe(4);
  expect(report.kpis.marginUsd.value).toBe(1);
  // Coverage of the previous period really was 0%.
  expect(report.kpis.costCoverage.previous).toBe(0);
});

test("legacy localized labels and the new id are one feature row, labeled in the viewer's locale", async () => {
  const { CreditUsageReportRepository } = await import("./repository");
  const { default: definition } = await import("./definition");
  const { scopedTranslation } = await import("./i18n");
  const { endpointsMeta } = await import("@/generated/endpoints/meta/de");
  const locale = "de-DE";
  const result = await CreditUsageReportRepository.getReport(
    definition.GET.requestSchema.parse({
      range: AnalyticsRange.CUSTOM,
      from: "2026-11-15",
      to: "2026-11-21",
    }),
    createEndpointLogger(false, locale),
    scopedTranslation.scopedT(locale).t,
    locale,
  );
  expect(result.success).toBe(true);
  if (!result.success) {
    return;
  }
  const search = result.data.byFeature.filter(
    (row) => row.key === WEB_SEARCH_ALIAS,
  );
  expect(search).toHaveLength(1);
  expect(search[0]?.metrics.credits).toBe(4);
  expect(
    result.data.byFeature.some(
      (row) => row.key === "Im Web suchen" || row.key === "Search the Web",
    ),
  ).toBe(false);
  const titleDe = endpointsMeta.find(
    (entry) => entry.toolName === WEB_SEARCH_ALIAS,
  )?.title;
  if (titleDe === undefined) {
    return expect.unreachable("Missing German web search title");
  }
  expect(result.data.featureLabels[WEB_SEARCH_ALIAS]).toBe(titleDe);
});
