/**
 * List Referral Codes API Endpoint Definition
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

import { UserRole } from "../../../user/user-roles/enum";
import { ReferralCodesListContainer } from "./widget";

/**
 * GET endpoint for listing user's referral codes
 */
export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["referral", "codes", "list"],
  title: "app.api.referral.codes.list.get.title",
  description: "app.api.referral.codes.list.get.description",
  category: "app.api.referral.category",
  icon: "gift" as const,
  tags: [
    "app.api.referral.tags.referral",
    "app.api.referral.tags.codes",
    "app.api.referral.tags.list",
  ],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: customWidgetObject({
    render: ReferralCodesListContainer,
    usage: { response: true } as const,
    children: {
      codes: responseField({
        type: WidgetType.TEXT,
        schema: z.array(
          z.object({
            code: z.string(),
            label: z.string().nullable(),
            currentUses: z.coerce.number(),
            totalSignups: z.coerce.number(),
            totalRevenueCents: z.coerce.number(),
            totalEarningsCents: z.coerce.number(),
            isActive: z.boolean(),
          }),
        ),
      }),
    },
  }),

  examples: {
    responses: {
      default: {
        codes: [
          {
            code: "FRIEND2024",
            label: "Friends & Family",
            currentUses: 5,
            totalSignups: 3,
            totalRevenueCents: 50000,
            totalEarningsCents: 5000,
            isActive: true,
          },
        ],
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.referral.errors.validation.title",
      description: "app.api.referral.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.referral.errors.notFound.title",
      description: "app.api.referral.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.referral.errors.serverError.title",
      description: "app.api.referral.errors.serverError.description",
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
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.referral.errors.conflict.title",
      description: "app.api.referral.errors.conflict.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.referral.errors.unknown.title",
      description: "app.api.referral.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.referral.errors.unsavedChanges.title",
      description: "app.api.referral.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "app.api.referral.codes.list.success.title",
    description: "app.api.referral.codes.list.success.description",
  },
});

export type CodesListGetResponseOutput = typeof GET.types.ResponseOutput;

export default { GET };
