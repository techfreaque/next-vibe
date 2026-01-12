/**
 * Dynamic Route Handlers Generator Definition
 * Generates route-handlers.ts with dynamic imports and flat path structure
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "generators", "route-handlers"],
  title: "app.api.system.generators.route-handlers.post.title" as const,
  description:
    "app.api.system.generators.route-handlers.post.description" as const,
  category: "app.api.system.generators.category" as const,
  tags: ["app.api.system.generators.route-handlers.post.title" as const],
  icon: "file-code",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_OFF,
    UserRole.PRODUCTION_OFF,
  ] as const,

  fields: objectField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label:
        "app.api.system.generators.route-handlers.post.container.title" as const,
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
            "app.api.system.generators.route-handlers.post.fields.outputFile.label" as const,
          description:
            "app.api.system.generators.route-handlers.post.fields.outputFile.description" as const,
          columns: 12,
        },
        z
          .string()
          .default("src/app/api/[locale]/system/generated/route-handlers.ts"),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.system.generators.route-handlers.post.fields.dryRun.label" as const,
          description:
            "app.api.system.generators.route-handlers.post.fields.dryRun.description" as const,
          columns: 6,
        },
        z.boolean().optional().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.generators.route-handlers.post.fields.success.title" as const,
        },
        z.boolean(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.generators.route-handlers.post.fields.message.title" as const,
        },
        z.string(),
      ),
      routesFound: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.generators.route-handlers.post.fields.routesFound.title" as const,
        },
        z.coerce.number(),
      ),
      duration: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.generators.route-handlers.post.fields.duration.title" as const,
        },
        z.coerce.number(),
      ),
    },
  ),

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        outputFile: "src/app/api/[locale]/system/generated/route-handlers.ts",
        dryRun: false,
      },
    },
    responses: {
      default: {
        success: true,
        message: "Generated dynamic route handlers with 152 routes in 150ms",
        routesFound: 152,
        duration: 150,
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.generators.route-handlers.post.errors.validation.title" as const,
      description:
        "app.api.system.generators.route-handlers.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.generators.route-handlers.post.errors.server.title" as const,
      description:
        "app.api.system.generators.route-handlers.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.generators.route-handlers.post.errors.server.title" as const,
      description:
        "app.api.system.generators.route-handlers.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.generators.route-handlers.post.errors.server.title" as const,
      description:
        "app.api.system.generators.route-handlers.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.generators.route-handlers.post.errors.server.title" as const,
      description:
        "app.api.system.generators.route-handlers.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.generators.route-handlers.post.errors.server.title" as const,
      description:
        "app.api.system.generators.route-handlers.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.generators.route-handlers.post.errors.server.title" as const,
      description:
        "app.api.system.generators.route-handlers.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.generators.route-handlers.post.errors.server.title" as const,
      description:
        "app.api.system.generators.route-handlers.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.generators.route-handlers.post.errors.server.title" as const,
      description:
        "app.api.system.generators.route-handlers.post.errors.server.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.system.generators.route-handlers.post.success.title" as const,
    description:
      "app.api.system.generators.route-handlers.post.success.description" as const,
  },
});

const routeHandlersDynamicGeneratorEndpoints = { POST };
export default routeHandlersDynamicGeneratorEndpoints;
