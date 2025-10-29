/**
 * Generate All Command Endpoint Definition
 * Production-ready endpoint for running all code generators
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
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "generators", "generate-all"],
  title: "app.api.v1.core.system.generators.generateAll.post.title",
  description: "app.api.v1.core.system.generators.generateAll.post.description",
  category: "app.api.v1.core.system.generators.category",
  tags: ["app.api.v1.core.system.generators.generateAll.post.title"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["generate-all", "ga"],

  fields: objectField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label:
        "app.api.v1.core.system.generators.generateAll.post.container.title",
      layout: { columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      rootDir: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.generators.generateAll.post.fields.rootDir.label",
          description:
            "app.api.v1.core.system.generators.generateAll.post.fields.rootDir.description",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      outputDir: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.generators.generateAll.post.fields.outputDir.label",
          description:
            "app.api.v1.core.system.generators.generateAll.post.fields.outputDir.description",
          layout: { columns: 6 },
        },
        z
          .string()
          .optional()
          .default("src/app/api/[locale]/v1/core/system/generated"),
      ),

      verbose: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.generators.generateAll.post.fields.verbose.label",
          description:
            "app.api.v1.core.system.generators.generateAll.post.fields.verbose.description",
          layout: { columns: 4 },
        },
        z.boolean().optional().default(false),
      ),

      skipEndpoints: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.generators.generateAll.post.fields.skipEndpoints.label",
          description:
            "app.api.v1.core.system.generators.generateAll.post.fields.skipEndpoints.description",
          layout: { columns: 4 },
        },
        z.boolean().optional().default(false),
      ),

      skipSeeds: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.generators.generateAll.post.fields.skipSeeds.label",
          description:
            "app.api.v1.core.system.generators.generateAll.post.fields.skipSeeds.description",
          layout: { columns: 4 },
        },
        z.boolean().optional().default(false),
      ),

      skipTaskIndex: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.generators.generateAll.post.fields.skipTaskIndex.label",
          description:
            "app.api.v1.core.system.generators.generateAll.post.fields.skipTaskIndex.description",
          layout: { columns: 4 },
        },
        z.boolean().optional().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.generateAll.post.fields.success.title",
        },
        z.boolean(),
      ),

      generationCompleted: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.generateAll.post.fields.generationCompleted.title",
        },
        z.boolean(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.generateAll.post.fields.output.title",
        },
        z.string(),
      ),

      generationStats: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.generators.generateAll.post.fields.generationStats.title",
        },
        z.object({
          totalGenerators: z.number(),
          generatorsRun: z.number(),
          generatorsSkipped: z.number(),
          outputDirectory: z.string(),
          functionalGeneratorsCompleted: z.boolean(),
        }),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.generators.generateAll.post.errors.validation.title",
      description:
        "app.api.v1.core.system.generators.generateAll.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.generators.generateAll.post.errors.network.title",
      description:
        "app.api.v1.core.system.generators.generateAll.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.generators.generateAll.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.generators.generateAll.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.generators.generateAll.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.generators.generateAll.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.generators.generateAll.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.generators.generateAll.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.generators.generateAll.post.errors.internal.title",
      description:
        "app.api.v1.core.system.generators.generateAll.post.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.generators.generateAll.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.generators.generateAll.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.generators.generateAll.post.errors.internal.title",
      description:
        "app.api.v1.core.system.generators.generateAll.post.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.generators.generateAll.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.generators.generateAll.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.generators.generateAll.post.success.title",
    description:
      "app.api.v1.core.system.generators.generateAll.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        outputDir: "src/app/api/[locale]/v1/core/system/generated",
        verbose: false,
        skipEndpoints: false,
        skipSeeds: false,
      },
      success: {
        outputDir: "src/app/api/[locale]/v1/core/system/generated",
        verbose: false,
        skipEndpoints: false,
        skipSeeds: false,
      },
      verbose: {
        outputDir: "src/app/api/[locale]/v1/core/system/generated",
        verbose: true,
        skipEndpoints: false,
        skipSeeds: false,
      },
      skipSome: {
        outputDir: "src/app/api/[locale]/v1/core/system/generated",
        verbose: false,
        skipEndpoints: true,
        skipSeeds: false,
      },
      withSkips: {
        outputDir: "src/app/api/[locale]/v1/core/system/generated",
        verbose: true,
        skipEndpoints: true,
        skipSeeds: true,
      },
    },
    responses: {
      default: {
        success: true,
        generationCompleted: true,
        output: "✅ Generation completed successfully",
        generationStats: {
          totalGenerators: 2,
          generatorsRun: 2,
          generatorsSkipped: 0,
          outputDirectory: "reports",
          functionalGeneratorsCompleted: true,
        },
      },
      success: {
        success: true,
        generationCompleted: true,
        output:
          "🚀 Generating some vibe...\nStep 1: Running functional generators...\n✅ Vibe generation completed successfully!",
        generationStats: {
          totalGenerators: 2,
          generatorsRun: 2,
          generatorsSkipped: 0,
          outputDirectory: "reports",
          functionalGeneratorsCompleted: true,
        },
      },
      verbose: {
        success: true,
        generationCompleted: true,
        output:
          "🚀 Generating some vibe (verbose mode)...\nStep 1: Running functional generators...\n✅ Vibe generation completed successfully!",
        generationStats: {
          totalGenerators: 2,
          generatorsRun: 2,
          generatorsSkipped: 0,
          outputDirectory: "reports",
          functionalGeneratorsCompleted: true,
        },
      },
      skipSome: {
        success: true,
        generationCompleted: true,
        output:
          "🚀 Generating some vibe (with skips)...\nStep 1: Running functional generators...\n✅ Vibe generation completed successfully!",
        generationStats: {
          totalGenerators: 2,
          generatorsRun: 1,
          generatorsSkipped: 1,
          outputDirectory: "custom-reports",
          functionalGeneratorsCompleted: true,
        },
      },
      withSkips: {
        success: true,
        generationCompleted: true,
        output:
          "🚀 Generating some vibe...\nStep 1: Running functional generators (some skipped)...\n✅ Vibe generation completed successfully!",
        generationStats: {
          totalGenerators: 2,
          generatorsRun: 1,
          generatorsSkipped: 1,
          outputDirectory: "custom-reports",
          functionalGeneratorsCompleted: true,
        },
      },
    },
    urlPathParams: undefined,
  },
});

const generateAllEndpoints = { POST };
export default generateAllEndpoints;
