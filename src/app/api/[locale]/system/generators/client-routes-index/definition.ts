/**
 * Client Routes Index Generator Endpoint Definition
 * Generates index file for all route-client.ts files
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
  path: ["system", "generators", "client-routes-index"],
  title: "app.api.system.generators.clientRoutesIndex.post.title",
  description: "app.api.system.generators.clientRoutesIndex.post.description",
  category: "app.api.system.generators.category",
  tags: ["app.api.system.generators.clientRoutesIndex.post.title"],
  icon: "file-code",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.generators.clientRoutesIndex.post.container.title",
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      outputFile: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.generators.clientRoutesIndex.post.fields.outputFile.label",
        description:
          "app.api.system.generators.clientRoutesIndex.post.fields.outputFile.description",
        columns: 12,
        schema: z
          .string()
          .default(
            "src/app/api/[locale]/system/generated/route-handlers-client.ts",
          ),
      }),

      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.generators.clientRoutesIndex.post.fields.dryRun.label",
        description:
          "app.api.system.generators.clientRoutesIndex.post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.clientRoutesIndex.post.fields.success.title",
        schema: z.boolean(),
      }),
      message: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.clientRoutesIndex.post.fields.message.title",
        schema: z.string(),
      }),
      routesFound: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.clientRoutesIndex.post.fields.routesFound.title",
        schema: z.coerce.number(),
      }),
      duration: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.clientRoutesIndex.post.fields.duration.title",
        schema: z.coerce.number(),
      }),
    },
  ),

  examples: {
    requests: {
      default: {
        outputFile:
          "src/app/api/[locale]/system/generated/route-handlers-client.ts",
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
      title:
        "app.api.system.generators.clientRoutesIndex.post.errors.validation.title",
      description:
        "app.api.system.generators.clientRoutesIndex.post.errors.validation.description",
    },
    unauthorized: {
      title:
        "app.api.system.generators.clientRoutesIndex.post.errors.unauthorized.title",
      description:
        "app.api.system.generators.clientRoutesIndex.post.errors.unauthorized.description",
    },
    server_error: {
      title:
        "app.api.system.generators.clientRoutesIndex.post.errors.server.title",
      description:
        "app.api.system.generators.clientRoutesIndex.post.errors.server.description",
    },
    unknown_error: {
      title:
        "app.api.system.generators.clientRoutesIndex.post.errors.unknown.title",
      description:
        "app.api.system.generators.clientRoutesIndex.post.errors.unknown.description",
    },
    network_error: {
      title:
        "app.api.system.generators.clientRoutesIndex.post.errors.network.title",
      description:
        "app.api.system.generators.clientRoutesIndex.post.errors.network.description",
    },
    forbidden: {
      title:
        "app.api.system.generators.clientRoutesIndex.post.errors.forbidden.title",
      description:
        "app.api.system.generators.clientRoutesIndex.post.errors.forbidden.description",
    },
    not_found: {
      title:
        "app.api.system.generators.clientRoutesIndex.post.errors.notFound.title",
      description:
        "app.api.system.generators.clientRoutesIndex.post.errors.notFound.description",
    },
    conflict: {
      title:
        "app.api.system.generators.clientRoutesIndex.post.errors.conflict.title",
      description:
        "app.api.system.generators.clientRoutesIndex.post.errors.conflict.description",
    },
    unsaved_changes: {
      title:
        "app.api.system.generators.clientRoutesIndex.post.errors.conflict.title",
      description:
        "app.api.system.generators.clientRoutesIndex.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.system.generators.clientRoutesIndex.post.success.title",
    description:
      "app.api.system.generators.clientRoutesIndex.post.success.description",
  },
});

const clientRoutesIndexGeneratorEndpoints = { POST };
export default clientRoutesIndexGeneratorEndpoints;
