/**
 * POST /v1/images/edits - OpenAI-compatible image edit: one reference image
 * (multipart `image`, or `image_url` in JSON) plus a prompt, on a model that
 * takes image input. Served at /api/<locale>/v1/images/edits, authenticated
 * by API key only. The handler answers with the raw OpenAI body; the declared
 * response is nominal.
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
  V1_IMAGES_EDITS_ALIAS,
  V1_MAX_IMAGES_PER_CALL,
} from "../../shared/constants";
import { V1_ERROR_TYPES } from "../../shared/error-types";
import { V1_IMAGE_RESPONSE_FORMATS } from "../generations/definition";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["v1", "images", "edits"],
  aliases: [V1_IMAGES_EDITS_ALIAS] as const,
  title: "media.images.edits.title",
  titleShort: "media.images.edits.titleShort",
  description: "media.images.edits.description",
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
    title: "media.images.edits.title",
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
        description: "media.fields.prompt.editDescription",
        schema: z.string().min(1).max(2000),
      }),
      image: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.FILE,
        label: "media.fields.image.label",
        description: "media.fields.image.description",
        schema: z
          .union([z.instanceof(File), z.array(z.instanceof(File))])
          .optional(),
      }),
      image_url: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.imageUrl.label",
        description: "media.fields.imageUrl.description",
        schema: z.string().optional(),
      }),
      mask: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.FILE,
        label: "media.fields.mask.label",
        description: "media.fields.mask.description",
        schema: z.instanceof(File).optional(),
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
    title: "media.images.edits.success.title",
    description: "media.images.edits.success.description",
  },
  examples: {
    requests: {
      default: {
        model: "qwen-edit",
        prompt: "Make it a snowy winter night",
        image_url: "https://example.com/photo.png",
      },
    },
    responses: { default: { created: 1_767_225_600 } },
  },
});

const v1ImagesEditsEndpoints = { POST } as const;
export default v1ImagesEditsEndpoints;

export type V1ImagesEditsPostRequestOutput = typeof POST.types.RequestOutput;
