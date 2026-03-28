/**
 * Credits Balance API Route Definition
 * Defines endpoint for retrieving user credit balance
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { dateSchema } from "../shared/types/common.schema";
import { scopedTranslation } from "./i18n";
import { CreditsBalanceContainer } from "./widget";

/**
 * Get Credit Balance Endpoint (GET)
 * Retrieves current user's credit balance with breakdown
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["credits"],
  title: "get.title",
  description: "get.description",
  category: "endpointCategories.credits",
  tags: ["tags.credits", "tags.balance"],
  icon: "coins",
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: CreditsBalanceContainer,
    usage: { response: true } as const,
    children: {
      // Total credits available
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.total.content",
        schema: z.coerce.number(),
      }),

      // Expiring credits (from subscription)
      expiring: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.expiring.content",
        schema: z.coerce.number(),
      }),

      // Permanent credits (from packs)
      permanent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.permanent.content",
        schema: z.coerce.number(),
      }),

      // Earned credits (from referrals)
      earned: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.earned.content",
        schema: z.coerce.number(),
      }),

      // Free tier credits
      free: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.free.content",
        schema: z.coerce.number(),
      }),

      // Expiration date for expiring credits
      expiresAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.expiresAt.content",
        schema: dateSchema.nullable(),
      }),
    },
  }),

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
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

const definitions = { GET } as const;
export default definitions;

export type CreditsGetResponseOutput = typeof GET.types.ResponseOutput;
