/**
 * Claude Code Run API Definition
 * POST endpoint that spawns `claude` CLI.
 * - interactiveMode:false (DEFAULT) → batch mode; output collected and returned.
 * - interactiveMode:true → live terminal session; result delivered back automatically when done.
 */

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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { lazyCliWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-cli-widget";
import { CLAUDE_CODE_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const ClaudeCodeWidget = lazyCliWidget(() =>
  import("./widget").then((m) => ({ default: m.ClaudeCodeWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "claude-code"],
  title: "claudeCode.run.post.title",
  description: "claudeCode.run.post.description",
  dynamicTitle: ({ request }) => {
    if (request?.prompt) {
      const prompt =
        request.prompt.length > 40
          ? `${request.prompt.slice(0, 40)}...`
          : request.prompt;
      return {
        message: "claudeCode.run.post.dynamicTitle" as const,
        messageParams: { prompt },
      };
    }
    return undefined;
  },
  icon: "terminal",
  category: "app.endpointCategories.ai",
  tags: ["claudeCode.tags.tasks" as const],
  allowedRoles: [UserRole.ADMIN],
  aliases: [CLAUDE_CODE_ALIAS, "claude"],

  // No stream timeout — claude-code sessions can run indefinitely
  streamTimeoutMs: 0,

  cli: {
    firstCliArgKey: "prompt",
  },

  fields: customWidgetObject({
    render: ClaudeCodeWidget,
    usage: { request: "data", response: true },
    children: {
      // ── Request fields ──────────────────────────────────────────────────
      prompt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "claudeCode.run.post.fields.prompt.label",
        description: "claudeCode.run.post.fields.prompt.description",
        columns: 12,
        schema: z.string().min(1),
      }),
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "claudeCode.run.post.fields.model.label",
        description: "claudeCode.run.post.fields.model.description",
        columns: 6,
        options: [
          {
            value: "claude-sonnet-4-6",
            label: "claudeCode.run.post.fields.model.options.sonnet" as const,
          },
          {
            value: "claude-opus-4-6",
            label: "claudeCode.run.post.fields.model.options.opus" as const,
          },
          {
            value: "claude-haiku-4-5-20251001",
            label: "claudeCode.run.post.fields.model.options.haiku" as const,
          },
        ],
        schema: z
          .enum([
            "claude-sonnet-4-6",
            "claude-opus-4-6",
            "claude-haiku-4-5-20251001",
          ])
          .default("claude-sonnet-4-6"),
      }),

      taskTitle: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "claudeCode.run.post.fields.taskTitle.label",
        description: "claudeCode.run.post.fields.taskTitle.description",
        columns: 12,
        schema: z.string().optional(),
      }),
      interactiveMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "claudeCode.run.post.fields.interactiveMode.label",
        description: "claudeCode.run.post.fields.interactiveMode.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // ── Response fields ─────────────────────────────────────────────────
      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "claudeCode.run.post.fields.output.label",
        schema: z.string(),
      }),
      durationMs: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "claudeCode.run.post.fields.durationMs.label",
        schema: z.number(),
      }),
      taskId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().optional(),
      }),
      hint: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().optional(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "claudeCode.run.post.errors.validation.title",
      description: "claudeCode.run.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "claudeCode.run.post.errors.unauthorized.title",
      description: "claudeCode.run.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "claudeCode.run.post.errors.internal.title",
      description: "claudeCode.run.post.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "claudeCode.run.post.errors.forbidden.title",
      description: "claudeCode.run.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "claudeCode.run.post.errors.notFound.title",
      description: "claudeCode.run.post.errors.notFound.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "claudeCode.run.post.errors.network.title",
      description: "claudeCode.run.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "claudeCode.run.post.errors.unknown.title",
      description: "claudeCode.run.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "claudeCode.run.post.errors.unsaved.title",
      description: "claudeCode.run.post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "claudeCode.run.post.errors.conflict.title",
      description: "claudeCode.run.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "claudeCode.run.post.success.title",
    description: "claudeCode.run.post.success.description",
  },

  examples: {
    requests: {
      default: {
        prompt:
          "Add a new feature to the claude-code endpoint that tracks how many times it has been called.",
        interactiveMode: false,
      },
      batch: {
        prompt:
          "Read src/app/api/[locale]/system/agent/claude-code/repository.ts and summarize what it does in 2 sentences.",
        interactiveMode: false,
      },
      interactive: {
        prompt: "Fix the login bug — check the auth flow and patch it.",
        interactiveMode: true,
        taskTitle: "Fix login bug",
      },
    },
    responses: {
      default: {
        output: "",
        durationMs: 184200,
      },
      batch: {
        output:
          "The repository spawns a `claude` CLI process in either interactive or batch mode. Interactive mode inherits the terminal for live back-and-forth; batch mode uses `-p` print mode and collects all output before returning.",
        durationMs: 8342,
      },
      escalated: {
        output: "",
        durationMs: 0,
        taskId: "escalated-1234567890-abc123",
        hint: "Result will be injected into this thread when complete. Do NOT call wait-for-task.",
      },
    },
  },
});

export const endpoints = { POST };

export type RunRequestOutput = typeof POST.types.RequestOutput;
export type RunResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
