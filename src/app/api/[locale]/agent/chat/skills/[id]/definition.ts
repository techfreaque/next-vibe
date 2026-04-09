/**
 * Single Skill API Definition
 * Defines endpoints for GET, PATCH (update), and DELETE operations on a single skill
 */

import { z } from "zod";

import { chatModelSelectionSchema } from "@/app/api/[locale]/agent/ai-stream/models";
import {
  audioVisionModelSelectionSchema,
  imageVisionModelSelectionSchema,
  videoVisionModelSelectionSchema,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import { skillVariantSchema } from "@/app/api/[locale]/agent/chat/skills/db";
import { imageGenModelSelectionSchema } from "@/app/api/[locale]/agent/image-generation/models";
import { getModelDisplayName } from "@/app/api/[locale]/agent/models/all-models";
import {
  CHAT_MODE_IDS,
  ChatModeOptions,
} from "@/app/api/[locale]/agent/models/enum";
import { musicGenModelSelectionSchema } from "@/app/api/[locale]/agent/music-generation/models";
import { sttModelSelectionSchema } from "@/app/api/[locale]/agent/speech-to-text/models";
import { voiceModelSelectionSchema } from "@/app/api/[locale]/agent/text-to-speech/models";
import { videoGenModelSelectionSchema } from "@/app/api/[locale]/agent/video-generation/models";
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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  SpacingSize,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  UserPermissionRole,
  UserRole,
} from "@/app/api/[locale]/user/user-roles/enum";

import { lazy } from "react";
import { dateSchema, iconSchema } from "../../../../shared/types/common.schema";
import { ChatModelId, getBestChatModel } from "../../../ai-stream/models";
import { TtsModelId } from "../../../text-to-speech/models";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  SkillOwnershipType,
} from "../../skills/enum";
import {
  SKILL_DELETE_ALIAS,
  SKILL_GET_ALIAS,
  SKILL_UPDATE_ALIAS,
} from "../constants";
import type {
  FiltersModelSelection,
  ManualModelSelection,
} from "../create/definition";
import type { SkillListResponseOutput } from "../definition";
import { CategoryOptions, SkillCategory } from "../enum";
import type { SkillsTranslationKey } from "../i18n";
import { scopedTranslation } from "./i18n";

const SkillEditContainer = lazy(() =>
  import("./widget").then((m) => ({ default: m.SkillEditContainer })),
);
const SkillViewContainer = lazy(() =>
  import("./widget").then((m) => ({ default: m.SkillViewContainer })),
);

/**
 * Delete Skill Endpoint (DELETE)
 * Deletes a custom skill by ID
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["agent", "chat", "skills", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  dynamicTitle: ({ response }) => {
    if (response?.name && typeof response.name === "string") {
      return {
        message: "delete.dynamicTitle" as const,
        messageParams: { name: response.name },
      };
    }
    return undefined;
  },
  icon: "trash" as const,
  category: "endpointCategories.chatSkills",
  tags: ["tags.skills" as const],

  aliases: [SKILL_DELETE_ALIAS],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        // Import apiClient, navigation store, and skills list GET endpoint
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const skillsDefinition = await import("../definition");

        // Optimistically remove the deleted skill from the list
        apiClient.updateEndpointData(
          skillsDefinition.default.GET,
          data.logger,
          (oldData) => {
            if (!oldData?.success) {
              return oldData;
            }

            return success<SkillListResponseOutput>({
              ...oldData.data,
              sections: oldData.data.sections.map((section) => ({
                ...section,
                skills: section.skills.filter(
                  (char) => char.id !== data.pathParams.id,
                ),
              })),
            });
          },
        );

        // Optimistically remove favorites referencing the deleted skill
        const favoritesDefinition = await import("../../favorites/definition");
        apiClient.updateEndpointData(
          favoritesDefinition.default.GET,
          data.logger,
          (oldData) => {
            if (!oldData?.success) {
              return oldData;
            }

            return {
              success: true,
              data: {
                ...oldData.data,
                favorites: oldData.data.favorites.filter(
                  (fav) => fav.skillId !== data.pathParams.id,
                ),
              },
            };
          },
        );

        // Note: popNavigationOnSuccess is now handled by EndpointsPage automatically
      },
    },
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    paddingTop: "6",
    noCard: true,
    usage: { request: "urlPathParams", response: true },
    children: {
      title: widgetField(scopedTranslation, {
        type: WidgetType.TITLE,
        level: 5,
        content: "delete.container.description" as const,
        usage: { request: "urlPathParams", response: true },
      }),
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "delete.id.label" as const,
        description: "delete.id.description" as const,
        hidden: true,
        schema: z.string(),
      }),

      // Navigation - back to previous screen
      backButton: backButton(scopedTranslation, {
        label: "delete.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "urlPathParams", response: true },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "delete.actions.delete" as const,
        loadingText: "delete.actions.deleting" as const,
        icon: "trash",
        variant: "destructive",
        usage: { request: "urlPathParams", response: true },
      }),

      // === RESPONSE ===
      // Note: id is already known from the URL param, not repeated
      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      tagline: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      icon: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: iconSchema,
      }),
      category: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.enum(SkillCategory),
      }),
      ownershipType: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(SkillOwnershipType),
      }),
      systemPrompt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().nullable(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: dateSchema,
      }),
      updatedAt: responseField(scopedTranslation, {
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
        category: SkillCategory.CODING,
        ownershipType: SkillOwnershipType.USER,
        systemPrompt: "You are an expert code reviewer...",
        createdAt: "2024-01-15T10:00:00.000Z",
        updatedAt: "2024-01-15T10:00:00.000Z",
      },
    },
  },
});

/**
 * Update Skill Endpoint (PATCH)
 * Updates a custom skill (only custom skills can be updated)
 */
const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["agent", "chat", "skills", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "patch.title" as const,
  description: "patch.container.description" as const,
  dynamicTitle: ({ request }) => {
    if (request?.name && typeof request.name === "string") {
      return {
        message: "patch.dynamicTitle" as const,
        messageParams: { name: request.name },
      };
    }
    return undefined;
  },
  icon: "sparkles" as const,
  category: "endpointCategories.chatSkills",
  tags: ["tags.skills" as const],

  aliases: [SKILL_UPDATE_ALIAS],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        // Import apiClient, skills list GET endpoint, and repository client
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const { getEnvAvailability } =
          await import("../../../env-availability-context");
        const skillsDefinition = await import("../definition");
        const skillSingleDefinitions = await import("./definition");

        // Optimistically update the skill GET endpoint cache
        apiClient.updateEndpointData(
          skillSingleDefinitions.default.GET,
          data.logger,
          (oldData) => {
            if (!oldData?.success) {
              return undefined;
            }

            // If modelSelection changed, update the default variant's modelSelection in variants[]
            const newVariants =
              data.requestData.modelSelection !== undefined
                ? oldData.data.variants.map((v) =>
                    v.isDefault
                      ? {
                          ...v,
                          modelSelection:
                            data.requestData.modelSelection ?? v.modelSelection,
                        }
                      : v,
                  )
                : oldData.data.variants;

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
                voiceModelSelection:
                  data.requestData.voiceModelSelection ??
                  oldData.data.voiceModelSelection,
                systemPrompt:
                  data.requestData.systemPrompt ?? oldData.data.systemPrompt,
                variants: newVariants,
              },
            };
          },
          { urlPathParams: { id: data.pathParams.id } },
        );

        // Optimistically update the skill in the list
        apiClient.updateEndpointData(
          skillsDefinition.default.GET,
          data.logger,
          (oldData) => {
            if (!oldData?.success) {
              return oldData;
            }

            return {
              success: true,
              data: {
                ...oldData.data,
                sections: oldData.data.sections.map((section) => ({
                  ...section,
                  skills: section.skills.map((char) => {
                    if (char.id !== data.pathParams.id) {
                      return char;
                    }

                    // Update the skill with new data from the request
                    // Recalculate model info if modelSelection changed
                    const modelSel = data.requestData.modelSelection;
                    const bestModel = modelSel
                      ? getBestChatModel(
                          modelSel,
                          data.user,
                          getEnvAvailability(),
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
                            modelInfo: getModelDisplayName(
                              bestModel,
                              !data.user.isPublic &&
                                data.user.roles.includes(
                                  UserPermissionRole.ADMIN,
                                ),
                            ),
                            modelProvider: bestModel.provider,
                          }
                        : {}),
                    };
                  }),
                })),
              },
            };
          },
        );

        // Optimistically update favorites list to reflect changed skill data
        const favoritesDefinition = await import("../../favorites/definition");
        apiClient.updateEndpointData(
          favoritesDefinition.default.GET,
          data.logger,
          (oldData) => {
            if (!oldData?.success) {
              return oldData;
            }

            return {
              success: true,
              data: {
                ...oldData.data,
                favorites: oldData.data.favorites.map((fav) => {
                  if (fav.skillId !== data.pathParams.id) {
                    return fav;
                  }
                  return {
                    ...fav,
                    icon: data.requestData.icon ?? fav.icon,
                    name: data.requestData.name ?? fav.name,
                    tagline: data.requestData.tagline ?? fav.tagline,
                    description:
                      data.requestData.description ?? fav.description,
                  };
                }),
              },
            };
          },
        );
      },
    },
  },

  fields: customWidgetObject({
    render: SkillEditContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.id.label" as const,
        hidden: true,
        schema: z.string(),
      }),

      // === RESPONSE ===
      success: responseField(scopedTranslation, {
        type: WidgetType.ALERT,
        schema: z.string(),
      }),

      name: requestField(scopedTranslation, {
        schema: z
          .string()
          .min(2, {
            message: "patch.name.validation.minLength" as const,
          })
          .max(100, {
            message: "patch.name.validation.maxLength" as const,
          }) as z.ZodType<SkillsTranslationKey>,
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
      tagline: requestField(scopedTranslation, {
        schema: z
          .string()
          .min(2, {
            message: "patch.tagline.validation.minLength" as const,
          })
          .max(500, {
            message: "patch.tagline.validation.maxLength" as const,
          }) as z.ZodType<SkillsTranslationKey>,
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
      icon: requestField(scopedTranslation, {
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
      description: requestField(scopedTranslation, {
        schema: z
          .string()
          .min(10, {
            message: "patch.description.validation.minLength" as const,
          })
          .max(500, {
            message: "patch.description.validation.maxLength" as const,
          }) as z.ZodType<SkillsTranslationKey>,
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
      category: requestField(scopedTranslation, {
        schema: z.enum(SkillCategory),
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
      isPublic: requestField(scopedTranslation, {
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
      voiceModelSelection: requestField(scopedTranslation, {
        schema: voiceModelSelectionSchema.nullable().optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.voice.label" as const,
        description: "patch.voice.description" as const,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
      }),
      sttModelSelection: requestField(scopedTranslation, {
        schema: sttModelSelectionSchema.nullable().optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.sttModel.label" as const,
        description: "patch.sttModel.description" as const,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
      }),
      imageVisionModelSelection: requestField(scopedTranslation, {
        schema: imageVisionModelSelectionSchema.nullable().optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.imageVisionModel.label" as const,
        description: "patch.imageVisionModel.description" as const,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
      }),
      videoVisionModelSelection: requestField(scopedTranslation, {
        schema: videoVisionModelSelectionSchema.nullable().optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.videoVisionModel.label" as const,
        description: "patch.videoVisionModel.description" as const,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
      }),
      audioVisionModelSelection: requestField(scopedTranslation, {
        schema: audioVisionModelSelectionSchema.nullable().optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.audioVisionModel.label" as const,
        description: "patch.audioVisionModel.description" as const,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
      }),
      imageGenModelSelection: requestField(scopedTranslation, {
        schema: imageGenModelSelectionSchema.nullable().optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.imageGenModel.label" as const,
        description: "patch.imageGenModel.description" as const,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
      }),
      musicGenModelSelection: requestField(scopedTranslation, {
        schema: musicGenModelSelectionSchema.nullable().optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.musicGenModel.label" as const,
        description: "patch.musicGenModel.description" as const,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
      }),
      videoGenModelSelection: requestField(scopedTranslation, {
        schema: videoGenModelSelectionSchema.nullable().optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.videoGenModel.label" as const,
        description: "patch.videoGenModel.description" as const,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
      }),
      defaultChatMode: requestField(scopedTranslation, {
        schema: z.enum(CHAT_MODE_IDS).nullable().optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        options: ChatModeOptions,
        label: "patch.defaultChatMode.label" as const,
        description: "patch.defaultChatMode.description" as const,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
      }),
      systemPrompt: requestField(scopedTranslation, {
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
      modelSelection: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.modelSelection.label" as const,
        description: "patch.modelSelection.description" as const,
        schema: chatModelSelectionSchema.nullable(),
      }),

      // Auto-compacting token threshold (null = use global/settings default)
      compactTrigger: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "patch.compactTrigger.label" as const,
        description: "patch.compactTrigger.description" as const,
        columns: 6,
        schema: z.number().int().min(1000).max(200000).nullable().optional(),
      }),

      // Tool configuration - null = inherit from settings (default)
      availableTools: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.availableTools.label" as const,
        description: "patch.availableTools.description" as const,
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
      pinnedTools: requestField(scopedTranslation, {
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

      // === BUTTONS ===
      backButton: backButton(scopedTranslation, {
        label: "patch.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data&urlPathParams" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "patch.submitButton.label" as const,
        loadingText: "patch.submitButton.loadingText" as const,
        icon: "save",
        variant: "primary",
        className: "ml-auto",
        usage: { request: "data&urlPathParams" },
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
        category: SkillCategory.CODING,
        tagline: "Updated tagline",
        isPublic: true,
        voiceModelSelection: null,
        sttModelSelection: undefined,
        imageVisionModelSelection: undefined,
        videoVisionModelSelection: undefined,
        audioVisionModelSelection: undefined,
        imageGenModelSelection: undefined,
        musicGenModelSelection: undefined,
        videoGenModelSelection: undefined,
        defaultChatMode: undefined,
        modelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ChatModelId.GPT_5,
        },
        availableTools: [
          { toolId: "execute-tool", requiresConfirmation: false },
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
 * Get Single Skill Endpoint (GET)
 * Retrieves a specific skill by ID (default or custom)
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "skills", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PUBLIC] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  dynamicTitle: ({ response }) => {
    if (response?.name && typeof response.name === "string") {
      return {
        message: "get.dynamicTitle" as const,
        messageParams: { name: response.name },
      };
    }
    return undefined;
  },
  icon: "sparkles" as const,
  category: "endpointCategories.chatSkills",
  tags: ["tags.skills" as const],

  aliases: [SKILL_GET_ALIAS],

  fields: customWidgetObject({
    render: SkillViewContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.id.label" as const,
        hidden: true,
        schema: z.string(),
      }),

      // Separator (widget only)
      separator: widgetField(scopedTranslation, {
        type: WidgetType.SEPARATOR,
        spacingTop: SpacingSize.RELAXED,
        spacingBottom: SpacingSize.RELAXED,
        usage: { response: true } as const,
      }),

      icon: responseField(scopedTranslation, {
        type: WidgetType.ICON,
        iconSize: "xl",
        containerSize: "sm",
        schema: iconSchema.nullable(),
      }),
      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "xl",
        emphasis: "bold",
        schema: z.string().min(1).max(100).nullable(),
      }),
      tagline: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "sm",
        variant: "muted",
        schema: z.string().min(1).max(500).nullable(),
      }),
      description: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "base",
        schema: z.string().min(1).max(500).nullable(),
      }),
      category: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        variant: "default",
        schema: z.enum(SkillCategory),
      }),
      isPublic: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
      voiceModelSelection: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: voiceModelSelectionSchema.nullable(),
      }),
      sttModelSelection: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: sttModelSelectionSchema.nullable(),
      }),
      imageVisionModelSelection: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: imageVisionModelSelectionSchema.nullable(),
      }),
      videoVisionModelSelection: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: videoVisionModelSelectionSchema.nullable(),
      }),
      audioVisionModelSelection: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: audioVisionModelSelectionSchema.nullable(),
      }),
      imageGenModelSelection: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: imageGenModelSelectionSchema.nullable(),
      }),
      musicGenModelSelection: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: musicGenModelSelectionSchema.nullable(),
      }),

      videoGenModelSelection: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: videoGenModelSelectionSchema.nullable(),
      }),
      defaultChatMode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(CHAT_MODE_IDS).nullable().optional(),
      }),
      systemPrompt: responseField(scopedTranslation, {
        type: WidgetType.MARKDOWN,
        schema: z.string().nullable(),
      }),
      skillOwnership: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(SkillOwnershipType),
      }),

      // Auto-compacting token threshold (null = use global/settings default)
      compactTrigger: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nullable(),
      }),

      // Tool configuration - null = inherit from settings (default)
      availableTools: responseField(scopedTranslation, {
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
      pinnedTools: responseField(scopedTranslation, {
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
      variants: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.array(skillVariantSchema),
      }),

      // === CREATOR ECONOMY FIELDS ===
      longContent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
      favoritesCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int(),
      }),
      creatorProfile: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z
          .object({
            userId: z.uuid(),
            publicName: z.string(),
            avatarUrl: z.string().nullable(),
            bio: z.string().nullable(),
            websiteUrl: z.string().nullable(),
            twitterUrl: z.string().nullable(),
            youtubeUrl: z.string().nullable(),
            instagramUrl: z.string().nullable(),
            tiktokUrl: z.string().nullable(),
            githubUrl: z.string().nullable(),
            discordUrl: z.string().nullable(),
            creatorAccentColor: z.string().nullable(),
            creatorHeaderImageUrl: z.string().nullable(),
            referralCode: z.string().nullable(),
          })
          .nullable(),
      }),

      // === BUTTONS ===
      backButton: backButton(scopedTranslation, {
        label: "get.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "urlPathParams" },
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
        category: SkillCategory.ASSISTANT,
        isPublic: false,
        skillOwnership: SkillOwnershipType.SYSTEM,
        voiceModelSelection: null,
        sttModelSelection: null,
        imageVisionModelSelection: null,
        videoVisionModelSelection: null,
        audioVisionModelSelection: null,
        imageGenModelSelection: null,
        musicGenModelSelection: null,
        videoGenModelSelection: null,
        systemPrompt: "",
        compactTrigger: null,
        availableTools: null,
        pinnedTools: null,
        longContent: null,
        favoritesCount: 0,
        creatorProfile: null,
        variants: [
          {
            id: "default",
            modelSelection: {
              selectionType: ModelSelectionType.FILTERS,
              intelligenceRange: {
                min: IntelligenceLevel.QUICK,
                max: IntelligenceLevel.QUICK,
              },
              contentRange: {
                min: ContentLevel.MAINSTREAM,
                max: ContentLevel.MAINSTREAM,
              },
            },
            isDefault: true,
          },
        ],
      },
      getCustom: {
        icon: "👨‍💻",
        name: "Code Reviewer",
        tagline: "Code Review Expert",
        description: "Expert at reviewing code",
        category: SkillCategory.CODING,
        isPublic: true,
        skillOwnership: SkillOwnershipType.PUBLIC,
        voiceModelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: TtsModelId.OPENAI_ONYX,
        },
        sttModelSelection: null,
        imageVisionModelSelection: null,
        videoVisionModelSelection: null,
        audioVisionModelSelection: null,
        imageGenModelSelection: null,
        musicGenModelSelection: null,
        videoGenModelSelection: null,
        systemPrompt: "You are an expert code reviewer...",
        compactTrigger: null,
        availableTools: null,
        pinnedTools: null,
        longContent: null,
        favoritesCount: 42,
        creatorProfile: null,
        variants: [
          {
            id: "default",
            modelSelection: {
              selectionType: ModelSelectionType.FILTERS,
              intelligenceRange: {
                min: IntelligenceLevel.QUICK,
                max: IntelligenceLevel.QUICK,
              },
              contentRange: {
                min: ContentLevel.MAINSTREAM,
                max: ContentLevel.MAINSTREAM,
              },
            },
            isDefault: true,
          },
        ],
      },
    },
    urlPathParams: {
      getDefault: { id: "default" },
      getCustom: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

// Type exports for GET endpoint
export type SkillGetRequestInput = typeof GET.types.RequestInput;
export type SkillGetRequestOutput = typeof GET.types.RequestOutput;
export type SkillGetResponseInput = typeof GET.types.ResponseInput;
export type SkillGetResponseOutput = typeof GET.types.ResponseOutput;

// Type exports for PATCH endpoint
export type SkillUpdateRequestInput = typeof PATCH.types.RequestInput;
export type SkillUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type SkillUpdateResponseInput = typeof PATCH.types.ResponseInput;
export type SkillUpdateResponseOutput = typeof PATCH.types.ResponseOutput;

// Type exports for DELETE endpoint
export type SkillDeleteRequestInput = typeof DELETE.types.RequestInput;
export type SkillDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type SkillDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type SkillDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

const definitions = { GET, PATCH, DELETE } as const;
export default definitions;

// Patch request tests
type SkillModelSelection = SkillUpdateRequestOutput["modelSelection"];
type SkillFiltersModelSelection = Extract<
  SkillModelSelection,
  { selectionType: typeof ModelSelectionType.FILTERS }
>;
type SkillManualModelSelection = Extract<
  SkillModelSelection,
  { selectionType: typeof ModelSelectionType.MANUAL }
>;
// oxlint-disable-next-line no-unused-vars
const _test1: FiltersModelSelection = {} as SkillFiltersModelSelection;
// oxlint-disable-next-line no-unused-vars
const _test2: ManualModelSelection = {} as SkillManualModelSelection;
