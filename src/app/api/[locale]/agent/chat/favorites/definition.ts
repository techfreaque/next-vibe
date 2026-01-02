/**
 * Favorites API Definition
 * Defines endpoints for managing user favorites (character + model settings)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  responseArrayField,
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
import { IconKeyDB } from "../model-access/icons";
import { ModelId } from "../model-access/models";
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
} from "./enum";

/**
 * Get Favorites List Endpoint (GET)
 * Retrieves all favorites for the current user
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "favorites"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.favorites.get.title" as const,
  description: "app.api.agent.chat.favorites.get.description" as const,
  icon: "star" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.favorites" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.favorites.get.container.title" as const,
      description: "app.api.agent.chat.favorites.get.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { response: true },
    {
      favorites: responseArrayField(
        {
          type: WidgetType.DATA_CARDS,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title: "app.api.agent.chat.favorites.get.response.favorite.title" as const,
            layoutType: LayoutType.GRID,
            columns: 2,
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.agent.chat.favorites.get.response.favorite.id.content" as const,
              },
              z.string().uuid(),
            ),
            characterId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.favorites.get.response.favorite.characterId.content" as const,
              },
              z.string(),
            ),
            customName: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.favorites.get.response.favorite.customName.content" as const,
              },
              z.string().nullable(),
            ),
            customIcon: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.favorites.get.response.favorite.customIcon.content" as const,
              },
              z.enum(IconKeyDB).nullable(),
            ),
            voice: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.favorites.get.response.favorite.voice.content" as const,
              },
              z.enum(TtsVoiceDB).nullable(),
            ),
            mode: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.agent.chat.favorites.get.response.favorite.mode.content" as const,
              },
              z.enum(ModelSelectionModeDB),
            ),
            intelligence: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.favorites.get.response.favorite.intelligence.content" as const,
              },
              z.enum(IntelligenceLevelFilterDB),
            ),
            maxPrice: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.favorites.get.response.favorite.maxPrice.content" as const,
              },
              z.enum(PriceLevelFilterDB),
            ),
            content: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.favorites.get.response.favorite.content.content" as const,
              },
              z.enum(ContentLevelFilterDB),
            ),
            manualModelId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.favorites.get.response.favorite.manualModelId.content" as const,
              },
              z.enum(ModelId).nullable(),
            ),
            position: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.favorites.get.response.favorite.position.content" as const,
              },
              z.number(),
            ),
            color: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.favorites.get.response.favorite.color.content" as const,
              },
              z.string().nullable(),
            ),
            isActive: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.favorites.get.response.favorite.isActive.content" as const,
              },
              z.boolean(),
            ),
            useCount: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.favorites.get.response.favorite.useCount.content" as const,
              },
              z.number(),
            ),
          },
        ),
      ),
      hasCompanion: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.favorites.get.response.hasCompanion.content" as const,
        },
        z.boolean(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.favorites.get.errors.validation.title" as const,
      description: "app.api.agent.chat.favorites.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.favorites.get.errors.network.title" as const,
      description: "app.api.agent.chat.favorites.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.favorites.get.errors.unauthorized.title" as const,
      description: "app.api.agent.chat.favorites.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.favorites.get.errors.forbidden.title" as const,
      description: "app.api.agent.chat.favorites.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.favorites.get.errors.notFound.title" as const,
      description: "app.api.agent.chat.favorites.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.favorites.get.errors.server.title" as const,
      description: "app.api.agent.chat.favorites.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.favorites.get.errors.unknown.title" as const,
      description: "app.api.agent.chat.favorites.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.favorites.get.errors.unsavedChanges.title" as const,
      description: "app.api.agent.chat.favorites.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.favorites.get.errors.conflict.title" as const,
      description: "app.api.agent.chat.favorites.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.favorites.get.success.title" as const,
    description: "app.api.agent.chat.favorites.get.success.description" as const,
  },

  examples: {
    requests: undefined,
    responses: {
      listAll: {
        favorites: [
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            characterId: "thea",
            customName: "Thea (Smart)",
            customIcon: null,
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
        ],
        hasCompanion: true,
      },
    },
    urlPathParams: undefined,
  },
});

/**
 * Create Favorite Endpoint (POST)
 * Creates a new favorite for the current user
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["agent", "chat", "favorites"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.favorites.post.title" as const,
  description: "app.api.agent.chat.favorites.post.description" as const,
  icon: "plus" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.favorites" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.favorites.post.container.title" as const,
      description: "app.api.agent.chat.favorites.post.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data", response: true },
    {
      // === REQUEST ===
      characterId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.favorites.post.characterId.label" as const,
          description: "app.api.agent.chat.favorites.post.characterId.description" as const,
          columns: 6,
        },
        z.string(),
      ),
      customName: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.favorites.post.customName.label" as const,
          description: "app.api.agent.chat.favorites.post.customName.description" as const,
          columns: 6,
        },
        z.string().optional(),
      ),
      voice: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.favorites.post.voice.label" as const,
          description: "app.api.agent.chat.favorites.post.voice.description" as const,
          options: TtsVoiceOptions,
          columns: 6,
        },
        z.enum(TtsVoiceDB).nullable().optional(),
      ),
      mode: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.favorites.post.mode.label" as const,
          description: "app.api.agent.chat.favorites.post.mode.description" as const,
          options: ModelSelectionModeOptions,
          columns: 6,
        },
        z.enum(ModelSelectionModeDB),
      ),
      intelligence: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.favorites.post.intelligence.label" as const,
          description: "app.api.agent.chat.favorites.post.intelligence.description" as const,
          options: IntelligenceLevelFilterOptions,
          columns: 6,
        },
        z.enum(IntelligenceLevelFilterDB),
      ),
      maxPrice: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.favorites.post.maxPrice.label" as const,
          description: "app.api.agent.chat.favorites.post.maxPrice.description" as const,
          options: PriceLevelFilterOptions,
          columns: 6,
        },
        z.enum(PriceLevelFilterDB),
      ),
      content: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.favorites.post.content.label" as const,
          description: "app.api.agent.chat.favorites.post.content.description" as const,
          options: ContentLevelFilterOptions,
          columns: 6,
        },
        z.enum(ContentLevelFilterDB),
      ),
      manualModelId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.favorites.post.manualModelId.label" as const,
          description: "app.api.agent.chat.favorites.post.manualModelId.description" as const,
          columns: 6,
        },
        z.enum(ModelId).optional(),
      ),

      // === RESPONSE ===
      id: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.favorites.post.response.id.content" as const,
        },
        z.string().uuid(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.favorites.post.errors.validation.title" as const,
      description: "app.api.agent.chat.favorites.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.favorites.post.errors.network.title" as const,
      description: "app.api.agent.chat.favorites.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.favorites.post.errors.unauthorized.title" as const,
      description: "app.api.agent.chat.favorites.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.favorites.post.errors.forbidden.title" as const,
      description: "app.api.agent.chat.favorites.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.favorites.post.errors.notFound.title" as const,
      description: "app.api.agent.chat.favorites.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.favorites.post.errors.server.title" as const,
      description: "app.api.agent.chat.favorites.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.favorites.post.errors.unknown.title" as const,
      description: "app.api.agent.chat.favorites.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.favorites.post.errors.unsavedChanges.title" as const,
      description: "app.api.agent.chat.favorites.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.favorites.post.errors.conflict.title" as const,
      description: "app.api.agent.chat.favorites.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.favorites.post.success.title" as const,
    description: "app.api.agent.chat.favorites.post.success.description" as const,
  },

  examples: {
    requests: {
      create: {
        characterId: "thea",
        customName: "Thea (Smart)",
        mode: ModelSelectionMode.AUTO,
        intelligence: IntelligenceLevelFilter.SMART,
        maxPrice: PriceLevelFilter.STANDARD,
        content: ContentLevelFilter.OPEN,
      },
    },
    responses: {
      create: {
        id: "550e8400-e29b-41d4-a716-446655440000",
      },
    },
    urlPathParams: undefined,
  },
});

// Type exports for GET endpoint
export type FavoritesListRequestInput = typeof GET.types.RequestInput;
export type FavoritesListRequestOutput = typeof GET.types.RequestOutput;
export type FavoritesListResponseInput = typeof GET.types.ResponseInput;
export type FavoritesListResponseOutput = typeof GET.types.ResponseOutput;

// Type exports for POST endpoint
export type FavoriteCreateRequestInput = typeof POST.types.RequestInput;
export type FavoriteCreateRequestOutput = typeof POST.types.RequestOutput;
export type FavoriteCreateResponseInput = typeof POST.types.ResponseInput;
export type FavoriteCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { GET, POST };
export { GET, POST };
export default definitions;
