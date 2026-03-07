/**
 * Credits Purchase API Route Definition
 * Defines endpoint for purchasing credit packs via Stripe
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  PaymentProvider,
  PaymentProviderDB,
  PaymentProviderOptions,
} from "../../payment/enum";
import { scopedTranslation } from "./i18n";
import { CreditsPurchaseContainer } from "./widget";

/**
 * Purchase Credits Endpoint (POST)
 * Creates Stripe checkout session for credit pack purchase
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["credits", "purchase"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.credits",
  tags: ["post.title"],
  icon: "dollar-sign",
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: CreditsPurchaseContainer,
    usage: {
      request: "data",
      response: true,
    } as const,
    children: {
      // === REQUEST FIELDS ===
      quantity: scopedRequestField(scopedTranslation, {
        schema: z.coerce.number().int().min(1).default(1),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.INT,
        label: "post.quantity.label",
        description: "post.quantity.description",
        placeholder: "post.quantity.placeholder",
      }),

      provider: scopedRequestField(scopedTranslation, {
        schema: z.enum(PaymentProviderDB).default(PaymentProvider.STRIPE),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.provider.label",
        description: "post.provider.description",
        placeholder: "post.provider.placeholder",
        options: PaymentProviderOptions,
      }),

      // === RESPONSE FIELDS ===
      checkoutUrl: scopedResponseField(scopedTranslation, {
        schema: z.string().url(),
        type: WidgetType.TEXT,
        content: "post.checkoutUrl.content",
      }),

      sessionId: scopedResponseField(scopedTranslation, {
        schema: z.string(),
        type: WidgetType.TEXT,
        content: "post.sessionId.content",
      }),

      totalAmount: scopedResponseField(scopedTranslation, {
        schema: z.coerce.number().int(),
        type: WidgetType.TEXT,
        content: "post.totalAmount.content",
      }),

      totalCredits: scopedResponseField(scopedTranslation, {
        schema: z.coerce.number().int(),
        type: WidgetType.TEXT,
        content: "post.totalCredits.content",
      }),
    },
  }),

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
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
