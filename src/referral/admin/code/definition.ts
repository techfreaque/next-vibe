/**
 * Referral Code Report (admin) - Definition
 * GET: one code end to end. Owner, KPIs with previous-period deltas, funnel,
 * trend, commission by level, referred users, owner balance and payouts.
 * Identified by the code text (`code`), case-insensitive.
 * Client+server safe. No server imports.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { AnalyticsRange } from "next-vibe/unified-ui/analytics/enum";
import { analyticsWindowFields } from "next-vibe/unified-ui/analytics/fields";
import {
  analyticsWindowSchema,
  funnelSchema,
  kpiSchema,
  timeSeriesSchema,
} from "next-vibe/unified-ui/analytics/schema";
import { z } from "zod";

import {
  PayoutCurrency,
  PayoutCurrencyDB,
  PayoutStatus,
  PayoutStatusDB,
} from "../../enum";
import { REFERRAL_CODE_REPORT_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const ReferralCodeReportWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ReferralCodeReportWidget })),
);

const headerSchema = z.object({
  codeId: z.string(),
  code: z.string(),
  label: z.string().nullable(),
  isActive: z.boolean(),
  bonusCredits: z.number(),
  currentUses: z.number(),
  createdAt: z.string(),
  ownerUserId: z.string(),
  ownerEmail: z.string(),
  ownerName: z.string().nullable(),
});

const kpisSchema = z.object({
  clicks: kpiSchema,
  leads: kpiSchema,
  signups: kpiSchema,
  payers: kpiSchema,
  revenueUsd: kpiSchema,
  commissionUsd: kpiSchema,
  commissionPendingUsd: kpiSchema,
  commissionConfirmedUsd: kpiSchema,
  payoutsPaidUsd: kpiSchema,
});

const balanceSchema = z.object({
  confirmedUsd: z.number(),
  pendingUsd: z.number(),
  paidOutUsd: z.number(),
  openPayoutUsd: z.number(),
  availableUsd: z.number(),
  /** Available minus open requests; negative = queue exceeds the balance. */
  freeUsd: z.number(),
});

const levelRowSchema = z.object({
  level: z.number(),
  count: z.number(),
  pendingUsd: z.number(),
  confirmedUsd: z.number(),
  canceledUsd: z.number(),
});

const referredUserSchema = z.object({
  userId: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  signedUpAt: z.string(),
  payments: z.number(),
  revenueUsd: z.number(),
  commissionUsd: z.number(),
  lastPaymentAt: z.string().nullable(),
});

const payoutRowSchema = z.object({
  id: z.string(),
  amountUsd: z.number(),
  currency: z.enum(PayoutCurrencyDB),
  status: z.enum(PayoutStatusDB),
  createdAt: z.string(),
  processedAt: z.string().nullable(),
});

const kpi = { value: 33, previous: 25 };

const exampleResponse = {
  window: {
    from: "2026-10-23",
    to: "2026-11-21",
    previousFrom: "2026-09-23",
    previousTo: "2026-10-22",
    bucket: "day" as const,
  },
  header: {
    codeId: "123e4567-e89b-12d3-a456-426614174201",
    code: "moemoe",
    label: "YouTube video",
    isActive: true,
    bonusCredits: 300,
    currentUses: 41,
    createdAt: "2026-06-20T10:00:00.000Z",
    ownerUserId: "123e4567-e89b-12d3-a456-426614174000",
    ownerEmail: "partner@example.test",
    ownerName: "MoeMoe AI",
  },
  kpis: {
    clicks: kpi,
    leads: kpi,
    signups: kpi,
    payers: kpi,
    revenueUsd: kpi,
    commissionUsd: kpi,
    commissionPendingUsd: kpi,
    commissionConfirmedUsd: kpi,
    payoutsPaidUsd: kpi,
  },
  funnel: [
    { key: "clicks", value: 412 },
    { key: "leads", value: 301 },
    { key: "signups", value: 33 },
    { key: "payers", value: 11 },
  ],
  trend: {
    buckets: ["2026-11-20", "2026-11-21"],
    series: [
      { key: "signups", values: [2, 1] },
      { key: "payers", values: [1, 0] },
    ],
  },
  balance: {
    confirmedUsd: 120,
    pendingUsd: 16,
    paidOutUsd: 40,
    openPayoutUsd: 64,
    availableUsd: 80,
    freeUsd: 16,
  },
  earningsByLevel: [
    { level: 0, count: 12, pendingUsd: 6.4, confirmedUsd: 4.8, canceledUsd: 0 },
  ],
  referredUsers: [
    {
      userId: "123e4567-e89b-12d3-a456-426614174301",
      email: "referred@example.test",
      name: "Referred",
      signedUpAt: "2026-11-01T10:00:00.000Z",
      payments: 2,
      revenueUsd: 16,
      commissionUsd: 1.6,
      lastPaymentAt: "2026-11-15T10:00:00.000Z",
    },
  ],
  referredTotal: 41,
  payouts: [
    {
      id: "123e4567-e89b-12d3-a456-426614174101",
      amountUsd: 64,
      currency: PayoutCurrency.USDC,
      status: PayoutStatus.PENDING,
      createdAt: "2026-11-19T10:00:00.000Z",
      processedAt: null,
    },
  ],
};

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["referral", "admin", "code"],
  aliases: [REFERRAL_CODE_REPORT_ALIAS],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  icon: "bar-chart-2",
  category: "referral",
  subCategory: "Program",
  tags: ["tags.referral", "tags.admin", "tags.analytics"],
  allowedRoles: [UserRole.ADMIN],
  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 0,
    },
  },

  fields: customWidgetObject({
    render: ReferralCodeReportWidget,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),
      code: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.code.label",
        description: "get.fields.code.description",
        placeholder: "get.fields.code.placeholder",
        columns: 6,
        includeInCacheKey: true,
        schema: z.string().trim().min(1).max(100),
      }),
      ...analyticsWindowFields,

      window: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.window",
        schema: analyticsWindowSchema,
      }),
      header: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.header",
        schema: headerSchema,
      }),
      kpis: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.kpis",
        schema: kpisSchema,
      }),
      funnel: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.funnel",
        schema: funnelSchema,
      }),
      trend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.trend",
        schema: timeSeriesSchema,
      }),
      balance: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.balance",
        schema: balanceSchema,
      }),
      earningsByLevel: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.earningsByLevel",
        schema: z.array(levelRowSchema),
      }),
      referredUsers: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.referredUsers",
        schema: z.array(referredUserSchema),
      }),
      referredTotal: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.referredTotal",
        schema: z.number(),
      }),
      payouts: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.payouts",
        schema: z.array(payoutRowSchema),
      }),
    },
  }),

  examples: {
    requests: {
      default: { code: "moemoe" },
      last90Days: { code: "moemoe", range: AnalyticsRange.LAST_90_DAYS },
    },
    responses: {
      default: exampleResponse,
      last90Days: exampleResponse,
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

export type ReferralCodeReportGetRequestOutput = typeof GET.types.RequestOutput;
export type ReferralCodeReportGetResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
