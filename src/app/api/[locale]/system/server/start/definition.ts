/**
 * Server Start Command Endpoint Definition
 * Production-ready endpoint for starting the production server
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
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "server", "start"],
  aliases: ["start", "server:start"],
  title: "app.api.system.server.start.post.title",
  description: "app.api.system.server.start.post.description",
  category: "app.api.system.server.category",
  tags: ["app.api.system.server.start.tags.start"],
  icon: "zap",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.server.start.post.form.title",
      description: "app.api.system.server.start.post.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      skipPre: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.start.post.fields.skipPre.title",
        description:
          "app.api.system.server.start.post.fields.skipPre.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      skipNextCommand: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.start.post.fields.skipNextCommand.title",
        description:
          "app.api.system.server.start.post.fields.skipNextCommand.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      port: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.system.server.start.post.fields.port.title",
        description: "app.api.system.server.start.post.fields.port.description",
        columns: 12,
        schema: z.union([z.coerce.number(), z.string()]).optional(),
      }),

      skipTaskRunner: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.start.post.fields.skipTaskRunner.title",
        description:
          "app.api.system.server.start.post.fields.skipTaskRunner.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===

      responseMessage: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.server.start.post.fields.output.title",
        schema: z.string() as z.ZodType<TranslationKey>,
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.server.start.post.errors.validation.title",
      description:
        "app.api.system.server.start.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.server.start.post.errors.network.title",
      description:
        "app.api.system.server.start.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.server.start.post.errors.unauthorized.title",
      description:
        "app.api.system.server.start.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.server.start.post.errors.forbidden.title",
      description:
        "app.api.system.server.start.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.server.start.post.errors.notFound.title",
      description:
        "app.api.system.server.start.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.server.start.post.errors.server.title",
      description: "app.api.system.server.start.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.server.start.post.errors.unknown.title",
      description:
        "app.api.system.server.start.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.server.start.post.errors.unknown.title",
      description:
        "app.api.system.server.start.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.server.start.post.errors.conflict.title",
      description:
        "app.api.system.server.start.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.server.start.post.success.title",
    description: "app.api.system.server.start.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        skipPre: false,
        skipNextCommand: false,
      },
      withPort: {
        skipPre: false,
        skipNextCommand: false,
        port: 3000,
      },
      withMigrations: {
        skipPre: false,
        skipNextCommand: false,
        port: 3000,
      },
      skipPreTasks: {
        skipPre: true,
        skipNextCommand: false,
      },
      skipNext: {
        skipPre: false,
        skipNextCommand: true,
      },
      success: {
        skipPre: false,
        skipNextCommand: false,
        port: 3000,
      },
    },
    responses: {
      default: {
        responseMessage: "app.api.system.server.start.post.fields.output.title",
      },
      success: {
        responseMessage: "app.api.system.server.start.post.fields.output.title",
      },
      withPort: {
        responseMessage: "app.api.system.server.start.post.fields.output.title",
      },
      withMigrations: {
        responseMessage: "app.api.system.server.start.post.fields.output.title",
      },
      skipPreTasks: {
        responseMessage: "app.api.system.server.start.post.fields.output.title",
      },
      skipNext: {
        responseMessage: "app.api.system.server.start.post.fields.output.title",
      },
    },
  },
});

// Export types for use in repository
export type ServerStartRequestInput = typeof POST.types.RequestInput;
export type ServerStartRequestOutput = typeof POST.types.RequestOutput;
export type ServerStartResponseInput = typeof POST.types.ResponseInput;
export type ServerStartResponseOutput = typeof POST.types.ResponseOutput;

const startDefinition = { POST };
export default startDefinition;
