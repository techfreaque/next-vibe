/**
 * Subscription Checkout API Definition
 * Defines endpoints for creating subscription checkout sessions
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { BillingInterval, SubscriptionPlan } from "../../subscription/enum";
import {
  PaymentProvider,
  PaymentProviderDB,
  PaymentProviderOptions,
} from "../enum";
import { scopedTranslation } from "./i18n";

/**
 * POST endpoint for creating subscription checkout sessions
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "checkout"],
  title: "title" as const,
  description: "description" as const,
  category: "app.endpointCategories.payment",
  icon: "credit-card" as const,
  tags: [
    "tags.subscription" as const,
    "tags.checkout" as const,
    "tags.stripe" as const,
  ],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "form.title" as const,
    description: "form.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // REQUEST FIELDS
      planId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "form.fields.planId.label" as const,
        description: "form.fields.planId.description" as const,
        placeholder: "form.fields.planId.placeholder" as const,
        columns: 6,
        options: [
          {
            value: SubscriptionPlan.SUBSCRIPTION,
            label: "plans.starter.title" as const,
          },
        ],
        schema: z.literal(SubscriptionPlan.SUBSCRIPTION),
      }),

      billingInterval: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "form.fields.billingInterval.label" as const,
        description: "form.fields.billingInterval.description" as const,
        placeholder: "form.fields.billingInterval.placeholder" as const,
        columns: 6,
        options: [
          {
            value: BillingInterval.MONTHLY,
            label: "billing.monthly" as const,
          },
          {
            value: BillingInterval.YEARLY,
            label: "billing.yearly" as const,
          },
        ],
        schema: z.enum(BillingInterval).default(BillingInterval.MONTHLY),
      }),

      provider: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "form.fields.provider.label" as const,
        description: "form.fields.provider.description" as const,
        placeholder: "form.fields.provider.placeholder" as const,
        columns: 12,
        options: PaymentProviderOptions,
        schema: z.enum(PaymentProviderDB).default(PaymentProvider.STRIPE),
      }),

      metadata: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "form.fields.metadata.label" as const,
        description: "form.fields.metadata.description" as const,
        placeholder: "form.fields.metadata.placeholder" as const,
        columns: 12,
        schema: z.record(z.string(), z.string()).optional(),
      }),

      // RESPONSE FIELDS
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.success" as const,
        schema: z.boolean(),
      }),

      sessionId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.sessionId" as const,
        schema: z.string(),
      }),

      checkoutUrl: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.checkoutUrl" as const,
        schema: z.string().url(),
      }),

      message: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.message" as const,
        schema: z.string().optional(),
      }),
    },
  }),

  examples: {
    requests: {
      default: {
        planId: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.MONTHLY,
      },
      yearly: {
        planId: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.YEARLY,
        metadata: { source: "pricing_page" },
      },
      starter: {
        planId: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.MONTHLY,
        metadata: { trial: "true" },
      },
    },
    responses: {
      default: {
        success: true,
        sessionId: "cs_test_123456789",
        checkoutUrl: "https://checkout.stripe.com/pay/cs_test_123456789",
        message: "Subscription checkout session created successfully",
      },
      yearly: {
        success: true,
        sessionId: "cs_test_987654321",
        checkoutUrl: "https://checkout.stripe.com/pay/cs_test_987654321",
        message: "Yearly subscription checkout session created",
      },
      starter: {
        success: true,
        sessionId: "cs_test_456789123",
        checkoutUrl: "https://checkout.stripe.com/pay/cs_test_456789123",
        message: "Starter plan checkout session created",
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

// Export types for repository
export type CheckoutRequestInput = typeof POST.types.RequestInput;
export type CheckoutRequestOutput = typeof POST.types.RequestOutput;
export type CheckoutResponseInput = typeof POST.types.ResponseInput;
export type CheckoutResponseOutput = typeof POST.types.ResponseOutput;

// Additional type aliases for hooks compatibility
export type SubscriptionCheckoutRequestInputType = CheckoutRequestInput;
export type SubscriptionCheckoutRequestOutputType = CheckoutRequestOutput;
export type SubscriptionCheckoutResponseInputType = CheckoutResponseInput;
export type SubscriptionCheckoutResponseType = CheckoutResponseOutput;

// Schema types removed - use EndpointDefinition types from above instead

const endpoints = { POST };
export default endpoints;
