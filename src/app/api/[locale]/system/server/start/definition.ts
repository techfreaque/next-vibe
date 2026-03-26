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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import { ServerFramework, ServerFrameworkOptions } from "../enum";
import { START_ALIASES } from "./constants";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "server", "start"],
  aliases: START_ALIASES,
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.systemDevTools",
  tags: ["tags.start"],
  icon: "zap",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      mode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.mode.title",
        description: "post.fields.mode.description",
        columns: 12,
        options: [
          { value: "all", label: "post.fields.mode.options.all" },
          { value: "web", label: "post.fields.mode.options.web" },
          { value: "tasks", label: "post.fields.mode.options.tasks" },
        ],
        schema: z.enum(["all", "web", "tasks"]).optional().default("all"),
      }),

      seed: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.seed.title",
        description: "post.fields.seed.description",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      dbSetup: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dbSetup.title",
        description: "post.fields.dbSetup.description",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      taskRunner: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.taskRunner.title",
        description: "post.fields.taskRunner.description",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      nextServer: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.nextServer.title",
        description: "post.fields.nextServer.description",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      port: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.port.title",
        description: "post.fields.port.description",
        columns: 12,
        schema: z.coerce.number().optional(),
      }),

      profile: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.profile.title",
        description: "post.fields.profile.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      framework: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.framework.title",
        description: "post.fields.framework.description",
        columns: 6,
        options: ServerFrameworkOptions,
        schema: z.enum(ServerFramework).default(ServerFramework.NEXT),
      }),

      // === RESPONSE FIELDS ===

      responseMessage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.output.title",
        schema: z.string() as z.ZodType<TranslationKey>,
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        mode: "all",
        seed: true,
        dbSetup: false,
        taskRunner: true,
        nextServer: true,
        profile: false,
        framework: ServerFramework.NEXT,
      },
      webOnly: {
        mode: "web",
        seed: true,
        dbSetup: false,
        taskRunner: true,
        nextServer: true,
        profile: false,
        framework: ServerFramework.NEXT,
      },
      tasksOnly: {
        mode: "tasks",
        seed: true,
        dbSetup: false,
        taskRunner: true,
        nextServer: true,
        profile: false,
        framework: ServerFramework.NEXT,
      },
      withPort: {
        mode: "all",
        seed: true,
        dbSetup: false,
        taskRunner: true,
        nextServer: true,
        port: 3000,
        profile: false,
        framework: ServerFramework.NEXT,
      },
      tanstackStart: {
        mode: "all",
        seed: true,
        dbSetup: false,
        taskRunner: true,
        nextServer: true,
        profile: false,
        framework: ServerFramework.TANSTACK,
      },
    },
    responses: {
      default: {
        responseMessage: "post.fields.output.title",
      },
      webOnly: {
        responseMessage: "post.fields.output.title",
      },
      tasksOnly: {
        responseMessage: "post.fields.output.title",
      },
      withPort: {
        responseMessage: "post.fields.output.title",
      },
      tanstackStart: {
        responseMessage: "post.fields.output.title",
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
