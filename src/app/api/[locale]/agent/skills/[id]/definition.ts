/**
 * Single Skill API Definition
 * Defines endpoints for GET, PATCH (update), and DELETE operations on a single skill
 */

import {
  dateSchema,
  iconSchema,
  translatedValueSchema,
} from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  SpacingSize,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { success } from "next-vibe/core/route/response.schema";
import { UserPermissionRole, UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  backButton,
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
  widgetField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { parseSkillId } from "@/app/api/[locale]/agent/chat/slugify";
import { getModelDisplayName } from "@/app/api/[locale]/agent/models/all-models";
import { skillVariantsSchema } from "@/app/api/[locale]/agent/skills/db";

import { getBestChatModel } from "../../ai-stream/models";
import {
  SKILL_DELETE_ALIAS,
  SKILL_GET_ALIAS,
  SKILL_UPDATE_ALIAS,
} from "../constants";
import type { SkillListResponseOutput } from "../definition";
import {
  CategoryOptions,
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  SkillCategory,
  SkillOwnershipType,
  SkillVoteDirection,
  SkillVoteDirectionDB,
} from "../enum";
import { scopedTranslation } from "./i18n";

const SkillEditContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SkillEditContainer })),
);
const SkillViewContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SkillViewContainer })),
);

/**
 * Delete Skill Endpoint (DELETE)
 * Deletes a custom skill by ID
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["agent", "skills", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "delete.title" as const,
  titleShort: "delete.titleShort" as const,
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
  category: "ai",
  subCategory: "skillsManagement",
  tags: ["tags.skills" as const],

  aliases: [SKILL_DELETE_ALIAS],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        // Import apiClient, navigation store, and skills list GET endpoint
        const { apiClient } =
          await import("next-vibe/platforms/react/hooks/store");
        const skillsDefinition = await import("../definition");
        const removedSkillIds = [data.pathParams.id];

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
                skills: section.skills.filter((char) => {
                  const baseId = parseSkillId(char.skillId).skillId;
                  const isMatch = baseId === data.pathParams.id;

                  if (isMatch && !removedSkillIds.includes(char.skillId)) {
                    removedSkillIds.push(char.skillId);
                  }

                  return !isMatch;
                }),
              })),
            });
          },
        );

        // Optimistically remove favorites referencing the deleted skill
        const favoritesDefinition = await import("../favorites/definition");
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
                  (fav) => !removedSkillIds.includes(fav.skillId),
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
        label: "delete.container.description" as const,
        usage: { request: "urlPathParams", response: true },
      }),
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
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

  // This op owns its `skill-deleted` event. A delete has no request body, so this
  // is a side-effect event; the skill id rides on `urlPathParams.id`. The client
  // onEvent removes the skill from the list cache; remoteEvent relays the delete
  // cross-instance, where the route's onRemoteEvent removes it by id.
  // Owner sees deletes on their own user channel; a PUBLIC skill's delete rides
  // the shared resource channel. Decided per-skill by the route's resolveChannel.
  channel: { scope: "resolved" } as const,
  events: {
    "skill-deleted": {
      remoteEvent: true as const,
      syncDomain: "skills" as const,
      allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
      urlPathParamsFields: ["id"] as const,
      onEvent: async ({ urlPathParams, logger }) => {
        const deletedId = urlPathParams.id;
        const { apiClient } =
          await import("next-vibe/platforms/react/hooks/store");
        apiClient.updateEndpointData(
          (await import("../definition")).default.GET,
          logger,
          (old) => {
            if (!old?.success) {
              return old;
            }
            return {
              ...old,
              data: {
                ...old.data,
                sections: old.data.sections
                  .map((section) => ({
                    ...section,
                    sectionCount: section.skills.some(
                      (s) => s.skillId === deletedId,
                    )
                      ? section.sectionCount - 1
                      : section.sectionCount,
                    skills: section.skills.filter(
                      (s) => s.skillId !== deletedId,
                    ),
                  }))
                  .filter((section) => section.skills.length > 0),
              },
            };
          },
        );
      },
    },
  },

  examples: {
    urlPathParams: {
      delete: { id: "code-reviewer" },
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
  path: ["agent", "skills", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "patch.title" as const,
  titleShort: "patch.titleShort" as const,
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
  category: "ai",
  subCategory: "skillsManagement",
  tags: ["tags.skills" as const],

  aliases: [SKILL_UPDATE_ALIAS],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        // Import apiClient, skills list GET endpoint, and repository client
        const { apiClient } =
          await import("next-vibe/platforms/react/hooks/store");
        const skillsDefinition = await import("../definition");
        const skillSingleDefinitions = await import("./definition");
        const updatedSkillIds = [data.pathParams.id];

        // Optimistically update the skill GET endpoint cache
        apiClient.updateEndpointData(
          skillSingleDefinitions.default.GET,
          data.logger,
          (oldData) => {
            if (!oldData?.success) {
              return undefined;
            }

            // Update variants if provided
            const newVariants =
              data.requestData.variants && data.requestData.variants.length > 0
                ? data.requestData.variants
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
                systemPrompt:
                  data.requestData.systemPrompt ?? oldData.data.systemPrompt,
                variants: newVariants,
              },
            };
          },
          { urlPathParams: { id: data.pathParams.id } },
        );

        // Optimistically update the skill in the list
        const { availability } = data;
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
                    const baseId = parseSkillId(char.skillId).skillId;
                    const isMatch = baseId === data.pathParams.id;

                    if (!isMatch) {
                      return char;
                    }

                    if (!updatedSkillIds.includes(char.skillId)) {
                      updatedSkillIds.push(char.skillId);
                    }

                    // Update the skill with new data from the request
                    // Recalculate model info from default variant if variants changed
                    const defaultVariant = data.requestData.variants?.find(
                      (v) => v.isDefault,
                    );
                    const bestModel = defaultVariant?.modelSelection
                      ? getBestChatModel(
                          defaultVariant.modelSelection,
                          data.user,
                          availability,
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
                              availability,
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
        const favoritesDefinition = await import("../favorites/definition");
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
                  if (!updatedSkillIds.includes(fav.skillId)) {
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
        schema: translatedValueSchema,
      }),

      name: requestField(scopedTranslation, {
        schema: z
          .string()
          .min(2, {
            message: "patch.name.validation.minLength" as const,
          })
          .max(100, {
            message: "patch.name.validation.maxLength" as const,
          }),
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
          }),
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
          }),
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

      // Named variants with per-variant model selections
      variants: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.variants.label" as const,
        description: "patch.variants.description" as const,
        hidden: true,
        schema: skillVariantsSchema.optional(),
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

  // Owner sees updates on their own user channel; a PUBLIC skill's updates ride
  // the shared resource channel. Decided per-skill by the route's resolveChannel.
  channel: { scope: "resolved" } as const,

  // === WS EVENTS ===
  // Emitted by SkillsRepository after skill mutations - keeps skill detail view in sync.
  // Uses fields + merge so the framework applies the payload directly into the cache.
  events: {
    "skill-updated": {
      // remoteEvent: relayed cross-instance (gated by syncScope["skills"]), where
      // the route's onRemoteEvent re-runs the update. `requestFields` carry the edit
      // the user submitted; the onEvent rebuilds the skills LIST card from them and
      // patches it. The skill id rides on the event's urlPathParams.
      remoteEvent: true as const,
      syncDomain: "skills" as const,
      operation: "merge" as const,
      allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
      // `requestFields` — the edit the user submitted. The PATCH response is just
      // {success}; the display fields live on the request input.
      requestFields: [
        "name",
        "icon",
        "tagline",
        "description",
        "category",
      ] as const,
      urlPathParamsFields: ["id"] as const,
      onEvent: async ({
        requestData,
        urlPathParams,
        logger,
        locale,
        user,
        agentEnvAvailability,
      }) => {
        const skillId = urlPathParams.id;

        const category = requestData.category;
        const [
          { apiClient },
          { SkillsRepositoryClient },
          { scopedTranslation: skillsScopedTranslation },
        ] = await Promise.all([
          import("next-vibe/platforms/react/hooks/store"),
          import("../repository-client"),
          import("../i18n"),
        ]);
        const { t } = skillsScopedTranslation.scopedT(locale);
        // modelSelection lives on the skill's variants, which aren't in this event
        // payload; the optimistic card shows the default model and the list refetch
        // fills the precise model. name/icon/category/tagline update instantly.
        const card = SkillsRepositoryClient.mapSkillToListItem(
          skillId,
          {
            icon: requestData.icon ?? null,
            name: requestData.name ?? null,
            tagline: requestData.tagline ?? null,
            description: requestData.description ?? null,
            category,
            modelSelection: null,
            ownershipType: SkillOwnershipType.USER,
            voteCount: null,
            trustLevel: null,
          },
          t,
          user,
          agentEnvAvailability,
        );
        apiClient.updateEndpointData(
          (await import("../definition")).default.GET,
          logger,
          (old) => {
            if (!old?.success) {
              return old;
            }
            return {
              ...old,
              data: {
                ...old.data,
                sections: old.data.sections.map((section) => ({
                  ...section,
                  skills: section.skills.map((sk) =>
                    sk.skillId === card.skillId
                      ? { ...card, voteCount: sk.voteCount }
                      : sk,
                  ),
                })),
              },
            };
          },
        );
      },
    },
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
      update: { id: "code-reviewer" },
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
  path: ["agent", "skills", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PUBLIC] as const,

  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
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
  category: "ai",
  subCategory: "skillsManagement",
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
      internalId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
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
      systemPrompt: responseField(scopedTranslation, {
        type: WidgetType.MARKDOWN,
        schema: z.string().nullable(),
      }),
      skillOwnership: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(SkillOwnershipType),
      }),

      // Community vote metrics (null for non-community skills). voteCount is the
      // net score (up - down); userVote is the caller's own vote, if any.
      voteCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nullable(),
      }),
      userVote: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(SkillVoteDirectionDB).nullable(),
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
        schema: skillVariantsSchema,
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
            userId: z.string(),
            creatorSlug: z.string(),
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
            leadMagnetActive: z.boolean(),
            leadMagnetHeadline: z.string().nullable(),
            leadMagnetButtonText: z.string().nullable(),
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
        internalId: null,
        name: "Default",
        tagline: "Pure AI, No Personality",
        description: "The models unmodified behavior",
        category: SkillCategory.ASSISTANT,
        isPublic: false,
        skillOwnership: SkillOwnershipType.SYSTEM,

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
        voteCount: null,
        userVote: null,
      },
      getCustom: {
        icon: "👨‍💻",
        internalId: null,
        name: "Code Reviewer",
        tagline: "Code Review Expert",
        description: "Expert at reviewing code",
        category: SkillCategory.CODING,
        isPublic: true,
        skillOwnership: SkillOwnershipType.PUBLIC,

        systemPrompt: "You are an expert code reviewer...",
        compactTrigger: null,
        availableTools: null,
        pinnedTools: null,
        longContent: null,
        favoritesCount: 42,
        creatorProfile: null,
        voteCount: 12,
        userVote: SkillVoteDirection.UP,
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
      getCustom: { id: "code-reviewer" },
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

/** Inferred payload of the `skill-updated` event (request fields submitted by the user). */
export type SkillUpdatedEventPayload =
  (typeof PATCH.types.EventRequestPayloads)["skill-updated"];

const definitions = { GET, PATCH, DELETE } as const;
export default definitions;
