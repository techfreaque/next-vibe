/**
 * Referral Earnings List API Definition
 * Defines the API endpoint for listing referral earnings with pagination
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user/user-roles/enum";
import { scopedTranslation } from "../../i18n";

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

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.form.title" as const,
    description: "get.form.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // Admin override: view another user's referral earnings
      targetUserId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.title" as const,
        hidden: true,
        schema: z.string().optional(),
      }),
      // Request fields
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.form.limit.label" as const,
        description: "get.form.limit.description" as const,
        schema: z.coerce.number().positive().optional(),
      }),
      offset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.form.offset.label" as const,
        description: "get.form.offset.description" as const,
        schema: z.coerce.number().min(0).optional(),
      }),

      // Response fields
      earnings: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.id" as const,
              schema: z.string(),
            }),
            earnerUserId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.earnerUserId" as const,
              schema: z.string(),
            }),
            sourceUserId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.sourceUserId" as const,
              schema: z.string(),
            }),
            transactionId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.transactionId" as const,
              schema: z.string(),
            }),
            level: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.level" as const,
              schema: z.coerce.number(),
            }),
            amountCents: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.amountCents" as const,
              schema: z.coerce.number(),
            }),
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.currency" as const,
              schema: z.string(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.status" as const,
              schema: z.string(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.createdAt" as const,
              schema: z.string(),
            }),
          },
        }),
      }),
      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalCount" as const,
        schema: z.coerce.number(),
      }),
    },
  }),

  examples: {
    requests: {
      default: {},
    },
    responses: {
      default: {
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
