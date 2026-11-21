/**
 * Referral Overview (admin) - Definition
 * GET: every referral code / partner in one report. KPIs with previous-period
 * deltas, trend charts, per-code table (server-side sort) and payout queue.
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
  kpiSchema,
  timeSeriesSchema,
} from "next-vibe/unified-ui/analytics/schema";
import { z } from "zod";

import { PayoutStatus, PayoutStatusDB } from "../../enum";
import {
  REFERRAL_OVERVIEW_ALIAS,
  REFERRAL_OVERVIEW_CODE_LIMIT,
  REFERRAL_OVERVIEW_CODE_LIMIT_MAX,
} from "./constants";
import {
  ReferralCodeSort,
  ReferralCodeSortDB,
  ReferralCodeSortOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

const ReferralOverviewWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ReferralOverviewWidget })),
);

export const referralCodeRowSchema = z.object({
  codeId: z.string(),
  code: z.string(),
  label: z.string().nullable(),
  isActive: z.boolean(),
  ownerUserId: z.string(),
  ownerEmail: z.string(),
  ownerName: z.string().nullable(),
  createdAt: z.string(),
  clicks: z.number(),
  leads: z.number(),
  signups: z.number(),
  payers: z.number(),
  /** signups / clicks (null without clicks) */
  conversion: z.number().nullable(),
  revenueUsd: z.number(),
  commissionUsd: z.number(),
  pendingUsd: z.number(),
  ownerPaidUsd: z.number(),
  /** Signups of the code in the previous period (null for all time). */
  signupsPrevious: z.number().nullable(),
  /** Owner (all time): open payout requests. */
  ownerQueueUsd: z.number(),
  /** Owner (all time): confirmed - paid out - open requests (negative = over-committed). */
  ownerFreeUsd: z.number(),
});
export type ReferralCodeRow = z.output<typeof referralCodeRowSchema>;

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

export const payoutQueueSchema = z.object({
  openCount: z.number(),
  openUsd: z.number(),
  byStatus: z.array(
    z.object({
      status: z.enum(PayoutStatusDB),
      count: z.number(),
      amountUsd: z.number(),
    }),
  ),
});

const exampleRow: ReferralCodeRow = {
  codeId: "123e4567-e89b-12d3-a456-426614174201",
  code: "moemoe",
  label: "YouTube video",
  isActive: true,
  ownerUserId: "123e4567-e89b-12d3-a456-426614174000",
  ownerEmail: "partner@example.test",
  ownerName: "MoeMoe AI",
  createdAt: "2026-06-20T10:00:00.000Z",
  clicks: 412,
  leads: 301,
  signups: 33,
  payers: 11,
  conversion: 0.08,
  revenueUsd: 112,
  commissionUsd: 11.2,
  pendingUsd: 6.4,
  ownerPaidUsd: 0,
  signupsPrevious: 25,
  ownerQueueUsd: 64,
  ownerFreeUsd: 12.8,
};

const exampleKpi = { value: 10, previous: 8 };

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["referral", "admin", "overview"],
  aliases: [REFERRAL_OVERVIEW_ALIAS],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  icon: "bar-chart-3",
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
    render: ReferralOverviewWidget,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),
      ...analyticsWindowFields,
      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.search.label",
        description: "get.fields.search.description",
        placeholder: "get.fields.search.placeholder",
        columns: 6,
        schema: z.string().trim().max(200).optional(),
      }),
      ownerUserId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.fields.ownerUserId.label",
        description: "get.fields.ownerUserId.description",
        hidden: true,
        schema: z.uuid().optional(),
      }),
      activeOnly: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.activeOnly.label",
        description: "get.fields.activeOnly.description",
        columns: 3,
        schema: z.boolean().optional(),
      }),
      sortBy: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.sortBy.label",
        description: "get.fields.sortBy.description",
        options: ReferralCodeSortOptions,
        columns: 3,
        schema: z.enum(ReferralCodeSortDB).default(ReferralCodeSort.REVENUE),
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.limit.label",
        description: "get.fields.limit.description",
        hidden: true,
        schema: z.coerce
          .number()
          .int()
          .min(1)
          .max(REFERRAL_OVERVIEW_CODE_LIMIT_MAX)
          .default(REFERRAL_OVERVIEW_CODE_LIMIT),
      }),

      window: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.window",
        schema: analyticsWindowSchema,
      }),
      kpis: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.kpis",
        schema: kpisSchema,
      }),
      trend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.trend",
        schema: timeSeriesSchema,
      }),
      codes: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.codes",
        schema: z.array(referralCodeRowSchema),
      }),
      overCommittedOwners: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.overCommittedOwners",
        schema: z.number(),
      }),
      codesTotal: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.codesTotal",
        schema: z.number(),
      }),
      payouts: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.payouts",
        schema: payoutQueueSchema,
      }),
    },
  }),

  examples: {
    requests: {
      default: {},
      last90Days: { range: AnalyticsRange.LAST_90_DAYS },
      search: { search: "moemoe", activeOnly: true },
      byPayers: { sortBy: ReferralCodeSort.PAYERS, limit: 10 },
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
        kpis: {
          clicks: { value: 412, previous: 300 },
          leads: { value: 301, previous: 240 },
          signups: { value: 33, previous: 25 },
          payers: { value: 11, previous: 9 },
          revenueUsd: { value: 112, previous: 80 },
          commissionUsd: { value: 11.2, previous: 8 },
          commissionPendingUsd: { value: 6.4, previous: 8 },
          commissionConfirmedUsd: { value: 4.8, previous: 0 },
          payoutsPaidUsd: { value: 40, previous: 0 },
        },
        trend: {
          buckets: ["2026-11-20", "2026-11-21"],
          series: [
            { key: "clicks", values: [20, 14] },
            { key: "leads", values: [15, 10] },
            { key: "signups", values: [2, 1] },
            { key: "payers", values: [1, 0] },
            { key: "revenue", values: [8, 0] },
            { key: "commission", values: [0.8, 0] },
          ],
        },
        codes: [exampleRow],
        codesTotal: 1,
        overCommittedOwners: 0,
        payouts: {
          openCount: 1,
          openUsd: 64,
          byStatus: [
            { status: PayoutStatus.PENDING, count: 1, amountUsd: 64 },
            { status: PayoutStatus.COMPLETED, count: 2, amountUsd: 160 },
          ],
        },
      },
      last90Days: {
        window: {
          from: "2026-08-24",
          to: "2026-11-21",
          previousFrom: "2026-05-26",
          previousTo: "2026-08-23",
          bucket: "day",
        },
        kpis: {
          clicks: exampleKpi,
          leads: exampleKpi,
          signups: exampleKpi,
          payers: exampleKpi,
          revenueUsd: exampleKpi,
          commissionUsd: exampleKpi,
          commissionPendingUsd: exampleKpi,
          commissionConfirmedUsd: exampleKpi,
          payoutsPaidUsd: exampleKpi,
        },
        trend: { buckets: [], series: [] },
        codes: [exampleRow],
        codesTotal: 1,
        overCommittedOwners: 0,
        payouts: { openCount: 0, openUsd: 0, byStatus: [] },
      },
      search: {
        window: {
          from: "2026-10-23",
          to: "2026-11-21",
          previousFrom: "2026-09-23",
          previousTo: "2026-10-22",
          bucket: "day",
        },
        kpis: {
          clicks: exampleKpi,
          leads: exampleKpi,
          signups: exampleKpi,
          payers: exampleKpi,
          revenueUsd: exampleKpi,
          commissionUsd: exampleKpi,
          commissionPendingUsd: exampleKpi,
          commissionConfirmedUsd: exampleKpi,
          payoutsPaidUsd: exampleKpi,
        },
        trend: { buckets: [], series: [] },
        codes: [exampleRow],
        codesTotal: 1,
        overCommittedOwners: 0,
        payouts: { openCount: 0, openUsd: 0, byStatus: [] },
      },
      byPayers: {
        window: {
          from: "2026-10-23",
          to: "2026-11-21",
          previousFrom: "2026-09-23",
          previousTo: "2026-10-22",
          bucket: "day",
        },
        kpis: {
          clicks: exampleKpi,
          leads: exampleKpi,
          signups: exampleKpi,
          payers: exampleKpi,
          revenueUsd: exampleKpi,
          commissionUsd: exampleKpi,
          commissionPendingUsd: exampleKpi,
          commissionConfirmedUsd: exampleKpi,
          payoutsPaidUsd: exampleKpi,
        },
        trend: { buckets: [], series: [] },
        codes: [exampleRow],
        codesTotal: 1,
        overCommittedOwners: 0,
        payouts: { openCount: 0, openUsd: 0, byStatus: [] },
      },
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

export type ReferralOverviewGetRequestOutput = typeof GET.types.RequestOutput;
export type ReferralOverviewGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
