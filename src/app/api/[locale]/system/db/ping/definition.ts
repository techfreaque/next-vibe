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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "db", "ping"],
  title: "app.api.system.db.ping.post.title",
  description: "app.api.system.db.ping.post.description",
  category: "app.api.system.db.category",
  tags: ["app.api.system.db.ping.tag"],
  icon: "database",
  allowedRoles: [UserRole.ADMIN, UserRole.WEB_OFF, UserRole.AI_TOOL_OFF],
  aliases: ["ping", "db:ping"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.db.ping.post.form.title",
      description: "app.api.system.db.ping.post.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      silent: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.ping.fields.silent.title",
        description: "app.api.system.db.ping.fields.silent.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      keepConnectionOpen: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.ping.fields.keepConnectionOpen.title",
        description:
          "app.api.system.db.ping.fields.keepConnectionOpen.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.ping.fields.success.content" as const,
        label: "app.api.system.db.ping.fields.success.title",
        schema: z.boolean(),
      }),

      isAccessible: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.ping.fields.isAccessible.content" as const,
        label: "app.api.system.db.ping.fields.isAccessible.title",
        schema: z.boolean(),
      }),

      output: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.ping.fields.output.content" as const,
        label: "app.api.system.db.ping.fields.output.title",
        schema: z.string(),
      }),

      totalConnections: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.db.ping.fields.connectionInfo.totalConnections.content" as const,
        label:
          "app.api.system.db.ping.fields.connectionInfo.totalConnections.content",
        schema: z.coerce.number(),
      }),

      idleConnections: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.db.ping.fields.connectionInfo.idleConnections.content" as const,
        label:
          "app.api.system.db.ping.fields.connectionInfo.idleConnections.content",
        schema: z.coerce.number(),
      }),

      waitingClients: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.db.ping.fields.connectionInfo.waitingClients.content" as const,
        label:
          "app.api.system.db.ping.fields.connectionInfo.waitingClients.content",
        schema: z.coerce.number(),
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.db.ping.post.errors.validation.title",
      description: "app.api.system.db.ping.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.db.ping.post.errors.network.title",
      description: "app.api.system.db.ping.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.db.ping.post.errors.unauthorized.title",
      description:
        "app.api.system.db.ping.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.db.ping.post.errors.forbidden.title",
      description: "app.api.system.db.ping.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.db.ping.post.errors.notFound.title",
      description: "app.api.system.db.ping.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.db.ping.post.errors.server.title",
      description: "app.api.system.db.ping.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.db.ping.post.errors.unknown.title",
      description: "app.api.system.db.ping.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.db.ping.post.errors.server.title",
      description: "app.api.system.db.ping.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.db.ping.post.errors.conflict.title",
      description: "app.api.system.db.ping.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.db.ping.post.success.title",
    description: "app.api.system.db.ping.post.success.description",
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
