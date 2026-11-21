/**
 * Revenue Report (admin)
 * Revenue by kind (packs, new subscriptions, renewals) and processor, refunds,
 * disputes, paying customers, active subscriptions, MRR and churn over time.
 * Totals are approx. USD at static FX rates (see money-sql.ts).
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { analyticsWindowFields } from "next-vibe/unified-ui/analytics/fields";
import {
  analyticsWindowSchema,
  breakdownSchema,
  kpiSchema,
  timeSeriesSchema,
} from "next-vibe/unified-ui/analytics/schema";
import { z } from "zod";

import { SubscriptionPlan, SubscriptionPlanOptions } from "@/subscription/enum";

import {
  CheckoutMode,
  PaymentProvider,
  PaymentProviderOptions,
  PaymentStatus,
} from "../../enum";
import { REVENUE_REPORT_ALIAS } from "./constants";
import { RevenueKind, RevenueKindOptions } from "./enum";
import { scopedTranslation } from "./i18n";

const RevenueReportWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.RevenueReportWidget })),
);

export const revenueKpisSchema = z.object({
  grossRevenueUsd: kpiSchema,
  netRevenueUsd: kpiSchema,
  refundsUsd: kpiSchema,
  mrrUsd: kpiSchema,
  payingCustomers: kpiSchema,
  activeSubscriptions: kpiSchema,
  newSubscriptions: kpiSchema,
  churnedSubscriptions: kpiSchema,
  renewals: kpiSchema,
  firstPayments: kpiSchema,
  packPurchases: kpiSchema,
  disputes: kpiSchema,
  failedPayments: kpiSchema,
});

export const recentPaymentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  email: z.string().nullable(),
  amount: z.number(),
  currency: z.enum(CurrenciesArr),
  usd: z.number(),
  status: z.enum(PaymentStatus),
  provider: z.enum(PaymentProvider),
  mode: z.enum(CheckoutMode),
  kind: z.enum(RevenueKind),
  plan: z.string().nullable(),
  subscriptionId: z.string().nullable(),
  createdAt: z.string(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["payment", "analytics", "revenue"],
  aliases: [REVENUE_REPORT_ALIAS],
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "trending-up",
  category: "payments",
  subCategory: "Transactions",
  tags: ["get.tags.revenue" as const, "get.tags.mrr" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,
  options: { formOptions: { autoSubmit: true, debounceMs: 0 } },

  fields: customWidgetObject({
    render: RevenueReportWidget,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),
      ...analyticsWindowFields,
      kind: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.kind.label" as const,
        description: "get.fields.kind.description" as const,
        options: RevenueKindOptions,
        columns: 3,
        schema: z.enum(RevenueKind).default(RevenueKind.ALL),
      }),
      provider: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.provider.label" as const,
        description: "get.fields.provider.description" as const,
        options: PaymentProviderOptions,
        columns: 3,
        schema: z.enum(PaymentProvider).optional(),
      }),
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.currency.label" as const,
        description: "get.fields.currency.description" as const,
        columns: 3,
        schema: z.enum(CurrenciesArr).optional(),
      }),
      plan: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.plan.label" as const,
        description: "get.fields.plan.description" as const,
        options: SubscriptionPlanOptions,
        columns: 3,
        schema: z.enum(SubscriptionPlan).optional(),
      }),
      includeInternal: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.includeInternal.label" as const,
        description: "get.fields.includeInternal.description" as const,
        columns: 3,
        schema: z.boolean().default(false),
      }),

      window: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.window" as const,
        schema: analyticsWindowSchema,
      }),
      appliedFilters: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.appliedFilters" as const,
        schema: z.object({
          kind: z.enum(RevenueKind),
          provider: z.enum(PaymentProvider).nullable(),
          currency: z.enum(CurrenciesArr).nullable(),
          plan: z.enum(SubscriptionPlan).nullable(),
          includeInternal: z.boolean(),
        }),
      }),
      kpis: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.kpis" as const,
        schema: revenueKpisSchema,
      }),
      revenueByKind: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.revenueByKind" as const,
        schema: timeSeriesSchema,
      }),
      revenueByProcessor: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.revenueByProcessor" as const,
        schema: timeSeriesSchema,
      }),
      subscriptionFlow: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.subscriptionFlow" as const,
        schema: timeSeriesSchema,
      }),
      mrrTrend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "widget.extra.mrrChart" as const,
        schema: timeSeriesSchema,
      }),
      byPlan: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.byPlan" as const,
        schema: breakdownSchema,
      }),
      byCurrency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.byCurrency" as const,
        schema: breakdownSchema,
      }),
      byProcessor: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.byProcessor" as const,
        schema: breakdownSchema,
      }),
      recentPayments: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.recentPayments" as const,
        schema: z.array(recentPaymentSchema),
      }),
      fxRates: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.fxRates" as const,
        schema: z.array(
          z.object({ currency: z.string(), usdRate: z.number() }),
        ),
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
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
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
      default: {},
      stripeRenewals: {
        kind: RevenueKind.RENEWAL,
        provider: PaymentProvider.STRIPE,
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
        appliedFilters: {
          kind: RevenueKind.ALL,
          provider: null,
          currency: null,
          plan: null,
          includeInternal: false,
        },
        kpis: {
          grossRevenueUsd: { value: 1840, previous: 1320 },
          netRevenueUsd: { value: 1790, previous: 1300 },
          refundsUsd: { value: 50, previous: 20 },
          mrrUsd: { value: 1210, previous: 980 },
          payingCustomers: { value: 61, previous: 48 },
          activeSubscriptions: { value: 52, previous: 44 },
          newSubscriptions: { value: 14, previous: 11 },
          churnedSubscriptions: { value: 3, previous: 4 },
          renewals: { value: 38, previous: 30 },
          firstPayments: { value: 14, previous: 11 },
          packPurchases: { value: 27, previous: 19 },
          disputes: { value: 1, previous: 0 },
          failedPayments: { value: 4, previous: 2 },
        },
        revenueByKind: {
          buckets: ["2026-11-20", "2026-11-21"],
          series: [
            { key: "pack", values: [25, 40] },
            { key: "newSubscription", values: [28, 8] },
            { key: "renewal", values: [36, 120] },
          ],
        },
        revenueByProcessor: {
          buckets: ["2026-11-20", "2026-11-21"],
          series: [
            { key: "stripe", values: [80, 150] },
            { key: "nowpayments", values: [9, 18] },
          ],
        },
        subscriptionFlow: {
          buckets: ["2026-11-20", "2026-11-21"],
          series: [
            { key: "new", values: [2, 1] },
            { key: "churned", values: [0, 1] },
          ],
        },
        mrrTrend: {
          buckets: ["2026-11-20", "2026-11-21"],
          series: [
            { key: "mrrUsd", values: [1190, 1210] },
            { key: "activeSubscriptions", values: [51, 52] },
          ],
        },
        byPlan: [
          {
            key: "enums.plan.subscription",
            metrics: { revenueUsd: 420, payments: 52, customers: 30 },
          },
        ],
        byCurrency: [
          {
            key: "EUR",
            metrics: { amount: 380, revenueUsd: 410.4, payments: 21 },
          },
        ],
        byProcessor: [
          {
            key: "enums.paymentProvider.stripe",
            metrics: {
              revenueUsd: 1650,
              payments: 95,
              customers: 55,
              failed: 3,
              refundsUsd: 50,
            },
          },
        ],
        recentPayments: [
          {
            id: "9dcfcdaa-6f32-4ea7-8180-4d662aaef27f",
            userId: "22cca261-5789-4d02-aa9c-26d1b6b986af",
            email: "buyer@example.com",
            amount: 20,
            currency: "EUR",
            usd: 21.6,
            status: PaymentStatus.SUCCEEDED,
            provider: PaymentProvider.STRIPE,
            mode: CheckoutMode.SUBSCRIPTION,
            kind: RevenueKind.RENEWAL,
            plan: SubscriptionPlan.PLUS,
            subscriptionId: "5f67f1b9-d172-466a-8c1e-002db608be18",
            createdAt: "2026-11-21T09:30:00.000Z",
          },
        ],
        fxRates: [
          { currency: "USD", usdRate: 1 },
          { currency: "EUR", usdRate: 1.08 },
          { currency: "PLN", usdRate: 0.25 },
        ],
      },
    },
  },
});

export type RevenueReportRequestOutput = typeof GET.types.RequestOutput;
export type RevenueReportResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
