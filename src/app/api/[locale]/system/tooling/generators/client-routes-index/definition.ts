/**
 * Client Routes Index Generator Endpoint Definition
 * Generates index file for all route-client.ts files
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { scopedTranslation } from "next-vibe/tooling/generators/client-routes-index/i18n";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "tooling", "generators", "client-routes-index"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "devTools",
  subCategory: "Generators",
  tags: ["post.title"],
  icon: "file-code",
  allowedRoles: [
    // use vibe generate instead
  ],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title",
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      outputFile: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.outputFile.label",
        description: "post.fields.outputFile.description",
        columns: 12,
        schema: z.string().default("src/generated/route-handlers-client.ts"),
      }),

      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.success.title",
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.message.title",
        schema: z.string(),
      }),
      routesFound: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.routesFound.title",
        schema: z.coerce.number(),
      }),
      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.duration.title",
        schema: z.coerce.number(),
      }),
    },
  }),

  examples: {
    requests: {
      default: {
        outputFile: "src/generated/route-handlers-client.ts",
        dryRun: false,
      },
    },
    responses: {
      default: {
        success: true,
        message: "Generated client routes index with 5 routes in 150ms",
        routesFound: 5,
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
      title: "post.errors.server.title",
      description: "post.errors.server.description",
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
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
});

const clientRoutesIndexGeneratorEndpoints = { POST };
export default clientRoutesIndexGeneratorEndpoints;
