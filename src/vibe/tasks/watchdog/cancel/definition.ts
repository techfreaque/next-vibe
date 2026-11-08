/**
 * Task Cancel - Endpoint Definition
 * POST: stop a running task (and its AI loop) and record the cancel, or mark
 * an incident resolved. Used by the Task Health widget.
 * Client+server safe. No server imports.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { TASK_WATCHDOG_CANCEL_ALIAS } from "../constants";
import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "tasks", "watchdog", "cancel"],
  aliases: [TASK_WATCHDOG_CANCEL_ALIAS],
  title: "cancel.post.title",
  titleShort: "cancel.post.titleShort",
  description: "cancel.post.description",
  icon: "x-circle",
  category: "devTools",
  subCategory: "tasksCron",
  tags: ["tags.taskWatchdog"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      taskId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "cancel.post.fields.taskId.label",
        description: "cancel.post.fields.taskId.description",
        placeholder: "cancel.post.fields.taskId.placeholder",
        schema: z.string().trim().min(1).max(200).optional(),
      }),
      incidentId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "cancel.post.fields.incidentId.label",
        description: "cancel.post.fields.incidentId.description",
        schema: z.uuid().optional(),
      }),
      cancelled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "cancel.post.response.cancelled",
        schema: z.boolean(),
      }),
      resolved: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "cancel.post.response.resolved",
        schema: z.boolean(),
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
    requests: {
      default: { taskId: "ai-run-research-nightly" },
      resolve: { incidentId: "8b3e4d6a-0b2c-4e3f-9d4a-5c6b7f8a9012" },
    },
    responses: {
      default: { cancelled: true, resolved: false },
      resolve: { cancelled: false, resolved: true },
    },
  },
});

export type TaskCancelRequestOutput = typeof POST.types.RequestOutput;
export type TaskCancelResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
