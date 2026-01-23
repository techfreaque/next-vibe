/**
 * Favorites Create API Definition
 * Defines endpoint for creating new favorites
 */

import { z } from "zod";

import {
  ModelId,
  ModelIdOptions,
} from "@/app/api/[locale]/agent/models/models";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  objectUnionField,
  requestDataRangeField,
  submitButton,
  widgetField,
  widgetObjectField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
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
  SpacingSize,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import { iconSchema } from "../../../../shared/types/common.schema";
import { ModelUtility, ModelUtilityOptions } from "../../../models/enum";
import { TtsVoiceDB, TtsVoiceOptions } from "../../../text-to-speech/enum";
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
import {
  CONTENT_DISPLAY,
  INTELLIGENCE_DISPLAY,
  PRICE_DISPLAY,
  SPEED_DISPLAY,
} from "../../characters/enum";

/**
 * Create Favorite Endpoint (POST)
 * Creates a new favorite for the current user
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["agent", "chat", "favorites", "create"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.favorites.create.post.title" as const,
  description: "app.api.agent.chat.favorites.create.post.description" as const,
  icon: "plus" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.favorites" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.agent.chat.favorites.create.post.container.title" as const,
      description:
        "app.api.agent.chat.favorites.create.post.container.description" as const,
      layoutType: LayoutType.STACKED,
      paddingTop: "6",
      noCard: true,
    },
    { request: "data", response: true },
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
              "app.api.agent.chat.favorites.create.post.backButton.label" as const,
            icon: "arrow-left",
            variant: "outline",
          }),
          submitButton: submitButton({
            label:
              "app.api.agent.chat.favorites.create.post.submitButton.label" as const,
            loadingText:
              "app.api.agent.chat.favorites.create.post.submitButton.loadingText" as const,
            icon: "plus",
            variant: "primary",
            className: "ml-auto",
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
        { request: "data", response: true },
      ),

      // === REQUEST ===
      characterId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.favorites.create.post.characterId.label" as const,
        description:
          "app.api.agent.chat.favorites.create.post.characterId.description" as const,
        columns: 6,
        schema: z.string(),
      }),

      customName: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.favorites.create.post.customName.label" as const,
        description:
          "app.api.agent.chat.favorites.create.post.customName.description" as const,
        columns: 6,
        schema: z.string().optional() as z.ZodOptional<
          z.ZodType<TranslationKey>
        >,
      }),
      customIcon: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ICON,
        label:
          "app.api.agent.chat.favorites.create.post.customIcon.label" as const,
        description:
          "app.api.agent.chat.favorites.create.post.customIcon.description" as const,
        columns: 6,
        schema: iconSchema.optional(),
      }),
      voice: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.agent.chat.favorites.create.post.voice.label" as const,
        description:
          "app.api.agent.chat.favorites.create.post.voice.description" as const,
        options: TtsVoiceOptions,
        columns: 6,
        schema: z.enum(TtsVoiceDB).nullable().optional(),
      }),

      modelSelection: objectUnionField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.favorites.create.post.modelSelection.title" as const,
          description:
            "app.api.agent.chat.favorites.create.post.modelSelection.description" as const,
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
                  "app.api.agent.chat.favorites.create.post.selectionType.label" as const,
                options: [
                  {
                    value: ModelSelectionType.CHARACTER_BASED,
                    label:
                      "app.api.agent.chat.favorites.create.post.selectionType.characterBased" as const,
                  },
                  {
                    value: ModelSelectionType.MANUAL,
                    label:
                      "app.api.agent.chat.favorites.create.post.selectionType.manual" as const,
                  },
                  {
                    value: ModelSelectionType.FILTERS,
                    label:
                      "app.api.agent.chat.favorites.create.post.selectionType.filters" as const,
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
                  "app.api.agent.chat.favorites.create.post.selectionType.label" as const,
                options: [
                  {
                    value: ModelSelectionType.CHARACTER_BASED,
                    label:
                      "app.api.agent.chat.favorites.create.post.selectionType.characterBased" as const,
                  },
                  {
                    value: ModelSelectionType.MANUAL,
                    label:
                      "app.api.agent.chat.favorites.create.post.selectionType.manual" as const,
                  },
                  {
                    value: ModelSelectionType.FILTERS,
                    label:
                      "app.api.agent.chat.favorites.create.post.selectionType.filters" as const,
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
                  "app.api.agent.chat.favorites.create.post.manualModelId.label" as const,
                description:
                  "app.api.agent.chat.favorites.create.post.manualModelId.description" as const,
                options: ModelIdOptions,
                columns: 12,
                schema: z.enum(ModelId),
              }),
            },
          ),
          // Variant 3: Filter-based selection
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
                  "app.api.agent.chat.favorites.create.post.selectionType.label" as const,
                options: [
                  {
                    value: ModelSelectionType.MANUAL,
                    label:
                      "app.api.agent.chat.favorites.create.post.selectionType.manual" as const,
                  },
                  {
                    value: ModelSelectionType.FILTERS,
                    label:
                      "app.api.agent.chat.favorites.create.post.selectionType.filters" as const,
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
                  "app.api.agent.chat.favorites.create.post.intelligenceRange.label" as const,
                description:
                  "app.api.agent.chat.favorites.create.post.intelligenceRange.description" as const,
                options: INTELLIGENCE_DISPLAY.map((tier) => ({
                  label: tier.label,
                  value: tier.value,
                  icon: tier.icon,
                  description: tier.description,
                })),
                minLabel:
                  "app.api.agent.chat.favorites.create.post.intelligenceRange.minLabel" as const,
                maxLabel:
                  "app.api.agent.chat.favorites.create.post.intelligenceRange.maxLabel" as const,
                columns: 12,
                schema: z.enum(IntelligenceLevel),
              }),
              priceRange: requestDataRangeField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.RANGE_SLIDER,
                label:
                  "app.api.agent.chat.favorites.create.post.priceRange.label" as const,
                description:
                  "app.api.agent.chat.favorites.create.post.priceRange.description" as const,
                options: PRICE_DISPLAY.map((tier) => ({
                  label: tier.label,
                  value: tier.value,
                  icon: tier.icon,
                  description: tier.description,
                })),
                minLabel:
                  "app.api.agent.chat.favorites.create.post.priceRange.minLabel" as const,
                maxLabel:
                  "app.api.agent.chat.favorites.create.post.priceRange.maxLabel" as const,
                columns: 12,
                schema: z.enum(PriceLevel),
              }),
              contentRange: requestDataRangeField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.RANGE_SLIDER,
                label:
                  "app.api.agent.chat.favorites.create.post.contentRange.label" as const,
                description:
                  "app.api.agent.chat.favorites.create.post.contentRange.description" as const,
                options: CONTENT_DISPLAY.map((tier) => ({
                  label: tier.label,
                  value: tier.value,
                  icon: tier.icon,
                  description: tier.description,
                })),
                minLabel:
                  "app.api.agent.chat.favorites.create.post.contentRange.minLabel" as const,
                maxLabel:
                  "app.api.agent.chat.favorites.create.post.contentRange.maxLabel" as const,
                columns: 12,
                schema: z.enum(ContentLevel),
              }),
              speedRange: requestDataRangeField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.RANGE_SLIDER,
                label:
                  "app.api.agent.chat.favorites.create.post.speedRange.label" as const,
                description:
                  "app.api.agent.chat.favorites.create.post.speedRange.description" as const,
                options: SPEED_DISPLAY.map((tier) => ({
                  label: tier.label,
                  value: tier.value,
                  icon: tier.icon,
                  description: tier.description,
                })),
                minLabel:
                  "app.api.agent.chat.favorites.create.post.speedRange.minLabel" as const,
                maxLabel:
                  "app.api.agent.chat.favorites.create.post.speedRange.maxLabel" as const,
                columns: 12,
                schema: z.enum(SpeedLevel),
              }),
              preferredStrengths: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.MULTISELECT,
                label:
                  "app.api.agent.chat.favorites.create.post.preferredStrengths.label" as const,
                description:
                  "app.api.agent.chat.favorites.create.post.preferredStrengths.description" as const,
                options: ModelUtilityOptions,
                columns: 6,
                schema: z.array(z.enum(ModelUtility)).nullable().optional(),
              }),
              ignoredWeaknesses: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.MULTISELECT,
                label:
                  "app.api.agent.chat.favorites.create.post.ignoredWeaknesses.label" as const,
                description:
                  "app.api.agent.chat.favorites.create.post.ignoredWeaknesses.description" as const,
                options: ModelUtilityOptions,
                columns: 6,
                schema: z.array(z.enum(ModelUtility)).nullable().optional(),
              }),
            },
          ),
        ],
      ),

      // === RESPONSE ===
      id: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.favorites.create.post.response.id.content" as const,
        schema: z.string().uuid(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.favorites.create.post.errors.validation.title" as const,
      description:
        "app.api.agent.chat.favorites.create.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.favorites.create.post.errors.network.title" as const,
      description:
        "app.api.agent.chat.favorites.create.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.favorites.create.post.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.favorites.create.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.favorites.create.post.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.favorites.create.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.favorites.create.post.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.favorites.create.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.favorites.create.post.errors.server.title" as const,
      description:
        "app.api.agent.chat.favorites.create.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.favorites.create.post.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.favorites.create.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.favorites.create.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.favorites.create.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.favorites.create.post.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.favorites.create.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.favorites.create.post.success.title" as const,
    description:
      "app.api.agent.chat.favorites.create.post.success.description" as const,
  },

  examples: {
    requests: {
      create: {
        characterId: "thea",
        customName: "Thea (Smart)",
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange: {
            min: IntelligenceLevel.SMART,
            max: IntelligenceLevel.BRILLIANT,
          },
          priceRange: {
            min: PriceLevel.CHEAP,
            max: PriceLevel.STANDARD,
          },
          contentRange: {
            min: ContentLevel.OPEN,
            max: ContentLevel.UNCENSORED,
          },
          speedRange: {
            min: SpeedLevel.FAST,
            max: SpeedLevel.THOROUGH,
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
  },
});

// Type exports for POST endpoint
export type FavoriteCreateRequestInput = typeof POST.types.RequestInput;
export type FavoriteCreateRequestOutput = typeof POST.types.RequestOutput;
export type FavoriteCreateResponseInput = typeof POST.types.ResponseInput;
export type FavoriteCreateResponseOutput = typeof POST.types.ResponseOutput;

// Favorite field type alias for model selection (from POST request)
export type FavoriteModelSelection =
  FavoriteCreateRequestOutput["modelSelection"];

export type FavoriteFiltersModelSelection = Extract<
  FavoriteModelSelection,
  { selectionType: typeof ModelSelectionType.FILTERS }
>;

export type FavoriteManualModelSelection = Extract<
  FavoriteModelSelection,
  { selectionType: typeof ModelSelectionType.MANUAL }
>;

export type FavoriteCharacterBasedModelSelection = Extract<
  FavoriteModelSelection,
  { selectionType: typeof ModelSelectionType.CHARACTER_BASED }
>;

export function isCharacterBasedModelSelection(
  sel: FavoriteModelSelection,
): sel is FavoriteCharacterBasedModelSelection {
  return sel.selectionType === ModelSelectionType.CHARACTER_BASED;
}

const definitions = { POST } as const;
export default definitions;

// oxlint-disable-next-line no-unused-vars
const _test1: FiltersModelSelection = {} as FavoriteFiltersModelSelection;
// oxlint-disable-next-line no-unused-vars
const _test2: ManualModelSelection = {} as FavoriteManualModelSelection;
// oxlint-disable-next-line no-unused-vars
const _test3: {
  selectionType: typeof ModelSelectionType.CHARACTER_BASED;
} = {} as FavoriteCharacterBasedModelSelection;
