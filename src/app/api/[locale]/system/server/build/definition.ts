/**
 * Build the application Endpoint Definition
 * Production-ready endpoint for build the application
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayOptionalField,
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
import { scopedTranslation } from "./i18n";

import { BUILD_ALIAS, BUILD_SERVER_ALIAS } from "./constants";
import { lazyCliWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-cli-widget";

const BuildResultWidget = lazyCliWidget(() =>
  import("./widget").then((m) => ({ default: m.BuildResultWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "server", "build"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.systemDevTools",
  tags: ["tags.build"],
  icon: "package",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: [BUILD_ALIAS, BUILD_SERVER_ALIAS],

  fields: customWidgetObject({
    render: BuildResultWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      package: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.package.title",
        description: "post.fields.package.description",
        schema: z.boolean().default(true),
      }),

      generate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.generate.title",
        description: "post.fields.generate.description",
        schema: z.boolean().default(true),
      }),

      generateEndpoints: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.generateEndpoints.title",
        description: "post.fields.generateEndpoints.description",
        schema: z.boolean().default(true),
      }),

      generateSeeds: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.generateSeeds.title",
        description: "post.fields.generateSeeds.description",
        schema: z.boolean().default(true),
      }),

      nextBuild: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.nextBuild.title",
        description: "post.fields.nextBuild.description",
        schema: z.boolean().default(true),
      }),

      migrate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.migrate.title",
        description: "post.fields.migrate.description",
        schema: z.boolean().default(true),
      }),

      seed: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.seed.title",
        description: "post.fields.seed.description",
        schema: z.boolean().default(true),
      }),

      force: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.force.title",
        description: "post.fields.force.description",
        schema: z.boolean().default(false),
      }),

      tanstack: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.tanstack.title",
        description: "post.fields.tanstack.description",
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.success.title",
        schema: z.boolean(),
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.output.title",
        schema: z.string(),
      }),

      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.duration.title",
        schema: z.coerce.number(),
      }),

      errors: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.errors.title",
        schema: z.array(z.string()).optional(),
      }),

      steps: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          layoutType: LayoutType.STACKED,
          columns: 12,
          children: {
            label: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string(),
            }),
            ok: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.boolean(),
            }),
            skipped: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.boolean(),
            }),
          },
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
      default: {},
      noDb: {
        migrate: false,
        seed: false,
        force: false,
      },

      tanstackBuild: {
        tanstack: true,
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
      tanstackBuild: {
        success: true,
        output: "✅ TanStack/Vite build completed successfully",
        duration: 10000,
      },
    },
  },
});

const buildDefinition = { POST };
export type BuildRequestInput = typeof POST.types.RequestInput;
export type BuildRequestOutput = typeof POST.types.RequestOutput;
export type BuildResponseInput = typeof POST.types.ResponseInput;
export type BuildResponseOutput = typeof POST.types.ResponseOutput;
export type BuildStep = NonNullable<BuildResponseOutput["steps"]>[number];

export default buildDefinition;
