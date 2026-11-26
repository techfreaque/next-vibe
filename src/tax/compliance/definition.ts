/**
 * Country compliance check: which legal requirements of the company's
 * country are met (identity on invoices, VAT regime, chart, rates, fiscal
 * receipts, e-invoicing, VAT registration threshold).
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
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

import { CompanyTaxRegimeDB } from "../regime/enum";
import {
  ComplianceIssueDB,
  ComplianceIssueOptions,
  ComplianceSeverityDB,
  ComplianceSeverityOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";
import { PROFILE_COUNTRIES } from "./profiles";

const ComplianceWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.TaxComplianceWidget })),
);

export const TAX_COMPLIANCE_ALIAS = "tax-compliance" as const;

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["tax", "compliance"],
  aliases: [TAX_COMPLIANCE_ALIAS],
  title: "review.title",
  titleShort: "review.titleShort",
  description: "review.description",
  category: "tax",
  subCategory: "Tax Reports" as const,
  tags: ["tags.compliance", "tags.tax"],
  icon: "shield",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],
  options: {
    autoFetchRequires: ["companyId"],
    formOptions: { autoSubmit: true, debounceMs: 300 },
  },
  fields: customWidgetObject({
    render: ComplianceWidget,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
        label: "review.company.label",
        description: "review.company.description",
        schema: z.uuid(),
      }),
      checkedCompanyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "review.company.label",
        schema: z.uuid(),
      }),
      companyName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "review.company.label",
        schema: z.string(),
      }),
      country: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "review.country",
        schema: z.enum(PROFILE_COUNTRIES),
      }),
      regime: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "review.regime",
        schema: z.enum(CompanyTaxRegimeDB),
      }),
      findings: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            code: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              enumOptions: ComplianceIssueOptions,
              label: "review.findingCode",
              schema: z.enum(ComplianceIssueDB),
            }),
            severity: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              enumOptions: ComplianceSeverityOptions,
              label: "review.findingSeverity",
              schema: z.enum(ComplianceSeverityDB),
            }),
            params: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "review.findingCode",
              schema: z.record(z.string(), z.string()).optional(),
            }),
          },
        }),
      }),
      vatReturnAvailable: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "review.facts.vatReturn",
        schema: z.boolean(),
      }),
      statementsAvailable: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "review.facts.statements",
        schema: z.boolean(),
      }),
      fiscalReceiptsRequired: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "review.facts.fiscal",
        schema: z.boolean(),
      }),
      eInvoicingFrom: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "review.facts.eInvoicing",
        schema: z.iso.date().nullable(),
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "review.errors.validation.title",
      description: "review.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "review.errors.unauthorized.title",
      description: "review.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "review.errors.forbidden.title",
      description: "review.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "review.errors.notFound.title",
      description: "review.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "review.errors.conflict.title",
      description: "review.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "review.errors.server.title",
      description: "review.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "review.errors.network.title",
      description: "review.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "review.errors.unknown.title",
      description: "review.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "review.errors.unsavedChanges.title",
      description: "review.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "review.success.title",
    description: "review.success.description",
  },
  examples: {
    requests: {
      default: { companyId: "00000000-0000-4000-8000-000000000001" },
    },
    responses: {
      default: {
        checkedCompanyId: "00000000-0000-4000-8000-000000000001",
        companyName: "Demo s.r.o.",
        country: "SK",
        regime: "regimes.standard",
        findings: [
          {
            code: "issues.issuerRegistrationMissing",
            severity: "enums.severity.error",
          },
          {
            code: "issues.eInvoicingUpcoming",
            severity: "enums.severity.info",
            params: { date: "2027-01-01" },
          },
        ],
        vatReturnAvailable: true,
        statementsAvailable: true,
        fiscalReceiptsRequired: true,
        eInvoicingFrom: "2027-01-01",
      },
    },
  },
});

export type TaxComplianceRequestOutput = typeof GET.types.RequestOutput;
export type TaxComplianceResponseOutput = typeof GET.types.ResponseOutput;

export default { GET } as const;
