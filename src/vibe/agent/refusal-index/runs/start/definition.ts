/**
 * Refusal Index - Start Run API Definition
 * POST /agent/refusal-index/runs/start - start (or resume) a benchmark run now.
 * The weekly cron task calls this same endpoint.
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
  backButton,
  objectField,
  requestField,
  responseField,
  submitButton,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import {
  DEFAULT_BUDGET_CREDITS,
  REFUSAL_INDEX_RUN_ALIAS,
} from "../../constants";
import { REFUSAL_ERROR_TYPES, REFUSAL_SUCCESS_TYPES } from "../../error-types";
import { scopedTranslation } from "../../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "refusal-index", "runs", "start"],
  aliases: [REFUSAL_INDEX_RUN_ALIAS],
  allowedRoles: [UserRole.ADMIN] as const,
  timeoutMs: 0,

  title: "start.title" as const,
  titleShort: "start.titleShort" as const,
  description: "start.description" as const,
  icon: "play",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.refusalIndex" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true } as const,
    children: {
      models: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "start.fields.models.label" as const,
        description: "start.fields.models.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      questions: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "start.fields.questions.label" as const,
        description: "start.fields.questions.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      budgetCredits: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "start.fields.budgetCredits.label" as const,
        description: "start.fields.budgetCredits.description" as const,
        columns: 4,
        schema: z.coerce
          .number()
          .positive()
          .optional()
          .default(DEFAULT_BUDGET_CREDITS),
      }),
      concurrency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "start.fields.concurrency.label" as const,
        description: "start.fields.concurrency.description" as const,
        columns: 4,
        schema: z.coerce.number().int().min(1).max(16).optional(),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "start.fields.dryRun.label" as const,
        description: "start.fields.dryRun.description" as const,
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),
      resumeRunId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "start.fields.resumeRunId.label" as const,
        description: "start.fields.resumeRunId.description" as const,
        columns: 6,
        schema: z.union([z.literal(""), z.string().uuid()]).optional(),
      }),
      wait: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "start.fields.wait.label" as const,
        description: "start.fields.wait.description" as const,
        columns: 3,
        schema: z.boolean().optional().default(false),
      }),
      notes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "start.fields.notes.label" as const,
        description: "start.fields.notes.description" as const,
        columns: 12,
        schema: z.string().max(500).optional(),
      }),

      runId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "start.response.runId" as const,
        schema: z.string().uuid().nullable(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        label: "start.response.status" as const,
        schema: z.string(),
      }),
      isDryRun: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        label: "start.response.dryRun" as const,
        schema: z.boolean(),
      }),
      modelCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "start.response.modelCount" as const,
        schema: z.number().int().nonnegative(),
      }),
      questionCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "start.response.questionCount" as const,
        schema: z.number().int().nonnegative(),
      }),
      pendingPairs: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "start.response.pendingPairs" as const,
        schema: z.number().int().nonnegative(),
      }),
      estimatedCredits: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "start.response.estimatedCredits" as const,
        schema: z.number().nonnegative(),
      }),
      note: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "start.response.note" as const,
        schema: z.string(),
      }),

      backButton: backButton(scopedTranslation, {
        label: "fields.back.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),
      submit: submitButton(scopedTranslation, {
        label: "start.submit" as const,
        loadingText: "start.submitting" as const,
        icon: "play",
        variant: "primary",
        usage: { request: "data" },
      }),
    },
  }),

  errorTypes: REFUSAL_ERROR_TYPES,
  successTypes: REFUSAL_SUCCESS_TYPES,

  examples: {
    requests: {
      default: {
        dryRun: true,
        budgetCredits: DEFAULT_BUDGET_CREDITS,
        wait: false,
      },
    },
    responses: {
      default: {
        runId: null,
        status: "dry-run",
        isDryRun: true,
        modelCount: 0,
        questionCount: 0,
        pendingPairs: 0,
        estimatedCredits: 0,
        note: "",
      },
    },
  },
});

export const endpoints = { POST };
export type StartRunRequestOutput = typeof POST.types.RequestOutput;
export type StartRunResponseOutput = typeof POST.types.ResponseOutput;
export default endpoints;
