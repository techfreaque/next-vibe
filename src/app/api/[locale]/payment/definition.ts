/**
 * Payment API Endpoint Definition
 * Defines the API endpoints for payment processing using createFormEndpoint
 */

import { z } from "zod";

import { createFormEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create-form";
import {
  field,
  objectField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

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
  path: ["payment"],
  category: "app.api.payment.category",
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],

  // Method-specific configuration
  methods: {
    GET: {
      title: "app.api.payment.get.title",
      description: "app.api.payment.get.description",
      tags: [
        "app.api.payment.tags.payment",
        "app.api.payment.tags.stripe",
        "app.api.payment.tags.info",
      ],
    },
    POST: {
      title: "app.api.payment.create.title",
      description: "app.api.payment.create.description",
      tags: [
        "app.api.payment.tags.payment",
        "app.api.payment.tags.stripe",
        "app.api.payment.tags.checkout",
      ],
    },
  },

  // Shared field definitions - configured for GET (response-only) and POST (request+response)
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.payment.form.title",
      description: "app.api.payment.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
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
          label: "app.api.payment.priceId.label",
          description: "app.api.payment.priceId.description",
          placeholder: "app.api.payment.priceId.placeholder",
          columns: 12,
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
          label: "app.api.payment.mode.label",
          description: "app.api.payment.mode.description",
          options: CheckoutModeOptions,
          columns: 12,
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
          label: "app.api.payment.create.paymentMethodTypes.label",
          description: "app.api.payment.create.paymentMethodTypes.description",
          options: PaymentMethodTypeOptions,
          columns: 12,
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
          label: "app.api.payment.create.successUrl.label",
          description: "app.api.payment.create.successUrl.description",
          placeholder: "app.api.payment.create.successUrl.placeholder",
          columns: 6,
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
          label: "app.api.payment.create.cancelUrl.label",
          description: "app.api.payment.create.cancelUrl.description",
          placeholder: "app.api.payment.create.cancelUrl.placeholder",
          columns: 6,
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
          label: "app.api.payment.create.customerEmail.label",
          description: "app.api.payment.create.customerEmail.description",
          placeholder: "app.api.payment.create.customerEmail.placeholder",
          columns: 12,
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
          content: "app.api.payment.get.response.sessionUrl",
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
          content: "app.api.payment.get.response.sessionId",
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
          content: "app.api.payment.create.success.message",
        },
      ),
    },
  ),

  // Shared error and success configuration
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.payment.errors.validation.title",
      description: "app.api.payment.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.payment.errors.notFound.title",
      description: "app.api.payment.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.payment.errors.unauthorized.title",
      description: "app.api.payment.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.payment.errors.forbidden.title",
      description: "app.api.payment.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.payment.errors.server.title",
      description: "app.api.payment.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.payment.errors.network.title",
      description: "app.api.payment.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.payment.errors.unknown.title",
      description: "app.api.payment.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.payment.errors.unsavedChanges.title",
      description: "app.api.payment.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.payment.errors.conflict.title",
      description: "app.api.payment.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.payment.success.title",
    description: "app.api.payment.success.description",
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
