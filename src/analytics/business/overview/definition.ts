/**
 * Business Overview
 * GET: the first screen of the admin. Acquisition, referrals, money and
 * operations for a period with previous-period deltas; every block drills into
 * the report that owns it.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import { responseField } from "next-vibe/unified-ui/_shared/utils-i18n";
import {
  AnalyticsGranularity,
  AnalyticsRange,
} from "next-vibe/unified-ui/analytics/enum";
import {
  analyticsWindowSchema,
  breakdownSchema,
  kpiSchema,
  timeSeriesSchema,
} from "next-vibe/unified-ui/analytics/schema";
import { z } from "zod";

import { reportAnalyticsWindowFields } from "@/finance/report-analytics-fields";

import { BUSINESS_OVERVIEW_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const BusinessOverviewWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.BusinessOverviewWidget })),
);

export const acquisitionSectionSchema = z.object({
  kpis: z.object({
    visits: kpiSchema,
    botVisits: kpiSchema.optional(),
    unknownVisits: kpiSchema.optional(),
    humanLeads: kpiSchema,
    botLeads: kpiSchema,
    unknownLeads: kpiSchema.optional(),
    signups: kpiSchema,
    firstChats: kpiSchema,
    payers: kpiSchema,
  }),
  trend: timeSeriesSchema,
  topSources: breakdownSchema,
  abuse: z.object({
    flaggedPrefixes: z.number(),
    topPrefix: z.string().nullable(),
    topPrefixLeads: z.number(),
  }),
});

export const referralSectionSchema = z.object({
  kpis: z.object({
    clicks: kpiSchema,
    leads: kpiSchema,
    signups: kpiSchema,
    payers: kpiSchema,
    revenueUsd: kpiSchema,
    commissionUsd: kpiSchema,
  }),
  pendingPayouts: z.object({
    count: z.number(),
    amountUsd: z.number(),
  }),
  topCodes: breakdownSchema,
});

export const moneySectionSchema = z.object({
  kpis: z.object({
    revenueUsd: kpiSchema,
    payingCustomers: kpiSchema,
    activeSubscriptions: kpiSchema,
    creditSpendUsd: kpiSchema,
    guestSpendUsd: kpiSchema,
    upstreamCostUsd: kpiSchema,
    marginUsd: kpiSchema,
    costedSpendUsd: kpiSchema.optional(),
  }),
  trend: timeSeriesSchema,
});

export const opsSectionSchema = z.object({
  unresolvedErrors: z.number(),
  errorOccurrences: kpiSchema,
  errorOccurrencesSince: z.string().nullable().optional(),
  failingTasks: z.number(),
  unhealthyConnections: z.number(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["analytics", "business", "overview"],
  aliases: [BUSINESS_OVERVIEW_ALIAS],
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  category: "analytics" as const,
  subCategory: "Business" as const,
  icon: "bar-chart-2" as const,
  tags: ["tags.analytics" as const, "tags.overview" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 0,
    },
  },

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: BusinessOverviewWidgetLazy,
    children: {
      ...reportAnalyticsWindowFields,
      window: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.window" as const,
        schema: analyticsWindowSchema,
      }),
      generatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.generatedAt" as const,
        schema: z.string(),
      }),
      acquisition: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.acquisition" as const,
        schema: acquisitionSectionSchema.nullable(),
      }),
      referral: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.referral" as const,
        schema: referralSectionSchema.nullable(),
      }),
      money: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.money" as const,
        schema: moneySectionSchema.nullable(),
      }),
      ops: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.ops" as const,
        schema: opsSectionSchema.nullable(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        range: AnalyticsRange.LAST_30_DAYS,
        granularity: AnalyticsGranularity.AUTO,
      },
    },
    responses: {
      default: {
        window: {
          from: "2026-10-23",
          to: "2026-11-21",
          previousFrom: "2026-09-23",
          previousTo: "2026-10-22",
          bucket: "day",
        },
        generatedAt: "2026-11-21T20:05:00.000Z",
        acquisition: {
          kpis: {
            visits: { value: 4210, previous: 3180 },
            botVisits: { value: 9800, previous: 450 },
            unknownVisits: { value: 3, previous: 5 },
            humanLeads: { value: 1320, previous: 1105 },
            botLeads: { value: 2890, previous: 140 },
            unknownLeads: { value: 12, previous: 30 },
            signups: { value: 96, previous: 81 },
            firstChats: { value: 870, previous: 702 },
            payers: { value: 7, previous: 5 },
          },
          trend: {
            buckets: ["2026-11-20", "2026-11-21"],
            series: [
              { key: "visits", values: [140, 152] },
              { key: "leads", values: [41, 47] },
              { key: "signups", values: [3, 4] },
            ],
          },
          topSources: [
            { key: "search", metrics: { leads: 610, signups: 41, payers: 3 } },
            { key: "direct", metrics: { leads: 402, signups: 30, payers: 2 } },
          ],
          abuse: {
            flaggedPrefixes: 3,
            topPrefix: "31.13.127.0/24",
            topPrefixLeads: 2604,
          },
        },
        referral: {
          kpis: {
            clicks: { value: 812, previous: 640 },
            leads: { value: 301, previous: 255 },
            signups: { value: 22, previous: 17 },
            payers: { value: 3, previous: 2 },
            revenueUsd: { value: 84, previous: 52 },
            commissionUsd: { value: 8.4, previous: 5.2 },
          },
          pendingPayouts: { count: 1, amountUsd: 40 },
          topCodes: [
            {
              key: "moemoe",
              metrics: { clicks: 512, signups: 14, payers: 2, revenueUsd: 56 },
            },
          ],
        },
        money: {
          kpis: {
            revenueUsd: { value: 1240, previous: 980 },
            payingCustomers: { value: 41, previous: 36 },
            activeSubscriptions: { value: 38, previous: 33 },
            creditSpendUsd: { value: 812, previous: 701 },
            guestSpendUsd: { value: 96, previous: 88 },
            upstreamCostUsd: { value: 402, previous: 351 },
            marginUsd: { value: 410, previous: 350 },
          },
          trend: {
            buckets: ["2026-11-20", "2026-11-21"],
            series: [
              { key: "revenueUsd", values: [40, 62] },
              { key: "spendUsd", values: [27, 30] },
              { key: "upstreamCostUsd", values: [13, 15] },
            ],
          },
        },
        ops: {
          unresolvedErrors: 4,
          errorOccurrences: { value: 37, previous: 52 },
          errorOccurrencesSince: null,
          failingTasks: 1,
          unhealthyConnections: 0,
        },
      },
    },
  },
});

export type BusinessOverviewResponseOutput = typeof GET.types.ResponseOutput;
export type BusinessOverviewRequestOutput = typeof GET.types.RequestOutput;

const definitions = { GET } as const;
export default definitions;
