/**
 * Single Character API Definition
 * Defines endpoints for GET, PATCH (update), and DELETE operations on a single character
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  field,
  objectField,
  objectUnionField,
  requestDataField,
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
import { TtsVoiceDB, TtsVoiceOptions } from "../../../text-to-speech/enum";
import {
  ContentLevelFilterDB,
  IntelligenceLevelFilterDB,
  PriceLevelFilterDB,
} from "../../favorites/enum";
import { ModelId, ModelIdOptions } from "../../model-access/models";
import {
  CONTENT_DISPLAY,
  INTELLIGENCE_DISPLAY,
  PRICE_DISPLAY,
} from "../../types";
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
      description:
        "app.api.agent.chat.characters.id.get.container.description" as const,
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
          description:
            "app.api.agent.chat.characters.id.get.id.description" as const,
        },
        z.string(), // Can be default character ID or UUID
      ),

      // === RESPONSE ===
      character: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.characters.id.get.response.character.title" as const,
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
            z.string(),
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
          preferredModel: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.characters.id.get.response.character.preferredModel.content" as const,
            },
            z.enum(ModelId).optional(),
          ),
          suggestedPrompts: responseArrayOptionalField(
            {
              type: WidgetType.DATA_LIST,
            },
            field(
              z.string(),
              { response: true },
              {
                type: WidgetType.TEXT,
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
      title:
        "app.api.agent.chat.characters.id.get.errors.validation.title" as const,
      description:
        "app.api.agent.chat.characters.id.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.characters.id.get.errors.network.title" as const,
      description:
        "app.api.agent.chat.characters.id.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.characters.id.get.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.characters.id.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.characters.id.get.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.characters.id.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.characters.id.get.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.characters.id.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.characters.id.get.errors.server.title" as const,
      description:
        "app.api.agent.chat.characters.id.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.characters.id.get.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.characters.id.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.characters.id.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.characters.id.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.characters.id.get.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.characters.id.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.characters.id.get.success.title" as const,
    description:
      "app.api.agent.chat.characters.id.get.success.description" as const,
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
          suggestedPrompts: ["Help me brainstorm ideas"],
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
          preferredModel: ModelId.GPT_5,
          suggestedPrompts: ["Review this code"],
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
  description: "app.api.agent.chat.characters.id.patch.description" as const,
  icon: "sparkles" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.characters" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.characters.id.patch.container.title" as const,
      description:
        "app.api.agent.chat.characters.id.patch.container.description" as const,
      layoutType: LayoutType.STACKED,
      paddingTop: "6",
    },
    { request: "data&urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.agent.chat.characters.id.patch.id.label" as const,
          description:
            "app.api.agent.chat.characters.id.patch.id.description" as const,
        },
        z.string(),
      ),

      // === REQUEST DATA (all optional for PATCH) ===
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.characters.id.patch.name.label" as const,
          description:
            "app.api.agent.chat.characters.id.patch.name.description" as const,
          columns: 6,
        },
        z.string().min(1).max(100).optional(),
      ),
      description: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.agent.chat.characters.id.patch.description.label" as const,
          description:
            "app.api.agent.chat.characters.id.patch.description.description" as const,
          columns: 6,
        },
        z.string().min(1).max(500).optional(),
      ),
      icon: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.ICON,
          label: "app.api.agent.chat.characters.id.patch.icon.label" as const,
          description:
            "app.api.agent.chat.characters.id.patch.icon.description" as const,
          columns: 6,
        },
        iconSchema.optional(),
      ),
      systemPrompt: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.agent.chat.characters.id.patch.systemPrompt.label" as const,
          description:
            "app.api.agent.chat.characters.id.patch.systemPrompt.description" as const,
          columns: 12,
        },
        z.string().min(1).max(5000).optional(),
      ),
      category: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.agent.chat.characters.id.patch.category.label" as const,
          description:
            "app.api.agent.chat.characters.id.patch.category.description" as const,
          options: CategoryOptions,
          columns: 6,
        },
        z.enum(CharacterCategoryDB).optional(),
      ),
      // Model Selection - discriminated union between manual and filter-based (optional for PATCH)
      modelSelection: objectUnionField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.characters.post.modelSelection.title" as const,
          description:
            "app.api.agent.chat.characters.post.modelSelection.description" as const,
          layoutType: LayoutType.STACKED,
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
                  fieldType: FieldDataType.SELECT,
                  label:
                    "app.api.agent.chat.characters.post.selectionType.label" as const,
                  options: [
                    {
                      value: "manual",
                      label:
                        "app.api.agent.chat.characters.post.selectionType.manual" as const,
                    },
                    {
                      value: "filters",
                      label:
                        "app.api.agent.chat.characters.post.selectionType.filters" as const,
                    },
                  ],
                  columns: 12,
                },
                z.literal("manual"),
              ),
              preferredModel: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.SELECT,
                  label:
                    "app.api.agent.chat.characters.post.preferredModel.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.preferredModel.description" as const,
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
                  fieldType: FieldDataType.SELECT,
                  label:
                    "app.api.agent.chat.characters.post.selectionType.label" as const,
                  options: [
                    {
                      value: "manual",
                      label:
                        "app.api.agent.chat.characters.post.selectionType.manual" as const,
                    },
                    {
                      value: "filters",
                      label:
                        "app.api.agent.chat.characters.post.selectionType.filters" as const,
                    },
                  ],
                  columns: 12,
                },
                z.literal("filters"),
              ),
              intelligence: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.FILTER_PILLS,
                  label:
                    "app.api.agent.chat.characters.post.intelligence.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.intelligence.description" as const,
                  options: INTELLIGENCE_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  columns: 12,
                },
                z.enum(IntelligenceLevelFilterDB),
              ),
              maxPrice: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.FILTER_PILLS,
                  label:
                    "app.api.agent.chat.characters.post.maxPrice.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.maxPrice.description" as const,
                  options: PRICE_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  columns: 12,
                },
                z.enum(PriceLevelFilterDB),
              ),
              contentLevel: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.FILTER_PILLS,
                  label:
                    "app.api.agent.chat.characters.post.contentLevel.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.contentLevel.description" as const,
                  options: CONTENT_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  columns: 12,
                },
                z.enum(ContentLevelFilterDB),
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
          description:
            "app.api.agent.chat.characters.post.voice.description" as const,
          options: TtsVoiceOptions,
          columns: 6,
        },
        z.enum(TtsVoiceDB).optional(),
      ),
      suggestedPrompts: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TAGS,
          label:
            "app.api.agent.chat.characters.post.suggestedPrompts.label" as const,
          description:
            "app.api.agent.chat.characters.post.suggestedPrompts.description" as const,
          placeholder:
            "app.api.agent.chat.characters.post.suggestedPrompts.placeholder" as const,
          columns: 12,
          maxTags: 4,
        },
        z.array(z.string()).max(4).optional(),
      ),

      // === RESPONSE ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.characters.id.patch.response.success.content" as const,
        },
        z.boolean(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.characters.id.patch.errors.validation.title" as const,
      description:
        "app.api.agent.chat.characters.id.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.characters.id.patch.errors.network.title" as const,
      description:
        "app.api.agent.chat.characters.id.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.characters.id.patch.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.characters.id.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.characters.id.patch.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.characters.id.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.characters.id.patch.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.characters.id.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.characters.id.patch.errors.server.title" as const,
      description:
        "app.api.agent.chat.characters.id.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.characters.id.patch.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.characters.id.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.characters.id.patch.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.characters.id.patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.characters.id.patch.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.characters.id.patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.characters.id.patch.success.title" as const,
    description:
      "app.api.agent.chat.characters.id.patch.success.description" as const,
  },

  examples: {
    requests: {
      update: {
        name: "Updated Code Reviewer",
        description: "Updated description",
        modelSelection: {
          selectionType: "manual" as const,
          preferredModel: ModelId.GPT_5,
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

const definitions = { GET, PATCH };
export { GET, PATCH };
export default definitions;
