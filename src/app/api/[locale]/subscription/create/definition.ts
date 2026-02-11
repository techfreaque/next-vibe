/**
 * Subscription Create API Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { PaymentProvider, PaymentProviderDB } from "../../payment/enum";
import { UserRole } from "../../user/user-roles/enum";
import {
  BillingInterval,
  BillingIntervalOptions,
  SubscriptionPlan,
  SubscriptionPlanOptions,
} from "../enum";
import { SubscriptionCreateContainer } from "./widget";

/**
 * POST endpoint for creating subscription
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["subscription", "create"],
  title: "app.api.subscription.post.title" as const,
  description: "app.api.subscription.post.description" as const,
  icon: "package-plus" as const,
  category: "app.api.subscription.category" as const,
  tags: [
    "app.api.subscription.tags.subscription" as const,
    "app.api.subscription.tags.create" as const,
  ],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: customWidgetObject({
    render: SubscriptionCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // REQUEST FIELDS
      plan: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.subscription.form.fields.planId.label" as const,
        description:
          "app.api.subscription.form.fields.planId.description" as const,
        options: SubscriptionPlanOptions,
        schema: z.enum(SubscriptionPlan).default(SubscriptionPlan.SUBSCRIPTION),
      }),
      billingInterval: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label:
          "app.api.subscription.form.fields.billingInterval.label" as const,
        description:
          "app.api.subscription.form.fields.billingInterval.description" as const,
        options: BillingIntervalOptions,
        schema: z.enum(BillingInterval).default(BillingInterval.MONTHLY),
      }),
      provider: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.subscription.form.fields.provider.label" as const,
        description:
          "app.api.subscription.form.fields.provider.description" as const,
        schema: z.enum(PaymentProviderDB).default(PaymentProvider.STRIPE),
        hidden: true,
      }),

      // RESPONSE FIELDS
      checkoutUrl: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.post.response.checkoutUrl" as const,
        schema: z.string().url(),
      }),
      sessionId: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.post.response.sessionId" as const,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.subscription.post.errors.validation.title" as const,
      description:
        "app.api.subscription.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.subscription.post.errors.unauthorized.title" as const,
      description:
        "app.api.subscription.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.subscription.post.errors.conflict.title" as const,
      description:
        "app.api.subscription.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.subscription.post.errors.server.title" as const,
      description:
        "app.api.subscription.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.subscription.post.errors.network.title" as const,
      description:
        "app.api.subscription.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.subscription.post.errors.unknown.title" as const,
      description:
        "app.api.subscription.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.subscription.post.errors.forbidden.title" as const,
      description:
        "app.api.subscription.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.subscription.post.errors.notFound.title" as const,
      description:
        "app.api.subscription.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.subscription.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.subscription.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "app.api.subscription.post.success.title" as const,
    description: "app.api.subscription.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        plan: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.MONTHLY,
        provider: PaymentProvider.STRIPE,
      },
    },
    responses: {
      default: {
        checkoutUrl: "https://checkout.stripe.com/c/pay/cs_test_...",
        sessionId: "cs_test_123456789",
      },
    },
  },
});

export default { POST } as const;

export type SubscriptionCreatePostRequestOutput =
  typeof POST.types.RequestOutput;
export type SubscriptionCreatePostResponseOutput =
  typeof POST.types.ResponseOutput;
