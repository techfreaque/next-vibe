/**
 * Users Stats API Definition
 * Business dashboard: signups, active and paying users, MRR, revenue, credit
 * spend, signup-to-paid conversion and D7 retention, each against the
 * previous window, plus a time series and channel/top-spender breakdowns.
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
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
import { z } from "zod";

import { USERS_STATS_ALIAS } from "./constants";
import {
  StatsGranularity,
  StatsGranularityOptions,
  StatsRange,
  StatsRangeOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

const UsersStatsContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UsersStatsContainer })),
);

const ratioSchema = z.object({
  cohort: z.coerce.number(),
  converted: z.coerce.number(),
  rate: z.coerce.number(),
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

      range: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.range.label" as const,
        description: "fields.range.description" as const,
        options: StatsRangeOptions,
        columns: 4,
        schema: z.enum(StatsRange).default(StatsRange.LAST_30_DAYS),
      }),
      from: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "fields.from.label" as const,
        description: "fields.from.description" as const,
        columns: 3,
        schema: dateSchema.optional(),
      }),
      to: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "fields.to.label" as const,
        description: "fields.to.description" as const,
        columns: 3,
        schema: dateSchema.optional(),
      }),
      granularity: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.granularity.label" as const,
        description: "fields.granularity.description" as const,
        options: StatsGranularityOptions,
        columns: 3,
        schema: z.enum(StatsGranularity).default(StatsGranularity.AUTO),
      }),
      includeInternal: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.includeInternal.label" as const,
        description: "fields.includeInternal.description" as const,
        columns: 3,
        schema: z.boolean().default(false),
      }),

      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        usage: { request: "data" },
      }),

      period: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.period" as const,
        schema: z.object({
          from: z.coerce.date(),
          to: z.coerce.date(),
          previousFrom: z.coerce.date(),
          days: z.coerce.number(),
          granularity: z.enum(["day", "week", "month"]),
        }),
      }),

      kpis: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.kpis" as const,
        schema: z.object({
          totalUsers: z.coerce.number(),
          newUsers: z.coerce.number(),
          newUsersPrev: z.coerce.number(),
          activeUsers: z.coerce.number(),
          activeUsersPrev: z.coerce.number(),
          anonymousActive: z.coerce.number(),
          payingUsers: z.coerce.number(),
          payingUsersPrev: z.coerce.number(),
          payingUsersAllTime: z.coerce.number(),
          activeSubscribers: z.coerce.number(),
          pastDueSubscribers: z.coerce.number(),
          mrrUsd: z.coerce.number(),
          revenueUsd: z.coerce.number(),
          revenuePrevUsd: z.coerce.number(),
          refundsUsd: z.coerce.number(),
          revenueAllTimeUsd: z.coerce.number(),
          creditsSpent: z.coerce.number(),
          creditsSpentPrev: z.coerce.number(),
          signupToPaid: ratioSchema,
          retentionD7: ratioSchema,
        }),
      }),

      series: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.series" as const,
        schema: z.array(
          z.object({
            bucket: z.coerce.date(),
            signups: z.coerce.number(),
            activeUsers: z.coerce.number(),
            payingUsers: z.coerce.number(),
            revenueUsd: z.coerce.number(),
            creditsSpent: z.coerce.number(),
          }),
        ),
      }),

      channels: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.channels" as const,
        schema: z.array(
          z.object({
            channel: z.string(),
            signups: z.coerce.number(),
            paying: z.coerce.number(),
          }),
        ),
      }),

      revenueByCurrency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.revenueByCurrency" as const,
        schema: z.array(
          z.object({
            currency: z.string(),
            amount: z.coerce.number(),
            amountUsd: z.coerce.number(),
            count: z.coerce.number(),
          }),
        ),
      }),

      subscriptionsByStatus: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.subscriptionsByStatus" as const,
        schema: z.array(
          z.object({
            status: z.string(),
            count: z.coerce.number(),
          }),
        ),
      }),

      topSpenders: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.topSpenders" as const,
        schema: z.array(
          z.object({
            userId: z.string(),
            email: z.string(),
            creditsSpent: z.coerce.number(),
            totalPaidUsd: z.coerce.number(),
          }),
        ),
      }),

      generatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.generatedAt" as const,
        schema: z.coerce.date(),
      }),
    },
  }),

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 300,
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
      quarter: {
        range: StatsRange.LAST_90_DAYS,
        granularity: StatsGranularity.WEEK,
      },
    },
    responses: {
      default: {
        period: {
          from: "2026-10-13T00:00:00.000Z",
          to: "2026-11-12T23:59:59.999Z",
          previousFrom: "2026-09-13T00:00:00.000Z",
          days: 31,
          granularity: "day",
        },
        kpis: {
          totalUsers: 381,
          newUsers: 91,
          newUsersPrev: 120,
          activeUsers: 140,
          activeUsersPrev: 110,
          anonymousActive: 900,
          payingUsers: 10,
          payingUsersPrev: 7,
          payingUsersAllTime: 30,
          activeSubscribers: 12,
          pastDueSubscribers: 3,
          mrrUsd: 98.5,
          revenueUsd: 112.4,
          revenuePrevUsd: 90.1,
          refundsUsd: 0,
          revenueAllTimeUsd: 470.2,
          creditsSpent: 11800,
          creditsSpentPrev: 9000,
          signupToPaid: { cohort: 91, converted: 4, rate: 0.044 },
          retentionD7: { cohort: 70, converted: 21, rate: 0.3 },
        },
        series: [
          {
            bucket: "2026-11-12T00:00:00.000Z",
            signups: 4,
            activeUsers: 30,
            payingUsers: 1,
            revenueUsd: 8.64,
            creditsSpent: 420,
          },
        ],
        channels: [{ channel: "direct", signups: 80, paying: 3 }],
        revenueByCurrency: [
          { currency: "USD", amount: 56, amountUsd: 56, count: 7 },
        ],
        subscriptionsByStatus: [{ status: "enums.status.active", count: 12 }],
        topSpenders: [
          {
            userId: "123e4567-e89b-12d3-a456-426614174000",
            email: "user@example.com",
            creditsSpent: 2096,
            totalPaidUsd: 30.24,
          },
        ],
        generatedAt: "2026-11-12T21:00:00.000Z",
      },
      quarter: {
        period: {
          from: "2026-08-14T00:00:00.000Z",
          to: "2026-11-12T23:59:59.999Z",
          previousFrom: "2026-05-16T00:00:00.000Z",
          days: 91,
          granularity: "week",
        },
        kpis: {
          totalUsers: 381,
          newUsers: 300,
          newUsersPrev: 50,
          activeUsers: 250,
          activeUsersPrev: 40,
          anonymousActive: 3000,
          payingUsers: 25,
          payingUsersPrev: 2,
          payingUsersAllTime: 30,
          activeSubscribers: 12,
          pastDueSubscribers: 3,
          mrrUsd: 98.5,
          revenueUsd: 400,
          revenuePrevUsd: 20,
          refundsUsd: 0,
          revenueAllTimeUsd: 470.2,
          creditsSpent: 50000,
          creditsSpentPrev: 3000,
          signupToPaid: { cohort: 300, converted: 20, rate: 0.067 },
          retentionD7: { cohort: 280, converted: 70, rate: 0.25 },
        },
        series: [],
        channels: [],
        revenueByCurrency: [],
        subscriptionsByStatus: [],
        topSpenders: [],
        generatedAt: "2026-11-12T21:00:00.000Z",
      },
    },
  },
});

export type UserStatsRequestOutput = typeof GET.types.RequestOutput;
export type UserStatsResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
