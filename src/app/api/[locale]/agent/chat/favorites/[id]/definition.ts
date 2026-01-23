/**
 * Single Favorite API Definition
 * Defines endpoints for getting, updating, and deleting a single favorite
 */

import { z } from "zod";

import characterDefinitions from "@/app/api/[locale]/agent/chat/characters/[id]/definition";
import charactersDefinitions from "@/app/api/[locale]/agent/chat/characters/definition";
import {
  CONTENT_DISPLAY,
  INTELLIGENCE_DISPLAY,
  PRICE_DISPLAY,
  SPEED_DISPLAY,
} from "@/app/api/[locale]/agent/chat/characters/enum";
import {
  ModelUtilityDB,
  ModelUtilityOptions,
} from "@/app/api/[locale]/agent/models/enum";
import {
  ModelId,
  ModelIdOptions,
} from "@/app/api/[locale]/agent/models/models";
import {
  TtsVoiceDB,
  TtsVoiceOptions,
} from "@/app/api/[locale]/agent/text-to-speech/enum";
import { iconSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import { responseRangeField } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  backButton,
  deleteButton,
  navigateButtonField,
  objectUnionField,
  requestDataRangeField,
  submitButton,
  widgetField,
  widgetObjectField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  objectField,
  requestField,
  requestResponseField,
  requestUrlPathParamsField,
  requestUrlPathParamsResponseField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  SpacingSize,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import type {
  FiltersModelSelection,
  ManualModelSelection,
} from "../../characters/create/definition";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  PriceLevel,
  SpeedLevel,
} from "../../characters/enum";

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
      layoutType: LayoutType.STACKED,
      paddingTop: "6",
      noCard: true,
    },
    { request: "urlPathParams" },
    {
      title: widgetField(
        {
          type: WidgetType.TITLE,
          level: 5,
          content:
            "app.api.agent.chat.favorites.id.delete.container.description" as const,
          schema: z.string(),
        },
        { request: "data", response: true },
      ),
      backButton: backButton({
        label:
          "app.api.agent.chat.favorites.id.delete.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
      }),
      deleteButton: submitButton({
        label: "app.api.agent.chat.favorites.id.delete.actions.delete" as const,
        loadingText:
          "app.api.agent.chat.favorites.id.delete.actions.deleting" as const,
        icon: "trash",
        variant: "destructive",
        className: "ml-auto",
      }),

      // === REQUEST (URL Path Params) ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.chat.favorites.id.delete.id.label" as const,
        description:
          "app.api.agent.chat.favorites.id.delete.id.description" as const,
        hidden: true,
        schema: z.string().uuid(),
      }),
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
    urlPathParams: {
      delete: { id: "550e8400-e29b-41d4-a716-446655440000" },
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
      layoutType: LayoutType.STACKED,
      noCard: true,
    },
    { request: "data&urlPathParams", response: true },
    {
      // Navigation and action buttons
      topActions: widgetObjectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "2",
          noCard: true,
        },
        { request: "data", response: true },
        {
          backButton: backButton({
            label:
              "app.api.agent.chat.favorites.id.patch.backButton.label" as const,
            icon: "arrow-left",
            variant: "outline",
          }),
          deleteButton: deleteButton({
            label:
              "app.api.agent.chat.favorites.id.patch.deleteButton.label" as const,
            targetEndpoint: DELETE,
            extractParams: (data) => ({
              urlPathParams: { id: (data as { id: string }).id },
            }),
            icon: "trash",
            variant: "destructive",
            className: "ml-auto",
            popNavigationOnSuccess: 2, // Pop twice: edit -> details -> list
          }),
          submitButton: submitButton({
            label:
              "app.api.agent.chat.favorites.id.patch.submitButton.label" as const,
            loadingText:
              "app.api.agent.chat.favorites.id.patch.submitButton.loadingText" as const,
            icon: "save",
            variant: "primary",
          }),
        },
      ),

      // Separator between buttons and content
      separator: widgetField(
        {
          type: WidgetType.SEPARATOR,
          spacingTop: SpacingSize.RELAXED,
          spacingBottom: SpacingSize.RELAXED,
        },
        { response: true, request: "data" },
      ),

      // === REQUEST (URL Path Params) ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.chat.favorites.id.patch.id.label" as const,
        hidden: true,
        schema: z.string().uuid(),
      }),

      // === REQUEST (Data) ===
      characterId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.favorites.id.patch.characterId.label" as const,
        columns: 6,
        hidden: true,
        schema: z.string().optional(),
      }),
      customName: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.favorites.id.patch.customName.label" as const,
        columns: 6,
        hidden: true,
        schema: z.string().nullable().optional(),
      }),
      voice: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.agent.chat.favorites.id.patch.voice.label" as const,
        description:
          "app.api.agent.chat.favorites.id.patch.voice.description" as const,
        options: TtsVoiceOptions,
        columns: 6,
        schema: z.enum(TtsVoiceDB).nullable().optional(),
      }),

      modelSelection: objectUnionField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.favorites.post.modelSelection.title" as const,
          description:
            "app.api.agent.chat.favorites.post.modelSelection.description" as const,
          layoutType: LayoutType.STACKED,
          border: false,
          showSubmitButton: false,
        },
        { request: "data" },
        "selectionType",
        [
          // Variant 1: Character-based selection
          objectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.STACKED,
            },
            { request: "data" },
            {
              selectionType: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.FILTER_PILLS,
                label:
                  "app.api.agent.chat.favorites.post.selectionType.label" as const,
                options: [
                  {
                    value: ModelSelectionType.CHARACTER_BASED,
                    label:
                      "app.api.agent.chat.favorites.post.selectionType.characterBased" as const,
                  },
                  {
                    value: ModelSelectionType.MANUAL,
                    label:
                      "app.api.agent.chat.favorites.post.selectionType.manual" as const,
                  },
                  {
                    value: ModelSelectionType.FILTERS,
                    label:
                      "app.api.agent.chat.favorites.post.selectionType.filters" as const,
                  },
                ],
                columns: 12,
                schema: z.literal(ModelSelectionType.CHARACTER_BASED),
              }),
              modelDisplay: widgetField(
                {
                  type: WidgetType.MODEL_DISPLAY,
                  columns: 12,
                },
                { response: true },
              ),
            },
          ),
          // Variant 2: Manual model selection
          objectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.STACKED,
            },
            { request: "data" },
            {
              selectionType: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.FILTER_PILLS,
                label:
                  "app.api.agent.chat.favorites.post.selectionType.label" as const,
                options: [
                  {
                    value: ModelSelectionType.CHARACTER_BASED,
                    label:
                      "app.api.agent.chat.favorites.post.selectionType.characterBased" as const,
                  },
                  {
                    value: ModelSelectionType.MANUAL,
                    label:
                      "app.api.agent.chat.favorites.post.selectionType.manual" as const,
                  },
                  {
                    value: ModelSelectionType.FILTERS,
                    label:
                      "app.api.agent.chat.favorites.post.selectionType.filters" as const,
                  },
                ],
                columns: 12,
                schema: z.literal(ModelSelectionType.MANUAL),
              }),
              modelDisplay: widgetField(
                {
                  type: WidgetType.MODEL_DISPLAY,
                  columns: 12,
                },
                { response: true },
              ),
              manualModelId: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.SELECT,
                label:
                  "app.api.agent.chat.favorites.post.manualModelId.label" as const,
                description:
                  "app.api.agent.chat.favorites.post.manualModelId.description" as const,
                options: ModelIdOptions,
                columns: 12,
                schema: z.enum(ModelId),
              }),
            },
          ),
          // Variant 3: -based selection
          objectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.STACKED,
            },
            { request: "data" },
            {
              selectionType: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.FILTER_PILLS,
                label:
                  "app.api.agent.chat.favorites.post.selectionType.label" as const,
                options: [
                  {
                    value: ModelSelectionType.MANUAL,
                    label:
                      "app.api.agent.chat.favorites.post.selectionType.manual" as const,
                  },
                  {
                    value: ModelSelectionType.FILTERS,
                    label:
                      "app.api.agent.chat.favorites.post.selectionType.filters" as const,
                  },
                ],
                columns: 12,
                schema: z.literal(ModelSelectionType.FILTERS),
              }),
              modelDisplay: widgetField(
                {
                  type: WidgetType.MODEL_DISPLAY,
                  columns: 12,
                },
                { response: true },
              ),
              intelligenceRange: requestDataRangeField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.RANGE_SLIDER,
                label:
                  "app.api.agent.chat.favorites.post.intelligenceRange.label" as const,
                description:
                  "app.api.agent.chat.favorites.post.intelligenceRange.description" as const,
                options: INTELLIGENCE_DISPLAY.map((tier) => ({
                  label: tier.label,
                  value: tier.value,
                  icon: tier.icon,
                  description: tier.description,
                })),
                minLabel:
                  "app.api.agent.chat.favorites.post.intelligenceRange.minLabel" as const,
                maxLabel:
                  "app.api.agent.chat.favorites.post.intelligenceRange.maxLabel" as const,
                columns: 12,
                schema: z.enum(IntelligenceLevel),
              }),
              priceRange: requestDataRangeField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.RANGE_SLIDER,
                label:
                  "app.api.agent.chat.favorites.post.priceRange.label" as const,
                description:
                  "app.api.agent.chat.favorites.post.priceRange.description" as const,
                options: PRICE_DISPLAY.map((tier) => ({
                  label: tier.label,
                  value: tier.value,
                  icon: tier.icon,
                  description: tier.description,
                })),
                minLabel:
                  "app.api.agent.chat.favorites.post.priceRange.minLabel" as const,
                maxLabel:
                  "app.api.agent.chat.favorites.post.priceRange.maxLabel" as const,
                columns: 12,
                schema: z.enum(PriceLevel),
              }),
              contentRange: requestDataRangeField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.RANGE_SLIDER,
                label:
                  "app.api.agent.chat.favorites.post.contentRange.label" as const,
                description:
                  "app.api.agent.chat.favorites.post.contentRange.description" as const,
                options: CONTENT_DISPLAY.map((tier) => ({
                  label: tier.label,
                  value: tier.value,
                  icon: tier.icon,
                  description: tier.description,
                })),
                minLabel:
                  "app.api.agent.chat.favorites.post.contentRange.minLabel" as const,
                maxLabel:
                  "app.api.agent.chat.favorites.post.contentRange.maxLabel" as const,
                columns: 12,
                schema: z.enum(ContentLevel),
              }),
              speedRange: requestDataRangeField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.RANGE_SLIDER,
                label:
                  "app.api.agent.chat.favorites.post.speedRange.label" as const,
                description:
                  "app.api.agent.chat.favorites.post.speedRange.description" as const,
                options: SPEED_DISPLAY.map((tier) => ({
                  label: tier.label,
                  value: tier.value,
                  icon: tier.icon,
                  description: tier.description,
                })),
                minLabel:
                  "app.api.agent.chat.favorites.post.speedRange.minLabel" as const,
                maxLabel:
                  "app.api.agent.chat.favorites.post.speedRange.maxLabel" as const,
                columns: 12,
                schema: z.enum(SpeedLevel),
              }),
              preferredStrengths: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.MULTISELECT,
                label:
                  "app.api.agent.chat.favorites.post.preferredStrengths.label" as const,
                description:
                  "app.api.agent.chat.favorites.post.preferredStrengths.description" as const,
                options: ModelUtilityOptions,
                columns: 6,
                schema: z.array(z.enum(ModelUtilityDB)).nullable().optional(),
              }),
              ignoredWeaknesses: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.MULTISELECT,
                label:
                  "app.api.agent.chat.favorites.post.ignoredWeaknesses.label" as const,
                description:
                  "app.api.agent.chat.favorites.post.ignoredWeaknesses.description" as const,
                options: ModelUtilityOptions,
                columns: 6,
                schema: z.array(z.enum(ModelUtilityDB)).nullable().optional(),
              }),
            },
          ),
        ],
      ),
      color: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.chat.favorites.id.patch.color.label" as const,
        columns: 6,
        schema: z.string().nullable().optional(),
      }),
      customIcon: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ICON,
        label:
          "app.api.agent.chat.favorites.id.patch.customIcon.label" as const,
        columns: 6,
        schema: iconSchema.optional().nullable(),
      }),
      position: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.agent.chat.favorites.id.patch.position.label" as const,
        columns: 6,
        schema: z.number().optional(),
      }),

      // === RESPONSE ===
      success: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.favorites.id.patch.response.success.content" as const,
        schema: z.boolean(),
      }),
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
        characterId: "thea",
        customName: "Thea (Brilliant)",

        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange: {
            min: IntelligenceLevel.BRILLIANT,
            max: IntelligenceLevel.BRILLIANT,
          },
          priceRange: {
            min: PriceLevel.CHEAP,
            max: PriceLevel.PREMIUM,
          },
          contentRange: {
            min: ContentLevel.MAINSTREAM,
            max: ContentLevel.UNCENSORED,
          },
          speedRange: {
            min: SpeedLevel.FAST,
            max: SpeedLevel.THOROUGH,
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
      noCard: true,
    },
    { request: "urlPathParams", response: true },
    {
      // === REQUEST (URL Path Params) + RESPONSE ===
      id: requestUrlPathParamsResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label:
          "app.api.agent.chat.favorites.id.get.response.id.content" as const,
        schema: z.string().uuid(),
      }),
      characterId: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.favorites.id.get.response.characterId.content" as const,
        schema: z.string(),
      }),
      character: objectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          gap: "2",
          className: "group",
        },
        { response: true },
        {
          info: objectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.INLINE,
              gap: "4",
              alignItems: "start",
              noCard: true,
            },
            { response: true },
            {
              icon: responseField({
                type: WidgetType.ICON,
                containerSize: "lg",
                iconSize: "lg",
                borderRadius: "lg",
                schema: iconSchema,
              }),
              info: objectField(
                {
                  type: WidgetType.CONTAINER,
                  layoutType: LayoutType.STACKED,
                  gap: "2",
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
                      name: responseField({
                        type: WidgetType.TEXT,
                        size: "base",
                        emphasis: "bold",
                        schema: z.string() as z.ZodType<TranslationKey>,
                      }),
                      tagline: responseField({
                        type: WidgetType.TEXT,
                        size: "sm",
                        variant: "muted",
                        schema: z.string() as z.ZodType<TranslationKey>,
                      }),
                    },
                  ),
                  description: responseField({
                    type: WidgetType.TEXT,
                    size: "xs",
                    variant: "muted",
                    schema: z.string() as z.ZodType<TranslationKey>,
                  }),
                },
              ),
            },
          ),
          separator: widgetField(
            {
              type: WidgetType.SEPARATOR,
              spacingTop: SpacingSize.RELAXED,
              spacingBottom: SpacingSize.RELAXED,
            },
            { response: true },
          ),

          actions: widgetObjectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.INLINE,
              gap: "2",
              noCard: true,
            },
            { response: true },
            {
              changeCharacter: navigateButtonField({
                icon: "pencil",
                variant: "ghost",
                size: "sm",
                targetEndpoint: charactersDefinitions.GET,
                extractParams: () => ({}),
              }),
              modifyCharacter: navigateButtonField({
                icon: "trash",
                variant: "ghost",
                size: "sm",
                targetEndpoint: characterDefinitions.PATCH,
                extractParams: (favorite) => ({
                  urlPathParams: { id: String(favorite.characterId) },
                }),
                prefillFromGet: true,
                getEndpoint: characterDefinitions.GET,
              }),
            },
          ),
        },
      ),

      customName: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.favorites.id.get.response.customName.content" as const,
        hidden: true,
        schema: z.string().nullable(),
      }),
      customIcon: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.favorites.id.get.response.customIcon.content" as const,
        schema: iconSchema.nullable().optional(),
      }),
      voice: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.favorites.id.get.response.voice.content" as const,
        schema: z.enum(TtsVoiceDB).nullable(),
      }),
      modelSelection: objectUnionField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.favorites.id.get.response.modelSelection.title" as const,
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        "selectionType",
        [
          // Variant 1: Character based model selection
          objectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.STACKED,
            },
            { response: true },
            {
              selectionType: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.favorites.id.get.response.selectionType.content" as const,
                schema: z.literal(ModelSelectionType.CHARACTER_BASED),
              }),
              modelDisplay: widgetField(
                {
                  type: WidgetType.MODEL_DISPLAY,
                  columns: 12,
                },
                { response: true },
              ),
              intelligenceRange: requestDataRangeField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.RANGE_SLIDER,
                label:
                  "app.api.agent.chat.characters.post.intelligenceRange.label" as const,
                description:
                  "app.api.agent.chat.characters.post.intelligenceRange.description" as const,
                options: INTELLIGENCE_DISPLAY.map((tier) => ({
                  label: tier.label,
                  value: tier.value,
                  icon: tier.icon,
                  description: tier.description,
                })),
                minLabel:
                  "app.api.agent.chat.characters.post.intelligenceRange.minLabel" as const,
                maxLabel:
                  "app.api.agent.chat.characters.post.intelligenceRange.maxLabel" as const,
                columns: 12,
                disabled: true,
                schema: z.enum(IntelligenceLevel),
              }),
              priceRange: requestDataRangeField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.RANGE_SLIDER,
                label:
                  "app.api.agent.chat.characters.post.priceRange.label" as const,
                description:
                  "app.api.agent.chat.characters.post.priceRange.description" as const,
                options: PRICE_DISPLAY.map((tier) => ({
                  label: tier.label,
                  value: tier.value,
                  icon: tier.icon,
                  description: tier.description,
                })),
                minLabel:
                  "app.api.agent.chat.characters.post.priceRange.minLabel" as const,
                maxLabel:
                  "app.api.agent.chat.characters.post.priceRange.maxLabel" as const,
                columns: 12,
                disabled: true,
                schema: z.enum(PriceLevel),
              }),
              contentRange: requestDataRangeField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.RANGE_SLIDER,
                label:
                  "app.api.agent.chat.characters.post.contentRange.label" as const,
                description:
                  "app.api.agent.chat.characters.post.contentRange.description" as const,
                options: CONTENT_DISPLAY.map((tier) => ({
                  label: tier.label,
                  value: tier.value,
                  icon: tier.icon,
                  description: tier.description,
                })),
                minLabel:
                  "app.api.agent.chat.characters.post.contentRange.minLabel" as const,
                maxLabel:
                  "app.api.agent.chat.characters.post.contentRange.maxLabel" as const,
                columns: 12,
                disabled: true,
                schema: z.enum(ContentLevel),
              }),
              speedRange: requestDataRangeField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.RANGE_SLIDER,
                label:
                  "app.api.agent.chat.characters.post.speedRange.label" as const,
                description:
                  "app.api.agent.chat.characters.post.speedRange.description" as const,
                options: SPEED_DISPLAY.map((tier) => ({
                  label: tier.label,
                  value: tier.value,
                  icon: tier.icon,
                  description: tier.description,
                })),
                minLabel:
                  "app.api.agent.chat.characters.post.speedRange.minLabel" as const,
                maxLabel:
                  "app.api.agent.chat.characters.post.speedRange.maxLabel" as const,
                columns: 12,
                disabled: true,
                schema: z.enum(SpeedLevel),
              }),
              preferredStrengths: requestResponseField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.MULTISELECT,
                label:
                  "app.api.agent.chat.characters.post.preferredStrengths.label" as const,
                description:
                  "app.api.agent.chat.characters.post.preferredStrengths.description" as const,
                options: ModelUtilityOptions,
                columns: 6,
                disabled: true,
                schema: z.array(z.enum(ModelUtilityDB)).nullable().optional(),
              }),
              ignoredWeaknesses: requestResponseField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.MULTISELECT,
                label:
                  "app.api.agent.chat.characters.post.ignoredWeaknesses.label" as const,
                description:
                  "app.api.agent.chat.characters.post.ignoredWeaknesses.description" as const,
                options: ModelUtilityOptions,
                columns: 6,
                disabled: true,
                schema: z.array(z.enum(ModelUtilityDB)).nullable().optional(),
              }),
            },
          ),
          // Variant 2: Manual model selection
          objectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.STACKED,
            },
            { response: true },
            {
              selectionType: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.favorites.id.get.response.selectionType.content" as const,
                schema: z.literal(ModelSelectionType.MANUAL),
              }),
              modelDisplay: widgetField(
                {
                  type: WidgetType.MODEL_DISPLAY,
                  columns: 12,
                },
                { response: true },
              ),
              manualModelId: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.favorites.id.get.response.manualModelId.content" as const,
                schema: z.enum(ModelId),
              }),
            },
          ),
          // Variant 3: -based selection
          objectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.STACKED,
            },
            { response: true },
            {
              selectionType: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.favorites.id.get.response.selectionType.content" as const,
                schema: z.literal(ModelSelectionType.FILTERS),
              }),
              modelDisplay: widgetField(
                {
                  type: WidgetType.MODEL_DISPLAY,
                  columns: 12,
                },
                { response: true },
              ),
              intelligenceRange: responseRangeField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.RANGE_SLIDER,
                label:
                  "app.api.agent.chat.characters.post.intelligenceRange.label" as const,
                description:
                  "app.api.agent.chat.characters.post.intelligenceRange.description" as const,
                options: INTELLIGENCE_DISPLAY.map((tier) => ({
                  label: tier.label,
                  value: tier.value,
                  icon: tier.icon,
                  description: tier.description,
                })),
                minLabel:
                  "app.api.agent.chat.characters.post.intelligenceRange.minLabel" as const,
                maxLabel:
                  "app.api.agent.chat.characters.post.intelligenceRange.maxLabel" as const,
                columns: 12,
                disabled: true,
                schema: z.enum(IntelligenceLevel),
              }),
              priceRange: responseRangeField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.RANGE_SLIDER,
                label:
                  "app.api.agent.chat.characters.post.priceRange.label" as const,
                description:
                  "app.api.agent.chat.characters.post.priceRange.description" as const,
                options: PRICE_DISPLAY.map((tier) => ({
                  label: tier.label,
                  value: tier.value,
                  icon: tier.icon,
                  description: tier.description,
                })),
                minLabel:
                  "app.api.agent.chat.characters.post.priceRange.minLabel" as const,
                maxLabel:
                  "app.api.agent.chat.characters.post.priceRange.maxLabel" as const,
                columns: 12,
                disabled: true,
                schema: z.enum(PriceLevel),
              }),
              contentRange: responseRangeField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.RANGE_SLIDER,
                label:
                  "app.api.agent.chat.characters.post.contentRange.label" as const,
                description:
                  "app.api.agent.chat.characters.post.contentRange.description" as const,
                options: CONTENT_DISPLAY.map((tier) => ({
                  label: tier.label,
                  value: tier.value,
                  icon: tier.icon,
                  description: tier.description,
                })),
                minLabel:
                  "app.api.agent.chat.characters.post.contentRange.minLabel" as const,
                maxLabel:
                  "app.api.agent.chat.characters.post.contentRange.maxLabel" as const,
                columns: 12,
                disabled: true,
                schema: z.enum(ContentLevel),
              }),
              speedRange: responseRangeField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.RANGE_SLIDER,
                label:
                  "app.api.agent.chat.characters.post.speedRange.label" as const,
                description:
                  "app.api.agent.chat.characters.post.speedRange.description" as const,
                options: SPEED_DISPLAY.map((tier) => ({
                  label: tier.label,
                  value: tier.value,
                  icon: tier.icon,
                  description: tier.description,
                })),
                minLabel:
                  "app.api.agent.chat.characters.post.speedRange.minLabel" as const,
                maxLabel:
                  "app.api.agent.chat.characters.post.speedRange.maxLabel" as const,
                columns: 12,
                disabled: true,
                schema: z.enum(SpeedLevel),
              }),
              preferredStrengths: requestResponseField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.MULTISELECT,
                label:
                  "app.api.agent.chat.characters.post.preferredStrengths.label" as const,
                description:
                  "app.api.agent.chat.characters.post.preferredStrengths.description" as const,
                options: ModelUtilityOptions,
                columns: 6,
                disabled: true,
                schema: z.array(z.enum(ModelUtilityDB)).nullable().optional(),
              }),
              ignoredWeaknesses: requestResponseField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.MULTISELECT,
                label:
                  "app.api.agent.chat.characters.post.ignoredWeaknesses.label" as const,
                description:
                  "app.api.agent.chat.characters.post.ignoredWeaknesses.description" as const,
                options: ModelUtilityOptions,
                columns: 6,
                disabled: true,
                schema: z.array(z.enum(ModelUtilityDB)).nullable().optional(),
              }),
            },
          ),
        ],
      ),
      position: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.favorites.id.get.response.position.content" as const,
        schema: z.number(),
      }),
      color: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.favorites.id.get.response.color.content" as const,
        schema: z.string().nullable(),
      }),
      useCount: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.favorites.id.get.response.useCount.content" as const,
        schema: z.number(),
      }),
      // Navigation and action buttons
      buttons: widgetObjectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "2",
          noCard: true,
        },
        { response: true },
        {
          // Back button (left side)
          backButton: backButton({
            icon: "arrow-left",
            variant: "outline",
          }),

          // Edit button - uses self-referencing GET endpoint for prefill
          editButton: navigateButtonField({
            targetEndpoint: PATCH,
            extractParams: (data) => ({
              urlPathParams: { id: (data as { id: string }).id },
            }),
            prefillFromGet: true,
            label:
              "app.api.agent.chat.favorites.id.get.editButton.label" as const,
            icon: "pencil",
            variant: "default",
            className: "ml-auto",
          }),

          // Delete button
          deleteButton: deleteButton({
            targetEndpoint: DELETE,
            extractParams: (data) => ({
              urlPathParams: { id: (data as { id: string }).id },
            }),
            label:
              "app.api.agent.chat.favorites.id.get.deleteButton.label" as const,
            icon: "trash",
            variant: "destructive",
            popNavigationOnSuccess: 1, // Pop once: details -> list
          }),
        },
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
    responses: {
      default: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        characterId: "thea",
        character: {
          info: {
            icon: "sun",
            info: {
              titleRow: {
                name: "app.api.agent.chat.characters.characters.thea.name" as const,
                tagline:
                  "app.api.agent.chat.characters.characters.thea.tagline" as const,
              },
              description:
                "app.api.agent.chat.characters.characters.thea.description" as const,
            },
          },
        },
        customName: "Thea (Smart)",
        customIcon: null,
        voice: null,
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          ignoredWeaknesses: null,
          preferredStrengths: null,
          priceRange: {
            min: PriceLevel.CHEAP,
            max: PriceLevel.STANDARD,
          },
          intelligenceRange: {
            min: IntelligenceLevel.SMART,
            max: IntelligenceLevel.BRILLIANT,
          },
          contentRange: {
            min: ContentLevel.OPEN,
            max: ContentLevel.UNCENSORED,
          },
          speedRange: {
            min: SpeedLevel.FAST,
            max: SpeedLevel.THOROUGH,
          },
        },
        position: 0,
        color: null,
        useCount: 50,
      },
    },
    urlPathParams: {
      default: { id: "550e8400-e29b-41d4-a716-446655440000" },
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

const definitions = { GET, PATCH, DELETE } as const;
export default definitions;

// TESTS
//
// tests only types - import types from create endpoint instead
// Get response tests
export type FavoriteGetModelSelection =
  FavoriteGetResponseOutput["modelSelection"];

export type FavoriteGetFiltersModelSelection = Extract<
  FavoriteGetModelSelection,
  { selectionType: typeof ModelSelectionType.FILTERS }
>;

export type FavoriteGetManualModelSelection = Extract<
  FavoriteGetModelSelection,
  { selectionType: typeof ModelSelectionType.MANUAL }
>;

export type FavoriteGetCharacterBasedModelSelection = Extract<
  FavoriteGetModelSelection,
  { selectionType: typeof ModelSelectionType.CHARACTER_BASED }
>;

// oxlint-disable-next-line no-unused-vars
const _test_get_1: FiltersModelSelection =
  {} as FavoriteGetFiltersModelSelection;
// oxlint-disable-next-line no-unused-vars
const _test_get_2: ManualModelSelection = {} as FavoriteGetManualModelSelection;
type Get_TestType = Omit<FiltersModelSelection, "selectionType"> & {
  selectionType: typeof ModelSelectionType.CHARACTER_BASED;
};
// oxlint-disable-next-line no-unused-vars
const _test_get_3: Get_TestType = {} as FavoriteGetCharacterBasedModelSelection;

// Post response tests
type FavoriteModelSelection = FavoriteUpdateRequestOutput["modelSelection"];

type FavoriteFiltersModelSelection = Extract<
  FavoriteModelSelection,
  { selectionType: typeof ModelSelectionType.FILTERS }
>;

type FavoriteManualModelSelection = Extract<
  FavoriteModelSelection,
  { selectionType: typeof ModelSelectionType.MANUAL }
>;

type FavoriteCharacterBasedModelSelection = Extract<
  FavoriteModelSelection,
  { selectionType: typeof ModelSelectionType.CHARACTER_BASED }
>;

// oxlint-disable-next-line no-unused-vars
const _test1: FiltersModelSelection = {} as FavoriteFiltersModelSelection;
// oxlint-disable-next-line no-unused-vars
const _test2: ManualModelSelection = {} as FavoriteManualModelSelection;
// oxlint-disable-next-line no-unused-vars
const _test3: {
  selectionType: typeof ModelSelectionType.CHARACTER_BASED;
} = {} as FavoriteCharacterBasedModelSelection;
