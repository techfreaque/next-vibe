/**
 * Task Index Generator Endpoint Definition
 * Simple endpoint for generating task index files
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "generators", "task-index"],
  title: "app.api.system.generators.taskIndex.post.title",
  description: "app.api.system.generators.taskIndex.post.description",
  category: "app.api.system.category",
  tags: ["app.api.system.generators.taskIndex.post.title"],
  icon: "wand",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.generators.taskIndex.post.container.title",
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      outputFile: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.generators.taskIndex.post.fields.outputDir.label",
        description:
          "app.api.system.generators.taskIndex.post.fields.outputDir.description",
        columns: 12,
        schema: z
          .string()
          .default("src/app/api/[locale]/system/generated/tasks-index.ts"),
      }),

      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.generators.taskIndex.post.fields.verbose.label",
        description:
          "app.api.system.generators.taskIndex.post.fields.verbose.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.taskIndex.post.fields.success.title",
        schema: z.boolean(),
      }),
      message: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.taskIndex.post.fields.message.title",
        schema: z.string(),
      }),
      tasksFound: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.taskIndex.post.fields.tasksFound.title",
        schema: z.coerce.number(),
      }),
      duration: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.taskIndex.post.fields.duration.title",
        schema: z.coerce.number(),
      }),
    },
  ),

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        outputFile: "src/app/api/[locale]/system/generated/tasks-index.ts",
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
      title: "app.api.system.generators.taskIndex.post.errors.validation.title",
      description:
        "app.api.system.generators.taskIndex.post.errors.validation.description",
    },
    unauthorized: {
      title:
        "app.api.system.generators.taskIndex.post.errors.unauthorized.title",
      description:
        "app.api.system.generators.taskIndex.post.errors.unauthorized.description",
    },
    server_error: {
      title: "app.api.system.generators.taskIndex.post.errors.internal.title",
      description:
        "app.api.system.generators.taskIndex.post.errors.internal.description",
    },
    unknown_error: {
      title: "app.api.system.generators.taskIndex.post.errors.unknown.title",
      description:
        "app.api.system.generators.taskIndex.post.errors.unknown.description",
    },
    network_error: {
      title: "app.api.system.generators.taskIndex.post.errors.network.title",
      description:
        "app.api.system.generators.taskIndex.post.errors.network.description",
    },
    forbidden: {
      title: "app.api.system.generators.taskIndex.post.errors.forbidden.title",
      description:
        "app.api.system.generators.taskIndex.post.errors.forbidden.description",
    },
    not_found: {
      title: "app.api.system.generators.taskIndex.post.errors.notFound.title",
      description:
        "app.api.system.generators.taskIndex.post.errors.notFound.description",
    },
    conflict: {
      title: "app.api.system.generators.taskIndex.post.errors.conflict.title",
      description:
        "app.api.system.generators.taskIndex.post.errors.conflict.description",
    },
    unsaved_changes: {
      title: "app.api.system.generators.taskIndex.post.errors.unsaved.title",
      description:
        "app.api.system.generators.taskIndex.post.errors.unsaved.description",
    },
  },

  successTypes: {
    title: "app.api.system.generators.taskIndex.post.success.title",
    description: "app.api.system.generators.taskIndex.post.success.description",
  },
});

const taskIndexGeneratorEndpoints = { POST };
export default taskIndexGeneratorEndpoints;
