/**
 * Create AR Invoice Endpoint
 * Creates a new accounts receivable invoice in DRAFT status
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
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

import { scopedTranslation } from "./i18n";

const InvoiceCreateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InvoiceCreateWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "invoice", "create"],
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "file-plus" as const,
  tags: ["tags.payment" as const, "tags.invoice" as const, "tags.ar" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: InvoiceCreateWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      // REQUEST FIELDS
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "companyId.label" as const,
        description: "companyId.description" as const,
        columns: 12,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/companies/list/definition")).default
            .GET,
        labelField: "name",
      }),

      customerId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "customerId.label" as const,
        description: "customerId.description" as const,
        columns: 12,
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/users/list/definition")).default
            .GET,
        labelField: "privateName",
      }),

      dueDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATETIME,
        label: "dueDate.label" as const,
        description: "dueDate.description" as const,
        placeholder: "dueDate.placeholder" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),

      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "currency.label" as const,
        description: "currency.description" as const,
        placeholder: "currency.placeholder" as const,
        columns: 6,
        schema: z.string().min(3).max(3).default("EUR"),
      }),

      notes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "notes.label" as const,
        description: "notes.description" as const,
        placeholder: "notes.placeholder" as const,
        columns: 12,
        schema: z.string().max(2000).optional(),
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

      invoice: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.invoice.title" as const,
        description: "post.response.invoice.subtitle" as const,
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.invoice.id" as const,
            schema: z.uuid(),
          }),
          companyId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.invoice.companyId" as const,
            schema: z.uuid().nullable(),
          }),
          customerId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.invoice.customerId" as const,
            schema: z.uuid().nullable(),
          }),
          invoiceSequenceNumber: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.invoice.invoiceSequenceNumber" as const,
            schema: z.number().nullable(),
          }),
          currency: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.invoice.currency" as const,
            schema: z.string(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.invoice.status" as const,
            schema: z.string(),
          }),
          dueDate: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.invoice.dueDate" as const,
            schema: z.string().nullable(),
          }),
          notes: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.invoice.notes" as const,
            schema: z.string().nullable(),
          }),
          amount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.invoice.amount" as const,
            schema: z.string(),
          }),
          createdAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.invoice.createdAt" as const,
            schema: z.string(),
          }),
          updatedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.invoice.updatedAt" as const,
            schema: z.string(),
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
        companyId: "00000000-0000-0000-0000-000000000001",
        customerId: "00000000-0000-0000-0000-000000000002",
        currency: "EUR",
        dueDate: "2024-02-01",
        notes: "Payment terms: 30 days",
      },
    },
    responses: {
      default: {
        success: true,
        message: null,
        invoice: {
          id: "789e0123-e89b-12d3-a456-426614174000",
          companyId: "00000000-0000-0000-0000-000000000001",
          customerId: "00000000-0000-0000-0000-000000000002",
          invoiceSequenceNumber: 1,
          currency: "EUR",
          status: "DRAFT",
          dueDate: "2024-02-01T00:00:00.000Z",
          notes: "Payment terms: 30 days",
          amount: "0",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      },
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },
});

export type InvoiceCreateRequestInput = typeof POST.types.RequestInput;
export type InvoiceCreateRequestOutput = typeof POST.types.RequestOutput;
export type InvoiceCreateResponseInput = typeof POST.types.ResponseInput;
export type InvoiceCreateResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
