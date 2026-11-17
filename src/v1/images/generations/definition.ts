/**
 * POST /v1/images/generations - OpenAI-compatible image generation.
 * Served at /api/<locale>/v1/images/generations, authenticated by API key
 * only. The handler answers with the raw OpenAI body; the declared response
 * is nominal.
 */

import { IMAGE_ASPECT_RATIOS } from "next-vibe/agent/image-generation/aspect-ratio";
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
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../i18n";
import {
  V1_IMAGES_GENERATIONS_ALIAS,
  V1_MAX_IMAGES_PER_CALL,
} from "../../shared/constants";
import { V1_ERROR_TYPES } from "../../shared/error-types";

export const V1_IMAGE_RESPONSE_FORMATS = ["url", "b64_json"] as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["v1", "images", "generations"],
  aliases: [V1_IMAGES_GENERATIONS_ALIAS] as const,
  title: "media.images.generations.title",
  titleShort: "media.images.generations.titleShort",
  description: "media.images.generations.description",
  icon: "image",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.api"],
  // PUBLIC is allowed so the handler can answer unauthenticated calls with the
  // OpenAI 401 body; it authenticates by API key only (see api-keys/auth.ts).
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.CLI_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.SKILL_OFF,
  ] as const,
  timeoutMs: 0,
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "media.images.generations.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true } as const,
    children: {
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.model.label",
        description: "media.fields.model.imageDescription",
        schema: z.string().min(1),
      }),
      prompt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "media.fields.prompt.label",
        description: "media.fields.prompt.imageDescription",
        schema: z.string().min(1).max(2000),
      }),
      n: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "media.fields.n.label",
        description: "media.fields.n.description",
        schema: z.coerce
          .number()
          .int()
          .min(1)
          .max(V1_MAX_IMAGES_PER_CALL)
          .optional(),
      }),
      size: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.size.label",
        description: "media.fields.size.imageDescription",
        schema: z.string().optional(),
      }),
      aspect_ratio: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.aspectRatio.label",
        description: "media.fields.aspectRatio.imageDescription",
        schema: z.enum(IMAGE_ASPECT_RATIOS).optional(),
      }),
      quality: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.quality.label",
        description: "media.fields.quality.description",
        schema: z.string().optional(),
      }),
      style: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.style.label",
        description: "media.fields.style.description",
        schema: z.string().optional(),
      }),
      response_format: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.responseFormat.label",
        description: "media.fields.responseFormat.imageDescription",
        schema: z.enum(V1_IMAGE_RESPONSE_FORMATS).optional(),
      }),
      user: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.user.label",
        description: "media.fields.user.description",
        schema: z.string().optional(),
      }),
      created: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "media.response.created",
        schema: z.number(),
      }),
    },
  }),
  errorTypes: V1_ERROR_TYPES,
  successTypes: {
    title: "media.images.generations.success.title",
    description: "media.images.generations.success.description",
  },
  examples: {
    requests: {
      default: {
        model: "flux-2-klein-4b",
        prompt: "A lighthouse on a cliff at dawn, oil painting",
        size: "1024x1024",
      },
    },
    responses: { default: { created: 1_767_225_600 } },
  },
});

const v1ImagesGenerationsEndpoints = { POST } as const;
export default v1ImagesGenerationsEndpoints;

export type V1ImagesGenerationsPostRequestOutput =
  typeof POST.types.RequestOutput;
