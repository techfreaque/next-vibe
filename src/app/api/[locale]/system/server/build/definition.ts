/**
 * Build the application Endpoint Definition
 * Production-ready endpoint for build the application
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
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "server", "build"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.system",
  tags: ["tags.build"],
  icon: "package",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["build", "b"],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      package: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.package.title",
        description: "post.fields.package.description",
        schema: z.boolean().default(false),
      }),

      generate: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.generate.title",
        description: "post.fields.generate.description",
        schema: z.boolean().default(true),
      }),

      generateEndpoints: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.generateEndpoints.title",
        description: "post.fields.generateEndpoints.description",
        schema: z.boolean().default(true),
      }),

      generateSeeds: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.generateSeeds.title",
        description: "post.fields.generateSeeds.description",
        schema: z.boolean().default(true),
      }),

      nextBuild: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.nextBuild.title",
        description: "post.fields.nextBuild.description",
        schema: z.boolean().default(true),
      }),

      migrate: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.migrate.title",
        description: "post.fields.migrate.description",
        schema: z.boolean().default(true),
      }),

      seed: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.seed.title",
        description: "post.fields.seed.description",
        schema: z.boolean().default(true),
      }),

      force: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.force.title",
        description: "post.fields.force.description",
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.success.title",
        schema: z.boolean(),
      }),

      output: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.output.title",
        schema: z.string(),
      }),

      duration: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.duration.title",
        schema: z.coerce.number(),
      }),

      errors: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.errors.title",
        schema: z.array(z.string()).optional(),
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
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
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
