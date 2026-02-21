/**
 * Task Sync API Definition
 * POST endpoint for syncing tasks between remote and local Thea instances.
 * Accepts PUBLIC role (passes middleware), validates API key in handler.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
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
  path: ["system", "unified-interface", "tasks", "task-sync"],
  title: "app.api.system.unifiedInterface.tasks.taskSync.post.title",
  description:
    "app.api.system.unifiedInterface.tasks.taskSync.post.description",
  icon: "refresh-cw",
  category: "app.api.system.category",
  tags: [
    "app.api.system.unifiedInterface.tasks.claudeCode.tags.tasks" as const,
  ],
  allowedRoles: [UserRole.PUBLIC],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // Request
      apiKey: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.string().min(1),
      }),
      completionsJson: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z.string().optional(),
      }),

      // Response
      tasksJson: responseField({
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      synced: responseField({
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
      completionsProcessed: responseField({
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.internal.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.notFound.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.network.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.unsaved.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.system.unifiedInterface.tasks.taskSync.post.success.title",
    description:
      "app.api.system.unifiedInterface.tasks.taskSync.post.success.description",
  },

  examples: {
    requests: {
      default: {
        apiKey: "your-api-key",
      },
    },
    responses: {
      default: {
        tasksJson: "[]",
        synced: 0,
        completionsProcessed: 0,
      },
    },
  },
});

export const endpoints = { POST };

export type SyncRequestOutput = typeof POST.types.RequestOutput;
export type SyncResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
