/**
 * Payment Invoice API Endpoints
 * Defines API endpoints for invoice management
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { InvoiceStatus } from "../enum";

/**
 * POST endpoint for creating invoices
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["payment", "invoice"],
  title: "app.api.payment.invoice.post.title" as const,
  description: "app.api.payment.invoice.post.description" as const,
  category: "app.api.payment.category" as const,
  icon: "receipt" as const,
  tags: [
    "app.api.payment.tags.payment" as const,
    "app.api.payment.tags.info" as const,
    "app.api.payment.tags.transactions" as const,
  ],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.payment.invoice.post.form.title" as const,
      description: "app.api.payment.invoice.post.form.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // REQUEST FIELDS
      customerId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.payment.invoice.customerId.label" as const,
        description: "app.api.payment.invoice.customerId.description" as const,
        placeholder: "app.api.payment.invoice.customerId.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),

      amount: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.payment.invoice.amount.label" as const,
        description: "app.api.payment.invoice.amount.description" as const,
        placeholder: "app.api.payment.invoice.amount.placeholder" as const,
        columns: 12,
        schema: z.coerce.number().min(0.01),
      }),

      currency: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.payment.invoice.currency.label" as const,
        description: "app.api.payment.invoice.currency.description" as const,
        placeholder: "app.api.payment.invoice.currency.placeholder" as const,
        options: [
          {
            value: "USD",
            label: "app.api.payment.currency.usd" as const,
          },
          {
            value: "EUR",
            label: "app.api.payment.currency.eur" as const,
          },
          {
            value: "PLN",
            label: "app.api.payment.currency.pln" as const,
          },
        ],
        columns: 12,
        schema: z.enum(["USD", "EUR", "PLN"]),
      }),

      description: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "app.api.payment.invoice.description.label" as const,
        description: "app.api.payment.invoice.description.description" as const,
        placeholder: "app.api.payment.invoice.description.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),

      dueDate: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "app.api.payment.invoice.dueDate.label" as const,
        description: "app.api.payment.invoice.dueDate.description" as const,
        placeholder: "app.api.payment.invoice.dueDate.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),

      metadata: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "app.api.payment.invoice.metadata.label" as const,
        description: "app.api.payment.invoice.metadata.description" as const,
        placeholder: "app.api.payment.invoice.metadata.placeholder" as const,
        columns: 12,
        schema: z.record(z.string(), z.string()).optional(),
      }),

      // RESPONSE FIELDS
      success: responseField({
        type: WidgetType.TEXT,
        content: "app.api.payment.invoice.post.response.success" as const,
        schema: z.boolean(),
      }),

      message: responseField({
        type: WidgetType.TEXT,
        content: "app.api.payment.invoice.post.response.message" as const,
        schema: z.string().nullable(),
      }),

      invoice: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.payment.invoice.post.response.invoice.title" as const,
          description:
            "app.api.payment.invoice.post.response.invoice.description" as const,
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          id: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.payment.invoice.post.response.invoice.id" as const,
            schema: z.uuid(),
          }),
          userId: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.payment.invoice.post.response.invoice.userId" as const,
            schema: z.uuid(),
          }),
          stripeInvoiceId: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.payment.invoice.post.response.invoice.stripeInvoiceId" as const,
            schema: z.string(),
          }),
          invoiceNumber: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.payment.invoice.post.response.invoice.invoiceNumber" as const,
            schema: z.string(),
          }),
          amount: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.payment.invoice.post.response.invoice.amount" as const,
            schema: z.coerce.number(),
          }),
          currency: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.payment.invoice.post.response.invoice.currency" as const,
            schema: z.string(),
          }),
          status: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.payment.invoice.post.response.invoice.status" as const,
            schema: z.enum(InvoiceStatus),
          }),
          invoiceUrl: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.payment.invoice.post.response.invoice.invoiceUrl" as const,
            schema: z.string().url(),
          }),
          invoicePdf: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.payment.invoice.post.response.invoice.invoicePdf" as const,
            schema: z.string().url(),
          }),
          dueDate: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.payment.invoice.post.response.invoice.dueDate" as const,
            schema: z.string(),
          }),
          paidAt: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.payment.invoice.post.response.invoice.paidAt" as const,
            schema: z.string().nullable().optional(),
          }),
          createdAt: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.payment.invoice.post.response.invoice.createdAt" as const,
            schema: z.string(),
          }),
          updatedAt: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.payment.invoice.post.response.invoice.updatedAt" as const,
            schema: z.string(),
          }),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.payment.invoice.post.errors.validation.title" as const,
      description:
        "app.api.payment.invoice.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.payment.invoice.post.errors.network.title" as const,
      description:
        "app.api.payment.invoice.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.payment.invoice.post.errors.unauthorized.title" as const,
      description:
        "app.api.payment.invoice.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.payment.invoice.post.errors.forbidden.title" as const,
      description:
        "app.api.payment.invoice.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.payment.invoice.post.errors.notFound.title" as const,
      description:
        "app.api.payment.invoice.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.payment.invoice.post.errors.server.title" as const,
      description:
        "app.api.payment.invoice.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.payment.invoice.post.errors.unknown.title" as const,
      description:
        "app.api.payment.invoice.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.payment.invoice.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.payment.invoice.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.payment.invoice.post.errors.conflict.title" as const,
      description:
        "app.api.payment.invoice.post.errors.conflict.description" as const,
    },
  },

  examples: {
    requests: {
      default: {
        amount: 99.99,
        currency: "EUR",
        description: "Professional services",
        dueDate: "2024-02-01T00:00:00Z",
        metadata: {
          project: "Website Development",
        },
      },
    },
    responses: {
      default: {
        success: true,
        message: null,
        invoice: {
          id: "456e7890-e89b-12d3-a456-426614174000",
          userId: "789e0123-e89b-12d3-a456-426614174000",
          stripeInvoiceId: "in_1234567890",
          invoiceNumber: "INV-001",
          amount: 99.99,
          currency: "EUR",
          status: InvoiceStatus.OPEN,
          invoiceUrl: "https://invoice.stripe.com/i/acct_123/test_456",
          invoicePdf: "https://pay.stripe.com/invoice/acct_123/test_456/pdf",
          dueDate: "2024-02-01T00:00:00Z",
          paidAt: null,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      },
    },
  },

  successTypes: {
    title: "app.api.payment.invoice.post.success.title" as const,
    description: "app.api.payment.invoice.post.success.description" as const,
  },
});

// Export types for repository
export type PaymentInvoiceRequestInput = typeof POST.types.RequestInput;
export type PaymentInvoiceRequestOutput = typeof POST.types.RequestOutput;
export type PaymentInvoiceResponseInput = typeof POST.types.ResponseInput;
export type PaymentInvoiceResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
