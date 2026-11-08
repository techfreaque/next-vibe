/**
 * Refusal Index - Single Question API Definition
 * PATCH  /agent/refusal-index/questions/[id] - edit / (de)activate a question
 * DELETE /agent/refusal-index/questions/[id] - delete a question never used in a run
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
  requestUrlPathParamsField,
  responseField,
  submitButton,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { REFUSAL_ERROR_TYPES, REFUSAL_SUCCESS_TYPES } from "../../error-types";
import { scopedTranslation } from "../../i18n";

const idField = requestUrlPathParamsField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.UUID,
  label: "questions.fields.id.label" as const,
  description: "questions.fields.id.description" as const,
  hidden: true,
  schema: z.string().uuid(),
});

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["vibe", "agent", "refusal-index", "questions", "[id]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "questions.patch.title" as const,
  titleShort: "questions.patch.titleShort" as const,
  description: "questions.patch.description" as const,
  icon: "pencil",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.refusalIndex" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      id: idField,
      category: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "questions.fields.category.label" as const,
        description: "questions.fields.category.description" as const,
        columns: 6,
        schema: z.string().min(1).max(60).optional(),
      }),
      active: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "questions.fields.active.label" as const,
        description: "questions.fields.active.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      textEn: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "questions.fields.textEn.label" as const,
        description: "questions.fields.textEn.description" as const,
        columns: 12,
        schema: z.string().min(3).max(4000).optional(),
      }),
      textDe: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "questions.fields.textDe.label" as const,
        description: "questions.patch.clearHint" as const,
        columns: 6,
        schema: z.string().max(4000).optional(),
      }),
      textPl: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "questions.fields.textPl.label" as const,
        description: "questions.patch.clearHint" as const,
        columns: 6,
        schema: z.string().max(4000).optional(),
      }),

      updatedId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().uuid(),
      }),
      backButton: backButton(scopedTranslation, {
        label: "fields.back.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data&urlPathParams" },
      }),
      submit: submitButton(scopedTranslation, {
        label: "questions.patch.submit" as const,
        loadingText: "questions.patch.submitting" as const,
        icon: "check",
        variant: "primary",
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
      default: { active: false },
    },
    responses: {
      default: { updatedId: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["vibe", "agent", "refusal-index", "questions", "[id]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "questions.delete.title" as const,
  titleShort: "questions.delete.titleShort" as const,
  description: "questions.delete.description" as const,
  icon: "trash",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.refusalIndex" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      id: idField,
      deleted: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        label: "questions.delete.response.deleted" as const,
        schema: z.boolean(),
      }),
      backButton: backButton(scopedTranslation, {
        label: "fields.back.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "urlPathParams" },
      }),
      submit: submitButton(scopedTranslation, {
        label: "questions.delete.submit" as const,
        loadingText: "questions.delete.submitting" as const,
        icon: "trash",
        variant: "destructive",
        usage: { request: "urlPathParams" },
      }),
    },
  }),

  errorTypes: REFUSAL_ERROR_TYPES,
  successTypes: REFUSAL_SUCCESS_TYPES,

  examples: {
    urlPathParams: {
      default: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
    responses: {
      default: { deleted: true },
    },
  },
});

export const endpoints = { PATCH, DELETE };
export type QuestionPatchRequestOutput = typeof PATCH.types.RequestOutput;
export type QuestionPatchResponseOutput = typeof PATCH.types.ResponseOutput;
export type QuestionDeleteResponseOutput = typeof DELETE.types.ResponseOutput;
export default endpoints;
