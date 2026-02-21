/**
 * Task Pull Definition (cron-only)
 * Internal endpoint that pulls new tasks from remote Thea.
 * Not exposed to external callers — used only by the cron runner.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "task-sync", "pull"],
  title: "app.api.system.unifiedInterface.tasks.taskSync.pull.post.title",
  description:
    "app.api.system.unifiedInterface.tasks.taskSync.pull.post.description",
  icon: "download",
  category: "app.api.system.category",
  tags: [
    "app.api.system.unifiedInterface.tasks.claudeCode.tags.tasks" as const,
  ],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { response: true },
    {
      pulled: responseField({
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.internal.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.notFound.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.network.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.unsaved.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.tasks.taskSync.pull.post.errors.conflict.description",
    },
  },

  successTypes: {
    title:
      "app.api.system.unifiedInterface.tasks.taskSync.pull.post.success.title",
    description:
      "app.api.system.unifiedInterface.tasks.taskSync.pull.post.success.description",
  },

  examples: {
    responses: {
      default: {
        pulled: 0,
      },
    },
  },
});

export const endpoints = { POST };
export default endpoints;
