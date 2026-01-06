/**
 * Create Character API Definition
 * Defines endpoint for creating a new custom character
 */

import { z } from "zod";

import { ModelId, ModelIdOptions } from "@/app/api/[locale]/agent/models/models";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  objectUnionField,
  requestDataField,
  requestDataRangeField,
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

import { iconSchema } from "../../../../shared/types/common.schema";
import { ModelUtilityDB, ModelUtilityOptions } from "../../../models/enum";
import { TtsVoiceDB, TtsVoiceOptions } from "../../../text-to-speech/enum";
import {
  CONTENT_DISPLAY,
  INTELLIGENCE_DISPLAY,
  PRICE_DISPLAY,
  SPEED_DISPLAY,
} from "../../favorites/display-configs";
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
} from "../../favorites/enum";
import { CategoryOptions } from "../config";
import {
  CharacterCategory,
  CharacterCategoryDB,
  CharacterOwnershipType,
  CharacterOwnershipTypeDB,
  CharacterSource,
  CharacterSourceDB,
} from "../enum";

/**
 * Create Character Endpoint (POST)
 * Creates a new custom character
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["agent", "chat", "characters", "create"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.characters.post.title" as const,
  description: "app.api.agent.chat.characters.post.description" as const,
  icon: "sparkle" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.characters" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
      border: false,
      paddingTop: "6",
    },
    { request: "data", response: true },
    {
      // === REQUEST ===
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.characters.post.name.label" as const,
          description: "app.api.agent.chat.characters.post.name.description" as const,
          columns: 6,
        },
        z.string().min(1).max(100),
      ),
      description: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.characters.post.characterDescription.label" as const,
          description:
            "app.api.agent.chat.characters.post.characterDescription.description" as const,
          columns: 6,
        },
        z.string().min(1).max(500),
      ),
      icon: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.ICON,
          label: "app.api.agent.chat.characters.post.icon.label" as const,
          description: "app.api.agent.chat.characters.post.icon.description" as const,
          columns: 6,
        },
        iconSchema,
      ),
      systemPrompt: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.agent.chat.characters.post.systemPrompt.label" as const,
          description: "app.api.agent.chat.characters.post.systemPrompt.description" as const,
          columns: 12,
        },
        z.string().min(1).max(5000),
      ),
      category: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.characters.post.category.label" as const,
          description: "app.api.agent.chat.characters.post.category.description" as const,
          options: CategoryOptions,
          columns: 6,
        },
        z.enum(CharacterCategoryDB),
      ),
      tagline: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.characters.post.tagline.label" as const,
          description: "app.api.agent.chat.characters.post.tagline.description" as const,
          columns: 6,
        },
        z.string().min(1).max(500),
      ),
      source: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.characters.post.source.label" as const,
          description: "app.api.agent.chat.characters.post.source.description" as const,
          options: [
            {
              value: CharacterSource.MY,
              label: "app.api.agent.chat.characters.enums.source.my" as const,
            },
          ],
          columns: 6,
        },
        z.enum(CharacterSourceDB),
      ),
      task: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.characters.post.task.label" as const,
          description: "app.api.agent.chat.characters.post.task.description" as const,
          options: [
            {
              value: "app.chat.modelUtilities.chat",
              label: "app.chat.modelUtilities.chat" as const,
            },
          ],
          columns: 6,
        },
        z.enum(ModelUtilityDB),
      ),
      ownershipType: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.characters.post.ownershipType.label" as const,
          description: "app.api.agent.chat.characters.post.ownershipType.description" as const,
          options: [
            {
              value: CharacterOwnershipType.USER,
              label: "app.api.agent.chat.characters.enums.ownershipType.user" as const,
            },
          ],
          columns: 6,
        },
        z.enum(CharacterOwnershipTypeDB),
      ),
      // Model Selection - discriminated union between manual and filter-based
      modelSelection: objectUnionField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.chat.characters.post.modelSelection.title" as const,
          description: "app.api.agent.chat.characters.post.modelSelection.description" as const,
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
                  label: "app.api.agent.chat.characters.post.selectionType.label" as const,
                  options: [
                    {
                      value: ModelSelectionType.MANUAL,
                      label: "app.api.agent.chat.characters.post.selectionType.manual" as const,
                    },
                    {
                      value: ModelSelectionType.FILTERS,
                      label: "app.api.agent.chat.characters.post.selectionType.filters" as const,
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
                  label: "app.api.agent.chat.characters.post.manualModelId.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.manualModelId.description" as const,
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
                  label: "app.api.agent.chat.characters.post.selectionType.label" as const,
                  options: [
                    {
                      value: ModelSelectionType.MANUAL,
                      label: "app.api.agent.chat.characters.post.selectionType.manual" as const,
                    },
                    {
                      value: ModelSelectionType.FILTERS,
                      label: "app.api.agent.chat.characters.post.selectionType.filters" as const,
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
                  label: "app.api.agent.chat.characters.post.intelligenceRange.label" as const,
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
                },
                z.enum(IntelligenceLevelFilterDB),
              ),
              priceRange: requestDataRangeField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.RANGE_SLIDER,
                  label: "app.api.agent.chat.characters.post.priceRange.label" as const,
                  description: "app.api.agent.chat.characters.post.priceRange.description" as const,
                  options: PRICE_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  minLabel: "app.api.agent.chat.characters.post.priceRange.minLabel" as const,
                  maxLabel: "app.api.agent.chat.characters.post.priceRange.maxLabel" as const,
                  columns: 12,
                },
                z.enum(PriceLevelFilterDB),
              ),
              contentRange: requestDataRangeField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.RANGE_SLIDER,
                  label: "app.api.agent.chat.characters.post.contentRange.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.contentRange.description" as const,
                  options: CONTENT_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  minLabel: "app.api.agent.chat.characters.post.contentRange.minLabel" as const,
                  maxLabel: "app.api.agent.chat.characters.post.contentRange.maxLabel" as const,
                  columns: 12,
                },
                z.enum(ContentLevelFilterDB),
              ),
              speedRange: requestDataRangeField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.RANGE_SLIDER,
                  label: "app.api.agent.chat.characters.post.speedRange.label" as const,
                  description: "app.api.agent.chat.characters.post.speedRange.description" as const,
                  options: SPEED_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  minLabel: "app.api.agent.chat.characters.post.speedRange.minLabel" as const,
                  maxLabel: "app.api.agent.chat.characters.post.speedRange.maxLabel" as const,
                  columns: 12,
                },
                z.enum(SpeedLevelFilterDB),
              ),
              preferredStrengths: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.MULTISELECT,
                  label: "app.api.agent.chat.characters.post.preferredStrengths.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.preferredStrengths.description" as const,
                  options: ModelUtilityOptions,
                  columns: 6,
                },
                z.array(z.enum(ModelUtilityDB)).nullable().default(null),
              ),
              ignoredWeaknesses: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.MULTISELECT,
                  label: "app.api.agent.chat.characters.post.ignoredWeaknesses.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.ignoredWeaknesses.description" as const,
                  options: ModelUtilityOptions,
                  columns: 6,
                },
                z.array(z.enum(ModelUtilityDB)).nullable().default(null),
              ),
            },
          ),
        ],
      ),
      voice: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.characters.post.voice.label" as const,
          description: "app.api.agent.chat.characters.post.voice.description" as const,
          options: TtsVoiceOptions,
          columns: 6,
        },
        z.enum(TtsVoiceDB).optional(),
      ),
      suggestedPrompts: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TAGS,
          label: "app.api.agent.chat.characters.post.suggestedPrompts.label" as const,
          description: "app.api.agent.chat.characters.post.suggestedPrompts.description" as const,
          placeholder: "app.api.agent.chat.characters.post.suggestedPrompts.placeholder" as const,
          columns: 12,
          maxTags: 4,
        },
        z.array(z.string()).max(4).optional(),
      ),

      // === RESPONSE ===
      id: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.characters.post.response.id.content" as const,
        },
        z.string(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.characters.post.errors.validation.title" as const,
      description: "app.api.agent.chat.characters.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.characters.post.errors.network.title" as const,
      description: "app.api.agent.chat.characters.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.characters.post.errors.unauthorized.title" as const,
      description: "app.api.agent.chat.characters.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.characters.post.errors.forbidden.title" as const,
      description: "app.api.agent.chat.characters.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.characters.post.errors.notFound.title" as const,
      description: "app.api.agent.chat.characters.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.characters.post.errors.server.title" as const,
      description: "app.api.agent.chat.characters.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.characters.post.errors.unknown.title" as const,
      description: "app.api.agent.chat.characters.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.characters.post.errors.unsavedChanges.title" as const,
      description: "app.api.agent.chat.characters.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.characters.post.errors.conflict.title" as const,
      description: "app.api.agent.chat.characters.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.characters.post.success.title" as const,
    description: "app.api.agent.chat.characters.post.success.description" as const,
  },

  examples: {
    requests: {
      // Example with manual model selection
      create: {
        name: "Code Reviewer",
        description: "Expert at reviewing code and suggesting improvements",
        tagline: "Expert at reviewing code and suggesting improvements",
        icon: "technologist",
        systemPrompt:
          "You are an expert code reviewer. Analyze code for bugs, performance issues, and best practices.",
        category: CharacterCategory.CODING,
        source: CharacterSource.MY,
        task: "app.chat.modelUtilities.chat",
        ownershipType: CharacterOwnershipType.USER,
        modelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ModelId.GPT_5,
        },
        voice: undefined,
        suggestedPrompts: ["Review this code for bugs", "Suggest performance improvements"],
      },
      createManual: {
        name: "Code Reviewer",
        description: "Expert at reviewing code and suggesting improvements",
        tagline: "Expert at reviewing code and suggesting improvements",
        icon: "technologist",
        systemPrompt:
          "You are an expert code reviewer. Analyze code for bugs, performance issues, and best practices.",
        category: CharacterCategory.CODING,
        source: CharacterSource.MY,
        task: "app.chat.modelUtilities.chat",
        ownershipType: CharacterOwnershipType.USER,
        modelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ModelId.GPT_5,
        },
        voice: undefined,
        suggestedPrompts: ["Review this code for bugs", "Suggest performance improvements"],
      },
      // Example with filter-based model selection
      createFilters: {
        name: "Creative Writer",
        description: "Helps with creative writing and storytelling",
        tagline: "Helps with creative writing and storytelling",
        icon: "pen-tool",
        systemPrompt:
          "You are a creative writing assistant. Help users craft compelling stories, characters, and narratives.",
        category: CharacterCategory.CREATIVE,
        source: CharacterSource.MY,
        task: "app.chat.modelUtilities.chat",
        ownershipType: CharacterOwnershipType.USER,
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange: {
            min: IntelligenceLevelFilter.BRILLIANT,
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
        voice: undefined,
        suggestedPrompts: ["Help me develop a character", "Create a story outline"],
      },
    },
    responses: {
      create: {
        id: "550e8400-e29b-41d4-a716-446655440000",
      },
      createManual: {
        id: "550e8400-e29b-41d4-a716-446655440001",
      },
      createFilters: {
        id: "550e8400-e29b-41d4-a716-446655440002",
      },
    },
    urlPathParams: undefined,
  },
});

// Type exports
export type CharacterCreateRequestInput = typeof POST.types.RequestInput;
export type CharacterCreateRequestOutput = typeof POST.types.RequestOutput;
export type CharacterCreateResponseInput = typeof POST.types.ResponseInput;
export type CharacterCreateResponseOutput = typeof POST.types.ResponseOutput;

// Character field type aliases
export type CharacterModelSelection = CharacterCreateRequestOutput["modelSelection"];

const definitions = { POST };
export { POST };
export default definitions;
