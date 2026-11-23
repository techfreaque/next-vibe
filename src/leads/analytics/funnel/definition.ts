/**
 * Funnel report (GET): leads created in the period and how far they got
 * (human, first chat, signup, email confirmed, paid), overall and per segment,
 * plus the signup confirmation steps and the conversion walls (out of
 * credits, 18+ consent declined).
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
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { AnalyticsRange } from "next-vibe/unified-ui/analytics/enum";
import { analyticsWindowFields } from "next-vibe/unified-ui/analytics/fields";
import {
  analyticsWindowSchema,
  breakdownSchema,
  funnelSchema,
  timeSeriesSchema,
} from "next-vibe/unified-ui/analytics/schema";
import { z } from "zod";

import { LeadDimension, LeadDimensionOptions } from "../enum";
import { leadSegmentFields } from "../filters";
import { FUNNEL_REPORT_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const FunnelReportWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.FunnelReportWidget })),
);

const steps = [
  { key: "leads", value: 900 },
  { key: "humans", value: 420 },
  { key: "firstChats", value: 190 },
  { key: "signups", value: 42 },
  { key: "emailConfirmed", value: 30 },
  { key: "payers", value: 5 },
];
const signupSteps = [
  { key: "started", value: 49 },
  { key: "emailSent", value: 49 },
  { key: "sendFailed", value: 0 },
  { key: "bounced", value: 2 },
  { key: "expired", value: 11 },
  { key: "reminded", value: 9 },
  { key: "confirmed", value: 38 },
];
const wallSteps = [
  { key: "creditWallGuests", value: 120 },
  { key: "creditWallAccounts", value: 16 },
  { key: "consentDeclined", value: 9 },
];
const exampleResponse = {
  window: {
    from: "2026-10-23",
    to: "2026-11-21",
    previousFrom: "2026-09-23",
    previousTo: "2026-10-22",
    bucket: "day" as const,
  },
  dimensionUsed: LeadDimension.CHANNEL,
  steps,
  previousSteps: steps,
  rates: { signupRate: 0.1, payRate: 0.12, overall: 0.012 },
  segments: [
    {
      key: "direct",
      metrics: { leads: 600, humans: 300, signups: 20, signupRate: 0.067 },
    },
  ],
  trend: {
    buckets: ["2026-11-20", "2026-11-21"],
    series: [{ key: "humans", values: [12, 15] }],
  },
  signupSteps,
  previousSignupSteps: signupSteps,
  signupTrackedSince: "2026-11-22",
  signupSegments: [
    {
      key: "direct",
      metrics: { started: 30, emailSent: 30, confirmed: 24, confirmRate: 0.8 },
    },
  ],
  wallSteps,
  previousWallSteps: null,
  wallTrackedSince: "2026-11-24",
  wallSegments: [
    {
      key: "direct",
      metrics: {
        creditWallGuests: 40,
        creditWallAccounts: 5,
        consentDeclined: 3,
      },
    },
  ],
};

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "analytics", "funnel"],
  aliases: [FUNNEL_REPORT_ALIAS],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  category: "leads",
  subCategory: "Analytics",
  icon: "filter",
  tags: ["tags.leads", "tags.analytics"],
  allowedRoles: [UserRole.ADMIN],

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 400,
    },
  },

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: FunnelReportWidget,
    children: {
      ...analyticsWindowFields,
      ...leadSegmentFields,
      dimension: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "leadAnalytics.dimension.label",
        description: "leadAnalytics.dimension.description",
        options: LeadDimensionOptions,
        columns: 3,
        schema: z.enum(LeadDimension).optional(),
      }),
      window: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.window",
        schema: analyticsWindowSchema,
      }),
      dimensionUsed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.dimensionUsed",
        schema: z.enum(LeadDimension),
      }),
      steps: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.steps",
        schema: funnelSchema,
      }),
      previousSteps: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.previousSteps",
        schema: funnelSchema.nullable(),
      }),
      rates: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.rates",
        schema: z.record(z.string(), z.number()),
      }),
      segments: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.segments",
        schema: breakdownSchema,
      }),
      trend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.trend",
        schema: timeSeriesSchema,
      }),
      signupSteps: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.signupSteps",
        schema: funnelSchema,
      }),
      previousSignupSteps: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.previousSignupSteps",
        schema: funnelSchema.nullable(),
      }),
      signupSegments: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.signupSegments",
        schema: breakdownSchema,
      }),
      signupTrackedSince: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.signupTrackedSince",
        schema: z.string().nullable(),
      }),
      wallSteps: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.wallSteps",
        schema: funnelSchema,
      }),
      previousWallSteps: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.previousWallSteps",
        schema: funnelSchema.nullable(),
      }),
      wallSegments: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.wallSegments",
        schema: breakdownSchema,
      }),
      wallTrackedSince: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.wallTrackedSince",
        schema: z.string().nullable(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },
  examples: {
    requests: {
      default: { range: AnalyticsRange.LAST_30_DAYS },
      byRefCode: {
        range: AnalyticsRange.LAST_90_DAYS,
        dimension: LeadDimension.REF_CODE,
      },
    },
    responses: {
      default: exampleResponse,
      byRefCode: exampleResponse,
    },
  },
});

export type FunnelReportRequestOutput = typeof GET.types.RequestOutput;
export type FunnelReportResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
