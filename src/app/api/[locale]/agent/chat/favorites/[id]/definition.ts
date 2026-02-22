/**
 * Single Favorite API Definition
 * Defines endpoints for getting, updating, and deleting a single favorite
 */

import { z } from "zod";

import { modelSelectionSchemaSimple } from "@/app/api/[locale]/agent/models/components/types";
import {
  TtsVoiceDB,
  TtsVoiceOptions,
} from "@/app/api/[locale]/agent/text-to-speech/enum";
import { iconSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  deleteButton,
  navigateButtonField,
  objectField,
  objectFieldNew,
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
  widgetField,
  widgetObjectField,
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
import { FavoriteEditContainer } from "./widgets";

/**
 * Delete Favorite Endpoint (DELETE)
 */
const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["agent", "chat", "favorites", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const, // Allow public users to use client route

  title: "app.api.agent.chat.favorites.id.delete.title" as const,
  description: "app.api.agent.chat.favorites.id.delete.description" as const,
  icon: "trash" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.favorites" as const],

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
          undefined,
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
          undefined,
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
            undefined,
          );
        }
      },
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
      gap: "4",
      noCard: true,
    },
    { request: "urlPathParams" },
    {
      title: widgetField({
        type: WidgetType.TITLE,
        level: 5,
        content:
          "app.api.agent.chat.favorites.id.delete.container.description" as const,
        usage: { request: "urlPathParams" },
      }),

      // === REQUEST (URL Path Params) ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.chat.favorites.id.delete.id.label" as const,
        description:
          "app.api.agent.chat.favorites.id.delete.id.description" as const,
        hidden: true,
        schema: z.string().uuid(),
      }),

      // Button container for horizontal layout
      actions: widgetObjectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "2",
          noCard: true,
        },
        { request: "urlPathParams" },
        {
          backButton: backButton({
            label:
              "app.api.agent.chat.favorites.id.delete.backButton.label" as const,
            icon: "arrow-left",
            variant: "outline",
            usage: { request: "urlPathParams" },
          }),
          deleteButton: submitButton({
            label:
              "app.api.agent.chat.favorites.id.delete.actions.delete" as const,
            loadingText:
              "app.api.agent.chat.favorites.id.delete.actions.deleting" as const,
            icon: "trash",
            variant: "destructive",
            className: "ml-auto",
            usage: { request: "urlPathParams" },
          }),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.validation.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.network.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.server.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.favorites.id.delete.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.favorites.id.delete.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.favorites.id.delete.success.title" as const,
    description:
      "app.api.agent.chat.favorites.id.delete.success.description" as const,
  },

  examples: {
    urlPathParams: {
      delete: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

/**
 * Update Favorite Endpoint (PATCH)
 */
const { PATCH } = createEndpoint({
  method: Methods.PATCH,
  path: ["agent", "chat", "favorites", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const, // Allow public users to use client route

  title: "app.api.agent.chat.favorites.id.patch.title" as const,
  description: "app.api.agent.chat.favorites.id.patch.description" as const,
  icon: "edit" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.favorites" as const],

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
          undefined,
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
            undefined,
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

                  // Extract character info from existing favorite
                  const characterName = requestData.name ?? null;
                  const characterTagline = requestData.tagline ?? null;
                  const characterDescription = requestData.description ?? null;

                  // Get characterModelSelection from GET endpoint cache
                  const getEndpointData = apiClient.getEndpointData(
                    definitions.GET,
                    logger,
                    { id: pathParams.id },
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
                    );

                  updatedFavorite.activeBadge = fav.activeBadge;
                  return updatedFavorite;
                }),
              },
            };
          },
          undefined,
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
                characterName: requestData.name ?? prevData.data.name,
                characterTagline: requestData.tagline ?? prevData.data.tagline,
                characterDescription:
                  requestData.description ?? prevData.data.description,
                voice: requestData.voice ?? null,
                modelSelection: requestData.modelSelection,
              },
            };
          },
          { id: pathParams.id },
        );
      },
    },
  },

  fields: customWidgetObject({
    render: FavoriteEditContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.chat.favorites.id.patch.id.label" as const,
        hidden: true,
        schema: z.string().uuid(),
      }),

      // Delete button configuration
      deleteButton: deleteButton({
        label:
          "app.api.agent.chat.favorites.id.patch.deleteButton.label" as const,
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
      success: responseField({
        type: WidgetType.ALERT,
        schema: z.string(),
      }),

      // === REQUEST ===
      characterId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.favorites.id.patch.characterId.label" as const,
        columns: 6,
        hidden: true,
        schema: z.string().optional(),
      }),

      icon: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ICON,
        schema: iconSchema,
        theme: {
          style: "none",
        } as const,
      }),

      name: requestField({
        type: WidgetType.TEXT,
        schema: z.string().nullable(),
        size: "base",
        emphasis: "bold",
      }),

      tagline: requestField({
        type: WidgetType.TEXT,
        schema: z.string().nullable(),
        size: "sm",
        variant: "muted",
      }),

      description: requestField({
        type: WidgetType.TEXT,
        schema: z.string().nullable(),
        size: "xs",
        variant: "muted",
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

      modelSelection: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.OBJECT,
        schema: modelSelectionSchemaSimple.nullable(),
      }),

      // Auto-compacting token threshold (null = fall through to character/settings default)
      compactTrigger: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.agent.chat.favorites.id.patch.compactTrigger.label" as const,
        description:
          "app.api.agent.chat.favorites.id.patch.compactTrigger.description" as const,
        columns: 6,
        schema: z.number().int().min(1000).max(200000).nullable().optional(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.validation.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.network.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.server.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.favorites.id.patch.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.favorites.id.patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.favorites.id.patch.success.title" as const,
    description:
      "app.api.agent.chat.favorites.id.patch.success.description" as const,
  },

  examples: {
    requests: {
      update: {
        characterId: "thea",
        icon: "sun" as const,
        name: "Thea",
        tagline: "AI Assistant",
        description: "A helpful AI assistant",
        voice: "app.api.agent.textToSpeech.voices.FEMALE" as const,
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
      },
    },
    responses: {
      update: {
        success: "app.api.agent.chat.favorites.id.patch.success.title",
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
  method: Methods.GET,
  path: ["agent", "chat", "favorites", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const, // Allow public users to use client route

  title: "app.api.agent.chat.favorites.id.get.title" as const,
  description: "app.api.agent.chat.favorites.id.get.description" as const,
  icon: "star" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.favorites" as const],

  fields: objectFieldNew({
    type: WidgetType.CONTAINER,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label:
          "app.api.agent.chat.favorites.get.response.favorite.id.content" as const,
        schema: z.string().uuid(),
        hidden: true,
      }),

      // Edit button configuration
      editButton: navigateButtonField({
        targetEndpoint: PATCH,
        extractParams: (source) => ({
          urlPathParams: {
            id: (source.urlPathParams as { id: string }).id,
          },
        }),
        prefillFromGet: true,
        label: "app.api.agent.chat.favorites.id.get.editButton.label" as const,
        icon: "pencil",
        variant: "default",
        className: "ml-auto",
        usage: { response: true } as const,
      }),

      // Delete button configuration
      deleteButton: deleteButton({
        targetEndpoint: DELETE,
        extractParams: (source) => ({
          urlPathParams: {
            id: (source.urlPathParams as { id: string }).id,
          },
        }),
        label:
          "app.api.agent.chat.favorites.id.get.deleteButton.label" as const,
        icon: "trash",
        variant: "destructive",
        popNavigationOnSuccess: 1,
        usage: { response: true } as const,
      }),

      // Separator
      separator: widgetField({
        type: WidgetType.SEPARATOR,
        spacingTop: SpacingSize.RELAXED,
        spacingBottom: SpacingSize.RELAXED,
        usage: { response: true } as const,
      }),

      // === FLAT RESPONSE FIELDS ===
      characterId: responseField({
        type: WidgetType.TEXT,
        schema: z.string(),
        hidden: true,
      }),

      icon: responseField({
        type: WidgetType.ICON,
        containerSize: "lg",
        iconSize: "lg",
        borderRadius: "lg",
        schema: iconSchema,
      }),

      name: responseField({
        type: WidgetType.TEXT,
        size: "base",
        emphasis: "bold",
        schema: z.string(),
      }),

      tagline: responseField({
        type: WidgetType.TEXT,
        size: "sm",
        variant: "muted",
        schema: z.string(),
      }),

      description: responseField({
        type: WidgetType.TEXT,
        size: "xs",
        variant: "muted",
        schema: z.string(),
      }),

      voice: responseField({
        type: WidgetType.BADGE,
        variant: "default",
        schema: z.enum(TtsVoiceDB).nullable(),
      }),

      modelSelection: responseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.OBJECT,
        schema: modelSelectionSchemaSimple.nullable(),
      }),

      characterModelSelection: responseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.OBJECT,
        schema: modelSelectionSchemaSimple.nullable().optional(),
      }),

      // Auto-compacting token threshold (null = fall through to character/settings default)
      compactTrigger: responseField({
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nullable(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.favorites.id.get.errors.validation.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.favorites.id.get.errors.network.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.favorites.id.get.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.favorites.id.get.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.favorites.id.get.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.favorites.id.get.errors.server.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.favorites.id.get.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.favorites.id.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.favorites.id.get.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.favorites.id.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.favorites.id.get.success.title" as const,
    description:
      "app.api.agent.chat.favorites.id.get.success.description" as const,
  },

  examples: {
    responses: {
      default: {
        characterId: "thea",
        icon: "sun" as const,
        name: "app.api.agent.chat.characters.characters.thea.name" as const,
        tagline:
          "app.api.agent.chat.characters.characters.thea.tagline" as const,
        description:
          "app.api.agent.chat.characters.characters.thea.description" as const,
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
