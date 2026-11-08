/**
 * Finance Thresholds - Endpoint Definition
 * POST: set one alert threshold (value, enabled, note).
 * Client+server safe. No server imports.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
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
import { z } from "zod";

import { FINANCE_THRESHOLDS_SET_ALIAS } from "../constants";
import { ThresholdKeyDB, ThresholdKeyOptions } from "../enum";
import { financeErrorTypes } from "../error-types";
import { scopedTranslation } from "../i18n";

const FinanceThresholdSetWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.FinanceThresholdSetWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["finance", "thresholds"],
  aliases: [FINANCE_THRESHOLDS_SET_ALIAS] as const,
  title: "thresholds.title",
  titleShort: "thresholds.titleShort",
  description: "thresholds.description",
  icon: "settings",
  category: "finance",
  subCategory: "Monitoring",
  tags: ["tags.finance"],
  allowedRoles: [UserRole.ADMIN],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
        const status = await import("../status/definition");
        await apiClient.refetchEndpoint(status.default.GET, data.logger);
      },
    },
  },

  fields: customWidgetObject({
    render: FinanceThresholdSetWidget,
    usage: { request: "data", response: true } as const,
    children: {
      key: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "thresholds.fields.key.label",
        description: "thresholds.fields.key.description",
        options: ThresholdKeyOptions,
        columns: 6,
        schema: z.enum(ThresholdKeyDB),
      }),
      value: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "thresholds.fields.value.label",
        description: "thresholds.fields.value.description",
        columns: 6,
        schema: z.number().min(0).max(1_000_000),
      }),
      enabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "thresholds.fields.enabled.label",
        description: "thresholds.fields.enabled.description",
        columns: 6,
        schema: z.boolean().default(true),
      }),
      note: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "thresholds.fields.note.label",
        description: "thresholds.fields.note.description",
        placeholder: "thresholds.fields.note.placeholder",
        schema: z.string().trim().max(200).optional(),
      }),
      savedKey: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "thresholds.response.key",
        schema: z.enum(ThresholdKeyDB),
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
        key: "enums.threshold.marginFloorPct",
        value: 20,
        enabled: true,
        note: "Alert below 20% gross margin",
      },
    },
    responses: {
      default: { savedKey: "enums.threshold.marginFloorPct" },
    },
  },
});

export type FinanceThresholdSetRequestOutput = typeof POST.types.RequestOutput;
export type FinanceThresholdSetResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
