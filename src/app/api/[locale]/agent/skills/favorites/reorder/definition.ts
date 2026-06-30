/**
 * Favorites Reorder API Definition
 * Batch update positions for favorites
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { FAVORITES_REORDER_ALIAS } from "../constants";
import { scopedTranslation } from "./i18n";

/**
 * Reorder Favorites Endpoint (POST)
 * Batch update positions for favorites
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "chat", "favorites", "reorder"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const, // Allow public users to use client route

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "move" as const,
  category: "ai",
  subCategory: "chatFavorites",
  tags: ["tags.favorites" as const],

  aliases: [FAVORITES_REORDER_ALIAS],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      positions: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.positions.label" as const,
        schema: z.array(
          z.object({
            id: z.string(),
            position: z.number().int().min(0),
          }),
        ),
      }),
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
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

  // This op owns its `favorites-reordered` event. `requestFields` carries the new
  // positions the user submitted. Client onEvent patches each favorite's position
  // in the list cache; remoteEvent relays cross-instance, where the route's
  // onRemoteEvent applies the same reorder by id.
  events: {
    "favorites-reordered": {
      remoteEvent: true as const,
      syncDomain: "favorites" as const,
      operation: "merge" as const,
      allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
      requestFields: ["positions"] as const,
      onEvent: async ({ requestData, logger }) => {
        const positionById = new Map<string, number>(
          requestData.positions.map((p) => [p.id, p.position] as const),
        );
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const favoritesDefinition = await import("../definition");
        apiClient.updateEndpointData(
          favoritesDefinition.default.GET,
          logger,
          (old) => {
            if (!old?.success) {
              return old;
            }
            const favorites = old.data.favorites.map((f) => {
              const next = positionById.get(f.id);
              const position: number | null = next ?? f.position;
              return { ...f, position };
            });
            favorites.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
            return { ...old, data: { ...old.data, favorites } };
          },
        );
      },
    },
  },

  examples: {
    requests: {
      reorder: {
        positions: [
          { id: "thea", position: 0 },
          { id: "hermes-technical", position: 1 },
        ],
      },
    },
    responses: {
      reorder: {
        success: true,
      },
    },
  },
});

// Type exports for POST endpoint
export type FavoritesReorderRequestInput = typeof POST.types.RequestInput;
export type FavoritesReorderRequestOutput = typeof POST.types.RequestOutput;
export type FavoritesReorderResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
