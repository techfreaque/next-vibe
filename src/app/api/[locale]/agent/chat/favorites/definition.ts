/**
 * Favorites API Definition
 * Defines endpoints for managing user favorites (character + model settings)
 */

import { z } from "zod";

import { ModelId, ModelIdOptions } from "@/app/api/[locale]/agent/models/models";
import { IconKeyDB } from "@/app/api/[locale]/system/unified-interface/react/icons";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  field,
  objectField,
  objectUnionField,
  requestDataField,
  requestDataRangeField,
  responseArrayField,
  responseArrayOptionalField,
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

import { ModelUtilityDB, ModelUtilityOptions } from "../../models/enum";
import { TtsVoiceDB, TtsVoiceOptions } from "../../text-to-speech/enum";
import {
  CONTENT_DISPLAY,
  INTELLIGENCE_DISPLAY,
  PRICE_DISPLAY,
  SPEED_DISPLAY,
} from "./display-configs";
import {
  ContentLevelFilter,
  ContentLevelFilterDB,
  IntelligenceLevelFilter,
  IntelligenceLevelFilterDB,
  ModelSelectionType,
  PriceLevelFilter,
  PriceLevelFilterDB,
  SpeedLevelFilter,
  SpeedLevelFilterDB,
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
            modelSelection: objectUnionField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.agent.chat.favorites.get.response.favorite.modelSelection.title" as const,
                layoutType: LayoutType.STACKED,
              },
              { response: true },
              "selectionType",
              [
                // Variant 1: Manual model selection
                objectField(
                  {
                    type: WidgetType.CONTAINER,
                    layoutType: LayoutType.STACKED,
                  },
                  { response: true },
                  {
                    selectionType: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.agent.chat.favorites.get.response.favorite.selectionType.content" as const,
                      },
                      z.literal(ModelSelectionType.MANUAL),
                    ),
                    manualModelId: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.agent.chat.favorites.get.response.favorite.manualModelId.content" as const,
                      },
                      z.enum(ModelId),
                    ),
                  },
                ),
                // Variant 2: Filter-based selection
                objectField(
                  {
                    type: WidgetType.CONTAINER,
                    layoutType: LayoutType.STACKED,
                  },
                  { response: true },
                  {
                    selectionType: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.agent.chat.favorites.get.response.favorite.selectionType.content" as const,
                      },
                      z.literal(ModelSelectionType.FILTERS),
                    ),
                    intelligenceRange: responseField(
                      {
                        type: WidgetType.CONTAINER,
                        layoutType: LayoutType.STACKED,
                      },
                      z
                        .object({
                          min: z.enum(IntelligenceLevelFilterDB).optional(),
                          max: z.enum(IntelligenceLevelFilterDB).optional(),
                        })
                        .optional(),
                    ),
                    priceRange: responseField(
                      {
                        type: WidgetType.CONTAINER,
                        layoutType: LayoutType.STACKED,
                      },
                      z
                        .object({
                          min: z.enum(PriceLevelFilterDB).optional(),
                          max: z.enum(PriceLevelFilterDB).optional(),
                        })
                        .optional(),
                    ),
                    contentRange: responseField(
                      {
                        type: WidgetType.CONTAINER,
                        layoutType: LayoutType.STACKED,
                      },
                      z
                        .object({
                          min: z.enum(ContentLevelFilterDB).optional(),
                          max: z.enum(ContentLevelFilterDB).optional(),
                        })
                        .optional(),
                    ),
                    speedRange: responseField(
                      {
                        type: WidgetType.CONTAINER,
                        layoutType: LayoutType.STACKED,
                      },
                      z
                        .object({
                          min: z.enum(SpeedLevelFilterDB).optional(),
                          max: z.enum(SpeedLevelFilterDB).optional(),
                        })
                        .optional(),
                    ),
                    preferredStrengths: responseArrayOptionalField(
                      {
                        type: WidgetType.DATA_LIST,
                      },
                      field(
                        z.enum(ModelUtilityDB),
                        { response: true },
                        {
                          type: WidgetType.TEXT,
                          content:
                            "app.api.agent.chat.favorites.get.response.favorite.preferredStrengths.content" as const,
                        },
                      ),
                    ),
                    ignoredWeaknesses: responseArrayOptionalField(
                      {
                        type: WidgetType.DATA_LIST,
                      },
                      field(
                        z.enum(ModelUtilityDB),
                        { response: true },
                        {
                          type: WidgetType.TEXT,
                          content:
                            "app.api.agent.chat.favorites.get.response.favorite.ignoredWeaknesses.content" as const,
                        },
                      ),
                    ),
                  },
                ),
              ],
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
            modelSelection: {
              selectionType: ModelSelectionType.FILTERS,
              intelligenceRange: {
                min: IntelligenceLevelFilter.SMART,
              },
              priceRange: {
                max: PriceLevelFilter.STANDARD,
              },
              contentRange: {
                min: ContentLevelFilter.OPEN,
              },
              preferredStrengths: null,
              ignoredWeaknesses: null,
            },
            position: 0,
            color: null,
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
      // Model Selection - discriminated union between manual and filter-based
      modelSelection: objectUnionField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.chat.favorites.post.modelSelection.title" as const,
          description: "app.api.agent.chat.favorites.post.modelSelection.description" as const,
          layoutType: LayoutType.STACKED,
          border: false,
          showSubmitButton: false,
        },
        { request: "data" },
        "selectionType",
        [
          // Variant 1: Manual model selection
          objectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.STACKED,
            },
            { request: "data" },
            {
              selectionType: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.FILTER_PILLS,
                  label: "app.api.agent.chat.favorites.post.selectionType.label" as const,
                  options: [
                    {
                      value: ModelSelectionType.MANUAL,
                      label: "app.api.agent.chat.favorites.post.selectionType.manual" as const,
                    },
                    {
                      value: ModelSelectionType.FILTERS,
                      label: "app.api.agent.chat.favorites.post.selectionType.filters" as const,
                    },
                  ],
                  columns: 12,
                },
                z.literal(ModelSelectionType.MANUAL),
              ),
              manualModelId: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.SELECT,
                  label: "app.api.agent.chat.favorites.post.manualModelId.label" as const,
                  description:
                    "app.api.agent.chat.favorites.post.manualModelId.description" as const,
                  options: ModelIdOptions,
                  columns: 12,
                },
                z.enum(ModelId),
              ),
            },
          ),
          // Variant 2: Filter-based selection
          objectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.STACKED,
            },
            { request: "data" },
            {
              selectionType: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.FILTER_PILLS,
                  label: "app.api.agent.chat.favorites.post.selectionType.label" as const,
                  options: [
                    {
                      value: ModelSelectionType.MANUAL,
                      label: "app.api.agent.chat.favorites.post.selectionType.manual" as const,
                    },
                    {
                      value: ModelSelectionType.FILTERS,
                      label: "app.api.agent.chat.favorites.post.selectionType.filters" as const,
                    },
                  ],
                  columns: 12,
                },
                z.literal(ModelSelectionType.FILTERS),
              ),
              intelligenceRange: requestDataRangeField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.RANGE_SLIDER,
                  label: "app.api.agent.chat.favorites.post.intelligenceRange.label" as const,
                  description:
                    "app.api.agent.chat.favorites.post.intelligenceRange.description" as const,
                  options: INTELLIGENCE_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  minLabel: "app.api.agent.chat.favorites.post.intelligenceRange.minLabel" as const,
                  maxLabel: "app.api.agent.chat.favorites.post.intelligenceRange.maxLabel" as const,
                  columns: 12,
                },
                z.enum(IntelligenceLevelFilterDB),
              ),
              priceRange: requestDataRangeField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.RANGE_SLIDER,
                  label: "app.api.agent.chat.favorites.post.priceRange.label" as const,
                  description: "app.api.agent.chat.favorites.post.priceRange.description" as const,
                  options: PRICE_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  minLabel: "app.api.agent.chat.favorites.post.priceRange.minLabel" as const,
                  maxLabel: "app.api.agent.chat.favorites.post.priceRange.maxLabel" as const,
                  columns: 12,
                },
                z.enum(PriceLevelFilterDB),
              ),
              contentRange: requestDataRangeField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.RANGE_SLIDER,
                  label: "app.api.agent.chat.favorites.post.contentRange.label" as const,
                  description:
                    "app.api.agent.chat.favorites.post.contentRange.description" as const,
                  options: CONTENT_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  minLabel: "app.api.agent.chat.favorites.post.contentRange.minLabel" as const,
                  maxLabel: "app.api.agent.chat.favorites.post.contentRange.maxLabel" as const,
                  columns: 12,
                },
                z.enum(ContentLevelFilterDB),
              ),
              speedRange: requestDataRangeField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.RANGE_SLIDER,
                  label: "app.api.agent.chat.favorites.post.speedRange.label" as const,
                  description: "app.api.agent.chat.favorites.post.speedRange.description" as const,
                  options: SPEED_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  minLabel: "app.api.agent.chat.favorites.post.speedRange.minLabel" as const,
                  maxLabel: "app.api.agent.chat.favorites.post.speedRange.maxLabel" as const,
                  columns: 12,
                },
                z.enum(SpeedLevelFilterDB),
              ),
              preferredStrengths: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.MULTISELECT,
                  label: "app.api.agent.chat.favorites.post.preferredStrengths.label" as const,
                  description:
                    "app.api.agent.chat.favorites.post.preferredStrengths.description" as const,
                  options: ModelUtilityOptions,
                  columns: 6,
                },
                z.array(z.enum(ModelUtilityDB)).nullable(),
              ),
              ignoredWeaknesses: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.MULTISELECT,
                  label: "app.api.agent.chat.favorites.post.ignoredWeaknesses.label" as const,
                  description:
                    "app.api.agent.chat.favorites.post.ignoredWeaknesses.description" as const,
                  options: ModelUtilityOptions,
                  columns: 6,
                },
                z.array(z.enum(ModelUtilityDB)).nullable(),
              ),
            },
          ),
        ],
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
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange: {
            min: IntelligenceLevelFilter.SMART,
            max: IntelligenceLevelFilter.BRILLIANT,
          },
          priceRange: {
            min: PriceLevelFilter.CHEAP,
            max: PriceLevelFilter.STANDARD,
          },
          contentRange: {
            min: ContentLevelFilter.OPEN,
            max: ContentLevelFilter.UNCENSORED,
          },
          speedRange: {
            min: SpeedLevelFilter.FAST,
            max: SpeedLevelFilter.THOROUGH,
          },
          preferredStrengths: null,
          ignoredWeaknesses: null,
        },
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

// Individual favorite type from GET response
export type Favorite = FavoritesListResponseOutput["favorites"][number];

// Favorite field type aliases - only for complex objects
export type FavoriteModelSelection = Favorite["modelSelection"];

const definitions = { GET, POST };
export { GET, POST };
export default definitions;
