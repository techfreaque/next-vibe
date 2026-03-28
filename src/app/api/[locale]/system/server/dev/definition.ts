/**
 * Server Dev API Definition
 * Defines endpoints for development server management
 */

import { z } from "zod";

import { translatedValueSchema } from "@/app/api/[locale]/shared/types/common.schema";
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

import { ServerFramework, ServerFrameworkOptions } from "../enum";
import { DEV_ALIASES } from "./constants";
import { scopedTranslation } from "./i18n";

/**
 * POST endpoint definition - Start development server
 * Starts the development server with all necessary services
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "server", "dev"],
  aliases: DEV_ALIASES,
  title: "post.title",
  description: "post.description",
  category: "endpointCategories.systemDevTools",
  tags: ["category"],
  icon: "code",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
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
      skipDbSetup: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipDbSetup.title",
        description: "post.fields.skipDbSetup.description",
        schema: z.boolean().default(false),
      }),

      skipNextCommand: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipNextCommand.title",
        description: "post.fields.skipNextCommand.description",
        schema: z.boolean().default(false),
      }),

      dbReset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipDbReset.title",
        description: "post.fields.skipDbReset.description",
        schema: z.boolean().default(false),
      }),
      // shortcut for dbReset
      r: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipDbReset.title",
        description: "post.fields.skipDbReset.description",
        schema: z.boolean().default(false),
      }),

      port: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.port.title",
        description: "post.fields.port.description",
        schema: z.coerce.number().optional(),
      }),

      skipGeneratorWatcher: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipGeneratorWatcher.title",
        description: "post.fields.skipGeneratorWatcher.description",
        schema: z.boolean().default(false),
      }),

      generatorWatcherInterval: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.generatorWatcherInterval.title",
        description: "post.fields.generatorWatcherInterval.description",
        schema: z.coerce.number().default(5000),
      }),

      skipTaskRunner: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipTaskRunner.title",
        description: "post.fields.skipTaskRunner.description",
        schema: z.boolean().default(false),
      }),

      skipMigrations: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipMigrations.title",
        description: "post.fields.skipMigrations.description",
        schema: z.boolean().default(false),
      }),

      skipMigrationGeneration: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipMigrationGeneration.title",
        description: "post.fields.skipMigrationGeneration.description",
        schema: z.boolean().default(false),
      }),

      skipSeeding: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipSeeding.title",
        description: "post.fields.skipSeeding.description",
        schema: z.boolean().default(false),
      }),

      profile: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.profile.title",
        description: "post.fields.profile.description",
        schema: z.boolean().default(false),
      }),

      framework: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.framework.title",
        description: "post.fields.framework.description",
        options: ServerFrameworkOptions,
        schema: z.enum(ServerFramework).default(ServerFramework.TANSTACK),
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.output.title",
        schema: translatedValueSchema,
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
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
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
        profile: false,
        framework: ServerFramework.TANSTACK,
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
        profile: false,
        framework: ServerFramework.TANSTACK,
      },
    },
    responses: {
      default: {
        output: "post.fields.output.title",
      },
      quickStart: {
        output: "post.fields.output.title",
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
