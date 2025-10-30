/**
 * Run tests Endpoint Definition
 * Production-ready endpoint for run tests
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

import { UserRole } from "../../../../user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "check", "test"],
  title: "app.api.v1.core.system.check.testing.test.title",
  description: "app.api.v1.core.system.check.testing.test.description",
  category: "app.api.v1.core.system.check.testing.test.category",
  tags: ["app.api.v1.core.system.check.testing.test.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["test", "t"],

  cli: {
    firstCliArgKey: "path",
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.check.testing.test.container.title",
      description:
        "app.api.v1.core.system.check.testing.test.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      path: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.system.check.testing.test.fields.path.label",
          description:
            "app.api.v1.core.system.check.testing.test.fields.path.description",
          placeholder:
            "app.api.v1.core.system.check.testing.test.fields.path.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional().default("src/"),
      ),

      verbose: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.check.testing.test.fields.verbose.label",
          description:
            "app.api.v1.core.system.check.testing.test.fields.verbose.description",
          layout: { columns: 3 },
        },
        z.boolean().default(false),
      ),

      watch: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.check.testing.test.fields.watch.label",
          description:
            "app.api.v1.core.system.check.testing.test.fields.watch.description",
          layout: { columns: 3 },
        },
        z.boolean().default(false),
      ),

      coverage: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.check.testing.test.fields.coverage.label",
          description:
            "app.api.v1.core.system.check.testing.test.fields.coverage.description",
          layout: { columns: 3 },
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.check.testing.test.response.success",
        },
        z.boolean(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.check.testing.test.response.output",
        },
        z.string(),
      ),

      duration: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.check.testing.test.response.duration",
        },
        z.number(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.check.testing.test.errors.validation.title",
      description:
        "app.api.v1.core.system.check.testing.test.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.check.testing.test.errors.internal.title",
      description:
        "app.api.v1.core.system.check.testing.test.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.check.testing.test.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.check.testing.test.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.system.check.testing.test.errors.forbidden.title",
      description:
        "app.api.v1.core.system.check.testing.test.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.system.check.testing.test.errors.notFound.title",
      description:
        "app.api.v1.core.system.check.testing.test.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.check.testing.test.errors.server.title",
      description:
        "app.api.v1.core.system.check.testing.test.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.check.testing.test.errors.unknown.title",
      description:
        "app.api.v1.core.system.check.testing.test.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.check.testing.test.errors.unsaved.title",
      description:
        "app.api.v1.core.system.check.testing.test.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.system.check.testing.test.errors.conflict.title",
      description:
        "app.api.v1.core.system.check.testing.test.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.system.check.testing.test.success.title",
    description:
      "app.api.v1.core.system.check.testing.test.success.description",
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
        path: "src/app/api/[locale]/v1/core/system/check",
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
