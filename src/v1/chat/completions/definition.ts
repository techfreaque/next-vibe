/**
 * POST /v1/chat/completions - OpenAI-compatible chat completions.
 * Served at /api/<locale>/v1/chat/completions, authenticated by API key only.
 * The handler answers with the raw OpenAI body (JSON or SSE); the declared
 * response is nominal.
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

import { scopedTranslation } from "../../i18n";
import { V1_CHAT_COMPLETIONS_ALIAS } from "../../shared/constants";
import { V1_ERROR_TYPES } from "../../shared/error-types";

const contentPartSchema = z.union([
  z.object({ type: z.literal("text"), text: z.string() }),
  z.object({
    type: z.literal("image_url"),
    image_url: z.union([z.string(), z.object({ url: z.string() })]),
  }),
]);

export const openAiMessageSchema = z.object({
  role: z.enum(["system", "developer", "user", "assistant", "tool"]),
  content: z
    .union([z.string(), z.array(contentPartSchema)])
    .nullable()
    .optional(),
  name: z.string().optional(),
});

export type OpenAiMessage = z.infer<typeof openAiMessageSchema>;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["v1", "chat", "completions"],
  aliases: [V1_CHAT_COMPLETIONS_ALIAS] as const,
  title: "completions.post.title",
  titleShort: "completions.post.titleShort",
  description: "completions.post.description",
  icon: "message-square",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.api"],
  // PUBLIC is allowed so the handler can answer unauthenticated calls with the
  // OpenAI 401 body; it authenticates by API key only (see api-keys/auth.ts).
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
    title: "completions.post.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true } as const,
    children: {
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "completions.post.fields.model.label",
        description: "completions.post.fields.model.description",
        schema: z.string().min(1),
      }),
      messages: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "completions.post.fields.messages.label",
        description: "completions.post.fields.messages.description",
        schema: z.array(openAiMessageSchema).min(1),
      }),
      stream: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "completions.post.fields.stream.label",
        description: "completions.post.fields.stream.description",
        schema: z.boolean().optional(),
      }),
      stream_options: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "completions.post.fields.streamOptions.label",
        description: "completions.post.fields.streamOptions.description",
        schema: z.object({ include_usage: z.boolean().optional() }).optional(),
      }),
      max_tokens: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "completions.post.fields.maxTokens.label",
        description: "completions.post.fields.maxTokens.description",
        schema: z.number().int().positive().optional(),
      }),
      max_completion_tokens: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "completions.post.fields.maxCompletionTokens.label",
        description: "completions.post.fields.maxCompletionTokens.description",
        schema: z.number().int().positive().optional(),
      }),
      temperature: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "completions.post.fields.temperature.label",
        description: "completions.post.fields.temperature.description",
        schema: z.number().min(0).max(2).optional(),
      }),
      top_p: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "completions.post.fields.topP.label",
        description: "completions.post.fields.topP.description",
        schema: z.number().min(0).max(1).optional(),
      }),
      stop: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "completions.post.fields.stop.label",
        description: "completions.post.fields.stop.description",
        schema: z.union([z.string(), z.array(z.string())]).optional(),
      }),
      n: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "completions.post.fields.n.label",
        description: "completions.post.fields.n.description",
        schema: z.number().int().positive().optional(),
      }),
      tools: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "completions.post.fields.tools.label",
        description: "completions.post.fields.tools.description",
        schema: z.array(z.object({ type: z.string() }).loose()).optional(),
      }),
      object: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "completions.post.response.object",
        schema: z.string(),
      }),
    },
  }),
  errorTypes: V1_ERROR_TYPES,
  successTypes: {
    title: "completions.post.success.title",
    description: "completions.post.success.description",
  },
  examples: {
    requests: {
      default: {
        model: "kimi-k2",
        messages: [{ role: "user", content: "Say hello in five words." }],
      },
    },
    responses: { default: { object: "chat.completion" } },
  },
});

const v1ChatCompletionsEndpoints = { POST } as const;
export default v1ChatCompletionsEndpoints;

export type V1ChatCompletionsPostRequestOutput =
  typeof POST.types.RequestOutput;
export type V1ChatCompletionsPostResponseOutput =
  typeof POST.types.ResponseOutput;
