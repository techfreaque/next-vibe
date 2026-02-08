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
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  objectField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import { iconSchema } from "../../../shared/types/common.schema";
import { ModelId } from "../../models/models";
import charactersDefinitions from "../characters/definition";
import { FavoritesListContainer } from "./widget";

/**
 * Type for parent value in favorite card callbacks
 * Used to access activeBadge for conditional styling
 */
interface FavoriteCardParent {
  activeBadge: string | null;
}

/**
 * Favorite Card type - manually defined to avoid circular reference
 * This represents a single favorite card in the favorites list
 * Flattened structure - no nested content/titleRow/modelRow objects
 */
export interface FavoriteCard {
  id: string;
  characterId: string | null;
  modelId: ModelId | null;
  position: number;
  icon: z.infer<typeof iconSchema>;
  name: TranslationKey;
  tagline: TranslationKey | null;
  activeBadge: TranslationKey | null;
  description: TranslationKey | null;
  modelIcon: z.infer<typeof iconSchema>;
  modelInfo: string;
  modelProvider: string;
  creditCost: string;
}

/**
 * Get Favorites List Endpoint (GET)
 * Retrieves all favorites for the current user
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "favorites"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const, // Allow public users to use client route

  title: "app.api.agent.chat.favorites.get.title" as const,
  description: "app.api.agent.chat.favorites.get.description" as const,
  icon: "star" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.favorites" as const],

  fields: customWidgetObject({
    render: FavoritesListContainer,
    usage: { response: true } as const,
    children: {
      // Flattened top action buttons (no container wrapper)
      backButton: backButton({ usage: { response: true } }),
      title: widgetField({
        type: WidgetType.TEXT,
        content: "app.api.agent.chat.favorites.get.container.title" as const,
        usage: { response: true },
      }),
      createButton: navigateButtonField({
        targetEndpoint: charactersDefinitions.GET,
        extractParams: () => ({}),
        prefillFromGet: false,
        label: "app.api.agent.chat.favorites.get.createButton.label" as const,
        icon: "plus",
        variant: "outline",
        className: "ml-auto",
        usage: { response: true },
      }),

      // Favorites list
      favoritesList: responseArrayField(
        { type: WidgetType.CONTAINER },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.INLINE,
            gap: "4",
            alignItems: "start",
            noCard: true,
          },
          { response: true },
          {
            id: responseField({
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string().uuid(),
            }),
            characterId: responseField({
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string().nullable(),
            }),
            modelId: responseField({
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.enum(ModelId).nullable(),
            }),
            position: responseField({
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.number().int(),
            }),
            icon: responseField({
              type: WidgetType.ICON,
              containerSize: "lg",
              iconSize: "lg",
              borderRadius: "lg",
              schema: iconSchema,
              getClassName: (
                // oxlint-disable-next-line no-unused-vars
                value: undefined,
                parent?: FavoriteCardParent,
              ) => {
                return parent?.activeBadge
                  ? "bg-primary/15 text-primary"
                  : "bg-primary/10 group-hover:bg-primary/20";
              },
            }),
            // Flattened fields (no nested content/titleRow/modelRow objects)
            name: responseField({
              type: WidgetType.TEXT,
              size: "base",
              emphasis: "bold",
              schema: z.string() as z.ZodType<TranslationKey>,
              getClassName: (
                // oxlint-disable-next-line no-unused-vars
                value: undefined,
                parentValue?: FavoriteCardParent,
              ) => {
                const parent = parentValue;
                const hasActive = parent?.activeBadge;
                return hasActive ? "text-primary" : "";
              },
            }),
            tagline: responseField({
              type: WidgetType.TEXT,
              size: "sm",
              variant: "muted",
              schema: z.string().nullable() as z.ZodType<TranslationKey | null>,
            }),
            activeBadge: responseField({
              type: WidgetType.BADGE,
              variant: "default",
              size: "xs",
              schema: z.string().nullable() as z.ZodType<TranslationKey | null>,
            }),
            description: responseField({
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              schema: z.string().nullable() as z.ZodType<TranslationKey | null>,
            }),
            modelIcon: responseField({
              type: WidgetType.ICON,
              iconSize: "xs",
              noHover: true,
              schema: iconSchema,
            }),
            modelInfo: responseField({
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              schema: z.string(),
            }),
            separator1: widgetField({
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              content:
                "app.api.agent.chat.favorites.get.response.favorite.separator.content" as const,
              usage: { response: true },
            }),
            modelProvider: responseField({
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              className: "hidden sm:inline",
              schema: z.string(),
            }),
            separator2: widgetField({
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              className: "hidden sm:inline",
              content:
                "app.api.agent.chat.favorites.get.response.favorite.separator.content" as const,
              usage: { response: true },
            }),
            creditCost: responseField({
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              schema: z.string(),
            }),
          },
        ),
      ),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.favorites.get.errors.validation.title" as const,
      description:
        "app.api.agent.chat.favorites.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.favorites.get.errors.network.title" as const,
      description:
        "app.api.agent.chat.favorites.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.favorites.get.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.favorites.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.favorites.get.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.favorites.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.favorites.get.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.favorites.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.favorites.get.errors.server.title" as const,
      description:
        "app.api.agent.chat.favorites.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.favorites.get.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.favorites.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.favorites.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.favorites.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.favorites.get.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.favorites.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.favorites.get.success.title" as const,
    description:
      "app.api.agent.chat.favorites.get.success.description" as const,
  },

  examples: {
    responses: {
      listAll: {
        favoritesList: [
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            characterId: "default",
            modelId: ModelId.CLAUDE_SONNET_4_5,
            position: 0,
            icon: "sparkles",
            name: "Thea",
            tagline: "Greek goddess of light",
            activeBadge: "app.chat.selector.active",
            description: "Devoted companion with ancient wisdom",
            modelIcon: "sparkles",
            modelInfo: "Claude Sonnet 4.5",
            modelProvider: "Anthropic",
            creditCost: "1.5 credits",
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

const definitions = { GET } as const;
export default definitions;
