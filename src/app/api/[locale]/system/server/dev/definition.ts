/**
 * Server Dev API Definition
 * Defines endpoints for development server management
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

/**
 * POST endpoint definition - Start development server
 * Starts the development server with all necessary services
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "server", "dev"],
  aliases: ["dev", "d"],
  title: "app.api.system.server.dev.post.title",
  description: "app.api.system.server.dev.post.description",
  category: "app.api.system.category",
  tags: ["app.api.system.server.enum.mode.development"],
  icon: "code",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.server.dev.post.form.title",
      description: "app.api.system.server.dev.post.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      skipDbSetup: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.dev.post.fields.skipDbSetup.title",
        description:
          "app.api.system.server.dev.post.fields.skipDbSetup.description",
        schema: z.boolean().default(false),
      }),

      skipNextCommand: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.dev.post.fields.skipNextCommand.title",
        description:
          "app.api.system.server.dev.post.fields.skipNextCommand.description",
        schema: z.boolean().default(false),
      }),

      dbReset: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.dev.post.fields.skipDbReset.title",
        description:
          "app.api.system.server.dev.post.fields.skipDbReset.description",
        schema: z.boolean().default(false),
      }),
      // shortcut for dbReset
      r: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.dev.post.fields.skipDbReset.title",
        description:
          "app.api.system.server.dev.post.fields.skipDbReset.description",
        schema: z.boolean().default(false),
      }),

      port: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.system.server.dev.post.fields.port.title",
        description: "app.api.system.server.dev.post.fields.port.description",
        schema: z.coerce.number().optional(),
      }),

      skipGeneratorWatcher: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.server.dev.post.fields.skipGeneratorWatcher.title",
        description:
          "app.api.system.server.dev.post.fields.skipGeneratorWatcher.description",
        schema: z.boolean().default(false),
      }),

      generatorWatcherInterval: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.system.server.dev.post.fields.generatorWatcherInterval.title",
        description:
          "app.api.system.server.dev.post.fields.generatorWatcherInterval.description",
        schema: z.coerce.number().default(5000),
      }),

      skipTaskRunner: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.dev.post.fields.skipTaskRunner.title",
        description:
          "app.api.system.server.dev.post.fields.skipTaskRunner.description",
        schema: z.boolean().default(false),
      }),

      skipMigrations: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.dev.post.fields.skipMigrations.title",
        description:
          "app.api.system.server.dev.post.fields.skipMigrations.description",
        schema: z.boolean().default(false),
      }),

      skipMigrationGeneration: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.server.dev.post.fields.skipMigrationGeneration.title",
        description:
          "app.api.system.server.dev.post.fields.skipMigrationGeneration.description",
        schema: z.boolean().default(false),
      }),

      skipSeeding: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.dev.post.fields.skipSeeding.title",
        description:
          "app.api.system.server.dev.post.fields.skipSeeding.description",
        schema: z.boolean().default(false),
      }),

      output: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.server.dev.post.fields.output.title",
        schema: z.string() as z.ZodType<TranslationKey>,
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.server.dev.post.errors.validation.title",
      description:
        "app.api.system.server.dev.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.server.dev.post.errors.network.title",
      description: "app.api.system.server.dev.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.server.dev.post.errors.unauthorized.title",
      description:
        "app.api.system.server.dev.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.server.dev.post.errors.forbidden.title",
      description:
        "app.api.system.server.dev.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.server.dev.post.errors.server.title",
      description: "app.api.system.server.dev.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.server.dev.post.errors.notFound.title",
      description: "app.api.system.server.dev.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.server.dev.post.errors.unknown.title",
      description: "app.api.system.server.dev.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.server.dev.post.errors.unknown.title",
      description: "app.api.system.server.dev.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.server.dev.post.errors.conflict.title",
      description: "app.api.system.server.dev.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.server.dev.post.success.title",
    description: "app.api.system.server.dev.post.success.description",
  },

  examples: {
    requests: {
      default: {
        skipDbSetup: false,
        skipNextCommand: false,
        dbReset: false,
        r: false,
        skipGeneratorWatcher: false,
        generatorWatcherInterval: 5000,
        skipTaskRunner: false,
        skipMigrations: false,
        skipMigrationGeneration: false,
        skipSeeding: false,
      },
      quickStart: {
        skipDbSetup: true,
        skipNextCommand: false,
        dbReset: true,
        r: true,
        skipGeneratorWatcher: true,
        generatorWatcherInterval: 5000,
        skipTaskRunner: false,
        skipMigrations: false,
        skipMigrationGeneration: false,
        skipSeeding: false,
      },
    },
    responses: {
      default: {
        output: "app.api.system.server.dev.post.fields.output.title",
      },
      quickStart: {
        output: "app.api.system.server.dev.post.fields.output.title",
      },
    },
  },
});

export type DevRequestInput = typeof POST.types.RequestInput;
export type DevRequestOutput = typeof POST.types.RequestOutput;
export type DevResponseInput = typeof POST.types.ResponseInput;
export type DevResponseOutput = typeof POST.types.ResponseOutput;

const devServerEndpoints = { POST };
export default devServerEndpoints;
