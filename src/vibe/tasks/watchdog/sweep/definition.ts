/**
 * Task Watchdog Sweep - Endpoint Definition
 * POST: one watchdog pass over running tasks. Registered as a cron task
 * (every minute) in ../task.ts.
 * Client+server safe. No server imports.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../i18n";
import { TASK_WATCHDOG_SWEEP_ALIAS } from "../constants";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "tasks", "watchdog", "sweep"],
  aliases: [TASK_WATCHDOG_SWEEP_ALIAS],
  title: "sweep.post.title",
  titleShort: "sweep.post.titleShort",
  description: "sweep.post.description",
  icon: "shield",
  category: "devTools",
  subCategory: "tasksCron",
  tags: ["tags.taskWatchdog"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "sweep.post.container.title",
    description: "sweep.post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      checked: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "sweep.post.response.checked",
        schema: z.number(),
      }),
      cancelled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "sweep.post.response.cancelled",
        schema: z.number(),
      }),
      orphaned: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "sweep.post.response.orphaned",
        schema: z.number(),
      }),
      loops: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "sweep.post.response.loops",
        schema: z.number(),
      }),
      incidents: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "sweep.post.response.incidents",
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    responses: {
      default: {
        checked: 3,
        cancelled: 1,
        orphaned: 0,
        loops: 0,
        incidents: 1,
      },
    },
  },
});

export type TaskWatchdogSweepResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
