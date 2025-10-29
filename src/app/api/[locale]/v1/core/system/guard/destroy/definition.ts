/**
 * Guard Destroy Endpoint Definition
 * Destroys guard environments and cleans up resources
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
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "guard", "destroy"],
  title: "app.api.v1.core.system.guard.destroy.title",
  description: "app.api.v1.core.system.guard.destroy.description",
  category: "app.api.v1.core.system.guard.category",
  tags: ["app.api.v1.core.system.guard.destroy.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["guard:destroy", "guard-destroy", "guard:remove"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.guard.destroy.container.title",
      description: "app.api.v1.core.system.guard.destroy.container.description",
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
            "app.api.v1.core.system.guard.destroy.fields.projectPath.title",
          description:
            "app.api.v1.core.system.guard.destroy.fields.projectPath.description",
          placeholder:
            "app.api.v1.core.system.guard.destroy.fields.projectPath.placeholder",
          layout: { columns: 8 },
        },
        z.string().optional(),
      ),

      guardId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.system.guard.destroy.fields.guardId.title",
          description:
            "app.api.v1.core.system.guard.destroy.fields.guardId.description",
          placeholder:
            "app.api.v1.core.system.guard.destroy.fields.guardId.placeholder",
          layout: { columns: 4 },
        },
        z.string().optional(),
      ),

      force: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.guard.destroy.fields.force.title",
          description:
            "app.api.v1.core.system.guard.destroy.fields.force.description",
          layout: { columns: 4 },
        },
        z.boolean().optional().default(false),
      ),

      cleanupFiles: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.guard.destroy.fields.cleanupFiles.title",
          description:
            "app.api.v1.core.system.guard.destroy.fields.cleanupFiles.description",
          layout: { columns: 4 },
        },
        z.boolean().optional().default(true),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.guard.destroy.fields.dryRun.title",
          description:
            "app.api.v1.core.system.guard.destroy.fields.dryRun.description",
          layout: { columns: 4 },
        },
        z.boolean().optional().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.guard.destroy.fields.success.title",
        },
        z.boolean(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.guard.destroy.fields.output.title",
        },
        z.string(),
      ),

      destroyedGuards: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.guard.destroy.fields.destroyedGuards.title",
        },
        z
          .array(
            z.object({
              guardId: z.string(),
              username: z.string(),
              projectPath: z.string(),
              wasRunning: z.boolean(),
              filesRemoved: z.boolean(),
              userRemoved: z.boolean(),
            }),
          )
          .optional(),
      ),

      warnings: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.guard.destroy.fields.warnings.title",
        },
        z.array(z.string()).optional(),
      ),

      totalDestroyed: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.guard.destroy.fields.totalDestroyed.title",
        },
        z.number().optional(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.system.guard.destroy.errors.validation.title",
      description:
        "app.api.v1.core.system.guard.destroy.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.guard.destroy.errors.internal.title",
      description:
        "app.api.v1.core.system.guard.destroy.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.system.guard.destroy.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.guard.destroy.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.system.guard.destroy.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.guard.destroy.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.system.guard.destroy.errors.notFound.title",
      description:
        "app.api.v1.core.system.guard.destroy.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.guard.destroy.errors.internal.title",
      description:
        "app.api.v1.core.system.guard.destroy.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.guard.destroy.errors.internal.title",
      description:
        "app.api.v1.core.system.guard.destroy.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.guard.destroy.errors.internal.title",
      description:
        "app.api.v1.core.system.guard.destroy.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.system.guard.destroy.errors.conflict.title",
      description:
        "app.api.v1.core.system.guard.destroy.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.guard.destroy.success.title",
    description: "app.api.v1.core.system.guard.destroy.success.description",
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
    urlPathParams: undefined,
  },
});

const endpoints = { POST };
export default endpoints;

// Export types
export type GuardDestroyRequestInput = typeof POST.types.RequestInput;
export type GuardDestroyRequestOutput = typeof POST.types.RequestOutput;
export type GuardDestroyResponseInput = typeof POST.types.ResponseInput;
export type GuardDestroyResponseOutput = typeof POST.types.ResponseOutput;
