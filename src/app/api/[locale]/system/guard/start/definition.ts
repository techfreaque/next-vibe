/**
 * Guard Start Endpoint Definition
 * Start guard environments for VSCode projects
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user/user-roles/enum";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "guard", "start"],
  title: "title",
  description: "description",
  category: "app.endpointCategories.systemDevTools",
  tags: ["tag"],
  icon: "lock",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["guard", "guard:start", "guard-start"],

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

      startAll: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.startAll.title",
        description: "fields.startAll.description",
        columns: 12,
        schema: z.boolean().optional().default(false),
      }),

      guardIdInput: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.guardId.title",
        description: "fields.guardId.description",
        placeholder: "fields.guardId.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      // === RESPONSE FIELDS ===
      summary: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "fields.summary.title",
        layoutType: LayoutType.GRID,
        columns: 3,
        usage: { response: true },
        children: {
          totalStarted: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "fields.totalStarted.title",
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "fields.status.title",
            fieldType: FieldDataType.TEXT,
            schema: z.string(),
          }),
          hasIssues: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "fields.hasIssues.title",
            fieldType: FieldDataType.BOOLEAN,
            schema: z.boolean(),
          }),
        },
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.output.title",
        schema: z.string(),
      }),

      guardId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.guardId.title",
        schema: z.string(),
      }),

      username: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.startedGuards.columns.username",
        schema: z.string(),
      }),

      guardProjectPath: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.startedGuards.columns.projectPath",
        schema: z.string(),
      }),

      scriptPath: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.output.title",
        schema: z.string(),
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
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
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
  },
});

// Export types for repository usage
export type GuardStartRequestInput = typeof POST.types.RequestInput;
export type GuardStartRequestOutput = typeof POST.types.RequestOutput;
export type GuardStartResponseInput = typeof POST.types.ResponseInput;
export type GuardStartResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
