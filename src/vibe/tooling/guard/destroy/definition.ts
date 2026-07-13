/**
 * Guard Destroy Endpoint Definition
 * Destroys guard environments and cleans up resources
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/tooling/guard/destroy/i18n";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "tooling", "guard", "destroy"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "devTools",
  subCategory: "serverGuard",
  tags: ["tag"],
  icon: "shield",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["guard:destroy", "guard-destroy", "guard:remove"],

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
        columns: 8,
        schema: z.string().optional(),
      }),

      guardId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.guardId.title",
        description: "fields.guardId.description",
        placeholder: "fields.guardId.placeholder",
        columns: 4,
        schema: z.string().optional(),
      }),

      force: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.force.title",
        description: "fields.force.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      cleanupFiles: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.cleanupFiles.title",
        description: "fields.cleanupFiles.description",
        columns: 4,
        schema: z.boolean().optional().default(true),
      }),

      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.dryRun.title",
        description: "fields.dryRun.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.success.title",
        schema: z.boolean(),
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.output.title",
        schema: z.string(),
      }),

      destroyedGuards: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "fields.destroyedGuards.title",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 3,
          usage: { response: true },
          children: {
            guardId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.guardId.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            username: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.username.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            projectPath: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.projectPath.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            wasRunning: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.wasRunning.title",
              fieldType: FieldDataType.BOOLEAN,
              schema: z.boolean(),
            }),
            filesRemoved: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.filesRemoved.title",
              fieldType: FieldDataType.BOOLEAN,
              schema: z.boolean(),
            }),
            userRemoved: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "fields.userRemoved.title",
              fieldType: FieldDataType.BOOLEAN,
              schema: z.boolean(),
            }),
          },
        }),
      }),

      warnings: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.warnings.title",
        schema: z.array(z.string()).optional(),
      }),

      totalDestroyed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.totalDestroyed.title",
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
