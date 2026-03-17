/**
 * Chat Settings API Definition
 * Defines endpoints for managing user chat settings
 */

import { z } from "zod";

import {
  ModelId,
  ModelIdOptions,
} from "@/app/api/[locale]/agent/models/models";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { TtsVoiceDB, TtsVoiceOptions } from "../../text-to-speech/enum";
import { ViewMode, ViewModeDB, ViewModeOptions } from "../enum";
import {
  CHAT_SETTINGS_GET_ALIAS,
  CHAT_SETTINGS_UPDATE_ALIAS,
} from "./constants";
import { scopedTranslation } from "./i18n";

/**
 * Get Chat Settings Endpoint (GET)
 * Retrieves current user's chat settings
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "settings"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "settings" as const,
  category: "app.endpointCategories.chatSettings",
  tags: ["tags.settings" as const],

  aliases: [CHAT_SETTINGS_GET_ALIAS],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { response: true },
    children: {
      selectedModel: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(ModelId),
      }),
      selectedSkill: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string(),
      }),
      activeFavoriteId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
      ttsAutoplay: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
      ttsVoice: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(TtsVoiceDB),
      }),
      viewMode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(ViewModeDB),
      }),
      availableTools: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z
          .array(
            z.object({
              toolId: z.string(),
              requiresConfirmation: z.boolean().default(false),
            }),
          )
          .nullable(),
      }),
      pinnedTools: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z
          .array(
            z.object({
              toolId: z.string(),
              requiresConfirmation: z.boolean().default(false),
            }),
          )
          .nullable(),
      }),

      // Auto-compacting token threshold (null = use global default COMPACT_TRIGGER)
      compactTrigger: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nullable(),
      }),

      // Memory budget limit (null = use DEFAULT_MEMORY_BUDGET = 4000 chars)
      memoryLimit: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nullable(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    responses: {
      get: {
        selectedModel: ModelId.CLAUDE_SONNET_4_5,
        selectedSkill: "default",
        activeFavoriteId: null,
        ttsAutoplay: false,
        ttsVoice: TtsVoiceDB[0],
        viewMode: ViewMode.LINEAR,
        availableTools: null,
        pinnedTools: null,
        compactTrigger: null,
        memoryLimit: null,
      },
    },
  },
});

/**
 * Update Chat Settings Endpoint (POST)
 * Creates or updates user's chat settings
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "chat", "settings"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "settings" as const,
  category: "app.endpointCategories.chatSettings",
  tags: ["tags.settings" as const],

  aliases: [CHAT_SETTINGS_UPDATE_ALIAS],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data" },
    children: {
      selectedModel: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.selectedModel.label" as const,
        options: ModelIdOptions,
        columns: 6,
        schema: z.enum(ModelId).optional(),
      }),
      selectedSkill: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.selectedSkill.label" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      activeFavoriteId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.activeFavoriteId.label" as const,
        columns: 6,
        schema: z.string().nullable().optional(),
      }),
      ttsAutoplay: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.ttsAutoplay.label" as const,
        columns: 12,
        schema: z.boolean().optional(),
      }),
      ttsVoice: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.ttsVoice.label" as const,
        options: TtsVoiceOptions,
        columns: 6,
        schema: z.enum(TtsVoiceDB).optional(),
      }),
      viewMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.viewMode.label" as const,
        options: ViewModeOptions,
        columns: 6,
        schema: z.enum(ViewModeDB).optional(),
      }),
      availableTools: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.availableTools.label" as const,
        columns: 12,
        schema: z
          .array(
            z.object({
              toolId: z.string(),
              requiresConfirmation: z.boolean().default(false),
            }),
          )
          .nullable()
          .optional(),
      }),
      pinnedTools: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.pinnedTools.label" as const,
        columns: 12,
        schema: z
          .array(
            z.object({
              toolId: z.string(),
              requiresConfirmation: z.boolean().default(false),
            }),
          )
          .nullable()
          .optional(),
      }),

      // Auto-compacting token threshold (null = use global default COMPACT_TRIGGER)
      // Hidden from default widget — rendered via CompactTriggerEdit in custom UI
      compactTrigger: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.compactTrigger.label" as const,
        hidden: true,
        columns: 6,
        schema: z.number().int().min(1000).max(200000).nullable().optional(),
      }),

      // Memory budget limit (null = use DEFAULT_MEMORY_BUDGET = 4000 chars)
      memoryLimit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.memoryLimit.label" as const,
        description: "post.memoryLimit.description" as const,
        hidden: true,
        columns: 6,
        schema: z.number().int().min(100).max(100000).nullable().optional(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    requests: {
      update: {
        ttsAutoplay: true,
      },
    },
  },
});

// Type exports for GET endpoint
export type ChatSettingsGetRequestInput = typeof GET.types.RequestInput;
export type ChatSettingsGetResponseOutput = typeof GET.types.ResponseOutput;

// Type exports for POST endpoint
export type ChatSettingsUpdateRequestInput = typeof POST.types.RequestInput;
export type ChatSettingsUpdateRequestOutput = typeof POST.types.RequestOutput;
export type ChatSettingsUpdateResponseOutput = typeof POST.types.ResponseOutput;
export type ToolConfigItem = NonNullable<
  ChatSettingsUpdateRequestInput["availableTools"]
>[number];
const definitions = { GET, POST };
export default definitions;
