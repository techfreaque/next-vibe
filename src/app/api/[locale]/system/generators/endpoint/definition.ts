/**
 * Dynamic Endpoint Generator Definition
 * Generates endpoint.ts with dynamic imports and flat path structure
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "generators", "endpoint"],
  title: "app.api.system.generators.endpoint.post.title" as const,
  description: "app.api.system.generators.endpoint.post.description" as const,
  category: "app.api.system.category" as const,
  tags: ["app.api.system.generators.endpoint.post.title" as const],
  icon: "wand",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.generators.endpoint.post.container.title" as const,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      outputFile: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.generators.endpoint.post.fields.outputFile.label" as const,
        description:
          "app.api.system.generators.endpoint.post.fields.outputFile.description" as const,
        columns: 12,
        schema: z
          .string()
          .default("src/app/api/[locale]/system/generated/endpoint.ts"),
      }),

      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.generators.endpoint.post.fields.dryRun.label" as const,
        description:
          "app.api.system.generators.endpoint.post.fields.dryRun.description" as const,
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.endpoint.post.fields.success.title" as const,
        schema: z.boolean(),
      }),
      message: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.endpoint.post.fields.message.title" as const,
        schema: z.string(),
      }),
      endpointsFound: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.endpoint.post.fields.endpointsFound.title" as const,
        schema: z.coerce.number(),
      }),
      duration: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.endpoint.post.fields.duration.title" as const,
        schema: z.coerce.number(),
      }),
    },
  ),

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        outputFile: "src/app/api/[locale]/system/generated/endpoint.ts",
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
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.generators.endpoint.post.errors.validation.title" as const,
      description:
        "app.api.system.generators.endpoint.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.generators.endpoint.post.errors.server.title" as const,
      description:
        "app.api.system.generators.endpoint.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.generators.endpoint.post.errors.server.title" as const,
      description:
        "app.api.system.generators.endpoint.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.generators.endpoint.post.errors.server.title" as const,
      description:
        "app.api.system.generators.endpoint.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.generators.endpoint.post.errors.server.title" as const,
      description:
        "app.api.system.generators.endpoint.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.generators.endpoint.post.errors.server.title" as const,
      description:
        "app.api.system.generators.endpoint.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.generators.endpoint.post.errors.server.title" as const,
      description:
        "app.api.system.generators.endpoint.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.generators.endpoint.post.errors.server.title" as const,
      description:
        "app.api.system.generators.endpoint.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.generators.endpoint.post.errors.server.title" as const,
      description:
        "app.api.system.generators.endpoint.post.errors.server.description" as const,
    },
  },

  successTypes: {
    title: "app.api.system.generators.endpoint.post.success.title" as const,
    description:
      "app.api.system.generators.endpoint.post.success.description" as const,
  },
});

const endpointDynamicGeneratorEndpoints = { POST };
export default endpointDynamicGeneratorEndpoints;
