/**
 * Favorites Create API Definition
 * Defines endpoint for creating new favorites
 */

import { z } from "zod";

import { modelSelectionSchemaSimple } from "@/app/api/[locale]/agent/models/components/types";
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
import { TtsVoiceDB, TtsVoiceOptions } from "../../../text-to-speech/enum";
import type {
  FiltersModelSelection,
  ManualModelSelection,
} from "../../characters/create/definition";
import { IntelligenceLevel, ModelSelectionType } from "../../characters/enum";
import { FavoriteCreateContainer } from "./widget";

/**
 * Create Favorite Endpoint (POST)
 * Creates a new favorite for the current user
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["agent", "chat", "favorites", "create"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const, // Allow public users to use client route

  title: "app.api.agent.chat.favorites.post.title" as const,
  description: "app.api.agent.chat.favorites.post.description" as const,
  icon: "plus" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.favorites" as const],

  options: {
    mutationOptions: {
      onSuccess: async ({ requestData, responseData, logger }) => {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const favoritesDefinition = await import("../definition");
        const charactersDefinition =
          await import("../../characters/definition");
        const characterSingleDefinitions =
          await import("../../characters/[id]/definition");
        const { ChatFavoritesRepositoryClient } =
          await import("../repository-client");

        // Get character data from request
        const characterIcon = requestData.icon;
        const characterName = requestData.name;
        const characterTagline = requestData.tagline;
        const characterDescription = requestData.description;
        const character = apiClient.getEndpointData(
          characterSingleDefinitions.default.GET,
          logger,
          { id: requestData.characterId },
        );
        if (!character?.success) {
          logger.error(
            "Failed to fetch character data in create favorite onSuccess",
            {
              characterId: requestData.characterId,
            },
          );
          return;
        }

        const characterModelSelection = character.data.modelSelection;

        // Create new favorite config for optimistic update
        const newFavoriteConfig = {
          id: responseData.id,
          characterId: requestData.characterId ?? "default",
          customIcon: null,
          voice: requestData.voice ?? null,
          modelSelection: requestData.modelSelection,
          position: 0, // Will be set correctly by the list
        };

        // Optimistically add the new favorite to the list
        apiClient.updateEndpointData(
          favoritesDefinition.default.GET,
          logger,
          (oldData) => {
            if (!oldData?.success) {
              return oldData;
            }

            const newFavorite =
              ChatFavoritesRepositoryClient.computeFavoriteDisplayFields(
                newFavoriteConfig,
                characterModelSelection,
                characterIcon ?? null,
                characterName ?? null,
                characterTagline ?? null,
                characterDescription ?? null,
                null,
              );

            return {
              success: true,
              data: {
                favorites: [...oldData.data.favorites, newFavorite],
              },
            };
          },
          undefined,
        );

        // Optimistically update characters list addedToFav
        apiClient.updateEndpointData(
          charactersDefinition.default.GET,
          logger,
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
                  characters: section.characters.map((char) =>
                    char.id === requestData.characterId
                      ? { ...char, addedToFav: true }
                      : char,
                  ),
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
    render: FavoriteCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === RESPONSE ===
      success: responseField({
        type: WidgetType.ALERT,
        schema: z.string(),
      }),

      // === REQUEST ===
      characterId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.chat.favorites.post.characterId.label" as const,
        columns: 6,
        hidden: true,
        schema: z.string(),
      }),

      icon: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ICON,
        schema: iconSchema.optional(),
        theme: {
          style: "none",
        } as const,
      }),

      name: requestField({
        type: WidgetType.TEXT,
        schema: z.string().nullable().optional(),
      }),

      tagline: requestField({
        type: WidgetType.TEXT,
        schema: z.string().nullable().optional(),
      }),

      description: requestField({
        type: WidgetType.TEXT,
        schema: z.string().nullable().optional(),
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

      // === RESPONSE ===
      id: responseField({
        type: WidgetType.TEXT,
        schema: z.string().uuid(),
        hidden: true,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.favorites.post.errors.validation.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.favorites.post.errors.network.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.favorites.post.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.favorites.post.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.favorites.post.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.favorites.post.errors.server.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.favorites.post.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.favorites.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.favorites.post.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.favorites.post.success.title" as const,
    description:
      "app.api.agent.chat.favorites.post.success.description" as const,
  },

  examples: {
    requests: {
      create: {
        characterId: "thea",
        icon: "female" as const,
        name: "Emma",
        tagline: "Creative Assistant",
        description: "A helpful AI assistant",
        voice: "app.api.agent.textToSpeech.voices.FEMALE" as const,
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange: {
            min: IntelligenceLevel.SMART,
            max: IntelligenceLevel.BRILLIANT,
          },
        },
      },
    },
    responses: {
      create: {
        success: "app.api.agent.chat.favorites.post.success.title",
        id: "550e8400-e29b-41d4-a716-446655440000",
      },
    },
  },
});

// Type exports for POST endpoint
export type FavoriteCreateRequestInput = typeof POST.types.RequestInput;
export type FavoriteCreateRequestOutput = typeof POST.types.RequestOutput;
export type FavoriteCreateResponseInput = typeof POST.types.ResponseInput;
export type FavoriteCreateResponseOutput = typeof POST.types.ResponseOutput;

// Favorite field type alias for model selection (from POST request)
// This is the full structure with currentSelection and characterModelSelection
export type FavoriteModelSelection =
  FavoriteCreateRequestOutput["modelSelection"];

export type FavoriteFiltersModelSelection = Extract<
  FavoriteModelSelection,
  { selectionType: typeof ModelSelectionType.FILTERS }
>;

export type FavoriteManualModelSelection = Extract<
  FavoriteModelSelection,
  { selectionType: typeof ModelSelectionType.MANUAL }
>;

const definitions = { POST } as const;
export default definitions;

// oxlint-disable-next-line no-unused-vars
const _test1: FiltersModelSelection = {} as FavoriteFiltersModelSelection;
// oxlint-disable-next-line no-unused-vars
const _test2: ManualModelSelection = {} as FavoriteManualModelSelection;
