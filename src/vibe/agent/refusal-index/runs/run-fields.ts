/**
 * Shared response fields describing one run (used by the runs list and the run detail).
 */

import { WidgetType } from "next-vibe/core/definition/enums";
import { responseField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { RefusalRunStatusDB } from "../enum";
import { scopedTranslation } from "../i18n";

export const runSummaryFields = {
  id: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    hidden: true,
    schema: z.string().uuid(),
  }),
  status: responseField(scopedTranslation, {
    type: WidgetType.BADGE,
    label: "runs.fields.status.label" as const,
    schema: z.enum(RefusalRunStatusDB),
  }),
  startedAt: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "runs.fields.startedAt.label" as const,
    schema: z.string().datetime(),
  }),
  finishedAt: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "runs.fields.finishedAt.label" as const,
    schema: z.string().datetime().nullable(),
  }),
  modelCount: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "runs.fields.modelCount.label" as const,
    schema: z.number().int().nonnegative(),
  }),
  questionCount: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "runs.fields.questionCount.label" as const,
    schema: z.number().int().nonnegative(),
  }),
  resultCount: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "runs.fields.resultCount.label" as const,
    schema: z.number().int().nonnegative(),
  }),
  totalCost: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "runs.fields.totalCost.label" as const,
    schema: z.number(),
  }),
  budgetCredits: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "runs.fields.budgetCredits.label" as const,
    schema: z.number().nullable(),
  }),
  judgeModelId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "runs.fields.judgeModelId.label" as const,
    schema: z.string(),
  }),
  judgePromptVersion: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "runs.fields.judgePromptVersion.label" as const,
    schema: z.string(),
  }),
  cancelReason: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "runs.fields.cancelReason.label" as const,
    schema: z.string().nullable(),
  }),
  notes: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "runs.fields.notes.label" as const,
    schema: z.string().nullable(),
  }),
};
