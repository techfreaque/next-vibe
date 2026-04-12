/**
 * Referral Payout Endpoint Definition
 * GET: user's earned balance + payout history
 * POST: submit a payout request
 */

import { z } from "zod";

import { REFERRAL_CONFIG } from "../config";

import { translatedValueSchema } from "@/app/api/[locale]/shared/types/common.schema";
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

import { UserRole } from "../../user/user-roles/enum";
import { PayoutCurrency, PayoutCurrencyDB, PayoutStatusDB } from "../enum";
import { scopedTranslation } from "../i18n";
import { ReferralPayoutContainer } from "./widget";

const allowedRoles = [
  UserRole.CUSTOMER,
  UserRole.ADMIN,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
] as const;

/**
 * GET: earned balance + payout history
 */
export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["referral", "payout"],
  title: "payout.get.title",
  description: "payout.get.description",
  category: "endpointCategories.referral",
  subCategory: "endpointCategories.referralPayouts",
  icon: "wallet",
  tags: ["tags.referral", "tags.get"],
  allowedRoles,

  fields: customWidgetObject({
    render: ReferralPayoutContainer,
    usage: { response: true } as const,
    children: {
      earnedCreditsTotal: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      earnedCreditsAvailable: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      earnedCreditsLocked: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number(),
      }),
      payoutHistory: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.array(
          z.object({
            id: z.string(),
            amountCents: z.coerce.number(),
            currency: z.enum(PayoutCurrencyDB),
            status: z.enum(PayoutStatusDB),
            walletAddress: z.string().nullable(),
            rejectionReason: z.string().nullable(),
            createdAt: z.string(),
            processedAt: z.string().nullable(),
          }),
        ),
      }),
    },
  }),

  examples: {
    responses: {
      default: {
        earnedCreditsTotal: 500,
        earnedCreditsAvailable: 500,
        earnedCreditsLocked: 0,
        payoutHistory: [],
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

/**
 * POST: submit payout request
 */
export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["referral", "payout"],
  title: "payout.post.title",
  description: "payout.post.description",
  category: "endpointCategories.referral",
  subCategory: "endpointCategories.referralPayouts",
  icon: "wallet",
  tags: ["tags.referral"],
  allowedRoles,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    noCard: true,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      amountCents: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "payout.fields.amountCents.label",
        description: "payout.fields.amountCents.description",
        placeholder: "payout.fields.amountCents.placeholder",
        schema: z.number().min(REFERRAL_CONFIG.MIN_PAYOUT_CENTS),
      }),
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "payout.fields.currency.label",
        description: "payout.fields.currency.description",
        schema: z.enum(PayoutCurrencyDB),
      }),
      walletAddress: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "payout.fields.walletAddress.label",
        description: "payout.fields.walletAddress.description",
        placeholder: "payout.fields.walletAddress.placeholder",
        schema: z.string().optional(),
      }),
      payoutRequestId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: translatedValueSchema,
      }),
    },
  }),

  examples: {
    requests: {
      default: {
        amountCents: 5000,
        currency: PayoutCurrency.CREDITS,
      },
    },
    responses: {
      default: {
        payoutRequestId: "123e4567-e89b-12d3-a456-426614174000",
        message: "Payout request submitted successfully",
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

export type PayoutGetResponseOutput = typeof GET.types.ResponseOutput;
export type PayoutPostRequestOutput = typeof POST.types.RequestOutput;
export type PayoutPostResponseOutput = typeof POST.types.ResponseOutput;

export default { GET, POST };
