/**
 * Credits Purchase API Route Definition
 * Defines endpoint for purchasing credit packs via Stripe
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
  path: ["v1", "core", "credits", "purchase"],
  title: "app.api.v1.core.agent.chat.credits.purchase.post.title",
  description: "app.api.v1.core.agent.chat.credits.purchase.post.description",
  category: "app.api.v1.core.agent.chat.category",
  tags: [
    "app.api.v1.core.agent.chat.tags.credits",
    "app.api.v1.core.agent.chat.tags.balance",
  ],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.chat.credits.purchase.post.container.title",
      description:
        "app.api.v1.core.agent.chat.credits.purchase.post.container.description",
      layout: { type: LayoutType.STACKED },
    },
    {
      request: "data", response: true
    },
    {
      // === REQUEST FIELDS ===
      quantity: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.INT,
          label:
            "app.api.v1.core.agent.chat.credits.purchase.post.quantity.label",
          description:
            "app.api.v1.core.agent.chat.credits.purchase.post.quantity.description",
          placeholder:
            "app.api.v1.core.agent.chat.credits.purchase.post.quantity.placeholder",
          validation: { required: true, min: 1, max: 10 },
        },
        z.number().int().min(1).max(10),
      ),

      provider: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.agent.chat.credits.purchase.post.provider.label",
          description:
            "app.api.v1.core.agent.chat.credits.purchase.post.provider.description",
          placeholder:
            "app.api.v1.core.agent.chat.credits.purchase.post.provider.placeholder",
          validation: { required: false },
          options: PaymentProviderOptions,
        },
        z.enum(PaymentProviderDB).default(PaymentProvider.STRIPE),
      ),

      // === RESPONSE FIELDS ===
      checkoutUrl: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.credits.purchase.post.checkoutUrl.content",
        },
        z.string().url(),
      ),

      sessionId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.credits.purchase.post.sessionId.content",
        },
        z.string(),
      ),

      totalAmount: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.credits.purchase.post.totalAmount.content",
        },
        z.number().int(),
      ),

      totalCredits: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.credits.purchase.post.totalCredits.content",
        },
        z.number().int(),
      ),
    },
  ),

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.agent.chat.credits.purchase.post.success.title",
    description:
      "app.api.v1.core.agent.chat.credits.purchase.post.success.description",
  },

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.validation.title",
      description:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.server.title",
      description:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.conflict.description",
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
