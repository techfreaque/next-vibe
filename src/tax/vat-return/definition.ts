/**
 * Statutory VAT return & tax filing export per country profile.
 *
 * One country-agnostic tool driven by the company's selected country and tax regime:
 * - DE: UStVA Kennzahlen + ELSTER XML / CSV (or § 19 Kleinunternehmer EÜR summary)
 * - SK: DPHv25 return lines + KVDPHv25 control statement XML
 * - AT: UVA U30 Kennzahlen + FinanzOnline XML / CSV (or small-business E/A summary)
 * - Other countries: generic VAT summary by rate + CSV export
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

import { scopedTranslation } from "./i18n";
import { defaultVatPeriod, VAT_PERIOD_PATTERN } from "./period";

const VatReturnWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.VatReturnWidget })),
);

export const VAT_RETURN_ALIAS = "tax-vat-return" as const;

export const FILING_FORMATS = [
  "SK_DPH",
  "DE_USTVA",
  "DE_EUR_SMALL_BUSINESS",
  "AT_UVA",
  "AT_EA_SMALL_BUSINESS",
  "GENERIC_VAT",
] as const;

export const KV_SECTIONS = [
  "A1",
  "A2",
  "B1",
  "B2",
  "B31",
  "C1",
  "D1",
  "D2",
] as const;

export const VAT_RETURN_WARNINGS = [
  "warnings.noVatId",
  "warnings.noTaxId",
  "warnings.customerVatIds",
  "warnings.unmappedRates",
  "warnings.b32Required",
] as const;

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["tax", "vat-return"],
  aliases: [VAT_RETURN_ALIAS],
  title: "title",
  titleShort: "titleShort",
  description: "description",
  category: "tax",
  subCategory: "Tax Reports" as const,
  tags: ["tags.tax", "tags.vatReturn"],
  icon: "file-text",
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
    render: VatReturnWidget,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
        label: "company.label",
        description: "company.description",
        schema: z.uuid(),
      }),
      period: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "period.label",
        description: "period.description",
        schema: z
          .string()
          .regex(VAT_PERIOD_PATTERN)
          .default(() => defaultVatPeriod(new Date())),
      }),
      returnCompanyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "company.label",
        schema: z.uuid(),
      }),
      returnCompanyName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "company.label",
        schema: z.string(),
      }),
      country: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "company.label",
        schema: z.string(),
      }),
      currency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "lines.amount",
        schema: z.string(),
      }),
      filingFormat: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "lines.title",
        schema: z.enum(FILING_FORMATS),
      }),
      smallBusinessExempt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "smallBusiness.title",
        schema: z.boolean(),
      }),
      returnPeriod: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "period.label",
        schema: z.string(),
      }),
      periodFrom: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "period.label",
        schema: z.iso.date(),
      }),
      periodTo: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "period.label",
        schema: z.iso.date(),
      }),
      lines: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            line: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "lines.line",
              schema: z.string(),
            }),
            label: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "lines.meaning",
              schema: z.string().optional(),
            }),
            base: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "lines.base",
              schema: z.number().optional(),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "lines.amount",
              schema: z.number(),
            }),
            isTotal: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "lines.amount",
              schema: z.boolean().optional(),
            }),
          },
        }),
      }),
      sections: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            section: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "sections.section",
              schema: z.enum(KV_SECTIONS),
            }),
            count: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "sections.count",
              schema: z.number().int(),
            }),
          },
        }),
      }),
      warnings: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            code: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "sections.section",
              schema: z.enum(VAT_RETURN_WARNINGS),
            }),
            count: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "sections.count",
              schema: z.number().int().optional(),
            }),
          },
        }),
      }),
      kvXml: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "sections.title",
        schema: z.string(),
      }),
      kvFileName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "actions.downloadXml",
        schema: z.string(),
      }),
      exportCsv: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "actions.downloadCsv",
        schema: z.string(),
      }),
      exportCsvFileName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "actions.downloadCsv",
        schema: z.string(),
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
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
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
        companyId: "00000000-0000-4000-8000-000000000001",
        period: "2026-10",
      },
    },
    responses: {
      default: {
        returnCompanyId: "00000000-0000-4000-8000-000000000001",
        returnCompanyName: "Example GmbH",
        country: "DE",
        currency: "EUR",
        filingFormat: "DE_USTVA",
        smallBusinessExempt: false,
        returnPeriod: "2026-10",
        periodFrom: "2026-10-01",
        periodTo: "2026-10-31",
        lines: [
          {
            line: "Kz 81",
            label: "Steuerpflichtige Umsätze zum Steuersatz von 19 %",
            base: 1000,
            amount: 190,
          },
          {
            line: "Kz 83",
            label: "Verbleibende Umsatzsteuer-Vorauszahlung / Überschuss",
            amount: 190,
            isTotal: true,
          },
        ],
        sections: [],
        warnings: [],
        kvXml: "<Elster/>",
        kvFileName: "ELSTER_UStVA_DE_2026-10.xml",
        exportCsv: "kennzahl;description;base_eur;tax_eur",
        exportCsvFileName: "UStVA_DE_2026-10.csv",
      },
    },
  },
});

export type VatReturnRequestOutput = typeof GET.types.RequestOutput;
export type VatReturnResponseOutput = typeof GET.types.ResponseOutput;

export default { GET } as const;
