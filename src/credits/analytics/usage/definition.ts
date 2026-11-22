/**
 * Credit Usage Report (admin)
 * Credit spend over time: accounts vs guests, free allowance vs pack credits,
 * by model / feature / upstream provider, margin vs provider cost, top spenders.
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
import { analyticsWindowFields } from "next-vibe/unified-ui/analytics/fields";
import {
  analyticsWindowSchema,
  breakdownSchema,
  kpiSchema,
  timeSeriesSchema,
} from "next-vibe/unified-ui/analytics/schema";
import { z } from "zod";

import { CREDIT_USAGE_REPORT_ALIAS } from "./constants";
import {
  UsageActor,
  UsageActorOptions,
  UsageCreditKind,
  UsageCreditKindOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

const CreditUsageReportWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CreditUsageReportWidget })),
);

const filterText = z.string().trim().max(120).optional();

export const creditUsageKpisSchema = z.object({
  creditsSpent: kpiSchema,
  spendUsd: kpiSchema,
  guestShare: kpiSchema,
  freeShare: kpiSchema,
  upstreamCostUsd: kpiSchema,
  costedSpendUsd: kpiSchema,
  freeCostUsd: kpiSchema,
  paidShare: kpiSchema,
  originMissingShare: kpiSchema,
  freeCredits: kpiSchema,
  freeCostCoverage: kpiSchema,
  marginUsd: kpiSchema,
  marginPct: kpiSchema,
  costCoverage: kpiSchema,
  activeSpenders: kpiSchema,
});

export const topSpenderSchema = z.object({
  userId: z.string().nullable(),
  leadId: z.string().nullable(),
  email: z.string().nullable(),
  credits: z.number(),
  usd: z.number(),
  freeShare: z.number(),
  costUsd: z.number().nullable(),
  marginPct: z.number().nullable(),
  purchasedShare: z.number(),
  subscriptionShare: z.number(),
  grantsShare: z.number(),
  unknownShare: z.number(),
  topModel: z.string().nullable(),
  transactions: z.number(),
  lastActivity: z.string(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["credits", "analytics", "usage"],
  aliases: [CREDIT_USAGE_REPORT_ALIAS],
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "bar-chart-3",
  category: "credits",
  subCategory: "Management",
  tags: ["get.tags.usage" as const, "get.tags.margin" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,
  options: { formOptions: { autoSubmit: true, debounceMs: 0 } },

  fields: customWidgetObject({
    render: CreditUsageReportWidget,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),
      ...analyticsWindowFields,
      actor: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.actor.label" as const,
        description: "get.fields.actor.description" as const,
        options: UsageActorOptions,
        columns: 3,
        schema: z.enum(UsageActor).default(UsageActor.ALL),
      }),
      creditKind: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.creditKind.label" as const,
        description: "get.fields.creditKind.description" as const,
        options: UsageCreditKindOptions,
        columns: 3,
        schema: z.enum(UsageCreditKind).default(UsageCreditKind.ALL),
      }),
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.model.label" as const,
        description: "get.fields.model.description" as const,
        columns: 3,
        schema: filterText,
      }),
      feature: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.feature.label" as const,
        description: "get.fields.feature.description" as const,
        columns: 3,
        schema: filterText,
      }),
      provider: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.provider.label" as const,
        description: "get.fields.provider.description" as const,
        columns: 3,
        schema: filterText,
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
          actor: z.enum(UsageActor),
          creditKind: z.enum(UsageCreditKind),
          model: z.string().nullable(),
          feature: z.string().nullable(),
          provider: z.string().nullable(),
          includeInternal: z.boolean(),
        }),
      }),
      kpis: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.kpis" as const,
        schema: creditUsageKpisSchema,
      }),
      spendByActor: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.spendByActor" as const,
        schema: timeSeriesSchema,
      }),
      spendByFunding: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "widget.extra.fundingChart" as const,
        schema: timeSeriesSchema,
      }),
      spendByKind: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.spendByKind" as const,
        schema: timeSeriesSchema,
      }),
      costVsSpend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.costVsSpend" as const,
        schema: timeSeriesSchema,
      }),
      byModel: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.byModel" as const,
        schema: breakdownSchema,
      }),
      byFeature: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.byFeature" as const,
        schema: breakdownSchema,
      }),
      byProvider: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.byProvider" as const,
        schema: breakdownSchema,
      }),
      featureLabels: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.featureLabels" as const,
        schema: z.record(z.string(), z.string()),
      }),
      topSpenders: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.topSpenders" as const,
        schema: z.array(topSpenderSchema),
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
      guestsFree: {
        actor: UsageActor.GUESTS,
        creditKind: UsageCreditKind.FREE,
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
          actor: UsageActor.ALL,
          creditKind: UsageCreditKind.ALL,
          model: null,
          feature: null,
          provider: null,
          includeInternal: false,
        },
        kpis: {
          creditsSpent: { value: 12840, previous: 9100 },
          spendUsd: { value: 128.4, previous: 91 },
          guestShare: { value: 0.38, previous: 0.41 },
          freeShare: { value: 0.52, previous: 0.55 },
          upstreamCostUsd: { value: 61.2, previous: 44.5 },
          costedSpendUsd: { value: 125.3, previous: 88.3 },
          freeCostUsd: { value: 29.4, previous: 21.1 },
          paidShare: { value: 0.41, previous: 0.38 },
          originMissingShare: { value: 0.05, previous: 0.04 },
          freeCredits: { value: 6677, previous: 5005 },
          freeCostCoverage: { value: 0.9, previous: 0.88 },
          marginUsd: { value: 64.1, previous: 44.9 },
          marginPct: { value: 0.51, previous: 0.5 },
          costCoverage: { value: 0.98, previous: 0.97 },
          activeSpenders: { value: 214, previous: 180 },
        },
        spendByActor: {
          buckets: ["2026-11-20", "2026-11-21"],
          series: [
            { key: "users", values: [310, 280] },
            { key: "guests", values: [190, 160] },
          ],
        },
        spendByFunding: {
          buckets: ["2026-11-20", "2026-11-21"],
          series: [
            { key: "allowance", values: [260, 220] },
            { key: "purchased", values: [120, 110] },
            { key: "subscription", values: [100, 90] },
            { key: "adminGrant", values: [20, 20] },
            { key: "packUnknown", values: [0, 0] },
          ],
        },
        spendByKind: {
          buckets: ["2026-11-20", "2026-11-21"],
          series: [
            { key: "free", values: [260, 220] },
            { key: "pack", values: [240, 220] },
          ],
        },
        costVsSpend: {
          buckets: ["2026-11-20", "2026-11-21"],
          series: [
            { key: "spendUsd", values: [5, 4.4] },
            { key: "upstreamCostUsd", values: [2.4, 2.1] },
          ],
        },
        byModel: [
          {
            key: "deepseek-v4.1-flash",
            metrics: {
              credits: 6200,
              usd: 62,
              costUsd: 28,
              marginPct: 0.55,
              spenders: 140,
              guestShare: 0.44,
            },
          },
        ],
        byFeature: [
          {
            key: "chat",
            metrics: {
              credits: 11000,
              usd: 110,
              costUsd: 52,
              marginPct: 0.53,
              spenders: 200,
              guestShare: 0.4,
            },
          },
        ],
        byProvider: [
          {
            key: "Ionstream",
            metrics: {
              credits: 5000,
              usd: 50,
              costUsd: 22,
              marginPct: 0.56,
              spenders: 120,
              guestShare: 0.45,
            },
          },
        ],
        featureLabels: { generate_image: "Generate Image" },
        topSpenders: [
          {
            userId: "123e4567-e89b-12d3-a456-426614174000",
            leadId: null,
            email: "buyer@example.com",
            credits: 1400,
            usd: 14,
            freeShare: 0.1,
            costUsd: 6.2,
            marginPct: 0.55,
            purchasedShare: 0.6,
            subscriptionShare: 0.3,
            grantsShare: 0,
            unknownShare: 0,
            topModel: "deepseek-v4.1-flash",
            transactions: 220,
            lastActivity: "2026-11-21T10:00:00.000Z",
          },
        ],
      },
    },
  },
});

export type CreditUsageReportRequestOutput = typeof GET.types.RequestOutput;
export type CreditUsageReportResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
