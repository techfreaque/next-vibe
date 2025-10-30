/**
 * Payment Refund API Endpoints
 * Defines API endpoints with validation, caching, and access control
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Create Refund Endpoint (POST)
 * Creates a refund for a payment transaction
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "payment", "refund"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],

  title: "app.api.v1.core.payment.refund.title" as const,
  description: "app.api.v1.core.payment.refund.description" as const,
  category: "app.api.v1.core.payment.category" as const,
  tags: [
    "app.api.v1.core.payment.refund.tags.refund" as const,
    "app.api.v1.core.payment.refund.tags.transaction" as const,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.payment.refund.form.title" as const,
      description: "app.api.v1.core.payment.refund.form.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // REQUEST FIELDS
      transactionId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.payment.refund.form.fields.transactionId.label" as const,
          description:
            "app.api.v1.core.payment.refund.form.fields.transactionId.description" as const,
          placeholder:
            "app.api.v1.core.payment.refund.form.fields.transactionId.placeholder" as const,
          layout: { columns: 12 },
          validation: { required: true },
        },
        z.uuid(),
      ),

      amount: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.payment.refund.form.fields.amount.label" as const,
          description:
            "app.api.v1.core.payment.refund.form.fields.amount.description" as const,
          placeholder:
            "app.api.v1.core.payment.refund.form.fields.amount.placeholder" as const,
          layout: { columns: 12 },
          validation: { required: false, min: 0.01 },
        },
        z.number().positive().optional(),
      ),

      reason: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.payment.refund.form.fields.reason.label" as const,
          description:
            "app.api.v1.core.payment.refund.form.fields.reason.description" as const,
          placeholder:
            "app.api.v1.core.payment.refund.form.fields.reason.placeholder" as const,
          layout: { columns: 12 },
          validation: { required: false, maxLength: 500 },
        },
        z.string().optional(),
      ),

      metadata: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.JSON,
          label:
            "app.api.v1.core.payment.refund.form.fields.metadata.label" as const,
          description:
            "app.api.v1.core.payment.refund.form.fields.metadata.description" as const,
          placeholder:
            "app.api.v1.core.payment.refund.form.fields.metadata.placeholder" as const,
          layout: { columns: 12 },
          validation: { required: false },
        },
        z.record(z.string(), z.string()).optional(),
      ),

      // RESPONSE FIELDS
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.payment.refund.post.response.success" as const,
        },
        z.boolean(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.payment.refund.post.response.message" as const,
        },
        z.string().nullable(),
      ),

      refund: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.payment.refund.post.response.refund.title" as const,
          description:
            "app.api.v1.core.payment.refund.post.response.refund.description" as const,
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          id: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.payment.refund.post.response.refund.id" as const,
            },
            z.uuid(),
          ),
          userId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.payment.refund.post.response.refund.userId" as const,
            },
            z.uuid(),
          ),
          transactionId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.payment.refund.post.response.refund.transactionId" as const,
            },
            z.uuid(),
          ),
          stripeRefundId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.payment.refund.post.response.refund.stripeRefundId" as const,
            },
            z.string(),
          ),
          amount: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.payment.refund.post.response.refund.amount" as const,
            },
            z.number(),
          ),
          currency: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.payment.refund.post.response.refund.currency" as const,
            },
            z.string(),
          ),
          status: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.payment.refund.post.response.refund.status" as const,
            },
            z.string(),
          ),
          reason: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.payment.refund.post.response.refund.reason" as const,
            },
            z.string(),
          ),
          createdAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.payment.refund.post.response.refund.createdAt" as const,
            },
            z.string(),
          ),
          updatedAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.payment.refund.post.response.refund.updatedAt" as const,
            },
            z.string(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.payment.refund.post.errors.validation.title" as const,
      description:
        "app.api.v1.core.payment.refund.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.payment.refund.post.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.payment.refund.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.payment.refund.post.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.payment.refund.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.payment.refund.post.errors.notFound.title" as const,
      description:
        "app.api.v1.core.payment.refund.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.payment.refund.post.errors.server.title" as const,
      description:
        "app.api.v1.core.payment.refund.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.payment.refund.post.errors.network.title" as const,
      description:
        "app.api.v1.core.payment.refund.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.payment.refund.post.errors.unknown.title" as const,
      description:
        "app.api.v1.core.payment.refund.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.payment.refund.post.errors.conflict.title" as const,
      description:
        "app.api.v1.core.payment.refund.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.payment.refund.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.payment.refund.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.payment.refund.post.success.title" as const,
    description:
      "app.api.v1.core.payment.refund.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        transactionId: "123e4567-e89b-12d3-a456-426614174000",
        amount: 29.99,
        reason: "Customer requested refund",
        metadata: {
          support_ticket: "TICKET-123",
        },
      },
      partial: {
        transactionId: "123e4567-e89b-12d3-a456-426614174000",
        amount: 15.0,
        reason: "Partial refund for damaged item",
      },
      full: {
        transactionId: "123e4567-e89b-12d3-a456-426614174000",
        reason: "Product not as described",
      },
    },
    responses: {
      default: {
        success: true,
        message: null,
        refund: {
          id: "456e7890-e89b-12d3-a456-426614174000",
          userId: "789e0123-e89b-12d3-a456-426614174000",
          transactionId: "123e4567-e89b-12d3-a456-426614174000",
          stripeRefundId: "re_1234567890",
          amount: 29.99,
          currency: "EUR",
          status: "pending",
          reason: "Customer requested refund",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      },
      partial: {
        success: true,
        message: null,
        refund: {
          id: "456e7890-e89b-12d3-a456-426614174000",
          userId: "789e0123-e89b-12d3-a456-426614174000",
          transactionId: "123e4567-e89b-12d3-a456-426614174000",
          stripeRefundId: "re_1234567890",
          amount: 15.0,
          currency: "EUR",
          status: "pending",
          reason: "Partial refund for damaged item",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      },
      full: {
        success: true,
        message: "Full refund processed",
        refund: {
          id: "456e7890-e89b-12d3-a456-426614174000",
          userId: "789e0123-e89b-12d3-a456-426614174000",
          transactionId: "123e4567-e89b-12d3-a456-426614174000",
          stripeRefundId: "re_1234567890",
          amount: 99.99,
          currency: "EUR",
          status: "pending",
          reason: "Product not as described",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      },
    },
  },
});

// Export types for repository
export type PaymentRefundRequestInput = typeof POST.types.RequestInput;
export type PaymentRefundRequestOutput = typeof POST.types.RequestOutput;
export type PaymentRefundResponseInput = typeof POST.types.ResponseInput;
export type PaymentRefundResponseOutput = typeof POST.types.ResponseOutput;

/**
 * Combined endpoints
 */
const refundEndpoints = {
  POST,
};

export { POST };
export default refundEndpoints;
