/**
 * Payment API Endpoint Definition
 * Defines the API endpoints for payment processing
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import { objectField } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  requestResponseField,
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

import {
  CheckoutMode,
  CheckoutModeOptions,
  PaymentMethodType,
  PaymentMethodTypeOptions,
} from "./enum";

/**
 * GET endpoint for retrieving payment information
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["payment"],
  title: "app.api.payment.get.title" as const,
  description: "app.api.payment.get.description" as const,
  icon: "credit-card",
  category: "app.api.payment.category" as const,
  tags: [
    "app.api.payment.tags.payment" as const,
    "app.api.payment.tags.stripe" as const,
    "app.api.payment.tags.info" as const,
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
      title: "app.api.payment.form.title" as const,
      description: "app.api.payment.form.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { response: true },
    {
      priceId: responseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.payment.priceId.label" as const,
        description: "app.api.payment.priceId.description" as const,
        placeholder: "app.api.payment.priceId.placeholder" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      mode: responseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.payment.mode.label" as const,
        description: "app.api.payment.mode.description" as const,
        options: CheckoutModeOptions,
        columns: 12,
        schema: z.enum(CheckoutMode),
      }),
      paymentMethodTypes: responseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "app.api.payment.create.paymentMethodTypes.label" as const,
        description:
          "app.api.payment.create.paymentMethodTypes.description" as const,
        options: PaymentMethodTypeOptions,
        columns: 12,
        schema: z.array(z.enum(PaymentMethodType)).optional(),
      }),
      successUrl: responseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.URL,
        label: "app.api.payment.create.successUrl.label" as const,
        description: "app.api.payment.create.successUrl.description" as const,
        placeholder: "app.api.payment.create.successUrl.placeholder" as const,
        columns: 6,
        schema: z.string().url().optional(),
      }),
      cancelUrl: responseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.URL,
        label: "app.api.payment.create.cancelUrl.label" as const,
        description: "app.api.payment.create.cancelUrl.description" as const,
        placeholder: "app.api.payment.create.cancelUrl.placeholder" as const,
        columns: 6,
        schema: z.string().url().optional(),
      }),
      customerEmail: responseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "app.api.payment.create.customerEmail.label" as const,
        description:
          "app.api.payment.create.customerEmail.description" as const,
        placeholder:
          "app.api.payment.create.customerEmail.placeholder" as const,
        columns: 12,
        schema: z.string().email().optional(),
      }),
      sessionUrl: responseField({
        type: WidgetType.TEXT,
        content: "app.api.payment.get.response.sessionUrl" as const,
        schema: z.string().url(),
      }),
      sessionId: responseField({
        type: WidgetType.TEXT,
        content: "app.api.payment.get.response.sessionId" as const,
        schema: z.string(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.payment.errors.validation.title" as const,
      description: "app.api.payment.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.payment.errors.notFound.title" as const,
      description: "app.api.payment.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.payment.errors.unauthorized.title" as const,
      description: "app.api.payment.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.payment.errors.forbidden.title" as const,
      description: "app.api.payment.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.payment.errors.server.title" as const,
      description: "app.api.payment.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.payment.errors.network.title" as const,
      description: "app.api.payment.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.payment.errors.unknown.title" as const,
      description: "app.api.payment.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.payment.errors.unsavedChanges.title" as const,
      description: "app.api.payment.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.payment.errors.conflict.title" as const,
      description: "app.api.payment.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.payment.success.title" as const,
    description: "app.api.payment.success.description" as const,
  },

  examples: {
    responses: {
      default: {
        priceId: "price_1234567890",
        mode: CheckoutMode.PAYMENT,
        paymentMethodTypes: [PaymentMethodType.CARD, PaymentMethodType.PAYPAL],
        successUrl: "https://example.com/success",
        cancelUrl: "https://example.com/cancel",
        customerEmail: "user@example.com",
        sessionUrl: "https://checkout.stripe.com/pay/cs_test_1234567890",
        sessionId: "cs_test_1234567890",
      } as const,
      minimal: {
        priceId: "price_1234567890",
        mode: CheckoutMode.PAYMENT,
        sessionUrl: "https://checkout.stripe.com/pay/cs_test_1234567890",
        sessionId: "cs_test_1234567890",
      } as const,
    } as const,
  },
});

/**
 * POST endpoint for creating payment session
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["payment"],
  title: "app.api.payment.create.title" as const,
  description: "app.api.payment.create.description" as const,
  icon: "shopping-cart",
  category: "app.api.payment.category" as const,
  tags: [
    "app.api.payment.tags.payment" as const,
    "app.api.payment.tags.stripe" as const,
    "app.api.payment.tags.checkout" as const,
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
      title: "app.api.payment.form.title" as const,
      description: "app.api.payment.form.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      priceId: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.payment.priceId.label" as const,
        description: "app.api.payment.priceId.description" as const,
        placeholder: "app.api.payment.priceId.placeholder" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      mode: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.payment.mode.label" as const,
        description: "app.api.payment.mode.description" as const,
        options: CheckoutModeOptions,
        columns: 12,
        schema: z.enum(CheckoutMode),
      }),
      paymentMethodTypes: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "app.api.payment.create.paymentMethodTypes.label" as const,
        description:
          "app.api.payment.create.paymentMethodTypes.description" as const,
        options: PaymentMethodTypeOptions,
        columns: 12,
        schema: z.array(z.enum(PaymentMethodType)).optional(),
      }),
      successUrl: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.URL,
        label: "app.api.payment.create.successUrl.label" as const,
        description: "app.api.payment.create.successUrl.description" as const,
        placeholder: "app.api.payment.create.successUrl.placeholder" as const,
        columns: 6,
        schema: z.string().url().optional(),
      }),
      cancelUrl: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.URL,
        label: "app.api.payment.create.cancelUrl.label" as const,
        description: "app.api.payment.create.cancelUrl.description" as const,
        placeholder: "app.api.payment.create.cancelUrl.placeholder" as const,
        columns: 6,
        schema: z.string().url().optional(),
      }),
      customerEmail: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "app.api.payment.create.customerEmail.label" as const,
        description:
          "app.api.payment.create.customerEmail.description" as const,
        placeholder:
          "app.api.payment.create.customerEmail.placeholder" as const,
        columns: 12,
        schema: z.string().email().optional(),
      }),
      sessionUrl: responseField({
        type: WidgetType.TEXT,
        content: "app.api.payment.get.response.sessionUrl" as const,
        schema: z.string().url(),
      }),
      sessionId: responseField({
        type: WidgetType.TEXT,
        content: "app.api.payment.get.response.sessionId" as const,
        schema: z.string(),
      }),
      message: responseField({
        type: WidgetType.TEXT,
        content: "app.api.payment.create.success.message" as const,
        schema: z.string(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.payment.errors.validation.title" as const,
      description: "app.api.payment.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.payment.errors.notFound.title" as const,
      description: "app.api.payment.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.payment.errors.unauthorized.title" as const,
      description: "app.api.payment.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.payment.errors.forbidden.title" as const,
      description: "app.api.payment.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.payment.errors.server.title" as const,
      description: "app.api.payment.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.payment.errors.network.title" as const,
      description: "app.api.payment.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.payment.errors.unknown.title" as const,
      description: "app.api.payment.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.payment.errors.unsavedChanges.title" as const,
      description: "app.api.payment.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.payment.errors.conflict.title" as const,
      description: "app.api.payment.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.payment.success.title" as const,
    description: "app.api.payment.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        priceId: "price_1234567890",
        mode: CheckoutMode.PAYMENT,
        paymentMethodTypes: [PaymentMethodType.CARD, PaymentMethodType.PAYPAL],
        successUrl: "https://example.com/success",
        cancelUrl: "https://example.com/cancel",
        customerEmail: "user@example.com",
      } as const,
      minimal: {
        priceId: "price_1234567890",
        mode: CheckoutMode.PAYMENT,
      } as const,
    },
    responses: {
      default: {
        priceId: "price_1234567890",
        mode: CheckoutMode.PAYMENT,
        paymentMethodTypes: [PaymentMethodType.CARD, PaymentMethodType.PAYPAL],
        successUrl: "https://example.com/success",
        cancelUrl: "https://example.com/cancel",
        customerEmail: "user@example.com",
        sessionUrl: "https://checkout.stripe.com/pay/cs_test_1234567890",
        sessionId: "cs_test_1234567890",
        message: "Payment session created successfully",
      } as const,
      minimal: {
        priceId: "price_1234567890",
        mode: CheckoutMode.PAYMENT,
        sessionUrl: "https://checkout.stripe.com/pay/cs_test_1234567890",
        sessionId: "cs_test_1234567890",
        message: "Payment session created successfully",
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

/**
 * Export definitions
 */
const paymentDefinition = {
  GET,
  POST,
};

export default paymentDefinition;
