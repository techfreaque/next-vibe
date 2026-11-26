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

import { reportDay, reportPeriodRange } from "@/finance/report-period";

import { accountingDateSchema } from "../../shared/calendar-date";
import { scopedTranslation } from "./i18n";

const JournalExportWidget = lazyWidget(() =>
  import("./widget").then((module) => ({
    default: module.JournalExportWidget,
  })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "reports", "journal-export"],
  aliases: ["coa-journal-export"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "accounting",
  subCategory: "Ledger",
  icon: "download",
  tags: ["tags.journal", "tags.export"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN],
  fields: customWidgetObject({
    render: JournalExportWidget,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "company",
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "currency",
        description: "currencyHint",
        schema: z
          .string()
          .trim()
          .toUpperCase()
          .regex(/^[A-Z]{3}$/),
      }),
      dateFrom: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "from",
        schema: accountingDateSchema.prefault(() =>
          reportDay(reportPeriodRange("lastMonth").from),
        ),
      }),
      dateTo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "to",
        schema: accountingDateSchema.prefault(() =>
          reportDay(reportPeriodRange("lastMonth").to),
        ),
      }),
      companyIdOut: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "company",
        schema: z.uuid(),
        hidden: true,
      }),
      companyName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "company",
        schema: z.string(),
      }),
      currencyOut: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "currency",
        schema: z.string(),
      }),
      fromOut: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "from",
        schema: z.iso.date(),
      }),
      toOut: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "to",
        schema: z.iso.date(),
      }),
      filename: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "filename",
        schema: z.string(),
      }),
      rowCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "rowCount",
        schema: z.number(),
      }),
      debitCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "debitCount",
        schema: z.number(),
      }),
      creditCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "creditCount",
        schema: z.number(),
      }),
      csv: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "download",
        schema: z.string(),
        hidden: true,
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title" as const,
      description: "errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
  },

  successTypes: { title: "ready", description: "description" },
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        currency: "EUR",
        dateFrom: "2026-11-01",
        dateTo: "2026-11-30",
      },
    },
    responses: {
      default: {
        companyIdOut: "00000000-0000-4000-8000-000000000001",
        companyName: "Example company",
        currencyOut: "EUR",
        fromOut: "2026-11-01",
        toOut: "2026-11-30",
        filename: "journal-2026-11-01_2026-11-30-EUR.csv",
        rowCount: 0,
        debitCount: 0,
        creditCount: 0,
        csv: "\uFEFFEntry number,Accounting date,Posted at (UTC),Source,Account code,Account name,Entry description,Line description,Currency,Debit,Credit\r\n",
      },
    },
  },
});

export type JournalExportRequestOutput = typeof GET.types.RequestOutput;
export type JournalExportResponseOutput = typeof GET.types.ResponseOutput;
const definitions = { GET } as const;
export default definitions;
