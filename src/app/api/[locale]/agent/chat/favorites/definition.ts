/**
 * Favorites API Definition
 * Defines endpoints for managing user favorites (character + model settings)
 */

import { z } from "zod";

import { ModelId, ModelIdOptions } from "@/app/api/[locale]/agent/models/models";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  navigateButtonField,
  objectField,
  objectUnionField,
  requestDataField,
  requestDataRangeField,
  responseArrayField,
  responseField,
  widgetField,
  widgetObjectField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  SpacingSize,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { iconSchema } from "../../../shared/types/common.schema";
import { ModelUtilityDB, ModelUtilityOptions } from "../../models/enum";
import { TtsVoiceDB, TtsVoiceOptions } from "../../text-to-speech/enum";
import { DELETE as FavoriteDELETE, PATCH as FavoritePATCH } from "./[id]/definition";
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
import { CONTENT_DISPLAY, INTELLIGENCE_DISPLAY, PRICE_DISPLAY, SPEED_DISPLAY } from "./enum";

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
      customIcon: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.ICON,
          label: "app.api.agent.chat.favorites.post.customIcon.label" as const,
          description: "app.api.agent.chat.favorites.post.customIcon.description" as const,
          columns: 6,
        },
        iconSchema.optional(),
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
                z.array(z.enum(ModelUtilityDB)).nullable().optional(),
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
                z.array(z.enum(ModelUtilityDB)).nullable().optional(),
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
      layoutType: LayoutType.STACKED,
      noCard: true,
      gap: "6",
    },
    { response: true },
    {
      // Top action buttons container (widget object field - pure UI, no response data)
      topActions: widgetObjectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "2",
          noCard: true,
        },
        {},
        {
          backButton: backButton(),
          createButton: navigateButtonField({
            targetEndpoint: POST,
            extractParams: () => ({}),
            prefillFromGet: false,
            label: "app.api.agent.chat.favorites.get.createButton.label" as const,
            icon: "plus",
            variant: "default",
          }),
        },
      ),

      // Separator between buttons and content (widget field - pure UI)
      separator: widgetField(
        {
          type: WidgetType.SEPARATOR,
          spacingTop: SpacingSize.RELAXED,
          spacingBottom: SpacingSize.RELAXED,
        },
        {},
      ),

      // Favorites list
      favoritesList: responseArrayField(
        {
          type: WidgetType.DATA_CARDS,
          title: "app.api.agent.chat.favorites.get.container.title" as const,
          description: "app.api.agent.chat.favorites.get.container.description" as const,
          layout: { type: LayoutType.GRID, columns: 1, spacing: "normal" },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.INLINE,
            gap: "4",
            alignItems: "start",
            noCard: true,
          },
          { response: true },
          {
            id: responseField({ type: WidgetType.TEXT, hidden: true }, z.string().uuid()),
            characterId: responseField(
              { type: WidgetType.TEXT, hidden: true },
              z.string().nullable(),
            ),
            icon: responseField(
              { type: WidgetType.ICON, containerSize: "lg", iconSize: "base", borderRadius: "lg" },
              iconSchema,
            ),
            content: objectField(
              {
                type: WidgetType.CONTAINER,
                layoutType: LayoutType.STACKED,
                gap: "0",
                noCard: true,
              },
              { response: true },
              {
                titleRow: objectField(
                  {
                    type: WidgetType.CONTAINER,
                    layoutType: LayoutType.INLINE,
                    gap: "2",
                    noCard: true,
                  },
                  { response: true },
                  {
                    name: responseField(
                      { type: WidgetType.TEXT, size: "base", emphasis: "bold" },
                      z.string(),
                    ),
                    tagline: responseField(
                      { type: WidgetType.TEXT, size: "sm", variant: "muted" },
                      z.string(),
                    ),
                  },
                ),
                description: responseField(
                  { type: WidgetType.TEXT, size: "xs", variant: "muted" },
                  z.string(),
                ),
                modelRow: objectField(
                  {
                    type: WidgetType.CONTAINER,
                    layoutType: LayoutType.INLINE,
                    gap: "1",
                    noCard: true,
                  },
                  { response: true },
                  {
                    modelIcon: responseField(
                      {
                        type: WidgetType.ICON,
                        iconSize: "xs",
                        noHover: true,
                      },
                      iconSchema,
                    ),
                    modelInfo: responseField(
                      { type: WidgetType.TEXT, size: "xs", variant: "muted" },
                      z.string(),
                    ),
                    separator1: widgetField(
                      {
                        type: WidgetType.TEXT,
                        size: "xs",
                        variant: "muted",
                        content: "•" as const,
                      },
                      { response: true },
                    ),
                    modelProvider: responseField(
                      { type: WidgetType.TEXT, size: "xs", variant: "muted" },
                      z.string(),
                    ),
                    separator2: widgetField(
                      {
                        type: WidgetType.TEXT,
                        size: "xs",
                        variant: "muted",
                        content: "•" as const,
                      },
                      { response: true },
                    ),
                    creditCost: responseField(
                      { type: WidgetType.TEXT, size: "xs", variant: "muted" },
                      z.string(),
                    ),
                  },
                ),
              },
            ),
            editButton: navigateButtonField({
              targetEndpoint: FavoritePATCH,
              extractParams: (favorite) => ({ urlPathParams: { id: String(favorite.id) } }),
              prefillFromGet: true,
            }),
            deleteButton: navigateButtonField({
              targetEndpoint: FavoriteDELETE,
              extractParams: (favorite) => ({ urlPathParams: { id: String(favorite.id) } }),
              prefillFromGet: false,
            }),
          },
        ),
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
        favoritesList: [
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            characterId: "default",
            icon: "sparkles",
            content: {
              titleRow: {
                name: "Thea",
                tagline: "Greek goddess of light",
              },
              description: "Devoted companion with ancient wisdom",
              modelRow: {
                modelIcon: "sparkles",
                modelInfo: "Claude Sonnet 4.5",
                modelProvider: "Anthropic",
                creditCost: "1.5 credits",
              },
            },
          },
        ],
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

// Individual favorite card type from GET response (display fields only)
export type FavoriteCard = FavoritesListResponseOutput["favoritesList"][number];

// Favorite field type alias for model selection (from POST request)
export type FavoriteModelSelection = FavoriteCreateRequestOutput["modelSelection"];

const definitions = { GET, POST };
export { GET, POST };
export default definitions;
