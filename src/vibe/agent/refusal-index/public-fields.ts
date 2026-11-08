/**
 * Response field building blocks shared by the two public read endpoints
 * (leaderboard + per-model stats).
 */

import { LayoutType, WidgetType } from "next-vibe/core/definition/enums";
import {
  objectField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

export const rateFields = {
  judged: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "public.fields.judged.label" as const,
    schema: z.number().int().nonnegative(),
  }),
  answeredPct: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "public.fields.answeredPct.label" as const,
    schema: z.number(),
  }),
  hedgedPct: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "public.fields.hedgedPct.label" as const,
    schema: z.number(),
  }),
  refusedPct: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "public.fields.refusedPct.label" as const,
    schema: z.number(),
  }),
};

export const categoryBreakdownField = responseArrayField(scopedTranslation, {
  type: WidgetType.CONTAINER,
  child: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    noCard: true,
    usage: { response: true } as const,
    children: {
      category: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        label: "public.fields.category.label" as const,
        schema: z.string(),
      }),
      ...rateFields,
    },
  }),
});

export const runMetaFields = {
  hasData: responseField(scopedTranslation, {
    type: WidgetType.BADGE,
    label: "public.fields.hasData.label" as const,
    schema: z.boolean(),
  }),
  runId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    hidden: true,
    schema: z.string().uuid().nullable(),
  }),
  runFinishedAt: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "public.fields.runFinishedAt.label" as const,
    schema: z.string().datetime().nullable(),
  }),
  modelCount: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "public.fields.modelCount.label" as const,
    schema: z.number().int().nonnegative(),
  }),
  questionCount: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "public.fields.questionCount.label" as const,
    schema: z.number().int().nonnegative(),
  }),
  judgeModelId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "public.fields.judgeModelId.label" as const,
    schema: z.string().nullable(),
  }),
  judgeModelName: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "public.fields.judgeModelName.label" as const,
    schema: z.string().nullable(),
  }),
  judgePromptVersion: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "public.fields.judgePromptVersion.label" as const,
    schema: z.string().nullable(),
  }),
};
