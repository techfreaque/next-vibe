/**
 * Run tests Endpoint Definition
 * Production-ready endpoint for run tests
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

import { UserRole } from "../../../../user/user-roles/enum";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "check", "test"],
  title: "title",
  description: "description",
  category: "app.endpointCategories.systemDevTools",
  tags: ["tag"],
  icon: "test-tube",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.PRODUCTION_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["test", "t"],

  cli: {
    firstCliArgKey: "path",
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "container.title",
    description: "container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      path: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.path.label",
        description: "fields.path.description",
        placeholder: "fields.path.placeholder",
        columns: 6,
        schema: z.string().optional().default("src/"),
      }),

      verbose: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.verbose.label",
        description: "fields.verbose.description",
        columns: 3,
        schema: z.boolean().default(false),
      }),

      watch: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.watch.label",
        description: "fields.watch.description",
        columns: 3,
        schema: z.boolean().default(false),
      }),

      coverage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.coverage.label",
        description: "fields.coverage.description",
        columns: 3,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.success",
        schema: z.boolean(),
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.output",
        schema: z.string(),
      }),

      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.duration",
        schema: z.coerce.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsaved.title",
      description: "errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
  },

  successTypes: {
    title: "success.title",
    description: "success.description",
  },

  examples: {
    requests: {
      default: {
        verbose: false,
        watch: false,
      },
      verbose: {
        verbose: true,
        watch: false,
      },
      watch: {
        path: "src/app/api/[locale]/system/check",
        verbose: true,
        watch: true,
      },
    },
    responses: {
      default: {
        success: true,
        output: "Tests completed successfully",
        duration: 1500,
      },
      verbose: {
        success: true,
        output: "Tests completed with detailed output",
        duration: 2000,
      },
      watch: {
        success: true,
        output: "Tests running in watch mode",
        duration: 500,
      },
    },
  },
});

// Export types following migration guide pattern
export type TestRequestInput = typeof POST.types.RequestInput;
export type TestRequestOutput = typeof POST.types.RequestOutput;
export type TestResponseInput = typeof POST.types.ResponseInput;
export type TestResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
