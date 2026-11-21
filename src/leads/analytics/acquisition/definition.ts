/**
 * Acquisition report (GET): where visitors and leads come from, humans vs
 * bots, with drill-down into the filtered lead list.
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
  kpiSchema,
  timeSeriesSchema,
} from "next-vibe/unified-ui/analytics/schema";
import { z } from "zod";

import { LeadDimension, LeadDimensionOptions, TrafficFilter } from "../enum";
import { leadSegmentFields } from "../filters";
import { ACQUISITION_REPORT_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const AcquisitionReportWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.AcquisitionReportWidget })),
);

const kpis = z.object({
  visits: kpiSchema,
  humanVisits: kpiSchema,
  botVisits: kpiSchema,
  visitors: kpiSchema,
  humanLeads: kpiSchema,
  botLeads: kpiSchema,
  signups: kpiSchema,
  firstChats: kpiSchema,
  payers: kpiSchema,
});

const exampleKpi = { value: 120, previous: 100 };
const exampleResponse = {
  window: {
    from: "2026-10-23",
    to: "2026-11-21",
    previousFrom: "2026-09-23",
    previousTo: "2026-10-22",
    bucket: "day" as const,
  },
  kpis: {
    visits: { value: 1840, previous: 1510 },
    humanVisits: { value: 1700, previous: 1400 },
    botVisits: { value: 140, previous: 110 },
    visitors: { value: 1320, previous: 1105 },
    humanLeads: exampleKpi,
    botLeads: { value: 640, previous: 410 },
    signups: { value: 38, previous: 31 },
    firstChats: { value: 210, previous: 180 },
    payers: { value: 6, previous: 4 },
  },
  trend: {
    buckets: ["2026-11-20", "2026-11-21"],
    series: [
      { key: "humanLeads", values: [4, 6] },
      { key: "botLeads", values: [20, 18] },
    ],
  },
  breakdown: [
    {
      key: "direct",
      metrics: { visits: 900, leads: 700, botShare: 0.4, signups: 20 },
    },
  ],
  agents: [
    {
      key: "leadAnalytics.botFamily.human",
      metrics: { visits: 900, leads: 120, botShare: 0, signups: 20 },
    },
  ],
  coverage: { visitsSince: "2026-11-07", journeysSince: "2026-08-29" },
};

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "analytics", "acquisition"],
  aliases: [ACQUISITION_REPORT_ALIAS],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  category: "leads",
  subCategory: "Analytics",
  icon: "trending-up",
  tags: ["tags.leads", "tags.analytics"],
  allowedRoles: [UserRole.ADMIN],
  defaultWebPinned: [UserRole.ADMIN],

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 400,
    },
  },

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: AcquisitionReportWidget,
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
      kpis: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.kpis",
        schema: kpis,
      }),
      trend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.trend",
        schema: timeSeriesSchema,
      }),
      breakdown: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.breakdown",
        schema: breakdownSchema,
      }),
      agents: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.agents",
        schema: breakdownSchema,
      }),
      coverage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.coverage",
        schema: z.object({
          visitsSince: z.string().nullable(),
          journeysSince: z.string().nullable(),
        }),
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
      bots: {
        range: AnalyticsRange.LAST_7_DAYS,
        traffic: TrafficFilter.BOTS,
        dimension: LeadDimension.BOT_FAMILY,
      },
    },
    responses: {
      default: exampleResponse,
      bots: exampleResponse,
    },
  },
});

export type AcquisitionReportRequestOutput = typeof GET.types.RequestOutput;
export type AcquisitionReportResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
