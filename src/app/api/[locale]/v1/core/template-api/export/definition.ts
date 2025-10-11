/**
 * Template Export API Definition
 * Defines endpoints for template export operations
 */

import { dateSchema } from "next-vibe/shared/types/common.schema";
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

import { TemplateStatus, TemplateStatusOptions } from "../enum";
import { ExportFormat, ExportFormatOptions } from "./enums";

/**
 * Enhanced POST endpoint for template export
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "template-api", "export"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  aliases: ["template-api:export", "template:export"],

  title: "app.api.v1.core.templateApi.export.title",
  description: "app.api.v1.core.templateApi.export.description",
  category: "app.api.v1.core.templateApi.category",
  tags: [
    "app.api.v1.core.templateApi.tags.export",
    "app.api.v1.core.templateApi.tags.download",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.templateApi.export.form.title",
      description: "app.api.v1.core.templateApi.export.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST DATA FIELDS ===
      format: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.templateApi.export.format.label",
          description:
            "app.api.v1.core.templateApi.export.format.description",
          placeholder:
            "app.api.v1.core.templateApi.export.format.placeholder",
          options: ExportFormatOptions,
          layout: { columns: 6 },
        },
        z.nativeEnum(ExportFormat).default(ExportFormat.JSON),
      ),

      templateIds: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.templateApi.export.templateIds.label",
          description:
            "app.api.v1.core.templateApi.export.templateIds.description",
          placeholder:
            "app.api.v1.core.templateApi.export.templateIds.placeholder",
          layout: { columns: 12 },
        },
        z.array(z.uuid()).optional(),
      ),

      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.templateApi.export.status.label",
          description:
            "app.api.v1.core.templateApi.export.status.description",
          placeholder:
            "app.api.v1.core.templateApi.export.status.placeholder",
          options: TemplateStatusOptions,
          layout: { columns: 6 },
        },
        z.array(z.nativeEnum(TemplateStatus)).optional(),
      ),

      tags: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.templateApi.export.tags.label",
          description:
            "app.api.v1.core.templateApi.export.tags.description",
          placeholder:
            "app.api.v1.core.templateApi.export.tags.placeholder",
          layout: { columns: 6 },
        },
        z.array(z.string()).optional(),
      ),

      includeContent: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.CHECKBOX,
          label: "app.api.v1.core.templateApi.export.includeContent.label",
          description:
            "app.api.v1.core.templateApi.export.includeContent.description",
          layout: { columns: 6 },
        },
        z.boolean().default(true),
      ),

      includeMetadata: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.CHECKBOX,
          label: "app.api.v1.core.templateApi.export.includeMetadata.label",
          description:
            "app.api.v1.core.templateApi.export.includeMetadata.description",
          layout: { columns: 6 },
        },
        z.boolean().default(true),
      ),

      dateFrom: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.templateApi.export.dateFrom.label",
          description:
            "app.api.v1.core.templateApi.export.dateFrom.description",
          placeholder:
            "app.api.v1.core.templateApi.export.dateFrom.placeholder",
          layout: { columns: 6 },
        },
        dateSchema.optional(),
      ),

      dateTo: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.templateApi.export.dateTo.label",
          description:
            "app.api.v1.core.templateApi.export.dateTo.description",
          placeholder:
            "app.api.v1.core.templateApi.export.dateTo.placeholder",
          layout: { columns: 6 },
        },
        dateSchema.optional(),
      ),

      // === RESPONSE FIELDS ===
      response: responseField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.templateApi.export.response.title",
          description:
            "app.api.v1.core.templateApi.export.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        z.object({
          success: z.boolean(),
          exportData: z.object({
            format: z.string(),
            filename: z.string(),
            data: z.string(),
            mimeType: z.string(),
            size: z.number(),
            templateCount: z.number(),
            exportedAt: dateSchema,
          }),
        }),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.templateApi.export.errors.validation.title",
      description:
        "app.api.v1.core.templateApi.export.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.templateApi.export.errors.unauthorized.title",
      description:
        "app.api.v1.core.templateApi.export.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.templateApi.export.errors.forbidden.title",
      description:
        "app.api.v1.core.templateApi.export.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.templateApi.export.errors.server.title",
      description:
        "app.api.v1.core.templateApi.export.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.templateApi.export.errors.network.title",
      description:
        "app.api.v1.core.templateApi.export.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.templateApi.export.errors.unknown.title",
      description:
        "app.api.v1.core.templateApi.export.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.templateApi.export.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.templateApi.export.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.templateApi.export.errors.conflict.title",
      description:
        "app.api.v1.core.templateApi.export.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.templateApi.export.success.title",
    description: "app.api.v1.core.templateApi.export.success.description",
  },

  examples: {
    requests: {
      empty: {},
      basic: {
        format: ExportFormat.JSON,
        includeContent: true,
        includeMetadata: true,
      },
      advanced: {
        format: ExportFormat.CSV,
        templateIds: ["123e4567-e89b-12d3-a456-426614174000"],
        status: [TemplateStatus.PUBLISHED],
        tags: ["marketing", "newsletter"],
        includeContent: true,
        includeMetadata: true,
        dateFrom: "2024-01-01",
        dateTo: "2024-12-31",
      },
    },
    urlPathVariables: undefined,
    responses: {
      empty: {
        success: true,
        exportData: {
          format: ExportFormat.JSON,
          filename: "templates_export_empty.json",
          data: "eyJ0ZW1wbGF0ZXMiOltdfQ==",
          mimeType: "application/json",
          size: 16,
          templateCount: 0,
          exportedAt: new Date().toISOString(),
        },
      },
      basic: {
        success: true,
        exportData: {
          format: ExportFormat.JSON,
          filename: "templates_export_2024-01-15.json",
          data: "eyJ0ZW1wbGF0ZXMiOlt7ImlkIjoiMTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDAwIiwibmFtZSI6IkVtYWlsIFRlbXBsYXRlIn1dfQ==",
          mimeType: "application/json",
          size: 1024,
          templateCount: 1,
          exportedAt: "2024-01-15T10:30:00Z",
        },
      },
      advanced: {
        success: true,
        exportData: {
          format: ExportFormat.CSV,
          filename: "templates_export_2024-01-15.csv",
          data: "aWQsbmFtZSxzdGF0dXMsY3JlYXRlZEF0DQoxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAsRW1haWwgVGVtcGxhdGUsUFVCTElTSEVELDIwMjQtMDEtMTVUMTA6MzA6MDBa",
          mimeType: "text/csv",
          size: 512,
          templateCount: 1,
          exportedAt: "2024-01-15T10:30:00Z",
        },
      },
    },
  },
});

export type TemplateExportRequestTypeInput = typeof POST.types.RequestInput;
export type TemplateExportRequestTypeOutput = typeof POST.types.RequestOutput;
export type TemplateExportResponseTypeInput = typeof POST.types.ResponseInput;
export type TemplateExportResponseTypeOutput = typeof POST.types.ResponseOutput;

/**
 * Export the endpoint definitions
 */
const templateExportEndpoints = {
  POST,
};

export { POST };
export default templateExportEndpoints;
