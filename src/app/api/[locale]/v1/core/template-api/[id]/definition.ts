/**
 * Template Item API Definition
 * Defines endpoints for individual template operations (GET, PUT, DELETE by ID)
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
  requestUrlParamsField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { TemplateStatus, TemplateStatusOptions } from "../enum";

/**
 * Enhanced GET endpoint for template by ID
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "template-api", "[id]"],
  allowedRoles: [UserRole.PUBLIC],
  aliases: ["template-api:get", "template:get"],

  title: "app.api.v1.core.templateApi.id.get.title",
  description: "app.api.v1.core.templateApi.id.get.description",
  category: "app.api.v1.core.templateApi.id.category",
  tags: [
    "app.api.v1.core.templateApi.id.tags.template",
    "app.api.v1.core.templateApi.id.tags.get",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.templateApi.id.get.form.title",
      description: "app.api.v1.core.templateApi.id.get.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true, urlParams: true },
    {
      // === URL PARAM FIELDS ===
      id: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.templateApi.id.get.id.label",
          description: "app.api.v1.core.templateApi.id.get.id.description",
          placeholder: "app.api.v1.core.templateApi.id.get.id.placeholder",
        },
        z.uuid(),
      ),

      // === RESPONSE FIELDS ===
      response: responseField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.templateApi.id.get.response.title",
          description:
            "app.api.v1.core.templateApi.id.get.response.description",
          layout: { columns: 12 },
        },
        z.object({
          success: z.boolean(),
          template: z.object({
            id: z.uuid(),
            name: z.string(),
            description: z.string().nullable(),
            content: z.string(),
            status: z.string(),
            tags: z.array(z.string()),
            createdAt: z.date(),
            updatedAt: z.date(),
            userId: z.uuid(),
          }),
        }),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.templateApi.id.get.errors.validation.title",
      description:
        "app.api.v1.core.templateApi.id.get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.templateApi.id.get.errors.notFound.title",
      description:
        "app.api.v1.core.templateApi.id.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.templateApi.id.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.templateApi.id.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.templateApi.id.get.errors.forbidden.title",
      description:
        "app.api.v1.core.templateApi.id.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.templateApi.id.get.errors.server.title",
      description:
        "app.api.v1.core.templateApi.id.get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.templateApi.id.get.errors.network.title",
      description:
        "app.api.v1.core.templateApi.id.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.templateApi.id.get.errors.unknown.title",
      description:
        "app.api.v1.core.templateApi.id.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.templateApi.id.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.templateApi.id.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.templateApi.id.get.errors.conflict.title",
      description:
        "app.api.v1.core.templateApi.id.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.templateApi.id.get.success.title",
    description: "app.api.v1.core.templateApi.id.get.success.description",
  },
  examples: {
    urlPathVariables: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          template: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            name: "Welcome Email Template",
            description: "Template for sending welcome emails to new users",
            content: "<h1>Welcome {{name}}!</h1><p>We're glad to have you.</p>",
            status: "PUBLISHED",
            tags: ["email", "welcome", "onboarding"],
            createdAt: new Date("2024-01-01T00:00:00Z"),
            updatedAt: new Date("2024-01-01T00:00:00Z"),
            userId: "987e6543-e89b-12d3-a456-426614174000",
          },
        },
      },
    },
  },
});

export type TemplateItemGetRequestTypeInput = typeof GET.types.RequestInput;
export type TemplateItemGetRequestTypeOutput = typeof GET.types.RequestOutput;
export type TemplateItemGetResponseTypeInput = typeof GET.types.ResponseInput;
export type TemplateItemGetResponseTypeOutput = typeof GET.types.ResponseOutput;

/**
 * Enhanced PUT endpoint for template update
 */
const { PUT } = createEndpoint({
  method: Methods.PUT,
  path: ["v1", "template-api", "[id]"],
  allowedRoles: [UserRole.PUBLIC],
  aliases: ["template-api:put", "template:update"],

  title: "app.api.v1.core.templateApi.id.put.title",
  description: "app.api.v1.core.templateApi.id.put.description",
  category: "app.api.v1.core.templateApi.id.category",
  tags: [
    "app.api.v1.core.templateApi.id.tags.template",
    "app.api.v1.core.templateApi.id.tags.update",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.templateApi.id.put.form.title",
      description: "app.api.v1.core.templateApi.id.put.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true, urlParams: true },
    {
      // === URL PARAM FIELDS ===
      id: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.templateApi.id.put.id.label",
          description: "app.api.v1.core.templateApi.id.put.id.description",
          placeholder: "app.api.v1.core.templateApi.id.put.id.placeholder",
        },
        z.uuid(),
      ),

      // === REQUEST DATA FIELDS ===
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.templateApi.id.put.name.label",
          description: "app.api.v1.core.templateApi.id.put.name.description",
          placeholder: "app.api.v1.core.templateApi.id.put.name.placeholder",
          layout: { columns: 6 },
        },
        z.string().min(1).max(255).optional(),
      ),

      description: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.templateApi.id.put.templateDescription.label",
          description:
            "app.api.v1.core.templateApi.id.put.templateDescription.help",
          placeholder:
            "app.api.v1.core.templateApi.id.put.templateDescription.placeholder",
          layout: { columns: 12 },
          rows: 3,
        },
        z.string().max(1000).optional(),
      ),

      content: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.templateApi.id.put.content.label",
          description: "app.api.v1.core.templateApi.id.put.content.description",
          placeholder: "app.api.v1.core.templateApi.id.put.content.placeholder",
          layout: { columns: 12 },
          rows: 10,
        },
        z.string().min(1).max(50000).optional(),
      ),

      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.templateApi.id.put.status.label",
          description: "app.api.v1.core.templateApi.id.put.status.description",
          placeholder: "app.api.v1.core.templateApi.id.put.status.placeholder",
          options: TemplateStatusOptions,
          layout: { columns: 6 },
        },
        z.nativeEnum(TemplateStatus).optional(),
      ),

      tags: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.templateApi.id.put.tags.label",
          description: "app.api.v1.core.templateApi.id.put.tags.description",
          placeholder: "app.api.v1.core.templateApi.id.put.tags.placeholder",
          layout: { columns: 12 },
        },
        z
          .string()
          .optional()
          .transform((val) =>
            val
              ? val
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
              : [],
          ),
      ),

      // === RESPONSE FIELDS ===
      response: responseField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.templateApi.id.put.response.title",
          description:
            "app.api.v1.core.templateApi.id.put.response.description",
          layout: { columns: 12 },
        },
        z.object({
          success: z.boolean(),
          template: z.object({
            id: z.uuid(),
            name: z.string(),
            description: z.string().nullable(),
            content: z.string(),
            status: z.string(),
            tags: z.array(z.string()),
            createdAt: z.date(),
            updatedAt: z.date(),
            userId: z.uuid(),
          }),
        }),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.templateApi.id.put.errors.validation.title",
      description:
        "app.api.v1.core.templateApi.id.put.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.templateApi.id.put.errors.network.title",
      description:
        "app.api.v1.core.templateApi.id.put.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.templateApi.id.put.errors.unauthorized.title",
      description:
        "app.api.v1.core.templateApi.id.put.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.templateApi.id.put.errors.forbidden.title",
      description:
        "app.api.v1.core.templateApi.id.put.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.templateApi.id.put.errors.notFound.title",
      description:
        "app.api.v1.core.templateApi.id.put.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.templateApi.id.put.errors.server.title",
      description:
        "app.api.v1.core.templateApi.id.put.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.templateApi.id.put.errors.unknown.title",
      description:
        "app.api.v1.core.templateApi.id.put.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.templateApi.id.put.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.templateApi.id.put.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.templateApi.id.put.errors.conflict.title",
      description:
        "app.api.v1.core.templateApi.id.put.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.templateApi.id.put.success.title",
    description: "app.api.v1.core.templateApi.id.put.success.description",
  },
  examples: {
    urlPathVariables: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    requests: {
      default: {
        name: "Updated Welcome Email",
        description: "Updated template for welcome emails",
        content: "<h1>Welcome {{name}}!</h1><p>Updated content here.</p>",
        status: [TemplateStatus.PUBLISHED],
        tags: ["email", "welcome", "updated"],
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          template: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            name: "Updated Welcome Email",
            description: "Updated template for welcome emails",
            content: "<h1>Welcome {{name}}!</h1><p>Updated content here.</p>",
            status: "PUBLISHED",
            tags: ["email", "welcome", "updated"],
            createdAt: new Date("2024-01-01T00:00:00Z"),
            updatedAt: new Date(),
            userId: "987e6543-e89b-12d3-a456-426614174000",
          },
        },
      },
    },
  },
});

export type TemplateItemPutRequestTypeInput = typeof PUT.types.RequestInput;
export type TemplateItemPutRequestTypeOutput = typeof PUT.types.RequestOutput;
export type TemplateItemPutResponseTypeInput = typeof PUT.types.ResponseInput;
export type TemplateItemPutResponseTypeOutput = typeof PUT.types.ResponseOutput;

/**
 * Enhanced DELETE endpoint for template deletion
 */
const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["v1", "template-api", "[id]"],
  allowedRoles: [UserRole.PUBLIC],
  aliases: ["template-api:delete", "template:delete"],

  title: "app.api.v1.core.templateApi.id.delete.title",
  description: "app.api.v1.core.templateApi.id.delete.description",
  category: "app.api.v1.core.templateApi.id.category",
  tags: [
    "app.api.v1.core.templateApi.id.tags.template",
    "app.api.v1.core.templateApi.id.tags.delete",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.templateApi.id.delete.form.title",
      description: "app.api.v1.core.templateApi.id.delete.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true, urlParams: true },
    {
      // === URL PARAM FIELDS ===
      id: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.templateApi.id.delete.id.label",
          description: "app.api.v1.core.templateApi.id.delete.id.description",
          placeholder: "app.api.v1.core.templateApi.id.delete.id.placeholder",
        },
        z.uuid(),
      ),

      // === RESPONSE FIELDS ===
      response: responseField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.templateApi.id.delete.response.title",
          description:
            "app.api.v1.core.templateApi.id.delete.response.description",
          layout: { columns: 12 },
        },
        z.object({
          success: z.boolean(),
        }),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.templateApi.id.delete.errors.validation.title",
      description:
        "app.api.v1.core.templateApi.id.delete.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.templateApi.id.delete.errors.network.title",
      description:
        "app.api.v1.core.templateApi.id.delete.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.templateApi.id.delete.errors.unauthorized.title",
      description:
        "app.api.v1.core.templateApi.id.delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.templateApi.id.delete.errors.forbidden.title",
      description:
        "app.api.v1.core.templateApi.id.delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.templateApi.id.delete.errors.notFound.title",
      description:
        "app.api.v1.core.templateApi.id.delete.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.templateApi.id.delete.errors.server.title",
      description:
        "app.api.v1.core.templateApi.id.delete.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.templateApi.id.delete.errors.unknown.title",
      description:
        "app.api.v1.core.templateApi.id.delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.templateApi.id.delete.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.templateApi.id.delete.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.templateApi.id.delete.errors.conflict.title",
      description:
        "app.api.v1.core.templateApi.id.delete.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.templateApi.id.delete.success.title",
    description: "app.api.v1.core.templateApi.id.delete.success.description",
  },
  examples: {
    urlPathVariables: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        response: {
          success: true,
        },
      },
    },
  },
});

export type TemplateItemDeleteRequestTypeInput =
  typeof DELETE.types.RequestInput;
export type TemplateItemDeleteRequestTypeOutput =
  typeof DELETE.types.RequestOutput;
export type TemplateItemDeleteResponseTypeInput =
  typeof DELETE.types.ResponseInput;
export type TemplateItemDeleteResponseTypeOutput =
  typeof DELETE.types.ResponseOutput;

/**
 * Export the endpoint definitions
 */
const templateItemEndpoints = {
  GET,
  PUT,
  DELETE,
};

export { DELETE, GET, PUT };
export default templateItemEndpoints;
