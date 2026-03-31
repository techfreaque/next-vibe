/**
 * Coding Agent API Definition
 * POST endpoint that dispatches to a coding agent CLI (claude-code or open-code).
 * - interactiveMode:false (DEFAULT) → batch mode; output collected and returned.
 * - interactiveMode:true → live terminal session; result delivered back automatically when done.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  requestField,
  responseField,
  submitButton,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { lazyCliWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-cli-widget";
import { CODING_AGENT_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const CodingAgentWidget = lazyCliWidget(() =>
  import("./widget").then((m) => ({ default: m.CodingAgentWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "coding-agent"],
  title: "codingAgent.run.post.title",
  description: "codingAgent.run.post.description",
  dynamicTitle: ({ request }) => {
    if (request?.prompt) {
      const prompt =
        request.prompt.length > 40
          ? `${request.prompt.slice(0, 40)}...`
          : request.prompt;
      return {
        message: "codingAgent.run.post.dynamicTitle" as const,
        messageParams: { prompt },
      };
    }
    return undefined;
  },
  icon: "terminal",
  category: "endpointCategories.ai",
  tags: ["codingAgent.tags.tasks" as const],
  allowedRoles: [UserRole.ADMIN],
  aliases: [CODING_AGENT_ALIAS, "claude-code", "claude", "open-code"],

  // No stream timeout - sessions can run indefinitely
  streamTimeoutMs: 0,

  cli: {
    firstCliArgKey: "prompt",
  },

  fields: customWidgetObject({
    render: CodingAgentWidget,
    usage: { request: "data", response: true },
    children: {
      // ── Request fields ──────────────────────────────────────────────────
      prompt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "codingAgent.run.post.fields.prompt.label",
        description: "codingAgent.run.post.fields.prompt.description",
        columns: 12,
        schema: z.string().min(1),
      }),
      provider: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "codingAgent.run.post.fields.provider.label",
        description: "codingAgent.run.post.fields.provider.description",
        columns: 6,
        options: [
          {
            value: "claude-code",
            label:
              "codingAgent.run.post.fields.provider.options.claudeCode" as const,
          },
          {
            value: "open-code",
            label:
              "codingAgent.run.post.fields.provider.options.openCode" as const,
          },
        ],
        schema: z.enum(["claude-code", "open-code"]).default("claude-code"),
      }),
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "codingAgent.run.post.fields.model.label",
        description: "codingAgent.run.post.fields.model.description",
        columns: 6,
        schema: z.string().optional(),
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
        content: "codingAgent.run.post.fields.output.label",
        schema: z.string(),
      }),
      durationMs: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "codingAgent.run.post.fields.durationMs.label",
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
      title: "codingAgent.run.post.errors.validation.title",
      description: "codingAgent.run.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "codingAgent.run.post.errors.unauthorized.title",
      description: "codingAgent.run.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "codingAgent.run.post.errors.internal.title",
      description: "codingAgent.run.post.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "codingAgent.run.post.errors.forbidden.title",
      description: "codingAgent.run.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "codingAgent.run.post.errors.notFound.title",
      description: "codingAgent.run.post.errors.notFound.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "codingAgent.run.post.errors.network.title",
      description: "codingAgent.run.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "codingAgent.run.post.errors.unknown.title",
      description: "codingAgent.run.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "codingAgent.run.post.errors.unsaved.title",
      description: "codingAgent.run.post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "codingAgent.run.post.errors.conflict.title",
      description: "codingAgent.run.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "codingAgent.run.post.success.title",
    description: "codingAgent.run.post.success.description",
  },

  examples: {
    requests: {
      default: {
        prompt:
          "Add a new feature to the coding-agent endpoint that tracks how many times it has been called.",
        provider: "claude-code",
        interactiveMode: false,
      },
      batch: {
        prompt:
          "Read src/app/api/[locale]/agent/coding-agent/route.ts and summarize what it does in 2 sentences.",
        provider: "claude-code",
        interactiveMode: false,
      },
      interactive: {
        prompt: "Fix the login bug - check the auth flow and patch it.",
        provider: "claude-code",
        interactiveMode: true,
        taskTitle: "Fix login bug",
      },
      openCode: {
        prompt: "Refactor the auth module to use the new token format.",
        provider: "open-code",
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
          "The route dispatches to the selected coding agent provider (claude-code or open-code) based on the provider field.",
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
