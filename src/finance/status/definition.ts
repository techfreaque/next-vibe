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

/**
 * One day of AI economics (consumption-based) plus that day's cash, shown
 * side by side and never netted: cash arrives in plan / pack lumps.
 */
const daySchema = z.object({
  day: z.string(),
  /** Net cash received that day (Stripe + NOWPayments - refunds) */
  cashNetUsd: z.number(),
  /** Paid credits consumed x what was paid per credit */
  earnedUsd: z.number(),
  /** Provider cost of all usage that day (our own records + flat plans) */
  providerCostUsd: z.number(),
  aiMarginUsd: z.number(),
  aiMarginPct: z.number().nullable(),
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
          // AI economics from consumption: earned = paid credits consumed at
          // their paid price; AI margin = earned - provider cost of all usage.
          earnedUsd: z.number(),
          providerCostUsd: z.number(),
          aiMarginUsd: z.number(),
          aiMarginPct: z.number().nullable(),
          /** earned - provider cost of PAID usage only (pricing health) */
          paidMarginPct: z.number().nullable(),
          /** Free / bonus / admin credits consumed at list price */
          freeListUsd: z.number(),
          // Cash flow, reported separately and never netted against cost.
          cashNetUsd: z.number(),
          processorFeesUsd: z.number(),
          days: z.number(),
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
          earnedUsd: 4.72,
          providerCostUsd: 10.7,
          aiMarginUsd: -5.98,
          aiMarginPct: -126.69,
          paidMarginPct: 23.84,
          freeListUsd: 7.94,
          cashNetUsd: 120,
          processorFeesUsd: 6,
          days: 1,
        },
        days: [
          {
            day: "2026-11-18",
            cashNetUsd: 120,
            earnedUsd: 4.72,
            providerCostUsd: 10.7,
            aiMarginUsd: -5.98,
            aiMarginPct: -126.69,
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
          earnedUsd: 0,
          providerCostUsd: 0,
          aiMarginUsd: 0,
          aiMarginPct: null,
          paidMarginPct: null,
          freeListUsd: 0,
          cashNetUsd: 0,
          processorFeesUsd: 0,
          days: 0,
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
