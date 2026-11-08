/**
 * Refusal Index - Model stats API Definition (public, read-only, cached)
 * GET /agent/refusal-index/model/[modelId] - one model's refusal stats from
 * the latest completed run plus its admin-approved sample answers.
 * Powers the model pages (/{locale}/models/{id}).
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { RefusalVerdictDB } from "../../enum";
import { REFUSAL_ERROR_TYPES, REFUSAL_SUCCESS_TYPES } from "../../error-types";
import { scopedTranslation } from "../../i18n";
import {
  categoryBreakdownField,
  rateFields,
  runMetaFields,
} from "../../public-fields";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "agent", "refusal-index", "model", "[modelId]"],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ] as const,

  title: "model.title" as const,
  titleShort: "model.titleShort" as const,
  description: "model.description" as const,
  icon: "activity",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.refusalIndex" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      modelId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "model.fields.modelId.label" as const,
        description: "model.fields.modelId.description" as const,
        schema: z.string().min(1),
      }),

      ...runMetaFields,
      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "public.fields.name.label" as const,
        schema: z.string(),
      }),
      tier: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        label: "public.fields.tier.label" as const,
        schema: z.string().nullable(),
      }),
      ...rateFields,
      trend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "public.fields.trend.label" as const,
        schema: z.number().nullable(),
      }),
      rank: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "public.fields.rank.label" as const,
        schema: z.number().int().positive().nullable(),
      }),
      rankedModels: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "public.fields.rankedModels.label" as const,
        schema: z.number().int().nonnegative(),
      }),
      categoryBreakdown: categoryBreakdownField,
      samples: responseArrayField(scopedTranslation, {
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
            category: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "public.fields.category.label" as const,
              schema: z.string(),
            }),
            questionEn: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "public.fields.question.label" as const,
              schema: z.string(),
            }),
            questionDe: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string().nullable(),
            }),
            questionPl: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string().nullable(),
            }),
            verdict: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "public.fields.verdict.label" as const,
              schema: z.enum(RefusalVerdictDB),
            }),
            answerExcerpt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "public.fields.answer.label" as const,
              schema: z.string(),
            }),
            judgeReason: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "public.fields.judgeReason.label" as const,
              schema: z.string(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: REFUSAL_ERROR_TYPES,
  successTypes: REFUSAL_SUCCESS_TYPES,

  examples: {
    urlPathParams: { default: { modelId: "kimi-k3" } },
    responses: {
      default: {
        hasData: false,
        runId: null,
        runFinishedAt: null,
        modelCount: 0,
        questionCount: 0,
        judgeModelId: null,
        judgeModelName: null,
        judgePromptVersion: null,
        name: "Kimi K3",
        tier: null,
        judged: 0,
        answeredPct: 0,
        hedgedPct: 0,
        refusedPct: 0,
        trend: null,
        rank: null,
        rankedModels: 0,
        categoryBreakdown: [],
        samples: [],
      },
    },
  },
});

export const endpoints = { GET };
export type ModelStatsUrlParams = typeof GET.types.UrlVariablesOutput;
export type ModelStatsResponseOutput = typeof GET.types.ResponseOutput;
export default endpoints;
