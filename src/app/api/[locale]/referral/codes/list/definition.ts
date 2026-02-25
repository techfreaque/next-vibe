/**
 * List Referral Codes API Endpoint Definition
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

import { UserRole } from "../../../user/user-roles/enum";
import { scopedTranslation } from "../../i18n";
import { ReferralCodesListContainer } from "./widget";

/**
 * GET endpoint for listing user's referral codes
 */
export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["referral", "codes", "list"],
  title: "get.title",
  description: "get.description",
  category: "app.endpointCategories.referral",
  icon: "gift",
  tags: ["tags.referral", "tags.codes", "tags.list"],
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
      codes: scopedResponseField(scopedTranslation, {
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
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.serverError.title",
      description: "errors.serverError.description",
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
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

export type CodesListGetResponseOutput = typeof GET.types.ResponseOutput;

export default { GET };
