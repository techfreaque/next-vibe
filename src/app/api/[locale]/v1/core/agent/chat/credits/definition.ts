/**
 * Credits Balance API Route Definition
 * Defines endpoint for retrieving user credit balance
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";

import { UserRole } from "../../../user/user-roles/enum";

/**
 * Get Credit Balance Endpoint (GET)
 * Retrieves current user's credit balance with breakdown
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "agent", "chat", "credits"],
  title: "app.api.v1.core.agent.chat.credits.get.title",
  description: "app.api.v1.core.agent.chat.credits.get.description",
  category: "app.api.v1.core.agent.chat.category",
  tags: [
    "app.api.v1.core.agent.chat.tags.credits",
    "app.api.v1.core.agent.chat.tags.balance",
  ],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.chat.credits.get.response.title",
      description:
        "app.api.v1.core.agent.chat.credits.get.response.description",
      layout: { type: LayoutType.STACKED },
    },
    {
      [Methods.GET]: { response: true },
    },
    {
      // Total credits available
      total: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.agent.chat.credits.get.total.content",
        },
        z.number().int(),
      ),

      // Expiring credits (from subscription)
      expiring: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.agent.chat.credits.get.expiring.content",
        },
        z.number().int(),
      ),

      // Permanent credits (from packs)
      permanent: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.agent.chat.credits.get.permanent.content",
        },
        z.number().int(),
      ),

      // Free tier credits
      free: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.agent.chat.credits.get.free.content",
        },
        z.number().int(),
      ),

      // Expiration date for expiring credits
      expiresAt: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.agent.chat.credits.get.expiresAt.content",
        },
        z.string().datetime().nullable(),
      ),
    },
  ),

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.agent.chat.credits.get.success.title",
    description: "app.api.v1.core.agent.chat.credits.get.success.description",
  },

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.agent.chat.credits.get.errors.validation.title",
      description:
        "app.api.v1.core.agent.chat.credits.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.agent.chat.credits.get.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.credits.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.agent.chat.credits.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.credits.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.agent.chat.credits.get.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.credits.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.agent.chat.credits.get.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.credits.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.agent.chat.credits.get.errors.server.title",
      description:
        "app.api.v1.core.agent.chat.credits.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.agent.chat.credits.get.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.credits.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.credits.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.credits.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.agent.chat.credits.get.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.credits.get.errors.conflict.description",
    },
  },

  // === EXAMPLES ===
  examples: {
    responses: {
      default: {
        total: 1500,
        expiring: 1000,
        permanent: 500,
        free: 0,
        expiresAt: "2025-11-16T00:00:00.000Z",
      },
    },
  },
});

export default { GET };

export type CreditsGetResponseOutput = typeof GET.types.ResponseOutput;
