/**
 * Favorites API Definition
 * Defines endpoint for listing user favorites
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  navigateButtonField,
  objectField,
  requestField,
  responseArrayField,
  responseField,
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  UserPermissionRole,
  UserRole,
} from "@/app/api/[locale]/user/user-roles/enum";

import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { DEFAULT_TTS_VOICE_ID } from "@/app/api/[locale]/agent/text-to-speech/constants";
import { TtsModelId } from "@/app/api/[locale]/agent/text-to-speech/models";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { iconSchema } from "../../../shared/types/common.schema";
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
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "favorites"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const, // Allow public users to use client route

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "star" as const,
  category: "endpointCategories.skills",
  subCategory: "endpointCategories.chatFavorites",
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
        fieldType: FieldDataType.UUID,
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
        content: "get.container.title" as const,
        usage: { response: true },
      }),
      createButton: navigateButtonField(scopedTranslation, {
        targetEndpoint: async () =>
          (await import("../skills/definition")).default.GET,
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
              size: "sm",
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

  // === WS EVENTS ===
  // Emitted by favorites mutation repositories — keeps sidebar in sync across all tabs.
  // Framework merges/removes from React Query cache automatically. No client code needed.
  events: {
    "favorite-created": {
      fields: {
        favorites: [
          "id",
          "skillId",
          "customVariantName",
          "modelId",
          "voiceId",
          "position",
          "icon",
          "name",
          "tagline",
          "activeBadge",
          "description",
          "modelIcon",
          "modelInfo",
          "modelProvider",
        ] as const,
      },
      operation: "merge" as const,
    },
    "favorite-updated": {
      fields: {
        favorites: [
          "id",
          "skillId",
          "customVariantName",
          "modelId",
          "voiceId",
          "position",
          "icon",
          "name",
          "tagline",
          "activeBadge",
          "description",
          "modelIcon",
          "modelInfo",
          "modelProvider",
        ] as const,
      },
      operation: "merge" as const,
    },
    "favorite-deleted": {
      fields: { favorites: ["id"] as const },
      operation: "remove" as const,
    },
    "favorites-reordered": {
      fields: { favorites: ["id", "position"] as const },
      operation: "merge" as const,
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
