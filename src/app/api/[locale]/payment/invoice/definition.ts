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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { InvoiceStatus } from "../enum";
import { scopedTranslation } from "./i18n";

/**
 * POST endpoint for creating invoices
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "invoice"],
  title: "post.title" as const,
  description: "post.description" as const,
  category: "endpointCategories.payments",
  subCategory: "endpointCategories.paymentTransactions",
  icon: "receipt" as const,
  tags: [
    "tags.payment" as const,
    "tags.invoice" as const,
    "tags.transactions" as const,
  ],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title" as const,
    description: "post.form.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // REQUEST FIELDS
      customerId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "customerId.label" as const,
        description: "customerId.description" as const,
        placeholder: "customerId.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),

      amount: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "amount.label" as const,
        description: "amount.description" as const,
        placeholder: "amount.placeholder" as const,
        columns: 12,
        schema: z.coerce.number().min(0.01),
      }),

      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "currency.label" as const,
        description: "currency.description" as const,
        placeholder: "currency.placeholder" as const,
        options: [
          {
            value: "USD",
            label: "currency.usd" as const,
          },
          {
            value: "EUR",
            label: "currency.eur" as const,
          },
          {
            value: "PLN",
            label: "currency.pln" as const,
          },
        ],
        columns: 12,
        schema: z.enum(["USD", "EUR", "PLN"]),
      }),

      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "description.label" as const,
        description: "description.description" as const,
        placeholder: "description.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),

      dueDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "dueDate.label" as const,
        description: "dueDate.description" as const,
        placeholder: "dueDate.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),

      metadata: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "metadata.label" as const,
        description: "metadata.description" as const,
        placeholder: "metadata.placeholder" as const,
        columns: 12,
        schema: z.record(z.string(), z.string()).optional(),
      }),

      // RESPONSE FIELDS
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.success" as const,
        schema: z.boolean(),
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.message" as const,
        schema: z.string().nullable(),
      }),

      invoice: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.invoice.title" as const,
        description: "post.response.invoice.description" as const,
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.invoice.id" as const,
            schema: z.uuid(),
          }),
          userId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.invoice.userId" as const,
            schema: z.uuid(),
          }),
          stripeInvoiceId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.invoice.stripeInvoiceId" as const,
            schema: z.string(),
          }),
          invoiceNumber: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.invoice.invoiceNumber" as const,
            schema: z.string(),
          }),
          amount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.invoice.amount" as const,
            schema: z.coerce.number(),
          }),
          currency: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.invoice.currency" as const,
            schema: z.string(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.invoice.status" as const,
            schema: z.enum(InvoiceStatus),
          }),
          invoiceUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.invoice.invoiceUrl" as const,
            schema: z.string().url(),
          }),
          invoicePdf: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.invoice.invoicePdf" as const,
            schema: z.string().url(),
          }),
          dueDate: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.invoice.dueDate" as const,
            schema: z.string(),
          }),
          paidAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.invoice.paidAt" as const,
            schema: z.string().nullable().optional(),
          }),
          createdAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.invoice.createdAt" as const,
            schema: z.string(),
          }),
          updatedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.invoice.updatedAt" as const,
            schema: z.string(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
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
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },
});

// Export types for repository
export type PaymentInvoiceRequestInput = typeof POST.types.RequestInput;
export type PaymentInvoiceRequestOutput = typeof POST.types.RequestOutput;
export type PaymentInvoiceResponseInput = typeof POST.types.ResponseInput;
export type PaymentInvoiceResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
