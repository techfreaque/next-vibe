/**
 * Generate All Command Endpoint Definition
 * Production-ready endpoint for running all code generators
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

import { UserRole } from "../../../user/user-roles/enum";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "generators", "generate-all"],
  title: "post.title",
  description: "post.description",
  category: "category",
  tags: ["post.title"],
  icon: "sparkles",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["generate-all", "gen", "generate"],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title",
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      rootDir: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.rootDir.label",
        description: "post.fields.rootDir.description",
        columns: 6,
        schema: z.string().optional(),
      }),

      outputDir: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.outputDir.label",
        description: "post.fields.outputDir.description",
        columns: 6,
        schema: z
          .string()
          .optional()
          .default("src/app/api/[locale]/system/generated"),
      }),

      verbose: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.verbose.label",
        description: "post.fields.verbose.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      skipEndpoints: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipEndpoints.label",
        description: "post.fields.skipEndpoints.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      skipSeeds: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipSeeds.label",
        description: "post.fields.skipSeeds.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      skipTaskIndex: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipTaskIndex.label",
        description: "post.fields.skipTaskIndex.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      skipTrpc: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.skipTrpc.label",
        description: "post.fields.skipTrpc.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.success.title",
        schema: z.boolean(),
      }),

      generationCompleted: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.generationCompleted.title",
        schema: z.boolean(),
      }),

      output: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.output.title",
        schema: z.string(),
      }),

      generationStats: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.generationStats.title",
        schema: z.object({
          totalGenerators: z.coerce.number(),
          generatorsRun: z.coerce.number(),
          generatorsSkipped: z.coerce.number(),
          outputDirectory: z.string(),
          functionalGeneratorsCompleted: z.boolean(),
        }),
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
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
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
