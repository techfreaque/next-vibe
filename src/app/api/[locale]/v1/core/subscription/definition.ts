/**
 * Subscription API Endpoint Definition
 * Defines the API endpoints for subscription management using createFormEndpoint
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import {
  field,
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";

import { UserRole } from "../user/user-roles/enum";
import {
  BillingInterval,
  BillingIntervalOptions,
  SubscriptionPlan,
  SubscriptionPlanOptions,
  SubscriptionStatus,
} from "./enum";

/**
 * GET endpoint for retrieving subscription
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "subscription"],
  title: "app.api.v1.core.subscription.get.title" as const,
  description: "app.api.v1.core.subscription.get.description" as const,
  category: "app.api.v1.core.subscription.category" as const,
  tags: [
    "app.api.v1.core.subscription.tags.subscription" as const,
    "app.api.v1.core.subscription.tags.billing" as const,
    "app.api.v1.core.subscription.tags.get" as const,
  ],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.subscription.get.title" as const,
      description: "app.api.v1.core.subscription.get.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true },
    {
      id: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.id" as const,
        },
        z.uuid(),
      ),
      userId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.userId" as const,
        },
        z.uuid(),
      ),
      plan: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.planId" as const,
        },
        z.enum(SubscriptionPlan),
      ),
      billingInterval: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.response.billingInterval" as const,
        },
        z.enum(BillingInterval),
      ),
      status: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.status" as const,
        },
        z.enum(SubscriptionStatus),
      ),
      currentPeriodStart: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.response.currentPeriodStart" as const,
        },
        z.string(),
      ),
      currentPeriodEnd: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.response.currentPeriodEnd" as const,
        },
        z.string(),
      ),
      cancelAtPeriodEnd: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.response.cancelAtPeriodEnd" as const,
        },
        z.boolean(),
      ),
      createdAt: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.createdAt" as const,
        },
        z.string(),
      ),
      updatedAt: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.updatedAt" as const,
        },
        z.string(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.subscription.errors.validation.title" as const,
      description:
        "app.api.v1.core.subscription.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.subscription.errors.notFound.title" as const,
      description:
        "app.api.v1.core.subscription.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.subscription.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.subscription.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.subscription.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.subscription.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.subscription.errors.server.title" as const,
      description:
        "app.api.v1.core.subscription.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.subscription.errors.network.title" as const,
      description:
        "app.api.v1.core.subscription.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.subscription.errors.unknown.title" as const,
      description:
        "app.api.v1.core.subscription.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.subscription.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.subscription.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.subscription.errors.conflict.title" as const,
      description:
        "app.api.v1.core.subscription.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.subscription.success.title" as const,
    description: "app.api.v1.core.subscription.success.description" as const,
  },

  examples: {
    responses: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        userId: "123e4567-e89b-12d3-a456-426614174001",
        plan: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.MONTHLY,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: "2024-01-01T00:00:00Z",
        currentPeriodEnd: "2024-02-01T00:00:00Z",
        cancelAtPeriodEnd: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    },
  },
});

/**
 * POST endpoint for creating subscription
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "subscription"],
  title: "app.api.v1.core.subscription.post.title" as const,
  description: "app.api.v1.core.subscription.post.description" as const,
  category: "app.api.v1.core.subscription.category" as const,
  tags: [
    "app.api.v1.core.subscription.tags.subscription" as const,
    "app.api.v1.core.subscription.tags.create" as const,
  ],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.subscription.post.form.title" as const,
      description:
        "app.api.v1.core.subscription.post.form.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // Fields that are BOTH request AND response
      plan: field(
        z.enum(SubscriptionPlan),
        { POST: { request: "data", response: true } },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.subscription.form.fields.planId.label" as const,
          description:
            "app.api.v1.core.subscription.form.fields.planId.description" as const,
          options: SubscriptionPlanOptions,
          layout: { columns: 6 },
        },
      ),
      billingInterval: field(
        z.enum(BillingInterval),
        { POST: { request: "data", response: true } },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.subscription.form.fields.billingInterval.label" as const,
          description:
            "app.api.v1.core.subscription.form.fields.billingInterval.description" as const,
          options: BillingIntervalOptions,
          layout: { columns: 6 },
        },
      ),
      cancelAtPeriodEnd: field(
        z.boolean(),
        { POST: { request: "data", response: true } },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.subscription.form.fields.cancelAtPeriodEnd.label" as const,
          description:
            "app.api.v1.core.subscription.form.fields.cancelAtPeriodEnd.description" as const,
          layout: { columns: 12 },
        },
      ),

      // Response-only fields
      id: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.id" as const,
        },
        z.uuid(),
      ),
      userId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.userId" as const,
        },
        z.uuid(),
      ),
      status: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.status" as const,
        },
        z.enum(SubscriptionStatus),
      ),
      currentPeriodStart: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.response.currentPeriodStart" as const,
        },
        z.string(),
      ),
      currentPeriodEnd: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.response.currentPeriodEnd" as const,
        },
        z.string(),
      ),
      createdAt: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.createdAt" as const,
        },
        z.string(),
      ),
      updatedAt: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.updatedAt" as const,
        },
        z.string(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.message" as const,
        },
        z.string(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.subscription.errors.validation.title" as const,
      description:
        "app.api.v1.core.subscription.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.subscription.errors.notFound.title" as const,
      description:
        "app.api.v1.core.subscription.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.subscription.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.subscription.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.subscription.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.subscription.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.subscription.errors.server.title" as const,
      description:
        "app.api.v1.core.subscription.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.subscription.errors.network.title" as const,
      description:
        "app.api.v1.core.subscription.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.subscription.errors.unknown.title" as const,
      description:
        "app.api.v1.core.subscription.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.subscription.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.subscription.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.subscription.errors.conflict.title" as const,
      description:
        "app.api.v1.core.subscription.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.subscription.success.title" as const,
    description: "app.api.v1.core.subscription.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        plan: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.MONTHLY,
        cancelAtPeriodEnd: false,
      },
    },
    responses: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        userId: "123e4567-e89b-12d3-a456-426614174001",
        plan: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.MONTHLY,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: "2024-01-01T00:00:00Z",
        currentPeriodEnd: "2024-02-01T00:00:00Z",
        cancelAtPeriodEnd: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        message: "Subscription created successfully",
      },
    },
  },
});

// Extract types
export type SubscriptionGetRequestInput = typeof GET.types.RequestInput;
export type SubscriptionGetRequestOutput = typeof GET.types.RequestOutput;
export type SubscriptionGetResponseInput = typeof GET.types.ResponseInput;
export type SubscriptionGetResponseOutput = typeof GET.types.ResponseOutput;

export type SubscriptionPostRequestInput = typeof POST.types.RequestInput;
export type SubscriptionPostRequestOutput = typeof POST.types.RequestOutput;
export type SubscriptionPostResponseInput = typeof POST.types.ResponseInput;
export type SubscriptionPostResponseOutput = typeof POST.types.ResponseOutput;

// Additional type aliases for compatibility
export type SubscriptionCreateRequestOutput = SubscriptionPostRequestOutput;
export type SubscriptionUpdateType = SubscriptionPostRequestOutput;
export interface SubscriptionCancelType {
  cancelAtPeriodEnd: boolean;
  reason?: string;
}
export type SubscriptionGetResponseType = SubscriptionGetResponseOutput;

/**
 * PUT endpoint for updating subscription
 */
const { PUT } = createEndpoint({
  method: Methods.PUT,
  path: ["v1", "core", "subscription"],
  title: "app.api.v1.core.subscription.put.title" as const,
  description:
    "app.api.v1.core.subscription.form.fields.planId.description" as const,
  category: "app.api.v1.core.subscription.category" as const,
  tags: [
    "app.api.v1.core.subscription.tags.subscription" as const,
    "app.api.v1.core.subscription.tags.update" as const,
  ],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,
  aliases: ["subscription-update", "update-subscription"] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.subscription.put.form.title" as const,
      description: "app.api.v1.core.subscription.put.form.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // REQUEST FIELDS
      plan: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.subscription.form.fields.planId.label" as const,
          description:
            "app.api.v1.core.subscription.form.fields.planId.description" as const,
          options: SubscriptionPlanOptions,
          layout: { columns: 6 },
        },
        z.enum(SubscriptionPlan),
      ),
      billingInterval: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.subscription.form.fields.billingInterval.label" as const,
          description:
            "app.api.v1.core.subscription.form.fields.billingInterval.description" as const,
          options: BillingIntervalOptions,
          layout: { columns: 6 },
        },
        z.enum(BillingInterval),
      ),
      cancelAtPeriodEnd: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.subscription.form.fields.cancelAtPeriodEnd.label" as const,
          description:
            "app.api.v1.core.subscription.form.fields.cancelAtPeriodEnd.description" as const,
          layout: { columns: 12 },
        },
        z.boolean(),
      ),

      // RESPONSE FIELDS
      id: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.id" as const,
        },
        z.uuid(),
      ),
      userId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.userId" as const,
        },
        z.uuid(),
      ),
      responsePlan: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.planId" as const,
        },
        z.enum(SubscriptionPlan),
      ),
      responseBillingInterval: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.response.billingInterval" as const,
        },
        z.enum(BillingInterval),
      ),
      status: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.status" as const,
        },
        z.enum(SubscriptionStatus),
      ),
      currentPeriodStart: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.response.currentPeriodStart" as const,
        },
        z.string(),
      ),
      currentPeriodEnd: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.response.currentPeriodEnd" as const,
        },
        z.string(),
      ),
      responseCancelAtPeriodEnd: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.response.cancelAtPeriodEnd" as const,
        },
        z.boolean(),
      ),
      createdAt: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.response.currentPeriodStart" as const,
        },
        z.string(),
      ),
      updatedAt: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.response.currentPeriodEnd" as const,
        },
        z.string(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.message" as const,
        },
        z.string(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.subscription.errors.validation.title" as const,
      description:
        "app.api.v1.core.subscription.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.subscription.errors.notFound.title" as const,
      description:
        "app.api.v1.core.subscription.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.subscription.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.subscription.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.subscription.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.subscription.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.subscription.errors.server.title" as const,
      description:
        "app.api.v1.core.subscription.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.subscription.errors.network.title" as const,
      description:
        "app.api.v1.core.subscription.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.subscription.errors.unknown.title" as const,
      description:
        "app.api.v1.core.subscription.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.subscription.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.subscription.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.subscription.errors.conflict.title" as const,
      description:
        "app.api.v1.core.subscription.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.subscription.success.title" as const,
    description: "app.api.v1.core.subscription.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        plan: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.MONTHLY,
        cancelAtPeriodEnd: false,
      },
    },
    responses: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        userId: "123e4567-e89b-12d3-a456-426614174001",
        responsePlan: SubscriptionPlan.SUBSCRIPTION,
        responseBillingInterval: BillingInterval.MONTHLY,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: "2024-01-01T00:00:00Z",
        currentPeriodEnd: "2024-02-01T00:00:00Z",
        responseCancelAtPeriodEnd: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        message: "Subscription updated successfully",
      },
    },
    urlPathParams: undefined,
  },
});

/**
 * DELETE endpoint for canceling subscription
 */
const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["v1", "core", "subscription"],
  title: "app.api.v1.core.subscription.delete.title" as const,
  description: "app.api.v1.core.subscription.delete.description" as const,
  category: "app.api.v1.core.subscription.category" as const,
  tags: [
    "app.api.v1.core.subscription.tags.subscription" as const,
    "app.api.v1.core.subscription.tags.cancel" as const,
  ],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,
  aliases: ["subscription-cancel", "cancel-subscription"] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.subscription.delete.form.title" as const,
      description:
        "app.api.v1.core.subscription.delete.form.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // REQUEST FIELDS
      cancelAtPeriodEnd: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.subscription.form.fields.cancelAtPeriodEnd.label" as const,
          description:
            "app.api.v1.core.subscription.form.fields.cancelAtPeriodEnd.description" as const,
          layout: { columns: 12 },
        },
        z.boolean(),
      ),
      reason: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.subscription.form.fields.reason.label" as const,
          description:
            "app.api.v1.core.subscription.form.fields.reason.description" as const,
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),

      // RESPONSE FIELDS
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.success" as const,
        },
        z.boolean(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.message" as const,
        },
        z.string(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.subscription.errors.validation.title" as const,
      description:
        "app.api.v1.core.subscription.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.subscription.errors.notFound.title" as const,
      description:
        "app.api.v1.core.subscription.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.subscription.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.subscription.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.subscription.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.subscription.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.subscription.errors.server.title" as const,
      description:
        "app.api.v1.core.subscription.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.subscription.errors.network.title" as const,
      description:
        "app.api.v1.core.subscription.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.subscription.errors.unknown.title" as const,
      description:
        "app.api.v1.core.subscription.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.subscription.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.subscription.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.subscription.errors.conflict.title" as const,
      description:
        "app.api.v1.core.subscription.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.subscription.success.title" as const,
    description: "app.api.v1.core.subscription.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        cancelAtPeriodEnd: true,
        reason: "Too expensive",
      },
    },
    responses: {
      default: {
        success: true,
        message: "Subscription canceled successfully",
      },
    },
    urlPathParams: undefined,
  },
});

// Export types for PUT
export type SubscriptionPutRequestInput = typeof PUT.types.RequestInput;
export type SubscriptionPutRequestOutput = typeof PUT.types.RequestOutput;
export type SubscriptionPutResponseInput = typeof PUT.types.ResponseInput;
export type SubscriptionPutResponseOutput = typeof PUT.types.ResponseOutput;

// Export types for DELETE
export type SubscriptionDeleteRequestInput = typeof DELETE.types.RequestInput;
export type SubscriptionDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type SubscriptionDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type SubscriptionDeleteResponseOutput =
  typeof DELETE.types.ResponseOutput;

/**
 * Export definitions
 */
const subscriptionDefinition = {
  GET,
  POST,
  PUT,
  DELETE,
};

export { DELETE, GET, POST, PUT };
export default subscriptionDefinition;
