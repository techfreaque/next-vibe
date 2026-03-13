/**
 * Vibe Sense — MACD (Moving Average Convergence Divergence) Endpoint Definition
 *
 * Client+server safe. No server imports.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  lookbackRequestField,
  nodeMetaResponseField,
  rangeRequestField,
  resolutionRequestField,
  timeSeriesRequestField,
  timeSeriesResponseField,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";
import { MACD_ALIAS } from "./constants";

const { POST } = createEndpoint({
  scopedTranslation,
  aliases: [MACD_ALIAS],
  method: Methods.POST,
  path: ["system", "unified-interface", "vibe-sense", "indicators", "macd"],
  title: "post.title",
  description: "post.description",
  icon: "activity",
  category: "app.endpointCategories.analyticsIndicators",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      source: timeSeriesRequestField(scopedTranslation, {
        label: "post.fields.source.label",
        description: "post.fields.source.description",
      }),
      resolution: resolutionRequestField(scopedTranslation, {
        label: "post.fields.resolution.label",
        description: "post.fields.resolution.description",
      }),
      range: rangeRequestField(scopedTranslation, {
        label: "post.fields.range.label",
        description: "post.fields.range.description",
      }),
      lookback: lookbackRequestField(scopedTranslation, {
        label: "post.fields.lookback.label",
        description: "post.fields.lookback.description",
      }),
      fastPeriod: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.fastPeriod.label",
        description: "post.fields.fastPeriod.description",
        schema: z.number().int().min(1).max(100),
        columns: 4,
      }),
      slowPeriod: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.slowPeriod.label",
        description: "post.fields.slowPeriod.description",
        schema: z.number().int().min(1).max(200),
        columns: 4,
      }),
      signalPeriod: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.signalPeriod.label",
        description: "post.fields.signalPeriod.description",
        schema: z.number().int().min(1).max(50),
        columns: 4,
      }),
      macd: timeSeriesResponseField(scopedTranslation, {
        label: "post.fields.macd.label",
        description: "post.fields.macd.description",
      }),
      signal: timeSeriesResponseField(scopedTranslation, {
        label: "post.fields.signal.label",
        description: "post.fields.signal.description",
      }),
      histogram: timeSeriesResponseField(scopedTranslation, {
        label: "post.fields.histogram.label",
        description: "post.fields.histogram.description",
      }),
      meta: nodeMetaResponseField(scopedTranslation, {
        label: "post.fields.meta.label",
        description: "post.fields.meta.description",
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
  examples: {
    requests: {
      default: {
        source: [
          { timestamp: new Date("2024-01-01"), value: 100 },
          { timestamp: new Date("2024-01-02"), value: 102 },
          { timestamp: new Date("2024-01-03"), value: 101 },
        ],
        range: {
          from: new Date("2024-01-01"),
          to: new Date("2024-01-03"),
        },
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
      },
    },
    responses: {
      default: {
        macd: [{ timestamp: new Date("2024-01-03"), value: 0.5 }],
        signal: [{ timestamp: new Date("2024-01-03"), value: 0.3 }],
        histogram: [{ timestamp: new Date("2024-01-03"), value: 0.2 }],
        meta: { actualResolution: "enums.resolution.1d", lookbackUsed: 0 },
      },
    },
  },
});

const definitions = { POST };
export default definitions;
