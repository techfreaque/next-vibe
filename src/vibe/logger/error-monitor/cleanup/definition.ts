/**
 * Error Logs Cleanup API Definition
 * POST endpoint to prune old error logs (called by cron daily)
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/tasks/i18n";
import { objectField, responseField } from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { ERROR_LOGS_CLEANUP_ALIAS } from "./constants";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "logger", "error-monitor", "cleanup"],
  aliases: [ERROR_LOGS_CLEANUP_ALIAS],
  title: "errorMonitor.cleanup.post.title",
  titleShort: "errorMonitor.cleanup.post.titleShort",
  description: "errorMonitor.cleanup.post.description",
  category: "devTools",
  subCategory: "tasksMonitoring",
  icon: "trash",
  tags: ["errorMonitor.tag" as const],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_OFF,
    UserRole.SKILL_OFF,
  ],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "errorMonitor.cleanup.post.container.title",
    description: "errorMonitor.cleanup.post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      deletedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "errorMonitor.cleanup.post.response.deletedCount",
        schema: z.number(),
      }),
      deletedByTime: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "errorMonitor.cleanup.post.response.deletedByTime",
        schema: z.number(),
      }),
      deletedByCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "errorMonitor.cleanup.post.response.deletedByCount",
        schema: z.number(),
      }),
      retentionDays: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "errorMonitor.cleanup.post.response.retentionDays",
        schema: z.number(),
      }),
      maxRows: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "errorMonitor.cleanup.post.response.maxRows",
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
        deletedByTime: 120,
        deletedByCount: 22,
        retentionDays: 180,
        maxRows: 100_000,
      },
    },
  },
});

export type CleanupPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
