/**
 * Credits Purchase API Route Definition
 * Defines endpoint for purchasing credit packs via Stripe
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  requestField,
  responseField,
  submitButton,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
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

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

const CreditsPurchaseContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CreditsPurchaseContainer })),
);

/**
 * Purchase Credits Endpoint (POST)
 * Creates Stripe checkout session for credit pack purchase
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["credits", "purchase"],
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "credits" as const,
  subCategory: "Management" as const,
  tags: ["post.title" as const],
  icon: "dollar-sign" as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: CreditsPurchaseContainer,
    usage: {
      request: "data",
      response: true,
    } as const,
    children: {
      // === REQUEST FIELDS ===
      quantity: requestField(scopedTranslation, {
        schema: z.coerce.number().int().min(1).default(1),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.INT,
        label: "post.quantity.label" as const,
        description: "post.quantity.description" as const,
        placeholder: "post.quantity.placeholder" as const,
      }),

      provider: requestField(scopedTranslation, {
        schema: z.enum(PaymentProviderDB).default(PaymentProvider.STRIPE),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.provider.label" as const,
        description: "post.provider.description" as const,
        placeholder: "post.provider.placeholder" as const,
        options: PaymentProviderOptions,
      }),

      // === RESPONSE FIELDS ===
      checkoutUrl: responseField(scopedTranslation, {
        schema: z.string().url(),
        type: WidgetType.TEXT,
        content: "post.checkoutUrl.content" as const,
      }),

      sessionId: responseField(scopedTranslation, {
        schema: z.string(),
        type: WidgetType.TEXT,
        content: "post.sessionId.content" as const,
      }),

      totalAmount: responseField(scopedTranslation, {
        schema: z.coerce.number().int(),
        type: WidgetType.TEXT,
        content: "post.totalAmount.content" as const,
      }),

      totalCredits: responseField(scopedTranslation, {
        schema: z.coerce.number().int(),
        type: WidgetType.TEXT,
        content: "post.totalCredits.content" as const,
      }),
      backButton: backButton(scopedTranslation, {
        label: "post.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "send",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
      }),
    },
  }),

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

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
