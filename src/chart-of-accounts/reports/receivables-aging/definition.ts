/**
 * Chart of Accounts — Receivables Aging Report Endpoint Definition
 * GET — outstanding invoices bucketed by days overdue
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
import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
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

import { scopedTranslation } from "../../i18n";

const ReceivablesAgingWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ReceivablesAgingWidget })),
);

const agingItems = responseArrayField(scopedTranslation, {
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
      invoiceNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "receivablesAging.response.invoiceId",
        schema: z.string().nullable(),
      }),
      customerName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "receivablesAging.response.customerId",
        schema: z.string().nullable(),
      }),
      customerId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "receivablesAging.response.customerId" as const,
        schema: z.string().nullable(),
      }),
      amount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "receivablesAging.response.amount" as const,
        schema: z.number(),
      }),
      dueDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "receivablesAging.response.dueDate" as const,
        schema: dateSchema.nullable(),
      }),
    },
  }),
});

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
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "receivablesAging.companyId.label" as const,
        description: "receivablesAging.companyId.description" as const,
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
        schema: z.uuid().optional(),
      }),
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "receivablesAging.response.currency",
        options: CurrenciesArr.map((value) => ({
          value,
          label: `receivablesAging.currencies.${value}` as const,
        })),
        schema: z.enum(CurrenciesArr).optional(),
      }),
      reportCompanyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "receivablesAging.companyId.label",
        schema: z.uuid().nullable(),
      }),
      reportCompanyName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "receivablesAging.companyId.label",
        schema: z.string().nullable(),
      }),
      reportCurrency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "receivablesAging.response.currency",
        schema: z.string().nullable(),
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
      bucketsCurrentItems: agingItems,
      bucketsDays1to30Items: agingItems,
      bucketsDays31to60Items: agingItems,
      bucketsDays61to90Items: agingItems,
      bucketsOver90Items: agingItems,
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
        companyId: "00000000-0000-4000-8000-000000000001",
        asOfDate: "2026-12-31",
      },
    },
    responses: {
      default: {
        reportCompanyId: "00000000-0000-4000-8000-000000000001",
        reportCompanyName: "Atelier Central",
        reportCurrency: "EUR",
        asOfDateResponse: "2026-12-31",
        bucketsCurrentItems: [
          {
            invoiceId: "00000000-0000-4000-8000-000000000102",
            invoiceNumber: "INV-1051",
            customerId: "00000000-0000-4000-8000-000000000301",
            customerName: "Studio Linden",
            amount: 240,
            dueDate: "2027-01-10",
          },
        ],
        bucketsDays1to30Items: [
          {
            invoiceId: "00000000-0000-4000-8000-000000000101",
            invoiceNumber: "INV-1042",
            customerId: "00000000-0000-4000-8000-000000000301",
            customerName: "Studio Linden",
            amount: 325.5,
            dueDate: "2026-12-15",
          },
        ],
        bucketsDays31to60Items: [
          {
            invoiceId: "00000000-0000-4000-8000-000000000103",
            invoiceNumber: "INV-1027",
            customerId: "00000000-0000-4000-8000-000000000302",
            customerName: "Northline Design",
            amount: 480,
            dueDate: "2026-11-15",
          },
        ],
        bucketsDays61to90Items: [],
        bucketsOver90Items: [
          {
            invoiceId: "00000000-0000-4000-8000-000000000104",
            invoiceNumber: "INV-0976",
            customerId: "00000000-0000-4000-8000-000000000303",
            customerName: "Fieldworks",
            amount: 120,
            dueDate: "2026-09-01",
          },
        ],
        totalsCurrent: 240,
        totalsDays1to30: 325.5,
        totalsDays31to60: 480,
        totalsDays61to90: 0,
        totalsOver90: 120,
        totalsTotal: 1165.5,
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
