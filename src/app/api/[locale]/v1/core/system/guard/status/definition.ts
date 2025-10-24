/**
 * Guard Status Endpoint Definition
 * Check status and list guard environments
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { LayoutType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "guard", "status"],
  title: "app.api.v1.core.system.guard.status.post.title",
  description: "app.api.v1.core.system.guard.status.post.description",
  category: "app.api.v1.core.system.guard.category",
  tags: ["app.api.v1.core.system.guard.status.post.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["guard:status", "guard-status"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.guard.status.post.container.title",
      description:
        "app.api.v1.core.system.guard.status.post.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      projectPath: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.guard.status.post.fields.projectPath.title",
          description:
            "app.api.v1.core.system.guard.status.post.fields.projectPath.description",
          placeholder:
            "app.api.v1.core.system.guard.status.post.fields.projectPath.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      guardId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.guard.status.post.fields.guardId.title",
          description:
            "app.api.v1.core.system.guard.status.post.fields.guardId.description",
          placeholder:
            "app.api.v1.core.system.guard.status.post.fields.guardId.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      listAll: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.guard.status.post.fields.listAll.title",
          description:
            "app.api.v1.core.system.guard.status.post.fields.listAll.description",
          layout: { columns: 12 },
        },
        z.boolean().optional().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.guard.status.post.fields.success.title",
        },
        z.boolean(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.guard.status.post.fields.output.title",
        },
        z.string(),
      ),

      guards: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.guard.status.post.fields.guards.title",
        },
        z
          .array(
            z.object({
              guardId: z.string(),
              username: z.string(),
              projectPath: z.string(),
              status: z.string(),
              createdAt: z.string(),
              securityLevel: z.string(),
              isolationMethod: z.string(),
              isRunning: z.boolean(),
              userHome: z.string().optional(),
            }),
          )
          .optional(),
      ),

      totalGuards: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.guard.status.post.fields.totalGuards.title",
        },
        z.number().optional(),
      ),

      activeGuards: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.guard.status.post.fields.activeGuards.title",
        },
        z.number().optional(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.system.guard.status.post.errors.validation.title",
      description:
        "app.api.v1.core.system.guard.status.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.guard.status.post.errors.internal.title",
      description:
        "app.api.v1.core.system.guard.status.post.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.guard.status.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.guard.status.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.guard.status.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.guard.status.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.system.guard.status.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.guard.status.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.guard.status.post.errors.internal.title",
      description:
        "app.api.v1.core.system.guard.status.post.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.guard.status.post.errors.internal.title",
      description:
        "app.api.v1.core.system.guard.status.post.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.guard.status.post.errors.internal.title",
      description:
        "app.api.v1.core.system.guard.status.post.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.system.guard.status.post.errors.internal.title",
      description:
        "app.api.v1.core.system.guard.status.post.errors.internal.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.guard.status.post.success.title",
    description: "app.api.v1.core.system.guard.status.post.success.description",
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
    urlPathVariables: undefined,
  },
});

const endpoints = { POST };
export default endpoints;
