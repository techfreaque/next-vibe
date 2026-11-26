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
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { accountingDateSchema } from "@/chart-of-accounts/shared/calendar-date";

import {
  CompanyTaxRegime,
  CompanyTaxRegimeDB,
  CompanyTaxRegimeOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

const RegimeWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CompanyTaxRegimeWidget })),
);

const regimeErrors = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "errors.unauthorized.title" as const,
    description: "errors.unauthorized.description" as const,
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "errors.forbidden.title" as const,
    description: "errors.forbidden.description" as const,
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.notFound.title" as const,
    description: "errors.notFound.description" as const,
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict.title" as const,
    description: "conflict" as const,
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.server.title" as const,
    description: "errors.server.description" as const,
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.network.title" as const,
    description: "errors.network.description" as const,
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.unknown.title" as const,
    description: "errors.unknown.description" as const,
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.unsavedChanges.title" as const,
    description: "errors.unsavedChanges.description" as const,
  },
} as const;

const companyField = requestField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.ENTITY_PICKER,
  listEndpoint: async () =>
    (await import("@/companies/list/definition")).default.GET,
  labelField: "name",
  label: "company",
  schema: z.uuid(),
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["tax", "regime"],
  aliases: ["company-tax-regime"],
  category: "tax",
  title: "title",
  titleShort: "title",
  description: "reviewDescription",
  tags: ["regime"],
  icon: "receipt",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],
  fields: customWidgetObject({
    render: RegimeWidget,
    usage: { request: "data", response: true },
    children: {
      companyId: companyField,
      election: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "regime",
        placeholder: "choose",
        options: CompanyTaxRegimeOptions,
        schema: z.enum(CompanyTaxRegimeDB),
      }),
      effectiveFrom: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "from",
        schema: accountingDateSchema,
      }),
      resultRegime: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        enumOptions: CompanyTaxRegimeOptions,
        label: "regime",
        schema: z.enum(CompanyTaxRegimeDB),
      }),
      resultFrom: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "from",
        schema: z.iso.date(),
      }),
      notice: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "regime",
        schema: z.string().nullable(),
      }),
    },
  }),
  errorTypes: regimeErrors,
  successTypes: { title: "saved", description: "description" },
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        election: CompanyTaxRegime.DE_SMALL_BUSINESS,
        effectiveFrom: new Date("2026-11-01T00:00:00Z"),
      },
    },
    responses: {
      default: {
        resultRegime: CompanyTaxRegime.DE_SMALL_BUSINESS,
        resultFrom: "2026-11-01",
        notice: "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.",
      },
    },
  },
});

export type CompanyRegimeRequest = typeof POST.types.RequestOutput;
export type CompanyRegimeResponse = typeof POST.types.ResponseOutput;
const ReviewWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CompanyTaxRegimeReviewWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["tax", "regime"],
  aliases: ["company-tax-regime-view"],
  options: {
    autoFetchRequires: ["companyId"],
    formOptions: { autoSubmit: true, debounceMs: 300 },
  },
  category: "tax",
  title: "view",
  titleShort: "title",
  description: "description",
  tags: ["regime"],
  icon: "receipt",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],
  fields: customWidgetObject({
    render: ReviewWidget,
    usage: { request: "data", response: true },
    children: {
      companyId: companyField,
      asOf: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "asOf",
        schema: accountingDateSchema.default(() => new Date()),
      }),
      canEdit: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "change",
        schema: z.boolean(),
      }),
      reviewedCompanyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "company",
        schema: z.uuid(),
      }),
      currentRegime: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        enumOptions: CompanyTaxRegimeOptions,
        label: "regime",
        schema: z.enum(CompanyTaxRegimeDB),
      }),
      effectiveOn: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "asOf",
        schema: z.iso.date(),
      }),
      legalNotice: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "regime",
        schema: z.string().nullable(),
      }),
    },
  }),
  successTypes: { title: "view", description: "description" },
  errorTypes: regimeErrors,
  examples: {
    requests: {
      default: { companyId: "00000000-0000-4000-8000-000000000001" },
    },
    responses: {
      default: {
        canEdit: true,
        reviewedCompanyId: "00000000-0000-4000-8000-000000000001",
        currentRegime: CompanyTaxRegime.DE_SMALL_BUSINESS,
        effectiveOn: "2026-11-25",
        legalNotice: "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.",
      },
    },
  },
});
export type RegimeReviewRequest = typeof GET.types.RequestOutput;
export type RegimeReviewResponse = typeof GET.types.ResponseOutput;
export default { GET, POST };
