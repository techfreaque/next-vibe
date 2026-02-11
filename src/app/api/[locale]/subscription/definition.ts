/**
 * Subscription API Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { PaymentProvider, PaymentProviderDB } from "../payment/enum";
import { UserRole } from "../user/user-roles/enum";
import { BillingInterval, SubscriptionPlan, SubscriptionStatus } from "./enum";
import { SubscriptionOverviewContainer } from "./widget";

/**
 * GET endpoint for retrieving subscription
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["subscription"],
  title: "app.api.subscription.get.title" as const,
  description: "app.api.subscription.get.description" as const,
  icon: "crown",
  category: "app.api.subscription.category" as const,
  tags: [
    "app.api.subscription.tags.subscription" as const,
    "app.api.subscription.tags.billing" as const,
    "app.api.subscription.tags.get" as const,
  ],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: customWidgetObject({
    render: SubscriptionOverviewContainer,
    usage: { response: true } as const,
    children: {
      id: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.response.id" as const,
        schema: z.uuid(),
      }),
      plan: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.response.planId" as const,
        schema: z.enum(SubscriptionPlan),
      }),
      billingInterval: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.response.billingInterval" as const,
        schema: z.enum(BillingInterval),
      }),
      status: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.response.status" as const,
        schema: z.enum(SubscriptionStatus),
      }),
      currentPeriodStart: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.response.currentPeriodStart" as const,
        schema: z.string(),
      }),
      currentPeriodEnd: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.response.currentPeriodEnd" as const,
        schema: z.string(),
      }),
      cancelAtPeriodEnd: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.response.cancelAtPeriodEnd" as const,
        schema: z.boolean(),
      }),
      cancelAt: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.response.cancelAt" as const,
        schema: z.string().optional(),
      }),
      canceledAt: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.response.canceledAt" as const,
        schema: z.string().optional(),
      }),
      endedAt: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.response.endedAt" as const,
        schema: z.string().optional(),
      }),
      provider: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.response.provider" as const,
        schema: z.enum(PaymentProviderDB),
      }),
      providerSubscriptionId: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.subscription.response.providerSubscriptionId" as const,
        schema: z.string().optional(),
      }),
      createdAt: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.response.createdAt" as const,
        schema: z.string(),
      }),
      updatedAt: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.response.updatedAt" as const,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.subscription.errors.validation.title" as const,
      description:
        "app.api.subscription.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.subscription.errors.notFound.title" as const,
      description: "app.api.subscription.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.subscription.errors.unauthorized.title" as const,
      description:
        "app.api.subscription.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.subscription.errors.forbidden.title" as const,
      description: "app.api.subscription.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.subscription.errors.server.title" as const,
      description: "app.api.subscription.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.subscription.errors.network.title" as const,
      description: "app.api.subscription.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.subscription.errors.unknown.title" as const,
      description: "app.api.subscription.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.subscription.errors.unsavedChanges.title" as const,
      description:
        "app.api.subscription.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.subscription.errors.conflict.title" as const,
      description: "app.api.subscription.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.subscription.success.title" as const,
    description: "app.api.subscription.success.description" as const,
  },

  examples: {
    responses: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        plan: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.MONTHLY,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: "2024-01-01T00:00:00Z",
        currentPeriodEnd: "2024-02-01T00:00:00Z",
        cancelAtPeriodEnd: false,
        provider: PaymentProvider.STRIPE,
        providerSubscriptionId: "sub_123456789",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    },
  },
});

// Extract types for GET
export type SubscriptionGetRequestInput = typeof GET.types.RequestInput;
export type SubscriptionGetRequestOutput = typeof GET.types.RequestOutput;
export type SubscriptionGetResponseInput = typeof GET.types.ResponseInput;
export type SubscriptionGetResponseOutput = typeof GET.types.ResponseOutput;

/**
 * Export definition (GET only - create/update/cancel are in separate subdirectories)
 */
const subscriptionDefinition = {
  GET,
} as const;

export default subscriptionDefinition;
