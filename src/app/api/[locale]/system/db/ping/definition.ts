/**
 * Database Ping Command Endpoint Definition
 * Production-ready endpoint for checking database connectivity
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
  path: ["system", "db", "ping"],
  title: "post.title",
  description: "post.description",
  category: "endpointCategories.systemDatabase",
  tags: ["tag"],
  icon: "database",
  allowedRoles: [UserRole.ADMIN, UserRole.WEB_OFF, UserRole.AI_TOOL_OFF],
  aliases: ["ping", "db:ping"],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      silent: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.silent.title",
        description: "fields.silent.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      keepConnectionOpen: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.keepConnectionOpen.title",
        description: "fields.keepConnectionOpen.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.success.content" as const,
        label: "fields.success.title",
        schema: z.boolean(),
      }),

      isAccessible: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.isAccessible.content" as const,
        label: "fields.isAccessible.title",
        schema: z.boolean(),
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.output.content" as const,
        label: "fields.output.title",
        schema: z.string(),
      }),

      totalConnections: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.connectionInfo.totalConnections.content" as const,
        label: "fields.connectionInfo.totalConnections.content",
        schema: z.coerce.number(),
      }),

      idleConnections: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.connectionInfo.idleConnections.content" as const,
        label: "fields.connectionInfo.idleConnections.content",
        schema: z.coerce.number(),
      }),

      waitingClients: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.connectionInfo.waitingClients.content" as const,
        label: "fields.connectionInfo.waitingClients.content",
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
        silent: false,
        keepConnectionOpen: false,
      },
      success: {
        silent: false,
        keepConnectionOpen: false,
      },
      failure: {
        silent: false,
        keepConnectionOpen: false,
      },
      silent: {
        silent: true,
        keepConnectionOpen: false,
      },
      keepOpen: {
        silent: false,
        keepConnectionOpen: true,
      },
    },
    responses: {
      default: {
        success: true,
        isAccessible: true,
        output: "✅ Database connection successful",
        totalConnections: 10,
        idleConnections: 8,
        waitingClients: 0,
      },
      success: {
        success: true,
        isAccessible: true,
        output: "✅ Database is accessible",
        totalConnections: 5,
        idleConnections: 3,
        waitingClients: 0,
      },
      failure: {
        success: false,
        isAccessible: false,
        output: "❌ Database connection failed",
        totalConnections: 0,
        idleConnections: 0,
        waitingClients: 0,
      },
      silent: {
        success: true,
        isAccessible: true,
        output: "",
        totalConnections: 10,
        idleConnections: 8,
        waitingClients: 0,
      },
      keepOpen: {
        success: true,
        isAccessible: true,
        output: "✅ Database connection successful (kept open)",
        totalConnections: 11,
        idleConnections: 7,
        waitingClients: 0,
      },
    },
  },
});

export type PingRequestInput = typeof POST.types.RequestInput;
export type PingRequestOutput = typeof POST.types.RequestOutput;
export type PingResponseInput = typeof POST.types.ResponseInput;
export type PingResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
