/**
 * Abuse report (GET): lead and signup bursts per network prefix or exact user
 * agent, and free credits burned by leads that never became users.
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
  kpiSchema,
  timeSeriesSchema,
} from "next-vibe/unified-ui/analytics/schema";
import { z } from "zod";

import {
  AbuseGroupBy,
  AbuseGroupByOptions,
  BotFamily,
  TrafficFilter,
} from "../enum";
import { leadSegmentFields } from "../filters";
import { ABUSE_REPORT_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const AbuseReportWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.AbuseReportWidget })),
);

const exampleResponse = {
  window: {
    from: "2026-11-15",
    to: "2026-11-21",
    previousFrom: "2026-11-08",
    previousTo: "2026-11-14",
    bucket: "day" as const,
  },
  groupByUsed: AbuseGroupBy.IP_PREFIX,
  minLeadsUsed: 10,
  kpis: {
    flaggedClusters: { value: 3, previous: 1 },
    flaggedLeads: { value: 410, previous: 40 },
    flaggedShare: 0.31,
    freeCredits: { value: 820.5, previous: 120 },
    burners: { value: 64, previous: 30 },
  },
  trend: {
    buckets: ["2026-11-20", "2026-11-21"],
    series: [
      { key: "flagged", values: [120, 80] },
      { key: "other", values: [140, 150] },
    ],
  },
  clusters: [
    {
      key: "203.0.113.0/24",
      sample: "203.0.113.7",
      leads: 312,
      distinctOther: 41,
      signups: 2,
      freeCredits: 610,
      botShare: 0.05,
      perHour: 52,
      firstSeen: "2026-11-17 00:03",
      lastSeen: "2026-11-17 06:00",
    },
  ],
  burners: [
    {
      leadId: "123e4567-e89b-12d3-a456-426614174000",
      label: "203.0.113.7",
      ipPrefix: "203.0.113.0/24",
      botFamily: BotFamily.HUMAN,
      country: "US",
      credits: 20,
      tx: 140,
      firstAt: "2026-11-17 00:03",
      lastAt: "2026-11-17 01:10",
    },
  ],
};

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "analytics", "abuse"],
  aliases: [ABUSE_REPORT_ALIAS],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  category: "leads",
  subCategory: "Analytics",
  icon: "shield",
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
    render: AbuseReportWidget,
    children: {
      ...analyticsWindowFields,
      ...leadSegmentFields,
      groupBy: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "leadAnalytics.abuse.groupBy.label",
        description: "leadAnalytics.abuse.groupBy.description",
        options: AbuseGroupByOptions,
        columns: 3,
        schema: z.enum(AbuseGroupBy).optional(),
      }),
      minLeads: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.minLeads.label",
        description: "get.fields.minLeads.description",
        columns: 3,
        schema: z.coerce.number().int().min(2).max(10000).optional(),
      }),
      window: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.window",
        schema: analyticsWindowSchema,
      }),
      groupByUsed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.groupByUsed",
        schema: z.enum(AbuseGroupBy),
      }),
      minLeadsUsed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.minLeadsUsed",
        schema: z.number(),
      }),
      kpis: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.kpis",
        schema: z.object({
          flaggedClusters: kpiSchema,
          flaggedLeads: kpiSchema,
          flaggedShare: z.number(),
          freeCredits: kpiSchema,
          burners: kpiSchema,
        }),
      }),
      trend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.trend",
        schema: timeSeriesSchema,
      }),
      clusters: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.clusters",
        schema: z.array(
          z.object({
            key: z.string(),
            sample: z.string().nullable(),
            leads: z.number(),
            distinctOther: z.number(),
            signups: z.number(),
            freeCredits: z.number(),
            botShare: z.number(),
            perHour: z.number(),
            firstSeen: z.string(),
            lastSeen: z.string(),
          }),
        ),
      }),
      burners: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.burners",
        schema: z.array(
          z.object({
            leadId: z.string(),
            label: z.string().nullable(),
            ipPrefix: z.string().nullable(),
            botFamily: z.enum(BotFamily),
            country: z.string(),
            credits: z.number(),
            tx: z.number(),
            firstAt: z.string(),
            lastAt: z.string(),
          }),
        ),
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
      default: { range: AnalyticsRange.LAST_7_DAYS },
      userAgents: {
        range: AnalyticsRange.LAST_30_DAYS,
        groupBy: AbuseGroupBy.UA_FINGERPRINT,
        traffic: TrafficFilter.HUMANS,
        minLeads: 20,
      },
    },
    responses: {
      default: exampleResponse,
      userAgents: exampleResponse,
    },
  },
});

export type AbuseReportRequestOutput = typeof GET.types.RequestOutput;
export type AbuseReportResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
