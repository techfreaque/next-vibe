/**
 * Coding Agent API Definition
 *
 * Unified POST endpoint supporting:
 * - Batch & interactive sessions (Claude Code, OpenCode, Codex, Antigravity)
 * - Named persistent sub-agents with conversation resume, mid-turn steering
 *   (coding-agent-say), interrupt (coding-agent-interrupt) and status/tail
 *   inspection (coding-agent-list).
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  requestField,
  responseField,
  submitButton,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { CODING_AGENT_ALIAS } from "./constants";
import {
  CodingAgentProvider,
  codingAgentProviderOptions,
  codingAgentProviderSchema,
  sandboxOptions,
  sandboxSchema,
  successfulStatusSchema,
} from "./enum";
import { codingAgentErrorTypes, codingAgentRoles } from "./fields";
import { scopedTranslation } from "./i18n";

const CodingAgentWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CodingAgentWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "coding-agent"],
  title: "codingAgent.run.post.title",
  titleShort: "codingAgent.run.post.titleShort",
  description: "codingAgent.run.post.description",
  dynamicTitle: ({ request }) => {
    const label = request?.name || request?.prompt;
    if (label) {
      const prompt = label.length > 40 ? `${label.slice(0, 40)}...` : label;
      return {
        message: "codingAgent.run.post.dynamicTitle" as const,
        messageParams: { prompt },
      };
    }
    return undefined;
  },
  icon: "terminal",
  category: "ai",
  subCategory: "Tools",
  tags: ["codingAgent.tags.tasks" as const],
  allowedRoles: codingAgentRoles,
  defaultAiPinned: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,
  aliases: [
    CODING_AGENT_ALIAS,
    "subagent-run",
    "claude-code",
    "claude",
    "open-code",
    "codex",
    "antigravity",
  ],

  // No timeout - sessions can run indefinitely
  timeoutMs: 0,

  cli: {
    firstCliArgKey: "name",
  },

  fields: customWidgetObject({
    render: CodingAgentWidget,
    usage: { request: "data", response: true },
    children: {
      // ── Request fields ──────────────────────────────────────────────────
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "codingAgent.run.post.fields.name.label",
        description: "codingAgent.run.post.fields.name.description",
        columns: 6,
        schema: z.string().optional(),
      }),
      prompt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "codingAgent.run.post.fields.prompt.label",
        description: "codingAgent.run.post.fields.prompt.description",
        columns: 12,
        schema: z.string().optional(),
      }),
      promptFile: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "codingAgent.run.post.fields.promptFile.label",
        description: "codingAgent.run.post.fields.promptFile.description",
        columns: 12,
        schema: z.string().optional(),
      }),
      provider: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "codingAgent.run.post.fields.provider.label",
        description: "codingAgent.run.post.fields.provider.description",
        columns: 6,
        options: codingAgentProviderOptions,
        schema: codingAgentProviderSchema.optional(),
      }),
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "codingAgent.run.post.fields.model.label",
        description: "codingAgent.run.post.fields.model.description",
        columns: 6,
        schema: z.string().optional(),
      }),
      effort: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "codingAgent.run.post.fields.effort.label",
        description: "codingAgent.run.post.fields.effort.description",
        columns: 6,
        schema: z.string().optional(),
      }),
      sandbox: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "codingAgent.run.post.fields.sandbox.label",
        description: "codingAgent.run.post.fields.sandbox.description",
        columns: 6,
        options: sandboxOptions,
        schema: sandboxSchema.optional(),
      }),
      cwd: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "codingAgent.run.post.fields.cwd.label",
        description: "codingAgent.run.post.fields.cwd.description",
        columns: 12,
        schema: z.string().optional(),
      }),
      fresh: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "codingAgent.run.post.fields.fresh.label",
        description: "codingAgent.run.post.fields.fresh.description",
        columns: 6,
        schema: z.boolean().optional(),
      }),
      taskTitle: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "codingAgent.run.post.fields.taskTitle.label",
        description: "codingAgent.run.post.fields.taskTitle.description",
        columns: 12,
        schema: z.string().optional(),
      }),
      interactiveMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "codingAgent.run.post.fields.interactiveMode.label",
        description: "codingAgent.run.post.fields.interactiveMode.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      backButton: backButton(scopedTranslation, {
        label: "codingAgent.run.post.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),

      submitButton: submitButton(scopedTranslation, {
        label: "codingAgent.run.post.submitButton.label" as const,
        loadingText: "codingAgent.run.post.submitButton.loadingText" as const,
        icon: "send",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
      }),

      // ── Response fields ─────────────────────────────────────────────────
      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "codingAgent.run.post.fields.output.label",
        schema: z.string(),
      }),
      durationMs: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "codingAgent.run.post.fields.durationMs.label",
        schema: z.number(),
      }),
      nameOut: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().optional(),
      }),
      threadId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "codingAgent.run.post.fields.threadId.label",
        hidden: true,
        schema: z.string().optional(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "codingAgent.run.post.fields.status.label",
        hidden: true,
        schema: successfulStatusSchema.optional(),
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
      terminalPending: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean().optional(),
      }),
    },
  }),

  errorTypes: codingAgentErrorTypes,

  successTypes: {
    title: "codingAgent.run.post.success.title",
    description: "codingAgent.run.post.success.description",
  },

  examples: {
    requests: {
      default: {
        prompt:
          "Add a new feature to the coding-agent endpoint that tracks how many times it has been called.",
        provider: CodingAgentProvider.CLAUDE_CODE,
        interactiveMode: false,
      },
      namedCodex: {
        name: "fix-login",
        promptFile: ".tmp/briefs/fix-login.md",
        interactiveMode: false,
      },
      namedAntigravity: {
        name: "review-login",
        provider: CodingAgentProvider.ANTIGRAVITY,
        prompt: "Review the login flow and summarize your findings.",
        interactiveMode: false,
      },
      followUp: {
        name: "fix-login",
        prompt: "Now also cover the logout path.",
        interactiveMode: false,
      },
      interactive: {
        prompt: "Fix the login bug - check the auth flow and patch it.",
        provider: CodingAgentProvider.CLAUDE_CODE,
        interactiveMode: true,
        taskTitle: "Fix login bug",
      },
      openCode: {
        prompt: "Refactor the auth module to use the new token format.",
        provider: CodingAgentProvider.OPEN_CODE,
        model: "anthropic/claude-sonnet-4-6",
        interactiveMode: false,
      },
    },
    responses: {
      default: {
        output: "",
        durationMs: 184200,
      },
      batch: {
        output:
          "The route dispatches to the selected coding agent provider based on the provider field.",
        durationMs: 8342,
      },
      persistent: {
        output: "Fixed the redirect and passed the login tests.",
        durationMs: 42100,
        nameOut: "fix-login",
        threadId: "019e0000-0000-7000-8000-000000000000",
        status: "completed",
      },
      escalated: {
        output: "",
        durationMs: 0,
        taskId: "escalated-1234567890-abc123",
        hint: "Result will be injected into this thread when complete. Do NOT call await-task.",
      },
    },
  },
});

export const endpoints = { POST };

export type RunRequestOutput = typeof POST.types.RequestOutput;
export type RunResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
