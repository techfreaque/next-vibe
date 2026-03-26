/**
 * Favorites Create API Definition
 * Defines endpoint for creating new favorites
 */

import { z } from "zod";

import { modelSelectionSchemaSimple } from "@/app/api/[locale]/agent/models/types";
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
  TtsVoice,
  TtsVoiceDB,
  TtsVoiceOptions,
} from "../../../text-to-speech/enum";
import type {
  FiltersModelSelection,
  ManualModelSelection,
} from "../../skills/create/definition";
import { IntelligenceLevel, ModelSelectionType } from "../../skills/enum";
import { FAVORITE_CREATE_ALIAS } from "../constants";
import { scopedTranslation } from "./i18n";
import { FavoriteCreateContainer } from "./widget";

/**
 * Create Favorite Endpoint (POST)
 * Creates a new favorite for the current user
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "chat", "favorites", "create"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const, // Allow public users to use client route

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "plus" as const,
  category: "app.endpointCategories.chatFavorites",
  tags: ["tags.favorites" as const],

  aliases: [FAVORITE_CREATE_ALIAS],

  options: {
    mutationOptions: {
      onSuccess: async ({
        requestData,
        responseData,
        logger,
        locale,
        user,
      }) => {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const favoritesDefinition = await import("../definition");
        const charactersDefinition = await import("../../skills/definition");
        const characterSingleDefinitions =
          await import("../../skills/[id]/definition");
        const { ChatFavoritesRepositoryClient } =
          await import("../repository-client");

        const characterIcon = requestData.icon;
        const character = apiClient.getEndpointData(
          characterSingleDefinitions.default.GET,
          logger,
          { urlPathParams: { id: requestData.skillId } },
        );

        // Fall back to DEFAULT_SKILLS for built-in skills not yet in the single-fetch cache
        let characterName: string | null = null;
        let characterTagline: string | null = null;
        let characterDescription: string | null = null;
        let characterModelSelection:
          | FiltersModelSelection
          | ManualModelSelection
          | null = null;
        if (character?.success) {
          characterName = character.data.name ?? null;
          characterTagline = character.data.tagline ?? null;
          characterDescription = character.data.description ?? null;
          characterModelSelection = character.data.modelSelection ?? null;
        } else {
          const { DEFAULT_SKILLS } = await import("../../skills/config");
          const defaultSkill = DEFAULT_SKILLS.find(
            (s) => s.id === requestData.skillId,
          );
          if (defaultSkill) {
            characterModelSelection = defaultSkill.modelSelection ?? null;
          } else {
            logger.error(
              "Failed to fetch character data in create favorite onSuccess",
              { skillId: requestData.skillId },
            );
            return;
          }
        }

        // Create new favorite config for optimistic update
        const newFavoriteConfig = {
          id: responseData.id,
          skillId: requestData.skillId ?? "default",
          variantId: requestData.variantId ?? null,
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
                characterName,
                characterTagline,
                characterDescription,
                null,
                null,
                locale,
                user,
              );

            return {
              success: true,
              data: {
                ...oldData.data,
                favorites: [...oldData.data.favorites, newFavorite],
              },
            };
          },
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
                  characters: section.skills.map((char) =>
                    char.id === requestData.skillId
                      ? { ...char, addedToFav: true }
                      : char,
                  ),
                })),
              },
            };
          },
        );
      },
    },
  },

  fields: customWidgetObject({
    render: FavoriteCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === RESPONSE ===
      success: responseField(scopedTranslation, {
        type: WidgetType.ALERT,
        schema: z.string(),
      }),

      // === REQUEST ===
      skillId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.skillId.label" as const,
        columns: 6,
        hidden: true,
        schema: z.string(),
      }),

      variantId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.variantId.label" as const,
        columns: 6,
        hidden: true,
        schema: z.string().nullable().optional(),
      }),

      icon: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ICON,
        label: "post.icon.label" as const,
        description: "post.icon.description" as const,
        schema: iconSchema.optional(),
        theme: {
          style: "none",
        } as const,
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
        schema: z.enum(TtsVoiceDB).nullable().optional(),
      }),

      modelSelection: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.modelSelection.label" as const,
        description: "post.modelSelection.description" as const,
        schema: modelSelectionSchemaSimple.nullable(),
      }),

      // Auto-compacting token threshold (null = fall through to character/settings default)
      compactTrigger: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.compactTrigger.label" as const,
        description: "post.compactTrigger.description" as const,
        columns: 6,
        schema: z.number().int().min(1000).max(200000).nullable().optional(),
      }),

      // Tool configuration - null = fall through to character/settings default
      availableTools: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.availableTools.label" as const,
        description: "post.availableTools.description" as const,
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

      // Pinned tools - always shown in the toolbar for this slot
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

      // === RESPONSE ===
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().uuid(),
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
      create: {
        skillId: "thea",
        icon: "female" as const,
        voice: TtsVoice.FEMALE,
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange: {
            min: IntelligenceLevel.SMART,
            max: IntelligenceLevel.BRILLIANT,
          },
        },
        compactTrigger: null,
        availableTools: null,
        pinnedTools: null,
      },
    },
    responses: {
      create: {
        success: "success.title",
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
