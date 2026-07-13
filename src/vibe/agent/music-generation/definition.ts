/**
 * Music Generation API Route Definition
 * Generates music from text prompts using various AI providers
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  backButton,
  customWidgetObject,
  requestField,
  responseField,
  submitButton,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { lazyWidget } from "../../unified-ui/_shared/lazy-widget";
import { MUSIC_GEN_ALIAS } from "./constants";
import {
  DEFAULT_MUSIC_DURATION,
  MusicDuration,
  MusicDurationOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";
import { MusicGenModelId, MusicGenModelIdOptions } from "./models";

const MusicGenerationContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.MusicGenerationContainer })),
);

/**
 * Music Generation Endpoint (POST)
 * Generates music from a text prompt
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "music-generation"],
  aliases: [MUSIC_GEN_ALIAS],
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PUBLIC],
  defaultWebPinned: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PUBLIC],

  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  timeoutMs: 0,
  icon: "music",
  category: "ai",
  subCategory: "Generation",
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
        label: "post.response.audioUrl",
        schema: z.string(),
      }),
      creditCost: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.creditCost",
        schema: z.number(),
      }),
      durationSeconds: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.durationSeconds",
        schema: z.number(),
      }),
      /** Async job ID for polling (future async generation) */
      jobId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.jobId",
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
