/**
 * Env Generator API Definition
 * Defines endpoints for generating consolidated environment configuration
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

/**
 * POST endpoint definition - Generate env configuration
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "generators", "env"],
  title: "app.api.system.generators.env.post.title",
  description: "app.api.system.generators.env.post.description",
  category: "app.api.system.generators.category",
  tags: ["app.api.system.generators.env.tags.env"],
  icon: "settings",
  allowedRoles: [UserRole.ADMIN, UserRole.WEB_OFF, UserRole.AI_TOOL_OFF],
  aliases: ["generate:env"],

  fields: objectField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "app.api.system.generators.env.post.form.title",
      columns: 12,
    },
    { request: "data", response: true },
    {
      outputDir: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.system.generators.env.post.fields.outputDir.label",
          description:
            "app.api.system.generators.env.post.fields.outputDir.description",
          columns: 12,
        },
        z.string().default("src/app/api/[locale]/system/generated"),
      ),

      verbose: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.generators.env.post.fields.verbose.label",
          description:
            "app.api.system.generators.env.post.fields.verbose.description",
          columns: 6,
        },
        z.boolean().default(false),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.generators.env.post.fields.dryRun.label",
          description:
            "app.api.system.generators.env.post.fields.dryRun.description",
          columns: 6,
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.generators.env.post.fields.success.label",
        },
        z.boolean(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.generators.env.post.fields.message.label",
        },
        z.string(),
      ),
      serverEnvFiles: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.generators.env.post.fields.serverEnvFiles.label",
        },
        z.coerce.number(),
      ),
      clientEnvFiles: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.generators.env.post.fields.clientEnvFiles.label",
        },
        z.coerce.number(),
      ),
      duration: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.generators.env.post.fields.duration.label",
        },
        z.coerce.number(),
      ),
      outputPaths: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.generators.env.post.fields.outputPaths.label",
        },
        z.object({
          server: z.string().optional(),
          client: z.string().optional(),
        }),
      ),
    },
  ),

  examples: {
    requests: {
      default: {
        outputDir: "src/app/api/[locale]/system/generated",
        verbose: false,
        dryRun: false,
      },
    },
    responses: {
      default: {
        success: true,
        message: "Generated env index with 5 server and 3 client modules",
        serverEnvFiles: 5,
        clientEnvFiles: 3,
        duration: 150,
        outputPaths: {
          server: "src/app/api/[locale]/system/generated/env.ts",
          client: "src/app/api/[locale]/system/generated/env-client.ts",
        },
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.generators.env.post.errors.validation.title",
      description:
        "app.api.system.generators.env.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.generators.env.post.errors.unauthorized.title",
      description:
        "app.api.system.generators.env.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.generators.env.post.errors.forbidden.title",
      description:
        "app.api.system.generators.env.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.generators.env.post.errors.notFound.title",
      description:
        "app.api.system.generators.env.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.generators.env.post.errors.server.title",
      description:
        "app.api.system.generators.env.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.generators.env.post.errors.unknown.title",
      description:
        "app.api.system.generators.env.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.generators.env.post.errors.unsavedChanges.title",
      description:
        "app.api.system.generators.env.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.generators.env.post.errors.conflict.title",
      description:
        "app.api.system.generators.env.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.generators.env.post.errors.network.title",
      description:
        "app.api.system.generators.env.post.errors.network.description",
    },
  },
  successTypes: {
    title: "app.api.system.generators.env.post.success.title",
    description: "app.api.system.generators.env.post.success.description",
  },
});

// Export types for repository usage
export type EnvGeneratorRequestInput = typeof POST.types.RequestInput;
export type EnvGeneratorRequestOutput = typeof POST.types.RequestOutput;
export type EnvGeneratorResponseInput = typeof POST.types.ResponseInput;
export type EnvGeneratorResponseOutput = typeof POST.types.ResponseOutput;

const envGeneratorEndpoints = { POST };
export default envGeneratorEndpoints;
