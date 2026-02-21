/**
 * Referral Stats API Definition
 * Defines the API endpoint for referral statistics
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../user/user-roles/enum";
import { ReferralStatsContainer } from "./widget";

/**
 * GET endpoint for referral stats
 */
export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["referral", "stats"],
  title: "app.api.referral.stats.get.title",
  description: "app.api.referral.stats.get.description",
  category: "app.api.payment.category",
  icon: "trending-up" as const,
  tags: ["app.api.referral.tags.referral", "app.api.referral.tags.get"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: customWidgetObject({
    render: ReferralStatsContainer,
    usage: { response: true } as const,
    children: {
      totalSignupsTitle: responseField({
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      totalSignupsValue: responseField({
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      totalSignupsDescription: responseField({
        type: WidgetType.TEXT,
        schema: z.string(),
      }),

      totalRevenueTitle: responseField({
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      totalRevenueValue: responseField({
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      totalRevenueDescription: responseField({
        type: WidgetType.TEXT,
        schema: z.string(),
      }),

      totalEarnedTitle: responseField({
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      totalEarnedValue: responseField({
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      totalEarnedDescription: responseField({
        type: WidgetType.TEXT,
        schema: z.string(),
      }),

      availableCreditsTitle: responseField({
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      availableCreditsValue: responseField({
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      availableCreditsDescription: responseField({
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
    },
  }),

  examples: {
    responses: {
      default: {
        totalSignupsTitle: "app.api.referral.stats.fields.totalSignups",
        totalSignupsValue: 10,
        totalSignupsDescription:
          "app.api.referral.stats.fields.totalSignupsDescription",

        totalRevenueTitle: "app.api.referral.stats.fields.totalRevenue",
        totalRevenueValue: 8000,
        totalRevenueDescription:
          "app.api.referral.stats.fields.totalRevenueDescription",

        totalEarnedTitle: "app.api.referral.stats.fields.totalEarned",
        totalEarnedValue: 1600,
        totalEarnedDescription:
          "app.api.referral.stats.fields.totalEarnedDescription",

        availableCreditsTitle: "app.api.referral.stats.fields.availableBalance",
        availableCreditsValue: 1600,
        availableCreditsDescription:
          "app.api.referral.stats.fields.availableBalanceDescription",
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.referral.errors.validation.title",
      description: "app.api.referral.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.referral.errors.network.title",
      description: "app.api.referral.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.referral.errors.unauthorized.title",
      description: "app.api.referral.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.referral.errors.forbidden.title",
      description: "app.api.referral.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.referral.errors.notFound.title",
      description: "app.api.referral.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.referral.errors.serverError.title",
      description: "app.api.referral.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.referral.errors.unknown.title",
      description: "app.api.referral.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.referral.errors.unsavedChanges.title",
      description: "app.api.referral.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.referral.errors.conflict.title",
      description: "app.api.referral.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.referral.stats.success.title",
    description: "app.api.referral.stats.success.description",
  },
});

export type StatsGetResponseOutput = typeof GET.types.ResponseOutput;

export default { GET };
