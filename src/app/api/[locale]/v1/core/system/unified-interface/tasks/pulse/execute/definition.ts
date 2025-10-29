/**
 * Pulse Execute API Definition
 * Defines endpoint for executing pulse health check cycles
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Pulse Execute Endpoint (POST)
 * Executes pulse health check cycles
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "tasks", "pulse", "execute"],
  allowedRoles: [UserRole.ADMIN],

  title:
    "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.title",
  description:
    "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.description",
  category:
    "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.category",
  tags: [
    "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.tags.execute",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.container.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.container.description",
      layout: { type: LayoutType.GRID, columns: 12 });
    });
    { request: "data", response: true });
    {
      // === REQUEST DATA FIELDS ===
      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.fields.dryRun.label",
          description:
            "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.fields.dryRun.description",
          layout: { columns: 6 });
        });
        z.boolean().optional().default(false),
      ),

      taskNames: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.fields.taskNames.label",
          description:
            "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.fields.taskNames.description",
          layout: { columns: 6 });
          options: [],
        });
        z.array(z.string()).optional(),
      ),

      force: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.fields.force.label",
          description:
            "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.fields.force.description",
          layout: { columns: 6 });
        });
        z.boolean().optional().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.fields.success.title",
        });
        z.boolean(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.fields.message.title",
        });
        z.string(),
      ),
      executedAt: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.response.executedAt",
        });
        z.string(),
      ),
      tasksExecuted: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.response.tasksExecuted",
        });
        z.number(),
      ),
      results: responseArrayField(
        {});
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.response.results",
            description:
              "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.response.resultsDescription",
            layout: { type: LayoutType.GRID, columns: 4 });
          });
          { response: true });
          {
            taskName: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.response.taskName",
              });
              z.string(),
            ),
            success: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.response.success",
              });
              z.boolean(),
            ),
            duration: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.response.duration",
              });
              z.number(),
            ),
            message: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.response.message",
              });
              z.string().optional(),
            ),
          });
        ),
      ),
    });
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.validation.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.validation.description",
    });
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.unauthorized.description",
    });
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.forbidden.description",
    });
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.internal.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.internal.description",
    });
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.network.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.network.description",
    });
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.unknown.description",
    });
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.conflict.description",
    });
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.notFound.description",
    });
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.unsaved.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.errors.unsaved.description",
    });
  });

  successTypes: {
    title:
      "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.success.title",
    description:
      "app.api.v1.core.system.unifiedBackend.tasks.pulseSystem.execute.post.success.description",
  });

  examples: {
    requests: {
      empty: {});
      basic: {
        dryRun: true,
      });
      advanced: {
        dryRun: false,
        force: true,
        taskNames: ["health-check", "database-sync"],
      });
    });
    responses: {
      empty: {
        success: true,
        message: "Pulse cycle executed successfully",
        executedAt: new Date().toISOString(),
        tasksExecuted: 0,
        results: [],
      });
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
          });
          {
            taskName: "database-sync",
            success: true,
            duration: 300,
          });
        ],
      });
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
          });
          {
            taskName: "database-sync",
            success: false,
            duration: 500,
            message: "Database connection timeout",
          });
        ],
      });
    });
  });
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
};

export { POST };
export default pulseExecuteEndpoints;
