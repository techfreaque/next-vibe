/**
 * Refusal Index - Run detail API Definition
 * GET /agent/refusal-index/runs/[id] - one run with its results grid
 * (filter by model / category / verdict). Admins approve public samples from here.
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
  backButton,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { RefusalRunStatus, RefusalVerdict, RefusalVerdictDB } from "../../enum";
import { REFUSAL_ERROR_TYPES, REFUSAL_SUCCESS_TYPES } from "../../error-types";
import { scopedTranslation } from "../../i18n";
import { runSummaryFields } from "../run-fields";

const RunDetailWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.RunDetailWidget })),
);

export const VERDICT_FILTERS = ["all", ...RefusalVerdictDB] as const;

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "agent", "refusal-index", "runs", "[id]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "runDetail.title" as const,
  titleShort: "runDetail.titleShort" as const,
  description: "runDetail.description" as const,
  icon: "table",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.refusalIndex" as const],

  fields: customWidgetObject({
    render: RunDetailWidget,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "runs.fields.id.label" as const,
        description: "runs.fields.id.description" as const,
        hidden: true,
        schema: z.string().uuid(),
      }),
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "runDetail.fields.model.label" as const,
        description: "runDetail.fields.model.description" as const,
        columns: 4,
        schema: z.string().optional(),
      }),
      category: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "runDetail.fields.category.label" as const,
        description: "runDetail.fields.category.description" as const,
        columns: 3,
        schema: z.string().optional(),
      }),
      verdict: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "runDetail.fields.verdict.label" as const,
        description: "runDetail.fields.verdict.description" as const,
        options: [
          { value: "all", label: "runDetail.fields.verdict.all" as const },
          {
            value: RefusalVerdict.ANSWERED,
            label: "enums.verdict.answered" as const,
          },
          {
            value: RefusalVerdict.HEDGED,
            label: "enums.verdict.hedged" as const,
          },
          {
            value: RefusalVerdict.REFUSED,
            label: "enums.verdict.refused" as const,
          },
          {
            value: RefusalVerdict.ERROR,
            label: "enums.verdict.error" as const,
          },
        ],
        columns: 3,
        schema: z.enum(VERDICT_FILTERS).optional().default("all"),
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.limit.label" as const,
        description: "fields.limit.description" as const,
        columns: 1,
        schema: z.coerce.number().int().min(1).max(500).optional().default(100),
      }),
      offset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.offset.label" as const,
        description: "fields.offset.description" as const,
        columns: 1,
        schema: z.coerce.number().int().min(0).optional().default(0),
      }),

      run: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: runSummaryFields,
      }),
      answered: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().int().nonnegative(),
      }),
      hedged: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().int().nonnegative(),
      }),
      refused: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().int().nonnegative(),
      }),
      errors: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().int().nonnegative(),
      }),
      results: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          noCard: true,
          usage: { response: true } as const,
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string().uuid(),
            }),
            modelId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "runDetail.fields.modelId.label" as const,
              schema: z.string(),
            }),
            modelName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "runDetail.fields.modelName.label" as const,
              schema: z.string(),
            }),
            tier: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "runDetail.fields.tier.label" as const,
              schema: z.string().nullable(),
            }),
            questionSlug: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "runDetail.fields.questionSlug.label" as const,
              schema: z.string(),
            }),
            category: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "runDetail.fields.categoryCol.label" as const,
              schema: z.string(),
            }),
            questionText: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "runDetail.fields.questionText.label" as const,
              schema: z.string(),
            }),
            verdict: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "runDetail.fields.verdictCol.label" as const,
              schema: z.enum(RefusalVerdictDB),
            }),
            judgeReason: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "runDetail.fields.judgeReason.label" as const,
              schema: z.string(),
            }),
            answerExcerpt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "runDetail.fields.answerExcerpt.label" as const,
              schema: z.string(),
            }),
            latencyMs: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "runDetail.fields.latencyMs.label" as const,
              schema: z.number().int().nonnegative(),
            }),
            cost: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "runDetail.fields.cost.label" as const,
              schema: z.number(),
            }),
            sampleVisible: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "runDetail.fields.sampleVisible.label" as const,
              schema: z.boolean().nullable(),
            }),
          },
        }),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nonnegative(),
      }),
      backButton: backButton(scopedTranslation, {
        label: "fields.back.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data&urlPathParams" },
      }),
    },
  }),

  errorTypes: REFUSAL_ERROR_TYPES,
  successTypes: REFUSAL_SUCCESS_TYPES,

  examples: {
    urlPathParams: {
      default: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: { verdict: "all" as const, limit: 100, offset: 0 },
    },
    responses: {
      default: {
        run: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          status: RefusalRunStatus.COMPLETED,
          startedAt: "2026-11-01T03:00:00.000Z",
          finishedAt: "2026-11-01T04:00:00.000Z",
          modelCount: 0,
          questionCount: 0,
          resultCount: 0,
          totalCost: 0,
          budgetCredits: null,
          judgeModelId: "glm-5.3-flash-uncensored",
          judgePromptVersion: "judge-v1",
          cancelReason: null,
          notes: null,
        },
        answered: 0,
        hedged: 0,
        refused: 0,
        errors: 0,
        results: [],
        total: 0,
      },
    },
  },
});

export const endpoints = { GET };
export type RunDetailRequestOutput = typeof GET.types.RequestOutput;
export type RunDetailResponseOutput = typeof GET.types.ResponseOutput;
export type RunDetailUrlParams = typeof GET.types.UrlVariablesOutput;
export default endpoints;
