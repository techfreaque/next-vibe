/**
 * Server Dev API Definition
 * Defines endpoints for development server management
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

/**
 * POST endpoint definition - Start development server
 * Starts the development server with all necessary services
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "server", "dev"],
  aliases: ["dev", "server:dev"],
  title: "app.api.v1.core.system.server.dev.post.title",
  description: "app.api.v1.core.system.server.dev.post.description",
  category: "app.api.v1.core.system.server.category",
  tags: ["app.api.v1.core.system.server.enum.mode.development"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.server.dev.post.form.title",
      description: "app.api.v1.core.system.server.dev.post.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      skipDbSetup: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.server.dev.post.fields.skipDbSetup.title",
          description:
            "app.api.v1.core.system.server.dev.post.fields.skipDbSetup.description",
        },
        z.boolean().default(false),
      ),

      skipNextCommand: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.server.dev.post.fields.skipNextCommand.title",
          description:
            "app.api.v1.core.system.server.dev.post.fields.skipNextCommand.description",
        },
        z.boolean().default(false),
      ),

      skipDbReset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.server.dev.post.fields.skipDbReset.title",
          description:
            "app.api.v1.core.system.server.dev.post.fields.skipDbReset.description",
        },
        z.boolean().default(false),
      ),

      fastDbReset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.server.dev.post.fields.fastDbReset.title",
          description:
            "app.api.v1.core.system.server.dev.post.fields.fastDbReset.description",
        },
        z.boolean().default(false),
      ),

      skipHardReset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.server.dev.post.fields.skipHardReset.title",
          description:
            "app.api.v1.core.system.server.dev.post.fields.skipHardReset.description",
        },
        z.boolean().default(false),
      ),

      force: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.server.dev.post.fields.force.title",
          description:
            "app.api.v1.core.system.server.dev.post.fields.force.description",
        },
        z.boolean().default(false),
      ),

      port: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.system.server.dev.post.fields.port.title",
          description:
            "app.api.v1.core.system.server.dev.post.fields.port.description",
        },
        z.union([z.number(), z.string()]).default(3000),
      ),

      skipGeneratorWatcher: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.server.dev.post.fields.skipGeneratorWatcher.title",
          description:
            "app.api.v1.core.system.server.dev.post.fields.skipGeneratorWatcher.description",
        },
        z.boolean().default(false),
      ),

      generatorWatcherInterval: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.server.dev.post.fields.generatorWatcherInterval.title",
          description:
            "app.api.v1.core.system.server.dev.post.fields.generatorWatcherInterval.description",
        },
        z.number().default(5000),
      ),

      skipTaskRunner: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.server.dev.post.fields.skipTaskRunner.title",
          description:
            "app.api.v1.core.system.server.dev.post.fields.skipTaskRunner.description",
        },
        z.boolean().default(false),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.server.dev.post.fields.output.title",
        },
        z.string() as z.ZodType<TranslationKey>,
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.system.server.dev.post.errors.validation.title",
      description:
        "app.api.v1.core.system.server.dev.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.server.dev.post.errors.network.title",
      description:
        "app.api.v1.core.system.server.dev.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.system.server.dev.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.server.dev.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.system.server.dev.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.server.dev.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.server.dev.post.errors.server.title",
      description:
        "app.api.v1.core.system.server.dev.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.system.server.dev.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.server.dev.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.server.dev.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.server.dev.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.server.dev.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.server.dev.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.system.server.dev.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.server.dev.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.server.dev.post.success.title",
    description: "app.api.v1.core.system.server.dev.post.success.description",
  },

  examples: {
    requests: {
      default: {
        skipDbSetup: false,
        skipNextCommand: false,
        skipDbReset: false,
        fastDbReset: false,
        skipHardReset: false,
        force: false,
        port: 3000,
        skipGeneratorWatcher: false,
        generatorWatcherInterval: 5000,
        skipTaskRunner: false,
      },
      quickStart: {
        skipDbSetup: true,
        skipNextCommand: false,
        skipDbReset: true,
        fastDbReset: false,
        skipHardReset: true,
        force: false,
        port: 3000,
        skipGeneratorWatcher: true,
        generatorWatcherInterval: 5000,
        skipTaskRunner: false,
      },
    },
    responses: {
      default: {
        output: "app.api.v1.core.system.server.dev.post.fields.output.title",
      },
      quickStart: {
        output: "app.api.v1.core.system.server.dev.post.fields.output.title",
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
