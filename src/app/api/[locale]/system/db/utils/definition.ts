/**
 * Database Utils API Definition
 * Provides utility functions for database operations
 * Following migration guide patterns
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedObjectOptionalField,
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

import { UserRole } from "../../../user/user-roles/enum";
import { scopedTranslation } from "./i18n";

/**
 * Database Utils Endpoint Definition
 */
const { GET } = createEndpoint({
  scopedTranslation,
  title: "title",
  description: "description",
  category: "app.endpointCategories.system",
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

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "title",
    description: "description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      includeDetails: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "includeDetails.title",
        description: "includeDetails.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      checkConnections: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "checkConnections.title",
        description: "checkConnections.description",
        columns: 6,
        schema: z.boolean().default(true),
      }),

      // === RESPONSE FIELDS ===
      status: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "status.title",
        schema: z.enum(["healthy", "degraded", "unhealthy"]),
      }),

      timestamp: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "timestamp.title",
        schema: z.string(),
      }),

      connections: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "connections.title",
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { response: true },
        children: {
          primary: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "connections.primary",
            fieldType: FieldDataType.BOOLEAN,
            schema: z.boolean(),
          }),
          replica: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "connections.replica",
            fieldType: FieldDataType.BOOLEAN,
            schema: z.boolean().optional(),
          }),
        },
      }),

      details: scopedObjectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "details.title",
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { response: true },
        children: {
          version: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "details.version",
            fieldType: FieldDataType.TEXT,
            schema: z.string().optional(),
          }),
          uptime: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "details.uptime",
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number().optional(),
          }),
          activeConnections: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "details.activeConnections",
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number().optional(),
          }),
          maxConnections: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "details.maxConnections",
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
