/**
 * Chart of Accounts — Receivables Aging Report Endpoint Definition
 * GET — outstanding invoices bucketed by days overdue
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

import { scopedTranslation } from "../../i18n";

const ReceivablesAgingWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ReceivablesAgingWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "reports", "receivables-aging"],
  aliases: ["coa-receivables-aging"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  title: "receivablesAging.title" as const,
  titleShort: "receivablesAging.titleShort" as const,
  description: "receivablesAging.description" as const,
  icon: "clock",
  category: "accounting",
  subCategory: "Ledger",
  tags: ["tags.ledger", "tags.journal"],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: ReceivablesAgingWidget,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "receivablesAging.companyId.label" as const,
        description: "receivablesAging.companyId.description" as const,
        placeholder: "receivablesAging.companyId.placeholder" as const,
        schema: z.string().uuid(),
      }),
      asOfDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "receivablesAging.asOfDate.label" as const,
        description: "receivablesAging.asOfDate.description" as const,
        placeholder: "receivablesAging.asOfDate.placeholder" as const,
        schema: z.string().date().optional(),
      }),

      asOfDateResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "receivablesAging.response.asOfDate" as const,
        schema: dateSchema,
      }),
      bucketsCurrentItems: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          usage: { response: true },
          children: {
            invoiceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.invoiceId" as const,
              schema: z.string(),
            }),
            customerId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.customerId" as const,
              schema: z.string(),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.amount" as const,
              schema: z.number(),
            }),
            dueDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.dueDate" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),
      bucketsDays1to30Items: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          usage: { response: true },
          children: {
            invoiceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.invoiceId" as const,
              schema: z.string(),
            }),
            customerId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.customerId" as const,
              schema: z.string(),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.amount" as const,
              schema: z.number(),
            }),
            dueDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.dueDate" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),
      bucketsDays31to60Items: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          usage: { response: true },
          children: {
            invoiceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.invoiceId" as const,
              schema: z.string(),
            }),
            customerId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.customerId" as const,
              schema: z.string(),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.amount" as const,
              schema: z.number(),
            }),
            dueDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.dueDate" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),
      bucketsDays61to90Items: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          usage: { response: true },
          children: {
            invoiceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.invoiceId" as const,
              schema: z.string(),
            }),
            customerId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.customerId" as const,
              schema: z.string(),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.amount" as const,
              schema: z.number(),
            }),
            dueDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.dueDate" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),
      bucketsOver90Items: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          usage: { response: true },
          children: {
            invoiceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.invoiceId" as const,
              schema: z.string(),
            }),
            customerId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.customerId" as const,
              schema: z.string(),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.amount" as const,
              schema: z.number(),
            }),
            dueDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "receivablesAging.response.dueDate" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),
      totalsCurrent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "receivablesAging.response.current" as const,
        schema: z.number(),
      }),
      totalsDays1to30: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "receivablesAging.response.days1to30" as const,
        schema: z.number(),
      }),
      totalsDays31to60: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "receivablesAging.response.days31to60" as const,
        schema: z.number(),
      }),
      totalsDays61to90: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "receivablesAging.response.days61to90" as const,
        schema: z.number(),
      }),
      totalsOver90: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "receivablesAging.response.over90" as const,
        schema: z.number(),
      }),
      totalsTotal: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "receivablesAging.response.total" as const,
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "receivablesAging.errors.unauthorized.title" as const,
      description: "receivablesAging.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "receivablesAging.errors.validation.title" as const,
      description: "receivablesAging.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "receivablesAging.errors.forbidden.title" as const,
      description: "receivablesAging.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "receivablesAging.errors.server.title" as const,
      description: "receivablesAging.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "receivablesAging.errors.unknown.title" as const,
      description: "receivablesAging.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "receivablesAging.errors.conflict.title" as const,
      description: "receivablesAging.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "receivablesAging.errors.network.title" as const,
      description: "receivablesAging.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "receivablesAging.errors.notFound.title" as const,
      description: "receivablesAging.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "receivablesAging.errors.unsavedChanges.title" as const,
      description:
        "receivablesAging.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "receivablesAging.success.title" as const,
    description: "receivablesAging.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-0000-0000-000000000001",
        asOfDate: "2026-12-31",
      },
    },
    responses: {
      default: {
        asOfDateResponse: "2026-12-31",
        bucketsCurrentItems: [],
        bucketsDays1to30Items: [],
        bucketsDays31to60Items: [],
        bucketsDays61to90Items: [],
        bucketsOver90Items: [],
        totalsCurrent: 0,
        totalsDays1to30: 0,
        totalsDays31to60: 0,
        totalsDays61to90: 0,
        totalsOver90: 0,
        totalsTotal: 0,
      },
    },
  },
});

export type ReceivablesAgingRequestInput = typeof GET.types.RequestInput;
export type ReceivablesAgingRequestOutput = typeof GET.types.RequestOutput;
export type ReceivablesAgingResponseInput = typeof GET.types.ResponseInput;
export type ReceivablesAgingResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
