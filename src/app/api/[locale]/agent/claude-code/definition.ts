/**
 * Claude Code Run API Definition
 * POST endpoint that spawns `claude` CLI.
 * - headless:false (default) → interactive session (stdio inherited, user can participate)
 * - headless:true → non-interactive -p print mode, output collected and returned
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

export const CLAUDE_CODE_ALIAS = "claude-code" as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "claude-code"],
  title: "claudeCode.run.post.title",
  description: "claudeCode.run.post.description",
  icon: "terminal",
  category: "app.endpointCategories.ai",
  tags: ["claudeCode.tags.tasks" as const],
  allowedRoles: [UserRole.ADMIN],
  aliases: [CLAUDE_CODE_ALIAS, "claude"],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // Request
      prompt: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z.string().min(1),
      }),
      model: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),
      maxBudgetUsd: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),
      systemPrompt: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z.string().optional(),
      }),
      allowedTools: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.string().optional(),
      }),
      workingDir: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),
      interactive: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        columns: 6,
        schema: z.boolean().default(true),
      }),
      timeoutMs: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        columns: 6,
        schema: z.coerce.number().default(600000),
      }),

      // Response
      output: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      exitCode: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
      durationMs: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number(),
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
        interactive: false,
      },
      batch: {
        prompt:
          "Read src/app/api/[locale]/system/agent/claude-code/repository.ts and summarize what it does in 2 sentences.",
        interactive: true,
        timeoutMs: 60000,
      },
    },
    responses: {
      default: {
        output: "",
        exitCode: 0,
        durationMs: 184200,
      },
      batch: {
        output:
          "The repository spawns a `claude` CLI process in either interactive or batch mode. Interactive mode inherits the terminal for live back-and-forth; batch mode uses `-p` print mode and collects all output before returning.",
        exitCode: 0,
        durationMs: 8342,
      },
    },
  },
});

export const endpoints = { POST };

export type RunRequestOutput = typeof POST.types.RequestOutput;
export type RunResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
