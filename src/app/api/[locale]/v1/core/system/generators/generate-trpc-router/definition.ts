/**
 * Generate tRPC Router Command Endpoint Definition
 * Production-ready endpoint for generating tRPC router from API routes
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

const { POST } = createEndpoint({
  method: Methods.POST,
  path: [
    "v1",
    "core",
    "system",
    "side-tasks",
    "generators",
    "generate-trpc-router",
  ],
  title: "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.title",
  description:
    "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.description",
  category: "app.api.v1.core.system.sideTasks.category",
  tags: ["app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.container.title",
      description:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      apiDir: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.system.dev.typecheck.title",
          description: "app.api.v1.core.system.dev.typecheck.description",
          layout: { columns: 6 },
        },
        z.string().optional().default("src/app/api"),
      ),

      outputFile: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.system.dev.typecheck.title",
          description: "app.api.v1.core.system.dev.typecheck.description",
          layout: { columns: 6 },
        },
        z
          .string()
          .optional()
          .default("src/app/api/[locale]/trpc/[...trpc]/router.ts"),
      ),

      includeWarnings: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.dev.typecheck.title",
          description: "app.api.v1.core.system.dev.typecheck.description",
          layout: { columns: 4 },
        },
        z.boolean().optional().default(false),
      ),

      verbose: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.dev.typecheck.title",
          description: "app.api.v1.core.system.dev.typecheck.description",
          layout: { columns: 4 },
        },
        z.boolean().optional().default(false),
      ),

      excludePatterns: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.system.dev.typecheck.title",
          description: "app.api.v1.core.system.dev.typecheck.description",
          layout: { columns: 4 },
        },
        z.array(z.string()).optional(),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.dev.typecheck.success.title",
        },
        z.boolean(),
      ),

      generationCompleted: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.dev.typecheck.success.title",
        },
        z.boolean(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.dev.typecheck.success.title",
        },
        z.string(),
      ),

      generationStats: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.dev.typecheck.success.title",
        },
        z.object({
          totalRoutes: z.number(),
          validRoutes: z.number(),
          invalidRoutes: z.number(),
          routesWithWarnings: z.number(),
          routerGenerated: z.boolean(),
          executionTimeMs: z.number(),
        }),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.validation.title",
      description:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.internal.title",
      description:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.internal.title",
      description:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.internal.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.internal.title",
      description:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.internal.title",
      description:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.internal.title",
      description:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.internal.title",
      description:
        "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.errors.internal.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title:
      "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.success.title",
    description:
      "app.api.v1.core.system.sideTasks.generators.generateTrpcRouter.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        apiDir: "src/app/api",
        outputFile: "src/app/api/[locale]/trpc/[...trpc]/router.ts",
        includeWarnings: false,
        verbose: false,
      },
      success: {
        apiDir: "src/app/api",
        outputFile: "src/app/api/[locale]/trpc/[...trpc]/router.ts",
        includeWarnings: false,
        verbose: false,
      },
      verbose: {
        apiDir: "src/app/api",
        outputFile: "src/app/api/[locale]/trpc/[...trpc]/router.ts",
        includeWarnings: true,
        verbose: true,
      },
      custom: {
        apiDir: "custom/api",
        outputFile: "custom/trpc/router.ts",
        includeWarnings: false,
        verbose: false,
        excludePatterns: ["test", "temp"],
      },
      withWarnings: {
        apiDir: "src/app/api",
        outputFile: "src/app/api/[locale]/trpc/[...trpc]/router.ts",
        includeWarnings: true,
        verbose: false,
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
      verbose: {
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
    urlPathParams: undefined,
  },
});

export default { POST };
