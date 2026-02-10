/**
 * Create Character API Definition
 * Defines endpoint for creating a new custom character
 */

import { z } from "zod";

import { modelSelectionSchemaSimple } from "@/app/api/[locale]/agent/models/components/types";
import {
  getCreditCostFromModel,
  ModelId,
} from "@/app/api/[locale]/agent/models/models";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { iconSchema } from "../../../../shared/types/common.schema";
import {
  DEFAULT_TTS_VOICE,
  TtsVoiceDB,
  TtsVoiceOptions,
} from "../../../text-to-speech/enum";
import {
  CATEGORY_CONFIG,
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  PriceLevel,
  SpeedLevel,
} from "../../characters/enum";
import { CategoryOptions } from "../enum";
import { CharacterCategory, CharacterCategoryDB } from "../enum";
import { CharactersRepositoryClient } from "../repository-client";
import { CharacterCreateContainer } from "./widget";

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

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const charactersDefinition = await import("../definition");

        // Optimistically add the new character to the list
        apiClient.updateEndpointData(
          charactersDefinition.default.GET,
          data.logger,
          (oldData) => {
            if (!oldData?.success) {
              return oldData;
            }

            type CharacterSection = (typeof oldData.data.sections)[number];
            type CharacterListItem = CharacterSection["characters"][number];

            // Find the section matching the character's category
            const targetSection = oldData.data.sections.find((section) => {
              // Get category from first character in section to match
              const firstChar = section.characters[0];
              return firstChar?.category === data.requestData.category;
            });

            // Get best model for the new character
            const bestModel = data.requestData.modelSelection
              ? CharactersRepositoryClient.getBestModelForCharacter(
                  data.requestData.modelSelection,
                )
              : null;

            // Create the new character card (only if we have a model)
            if (!bestModel) {
              return oldData;
            }

            const newCharacter: CharacterListItem = {
              id: data.responseData.id,
              icon: data.requestData.icon,
              category: data.requestData.category,
              modelId: bestModel.id,
              name: data.requestData.name,
              tagline: data.requestData.tagline,
              description: data.requestData.description,
              addedToFav: false,
              modelIcon: bestModel.icon,
              modelInfo: bestModel.name,
              modelProvider: bestModel.provider,
              creditCost: `${getCreditCostFromModel(bestModel)} credits`,
            };

            // Add to existing section or create new section for this category
            if (targetSection) {
              return {
                success: true,
                data: {
                  sections: oldData.data.sections.map(
                    (section): CharacterSection =>
                      section === targetSection
                        ? {
                            ...section,
                            characters: [newCharacter, ...section.characters],
                            sectionCount: section.characters.length + 1,
                          }
                        : section,
                  ),
                },
              };
            } else {
              // Create new section for this category
              const categoryConfig = CATEGORY_CONFIG[data.requestData.category];

              const newSection: CharacterSection = {
                sectionIcon: categoryConfig.icon,
                sectionTitle: categoryConfig.label,
                sectionCount: 1,
                characters: [newCharacter],
              };

              return {
                success: true,
                data: {
                  sections: [...oldData.data.sections, newSection],
                },
              };
            }
          },
          undefined,
        );
      },
    },
  },

  fields: customWidgetObject({
    render: CharacterCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === RESPONSE ===
      success: responseField({
        type: WidgetType.ALERT,
        schema: z.string(),
      }),

      name: requestField({
        schema: z
          .string()
          .min(2, {
            message:
              "app.api.agent.chat.characters.post.name.validation.minLength" as const,
          })
          .max(100, {
            message:
              "app.api.agent.chat.characters.post.name.validation.maxLength" as const,
          }),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.chat.characters.post.name.label" as const,
        description:
          "app.api.agent.chat.characters.post.name.description" as const,
        placeholder:
          "app.api.agent.chat.characters.post.name.placeholder" as const,
        columns: 6,
        order: 0,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      tagline: requestField({
        schema: z
          .string()
          .min(2, {
            message:
              "app.api.agent.chat.characters.post.tagline.validation.minLength" as const,
          })
          .max(500, {
            message:
              "app.api.agent.chat.characters.post.tagline.validation.maxLength" as const,
          }),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.chat.characters.post.tagline.label" as const,
        description:
          "app.api.agent.chat.characters.post.tagline.description" as const,
        placeholder:
          "app.api.agent.chat.characters.post.tagline.placeholder" as const,
        columns: 6,
        order: 1,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      icon: requestField({
        schema: iconSchema.default("sparkles"),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ICON,
        label: "app.api.agent.chat.characters.post.icon.label" as const,
        description:
          "app.api.agent.chat.characters.post.icon.description" as const,
        columns: 6,
        order: 2,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      description: requestField({
        schema: z
          .string()
          .min(10, {
            message:
              "app.api.agent.chat.characters.post.characterDescription.validation.minLength" as const,
          })
          .max(500, {
            message:
              "app.api.agent.chat.characters.post.characterDescription.validation.maxLength" as const,
          }),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.characters.post.characterDescription.label" as const,
        description:
          "app.api.agent.chat.characters.post.characterDescription.description" as const,
        placeholder:
          "app.api.agent.chat.characters.post.characterDescription.placeholder" as const,
        columns: 6,
        order: 3,
        theme: {
          descriptionStyle: "inline",
        },
      }),
      category: requestField({
        schema: z.enum(CharacterCategoryDB),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.agent.chat.characters.post.category.label" as const,
        description:
          "app.api.agent.chat.characters.post.category.description" as const,
        options: CategoryOptions,
        columns: 6,
        order: 4,
        theme: {
          descriptionStyle: "inline",
        },
      }),
      isPublic: requestField({
        schema: z.boolean(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.agent.chat.characters.post.isPublic.label" as const,
        description:
          "app.api.agent.chat.characters.post.isPublic.description" as const,
        columns: 6,
        order: 5,
        theme: {
          descriptionStyle: "inline",
        },
      }),
      voice: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.agent.chat.favorites.id.patch.voice.label" as const,
        description:
          "app.api.agent.chat.favorites.id.patch.voice.description" as const,
        options: TtsVoiceOptions,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
        schema: z.enum(TtsVoiceDB).default(DEFAULT_TTS_VOICE),
      }),
      systemPrompt: requestField({
        schema: z.string().nullable(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "app.api.agent.chat.characters.post.systemPrompt.label" as const,
        description:
          "app.api.agent.chat.characters.post.systemPrompt.description" as const,
        placeholder:
          "app.api.agent.chat.characters.post.systemPrompt.placeholder" as const,
        columns: 12,
        order: 7,
        theme: {
          descriptionStyle: "inline",
        },
      }),
      // Model Selection - manual or filter-based
      modelSelection: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.OBJECT,
        schema: modelSelectionSchemaSimple.default({
          selectionType: ModelSelectionType.FILTERS,
        }),
      }),

      // === RESPONSE ===
      id: responseField({
        schema: z.string(),
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.characters.post.response.id.content" as const,
        hidden: true,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.characters.post.errors.validation.title" as const,
      description:
        "app.api.agent.chat.characters.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.characters.post.errors.network.title" as const,
      description:
        "app.api.agent.chat.characters.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.characters.post.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.characters.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.characters.post.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.characters.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.characters.post.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.characters.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.characters.post.errors.server.title" as const,
      description:
        "app.api.agent.chat.characters.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.characters.post.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.characters.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.characters.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.characters.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.characters.post.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.characters.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.characters.post.success.title" as const,
    description:
      "app.api.agent.chat.characters.post.success.description" as const,
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
        isPublic: true,
        modelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ModelId.GPT_5,
        },
        voice: undefined,
      },
      createManual: {
        name: "Code Reviewer",
        description: "Expert at reviewing code and suggesting improvements",
        tagline: "Expert at reviewing code and suggesting improvements",
        icon: "technologist",
        systemPrompt:
          "You are an expert code reviewer. Analyze code for bugs, performance issues, and best practices.",
        category: CharacterCategory.CODING,
        isPublic: true,
        modelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ModelId.GPT_5,
        },
        voice: undefined,
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
        isPublic: true,
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange: {
            min: IntelligenceLevel.BRILLIANT,
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
        },
        voice: undefined,
      },
    },
    responses: {
      create: {
        success: "app.api.agent.chat.characters.post.success.title",
        id: "550e8400-e29b-41d4-a716-446655440000",
      },
      createManual: {
        success: "app.api.agent.chat.characters.post.success.title",
        id: "550e8400-e29b-41d4-a716-446655440001",
      },
      createFilters: {
        success: "app.api.agent.chat.characters.post.success.title",
        id: "550e8400-e29b-41d4-a716-446655440002",
      },
    },
  },
});

// Type exports
export type CharacterCreateRequestInput = typeof POST.types.RequestInput;
export type CharacterCreateRequestOutput = typeof POST.types.RequestOutput;
export type CharacterCreateResponseInput = typeof POST.types.ResponseInput;
export type CharacterCreateResponseOutput = typeof POST.types.ResponseOutput;

// Character field type aliases
export type CharacterModelSelection =
  CharacterCreateRequestOutput["modelSelection"];

// Type for filter-based model selection
export type FiltersModelSelection = Extract<
  CharacterModelSelection,
  { selectionType: typeof ModelSelectionType.FILTERS }
>;
export type ManualModelSelection = Extract<
  CharacterModelSelection,
  { selectionType: typeof ModelSelectionType.MANUAL }
>;

export function isFiltersSelection(
  sel: CharacterModelSelection,
): sel is FiltersModelSelection {
  return sel.selectionType === ModelSelectionType.FILTERS;
}

export function isManualSelection(
  sel: CharacterModelSelection,
): sel is ManualModelSelection {
  return sel.selectionType === ModelSelectionType.MANUAL;
}

const definitions = { POST } as const;
export default definitions;
