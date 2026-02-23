/**
 * Favorites API Definition
 * Defines endpoint for listing user favorites
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedNavigateButtonField,
  scopedObjectFieldNew,
  scopedResponseArrayFieldNew,
  scopedResponseField,
  scopedWidgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { iconSchema } from "../../../shared/types/common.schema";
import { ModelId } from "../../models/models";
import { TtsVoiceValue } from "../../text-to-speech/enum";
import charactersDefinitions from "../characters/definition";
import { scopedTranslation } from "./i18n";
import { FavoritesListContainer } from "./widget";

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
  category: "category" as const,
  tags: ["tags.favorites" as const],

  fields: customWidgetObject({
    render: FavoritesListContainer,
    usage: { response: true } as const,
    children: {
      // Flattened top action buttons (no container wrapper)
      backButton: scopedBackButton(scopedTranslation, {
        usage: { response: true },
      }),
      title: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.container.title" as const,
        usage: { response: true },
      }),
      createButton: scopedNavigateButtonField(scopedTranslation, {
        targetEndpoint: charactersDefinitions.GET,
        extractParams: () => ({}),
        prefillFromGet: false,
        label: "get.createButton.label" as const,
        icon: "plus",
        variant: "outline",
        className: "ml-auto",
        usage: { response: true },
      }),

      // Favorites list
      favorites: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "4",
          alignItems: "start",
          noCard: true,
          usage: { response: true },
          children: {
            id: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string().uuid(),
            }),
            characterId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string(),
            }),
            modelId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.enum(ModelId).nullable(),
            }),
            voice: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string().nullable() as z.ZodType<
                typeof TtsVoiceValue | null
              >,
            }),
            position: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.number().int(),
            }),
            icon: scopedResponseField(scopedTranslation, {
              type: WidgetType.ICON,
              containerSize: "lg",
              iconSize: "lg",
              borderRadius: "lg",
              schema: iconSchema,
            }),
            // Flattened fields (no nested content/titleRow/modelRow objects)
            name: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "base",
              emphasis: "bold",
              schema: z.string(),
            }),
            tagline: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "sm",
              variant: "muted",
              schema: z.string().nullable(),
            }),
            activeBadge: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              variant: "default",
              size: "xs",
              schema: z.string().nullable(),
            }),
            description: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              schema: z.string().nullable(),
            }),
            modelIcon: scopedResponseField(scopedTranslation, {
              type: WidgetType.ICON,
              iconSize: "xs",
              noHover: true,
              schema: iconSchema,
            }),
            modelInfo: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              schema: z.string(),
            }),
            separator1: scopedWidgetField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              content: "get.response.favorite.separator.content" as const,
              usage: { response: true },
            }),
            modelProvider: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              className: "hidden sm:inline",
              schema: z.string(),
            }),
            separator2: scopedWidgetField(scopedTranslation, {
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

  examples: {
    responses: {
      listAll: {
        favorites: [
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            characterId: "default",
            modelId: ModelId.CLAUDE_SONNET_4_5,
            voice: TtsVoiceValue,
            position: 0,
            icon: "sparkles",
            name: "Thea",
            tagline: "Greek goddess of light",
            activeBadge: "app.chat.selector.active",
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
