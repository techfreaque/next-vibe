/**
 * Refusal Index - Questions API Definition
 * GET  /agent/refusal-index/questions - list the admin-curated question set
 * POST /agent/refusal-index/questions - add a question
 *
 * The question set is DATA: nothing is seeded, an admin adds every question.
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
  responseArrayField,
  responseField,
  submitButton,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { REFUSAL_INDEX_QUESTIONS_ALIAS } from "../constants";
import { REFUSAL_ERROR_TYPES, REFUSAL_SUCCESS_TYPES } from "../error-types";
import { scopedTranslation } from "../i18n";

const QuestionsWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.QuestionsWidget })),
);

export const QUESTION_STATUS_FILTERS = ["all", "active", "inactive"] as const;

const questionRowSchemaFields = {
  id: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    hidden: true,
    schema: z.string().uuid(),
  }),
  slug: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "questions.fields.slug.label" as const,
    schema: z.string(),
  }),
  category: responseField(scopedTranslation, {
    type: WidgetType.BADGE,
    label: "questions.fields.category.label" as const,
    schema: z.string(),
  }),
  textEn: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "questions.fields.textEn.label" as const,
    schema: z.string(),
  }),
  textDe: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    hidden: true,
    schema: z.string().nullable(),
  }),
  textPl: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    hidden: true,
    schema: z.string().nullable(),
  }),
  active: responseField(scopedTranslation, {
    type: WidgetType.BADGE,
    label: "questions.fields.active.label" as const,
    schema: z.boolean(),
  }),
};

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "agent", "refusal-index", "questions"],
  aliases: [REFUSAL_INDEX_QUESTIONS_ALIAS],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "questions.get.title" as const,
  titleShort: "questions.get.titleShort" as const,
  description: "questions.get.description" as const,
  icon: "list",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.refusalIndex" as const],

  fields: customWidgetObject({
    render: QuestionsWidget,
    usage: { request: "data", response: true } as const,
    children: {
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "questions.get.fields.status.label" as const,
        description: "questions.get.fields.status.description" as const,
        options: [
          { value: "all", label: "questions.get.fields.status.all" as const },
          {
            value: "active",
            label: "questions.get.fields.status.active" as const,
          },
          {
            value: "inactive",
            label: "questions.get.fields.status.inactive" as const,
          },
        ],
        columns: 4,
        schema: z.enum(QUESTION_STATUS_FILTERS).optional().default("all"),
      }),
      category: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "questions.get.fields.category.label" as const,
        description: "questions.get.fields.category.description" as const,
        columns: 4,
        schema: z.string().optional(),
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.limit.label" as const,
        description: "fields.limit.description" as const,
        columns: 2,
        schema: z.coerce.number().int().min(1).max(500).optional().default(100),
      }),
      offset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.offset.label" as const,
        description: "fields.offset.description" as const,
        columns: 2,
        schema: z.coerce.number().int().min(0).optional().default(0),
      }),

      questions: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          noCard: true,
          usage: { response: true } as const,
          children: questionRowSchemaFields,
        }),
      }),
      categories: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          noCard: true,
          usage: { response: true } as const,
          children: {
            category: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              schema: z.string(),
            }),
            count: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.number().int().nonnegative(),
            }),
          },
        }),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nonnegative(),
      }),
    },
  }),

  errorTypes: REFUSAL_ERROR_TYPES,
  successTypes: REFUSAL_SUCCESS_TYPES,

  examples: {
    requests: {
      default: { status: "all" as const, limit: 100, offset: 0 },
    },
    responses: {
      default: {
        questions: [],
        categories: [],
        total: 0,
      },
    },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "refusal-index", "questions"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "questions.post.title" as const,
  titleShort: "questions.post.titleShort" as const,
  description: "questions.post.description" as const,
  icon: "plus",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.refusalIndex" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true } as const,
    children: {
      slug: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "questions.fields.slug.label" as const,
        description: "questions.fields.slug.description" as const,
        columns: 6,
        schema: z
          .string()
          .min(2)
          .max(80)
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      }),
      category: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "questions.fields.category.label" as const,
        description: "questions.fields.category.description" as const,
        columns: 6,
        schema: z.string().min(1).max(60),
      }),
      textEn: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "questions.fields.textEn.label" as const,
        description: "questions.fields.textEn.description" as const,
        columns: 12,
        schema: z.string().min(3).max(4000),
      }),
      textDe: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "questions.fields.textDe.label" as const,
        description: "questions.fields.textDe.description" as const,
        columns: 6,
        schema: z.string().max(4000).optional(),
      }),
      textPl: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "questions.fields.textPl.label" as const,
        description: "questions.fields.textPl.description" as const,
        columns: 6,
        schema: z.string().max(4000).optional(),
      }),
      active: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "questions.fields.active.label" as const,
        description: "questions.fields.active.description" as const,
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "questions.post.response.id" as const,
        schema: z.string().uuid(),
      }),
      backButton: backButton(scopedTranslation, {
        label: "fields.back.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),
      submit: submitButton(scopedTranslation, {
        label: "questions.post.submit" as const,
        loadingText: "questions.post.submitting" as const,
        icon: "plus",
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
        slug: "example-question",
        category: "general",
        textEn: "Example question text",
        active: true,
      },
    },
    responses: {
      default: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

export const endpoints = { GET, POST };
export type QuestionsGetRequestOutput = typeof GET.types.RequestOutput;
export type QuestionsGetResponseOutput = typeof GET.types.ResponseOutput;
export type QuestionsPostRequestOutput = typeof POST.types.RequestOutput;
export type QuestionsPostResponseOutput = typeof POST.types.ResponseOutput;
export default endpoints;
