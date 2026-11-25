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
  requestField,
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { accountingDateSchema } from "@/chart-of-accounts/shared/calendar-date";

import { scopedTranslation } from "./i18n";

const ReceiptReverseWidget = lazyWidget(() =>
  import("./widget").then((module) => ({
    default: module.InvoiceReversePaymentWidget,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "invoice", "[invoiceId]", "reverse-payment"],
  aliases: ["invoice-reverse-payment"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "payments",
  subCategory: "Transactions",
  icon: "refresh-cw",
  tags: ["tags.payment", "tags.invoice"],
  allowedRoles: [UserRole.ADMIN],
  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { refreshInvoiceDocuments } =
          await import("@/finance/document-cache");
        await refreshInvoiceDocuments(data.logger, data.pathParams.invoiceId);
      },
    },
  },
  fields: customWidgetObject({
    render: ReceiptReverseWidget,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      invoiceId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "invoiceId",
        schema: z.uuid(),
        hidden: true,
      }),
      paymentEntryId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "entryId",
        schema: z.uuid(),
      }),
      reversalDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "date",
        placeholder: "datePlaceholder",
        schema: accountingDateSchema.optional(),
      }),
      reason: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "reason",
        placeholder: "reasonPlaceholder",
        schema: z.string().trim().min(1).max(500),
      }),
      reversalId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "reversal",
        schema: z.uuid(),
        hidden: true,
      }),
      reversalEntryNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "reversal",
        schema: z.string(),
      }),
    },
  }),
  errorTypes: {
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
  },

  successTypes: { title: "success.title", description: "success.description" },
  examples: {
    urlPathParams: {
      default: { invoiceId: "00000000-0000-4000-8000-000000000001" },
    },
    requests: {
      default: {
        paymentEntryId: "00000000-0000-4000-8000-000000000002",
        reason: "The bank returned the payment.",
      },
    },
    responses: {
      default: {
        reversalId: "00000000-0000-4000-8000-000000000003",
        reversalEntryNumber: "JE-2026-0042",
      },
    },
  },
});

export type InvoiceReversePaymentRequest = typeof POST.types.RequestOutput;
export type InvoiceReversePaymentResponse = typeof POST.types.ResponseOutput;
const definitions = { POST } as const;
export default definitions;
