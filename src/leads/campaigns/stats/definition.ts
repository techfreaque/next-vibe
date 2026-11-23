/**
 * Campaign performance report (alias campaign-stats).
 * Is the email engine running, what is stuck in the queue, and how do the
 * journeys perform: sent, opened, clicked, unsubscribed, bounced and failed
 * over time, per journey variant, stage and locale. Every tile, bar and row
 * drills into the campaign queue (leads) with the same filters.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import {
  EmailCampaignStageFilter,
  EmailCampaignStageFilterOptions,
  EmailJourneyVariantFilter,
  EmailJourneyVariantFilterOptions,
} from "next-vibe/identity/lead/enum";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  requestField,
  responseField,
  widgetField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { analyticsWindowFields } from "next-vibe/unified-ui/analytics/fields";
import {
  analyticsWindowSchema,
  breakdownSchema,
  funnelSchema,
  kpiSchema,
  timeSeriesSchema,
} from "next-vibe/unified-ui/analytics/schema";
import { z } from "zod";

import { CAMPAIGN_STATS_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const CampaignStatsWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CampaignStatsWidget })),
);

/** Scheduler state of one campaign cron task. */
export const CAMPAIGN_TASK_STATES = [
  "missing",
  "disabled",
  "failing",
  "running",
  "dryRun",
  "delayed",
  "waiting",
] as const;

const automationSchema = z.object({
  id: z.string(),
  state: z.enum(CAMPAIGN_TASK_STATES),
  schedule: z.string().nullable(),
  lastRunAt: z.string().nullable(),
  nextRunAt: z.string().nullable(),
  consecutiveFailures: z.number(),
  lastError: z.string().nullable(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "campaigns", "stats"],
  aliases: [CAMPAIGN_STATS_ALIAS] as const,
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  category: "newsletter",
  subCategory: "emailCampaignsStats",
  icon: "bar-chart-3",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],
  defaultWebPinned: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: CampaignStatsWidget,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),
      ...analyticsWindowFields,
      journeyVariant: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.journeyVariant.label",
        description: "get.fields.journeyVariant.description",
        placeholder: "get.fields.journeyVariant.placeholder",
        options: EmailJourneyVariantFilterOptions,
        columns: 4,
        schema: z.enum(EmailJourneyVariantFilter).optional(),
      }),
      stage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.stage.label",
        description: "get.fields.stage.description",
        placeholder: "get.fields.stage.placeholder",
        options: EmailCampaignStageFilterOptions,
        columns: 4,
        schema: z.enum(EmailCampaignStageFilter).optional(),
      }),
      locale: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.locale.label",
        description: "get.fields.locale.description",
        placeholder: "get.fields.locale.placeholder",
        columns: 4,
        schema: z.string().trim().max(20).optional(),
      }),

      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        usage: { request: "data" },
      }),

      window: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.window",
        schema: analyticsWindowSchema,
      }),
      engine: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.engine",
        schema: z.object({
          /** Dispatcher (email-campaigns task) state: the one that sends. */
          dispatcher: automationSchema,
          tasks: z.array(automationSchema),
        }),
      }),
      queue: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.queue",
        schema: z.object({
          dueNow: z.number(),
          overdue24h: z.number(),
          scheduled: z.number(),
          scheduledNext24h: z.number(),
          failed7d: z.number(),
          /** Distinct leads behind dueNow (what campaign-queue lists). */
          dueLeads: z.number(),
          lastSentAt: z.string().nullable(),
          sent24h: z.number(),
          stuckClaims: z.number(),
          oldestDueAt: z.string().nullable(),
          /** Whole days since the oldest due email was scheduled (0 = none). */
          oldestDueDays: z.number(),
          nextScheduledAt: z.string().nullable(),
          leadsInCampaign: z.number(),
        }),
      }),
      kpis: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.kpis",
        schema: z.object({
          sent: kpiSchema,
          openRate: kpiSchema,
          clickRate: kpiSchema,
          unsubscribed: kpiSchema,
          bounced: kpiSchema,
          failed: kpiSchema,
        }),
      }),
      totals: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.totals",
        schema: z.object({
          opened: z.number(),
          clicked: z.number(),
          /** Failed rows that are dedupe/status skips, not send errors. */
          skipped: z.number(),
        }),
      }),
      trend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.trend",
        schema: timeSeriesSchema,
      }),
      problems: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.problems",
        schema: timeSeriesSchema,
      }),
      variantTrend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.variantTrend",
        schema: timeSeriesSchema,
      }),
      funnel: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.funnel",
        schema: funnelSchema,
      }),
      byVariant: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.byVariant",
        schema: breakdownSchema,
      }),
      byStage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.byStage",
        schema: breakdownSchema,
      }),
      byLocale: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.byLocale",
        schema: breakdownSchema,
      }),
      topErrors: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.topErrors",
        schema: breakdownSchema,
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
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    requests: {
      default: {},
      sideHustle: {
        journeyVariant: EmailJourneyVariantFilter.SIDE_HUSTLE,
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
        engine: {
          dispatcher: {
            id: "email-campaigns",
            state: "missing",
            schedule: null,
            lastRunAt: null,
            nextRunAt: null,
            consecutiveFailures: 0,
            lastError: null,
          },
          tasks: [],
        },
        queue: {
          dueNow: 1200,
          overdue24h: 1100,
          scheduled: 40,
          scheduledNext24h: 12,
          failed7d: 3,
          dueLeads: 480,
          lastSentAt: "2026-11-02T09:00:00.000Z",
          sent24h: 0,
          stuckClaims: 0,
          oldestDueAt: "2026-10-02T00:34:57.889Z",
          oldestDueDays: 50,
          nextScheduledAt: "2026-11-22T08:00:00.000Z",
          leadsInCampaign: 89,
        },
        kpis: {
          sent: { value: 420, previous: 380 },
          openRate: { value: 0.41, previous: 0.38 },
          clickRate: { value: 0.12, previous: 0.1 },
          unsubscribed: { value: 3, previous: 5 },
          bounced: { value: 2, previous: 1 },
          failed: { value: 4, previous: 0 },
        },
        totals: { opened: 172, clicked: 50, skipped: 12 },
        trend: {
          buckets: ["2026-11-20", "2026-11-21"],
          series: [
            { key: "sent", values: [20, 18] },
            { key: "opened", values: [8, 9] },
            { key: "clicked", values: [2, 3] },
          ],
        },
        problems: {
          buckets: ["2026-11-20", "2026-11-21"],
          series: [
            { key: "failed", values: [0, 1] },
            { key: "bounced", values: [0, 0] },
            { key: "unsubscribed", values: [1, 0] },
          ],
        },
        variantTrend: {
          buckets: ["2026-11-20", "2026-11-21"],
          series: [
            { key: "enums.emailJourneyVariant.sideHustle", values: [8, 6] },
          ],
        },
        funnel: [
          { key: "sent", value: 420 },
          { key: "opened", value: 172 },
          { key: "clicked", value: 50 },
        ],
        byVariant: [
          {
            key: "enums.emailJourneyVariant.sideHustle",
            metrics: {
              sent: 140,
              opened: 60,
              clicked: 20,
              openRate: 0.43,
              clickRate: 0.14,
              unsubscribed: 1,
              bounced: 0,
              due: 300,
            },
          },
        ],
        byStage: [],
        byLocale: [],
        topErrors: [{ key: "SMTP timeout", metrics: { count: 4 } }],
      },
      sideHustle: {
        window: {
          from: "2026-10-23",
          to: "2026-11-21",
          previousFrom: "2026-09-23",
          previousTo: "2026-10-22",
          bucket: "day",
        },
        engine: {
          dispatcher: {
            id: "email-campaigns",
            state: "running",
            schedule: "*/5 * * * *",
            lastRunAt: "2026-11-21T10:00:00.000Z",
            nextRunAt: "2026-11-21T10:05:00.000Z",
            consecutiveFailures: 0,
            lastError: null,
          },
          tasks: [],
        },
        queue: {
          dueNow: 0,
          overdue24h: 0,
          scheduled: 0,
          scheduledNext24h: 0,
          failed7d: 0,
          dueLeads: 0,
          lastSentAt: "2026-11-21T10:00:00.000Z",
          sent24h: 120,
          stuckClaims: 0,
          oldestDueAt: null,
          oldestDueDays: 0,
          nextScheduledAt: null,
          leadsInCampaign: 0,
        },
        kpis: {
          sent: { value: 0, previous: 0 },
          openRate: { value: 0, previous: 0 },
          clickRate: { value: 0, previous: 0 },
          unsubscribed: { value: 0, previous: 0 },
          bounced: { value: 0, previous: 0 },
          failed: { value: 0, previous: 0 },
        },
        totals: { opened: 0, clicked: 0, skipped: 0 },
        trend: { buckets: [], series: [] },
        problems: { buckets: [], series: [] },
        variantTrend: { buckets: [], series: [] },
        funnel: [],
        byVariant: [],
        byStage: [],
        byLocale: [],
        topErrors: [],
      },
    },
  },
});

export type CampaignStatsGetRequestOutput = typeof GET.types.RequestOutput;
export type CampaignStatsGetResponseOutput = typeof GET.types.ResponseOutput;
export type CampaignAutomation =
  CampaignStatsGetResponseOutput["engine"]["dispatcher"];

const definitions = { GET };
export default definitions;
