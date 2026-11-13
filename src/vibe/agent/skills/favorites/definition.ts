/**
 * Favorites API Definition
 * Defines endpoint for listing user favorites
 */

import { iconSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserPermissionRole, UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  navigateButtonField,
  objectField,
  requestField,
  responseArrayField,
  responseField,
  widgetField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { ChatModelId } from "../../ai-stream/models";
import { parseSkillId } from "../../chat/slugify";
import { DEFAULT_TTS_VOICE_ID } from "../../text-to-speech/constants";
import { TtsModelId } from "../../text-to-speech/models";
import { FAVORITES_LIST_ALIAS } from "./constants";
import type { FavoritesTranslationKey } from "./i18n";
import { scopedTranslation } from "./i18n";

const FavoritesListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.FavoritesListContainer })),
);

/**
 * One favorite card exactly as the list returns it. Single source for the
 * list's per-item response field schemas AND the `favorite-created` event
 * payload, so a created card can never arrive thinner than a listed one.
 */
const favoriteCardSchema = z.object({
  id: z.string(),
  skillId: z.string(),
  customVariantName: z.string().nullable(),
  modelId: z.enum(ChatModelId).nullable(),
  voiceId: z.enum(TtsModelId).nullable(),
  position: z.number().int(),
  icon: iconSchema,
  name: z.string(),
  tagline: z.string().nullable(),
  activeBadge: z
    .string()
    .nullable() as z.ZodType<FavoritesTranslationKey | null>,
  description: z.string().nullable(),
  modelIcon: iconSchema,
  modelInfo: z.string(),
  modelProvider: z.string(),
});

/**
 * `favorite-created` event envelope: the server-resolved cards (skill name,
 * tagline, icon, variant model) for every row the create produced — the new
 * favorite plus any companion variants the variants-mode reconcile back-added.
 * Hoisted so onEvent can parse the wire payload explicitly — the
 * self-referential events-map inference does not reach a payloadType consumed
 * in the SAME definition's onEvent.
 */
const favoriteCreatedPayloadSchema = z.object({
  skillId: z.string(),
  favorites: z.array(favoriteCardSchema),
});

/** `favorite-deleted` payload: the display id (slug, or UUID for slugless rows) of the removed favorite. */
const favoriteDeletedPayloadSchema = z.object({
  id: z.string(),
});

/**
 * Get Favorites List Endpoint (GET)
 * Retrieves all favorites for the current user
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "agent", "skills", "favorites"],
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
              schema: favoriteCardSchema.shape.id,
            }),
            skillId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: favoriteCardSchema.shape.skillId,
            }),
            customVariantName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: favoriteCardSchema.shape.customVariantName,
            }),
            modelId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: favoriteCardSchema.shape.modelId,
            }),
            voiceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: favoriteCardSchema.shape.voiceId,
            }),
            position: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: favoriteCardSchema.shape.position,
            }),
            icon: responseField(scopedTranslation, {
              type: WidgetType.ICON,
              containerSize: "lg",
              iconSize: "lg",
              borderRadius: "lg",
              schema: favoriteCardSchema.shape.icon,
            }),
            // Flattened fields (no nested content/titleRow/modelRow objects)
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "base",
              emphasis: "bold",
              schema: favoriteCardSchema.shape.name,
            }),
            tagline: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              schema: favoriteCardSchema.shape.tagline,
            }),
            activeBadge: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              variant: "default",
              size: "xs",
              schema: favoriteCardSchema.shape.activeBadge,
            }),
            description: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              schema: favoriteCardSchema.shape.description,
            }),
            modelIcon: responseField(scopedTranslation, {
              type: WidgetType.ICON,
              iconSize: "xs",
              noHover: true,
              schema: favoriteCardSchema.shape.modelIcon,
            }),
            modelInfo: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              schema: favoriteCardSchema.shape.modelInfo,
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
              schema: favoriteCardSchema.shape.modelProvider,
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
  // subscription (on this GET endpoint) catches local and cross-instance
  // creates. The POST (create) endpoint is the relay origin (remoteEvent: true,
  // syncDomain); this GET is the local-delivery receiver — no remoteEvent flag.
  // Creation event => upsert: the payload carries the COMPLETE server-resolved
  // cards, which replace any thinner optimistic card with the same id.
  channel: { scope: "user" } as const,
  events: {
    "favorite-created": {
      operation: "upsert" as const,
      allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
      payloadType: favoriteCreatedPayloadSchema,
      onEvent: async ({ payload: rawPayload, logger }) => {
        // Explicit envelope parse (see favoriteCreatedPayloadSchema above).
        const payload = favoriteCreatedPayloadSchema.parse(rawPayload);
        const [{ apiClient }, favoritesDefinition, charactersDefinition] =
          await Promise.all([
            import("next-vibe/unified-ui/hooks/store"),
            import("./definition"),
            import("../definition"),
          ]);

        const baseSkillId = parseSkillId(payload.skillId).skillId;

        // View 1 — favorites list: upsert the server cards by id. A card already
        // present (optimistic insert) is replaced, keeping its activeBadge (the
        // create never changes which favorite is active).
        apiClient.updateEndpointData(
          favoritesDefinition.default.GET,
          logger,
          (old) => {
            if (!old?.success) {
              return old;
            }
            const incoming = new Map(payload.favorites.map((f) => [f.id, f]));
            const updated = old.data.favorites.map((existing) => {
              const card = incoming.get(existing.id);
              if (!card) {
                return existing;
              }
              incoming.delete(existing.id);
              return { ...card, activeBadge: existing.activeBadge };
            });
            return {
              ...old,
              data: {
                ...old.data,
                favorites: [...updated, ...incoming.values()],
              },
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
    // Local-delivery receiver for deletes, mirroring `favorite-created`: the
    // DELETE endpoint's own `favorite-deleted` event lives on the per-id DELETE
    // channel, which the favorites page never subscribes to (it subscribes to
    // this GET). The DELETE repository and its cross-instance applier both emit
    // here so the open list drops the card live.
    "favorite-deleted": {
      allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
      payloadType: favoriteDeletedPayloadSchema,
      onEvent: async ({ payload: rawPayload, logger }) => {
        const { id: deletedId } =
          favoriteDeletedPayloadSchema.parse(rawPayload);
        const [{ apiClient }, favoritesDefinition, charactersDefinition] =
          await Promise.all([
            import("next-vibe/unified-ui/hooks/store"),
            import("./definition"),
            import("../definition"),
          ]);

        // Read the favorite's skillId before removing it, so the characters list
        // can flip addedToFav back off for that skill.
        let deletedSkillId: string | null = null;

        // View 1 — favorites list: remove the row.
        apiClient.updateEndpointData(
          favoritesDefinition.default.GET,
          logger,
          (old) => {
            if (!old?.success) {
              return old;
            }
            const deleted = old.data.favorites.find((f) => f.id === deletedId);
            deletedSkillId = deleted?.skillId ?? null;
            return {
              ...old,
              data: {
                ...old.data,
                favorites: old.data.favorites.filter((f) => f.id !== deletedId),
              },
            };
          },
        );

        // View 2 — characters/skills list: flip addedToFav off on the skill.
        if (deletedSkillId) {
          const baseSkillId = parseSkillId(deletedSkillId).skillId;
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
