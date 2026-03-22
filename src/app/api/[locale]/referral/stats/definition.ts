/**
 * Referral Stats API Definition
 * Defines the API endpoint for referral statistics
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

import { UserRole } from "../../user/user-roles/enum";
import { type ReferralTranslationKey, scopedTranslation } from "../i18n";
import { REFERRAL_STATS_ALIAS } from "./constants";
import { ReferralStatsContainer } from "./widget";

/**
 * GET endpoint for referral stats
 */
export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["referral", "stats"],
  aliases: [REFERRAL_STATS_ALIAS],
  title: "stats.get.title",
  description: "stats.get.description",
  category: "app.endpointCategories.referral",
  icon: "trending-up",
  tags: ["tags.referral", "tags.get"],
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
      totalSignupsTitle: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string() as z.ZodType<ReferralTranslationKey>,
      }),
      totalSignupsValue: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      totalSignupsDescription: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string() as z.ZodType<ReferralTranslationKey>,
      }),

      totalRevenueTitle: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string() as z.ZodType<ReferralTranslationKey>,
      }),
      totalRevenueValue: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      totalRevenueDescription: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string() as z.ZodType<ReferralTranslationKey>,
      }),

      totalEarnedTitle: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string() as z.ZodType<ReferralTranslationKey>,
      }),
      totalEarnedValue: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      totalEarnedDescription: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string() as z.ZodType<ReferralTranslationKey>,
      }),

      availableCreditsTitle: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string() as z.ZodType<ReferralTranslationKey>,
      }),
      availableCreditsValue: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      availableCreditsDescription: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string() as z.ZodType<ReferralTranslationKey>,
      }),
      availableCreditsReadyForPayout: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),
    },
  }),

  examples: {
    responses: {
      default: {
        totalSignupsTitle: "fields.totalSignups",
        totalSignupsValue: 10,
        totalSignupsDescription: "fields.totalSignupsDescription",

        totalRevenueTitle: "fields.totalRevenue",
        totalRevenueValue: 8000,
        totalRevenueDescription: "fields.totalRevenueDescription",

        totalEarnedTitle: "fields.totalEarned",
        totalEarnedValue: 1600,
        totalEarnedDescription: "fields.totalEarnedDescription",

        availableCreditsTitle: "fields.availableBalance",
        availableCreditsValue: 1600,
        availableCreditsDescription: "fields.availableBalanceDescription",
        availableCreditsReadyForPayout: false,
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.serverError.title",
      description: "errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
  },

  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

export type StatsGetResponseOutput = typeof GET.types.ResponseOutput;

export default { GET };
