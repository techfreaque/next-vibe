import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { WidgetDataSchema } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { taskInputSchema } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import {
  CronTaskStatus,
  CronTaskStatusDB,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const AwaitTaskWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.AwaitTaskWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "execute-tool", "await-task"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "clock",
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
  defaultAiPinned: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  aliases: ["await-task", "wait-for-task"],

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
