/**
 * Subscription API Endpoint Definition
 * Defines the API endpoints for subscription management using createFormEndpoint
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createFormEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create-form-endpoint";
import {
  field,
  objectField,
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
      title: "app.api.v1.core.subscription.get.response.title",
      description: "app.api.v1.core.subscription.get.response.description",
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
          content: "app.api.v1.core.subscription.get.response.id",
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
          content: "app.api.v1.core.subscription.get.response.userId",
        },
      ),

      // Subscription plan field
      plan: field(
        z.nativeEnum(SubscriptionPlan),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.subscription.put.plan.label",
          description: "app.api.v1.core.subscription.put.plan.description",
          options: SubscriptionPlanOptions,
          layout: { columns: 6 },
        },
      ),

      // Billing interval field
      billingInterval: field(
        z.nativeEnum(BillingInterval),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.subscription.put.billingInterval.label",
          description:
            "app.api.v1.core.subscription.put.billingInterval.description",
          options: BillingIntervalOptions,
          layout: { columns: 6 },
        },
      ),

      // Status - response only
      status: field(
        z.nativeEnum(SubscriptionStatus),
        {
          GET: { response: true },
          POST: { response: true },
        },
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.subscription.get.response.status",
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
          content:
            "app.api.v1.core.subscription.get.response.currentPeriodStart",
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
          content: "app.api.v1.core.subscription.get.response.currentPeriodEnd",
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
          label: "app.api.v1.core.subscription.put.cancelAtPeriodEnd.label",
          description:
            "app.api.v1.core.subscription.put.cancelAtPeriodEnd.description",
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
          content: "app.api.v1.core.subscription.get.response.createdAt",
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
          content: "app.api.v1.core.subscription.get.response.updatedAt",
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
      title: "app.api.v1.core.subscription.get.errors.validation.title",
      description:
        "app.api.v1.core.subscription.get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.subscription.get.errors.notFound.title",
      description:
        "app.api.v1.core.subscription.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.subscription.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.subscription.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.subscription.get.errors.forbidden.title",
      description:
        "app.api.v1.core.subscription.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.subscription.get.errors.server.title",
      description: "app.api.v1.core.subscription.get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.subscription.get.errors.network.title",
      description:
        "app.api.v1.core.subscription.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.subscription.get.errors.unknown.title",
      description:
        "app.api.v1.core.subscription.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.subscription.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.subscription.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.subscription.get.errors.conflict.title",
      description:
        "app.api.v1.core.subscription.get.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.subscription.get.success.title",
    description: "app.api.v1.core.subscription.get.success.description",
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
export type SubscriptionGetRequestTypeInput = typeof GET.types.RequestInput;
export type SubscriptionGetRequestTypeOutput = typeof GET.types.RequestOutput;
export type SubscriptionGetResponseTypeInput = typeof GET.types.ResponseInput;
export type SubscriptionGetResponseTypeOutput = typeof GET.types.ResponseOutput;

export type SubscriptionPostRequestTypeInput = typeof POST.types.RequestInput;
export type SubscriptionPostRequestTypeOutput = typeof POST.types.RequestOutput;
export type SubscriptionPostResponseTypeInput = typeof POST.types.ResponseInput;
export type SubscriptionPostResponseTypeOutput =
  typeof POST.types.ResponseOutput;

// Additional type aliases for compatibility
export type SubscriptionCreateRequestOutput = SubscriptionPostRequestTypeOutput;
export type SubscriptionUpdateType = SubscriptionPostRequestTypeOutput;
export type SubscriptionCancelType = { cancelAtPeriodEnd: boolean; reason?: string };
export type SubscriptionGetResponseType = SubscriptionGetResponseTypeOutput;

// Schema types removed - use EndpointDefinition types from above instead

/**
 * Export definitions
 */
const subscriptionDefinition = {
  GET,
  POST,
};

export { GET, POST };
export default subscriptionDefinition;
