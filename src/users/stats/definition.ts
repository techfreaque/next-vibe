/**
 * Signups report (alias users-stats).
 * Who signed up, from where, did they verify, are they active, did they pay,
 * and who burns free credits. Every number is computed for the same filtered
 * cohort as users-list (shared filter fields + SQL), so each tile, bar and row
 * drills into the exact list of accounts behind it.
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
  widgetField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import {
  AnalyticsGranularity,
  AnalyticsRange,
  AnalyticsRangeOptions,
} from "next-vibe/unified-ui/analytics/enum";
import { analyticsWindowFields } from "next-vibe/unified-ui/analytics/fields";
import {
  analyticsWindowSchema,
  breakdownSchema,
  funnelSchema,
  kpiSchema,
  timeSeriesSchema,
} from "next-vibe/unified-ui/analytics/schema";
import { z } from "zod";

import { UsersAudience, UsersAudienceOptions } from "../list/enum";
import { userCohortFilterFields } from "../list/filter-fields";
import { scopedTranslation as listScopedTranslation } from "../list/i18n";
import { USERS_STATS_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const UsersStatsContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UsersStatsContainer })),
);

const freeBurnerSchema = z.object({
  userId: z.string(),
  email: z.string(),
  creditsSpent: z.coerce.number(),
  creditsSpentTotal: z.coerce.number(),
  creditBalance: z.coerce.number(),
  /** Free credits granted to the account and its linked guest wallets. */
  creditsGranted: z.coerce.number(),
  signedUpAt: z.coerce.date(),
  isBanned: z.boolean(),
  emailVerified: z.boolean(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["users", "stats"],
  aliases: [USERS_STATS_ALIAS],
  title: "title" as const,
  titleShort: "titleShort",
  description: "description" as const,
  icon: "bar-chart-3",
  category: "account",
  subCategory: "userStats",
  tags: ["tag" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: UsersStatsContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      ...analyticsWindowFields,
      range: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "analytics.range.label",
        description: "analytics.range.description",
        options: AnalyticsRangeOptions,
        columns: 4,
        schema: z.enum(AnalyticsRange).default(AnalyticsRange.LAST_7_DAYS),
      }),
      ...userCohortFilterFields,
      // Reports count humans by default; the list counts everyone.
      audience: requestField(listScopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.audience.label" as const,
        description: "get.fields.audience.description" as const,
        options: UsersAudienceOptions,
        columns: 4,
        schema: z.enum(UsersAudience).default(UsersAudience.HUMANS),
      }),

      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        usage: { request: "data" },
      }),

      window: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.window" as const,
        schema: analyticsWindowSchema,
      }),
      kpis: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.kpis" as const,
        schema: z.object({
          signups: kpiSchema,
          verifiedRate: kpiSchema,
          /** Share of the period's signups that spent credits (ever). */
          activatedRate: kpiSchema,
          paidConversion: kpiSchema,
          activeUsers: kpiSchema,
          payingUsers: kpiSchema,
          revenueUsd: kpiSchema,
          freeBurnCredits: kpiSchema,
          banned: kpiSchema,
        }),
      }),
      totals: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.totals" as const,
        schema: z.object({
          /** Accounts in the cohort, any signup date. */
          cohortUsers: z.coerce.number(),
          verified: z.coerce.number(),
          converted: z.coerce.number(),
          activated: z.coerce.number(),
          freeBurners: z.coerce.number(),
        }),
      }),
      signupTrend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.signupTrend" as const,
        schema: timeSeriesSchema,
      }),
      activityTrend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.activityTrend" as const,
        schema: timeSeriesSchema,
      }),
      funnel: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.funnel" as const,
        schema: funnelSchema,
      }),
      byChannel: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.byChannel" as const,
        schema: breakdownSchema,
      }),
      byRefCode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.byRefCode" as const,
        schema: breakdownSchema,
      }),
      byPlan: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.byPlan" as const,
        schema: breakdownSchema,
      }),
      byLocale: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.byLocale" as const,
        schema: breakdownSchema,
      }),
      freeBurners: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.freeBurners" as const,
        schema: z.array(freeBurnerSchema),
      }),
    },
  }),

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 0,
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title" as const,
      description: "errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "success.title" as const,
    description: "success.description" as const,
  },

  examples: {
    requests: {
      default: {},
      youtubeQuarter: {
        range: AnalyticsRange.LAST_90_DAYS,
        granularity: AnalyticsGranularity.WEEK,
        channel: "youtube",
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
        kpis: {
          signups: { value: 91, previous: 120 },
          verifiedRate: { value: 0.62, previous: 0.58 },
          activatedRate: { value: 0.4, previous: 0.35 },
          paidConversion: { value: 0.044, previous: 0.03 },
          activeUsers: { value: 140, previous: 110 },
          payingUsers: { value: 10, previous: 7 },
          revenueUsd: { value: 112.4, previous: 90.1 },
          freeBurnCredits: { value: 5400, previous: 3900 },
          banned: { value: 2, previous: 0 },
        },
        totals: {
          cohortUsers: 381,
          verified: 56,
          converted: 4,
          activated: 36,
          freeBurners: 31,
        },
        signupTrend: {
          buckets: ["2026-11-20", "2026-11-21"],
          series: [
            { key: "paid", values: [1, 0] },
            { key: "verified", values: [2, 1] },
            { key: "unverified", values: [1, 2] },
          ],
        },
        activityTrend: {
          buckets: ["2026-11-20", "2026-11-21"],
          series: [
            { key: "active", values: [30, 28] },
            { key: "paying", values: [1, 0] },
          ],
        },
        funnel: [
          { key: "signups", value: 91 },
          { key: "verified", value: 56 },
          { key: "active", value: 40 },
          { key: "paid", value: 4 },
          { key: "subscribed", value: 3 },
        ],
        byChannel: [
          {
            key: "youtube",
            metrics: { signups: 40, verified: 30, paid: 3, revenueUsd: 24 },
          },
        ],
        byRefCode: [
          {
            key: "FRIEND2024",
            metrics: { signups: 12, verified: 9, paid: 1, revenueUsd: 8 },
          },
        ],
        byPlan: [
          {
            key: "enums.plan.plus",
            metrics: { subscribers: 3, revenueUsd: 60 },
          },
        ],
        byLocale: [{ key: "en-US", metrics: { signups: 50, paid: 2 } }],
        freeBurners: [
          {
            userId: "123e4567-e89b-12d3-a456-426614174000",
            email: "user@example.com",
            creditsSpent: 2096,
            creditsSpentTotal: 4100,
            creditBalance: 12,
            creditsGranted: 300,
            signedUpAt: "2026-11-02T10:00:00.000Z",
            isBanned: false,
            emailVerified: true,
          },
        ],
      },
      youtubeQuarter: {
        window: {
          from: "2026-08-24",
          to: "2026-11-21",
          previousFrom: "2026-05-26",
          previousTo: "2026-08-23",
          bucket: "week",
        },
        kpis: {
          signups: { value: 0, previous: 0 },
          verifiedRate: { value: 0, previous: 0 },
          activatedRate: { value: 0, previous: 0 },
          paidConversion: { value: 0, previous: 0 },
          activeUsers: { value: 0, previous: 0 },
          payingUsers: { value: 0, previous: 0 },
          revenueUsd: { value: 0, previous: 0 },
          freeBurnCredits: { value: 0, previous: 0 },
          banned: { value: 0, previous: 0 },
        },
        totals: {
          cohortUsers: 0,
          verified: 0,
          converted: 0,
          activated: 0,
          freeBurners: 0,
        },
        signupTrend: { buckets: [], series: [] },
        activityTrend: { buckets: [], series: [] },
        funnel: [],
        byChannel: [],
        byRefCode: [],
        byPlan: [],
        byLocale: [],
        freeBurners: [],
      },
    },
  },
});

export type UserStatsRequestOutput = typeof GET.types.RequestOutput;
export type UserStatsResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
