/**
 * Chat Settings API Definition
 * Defines endpoints for managing user chat settings
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
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
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { ChatModelId, ChatModelIdOptions } from "../../ai-stream/models";
import { SearchProviderDB, SearchProviderOptions } from "../../search/enum";
import { ViewMode, ViewModeDB, ViewModeOptions } from "../enum";
import {
  CHAT_SETTINGS_GET_ALIAS,
  CHAT_SETTINGS_UPDATE_ALIAS,
} from "./constants";
import { scopedTranslation } from "./i18n";

const ChatSettingsWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ChatSettingsWidget })),
);

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
  category: "endpointCategories.chat",
  subCategory: "endpointCategories.chatSettings",
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
        schema: z.enum(ChatModelId).nullish(),
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
      viewMode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(ViewModeDB),
      }),

      // Preferred web search provider. null = auto-detect
      searchProvider: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(SearchProviderDB).nullable(),
      }),

      // Coding agent provider (admin-only). null = "claude-code"
      codingAgent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(["claude-code", "open-code"]).nullable(),
      }),

      // Dreaming pulse settings
      dreamerEnabled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
      dreamerFavoriteId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
      dreamerSchedule: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string(),
      }),
      dreamerPrompt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),

      // Autopilot pulse settings
      autopilotEnabled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
      autopilotFavoriteId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
      autopilotSchedule: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string(),
      }),
      autopilotPrompt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
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
        selectedModel: ChatModelId.CLAUDE_SONNET_4_5,
        selectedSkill: "default",
        activeFavoriteId: null,
        ttsAutoplay: false,
        viewMode: ViewMode.LINEAR,
        searchProvider: null,
        codingAgent: null,
        dreamerEnabled: false,
        dreamerFavoriteId: null,
        dreamerSchedule: "0 2 * * *",
        dreamerPrompt: null,
        autopilotEnabled: false,
        autopilotFavoriteId: null,
        autopilotSchedule: "0 8 * * 1-5",
        autopilotPrompt: null,
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
  category: "endpointCategories.chat",
  subCategory: "endpointCategories.chatSettings",
  tags: ["tags.settings" as const],

  aliases: [CHAT_SETTINGS_UPDATE_ALIAS],

  fields: customWidgetObject({
    render: ChatSettingsWidget,
    noFormElement: true,
    usage: { request: "data" } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data" },
      }),
      selectedModel: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.selectedModel.label" as const,
        options: ChatModelIdOptions,
        columns: 6,
        schema: z.enum(ChatModelId).optional(),
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
      viewMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.viewMode.label" as const,
        options: ViewModeOptions,
        columns: 6,
        schema: z.enum(ViewModeDB).optional(),
      }),
      // Preferred web search provider. null = auto-detect
      searchProvider: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.searchProvider.label" as const,
        description: "post.searchProvider.description" as const,
        columns: 6,
        options: SearchProviderOptions,
        schema: z.enum(SearchProviderDB).nullable().optional(),
      }),

      // Coding agent provider (admin-only). null = "claude-code" (default)
      codingAgent: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.codingAgent.label" as const,
        description: "post.codingAgent.description" as const,
        allowedRoles: [UserRole.ADMIN],
        columns: 6,
        options: [
          {
            value: "claude-code",
            label: "post.codingAgent.options.claudeCode" as const,
          },
          {
            value: "open-code",
            label: "post.codingAgent.options.openCode" as const,
          },
        ],
        schema: z.enum(["claude-code", "open-code"]).nullable().optional(),
      }),

      // Dreaming pulse settings
      dreamerEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.dreaming.toggle.label" as const,
        columns: 12,
        schema: z.boolean().optional(),
      }),
      dreamerFavoriteId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.dreaming.favoriteId.label" as const,
        columns: 6,
        schema: z.string().nullable().optional(),
      }),
      dreamerSchedule: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.dreaming.schedule.label" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      dreamerPrompt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.dreaming.prompt.label" as const,
        columns: 12,
        schema: z.string().nullable().optional(),
      }),

      // Autopilot pulse settings
      autopilotEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.autopilot.toggle.label" as const,
        columns: 12,
        schema: z.boolean().optional(),
      }),
      autopilotFavoriteId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.autopilot.favoriteId.label" as const,
        columns: 6,
        schema: z.string().nullable().optional(),
      }),
      autopilotSchedule: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.autopilot.schedule.label" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      autopilotPrompt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.autopilot.prompt.label" as const,
        columns: 12,
        schema: z.string().nullable().optional(),
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
export interface ToolConfigItem {
  toolId: string;
  requiresConfirmation: boolean;
}
const definitions = { GET, POST };
export default definitions;
