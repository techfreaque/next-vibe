/**
 * Referral Earnings List API Definition
 * Defines the API endpoint for listing referral earnings with pagination
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseArrayFieldNew,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
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
  title: "earnings.list.get.title",
  description: "earnings.list.get.description",
  category: "app.endpointCategories.referral",
  icon: "dollar-sign",
  tags: ["tags.referral", "tags.earnings", "tags.list"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.form.title",
    description: "get.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // Admin override: view another user's referral earnings
      targetUserId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.title" as const,
        hidden: true,
        schema: z.string().optional(),
      }),
      // Request fields
      limit: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.form.limit.label",
        description: "get.form.limit.description",
        schema: z.coerce.number().positive().optional(),
      }),
      offset: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.form.offset.label",
        description: "get.form.offset.description",
        schema: z.coerce.number().min(0).optional(),
      }),

      // Response fields
      earnings: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.id",
              schema: z.string(),
            }),
            earnerUserId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.earnerUserId",
              schema: z.string(),
            }),
            sourceUserId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.sourceUserId",
              schema: z.string(),
            }),
            transactionId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.transactionId",
              schema: z.string(),
            }),
            level: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.level",
              schema: z.coerce.number(),
            }),
            amountCents: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.amountCents",
              schema: z.coerce.number(),
            }),
            currency: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.currency",
              schema: z.string(),
            }),
            status: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.status",
              schema: z.string(),
            }),
            createdAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.earnings.createdAt",
              schema: z.string(),
            }),
          },
        }),
      }),
      totalCount: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalCount",
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

export type EarningsListGetResponseOutput = typeof GET.types.ResponseOutput;

export default { GET };
