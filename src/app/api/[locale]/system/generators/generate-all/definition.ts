/**
 * Generate All Command Endpoint Definition
 * Production-ready endpoint for running all code generators
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
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "generators", "generate-all"],
  title: "app.api.system.generators.generateAll.post.title",
  description: "app.api.system.generators.generateAll.post.description",
  category: "app.api.system.generators.category",
  tags: ["app.api.system.generators.generateAll.post.title"],
  icon: "sparkles",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["generate-all", "gen", "generate"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.generators.generateAll.post.container.title",
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      rootDir: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.generators.generateAll.post.fields.rootDir.label",
        description:
          "app.api.system.generators.generateAll.post.fields.rootDir.description",
        columns: 6,
        schema: z.string().optional(),
      }),

      outputDir: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.generators.generateAll.post.fields.outputDir.label",
        description:
          "app.api.system.generators.generateAll.post.fields.outputDir.description",
        columns: 6,
        schema: z
          .string()
          .optional()
          .default("src/app/api/[locale]/system/generated"),
      }),

      verbose: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.generators.generateAll.post.fields.verbose.label",
        description:
          "app.api.system.generators.generateAll.post.fields.verbose.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      skipEndpoints: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.generators.generateAll.post.fields.skipEndpoints.label",
        description:
          "app.api.system.generators.generateAll.post.fields.skipEndpoints.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      skipSeeds: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.generators.generateAll.post.fields.skipSeeds.label",
        description:
          "app.api.system.generators.generateAll.post.fields.skipSeeds.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      skipTaskIndex: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.generators.generateAll.post.fields.skipTaskIndex.label",
        description:
          "app.api.system.generators.generateAll.post.fields.skipTaskIndex.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      skipTrpc: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.generators.generateAll.post.fields.skipTrpc.label",
        description:
          "app.api.system.generators.generateAll.post.fields.skipTrpc.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.generateAll.post.fields.success.title",
        schema: z.boolean(),
      }),

      generationCompleted: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.generateAll.post.fields.generationCompleted.title",
        schema: z.boolean(),
      }),

      output: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.generateAll.post.fields.output.title",
        schema: z.string(),
      }),

      generationStats: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.generateAll.post.fields.generationStats.title",
        schema: z.object({
          totalGenerators: z.coerce.number(),
          generatorsRun: z.coerce.number(),
          generatorsSkipped: z.coerce.number(),
          outputDirectory: z.string(),
          functionalGeneratorsCompleted: z.boolean(),
        }),
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.generators.generateAll.post.errors.validation.title",
      description:
        "app.api.system.generators.generateAll.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.generators.generateAll.post.errors.network.title",
      description:
        "app.api.system.generators.generateAll.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.generators.generateAll.post.errors.unauthorized.title",
      description:
        "app.api.system.generators.generateAll.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.generators.generateAll.post.errors.forbidden.title",
      description:
        "app.api.system.generators.generateAll.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.generators.generateAll.post.errors.notFound.title",
      description:
        "app.api.system.generators.generateAll.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.generators.generateAll.post.errors.internal.title",
      description:
        "app.api.system.generators.generateAll.post.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.generators.generateAll.post.errors.unknown.title",
      description:
        "app.api.system.generators.generateAll.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.generators.generateAll.post.errors.internal.title",
      description:
        "app.api.system.generators.generateAll.post.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.generators.generateAll.post.errors.conflict.title",
      description:
        "app.api.system.generators.generateAll.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.generators.generateAll.post.success.title",
    description:
      "app.api.system.generators.generateAll.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        outputDir: "src/app/api/[locale]/system/generated",
        verbose: false,
        skipEndpoints: false,
        skipSeeds: false,
        skipTrpc: false,
      },
      success: {
        outputDir: "src/app/api/[locale]/system/generated",
        verbose: false,
        skipEndpoints: false,
        skipSeeds: false,
        skipTrpc: false,
      },
      verbose: {
        outputDir: "src/app/api/[locale]/system/generated",
        verbose: true,
        skipEndpoints: false,
        skipSeeds: false,
        skipTrpc: false,
      },
      skipSome: {
        outputDir: "src/app/api/[locale]/system/generated",
        verbose: false,
        skipEndpoints: true,
        skipSeeds: false,
        skipTrpc: false,
      },
      withSkips: {
        outputDir: "src/app/api/[locale]/system/generated",
        verbose: true,
        skipEndpoints: true,
        skipSeeds: true,
        skipTrpc: true,
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
  },
});

const generateAllEndpoints = { POST };
export default generateAllEndpoints;
