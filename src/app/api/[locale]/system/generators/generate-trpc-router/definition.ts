/**
 * Generate tRPC Router Command Endpoint Definition
 * Production-ready endpoint for generating tRPC router from API routes
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
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "side-tasks", "generators", "generate-trpc-router"],
  title: "app.api.system.sideTasks.generators.generateTrpcRouter.title",
  description:
    "app.api.system.sideTasks.generators.generateTrpcRouter.description",
  category: "app.api.system.sideTasks.category",
  tags: ["app.api.system.sideTasks.generators.generateTrpcRouter.tag"],
  icon: "code",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.system.sideTasks.generators.generateTrpcRouter.container.title",
      description:
        "app.api.system.sideTasks.generators.generateTrpcRouter.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      apiDir: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.system.dev.typecheck.title",
          description: "app.api.system.dev.typecheck.description",
          columns: 6,
        },
        z.string().optional().default("src/app/api"),
      ),

      outputFile: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.system.dev.typecheck.title",
          description: "app.api.system.dev.typecheck.description",
          columns: 6,
        },
        z
          .string()
          .optional()
          .default(
            "src/app/api/[locale]/system/unified-interface/trpc/[...trpc]/router.ts",
          ),
      ),

      includeWarnings: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.dev.typecheck.title",
          description: "app.api.system.dev.typecheck.description",
          columns: 4,
        },
        z.boolean().optional().default(false),
      ),

      excludePatterns: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.system.dev.typecheck.title",
          description: "app.api.system.dev.typecheck.description",
          columns: 4,
        },
        z.array(z.string()).optional(),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.dev.typecheck.success.title",
        },
        z.boolean(),
      ),

      generationCompleted: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.dev.typecheck.success.title",
        },
        z.boolean(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.dev.typecheck.success.title",
        },
        z.string(),
      ),

      generationStats: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.dev.typecheck.success.title",
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
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.validation.title",
      description:
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.internal.title",
      description:
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.unauthorized.title",
      description:
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.unauthorized.title",
      description:
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.internal.title",
      description:
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.internal.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.internal.title",
      description:
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.internal.title",
      description:
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.internal.title",
      description:
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.internal.title",
      description:
        "app.api.system.sideTasks.generators.generateTrpcRouter.errors.internal.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title:
      "app.api.system.sideTasks.generators.generateTrpcRouter.success.title",
    description:
      "app.api.system.sideTasks.generators.generateTrpcRouter.success.description",
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
    urlPathParams: undefined,
  },
});

export default { POST };
