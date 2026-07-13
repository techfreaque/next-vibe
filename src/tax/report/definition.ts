/**
 * Tax Report API Route Definition
 * GET endpoint to retrieve tax collected by rate and period
 */

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

import { scopedTranslation } from "../i18n";

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

  fields: customWidgetObject({
    render: TaxReportWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/companies/list/definition")).default
            .GET,
        labelField: "name",
        label: "report.companyId.label" as const,
        description: "report.companyId.description" as const,
        placeholder: "report.companyId.placeholder" as const,
        schema: z.string().uuid(),
      }),
      dateFrom: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "report.dateFrom.label" as const,
        description: "report.dateFrom.description" as const,
        placeholder: "report.dateFrom.placeholder" as const,
        schema: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      }),
      dateTo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "report.dateTo.label" as const,
        description: "report.dateTo.description" as const,
        placeholder: "report.dateTo.placeholder" as const,
        schema: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      }),

      // === RESPONSE FIELDS ===
      rows: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            taxRateCode: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "report.response.row.taxRateCode" as const,
              schema: z.string(),
            }),
            taxRateName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "report.response.row.taxRateName" as const,
              schema: z.string(),
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
            period: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "report.response.row.period" as const,
              schema: z.string(),
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
        rows: [],
      },
    },
  },
});

export type TaxReportRequestOutput = typeof GET.types.RequestOutput;
export type TaxReportResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
