/**
 * Database Utils API Definition
 * Provides utility functions for database operations
 * Following migration guide patterns
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  objectOptionalField,
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

/**
 * Database Utils Endpoint Definition
 */
const { GET } = createEndpoint({
  title: "app.api.system.db.utils.title",
  description: "app.api.system.db.utils.description",
  category: "app.api.system.category",
  tags: ["app.api.system.db.utils.tag"],
  icon: "database",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["db:utils", "dbutils"],
  method: Methods.GET,
  path: ["system", "db", "utils"],
  examples: {
    requests: {
      default: {
        includeDetails: false,
        checkConnections: true,
      },
      detailed: {
        includeDetails: true,
        checkConnections: true,
      },
    },
    responses: {
      default: {
        status: "healthy",
        timestamp: "2023-01-01T00:00:00Z",
        connections: {
          primary: true,
          replica: true,
        },
      },
      detailed: {
        status: "healthy",
        timestamp: "2023-01-01T00:00:00Z",
        connections: {
          primary: true,
          replica: true,
        },
      },
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.db.utils.title",
      description: "app.api.system.db.utils.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      includeDetails: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.utils.includeDetails.title",
        description: "app.api.system.db.utils.includeDetails.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      checkConnections: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.utils.checkConnections.title",
        description: "app.api.system.db.utils.checkConnections.description",
        columns: 6,
        schema: z.boolean().default(true),
      }),

      // === RESPONSE FIELDS ===
      status: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.utils.status.title",
        schema: z.enum(["healthy", "degraded", "unhealthy"]),
      }),

      timestamp: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.utils.timestamp.title",
        schema: z.string(),
      }),

      connections: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.db.utils.connections.title",
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { response: true },
        {
          primary: responseField({
            type: WidgetType.TEXT,
            content: "app.api.system.db.utils.connections.primary",
            fieldType: FieldDataType.BOOLEAN,
            schema: z.boolean(),
          }),
          replica: responseField({
            type: WidgetType.TEXT,
            content: "app.api.system.db.utils.connections.replica",
            fieldType: FieldDataType.BOOLEAN,
            schema: z.boolean().optional(),
          }),
        },
      ),

      details: objectOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.db.utils.details.title",
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { response: true },
        {
          version: responseField({
            type: WidgetType.TEXT,
            content: "app.api.system.db.utils.details.version",
            fieldType: FieldDataType.TEXT,
            schema: z.string().optional(),
          }),
          uptime: responseField({
            type: WidgetType.TEXT,
            content: "app.api.system.db.utils.details.uptime",
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number().optional(),
          }),
          activeConnections: responseField({
            type: WidgetType.TEXT,
            content: "app.api.system.db.utils.details.activeConnections",
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number().optional(),
          }),
          maxConnections: responseField({
            type: WidgetType.TEXT,
            content: "app.api.system.db.utils.details.maxConnections",
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number().optional(),
          }),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.db.utils.errors.validation.title",
      description: "app.api.system.db.utils.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.db.utils.errors.unauthorized.title",
      description: "app.api.system.db.utils.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.db.utils.errors.unauthorized.title",
      description: "app.api.system.db.utils.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.db.utils.errors.internal.title",
      description: "app.api.system.db.utils.errors.internal.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.db.utils.errors.internal.title",
      description: "app.api.system.db.utils.errors.internal.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.db.utils.errors.internal.title",
      description: "app.api.system.db.utils.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.db.utils.errors.internal.title",
      description: "app.api.system.db.utils.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.db.utils.errors.internal.title",
      description: "app.api.system.db.utils.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.db.utils.errors.internal.title",
      description: "app.api.system.db.utils.errors.internal.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.db.utils.success.title",
    description: "app.api.system.db.utils.success.description",
  },
});

const endpoints = { GET };
export default endpoints;

// Export types for repository usage - following migration guide pattern
export type DbUtilsRequestInput = typeof GET.types.RequestInput;
export type DbUtilsRequestOutput = typeof GET.types.RequestOutput;
export type DbUtilsResponseInput = typeof GET.types.ResponseInput;
export type DbUtilsResponseOutput = typeof GET.types.ResponseOutput;
