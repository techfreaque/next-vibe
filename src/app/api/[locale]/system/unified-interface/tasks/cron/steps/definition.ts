/**
 * Cron Task Steps API Definition
 * PUT endpoint for updating the step sequence of a cron-steps task
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
  widgetObjectField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CronTaskPriority, TaskCategory, TaskOutputModeDB } from "../../enum";
import { cronTaskResponseSchema } from "../tasks/definition";
import { CronTaskStepsContainer } from "./widget";

export { CronTaskStepsContainer };

/**
 * Zod schema for a single "call" step
 */
export const cronCallStepSchema = z.object({
  type: z.literal("app.api.system.unifiedInterface.tasks.step.call"),
  routeId: z.string().min(1),
  args: z.record(z.string(), z.unknown()).default({}),
  parallel: z.boolean().optional(),
});

/**
 * Zod schema for a single "ai_agent" step
 */
export const cronAiAgentStepSchema = z.object({
  type: z.literal("app.api.system.unifiedInterface.tasks.step.aiAgent"),
  model: z.string().min(1),
  character: z.string().min(1),
  prompt: z.string().min(1),
  maxTurns: z.coerce.number().int().positive().optional(),
  threadMode: z.enum([
    "app.api.system.unifiedInterface.tasks.step.threadMode.none",
    "app.api.system.unifiedInterface.tasks.step.threadMode.new",
    "app.api.system.unifiedInterface.tasks.step.threadMode.append",
  ]),
  threadId: z.string().optional(),
  folderId: z.string().optional(),
  autoAppendAfterFirst: z.boolean().optional(),
  availableTools: z.array(z.string()).optional(),
});

/**
 * Union schema for any CronStep
 */
export const cronStepSchema = z.discriminatedUnion("type", [
  cronCallStepSchema,
  cronAiAgentStepSchema,
]);

export type CronStepInput = z.infer<typeof cronStepSchema>;

/**
 * PUT /cron/[id]/steps — Replace the steps array stored in defaultConfig
 */
const { PUT } = createEndpoint({
  method: Methods.PUT,
  path: ["system", "unified-interface", "tasks", "cron", "steps"],
  title: "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.title",
  description:
    "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.description",
  icon: "list",
  category: "app.api.system.unifiedInterface.tasks.category",
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ],
  tags: ["app.api.system.unifiedInterface.tasks.cronSystem.steps.put.title"],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.container.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data&urlPathParams", response: true },
    {
      actions: widgetObjectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "2",
          noCard: true,
        },
        { request: "data&urlPathParams", response: true },
        {
          backButton: backButton({
            inline: true,
            usage: { response: true, request: "data&urlPathParams" },
          }),
          submitButton: submitButton({
            inline: true,
            className: "ml-auto",
            label:
              "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.submitButton.label" as const,
            loadingText:
              "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.submitButton.loadingText" as const,
            usage: { response: true, request: "data&urlPathParams" },
          }),
        },
      ),

      // URL path parameter
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.fields.id.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.fields.id.description",
        schema: z.string(),
        hidden: true,
      }),

      // Steps JSON editor
      steps: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.fields.steps.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.fields.steps.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.fields.steps.placeholder",
        columns: 12,
        schema: z.array(cronStepSchema),
      }),

      // Response
      task: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.response.task.title",
        schema: cronTaskResponseSchema,
      }),

      success: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.response.success.title",
        schema: z.boolean(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.internal.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.network.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.unsaved.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.conflict.description",
    },
  },
  successTypes: {
    title:
      "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.success.updated.title",
    description:
      "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.success.updated.description",
  },
  examples: {
    urlPathParams: {
      default: { id: "task-123" },
    },
    requests: {
      default: {
        steps: [
          {
            type: "app.api.system.unifiedInterface.tasks.step.call" as const,
            routeId: "some-endpoint",
            args: {},
          },
        ],
      },
    },
    responses: {
      default: {
        task: {
          id: "task-123",
          routeId: "cron-steps",
          displayName: "My Steps Task",
          description: null,
          version: "1.0.0",
          category: TaskCategory.SYSTEM,
          schedule: "0 * * * *",
          timezone: "UTC",
          enabled: true,
          priority: CronTaskPriority.MEDIUM,
          timeout: null,
          retries: null,
          retryDelay: null,
          defaultConfig: {
            steps: [
              {
                type: "app.api.system.unifiedInterface.tasks.step.call",
                routeId: "some-endpoint",
                args: {},
              },
            ],
          },
          outputMode: TaskOutputModeDB[0],
          notificationTargets: [],
          lastExecutedAt: null,
          lastExecutionStatus: null,
          lastExecutionError: null,
          lastExecutionDuration: null,
          nextExecutionAt: null,
          executionCount: 0,
          successCount: 0,
          errorCount: 0,
          averageExecutionTime: null,
          tags: [],
          userId: null,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
        success: true,
      },
    },
  },
});

export const endpoints = { PUT };

export type CronTaskStepsPutRequestInput = typeof PUT.types.RequestInput;
export type CronTaskStepsPutRequestOutput = typeof PUT.types.RequestOutput;
export type CronTaskStepsPutResponseInput = typeof PUT.types.ResponseInput;
export type CronTaskStepsPutResponseOutput = typeof PUT.types.ResponseOutput;

export default endpoints;
