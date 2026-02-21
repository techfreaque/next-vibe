/**
 * Guard Destroy Endpoint Definition
 * Destroys guard environments and cleans up resources
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

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "guard", "destroy"],
  title: "app.api.system.guard.destroy.title",
  description: "app.api.system.guard.destroy.description",
  category: "app.api.system.category",
  tags: ["app.api.system.guard.destroy.tag"],
  icon: "shield",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["guard:destroy", "guard-destroy", "guard:remove"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.guard.destroy.container.title",
      description: "app.api.system.guard.destroy.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      projectPath: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.guard.destroy.fields.projectPath.title",
        description:
          "app.api.system.guard.destroy.fields.projectPath.description",
        placeholder:
          "app.api.system.guard.destroy.fields.projectPath.placeholder",
        columns: 8,
        schema: z.string().optional(),
      }),

      guardId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.guard.destroy.fields.guardId.title",
        description: "app.api.system.guard.destroy.fields.guardId.description",
        placeholder: "app.api.system.guard.destroy.fields.guardId.placeholder",
        columns: 4,
        schema: z.string().optional(),
      }),

      force: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.guard.destroy.fields.force.title",
        description: "app.api.system.guard.destroy.fields.force.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      cleanupFiles: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.guard.destroy.fields.cleanupFiles.title",
        description:
          "app.api.system.guard.destroy.fields.cleanupFiles.description",
        columns: 4,
        schema: z.boolean().optional().default(true),
      }),

      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.guard.destroy.fields.dryRun.title",
        description: "app.api.system.guard.destroy.fields.dryRun.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.guard.destroy.fields.success.title",
        schema: z.boolean(),
      }),

      output: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.guard.destroy.fields.output.title",
        schema: z.string(),
      }),

      destroyedGuards: responseArrayField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.guard.destroy.fields.destroyedGuards.title",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 3,
          },
          { response: true },
          {
            guardId: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.guard.destroy.fields.guardId.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            username: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.guard.destroy.fields.username.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            projectPath: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.guard.destroy.fields.projectPath.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            wasRunning: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.guard.destroy.fields.wasRunning.title",
              fieldType: FieldDataType.BOOLEAN,
              schema: z.boolean(),
            }),
            filesRemoved: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.guard.destroy.fields.filesRemoved.title",
              fieldType: FieldDataType.BOOLEAN,
              schema: z.boolean(),
            }),
            userRemoved: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.guard.destroy.fields.userRemoved.title",
              fieldType: FieldDataType.BOOLEAN,
              schema: z.boolean(),
            }),
          },
        ),
      ),

      warnings: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.guard.destroy.fields.warnings.title",
        schema: z.array(z.string()).optional(),
      }),

      totalDestroyed: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.guard.destroy.fields.totalDestroyed.title",
        schema: z.coerce.number().optional(),
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.guard.destroy.errors.validation.title",
      description: "app.api.system.guard.destroy.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.guard.destroy.errors.internal.title",
      description: "app.api.system.guard.destroy.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.guard.destroy.errors.unauthorized.title",
      description:
        "app.api.system.guard.destroy.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.guard.destroy.errors.unauthorized.title",
      description:
        "app.api.system.guard.destroy.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.guard.destroy.errors.notFound.title",
      description: "app.api.system.guard.destroy.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.guard.destroy.errors.internal.title",
      description: "app.api.system.guard.destroy.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.guard.destroy.errors.internal.title",
      description: "app.api.system.guard.destroy.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.guard.destroy.errors.internal.title",
      description: "app.api.system.guard.destroy.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.guard.destroy.errors.conflict.title",
      description: "app.api.system.guard.destroy.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.guard.destroy.success.title",
    description: "app.api.system.guard.destroy.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        projectPath: "/home/user/projects/my-project",
        force: false,
        cleanupFiles: true,
        dryRun: false,
      },
      byGuardId: {
        guardId: "guard_my_project_abc123",
        force: false,
        cleanupFiles: true,
        dryRun: false,
      },
      force: {
        projectPath: "/home/user/projects/my-project",
        force: true,
        cleanupFiles: true,
        dryRun: false,
      },
      dryRun: {
        projectPath: "/home/user/projects/my-project",
        force: false,
        cleanupFiles: true,
        dryRun: true,
      },
    },
    responses: {
      default: {
        success: true,
        output: "🗑️ Guard destroyed successfully for project 'my-project'",
        destroyedGuards: [
          {
            guardId: "guard_my_project_abc123",
            username: "guard_my_project",
            projectPath: "/home/user/projects/my-project",
            wasRunning: true,
            filesRemoved: true,
            userRemoved: true,
          },
        ],
        totalDestroyed: 1,
      },
      force: {
        success: true,
        output:
          "💥 Force destroyed guard for project 'my-project' (was running)",
        destroyedGuards: [
          {
            guardId: "guard_my_project_abc123",
            username: "guard_my_project",
            projectPath: "/home/user/projects/my-project",
            wasRunning: true,
            filesRemoved: true,
            userRemoved: true,
          },
        ],
        warnings: ["Guard was forcefully terminated while running"],
        totalDestroyed: 1,
      },
      dryRun: {
        success: true,
        output: "🔍 Dry run: Would destroy guard for project 'my-project'",
        destroyedGuards: [
          {
            guardId: "guard_my_project_abc123",
            username: "guard_my_project",
            projectPath: "/home/user/projects/my-project",
            wasRunning: false,
            filesRemoved: false,
            userRemoved: false,
          },
        ],
        totalDestroyed: 0,
      },
      byGuardId: {
        success: true,
        output: "🗑️ Guard 'guard_my_project_abc123' destroyed successfully",
        destroyedGuards: [
          {
            guardId: "guard_my_project_abc123",
            username: "guard_my_project",
            projectPath: "/home/user/projects/my-project",
            wasRunning: false,
            filesRemoved: true,
            userRemoved: true,
          },
        ],
        totalDestroyed: 1,
      },
    },
  },
});

const endpoints = { POST };
export default endpoints;

// Export types
export type GuardDestroyRequestInput = typeof POST.types.RequestInput;
export type GuardDestroyRequestOutput = typeof POST.types.RequestOutput;
export type GuardDestroyResponseInput = typeof POST.types.ResponseInput;
export type GuardDestroyResponseOutput = typeof POST.types.ResponseOutput;
