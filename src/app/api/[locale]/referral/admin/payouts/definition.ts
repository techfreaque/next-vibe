/**
 * Admin Referral Payouts Endpoint Definition
 * GET: list all payout requests (with optional status filter)
 * POST: admin action (approve / reject / complete)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
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
import {
  PayoutCurrencyDB,
  PayoutStatusDB,
  PayoutStatusOptions,
} from "../../enum";
import { scopedTranslation } from "../../i18n";
import { AdminPayoutsContainer } from "./widget";

/**
 * GET: list all payout requests
 */
export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["referral", "admin", "payouts"],
  title: "admin.payouts.get.title",
  description: "admin.payouts.get.description",
  category: "app.endpointCategories.referral",
  icon: "wallet",
  tags: ["tags.referral", "tags.get"],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: AdminPayoutsContainer,
    usage: { request: "data", response: true } as const,
    children: {
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "admin.payouts.fields.status.label",
        description: "admin.payouts.fields.status.description",
        schema: z.enum(PayoutStatusDB).optional(),
        options: PayoutStatusOptions,
      }),
      items: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.array(
          z.object({
            id: z.string(),
            userId: z.string(),
            userEmail: z.string(),
            amountCents: z.coerce.number(),
            currency: z.enum(PayoutCurrencyDB),
            status: z.enum(PayoutStatusDB),
            walletAddress: z.string().nullable(),
            adminNotes: z.string().nullable(),
            rejectionReason: z.string().nullable(),
            createdAt: z.string(),
            processedAt: z.string().nullable(),
          }),
        ),
      }),
      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
    },
  }),

  examples: {
    requests: { default: {} },
    responses: {
      default: { items: [], totalCount: 0 },
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
  successTypes: { title: "success.title", description: "success.description" },
});

/**
 * POST: admin action (approve / reject / complete)
 */
export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["referral", "admin", "payouts"],
  title: "admin.payouts.post.title",
  description: "admin.payouts.post.description",
  category: "app.endpointCategories.referral",
  icon: "wallet",
  tags: ["tags.referral"],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    noCard: true,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      requestId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "admin.payouts.fields.requestId.label",
        description: "admin.payouts.fields.requestId.description",
        schema: z.string().uuid(),
      }),
      action: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "admin.payouts.fields.action.label",
        description: "admin.payouts.fields.action.description",
        schema: z.enum(["approve", "reject", "complete"] as const),
      }),
      adminNotes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "admin.payouts.fields.adminNotes.label",
        description: "admin.payouts.fields.adminNotes.description",
        schema: z.string().optional(),
      }),
      rejectionReason: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "admin.payouts.fields.rejectionReason.label",
        description: "admin.payouts.fields.rejectionReason.description",
        schema: z.string().optional(),
      }),
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
    },
  }),

  examples: {
    requests: {
      default: {
        requestId: "123e4567-e89b-12d3-a456-426614174000",
        action: "approve" as const,
      },
    },
    responses: {
      default: { success: true, message: "Payout request approved" },
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
  successTypes: { title: "success.title", description: "success.description" },
});

export type AdminPayoutsGetResponseOutput = typeof GET.types.ResponseOutput;
export type AdminPayoutsGetRequestOutput = typeof GET.types.RequestOutput;
export type AdminPayoutsPostRequestOutput = typeof POST.types.RequestOutput;
export type AdminPayoutsPostResponseOutput = typeof POST.types.ResponseOutput;

export default { GET, POST };
