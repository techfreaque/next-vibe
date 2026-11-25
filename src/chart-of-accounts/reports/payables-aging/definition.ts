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

import { scopedTranslation } from "./i18n";

const PayablesAgingWidget = lazyWidget(() =>
  import("./widget").then((module) => ({
    default: module.PayablesAgingWidget,
  })),
);

const centsField = {
  type: WidgetType.TEXT,
  schema: z.number().int().nonnegative(),
} as const;

const totalsField = objectField(scopedTranslation, {
  type: WidgetType.CONTAINER,
  title: "columns.total",
  layoutType: LayoutType.GRID,
  usage: { response: true },
  children: {
    current: responseField(scopedTranslation, {
      ...centsField,
      label: "columns.current",
    }),
    days1to30: responseField(scopedTranslation, {
      ...centsField,
      label: "columns.days1to30",
    }),
    days31to60: responseField(scopedTranslation, {
      ...centsField,
      label: "columns.days31to60",
    }),
    days61to90: responseField(scopedTranslation, {
      ...centsField,
      label: "columns.days61to90",
    }),
    over90: responseField(scopedTranslation, {
      ...centsField,
      label: "columns.over90",
    }),
    undated: responseField(scopedTranslation, {
      ...centsField,
      label: "columns.undated",
    }),
    total: responseField(scopedTranslation, {
      ...centsField,
      label: "columns.total",
    }),
  },
});

const supplierGroups = responseArrayField(scopedTranslation, {
  type: WidgetType.CONTAINER,
  child: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    usage: { response: true },
    children: {
      key: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string(),
      }),
      supplier: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "columns.supplier",
        schema: z.string(),
      }),
      supplierVat: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "columns.vat",
        schema: z.string().nullable(),
      }),
      totals: totalsField,
      bills: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.uuid(),
            }),
            billNumber: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "columns.billNumber",
              schema: z.string().nullable(),
            }),
            billDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "columns.billDate",
              schema: z.iso.date(),
            }),
            dueDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "columns.dueDate",
              schema: z.iso.date().nullable(),
            }),
            amountCents: responseField(scopedTranslation, {
              ...centsField,
              label: "columns.billAmount",
            }),
          },
        }),
      }),
    },
  }),
});

const reportFields = { suppliers: supplierGroups, totals: totalsField };

const emptyTotals = {
  current: 0,
  days1to30: 0,
  days31to60: 0,
  days61to90: 0,
  over90: 0,
  undated: 0,
  total: 0,
};

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "reports", "payables-aging"],
  aliases: ["coa-payables-aging"],
  allowedRoles: [UserRole.ADMIN],
  defaultWebPinned: [UserRole.ADMIN],
  title: "title",
  titleShort: "titleShort",
  description: "description",
  icon: "clock",
  category: "accounting",
  subCategory: "Ledger",
  tags: ["tag"],
  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 150,
    },
  },
  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: PayablesAgingWidget,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "company.label",
        description: "company.description",
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "currency.label",
        description: "currency.description",
        options: CurrenciesArr.map((value) => ({
          value,
          label: `currency.codes.${value}` as const,
        })),
        schema: z.enum(CurrenciesArr).optional(),
      }),
      agingDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "agingDate.label",
        description: "agingDate.description",
        schema: z.iso.date().optional(),
      }),
      reportCompanyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.uuid().nullable(),
      }),
      reportCompanyName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "company.label",
        schema: z.string().nullable(),
      }),
      reportCurrency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "currency.label",
        schema: z.string().nullable(),
      }),
      reportDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "agingDate.label",
        schema: z.iso.date(),
      }),
      approved: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "approved.title",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: reportFields,
      }),
      received: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "received.title",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: reportFields,
      }),
      disputed: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "disputed.title",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: reportFields,
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },
  successTypes: { title: "success.title", description: "success.description" },
  examples: {
    requests: {
      default: {
        companyId: "36578b2b-c5cb-46ba-ad7e-0c2b73828739",
        currency: "EUR",
        agingDate: "2026-11-25",
      },
    },
    responses: {
      default: {
        reportCompanyId: "36578b2b-c5cb-46ba-ad7e-0c2b73828739",
        reportCompanyName: "Example Company",
        reportCurrency: "EUR",
        reportDate: "2026-11-25",
        approved: {
          suppliers: [
            {
              key: "vat:DE123456789",
              supplier: "Example Supplier",
              supplierVat: "DE123456789",
              totals: { ...emptyTotals, days1to30: 12990, total: 12990 },
              bills: [
                {
                  id: "616726d9-dacb-4cd9-ae41-b622e97d37cd",
                  billNumber: "SUP-204",
                  billDate: "2026-10-23",
                  dueDate: "2026-11-23",
                  amountCents: 12990,
                },
              ],
            },
          ],
          totals: { ...emptyTotals, days1to30: 12990, total: 12990 },
        },
        received: { suppliers: [], totals: emptyTotals },
        disputed: { suppliers: [], totals: emptyTotals },
      },
    },
  },
});

export type PayablesAgingRequest = typeof GET.types.RequestOutput;
export type PayablesAgingResponse = typeof GET.types.ResponseOutput;

export default { GET };
