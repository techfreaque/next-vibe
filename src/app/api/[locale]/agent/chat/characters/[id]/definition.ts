/**
 * Single Character API Definition
 * Defines endpoints for GET, PATCH (update), and DELETE operations on a single character
 */

import { z } from "zod";

import { ModelId, ModelIdOptions } from "@/app/api/[locale]/agent/models/models";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  field,
  objectField,
  objectUnionField,
  requestDataField,
  requestDataRangeField,
  requestUrlPathParamsField,
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
  ContentLevelFilterDB,
  IntelligenceLevelFilterDB,
  ModelSelectionType,
  PriceLevelFilterDB,
  SpeedLevelFilterDB,
} from "../../favorites/enum";
import { CategoryOptions } from "../config";
import {
  CharacterCategory,
  CharacterCategoryDB,
  CharacterSource,
  CharacterSourceDB,
} from "../enum";

/**
 * Get Single Character Endpoint (GET)
 * Retrieves a specific character by ID (default or custom)
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "characters", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PUBLIC] as const,

  title: "app.api.agent.chat.characters.id.get.title" as const,
  description: "app.api.agent.chat.characters.id.get.description" as const,
  icon: "sparkles" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.characters" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.characters.id.get.container.title" as const,
      description: "app.api.agent.chat.characters.id.get.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.characters.id.get.id.label" as const,
          description: "app.api.agent.chat.characters.id.get.id.description" as const,
        },
        z.string(), // Can be default character ID or UUID
      ),

      // === RESPONSE ===
      character: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.chat.characters.id.get.response.character.title" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { response: true },
        {
          id: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.characters.id.get.response.character.id.content" as const,
            },
            z.string(),
          ),
          name: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.characters.id.get.response.character.name.content" as const,
            },
            z.string(),
          ),
          description: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.characters.id.get.response.character.description.content" as const,
            },
            z.string(),
          ),
          icon: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.characters.id.get.response.character.icon.content" as const,
            },
            iconSchema,
          ),
          systemPrompt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.characters.id.get.response.character.systemPrompt.content" as const,
            },
            z.string(),
          ),
          category: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.characters.id.get.response.character.category.content" as const,
            },
            z.enum(CharacterCategoryDB),
          ),
          source: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.characters.id.get.response.character.source.content" as const,
            },
            z.enum(CharacterSourceDB),
          ),
          voice: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.characters.id.get.response.character.voice.content" as const,
            },
            z.enum(TtsVoiceDB),
          ),
          // Model selection union (same structure as PATCH request)
          modelSelection: objectUnionField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.agent.chat.characters.id.get.response.character.modelSelection.title" as const,
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
                        "app.api.agent.chat.characters.id.get.response.character.selectionType.content" as const,
                    },
                    z.literal(ModelSelectionType.MANUAL),
                  ),
                  manualModelId: responseField(
                    {
                      type: WidgetType.TEXT,
                      content:
                        "app.api.agent.chat.characters.id.get.response.character.manualModelId.content" as const,
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
                        "app.api.agent.chat.characters.id.get.response.character.selectionType.content" as const,
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
                          "app.api.agent.chat.characters.id.get.response.character.preferredStrengths.content" as const,
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
                          "app.api.agent.chat.characters.id.get.response.character.ignoredWeaknesses.content" as const,
                      },
                    ),
                  ),
                },
              ),
            ],
          ),
          suggestedPrompts: responseArrayOptionalField(
            {
              type: WidgetType.DATA_LIST,
            },
            field(
              z.string(),
              { response: true },
              {
                type: WidgetType.BADGE,
                content:
                  "app.api.agent.chat.characters.id.get.response.character.suggestedPrompts.content" as const,
              },
            ),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.characters.id.get.errors.validation.title" as const,
      description: "app.api.agent.chat.characters.id.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.characters.id.get.errors.network.title" as const,
      description: "app.api.agent.chat.characters.id.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.characters.id.get.errors.unauthorized.title" as const,
      description: "app.api.agent.chat.characters.id.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.characters.id.get.errors.forbidden.title" as const,
      description: "app.api.agent.chat.characters.id.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.characters.id.get.errors.notFound.title" as const,
      description: "app.api.agent.chat.characters.id.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.characters.id.get.errors.server.title" as const,
      description: "app.api.agent.chat.characters.id.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.characters.id.get.errors.unknown.title" as const,
      description: "app.api.agent.chat.characters.id.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.characters.id.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.characters.id.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.characters.id.get.errors.conflict.title" as const,
      description: "app.api.agent.chat.characters.id.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.characters.id.get.success.title" as const,
    description: "app.api.agent.chat.characters.id.get.success.description" as const,
  },

  examples: {
    requests: undefined,
    responses: {
      getDefault: {
        character: {
          id: "default",
          name: "Default",
          description: "The models unmodified behavior",
          icon: "🤖",
          systemPrompt: "",
          category: CharacterCategory.ASSISTANT,
          source: CharacterSource.BUILT_IN,
          voice: "app.api.agent.textToSpeech.voices.FEMALE",
          suggestedPrompts: ["Help me brainstorm ideas"],
          modelSelection: {
            selectionType: ModelSelectionType.FILTERS,
            preferredStrengths: null,
            ignoredWeaknesses: null,
          },
        },
      },
      getCustom: {
        character: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          name: "Code Reviewer",
          description: "Expert at reviewing code",
          icon: "👨‍💻",
          systemPrompt: "You are an expert code reviewer...",
          category: CharacterCategory.CODING,
          source: CharacterSource.MY,
          voice: "app.api.agent.textToSpeech.voices.MALE",
          suggestedPrompts: ["Review this code"],
          modelSelection: {
            selectionType: ModelSelectionType.MANUAL,
            manualModelId: ModelId.GPT_5,
          },
        },
      },
    },
    urlPathParams: {
      getDefault: { id: "default" },
      getCustom: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

/**
 * Update Character Endpoint (PATCH)
 * Updates a custom character (only custom characters can be updated)
 */
const { PATCH } = createEndpoint({
  method: Methods.PATCH,
  path: ["agent", "chat", "characters", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.characters.id.patch.title" as const,
  description: "app.api.agent.chat.characters.id.patch.container.description" as const,
  icon: "sparkles" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.characters" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.characters.id.patch.container.title" as const,
      description: "app.api.agent.chat.characters.id.patch.container.description" as const,
      layoutType: LayoutType.STACKED,
      paddingTop: "6",
      submitButton: {
        text: "app.api.agent.chat.characters.id.patch.actions.update" as const,
        loadingText: "app.api.agent.chat.characters.id.patch.actions.updating" as const,
        position: "bottom" as const,
        icon: "save" as const,
        variant: "primary" as const,
        size: "default" as const,
      },
    },
    { request: "data&urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.agent.chat.characters.id.patch.id.label" as const,
          description: "app.api.agent.chat.characters.id.patch.id.description" as const,
        },
        z.string(),
      ),

      // === REQUEST DATA (all optional for PATCH) ===
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.characters.id.patch.name.label" as const,
          description: "app.api.agent.chat.characters.id.patch.name.description" as const,
          columns: 6,
        },
        z.string().min(1).max(100).optional(),
      ),
      description: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.characters.id.patch.description.label" as const,
          description: "app.api.agent.chat.characters.id.patch.description.description" as const,
          columns: 6,
        },
        z.string().min(1).max(500).optional(),
      ),
      icon: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.ICON,
          label: "app.api.agent.chat.characters.id.patch.icon.label" as const,
          description: "app.api.agent.chat.characters.id.patch.icon.description" as const,
          columns: 6,
        },
        iconSchema.optional(),
      ),
      systemPrompt: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.agent.chat.characters.id.patch.systemPrompt.label" as const,
          description: "app.api.agent.chat.characters.id.patch.systemPrompt.description" as const,
          columns: 12,
        },
        z.string().min(1).max(5000).optional(),
      ),
      category: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.characters.id.patch.category.label" as const,
          description: "app.api.agent.chat.characters.id.patch.category.description" as const,
          options: CategoryOptions,
          columns: 6,
        },
        z.enum(CharacterCategoryDB).optional(),
      ),
      // Model Selection - discriminated union between manual and filter-based (optional for PATCH)
      modelSelection: objectUnionField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.chat.characters.post.modelSelection.title" as const,
          description: "app.api.agent.chat.characters.post.modelSelection.description" as const,
          layoutType: LayoutType.STACKED,
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
                z.array(z.enum(ModelUtilityDB)).optional(),
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
                z.array(z.enum(ModelUtilityDB)).optional(),
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
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.characters.id.patch.response.success.content" as const,
        },
        z.boolean(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.characters.id.patch.errors.validation.title" as const,
      description: "app.api.agent.chat.characters.id.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.characters.id.patch.errors.network.title" as const,
      description: "app.api.agent.chat.characters.id.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.characters.id.patch.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.characters.id.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.characters.id.patch.errors.forbidden.title" as const,
      description: "app.api.agent.chat.characters.id.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.characters.id.patch.errors.notFound.title" as const,
      description: "app.api.agent.chat.characters.id.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.characters.id.patch.errors.server.title" as const,
      description: "app.api.agent.chat.characters.id.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.characters.id.patch.errors.unknown.title" as const,
      description: "app.api.agent.chat.characters.id.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.characters.id.patch.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.characters.id.patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.characters.id.patch.errors.conflict.title" as const,
      description: "app.api.agent.chat.characters.id.patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.characters.id.patch.success.title" as const,
    description: "app.api.agent.chat.characters.id.patch.success.description" as const,
  },

  examples: {
    requests: {
      update: {
        name: "Updated Code Reviewer",
        description: "Updated description",
        modelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ModelId.GPT_5,
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

// Type exports for GET endpoint
export type CharacterGetRequestInput = typeof GET.types.RequestInput;
export type CharacterGetRequestOutput = typeof GET.types.RequestOutput;
export type CharacterGetResponseInput = typeof GET.types.ResponseInput;
export type CharacterGetResponseOutput = typeof GET.types.ResponseOutput;

// Type exports for PATCH endpoint
export type CharacterUpdateRequestInput = typeof PATCH.types.RequestInput;
export type CharacterUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type CharacterUpdateResponseInput = typeof PATCH.types.ResponseInput;
export type CharacterUpdateResponseOutput = typeof PATCH.types.ResponseOutput;

// Extract ModelFilters type from the filters variant of modelSelection
type ModelSelectionUnion = CharacterGetResponseOutput["character"]["modelSelection"];
type FiltersVariant = Extract<
  ModelSelectionUnion,
  { selectionType: typeof ModelSelectionType.FILTERS }
>;
export type ModelFilters = Omit<
  FiltersVariant,
  "selectionType" | "preferredStrengths" | "ignoredWeaknesses"
>;

const definitions = { GET, PATCH };
export { GET, PATCH };
export default definitions;
