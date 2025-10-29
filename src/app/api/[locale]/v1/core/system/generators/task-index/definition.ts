/**
 * Task Index Generator Endpoint Definition
 * Simple endpoint for generating task index files
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "generators", "task-index"],
  title: "app.api.v1.core.system.generators.taskIndex.post.title",
  description: "app.api.v1.core.system.generators.taskIndex.post.description",
  category: "app.api.v1.core.system.generators.category",
  tags: ["app.api.v1.core.system.generators.taskIndex.post.title"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],

  fields: objectField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "app.api.v1.core.system.generators.taskIndex.post.container.title",
      layout: { columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      outputFile: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.generators.taskIndex.post.fields.outputDir.label",
          description:
            "app.api.v1.core.system.generators.taskIndex.post.fields.outputDir.description",
          layout: { columns: 12 },
        },
        z
          .string()
          .default(
            "src/app/api/[locale]/v1/core/system/generated/tasks-index.ts",
          ),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.generators.taskIndex.post.fields.verbose.label",
          description:
            "app.api.v1.core.system.generators.taskIndex.post.fields.verbose.description",
          layout: { columns: 6 },
        },
        z.boolean().optional().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.taskIndex.post.fields.success.title",
        },
        z.boolean(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.taskIndex.post.fields.message.title",
        },
        z.string(),
      ),
      tasksFound: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.taskIndex.post.fields.tasksFound.title",
        },
        z.number(),
      ),
      duration: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.taskIndex.post.fields.duration.title",
        },
        z.number(),
      ),
    },
  ),

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        outputFile:
          "src/app/api/[locale]/v1/core/system/generated/tasks-index.ts",
        dryRun: false,
      },
    },
    responses: {
      default: {
        success: true,
        message: "Generated task index with 5 tasks in 150ms",
        tasksFound: 5,
        duration: 150,
      },
    },
  },

  errorTypes: {
    validation_failed: {
      title:
        "app.api.v1.core.system.generators.taskIndex.post.errors.validation.title",
      description:
        "app.api.v1.core.system.generators.taskIndex.post.errors.validation.description",
    },
    unauthorized: {
      title:
        "app.api.v1.core.system.generators.taskIndex.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.generators.taskIndex.post.errors.unauthorized.description",
    },
    server_error: {
      title:
        "app.api.v1.core.system.generators.taskIndex.post.errors.internal.title",
      description:
        "app.api.v1.core.system.generators.taskIndex.post.errors.internal.description",
    },
    unknown_error: {
      title:
        "app.api.v1.core.system.generators.taskIndex.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.generators.taskIndex.post.errors.unknown.description",
    },
    network_error: {
      title:
        "app.api.v1.core.system.generators.taskIndex.post.errors.network.title",
      description:
        "app.api.v1.core.system.generators.taskIndex.post.errors.network.description",
    },
    forbidden: {
      title:
        "app.api.v1.core.system.generators.taskIndex.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.generators.taskIndex.post.errors.forbidden.description",
    },
    not_found: {
      title:
        "app.api.v1.core.system.generators.taskIndex.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.generators.taskIndex.post.errors.notFound.description",
    },
    conflict: {
      title:
        "app.api.v1.core.system.generators.taskIndex.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.generators.taskIndex.post.errors.conflict.description",
    },
    unsaved_changes: {
      title:
        "app.api.v1.core.system.generators.taskIndex.post.errors.unsaved.title",
      description:
        "app.api.v1.core.system.generators.taskIndex.post.errors.unsaved.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.system.generators.taskIndex.post.success.title",
    description:
      "app.api.v1.core.system.generators.taskIndex.post.success.description",
  },
});

const taskIndexGeneratorEndpoints = { POST };
export default taskIndexGeneratorEndpoints;
