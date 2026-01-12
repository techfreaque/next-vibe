/**
 * Credits Purchase API Route Definition
 * Defines endpoint for purchasing credit packs via Stripe
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
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

import {
  PaymentProvider,
  PaymentProviderDB,
  PaymentProviderOptions,
} from "../../payment/enum";

/**
 * Purchase Credits Endpoint (POST)
 * Creates Stripe checkout session for credit pack purchase
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["credits", "purchase"],
  title: "app.api.credits.purchase.post.title",
  description: "app.api.credits.purchase.post.description",
  category: "app.api.agent.chat.category",
  tags: ["app.api.agent.chat.tags.credits", "app.api.agent.chat.tags.balance"],
  icon: "dollar-sign",
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.credits.purchase.post.container.title",
      description: "app.api.credits.purchase.post.container.description",
      layoutType: LayoutType.STACKED,
    },
    {
      request: "data",
      response: true,
    },
    {
      // === REQUEST FIELDS ===
      quantity: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.INT,
          label: "app.api.credits.purchase.post.quantity.label",
          description: "app.api.credits.purchase.post.quantity.description",
          placeholder: "app.api.credits.purchase.post.quantity.placeholder",
        },
        z.coerce.number().int().min(1).max(10),
      ),

      provider: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.credits.purchase.post.provider.label",
          description: "app.api.credits.purchase.post.provider.description",
          placeholder: "app.api.credits.purchase.post.provider.placeholder",
          options: PaymentProviderOptions,
        },
        z.enum(PaymentProviderDB).default(PaymentProvider.STRIPE),
      ),

      // === RESPONSE FIELDS ===
      checkoutUrl: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.credits.purchase.post.checkoutUrl.content",
        },
        z.string().url(),
      ),

      sessionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.credits.purchase.post.sessionId.content",
        },
        z.string(),
      ),

      totalAmount: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.credits.purchase.post.totalAmount.content",
        },
        z.coerce.number().int(),
      ),

      totalCredits: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.credits.purchase.post.totalCredits.content",
        },
        z.coerce.number().int(),
      ),
    },
  ),

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.credits.purchase.post.success.title",
    description: "app.api.credits.purchase.post.success.description",
  },

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.credits.purchase.post.errors.validation.title",
      description:
        "app.api.credits.purchase.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.credits.purchase.post.errors.network.title",
      description: "app.api.credits.purchase.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.credits.purchase.post.errors.unauthorized.title",
      description:
        "app.api.credits.purchase.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.credits.purchase.post.errors.forbidden.title",
      description: "app.api.credits.purchase.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.credits.purchase.post.errors.notFound.title",
      description: "app.api.credits.purchase.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.credits.purchase.post.errors.server.title",
      description: "app.api.credits.purchase.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.credits.purchase.post.errors.unknown.title",
      description: "app.api.credits.purchase.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.credits.purchase.post.errors.unsavedChanges.title",
      description:
        "app.api.credits.purchase.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.credits.purchase.post.errors.conflict.title",
      description: "app.api.credits.purchase.post.errors.conflict.description",
    },
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        quantity: 2,
      },
    },
    responses: {
      default: {
        checkoutUrl: "https://checkout.stripe.com/c/pay/cs_test_...",
        sessionId: "cs_test_123456789",
        totalAmount: 1000,
        totalCredits: 1000,
      },
    },
  },
});

export default { POST } as const;

export type CreditsPurchasePostRequestOutput = typeof POST.types.RequestOutput;
export type CreditsPurchasePostResponseOutput =
  typeof POST.types.ResponseOutput;
