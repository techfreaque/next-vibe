/**
 * Template Import API Definition
 * Defines endpoints for template import operations
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
import {
  ImportFormat,
  ImportFormatOptions,
  ImportMode,
  ImportModeOptions,
  ImportStatus,
  ImportStatusOptions,
} from "./enum";

/**
 * Template Import Endpoint (POST)
 * Import templates from CSV/JSON/XML formats
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "template-api", "import"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  aliases: ["template-api:import", "template:import"],

  title: "app.api.v1.core.templateApi.import.title",
  description: "app.api.v1.core.templateApi.import.description",
  category: "app.api.v1.core.templateApi.category",
  tags: [
    "app.api.v1.core.templateApi.tags.import",
    "app.api.v1.core.templateApi.tags.bulk",
    "app.api.v1.core.templateApi.tags.templates",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.templateApi.import.form.title",
      description: "app.api.v1.core.templateApi.import.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST DATA FIELDS ===
      format: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.templateApi.import.format.label",
          description: "app.api.v1.core.templateApi.import.format.description",
          placeholder: "app.api.v1.core.templateApi.import.format.placeholder",
          options: ImportFormatOptions,
          layout: { columns: 6 },
        },
        z.array(z.nativeEnum(ImportFormat)),
      ),

      mode: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.templateApi.import.mode.label",
          description: "app.api.v1.core.templateApi.import.mode.description",
          placeholder: "app.api.v1.core.templateApi.import.mode.placeholder",
          options: ImportModeOptions,
          layout: { columns: 6 },
        },
        z.array(z.nativeEnum(ImportMode)),
      ),

      data: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.templateApi.import.data.label",
          description: "app.api.v1.core.templateApi.import.data.description",
          placeholder: "app.api.v1.core.templateApi.import.data.placeholder",
          layout: { columns: 12 },
        },
        z.string().min(1),
      ),

      validateOnly: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.CHECKBOX,
          label: "app.api.v1.core.templateApi.import.validateOnly.label",
          description: "app.api.v1.core.templateApi.import.validateOnly.description",
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      skipErrors: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.CHECKBOX,
          label: "app.api.v1.core.templateApi.import.skipErrors.label",
          description: "app.api.v1.core.templateApi.import.skipErrors.description",
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      defaultStatus: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.templateApi.import.defaultStatus.label",
          description:
            "app.api.v1.core.templateApi.import.defaultStatus.description",
          placeholder:
            "app.api.v1.core.templateApi.import.defaultStatus.placeholder",
          options: TemplateStatusOptions,
          layout: { columns: 12 },
        },
        z.array(z.nativeEnum(TemplateStatus)).default([TemplateStatus.DRAFT]),
      ),

      // === RESPONSE FIELDS ===
      response: responseField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.templateApi.import.response.title",
          description: "app.api.v1.core.templateApi.import.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        z.object({
          id: z.uuid(),
          status: z.nativeEnum(ImportStatus),
          format: z.nativeEnum(ImportFormat),
          mode: z.nativeEnum(ImportMode),
          totalRecords: z.number(),
          processedRecords: z.number(),
          successfulRecords: z.number(),
          failedRecords: z.number(),
          errors: z.array(
            z.object({
              row: z.number(),
              field: z.string().optional(),
              message: z.string(),
              messageParams: z.record(z.string()).optional(),
            }),
          ),
          warnings: z.array(
            z.object({
              row: z.number(),
              field: z.string().optional(),
              message: z.string(),
              messageParams: z.record(z.string()).optional(),
            }),
          ),
          createdAt: dateSchema,
          completedAt: dateSchema.optional(),
        }),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.templateApi.import.errors.validation.title",
      description:
        "app.api.v1.core.templateApi.import.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.templateApi.import.errors.unauthorized.title",
      description:
        "app.api.v1.core.templateApi.import.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.templateApi.import.errors.forbidden.title",
      description: "app.api.v1.core.templateApi.import.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.templateApi.import.errors.server.title",
      description: "app.api.v1.core.templateApi.import.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.templateApi.import.errors.network.title",
      description: "app.api.v1.core.templateApi.import.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.templateApi.import.errors.unknown.title",
      description: "app.api.v1.core.templateApi.import.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.templateApi.import.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.templateApi.import.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.templateApi.import.errors.conflict.title",
      description: "app.api.v1.core.templateApi.import.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.templateApi.import.success.title",
    description: "app.api.v1.core.templateApi.import.success.description",
  },

  examples: {
    requests: {
      empty: {},
      basic: {
        format: [ImportFormat.CSV],
        mode: [ImportMode.CREATE_OR_UPDATE],
        data: 'name,description,content,status,tags\n"Email Template","Newsletter template","<h1>{{title}}</h1>","DRAFT","email,newsletter"',
        validateOnly: false,
        skipErrors: true,
        defaultStatus: [TemplateStatus.DRAFT],
      },
      json: {
        format: [ImportFormat.JSON],
        mode: [ImportMode.CREATE_ONLY],
        data: JSON.stringify([
          {
            name: "Welcome Email",
            description: "Welcome new users",
            content: "<h1>Welcome {{name}}!</h1>",
            status: "PUBLISHED",
            tags: ["welcome", "onboarding"],
          },
        ]),
        validateOnly: false,
        skipErrors: false,
        defaultStatus: [TemplateStatus.DRAFT],
      },
    },
    urlPathVariables: undefined,
    responses: {
      empty: {
        response: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          status: ImportStatus.COMPLETED,
          format: ImportFormat.CSV,
          mode: ImportMode.CREATE_OR_UPDATE,
          totalRecords: 0,
          processedRecords: 0,
          successfulRecords: 0,
          failedRecords: 0,
          errors: [],
          warnings: [],
          createdAt: new Date().toISOString(),
        },
      },
      basic: {
        response: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          status: ImportStatus.COMPLETED,
          format: ImportFormat.CSV,
          mode: ImportMode.CREATE_OR_UPDATE,
          totalRecords: 1,
          processedRecords: 1,
          successfulRecords: 1,
          failedRecords: 0,
          errors: [],
          warnings: [],
          createdAt: "2024-01-15T10:30:00Z",
          completedAt: "2024-01-15T10:30:30Z",
        },
      },
      json: {
        response: {
          id: "456e7890-e89b-12d3-a456-426614174001",
          status: ImportStatus.COMPLETED,
          format: ImportFormat.JSON,
          mode: ImportMode.CREATE_ONLY,
          totalRecords: 1,
          processedRecords: 1,
          successfulRecords: 1,
          failedRecords: 0,
          errors: [],
          warnings: [],
          createdAt: "2024-01-15T10:30:00Z",
          completedAt: "2024-01-15T10:30:45Z",
        },
      },
    },
  },
});

export type TemplateImportRequestTypeInput = typeof POST.types.RequestInput;
export type TemplateImportRequestTypeOutput = typeof POST.types.RequestOutput;
export type TemplateImportResponseTypeInput = typeof POST.types.ResponseInput;
export type TemplateImportResponseTypeOutput = typeof POST.types.ResponseOutput;

// Keep for backward compatibility
export const templateImportRequestSchema = POST.requestSchema;
export const templateImportResponseSchema = POST.responseSchema;

/**
 * Export the endpoint definitions
 */
const templateImportEndpoints = {
  POST,
};

export { POST };
export default templateImportEndpoints;
