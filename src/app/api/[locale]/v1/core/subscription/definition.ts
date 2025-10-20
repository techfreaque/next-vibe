/**
 * Subscription API Endpoint Definition
 * Defines the API endpoints for subscription management using createFormEndpoint
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import { createFormEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create-form-endpoint";
import {
  field,
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";

import { UserRole } from "../user/user-roles/enum";
import {
  BillingInterval,
  BillingIntervalOptions,
  SubscriptionPlan,
  SubscriptionPlanOptions,
  SubscriptionStatus,
} from "./enum";

/**
 * Subscription form endpoint with GET and POST methods
 */
const { GET, POST } = createFormEndpoint({
  // Shared configuration
  path: ["v1", "core", "subscription"],
  category: "app.api.v1.core.subscription.category",
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],

  // Method-specific configuration
  methods: {
    GET: {
      title: "app.api.v1.core.subscription.get.title",
      description: "app.api.v1.core.subscription.get.description",
      tags: [
        "app.api.v1.core.subscription.tags.subscription",
        "app.api.v1.core.subscription.tags.billing",
        "app.api.v1.core.subscription.tags.get",
      ],
    },
    POST: {
      title: "app.api.v1.core.subscription.put.title",
      description: "app.api.v1.core.subscription.put.description",
      tags: [
        "app.api.v1.core.subscription.tags.subscription",
        "app.api.v1.core.subscription.tags.billing",
        "app.api.v1.core.subscription.tags.update",
      ],
    },
  },

  // Shared field definitions - configured for GET (response-only) and POST (request+response)
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.subscription.response.title",
      description: "app.api.v1.core.subscription.response.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    {
      GET: { response: true },
      POST: { request: "data", response: true },
    },
    {
      // Subscription ID - response only
      id: field(
        z.uuid(),
        {
          GET: { response: true },
          POST: { response: true },
        },
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.id",
        },
      ),

      // User ID - response only
      userId: field(
        z.uuid(),
        {
          GET: { response: true },
          POST: { response: true },
        },
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.userId",
        },
      ),

      // Subscription plan field
      plan: field(
        z.enum(SubscriptionPlan),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.subscription.put.label",
          description: "app.api.v1.core.subscription.put.description",
          options: SubscriptionPlanOptions,
          layout: { columns: 6 },
        },
      ),

      // Billing interval field
      billingInterval: field(
        z.enum(BillingInterval),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.subscription.form.fields.billingInterval.label",
          description:
            "app.api.v1.core.subscription.form.fields.billingInterval.description",
          options: BillingIntervalOptions,
          layout: { columns: 6 },
        },
      ),

      // Status - response only
      status: field(
        z.enum(SubscriptionStatus),
        {
          GET: { response: true },
          POST: { response: true },
        },
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.status",
        },
      ),

      // Current period start - response only
      currentPeriodStart: field(
        z.string(),
        {
          GET: { response: true },
          POST: { response: true },
        },
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.currentPeriodStart",
        },
      ),

      // Current period end - response only
      currentPeriodEnd: field(
        z.string(),
        {
          GET: { response: true },
          POST: { response: true },
        },
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.currentPeriodEnd",
        },
      ),

      // Cancel at period end field
      cancelAtPeriodEnd: field(
        z.boolean(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.subscription.form.fields.cancelAtPeriodEnd.label",
          description:
            "app.api.v1.core.subscription.form.fields.cancelAtPeriodEnd.description",
          layout: { columns: 12 },
        },
      ),

      // Created at - response only
      createdAt: field(
        z.string(),
        {
          GET: { response: true },
          POST: { response: true },
        },
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.createdAt",
        },
      ),

      // Updated at - response only
      updatedAt: field(
        z.string(),
        {
          GET: { response: true },
          POST: { response: true },
        },
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.response.updatedAt",
        },
      ),

      // Response message - only for POST
      message: field(
        z.string(),
        {
          POST: { response: true },
        },
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.put.success.message",
        },
      ),
    },
  ),

  // Shared error and success configuration
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.subscription.errors.validation.title",
      description: "app.api.v1.core.subscription.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.subscription.errors.notFound.title",
      description: "app.api.v1.core.subscription.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.subscription.errors.unauthorized.title",
      description:
        "app.api.v1.core.subscription.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.subscription.errors.forbidden.title",
      description: "app.api.v1.core.subscription.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.subscription.errors.server.title",
      description: "app.api.v1.core.subscription.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.subscription.errors.network.title",
      description: "app.api.v1.core.subscription.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.subscription.errors.unknown.title",
      description: "app.api.v1.core.subscription.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.subscription.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.subscription.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.subscription.errors.conflict.title",
      description: "app.api.v1.core.subscription.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.subscription.success.title",
    description: "app.api.v1.core.subscription.success.description",
  },

  // Method-specific examples
  examples: {
    GET: {
      responses: {
        default: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          userId: "123e4567-e89b-12d3-a456-426614174001",
          plan: SubscriptionPlan.PROFESSIONAL,
          billingInterval: BillingInterval.MONTHLY,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodStart: "2024-01-01T00:00:00Z",
          currentPeriodEnd: "2024-02-01T00:00:00Z",
          cancelAtPeriodEnd: false,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
        minimal: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          userId: "123e4567-e89b-12d3-a456-426614174001",
          plan: SubscriptionPlan.STARTER,
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
    POST: {
      requests: {
        default: {
          plan: SubscriptionPlan.PROFESSIONAL,
          billingInterval: BillingInterval.MONTHLY,
          cancelAtPeriodEnd: false,
        },
        minimal: {
          plan: SubscriptionPlan.STARTER,
          billingInterval: BillingInterval.MONTHLY,
          cancelAtPeriodEnd: false,
        },
      },
      responses: {
        default: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          userId: "123e4567-e89b-12d3-a456-426614174001",
          plan: SubscriptionPlan.PROFESSIONAL,
          billingInterval: BillingInterval.MONTHLY,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodStart: "2024-01-01T00:00:00Z",
          currentPeriodEnd: "2024-02-01T00:00:00Z",
          cancelAtPeriodEnd: false,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          message: "Subscription updated successfully",
        },
        minimal: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          userId: "123e4567-e89b-12d3-a456-426614174001",
          plan: SubscriptionPlan.STARTER,
          billingInterval: BillingInterval.MONTHLY,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodStart: "2024-01-01T00:00:00Z",
          currentPeriodEnd: "2024-02-01T00:00:00Z",
          cancelAtPeriodEnd: false,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          message: "Subscription updated successfully",
        },
      },
    },
  },
});

// Extract types using the new enhanced system
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

// Schema types removed - use EndpointDefinition types from above instead

/**
 * PUT endpoint for updating subscription
 */
const { PUT } = createEndpoint({
  method: Methods.PUT,
  path: ["v1", "core", "subscription"],
  title: "app.api.v1.core.subscription.put.title" as const,
  description: "app.api.v1.core.subscription.put.description" as const,
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
          label: "app.api.v1.core.subscription.put.label" as const,
          description: "app.api.v1.core.subscription.put.description" as const,
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
          content: "app.api.v1.core.subscription.response.plan" as const,
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
      title:
        "app.api.v1.core.subscription.put.errors.validation.title" as const,
      description:
        "app.api.v1.core.subscription.put.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.subscription.put.errors.notFound.title" as const,
      description:
        "app.api.v1.core.subscription.put.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.subscription.put.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.subscription.put.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.subscription.put.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.subscription.put.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.subscription.put.errors.server.title" as const,
      description:
        "app.api.v1.core.subscription.put.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.subscription.put.errors.network.title" as const,
      description:
        "app.api.v1.core.subscription.put.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.subscription.put.errors.unknown.title" as const,
      description:
        "app.api.v1.core.subscription.put.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.subscription.put.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.subscription.put.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.subscription.put.errors.conflict.title" as const,
      description:
        "app.api.v1.core.subscription.put.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.subscription.put.success.title" as const,
    description:
      "app.api.v1.core.subscription.put.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        plan: SubscriptionPlan.PROFESSIONAL,
        billingInterval: BillingInterval.MONTHLY,
        cancelAtPeriodEnd: false,
      },
    },
    responses: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        userId: "123e4567-e89b-12d3-a456-426614174001",
        responsePlan: SubscriptionPlan.PROFESSIONAL,
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
    urlPathVariables: undefined,
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
            "app.api.v1.core.subscription.delete.cancelAtPeriodEnd.label" as const,
          description:
            "app.api.v1.core.subscription.delete.cancelAtPeriodEnd.description" as const,
          layout: { columns: 12 },
        },
        z.boolean(),
      ),
      reason: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.subscription.delete.reason.label" as const,
          description:
            "app.api.v1.core.subscription.delete.reason.description" as const,
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),

      // RESPONSE FIELDS
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.delete.response.success" as const,
        },
        z.boolean(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.subscription.delete.response.message" as const,
        },
        z.string(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.subscription.delete.errors.validation.title" as const,
      description:
        "app.api.v1.core.subscription.delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.subscription.delete.errors.notFound.title" as const,
      description:
        "app.api.v1.core.subscription.delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.subscription.delete.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.subscription.delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.subscription.delete.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.subscription.delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.subscription.delete.errors.server.title" as const,
      description:
        "app.api.v1.core.subscription.delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.subscription.delete.errors.network.title" as const,
      description:
        "app.api.v1.core.subscription.delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.subscription.delete.errors.unknown.title" as const,
      description:
        "app.api.v1.core.subscription.delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.subscription.delete.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.subscription.delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.subscription.delete.errors.conflict.title" as const,
      description:
        "app.api.v1.core.subscription.delete.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.subscription.delete.success.title" as const,
    description:
      "app.api.v1.core.subscription.delete.success.description" as const,
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
    urlPathVariables: undefined,
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
