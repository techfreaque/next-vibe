import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { WidgetDataSchema } from "next-vibe/core/utils/json";
import { scopedTranslation } from "next-vibe/execute-tool/await-task/i18n";
import { UserRole } from "next-vibe/identity/roles/enum";
import { taskInputSchema } from "next-vibe/tasks/cron/db";
import { CronTaskStatus, CronTaskStatusDB } from "next-vibe/tasks/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { AWAIT_TASK_ALIAS } from "./constants";

const AwaitTaskWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.AwaitTaskWidget,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "execute-tool", "await-task"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "clock",
  dynamicTitle: ({ response }) => {
    if (response?.originalToolName) {
      return {
        message: "post.dynamicTitle" as const,
        messageParams: { toolName: response.originalToolName },
      };
    }
    return undefined;
  },
  statusBadge: {
    loading: {
      label: "post.status.waiting",
      color: "bg-blue-500/10 text-blue-500",
    },
    done: {
      label: "post.status.complete",
      color: "bg-green-500/10 text-green-500",
    },
  },
  category: "devTools",
  subCategory: "tasksCron",
  tags: ["tags.awaitTask" as const],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ] as const,
  aliases: [AWAIT_TASK_ALIAS, "wait-for-task"],
  // Awaiting an arbitrary task is unbounded by nature (media generation can
  // run for many minutes) — cross-instance callers must keep their inline
  // WAIT open instead of falling to the 90s default.
  timeoutMs: 0,

  fields: customWidgetObject({
    render: AwaitTaskWidget,
    noFormElement: true,
    usage: { request: "data", response: true } as const,
    children: {
      taskId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.string().min(1),
      }),

      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.enum(CronTaskStatusDB),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        schema: WidgetDataSchema.optional(),
      }),
      waiting: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),
      originalToolName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().optional(),
      }),
      originalArgs: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        schema: taskInputSchema.optional(),
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
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        taskId: "local-bg-1234567890-abc123",
      },
    },
    responses: {
      immediate: {
        status: CronTaskStatus.COMPLETED,
        result: { data: "task result here" },
        waiting: false,
      },
      waiting: {
        status: CronTaskStatus.PENDING,
        waiting: true,
      },
    },
  },
});

export const endpoints = { POST };

export type AwaitTaskRequestOutput = typeof POST.types.RequestOutput;
export type AwaitTaskResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
