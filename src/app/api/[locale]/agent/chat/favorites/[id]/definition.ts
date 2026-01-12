/**
 * Single Favorite API Definition
 * Defines endpoints for getting, updating, and deleting a single favorite
 */

import { z } from "zod";

import {
  CONTENT_DISPLAY,
  INTELLIGENCE_DISPLAY,
  PRICE_DISPLAY,
  SPEED_DISPLAY,
} from "@/app/api/[locale]/agent/chat/favorites/enum";
import { ModelUtilityDB, ModelUtilityOptions } from "@/app/api/[locale]/agent/models/enum";
import { ModelId, ModelIdOptions } from "@/app/api/[locale]/agent/models/models";
import { TtsVoiceDB, TtsVoiceOptions } from "@/app/api/[locale]/agent/text-to-speech/enum";
import { iconSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  objectField,
  objectUnionField,
  requestDataField,
  requestDataRangeField,
  requestResponseField,
  requestUrlPathParamsField,
  responseField,
  widgetField,
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
  IntelligenceLevelFilter,
  IntelligenceLevelFilterDB,
  ModelSelectionType,
  PriceLevelFilter,
  PriceLevelFilterDB,
  SpeedLevelFilter,
  SpeedLevelFilterDB,
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
      // === REQUEST (URL Path Params) + RESPONSE ===
      id: requestResponseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.favorites.id.get.response.id.content" as const,
        },
        z.string().uuid(),
        true,
      ),
      characterId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.favorites.id.get.response.characterId.content" as const,
        },
        z.string(),
      ),
      customName: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.favorites.id.get.response.customName.content" as const,
        },
        z.string().nullable(),
      ),
      customIcon: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.favorites.id.get.response.customIcon.content" as const,
        },
        iconSchema.nullable(),
      ),
      voice: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.favorites.id.get.response.voice.content" as const,
        },
        z.enum(TtsVoiceDB).nullable(),
      ),
      modelSelection: objectUnionField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.chat.favorites.id.get.response.modelSelection.title" as const,
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
                    "app.api.agent.chat.favorites.id.get.response.selectionType.content" as const,
                },
                z.literal(ModelSelectionType.MANUAL),
              ),
              manualModelId: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.favorites.id.get.response.manualModelId.content" as const,
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
                    "app.api.agent.chat.favorites.id.get.response.selectionType.content" as const,
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
            },
          ),
        ],
      ),
      position: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.favorites.id.get.response.position.content" as const,
        },
        z.number(),
      ),
      color: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.favorites.id.get.response.color.content" as const,
        },
        z.string().nullable(),
      ),
      useCount: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.favorites.id.get.response.useCount.content" as const,
        },
        z.number(),
      ),
      // Navigation - back to previous screen
      backButton: backButton(),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.favorites.id.get.errors.validation.title" as const,
      description: "app.api.agent.chat.favorites.id.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.favorites.id.get.errors.network.title" as const,
      description: "app.api.agent.chat.favorites.id.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.favorites.id.get.errors.unauthorized.title" as const,
      description: "app.api.agent.chat.favorites.id.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.favorites.id.get.errors.forbidden.title" as const,
      description: "app.api.agent.chat.favorites.id.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.favorites.id.get.errors.notFound.title" as const,
      description: "app.api.agent.chat.favorites.id.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.favorites.id.get.errors.server.title" as const,
      description: "app.api.agent.chat.favorites.id.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.favorites.id.get.errors.unknown.title" as const,
      description: "app.api.agent.chat.favorites.id.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.favorites.id.get.errors.unsavedChanges.title" as const,
      description: "app.api.agent.chat.favorites.id.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.favorites.id.get.errors.conflict.title" as const,
      description: "app.api.agent.chat.favorites.id.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.favorites.id.get.success.title" as const,
    description: "app.api.agent.chat.favorites.id.get.success.description" as const,
  },

  examples: {
    requests: undefined,
    responses: {
      get: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        characterId: "thea",
        customName: "Thea (Smart)",
        customIcon: null,
        voice: null,
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
        },
        position: 0,
        color: null,
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
          label: "app.api.agent.chat.favorites.id.patch.characterId.label" as const,
          columns: 6,
        },
        z.string().optional(),
      ),
      customName: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.favorites.id.patch.customName.label" as const,
          columns: 6,
        },
        z.string().nullable().optional(),
      ),
      voice: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.favorites.id.patch.voice.label" as const,
          description: "app.api.agent.chat.favorites.id.patch.voice.description" as const,
          options: TtsVoiceOptions,
          columns: 6,
        },
        z.enum(TtsVoiceDB).nullable().optional(),
      ),
      // Model Selection - discriminated union between manual and filter-based (optional for PATCH)
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
              modelDisplay: widgetField(
                {
                  type: WidgetType.MODEL_DISPLAY,
                  columns: 12,
                },
                { request: "data" },
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
              modelDisplay: widgetField(
                {
                  type: WidgetType.MODEL_DISPLAY,
                  columns: 12,
                },
                { request: "data" },
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
      color: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.favorites.id.patch.color.label" as const,
          columns: 6,
        },
        z.string().nullable().optional(),
      ),
      customIcon: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.ICON,
          label: "app.api.agent.chat.favorites.id.patch.customIcon.label" as const,
          columns: 6,
        },
        iconSchema.optional(),
      ),
      position: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.agent.chat.favorites.id.patch.position.label" as const,
          columns: 6,
        },
        z.number().optional(),
      ),

      // === RESPONSE ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.favorites.id.patch.response.success.content" as const,
        },
        z.boolean(),
      ),
      // Navigation - back to previous screen
      backButton: backButton(),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.favorites.id.patch.errors.validation.title" as const,
      description: "app.api.agent.chat.favorites.id.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.favorites.id.patch.errors.network.title" as const,
      description: "app.api.agent.chat.favorites.id.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.favorites.id.patch.errors.unauthorized.title" as const,
      description: "app.api.agent.chat.favorites.id.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.favorites.id.patch.errors.forbidden.title" as const,
      description: "app.api.agent.chat.favorites.id.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.favorites.id.patch.errors.notFound.title" as const,
      description: "app.api.agent.chat.favorites.id.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.favorites.id.patch.errors.server.title" as const,
      description: "app.api.agent.chat.favorites.id.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.favorites.id.patch.errors.unknown.title" as const,
      description: "app.api.agent.chat.favorites.id.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.favorites.id.patch.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.favorites.id.patch.errors.conflict.title" as const,
      description: "app.api.agent.chat.favorites.id.patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.favorites.id.patch.success.title" as const,
    description: "app.api.agent.chat.favorites.id.patch.success.description" as const,
  },

  examples: {
    requests: {
      update: {
        customName: "Thea (Brilliant)",
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange: {
            min: IntelligenceLevelFilter.BRILLIANT,
            max: IntelligenceLevelFilter.BRILLIANT,
          },
          priceRange: {
            min: PriceLevelFilter.CHEAP,
            max: PriceLevelFilter.PREMIUM,
          },
          contentRange: {
            min: ContentLevelFilter.MAINSTREAM,
            max: ContentLevelFilter.UNCENSORED,
          },
          speedRange: {
            min: SpeedLevelFilter.FAST,
            max: SpeedLevelFilter.THOROUGH,
          },
        },
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
          content: "app.api.agent.chat.favorites.id.delete.response.success.content" as const,
        },
        z.boolean(),
      ),
      // Navigation - back to previous screen
      backButton: backButton(),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.favorites.id.delete.errors.validation.title" as const,
      description: "app.api.agent.chat.favorites.id.delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.favorites.id.delete.errors.network.title" as const,
      description: "app.api.agent.chat.favorites.id.delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.favorites.id.delete.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.favorites.id.delete.errors.forbidden.title" as const,
      description: "app.api.agent.chat.favorites.id.delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.favorites.id.delete.errors.notFound.title" as const,
      description: "app.api.agent.chat.favorites.id.delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.favorites.id.delete.errors.server.title" as const,
      description: "app.api.agent.chat.favorites.id.delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.favorites.id.delete.errors.unknown.title" as const,
      description: "app.api.agent.chat.favorites.id.delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.favorites.id.delete.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.favorites.id.delete.errors.conflict.title" as const,
      description: "app.api.agent.chat.favorites.id.delete.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.favorites.id.delete.success.title" as const,
    description: "app.api.agent.chat.favorites.id.delete.success.description" as const,
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
export type FavoriteUpdateUrlVariablesInput = typeof PATCH.types.UrlVariablesInput;
export type FavoriteUpdateUrlVariablesOutput = typeof PATCH.types.UrlVariablesOutput;
export type FavoriteUpdateResponseInput = typeof PATCH.types.ResponseInput;
export type FavoriteUpdateResponseOutput = typeof PATCH.types.ResponseOutput;

export type FavoriteDeleteRequestInput = typeof DELETE.types.RequestInput;
export type FavoriteDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type FavoriteDeleteUrlVariablesInput = typeof DELETE.types.UrlVariablesInput;
export type FavoriteDeleteUrlVariablesOutput = typeof DELETE.types.UrlVariablesOutput;
export type FavoriteDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type FavoriteDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

// Full favorite configuration type (from GET response)
export type FavoriteItem = FavoriteGetResponseOutput;

const definitions = { GET, PATCH, DELETE } as const;
export default definitions;
