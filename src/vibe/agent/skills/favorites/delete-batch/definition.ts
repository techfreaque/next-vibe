/**
 * Favorites Batch-Delete API Definition
 * Remove several favorites (e.g. every variant of one skill) in a single,
 * atomic operation. Needed because deleting a multi-variant skill by firing
 * one DELETE per variant races on the client: for public (localStorage) users
 * each DELETE is a read-modify-write, so concurrent deletes clobber one another
 * and all-but-one variant survives a page refresh. One batch op = one write.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { FAVORITES_DELETE_BATCH_ALIAS } from "../constants";
import { scopedTranslation } from "./i18n";

/**
 * Batch-Delete Favorites Endpoint (POST)
 * Remove multiple favorites by id in one call.
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "skills", "favorites", "delete-batch"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const, // public users via client route

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "trash" as const,
  category: "ai",
  subCategory: "chatFavorites",
  tags: ["tags.favorites" as const],

  aliases: [FAVORITES_DELETE_BATCH_ALIAS],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      ids: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.ids.label" as const,
        schema: z.array(z.string()).min(1),
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

  // This op owns its `favorites-deleted-batch` event. `requestFields` carries the
  // ids removed. The client onEvent drops every id from the list cache in one
  // pass; remoteEvent relays the ids cross-instance for the peer's onRemoteEvent
  // to delete the same rows.
  channel: { scope: "user" } as const,
  events: {
    "favorites-deleted-batch": {
      remoteEvent: true as const,
      syncDomain: "favorites" as const,
      operation: "merge" as const,
      allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
      requestFields: ["ids"] as const,
      onEvent: async ({ requestData, logger }) => {
        const idsToRemove = new Set(requestData.ids);
        const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
        const favoritesDefinition = await import("../definition");
        apiClient.updateEndpointData(
          favoritesDefinition.default.GET,
          logger,
          (old) => {
            if (!old?.success) {
              return old;
            }
            return {
              ...old,
              data: {
                ...old.data,
                favorites: old.data.favorites.filter(
                  (f) => !idsToRemove.has(f.id),
                ),
              },
            };
          },
        );
      },
    },
  },

  examples: {
    requests: {
      deleteBatch: {
        ids: ["thea-brilliant", "thea-cheap", "thea-oracle"],
      },
    },
    responses: {
      deleteBatch: {
        success: true,
      },
    },
  },
});

// Type exports for POST endpoint
export type FavoritesDeleteBatchRequestInput = typeof POST.types.RequestInput;
export type FavoritesDeleteBatchRequestOutput = typeof POST.types.RequestOutput;
export type FavoritesDeleteBatchResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
