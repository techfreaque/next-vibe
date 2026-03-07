/**
 * Task Pull Definition (cron-only)
 * Internal endpoint that pulls new tasks from remote Thea.
 * Not exposed to external callers — used only by the cron runner.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "task-sync", "pull"],
  title: "taskSync.pull.post.title" as const,
  description: "taskSync.pull.post.description" as const,
  icon: "download",
  category: "app.endpointCategories.system",
  tags: ["tags.tasks" as const],
  aliases: ["sync-pull", "task-pull"] as const,
  allowedRoles: [UserRole.ADMIN],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      pulled: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "taskSync.pull.post.errors.validation.title" as const,
      description: "taskSync.pull.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "taskSync.pull.post.errors.unauthorized.title" as const,
      description:
        "taskSync.pull.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "taskSync.pull.post.errors.internal.title" as const,
      description: "taskSync.pull.post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "taskSync.pull.post.errors.forbidden.title" as const,
      description: "taskSync.pull.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "taskSync.pull.post.errors.notFound.title" as const,
      description: "taskSync.pull.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "taskSync.pull.post.errors.network.title" as const,
      description: "taskSync.pull.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "taskSync.pull.post.errors.unknown.title" as const,
      description: "taskSync.pull.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "taskSync.pull.post.errors.unsaved.title" as const,
      description: "taskSync.pull.post.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "taskSync.pull.post.errors.conflict.title" as const,
      description: "taskSync.pull.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "taskSync.pull.post.success.title" as const,
    description: "taskSync.pull.post.success.description" as const,
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
