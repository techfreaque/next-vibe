/**
 * Favorites API Definition
 * Defines endpoint for listing user favorites
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  navigateButtonField,
  widgetField,
  widgetObjectField,
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
import favoriteDefinition from "./[id]/definition";
import createDefinitions from "./create/definition";

/**
 * Get Favorites List Endpoint (GET)
 * Retrieves all favorites for the current user
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "favorites"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.favorites.get.title" as const,
  description: "app.api.agent.chat.favorites.get.description" as const,
  icon: "star" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.favorites" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
      noCard: true,
      gap: "6",
    },
    { response: true },
    {
      // Top action buttons container (widget object field - pure UI, no response data)
      topActions: widgetObjectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "2",
          noCard: true,
        },
        { response: true },
        {
          backButton: backButton({ usage: { response: true } }),
          title: widgetField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.favorites.get.container.title" as const,
            usage: { response: true },
          }),
          createButton: navigateButtonField({
            targetEndpoint: createDefinitions.POST,
            extractParams: () => ({}),
            prefillFromGet: false,
            label:
              "app.api.agent.chat.favorites.get.createButton.label" as const,
            icon: "plus",
            variant: "ghost",
            className: "ml-auto",
            usage: { response: true },
          }),
        },
      ),

      // Favorites list
      favoritesList: responseArrayField(
        {
          type: WidgetType.DATA_CARDS,
          layout: { type: LayoutType.GRID, columns: 1, spacing: "normal" },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.INLINE,
            gap: "4",
            alignItems: "start",
            noCard: true,
            className: "group",
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
            icon: responseField({
              type: WidgetType.ICON,
              containerSize: "lg",
              iconSize: "base",
              borderRadius: "lg",
              schema: iconSchema,
            }),
            content: objectField(
              {
                type: WidgetType.CONTAINER,
                layoutType: LayoutType.STACKED,
                gap: "0",
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
                      schema: z
                        .string()
                        .nullable() as z.ZodType<TranslationKey | null>,
                    }),
                  },
                ),
                description: responseField({
                  type: WidgetType.TEXT,
                  size: "xs",
                  variant: "muted",
                  schema: z
                    .string()
                    .nullable() as z.ZodType<TranslationKey | null>,
                }),
                modelRow: objectField(
                  {
                    type: WidgetType.CONTAINER,
                    layoutType: LayoutType.INLINE,
                    gap: "1",
                    noCard: true,
                  },
                  { response: true },
                  {
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
                      schema: z.string(),
                    }),
                    separator2: widgetField({
                      type: WidgetType.TEXT,
                      size: "xs",
                      variant: "muted",
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
              },
            ),
            editButton: navigateButtonField({
              icon: "pencil",
              variant: "ghost",
              size: "sm",
              targetEndpoint: favoriteDefinition.PATCH,
              extractParams: (favorite) => ({
                urlPathParams: { id: String(favorite.id) },
              }),
              prefillFromGet: true,
              getEndpoint: favoriteDefinition.GET,
              usage: { response: true },
            }),
            deleteButton: navigateButtonField({
              icon: "trash",
              variant: "ghost",
              size: "sm",
              targetEndpoint: favoriteDefinition.DELETE,
              extractParams: (favorite) => ({
                urlPathParams: { id: String(favorite.id) },
              }),
              prefillFromGet: false,
              renderInModal: true,
              usage: { response: true },
            }),
          },
        ),
      ),
    },
  ),

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
            icon: "sparkles",
            content: {
              titleRow: {
                name: "Thea",
                tagline: "Greek goddess of light",
              },
              description: "Devoted companion with ancient wisdom",
              modelRow: {
                modelIcon: "sparkles",
                modelInfo: "Claude Sonnet 4.5",
                modelProvider: "Anthropic",
                creditCost: "1.5 credits",
              },
            },
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

// Individual favorite card type from GET response (display fields only)
export type FavoriteCard = FavoritesListResponseOutput["favoritesList"][number];

const definitions = { GET } as const;
export default definitions;
