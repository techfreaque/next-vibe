/**
 * Subscription Admin Statistics API Definition
 * Revenue, subscription, credit and referral metrics
 */

import { z } from "zod";

import {
  DateRangePreset,
  DateRangePresetOptions,
  TimePeriod,
  TimePeriodOptions,
} from "@/app/api/[locale]/shared/stats-filtering";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
  objectField,
  objectOptionalField,
  requestField,
  responseField,
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { dateSchema } from "../../../shared/types/common.schema";
import { SUBSCRIPTION_ADMIN_STATS_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

const SubscriptionStatsContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SubscriptionStatsContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["subscription", "admin", "stats"],
  aliases: [SUBSCRIPTION_ADMIN_STATS_ALIAS],
  title: "get.title" as const,
  description: "get.description" as const,
  icon: "bar-chart-3",
  category: "endpointCategories.subscriptions",
  subCategory: "endpointCategories.subscriptionAnalytics",
  tags: ["get.title" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: SubscriptionStatsContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),

      // === TIME PERIOD OPTIONS ===
      timePeriodOptions: objectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.timePeriodOptions.title" as const,
        description: "get.timePeriodOptions.description" as const,
        layoutType: LayoutType.GRID_2_COLUMNS,
        order: 1,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { request: "data" },
        children: {
          timePeriod: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "get.timePeriod.label" as const,
            description: "get.timePeriod.description" as const,
            options: TimePeriodOptions,
            columns: 6,
            schema: z.enum(TimePeriod).default(TimePeriod.DAY),
          }),
          dateRangePreset: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "get.dateRangePreset.label" as const,
            description: "get.dateRangePreset.description" as const,
            options: DateRangePresetOptions,
            columns: 6,
            schema: z
              .enum(DateRangePreset)
              .default(DateRangePreset.LAST_30_DAYS),
          }),
        },
      }),

      // === FORM ALERT ===
      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        order: 1.5,
        usage: { request: "data" },
      }),

      // === REVENUE STATISTICS ===
      revenueStats: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.revenueStats.title" as const,
        description: "get.response.revenueStats.description" as const,
        layoutType: LayoutType.GRID,
        columns: 4,
        order: 2,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { response: true },
        children: {
          mrr: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.revenueStats.mrr.label" as const,
            icon: "dollar-sign",
            variant: "success",
            format: "currency",
            schema: z.coerce
              .number()
              .describe("Monthly Recurring Revenue in cents"),
          }),
          arr: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.revenueStats.arr.label" as const,
            icon: "dollar-sign",
            variant: "success",
            format: "currency",
            schema: z.coerce
              .number()
              .describe("Annual Recurring Revenue in cents"),
          }),
          totalRevenue: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.revenueStats.totalRevenue.label" as const,
            icon: "trending-up",
            variant: "info",
            format: "currency",
            schema: z.coerce
              .number()
              .describe("Total revenue in period in cents"),
          }),
          avgOrderValue: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.revenueStats.avgOrderValue.label" as const,
            icon: "receipt",
            variant: "info",
            format: "currency",
            schema: z.coerce.number().describe("Average order value in cents"),
          }),
        },
      }),

      // === SUBSCRIPTION STATISTICS ===
      subscriptionStats: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.subscriptionStats.title" as const,
        description: "get.response.subscriptionStats.description" as const,
        layoutType: LayoutType.GRID,
        columns: 4,
        order: 3,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { response: true },
        children: {
          activeCount: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.subscriptionStats.activeCount.label" as const,
            icon: "check",
            variant: "success",
            format: "compact",
            schema: z.coerce.number().describe("Active subscriptions"),
          }),
          trialingCount: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label:
              "get.response.subscriptionStats.trialingCount.label" as const,
            icon: "clock",
            variant: "info",
            format: "compact",
            schema: z.coerce.number().describe("Trialing subscriptions"),
          }),
          canceledCount: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label:
              "get.response.subscriptionStats.canceledCount.label" as const,
            icon: "x",
            variant: "warning",
            format: "compact",
            schema: z.coerce.number().describe("Canceled subscriptions"),
          }),
          churnRate: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.subscriptionStats.churnRate.label" as const,
            icon: "trending-down",
            variant: "warning",
            format: "percentage",
            schema: z.coerce.number().describe("Churn rate (0-1)"),
          }),
        },
      }),

      // === INTERVAL STATISTICS ===
      intervalStats: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.intervalStats.title" as const,
        description: "get.response.intervalStats.description" as const,
        layoutType: LayoutType.GRID,
        columns: 3,
        order: 4,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { response: true },
        children: {
          monthlyCount: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.intervalStats.monthlyCount.label" as const,
            icon: "calendar",
            variant: "info",
            format: "compact",
            schema: z.coerce.number().describe("Monthly subscriptions"),
          }),
          yearlyCount: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.intervalStats.yearlyCount.label" as const,
            icon: "calendar",
            variant: "success",
            format: "compact",
            schema: z.coerce.number().describe("Yearly subscriptions"),
          }),
          yearlyRevenuePct: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.intervalStats.yearlyRevenuePct.label" as const,
            icon: "activity",
            variant: "info",
            format: "percentage",
            schema: z.coerce
              .number()
              .describe("Percentage of revenue from yearly plans (0-1)"),
          }),
        },
      }),

      // === CREDIT STATISTICS ===
      creditStats: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.creditStats.title" as const,
        description: "get.response.creditStats.description" as const,
        layoutType: LayoutType.GRID,
        columns: 4,
        order: 5,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { response: true },
        children: {
          totalPurchased: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.creditStats.totalPurchased.label" as const,
            icon: "plus-circle",
            variant: "success",
            format: "compact",
            schema: z.coerce.number().describe("Total credits purchased"),
          }),
          totalSpent: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.creditStats.totalSpent.label" as const,
            icon: "minus-circle",
            variant: "warning",
            format: "compact",
            schema: z.coerce.number().describe("Total credits spent"),
          }),
          packsSold: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.creditStats.packsSold.label" as const,
            icon: "package",
            variant: "info",
            format: "compact",
            schema: z.coerce.number().describe("Total credit packs sold"),
          }),
          avgPackSize: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.creditStats.avgPackSize.label" as const,
            icon: "bar-chart",
            variant: "info",
            format: "compact",
            schema: z.coerce.number().describe("Average credits per pack"),
          }),
        },
      }),

      // === REFERRAL STATISTICS ===
      referralStats: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.referralStats.title" as const,
        description: "get.response.referralStats.description" as const,
        layoutType: LayoutType.GRID,
        columns: 4,
        order: 6,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { response: true },
        children: {
          totalReferrals: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.referralStats.totalReferrals.label" as const,
            icon: "users",
            variant: "info",
            format: "compact",
            schema: z.coerce.number().describe("Total referrals"),
          }),
          conversionRate: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.referralStats.conversionRate.label" as const,
            icon: "target",
            variant: "info",
            format: "percentage",
            schema: z.coerce
              .number()
              .describe("Referral conversion rate (0-1)"),
          }),
          totalEarned: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.referralStats.totalEarned.label" as const,
            icon: "dollar-sign",
            variant: "success",
            format: "currency",
            schema: z.coerce
              .number()
              .describe("Total referral earnings in cents"),
          }),
          pendingPayouts: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.referralStats.pendingPayouts.label" as const,
            icon: "clock",
            variant: "warning",
            format: "currency",
            schema: z.coerce
              .number()
              .describe("Pending payout amount in cents"),
          }),
        },
      }),

      // === GROWTH METRICS ===
      growthMetrics: objectField(scopedTranslation, {
        title: "get.response.growthMetrics.title" as const,
        description: "get.response.growthMetrics.description" as const,
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        order: 7,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { response: true },
        children: {
          revenueChart: responseField(scopedTranslation, {
            type: WidgetType.CHART,
            chartType: "line",
            label: "get.response.growthMetrics.revenueChart.label" as const,
            description:
              "get.response.growthMetrics.revenueChart.description" as const,
            height: 280,
            showLegend: false,
            xAxisLabel: "Time Period",
            yAxisLabel: "Revenue",
            columns: 12,
            schema: z
              .array(
                z.object({
                  x: z.string(),
                  y: z.coerce.number(),
                  label: z.string().optional(),
                }),
              )
              .describe("Revenue over time chart data"),
          }),
          subscriptionChart: responseField(scopedTranslation, {
            type: WidgetType.CHART,
            chartType: "line",
            label:
              "get.response.growthMetrics.subscriptionChart.label" as const,
            description:
              "get.response.growthMetrics.subscriptionChart.description" as const,
            height: 280,
            showLegend: false,
            xAxisLabel: "Time Period",
            yAxisLabel: "Active Subscriptions",
            columns: 12,
            schema: z
              .array(
                z.object({
                  x: z.string(),
                  y: z.coerce.number(),
                  label: z.string().optional(),
                }),
              )
              .describe("Active subscription count over time chart data"),
          }),
        },
      }),

      // === BUSINESS INSIGHTS ===
      businessInsights: objectField(scopedTranslation, {
        title: "get.response.businessInsights.title" as const,
        description: "get.response.businessInsights.description" as const,
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        order: 8,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { response: true },
        children: {
          generatedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            fieldType: FieldDataType.DATETIME,
            label: "get.response.businessInsights.generatedAt.label" as const,
            content: "get.response.businessInsights.generatedAt.label" as const,
            schema: dateSchema.describe("When these statistics were generated"),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
  },
  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },
  examples: {
    requests: {
      default: {},
    },
    responses: {
      default: {
        revenueStats: {
          mrr: 4500000,
          arr: 54000000,
          totalRevenue: 12500000,
          avgOrderValue: 2500,
        },
        subscriptionStats: {
          activeCount: 850,
          trialingCount: 45,
          canceledCount: 120,
          churnRate: 0.034,
        },
        intervalStats: {
          monthlyCount: 620,
          yearlyCount: 230,
          yearlyRevenuePct: 0.68,
        },
        creditStats: {
          totalPurchased: 500000,
          totalSpent: 320000,
          packsSold: 1200,
          avgPackSize: 417,
        },
        referralStats: {
          totalReferrals: 340,
          conversionRate: 0.23,
          totalEarned: 890000,
          pendingPayouts: 125000,
        },
        growthMetrics: {
          revenueChart: [
            { x: "Jan", y: 3200000, label: "Jan" },
            { x: "Feb", y: 3500000, label: "Feb" },
            { x: "Mar", y: 4100000, label: "Mar" },
          ],
          subscriptionChart: [
            { x: "Jan", y: 780, label: "Jan" },
            { x: "Feb", y: 810, label: "Feb" },
            { x: "Mar", y: 850, label: "Mar" },
          ],
        },
        businessInsights: {
          generatedAt: "2026-05-03T12:00:00.000Z",
        },
      },
    },
  },
});

// Extract types
export type SubscriptionStatsRequestInput = typeof GET.types.RequestInput;
export type SubscriptionStatsRequestOutput = typeof GET.types.RequestOutput;
export type SubscriptionStatsResponseInput = typeof GET.types.ResponseInput;
export type SubscriptionStatsResponseOutput = typeof GET.types.ResponseOutput;

const definitions = {
  GET,
} as const;

export default definitions;
