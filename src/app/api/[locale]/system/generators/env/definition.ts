/**
 * Env Generator API Definition
 * Defines endpoints for generating consolidated environment configuration
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
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { scopedTranslation } from "./i18n";

/**
 * POST endpoint definition - Generate env configuration
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "generators", "env"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.system",
  tags: ["tags.env"],
  icon: "settings",
  allowedRoles: [
    // use vibe generate instead
  ],
  aliases: ["generate:env"],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      outputDir: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.outputDir.label",
        description: "post.fields.outputDir.description",
        columns: 12,
        schema: z.string().default("src/app/api/[locale]/system/generated"),
      }),

      verbose: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.verbose.label",
        description: "post.fields.verbose.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      dryRun: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.success.label",
        schema: z.boolean(),
      }),
      message: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.message.label",
        schema: z.string(),
      }),
      serverEnvFiles: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.serverEnvFiles.label",
        schema: z.coerce.number(),
      }),
      clientEnvFiles: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.clientEnvFiles.label",
        schema: z.coerce.number(),
      }),
      duration: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.duration.label",
        schema: z.coerce.number(),
      }),
      outputPaths: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.outputPaths.label",
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
