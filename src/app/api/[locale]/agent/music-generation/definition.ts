/**
 * Music Generation API Route Definition
 * Generates music from text prompts using various AI providers
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  requestField,
  responseField,
  submitButton,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  MusicGenModelId,
  MusicGenModelIdOptions,
} from "@/app/api/[locale]/agent/music-generation/models";
import { lazy } from "react";
import {
  DEFAULT_MUSIC_DURATION,
  MusicDuration,
  MusicDurationOptions,
} from "./enum";

import { MUSIC_GEN_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const MusicGenerationContainer = lazy(() =>
  import("./widget").then((m) => ({ default: m.MusicGenerationContainer })),
);

/**
 * Music Generation Endpoint (POST)
 * Generates music from a text prompt
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "music-generation"],
  aliases: [MUSIC_GEN_ALIAS],
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PUBLIC],

  title: "post.title",
  description: "post.description",
  icon: "music",
  category: "endpointCategories.ai",
  subCategory: "endpointCategories.aiGeneration",
  tags: ["tags.music", "tags.generation", "tags.ai"],
  dynamicTitle: ({ request }) => {
    const prompt = request?.prompt;
    if (!prompt?.trim()) {
      return undefined;
    }
    const short = prompt.length > 50 ? `${prompt.slice(0, 50)}...` : prompt;
    return {
      message: "post.dynamicTitle" as const,
      messageParams: { prompt: short },
    };
  },

  defaultExpanded: true,
  dynamicCredits: ({ response }) => response?.creditCost,

  fields: customWidgetObject({
    render: MusicGenerationContainer,
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
        options: MusicGenModelIdOptions,
        schema: z.enum(MusicGenModelId).optional(),
        hiddenForPlatforms: [Platform.AI],
      }),
      duration: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.duration.label",
        description: "post.duration.description",
        columns: 6,
        options: MusicDurationOptions,
        schema: z.enum(MusicDuration).default(MusicDuration.SHORT),
      }),
      inputMediaUrl: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.inputMediaUrl.label",
        description: "post.inputMediaUrl.description",
        columns: 12,
        placeholder: "post.inputMediaUrl.placeholder",
        schema: z.string().url().optional(),
      }),
      backButton: backButton(scopedTranslation, {
        label: "post.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),

      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "send",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
      }),

      // === RESPONSE FIELDS ===
      audioUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.audioUrl",
        schema: z.string(),
      }),
      creditCost: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.creditCost",
        schema: z.number(),
      }),
      durationSeconds: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.durationSeconds",
        schema: z.number(),
      }),
      /** Async job ID for polling (future async generation) */
      jobId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.jobId",
        schema: z.string().optional(),
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
        prompt: "Upbeat electronic music with a catchy melody",
        model: MusicGenModelId.LYRIA_3,
        duration: DEFAULT_MUSIC_DURATION,
      },
    },
    responses: {
      default: {
        audioUrl: "https://example.com/generated-music.mp3",
        creditCost: 13,
        durationSeconds: 20,
      },
    },
  },
});

// Extract types
export type MusicGenerationPostRequestInput = typeof POST.types.RequestInput;
export type MusicGenerationPostRequestOutput = typeof POST.types.RequestOutput;
export type MusicGenerationPostResponseInput = typeof POST.types.ResponseInput;
export type MusicGenerationPostResponseOutput =
  typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  POST,
} as const;
export default definitions;
