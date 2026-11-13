/**
 * POST /v1/messages - Anthropic Messages API (what Claude Code speaks).
 * Served at /api/<locale>/v1/messages, so ANTHROPIC_BASE_URL is
 * <origin>/api/<locale>. Authenticated by API key only, sent as `x-api-key`
 * or `Authorization: Bearer`; `anthropic-version` / `anthropic-beta` headers
 * are accepted and ignored. The handler answers with the raw Anthropic body
 * (JSON or SSE); the declared response is nominal.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../i18n";
import { V1_MESSAGES_ALIAS } from "../shared/constants";
import { V1_ERROR_TYPES } from "../shared/error-types";
import {
  anthropicMessageSchema,
  anthropicSystemSchema,
  anthropicThinkingSchema,
  anthropicToolChoiceSchema,
  anthropicToolSchema,
} from "./schema";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["v1", "messages"],
  aliases: [V1_MESSAGES_ALIAS] as const,
  title: "messages.post.title",
  titleShort: "messages.post.titleShort",
  description: "messages.post.description",
  icon: "terminal",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.api"],
  // PUBLIC is allowed so the handler can answer unauthenticated calls with the
  // Anthropic 401 body; it authenticates by API key only (see api-keys/auth.ts).
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.CLI_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.SKILL_OFF,
  ] as const,
  timeoutMs: 0,
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "messages.post.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true } as const,
    children: {
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "messages.post.fields.model.label",
        description: "messages.post.fields.model.description",
        schema: z.string().min(1),
      }),
      messages: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "messages.post.fields.messages.label",
        description: "messages.post.fields.messages.description",
        schema: z.array(anthropicMessageSchema).min(1),
      }),
      system: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "messages.post.fields.system.label",
        description: "messages.post.fields.system.description",
        schema: anthropicSystemSchema.nullable().optional(),
      }),
      max_tokens: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "messages.post.fields.maxTokens.label",
        description: "messages.post.fields.maxTokens.description",
        schema: z.number().int().positive().nullable().optional(),
      }),
      stream: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "messages.post.fields.stream.label",
        description: "messages.post.fields.stream.description",
        schema: z.boolean().nullable().optional(),
      }),
      tools: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "messages.post.fields.tools.label",
        description: "messages.post.fields.tools.description",
        schema: z.array(anthropicToolSchema).nullable().optional(),
      }),
      tool_choice: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "messages.post.fields.toolChoice.label",
        description: "messages.post.fields.toolChoice.description",
        schema: anthropicToolChoiceSchema.nullable().optional(),
      }),
      stop_sequences: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "messages.post.fields.stopSequences.label",
        description: "messages.post.fields.stopSequences.description",
        schema: z.array(z.string()).nullable().optional(),
      }),
      temperature: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "messages.post.fields.temperature.label",
        description: "messages.post.fields.temperature.description",
        schema: z.number().min(0).max(2).nullable().optional(),
      }),
      top_p: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "messages.post.fields.topP.label",
        description: "messages.post.fields.topP.description",
        schema: z.number().min(0).max(1).nullable().optional(),
      }),
      thinking: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "messages.post.fields.thinking.label",
        description: "messages.post.fields.thinking.description",
        schema: anthropicThinkingSchema.nullable().optional(),
      }),
      type: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "messages.post.response.type",
        schema: z.string(),
      }),
    },
  }),
  errorTypes: V1_ERROR_TYPES,
  successTypes: {
    title: "messages.post.success.title",
    description: "messages.post.success.description",
  },
  examples: {
    requests: {
      default: {
        model: "deepseek-v4.1-flash",
        max_tokens: 256,
        messages: [{ role: "user", content: "Say hello in five words." }],
      },
    },
    responses: { default: { type: "message" } },
  },
});

const v1MessagesEndpoints = { POST } as const;
export default v1MessagesEndpoints;

export type V1MessagesPostRequestOutput = typeof POST.types.RequestOutput;
export type V1MessagesPostResponseOutput = typeof POST.types.ResponseOutput;
