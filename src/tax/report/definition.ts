/**
 * Tax Report API Route Definition
 * GET endpoint for saved document tax by direction, rate, and period
 */

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

import { accountingDateSchema } from "@/chart-of-accounts/shared/calendar-date";

import { scopedTranslation } from "../i18n";
import { TaxReportDirection, TaxReportDirectionDB } from "./enum";

const ALLOWED_ROLES = [
  UserRole.ADMIN,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
] as const;

const TaxReportWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.TaxReportWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["tax", "report"],
  title: "report.title" as const,
  titleShort: "report.titleShort" as const,
  description: "report.description" as const,
  category: "tax" as const,
  subCategory: "Tax Reports" as const,
  tags: ["tags.tax" as const, "tags.report" as const],
  allowedRoles: ALLOWED_ROLES,
  defaultWebPinned: ALLOWED_ROLES,
  icon: "bar-chart",
  options: {
    queryOptions: { enabled: false },
  },

  fields: customWidgetObject({
    render: TaxReportWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
        label: "report.companyId.label" as const,
        description: "report.companyId.description" as const,
        placeholder: "report.companyId.placeholder" as const,
        schema: z.string().uuid().optional(),
      }),
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "report.currency.label",
        description: "report.currency.description",
        placeholder: "report.currency.placeholder",
        options: CurrenciesArr.map((value) => ({
          value,
          label: `report.currencies.${value}` as const,
        })),
        schema: z.enum(CurrenciesArr).optional(),
      }),
      dateFrom: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "report.dateFrom.label" as const,
        description: "report.dateFrom.description" as const,
        placeholder: "report.dateFrom.placeholder" as const,
        schema: accountingDateSchema.optional(),
      }),
      dateTo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "report.dateTo.label" as const,
        description: "report.dateTo.description" as const,
        placeholder: "report.dateTo.placeholder" as const,
        schema: accountingDateSchema.optional(),
      }),

      reportCompanyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "report.companyId.label",
        schema: z.string(),
      }),
      reportCompanyName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "report.companyId.label",
        schema: z.string(),
      }),
      reportCurrency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "report.currency.label",
        schema: z.enum(CurrenciesArr),
      }),
      reportDateFrom: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "report.dateFrom.label",
        schema: z.iso.date(),
      }),
      reportDateTo: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "report.dateTo.label",
        schema: z.iso.date(),
      }),
      rows: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            direction: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "report.response.row.direction",
              schema: z.enum(TaxReportDirectionDB),
            }),
            rate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "report.response.row.rate",
              schema: z.number().nullable(),
            }),
            taxableAmount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "report.response.row.taxableAmount" as const,
              schema: z.number(),
            }),
            taxAmount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "report.response.row.taxAmount" as const,
              schema: z.number(),
            }),
          },
        }),
      }),
      totals: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            direction: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "report.response.row.direction",
              schema: z.enum(TaxReportDirectionDB),
            }),
            taxableAmount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "report.response.row.taxableAmount" as const,
              schema: z.number(),
            }),
            taxAmount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "report.response.row.taxAmount" as const,
              schema: z.number(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "report.errors.validation.title" as const,
      description: "report.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "report.errors.unauthorized.title" as const,
      description: "report.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "report.errors.forbidden.title" as const,
      description: "report.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "report.errors.notFound.title" as const,
      description: "report.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "report.errors.conflict.title" as const,
      description: "report.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "report.errors.server.title" as const,
      description: "report.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "report.errors.network.title" as const,
      description: "report.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "report.errors.unknown.title" as const,
      description: "report.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "report.errors.unsavedChanges.title" as const,
      description: "report.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "report.success.title" as const,
    description: "report.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: "550e8400-e29b-41d4-a716-446655440000",
        dateFrom: "2024-01-01",
        dateTo: "2024-12-31",
      },
    },
    responses: {
      default: {
        reportCompanyId: "550e8400-e29b-41d4-a716-446655440000",
        reportCompanyName: "Example company",
        reportCurrency: "EUR",
        reportDateFrom: "2024-01-01",
        reportDateTo: "2024-12-31",
        rows: [
          {
            direction: TaxReportDirection.SALES,
            rate: 0.2,
            taxableAmount: 1000,
            taxAmount: 200,
          },
          {
            direction: TaxReportDirection.POS_SALES,
            rate: 0.2,
            taxableAmount: 111.1111,
            taxAmount: 22.2222,
          },
          {
            direction: TaxReportDirection.CREDIT_NOTES,
            rate: 0.2,
            taxableAmount: -200,
            taxAmount: -40,
          },
          {
            direction: TaxReportDirection.PURCHASES,
            rate: 0.1,
            taxableAmount: 500,
            taxAmount: 50,
          },
        ],
        totals: [
          {
            direction: TaxReportDirection.SALES,
            taxableAmount: 1000,
            taxAmount: 200,
          },
          {
            direction: TaxReportDirection.POS_SALES,
            taxableAmount: 111.1111,
            taxAmount: 22.2222,
          },
          {
            direction: TaxReportDirection.CREDIT_NOTES,
            taxableAmount: -200,
            taxAmount: -40,
          },
          {
            direction: TaxReportDirection.PURCHASES,
            taxableAmount: 500,
            taxAmount: 50,
          },
        ],
      },
    },
  },
});

export type TaxReportRequestOutput = typeof GET.types.RequestOutput;
export type TaxReportResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
