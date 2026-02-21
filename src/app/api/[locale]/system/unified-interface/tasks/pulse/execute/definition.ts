/**
 * Pulse Execute API Definition
 * Defines endpoint for executing pulse health check cycles
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

/**
 * Pulse Execute Endpoint (POST)
 * Executes pulse health check cycles
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "pulse", "execute"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.title",
  description:
    "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.description",
  icon: "activity",
  category: "app.api.system.category",
  tags: [
    "app.api.system.unifiedInterface.tasks.pulseSystem.execute.tags.execute",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.container.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST DATA FIELDS ===
      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.fields.dryRun.label",
        description:
          "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      taskNames: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label:
          "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.fields.taskNames.label",
        description:
          "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.fields.taskNames.description",
        columns: 6,
        options: [],
        schema: z.array(z.string()).optional(),
      }),

      force: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.fields.force.label",
        description:
          "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.fields.force.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.fields.success.title",
        schema: z.boolean(),
      }),
      message: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.fields.message.title",
        schema: z.string(),
      }),
      executedAt: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.response.executedAt",
        schema: z.string(),
      }),
      tasksExecuted: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.response.tasksExecuted",
        schema: z.coerce.number(),
      }),
      results: responseArrayField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.response.results",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.response.results",
            description:
              "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.response.resultsDescription",
            layoutType: LayoutType.GRID,
            columns: 4,
          },
          { response: true },
          {
            taskName: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.response.taskName",
              schema: z.string(),
            }),
            success: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.response.success",
              schema: z.boolean(),
            }),
            duration: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.response.duration",
              schema: z.coerce.number(),
            }),
            message: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.response.message",
              schema: z.string().optional(),
            }),
          },
        ),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.internal.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.internal.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.network.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.unsaved.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.unsaved.description",
    },
  },

  successTypes: {
    title:
      "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.success.title",
    description:
      "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.success.description",
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

export type PulseExecuteRequestInput = typeof POST.types.RequestInput;
export type PulseExecuteRequestOutput = typeof POST.types.RequestOutput;
export type PulseExecuteResponseInput = typeof POST.types.ResponseInput;
export type PulseExecuteResponseOutput = typeof POST.types.ResponseOutput;

/**
 * Export the endpoint definitions
 */
const pulseExecuteEndpoints = {
  POST,
} as const;
export default pulseExecuteEndpoints;
