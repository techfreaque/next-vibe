/**
 * Characters API Definition
 * Defines endpoint for listing characters
 */

import { z } from "zod";

import { ModelUtilityDB } from "@/app/api/[locale]/agent/models/enum";
import { ModelId } from "@/app/api/[locale]/agent/models/models";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  field,
  objectField,
  objectUnionField,
  responseArrayField,
  responseArrayOptionalField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import { iconSchema } from "../../../shared/types/common.schema";
import { TtsVoiceDB } from "../../text-to-speech/enum";
import {
  ContentLevelFilterDB,
  IntelligenceLevelFilterDB,
  ModelSelectionType,
  PriceLevelFilterDB,
  SpeedLevelFilterDB,
} from "../favorites/enum";
import { CharacterCategory } from "./enum";
import { CharacterCategoryDB, CharacterSource, CharacterSourceDB } from "./enum";

/**
 * Get Characters List Endpoint (GET)
 * Retrieves all characters (default + custom) for the current user
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "characters"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PUBLIC] as const,

  title: "app.api.agent.chat.characters.get.title" as const,
  description: "app.api.agent.chat.characters.get.description" as const,
  icon: "sparkles" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.characters" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.characters.get.container.title" as const,
      description: "app.api.agent.chat.characters.get.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { response: true },
    {
      // === RESPONSE ===
      characters: responseArrayField(
        {
          type: WidgetType.DATA_CARDS,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title: "app.api.agent.chat.characters.get.response.characters.character.title" as const,
            layoutType: LayoutType.GRID,
            columns: 2,
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.characters.get.response.characters.character.id.content" as const,
              },
              z.string(),
            ),
            name: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.characters.get.response.characters.character.name.content" as const,
              },
              z.string() as z.ZodType<TranslationKey>,
            ),
            description: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.characters.get.response.characters.character.description.content" as const,
              },
              z.string() as z.ZodType<TranslationKey>,
            ),
            icon: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.characters.get.response.characters.character.icon.content" as const,
              },
              // Runtime: accepts any string (emoji, IconKey), Type: IconKey
              iconSchema,
            ),
            systemPrompt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.characters.get.response.characters.character.systemPrompt.content" as const,
              },
              z.string(),
            ),
            category: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.characters.get.response.characters.character.category.content" as const,
              },
              z.enum(CharacterCategoryDB),
            ),
            source: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.characters.get.response.characters.character.source.content" as const,
              },
              z.enum(CharacterSourceDB),
            ),
            voice: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.characters.get.response.characters.character.voice.content" as const,
              },
              z.enum(TtsVoiceDB),
            ),
            modelSelection: objectUnionField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.agent.chat.characters.get.response.characters.character.modelSelection.title" as const,
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
                          "app.api.agent.chat.characters.get.response.characters.character.selectionType.content" as const,
                      },
                      z.literal(ModelSelectionType.MANUAL),
                    ),
                    manualModelId: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.agent.chat.characters.get.response.characters.character.manualModelId.content" as const,
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
                          "app.api.agent.chat.characters.get.response.characters.character.selectionType.content" as const,
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
                            "app.api.agent.chat.characters.get.response.characters.character.preferredStrengths.content" as const,
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
                            "app.api.agent.chat.characters.get.response.characters.character.ignoredWeaknesses.content" as const,
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
                    "app.api.agent.chat.characters.get.response.characters.character.suggestedPrompts.content" as const,
                },
              ),
            ),
          },
        ),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.characters.get.errors.validation.title" as const,
      description: "app.api.agent.chat.characters.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.characters.get.errors.network.title" as const,
      description: "app.api.agent.chat.characters.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.characters.get.errors.unauthorized.title" as const,
      description: "app.api.agent.chat.characters.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.characters.get.errors.forbidden.title" as const,
      description: "app.api.agent.chat.characters.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.characters.get.errors.notFound.title" as const,
      description: "app.api.agent.chat.characters.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.characters.get.errors.server.title" as const,
      description: "app.api.agent.chat.characters.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.characters.get.errors.unknown.title" as const,
      description: "app.api.agent.chat.characters.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.characters.get.errors.unsavedChanges.title" as const,
      description: "app.api.agent.chat.characters.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.characters.get.errors.conflict.title" as const,
      description: "app.api.agent.chat.characters.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.characters.get.success.title" as const,
    description: "app.api.agent.chat.characters.get.success.description" as const,
  },

  examples: {
    requests: undefined,
    responses: {
      listAll: {
        characters: [
          {
            id: "default",
            name: "Default",
            description: "The models unmodified behavior",
            icon: "robot-face",
            systemPrompt: "",
            category: CharacterCategory.ASSISTANT,
            source: CharacterSource.BUILT_IN,
            voice: "app.api.agent.textToSpeech.voices.FEMALE",
            modelSelection: {
              selectionType: ModelSelectionType.FILTERS,
              preferredStrengths: null,
              ignoredWeaknesses: null,
            },
            suggestedPrompts: [
              "Help me brainstorm ideas for a new project",
              "Explain quantum computing in simple terms",
            ],
          },
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            name: "My Custom Character",
            description: "A custom character I created",
            icon: "direct-hit",
            systemPrompt: "You are a helpful assistant specialized in...",
            category: CharacterCategory.CODING,
            source: CharacterSource.MY,
            voice: "app.api.agent.textToSpeech.voices.MALE",
            modelSelection: {
              selectionType: ModelSelectionType.MANUAL,
              manualModelId: ModelId.GPT_5,
            },
            suggestedPrompts: ["Help me with coding", "Review my architecture"],
          },
        ],
      },
    },
    urlPathParams: undefined,
  },
});

// Type exports for GET endpoint
export type CharacterListRequestInput = typeof GET.types.RequestInput;
export type CharacterListRequestOutput = typeof GET.types.RequestOutput;
export type CharacterListResponseInput = typeof GET.types.ResponseInput;
export type CharacterListResponseOutput = typeof GET.types.ResponseOutput;

// Individual character type from list response
export type Character = CharacterListResponseOutput["characters"][number];

// Model selection discriminated union variants
export type FiltersSelection = Extract<
  Character["modelSelection"],
  { selectionType: "app.api.agent.chat.favorites.enums.selectionType.filters" }
>;
export type ManualSelection = Extract<
  Character["modelSelection"],
  { selectionType: "app.api.agent.chat.favorites.enums.selectionType.manual" }
>;

const definitions = { GET };
export { GET };
export default definitions;
