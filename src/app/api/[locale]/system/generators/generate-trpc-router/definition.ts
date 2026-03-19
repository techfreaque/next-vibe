/**
 * Generate tRPC Router Command Endpoint Definition
 * Production-ready endpoint for generating tRPC router from API routes
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

import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "side-tasks", "generators", "generate-trpc-router"],
  title: "title",
  description: "description",
  category: "app.endpointCategories.systemDevTools",
  tags: ["tag"],
  icon: "code",
  allowedRoles: [
    // use vibe generate instead
  ],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "container.title",
    description: "container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      apiDir: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.apiDir.title",
        description: "fields.apiDir.description",
        columns: 6,
        schema: z.string().optional().default("src/app/api"),
      }),

      outputFile: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.outputFile.title",
        description: "fields.outputFile.description",
        columns: 6,
        schema: z
          .string()
          .optional()
          .default(
            "src/app/api/[locale]/system/unified-interface/trpc/[...trpc]/router.ts",
          ),
      }),

      includeWarnings: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.includeWarnings.title",
        description: "fields.includeWarnings.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      excludePatterns: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.excludePatterns.title",
        description: "fields.excludePatterns.description",
        columns: 4,
        schema: z.array(z.string()).optional(),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.success.title",
        schema: z.boolean(),
      }),

      generationCompleted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.generationCompleted.title",
        schema: z.boolean(),
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.output.title",
        schema: z.string(),
      }),

      generationStats: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.generationStats.title",
        schema: z.object({
          totalRoutes: z.coerce.number(),
          validRoutes: z.coerce.number(),
          invalidRoutes: z.coerce.number(),
          routesWithWarnings: z.coerce.number(),
          routerGenerated: z.boolean(),
          executionTimeMs: z.coerce.number(),
        }),
      }),
    },
  }),

  // === ERROR HANDLING ===
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
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        apiDir: "src/app/api",
        outputFile: "src/app/api/[locale]/trpc/[...trpc]/router.ts",
        includeWarnings: false,
      },
      success: {
        apiDir: "src/app/api",
        outputFile: "src/app/api/[locale]/trpc/[...trpc]/router.ts",
        includeWarnings: false,
      },
      custom: {
        apiDir: "custom/api",
        outputFile: "custom/trpc/router.ts",
        includeWarnings: false,
        excludePatterns: ["test", "temp"],
      },
      withWarnings: {
        apiDir: "src/app/api",
        outputFile: "src/app/api/[locale]/trpc/[...trpc]/router.ts",
        includeWarnings: true,
      },
    },
    responses: {
      default: {
        success: true,
        generationCompleted: true,
        output:
          "🔍 Scanning API routes for tRPC generation...\n📝 Generating tRPC router...\n✅ tRPC router generated successfully!",
        generationStats: {
          totalRoutes: 30,
          validRoutes: 28,
          invalidRoutes: 2,
          routesWithWarnings: 1,
          routerGenerated: true,
          executionTimeMs: 2100,
        },
      },
      success: {
        success: true,
        generationCompleted: true,
        output:
          "🔍 Scanning API routes for tRPC generation...\n📝 Generating tRPC router...\n✅ tRPC router generated successfully!",
        generationStats: {
          totalRoutes: 30,
          validRoutes: 28,
          invalidRoutes: 2,
          routesWithWarnings: 1,
          routerGenerated: true,
          executionTimeMs: 2100,
        },
      },
      custom: {
        success: true,
        generationCompleted: true,
        output:
          "🔍 Scanning API routes for tRPC generation...\n📝 Generating tRPC router...\n✅ tRPC router generated successfully!",
        generationStats: {
          totalRoutes: 30,
          validRoutes: 28,
          invalidRoutes: 2,
          routesWithWarnings: 1,
          routerGenerated: true,
          executionTimeMs: 2100,
        },
      },
      withWarnings: {
        success: true,
        generationCompleted: true,
        output:
          "🔍 Scanning API routes for tRPC generation...\n⚠️  Found 4 routes with warnings\n📝 Generating tRPC router...\n✅ tRPC router generated successfully!",
        generationStats: {
          totalRoutes: 35,
          validRoutes: 31,
          invalidRoutes: 0,
          routesWithWarnings: 4,
          routerGenerated: true,
          executionTimeMs: 2800,
        },
      },
    },
  },
});

export type GenerateTrpcRouterRequestOutput = typeof POST.types.RequestOutput;
export type GenerateTrpcRouterResponseOutput = typeof POST.types.ResponseOutput;

export default { POST };
