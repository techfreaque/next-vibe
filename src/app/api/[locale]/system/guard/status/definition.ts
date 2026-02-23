/**
 * Guard Status Endpoint Definition
 * Check status and list guard environments
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseArrayFieldNew,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
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
  path: ["system", "guard", "status"],
  title: "post.title",
  description: "post.description",
  category: "category",
  tags: ["post.tag"],
  icon: "eye",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["guard:status", "guard-status"],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title",
    description: "post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      projectPath: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.projectPath.title",
        description: "post.fields.projectPath.description",
        placeholder: "post.fields.projectPath.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      guardId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.guardId.title",
        description: "post.fields.guardId.description",
        placeholder: "post.fields.guardId.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      listAll: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.listAll.title",
        description: "post.fields.listAll.description",
        columns: 12,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.success.title",
        schema: z.boolean(),
      }),

      output: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.output.title",
        schema: z.string(),
      }),

      guards: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.fields.guards.title",
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 4,
          usage: { response: true },
          children: {
            guardId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.fields.guardId.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            username: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.fields.username.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            projectPath: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.fields.projectPath.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            status: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.fields.status.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            createdAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.fields.createdAt.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            securityLevel: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.fields.securityLevel.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            isolationMethod: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.fields.isolationMethod.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            isRunning: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.fields.isRunning.title",
              fieldType: FieldDataType.BOOLEAN,
              schema: z.boolean(),
            }),
            userHome: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.fields.userHome.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string().optional(),
            }),
          },
        }),
      }),

      totalGuards: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.totalGuards.title",
        schema: z.coerce.number().optional(),
      }),

      activeGuards: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.activeGuards.title",
        schema: z.coerce.number().optional(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
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
  },
});

const endpoints = { POST };
export default endpoints;
