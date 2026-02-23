/**
 * AI Stream Run API Definition
 * POST /agent/ai-stream/run
 *
 * Execute pre-calls, build context from results, run headless AI stream,
 * return the final assistant message text (think-tags stripped) + token info.
 *
 * Use this from CLI to get tool results fed into an AI prompt in one shot:
 *   vibe agent_ai-stream_run_POST --model=claude-haiku-4-5-20251001 \
 *     --character=default --prompt="Summarise these characters"
 */

import { z } from "zod";

import {
  ModelId,
  ModelIdOptions,
} from "@/app/api/[locale]/agent/models/models";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestDataArrayOptionalField,
  scopedRequestField,
  scopedResponseArrayFieldNew,
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

import { DefaultFolderId } from "../../chat/config";
import { scopedTranslation } from "../i18n";

/**
 * A single pre-call — route to execute before the AI prompt.
 * Args are flat (merged urlPathParams + data) since the AI sees them as one object.
 * The repository splits them by inspecting the endpoint definition.
 */
const preCallSchema = z.object({
  /** Endpoint alias or full path (e.g. "agent_chat_characters_GET") */
  routeId: z.string().min(1),
  /** Merged flat args — urlPathParams + data in one object */
  args: z.record(z.string(), z.unknown()).default({}),
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "ai-stream", "run"],
  aliases: ["ai-run", "run-ai", "agent-run"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.MCP_VISIBLE,
  ],
  title: "run.post.title",
  description: "run.post.description",
  icon: "sparkles",
  category: "category",
  tags: ["tags.ai", "tags.chat"],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "run.post.container.title",
    description: "run.post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // ── Model & character ───────────────────────────────────────────────
      model: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "run.post.fields.model.label",
        description: "run.post.fields.model.description",
        options: ModelIdOptions,
        columns: 6,
        schema: z.enum(ModelId),
      }),

      character: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "run.post.fields.character.label",
        description: "run.post.fields.character.description",
        placeholder: "run.post.fields.character.placeholder",
        columns: 6,
        schema: z.string().default("default"),
      }),

      // ── User prompt ─────────────────────────────────────────────────────
      prompt: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "run.post.fields.prompt.label",
        description: "run.post.fields.prompt.description",
        placeholder: "run.post.fields.prompt.placeholder",
        columns: 12,
        schema: z.string().min(1),
      }),

      // ── Optional extra instructions for the system prompt ────────────────
      instructions: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "run.post.fields.instructions.label",
        description: "run.post.fields.instructions.description",
        placeholder: "run.post.fields.instructions.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      // ── Pre-calls — executed before the prompt, results injected as context ──
      preCalls: scopedRequestDataArrayOptionalField(
        scopedTranslation,
        {
          type: WidgetType.CONTAINER,
          title: "run.post.fields.preCalls.label",
          description: "run.post.fields.preCalls.description",
        },
        scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { request: "data" },
          children: {
            routeId: scopedRequestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "run.post.fields.preCalls.routeId.label",
              description: "run.post.fields.preCalls.routeId.description",
              placeholder: "run.post.fields.preCalls.routeId.placeholder",
              columns: 6,
              schema: z.string().min(1),
            }),
            args: scopedRequestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.JSON,
              label: "run.post.fields.preCalls.args.label",
              description: "run.post.fields.preCalls.args.description",
              columns: 6,
              schema: z.record(z.string(), z.unknown()).default({}),
            }),
          },
        }),
      ),

      // ── Tool controls (mirrors regular ai-stream) ────────────────────────
      // allowedTools: null = all tools permitted; array = restrict to listed tools
      allowedTools: scopedRequestDataArrayOptionalField(
        scopedTranslation,
        {
          type: WidgetType.CONTAINER,
          title: "run.post.fields.allowedTools.label",
          description: "run.post.fields.allowedTools.description",
        },
        scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { request: "data" },
          children: {
            toolId: scopedRequestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "run.post.fields.allowedTools.toolId.label",
              description: "run.post.fields.allowedTools.toolId.description",
              columns: 6,
              schema: z.string(),
            }),
            requiresConfirmation: scopedRequestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "run.post.fields.allowedTools.requiresConfirmation.label",
              description:
                "run.post.fields.allowedTools.requiresConfirmation.description",
              columns: 6,
              schema: z.boolean().default(false),
            }),
          },
        }),
      ),
      // tools: null = no tools visible to model; array = these tools are in context
      tools: scopedRequestDataArrayOptionalField(
        scopedTranslation,
        {
          type: WidgetType.CONTAINER,
          title: "run.post.fields.tools.label",
          description: "run.post.fields.tools.description",
        },
        scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { request: "data" },
          children: {
            toolId: scopedRequestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "run.post.fields.tools.toolId.label",
              description: "run.post.fields.tools.toolId.description",
              columns: 6,
              schema: z.string(),
            }),
            requiresConfirmation: scopedRequestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "run.post.fields.tools.requiresConfirmation.label",
              description:
                "run.post.fields.tools.requiresConfirmation.description",
              columns: 6,
              schema: z.boolean().default(false),
            }),
          },
        }),
      ),

      maxTurns: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "run.post.fields.maxTurns.label",
        description: "run.post.fields.maxTurns.description",
        columns: 6,
        schema: z.coerce.number().int().positive().optional(),
      }),

      // ── Thread persistence ───────────────────────────────────────────────
      // appendThreadId: continue an existing thread; omit to start a new one
      // rootFolderId: incognito = no persistence, cron (default) = persisted
      appendThreadId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "run.post.fields.appendThreadId.label",
        description: "run.post.fields.appendThreadId.description",
        placeholder: "run.post.fields.appendThreadId.placeholder",
        columns: 6,
        schema: z.string().uuid().optional(),
      }),

      // ── Thread folder placement ──────────────────────────────────────────
      rootFolderId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "run.post.fields.rootFolderId.label",
        description: "run.post.fields.rootFolderId.description",
        placeholder: "run.post.fields.rootFolderId.placeholder",
        columns: 6,
        schema: z.enum(DefaultFolderId).default(DefaultFolderId.CRON),
      }),

      subFolderId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "run.post.fields.subFolderId.label",
        description: "run.post.fields.subFolderId.description",
        placeholder: "run.post.fields.subFolderId.placeholder",
        columns: 6,
        schema: z.uuid().optional(),
      }),

      // ── Response ────────────────────────────────────────────────────────
      text: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "run.post.response.text",
        schema: z.string().nullable(),
      }),

      promptTokens: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "run.post.response.promptTokens",
        schema: z.number().nullable(),
      }),

      completionTokens: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "run.post.response.completionTokens",
        schema: z.number().nullable(),
      }),

      // ── Thread metadata (null when rootFolderId is incognito) ───────────
      threadId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "run.post.response.threadId",
        schema: z.string().uuid().nullable(),
      }),

      lastAiMessageId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "run.post.response.lastAiMessageId",
        schema: z.string().uuid().nullable(),
      }),

      threadTitle: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "run.post.response.threadTitle",
        schema: z.string().nullable(),
      }),

      threadCreatedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "run.post.response.threadCreatedAt",
        schema: z.string().datetime().nullable(),
      }),

      preCallResults: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "run.post.response.preCallResults.title",
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            routeId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "run.post.response.preCallResults.routeId",
              schema: z.string(),
            }),
            success: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "run.post.response.preCallResults.succeeded",
              schema: z.boolean(),
            }),
            error: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "run.post.response.preCallResults.errorMessage",
              schema: z.string().nullable(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "run.post.errors.validation.title",
      description: "run.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "run.post.errors.unauthorized.title",
      description: "run.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "run.post.errors.forbidden.title",
      description: "run.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "run.post.errors.notFound.title",
      description: "run.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "run.post.errors.internal.title",
      description: "run.post.errors.internal.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "run.post.errors.network.title",
      description: "run.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "run.post.errors.unknown.title",
      description: "run.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "run.post.errors.unsaved.title",
      description: "run.post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "run.post.errors.conflict.title",
      description: "run.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "run.post.success.title",
    description: "run.post.success.description",
  },

  examples: {
    requests: {
      // Simple: just prompt — no pre-calls, default character
      simple: {
        model: ModelId["CLAUDE_HAIKU_4_5"],
        prompt: "Write a 3-sentence summary of what unbottled.ai is.",
        instructions: "Be concise and friendly.",
        maxTurns: 1,
        rootFolderId: DefaultFolderId.CRON,
      },
      // Recommended: use a dedicated character with custom system prompt
      withCharacter: {
        model: ModelId["CLAUDE_HAIKU_4_5"],
        character: "uuid-of-your-character",
        prompt: "Analyse last week's signups and write a brief report.",
        instructions: "Use bullet points. Max 5 items.",
        maxTurns: 1,
        rootFolderId: DefaultFolderId.CRON,
      },
      // Delegate: fetch data first via preCalls, then summarise
      withPreCall: {
        model: ModelId["CLAUDE_HAIKU_4_5"],
        prompt:
          "Summarise the available characters. Which is most suitable for customer support?",
        instructions: "One paragraph max.",
        preCalls: [{ routeId: "agent_chat_characters_GET", args: {} }],
        maxTurns: 1,
      },
      // Agentic: give AI tools and let it reason across multiple turns
      agentic: {
        model: ModelId["CLAUDE_SONNET_4_6"],
        character: "uuid-of-research-character",
        prompt:
          "Search for the latest news about AI assistants and write a brief report.",
        allowedTools: [{ toolId: "web-search", requiresConfirmation: false }],
        maxTurns: 3,
        rootFolderId: DefaultFolderId.CRON,
      },
      // Continue an existing thread
      continueThread: {
        model: ModelId["CLAUDE_HAIKU_4_5"],
        prompt: "Follow up: what were the key action items from our last run?",
        appendThreadId: "550e8400-e29b-41d4-a716-446655440000",
        maxTurns: 1,
      },
    },
    responses: {
      default: {
        text: "There are 3 characters available: ...",
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        lastAiMessageId: "660e8400-e29b-41d4-a716-446655440001",
        threadTitle: "Agent run 2026-02-23",
        threadCreatedAt: "2026-02-23T12:00:00.000Z",
        promptTokens: 412,
        completionTokens: 87,
        preCallResults: [
          { routeId: "agent_chat_characters_GET", success: true, error: null },
        ],
      },
    },
  },
});

export const endpoints = { POST };

export type AiStreamRunPostRequestInput = typeof POST.types.RequestInput;
export type AiStreamRunPostRequestOutput = typeof POST.types.RequestOutput;
export type AiStreamRunPostResponseInput = typeof POST.types.ResponseInput;
export type AiStreamRunPostResponseOutput = typeof POST.types.ResponseOutput;

// Re-export preCallSchema for use in repository
export { preCallSchema };

export default endpoints;
