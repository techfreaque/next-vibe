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
  category: "app.api.system.category",
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
      seed: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.start.post.fields.seed.title",
        description: "app.api.system.server.start.post.fields.seed.description",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      dbSetup: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.start.post.fields.dbSetup.title",
        description:
          "app.api.system.server.start.post.fields.dbSetup.description",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      taskRunner: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.start.post.fields.taskRunner.title",
        description:
          "app.api.system.server.start.post.fields.taskRunner.description",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      nextServer: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.start.post.fields.nextServer.title",
        description:
          "app.api.system.server.start.post.fields.nextServer.description",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      port: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.system.server.start.post.fields.port.title",
        description: "app.api.system.server.start.post.fields.port.description",
        columns: 12,
        schema: z.coerce.number().optional(),
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
        seed: true,
        dbSetup: true,
        taskRunner: true,
        nextServer: true,
      },
      withPort: {
        seed: true,
        dbSetup: true,
        taskRunner: true,
        nextServer: true,
        port: 3000,
      },
      noDb: {
        seed: false,
        dbSetup: false,
        taskRunner: true,
        nextServer: true,
      },
      nextOnly: {
        seed: false,
        dbSetup: false,
        taskRunner: false,
        nextServer: true,
      },
    },
    responses: {
      default: {
        responseMessage: "app.api.system.server.start.post.fields.output.title",
      },
      withPort: {
        responseMessage: "app.api.system.server.start.post.fields.output.title",
      },
      noDb: {
        responseMessage: "app.api.system.server.start.post.fields.output.title",
      },
      nextOnly: {
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
