/**
 * Add Invoice Line Endpoint
 * Adds a line item to a draft invoice, auto-calculating tax and totals
 */

import { z } from "zod";

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
import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const InvoiceLineAddWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InvoiceLineAddWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "invoice", "line", "add"],
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "plus" as const,
  tags: [
    "tags.payment" as const,
    "tags.invoice" as const,
    "tags.lines" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: InvoiceLineAddWidgetLazy,
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

      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "description.label" as const,
        description: "description.description" as const,
        placeholder: "description.placeholder" as const,
        columns: 12,
        schema: z.string().min(1).max(500),
      }),

      productId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "productId.label" as const,
        description: "productId.description" as const,
        placeholder: "productId.placeholder" as const,
        columns: 12,
        schema: z.uuid().optional(),
      }),

      quantity: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "quantity.label" as const,
        description: "quantity.description" as const,
        placeholder: "quantity.placeholder" as const,
        columns: 6,
        schema: z.coerce.number().positive().default(1),
      }),

      unitPrice: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "unitPrice.label" as const,
        description: "unitPrice.description" as const,
        placeholder: "unitPrice.placeholder" as const,
        columns: 6,
        schema: z.coerce.number().nonnegative(),
      }),

      taxRate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "taxRate.label" as const,
        description: "taxRate.description" as const,
        placeholder: "taxRate.placeholder" as const,
        columns: 6,
        schema: z.coerce.number().min(0).max(1).default(0),
      }),

      // RESPONSE FIELDS
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.success" as const,
        schema: z.boolean(),
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.message" as const,
        schema: z.string().nullable(),
      }),

      line: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.line.title" as const,
        description: "post.response.line.subtitle" as const,
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.line.id" as const,
            schema: z.uuid(),
          }),
          invoiceId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.line.invoiceId" as const,
            schema: z.uuid(),
          }),
          description: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.line.lineDescription" as const,
            schema: z.string(),
          }),
          productId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.line.productId" as const,
            schema: z.uuid().nullable(),
          }),
          quantity: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.line.quantity" as const,
            schema: z.number(),
          }),
          unitPrice: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.line.unitPrice" as const,
            schema: z.number(),
          }),
          taxRate: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.line.taxRate" as const,
            schema: z.number().nullable(),
          }),
          taxAmount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.line.taxAmount" as const,
            schema: z.number(),
          }),
          lineTotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.line.lineTotal" as const,
            schema: z.number(),
          }),
          sortOrder: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.line.sortOrder" as const,
            schema: z.number().nullable(),
          }),
          createdAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.line.createdAt" as const,
            schema: z.string(),
          }),
          updatedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.line.updatedAt" as const,
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
        invoiceId: "456e7890-e89b-12d3-a456-426614174000",
        description: "Web development - 10 hours",
        quantity: 10,
        unitPrice: 120,
        taxRate: 0.23,
      },
    },
    responses: {
      default: {
        success: true,
        message: null,
        line: {
          id: "789e0123-e89b-12d3-a456-426614174000",
          invoiceId: "456e7890-e89b-12d3-a456-426614174000",
          description: "Web development - 10 hours",
          productId: null,
          quantity: 10,
          unitPrice: 120,
          taxRate: 0.23,
          taxAmount: 276,
          lineTotal: 1476,
          sortOrder: 0,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      },
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },
});

export type InvoiceLineAddRequestInput = typeof POST.types.RequestInput;
export type InvoiceLineAddRequestOutput = typeof POST.types.RequestOutput;
export type InvoiceLineAddResponseInput = typeof POST.types.ResponseInput;
export type InvoiceLineAddResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
