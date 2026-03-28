/**
 * Image Generation API Route Definition
 * Generates images from text prompts using various AI providers
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  IMAGE_MODEL_IDS,
  IMAGE_QUALITY_VALUES,
  IMAGE_SIZE_VALUES,
  ImageModelOptions,
  ImageQuality,
  ImageQualityOptions,
  ImageSize,
  ImageSizeOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";
import { ImageGenerationContainer } from "./widget";

/**
 * Image Generation Endpoint (POST)
 * Generates an image from a text prompt
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "image-generation"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PUBLIC,
    UserRole.AI_TOOL_OFF,
  ],

  title: "post.title",
  description: "post.description",
  icon: "image",
  category: "endpointCategories.ai",
  tags: ["tags.image", "tags.generation", "tags.ai"],

  fields: customWidgetObject({
    render: ImageGenerationContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      prompt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.prompt.label",
        description: "post.prompt.description",
        columns: 12,
        placeholder: "post.prompt.placeholder",
        schema: z.string().min(1).max(2000),
      }),
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.model.label",
        description: "post.model.description",
        columns: 6,
        options: ImageModelOptions,
        schema: z.enum(IMAGE_MODEL_IDS).default(IMAGE_MODEL_IDS[0]),
      }),
      size: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.size.label",
        description: "post.size.description",
        columns: 6,
        options: ImageSizeOptions,
        schema: z.enum(IMAGE_SIZE_VALUES).default(ImageSize.SQUARE_1024),
      }),
      quality: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.quality.label",
        description: "post.quality.description",
        columns: 6,
        options: ImageQualityOptions,
        schema: z.enum(IMAGE_QUALITY_VALUES).default(ImageQuality.STANDARD),
      }),
      // === RESPONSE FIELDS ===
      imageUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.imageUrl",
        schema: z.string(),
      }),
      creditCost: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.creditCost",
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation_failed.title",
      description: "post.errors.validation_failed.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network_error.title",
      description: "post.errors.network_error.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.not_found.title",
      description: "post.errors.not_found.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server_error.title",
      description: "post.errors.server_error.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown_error.title",
      description: "post.errors.unknown_error.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsaved_changes.title",
      description: "post.errors.unsaved_changes.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        prompt: "A photorealistic sunset over a mountain lake",
        model: IMAGE_MODEL_IDS[0],
        size: ImageSize.SQUARE_1024,
        quality: ImageQuality.STANDARD,
      },
    },
    responses: {
      default: {
        imageUrl: "https://example.com/generated-image.png",
        creditCost: 4,
      },
    },
  },
});

// Extract types
export type ImageGenerationPostRequestInput = typeof POST.types.RequestInput;
export type ImageGenerationPostRequestOutput = typeof POST.types.RequestOutput;
export type ImageGenerationPostResponseInput = typeof POST.types.ResponseInput;
export type ImageGenerationPostResponseOutput =
  typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  POST,
} as const;
export default definitions;
