/**
 * Tasks Types API Definition
 * Defines endpoints for task type definitions and metadata
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import {
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";

import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Task Types Endpoint Definition
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "system", "tasks", "types"],
  title: "app.api.v1.core.system.unifiedBackend.tasks.types.get.title",
  description:
    "app.api.v1.core.system.unifiedBackend.tasks.types.get.description",
  category: "app.api.v1.core.system.unifiedBackend.tasks.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["tasks:types"],
  tags: ["app.api.v1.core.system.unifiedBackend.tasks.types.get.title"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.container.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      operation: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.system.unifiedBackend.tasks.types.get.fields.operation.label",
          description:
            "app.api.v1.core.system.unifiedBackend.tasks.types.get.fields.operation.description",
          options: [
            {
              value: "list",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.types.get.operation.list",
            },
            {
              value: "validate",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.types.get.operation.validate",
            },
            {
              value: "export",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.types.get.operation.export",
            },
          ],
          layout: { columns: 4 },
          required: true,
        },
        z.enum(["list", "validate", "export"]),
      ),

      typeCategory: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.system.unifiedBackend.tasks.types.get.fields.category.label",
          description:
            "app.api.v1.core.system.unifiedBackend.tasks.types.get.fields.category.description",
          options: [
            {
              value: "cron",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.types.get.category.cron",
            },
            {
              value: "side",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.types.get.category.side",
            },
            {
              value: "config",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.types.get.category.config",
            },
            {
              value: "execution",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.types.get.category.execution",
            },
          ],
          layout: { columns: 4 },
        },
        z.enum(["cron", "side", "config", "execution"]).optional(),
      ),

      format: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.system.unifiedBackend.tasks.types.get.fields.format.label",
          description:
            "app.api.v1.core.system.unifiedBackend.tasks.types.get.fields.format.description",
          options: [
            {
              value: "json",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.types.get.format.json",
            },
            {
              value: "typescript",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.types.get.format.typescript",
            },
            {
              value: "schema",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.types.get.format.schema",
            },
          ],
          layout: { columns: 4 },
        },
        z.enum(["json", "typescript", "schema"]).default("json"),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedBackend.tasks.types.get.response.success.title",
        },
        z.boolean(),
      ),

      types: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedBackend.tasks.types.get.response.types.title",
        },
        z.record(z.string(), z.unknown()),
      ),

      metadata: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedBackend.tasks.types.get.response.metadata.title",
        },
        z.object({
          totalTypes: z.number(),
          categories: z.array(z.string()),
          timestamp: z.string(),
        }),
      ),
    },
  ),

  examples: {
    requests: {
      list: {
        operation: "list",
        format: "json",
      },
      export: {
        operation: "export",
        typeCategory: "cron",
        format: "typescript",
      },
      success: {
        operation: "list",
        format: "json",
      },
    },
    responses: {
      list: {
        success: true,
        types: {},
        metadata: {
          totalTypes: 0,
          categories: [],
          timestamp: "2023-07-21T12:00:00Z",
        },
      },
      export: {
        success: true,
        types: {},
        metadata: {
          totalTypes: 0,
          categories: [],
          timestamp: "2023-07-21T12:00:00Z",
        },
      },
      success: {
        success: true,
        types: {},
        metadata: {
          totalTypes: 0,
          categories: [],
          timestamp: "2023-07-21T12:00:00Z",
        },
      },
    },
  },

  errorTypes: {
    validation_failed: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.validation.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.validation.description",
    },
    unauthorized: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.unauthorized.description",
    },
    server_error: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.internal.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.internal.description",
    },
    forbidden: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.forbidden.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.forbidden.description",
    },
    not_found: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.notFound.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.notFound.description",
    },
    network_error: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.network.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.network.description",
    },
    unknown_error: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.unknown.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.unknown.description",
    },
    unsaved_changes: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.unsaved.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.unsaved.description",
    },
    conflict: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.conflict.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.types.get.errors.conflict.description",
    },
  },

  successTypes: {
    title:
      "app.api.v1.core.system.unifiedBackend.tasks.types.get.success.title",
    description:
      "app.api.v1.core.system.unifiedBackend.tasks.types.get.success.description",
  },
});

// Export the endpoint
const endpoints = { GET };
export default endpoints;

// Type exports for use in repository and route
export type TaskTypesRequestInput = typeof GET.types.RequestInput;
export type TaskTypesRequestOutput = typeof GET.types.RequestOutput;
export type TaskTypesResponseInput = typeof GET.types.ResponseInput;
export type TaskTypesResponseOutput = typeof GET.types.ResponseOutput;
