/**
 * Statutory VAT return preparation per country profile.
 * Slovakia: DPHv25 return lines + KVDPHv25 control statement XML.
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
import { SK_DPH_LINES } from "./sk-dph";

const VatReturnWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.VatReturnWidget })),
);

export const VAT_RETURN_ALIAS = "tax-vat-return" as const;

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
              schema: z.enum(SK_DPH_LINES),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "lines.amount",
              schema: z.number(),
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
        label: "actions.downloadKv",
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
        returnCompanyName: "Demo Slovensko s.r.o.",
        returnPeriod: "2026-10",
        periodFrom: "2026-10-01",
        periodTo: "2026-10-31",
        lines: [
          { line: "r03", amount: 800 },
          { line: "r04", amount: 184 },
          { line: "r32", amount: 184 },
        ],
        sections: [{ section: "A1", count: 1 }],
        warnings: [],
        kvXml: "<KVDPH_2025/>",
        kvFileName: "KVDPH_SK2020273893_2026-10.xml",
      },
    },
  },
});

export type VatReturnRequestOutput = typeof GET.types.RequestOutput;
export type VatReturnResponseOutput = typeof GET.types.ResponseOutput;

export default { GET } as const;
