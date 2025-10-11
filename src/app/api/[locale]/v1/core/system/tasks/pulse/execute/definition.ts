/**
 * Pulse Execute API Definition
 * Defines endpoint for executing pulse health check cycles
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Pulse Execute Endpoint (POST)
 * Executes pulse health check cycles
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "tasks", "pulse", "execute"],
  allowedRoles: [UserRole.ADMIN],

  title: "tasks.pulse.execution.success",
  description: "tasks.runner.description",
  category: "tasks.category.system",
  tags: ["tasks.pulse.execution.success"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "tasks.runner.title",
      description: "tasks.runner.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST DATA FIELDS ===
      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "common.dryRun",
          description: "common.dryRunDescription",
          layout: { columns: 6 },
        },
        z.boolean().optional().default(false),
      ),

      taskNames: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "common.taskNames",
          description: "common.taskNamesDescription",
          placeholder: "common.selectTasks",
          layout: { columns: 6 },
        },
        z.array(z.string()).optional(),
      ),

      force: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "common.force",
          description: "common.forceDescription",
          layout: { columns: 6 },
        },
        z.boolean().optional().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "common.success",
        },
        z.boolean(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content: "common.message",
        },
        z.string(),
      ),
      executedAt: responseField(
        {
          type: WidgetType.TEXT,
          content: "common.executedAt",
        },
        z.string(),
      ),
      tasksExecuted: responseField(
        {
          type: WidgetType.TEXT,
          content: "tasks.runner.messages.taskCompleted",
        },
        z.number(),
      ),
      results: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title: "tasks.runner.title",
          },
          { response: true },
          {
            taskName: responseField(
              {
                type: WidgetType.TEXT,
                content: "common.taskName",
              },
              z.string(),
            ),
            success: responseField(
              {
                type: WidgetType.TEXT,
                content: "common.success",
              },
              z.boolean(),
            ),
            duration: responseField(
              {
                type: WidgetType.TEXT,
                content: "common.duration",
              },
              z.number(),
            ),
            message: responseField(
              {
                type: WidgetType.TEXT,
                content: "common.message",
              },
              z.string().optional(),
            ),
          },
        ),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.tasks.pulseSystem.execute.post.errors.validation.title",
      description:
        "app.api.v1.core.system.tasks.pulseSystem.execute.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.tasks.pulseSystem.execute.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.tasks.pulseSystem.execute.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.tasks.pulseSystem.execute.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.tasks.pulseSystem.execute.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "error.general.title",
      description: "error.general.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.tasks.pulseSystem.execute.post.errors.network.title",
      description:
        "app.api.v1.core.system.tasks.pulseSystem.execute.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.tasks.pulseSystem.execute.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.tasks.pulseSystem.execute.post.errors.unknown.description",
    },
  },

  successTypes: {
    title:
      "app.api.v1.core.system.tasks.pulseSystem.execute.post.success.title",
    description:
      "app.api.v1.core.system.tasks.pulseSystem.execute.post.success.description",
  },

  examples: {
    requests: {
      empty: {},
      basic: {
        dryRun: true,
      },
      advanced: {
        dryRun: false,
        force: true,
        taskNames: ["health-check", "database-sync"],
      },
    },
    urlPathVariables: undefined,
    responses: {
      empty: {
        success: true,
        message: "Pulse cycle executed successfully",
        executedAt: new Date().toISOString(),
        tasksExecuted: 0,
        results: [],
      },
      basic: {
        success: true,
        message: "Dry run completed successfully",
        executedAt: new Date().toISOString(),
        tasksExecuted: 2,
        results: [
          {
            taskName: "health-check",
            success: true,
            duration: 150,
            message: "Health check passed",
          },
          {
            taskName: "database-sync",
            success: true,
            duration: 300,
          },
        ],
      },
      advanced: {
        success: true,
        message: "Forced pulse execution completed",
        executedAt: new Date().toISOString(),
        tasksExecuted: 2,
        results: [
          {
            taskName: "health-check",
            success: true,
            duration: 120,
            message: "Health check completed",
          },
          {
            taskName: "database-sync",
            success: false,
            duration: 500,
            message: "Database connection timeout",
          },
        ],
      },
    },
  },
});

export type PulseExecuteRequestTypeInput = typeof POST.types.RequestInput;
export type PulseExecuteRequestTypeOutput = typeof POST.types.RequestOutput;
export type PulseExecuteResponseTypeInput = typeof POST.types.ResponseInput;
export type PulseExecuteResponseTypeOutput = typeof POST.types.ResponseOutput;

/**
 * Export the endpoint definitions
 */
const pulseExecuteEndpoints = {
  POST,
};

export { POST };
export default pulseExecuteEndpoints;
