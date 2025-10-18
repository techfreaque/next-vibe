/**
 * Leads Export API Definition
 * Defines endpoints for CSV/Excel export operations
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type {
  ExportFormatValues,
  LeadStatusValues,
  MimeTypeValues,
} from "../enum";
import {
  ExportFormat,
  ExportFormatOptions,
  LeadStatus,
  LeadStatusOptions,
  MimeType,
} from "../enum";

/**
 * Export Leads Endpoint (GET)
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "leads", "export"],
  title: "app.api.v1.core.leads.export.get.title",
  description: "app.api.v1.core.leads.export.get.description",
  category: "app.api.v1.core.leads.category",
  tags: [
    "app.api.v1.core.leads.tags.leads",
    "app.api.v1.core.leads.tags.export",
  ],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.leads.export.get.form.title",
      description: "app.api.v1.core.leads.export.get.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
      children: [],
    },
    {
      [Methods.GET]: { request: "data", response: true },
    },
    {
      // === REQUEST FIELDS ===
      format: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.leads.export.get.format.label",
          description: "app.api.v1.core.leads.export.get.format.description",
          options: ExportFormatOptions,
          layout: { columns: 6 },
        },
        z.nativeEnum(ExportFormat).default(ExportFormat.CSV),
      ),

      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.leads.export.get.status.label",
          description: "app.api.v1.core.leads.export.get.status.description",
          options: LeadStatusOptions,
          layout: { columns: 6 },
        },
        z.nativeEnum(LeadStatus).optional(),
      ),

      country: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.leads.export.get.country.label",
          description: "app.api.v1.core.leads.export.get.country.description",
          placeholder: "app.api.v1.core.leads.export.get.country.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      language: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.leads.export.get.language.label",
          description: "app.api.v1.core.leads.export.get.language.description",
          placeholder: "app.api.v1.core.leads.export.get.language.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      source: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.leads.export.get.source.label",
          description: "app.api.v1.core.leads.export.get.source.description",
          placeholder: "app.api.v1.core.leads.export.get.source.placeholder",
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),

      search: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.leads.export.get.search.label",
          description: "app.api.v1.core.leads.export.get.search.description",
          placeholder: "app.api.v1.core.leads.export.get.search.placeholder",
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),

      dateFrom: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.leads.export.get.dateFrom.label",
          description: "app.api.v1.core.leads.export.get.dateFrom.description",
          layout: { columns: 6 },
        },
        z.coerce.date().optional(),
      ),

      dateTo: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.leads.export.get.dateTo.label",
          description: "app.api.v1.core.leads.export.get.dateTo.description",
          layout: { columns: 6 },
        },
        z.coerce.date().optional(),
      ),

      includeMetadata: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.leads.export.get.includeMetadata.label",
          description:
            "app.api.v1.core.leads.export.get.includeMetadata.description",
          layout: { columns: 6 },
        },
        z.coerce.boolean().default(false),
      ),

      includeEngagementData: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.leads.export.get.includeEngagementData.label",
          description:
            "app.api.v1.core.leads.export.get.includeEngagementData.description",
          layout: { columns: 6 },
        },
        z.coerce.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      fileName: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.export.get.response.fileName",
        },
        z.string(),
      ),

      fileContent: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.export.get.response.fileContent",
        },
        z.string(),
      ),

      mimeType: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.export.get.response.mimeType",
        },
        z.nativeEnum(MimeType),
      ),

      totalRecords: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.export.get.response.totalRecords",
        },
        z.number(),
      ),

      exportedAt: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.export.get.response.exportedAt",
        },
        z.coerce.date(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.leads.export.get.errors.validation.title",
      description:
        "app.api.v1.core.leads.export.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.leads.export.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.leads.export.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.leads.export.get.errors.server.title",
      description: "app.api.v1.core.leads.export.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.leads.export.get.errors.unknown.title",
      description:
        "app.api.v1.core.leads.export.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.leads.export.get.errors.network.title",
      description:
        "app.api.v1.core.leads.export.get.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.leads.export.get.errors.forbidden.title",
      description:
        "app.api.v1.core.leads.export.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.leads.export.get.errors.notFound.title",
      description:
        "app.api.v1.core.leads.export.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.leads.export.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.leads.export.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.leads.export.get.errors.conflict.title",
      description:
        "app.api.v1.core.leads.export.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.leads.export.get.success.title",
    description: "app.api.v1.core.leads.export.get.success.description",
  },

  examples: {
    urlPathVariables: undefined,
    requests: undefined,
    responses: {
      default: {
        fileName: "leads_export_2023-01-01.csv",
        fileContent: "ZW1haWwsYnVzaW5lc3NfbmFtZSxjb250YWN0X25hbWU...",
        mimeType: MimeType.CSV,
        totalRecords: 150,
        exportedAt: new Date("2023-01-01T12:00:00.000Z"),
      },
    },
  },
});

// Extract types using the enhanced system
export type LeadExportRequestInput = typeof GET.types.RequestInput;
export type LeadExportRequestOutput = typeof GET.types.RequestOutput;
export type LeadExportResponseInput = typeof GET.types.ResponseInput;
export type LeadExportResponseOutput = typeof GET.types.ResponseOutput;

// Explicit types for repository compatibility (matches Zod schema above)
export interface ExportQueryType {
  format: typeof ExportFormatValues;
  status?: typeof LeadStatusValues;
  country?: string;
  language?: string;
  source?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  includeMetadata: boolean;
  includeEngagementData: boolean;
}

export interface ExportResponseType {
  fileName: string;
  fileContent: string;
  mimeType: typeof MimeTypeValues;
  totalRecords: number;
  exportedAt: Date;
}

/**
 * Export definitions
 */
const definitions = {
  GET,
};

export { GET };
export default definitions;
