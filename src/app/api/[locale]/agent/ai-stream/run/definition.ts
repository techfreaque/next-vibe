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
  objectField,
  requestDataArrayOptionalField,
  requestField,
  responseArrayField,
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

import { DefaultFolderId } from "../../chat/config";

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
  method: Methods.POST,
  path: ["agent", "ai-stream", "run"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],
  title: "app.api.agent.aiStream.run.post.title",
  description: "app.api.agent.aiStream.run.post.description",
  icon: "sparkles",
  category: "app.api.agent.chat.category",
  tags: ["app.api.agent.tags.ai", "app.api.agent.tags.chat"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.aiStream.run.post.container.title",
      description: "app.api.agent.aiStream.run.post.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // ── Model & character ───────────────────────────────────────────────
      model: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.agent.aiStream.run.post.fields.model.label",
        description: "app.api.agent.aiStream.run.post.fields.model.description",
        options: ModelIdOptions,
        columns: 6,
        schema: z.enum(ModelId),
      }),

      character: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.aiStream.run.post.fields.character.label",
        description:
          "app.api.agent.aiStream.run.post.fields.character.description",
        placeholder:
          "app.api.agent.aiStream.run.post.fields.character.placeholder",
        columns: 6,
        schema: z.string().default("default"),
      }),

      // ── User prompt ─────────────────────────────────────────────────────
      prompt: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "app.api.agent.aiStream.run.post.fields.prompt.label",
        description:
          "app.api.agent.aiStream.run.post.fields.prompt.description",
        placeholder:
          "app.api.agent.aiStream.run.post.fields.prompt.placeholder",
        columns: 12,
        schema: z.string().min(1),
      }),

      // ── Optional extra instructions for the system prompt ────────────────
      instructions: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "app.api.agent.aiStream.run.post.fields.instructions.label",
        description:
          "app.api.agent.aiStream.run.post.fields.instructions.description",
        placeholder:
          "app.api.agent.aiStream.run.post.fields.instructions.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      // ── Pre-calls — executed before the prompt, results injected as context ──
      preCalls: requestDataArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.aiStream.run.post.fields.preCalls.label",
          description:
            "app.api.agent.aiStream.run.post.fields.preCalls.description",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { request: "data" },
          {
            routeId: requestField({
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.agent.aiStream.run.post.fields.preCalls.routeId.label",
              description:
                "app.api.agent.aiStream.run.post.fields.preCalls.routeId.description",
              placeholder:
                "app.api.agent.aiStream.run.post.fields.preCalls.routeId.placeholder",
              columns: 6,
              schema: z.string().min(1),
            }),
            args: requestField({
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.JSON,
              label:
                "app.api.agent.aiStream.run.post.fields.preCalls.args.label",
              description:
                "app.api.agent.aiStream.run.post.fields.preCalls.args.description",
              columns: 6,
              schema: z.record(z.string(), z.unknown()).default({}),
            }),
          },
        ),
      ),

      // ── Tool controls (mirrors regular ai-stream) ────────────────────────
      // activeTools: null = all tools permitted; array = restrict to listed tools
      activeTools: requestDataArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.aiStream.run.post.fields.activeTools.label",
          description:
            "app.api.agent.aiStream.run.post.fields.activeTools.description",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { request: "data" },
          {
            toolId: requestField({
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.agent.aiStream.run.post.fields.activeTools.toolId.label",
              description:
                "app.api.agent.aiStream.run.post.fields.activeTools.toolId.description",
              columns: 6,
              schema: z.string(),
            }),
            requiresConfirmation: requestField({
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "app.api.agent.aiStream.run.post.fields.activeTools.requiresConfirmation.label",
              description:
                "app.api.agent.aiStream.run.post.fields.activeTools.requiresConfirmation.description",
              columns: 6,
              schema: z.boolean().default(false),
            }),
          },
        ),
      ),
      // tools: null = no tools visible to model; array = these tools are in context
      tools: requestDataArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.aiStream.run.post.fields.tools.label",
          description:
            "app.api.agent.aiStream.run.post.fields.tools.description",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { request: "data" },
          {
            toolId: requestField({
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.agent.aiStream.run.post.fields.tools.toolId.label",
              description:
                "app.api.agent.aiStream.run.post.fields.tools.toolId.description",
              columns: 6,
              schema: z.string(),
            }),
            requiresConfirmation: requestField({
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "app.api.agent.aiStream.run.post.fields.tools.requiresConfirmation.label",
              description:
                "app.api.agent.aiStream.run.post.fields.tools.requiresConfirmation.description",
              columns: 6,
              schema: z.boolean().default(false),
            }),
          },
        ),
      ),

      maxTurns: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.agent.aiStream.run.post.fields.maxTurns.label",
        description:
          "app.api.agent.aiStream.run.post.fields.maxTurns.description",
        columns: 6,
        schema: z.coerce.number().int().positive().optional(),
      }),

      // ── Thread persistence ───────────────────────────────────────────────
      // appendThreadId: continue an existing thread; omit to start a new one
      // rootFolderId: incognito = no persistence, cron (default) = persisted
      appendThreadId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.aiStream.run.post.fields.appendThreadId.label",
        description:
          "app.api.agent.aiStream.run.post.fields.appendThreadId.description",
        placeholder:
          "app.api.agent.aiStream.run.post.fields.appendThreadId.placeholder",
        columns: 6,
        schema: z.string().uuid().optional(),
      }),

      // ── Thread folder placement ──────────────────────────────────────────
      rootFolderId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.aiStream.run.post.fields.rootFolderId.label",
        description:
          "app.api.agent.aiStream.run.post.fields.rootFolderId.description",
        placeholder:
          "app.api.agent.aiStream.run.post.fields.rootFolderId.placeholder",
        columns: 6,
        schema: z.enum(DefaultFolderId).default(DefaultFolderId.CRON),
      }),

      subFolderId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.aiStream.run.post.fields.subFolderId.label",
        description:
          "app.api.agent.aiStream.run.post.fields.subFolderId.description",
        placeholder:
          "app.api.agent.aiStream.run.post.fields.subFolderId.placeholder",
        columns: 6,
        schema: z.uuid().optional(),
      }),

      // ── Response ────────────────────────────────────────────────────────
      text: responseField({
        type: WidgetType.TEXT,
        content: "app.api.agent.aiStream.run.post.response.text",
        schema: z.string().nullable(),
      }),

      promptTokens: responseField({
        type: WidgetType.TEXT,
        content: "app.api.agent.aiStream.run.post.response.promptTokens",
        schema: z.number().nullable(),
      }),

      completionTokens: responseField({
        type: WidgetType.TEXT,
        content: "app.api.agent.aiStream.run.post.response.completionTokens",
        schema: z.number().nullable(),
      }),

      // ── Thread metadata (null when rootFolderId is incognito) ───────────
      threadId: responseField({
        type: WidgetType.TEXT,
        content: "app.api.agent.aiStream.run.post.response.threadId",
        schema: z.string().uuid().nullable(),
      }),

      lastAiMessageId: responseField({
        type: WidgetType.TEXT,
        content: "app.api.agent.aiStream.run.post.response.lastAiMessageId",
        schema: z.string().uuid().nullable(),
      }),

      threadTitle: responseField({
        type: WidgetType.TEXT,
        content: "app.api.agent.aiStream.run.post.response.threadTitle",
        schema: z.string().nullable(),
      }),

      threadCreatedAt: responseField({
        type: WidgetType.TEXT,
        content: "app.api.agent.aiStream.run.post.response.threadCreatedAt",
        schema: z.string().datetime().nullable(),
      }),

      preCallResults: responseArrayField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.aiStream.run.post.response.preCallResults",
        },
        objectField(
          { type: WidgetType.CONTAINER },
          { response: true },
          {
            routeId: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.aiStream.run.post.response.preCallResults.routeId",
              schema: z.string(),
            }),
            success: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.aiStream.run.post.response.preCallResults.success",
              schema: z.boolean(),
            }),
            error: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.aiStream.run.post.response.preCallResults.error",
              schema: z.string().nullable(),
            }),
          },
        ),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.aiStream.run.post.errors.validation.title",
      description:
        "app.api.agent.aiStream.run.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.aiStream.run.post.errors.unauthorized.title",
      description:
        "app.api.agent.aiStream.run.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.aiStream.run.post.errors.forbidden.title",
      description:
        "app.api.agent.aiStream.run.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.aiStream.run.post.errors.notFound.title",
      description:
        "app.api.agent.aiStream.run.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.aiStream.run.post.errors.internal.title",
      description:
        "app.api.agent.aiStream.run.post.errors.internal.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.aiStream.run.post.errors.network.title",
      description: "app.api.agent.aiStream.run.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.aiStream.run.post.errors.unknown.title",
      description: "app.api.agent.aiStream.run.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.aiStream.run.post.errors.unsaved.title",
      description: "app.api.agent.aiStream.run.post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.aiStream.run.post.errors.conflict.title",
      description:
        "app.api.agent.aiStream.run.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.agent.aiStream.run.post.success.title",
    description: "app.api.agent.aiStream.run.post.success.description",
  },

  examples: {
    requests: {
      default: {
        model: ModelId["CLAUDE_HAIKU_4_5"],
        character: "default",
        prompt:
          "Summarise the available characters. Which looks most suitable for customer support?",
        instructions: "Be concise. One paragraph max.",
        preCalls: [
          {
            routeId: "agent_chat_characters_GET",
            args: {},
          },
        ],
        maxTurns: 1,
      },
    },
    responses: {
      default: {
        text: "There are 3 characters available: ...",
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        lastAiMessageId: "660e8400-e29b-41d4-a716-446655440001",
        threadTitle: "Agent run 2026-02-21",
        threadCreatedAt: "2026-02-21T12:00:00.000Z",
        promptTokens: 412,
        completionTokens: 87,
        preCallResults: [
          {
            routeId: "agent_chat_characters_GET",
            success: true,
            error: null,
          },
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
