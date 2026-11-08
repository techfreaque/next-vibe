/**
 * Finance Series - Data Source Definition
 * One endpoint, many series: pick the metric per graph node (revenue by
 * processor, net revenue, refunds, upstream cost, margin, provider spend and
 * balance, alerts). Client+server safe. No server imports.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { GraphResolution } from "next-vibe/dataflow/enum";
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

import { FINANCE_SERIES_ALIAS } from "../../constants";
import {
  FinanceMetric,
  FinanceMetricOptions,
  ProviderFilter,
  ProviderFilterOptions,
} from "../../enum";
import { financeErrorTypes } from "../../error-types";
import { scopedTranslation } from "../../i18n";

const FinanceSeriesWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.FinanceSeriesWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["finance", "data-sources", "finance-series"],
  title: "series.title",
  titleShort: "series.titleShort",
  description: "series.description",
  icon: "activity",
  category: "analytics",
  subCategory: "financeData",
  tags: ["tags.vibeSense" as const],
  aliases: [FINANCE_SERIES_ALIAS] as const,
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: FinanceSeriesWidget,
    noFormElement: true,
    usage: { request: "data", response: true } as const,
    children: {
      resolution: resolutionRequestField(scopedTranslation, {
        label: "series.fields.resolution.label",
        description: "series.fields.resolution.description",
      }),
      range: rangeRequestField(scopedTranslation, {
        label: "series.fields.range.label",
        description: "series.fields.range.description",
      }),
      lookback: lookbackRequestField(scopedTranslation, {
        label: "series.fields.lookback.label",
        description: "series.fields.lookback.description",
      }),
      metric: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "series.fields.metric.label",
        description: "series.fields.metric.description",
        options: FinanceMetricOptions,
        schema: z.enum(FinanceMetric).default(FinanceMetric.NET_REVENUE),
        columns: 6,
      }),
      provider: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "series.fields.provider.label",
        description: "series.fields.provider.description",
        options: ProviderFilterOptions,
        schema: z.enum(ProviderFilter).default(ProviderFilter.ALL),
        columns: 6,
      }),
      result: timeSeriesResponseField(scopedTranslation, {
        label: "series.fields.result.label",
        description: "series.fields.result.description",
      }),
      meta: nodeMetaResponseField(scopedTranslation, {
        label: "series.fields.meta.label",
        description: "series.fields.meta.description",
      }),
    },
  }),

  errorTypes: financeErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    requests: {
      default: {
        range: { from: new Date("2026-10-01"), to: new Date("2026-10-31") },
        metric: FinanceMetric.NET_REVENUE,
      },
      openRouterSpend: {
        range: { from: new Date("2026-10-01"), to: new Date("2026-10-31") },
        metric: FinanceMetric.PROVIDER_SPEND,
        provider: ProviderFilter.OPENROUTER,
      },
    },
    responses: {
      default: {
        result: [],
        meta: { actualResolution: GraphResolution.ONE_DAY, lookbackUsed: 0 },
      },
    },
  },
});

export type FinanceSeriesRequestOutput = typeof POST.types.RequestOutput;

const definitions = { POST };
export default definitions;
