/**
 * Single Favorite API Definition
 * Defines endpoints for getting, updating, and deleting a single favorite
 */

import { z } from "zod";

import { modelSelectionSchemaSimple } from "@/app/api/[locale]/agent/models/types";
import {
  TtsVoice,
  TtsVoiceDB,
  TtsVoiceOptions,
} from "@/app/api/[locale]/agent/text-to-speech/enum";
import {
  dateSchema,
  iconSchema,
} from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
  deleteButton,
  navigateButtonField,
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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import type {
  FiltersModelSelection,
  ManualModelSelection,
} from "../../characters/create/definition";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  PriceLevel,
  SpeedLevel,
} from "../../characters/enum";
import {
  FAVORITE_DELETE_ALIAS,
  FAVORITE_GET_ALIAS,
  FAVORITE_UPDATE_ALIAS,
} from "../constants";
import { scopedTranslation } from "./i18n";
import { FavoriteEditContainer } from "./widget";

/**
 * Delete Favorite Endpoint (DELETE)
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["agent", "chat", "favorites", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const, // Allow public users to use client route

  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "trash" as const,
  category: "app.endpointCategories.chatFavorites",
  tags: ["tags.favorites" as const],

  aliases: [FAVORITE_DELETE_ALIAS],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        // Import apiClient and favorites list GET endpoint
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const favoritesDefinition = await import("../definition");
        const charactersDefinition =
          await import("../../characters/definition");

        // Find the characterId from the deleted favorite
        let deletedCharacterId: string | null = null;

        // Get the favorite from the list before removing it
        apiClient.updateEndpointData(
          favoritesDefinition.default.GET,
          data.logger,
          (oldData) => {
            if (oldData?.success) {
              const deletedFavorite = oldData.data.favorites.find(
                (fav) => fav.id === data.pathParams.id,
              );
              if (deletedFavorite) {
                deletedCharacterId = deletedFavorite.characterId;
              }
            }
            return oldData;
          },
        );

        // Optimistically remove the deleted favorite from the list
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
                favorites: oldData.data.favorites.filter(
                  (fav) => fav.id !== data.pathParams.id,
                ),
              },
            };
          },
        );

        // Optimistically update characters list addedToFav if we found the characterId
        if (deletedCharacterId) {
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
                    characters: section.characters.map((char) =>
                      char.id === deletedCharacterId
                        ? { ...char, addedToFav: false }
                        : char,
                    ),
                  })),
                },
              };
            },
          );
        }
      },
    },
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    gap: "4",
    noCard: true,
    usage: { request: "urlPathParams", response: true },
    children: {
      title: widgetField(scopedTranslation, {
        type: WidgetType.TITLE,
        level: 5,
        content: "delete.container.description" as const,
        usage: { request: "urlPathParams" },
      }),

      // === REQUEST (URL Path Params) ===
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.id.label" as const,
        description: "delete.id.description" as const,
        hidden: true,
        schema: z.string().uuid(),
      }),

      // Button container for horizontal layout
      actions: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.INLINE,
        gap: "2",
        noCard: true,
        usage: { request: "urlPathParams" },
        children: {
          backButton: backButton(scopedTranslation, {
            label: "delete.backButton.label" as const,
            icon: "arrow-left",
            variant: "outline",
            usage: { request: "urlPathParams" },
          }),
          deleteButton: submitButton(scopedTranslation, {
            label: "delete.actions.delete" as const,
            loadingText: "delete.actions.deleting" as const,
            icon: "trash",
            variant: "destructive",
            className: "ml-auto",
            usage: { request: "urlPathParams" },
          }),
        },
      }),

      // === RESPONSE ===
      // Note: id is already known from the URL param, not repeated
      characterId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      voice: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.enum(TtsVoiceDB).nullable(),
      }),
      modelSelection: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: modelSelectionSchemaSimple.nullable(),
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
        characterId: "thea",
        voice: null,
        modelSelection: null,
        createdAt: "2024-01-15T10:00:00.000Z",
        updatedAt: "2024-01-15T10:00:00.000Z",
      },
    },
  },
});

/**
 * Update Favorite Endpoint (PATCH)
 */
const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["agent", "chat", "favorites", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const, // Allow public users to use client route

  title: "patch.title" as const,
  description: "patch.description" as const,
  icon: "edit" as const,
  category: "app.endpointCategories.chatFavorites",
  tags: ["tags.favorites" as const],

  aliases: [FAVORITE_UPDATE_ALIAS],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { logger, pathParams, requestData, user, locale } = data;

        // Import dependencies
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const favoritesDefinition = await import("../definition");
        const { ChatFavoritesRepositoryClient } =
          await import("../repository-client");

        // Check if this is the currently active favorite and update settings if needed
        const settingsDefinition = await import("../../settings/definition");
        const settingsData = apiClient.getEndpointData(
          settingsDefinition.default.GET,
          logger,
        );
        const isActiveFavorite =
          settingsData?.success &&
          settingsData.data.activeFavoriteId === pathParams.id;

        // If this is the active favorite, update settings with new model/voice
        if (isActiveFavorite && settingsData?.success) {
          let modelId = settingsData.data.selectedModel;
          if (requestData.modelSelection) {
            const { CharactersRepositoryClient } =
              await import("../../characters/repository-client");
            const bestModel =
              CharactersRepositoryClient.getBestModelForFavorite(
                requestData.modelSelection,
                undefined,
                user,
              );
            modelId = bestModel?.id || settingsData.data.selectedModel;
          }

          // Optimistically update settings cache with new model and voice
          apiClient.updateEndpointData(
            settingsDefinition.default.GET,
            logger,
            (prevData) => {
              if (!prevData?.success) {
                return prevData;
              }
              return {
                success: true,
                data: {
                  ...prevData.data,
                  selectedModel: modelId,
                  ttsVoice: requestData.voice ?? prevData.data.ttsVoice,
                },
              };
            },
          );

          // Persist the settings update to the database
          try {
            await apiClient.mutate(
              settingsDefinition.default.POST,
              logger,
              user,
              {
                selectedModel: modelId,
                ttsVoice: requestData.voice ?? settingsData.data.ttsVoice,
              },
              undefined,
              locale,
            );
          } catch (error) {
            logger.error("Failed to update settings for active favorite", {
              errorMessage:
                error instanceof Error ? error.message : String(error),
            });
            // Revert optimistic update on error
            await apiClient.refetchEndpoint(
              settingsDefinition.default.GET,
              logger,
            );
          }
        }

        // Optimistically update the favorite in the list with proper recomputation
        apiClient.updateEndpointData(
          favoritesDefinition.default.GET,
          logger,
          (oldData) => {
            if (!oldData?.success) {
              return oldData;
            }

            return {
              success: true,
              data: {
                favorites: oldData.data.favorites.map((fav) => {
                  if (fav.id !== pathParams.id) {
                    return fav;
                  }

                  // For PATCH, character display fields (name/tagline/description) are widget-only
                  // and not in the request. Keep them from the existing favorite card.
                  // Only update icon (from request) and modelSelection (from updatedConfig).
                  const characterIcon = requestData.icon ?? null;

                  // Keep name/tagline/description from the existing favorite card
                  const characterName = fav.name ?? null;
                  const characterTagline = fav.tagline ?? null;
                  const characterDescription = fav.description ?? null;

                  // Get characterModelSelection from GET endpoint cache
                  const getEndpointData = apiClient.getEndpointData(
                    definitions.GET,
                    logger,
                    {
                      urlPathParams: { id: pathParams.id },
                    },
                  );
                  const characterModelSelection = getEndpointData?.success
                    ? getEndpointData.data.characterModelSelection
                    : undefined;

                  // Recompute display fields with updated config
                  const updatedFavorite =
                    ChatFavoritesRepositoryClient.computeFavoriteDisplayFields(
                      {
                        id: pathParams.id,
                        characterId: fav.characterId,
                        customIcon: requestData.icon ?? null,
                        voice: requestData.voice ?? null,
                        modelSelection: requestData.modelSelection,
                        position: fav.position,
                      },
                      characterModelSelection,
                      characterIcon,
                      characterName,
                      characterTagline,
                      characterDescription,
                      null,
                      null,
                      locale,
                      user,
                    );

                  updatedFavorite.activeBadge = fav.activeBadge;
                  return updatedFavorite;
                }),
              },
            };
          },
        );

        // Also optimistically update the single favorite GET endpoint cache
        // This ensures that navigating back to edit shows the updated data
        const favoriteByIdDefinition = await import("./definition");
        apiClient.updateEndpointData(
          favoriteByIdDefinition.default.GET,
          logger,
          (prevData) => {
            if (!prevData?.success) {
              return prevData;
            }
            return {
              success: true,
              data: {
                ...prevData.data,
                characterIcon: requestData.icon ?? prevData.data.icon,
                characterName: prevData.data.name,
                characterTagline: prevData.data.tagline,
                characterDescription: prevData.data.description,
                voice: requestData.voice ?? null,
                modelSelection: requestData.modelSelection,
              },
            };
          },
          { urlPathParams: { id: pathParams.id } },
        );
      },
    },
  },

  fields: customWidgetObject({
    render: FavoriteEditContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.id.label" as const,
        hidden: true,
        schema: z.string().uuid(),
      }),

      // Delete button configuration
      deleteButton: deleteButton(scopedTranslation, {
        label: "patch.deleteButton.label" as const,
        targetEndpoint: DELETE,
        extractParams: (source) => ({
          urlPathParams: {
            id: (source.urlPathParams as { id: string }).id,
          },
        }),
        icon: "trash",
        variant: "destructive",
        className: "ml-auto",
        popNavigationOnSuccess: 2,
        usage: { request: "data", response: true } as const,
      }),

      // === RESPONSE ===
      success: responseField(scopedTranslation, {
        type: WidgetType.ALERT,
        schema: z.string(),
      }),

      // === REQUEST ===
      characterId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.characterId.label" as const,
        columns: 6,
        hidden: true,
        schema: z.string().optional(),
      }),

      icon: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ICON,
        label: "patch.icon.label" as const,
        description: "patch.icon.description" as const,
        schema: iconSchema.optional(),
        theme: {
          style: "none",
        } as const,
      }),

      voice: requestField(scopedTranslation, {
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

      modelSelection: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.modelSelection.label" as const,
        description: "patch.modelSelection.description" as const,
        schema: modelSelectionSchemaSimple.nullable(),
      }),

      // Auto-compacting token threshold (null = fall through to character/settings default)
      compactTrigger: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "patch.compactTrigger.label" as const,
        description: "patch.compactTrigger.description" as const,
        columns: 6,
        schema: z.number().int().min(1000).max(200000).nullable().optional(),
      }),

      // Tool configuration — null = fall through to character/settings default
      allowedTools: requestField(scopedTranslation, {
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
        characterId: "thea",
        icon: "sun" as const,
        voice: TtsVoice.FEMALE,
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange: {
            min: IntelligenceLevel.BRILLIANT,
            max: IntelligenceLevel.BRILLIANT,
          },
          priceRange: {
            min: PriceLevel.CHEAP,
            max: PriceLevel.PREMIUM,
          },
          contentRange: {
            min: ContentLevel.MAINSTREAM,
            max: ContentLevel.UNCENSORED,
          },
          speedRange: {
            min: SpeedLevel.FAST,
            max: SpeedLevel.THOROUGH,
          },
        },
        compactTrigger: null,
        allowedTools: [{ toolId: "execute-tool", requiresConfirmation: false }],
        pinnedTools: null,
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
 * Get Single Favorite Endpoint (GET)
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "favorites", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const, // Allow public users to use client route

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "star" as const,
  category: "app.endpointCategories.chatFavorites",
  tags: ["tags.favorites" as const],

  aliases: [FAVORITE_GET_ALIAS],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.id.label" as const,
        schema: z.string().uuid(),
        hidden: true,
      }),

      // Edit button configuration
      editButton: navigateButtonField(scopedTranslation, {
        targetEndpoint: PATCH,
        extractParams: (source) => ({
          urlPathParams: {
            id: (source.urlPathParams as { id: string }).id,
          },
        }),
        prefillFromGet: true,
        label: "get.editButton.label" as const,
        icon: "pencil",
        variant: "default",
        className: "ml-auto",
        usage: { response: true } as const,
      }),

      // Delete button configuration
      deleteButton: deleteButton(scopedTranslation, {
        targetEndpoint: DELETE,
        extractParams: (source) => ({
          urlPathParams: {
            id: (source.urlPathParams as { id: string }).id,
          },
        }),
        label: "get.deleteButton.label" as const,
        icon: "trash",
        variant: "destructive",
        popNavigationOnSuccess: 1,
        usage: { response: true } as const,
      }),

      // Separator
      separator: widgetField(scopedTranslation, {
        type: WidgetType.SEPARATOR,
        spacingTop: SpacingSize.RELAXED,
        spacingBottom: SpacingSize.RELAXED,
        usage: { response: true } as const,
      }),

      // === FLAT RESPONSE FIELDS ===
      characterId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
        hidden: true,
      }),

      icon: responseField(scopedTranslation, {
        type: WidgetType.ICON,
        containerSize: "lg",
        iconSize: "lg",
        borderRadius: "lg",
        schema: iconSchema,
      }),

      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "base",
        emphasis: "bold",
        schema: z.string(),
      }),

      tagline: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "sm",
        variant: "muted",
        schema: z.string(),
      }),

      description: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "xs",
        variant: "muted",
        schema: z.string(),
      }),

      voice: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        variant: "default",
        schema: z.enum(TtsVoiceDB).nullable(),
      }),

      modelSelection: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.OBJECT,
        schema: modelSelectionSchemaSimple.nullable(),
      }),

      characterModelSelection: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.OBJECT,
        schema: modelSelectionSchemaSimple.nullable().optional(),
      }),

      // Auto-compacting token threshold (null = fall through to character/settings default)
      compactTrigger: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nullable(),
      }),

      // Tool configuration — null = fall through to character/settings default
      allowedTools: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z
          .array(
            z.object({
              toolId: z.string(),
              requiresConfirmation: z.boolean().optional(),
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
              requiresConfirmation: z.boolean().optional(),
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
      default: {
        characterId: "thea",
        icon: "sun" as const,
        name: "fallbacks.unknownCharacter" as const,
        tagline: "fallbacks.noTagline" as const,
        description: "fallbacks.noDescription" as const,
        voice: null,
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          priceRange: {
            min: PriceLevel.CHEAP,
            max: PriceLevel.STANDARD,
          },
          intelligenceRange: {
            min: IntelligenceLevel.SMART,
            max: IntelligenceLevel.BRILLIANT,
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
        characterModelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          priceRange: {
            min: PriceLevel.CHEAP,
            max: PriceLevel.STANDARD,
          },
          intelligenceRange: {
            min: IntelligenceLevel.SMART,
            max: IntelligenceLevel.BRILLIANT,
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
        compactTrigger: null,
        allowedTools: null,
        pinnedTools: null,
      },
    },
    urlPathParams: {
      default: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

// Type exports
export type FavoriteGetRequestInput = typeof GET.types.RequestInput;
export type FavoriteGetRequestOutput = typeof GET.types.RequestOutput;
export type FavoriteGetUrlVariablesInput = typeof GET.types.UrlVariablesInput;
export type FavoriteGetUrlVariablesOutput = typeof GET.types.UrlVariablesOutput;
export type FavoriteGetResponseInput = typeof GET.types.ResponseInput;
export type FavoriteGetResponseOutput = typeof GET.types.ResponseOutput;

export type FavoriteUpdateRequestInput = typeof PATCH.types.RequestInput;
export type FavoriteUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type FavoriteUpdateUrlVariablesInput =
  typeof PATCH.types.UrlVariablesInput;
export type FavoriteUpdateUrlVariablesOutput =
  typeof PATCH.types.UrlVariablesOutput;
export type FavoriteUpdateResponseInput = typeof PATCH.types.ResponseInput;
export type FavoriteUpdateResponseOutput = typeof PATCH.types.ResponseOutput;

export type FavoriteDeleteRequestInput = typeof DELETE.types.RequestInput;
export type FavoriteDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type FavoriteDeleteUrlVariablesInput =
  typeof DELETE.types.UrlVariablesInput;
export type FavoriteDeleteUrlVariablesOutput =
  typeof DELETE.types.UrlVariablesOutput;
export type FavoriteDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type FavoriteDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

const definitions = { GET, PATCH, DELETE } as const;
export default definitions;

// TESTS
//
// tests only types - import types from create endpoint instead
// Get response tests
export type FavoriteGetModelSelection =
  FavoriteGetResponseOutput["modelSelection"];

export type FavoriteGetFiltersModelSelection = Extract<
  FavoriteGetModelSelection,
  { selectionType: typeof ModelSelectionType.FILTERS }
>;

export type FavoriteGetManualModelSelection = Extract<
  FavoriteGetModelSelection,
  { selectionType: typeof ModelSelectionType.MANUAL }
>;

export type FavoriteGetCharacterBasedModelSelection = Extract<
  FavoriteGetModelSelection,
  { selectionType: typeof ModelSelectionType.CHARACTER_BASED }
>;

// oxlint-disable-next-line no-unused-vars
const _test_get_1: FiltersModelSelection =
  {} as FavoriteGetFiltersModelSelection;
// oxlint-disable-next-line no-unused-vars
const _test_get_2: ManualModelSelection = {} as FavoriteGetManualModelSelection;
// oxlint-disable-next-line no-unused-vars
const _test_get_3: {
  selectionType: typeof ModelSelectionType.CHARACTER_BASED;
} = {} as FavoriteGetCharacterBasedModelSelection;

// PATCH request tests
type FavoriteModelSelection = FavoriteUpdateRequestOutput["modelSelection"];

type FavoriteFiltersModelSelection = Extract<
  FavoriteModelSelection,
  { selectionType: typeof ModelSelectionType.FILTERS }
>;

type FavoriteManualModelSelection = Extract<
  FavoriteModelSelection,
  { selectionType: typeof ModelSelectionType.MANUAL }
>;

type FavoriteCharacterBasedModelSelection = Extract<
  FavoriteModelSelection,
  { selectionType: typeof ModelSelectionType.CHARACTER_BASED }
>;

// oxlint-disable-next-line no-unused-vars
const _test1: FiltersModelSelection = {} as FavoriteFiltersModelSelection;
// oxlint-disable-next-line no-unused-vars
const _test2: ManualModelSelection = {} as FavoriteManualModelSelection;
// oxlint-disable-next-line no-unused-vars
const _test3: {
  selectionType: typeof ModelSelectionType.CHARACTER_BASED;
} = {} as FavoriteCharacterBasedModelSelection;
