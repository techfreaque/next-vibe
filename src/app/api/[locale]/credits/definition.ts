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

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

const CreditsBalanceContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CreditsBalanceContainer })),
);

/**
 * Get Credit Balance Endpoint (GET)
 * Retrieves current user's credit balance with breakdown
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["credits"],
  aliases: ["credits-balance"] as const,
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  category: "credits" as const,
  subCategory: "Management" as const,
  tags: ["tags.credits" as const, "tags.balance" as const],
  icon: "coins" as const,
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: CreditsBalanceContainer,
    usage: { response: true } as const,
    children: {
      // Total credits available
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.total.content" as const,
        schema: z.coerce.number(),
      }),

      expiring: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.expiring.content" as const,
        schema: z.coerce.number(),
      }),

      permanent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.permanent.content" as const,
        schema: z.coerce.number(),
      }),

      earned: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.earned.content" as const,
        schema: z.coerce.number(),
      }),

      free: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.free.content" as const,
        schema: z.coerce.number(),
      }),

      expiresAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.expiresAt.content" as const,
        schema: dateSchema.nullable(),
      }),

      capacity: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.capacity.content" as const,
        schema: z.coerce.number(),
      }),
    },
  }),

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

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

  // === WS EVENTS ===
  // Emitted by CreditRepository after every deduction - carries actual server balance.
  // Framework merges partial into GET response cache. No client-side math needed.
  events: {
    "credits-balance-updated": {
      fields: [
        "total",
        "expiring",
        "permanent",
        "earned",
        "free",
        "expiresAt",
        "capacity",
      ] as const,
      operation: "merge" as const,
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
        capacity: 1820,
      },
    },
  },
});

const definitions = { GET } as const;
export default definitions;

export type CreditsGetResponseOutput = typeof GET.types.ResponseOutput;
