/**
 * Subscription Checkout API Definition
 * Defines endpoints for creating subscription checkout sessions
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { LayoutType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { BillingInterval, SubscriptionPlan } from "../enum";

/**
 * POST endpoint for creating subscription checkout sessions
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "subscription", "checkout"],
  title: "app.api.v1.core.subscription.checkout.title" as const,
  description: "app.api.v1.core.subscription.checkout.description" as const,
  category: "app.api.v1.core.subscription.category" as const,
  tags: [
    "app.api.v1.core.subscription.checkout.tags.subscription" as const,
    "app.api.v1.core.subscription.checkout.tags.checkout" as const,
    "app.api.v1.core.subscription.checkout.tags.stripe" as const,
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
      title: "app.api.v1.core.subscription.checkout.form.title" as const,
      description:
        "app.api.v1.core.subscription.checkout.form.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // REQUEST FIELDS
      planId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.subscription.checkout.form.fields.planId.label" as const,
          description:
            "app.api.v1.core.subscription.checkout.form.fields.planId.description" as const,
          placeholder:
            "app.api.v1.core.subscription.checkout.form.fields.planId.placeholder" as const,
          layout: { columns: 6 },
          validation: { required: true },
          options: [
            {
              value: SubscriptionPlan.STARTER,
              label: "app.api.v1.core.subscription.plans.starter" as const,
            },
            {
              value: SubscriptionPlan.PROFESSIONAL,
              label: "app.api.v1.core.subscription.plans.professional" as const,
            },
            {
              value: SubscriptionPlan.PREMIUM,
              label: "app.api.v1.core.subscription.plans.premium" as const,
            },
            {
              value: SubscriptionPlan.ENTERPRISE,
              label: "app.api.v1.core.subscription.plans.enterprise" as const,
            },
          ],
        },
        z.nativeEnum(SubscriptionPlan),
      ),

      billingInterval: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.subscription.checkout.form.fields.billingInterval.label" as const,
          description:
            "app.api.v1.core.subscription.checkout.form.fields.billingInterval.description" as const,
          placeholder:
            "app.api.v1.core.subscription.checkout.form.fields.billingInterval.placeholder" as const,
          layout: { columns: 6 },
          validation: { required: false },
          options: [
            {
              value: BillingInterval.MONTHLY,
              label: "app.api.v1.core.subscription.billing.monthly" as const,
            },
            {
              value: BillingInterval.YEARLY,
              label: "app.api.v1.core.subscription.billing.yearly" as const,
            },
          ],
        },
        z.nativeEnum(BillingInterval).default(BillingInterval.MONTHLY),
      ),

      metadata: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.JSON,
          label:
            "app.api.v1.core.subscription.checkout.form.fields.metadata.label" as const,
          description:
            "app.api.v1.core.subscription.checkout.form.fields.metadata.description" as const,
          placeholder:
            "app.api.v1.core.subscription.checkout.form.fields.metadata.placeholder" as const,
          layout: { columns: 12 },
          validation: { required: false },
        },
        z.record(z.string()).optional(),
      ),

      // RESPONSE FIELDS
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.checkout.response.success" as const,
        },
        z.boolean(),
      ),

      sessionId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.checkout.response.sessionId" as const,
        },
        z.string(),
      ),

      checkoutUrl: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.checkout.response.checkoutUrl" as const,
        },
        z.string().url(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.checkout.response.message" as const,
        },
        z.string().optional(),
      ),
    },
  ),

  examples: {
    requests: {
      default: {
        planId: SubscriptionPlan.PROFESSIONAL,
        billingInterval: BillingInterval.MONTHLY,
      },
      yearly: {
        planId: SubscriptionPlan.PREMIUM,
        billingInterval: BillingInterval.YEARLY,
        metadata: { source: "pricing_page" },
      },
      starter: {
        planId: SubscriptionPlan.STARTER,
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
    urlPathVariables: {
      default: {},
      yearly: {},
      starter: {},
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.subscription.checkout.errors.validation.title" as const,
      description:
        "app.api.v1.core.subscription.checkout.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.subscription.checkout.errors.network.title" as const,
      description:
        "app.api.v1.core.subscription.checkout.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.subscription.checkout.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.subscription.checkout.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.subscription.checkout.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.subscription.checkout.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.subscription.checkout.errors.notFound.title" as const,
      description:
        "app.api.v1.core.subscription.checkout.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.subscription.checkout.errors.serverError.title" as const,
      description:
        "app.api.v1.core.subscription.checkout.errors.serverError.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.subscription.checkout.errors.unknown.title" as const,
      description:
        "app.api.v1.core.subscription.checkout.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.subscription.checkout.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.subscription.checkout.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.subscription.checkout.errors.conflict.title" as const,
      description:
        "app.api.v1.core.subscription.checkout.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.subscription.checkout.success.title" as const,
    description:
      "app.api.v1.core.subscription.checkout.success.description" as const,
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
