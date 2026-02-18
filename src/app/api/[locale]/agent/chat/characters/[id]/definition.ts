/**
 * Single Character API Definition
 * Defines endpoints for GET, PATCH (update), and DELETE operations on a single character
 */

import { z } from "zod";

import { modelSelectionSchemaSimple } from "@/app/api/[locale]/agent/models/components/types";
import { ModelId } from "@/app/api/[locale]/agent/models/models";
import { success } from "@/app/api/[locale]/shared/types/response.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
  widgetField,
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

import { iconSchema } from "../../../../shared/types/common.schema";
import {
  TtsVoice,
  TtsVoiceDB,
  TtsVoiceOptions,
} from "../../../text-to-speech/enum";
import {
  CharacterOwnershipType,
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  PriceLevel,
  SpeedLevel,
} from "../../characters/enum";
import type {
  FiltersModelSelection,
  ManualModelSelection,
} from "../create/definition";
import type { CharacterListResponseOutput } from "../definition";
import { CategoryOptions } from "../enum";
import { CharacterCategory } from "../enum";
import { CharacterEditContainer, CharacterViewContainer } from "./widgets";

/**
 * Delete Character Endpoint (DELETE)
 * Deletes a custom character by ID
 */
const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["agent", "chat", "characters", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.characters.id.delete.title" as const,
  description: "app.api.agent.chat.characters.id.delete.description" as const,
  icon: "trash" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.characters" as const],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        // Import apiClient, navigation store, and characters list GET endpoint
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const charactersDefinition = await import("../definition");

        // Optimistically remove the deleted character from the list
        apiClient.updateEndpointData(
          charactersDefinition.default.GET,
          data.logger,
          (oldData) => {
            if (!oldData?.success) {
              return oldData;
            }

            return success<CharacterListResponseOutput>({
              sections: oldData.data.sections.map((section) => ({
                ...section,
                characters: section.characters.filter(
                  (char) => char.id !== data.pathParams.id,
                ),
              })),
            });
          },
          undefined,
        );

        // Note: popNavigationOnSuccess is now handled by EndpointsPage automatically
      },
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
      paddingTop: "6",
      noCard: true,
    },
    { request: "urlPathParams", response: true },
    {
      title: widgetField({
        type: WidgetType.TITLE,
        level: 5,
        content:
          "app.api.agent.chat.characters.id.delete.container.description" as const,
        usage: { request: "urlPathParams", response: true },
      }),
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "app.api.agent.chat.characters.id.delete.id.label" as const,
        description:
          "app.api.agent.chat.characters.id.delete.id.description" as const,
        hidden: true,
        schema: z.string(),
      }),

      // Navigation - back to previous screen
      backButton: backButton({
        label:
          "app.api.agent.chat.characters.id.delete.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "urlPathParams", response: true },
      }),
      submitButton: submitButton({
        label:
          "app.api.agent.chat.characters.id.delete.actions.delete" as const,
        loadingText:
          "app.api.agent.chat.characters.id.delete.actions.deleting" as const,
        icon: "trash",
        variant: "destructive",
        usage: { request: "urlPathParams", response: true },
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.characters.id.delete.errors.validation.title" as const,
      description:
        "app.api.agent.chat.characters.id.delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.characters.id.delete.errors.network.title" as const,
      description:
        "app.api.agent.chat.characters.id.delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.characters.id.delete.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.characters.id.delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.characters.id.delete.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.characters.id.delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.characters.id.delete.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.characters.id.delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.characters.id.delete.errors.server.title" as const,
      description:
        "app.api.agent.chat.characters.id.delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.characters.id.delete.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.characters.id.delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.characters.id.delete.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.characters.id.delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.characters.id.delete.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.characters.id.delete.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.characters.id.delete.success.title" as const,
    description:
      "app.api.agent.chat.characters.id.delete.success.description" as const,
  },

  examples: {
    responses: {
      delete: {},
    },
    urlPathParams: {
      delete: { id: "550e8400-e29b-41d4-a716-446655440000" },
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
  description:
    "app.api.agent.chat.characters.id.patch.container.description" as const,
  icon: "sparkles" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.characters" as const],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        // Import apiClient, characters list GET endpoint, and repository client
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const charactersDefinition = await import("../definition");
        const { CharactersRepositoryClient } =
          await import("../repository-client");

        const characterSingleDefinitions = await import("./definition");

        // Optimistically update the character GET endpoint cache
        apiClient.updateEndpointData(
          characterSingleDefinitions.default.GET,
          data.logger,
          (oldData) => {
            if (!oldData?.success) {
              return oldData;
            }

            // Update with new data from the request
            return {
              success: true,
              data: {
                ...oldData.data,
                icon: data.requestData.icon ?? oldData.data.icon,
                name: data.requestData.name ?? oldData.data.name,
                tagline: data.requestData.tagline ?? oldData.data.tagline,
                description:
                  data.requestData.description ?? oldData.data.description,
                category: data.requestData.category ?? oldData.data.category,
                isPublic: data.requestData.isPublic ?? oldData.data.isPublic,
                voice: data.requestData.voice ?? oldData.data.voice,
                systemPrompt:
                  data.requestData.systemPrompt ?? oldData.data.systemPrompt,
                modelSelection:
                  data.requestData.modelSelection ??
                  oldData.data.modelSelection,
              },
            };
          },
          { id: data.pathParams.id },
        );

        // Optimistically update the character in the list
        apiClient.updateEndpointData(
          charactersDefinition.default.GET,
          data.logger,
          (oldData) => {
            if (!oldData?.success) {
              return oldData;
            }

            return {
              success: true,
              data: {
                sections: oldData.data.sections.map((section) => ({
                  ...section,
                  characters: section.characters.map((char) => {
                    if (char.id !== data.pathParams.id) {
                      return char;
                    }

                    // Update the character with new data from the request
                    // Recalculate model info if modelSelection changed
                    const bestModel = data.requestData.modelSelection
                      ? CharactersRepositoryClient.getBestModelForCharacter(
                          data.requestData.modelSelection,
                        )
                      : null;

                    return {
                      ...char,
                      icon: data.requestData.icon ?? char.icon,
                      category: data.requestData.category ?? char.category,
                      modelId: bestModel?.id ?? char.modelId,
                      name: data.requestData.name ?? char.name,
                      tagline: data.requestData.tagline ?? char.tagline,
                      description:
                        data.requestData.description ?? char.description,
                      ...(bestModel
                        ? {
                            modelIcon: bestModel.icon,
                            modelInfo: bestModel.name,
                            modelProvider: bestModel.provider,
                          }
                        : {}),
                    };
                  }),
                })),
              },
            };
          },
          undefined,
        );
      },
    },
  },

  fields: customWidgetObject({
    render: CharacterEditContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.chat.characters.id.patch.id.label" as const,
        hidden: true,
        schema: z.string(),
      }),

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
              "app.api.agent.chat.characters.id.patch.name.validation.minLength" as const,
          })
          .max(100, {
            message:
              "app.api.agent.chat.characters.id.patch.name.validation.maxLength" as const,
          }),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.chat.characters.id.patch.name.label" as const,
        description:
          "app.api.agent.chat.characters.id.patch.name.description" as const,
        placeholder:
          "app.api.agent.chat.characters.id.patch.name.placeholder" as const,
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
              "app.api.agent.chat.characters.id.patch.tagline.validation.minLength" as const,
          })
          .max(500, {
            message:
              "app.api.agent.chat.characters.id.patch.tagline.validation.maxLength" as const,
          }),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.chat.characters.id.patch.tagline.label" as const,
        description:
          "app.api.agent.chat.characters.id.patch.tagline.description" as const,
        placeholder:
          "app.api.agent.chat.characters.id.patch.tagline.placeholder" as const,
        columns: 6,
        order: 1,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      icon: requestField({
        schema: iconSchema,
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ICON,
        label: "app.api.agent.chat.characters.id.patch.icon.label" as const,
        description:
          "app.api.agent.chat.characters.id.patch.icon.description" as const,
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
              "app.api.agent.chat.characters.id.patch.description.validation.minLength" as const,
          })
          .max(500, {
            message:
              "app.api.agent.chat.characters.id.patch.description.validation.maxLength" as const,
          }),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.characters.id.patch.description.label" as const,
        description:
          "app.api.agent.chat.characters.id.patch.description.description" as const,
        placeholder:
          "app.api.agent.chat.characters.id.patch.description.placeholder" as const,
        columns: 6,
        order: 3,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      category: requestField({
        schema: z.enum(CharacterCategory),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.agent.chat.characters.id.patch.category.label" as const,
        description:
          "app.api.agent.chat.characters.id.patch.category.description" as const,
        options: CategoryOptions,
        columns: 6,
        order: 4,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      isPublic: requestField({
        schema: z.boolean(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.agent.chat.characters.id.patch.isPublic.label" as const,
        description:
          "app.api.agent.chat.characters.id.patch.isPublic.description" as const,
        columns: 6,
        order: 5,
        theme: {
          descriptionStyle: "inline",
        } as const,
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
        schema: z.enum(TtsVoiceDB).nullable().optional(),
      }),
      systemPrompt: requestField({
        schema: z.string().nullable(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label:
          "app.api.agent.chat.characters.id.patch.systemPrompt.label" as const,
        description:
          "app.api.agent.chat.characters.id.patch.systemPrompt.description" as const,
        placeholder:
          "app.api.agent.chat.characters.id.patch.systemPrompt.placeholder" as const,
        columns: 12,
        order: 7,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      modelSelection: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.OBJECT,
        schema: modelSelectionSchemaSimple.nullable(),
      }),
    },
  }),

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
        icon: "technologist",
        systemPrompt: "Updated system prompt",
        category: CharacterCategory.CODING,
        tagline: "Updated tagline",
        isPublic: true,
        voice: TtsVoice.FEMALE,
        modelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ModelId.GPT_5,
        },
      },
    },
    responses: {
      update: {
        success: "app.api.agent.chat.characters.id.patch.success.title",
      },
    },
    urlPathParams: {
      update: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

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

  fields: customWidgetObject({
    render: CharacterViewContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.chat.characters.id.get.id.label" as const,
        hidden: true,
        schema: z.string(),
      }),

      // Separator (widget only)
      separator: widgetField({
        type: WidgetType.SEPARATOR,
        spacingTop: SpacingSize.RELAXED,
        spacingBottom: SpacingSize.RELAXED,
        usage: { response: true } as const,
      }),

      icon: responseField({
        type: WidgetType.ICON,
        iconSize: "xl",
        containerSize: "sm",
        schema: iconSchema.nullable(),
      }),
      name: responseField({
        type: WidgetType.TEXT,
        size: "xl",
        emphasis: "bold",
        schema: z.string().min(1).max(100).nullable(),
      }),
      tagline: responseField({
        type: WidgetType.TEXT,
        size: "sm",
        variant: "muted",
        schema: z.string().min(1).max(500).nullable(),
      }),
      description: responseField({
        type: WidgetType.TEXT,
        size: "base",
        schema: z.string().min(1).max(500).nullable(),
      }),
      category: responseField({
        type: WidgetType.BADGE,
        variant: "default",
        schema: z.enum(CharacterCategory),
      }),
      isPublic: responseField({
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
      voice: responseField({
        type: WidgetType.BADGE,
        variant: "default",
        schema: z.enum(TtsVoiceDB),
      }),
      systemPrompt: responseField({
        type: WidgetType.MARKDOWN,
        schema: z.string().nullable(),
      }),
      modelSelection: responseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.OBJECT,
        schema: modelSelectionSchemaSimple,
      }),
      characterOwnership: responseField({
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(CharacterOwnershipType),
      }),
    },
  }),

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
    responses: {
      getDefault: {
        icon: "🤖",
        name: "Default",
        tagline: "Pure AI, No Personality",
        description: "The models unmodified behavior",
        category: CharacterCategory.ASSISTANT,
        isPublic: false,
        characterOwnership: CharacterOwnershipType.SYSTEM,
        voice: "app.api.agent.textToSpeech.voices.FEMALE",
        systemPrompt: "",
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange: {
            min: IntelligenceLevel.QUICK,
            max: IntelligenceLevel.QUICK,
          },
          priceRange: {
            min: PriceLevel.CHEAP,
            max: PriceLevel.CHEAP,
          },
          contentRange: {
            min: ContentLevel.MAINSTREAM,
            max: ContentLevel.MAINSTREAM,
          },
          speedRange: {
            min: SpeedLevel.FAST,
            max: SpeedLevel.FAST,
          },
        },
      },
      getCustom: {
        icon: "👨‍💻",
        name: "Code Reviewer",
        tagline: "Code Review Expert",
        description: "Expert at reviewing code",
        category: CharacterCategory.CODING,
        isPublic: true,
        characterOwnership: CharacterOwnershipType.PUBLIC,
        voice: "app.api.agent.textToSpeech.voices.MALE",
        systemPrompt: "You are an expert code reviewer...",
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange: {
            min: IntelligenceLevel.QUICK,
            max: IntelligenceLevel.QUICK,
          },
          priceRange: {
            min: PriceLevel.CHEAP,
            max: PriceLevel.CHEAP,
          },
          contentRange: {
            min: ContentLevel.MAINSTREAM,
            max: ContentLevel.MAINSTREAM,
          },
          speedRange: {
            min: SpeedLevel.FAST,
            max: SpeedLevel.FAST,
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

// Type exports for DELETE endpoint
export type CharacterDeleteRequestInput = typeof DELETE.types.RequestInput;
export type CharacterDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type CharacterDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type CharacterDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

const definitions = { GET, PATCH, DELETE } as const;
export default definitions;

// tests only types - import types from create endpoint instead
// Get response tests
type CharacterGetModelSelection = CharacterGetResponseOutput["modelSelection"];
type CharacterGetFiltersModelSelection = Extract<
  CharacterGetModelSelection,
  { selectionType: typeof ModelSelectionType.FILTERS }
>;
type CharacterGetManualModelSelection = Extract<
  CharacterGetModelSelection,
  { selectionType: typeof ModelSelectionType.MANUAL }
>;
// oxlint-disable-next-line no-unused-vars
const _test_get_1: FiltersModelSelection =
  {} as CharacterGetFiltersModelSelection;
// oxlint-disable-next-line no-unused-vars
const _test_get_2: ManualModelSelection =
  {} as CharacterGetManualModelSelection;

// Patch request tests
type CharacterModelSelection = CharacterUpdateRequestOutput["modelSelection"];
type CharacterFiltersModelSelection = Extract<
  CharacterModelSelection,
  { selectionType: typeof ModelSelectionType.FILTERS }
>;
type CharacterManualModelSelection = Extract<
  CharacterModelSelection,
  { selectionType: typeof ModelSelectionType.MANUAL }
>;
// oxlint-disable-next-line no-unused-vars
const _test1: FiltersModelSelection = {} as CharacterFiltersModelSelection;
// oxlint-disable-next-line no-unused-vars
const _test2: ManualModelSelection = {} as CharacterManualModelSelection;
