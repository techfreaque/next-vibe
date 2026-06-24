/**
 * Favorites Create API Definition
 * Defines endpoint for creating new favorites
 */

import { lazy } from "react";
import { z } from "zod";

import type { ChatModelSelection } from "@/app/api/[locale]/agent/ai-stream/models";
import { chatModelSelectionSchema } from "@/app/api/[locale]/agent/ai-stream/models";
import {
  audioVisionModelSelectionSchema,
  imageVisionModelSelectionSchema,
  videoVisionModelSelectionSchema,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import { imageGenModelSelectionSchema } from "@/app/api/[locale]/agent/image-generation/models";
import { musicGenModelSelectionSchema } from "@/app/api/[locale]/agent/music-generation/models";
import { sttModelSelectionSchema } from "@/app/api/[locale]/agent/speech-to-text/models";
import {
  TtsModelId,
  voiceModelSelectionSchema,
} from "@/app/api/[locale]/agent/text-to-speech/models";
import { videoGenModelSelectionSchema } from "@/app/api/[locale]/agent/video-generation/models";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  requestField,
  responseField,
  submitButton,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { iconSchema } from "../../../../shared/types/common.schema";
import { parseSkillId } from "../../../chat/slugify";
import type {
  FiltersModelSelection,
  ManualModelSelection,
} from "../../create/definition";
import { IntelligenceLevel, ModelSelectionType } from "../../enum";
import { FAVORITE_CREATE_ALIAS } from "../constants";
import { scopedTranslation } from "./i18n";

const FavoriteCreateContainer = lazy(() =>
  import("./widget").then((m) => ({ default: m.FavoriteCreateContainer })),
);

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
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "plus" as const,
  category: "ai",
  subCategory: "chatFavorites",
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
        availability,
      }) => {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const favoritesDefinition = await import("../definition");
        const charactersDefinition = await import("../../definition");
        const characterSingleDefinitions =
          await import("../../[id]/definition");
        const { ChatFavoritesRepositoryClient } =
          await import("../repository-client");

        const characterIcon = requestData.icon;
        // Parse merged skillId to get base skillId and variantId
        const { skillId: resolvedSkillId, variantId: resolvedVariantId } =
          parseSkillId(requestData.skillId ?? "");

        let character = apiClient.getEndpointData(
          characterSingleDefinitions.default.GET,
          logger,
          { urlPathParams: { id: resolvedSkillId } },
        );

        // If not in cache, fetch from server
        if (!character?.success) {
          character = await apiClient.fetch(
            characterSingleDefinitions.default.GET,
            logger,
            user,
            undefined,
            { id: resolvedSkillId },
            locale,
            availability,
          );
        }

        let characterName: string | null = null;
        let characterTagline: string | null = null;
        let characterDescription: string | null = null;
        let characterModelSelection: ChatModelSelection | null = null;
        if (character?.success) {
          characterName = character.data.name ?? null;
          characterTagline = character.data.tagline ?? null;
          characterDescription = character.data.description ?? null;
          const variants = character.data.variants;
          const variant = resolvedVariantId
            ? variants?.find((v) => v.id === resolvedVariantId)
            : variants?.[0];
          characterModelSelection = variant?.modelSelection ?? null;
        } else {
          logger.error(
            "Failed to fetch character data in create favorite onSuccess",
            { skillId: resolvedSkillId },
          );
          return;
        }

        // Create new favorite config for optimistic update
        const newFavoriteConfig = {
          id: responseData.id,
          skillId: requestData.skillId ?? "default", // merged format
          customVariantName: requestData.customVariantName ?? null,
          customIcon: null,
          voiceModelSelection: requestData.voiceModelSelection ?? null,
          modelSelection: requestData.modelSelection ?? null,
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
                availability,
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
                  skills: section.skills.map((char) =>
                    parseSkillId(char.skillId).skillId === resolvedSkillId
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
        description: "post.skillId.description" as const,
        columns: 6,
        hidden: true,
        schema: z.string(),
      }),

      customVariantName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.customVariantName.label" as const,
        description: "post.customVariantName.description" as const,
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

      voiceModelSelection: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.voice.label" as const,
        description: "post.voice.description" as const,
        columns: 6,
        schema: voiceModelSelectionSchema.nullable().optional(),
      }),
      sttModelSelection: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.sttModel.label" as const,
        description: "post.sttModel.description" as const,
        columns: 6,
        schema: sttModelSelectionSchema.nullable().optional(),
      }),
      imageVisionModelSelection: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.imageVisionModel.label" as const,
        description: "post.imageVisionModel.description" as const,
        columns: 6,
        schema: imageVisionModelSelectionSchema.nullable().optional(),
      }),
      videoVisionModelSelection: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.videoVisionModel.label" as const,
        description: "post.videoVisionModel.description" as const,
        columns: 6,
        schema: videoVisionModelSelectionSchema.nullable().optional(),
      }),
      audioVisionModelSelection: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.audioVisionModel.label" as const,
        description: "post.audioVisionModel.description" as const,
        columns: 6,
        schema: audioVisionModelSelectionSchema.nullable().optional(),
      }),
      imageGenModelSelection: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.imageGenModel.label" as const,
        description: "post.imageGenModel.description" as const,
        columns: 6,
        schema: imageGenModelSelectionSchema.nullable().optional(),
      }),
      musicGenModelSelection: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.musicGenModel.label" as const,
        description: "post.musicGenModel.description" as const,
        columns: 6,
        schema: musicGenModelSelectionSchema.nullable().optional(),
      }),
      videoGenModelSelection: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.videoGenModel.label" as const,
        description: "post.videoGenModel.description" as const,
        columns: 6,
        schema: videoGenModelSelectionSchema.nullable().optional(),
      }),
      modelSelection: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.modelSelection.label" as const,
        description: "post.modelSelection.description" as const,
        schema: chatModelSelectionSchema.nullable().optional(),
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
        schema: z.string(),
        hidden: true,
      }),

      backButton: backButton(scopedTranslation, {
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),

      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "plus",
        variant: "primary",
        className: "ml-auto",
        usage: { request: "data" },
      }),
    },
  }),

  // This op's event. `requestFields` carries the favorite the user submitted (the
  // request config), `fields` adds the new `id` from the response. Delivered to
  // the client (its onEvent optimistically adds the favorite to the list + get
  // caches) AND relayed cross-instance (remoteEvent), where the peer's
  // onRemoteEvent upserts the row from the same payload. No schema, no extra
  // events — the request data IS the payload.
  events: {
    "favorite-created": {
      remoteEvent: true as const,
      syncDomain: "favorites" as const,
      operation: "merge" as const,
      allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
      requestFields: [
        "skillId",
        "customVariantName",
        "icon",
        "voiceModelSelection",
        "sttModelSelection",
        "imageVisionModelSelection",
        "videoVisionModelSelection",
        "audioVisionModelSelection",
        "imageGenModelSelection",
        "musicGenModelSelection",
        "videoGenModelSelection",
        "modelSelection",
        "compactTrigger",
        "availableTools",
        "pinnedTools",
      ] as const,
      responseFields: ["id"] as const,
      // Client optimistic update for OTHER tabs: build the favorite card from the
      // event payload (the request the user submitted + the new id) and add it to
      // the list cache, then prime the single-favorite [id] get cache so a direct
      // navigation renders instantly. Character display fields (name/tagline/icon)
      // are resolved from the skills [id] cache when present, else fill in on the
      // next list refetch.
      onEvent: async ({ responseData, requestData, logger, locale, user }) => {
        const [
          { apiClient },
          favoritesDefinition,
          charactersDefinition,
          skillSingleDefinition,
          { ChatFavoritesRepositoryClient },
          { getEnvAvailability },
        ] = await Promise.all([
          import("@/app/api/[locale]/system/unified-interface/react/hooks/store"),
          import("../definition"),
          import("../../definition"),
          import("../../[id]/definition"),
          import("../repository-client"),
          import("../../../env-availability"),
        ]);

        const availability = getEnvAvailability();
        const { skillId: baseSkillId, variantId } = parseSkillId(
          requestData.skillId ?? "default",
        );

        // Resolve character display data from the skills [id] cache, if present.
        const character = apiClient.getEndpointData(
          skillSingleDefinition.default.GET,
          logger,
          { urlPathParams: { id: baseSkillId } },
        );
        let characterName: string | null = null;
        let characterTagline: string | null = null;
        let characterDescription: string | null = null;
        let characterModelSelection = requestData.modelSelection ?? null;
        if (character?.success) {
          characterName = character.data.name ?? null;
          characterTagline = character.data.tagline ?? null;
          characterDescription = character.data.description ?? null;
          const variant = variantId
            ? character.data.variants?.find((v) => v.id === variantId)
            : character.data.variants?.[0];
          characterModelSelection =
            requestData.modelSelection ?? variant?.modelSelection ?? null;
        }

        const card = ChatFavoritesRepositoryClient.computeFavoriteDisplayFields(
          {
            id: responseData.id,
            skillId: requestData.skillId ?? "default",
            customVariantName: requestData.customVariantName ?? null,
            customIcon: null,
            voiceModelSelection: requestData.voiceModelSelection ?? null,
            modelSelection: requestData.modelSelection ?? null,
            position: 0,
          },
          characterModelSelection,
          requestData.icon ?? null,
          characterName,
          characterTagline,
          characterDescription,
          null,
          requestData.voiceModelSelection ?? null,
          locale,
          user,
          availability,
        );

        // View 1 — favorites list: append if not already present.
        apiClient.updateEndpointData(
          favoritesDefinition.default.GET,
          logger,
          (old) => {
            if (!old?.success) {
              return old;
            }
            if (old.data.favorites.some((f) => f.id === card.id)) {
              return old;
            }
            return {
              ...old,
              data: { ...old.data, favorites: [...old.data.favorites, card] },
            };
          },
        );

        // View 2 — characters/skills list: flip addedToFav on the matching skill.
        apiClient.updateEndpointData(
          charactersDefinition.default.GET,
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
                  skills: section.skills.map((char) =>
                    parseSkillId(char.skillId).skillId === baseSkillId
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
      // Basic: link a skill using filter-based model selection
      create: {
        skillId: "thea",
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange: {
            min: IntelligenceLevel.SMART,
            max: IntelligenceLevel.BRILLIANT,
          },
        },
      },
      // With personal overrides: custom voice + boost to brilliant
      createWithVoice: {
        skillId: "technical",
        customVariantName: "My Technical",
        voiceModelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: TtsModelId.OPENAI_ONYX,
        },
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange: {
            min: IntelligenceLevel.BRILLIANT,
            max: IntelligenceLevel.BRILLIANT,
          },
        },
      },
    },
    responses: {
      create: {
        success: "success.title",
        id: "thea",
      },
      createWithVoice: {
        success: "success.title",
        id: "thea-brilliant",
      },
    },
  },
});

// Type exports for POST endpoint
export type FavoriteCreateRequestInput = typeof POST.types.RequestInput;
export type FavoriteCreateRequestOutput = typeof POST.types.RequestOutput;
export type FavoriteCreateResponseInput = typeof POST.types.ResponseInput;
export type FavoriteCreateResponseOutput = typeof POST.types.ResponseOutput;

/** Inferred payload of the `favorite-created` event (id from responseFields). */
export type FavoriteCreatedEventPayload =
  (typeof POST.types.EventResponsePayloads)["favorite-created"];

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
