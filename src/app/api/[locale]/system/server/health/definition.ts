/**
 * Server Health Check API Definition
 * Provides comprehensive health monitoring endpoints
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseArrayField,
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

import { HEALTH_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

/**
 * GET endpoint definition - Basic health check
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "server", "health"],
  aliases: [HEALTH_ALIAS],
  title: "get.title",
  description: "get.description",
  category: "endpointCategories.system",
  tags: ["tag"],
  icon: "activity",
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.form.title",
    description: "get.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      detailed: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.detailed.title",
        description: "get.fields.detailed.description",
        schema: z.boolean().default(false),
      }),

      includeDatabase: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.includeDatabase.title",
        description: "get.fields.includeDatabase.description",
        schema: z.boolean().default(true),
      }),

      includeTasks: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.includeTasks.title",
        description: "get.fields.includeTasks.description",
        schema: z.boolean().default(true),
      }),

      includeSystem: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.includeSystem.title",
        description: "get.fields.includeSystem.description",
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.status.title",
        schema: z.enum(["healthy", "warning", "critical", "unknown"]),
      }),

      timestamp: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.timestamp.title",
        schema: z.string(),
      }),

      uptime: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.uptime.title",
        schema: z.coerce.number(),
      }),

      environment: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.environment.title",
        description: "get.response.environment.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          name: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.environment.name.title",
            schema: z.string(),
          }),
          nodeEnv: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.environment.nodeEnv.title",
            schema: z.string(),
          }),
          platform: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.environment.platform.title",
            schema: z.string(),
          }),
          supportsTaskRunners: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.environment.supportsTaskRunners.title",
            schema: z.boolean(),
          }),
        },
      }),

      // Note: These fields are conditionally included based on request parameters
      // The repository should handle their optional presence
      database: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.database.title",
        description: "get.response.database.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.database.status.title",
            schema: z.enum(["connected", "disconnected", "error", "unknown"]),
          }),
          responseTime: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.database.responseTime.title",
            schema: z.coerce.number().optional(),
          }),
          error: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.database.error.title",
            schema: z.string().optional(),
          }),
        },
      }),

      tasks: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.tasks.title",
        description: "get.response.tasks.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          runnerStatus: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.tasks.runnerStatus.title",
            schema: z.enum(["running", "stopped", "error", "unknown"]),
          }),
          activeTasks: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.tasks.activeTasks.title",
            schema: z.coerce.number(),
          }),
          totalTasks: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.tasks.totalTasks.title",
            schema: z.coerce.number(),
          }),
          errors: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.tasks.errors.title",
            schema: z.coerce.number(),
          }),
          lastError: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.tasks.lastError.title",
            schema: z.string().optional(),
          }),
        },
      }),

      system: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.system.title",
        description: "get.response.system.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          memory: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.system.memory.title",
            description: "get.response.system.memory.description",
            layoutType: LayoutType.GRID,
            columns: 12,
            usage: { response: true },
            children: {
              used: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.system.memory.used.title",
                schema: z.coerce.number(),
              }),
              total: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.system.memory.total.title",
                schema: z.coerce.number(),
              }),
              percentage: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.system.memory.percentage.title",
                schema: z.coerce.number(),
              }),
            },
          }),
          cpu: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.system.cpu.title",
            description: "get.response.system.cpu.description",
            layoutType: LayoutType.GRID,
            columns: 12,
            usage: { response: true },
            children: {
              usage: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.system.cpu.usage.title",
                schema: z.coerce.number(),
              }),
              loadAverage: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.system.cpu.loadAverage.title",
                schema: z.array(z.coerce.number()),
              }),
            },
          }),
          disk: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.system.disk.title",
            description: "get.response.system.disk.description",
            layoutType: LayoutType.GRID,
            columns: 12,
            usage: { response: true },
            children: {
              available: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.system.disk.available.title",
                schema: z.coerce.number(),
              }),
              total: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.system.disk.total.title",
                schema: z.coerce.number(),
              }),
              percentage: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.system.disk.percentage.title",
                schema: z.coerce.number(),
              }),
            },
          }),
        },
      }),

      checks: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.checks.title",
        description: "get.response.checks.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.checks.item.name.title",
              schema: z.string(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.checks.item.status.title",
              schema: z.enum(["pass", "fail", "warn"]),
            }),
            message: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.checks.item.message.title",
              schema: z.string().optional(),
            }),
            duration: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.checks.item.duration.title",
              schema: z.coerce.number().optional(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
  },

  examples: {
    requests: {
      default: {},
      detailed: {
        detailed: true,
        includeDatabase: true,
        includeTasks: true,
        includeSystem: true,
      },
      success: {},
    },
    responses: {
      default: {
        status: "healthy",
        timestamp: "2025-01-15T10:30:00.000Z",
        uptime: 300000,
        environment: {
          name: "development",
          nodeEnv: "development",
          platform: "Local/Server",
          supportsTaskRunners: true,
        },
        database: {
          status: "connected",
          responseTime: 12.5,
        },
        tasks: {
          runnerStatus: "running",
          activeTasks: 3,
          totalTasks: 10,
          errors: 0,
        },
        system: {
          memory: {
            used: 1024000000,
            total: 8192000000,
            percentage: 12.5,
          },
          cpu: {
            usage: 25.3,
            loadAverage: [0.5, 0.3, 0.2],
          },
          disk: {
            available: 500000000000,
            total: 1000000000000,
            percentage: 50.0,
          },
        },
        checks: [
          {
            name: "basic",
            status: "pass",
            message: "Server is running normally",
            duration: 5.2,
          },
        ],
      },
      detailed: {
        status: "healthy",
        timestamp: "2025-01-15T10:30:00.000Z",
        uptime: 300000,
        environment: {
          name: "development",
          nodeEnv: "development",
          platform: "Local/Server",
          supportsTaskRunners: true,
        },
        database: {
          status: "connected",
          responseTime: 12.5,
        },
        tasks: {
          runnerStatus: "running",
          activeTasks: 3,
          totalTasks: 10,
          errors: 0,
        },
        system: {
          memory: {
            used: 1024000000,
            total: 8192000000,
            percentage: 12.5,
          },
          cpu: {
            usage: 25.3,
            loadAverage: [0.5, 0.3, 0.2],
          },
          disk: {
            available: 500000000000,
            total: 1000000000000,
            percentage: 50.0,
          },
        },
        checks: [
          {
            name: "basic",
            status: "pass",
            message: "Server is running normally",
            duration: 5.2,
          },
          {
            name: "database",
            status: "pass",
            message: "Database connection successful",
            duration: 12.5,
          },
          {
            name: "tasks",
            status: "pass",
            message: "Task runner is available",
            duration: 8.1,
          },
          {
            name: "system",
            status: "pass",
            message: "System resources are healthy",
            duration: 3.7,
          },
        ],
      },
      success: {
        status: "healthy",
        timestamp: "2025-01-15T10:30:00.000Z",
        uptime: 300000,
        environment: {
          name: "development",
          nodeEnv: "development",
          platform: "Local/Server",
          supportsTaskRunners: true,
        },
        database: {
          status: "connected",
          responseTime: 12.5,
        },
        tasks: {
          runnerStatus: "running",
          activeTasks: 3,
          totalTasks: 10,
          errors: 0,
        },
        system: {
          memory: {
            used: 1024000000,
            total: 8192000000,
            percentage: 12.5,
          },
          cpu: {
            usage: 25.3,
            loadAverage: [0.5, 0.3, 0.2],
          },
          disk: {
            available: 500000000000,
            total: 1000000000000,
            percentage: 50.0,
          },
        },
        checks: [
          {
            name: "basic",
            status: "pass",
            message: "Server is running normally",
            duration: 5.2,
          },
        ],
      },
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },
});

// Export types for use in repository
export type HealthCheckRequestInput = typeof GET.types.RequestInput;
export type HealthCheckRequestOutput = typeof GET.types.RequestOutput;
export type HealthCheckResponseInput = typeof GET.types.ResponseInput;
export type HealthCheckResponseOutput = typeof GET.types.ResponseOutput;

const healthEndpoints = { GET };
export default healthEndpoints;
