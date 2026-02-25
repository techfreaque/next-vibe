/**
 * Leads Export API Definition
 * Defines endpoints for CSV/Excel export operations
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import {
  Countries,
  CountriesOptions,
  Languages,
  LanguagesOptions,
} from "@/i18n/core/config";

import {
  ExportFormat,
  ExportFormatOptions,
  LeadSource,
  LeadSourceOptions,
  LeadStatus,
  LeadStatusOptions,
  MimeType,
} from "../enum";
import { scopedTranslation } from "./i18n";
import { LeadsExportContainer } from "./widget";

/**
 * Export Leads Endpoint (GET)
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "export"],
  title: "get.title",
  description: "get.description",
  category: "app.endpointCategories.leads",
  tags: ["tags.leads", "tags.export"],
  allowedRoles: [UserRole.ADMIN],
  icon: "download",

  fields: customWidgetObject({
    render: LeadsExportContainer,
    usage: { response: true, request: "data" } as const,
    children: {
      backButton: backButton({ usage: { response: true } }),
      // === REQUEST FIELDS ===
      format: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.format.label",
        description: "get.format.description",
        options: ExportFormatOptions,
        columns: 6,
        schema: z.enum(ExportFormat).default(ExportFormat.CSV),
      }),

      status: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.status.label",
        description: "get.status.description",
        options: LeadStatusOptions,
        columns: 6,
        schema: z.enum(LeadStatus).optional(),
      }),

      country: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.country.label",
        description: "get.country.description",
        options: CountriesOptions,
        columns: 6,
        schema: z.enum(Countries).optional(),
      }),

      language: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.language.label",
        description: "get.language.description",
        options: LanguagesOptions,
        columns: 6,
        schema: z.enum(Languages).optional(),
      }),

      source: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.source.label",
        description: "get.source.description",
        options: LeadSourceOptions,
        columns: 12,
        schema: z.enum(LeadSource).optional(),
      }),

      search: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.search.label",
        description: "get.search.description",
        placeholder: "get.search.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      dateFrom: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "get.dateFrom.label",
        description: "get.dateFrom.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),

      dateTo: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "get.dateTo.label",
        description: "get.dateTo.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),

      includeMetadata: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.includeMetadata.label",
        description: "get.includeMetadata.description",
        columns: 6,
        schema: z.coerce.boolean().default(false),
      }),

      includeEngagementData: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.includeEngagementData.label",
        description: "get.includeEngagementData.description",
        columns: 6,
        schema: z.coerce.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      fileName: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.fileName",
        schema: z.string(),
      }),

      fileContent: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.fileContent",
        schema: z.string(),
      }),

      mimeType: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.mimeType",
        schema: z.enum(MimeType),
      }),

      totalRecords: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalRecords",
        schema: z.coerce.number(),
      }),

      exportedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.exportedAt",
        schema: z.coerce.date(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    responses: {
      default: {
        fileName: "leads_export_2023-01-01.csv",
        fileContent: "ZW1haWwsYnVzaW5lc3NfbmFtZSxjb250YWN0X25hbWU...",
        mimeType: MimeType.CSV,
        totalRecords: 150,
        exportedAt: new Date("2023-01-01T12:00:00.000Z"),
      },
    },
    requests: {
      default: {
        format: ExportFormat.CSV,
        status: LeadStatus.NEW,
        country: Countries.GLOBAL,
        language: Languages.EN,
        source: LeadSource.WEBSITE,
        search: "example",
        dateFrom: new Date("2023-01-01T00:00:00.000Z"),
        dateTo: new Date("2023-01-01T00:00:00.000Z"),
        includeMetadata: false,
        includeEngagementData: false,
      },
    },
  },
});

// Extract types using the enhanced system
export type LeadExportRequestInput = typeof GET.types.RequestInput;
export type LeadExportRequestOutput = typeof GET.types.RequestOutput;
export type LeadExportResponseInput = typeof GET.types.ResponseInput;
export type LeadExportResponseOutput = typeof GET.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  GET,
} as const;
export default definitions;
