/**
 * Create Character API Definition
 * Defines endpoint for creating a new custom character
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  filterPillsField,
  objectField,
  objectUnionField,
  requestDataField,
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
  ContentLevelFilter,
  ContentLevelFilterDB,
  IntelligenceLevelFilter,
  IntelligenceLevelFilterDB,
  PriceLevelFilter,
  PriceLevelFilterDB,
} from "../../favorites/enum";
import { ModelId, ModelIdOptions } from "../../model-access/models";
import {
  CONTENT_DISPLAY,
  INTELLIGENCE_DISPLAY,
  PRICE_DISPLAY,
} from "../../types";
import { CategoryOptions, CharacterCategory } from "../config";
import { CharacterCategoryDB } from "../enum";

/**
 * Create Persona Endpoint (POST)
 * Creates a new custom persona
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["agent", "chat", "personas", "create"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.personas.post.title" as const,
  description: "app.api.agent.chat.personas.post.description" as const,
  icon: "sparkle" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.personas" as const],

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
          label: "app.api.agent.chat.personas.post.name.label" as const,
          description:
            "app.api.agent.chat.personas.post.name.description" as const,
          columns: 6,
        },
        z.string().min(1).max(100),
      ),
      description: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.agent.chat.personas.post.personaDescription.label" as const,
          description:
            "app.api.agent.chat.personas.post.personaDescription.description" as const,
          columns: 6,
        },
        z.string().min(1).max(500),
      ),
      icon: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.ICON,
          label: "app.api.agent.chat.personas.post.icon.label" as const,
          description:
            "app.api.agent.chat.personas.post.icon.description" as const,
          columns: 6,
        },
        iconSchema,
      ),
      systemPrompt: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.agent.chat.personas.post.systemPrompt.label" as const,
          description:
            "app.api.agent.chat.personas.post.systemPrompt.description" as const,
          columns: 12,
        },
        z.string().min(1).max(5000),
      ),
      category: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.personas.post.category.label" as const,
          description:
            "app.api.agent.chat.personas.post.category.description" as const,
          options: CategoryOptions,
          columns: 6,
        },
        z.enum(CharacterCategoryDB),
      ),
      // Model Selection - discriminated union between manual and filter-based
      modelSelection: objectUnionField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.personas.post.modelSelection.title" as const,
          description:
            "app.api.agent.chat.personas.post.modelSelection.description" as const,
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
                  fieldType: FieldDataType.SELECT,
                  label:
                    "app.api.agent.chat.personas.post.selectionType.label" as const,
                  options: [
                    {
                      value: "manual",
                      label:
                        "app.api.agent.chat.personas.post.selectionType.manual" as const,
                    },
                    {
                      value: "filters",
                      label:
                        "app.api.agent.chat.personas.post.selectionType.filters" as const,
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
                    "app.api.agent.chat.personas.post.preferredModel.label" as const,
                  description:
                    "app.api.agent.chat.personas.post.preferredModel.description" as const,
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
                    "app.api.agent.chat.personas.post.selectionType.label" as const,
                  options: [
                    {
                      value: "manual",
                      label:
                        "app.api.agent.chat.personas.post.selectionType.manual" as const,
                    },
                    {
                      value: "filters",
                      label:
                        "app.api.agent.chat.personas.post.selectionType.filters" as const,
                    },
                  ],
                  columns: 12,
                },
                z.literal("filters"),
              ),
              intelligence: filterPillsField(
                {
                  type: WidgetType.FILTER_PILLS,
                  label:
                    "app.api.agent.chat.personas.post.intelligence.label" as const,
                  description:
                    "app.api.agent.chat.personas.post.intelligence.description" as const,
                  options: INTELLIGENCE_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  showIcon: true,
                  showLabel: true,
                },
                z.enum(IntelligenceLevelFilterDB),
              ),
              maxPrice: filterPillsField(
                {
                  type: WidgetType.FILTER_PILLS,
                  label:
                    "app.api.agent.chat.personas.post.maxPrice.label" as const,
                  description:
                    "app.api.agent.chat.personas.post.maxPrice.description" as const,
                  options: PRICE_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  showIcon: true,
                  showLabel: true,
                },
                z.enum(PriceLevelFilterDB),
              ),
              contentLevel: filterPillsField(
                {
                  type: WidgetType.FILTER_PILLS,
                  label:
                    "app.api.agent.chat.personas.post.contentLevel.label" as const,
                  description:
                    "app.api.agent.chat.personas.post.contentLevel.description" as const,
                  options: CONTENT_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  showIcon: true,
                  showLabel: true,
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
          label: "app.api.agent.chat.personas.post.voice.label" as const,
          description:
            "app.api.agent.chat.personas.post.voice.description" as const,
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
            "app.api.agent.chat.personas.post.suggestedPrompts.label" as const,
          description:
            "app.api.agent.chat.personas.post.suggestedPrompts.description" as const,
          placeholder:
            "app.api.agent.chat.personas.post.suggestedPrompts.placeholder" as const,
          columns: 12,
          maxTags: 4,
        },
        z.array(z.string()).max(4).optional(),
      ),

      // === RESPONSE ===
      id: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.personas.post.response.id.content" as const,
        },
        z.string(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.personas.post.errors.validation.title" as const,
      description:
        "app.api.agent.chat.personas.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.personas.post.errors.network.title" as const,
      description:
        "app.api.agent.chat.personas.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.personas.post.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.personas.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.personas.post.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.personas.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.personas.post.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.personas.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.personas.post.errors.server.title" as const,
      description:
        "app.api.agent.chat.personas.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.personas.post.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.personas.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.personas.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.personas.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.personas.post.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.personas.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.personas.post.success.title" as const,
    description:
      "app.api.agent.chat.personas.post.success.description" as const,
  },

  examples: {
    requests: {
      // Example with manual model selection
      create: {
        name: "Code Reviewer",
        description: "Expert at reviewing code and suggesting improvements",
        icon: "technologist",
        systemPrompt:
          "You are an expert code reviewer. Analyze code for bugs, performance issues, and best practices.",
        category: CharacterCategory.CODING,
        modelSelection: {
          selectionType: "manual" as const,
          preferredModel: ModelId.GPT_5,
        },
        voice: undefined,
        suggestedPrompts: [
          "Review this code for bugs",
          "Suggest performance improvements",
        ],
      },
      createManual: {
        name: "Code Reviewer",
        description: "Expert at reviewing code and suggesting improvements",
        icon: "technologist",
        systemPrompt:
          "You are an expert code reviewer. Analyze code for bugs, performance issues, and best practices.",
        category: CharacterCategory.CODING,
        modelSelection: {
          selectionType: "manual" as const,
          preferredModel: ModelId.GPT_5,
        },
        voice: undefined,
        suggestedPrompts: [
          "Review this code for bugs",
          "Suggest performance improvements",
        ],
      },
      // Example with filter-based model selection
      createFilters: {
        name: "Creative Writer",
        description: "Helps with creative writing and storytelling",
        icon: "pen-tool",
        systemPrompt:
          "You are a creative writing assistant. Help users craft compelling stories, characters, and narratives.",
        category: CharacterCategory.CREATIVE,
        modelSelection: {
          selectionType: "filters" as const,
          intelligence: IntelligenceLevelFilter.BRILLIANT,
          maxPrice: PriceLevelFilter.STANDARD,
          contentLevel: ContentLevelFilter.OPEN,
        },
        voice: undefined,
        suggestedPrompts: [
          "Help me develop a character",
          "Create a story outline",
        ],
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

const definitions = { POST };
export { POST };
export default definitions;
