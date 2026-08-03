/**
 * Database Utils API Definition
 * Provides utility functions for database operations
 * Following migration guide patterns
 */

import { dateSchema } from "../../core/definition/common.schema";
import { createEndpoint } from "../../core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "../../core/definition/enums";
import { scopedTranslation } from "./i18n";
import { UserRole } from "../../identity/roles/enum";
import {
  objectField,
  objectOptionalField,
  requestField,
  responseField,
} from "../../unified-ui/_shared/utils-i18n";
import { z } from "zod";

/**
 * Database Utils Endpoint Definition
 */
const { GET } = createEndpoint({
  scopedTranslation,
  title: "title",
  titleShort: "title",
  description: "description",
  category: "database",
  subCategory: "Tools",
  tags: ["tag"],
  icon: "database",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["db:utils", "dbutils"],
  method: Methods.GET,
  path: ["vibe", "database", "utils"],
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

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "title",
    description: "description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      includeDetails: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "includeDetails.title",
        description: "includeDetails.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      checkConnections: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "checkConnections.title",
        description: "checkConnections.description",
        columns: 6,
        schema: z.boolean().default(true),
      }),

      // === RESPONSE FIELDS ===
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "status.title",
        schema: z.enum(["healthy", "degraded", "unhealthy"]),
      }),

      timestamp: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "timestamp.title",
        schema: dateSchema,
      }),

      connections: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "connections.title",
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { response: true },
        children: {
          primary: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "connections.primary",
            fieldType: FieldDataType.BOOLEAN,
            schema: z.boolean(),
          }),
          replica: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "connections.replica",
            fieldType: FieldDataType.BOOLEAN,
            schema: z.boolean().optional(),
          }),
        },
      }),

      details: objectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "details.title",
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { response: true },
        children: {
          version: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "details.version",
            fieldType: FieldDataType.TEXT,
            schema: z.string().optional(),
          }),
          uptime: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "details.uptime",
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number().optional(),
          }),
          activeConnections: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "details.activeConnections",
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number().optional(),
          }),
          maxConnections: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "details.maxConnections",
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number().optional(),
          }),
        },
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

const endpoints = { GET };
export default endpoints;

// Export types for repository usage - following migration guide pattern
export type DbUtilsRequestInput = typeof GET.types.RequestInput;
export type DbUtilsRequestOutput = typeof GET.types.RequestOutput;
export type DbUtilsResponseInput = typeof GET.types.ResponseInput;
export type DbUtilsResponseOutput = typeof GET.types.ResponseOutput;
