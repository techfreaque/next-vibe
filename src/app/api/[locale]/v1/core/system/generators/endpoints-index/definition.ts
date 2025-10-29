/**
 * Endpoints Index Generator Endpoint Definition
 * Simple endpoint for generating endpoints index files
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
  path: ["v1", "core", "system", "generators", "endpoints-index"],
  title: "app.api.v1.core.system.generators.endpoints.post.title",
  description: "app.api.v1.core.system.generators.endpoints.post.description",
  category: "app.api.v1.core.system.generators.category",
  tags: ["app.api.v1.core.system.generators.endpoints.post.title"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],

  fields: objectField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "app.api.v1.core.system.generators.endpoints.post.container.title",
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
            "app.api.v1.core.system.generators.endpoints.post.fields.outputFile.label",
          description:
            "app.api.v1.core.system.generators.endpoints.post.fields.outputFile.description",
          layout: { columns: 12 },
        },
        z
          .string()
          .default(
            "src/app/api/[locale]/v1/core/system/generated/endpoints.ts",
          ),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.generators.endpoints.post.fields.dryRun.label",
          description:
            "app.api.v1.core.system.generators.endpoints.post.fields.dryRun.description",
          layout: { columns: 6 },
        },
        z.boolean().optional().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.endpoints.post.fields.success.title",
        },
        z.boolean(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.endpoints.post.fields.message.title",
        },
        z.string(),
      ),
      endpointsFound: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.endpoints.post.fields.endpointsFound.title",
        },
        z.number(),
      ),
      duration: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.endpoints.post.fields.duration.title",
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
          "src/app/api/[locale]/v1/core/system/generated/endpoints.ts",
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
        "app.api.v1.core.system.generators.endpoints.post.errors.validation.title",
      description:
        "app.api.v1.core.system.generators.endpoints.post.errors.validation.description",
    },
    unauthorized: {
      title:
        "app.api.v1.core.system.generators.endpoints.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.generators.endpoints.post.errors.unauthorized.description",
    },
    server_error: {
      title:
        "app.api.v1.core.system.generators.endpoints.post.errors.server.title",
      description:
        "app.api.v1.core.system.generators.endpoints.post.errors.server.description",
    },
    unknown_error: {
      title:
        "app.api.v1.core.system.generators.endpoints.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.generators.endpoints.post.errors.unknown.description",
    },
    network_error: {
      title:
        "app.api.v1.core.system.generators.endpoints.post.errors.network.title",
      description:
        "app.api.v1.core.system.generators.endpoints.post.errors.network.description",
    },
    forbidden: {
      title:
        "app.api.v1.core.system.generators.endpoints.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.generators.endpoints.post.errors.forbidden.description",
    },
    not_found: {
      title:
        "app.api.v1.core.system.generators.endpoints.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.generators.endpoints.post.errors.notFound.description",
    },
    conflict: {
      title:
        "app.api.v1.core.system.generators.endpoints.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.generators.endpoints.post.errors.conflict.description",
    },
    unsaved_changes: {
      title:
        "app.api.v1.core.system.generators.endpoints.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.generators.endpoints.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.system.generators.endpoints.post.success.title",
    description:
      "app.api.v1.core.system.generators.endpoints.post.success.description",
  },
});

const endpointsIndexGeneratorEndpoints = { POST };
export default endpointsIndexGeneratorEndpoints;
