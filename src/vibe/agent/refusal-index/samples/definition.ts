/**
 * Refusal Index - Samples API Definition
 * POST /agent/refusal-index/samples - approve (visible=true) or hide
 * (visible=false) one result as a public sample answer. Nothing is public
 * unless an admin approves it here.
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

import { REFUSAL_ERROR_TYPES, REFUSAL_SUCCESS_TYPES } from "../error-types";
import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "refusal-index", "samples"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "samples.title" as const,
  titleShort: "samples.titleShort" as const,
  description: "samples.description" as const,
  icon: "eye",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.refusalIndex" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true } as const,
    children: {
      resultId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "samples.fields.resultId.label" as const,
        description: "samples.fields.resultId.description" as const,
        columns: 8,
        schema: z.string().uuid(),
      }),
      visible: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "samples.fields.visible.label" as const,
        description: "samples.fields.visible.description" as const,
        columns: 4,
        schema: z.boolean().optional().default(true),
      }),

      sampleId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().uuid(),
      }),
      isVisible: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        label: "samples.response.visible" as const,
        schema: z.boolean(),
      }),
      backButton: backButton(scopedTranslation, {
        label: "fields.back.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),
      submit: submitButton(scopedTranslation, {
        label: "samples.submit" as const,
        loadingText: "samples.submitting" as const,
        icon: "check",
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
        resultId: "550e8400-e29b-41d4-a716-446655440000",
        visible: true,
      },
    },
    responses: {
      default: {
        sampleId: "660e8400-e29b-41d4-a716-446655440001",
        isVisible: true,
      },
    },
  },
});

export const endpoints = { POST };
export type SamplesPostRequestOutput = typeof POST.types.RequestOutput;
export type SamplesPostResponseOutput = typeof POST.types.ResponseOutput;
export default endpoints;
