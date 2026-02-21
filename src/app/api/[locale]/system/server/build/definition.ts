/**
 * Build the application Endpoint Definition
 * Production-ready endpoint for build the application
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
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "server", "build"],
  title: "app.api.system.server.build.post.title",
  description: "app.api.system.server.build.post.description",
  category: "app.api.system.category",
  tags: ["app.api.system.server.build.tags.build"],
  icon: "package",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["build", "b"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.server.build.post.form.title",
      description: "app.api.system.server.build.post.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      package: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.build.post.fields.package.title",
        description:
          "app.api.system.server.build.post.fields.package.description",
        schema: z.boolean().default(false),
      }),

      skipNextCommand: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.build.post.fields.skipNextCommand.title",
        description:
          "app.api.system.server.build.post.fields.skipNextCommand.description",
        schema: z.boolean().default(false),
      }),

      target: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.server.build.post.fields.target.title",
        description:
          "app.api.system.server.build.post.fields.target.description",
        schema: z.string().optional(),
      }),

      skipGeneration: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.build.post.fields.skipGeneration.title",
        description:
          "app.api.system.server.build.post.fields.skipGeneration.description",
        schema: z.boolean().default(false),
      }),

      force: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.build.post.fields.force.title",
        description:
          "app.api.system.server.build.post.fields.force.description",
        schema: z.boolean().default(false),
      }),

      skipEndpoints: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.build.post.fields.skipEndpoints.title",
        description:
          "app.api.system.server.build.post.fields.skipEndpoints.description",
        schema: z.boolean().default(false),
      }),

      skipSeeds: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.build.post.fields.skipSeeds.title",
        description:
          "app.api.system.server.build.post.fields.skipSeeds.description",
        schema: z.boolean().default(false),
      }),

      skipProdMigrations: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.server.build.post.fields.skipProdMigrations.title",
        description:
          "app.api.system.server.build.post.fields.skipProdMigrations.description",
        schema: z.boolean().default(true),
      }),

      skipProdSeeding: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.build.post.fields.skipProdSeeding.title",
        description:
          "app.api.system.server.build.post.fields.skipProdSeeding.description",
        schema: z.boolean().default(true),
      }),

      runProdDatabase: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.build.post.fields.runProdDatabase.title",
        description:
          "app.api.system.server.build.post.fields.runProdDatabase.description",
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.server.build.post.fields.success.title",
        schema: z.boolean(),
      }),

      output: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.server.build.post.fields.output.title",
        schema: z.string(),
      }),

      duration: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.server.build.post.fields.duration.title",
        schema: z.coerce.number(),
      }),

      errors: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.server.build.post.fields.errors.title",
        schema: z.array(z.string()).optional(),
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.server.build.post.errors.validation.title",
      description:
        "app.api.system.server.build.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.server.build.post.errors.network.title",
      description:
        "app.api.system.server.build.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.server.build.post.errors.unauthorized.title",
      description:
        "app.api.system.server.build.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.server.build.post.errors.forbidden.title",
      description:
        "app.api.system.server.build.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.server.build.post.errors.notFound.title",
      description:
        "app.api.system.server.build.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.server.build.post.errors.server.title",
      description: "app.api.system.server.build.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.server.build.post.errors.unknown.title",
      description:
        "app.api.system.server.build.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.server.build.post.errors.unknown.title",
      description:
        "app.api.system.server.build.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.server.build.post.errors.conflict.title",
      description:
        "app.api.system.server.build.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.server.build.post.success.title",
    description: "app.api.system.server.build.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        package: false,
        skipNextCommand: false,
        skipGeneration: false,
        force: false,
        skipEndpoints: false,
        skipSeeds: false,
        skipProdMigrations: true,
        skipProdSeeding: true,
        runProdDatabase: false,
      },
      withMigrations: {
        package: false,
        skipNextCommand: false,
        skipGeneration: false,
        force: false,
        skipEndpoints: false,
        skipSeeds: false,
        skipProdMigrations: false,
        skipProdSeeding: false,
        runProdDatabase: true,
      },
      packageBuild: {
        package: true,
        skipNextCommand: true,
        skipGeneration: true,
        force: false,
        skipEndpoints: true,
        skipSeeds: true,
        skipProdMigrations: true,
        skipProdSeeding: true,
        runProdDatabase: false,
      },
    },
    responses: {
      default: {
        success: true,
        output:
          "✅ Application build completed successfully\n🚀 Your application is ready for production deployment!",
        duration: 30000,
      },
      withMigrations: {
        success: true,
        output:
          "✅ Application build completed successfully\n📦 Running production migrations...\n🌱 Running production seeding...\n🎉 Production database operations completed successfully\n🚀 Your application is ready for production deployment!",
        duration: 45000,
      },
      packageBuild: {
        success: true,
        output: "✅ Package build completed successfully",
        duration: 15000,
      },
    },
  },
});

const buildDefinition = { POST };
export default buildDefinition;
