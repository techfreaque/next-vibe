/**
 * Error Logs Cleanup API Definition
 * POST endpoint to prune old error logs (called by cron daily)
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

export const ERROR_LOGS_CLEANUP_ALIAS = "error-logs-cleanup" as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "error-monitor", "cleanup"],
  aliases: [ERROR_LOGS_CLEANUP_ALIAS],
  title: "errorMonitor.cleanup.post.title",
  description: "errorMonitor.cleanup.post.description",
  category: "app.endpointCategories.system",
  icon: "trash",
  tags: ["errorMonitor.tag" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "errorMonitor.cleanup.post.container.title",
    description: "errorMonitor.cleanup.post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      deletedCount: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "errorMonitor.cleanup.post.response.deletedCount",
        schema: z.number(),
      }),
      retentionDays: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "errorMonitor.cleanup.post.response.retentionDays",
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errorMonitor.post.errors.unauthorized.title",
      description: "errorMonitor.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errorMonitor.post.errors.forbidden.title",
      description: "errorMonitor.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errorMonitor.post.errors.server.title",
      description: "errorMonitor.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errorMonitor.post.errors.unknown.title",
      description: "errorMonitor.post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errorMonitor.post.errors.validation.title",
      description: "errorMonitor.post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errorMonitor.post.errors.unknown.title",
      description: "errorMonitor.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errorMonitor.post.errors.unknown.title",
      description: "errorMonitor.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errorMonitor.post.errors.unknown.title",
      description: "errorMonitor.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errorMonitor.post.errors.unknown.title",
      description: "errorMonitor.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "errorMonitor.cleanup.post.success.title",
    description: "errorMonitor.cleanup.post.success.description",
  },

  examples: {
    responses: {
      default: {
        deletedCount: 142,
        retentionDays: 7,
      },
    },
  },
});

const definitions = { POST };
export default definitions;
