/**
 * Cron Bulk Action API Definition
 * Perform a bulk action on multiple cron tasks at once
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

export const BULK_ACTIONS = ["delete", "enable", "disable", "run"] as const;
export type BulkAction = (typeof BULK_ACTIONS)[number];

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "cron", "bulk"],
  title: "post.title",
  description: "post.description",
  icon: "list",
  category: "endpointCategories.systemTasks",
  tags: ["post.fields.ids.label" as const],
  allowedRoles: [
    UserRole.CUSTOMER,
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
        content: "post.fields.succeeded.label",
        schema: z.number(),
      }),

      failed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.failed.label",
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
              content: "post.fields.ids.label",
              schema: z.string(),
            }),
            message: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.fields.errors.label",
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
