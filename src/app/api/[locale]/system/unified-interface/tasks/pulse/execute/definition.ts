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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { PULSE_EXECUTE_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

/**
 * Pulse Execute Endpoint (POST)
 * Executes pulse health check cycles
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "pulse", "execute"],
  aliases: [PULSE_EXECUTE_ALIAS, "pulse:execute"],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],

  title: "post.title",
  description: "post.description",
  icon: "activity",
  category: "endpointCategories.tasks",
  subCategory: "endpointCategories.tasksPulse",
  tags: ["tags.execute"],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title",
    description: "post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST DATA FIELDS ===
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      taskNames: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "post.fields.taskNames.label",
        description: "post.fields.taskNames.description",
        columns: 6,
        options: [],
        schema: z.array(z.string()).optional(),
      }),

      force: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.force.label",
        description: "post.fields.force.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.success.title",
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.message.title",
        schema: z.string(),
      }),
      executedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.executedAt",
        schema: z.string(),
      }),
      tasksExecuted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.tasksExecuted",
        schema: z.coerce.number(),
      }),
      results: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.results",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "post.response.results",
          description: "post.response.resultsDescription",
          layoutType: LayoutType.GRID,
          columns: 4,
          usage: { response: true },
          children: {
            taskName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.taskName",
              schema: z.string(),
            }),
            success: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.success",
              schema: z.boolean(),
            }),
            duration: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.duration",
              schema: z.coerce.number(),
            }),
            message: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.message",
              schema: z.string().optional(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsaved.title",
      description: "post.errors.unsaved.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
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
        executedAt: "2024-01-15T10:00:00.000Z",
        tasksExecuted: 0,
        results: [],
      },
      basic: {
        success: true,
        message: "Dry run completed successfully",
        executedAt: "2024-01-15T10:00:00.000Z",
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
        executedAt: "2024-01-15T10:00:00.000Z",
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
