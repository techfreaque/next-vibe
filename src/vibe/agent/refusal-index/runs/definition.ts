/**
 * Refusal Index - Runs list API Definition
 * GET /agent/refusal-index/runs - benchmark runs, newest first
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
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

import { REFUSAL_INDEX_RUNS_ALIAS } from "../constants";
import { REFUSAL_ERROR_TYPES, REFUSAL_SUCCESS_TYPES } from "../error-types";
import { scopedTranslation } from "../i18n";
import { runSummaryFields } from "./run-fields";

const RunsWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.RunsWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "agent", "refusal-index", "runs"],
  aliases: [REFUSAL_INDEX_RUNS_ALIAS],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "runs.get.title" as const,
  titleShort: "runs.get.titleShort" as const,
  description: "runs.get.description" as const,
  icon: "activity",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.refusalIndex" as const],

  fields: customWidgetObject({
    render: RunsWidget,
    usage: { request: "data", response: true } as const,
    children: {
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.limit.label" as const,
        description: "fields.limit.description" as const,
        columns: 6,
        schema: z.coerce.number().int().min(1).max(100).optional().default(20),
      }),
      offset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.offset.label" as const,
        description: "fields.offset.description" as const,
        columns: 6,
        schema: z.coerce.number().int().min(0).optional().default(0),
      }),

      runs: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          noCard: true,
          usage: { response: true } as const,
          children: runSummaryFields,
        }),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nonnegative(),
      }),
      activeQuestionCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "runs.get.response.activeQuestionCount" as const,
        schema: z.number().int().nonnegative(),
      }),
      benchmarkModelCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "runs.get.response.benchmarkModelCount" as const,
        schema: z.number().int().nonnegative(),
      }),
    },
  }),

  errorTypes: REFUSAL_ERROR_TYPES,
  successTypes: REFUSAL_SUCCESS_TYPES,

  examples: {
    requests: { default: { limit: 20, offset: 0 } },
    responses: {
      default: {
        runs: [],
        total: 0,
        activeQuestionCount: 0,
        benchmarkModelCount: 0,
      },
    },
  },
});

export const endpoints = { GET };
export type RunsGetRequestOutput = typeof GET.types.RequestOutput;
export type RunsGetResponseOutput = typeof GET.types.ResponseOutput;
export default endpoints;
