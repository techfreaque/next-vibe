/**
 * Referral Stats API Definition
 * Defines the API endpoint for referral statistics
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import { responseField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../i18n";
import { REFERRAL_STATS_ALIAS } from "./constants";

const ReferralStatsContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ReferralStatsContainer })),
);

/**
 * GET endpoint for referral stats
 */
export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["referral", "stats"],
  aliases: [REFERRAL_STATS_ALIAS],
  title: "stats.get.title" as const,
  titleShort: "stats.get.titleShort" as const,
  description: "stats.get.description" as const,
  category: "referral" as const,
  subCategory: "Program" as const,
  icon: "trending-up" as const,
  tags: ["tags.referral" as const, "tags.get" as const],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,
  defaultWebPinned: [
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
        schema: scopedTranslation.translationKeySchema(),
      }),
      totalSignupsValue: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      totalSignupsDescription: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: scopedTranslation.translationKeySchema(),
      }),

      totalRevenueTitle: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: scopedTranslation.translationKeySchema(),
      }),
      totalRevenueValue: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      totalRevenueDescription: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: scopedTranslation.translationKeySchema(),
      }),

      totalEarnedTitle: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: scopedTranslation.translationKeySchema(),
      }),
      totalEarnedValue: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      totalEarnedDescription: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: scopedTranslation.translationKeySchema(),
      }),

      availableCreditsTitle: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: scopedTranslation.translationKeySchema(),
      }),
      availableCreditsValue: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      availableCreditsDescription: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: scopedTranslation.translationKeySchema(),
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
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.serverError.title" as const,
      description: "errors.serverError.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "success.title" as const,
    description: "success.description" as const,
  },
});

export type StatsGetResponseOutput = typeof GET.types.ResponseOutput;

export default { GET } as const;
