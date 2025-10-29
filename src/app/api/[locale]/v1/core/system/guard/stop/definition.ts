/**
 * Guard Stop Endpoint Definition
 * Stop guard environments for VSCode projects
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "guard", "stop"],
  title: "app.api.v1.core.system.guard.stop.title",
  description: "app.api.v1.core.system.guard.stop.description",
  category: "app.api.v1.core.system.guard.category",
  tags: ["app.api.v1.core.system.guard.stop.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["guard:stop", "guard-stop"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.guard.stop.container.title",
      description: "app.api.v1.core.system.guard.stop.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      projectPath: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.system.guard.stop.fields.projectPath.title",
          description:
            "app.api.v1.core.system.guard.stop.fields.projectPath.description",
          placeholder:
            "app.api.v1.core.system.guard.stop.fields.projectPath.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      guardId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.system.guard.stop.fields.guardId.title",
          description:
            "app.api.v1.core.system.guard.stop.fields.guardId.description",
          placeholder:
            "app.api.v1.core.system.guard.stop.fields.guardId.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      stopAll: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.guard.stop.fields.stopAll.title",
          description:
            "app.api.v1.core.system.guard.stop.fields.stopAll.description",
          layout: { columns: 6 },
        },
        z.boolean().optional().default(false),
      ),

      force: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.guard.stop.fields.force.title",
          description:
            "app.api.v1.core.system.guard.stop.fields.force.description",
          layout: { columns: 6 },
        },
        z.boolean().optional().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.guard.stop.fields.success.title",
        },
        z.boolean(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.guard.stop.fields.output.title",
        },
        z.string(),
      ),

      stoppedGuards: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.guard.stop.fields.stoppedGuards.title",
        },
        z
          .array(
            z.object({
              guardId: z.string(),
              username: z.string(),
              projectPath: z.string(),
              wasRunning: z.boolean(),
              nowRunning: z.boolean(),
              pid: z.number().optional(),
              forceStopped: z.boolean().optional(),
            }),
          )
          .optional(),
      ),

      totalStopped: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.guard.stop.fields.totalStopped.title",
        },
        z.number().optional(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.system.guard.stop.errors.validation.title",
      description:
        "app.api.v1.core.system.guard.stop.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.guard.stop.errors.internal.title",
      description:
        "app.api.v1.core.system.guard.stop.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.system.guard.stop.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.guard.stop.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.system.guard.stop.errors.forbidden.title",
      description:
        "app.api.v1.core.system.guard.stop.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.system.guard.stop.errors.notFound.title",
      description:
        "app.api.v1.core.system.guard.stop.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.guard.stop.errors.internal.title",
      description:
        "app.api.v1.core.system.guard.stop.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.guard.stop.errors.internal.title",
      description:
        "app.api.v1.core.system.guard.stop.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.guard.stop.errors.internal.title",
      description:
        "app.api.v1.core.system.guard.stop.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.system.guard.stop.errors.conflict.title",
      description:
        "app.api.v1.core.system.guard.stop.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.guard.stop.success.title",
    description: "app.api.v1.core.system.guard.stop.success.description",
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
