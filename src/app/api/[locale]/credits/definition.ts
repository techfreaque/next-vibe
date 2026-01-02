/**
 * Credits Balance API Route Definition
 * Defines endpoint for retrieving user credit balance
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

/**
 * Get Credit Balance Endpoint (GET)
 * Retrieves current user's credit balance with breakdown
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["credits"],
  title: "app.api.agent.chat.credits.get.title",
  description: "app.api.agent.chat.credits.get.description",
  category: "app.api.agent.chat.category",
  tags: ["app.api.agent.chat.tags.credits", "app.api.agent.chat.tags.balance"],
  icon: "coins",
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.credits.get.response.title",
      description: "app.api.agent.chat.credits.get.response.description",
      layoutType: LayoutType.STACKED,
    },
    { response: true },
    {
      // Total credits available
      total: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.credits.get.total.content",
        },
        z.coerce.number(),
      ),

      // Expiring credits (from subscription)
      expiring: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.credits.get.expiring.content",
        },
        z.coerce.number(),
      ),

      // Permanent credits (from packs)
      permanent: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.credits.get.permanent.content",
        },
        z.coerce.number(),
      ),

      // Earned credits (from referrals)
      earned: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.credits.get.earned.content",
        },
        z.coerce.number(),
      ),

      // Free tier credits
      free: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.credits.get.free.content",
        },
        z.coerce.number(),
      ),

      // Expiration date for expiring credits
      expiresAt: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.credits.get.expiresAt.content",
        },
        z.string().datetime().nullable(),
      ),
    },
  ),

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.agent.chat.credits.get.success.title",
    description: "app.api.agent.chat.credits.get.success.description",
  },

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.credits.get.errors.validation.title",
      description: "app.api.agent.chat.credits.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.credits.get.errors.network.title",
      description: "app.api.agent.chat.credits.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.credits.get.errors.unauthorized.title",
      description: "app.api.agent.chat.credits.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.credits.get.errors.forbidden.title",
      description: "app.api.agent.chat.credits.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.credits.get.errors.notFound.title",
      description: "app.api.agent.chat.credits.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.credits.get.errors.server.title",
      description: "app.api.agent.chat.credits.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.credits.get.errors.unknown.title",
      description: "app.api.agent.chat.credits.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.credits.get.errors.unsavedChanges.title",
      description: "app.api.agent.chat.credits.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.credits.get.errors.conflict.title",
      description: "app.api.agent.chat.credits.get.errors.conflict.description",
    },
  },

  // === EXAMPLES ===
  examples: {
    responses: {
      default: {
        total: 1500,
        expiring: 1000,
        permanent: 500,
        earned: 0,
        free: 0,
        expiresAt: "2025-11-16T00:00:00.000Z",
      },
    },
  },
});

export { GET };
const definitions = { GET } as const;
export default definitions;

export type CreditsGetResponseOutput = typeof GET.types.ResponseOutput;
