/**
 * Web Vitals (real-user monitoring)
 * POST: the browser reports LCP/INP/CLS/TTFB/FCP of one page view (public, bots dropped).
 * GET: admin report, p75 and good/poor share per page type and metric.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import {
  WebVitalDevice,
  WebVitalDeviceDB,
  WebVitalDeviceOptions,
  WebVitalMetric,
  WebVitalMetricDB,
  WebVitalPageTypeDB,
  WebVitalRating,
  WebVitalRatingDB,
} from "./enum";
import { scopedTranslation } from "./i18n";

const WebVitalsReportWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.WebVitalsReportWidget })),
);
const WebVitalsIngestWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.WebVitalsIngestWidget })),
);

export const WEB_VITALS_PATH = ["analytics", "web-vitals"] as const;
export const WEB_VITALS_ALIAS = "web-vitals" as const;

/** One page view reports at most one value per metric. */
const MAX_METRICS_PER_VIEW = 5;

const errorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.network.title" as const,
    description: "errors.network.description" as const,
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
} as const;

export const webVitalMeasurementSchema = z.object({
  metric: z.enum(WebVitalMetricDB),
  /** ms, or the unitless CLS score */
  value: z.number().min(0).max(600_000),
  rating: z.enum(WebVitalRatingDB),
  navigationType: z
    .string()
    .regex(/^[a-z-]{1,24}$/)
    .optional(),
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: WEB_VITALS_PATH,
  aliases: ["report-web-vitals"],
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "analytics",
  subCategory: "Business",
  icon: "activity" as const,
  tags: ["tags.performance" as const, "tags.seo" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_OFF,
    UserRole.SKILL_OFF,
  ] as const,
  fields: customWidgetObject({
    render: WebVitalsIngestWidget,
    usage: { request: "data", response: true },
    children: {
      path: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.path" as const,
        schema: z
          .string()
          .max(200)
          .regex(/^\/[^?#\s]*$/),
      }),
      device: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.device" as const,
        options: WebVitalDeviceOptions,
        schema: z.enum(WebVitalDeviceDB),
      }),
      metrics: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.metrics" as const,
        // Machine-measured by the browser; no form can produce it
        hidden: true,
        schema: z
          .array(webVitalMeasurementSchema)
          .min(1)
          .max(MAX_METRICS_PER_VIEW),
      }),
      recorded: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.recorded" as const,
        schema: z.number().int(),
      }),
    },
  }),
  errorTypes,
  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },
  examples: {
    requests: {
      default: {
        path: "/en-US/story",
        device: WebVitalDevice.MOBILE,
        metrics: [
          {
            metric: WebVitalMetric.LCP,
            value: 2100,
            rating: WebVitalRating.GOOD,
            navigationType: "navigate",
          },
        ],
      },
    },
    responses: { default: { recorded: 1 } },
  },
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: WEB_VITALS_PATH,
  aliases: [WEB_VITALS_ALIAS],
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  category: "analytics",
  subCategory: "Business",
  icon: "activity" as const,
  tags: ["tags.performance" as const, "tags.seo" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  options: { formOptions: { autoSubmit: true, debounceMs: 300 } },
  fields: customWidgetObject({
    render: WebVitalsReportWidget,
    usage: { request: "data", response: true },
    children: {
      days: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.days" as const,
        schema: z.coerce.number().int().min(1).max(90).default(28),
      }),
      device: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.device" as const,
        options: WebVitalDeviceOptions,
        schema: z.enum(WebVitalDeviceDB).default(WebVitalDevice.MOBILE),
      }),
      since: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.since" as const,
        schema: z.string(),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.total" as const,
        schema: z.number().int(),
      }),
      rows: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          usage: { response: true },
          children: {
            pageType: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.pageType" as const,
              schema: z.enum(WebVitalPageTypeDB),
            }),
            metric: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.metric" as const,
              schema: z.enum(WebVitalMetricDB),
            }),
            samples: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.samples" as const,
              schema: z.number().int(),
            }),
            p75: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.p75" as const,
              schema: z.number(),
            }),
            goodShare: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.goodShare" as const,
              schema: z.number(),
            }),
            poorShare: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.poorShare" as const,
              schema: z.number(),
            }),
            rating: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.rating" as const,
              schema: z.enum(WebVitalRatingDB),
            }),
          },
        }),
      }),
    },
  }),
  errorTypes,
  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },
  examples: {
    requests: { default: { days: 28, device: WebVitalDevice.MOBILE } },
    responses: {
      default: { since: "2026-10-30T00:00:00.000Z", total: 0, rows: [] },
    },
  },
});

export type WebVitalsPostRequest = typeof POST.types.RequestOutput;
export type WebVitalsPostResponse = typeof POST.types.ResponseOutput;
export type WebVitalsGetRequest = typeof GET.types.RequestOutput;
export type WebVitalsGetResponse = typeof GET.types.ResponseOutput;

const endpoints = { GET, POST };
export default endpoints;
