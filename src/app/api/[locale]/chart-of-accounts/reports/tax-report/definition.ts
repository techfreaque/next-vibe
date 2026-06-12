/**
 * Chart of Accounts — Tax Report Endpoint Definition
 * GET — VAT collected vs. reclaimable for a period
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
  customWidgetObject,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";

import { scopedTranslation } from "../../i18n";

const TaxReportWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.TaxReportWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "reports", "tax-report"],
  aliases: ["coa-tax-report"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  title: "taxReport.title" as const,
  titleShort: "taxReport.titleShort" as const,
  description: "taxReport.description" as const,
  icon: "receipt",
  category: "accounting",
  subCategory: "Ledger",
  tags: ["tags.ledger", "tags.journal"],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: TaxReportWidget,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "taxReport.companyId.label" as const,
        description: "taxReport.companyId.description" as const,
        placeholder: "taxReport.companyId.placeholder" as const,
        schema: z.string().uuid(),
      }),
      from: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "taxReport.from.label" as const,
        description: "taxReport.from.description" as const,
        placeholder: "taxReport.from.placeholder" as const,
        schema: z.string().date().optional(),
      }),
      to: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "taxReport.to.label" as const,
        description: "taxReport.to.description" as const,
        placeholder: "taxReport.to.placeholder" as const,
        schema: z.string().date().optional(),
      }),

      fromResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "taxReport.response.from" as const,
        schema: z.string(),
      }),
      toResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "taxReport.response.to" as const,
        schema: z.string(),
      }),
      vatCollected: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "taxReport.response.vatCollected" as const,
        schema: z.number(),
      }),
      vatReclaimable: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "taxReport.response.vatReclaimable" as const,
        schema: z.number(),
      }),
      netVatPayable: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "taxReport.response.netVatPayable" as const,
        schema: z.number(),
      }),
      lines: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          usage: { response: true },
          children: {
            taxRateCode: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "taxReport.response.taxRateCode" as const,
              schema: z.string(),
            }),
            taxRateName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "taxReport.response.taxRateName" as const,
              schema: z.string(),
            }),
            netAmount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "taxReport.response.netAmount" as const,
              schema: z.number(),
            }),
            taxAmount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "taxReport.response.taxAmount" as const,
              schema: z.number(),
            }),
            rate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "taxReport.response.rate" as const,
              schema: z.number(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "taxReport.errors.unauthorized.title" as const,
      description: "taxReport.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "taxReport.errors.validation.title" as const,
      description: "taxReport.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "taxReport.errors.forbidden.title" as const,
      description: "taxReport.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "taxReport.errors.server.title" as const,
      description: "taxReport.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "taxReport.errors.unknown.title" as const,
      description: "taxReport.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "taxReport.errors.conflict.title" as const,
      description: "taxReport.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "taxReport.errors.network.title" as const,
      description: "taxReport.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "taxReport.errors.notFound.title" as const,
      description: "taxReport.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "taxReport.errors.unsavedChanges.title" as const,
      description: "taxReport.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "taxReport.success.title" as const,
    description: "taxReport.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-0000-0000-000000000001",
        from: "2026-01-01",
        to: "2026-12-31",
      },
    },
    responses: {
      default: {
        fromResponse: "2026-01-01",
        toResponse: "2026-12-31",
        vatCollected: 0,
        vatReclaimable: 0,
        netVatPayable: 0,
        lines: [],
      },
    },
  },
});

export type TaxReportRequestInput = typeof GET.types.RequestInput;
export type TaxReportRequestOutput = typeof GET.types.RequestOutput;
export type TaxReportResponseInput = typeof GET.types.ResponseInput;
export type TaxReportResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
