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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
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

/**
 * Get Chat Settings Endpoint (GET)
 * Retrieves current user's chat settings
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "settings"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const,

  title: "app.api.agent.chat.settings.get.title" as const,
  description: "app.api.agent.chat.settings.get.description" as const,
  icon: "settings" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.settings" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
    },
    { response: true },
    {
      selectedModel: responseField({
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(ModelId),
      }),
      selectedCharacter: responseField({
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string(),
      }),
      activeFavoriteId: responseField({
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
      ttsAutoplay: responseField({
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
      ttsVoice: responseField({
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(TtsVoiceDB),
      }),
      viewMode: responseField({
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(ViewModeDB),
      }),
      enabledTools: responseField({
        type: WidgetType.TEXT,
        hidden: true,
        schema: z
          .array(
            z.object({
              id: z.string(),
              requiresConfirmation: z.boolean(),
              active: z.boolean(),
            }),
          )
          .nullable(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.settings.get.errors.validation.title" as const,
      description:
        "app.api.agent.chat.settings.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.settings.get.errors.network.title" as const,
      description:
        "app.api.agent.chat.settings.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.settings.get.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.settings.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.settings.get.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.settings.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.settings.get.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.settings.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.settings.get.errors.server.title" as const,
      description:
        "app.api.agent.chat.settings.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.settings.get.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.settings.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.settings.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.settings.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.settings.get.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.settings.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.settings.get.success.title" as const,
    description: "app.api.agent.chat.settings.get.success.description" as const,
  },

  examples: {
    responses: {
      get: {
        selectedModel: ModelId.CLAUDE_SONNET_4_5,
        selectedCharacter: "default",
        activeFavoriteId: null,
        ttsAutoplay: false,
        ttsVoice: TtsVoiceDB[0],
        viewMode: ViewMode.LINEAR,
        enabledTools: null,
      },
    },
  },
});

/**
 * Update Chat Settings Endpoint (POST)
 * Creates or updates user's chat settings
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["agent", "chat", "settings"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const,

  title: "app.api.agent.chat.settings.post.title" as const,
  description: "app.api.agent.chat.settings.post.description" as const,
  icon: "settings" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.settings" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.settings.post.container.title" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data" },
    {
      selectedModel: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.agent.chat.settings.post.selectedModel.label" as const,
        options: ModelIdOptions,
        columns: 6,
        schema: z.enum(ModelId).optional(),
      }),
      selectedCharacter: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.settings.post.selectedCharacter.label" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      activeFavoriteId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.settings.post.activeFavoriteId.label" as const,
        columns: 6,
        schema: z.string().nullable().optional(),
      }),
      ttsAutoplay: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.agent.chat.settings.post.ttsAutoplay.label" as const,
        columns: 12,
        schema: z.boolean().optional(),
      }),
      ttsVoice: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.agent.chat.settings.post.ttsVoice.label" as const,
        options: TtsVoiceOptions,
        columns: 6,
        schema: z.enum(TtsVoiceDB).optional(),
      }),
      viewMode: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.agent.chat.settings.post.viewMode.label" as const,
        options: ViewModeOptions,
        columns: 6,
        schema: z.enum(ViewModeDB).optional(),
      }),
      enabledTools: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.chat.settings.post.enabledTools.label" as const,
        columns: 12,
        schema: z
          .array(
            z.object({
              id: z.string(),
              requiresConfirmation: z.boolean(),
              active: z.boolean(),
            }),
          )
          .nullable()
          .optional(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.settings.post.errors.validation.title" as const,
      description:
        "app.api.agent.chat.settings.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.settings.post.errors.network.title" as const,
      description:
        "app.api.agent.chat.settings.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.settings.post.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.settings.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.settings.post.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.settings.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.settings.post.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.settings.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.settings.post.errors.server.title" as const,
      description:
        "app.api.agent.chat.settings.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.settings.post.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.settings.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.settings.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.settings.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.settings.post.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.settings.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.settings.post.success.title" as const,
    description:
      "app.api.agent.chat.settings.post.success.description" as const,
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

const definitions = { GET, POST };
export default definitions;
