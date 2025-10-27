/**
 * Payment API Endpoint Definition
 * Defines the API endpoints for payment processing using createFormEndpoint
 */

import { z } from "zod";

import { createFormEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-form-endpoint";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import {
  field,
  objectField,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import {
  CheckoutMode,
  CheckoutModeOptions,
  PaymentMethodType,
  PaymentMethodTypeOptions,
} from "./enum";

/**
 * Payment form endpoint with GET and POST methods
 */
const { GET, POST } = createFormEndpoint({
  // Shared configuration
  path: ["v1", "core", "payment"],
  category: "app.api.v1.core.payment.category",
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],

  // Method-specific configuration
  methods: {
    GET: {
      title: "app.api.v1.core.payment.get.title",
      description: "app.api.v1.core.payment.get.description",
      tags: [
        "app.api.v1.core.payment.tags.payment",
        "app.api.v1.core.payment.tags.stripe",
        "app.api.v1.core.payment.tags.info",
      ],
    },
    POST: {
      title: "app.api.v1.core.payment.create.title",
      description: "app.api.v1.core.payment.create.description",
      tags: [
        "app.api.v1.core.payment.tags.payment",
        "app.api.v1.core.payment.tags.stripe",
        "app.api.v1.core.payment.tags.checkout",
      ],
    },
  },

  // Shared field definitions - configured for GET (response-only) and POST (request+response)
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.payment.form.title",
      description: "app.api.v1.core.payment.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    {
      GET: { response: true },
      POST: { request: "data", response: true },
    },
    {
      // Price ID field
      priceId: field(
        z.string().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.payment.priceId.label",
          description: "app.api.v1.core.payment.priceId.description",
          placeholder: "app.api.v1.core.payment.priceId.placeholder",
          layout: { columns: 12 },
          validation: { required: true },
        },
      ),

      // Checkout mode field
      mode: field(
        z.enum(CheckoutMode),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.payment.mode.label",
          description: "app.api.v1.core.payment.mode.description",
          options: CheckoutModeOptions,
          layout: { columns: 12 },
          validation: { required: true },
        },
      ),

      // Payment method types field
      paymentMethodTypes: field(
        z.array(z.enum(PaymentMethodType)).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.payment.create.paymentMethodTypes.label",
          description:
            "app.api.v1.core.payment.create.paymentMethodTypes.description",
          options: PaymentMethodTypeOptions,
          layout: { columns: 12 },
        },
      ),

      // Success URL field
      successUrl: field(
        z.string().url().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.URL,
          label: "app.api.v1.core.payment.create.successUrl.label",
          description: "app.api.v1.core.payment.create.successUrl.description",
          placeholder: "app.api.v1.core.payment.create.successUrl.placeholder",
          layout: { columns: 6 },
        },
      ),

      // Cancel URL field
      cancelUrl: field(
        z.string().url().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.URL,
          label: "app.api.v1.core.payment.create.cancelUrl.label",
          description: "app.api.v1.core.payment.create.cancelUrl.description",
          placeholder: "app.api.v1.core.payment.create.cancelUrl.placeholder",
          layout: { columns: 6 },
        },
      ),

      // Customer email field
      customerEmail: field(
        z.email().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label: "app.api.v1.core.payment.create.customerEmail.label",
          description:
            "app.api.v1.core.payment.create.customerEmail.description",
          placeholder:
            "app.api.v1.core.payment.create.customerEmail.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Session URL - response only
      sessionUrl: field(
        z.string().url(),
        {
          GET: { response: true },
          POST: { response: true },
        },
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.payment.get.response.sessionUrl",
        },
      ),

      // Session ID - response only
      sessionId: field(
        z.string(),
        {
          GET: { response: true },
          POST: { response: true },
        },
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.payment.get.response.sessionId",
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
          content: "app.api.v1.core.payment.create.success.message",
        },
      ),
    },
  ),

  // Shared error and success configuration
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.payment.errors.validation.title",
      description: "app.api.v1.core.payment.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.payment.errors.notFound.title",
      description: "app.api.v1.core.payment.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.payment.errors.unauthorized.title",
      description: "app.api.v1.core.payment.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.payment.errors.forbidden.title",
      description: "app.api.v1.core.payment.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.payment.errors.server.title",
      description: "app.api.v1.core.payment.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.payment.errors.network.title",
      description: "app.api.v1.core.payment.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.payment.errors.unknown.title",
      description: "app.api.v1.core.payment.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.payment.errors.unsavedChanges.title",
      description: "app.api.v1.core.payment.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.payment.errors.conflict.title",
      description: "app.api.v1.core.payment.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.payment.success.title",
    description: "app.api.v1.core.payment.success.description",
  },

  // Method-specific examples
  examples: {
    GET: {
      responses: {
        default: {
          priceId: "price_1234567890",
          mode: CheckoutMode.PAYMENT,
          paymentMethodTypes: [
            PaymentMethodType.CARD,
            PaymentMethodType.PAYPAL,
          ],
          successUrl: "https://example.com/success",
          cancelUrl: "https://example.com/cancel",
          customerEmail: "user@example.com",
          sessionUrl: "https://checkout.stripe.com/pay/cs_test_1234567890",
          sessionId: "cs_test_1234567890",
        },
        minimal: {
          priceId: "price_1234567890",
          mode: CheckoutMode.PAYMENT,
          sessionUrl: "https://checkout.stripe.com/pay/cs_test_1234567890",
          sessionId: "cs_test_1234567890",
        },
      },
    },
    POST: {
      requests: {
        default: {
          priceId: "price_1234567890",
          mode: CheckoutMode.PAYMENT,
          paymentMethodTypes: [
            PaymentMethodType.CARD,
            PaymentMethodType.PAYPAL,
          ],
          successUrl: "https://example.com/success",
          cancelUrl: "https://example.com/cancel",
          customerEmail: "user@example.com",
        },
        minimal: {
          priceId: "price_1234567890",
          mode: CheckoutMode.PAYMENT,
        },
      },
      responses: {
        default: {
          priceId: "price_1234567890",
          mode: CheckoutMode.PAYMENT,
          paymentMethodTypes: [
            PaymentMethodType.CARD,
            PaymentMethodType.PAYPAL,
          ],
          successUrl: "https://example.com/success",
          cancelUrl: "https://example.com/cancel",
          customerEmail: "user@example.com",
          sessionUrl: "https://checkout.stripe.com/pay/cs_test_1234567890",
          sessionId: "cs_test_1234567890",
          message: "Payment session created successfully",
        },
        minimal: {
          priceId: "price_1234567890",
          mode: CheckoutMode.PAYMENT,
          sessionUrl: "https://checkout.stripe.com/pay/cs_test_1234567890",
          sessionId: "cs_test_1234567890",
          message: "Payment session created successfully",
        },
      },
    },
  },
});

// Extract types using the new enhanced system
export type PaymentGetRequestInput = typeof GET.types.RequestInput;
export type PaymentGetRequestOutput = typeof GET.types.RequestOutput;
export type PaymentGetResponseInput = typeof GET.types.ResponseInput;
export type PaymentGetResponseOutput = typeof GET.types.ResponseOutput;

export type PaymentPostRequestInput = typeof POST.types.RequestInput;
export type PaymentPostRequestOutput = typeof POST.types.RequestOutput;
export type PaymentPostResponseInput = typeof POST.types.ResponseInput;
export type PaymentPostResponseOutput = typeof POST.types.ResponseOutput;

// Additional type aliases for compatibility
export type PaymentCreateRequestOutput = PaymentPostRequestOutput;
export type PaymentUpdateType = PaymentPostRequestOutput;
export interface PaymentDeleteType {
  paymentMethodId: string;
}

// Additional type exports for cross-domain usage
export interface PaymentResponseType {
  success: boolean;
  message?: string;
  invoices?: Array<{
    id: string;
    userId: string;
    stripeInvoiceId: string;
    invoiceNumber: string;
    amount: number;
    currency: string;
    status: string;
    invoiceUrl?: string;
    invoicePdf?: string;
    dueDate: string;
    paidAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
}

// Schema types and schemas removed - use EndpointDefinition types from above instead

/**
 * Export definitions
 */
const paymentDefinition = {
  GET,
  POST,
};

export { GET, POST };
export default paymentDefinition;
