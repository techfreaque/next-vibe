/**
 * Payment API Endpoint Definition
 * Defines the API endpoints for payment processing
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestResponseField,
  scopedResponseField,
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
import { scopedTranslation } from "./i18n";

/**
 * GET endpoint for retrieving payment information
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["payment"],
  title: "get.title" as const,
  description: "get.description" as const,
  icon: "credit-card",
  category: "app.endpointCategories.credits",
  tags: ["tags.payment" as const, "tags.stripe" as const, "tags.info" as const],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF] as const,

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "form.title" as const,
    description: "form.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      priceId: scopedResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "priceId.label" as const,
        description: "priceId.description" as const,
        placeholder: "priceId.placeholder" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      mode: scopedResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "mode.label" as const,
        description: "mode.description" as const,
        options: CheckoutModeOptions,
        columns: 12,
        schema: z.enum(CheckoutMode),
      }),
      paymentMethodTypes: scopedResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "create.paymentMethodTypes.label" as const,
        description: "create.paymentMethodTypes.description" as const,
        options: PaymentMethodTypeOptions,
        columns: 12,
        schema: z.array(z.enum(PaymentMethodType)).optional(),
      }),
      successUrl: scopedResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.URL,
        label: "create.successUrl.label" as const,
        description: "create.successUrl.description" as const,
        placeholder: "create.successUrl.placeholder" as const,
        columns: 6,
        schema: z.string().url().optional(),
      }),
      cancelUrl: scopedResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.URL,
        label: "create.cancelUrl.label" as const,
        description: "create.cancelUrl.description" as const,
        placeholder: "create.cancelUrl.placeholder" as const,
        columns: 6,
        schema: z.string().url().optional(),
      }),
      customerEmail: scopedResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "create.customerEmail.label" as const,
        description: "create.customerEmail.description" as const,
        placeholder: "create.customerEmail.placeholder" as const,
        columns: 12,
        schema: z.string().email().optional(),
      }),
      sessionUrl: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.sessionUrl" as const,
        schema: z.string().url(),
      }),
      sessionId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.sessionId" as const,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
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
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "success.title" as const,
    description: "success.description" as const,
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
  scopedTranslation,
  method: Methods.POST,
  path: ["payment"],
  title: "create.title" as const,
  description: "create.description" as const,
  icon: "shopping-cart",
  category: "app.endpointCategories.credits",
  tags: [
    "tags.payment" as const,
    "tags.stripe" as const,
    "tags.checkout" as const,
  ],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF] as const,

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "form.title" as const,
    description: "form.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      priceId: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "priceId.label" as const,
        description: "priceId.description" as const,
        placeholder: "priceId.placeholder" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      mode: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "mode.label" as const,
        description: "mode.description" as const,
        options: CheckoutModeOptions,
        columns: 12,
        schema: z.enum(CheckoutMode),
      }),
      paymentMethodTypes: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "create.paymentMethodTypes.label" as const,
        description: "create.paymentMethodTypes.description" as const,
        options: PaymentMethodTypeOptions,
        columns: 12,
        schema: z.array(z.enum(PaymentMethodType)).optional(),
      }),
      successUrl: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.URL,
        label: "create.successUrl.label" as const,
        description: "create.successUrl.description" as const,
        placeholder: "create.successUrl.placeholder" as const,
        columns: 6,
        schema: z.string().url().optional(),
      }),
      cancelUrl: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.URL,
        label: "create.cancelUrl.label" as const,
        description: "create.cancelUrl.description" as const,
        placeholder: "create.cancelUrl.placeholder" as const,
        columns: 6,
        schema: z.string().url().optional(),
      }),
      customerEmail: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "create.customerEmail.label" as const,
        description: "create.customerEmail.description" as const,
        placeholder: "create.customerEmail.placeholder" as const,
        columns: 12,
        schema: z.string().email().optional(),
      }),
      sessionUrl: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.sessionUrl" as const,
        schema: z.string().url(),
      }),
      sessionId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.sessionId" as const,
        schema: z.string(),
      }),
      message: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "create.success.message" as const,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
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
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "success.title" as const,
    description: "success.description" as const,
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
