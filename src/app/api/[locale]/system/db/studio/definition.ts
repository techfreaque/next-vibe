/**
 * Open database studio Endpoint Definition
 * Production-ready endpoint for opening database studio
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

import { UserRole } from "../../../user/user-roles/enum";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "db", "studio"],
  title: "post.title",
  description: "post.description",
  category: "endpointCategories.database",
  subCategory: "endpointCategories.databaseTools",
  tags: ["tag"],
  icon: "database",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["studio", "db:studio"],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      port: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.port.title",
        description: "fields.port.description",
        columns: 6,
        schema: z.coerce.number().optional().default(5555),
      }),

      openBrowser: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.openBrowser.title",
        description: "fields.openBrowser.description",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.success.title",
        schema: z.boolean(),
      }),

      url: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.url.title",
        schema: z.string(),
      }),

      portUsed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.portUsed.title",
        schema: z.coerce.number(),
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.output.title",
        schema: z.string(),
      }),

      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.duration.title",
        schema: z.coerce.number(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
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
        port: "5555",
        openBrowser: true,
      },
      customPort: {
        port: "8080",
        openBrowser: false,
      },
      noBrowser: {
        port: "5555",
        openBrowser: false,
      },
    },
    responses: {
      default: {
        success: true,
        url: "https://local.drizzle.studio/?port=5555",
        portUsed: 5555,
        output:
          "✅ Database Studio opened at https://local.drizzle.studio/?port=5555",
        duration: 1200,
      },
      customPort: {
        success: true,
        url: "https://local.drizzle.studio/?port=8080",
        portUsed: 8080,
        output:
          "✅ Database Studio opened at https://local.drizzle.studio/?port=8080 (browser not opened)",
        duration: 800,
      },
      noBrowser: {
        success: true,
        url: "https://local.drizzle.studio/?port=5555",
        portUsed: 5555,
        output:
          "✅ Database Studio started at https://local.drizzle.studio/?port=5555",
        duration: 600,
      },
    },
  },
});

const endpoints = { POST };
export default endpoints;

// Export types
export type StudioRequestInput = typeof POST.types.RequestInput;
export type StudioRequestOutput = typeof POST.types.RequestOutput;
export type StudioResponseInput = typeof POST.types.ResponseInput;
export type StudioResponseOutput = typeof POST.types.ResponseOutput;
