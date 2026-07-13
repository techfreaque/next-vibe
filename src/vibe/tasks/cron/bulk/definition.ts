/**
 * Cron Bulk Action API Definition
 * Perform a bulk action on multiple cron tasks at once
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/tasks/cron/bulk/i18n";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

const BULK_ACTIONS = ["delete", "enable", "disable", "run"] as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "tasks", "cron", "bulk"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "list",
  category: "devTools",
  subCategory: "tasksCron",
  tags: ["post.fields.ids.label" as const],
  allowedRoles: [
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      ids: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.ids.label",
        description: "post.fields.ids.description",
        columns: 12,
        schema: z.array(z.string().min(1)).min(1).max(500),
      }),

      action: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.action.label",
        description: "post.fields.action.description",
        columns: 6,
        options: BULK_ACTIONS.map((a) => ({
          value: a,
          label: `post.fields.action.options.${a}` as const,
        })),
        schema: z.enum(BULK_ACTIONS),
      }),

      succeeded: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.succeeded.label",
        schema: z.number(),
      }),

      failed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.failed.label",
        schema: z.number(),
      }),

      errors: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.fields.ids.label",
              schema: z.string(),
            }),
            message: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.fields.errors.label",
              schema: z.string(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsaved.title",
      description: "post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "post.success.completed.title",
    description: "post.success.completed.description",
  },

  examples: {
    requests: {
      disable: {
        ids: ["task-abc", "task-def"],
        action: "disable",
      },
      delete: {
        ids: ["task-xyz"],
        action: "delete",
      },
    },
    responses: {
      disable: {
        succeeded: 2,
        failed: 0,
        errors: [],
      },
      partial: {
        succeeded: 1,
        failed: 1,
        errors: [{ id: "task-xyz", message: "Task not found" }],
      },
    },
  },
});

export const endpoints = { POST };

export type CronBulkRequestInput = typeof POST.types.RequestInput;
export type CronBulkRequestOutput = typeof POST.types.RequestOutput;
export type CronBulkResponseInput = typeof POST.types.ResponseInput;
export type CronBulkResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
