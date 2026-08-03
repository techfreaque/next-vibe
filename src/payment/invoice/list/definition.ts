/**
 * Invoice List Endpoint
 * GET — paginated list of AR invoices for a company
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
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { InvoiceStatusDB, InvoiceStatusOptions } from "../../enum";
import { scopedTranslation } from "./i18n";

const InvoiceListWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InvoiceListWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["payment", "invoice", "list"],
  aliases: ["payment-invoice-list"],
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "list" as const,
  tags: ["tags.payment" as const, "tags.invoice" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: InvoiceListWidget,
    children: {
      // REQUEST FIELDS
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "companyId.label" as const,
        description: "companyId.description" as const,
        schema: z.string().uuid().optional(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),

      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "status.label" as const,
        description: "status.description" as const,
        placeholder: "status.placeholder" as const,
        columns: 6,
        options: InvoiceStatusOptions,
        schema: z.string().optional(),
      }),

      customerId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "customerId.label" as const,
        description: "customerId.description" as const,
        columns: 6,
        schema: z.string().uuid().optional(),
        listEndpoint: async () =>
          (await import("@/users/list/definition")).default.GET,
        labelField: "privateName",
      }),

      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "page.label" as const,
        description: "page.description" as const,
        columns: 6,
        schema: z.coerce.number().int().min(1).default(1),
      }),

      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "pageSize.label" as const,
        description: "pageSize.description" as const,
        columns: 6,
        schema: z.coerce.number().int().min(1).max(100).default(20),
      }),

      // RESPONSE FIELDS
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.total" as const,
        schema: z.number(),
      }),

      invoices: responseArrayField(scopedTranslation, {
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
              label: "get.response.id" as const,
              schema: z.string(),
            }),
            invoiceSequenceNumber: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.invoiceSequenceNumber" as const,
              schema: z.number().nullable(),
            }),
            customerId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.customerId" as const,
              schema: z.string().nullable(),
            }),
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.currency" as const,
              schema: z.string(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.status" as const,
              options: InvoiceStatusOptions,
              schema: z.enum(InvoiceStatusDB),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.amount" as const,
              schema: z.string(),
            }),
            dueDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.dueDate" as const,
              schema: dateSchema.nullable(),
            }),
            notes: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.notes" as const,
              schema: z.string().nullable(),
            }),
            lineCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.lineCount" as const,
              schema: z.number(),
            }),
            amountPaid: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.amountPaid" as const,
              schema: z.number(),
            }),
            amountDue: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.amountDue" as const,
              schema: z.number(),
            }),
            isOverdue: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.isOverdue" as const,
              schema: z.boolean(),
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
    requests: {
      default: {
        companyId: "00000000-0000-0000-0000-000000000001",
        page: 1,
        pageSize: 20,
      },
    },
    responses: {
      default: {
        total: 0,
        invoices: [],
      },
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },
});

export type InvoiceListRequestInput = typeof GET.types.RequestInput;
export type InvoiceListRequestOutput = typeof GET.types.RequestOutput;
export type InvoiceListResponseInput = typeof GET.types.ResponseInput;
export type InvoiceListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
