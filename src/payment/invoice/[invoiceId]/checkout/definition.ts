import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../recurring/i18n";

const InvoiceCheckoutWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InvoiceCheckoutWidget })),
);

const errorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.network.title" as const,
    description: "errors.network.description" as const,
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "errors.unauthorized.title" as const,
    description: "errors.unauthorized.description" as const,
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "errors.forbidden.title" as const,
    description: "errors.forbidden.description" as const,
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.notFound.title" as const,
    description: "errors.notFound.description" as const,
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.server.title" as const,
    description: "errors.server.description" as const,
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
} as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "invoice", "[invoiceId]", "checkout"],
  aliases: ["invoice-payment-link"],
  title: "checkout.title" as const,
  titleShort: "checkout.title" as const,
  description: "checkout.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "credit-card" as const,
  tags: ["tags.payment" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  fields: customWidgetObject({
    render: InvoiceCheckoutWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      invoiceId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "fields.invoiceId" as const,
        schema: z.uuid(),
        hidden: true,
        listEndpoint: async () =>
          (await import("../../list/definition")).default.GET,
        labelField: "invoiceSequenceNumber",
      }),
      sessionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "checkout.sessionId" as const,
        schema: z.string(),
      }),
      paymentUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "checkout.paymentUrl" as const,
        schema: z.string(),
      }),
      amountCents: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "checkout.amountCents" as const,
        schema: z.number().int(),
      }),
      currency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.currency" as const,
        schema: z.string(),
      }),
      reused: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "checkout.reused" as const,
        schema: z.boolean(),
      }),
    },
  }),
  errorTypes,
  examples: {
    urlPathParams: {
      default: { invoiceId: "456e7890-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        sessionId: "cs_test_123",
        paymentUrl: "https://checkout.stripe.com/c/pay/cs_test_123",
        amountCents: 119000,
        currency: "EUR",
        reused: false,
      },
    },
  },
  successTypes: {
    title: "checkout.success" as const,
    description: "checkout.description" as const,
  },
});

export type InvoiceCheckoutPath = typeof POST.types.UrlVariablesOutput;
export type InvoiceCheckoutResponse = typeof POST.types.ResponseOutput;

export default { POST };
