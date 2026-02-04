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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

/**
 * Reorder Favorites Endpoint (POST)
 * Batch update positions for favorites
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["agent", "chat", "favorites", "reorder"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const, // Allow public users to use client route

  title: "app.api.agent.chat.favorites.reorder.post.title" as const,
  description: "app.api.agent.chat.favorites.reorder.post.description" as const,
  icon: "move" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.favorites" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
    },
    { request: "data", response: true },
    {
      positions: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.favorites.reorder.post.positions.label" as const,
        schema: z.array(
          z.object({
            id: z.string().uuid(),
            position: z.number().int().min(0),
          }),
        ),
      }),
      success: responseField({
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.favorites.reorder.post.errors.validation.title" as const,
      description:
        "app.api.agent.chat.favorites.reorder.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.favorites.reorder.post.errors.network.title" as const,
      description:
        "app.api.agent.chat.favorites.reorder.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.favorites.reorder.post.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.favorites.reorder.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.favorites.reorder.post.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.favorites.reorder.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.favorites.reorder.post.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.favorites.reorder.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.favorites.reorder.post.errors.server.title" as const,
      description:
        "app.api.agent.chat.favorites.reorder.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.favorites.reorder.post.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.favorites.reorder.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.favorites.reorder.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.favorites.reorder.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.favorites.reorder.post.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.favorites.reorder.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.favorites.reorder.post.success.title" as const,
    description:
      "app.api.agent.chat.favorites.reorder.post.success.description" as const,
  },

  examples: {
    requests: {
      reorder: {
        positions: [
          { id: "550e8400-e29b-41d4-a716-446655440000", position: 0 },
          { id: "550e8400-e29b-41d4-a716-446655440001", position: 1 },
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
