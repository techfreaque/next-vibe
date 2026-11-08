/**
 * Growth Funnel Step - Data Source Definition
 * Journeys reaching one funnel step per time bucket, filterable by channel.
 * Client+server safe. No server imports.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import {
  lookbackRequestField,
  nodeMetaResponseField,
  rangeRequestField,
  resolutionRequestField,
  timeSeriesResponseField,
} from "next-vibe/dataflow/shared/fields";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import { requestField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import {
  AttributionTouch,
  AttributionTouchOptions,
  ChannelTypeFilter,
  ChannelTypeFilterOptions,
  FunnelStep,
  FunnelStepOptions,
} from "../../enum";
import { scopedTranslation } from "../../i18n";
import { GROWTH_FUNNEL_STEP_ALIAS } from "./constants";

const GrowthFunnelStepWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.GrowthFunnelStepWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "growth", "data-sources", "funnel-step"],
  title: "dataSources.funnelStep.post.title",
  titleShort: "dataSources.funnelStep.post.titleShort",
  description: "dataSources.funnelStep.post.description",
  icon: "activity",
  category: "analytics",
  subCategory: "leadsData",
  tags: ["tags.vibeSense" as const],
  aliases: [GROWTH_FUNNEL_STEP_ALIAS],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: GrowthFunnelStepWidget,
    noFormElement: true,
    usage: { request: "data", response: true } as const,
    children: {
      resolution: resolutionRequestField(scopedTranslation, {
        label: "dataSources.fields.resolution.label",
        description: "dataSources.fields.resolution.description",
      }),
      range: rangeRequestField(scopedTranslation, {
        label: "dataSources.fields.range.label",
        description: "dataSources.fields.range.description",
      }),
      lookback: lookbackRequestField(scopedTranslation, {
        label: "dataSources.fields.lookback.label",
        description: "dataSources.fields.lookback.description",
      }),
      step: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "dataSources.funnelStep.post.fields.step.label",
        description: "dataSources.funnelStep.post.fields.step.description",
        options: FunnelStepOptions,
        schema: z.enum(FunnelStep).default(FunnelStep.VISIT),
        columns: 6,
      }),
      touch: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "dataSources.fields.touch.label",
        description: "dataSources.fields.touch.description",
        options: AttributionTouchOptions,
        schema: z.enum(AttributionTouch).default(AttributionTouch.FIRST),
        columns: 6,
      }),
      channelType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "dataSources.fields.channelType.label",
        description: "dataSources.fields.channelType.description",
        options: ChannelTypeFilterOptions,
        schema: z.enum(ChannelTypeFilter).default(ChannelTypeFilter.ALL),
        columns: 6,
      }),
      channel: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "dataSources.fields.channel.label",
        description: "dataSources.fields.channel.description",
        schema: z.string().max(100).default(""),
        columns: 6,
      }),
      result: timeSeriesResponseField(scopedTranslation, {
        label: "dataSources.funnelStep.post.fields.result.label",
        description: "dataSources.funnelStep.post.fields.result.description",
      }),
      meta: nodeMetaResponseField(scopedTranslation, {
        label: "dataSources.fields.meta.label",
        description: "dataSources.fields.meta.description",
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
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
  examples: {
    requests: {
      default: {
        range: { from: new Date("2026-10-01"), to: new Date("2026-10-31") },
        step: FunnelStep.SIGNUP,
      },
      byChannel: {
        range: { from: new Date("2026-10-01"), to: new Date("2026-10-31") },
        step: FunnelStep.PAID,
        touch: AttributionTouch.FIRST,
        channel: "reddit",
      },
    },
    responses: {
      default: {
        result: [],
        meta: { actualResolution: "enums.resolution.1d", lookbackUsed: 0 },
      },
      byChannel: {
        result: [],
        meta: { actualResolution: "enums.resolution.1d", lookbackUsed: 0 },
      },
    },
  },
});

export type GrowthFunnelStepRequestOutput = typeof POST.types.RequestOutput;

const definitions = { POST };
export default definitions;
