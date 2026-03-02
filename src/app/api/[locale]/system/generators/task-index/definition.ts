/**
 * Task Index Generator Endpoint Definition
 * Simple endpoint for generating task index files
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "generators", "task-index"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.system",
  tags: ["post.title"],
  icon: "wand",
  allowedRoles: [
    // use vibe generate instead
  ],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title",
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      outputFile: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.outputDir.label",
        description: "post.fields.outputDir.description",
        columns: 12,
        schema: z
          .string()
          .default("src/app/api/[locale]/system/generated/tasks-index.ts"),
      }),

      dryRun: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.verbose.label",
        description: "post.fields.verbose.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.success.title",
        schema: z.boolean(),
      }),
      message: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.message.title",
        schema: z.string(),
      }),
      tasksFound: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.tasksFound.title",
        schema: z.coerce.number(),
      }),
      duration: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.duration.title",
        schema: z.coerce.number(),
      }),
    },
  }),

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
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    unauthorized: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    server_error: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    unknown_error: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    network_error: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    forbidden: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    not_found: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    conflict: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    unsaved_changes: {
      title: "post.errors.unsaved.title",
      description: "post.errors.unsaved.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
});

const taskIndexGeneratorEndpoints = { POST };
export default taskIndexGeneratorEndpoints;
