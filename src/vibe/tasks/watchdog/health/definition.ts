/**
 * Task Health - Endpoint Definition
 * GET: running tasks (age, turns, tool calls, spend), recent failures and
 * open incidents. The widget carries the cancel / resolve actions.
 * Client+server safe. No server imports.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import { responseField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { TASK_WATCHDOG_HEALTH_ALIAS } from "../constants";
import { TaskIncidentTypeDB } from "../enum";
import { scopedTranslation } from "../i18n";

const TaskHealthWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.TaskHealthWidget })),
);

const runningTaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  routeId: z.string(),
  goal: z.string().nullable(),
  startedAt: z.string(),
  ageMs: z.number(),
  limitMs: z.number(),
  turns: z.number(),
  toolCalls: z.number(),
  spend: z.number(),
});

const failureSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  name: z.string(),
  status: z.string(),
  finishedAt: z.string(),
  durationMs: z.number().nullable(),
  lastError: z.string().nullable(),
});

const incidentSchema = z.object({
  id: z.uuid(),
  taskId: z.string(),
  taskName: z.string(),
  type: z.enum(TaskIncidentTypeDB),
  reason: z.string(),
  createdAt: z.string(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "tasks", "watchdog", "health"],
  aliases: [TASK_WATCHDOG_HEALTH_ALIAS],
  title: "health.get.title",
  titleShort: "health.get.titleShort",
  description: "health.get.description",
  icon: "activity",
  category: "devTools",
  subCategory: "tasksCron",
  tags: ["tags.taskWatchdog"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: TaskHealthWidget,
    usage: { response: true } as const,
    children: {
      running: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "health.get.response.running",
        schema: z.array(runningTaskSchema),
      }),
      failures: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "health.get.response.failures",
        schema: z.array(failureSchema),
      }),
      incidents: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "health.get.response.incidents",
        schema: z.array(incidentSchema),
      }),
      daySpent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "health.get.response.daySpent",
        schema: z.number(),
      }),
      dayCap: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "health.get.response.dayCap",
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
        running: [
          {
            id: "research-nightly",
            name: "Nightly research agent",
            routeId: "ai-run",
            goal: "research",
            startedAt: "2026-11-07T02:00:00.000Z",
            ageMs: 540000,
            limitMs: 900000,
            turns: 18,
            toolCalls: 42,
            spend: 12.4,
          },
        ],
        failures: [
          {
            id: "5a1f3c52-6b0e-4b7a-9d6e-0c5d6f1e2a11",
            taskId: "model-prices",
            name: "Model price sync",
            status: "status.failed",
            finishedAt: "2026-11-07T01:00:00.000Z",
            durationMs: 1200,
            lastError: "Provider returned 503",
          },
        ],
        incidents: [
          {
            id: "8b3e4d6a-0b2c-4e3f-9d4a-5c6b7f8a9012",
            taskId: "research-nightly",
            taskName: "Nightly research agent",
            type: "enums.incidentType.budget",
            reason: 'task cap "*" reached: 100 of 100 credits',
            createdAt: "2026-11-06T03:10:00.000Z",
          },
        ],
        daySpent: 212.5,
        dayCap: 1000,
      },
    },
  },
});

export type TaskHealthGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
