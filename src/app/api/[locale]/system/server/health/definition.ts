/**
 * Server Health Check API Definition
 * Provides comprehensive health monitoring endpoints
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
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

/**
 * GET endpoint definition - Basic health check
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["system", "server", "health"],
  aliases: ["health", "status"],
  title: "app.api.system.server.health.get.title",
  description: "app.api.system.server.health.get.description",
  category: "app.api.system.server.category",
  tags: ["app.api.system.server.health.tag"],
  icon: "activity",
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.server.health.get.form.title",
      description: "app.api.system.server.health.get.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      detailed: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.server.health.get.fields.detailed.title",
          description:
            "app.api.system.server.health.get.fields.detailed.description",
        },
        z.boolean().default(false),
      ),

      includeDatabase: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.system.server.health.get.fields.includeDatabase.title",
          description:
            "app.api.system.server.health.get.fields.includeDatabase.description",
        },
        z.boolean().default(true),
      ),

      includeTasks: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.server.health.get.fields.includeTasks.title",
          description:
            "app.api.system.server.health.get.fields.includeTasks.description",
        },
        z.boolean().default(true),
      ),

      includeSystem: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.server.health.get.fields.includeSystem.title",
          description:
            "app.api.system.server.health.get.fields.includeSystem.description",
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      status: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.server.health.get.response.status.title",
        },
        z.enum(["healthy", "warning", "critical", "unknown"]),
      ),

      timestamp: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.server.health.get.response.timestamp.title",
        },
        z.string(),
      ),

      uptime: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.server.health.get.response.uptime.title",
        },
        z.coerce.number(),
      ),

      environment: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.server.health.get.response.environment.title",
          description:
            "app.api.system.server.health.get.response.environment.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          name: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.server.health.get.response.environment.name.title",
            },
            z.string(),
          ),
          nodeEnv: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.server.health.get.response.environment.nodeEnv.title",
            },
            z.string(),
          ),
          platform: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.server.health.get.response.environment.platform.title",
            },
            z.string(),
          ),
          supportsSideTasks: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.server.health.get.response.environment.supportsSideTasks.title",
            },
            z.boolean(),
          ),
        },
      ),

      // Note: These fields are conditionally included based on request parameters
      // The repository should handle their optional presence
      database: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.server.health.get.response.database.title",
          description:
            "app.api.system.server.health.get.response.database.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          status: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.server.health.get.response.database.status.title",
            },
            z.enum(["connected", "disconnected", "error", "unknown"]),
          ),
          responseTime: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.server.health.get.response.database.responseTime.title",
            },
            z.coerce.number().optional(),
          ),
          error: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.server.health.get.response.database.error.title",
            },
            z.string().optional(),
          ),
        },
      ),

      tasks: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.server.health.get.response.tasks.title",
          description:
            "app.api.system.server.health.get.response.tasks.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          runnerStatus: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.server.health.get.response.tasks.runnerStatus.title",
            },
            z.enum(["running", "stopped", "error", "unknown"]),
          ),
          activeTasks: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.server.health.get.response.tasks.activeTasks.title",
            },
            z.coerce.number(),
          ),
          totalTasks: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.server.health.get.response.tasks.totalTasks.title",
            },
            z.coerce.number(),
          ),
          errors: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.server.health.get.response.tasks.errors.title",
            },
            z.coerce.number(),
          ),
          lastError: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.server.health.get.response.tasks.lastError.title",
            },
            z.string().optional(),
          ),
        },
      ),

      system: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.server.health.get.response.system.title",
          description:
            "app.api.system.server.health.get.response.system.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          memory: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.system.server.health.get.response.system.memory.title",
              description:
                "app.api.system.server.health.get.response.system.memory.description",
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            { response: true },
            {
              used: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.server.health.get.response.system.memory.used.title",
                },
                z.coerce.number(),
              ),
              total: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.server.health.get.response.system.memory.total.title",
                },
                z.coerce.number(),
              ),
              percentage: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.server.health.get.response.system.memory.percentage.title",
                },
                z.coerce.number(),
              ),
            },
          ),
          cpu: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.system.server.health.get.response.system.cpu.title",
              description:
                "app.api.system.server.health.get.response.system.cpu.description",
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            { response: true },
            {
              usage: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.server.health.get.response.system.cpu.usage.title",
                },
                z.coerce.number(),
              ),
              loadAverage: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.server.health.get.response.system.cpu.loadAverage.title",
                },
                z.array(z.coerce.number()),
              ),
            },
          ),
          disk: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.system.server.health.get.response.system.disk.title",
              description:
                "app.api.system.server.health.get.response.system.disk.description",
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            { response: true },
            {
              available: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.server.health.get.response.system.disk.available.title",
                },
                z.coerce.number(),
              ),
              total: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.server.health.get.response.system.disk.total.title",
                },
                z.coerce.number(),
              ),
              percentage: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.server.health.get.response.system.disk.percentage.title",
                },
                z.coerce.number(),
              ),
            },
          ),
        },
      ),

      checks: responseArrayField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.server.health.get.response.checks.title",
          description:
            "app.api.system.server.health.get.response.checks.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            name: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.server.health.get.response.checks.item.name.title",
              },
              z.string(),
            ),
            status: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.server.health.get.response.checks.item.status.title",
              },
              z.enum(["pass", "fail", "warn"]),
            ),
            message: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.server.health.get.response.checks.item.message.title",
              },
              z.string().optional(),
            ),
            duration: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.server.health.get.response.checks.item.duration.title",
              },
              z.coerce.number().optional(),
            ),
          },
        ),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.server.health.get.errors.server.title",
      description: "app.api.system.server.health.get.errors.server.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.server.health.get.errors.validation.title",
      description:
        "app.api.system.server.health.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.server.health.get.errors.unauthorized.title",
      description:
        "app.api.system.server.health.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.server.health.get.errors.forbidden.title",
      description:
        "app.api.system.server.health.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.server.health.get.errors.notFound.title",
      description:
        "app.api.system.server.health.get.errors.notFound.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.server.health.get.errors.network.title",
      description:
        "app.api.system.server.health.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.server.health.get.errors.unknown.title",
      description:
        "app.api.system.server.health.get.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.server.health.get.errors.conflict.title",
      description:
        "app.api.system.server.health.get.errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.server.health.get.errors.unsavedChanges.title",
      description:
        "app.api.system.server.health.get.errors.unsavedChanges.description",
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
          supportsSideTasks: true,
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
          supportsSideTasks: true,
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
          supportsSideTasks: true,
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
    title: "app.api.system.server.health.get.success.title",
    description: "app.api.system.server.health.get.success.description",
  },
});

// Export types for use in repository
export type HealthCheckRequestInput = typeof GET.types.RequestInput;
export type HealthCheckRequestOutput = typeof GET.types.RequestOutput;
export type HealthCheckResponseInput = typeof GET.types.ResponseInput;
export type HealthCheckResponseOutput = typeof GET.types.ResponseOutput;

const healthEndpoints = { GET };
export default healthEndpoints;
