/**
 * Finance Status - Endpoint Definition
 * GET: provider balances, last ingest, margin, recent alerts, thresholds.
 * Client+server safe. No server imports.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import { Methods, WidgetType } from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import { responseField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { FINANCE_STATUS_ALIAS } from "../constants";
import {
  AlertSeverityDB,
  CostCoverage,
  CostCoverageDB,
  FinanceAlertTypeDB,
  FinanceSource,
  FinanceSourceDB,
  SourceRunStatus,
  SourceRunStatusDB,
  ThresholdKeyDB,
} from "../enum";
import { financeErrorTypes } from "../error-types";
import { scopedTranslation } from "../i18n";

const FinanceStatusWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.FinanceStatusWidget })),
);

const sourceSchema = z.object({
  source: z.enum(FinanceSourceDB),
  status: z.enum(SourceRunStatusDB).nullable(),
  reason: z.string().nullable(),
  // true when the last run used our own records instead of the source API
  fallback: z.boolean(),
  lastRunAt: z.string().nullable(),
  lastOkAt: z.string().nullable(),
  snapshotAt: z.string().nullable(),
  balanceUsd: z.number().nullable(),
  balanceNative: z.number().nullable(),
  unit: z.string().nullable(),
  lastSpendUsd: z.number().nullable(),
  lastSpendNative: z.number().nullable(),
});

const daySchema = z.object({
  day: z.string(),
  netRevenueUsd: z.number(),
  processorFeesUsd: z.number(),
  upstreamCostUsd: z.number().nullable(),
  grossMarginUsd: z.number().nullable(),
  grossMarginPct: z.number().nullable(),
  billingGapPct: z.number().nullable(),
  costCoverage: z.enum(CostCoverageDB),
});

const alertSchema = z.object({
  id: z.uuid(),
  type: z.enum(FinanceAlertTypeDB),
  severity: z.enum(AlertSeverityDB),
  subject: z.string(),
  message: z.string(),
  delivery: z.string(),
  createdAt: z.string(),
});

const thresholdSchema = z.object({
  key: z.enum(ThresholdKeyDB),
  value: z.number(),
  defaultValue: z.number(),
  enabled: z.boolean(),
  note: z.string().nullable(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["finance", "status"],
  aliases: [FINANCE_STATUS_ALIAS] as const,
  title: "status.title",
  titleShort: "status.titleShort",
  description: "status.description",
  icon: "wallet",
  category: "finance",
  subCategory: "Monitoring",
  tags: ["tags.finance"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: FinanceStatusWidget,
    usage: { response: true } as const,
    children: {
      lastIngestAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "status.response.lastIngestAt",
        schema: z.string().nullable(),
      }),
      lastSuccessfulIngestAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "status.response.lastSuccessfulIngestAt",
        schema: z.string().nullable(),
      }),
      asOf: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "status.response.asOf",
        schema: z.string(),
      }),
      sources: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "status.response.sources",
        schema: z.array(sourceSchema),
      }),
      week: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "status.response.week",
        schema: z.object({
          // Revenue / fees / cost / margin over the COMPLETE-cost days only.
          netRevenueUsd: z.number(),
          processorFeesUsd: z.number(),
          upstreamCostUsd: z.number(),
          grossMarginUsd: z.number(),
          grossMarginPct: z.number().nullable(),
          costComplete: z.boolean(),
          marginDays: z.number(),
          totalDays: z.number(),
          expectedDays: z.number(),
          // Net revenue over every day in the window, tracked cost or not.
          netRevenueAllDaysUsd: z.number(),
        }),
      }),
      days: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "status.response.days",
        schema: z.array(daySchema),
      }),
      alerts: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "status.response.alerts",
        schema: z.array(alertSchema),
      }),
      thresholds: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "status.response.thresholds",
        schema: z.array(thresholdSchema),
      }),
    },
  }),

  errorTypes: financeErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    responses: {
      default: {
        asOf: "2026-11-19T12:00:00.000Z",
        lastIngestAt: "2026-11-19T11:00:00.000Z",
        lastSuccessfulIngestAt: "2026-11-18T08:00:00.000Z",
        sources: [
          {
            source: FinanceSource.GAB,
            status: SourceRunStatus.FAILED,
            reason: null,
            fallback: false,
            lastRunAt: "2026-11-19T11:00:00.000Z",
            lastOkAt: "2026-11-18T08:00:00.000Z",
            snapshotAt: "2026-11-18T08:00:00.000Z",
            balanceUsd: null,
            balanceNative: 150,
            unit: "credits",
            lastSpendUsd: null,
            lastSpendNative: 7,
          },
          {
            source: FinanceSource.STRIPE,
            status: null,
            reason: null,
            fallback: false,
            lastRunAt: null,
            lastOkAt: null,
            snapshotAt: null,
            balanceUsd: null,
            balanceNative: null,
            unit: null,
            lastSpendUsd: null,
            lastSpendNative: null,
          },
        ],
        week: {
          netRevenueUsd: 0,
          processorFeesUsd: 0,
          upstreamCostUsd: 0,
          grossMarginUsd: 0,
          grossMarginPct: null,
          costComplete: false,
          marginDays: 0,
          totalDays: 1,
          expectedDays: 7,
          netRevenueAllDaysUsd: 120,
        },
        days: [
          {
            day: "2026-11-18",
            netRevenueUsd: 120,
            processorFeesUsd: 6,
            upstreamCostUsd: null,
            grossMarginUsd: null,
            grossMarginPct: null,
            billingGapPct: null,
            costCoverage: CostCoverage.NONE,
          },
        ],
        alerts: [],
        thresholds: [],
      },
      missing: {
        asOf: "2026-11-19T12:00:00.000Z",
        lastIngestAt: null,
        lastSuccessfulIngestAt: null,
        sources: [],
        week: {
          netRevenueUsd: 0,
          processorFeesUsd: 0,
          upstreamCostUsd: 0,
          grossMarginUsd: 0,
          grossMarginPct: null,
          costComplete: false,
          marginDays: 0,
          totalDays: 0,
          expectedDays: 7,
          netRevenueAllDaysUsd: 0,
        },
        days: [],
        alerts: [],
        thresholds: [],
      },
    },
  },
});

export type FinanceStatusResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
