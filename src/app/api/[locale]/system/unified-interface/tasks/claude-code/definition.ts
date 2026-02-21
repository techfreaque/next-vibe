/**
 * Claude Code Run API Definition
 * POST endpoint that spawns `claude -p` CLI with a prompt, blocks until done, returns output.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "claude-code"],
  title: "app.api.system.unifiedInterface.tasks.claudeCode.run.post.title",
  description:
    "app.api.system.unifiedInterface.tasks.claudeCode.run.post.description",
  icon: "terminal",
  category: "app.api.system.category",
  tags: [
    "app.api.system.unifiedInterface.tasks.claudeCode.tags.tasks" as const,
  ],
  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // Request
      prompt: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z.string().min(1),
      }),
      model: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),
      maxBudgetUsd: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),
      systemPrompt: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z.string().optional(),
      }),
      allowedTools: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.string().optional(),
      }),
      workingDir: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),
      timeoutMs: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        columns: 6,
        schema: z.coerce.number().default(600000),
      }),

      // Response
      output: responseField({
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      exitCode: responseField({
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
      durationMs: responseField({
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.internal.title",
      description:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.notFound.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.network.title",
      description:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.unsaved.title",
      description:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.conflict.description",
    },
  },

  successTypes: {
    title:
      "app.api.system.unifiedInterface.tasks.claudeCode.run.post.success.title",
    description:
      "app.api.system.unifiedInterface.tasks.claudeCode.run.post.success.description",
  },

  examples: {
    requests: {
      default: {
        prompt: "What is 2+2?",
        timeoutMs: 600000,
      },
    },
    responses: {
      default: {
        output: "2+2 = 4",
        exitCode: 0,
        durationMs: 5000,
      },
    },
  },
});

export const endpoints = { POST };

export type RunRequestOutput = typeof POST.types.RequestOutput;
export type RunResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
