/**
 * Create Character API Definition
 * Defines endpoint for creating a new custom character
 */

import { z } from "zod";

import { ModelId } from "@/app/api/[locale]/agent/models/models";
import {
  modelSelectionSchemaSimple,
  type ModelSelectionSimple,
} from "@/app/api/[locale]/agent/models/types";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
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
import { CHARACTER_CREATE_ALIAS } from "../constants";
import { CategoryOptions } from "../enum";
import { CharacterCategory, CharacterCategoryDB } from "../enum";
import type { CharactersTranslationKey } from "../i18n";
import { scopedTranslation } from "../i18n";
import { CharactersRepositoryClient } from "../repository-client";
import { CharacterCreateContainer } from "./widget";

/**
 * Create Character Endpoint (POST)
 * Creates a new custom character
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "chat", "characters", "create"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  dynamicTitle: ({ request }) => {
    if (request?.name && typeof request.name === "string") {
      return {
        message: "post.dynamicTitle" as const,
        messageParams: { name: request.name },
      };
    }
    return undefined;
  },
  icon: "sparkle" as const,
  category: "app.endpointCategories.chatCharacters",
  tags: ["tags.characters" as const],

  aliases: [CHARACTER_CREATE_ALIAS],

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
                  data.user,
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
              name: data.requestData.name as CharactersTranslationKey,
              tagline: data.requestData.tagline as CharactersTranslationKey,
              description: data.requestData
                .description as CharactersTranslationKey,
              modelIcon: bestModel.icon,
              modelInfo: bestModel.name,
              modelProvider: bestModel.provider,
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
                sectionTitle: categoryConfig.category,
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
        );
      },
    },
  },

  fields: customWidgetObject({
    render: CharacterCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === RESPONSE ===
      success: responseField(scopedTranslation, {
        type: WidgetType.ALERT,
        schema: z.string(),
      }),

      name: requestField(scopedTranslation, {
        schema: z
          .string()
          .min(2, {
            message: "post.name.validation.minLength" as const,
          })
          .max(100, {
            message: "post.name.validation.maxLength" as const,
          }),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.name.label" as const,
        description: "post.name.description" as const,
        placeholder: "post.name.placeholder" as const,
        columns: 6,
        order: 0,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      tagline: requestField(scopedTranslation, {
        schema: z
          .string()
          .min(2, {
            message: "post.tagline.validation.minLength" as const,
          })
          .max(500, {
            message: "post.tagline.validation.maxLength" as const,
          }),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.tagline.label" as const,
        description: "post.tagline.description" as const,
        placeholder: "post.tagline.placeholder" as const,
        columns: 6,
        order: 1,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      icon: requestField(scopedTranslation, {
        schema: iconSchema.default("sparkles"),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ICON,
        label: "post.icon.label" as const,
        description: "post.icon.description" as const,
        columns: 6,
        order: 2,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      description: requestField(scopedTranslation, {
        schema: z
          .string()
          .min(10, {
            message: "post.characterDescription.validation.minLength" as const,
          })
          .max(500, {
            message: "post.characterDescription.validation.maxLength" as const,
          }),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.characterDescription.label" as const,
        description: "post.characterDescription.description" as const,
        placeholder: "post.characterDescription.placeholder" as const,
        columns: 6,
        order: 3,
        theme: {
          descriptionStyle: "inline",
        },
      }),
      category: requestField(scopedTranslation, {
        schema: z.enum(CharacterCategoryDB),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.category.label" as const,
        description: "post.category.description" as const,
        options: CategoryOptions,
        columns: 6,
        order: 4,
        theme: {
          descriptionStyle: "inline",
        },
      }),
      isPublic: requestField(scopedTranslation, {
        schema: z.boolean(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.isPublic.label" as const,
        description: "post.isPublic.description" as const,
        columns: 6,
        order: 5,
        theme: {
          descriptionStyle: "inline",
        },
      }),
      voice: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.voice.label" as const,
        description: "post.voice.description" as const,
        options: TtsVoiceOptions,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
        schema: z.enum(TtsVoiceDB).default(DEFAULT_TTS_VOICE),
      }),
      systemPrompt: requestField(scopedTranslation, {
        schema: z.string().nullable(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.systemPrompt.label" as const,
        description: "post.systemPrompt.description" as const,
        placeholder: "post.systemPrompt.placeholder" as const,
        columns: 12,
        order: 7,
        theme: {
          descriptionStyle: "inline",
        },
      }),
      // Model Selection - manual or filter-based (custom widget handles rendering)
      modelSelection: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.modelSelection.label" as const,
        description: "post.modelSelection.description" as const,
        schema: modelSelectionSchemaSimple.nullable(),
      }),

      // Tool configuration — which tools this character can use (null = use global settings default)
      allowedTools: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.allowedTools.label" as const,
        description: "post.allowedTools.description" as const,
        schema: z
          .array(
            z.object({
              toolId: z.string(),
              requiresConfirmation: z.boolean().default(false),
            }),
          )
          .nullable()
          .optional(),
      }),

      // Pinned tools — tools that are always shown in the toolbar for this character
      pinnedTools: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.pinnedTools.label" as const,
        description: "post.pinnedTools.description" as const,
        schema: z
          .array(
            z.object({
              toolId: z.string(),
              requiresConfirmation: z.boolean().default(false),
            }),
          )
          .nullable()
          .optional(),
      }),

      // Auto-compacting token threshold (null = use global/settings default)
      compactTrigger: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.compactTrigger.label" as const,
        description: "post.compactTrigger.description" as const,
        columns: 6,
        schema: z.number().int().min(1000).max(200000).nullable().optional(),
      }),

      // === RESPONSE ===
      id: responseField(scopedTranslation, {
        schema: z.string(),
        type: WidgetType.TEXT,
        content: "post.response.id.content" as const,
        hidden: true,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
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
        allowedTools: [{ toolId: "execute-tool", requiresConfirmation: false }],
        pinnedTools: null,
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
        allowedTools: [{ toolId: "execute-tool", requiresConfirmation: false }],
        pinnedTools: null,
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
        allowedTools: null,
        pinnedTools: null,
      },
    },
    responses: {
      create: {
        success: "post.success.title",
        id: "550e8400-e29b-41d4-a716-446655440000",
      },
      createManual: {
        success: "post.success.title",
        id: "550e8400-e29b-41d4-a716-446655440001",
      },
      createFilters: {
        success: "post.success.title",
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

// Character field type aliases — anchored to ModelSelectionSimple for type identity
export type CharacterModelSelection = ModelSelectionSimple;

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
  return sel !== null && sel.selectionType === ModelSelectionType.FILTERS;
}

export function isManualSelection(
  sel: CharacterModelSelection,
): sel is ManualModelSelection {
  return sel !== null && sel.selectionType === ModelSelectionType.MANUAL;
}

const definitions = { POST } as const;
export default definitions;
