/**
 * Growth Channel Spend - Data Source Definition
 * Logged channel spend per time bucket, spread evenly over each period.
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
import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import { requestField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { SpendCurrencyOptions } from "../../enum";
import { scopedTranslation } from "../../i18n";
import { GROWTH_CHANNEL_SPEND_ALIAS } from "./constants";

const GrowthChannelSpendWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.GrowthChannelSpendWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "growth", "data-sources", "channel-spend"],
  title: "dataSources.channelSpend.post.title",
  titleShort: "dataSources.channelSpend.post.titleShort",
  description: "dataSources.channelSpend.post.description",
  icon: "activity",
  category: "analytics",
  subCategory: "leadsData",
  tags: ["tags.vibeSense" as const],
  aliases: [GROWTH_CHANNEL_SPEND_ALIAS],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: GrowthChannelSpendWidget,
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
      channel: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "dataSources.fields.channel.label",
        description: "dataSources.fields.channel.description",
        schema: z.string().max(100).default(""),
        columns: 6,
      }),
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "dataSources.fields.currency.label",
        description: "dataSources.fields.currency.description",
        options: SpendCurrencyOptions,
        schema: z.enum(CurrenciesArr).default("EUR"),
        columns: 6,
      }),
      result: timeSeriesResponseField(scopedTranslation, {
        label: "dataSources.channelSpend.post.fields.result.label",
        description: "dataSources.channelSpend.post.fields.result.description",
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
      },
      oneChannel: {
        range: { from: new Date("2026-10-01"), to: new Date("2026-10-31") },
        channel: "reddit",
        currency: "EUR",
      },
    },
    responses: {
      default: {
        result: [],
        meta: { actualResolution: "enums.resolution.1d", lookbackUsed: 0 },
      },
      oneChannel: {
        result: [],
        meta: { actualResolution: "enums.resolution.1d", lookbackUsed: 0 },
      },
    },
  },
});

export type GrowthChannelSpendRequestOutput = typeof POST.types.RequestOutput;

const definitions = { POST };
export default definitions;
