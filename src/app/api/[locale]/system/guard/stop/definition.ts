/**
 * Guard Stop Endpoint Definition
 * Stop guard environments for VSCode projects
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

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "guard", "stop"],
  title: "app.api.system.guard.stop.title",
  description: "app.api.system.guard.stop.description",
  category: "app.api.system.guard.category",
  tags: ["app.api.system.guard.stop.tag"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["guard:stop", "guard-stop"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.guard.stop.container.title",
      description: "app.api.system.guard.stop.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      projectPath: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.system.guard.stop.fields.projectPath.title",
          description:
            "app.api.system.guard.stop.fields.projectPath.description",
          placeholder:
            "app.api.system.guard.stop.fields.projectPath.placeholder",
          columns: 6,
        },
        z.string().optional(),
      ),

      guardId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.system.guard.stop.fields.guardId.title",
          description: "app.api.system.guard.stop.fields.guardId.description",
          placeholder: "app.api.system.guard.stop.fields.guardId.placeholder",
          columns: 6,
        },
        z.string().optional(),
      ),

      stopAll: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.guard.stop.fields.stopAll.title",
          description: "app.api.system.guard.stop.fields.stopAll.description",
          columns: 6,
        },
        z.boolean().optional().default(false),
      ),

      force: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.guard.stop.fields.force.title",
          description: "app.api.system.guard.stop.fields.force.description",
          columns: 6,
        },
        z.boolean().optional().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.guard.stop.fields.success.title",
        },
        z.boolean(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.guard.stop.fields.output.title",
        },
        z.string(),
      ),

      stoppedGuards: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
          title: "app.api.system.guard.stop.fields.stoppedGuards.title",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 4,
          },
          { response: true },
          {
            guardId: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.guard.stop.fields.guardId.title",
                fieldType: FieldDataType.TEXT,
              },
              z.string(),
            ),
            username: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.guard.stop.fields.username.title",
                fieldType: FieldDataType.TEXT,
              },
              z.string(),
            ),
            projectPath: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.guard.stop.fields.projectPath.title",
                fieldType: FieldDataType.TEXT,
              },
              z.string(),
            ),
            wasRunning: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.guard.stop.fields.wasRunning.title",
                fieldType: FieldDataType.BOOLEAN,
              },
              z.boolean(),
            ),
            nowRunning: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.guard.stop.fields.nowRunning.title",
                fieldType: FieldDataType.BOOLEAN,
              },
              z.boolean(),
            ),
            pid: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.guard.stop.fields.pid.title",
                fieldType: FieldDataType.NUMBER,
              },
              z.number().optional(),
            ),
            forceStopped: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.guard.stop.fields.forceStopped.title",
                fieldType: FieldDataType.BOOLEAN,
              },
              z.boolean().optional(),
            ),
          },
        ),
      ),

      totalStopped: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.guard.stop.fields.totalStopped.title",
        },
        z.number().optional(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.guard.stop.errors.validation.title",
      description: "app.api.system.guard.stop.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.guard.stop.errors.internal.title",
      description: "app.api.system.guard.stop.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.guard.stop.errors.unauthorized.title",
      description: "app.api.system.guard.stop.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.guard.stop.errors.forbidden.title",
      description: "app.api.system.guard.stop.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.guard.stop.errors.notFound.title",
      description: "app.api.system.guard.stop.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.guard.stop.errors.internal.title",
      description: "app.api.system.guard.stop.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.guard.stop.errors.internal.title",
      description: "app.api.system.guard.stop.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.guard.stop.errors.internal.title",
      description: "app.api.system.guard.stop.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.guard.stop.errors.conflict.title",
      description: "app.api.system.guard.stop.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.guard.stop.success.title",
    description: "app.api.system.guard.stop.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        projectPath: "/home/user/projects/my-project",
      },
      byGuardId: {
        guardId: "guard_my_project_abc123",
      },
      stopAll: {
        stopAll: true,
      },
      forceStop: {
        guardId: "guard_my_project_abc123",
        force: true,
      },
    },
    responses: {
      default: {
        success: true,
        output: "⏹️ Guard stopped successfully for project 'my-project'",
        stoppedGuards: [
          {
            guardId: "guard_my_project_abc123",
            username: "guard_my_project",
            projectPath: "/home/user/projects/my-project",
            wasRunning: true,
            nowRunning: false,
            pid: 12345,
            forceStopped: false,
          },
        ],
        totalStopped: 1,
      },
      byGuardId: {
        success: true,
        output: "⏹️ Guard 'guard_my_project_abc123' stopped successfully",
        stoppedGuards: [
          {
            guardId: "guard_my_project_abc123",
            username: "guard_my_project",
            projectPath: "/home/user/projects/my-project",
            wasRunning: true,
            nowRunning: false,
            pid: 12345,
            forceStopped: false,
          },
        ],
        totalStopped: 1,
      },
      stopAll: {
        success: true,
        output: "⏹️ Stopped 2 guard environments",
        stoppedGuards: [
          {
            guardId: "guard_my_project_abc123",
            username: "guard_my_project",
            projectPath: "/home/user/projects/my-project",
            wasRunning: true,
            nowRunning: false,
            pid: 12345,
            forceStopped: false,
          },
          {
            guardId: "guard_other_project_def456",
            username: "guard_other_project",
            projectPath: "/home/user/projects/other-project",
            wasRunning: true,
            nowRunning: false,
            pid: 12346,
            forceStopped: false,
          },
        ],
        totalStopped: 2,
      },
      forceStop: {
        success: true,
        output: "⏹️ Guard 'guard_my_project_abc123' force stopped",
        stoppedGuards: [
          {
            guardId: "guard_my_project_abc123",
            username: "guard_my_project",
            projectPath: "/home/user/projects/my-project",
            wasRunning: true,
            nowRunning: false,
            pid: 12345,
            forceStopped: true,
          },
        ],
        totalStopped: 1,
      },
    },
  },
});

const endpoints = { POST };
export default endpoints;
