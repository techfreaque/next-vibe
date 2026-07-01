/**
 * List Referral Codes API Endpoint Definition
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "../../i18n";

const ReferralCodesListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ReferralCodesListContainer })),
);

/**
 * GET endpoint for listing user's referral codes
 */
export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["referral", "codes", "list"],
  title: "codes.list.get.title" as const,
  titleShort: "codes.list.get.titleShort" as const,
  description: "codes.list.get.description" as const,
  category: "referral" as const,
  subCategory: "Program" as const,
  icon: "gift" as const,
  tags: ["tags.referral", "tags.codes", "tags.list"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: customWidgetObject({
    render: ReferralCodesListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // Admin override: view another user's referral codes
      targetUserId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.title" as const,
        hidden: true,
        schema: z.string().optional(),
      }),
      codes: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.array(
          z.object({
            code: z.string(),
            label: z.string().nullable(),
            currentVisitors: z.coerce.number(),
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
    requests: {
      default: {},
      adminView: {
        targetUserId: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        codes: [
          {
            code: "FRIEND2024",
            label: "Friends & Family" as const,
            currentVisitors: 5,
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
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.serverError.title" as const,
      description: "errors.serverError.description" as const,
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
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
  },
  successTypes: {
    title: "success.title" as const,
    description: "success.description" as const,
  },
});

export type CodesListGetResponseOutput = typeof GET.types.ResponseOutput;
export type ReferralCode = CodesListGetResponseOutput["codes"][number];

export default { GET } as const;
