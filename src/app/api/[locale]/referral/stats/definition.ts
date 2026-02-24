/**
 * Referral Stats API Definition
 * Defines the API endpoint for referral statistics
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../user/user-roles/enum";
import { type ReferralTranslationKey, scopedTranslation } from "../i18n";
import { ReferralStatsContainer } from "./widget";

/**
 * GET endpoint for referral stats
 */
export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["referral", "stats"],
  title: "get.title",
  description: "get.description",
  category: "category",
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
      totalSignupsTitle: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string() as z.ZodType<ReferralTranslationKey>,
      }),
      totalSignupsValue: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      totalSignupsDescription: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string() as z.ZodType<ReferralTranslationKey>,
      }),

      totalRevenueTitle: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string() as z.ZodType<ReferralTranslationKey>,
      }),
      totalRevenueValue: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      totalRevenueDescription: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string() as z.ZodType<ReferralTranslationKey>,
      }),

      totalEarnedTitle: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string() as z.ZodType<ReferralTranslationKey>,
      }),
      totalEarnedValue: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      totalEarnedDescription: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string() as z.ZodType<ReferralTranslationKey>,
      }),

      availableCreditsTitle: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string() as z.ZodType<ReferralTranslationKey>,
      }),
      availableCreditsValue: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      availableCreditsDescription: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string() as z.ZodType<ReferralTranslationKey>,
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
