/**
 * Rebuild & Restart Endpoint Definition
 * Rebuilds the application and hot-restarts the running Next.js server
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

export const REBUILD_ALIAS = "rebuild" as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "server", "rebuild"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.system",
  tags: ["tags.rebuild"],
  icon: "refresh-cw",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: [REBUILD_ALIAS],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      generate: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.generate.title",
        description: "post.fields.generate.description",
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

      restart: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.restart.title",
        description: "post.fields.restart.description",
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

      restarted: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.restarted.title",
        schema: z.boolean(),
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
        generate: true,
        nextBuild: true,
        migrate: true,
        seed: true,
        restart: true,
        force: false,
      },
      buildOnly: {
        generate: true,
        nextBuild: true,
        migrate: false,
        seed: false,
        restart: false,
        force: false,
      },
    },
    responses: {
      default: {
        success: true,
        output: "Rebuild completed successfully. Server restarted.",
        duration: 45000,
        restarted: true,
      },
      buildOnly: {
        success: true,
        output: "Build completed. Server not restarted.",
        duration: 30000,
        restarted: false,
      },
    },
  },
});

const rebuildDefinition = { POST };
export default rebuildDefinition;
