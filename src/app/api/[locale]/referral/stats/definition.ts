/**
 * Referral Stats API Definition
 * Defines the API endpoint for referral statistics
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

import { UserRole } from "../../user/user-roles/enum";

/**
 * GET endpoint for referral stats
 */
export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["referral", "stats"],
  title: "app.api.referral.stats.get.title",
  description: "app.api.referral.stats.get.description",
  category: "app.api.referral.category",
  tags: ["app.api.referral.tags.referral", "app.api.referral.tags.get"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.referral.stats.get.form.title",
      description: "app.api.referral.stats.get.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { response: true },
    {
      totalReferrals: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.tags.browserAutomation",
        },
        z.number(),
      ),
      totalEarningsCents: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.tags.browserAutomation",
        },
        z.number(),
      ),
      pendingEarningsCents: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.tags.browserAutomation",
        },
        z.number(),
      ),
      confirmedEarningsCents: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.tags.browserAutomation",
        },
        z.number(),
      ),
      currency: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.tags.browserAutomation",
        },
        z.string(),
      ),
    },
  ),

  examples: {
    responses: {
      default: {
        totalReferrals: 10,
        totalEarningsCents: 5000,
        pendingEarningsCents: 1000,
        confirmedEarningsCents: 4000,
        currency: "EUR",
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
