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
  customWidgetObject,
  scopedBackButton,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedRequestUrlPathParamsField,
  scopedResponseField,
  scopedSubmitButton,
  scopedWidgetField,
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

import { dateSchema, iconSchema } from "../../../../shared/types/common.schema";
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
import type { CharactersTranslationKey } from "../i18n";
import { scopedTranslation } from "./i18n";
import { CharacterEditContainer, CharacterViewContainer } from "./widgets";

/**
 * Delete Character Endpoint (DELETE)
 * Deletes a custom character by ID
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["agent", "chat", "characters", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "trash" as const,
  category: "category" as const,
  tags: ["tags.characters" as const],

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

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    paddingTop: "6",
    noCard: true,
    usage: { request: "urlPathParams", response: true },
    children: {
      title: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TITLE,
        level: 5,
        content: "delete.container.description" as const,
        usage: { request: "urlPathParams", response: true },
      }),
      // === URL PARAMETERS ===
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "delete.id.label" as const,
        description: "delete.id.description" as const,
        hidden: true,
        schema: z.string(),
      }),

      // Navigation - back to previous screen
      backButton: scopedBackButton(scopedTranslation, {
        label: "delete.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "urlPathParams", response: true },
      }),
      submitButton: scopedSubmitButton(scopedTranslation, {
        label: "delete.actions.delete" as const,
        loadingText: "delete.actions.deleting" as const,
        icon: "trash",
        variant: "destructive",
        usage: { request: "urlPathParams", response: true },
      }),

      // === RESPONSE ===
      // Note: id is already known from the URL param, not repeated
      name: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      tagline: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      icon: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: iconSchema,
      }),
      category: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.enum(CharacterCategory),
      }),
      ownershipType: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.enum(CharacterOwnershipType),
      }),
      systemPrompt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().nullable(),
      }),
      createdAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: dateSchema,
      }),
      updatedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: dateSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title" as const,
      description: "delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title" as const,
      description: "delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title" as const,
      description: "delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title" as const,
      description: "delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title" as const,
      description: "delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title" as const,
      description: "delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title" as const,
      description: "delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title" as const,
      description: "delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title" as const,
      description: "delete.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "delete.success.title" as const,
    description: "delete.success.description" as const,
  },

  examples: {
    urlPathParams: {
      delete: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
    responses: {
      delete: {
        name: "Code Reviewer",
        tagline: "Code Review Expert",
        icon: "👨‍💻",
        category: CharacterCategory.CODING,
        ownershipType: CharacterOwnershipType.USER,
        systemPrompt: "You are an expert code reviewer...",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  },
});

/**
 * Update Character Endpoint (PATCH)
 * Updates a custom character (only custom characters can be updated)
 */
const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["agent", "chat", "characters", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "patch.title" as const,
  description: "patch.container.description" as const,
  icon: "sparkles" as const,
  category: "category" as const,
  tags: ["tags.characters" as const],

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
                    const modelSel = data.requestData.modelSelection;
                    const bestModel = modelSel
                      ? CharactersRepositoryClient.getBestModelForCharacter(
                          modelSel,
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
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.id.label" as const,
        hidden: true,
        schema: z.string(),
      }),

      // === RESPONSE ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.ALERT,
        schema: z.string(),
      }),

      name: scopedRequestField(scopedTranslation, {
        schema: z
          .string()
          .min(2, {
            message: "patch.name.validation.minLength" as const,
          })
          .max(100, {
            message: "patch.name.validation.maxLength" as const,
          }) as z.ZodType<CharactersTranslationKey>,
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.name.label" as const,
        description: "patch.name.description" as const,
        placeholder: "patch.name.placeholder" as const,
        columns: 6,
        order: 0,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      tagline: scopedRequestField(scopedTranslation, {
        schema: z
          .string()
          .min(2, {
            message: "patch.tagline.validation.minLength" as const,
          })
          .max(500, {
            message: "patch.tagline.validation.maxLength" as const,
          }) as z.ZodType<CharactersTranslationKey>,
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.tagline.label" as const,
        description: "patch.tagline.description" as const,
        placeholder: "patch.tagline.placeholder" as const,
        columns: 6,
        order: 1,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      icon: scopedRequestField(scopedTranslation, {
        schema: iconSchema,
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ICON,
        label: "patch.icon.label" as const,
        description: "patch.icon.description" as const,
        columns: 6,
        order: 2,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      description: scopedRequestField(scopedTranslation, {
        schema: z
          .string()
          .min(10, {
            message: "patch.description.validation.minLength" as const,
          })
          .max(500, {
            message: "patch.description.validation.maxLength" as const,
          }) as z.ZodType<CharactersTranslationKey>,
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.description.label" as const,
        description: "patch.description.description" as const,
        placeholder: "patch.description.placeholder" as const,
        columns: 6,
        order: 3,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      category: scopedRequestField(scopedTranslation, {
        schema: z.enum(CharacterCategory),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.category.label" as const,
        description: "patch.category.description" as const,
        options: CategoryOptions,
        columns: 6,
        order: 4,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      isPublic: scopedRequestField(scopedTranslation, {
        schema: z.boolean(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.isPublic.label" as const,
        description: "patch.isPublic.description" as const,
        columns: 6,
        order: 5,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      voice: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.voice.label" as const,
        description: "patch.voice.description" as const,
        options: TtsVoiceOptions,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
        schema: z.enum(TtsVoiceDB).nullable().optional(),
      }),
      systemPrompt: scopedRequestField(scopedTranslation, {
        schema: z.string().nullable(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "patch.systemPrompt.label" as const,
        description: "patch.systemPrompt.description" as const,
        placeholder: "patch.systemPrompt.placeholder" as const,
        columns: 12,
        order: 7,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      modelSelection: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.modelSelection.label" as const,
        description: "patch.modelSelection.description" as const,
        schema: modelSelectionSchemaSimple.nullable(),
      }),

      // Auto-compacting token threshold (null = use global/settings default)
      compactTrigger: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "patch.compactTrigger.label" as const,
        description: "patch.compactTrigger.description" as const,
        columns: 6,
        schema: z.number().int().min(1000).max(200000).nullable().optional(),
      }),

      // Tool configuration — null = inherit from settings (default)
      allowedTools: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.allowedTools.label" as const,
        description: "patch.allowedTools.description" as const,
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
      pinnedTools: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.pinnedTools.label" as const,
        description: "patch.pinnedTools.description" as const,
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
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title" as const,
      description: "patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title" as const,
      description: "patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title" as const,
      description: "patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title" as const,
      description: "patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title" as const,
      description: "patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title" as const,
      description: "patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title" as const,
      description: "patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title" as const,
      description: "patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title" as const,
      description: "patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "patch.success.title" as const,
    description: "patch.success.description" as const,
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
        allowedTools: [
          { toolId: "execute-tool", requiresConfirmation: false },
          { toolId: "system_help_GET", requiresConfirmation: false },
        ],
        pinnedTools: [{ toolId: "execute-tool", requiresConfirmation: false }],
      },
    },
    responses: {
      update: {
        success: "patch.success.title",
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
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "characters", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PUBLIC] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "sparkles" as const,
  category: "category" as const,
  tags: ["tags.characters" as const],

  fields: customWidgetObject({
    render: CharacterViewContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      // === URL PARAMETERS ===
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.id.label" as const,
        hidden: true,
        schema: z.string(),
      }),

      // Separator (widget only)
      separator: scopedWidgetField(scopedTranslation, {
        type: WidgetType.SEPARATOR,
        spacingTop: SpacingSize.RELAXED,
        spacingBottom: SpacingSize.RELAXED,
        usage: { response: true } as const,
      }),

      icon: scopedResponseField(scopedTranslation, {
        type: WidgetType.ICON,
        iconSize: "xl",
        containerSize: "sm",
        schema: iconSchema.nullable(),
      }),
      name: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "xl",
        emphasis: "bold",
        schema: z.string().min(1).max(100).nullable(),
      }),
      tagline: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "sm",
        variant: "muted",
        schema: z.string().min(1).max(500).nullable(),
      }),
      description: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "base",
        schema: z.string().min(1).max(500).nullable(),
      }),
      category: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        variant: "default",
        schema: z.enum(CharacterCategory),
      }),
      isPublic: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
      voice: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        variant: "default",
        schema: z.enum(TtsVoiceDB),
      }),
      systemPrompt: scopedResponseField(scopedTranslation, {
        type: WidgetType.MARKDOWN,
        schema: z.string().nullable(),
      }),
      modelSelection: scopedResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.OBJECT,
        schema: modelSelectionSchemaSimple,
      }),
      characterOwnership: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(CharacterOwnershipType),
      }),

      // Auto-compacting token threshold (null = use global/settings default)
      compactTrigger: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nullable(),
      }),

      // Tool configuration — null = inherit from settings (default)
      allowedTools: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z
          .array(
            z.object({
              toolId: z.string(),
              requiresConfirmation: z.boolean().default(false),
            }),
          )
          .nullable(),
      }),
      pinnedTools: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z
          .array(
            z.object({
              toolId: z.string(),
              requiresConfirmation: z.boolean().default(false),
            }),
          )
          .nullable(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
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
        voice: TtsVoice.FEMALE,
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
        compactTrigger: null,
        allowedTools: null,
        pinnedTools: null,
      },
      getCustom: {
        icon: "👨‍💻",
        name: "Code Reviewer",
        tagline: "Code Review Expert",
        description: "Expert at reviewing code",
        category: CharacterCategory.CODING,
        isPublic: true,
        characterOwnership: CharacterOwnershipType.PUBLIC,
        voice: TtsVoice.MALE,
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
        compactTrigger: null,
        allowedTools: null,
        pinnedTools: null,
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
