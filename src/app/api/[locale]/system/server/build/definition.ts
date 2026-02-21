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

      generate: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.build.post.fields.generate.title",
        description:
          "app.api.system.server.build.post.fields.generate.description",
        schema: z.boolean().default(true),
      }),

      generateEndpoints: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.server.build.post.fields.generateEndpoints.title",
        description:
          "app.api.system.server.build.post.fields.generateEndpoints.description",
        schema: z.boolean().default(true),
      }),

      generateSeeds: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.build.post.fields.generateSeeds.title",
        description:
          "app.api.system.server.build.post.fields.generateSeeds.description",
        schema: z.boolean().default(true),
      }),

      nextBuild: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.build.post.fields.nextBuild.title",
        description:
          "app.api.system.server.build.post.fields.nextBuild.description",
        schema: z.boolean().default(true),
      }),

      migrate: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.build.post.fields.migrate.title",
        description:
          "app.api.system.server.build.post.fields.migrate.description",
        schema: z.boolean().default(true),
      }),

      seed: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.build.post.fields.seed.title",
        description: "app.api.system.server.build.post.fields.seed.description",
        schema: z.boolean().default(true),
      }),

      force: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.server.build.post.fields.force.title",
        description:
          "app.api.system.server.build.post.fields.force.description",
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
        generate: true,
        generateEndpoints: true,
        generateSeeds: true,
        nextBuild: true,
        migrate: true,
        seed: true,
        force: false,
      },
      noDb: {
        package: false,
        generate: true,
        generateEndpoints: true,
        generateSeeds: true,
        nextBuild: true,
        migrate: false,
        seed: false,
        force: false,
      },
      packageOnly: {
        package: true,
        generate: false,
        generateEndpoints: false,
        generateSeeds: false,
        nextBuild: false,
        migrate: false,
        seed: false,
        force: false,
      },
    },
    responses: {
      default: {
        success: true,
        output:
          "✅ Application build completed successfully\n🚀 Your application is ready for production deployment!",
        duration: 30000,
      },
      noDb: {
        success: true,
        output: "✅ Application build completed successfully",
        duration: 25000,
      },
      packageOnly: {
        success: true,
        output: "✅ Package build completed successfully",
        duration: 15000,
      },
    },
  },
});

const buildDefinition = { POST };
export default buildDefinition;
