/**
 * Subscription Create API Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
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
import { scopedTranslation } from "../i18n";
import { SubscriptionCreateContainer } from "./widget";

/**
 * POST endpoint for creating subscription
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["subscription", "create"],
  title: "post.title" as const,
  description: "post.description" as const,
  icon: "package-plus",
  category: "app.endpointCategories.credits",
  tags: ["tags.subscription" as const, "tags.create" as const],
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
      plan: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "form.fields.planId.label" as const,
        description: "form.fields.planId.description" as const,
        options: SubscriptionPlanOptions,
        schema: z.enum(SubscriptionPlan).default(SubscriptionPlan.SUBSCRIPTION),
      }),
      billingInterval: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "form.fields.billingInterval.label" as const,
        description: "form.fields.billingInterval.description" as const,
        options: BillingIntervalOptions,
        schema: z.enum(BillingInterval).default(BillingInterval.MONTHLY),
      }),
      provider: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "form.fields.provider.label" as const,
        description: "form.fields.provider.description" as const,
        schema: z.enum(PaymentProviderDB).default(PaymentProvider.STRIPE),
        hidden: true,
      }),

      // RESPONSE FIELDS
      checkoutUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.checkoutUrl" as const,
        schema: z.string().url(),
      }),
      sessionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.sessionId" as const,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title" as const,
      description: "errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "success.title" as const,
    description: "success.description" as const,
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
