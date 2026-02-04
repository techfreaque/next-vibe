/**
 * Single Favorite API Definition
 * Defines endpoints for getting, updating, and deleting a single favorite
 */

import { z } from "zod";

import characterDefinitions from "@/app/api/[locale]/agent/chat/characters/[id]/definition";
import charactersDefinitions from "@/app/api/[locale]/agent/chat/characters/definition";
import {
  TtsVoiceDB,
  TtsVoiceOptions,
} from "@/app/api/[locale]/agent/text-to-speech/enum";
import { iconSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  deleteButton,
  navigateButtonField,
  submitButton,
  widgetField,
  widgetObjectField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  objectField,
  requestField,
  requestUrlPathParamsField,
  requestUrlPathParamsResponseField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  SpacingSize,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { modelSelectionSchemaWithCharacter } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/model-selection-field/types";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

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
                favoritesList: oldData.data.favoritesList.filter(
                  (fav) => fav.id !== data.pathParams.id,
                ),
              },
            };
          },
          undefined,
        );
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
        // Import dependencies
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const favoritesDefinition = await import("../definition");
        const { ChatFavoritesRepositoryClient } =
          await import("../repository-client");
        const { ChatSettingsRepositoryClient } =
          await import("../../settings/repository-client");

        // Get active favorite ID for badge computation
        const settings = ChatSettingsRepositoryClient.loadLocalSettings();
        const activeFavoriteId = settings.activeFavoriteId;

        // Load the updated favorite config from localStorage for cache updates
        const updatedConfig = ChatFavoritesRepositoryClient.loadLocalFavorite(
          data.pathParams.id,
        );
        const enrichedFavorite = updatedConfig
          ? ChatFavoritesRepositoryClient.enrichLocalFavorite(updatedConfig)
          : null;

        // Optimistically update the favorite in the list with proper recomputation
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
                favoritesList: oldData.data.favoritesList.map((fav) => {
                  if (fav.id !== data.pathParams.id) {
                    return fav;
                  }

                  // Load the updated favorite config from localStorage
                  const updatedConfig =
                    ChatFavoritesRepositoryClient.loadLocalFavorite(fav.id);
                  if (!updatedConfig) {
                    return fav;
                  }

                  // Recompute display fields with proper model selection and icon
                  return ChatFavoritesRepositoryClient.computeFavoriteDisplayFields(
                    updatedConfig,
                    activeFavoriteId,
                  );
                }),
              },
            };
          },
          undefined,
        );

        // Also optimistically update the single favorite GET endpoint cache
        // This ensures that navigating back to edit shows the updated data
        if (enrichedFavorite) {
          const favoriteByIdDefinition = await import("./definition");
          apiClient.updateEndpointData(
            favoriteByIdDefinition.default.GET,
            data.logger,
            () => {
              return {
                success: true,
                data: enrichedFavorite,
              };
            },
            { id: data.pathParams.id },
          );
        }
      },
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
      noCard: true,
    },
    { request: "data&urlPathParams", response: true },
    {
      // Navigation and action buttons
      topActions: widgetObjectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "2",
          noCard: true,
        },
        { request: "data", response: true },
        {
          backButton: backButton({
            label:
              "app.api.agent.chat.favorites.id.patch.backButton.label" as const,
            icon: "arrow-left",
            variant: "outline",
            usage: { request: "data", response: true },
          }),
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
            popNavigationOnSuccess: 2, // Pop twice: edit -> details -> list
            usage: { request: "data", response: true },
          }),
          submitButton: widgetField({
            type: WidgetType.SUBMIT_BUTTON,
            text: "app.api.agent.chat.favorites.id.patch.submitButton.label" as const,
            loadingText:
              "app.api.agent.chat.favorites.id.patch.submitButton.loadingText" as const,
            icon: "save",
            variant: "primary",
            usage: { request: "data", response: true },
          }),
        },
      ),

      // === RESPONSE ===
      success: responseField({
        type: WidgetType.ALERT,
        schema: z.string() as z.ZodType<TranslationKey>,
      }),

      // === REQUEST (URL Path Params) ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.chat.favorites.id.patch.id.label" as const,
        hidden: true,
        schema: z.string().uuid(),
      }),

      // === REQUEST (Data) ===
      characterId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.favorites.id.patch.characterId.label" as const,
        columns: 6,
        hidden: true,
        schema: z.string().optional(),
      }),
      character: objectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          gap: "2",
          className: "group",
        },
        { request: "data" },
        {
          info: objectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.INLINE,
              gap: "4",
              alignItems: "start",
              noCard: true,
            },
            { request: "data" },
            {
              icon: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.ICON,
                schema: iconSchema,
                theme: {
                  style: "none",
                },
              }),
              info: widgetObjectField(
                {
                  type: WidgetType.CONTAINER,
                  layoutType: LayoutType.STACKED,
                  gap: "2",
                  theme: {},
                  noCard: true,
                },
                { request: "data" },
                {
                  titleRow: widgetObjectField(
                    {
                      type: WidgetType.CONTAINER,
                      layoutType: LayoutType.INLINE,
                      gap: "2",
                      noCard: true,
                    },
                    { request: "data" },
                    {
                      name: widgetField({
                        type: WidgetType.TEXT,
                        size: "base",
                        emphasis: "bold",
                        usage: { request: "data" },
                      }),
                      tagline: widgetField({
                        type: WidgetType.TEXT,
                        size: "sm",
                        variant: "muted",
                        usage: { request: "data" },
                      }),
                    },
                  ),
                  description: widgetField({
                    type: WidgetType.TEXT,
                    size: "xs",
                    variant: "muted",
                    usage: { request: "data" },
                  }),
                },
              ),
            },
          ),
          separator: widgetField({
            type: WidgetType.SEPARATOR,
            spacingTop: SpacingSize.RELAXED,
            spacingBottom: SpacingSize.RELAXED,
            usage: { request: "data" },
          }),

          actions: widgetObjectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.INLINE,
              gap: "2",
              noCard: true,
            },
            { request: "data" },
            {
              changeCharacter: navigateButtonField({
                label:
                  "app.api.agent.chat.favorites.id.patch.changeCharacter.label" as const,
                icon: "refresh-cw",
                variant: "ghost",
                size: "sm",
                targetEndpoint: charactersDefinitions.GET,
                extractParams: () => ({}),
                usage: { request: "data" },
              }),
              modifyCharacter: navigateButtonField({
                label:
                  "app.api.agent.chat.favorites.id.patch.modifyCharacter.label" as const,
                icon: "pencil",
                variant: "ghost",
                size: "sm",
                targetEndpoint: characterDefinitions.PATCH,
                extractParams: (source) => ({
                  urlPathParams: {
                    id: String(
                      (source.responseData as { characterId: string })
                        .characterId,
                    ),
                  },
                }),
                prefillFromGet: true,
                getEndpoint: characterDefinitions.GET,
                usage: { request: "data" },
              }),
            },
          ),
        },
      ),

      voice: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.agent.chat.favorites.id.patch.voice.label" as const,
        description:
          "app.api.agent.chat.favorites.id.patch.voice.description" as const,
        options: TtsVoiceOptions,
        columns: 6,
        schema: z.enum(TtsVoiceDB).nullable().optional(),
      }),

      modelSelection: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MODEL_SELECTION,
        label:
          "app.api.agent.chat.favorites.post.modelSelection.title" as const,
        description:
          "app.api.agent.chat.favorites.post.modelSelection.description" as const,
        includeCharacterBased: true,
        columns: 12,
        schema: modelSelectionSchemaWithCharacter,
      }),
    },
  ),

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
        character: {
          info: {
            icon: "sun",
          },
        },

        modelSelection: {
          currentSelection: {
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
          characterModelSelection: {
            selectionType: ModelSelectionType.FILTERS,
            intelligenceRange: {
              min: IntelligenceLevel.SMART,
              max: IntelligenceLevel.BRILLIANT,
            },
            priceRange: {
              min: PriceLevel.CHEAP,
              max: PriceLevel.STANDARD,
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
    },
    responses: {
      update: {
        success: true,
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

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.favorites.id.get.container.title" as const,
      layoutType: LayoutType.STACKED,
      noCard: true,
    },
    { request: "urlPathParams", response: true },
    {
      // === REQUEST (URL Path Params) + RESPONSE ===
      id: requestUrlPathParamsResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label:
          "app.api.agent.chat.favorites.get.response.favorite.id.content" as const,
        schema: z.string().uuid(),
      }),
      characterId: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.favorites.id.get.response.characterId.content" as const,
        schema: z.string(),
      }),
      character: objectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          gap: "2",
          className: "group",
        },
        { response: true },
        {
          info: objectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.INLINE,
              gap: "4",
              alignItems: "start",
              noCard: true,
            },
            { response: true },
            {
              icon: responseField({
                type: WidgetType.ICON,
                containerSize: "lg",
                iconSize: "lg",
                borderRadius: "lg",
                schema: iconSchema,
              }),
              info: objectField(
                {
                  type: WidgetType.CONTAINER,
                  layoutType: LayoutType.STACKED,
                  gap: "2",
                  noCard: true,
                },
                { response: true },
                {
                  titleRow: objectField(
                    {
                      type: WidgetType.CONTAINER,
                      layoutType: LayoutType.INLINE,
                      gap: "2",
                      noCard: true,
                    },
                    { response: true },
                    {
                      name: responseField({
                        type: WidgetType.TEXT,
                        size: "base",
                        emphasis: "bold",
                        schema: z.string() as z.ZodType<TranslationKey>,
                      }),
                      tagline: responseField({
                        type: WidgetType.TEXT,
                        size: "sm",
                        variant: "muted",
                        schema: z.string() as z.ZodType<TranslationKey>,
                      }),
                    },
                  ),
                  description: responseField({
                    type: WidgetType.TEXT,
                    size: "xs",
                    variant: "muted",
                    schema: z.string() as z.ZodType<TranslationKey>,
                  }),
                },
              ),
            },
          ),
          separator: widgetField({
            type: WidgetType.SEPARATOR,
            spacingTop: SpacingSize.RELAXED,
            spacingBottom: SpacingSize.RELAXED,
            usage: { response: true },
          }),

          actions: widgetObjectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.INLINE,
              gap: "2",
              noCard: true,
            },
            { response: true },
            {
              changeCharacter: navigateButtonField({
                icon: "pencil",
                variant: "ghost",
                size: "sm",
                targetEndpoint: charactersDefinitions.GET,
                extractParams: () => ({}),
                usage: { response: true },
              }),
              modifyCharacter: navigateButtonField({
                icon: "trash",
                variant: "ghost",
                size: "sm",
                targetEndpoint: characterDefinitions.PATCH,
                extractParams: (source) => ({
                  urlPathParams: {
                    id: String(
                      (source.responseData as { characterId: string })
                        .characterId,
                    ),
                  },
                }),
                prefillFromGet: true,
                getEndpoint: characterDefinitions.GET,
                usage: { response: true },
              }),
            },
          ),
        },
      ),

      customName: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.favorites.id.get.response.customName.content" as const,
        hidden: true,
        schema: z.string().nullable(),
      }),
      customIcon: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.favorites.id.get.response.customIcon.content" as const,
        schema: iconSchema.nullable().optional(),
      }),
      voice: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.favorites.id.get.response.voice.content" as const,
        schema: z.enum(TtsVoiceDB).nullable(),
      }),
      modelSelection: responseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MODEL_SELECTION,
        label:
          "app.api.agent.chat.favorites.id.get.response.modelSelection.title" as const,
        includeCharacterBased: true,
        columns: 12,
        schema: modelSelectionSchemaWithCharacter,
      }),

      color: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.favorites.id.get.response.color.content" as const,
        schema: z.string().nullable(),
      }),
      position: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.favorites.id.get.response.position.content" as const,
        hidden: true,
        schema: z.number().int(),
      }),
      useCount: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.favorites.id.get.response.useCount.content" as const,
        schema: z.number(),
      }),
      // Navigation and action buttons
      buttons: widgetObjectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "2",
          noCard: true,
        },
        { response: true },
        {
          // Back button (left side)
          backButton: backButton({
            icon: "arrow-left",
            variant: "outline",
            usage: { response: true },
          }),

          // Edit button - uses self-referencing GET endpoint for prefill
          editButton: navigateButtonField({
            targetEndpoint: PATCH,
            extractParams: (source) => ({
              urlPathParams: {
                id: (source.responseData as { id: string }).id,
              },
            }),
            prefillFromGet: true,
            label:
              "app.api.agent.chat.favorites.id.get.editButton.label" as const,
            icon: "pencil",
            variant: "default",
            className: "ml-auto",
            usage: { response: true },
          }),

          // Delete button
          deleteButton: deleteButton({
            targetEndpoint: DELETE,
            extractParams: (source) => ({
              urlPathParams: {
                id: (source.responseData as { id: string }).id,
              },
            }),
            label:
              "app.api.agent.chat.favorites.id.get.deleteButton.label" as const,
            icon: "trash",
            variant: "destructive",
            popNavigationOnSuccess: 1, // Pop once: details -> list
            usage: { response: true },
          }),
        },
      ),
    },
  ),

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
        id: "550e8400-e29b-41d4-a716-446655440000",
        characterId: "thea",
        character: {
          info: {
            icon: "sun",
            info: {
              titleRow: {
                name: "app.api.agent.chat.characters.characters.thea.name" as const,
                tagline:
                  "app.api.agent.chat.characters.characters.thea.tagline" as const,
              },
              description:
                "app.api.agent.chat.characters.characters.thea.description" as const,
            },
          },
        },
        customName: "Thea (Smart)",
        customIcon: null,
        voice: null,
        modelSelection: {
          currentSelection: {
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
            intelligenceRange: {
              min: IntelligenceLevel.SMART,
              max: IntelligenceLevel.BRILLIANT,
            },
            priceRange: {
              min: PriceLevel.CHEAP,
              max: PriceLevel.STANDARD,
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
        color: null,
        position: 0,
        useCount: 50,
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
  FavoriteGetModelSelection["currentSelection"],
  { selectionType: typeof ModelSelectionType.FILTERS }
>;

export type FavoriteGetManualModelSelection = Extract<
  FavoriteGetModelSelection["currentSelection"],
  { selectionType: typeof ModelSelectionType.MANUAL }
>;

export type FavoriteGetCharacterBasedModelSelection = Extract<
  FavoriteGetModelSelection["currentSelection"],
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
  FavoriteModelSelection["currentSelection"],
  { selectionType: typeof ModelSelectionType.FILTERS }
>;

type FavoriteManualModelSelection = Extract<
  FavoriteModelSelection["currentSelection"],
  { selectionType: typeof ModelSelectionType.MANUAL }
>;

type FavoriteCharacterBasedModelSelection = Extract<
  FavoriteModelSelection["currentSelection"],
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
