/**
 * List Referral Codes API Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseArrayField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user/user-roles/enum";

/**
 * GET endpoint for listing user's referral codes
 */
export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["referral", "codes", "list"],
  title: "app.api.referral.codes.list.get.title",
  description: "app.api.referral.codes.list.get.description",
  category: "app.api.referral.category",
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

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.referral.codes.list.get.form.title",
      description: "app.api.referral.codes.list.get.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { response: true },
    {
      codes: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
        },
        z.object({
          id: z.string(),
          code: z.string(),
          label: z.string().nullable(),
          currentUses: z.number(),
          isActive: z.boolean(),
          createdAt: z.string(),
          totalSignups: z.number(),
          totalRevenueCents: z.number(),
          totalEarningsCents: z.number(),
        }),
      ),
    },
  ),

  examples: {
    responses: {
      default: {
        codes: [
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            code: "FRIEND2024",
            label: "Friends & Family",
            currentUses: 5,
            isActive: true,
            createdAt: "2024-01-01T00:00:00Z",
            totalSignups: 3,
            totalRevenueCents: 50000,
            totalEarningsCents: 5000,
          },
        ],
      },
      success: {
        codes: [
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            code: "FRIEND2024",
            label: "Friends & Family",
            currentUses: 5,
            isActive: true,
            createdAt: "2024-01-01T00:00:00Z",
            totalSignups: 3,
            totalRevenueCents: 50000,
            totalEarningsCents: 5000,
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
