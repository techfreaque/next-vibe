/**
 * Referral Stats API Definition
 * Defines the API endpoint for referral statistics
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { UserRole } from "../../user/user-roles/enum";

/**
 * GET endpoint for referral stats
 */
export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "referral", "stats"],
  title: "app.api.v1.core.referral.stats.get.title",
  description: "app.api.v1.core.referral.stats.get.description",
  category: "app.api.v1.core.referral.category",
  tags: [
    "app.api.v1.core.referral.tags.referral",
    "app.api.v1.core.referral.tags.get",
  ],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.referral.stats.get.form.title",
      description: "app.api.v1.core.referral.stats.get.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { response: true },
    {
      totalReferrals: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.tags.browserAutomation",
        },
        z.number(),
      ),
      totalEarningsCents: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.tags.browserAutomation",
        },
        z.number(),
      ),
      pendingEarningsCents: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.tags.browserAutomation",
        },
        z.number(),
      ),
      confirmedEarningsCents: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.tags.browserAutomation",
        },
        z.number(),
      ),
      currency: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.tags.browserAutomation",
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
      title: "app.api.v1.core.referral.errors.validation.title",
      description: "app.api.v1.core.referral.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.referral.errors.network.title",
      description: "app.api.v1.core.referral.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.referral.errors.unauthorized.title",
      description: "app.api.v1.core.referral.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.referral.errors.forbidden.title",
      description: "app.api.v1.core.referral.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.referral.errors.notFound.title",
      description: "app.api.v1.core.referral.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.referral.errors.serverError.title",
      description: "app.api.v1.core.referral.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.referral.errors.unknown.title",
      description: "app.api.v1.core.referral.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.referral.errors.unsavedChanges.title",
      description: "app.api.v1.core.referral.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.referral.errors.conflict.title",
      description: "app.api.v1.core.referral.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.referral.stats.success.title",
    description: "app.api.v1.core.referral.stats.success.description",
  },
});

export type StatsGetResponseOutput = typeof GET.types.ResponseOutput;

export default { GET };
