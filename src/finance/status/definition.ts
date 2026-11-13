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
  CostCoverageDB,
  FinanceAlertTypeDB,
  FinanceSourceDB,
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
  balanceUsd: z.number().nullable(),
  balanceNative: z.number().nullable(),
  unit: z.string().nullable(),
  lastSpendUsd: z.number().nullable(),
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
        lastIngestAt: "2026-11-08T06:00:00.000Z",
        sources: [],
        week: {
          netRevenueUsd: 120,
          processorFeesUsd: 6,
          upstreamCostUsd: 48,
          grossMarginUsd: 66,
          grossMarginPct: 55,
          costComplete: true,
          marginDays: 8,
          totalDays: 8,
          netRevenueAllDaysUsd: 120,
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
