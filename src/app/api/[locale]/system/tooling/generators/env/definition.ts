/**
 * Env Generator API Definition
 * Defines endpoints for generating consolidated environment configuration
 */

import { translatedValueSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { scopedTranslation } from "next-vibe/tooling/generators/env/i18n";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

/**
 * POST endpoint definition - Generate env configuration
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "tooling", "generators", "env"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "devTools",
  subCategory: "Generators",
  tags: ["tags.env"],
  icon: "settings",
  allowedRoles: [
    // use vibe generate instead
  ],
  aliases: ["generate:env"],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      outputDir: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.outputDir.label",
        description: "post.fields.outputDir.description",
        columns: 12,
        schema: z.string().default("src/generated"),
      }),

      verbose: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.verbose.label",
        description: "post.fields.verbose.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.success.label",
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.message.label",
        schema: translatedValueSchema,
      }),
      serverEnvFiles: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.serverEnvFiles.label",
        schema: z.coerce.number(),
      }),
      clientEnvFiles: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.clientEnvFiles.label",
        schema: z.coerce.number(),
      }),
      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.duration.label",
        schema: z.coerce.number(),
      }),
      outputPaths: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.outputPaths.label",
        schema: z.object({
          server: z.string().optional(),
          client: z.string().optional(),
        }),
      }),
    },
  }),

  examples: {
    requests: {
      default: {
        outputDir: "src/generated",
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
          server: "src/generated/env.ts",
          client: "src/generated/env-client.ts",
        },
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
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
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
  },
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
});

// Export types for repository usage
export type EnvGeneratorRequestInput = typeof POST.types.RequestInput;
export type EnvGeneratorRequestOutput = typeof POST.types.RequestOutput;
export type EnvGeneratorResponseInput = typeof POST.types.ResponseInput;
export type EnvGeneratorResponseOutput = typeof POST.types.ResponseOutput;

const envGeneratorEndpoints = { POST };
export default envGeneratorEndpoints;
