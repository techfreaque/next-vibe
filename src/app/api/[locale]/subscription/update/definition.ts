/**
 * Subscription Update API Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestResponseField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../user/user-roles/enum";
import {
  BillingInterval,
  BillingIntervalOptions,
  SubscriptionPlan,
  SubscriptionPlanOptions,
  SubscriptionStatus,
} from "../enum";
import { SubscriptionUpdateContainer } from "./widget";

/**
 * PUT endpoint for updating subscription
 */
const { PUT } = createEndpoint({
  method: Methods.PUT,
  path: ["subscription", "update"],
  title: "app.api.subscription.put.title" as const,
  description: "app.api.subscription.put.description" as const,
  icon: "package-check" as const,
  category: "app.api.subscription.category" as const,
  tags: [
    "app.api.subscription.tags.subscription" as const,
    "app.api.subscription.tags.update" as const,
  ],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,
  aliases: ["subscription-update", "update-subscription"] as const,

  fields: customWidgetObject({
    render: SubscriptionUpdateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // REQUEST & RESPONSE FIELDS
      plan: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.subscription.form.fields.planId.label" as const,
        description:
          "app.api.subscription.form.fields.planId.description" as const,
        options: SubscriptionPlanOptions,
        schema: z.enum(SubscriptionPlan),
      }),
      billingInterval: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label:
          "app.api.subscription.form.fields.billingInterval.label" as const,
        description:
          "app.api.subscription.form.fields.billingInterval.description" as const,
        options: BillingIntervalOptions,
        schema: z.enum(BillingInterval),
      }),

      // RESPONSE ONLY FIELDS
      id: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.response.id" as const,
        schema: z.uuid(),
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
      message: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.response.message" as const,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.subscription.put.errors.validation.title" as const,
      description:
        "app.api.subscription.put.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.subscription.put.errors.unauthorized.title" as const,
      description:
        "app.api.subscription.put.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.subscription.put.errors.notFound.title" as const,
      description:
        "app.api.subscription.put.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.subscription.put.errors.conflict.title" as const,
      description:
        "app.api.subscription.put.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.subscription.put.errors.server.title" as const,
      description:
        "app.api.subscription.put.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.subscription.put.errors.network.title" as const,
      description:
        "app.api.subscription.put.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.subscription.put.errors.unknown.title" as const,
      description:
        "app.api.subscription.put.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.subscription.put.errors.forbidden.title" as const,
      description:
        "app.api.subscription.put.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.subscription.put.errors.unsavedChanges.title" as const,
      description:
        "app.api.subscription.put.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "app.api.subscription.put.success.title" as const,
    description: "app.api.subscription.put.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        plan: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.YEARLY,
      },
    },
    responses: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        plan: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.YEARLY,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        cancelAtPeriodEnd: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        message: "app.api.subscription.update.success",
      },
    },
  },
});

export default { PUT } as const;

export type SubscriptionUpdatePutRequestOutput = typeof PUT.types.RequestOutput;
export type SubscriptionUpdatePutResponseOutput =
  typeof PUT.types.ResponseOutput;
