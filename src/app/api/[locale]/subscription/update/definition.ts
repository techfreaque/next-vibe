/**
 * Subscription Update API Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestResponseField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
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
import { scopedTranslation } from "../i18n";
import { SubscriptionUpdateContainer } from "./widget";

/**
 * PUT endpoint for updating subscription
 */
const { PUT } = createEndpoint({
  scopedTranslation,
  method: Methods.PUT,
  path: ["subscription", "update"],
  title: "put.title" as const,
  description: "put.description" as const,
  icon: "package-check",
  category: "endpointCategories.payments",
  tags: ["tags.subscription" as const, "tags.update" as const],
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
      plan: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "form.fields.planId.label" as const,
        description: "form.fields.planId.description" as const,
        options: SubscriptionPlanOptions,
        schema: z.enum(SubscriptionPlan),
      }),
      billingInterval: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "form.fields.billingInterval.label" as const,
        description: "form.fields.billingInterval.description" as const,
        options: BillingIntervalOptions,
        schema: z.enum(BillingInterval),
      }),

      // RESPONSE ONLY FIELDS
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.id" as const,
        schema: z.uuid(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.status" as const,
        schema: z.enum(SubscriptionStatus),
      }),
      currentPeriodStart: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.currentPeriodStart" as const,
        schema: z.string(),
      }),
      currentPeriodEnd: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.currentPeriodEnd" as const,
        schema: z.string(),
      }),
      cancelAtPeriodEnd: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.cancelAtPeriodEnd" as const,
        schema: z.boolean(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.createdAt" as const,
        schema: z.string(),
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.updatedAt" as const,
        schema: z.string(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.message" as const,
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
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
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
        billingInterval: BillingInterval.YEARLY,
      },
    },
    responses: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        plan: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.YEARLY,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: "2024-01-15T10:00:00.000Z",
        currentPeriodEnd: "2025-01-15T10:00:00.000Z",
        cancelAtPeriodEnd: false,
        createdAt: "2024-01-15T10:00:00.000Z",
        updatedAt: "2024-01-15T10:00:00.000Z",
        message: "update.success",
      },
    },
  },
});

export default { PUT } as const;

export type SubscriptionUpdatePutRequestOutput = typeof PUT.types.RequestOutput;
export type SubscriptionUpdatePutResponseOutput =
  typeof PUT.types.ResponseOutput;
