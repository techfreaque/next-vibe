/**
 * Single Favorite API Definition
 * Defines endpoints for getting, updating, and deleting a single favorite
 */

import { z } from "zod";

import { ModelId } from "@/app/api/[locale]/agent/chat/model-access/models";
import {
  TtsVoiceDB,
  TtsVoiceOptions,
} from "@/app/api/[locale]/agent/text-to-speech/enum";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  requestUrlPathParamsField,
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

import {
  ContentLevelFilter,
  ContentLevelFilterDB,
  ContentLevelFilterOptions,
  IntelligenceLevelFilter,
  IntelligenceLevelFilterDB,
  IntelligenceLevelFilterOptions,
  ModelSelectionMode,
  ModelSelectionModeDB,
  ModelSelectionModeOptions,
  PriceLevelFilter,
  PriceLevelFilterDB,
  PriceLevelFilterOptions,
} from "../enum";

/**
 * Get Single Favorite Endpoint (GET)
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "favorites", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.favorites.id.get.title" as const,
  description: "app.api.agent.chat.favorites.id.get.description" as const,
  icon: "star" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.favorites" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.favorites.id.get.container.title" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams", response: true },
    {
      // === REQUEST (URL Path Params) ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.favorites.id.get.id.label" as const,
        },
        z.string().uuid(),
      ),

      // === RESPONSE ===
      characterId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.favorites.id.get.response.characterId.content" as const,
        },
        z.string(),
      ),
      customName: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.favorites.id.get.response.customName.content" as const,
        },
        z.string().nullable(),
      ),
      voice: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.favorites.id.get.response.voice.content" as const,
        },
        z.enum(TtsVoiceDB).nullable(),
      ),
      mode: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.favorites.id.get.response.mode.content" as const,
        },
        z.enum(ModelSelectionModeDB),
      ),
      intelligence: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.favorites.id.get.response.intelligence.content" as const,
        },
        z.enum(IntelligenceLevelFilterDB),
      ),
      maxPrice: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.favorites.id.get.response.maxPrice.content" as const,
        },
        z.enum(PriceLevelFilterDB),
      ),
      content: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.favorites.id.get.response.content.content" as const,
        },
        z.enum(ContentLevelFilterDB),
      ),
      manualModelId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.favorites.id.get.response.manualModelId.content" as const,
        },
        z.enum(ModelId).nullable(),
      ),
      position: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.favorites.id.get.response.position.content" as const,
        },
        z.number(),
      ),
      color: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.favorites.id.get.response.color.content" as const,
        },
        z.string().nullable(),
      ),
      isActive: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.favorites.id.get.response.isActive.content" as const,
        },
        z.boolean(),
      ),
      useCount: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.favorites.id.get.response.useCount.content" as const,
        },
        z.number(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.favorites.id.get.errors.validation.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.favorites.id.get.errors.network.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.favorites.id.get.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.favorites.id.get.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.favorites.id.get.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.favorites.id.get.errors.server.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.favorites.id.get.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.favorites.id.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.favorites.id.get.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.favorites.id.get.success.title" as const,
    description:
      "app.api.agent.chat.favorites.id.get.success.description" as const,
  },

  examples: {
    requests: undefined,
    responses: {
      get: {
        characterId: "thea",
        customName: "Thea (Smart)",
        voice: null,
        mode: ModelSelectionMode.AUTO,
        intelligence: IntelligenceLevelFilter.SMART,
        maxPrice: PriceLevelFilter.STANDARD,
        content: ContentLevelFilter.OPEN,
        manualModelId: null,
        position: 0,
        color: null,
        isActive: true,
        useCount: 50,
      },
    },
    urlPathParams: {
      get: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

/**
 * Update Favorite Endpoint (PATCH)
 */
const { PATCH } = createEndpoint({
  method: Methods.PATCH,
  path: ["agent", "chat", "favorites", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.favorites.id.patch.title" as const,
  description: "app.api.agent.chat.favorites.id.patch.description" as const,
  icon: "edit" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.favorites" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.favorites.id.patch.container.title" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === REQUEST (URL Path Params) ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.favorites.id.patch.id.label" as const,
        },
        z.string().uuid(),
      ),

      // === REQUEST (Data) ===
      characterId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.agent.chat.favorites.id.patch.characterId.label" as const,
          columns: 6,
        },
        z.string().optional(),
      ),
      customName: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.agent.chat.favorites.id.patch.customName.label" as const,
          columns: 6,
        },
        z.string().nullable().optional(),
      ),
      voice: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.favorites.id.patch.voice.label" as const,
          description:
            "app.api.agent.chat.favorites.id.patch.voice.description" as const,
          options: TtsVoiceOptions,
          columns: 6,
        },
        z.enum(TtsVoiceDB).nullable().optional(),
      ),
      mode: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.favorites.id.patch.mode.label" as const,
          options: ModelSelectionModeOptions,
          columns: 6,
        },
        z.enum(ModelSelectionModeDB).optional(),
      ),
      intelligence: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.agent.chat.favorites.id.patch.intelligence.label" as const,
          options: IntelligenceLevelFilterOptions,
          columns: 6,
        },
        z.enum(IntelligenceLevelFilterDB).optional(),
      ),
      maxPrice: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.agent.chat.favorites.id.patch.maxPrice.label" as const,
          options: PriceLevelFilterOptions,
          columns: 6,
        },
        z.enum(PriceLevelFilterDB).optional(),
      ),
      content: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.favorites.id.patch.content.label" as const,
          options: ContentLevelFilterOptions,
          columns: 6,
        },
        z.enum(ContentLevelFilterDB).optional(),
      ),
      manualModelId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.agent.chat.favorites.id.patch.manualModelId.label" as const,
          columns: 6,
        },
        z.enum(ModelId).nullable().optional(),
      ),
      isActive: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.agent.chat.favorites.id.patch.isActive.label" as const,
          columns: 6,
        },
        z.boolean().optional(),
      ),
      position: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.agent.chat.favorites.id.patch.position.label" as const,
          columns: 6,
        },
        z.number().optional(),
      ),

      // === RESPONSE ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.favorites.id.patch.response.success.content" as const,
        },
        z.boolean(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.validation.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.network.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.server.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.favorites.id.patch.success.title" as const,
    description:
      "app.api.agent.chat.favorites.id.patch.success.description" as const,
  },

  examples: {
    requests: {
      update: {
        customName: "Thea (Brilliant)",
        intelligence: IntelligenceLevelFilter.BRILLIANT,
      },
    },
    responses: {
      update: {
        success: true,
      },
    },
    urlPathParams: {
      update: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

/**
 * Delete Favorite Endpoint (DELETE)
 */
const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["agent", "chat", "favorites", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.favorites.id.delete.title" as const,
  description: "app.api.agent.chat.favorites.id.delete.description" as const,
  icon: "trash" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.favorites" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.favorites.id.delete.container.title" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams", response: true },
    {
      // === REQUEST (URL Path Params) ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.favorites.id.delete.id.label" as const,
        },
        z.string().uuid(),
      ),

      // === RESPONSE ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.favorites.id.delete.response.success.content" as const,
        },
        z.boolean(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.validation.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.network.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.server.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.favorites.id.delete.success.title" as const,
    description:
      "app.api.agent.chat.favorites.id.delete.success.description" as const,
  },

  examples: {
    requests: undefined,
    responses: {
      delete: {
        success: true,
      },
    },
    urlPathParams: {
      delete: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

// Type exports
export type FavoriteGetRequestInput = typeof GET.types.RequestInput;
export type FavoriteGetRequestOutput = typeof GET.types.RequestOutput;
export type FavoriteGetUrlVariablesInput = typeof GET.types.UrlVariablesInput;
export type FavoriteGetUrlVariablesOutput = typeof GET.types.UrlVariablesOutput;
export type FavoriteGetResponseInput = typeof GET.types.ResponseInput;
export type FavoriteGetResponseOutput = typeof GET.types.ResponseOutput;

export type FavoriteUpdateRequestInput = typeof PATCH.types.RequestInput;
export type FavoriteUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type FavoriteUpdateUrlVariablesInput =
  typeof PATCH.types.UrlVariablesInput;
export type FavoriteUpdateUrlVariablesOutput =
  typeof PATCH.types.UrlVariablesOutput;
export type FavoriteUpdateResponseInput = typeof PATCH.types.ResponseInput;
export type FavoriteUpdateResponseOutput = typeof PATCH.types.ResponseOutput;

export type FavoriteDeleteRequestInput = typeof DELETE.types.RequestInput;
export type FavoriteDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type FavoriteDeleteUrlVariablesInput =
  typeof DELETE.types.UrlVariablesInput;
export type FavoriteDeleteUrlVariablesOutput =
  typeof DELETE.types.UrlVariablesOutput;
export type FavoriteDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type FavoriteDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

const definitions = { GET, PATCH, DELETE };
export { DELETE, GET, PATCH };
export default definitions;
