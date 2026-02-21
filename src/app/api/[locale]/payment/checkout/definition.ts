/**
 * Subscription Checkout API Definition
 * Defines endpoints for creating subscription checkout sessions
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
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

/**
 * POST endpoint for creating subscription checkout sessions
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["payment", "checkout"],
  title: "app.api.subscription.checkout.title" as const,
  description: "app.api.subscription.checkout.description" as const,
  category: "app.api.payment.category" as const,
  icon: "credit-card" as const,
  tags: [
    "app.api.subscription.checkout.tags.subscription" as const,
    "app.api.subscription.checkout.tags.checkout" as const,
    "app.api.subscription.checkout.tags.stripe" as const,
  ],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.subscription.checkout.form.title" as const,
      description: "app.api.subscription.checkout.form.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // REQUEST FIELDS
      planId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label:
          "app.api.subscription.checkout.form.fields.planId.label" as const,
        description:
          "app.api.subscription.checkout.form.fields.planId.description" as const,
        placeholder:
          "app.api.subscription.checkout.form.fields.planId.placeholder" as const,
        columns: 6,
        options: [
          {
            value: SubscriptionPlan.SUBSCRIPTION,
            label: "app.api.subscription.plans.starter.title" as const,
          },
        ],
        schema: z.literal(SubscriptionPlan.SUBSCRIPTION),
      }),

      billingInterval: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label:
          "app.api.subscription.checkout.form.fields.billingInterval.label" as const,
        description:
          "app.api.subscription.checkout.form.fields.billingInterval.description" as const,
        placeholder:
          "app.api.subscription.checkout.form.fields.billingInterval.placeholder" as const,
        columns: 6,
        options: [
          {
            value: BillingInterval.MONTHLY,
            label: "app.api.subscription.billing.monthly" as const,
          },
          {
            value: BillingInterval.YEARLY,
            label: "app.api.subscription.billing.yearly" as const,
          },
        ],
        schema: z.enum(BillingInterval).default(BillingInterval.MONTHLY),
      }),

      provider: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label:
          "app.api.subscription.checkout.form.fields.provider.label" as const,
        description:
          "app.api.subscription.checkout.form.fields.provider.description" as const,
        placeholder:
          "app.api.subscription.checkout.form.fields.provider.placeholder" as const,
        columns: 12,
        options: PaymentProviderOptions,
        schema: z.enum(PaymentProviderDB).default(PaymentProvider.STRIPE),
      }),

      metadata: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label:
          "app.api.subscription.checkout.form.fields.metadata.label" as const,
        description:
          "app.api.subscription.checkout.form.fields.metadata.description" as const,
        placeholder:
          "app.api.subscription.checkout.form.fields.metadata.placeholder" as const,
        columns: 12,
        schema: z.record(z.string(), z.string()).optional(),
      }),

      // RESPONSE FIELDS
      success: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.checkout.response.success" as const,
        schema: z.boolean(),
      }),

      sessionId: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.checkout.response.sessionId" as const,
        schema: z.string(),
      }),

      checkoutUrl: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.checkout.response.checkoutUrl" as const,
        schema: z.string().url(),
      }),

      message: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.checkout.response.message" as const,
        schema: z.string().optional(),
      }),
    },
  ),

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
      title: "app.api.subscription.checkout.errors.validation.title" as const,
      description:
        "app.api.subscription.checkout.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.subscription.checkout.errors.network.title" as const,
      description:
        "app.api.subscription.checkout.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.subscription.checkout.errors.unauthorized.title" as const,
      description:
        "app.api.subscription.checkout.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.subscription.checkout.errors.forbidden.title" as const,
      description:
        "app.api.subscription.checkout.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.subscription.checkout.errors.notFound.title" as const,
      description:
        "app.api.subscription.checkout.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.subscription.checkout.errors.serverError.title" as const,
      description:
        "app.api.subscription.checkout.errors.serverError.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.subscription.checkout.errors.unknown.title" as const,
      description:
        "app.api.subscription.checkout.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.subscription.checkout.errors.unsavedChanges.title" as const,
      description:
        "app.api.subscription.checkout.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.subscription.checkout.errors.conflict.title" as const,
      description:
        "app.api.subscription.checkout.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.subscription.checkout.success.title" as const,
    description: "app.api.subscription.checkout.success.description" as const,
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
