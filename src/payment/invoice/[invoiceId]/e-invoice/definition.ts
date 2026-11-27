/**
 * Invoice E-Invoice Endpoint
 * GET: structured XML and missing details for an issued sales document.
 */

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

import { UBL_FIELD_IDS } from "@/finance/e-invoice/ubl";

import { scopedTranslation } from "./i18n";

const InvoiceEInvoiceWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InvoiceEInvoiceWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["payment", "invoice", "[invoiceId]", "e-invoice"],
  aliases: ["invoice-e-invoice"],
  title: "title" as const,
  titleShort: "titleShort" as const,
  description: "description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "file-code" as const,
  tags: [
    "tags.payment" as const,
    "tags.invoice" as const,
    "tags.eInvoice" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: InvoiceEInvoiceWidgetLazy,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      invoiceId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "invoiceId.label" as const,
        description: "invoiceId.description" as const,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/payment/invoice/list/definition")).default.GET,
        labelField: "invoiceSequenceNumber",
      }),

      buyerReference: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "buyerReference.label",
        description: "buyerReference.description",
        schema: z.string().trim().min(1).max(100).optional(),
      }),
      jurisdiction: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.fileName",
        hidden: true,
        schema: z.enum(["peppol", "sk-efaktura"]),
      }),
      xrechnung: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "widget.xrechnung",
        hidden: true,
        schema: z
          .object({
            fileName: z.string(),
            xml: z.string(),
            missingFields: z.array(
              z.object({ field: z.enum(UBL_FIELD_IDS), label: z.string() }),
            ),
          })
          .optional(),
      }),
      invoiceNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.invoiceNumber" as const,
        schema: z.string(),
      }),
      isCreditNote: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.isCreditNote" as const,
        schema: z.boolean(),
      }),
      fileName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.fileName" as const,
        schema: z.string(),
      }),
      ready: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.ready" as const,
        schema: z.boolean(),
      }),
      missingFields: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.missingFields" as const,
        schema: z.array(
          z.object({ field: z.enum(UBL_FIELD_IDS), label: z.string() }),
        ),
      }),
      xml: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.xml" as const,
        hidden: true,
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

  examples: {
    requests: {
      default: {},
      withBuyerReference: { buyerReference: "PURCHASE-42" },
    },
    urlPathParams: {
      default: { invoiceId: "456e7890-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        invoiceNumber: "2026000042",
        jurisdiction: "peppol",
        isCreditNote: false,
        fileName: "invoice-2026000042.xml",
        ready: false,
        missingFields: [{ field: "BT-48", label: "Customer VAT ID" }],
        xml: '<?xml version="1.0" encoding="UTF-8"?>\n<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"></Invoice>\n',
      },
    },
  },

  successTypes: {
    title: "success.title" as const,
    description: "success.description" as const,
  },
});

export type InvoiceEInvoiceRequestOutput = typeof GET.types.RequestOutput;
export type InvoiceEInvoiceUrlPathParams = typeof GET.types.UrlVariablesOutput;
export type InvoiceEInvoiceResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
