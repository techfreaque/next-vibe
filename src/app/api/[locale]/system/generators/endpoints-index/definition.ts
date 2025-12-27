/**
 * Endpoints Index Generator Endpoint Definition
 * Simple endpoint for generating endpoints index files
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "generators", "endpoints-index"],
  title: "app.api.system.generators.endpointsIndex.post.title",
  description: "app.api.system.generators.endpointsIndex.post.description",
  category: "app.api.system.generators.category",
  tags: ["app.api.system.generators.endpointsIndex.post.title"],
  icon: "file-code",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_OFF,
    UserRole.PRODUCTION_OFF,
  ],

  fields: objectField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "app.api.system.generators.endpointsIndex.post.container.title",
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      outputFile: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.system.generators.endpointsIndex.post.fields.outputFile.label",
          description:
            "app.api.system.generators.endpointsIndex.post.fields.outputFile.description",
          columns: 12,
        },
        z
          .string()
          .default("src/app/api/[locale]/system/generated/endpoints.ts"),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.system.generators.endpointsIndex.post.fields.dryRun.label",
          description:
            "app.api.system.generators.endpointsIndex.post.fields.dryRun.description",
          columns: 6,
        },
        z.boolean().optional().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.generators.endpointsIndex.post.fields.success.title",
        },
        z.boolean(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.generators.endpointsIndex.post.fields.message.title",
        },
        z.string(),
      ),
      endpointsFound: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.generators.endpointsIndex.post.fields.endpointsFound.title",
        },
        z.coerce.number(),
      ),
      duration: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.generators.endpointsIndex.post.fields.duration.title",
        },
        z.coerce.number(),
      ),
    },
  ),

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        outputFile: "src/app/api/[locale]/system/generated/endpoints.ts",
        dryRun: false,
      },
    },
    responses: {
      default: {
        success: true,
        message: "Generated endpoints index with 152 endpoints in 150ms",
        endpointsFound: 152,
        duration: 150,
      },
    },
  },

  errorTypes: {
    validation_failed: {
      title:
        "app.api.system.generators.endpointsIndex.post.errors.validation.title",
      description:
        "app.api.system.generators.endpointsIndex.post.errors.validation.description",
    },
    unauthorized: {
      title:
        "app.api.system.generators.endpointsIndex.post.errors.unauthorized.title",
      description:
        "app.api.system.generators.endpointsIndex.post.errors.unauthorized.description",
    },
    server_error: {
      title:
        "app.api.system.generators.endpointsIndex.post.errors.server.title",
      description:
        "app.api.system.generators.endpointsIndex.post.errors.server.description",
    },
    unknown_error: {
      title:
        "app.api.system.generators.endpointsIndex.post.errors.unknown.title",
      description:
        "app.api.system.generators.endpointsIndex.post.errors.unknown.description",
    },
    network_error: {
      title:
        "app.api.system.generators.endpointsIndex.post.errors.network.title",
      description:
        "app.api.system.generators.endpointsIndex.post.errors.network.description",
    },
    forbidden: {
      title:
        "app.api.system.generators.endpointsIndex.post.errors.forbidden.title",
      description:
        "app.api.system.generators.endpointsIndex.post.errors.forbidden.description",
    },
    not_found: {
      title:
        "app.api.system.generators.endpointsIndex.post.errors.notFound.title",
      description:
        "app.api.system.generators.endpointsIndex.post.errors.notFound.description",
    },
    conflict: {
      title:
        "app.api.system.generators.endpointsIndex.post.errors.conflict.title",
      description:
        "app.api.system.generators.endpointsIndex.post.errors.conflict.description",
    },
    unsaved_changes: {
      title:
        "app.api.system.generators.endpointsIndex.post.errors.conflict.title",
      description:
        "app.api.system.generators.endpointsIndex.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.system.generators.endpointsIndex.post.success.title",
    description:
      "app.api.system.generators.endpointsIndex.post.success.description",
  },
});

const endpointsIndexGeneratorEndpoints = { POST };
export default endpointsIndexGeneratorEndpoints;
