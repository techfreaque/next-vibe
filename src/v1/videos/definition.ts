/**
 * POST /v1/videos - start an async video job, in the shape of OpenAI's video
 * API (JSON or multipart with `input_reference`). Answers at once with the
 * queued video object; poll GET /v1/videos/{id}, download
 * GET /v1/videos/{id}/content. Served at /api/<locale>/v1/videos,
 * authenticated by API key only. The declared response is nominal.
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
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../i18n";
import { V1_VIDEOS_ALIAS } from "../shared/constants";
import { V1_ERROR_TYPES } from "../shared/error-types";

export const V1_VIDEO_ASPECT_RATIOS = [
  "16:9",
  "9:16",
  "1:1",
  "4:3",
  "3:4",
  "3:2",
  "2:3",
  "21:9",
  "9:21",
] as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["v1", "videos"],
  aliases: [V1_VIDEOS_ALIAS] as const,
  title: "media.videos.create.title",
  titleShort: "media.videos.create.titleShort",
  description: "media.videos.create.description",
  icon: "video",
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
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "media.videos.create.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true } as const,
    children: {
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.model.label",
        description: "media.fields.model.videoDescription",
        schema: z.string().min(1),
      }),
      prompt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "media.fields.prompt.label",
        description: "media.fields.prompt.videoDescription",
        schema: z.string().min(1).max(2000),
      }),
      seconds: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "media.fields.seconds.label",
        description: "media.fields.seconds.videoDescription",
        schema: z.coerce.number().int().min(1).max(120).optional(),
      }),
      size: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.size.label",
        description: "media.fields.size.videoDescription",
        schema: z
          .string()
          .regex(/^\d{2,5}x\d{2,5}$/)
          .optional(),
      }),
      aspect_ratio: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.aspectRatio.label",
        description: "media.fields.aspectRatio.videoDescription",
        schema: z.enum(V1_VIDEO_ASPECT_RATIOS).optional(),
      }),
      resolution: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.resolution.label",
        description: "media.fields.resolution.description",
        schema: z.string().optional(),
      }),
      negative_prompt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.negativePrompt.label",
        description: "media.fields.negativePrompt.description",
        schema: z.string().max(1000).optional(),
      }),
      image_url: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.imageUrl.label",
        description: "media.fields.imageUrl.videoDescription",
        schema: z.string().optional(),
      }),
      input_reference: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.FILE,
        label: "media.fields.inputReference.label",
        description: "media.fields.inputReference.description",
        schema: z.instanceof(File).optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "media.response.id",
        schema: z.string(),
      }),
    },
  }),
  errorTypes: V1_ERROR_TYPES,
  successTypes: {
    title: "media.videos.create.success.title",
    description: "media.videos.create.success.description",
  },
  examples: {
    requests: {
      default: {
        model: "wan-2-7-t2v",
        prompt: "A paper boat drifting down a rainy street, cinematic",
        seconds: 5,
        size: "1280x720",
      },
    },
    responses: { default: { id: "video_8f2c0e5a7b1d4c3e9a6f0b2d4e6a8c1f" } },
  },
});

const v1VideosEndpoints = { POST } as const;
export default v1VideosEndpoints;

export type V1VideosPostRequestOutput = typeof POST.types.RequestOutput;
