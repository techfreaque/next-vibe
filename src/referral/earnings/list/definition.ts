/**
 * Referral Earnings List API Definition
 * Defines the API endpoint for listing referral earnings with pagination
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { ReferralEarningStatus, ReferralEarningStatusDB } from "../../enum";
import { scopedTranslation } from "../../i18n";

const EarningsListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.EarningsListContainer })),
);

/**
 * GET endpoint for earnings list
 */
export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["referral", "earnings", "list"],
  title: "earnings.list.get.title" as const,
  titleShort: "earnings.list.get.titleShort" as const,
  description: "earnings.list.get.description" as const,
  category: "referral" as const,
  subCategory: "Program" as const,
  icon: "dollar-sign" as const,
  tags: ["tags.referral", "tags.earnings", "tags.list"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: customWidgetObject({
    render: EarningsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // Admin override: view another user's referral earnings
      targetUserId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "earnings.list.get.form.targetUserId" as const,
        hidden: true,
        includeInCacheKey: true,
        schema: z.string().optional(),
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "earnings.list.get.form.limit.label" as const,
        description: "earnings.list.get.form.limit.description" as const,
        hidden: true,
        schema: z.coerce.number().int().positive().max(200).optional(),
      }),
      offset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "earnings.list.get.form.offset.label" as const,
        description: "earnings.list.get.form.offset.description" as const,
        hidden: true,
        schema: z.coerce.number().int().min(0).optional(),
      }),
      earnings: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.array(
          z.object({
            id: z.string(),
            earnerUserId: z.string(),
            sourceUserId: z.string(),
            transactionId: z.string(),
            level: z.coerce.number(),
            amountCents: z.coerce.number(),
            currency: z.string(),
            status: z.enum(ReferralEarningStatusDB),
            createdAt: dateSchema,
          }),
        ),
      }),
      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
    },
  }),

  options: {
    formOptions: { autoSubmit: true, debounceMs: 0 },
  },

  examples: {
    requests: {
      default: {},
      firstPage: { limit: 25, offset: 0 },
    },
    responses: {
      default: {
        earnings: [
          {
            id: "123e4567-e89b-12d3-a456-426614174201",
            earnerUserId: "123e4567-e89b-12d3-a456-426614174000",
            sourceUserId: "123e4567-e89b-12d3-a456-426614174001",
            transactionId: "123e4567-e89b-12d3-a456-426614174301",
            level: 1,
            amountCents: 200,
            currency: "USD",
            status: ReferralEarningStatus.CONFIRMED,
            createdAt: "2026-11-18T15:20:00.000Z",
          },
        ],
        totalCount: 1,
      },
      firstPage: {
        earnings: [],
        totalCount: 0,
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

export type EarningsListGetResponseOutput = typeof GET.types.ResponseOutput;

export default { GET } as const;
