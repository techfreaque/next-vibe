/**
 * Get Invoice Endpoint
 * GET — retrieve a single invoice with all its line items
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { LINE_SETTLEMENT_V1 } from "@/tax/line-settlement";

import { InvoiceStatus } from "../../../enum";
import { scopedTranslation } from "./i18n";

const InvoiceGetWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InvoiceGetWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["payment", "invoice", "[invoiceId]", "get"],
  aliases: ["payment-invoice-get"],
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "file-text" as const,
  tags: ["tags.payment" as const, "tags.invoice" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: InvoiceGetWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      // URL PATH PARAMS
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

      // RESPONSE FIELDS
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.id" as const,
        schema: z.string(),
      }),
      companyName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.companyId",
        schema: z.string().nullable(),
      }),
      canManage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
      invoiceNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "widget.invoiceNumber",
        schema: z.string().nullable(),
      }),
      canCreateCreditNote: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
      companyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.companyId" as const,
        schema: z.string().nullable(),
      }),
      customerId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.customerId" as const,
        schema: z.string().nullable(),
      }),
      customerName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "widget.customer",
        schema: z.string().nullable(),
      }),
      sourceEstimate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "widget.sourceQuote",
        hidden: true,
        schema: z.object({ id: z.uuid(), number: z.string() }).optional(),
      }),
      invoiceSequenceNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.invoiceSequenceNumber" as const,
        schema: z.number().nullable(),
      }),
      currency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.currency" as const,
        schema: z.string(),
      }),
      lineSettlement: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.literal(LINE_SETTLEMENT_V1).optional(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.status" as const,
        schema: z.string(),
      }),
      amount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.amount" as const,
        schema: z.string(),
      }),
      remainingCredit: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.remainingCredit",
        schema: z.number().nonnegative().optional(),
      }),
      amountPaid: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.amountPaid",
        schema: z.number(),
      }),
      amountDue: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.amountDue",
        schema: z.number(),
      }),
      dueDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.dueDate" as const,
        schema: dateSchema.nullable(),
      }),
      paidAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.paidAt" as const,
        schema: dateSchema.nullable(),
      }),
      notes: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.notes" as const,
        schema: z.string().nullable(),
      }),
      journalEntryId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.journalEntryId" as const,
        schema: z.string().nullable(),
      }),
      voidReversal: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "widget.viewVoidReversal" as const,
        schema: z
          .object({
            originalEntryNumber: z.string().optional(),
            entryId: z.uuid(),
            entryNumber: z.string(),
            effectiveDate: dateSchema,
          })
          .optional(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.createdAt" as const,
        schema: dateSchema,
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.updatedAt" as const,
        schema: dateSchema,
      }),

      receipts: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          usage: { response: true },
          children: {
            entryId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "widget.receiptReference",
              schema: z.uuid(),
              hidden: true,
            }),
            entryNumber: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "widget.journalEntry",
              schema: z.string(),
            }),
            reference: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "widget.receiptReference",
              schema: z.string().nullable(),
            }),
            date: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "widget.receiptDate",
              schema: dateSchema,
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "widget.receiptAmount",
              schema: z.number(),
            }),
            reversed: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "widget.receiptReversed",
              schema: z.boolean(),
            }),
            reversalDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "widget.reversalDate",
              schema: dateSchema.nullable(),
            }),
            reversalEntryNumber: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "widget.journalEntry",
              schema: z.string().nullable(),
            }),
            reversalReason: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "widget.reversalReason",
              schema: z.string().nullable(),
            }),
          },
        }),
      }),
      recentReminders: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z
          .array(
            z.object({
              id: z.string(),
              preparedAt: z.string(),
              dueDate: z.string(),
              currency: z.string(),
              amount: z.string(),
              note: z.string().nullable(),
            }),
          )
          .optional(),
      }),
      lines: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.lineId" as const,
              schema: z.string(),
            }),
            description: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.lineDescription" as const,
              schema: z.string(),
            }),
            productId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.productId" as const,
              schema: z.string().nullable(),
            }),
            quantity: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.quantity" as const,
              schema: z.number(),
            }),
            unitPrice: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.unitPrice" as const,
              schema: z.number(),
            }),
            taxRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.taxRate" as const,
              schema: z.number().nullable(),
            }),
            taxAmount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.taxAmount" as const,
              schema: z.number(),
            }),
            lineTotal: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.lineTotal" as const,
              schema: z.number(),
            }),
            sortOrder: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.sortOrder" as const,
              schema: z.number().nullable(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.lineCreatedAt" as const,
              schema: dateSchema,
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.lineUpdatedAt" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  examples: {
    urlPathParams: {
      default: {
        invoiceId: "456e7890-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        id: "456e7890-e89b-12d3-a456-426614174000",
        companyName: "Harbour Ledger & Supply",
        canManage: true,
        invoiceNumber: "INV-1042",
        canCreateCreditNote: true,
        companyId: "00000000-0000-0000-0000-000000000001",
        customerId: null,
        customerName: null,
        invoiceSequenceNumber: 1042,
        currency: "EUR",
        status: InvoiceStatus.OPEN,
        amount: "325.00",
        amountPaid: 0,
        amountDue: 325,
        dueDate: null,
        paidAt: null,
        notes: null,
        journalEntryId: null,
        voidReversal: undefined,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
        receipts: [],
        lines: [],
      },
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },
});

export type InvoiceGetUrlPathParams = typeof GET.types.UrlVariablesOutput;
export type InvoiceGetRequestInput = typeof GET.types.RequestInput;
export type InvoiceGetRequestOutput = typeof GET.types.RequestOutput;
export type InvoiceGetResponseInput = typeof GET.types.ResponseInput;
export type InvoiceGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
