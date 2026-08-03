/**
 * Create Credit Note Endpoint
 * Creates a negative invoice (credit note) linked to an original invoice.
 * Posts a reversal journal entry: Dr Revenue, Cr AR.
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
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const CreditNoteCreateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CreditNoteCreateWidget })),
);

const lineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number(),
  taxRate: z.number().min(0).max(100).default(0),
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "credit-note", "create"],
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "minus" as const,
  tags: [
    "tags.payment" as const,
    "tags.invoice" as const,
    "tags.ar" as const,
    "tags.creditNote" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: CreditNoteCreateWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      // REQUEST FIELDS
      invoiceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "invoiceId.label" as const,
        description: "invoiceId.description" as const,
        placeholder: "invoiceId.placeholder" as const,
        columns: 12,
        schema: z.uuid(),
      }),

      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "companyId.label" as const,
        description: "companyId.description" as const,
        placeholder: "companyId.placeholder" as const,
        columns: 12,
        schema: z.uuid(),
      }),

      reason: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "reason.label" as const,
        description: "reason.description" as const,
        placeholder: "reason.placeholder" as const,
        columns: 12,
        schema: z.string().min(1).max(1000),
      }),

      lineItems: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "lineItems.label" as const,
        description: "lineItems.description" as const,
        placeholder: "lineItems.placeholder" as const,
        columns: 12,
        schema: z.array(lineItemSchema).optional(),
      }),

      // RESPONSE FIELDS
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.boolean(),
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.message" as const,
        schema: z.string().nullable(),
      }),

      creditNote: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.creditNote.title" as const,
        description: "post.response.creditNote.subtitle" as const,
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.creditNote.id" as const,
            schema: z.uuid(),
          }),
          invoiceId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.creditNote.invoiceId" as const,
            schema: z.uuid(),
          }),
          companyId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.creditNote.companyId" as const,
            schema: z.uuid().nullable(),
          }),
          currency: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.creditNote.currency" as const,
            schema: z.string(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.creditNote.status" as const,
            schema: z.string(),
          }),
          amount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.creditNote.amount" as const,
            schema: z.string(),
          }),
          reason: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.creditNote.reason" as const,
            schema: z.string(),
          }),
          createdAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.creditNote.createdAt" as const,
            schema: dateSchema,
          }),
          updatedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.creditNote.updatedAt" as const,
            schema: dateSchema,
          }),
        },
      }),
    },
  }),

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

  examples: {
    requests: {
      default: {
        invoiceId: "456e7890-e89b-12d3-a456-426614174000",
        companyId: "00000000-0000-0000-0000-000000000001",
        reason: "Returned goods — partial shipment rejected",
      },
    },
    responses: {
      default: {
        success: true,
        message: null,
        creditNote: {
          id: "789e0123-e89b-12d3-a456-426614174000",
          invoiceId: "456e7890-e89b-12d3-a456-426614174000",
          companyId: "00000000-0000-0000-0000-000000000001",
          currency: "EUR",
          status: "OPEN",
          amount: "-500.00",
          reason: "Returned goods — partial shipment rejected",
          createdAt: "2024-01-15T00:00:00.000Z",
          updatedAt: "2024-01-15T00:00:00.000Z",
        },
      },
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },
});

export type CreditNoteCreateRequestInput = typeof POST.types.RequestInput;
export type CreditNoteCreateRequestOutput = typeof POST.types.RequestOutput;
export type CreditNoteCreateResponseInput = typeof POST.types.ResponseInput;
export type CreditNoteCreateResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
