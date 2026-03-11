/**
 * Guard Stop Endpoint Definition
 * Stop guard environments for VSCode projects
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

import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "guard", "stop"],
  title: "title",
  description: "description",
  category: "app.endpointCategories.system",
  tags: ["tag"],
  icon: "shield",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["guard:stop", "guard-stop"],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "container.title",
    description: "container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      projectPath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.projectPath.title",
        description: "fields.projectPath.description",
        placeholder: "fields.projectPath.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      guardId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.guardId.title",
        description: "fields.guardId.description",
        placeholder: "fields.guardId.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      stopAll: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.stopAll.title",
        description: "fields.stopAll.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      force: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.force.title",
        description: "fields.force.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.success.title",
        schema: z.boolean(),
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.output.title",
        schema: z.string(),
      }),

      stoppedGuards: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "fields.stoppedGuards.title",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 4,
          usage: { response: true },
          children: {
            guardId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "fields.guardId.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            username: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "fields.username.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            projectPath: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "fields.projectPath.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            wasRunning: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "fields.wasRunning.title",
              fieldType: FieldDataType.BOOLEAN,
              schema: z.boolean(),
            }),
            nowRunning: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "fields.nowRunning.title",
              fieldType: FieldDataType.BOOLEAN,
              schema: z.boolean(),
            }),
            pid: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "fields.pid.title",
              fieldType: FieldDataType.NUMBER,
              schema: z.coerce.number().optional(),
            }),
            forceStopped: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "fields.forceStopped.title",
              fieldType: FieldDataType.BOOLEAN,
              schema: z.boolean().optional(),
            }),
          },
        }),
      }),

      totalStopped: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.totalStopped.title",
        schema: z.coerce.number().optional(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
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
