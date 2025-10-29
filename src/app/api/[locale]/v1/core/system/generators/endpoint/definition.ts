/**
 * Dynamic Endpoint Generator Definition
 * Generates endpoint.ts with dynamic imports and flat path structure
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
  path: ["v1", "core", "system", "generators", "endpoint"],
  title: "app.api.v1.core.system.generators.endpoint.post.title" as const,
  description:
    "app.api.v1.core.system.generators.endpoint.post.description" as const,
  category: "app.api.v1.core.system.generators.category" as const,
  tags: ["app.api.v1.core.system.generators.endpoint.post.title" as const],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF] as const,

  fields: objectField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label:
        "app.api.v1.core.system.generators.endpoint.post.container.title" as const,
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
            "app.api.v1.core.system.generators.endpoint.post.fields.outputFile.label" as const,
          description:
            "app.api.v1.core.system.generators.endpoint.post.fields.outputFile.description" as const,
          layout: { columns: 12 },
        },
        z
          .string()
          .default("src/app/api/[locale]/v1/core/system/generated/endpoint.ts"),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.generators.endpoint.post.fields.dryRun.label" as const,
          description:
            "app.api.v1.core.system.generators.endpoint.post.fields.dryRun.description" as const,
          layout: { columns: 6 },
        },
        z.boolean().optional().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.endpoint.post.fields.success.title" as const,
        },
        z.boolean(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.endpoint.post.fields.message.title" as const,
        },
        z.string(),
      ),
      endpointsFound: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.endpoint.post.fields.endpointsFound.title" as const,
        },
        z.number(),
      ),
      duration: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.endpoint.post.fields.duration.title" as const,
        },
        z.number(),
      ),
    },
  ),

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        outputFile: "src/app/api/[locale]/v1/core/system/generated/endpoint.ts",
        dryRun: false,
      },
    },
    responses: {
      default: {
        success: true,
        message: "Generated dynamic endpoint with 152 endpoints in 150ms",
        endpointsFound: 152,
        duration: 150,
      },
    },
  },

  errorTypes: {
    validation_failed: {
      title:
        "app.api.v1.core.system.generators.endpoint.post.errors.validation.title" as const,
      description:
        "app.api.v1.core.system.generators.endpoint.post.errors.validation.description" as const,
    },
    server_error: {
      title:
        "app.api.v1.core.system.generators.endpoint.post.errors.server.title" as const,
      description:
        "app.api.v1.core.system.generators.endpoint.post.errors.server.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.v1.core.system.generators.endpoint.post.success.title" as const,
    description:
      "app.api.v1.core.system.generators.endpoint.post.success.description" as const,
  },
});

const endpointDynamicGeneratorEndpoints = { POST };
export default endpointDynamicGeneratorEndpoints;
