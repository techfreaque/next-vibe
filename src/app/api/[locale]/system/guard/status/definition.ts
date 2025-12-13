/**
 * Guard Status Endpoint Definition
 * Check status and list guard environments
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
  path: ["system", "guard", "status"],
  title: "app.api.system.guard.status.post.title",
  description: "app.api.system.guard.status.post.description",
  category: "app.api.system.guard.category",
  tags: ["app.api.system.guard.status.post.tag"],
  icon: "eye",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["guard:status", "guard-status"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.guard.status.post.container.title",
      description: "app.api.system.guard.status.post.container.description",
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
          label: "app.api.system.guard.status.post.fields.projectPath.title",
          description:
            "app.api.system.guard.status.post.fields.projectPath.description",
          placeholder:
            "app.api.system.guard.status.post.fields.projectPath.placeholder",
          columns: 6,
        },
        z.string().optional(),
      ),

      guardId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.system.guard.status.post.fields.guardId.title",
          description:
            "app.api.system.guard.status.post.fields.guardId.description",
          placeholder:
            "app.api.system.guard.status.post.fields.guardId.placeholder",
          columns: 6,
        },
        z.string().optional(),
      ),

      listAll: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.guard.status.post.fields.listAll.title",
          description:
            "app.api.system.guard.status.post.fields.listAll.description",
          columns: 12,
        },
        z.boolean().optional().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.guard.status.post.fields.success.title",
        },
        z.boolean(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.guard.status.post.fields.output.title",
        },
        z.string(),
      ),

      guards: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
          title: "app.api.system.guard.status.post.fields.guards.title",
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
                content:
                  "app.api.system.guard.status.post.fields.guardId.title",
                fieldType: FieldDataType.TEXT,
              },
              z.string(),
            ),
            username: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.guard.status.post.fields.username.title",
                fieldType: FieldDataType.TEXT,
              },
              z.string(),
            ),
            projectPath: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.guard.status.post.fields.projectPath.title",
                fieldType: FieldDataType.TEXT,
              },
              z.string(),
            ),
            status: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.guard.status.post.fields.status.title",
                fieldType: FieldDataType.TEXT,
              },
              z.string(),
            ),
            createdAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.guard.status.post.fields.createdAt.title",
                fieldType: FieldDataType.TEXT,
              },
              z.string(),
            ),
            securityLevel: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.guard.status.post.fields.securityLevel.title",
                fieldType: FieldDataType.TEXT,
              },
              z.string(),
            ),
            isolationMethod: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.guard.status.post.fields.isolationMethod.title",
                fieldType: FieldDataType.TEXT,
              },
              z.string(),
            ),
            isRunning: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.guard.status.post.fields.isRunning.title",
                fieldType: FieldDataType.BOOLEAN,
              },
              z.boolean(),
            ),
            userHome: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.guard.status.post.fields.userHome.title",
                fieldType: FieldDataType.TEXT,
              },
              z.string().optional(),
            ),
          },
        ),
      ),

      totalGuards: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.guard.status.post.fields.totalGuards.title",
        },
        z.number().optional(),
      ),

      activeGuards: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.guard.status.post.fields.activeGuards.title",
        },
        z.number().optional(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.guard.status.post.errors.validation.title",
      description:
        "app.api.system.guard.status.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.guard.status.post.errors.internal.title",
      description:
        "app.api.system.guard.status.post.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.guard.status.post.errors.unauthorized.title",
      description:
        "app.api.system.guard.status.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.guard.status.post.errors.unauthorized.title",
      description:
        "app.api.system.guard.status.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.guard.status.post.errors.notFound.title",
      description:
        "app.api.system.guard.status.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.guard.status.post.errors.internal.title",
      description:
        "app.api.system.guard.status.post.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.guard.status.post.errors.internal.title",
      description:
        "app.api.system.guard.status.post.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.guard.status.post.errors.internal.title",
      description:
        "app.api.system.guard.status.post.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.guard.status.post.errors.internal.title",
      description:
        "app.api.system.guard.status.post.errors.internal.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.guard.status.post.success.title",
    description: "app.api.system.guard.status.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        listAll: true,
      },
      byProject: {
        projectPath: "/home/user/projects/my-project",
      },
      byGuardId: {
        guardId: "guard_my_project_abc123",
      },
    },
    responses: {
      default: {
        success: true,
        output: "📋 Found 2 guard environments (1 active)",
        guards: [
          {
            guardId: "guard_my_project_abc123",
            username: "guard_my_project",
            projectPath: "/home/user/projects/my-project",
            status: "running",
            createdAt: "2024-01-15T10:30:00Z",
            securityLevel: "standard",
            isolationMethod: "rbash",
            isRunning: true,
            userHome:
              "/home/user/projects/my-project/.guard_home_guard_my_project",
          },
          {
            guardId: "guard_other_project_def456",
            username: "guard_other_project",
            projectPath: "/home/user/projects/other-project",
            status: "stopped",
            createdAt: "2024-01-14T15:45:00Z",
            securityLevel: "strict",
            isolationMethod: "chroot",
            isRunning: false,
            userHome:
              "/home/user/projects/other-project/.guard_home_guard_other_project",
          },
        ],
        totalGuards: 2,
        activeGuards: 1,
      },
      byProject: {
        success: true,
        output: "📊 Guard status for project 'my-project': running",
        guards: [
          {
            guardId: "guard_my_project_abc123",
            username: "guard_my_project",
            projectPath: "/home/user/projects/my-project",
            status: "running",
            createdAt: "2024-01-15T10:30:00Z",
            securityLevel: "standard",
            isolationMethod: "rbash",
            isRunning: true,
            userHome:
              "/home/user/projects/my-project/.guard_home_guard_my_project",
          },
        ],
        totalGuards: 1,
        activeGuards: 1,
      },
      byGuardId: {
        success: true,
        output: "📊 Guard 'guard_my_project_abc123' status: running",
        guards: [
          {
            guardId: "guard_my_project_abc123",
            username: "guard_my_project",
            projectPath: "/home/user/projects/my-project",
            status: "running",
            createdAt: "2024-01-15T10:30:00Z",
            securityLevel: "standard",
            isolationMethod: "rbash",
            isRunning: true,
            userHome:
              "/home/user/projects/my-project/.guard_home_guard_my_project",
          },
        ],
        totalGuards: 1,
        activeGuards: 1,
      },
    },
    urlPathParams: undefined,
  },
});

const endpoints = { POST };
export default endpoints;
