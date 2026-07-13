/**
 * Favorites API Definition
 * Defines endpoint for listing user favorites
 */

import {
  ChatModelId,
  chatModelSelectionSchema,
} from "next-vibe/agent/ai-stream/models";
import { DEFAULT_TTS_VOICE_ID } from "next-vibe/agent/text-to-speech/constants";
import {
  TtsModelId,
  voiceModelSelectionSchema,
} from "next-vibe/agent/text-to-speech/models";
import { iconSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserPermissionRole, UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  backButton,
  customWidgetObject,
  navigateButtonField,
  objectField,
  requestField,
  responseArrayField,
  responseField,
  widgetField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { parseSkillId } from "../../chat/slugify";
import { FAVORITES_LIST_ALIAS } from "./constants";
import type { FavoritesTranslationKey } from "./i18n";
import { scopedTranslation } from "./i18n";

const FavoritesListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.FavoritesListContainer })),
);

/**
 * Get Favorites List Endpoint (GET)
 * Retrieves all favorites for the current user
 */
/**
 * `favorite-created` event envelope. Hoisted so onEvent can parse the wire
 * payload explicitly — the self-referential events-map inference does not
 * reach a payloadType consumed in the SAME definition's onEvent.
 */
const favoriteCreatedPayloadSchema = z.object({
  id: z.string().optional(),
  skillId: z.string().optional(),
  customVariantName: z.string().nullable().optional(),
  icon: iconSchema.optional(),
  voiceModelSelection: voiceModelSelectionSchema.nullable().optional(),
  modelSelection: chatModelSelectionSchema.nullable().optional(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "skills", "favorites"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const, // Allow public users to use client route
  defaultWebPinned: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "star" as const,
  category: "ai",
  tags: ["tags.favorites" as const],

  aliases: [FAVORITES_LIST_ALIAS],

  fields: customWidgetObject({
    render: FavoritesListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      /**
       * Admin-only: fetch favorites for a specific user instead of the authenticated user.
       * Only visible to admins - regular users never see or send this field.
       */
      userId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/users/list/definition")).default.GET,
        labelField: "email",
        label: "get.userId.label" as const,
        description: "get.userId.description" as const,
        schema: z.string().uuid().optional(),
        visibleFor: [UserPermissionRole.ADMIN],
      }),
      query: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.query.label" as const,
        description: "get.fields.query.description" as const,
        columns: 8,
        schema: z.string().optional(),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.page.label" as const,
        description: "get.fields.page.description" as const,
        columns: 4,
        schema: z.number().int().min(1).optional(),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.pageSize.label" as const,
        description: "get.fields.pageSize.description" as const,
        columns: 4,
        schema: z.number().int().min(1).max(500).optional(),
      }),
      // Flattened top action buttons (no container wrapper)
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),
      title: widgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.container.title" as const,
        usage: { response: true },
      }),
      createButton: navigateButtonField(scopedTranslation, {
        targetEndpoint: async () => (await import("../definition")).default.GET,
        extractParams: () => ({}),
        prefillFromGet: false,
        label: "get.createButton.label" as const,
        icon: "plus",
        variant: "outline",
        className: "ml-auto",
        usage: { response: true },
      }),

      // Pagination metadata (AI/MCP platform only - null for human callers)
      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nullable(),
      }),
      matchedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nullable(),
      }),
      currentPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nullable(),
      }),
      totalPages: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nullable(),
      }),
      hint: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),

      // Favorites list
      favorites: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "4",
          alignItems: "start",
          noCard: true,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string(),
            }),
            skillId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string(),
            }),
            customVariantName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string().nullable(),
            }),
            modelId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.enum(ChatModelId).nullable(),
            }),
            voiceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.enum(TtsModelId).nullable(),
            }),
            position: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.number().int(),
            }),
            icon: responseField(scopedTranslation, {
              type: WidgetType.ICON,
              containerSize: "lg",
              iconSize: "lg",
              borderRadius: "lg",
              schema: iconSchema,
            }),
            // Flattened fields (no nested content/titleRow/modelRow objects)
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "base",
              emphasis: "bold",
              schema: z.string(),
            }),
            tagline: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              schema: z.string().nullable(),
            }),
            activeBadge: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              variant: "default",
              size: "xs",
              schema: z
                .string()
                .nullable() as z.ZodType<FavoritesTranslationKey | null>,
            }),
            description: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              schema: z.string().nullable(),
            }),
            modelIcon: responseField(scopedTranslation, {
              type: WidgetType.ICON,
              iconSize: "xs",
              noHover: true,
              schema: iconSchema,
            }),
            modelInfo: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              schema: z.string(),
            }),
            separator1: widgetField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              inline: true,
              content: "get.response.favorite.separator.content" as const,
              usage: { response: true },
            }),
            modelProvider: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              className: "hidden sm:inline",
              schema: z.string(),
            }),
            separator2: widgetField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              inline: true,
              className: "hidden sm:inline",
              content: "get.response.favorite.separator.content" as const,
              usage: { response: true },
            }),
          },
        }),
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

  // The list owns the `favorite-created` event so the favorites page's active
  // subscription (on this GET endpoint) catches cross-instance sync events.
  // The POST (create) endpoint is the relay origin (remoteEvent: true, syncDomain);
  // this GET is the local-delivery receiver — no remoteEvent flag here.
  channel: { scope: "user" } as const,
  events: {
    "favorite-created": {
      operation: "merge" as const,
      allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
      payloadType: favoriteCreatedPayloadSchema,
      onEvent: async ({
        payload: rawPayload,
        logger,
        locale,
        user,
        agentEnvAvailability,
      }) => {
        // Explicit envelope parse (see favoriteCreatedPayloadSchema above).
        const payload = favoriteCreatedPayloadSchema.parse(rawPayload);
        const [
          { apiClient },
          favoritesDefinition,
          charactersDefinition,
          skillSingleDefinition,
          { ChatFavoritesRepositoryClient },
        ] = await Promise.all([
          import("next-vibe/platforms/react/hooks/store"),
          import("./definition"),
          import("../definition"),
          import("../[id]/definition"),
          import("./repository-client"),
        ]);

        const { skillId: baseSkillId, variantId } = parseSkillId(
          payload.skillId ?? "default",
        );

        const character = apiClient.getEndpointData(
          skillSingleDefinition.default.GET,
          logger,
          { urlPathParams: { id: baseSkillId } },
        );
        let characterName: string | null = null;
        let characterTagline: string | null = null;
        let characterDescription: string | null = null;
        let characterModelSelection = payload.modelSelection ?? null;
        if (character?.success) {
          characterName = character.data.name ?? null;
          characterTagline = character.data.tagline ?? null;
          characterDescription = character.data.description ?? null;
          const variant = variantId
            ? character.data.variants?.find((v) => v.id === variantId)
            : character.data.variants?.[0];
          characterModelSelection =
            payload.modelSelection ?? variant?.modelSelection ?? null;
        }

        const card = ChatFavoritesRepositoryClient.computeFavoriteDisplayFields(
          {
            id: payload.id ?? "",
            skillId: payload.skillId ?? "default",
            customVariantName: payload.customVariantName ?? null,
            customIcon: null,
            voiceModelSelection: payload.voiceModelSelection ?? null,
            modelSelection: payload.modelSelection ?? null,
            position: 0,
          },
          characterModelSelection,
          payload.icon ?? null,
          characterName,
          characterTagline,
          characterDescription,
          null,
          payload.voiceModelSelection ?? null,
          locale,
          user,
          agentEnvAvailability,
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

  examples: {
    requests: {
      ownFavorites: {},
      userFavorites: {
        userId: "550e8400-e29b-41d4-a716-446655440001",
      },
    },
    responses: {
      listAll: {
        totalCount: null,
        matchedCount: null,
        currentPage: null,
        totalPages: null,
        hint: null,
        favorites: [
          {
            id: "thea",
            skillId: "default",
            customVariantName: null,
            modelId: ChatModelId.CLAUDE_SONNET_4_5,
            voiceId: DEFAULT_TTS_VOICE_ID,
            position: 0,
            icon: "sparkles",
            name: "Thea",
            tagline: "Greek goddess of light",
            activeBadge: "active",
            description: "Devoted companion with ancient wisdom",
            modelIcon: "sparkles",
            modelInfo: "Claude Sonnet 4.5",
            modelProvider: "Anthropic",
          },
        ],
      },
    },
  },
});

// Type exports for GET endpoint
export type FavoritesListRequestInput = typeof GET.types.RequestInput;
export type FavoritesListRequestOutput = typeof GET.types.RequestOutput;
export type FavoritesListResponseInput = typeof GET.types.ResponseInput;
export type FavoritesListResponseOutput = typeof GET.types.ResponseOutput;

// Favorite card type (single item from favorites list)
export type FavoriteCard = FavoritesListResponseOutput["favorites"][number];

const definitions = { GET } as const;
export default definitions;
