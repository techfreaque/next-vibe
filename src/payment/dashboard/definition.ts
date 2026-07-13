/**
 * Payment Dashboard Endpoint
 * GET — overview KPIs for invoices and bills of a company
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
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const PaymentDashboardWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PaymentDashboardWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["payment", "dashboard"],
  aliases: ["payment-dashboard"],
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "home" as const,
  tags: ["tags.payment" as const, "tags.dashboard" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: PaymentDashboardWidget,
    children: {
      // REQUEST FIELDS
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "companyId.label" as const,
        description: "companyId.description" as const,
        schema: z.string().uuid().optional(),
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/companies/list/definition")).default
            .GET,
        labelField: "name",
      }),

      // RESPONSE FIELDS
      currency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.currency" as const,
        schema: z.string(),
      }),

      openInvoices: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID,
        usage: { response: true },
        children: {
          count: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.openCount" as const,
            schema: z.number(),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.openTotal" as const,
            schema: z.number(),
          }),
        },
      }),

      overdueInvoices: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID,
        usage: { response: true },
        children: {
          count: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.overdueCount" as const,
            schema: z.number(),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.overdueTotal" as const,
            schema: z.number(),
          }),
        },
      }),

      unpaidBills: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID,
        usage: { response: true },
        children: {
          count: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.unpaidCount" as const,
            schema: z.number(),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.unpaidTotal" as const,
            schema: z.number(),
          }),
        },
      }),

      draftInvoices: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID,
        usage: { response: true },
        children: {
          count: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.draftCount" as const,
            schema: z.number(),
          }),
        },
      }),

      recentInvoices: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.recentInvoices" as const,
              schema: z.string(),
            }),
            invoiceSequenceNumber: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.recentInvoices" as const,
              schema: z.number().nullable(),
            }),
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.currency" as const,
              schema: z.string(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.recentInvoices" as const,
              schema: z.string(),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.recentInvoices" as const,
              schema: z.string(),
            }),
            dueDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.recentInvoices" as const,
              schema: dateSchema.nullable(),
            }),
            isOverdue: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.recentInvoices" as const,
              schema: z.boolean(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.recentInvoices" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),
    },
  }),

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 0,
    },
  },

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

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: undefined,
      },
    },
    responses: {
      default: {
        openInvoices: { count: 3, total: 4500 },
        overdueInvoices: { count: 1, total: 1200 },
        unpaidBills: { count: 2, total: 800 },
        draftInvoices: { count: 5 },
        currency: "EUR",
        recentInvoices: [],
      },
    },
  },
});

export type PaymentDashboardRequestOutput = typeof GET.types.RequestOutput;
export type PaymentDashboardResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
