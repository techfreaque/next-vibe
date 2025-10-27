/**
 * Guard Start Endpoint Definition
 * Start guard environments for VSCode projects
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";

import { UserRole } from "../../../user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "guard", "start"],
  title: "app.api.v1.core.system.guard.start.title",
  description: "app.api.v1.core.system.guard.start.description",
  category: "app.api.v1.core.system.guard.category",
  tags: ["app.api.v1.core.system.guard.start.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["guard", "guard:start", "guard-start"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.guard.start.container.title",
      description: "app.api.v1.core.system.guard.start.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      projectPath: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.system.guard.start.fields.projectPath.title",
          description:
            "app.api.v1.core.system.guard.start.fields.projectPath.description",
          placeholder:
            "app.api.v1.core.system.guard.start.fields.projectPath.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      startAll: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.guard.start.fields.startAll.title",
          description:
            "app.api.v1.core.system.guard.start.fields.startAll.description",
          layout: { columns: 12 },
        },
        z.boolean().optional().default(false),
      ),

      guardIdInput: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.system.guard.start.fields.guardId.title",
          description:
            "app.api.v1.core.system.guard.start.fields.guardId.description",
          placeholder:
            "app.api.v1.core.system.guard.start.fields.guardId.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      // === RESPONSE FIELDS ===
      summary: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title: "app.api.v1.core.system.guard.start.fields.totalStarted.title",
          value: "totalStarted",
          format: "number",
          icon: "🛡️",
        },
        z.object({
          totalStarted: z.number(),
          status: z.string(),
          hasIssues: z.boolean(),
        }),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.guard.start.fields.output.title",
          variant: "subtitle",
        },
        z.string(),
      ),

      guardId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.guard.start.fields.guardId.title",
        },
        z.string(),
      ),

      username: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.guard.start.fields.startedGuards.columns.username",
        },
        z.string(),
      ),

      guardProjectPath: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.guard.start.fields.startedGuards.columns.projectPath",
        },
        z.string(),
      ),

      scriptPath: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.guard.start.fields.output.title",
        },
        z.string(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.system.guard.start.errors.validation.title",
      description:
        "app.api.v1.core.system.guard.start.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.guard.start.errors.internal.title",
      description:
        "app.api.v1.core.system.guard.start.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.system.guard.start.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.guard.start.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.system.guard.start.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.guard.start.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.system.guard.start.errors.notFound.title",
      description:
        "app.api.v1.core.system.guard.start.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.guard.start.errors.internal.title",
      description:
        "app.api.v1.core.system.guard.start.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.guard.start.errors.internal.title",
      description:
        "app.api.v1.core.system.guard.start.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.guard.start.errors.internal.title",
      description:
        "app.api.v1.core.system.guard.start.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.system.guard.start.errors.conflict.title",
      description:
        "app.api.v1.core.system.guard.start.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.guard.start.success.title",
    description: "app.api.v1.core.system.guard.start.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        projectPath: "/home/user/projects/my-project",
      },
      byGuardId: {
        guardIdInput: "guard_my_project_abc123",
      },
      startAll: {
        startAll: true,
      },
    },
    responses: {
      default: {
        summary: {
          totalStarted: 1,
          status: "🚀 Guard Ready",
          hasIssues: false,
        },
        output: "🚀 Guard started successfully for project 'my-project'",
        guardId: "guard_my_project_abc123",
        username: "guard_my_project",
        guardProjectPath: "/home/user/projects/my-project",
        scriptPath: "/home/user/projects/my-project/.vscode/.guard.sh",
      },
      byGuardId: {
        summary: {
          totalStarted: 1,
          status: "🚀 Guard Ready",
          hasIssues: false,
        },
        output: "🚀 Guard 'guard_my_project_abc123' started successfully",
        guardId: "guard_my_project_abc123",
        username: "guard_my_project",
        guardProjectPath: "/home/user/projects/my-project",
        scriptPath: "/home/user/projects/my-project/.vscode/.guard.sh",
      },
      startAll: {
        summary: {
          totalStarted: 2,
          status: "🚀 Guards Ready",
          hasIssues: false,
        },
        output: "🚀 Started 2 guard environments",
        guardId: "guard_my_project_abc123",
        username: "guard_my_project",
        guardProjectPath: "/home/user/projects/my-project",
        scriptPath: "/home/user/projects/my-project/.vscode/.guard.sh",
      },
    },
    urlPathParams: undefined,
  },
});

// Export types for repository usage
export type GuardStartRequestInput = typeof POST.types.RequestInput;
export type GuardStartRequestOutput = typeof POST.types.RequestOutput;
export type GuardStartResponseInput = typeof POST.types.ResponseInput;
export type GuardStartResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
