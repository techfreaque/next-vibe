/**
 * Duplicate Invoice Endpoint
 * Clones an existing invoice into a new DRAFT with all line items copied
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  objectField,
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const InvoiceDuplicateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InvoiceDuplicateWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "invoice", "[invoiceId]", "duplicate"],
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "copy" as const,
  tags: ["tags.payment" as const, "tags.invoice" as const, "tags.ar" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: InvoiceDuplicateWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      // URL PATH PARAMS
      invoiceId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "invoiceId.label" as const,
        description: "invoiceId.description" as const,
        schema: z.uuid(),
        hidden: true,
        listEndpoint: async () =>
          (await import("../../list/definition")).default.GET,
        labelField: "invoiceSequenceNumber",
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
            schema: dateSchema.nullable(),
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
            schema: dateSchema,
          }),
          updatedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.invoice.updatedAt" as const,
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
    urlPathParams: {
      default: {
        invoiceId: "456e7890-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        success: true,
        message: null,
        invoice: {
          id: "789e0123-e89b-12d3-a456-426614174000",
          companyId: "00000000-0000-0000-0000-000000000001",
          customerId: null,
          invoiceSequenceNumber: 2,
          currency: "EUR",
          status: "DRAFT",
          dueDate: null,
          notes: null,
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

export type InvoiceDuplicateUrlPathParams =
  typeof POST.types.UrlVariablesOutput;
export type InvoiceDuplicateRequestInput = typeof POST.types.RequestInput;
export type InvoiceDuplicateRequestOutput = typeof POST.types.RequestOutput;
export type InvoiceDuplicateResponseInput = typeof POST.types.ResponseInput;
export type InvoiceDuplicateResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
