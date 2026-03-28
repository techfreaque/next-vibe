/**
 * Subscription API Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { PaymentProvider, PaymentProviderDB } from "../payment/enum";
import { UserRole } from "../user/user-roles/enum";
import { BillingInterval, SubscriptionPlan, SubscriptionStatus } from "./enum";
import { scopedTranslation } from "./i18n";
import { SubscriptionOverviewContainer } from "./widget";

/**
 * GET endpoint for retrieving subscription
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["subscription"],
  title: "get.title",
  description: "get.description",
  icon: "crown",
  category: "endpointCategories.payments",
  tags: ["tags.subscription", "tags.billing", "tags.get"],
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
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.id",
        schema: z.uuid(),
      }),
      plan: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.planId",
        schema: z.enum(SubscriptionPlan),
      }),
      billingInterval: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.billingInterval",
        schema: z.enum(BillingInterval),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.status",
        schema: z.enum(SubscriptionStatus),
      }),
      currentPeriodStart: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.currentPeriodStart",
        schema: z.string(),
      }),
      currentPeriodEnd: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.currentPeriodEnd",
        schema: z.string(),
      }),
      cancelAtPeriodEnd: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.cancelAtPeriodEnd",
        schema: z.boolean(),
      }),
      cancelAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.cancelAt",
        schema: z.string().optional(),
      }),
      canceledAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.canceledAt",
        schema: z.string().optional(),
      }),
      endedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.endedAt",
        schema: z.string().optional(),
      }),
      provider: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.provider",
        schema: z.enum(PaymentProviderDB),
      }),
      providerSubscriptionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.providerSubscriptionId",
        schema: z.string().optional(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.createdAt",
        schema: z.string(),
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.updatedAt",
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
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
