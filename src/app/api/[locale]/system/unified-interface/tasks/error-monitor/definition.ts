/**
 * Error Monitor API Definition
 * POST endpoint to scan chat messages for error patterns (called by cron)
 * Privacy-first: never reads message content or thread titles
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedResponseArrayFieldNew,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

export const ERROR_MONITOR_ALIAS = "error-monitor" as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "error-monitor"],
  aliases: [ERROR_MONITOR_ALIAS],
  title: "errorMonitor.post.title",
  description: "errorMonitor.post.description",
  category: "app.endpointCategories.system",
  icon: "alert-triangle",
  tags: ["errorMonitor.tag" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "errorMonitor.post.container.title",
    description: "errorMonitor.post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      errorsFound: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "errorMonitor.post.response.errorsFound",
        schema: z.number(),
      }),
      threadsScanned: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "errorMonitor.post.response.threadsScanned",
        schema: z.number(),
      }),
      scanWindowFrom: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "errorMonitor.post.response.scanWindowFrom",
        schema: z.string(),
      }),
      scanWindowTo: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "errorMonitor.post.response.scanWindowTo",
        schema: z.string(),
      }),
      patterns: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "errorMonitor.post.response.patternType",
          description: "errorMonitor.post.response.patternType",
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            type: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "errorMonitor.post.response.patternType",
              schema: z.string(),
            }),
            count: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "errorMonitor.post.response.patternCount",
              schema: z.number(),
            }),
            threadIds: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "errorMonitor.post.response.patternThreadIds",
              schema: z.array(z.string()),
            }),
            model: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "errorMonitor.post.response.patternModel",
              schema: z.string().nullable(),
            }),
            tool: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "errorMonitor.post.response.patternTool",
              schema: z.string().nullable(),
            }),
            firstSeen: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "errorMonitor.post.response.patternFirstSeen",
              schema: z.string(),
            }),
            lastSeen: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "errorMonitor.post.response.patternLastSeen",
              schema: z.string(),
            }),
          },
        }),
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
    title: "errorMonitor.post.success.title",
    description: "errorMonitor.post.success.description",
  },

  examples: {
    responses: {
      default: {
        errorsFound: 3,
        threadsScanned: 42,
        scanWindowFrom: "2026-02-26T18:00:00.000Z",
        scanWindowTo: "2026-02-26T21:00:00.000Z",
        patterns: [
          {
            type: "tool_failure:web-search",
            count: 2,
            threadIds: ["abc123"],
            model: null,
            tool: "web-search",
            firstSeen: "2026-02-26T18:23:00.000Z",
            lastSeen: "2026-02-26T20:45:00.000Z",
          },
          {
            type: "model_error",
            count: 1,
            threadIds: ["def456"],
            model: "claude-sonnet-4-5-20250514",
            tool: null,
            firstSeen: "2026-02-26T19:12:00.000Z",
            lastSeen: "2026-02-26T19:12:00.000Z",
          },
        ],
      },
    },
  },
});

export type ErrorMonitorPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
