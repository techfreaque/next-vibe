/**
 * Subscription API Endpoint Definition
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { PaymentProvider, PaymentProviderDB } from "../payment/enum";
import { BillingInterval, SubscriptionPlan, SubscriptionStatus } from "./enum";
import { scopedTranslation } from "./i18n";

const SubscriptionOverviewContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.SubscriptionOverviewContainer,
  })),
);

/**
 * GET endpoint for retrieving subscription
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["subscription"],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  icon: "crown",
  category: "payments",
  subCategory: "Management",
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
      hasSubscription: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.hasSubscription",
        schema: z.boolean(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.id",
        schema: z.uuid().optional(),
      }),
      plan: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.planId",
        schema: z.enum(SubscriptionPlan).optional(),
      }),
      billingInterval: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.billingInterval",
        schema: z.enum(BillingInterval).optional(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.status",
        schema: z.enum(SubscriptionStatus).optional(),
      }),
      currentPeriodStart: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.currentPeriodStart",
        schema: dateSchema.optional(),
      }),
      currentPeriodEnd: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.currentPeriodEnd",
        schema: dateSchema.optional(),
      }),
      cancelAtPeriodEnd: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.cancelAtPeriodEnd",
        schema: z.boolean().optional(),
      }),
      cancelAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.cancelAt",
        schema: z.string().optional(),
      }),
      canceledAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.canceledAt",
        schema: z.string().optional(),
      }),
      endedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.endedAt",
        schema: z.string().optional(),
      }),
      provider: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.provider",
        schema: z.enum(PaymentProviderDB).optional(),
      }),
      providerSubscriptionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.providerSubscriptionId",
        schema: z.string().optional(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.createdAt",
        schema: dateSchema.optional(),
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.updatedAt",
        schema: dateSchema.optional(),
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
        hasSubscription: true,
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
      noSubscription: {
        hasSubscription: false,
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
