/**
 * Server Dev API Definition
 * Defines endpoints for development server management
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
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

import { scopedTranslation } from "./i18n";

/**
 * POST endpoint definition - Start development server
 * Starts the development server with all necessary services
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "server", "dev"],
  aliases: ["dev", "d"],
  title: "post.title",
  description: "post.description",
  category: "category",
  tags: ["category"],
  icon: "code",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      skipDbSetup: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipDbSetup.title",
        description: "post.fields.skipDbSetup.description",
        schema: z.boolean().default(false),
      }),

      skipNextCommand: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipNextCommand.title",
        description: "post.fields.skipNextCommand.description",
        schema: z.boolean().default(false),
      }),

      dbReset: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipDbReset.title",
        description: "post.fields.skipDbReset.description",
        schema: z.boolean().default(false),
      }),
      // shortcut for dbReset
      r: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipDbReset.title",
        description: "post.fields.skipDbReset.description",
        schema: z.boolean().default(false),
      }),

      port: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.port.title",
        description: "post.fields.port.description",
        schema: z.coerce.number().optional(),
      }),

      skipGeneratorWatcher: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipGeneratorWatcher.title",
        description: "post.fields.skipGeneratorWatcher.description",
        schema: z.boolean().default(false),
      }),

      generatorWatcherInterval: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.generatorWatcherInterval.title",
        description: "post.fields.generatorWatcherInterval.description",
        schema: z.coerce.number().default(5000),
      }),

      skipTaskRunner: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipTaskRunner.title",
        description: "post.fields.skipTaskRunner.description",
        schema: z.boolean().default(false),
      }),

      skipMigrations: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipMigrations.title",
        description: "post.fields.skipMigrations.description",
        schema: z.boolean().default(false),
      }),

      skipMigrationGeneration: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipMigrationGeneration.title",
        description: "post.fields.skipMigrationGeneration.description",
        schema: z.boolean().default(false),
      }),

      skipSeeding: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipSeeding.title",
        description: "post.fields.skipSeeding.description",
        schema: z.boolean().default(false),
      }),

      output: scopedResponseField(scopedTranslation, {
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
