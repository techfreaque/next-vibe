/**
 * Task Execute API Definition
 * Trigger a single task by ID and receive the result synchronously
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
  requestResponseField,
  responseField,
  submitButton,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { CronTaskStatus } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { TASK_EXECUTE_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";
import { lazyCliWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-cli-widget";

const TaskExecuteContainer = lazyCliWidget(() =>
  import("./widget").then((m) => ({ default: m.TaskExecuteContainer })),
);

/**
 * POST /system/unified-interface/tasks/execute
 * Execute a single cron task by ID, returning the result synchronously.
 * - Admins can execute any task (including system tasks with userId=null)
 * - Customers can only execute their own tasks (userId = current user)
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "execute"],
  aliases: [TASK_EXECUTE_ALIAS, "task-execute"],
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER],

  title: "post.title",
  description: "post.description",
  icon: "play",
  category: "endpointCategories.tasks",
  subCategory: "endpointCategories.tasksCron",
  tags: ["tags.execute"],

  cli: {
    firstCliArgKey: "taskId",
  },

  fields: customWidgetObject({
    render: TaskExecuteContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === NAVIGATION ===
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // === REQUEST + RESPONSE FIELDS ===
      taskId: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.taskId.label",
        description: "post.fields.taskId.description",
        columns: 12,
        schema: z.string().min(1),
      }),

      // === SUBMIT BUTTON ===
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label",
        loadingText: "post.submitButton.loadingText",
        usage: { request: "data", response: true },
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.success.title",
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.message.title",
        schema: z.string().optional(),
      }),
      taskName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.taskName",
        schema: z.string(),
      }),
      executedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.executedAt",
        schema: z.string(),
      }),
      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.duration",
        schema: z.coerce.number(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.status",
        schema: z.string(),
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
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsaved.title",
      description: "post.errors.unsaved.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      basic: {
        taskId: "db-health",
      },
    },
    responses: {
      basic: {
        success: true,
        taskId: "db-health",
        taskName: "Database Health Check",
        executedAt: "2024-01-15T10:00:00.000Z",
        duration: 150,
        status: CronTaskStatus.COMPLETED,
      },
    },
  },
});

export type TaskExecuteRequestInput = typeof POST.types.RequestInput;
export type TaskExecuteRequestOutput = typeof POST.types.RequestOutput;
export type TaskExecuteResponseInput = typeof POST.types.ResponseInput;
export type TaskExecuteResponseOutput = typeof POST.types.ResponseOutput;

const taskExecuteEndpoints = {
  POST,
} as const;
export default taskExecuteEndpoints;
