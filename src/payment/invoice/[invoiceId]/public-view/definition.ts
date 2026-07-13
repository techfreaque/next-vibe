/**
 * Public Invoice View Endpoint
 * Unauthenticated: customer views their invoice via a secure HMAC token link
 * Token is generated on invoice send and embedded in the email link
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
  requestField,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const InvoicePublicViewWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InvoicePublicViewWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["payment", "invoice", "[invoiceId]", "public-view"],
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "file-text" as const,
  tags: ["tags.payment" as const, "tags.invoice" as const],
  allowedRoles: [UserRole.PUBLIC] as const,

  fields: customWidgetObject({
    render: InvoicePublicViewWidgetLazy,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // URL PATH PARAMS
      invoiceId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("../../list/definition")).default.GET,
        labelField: "invoiceSequenceNumber",
        label: "invoiceId.label" as const,
        description: "invoiceId.description" as const,
        schema: z.uuid(),
        hidden: true,
      }),

      // QUERY / BODY PARAM
      token: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "token.label" as const,
        description: "token.description" as const,
        columns: 12,
        schema: z.string().min(1),
      }),

      // RESPONSE FIELDS
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.id" as const,
        schema: z.string(),
      }),

      invoiceNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.invoiceNumber" as const,
        schema: z.string().nullable(),
      }),

      currency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.currency" as const,
        schema: z.string(),
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

      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.createdAt" as const,
        schema: dateSchema,
      }),

      companyName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.companyName" as const,
        schema: z.string().nullable(),
      }),

      companyEmail: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.companyEmail" as const,
        schema: z.string().nullable(),
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
    requests: {
      default: {
        token: "abc123hmactoken",
      },
    },
    responses: {
      default: {
        id: "456e7890-e89b-12d3-a456-426614174000",
        invoiceNumber: "AR-00000001-000001",
        currency: "EUR",
        status: "OPEN",
        amount: "1200.00",
        dueDate: "2024-02-01T00:00:00.000Z",
        notes: null,
        createdAt: "2024-01-01T00:00:00.000Z",
        companyName: "Acme Corp",
        companyEmail: "billing@acme.com",
        lines: [],
      },
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },
});

export type InvoicePublicViewUrlPathParams =
  typeof GET.types.UrlVariablesOutput;
export type InvoicePublicViewRequestOutput = typeof GET.types.RequestOutput;
export type InvoicePublicViewResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
