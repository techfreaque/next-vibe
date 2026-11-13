/**
 * POST /v1/responses - OpenAI Responses API (what Codex CLI speaks).
 * Served at /api/<locale>/v1/responses, authenticated by API key only.
 * Stateless: the client sends the full conversation in `input` (Codex does,
 * with store=false). The handler answers with the raw Responses body (JSON or
 * SSE); the declared response is nominal.
 *
 * The schemas accept every item/tool type clients send. Hosted tools we do not
 * run (web_search, image_generation, ...) and unknown item types are accepted
 * and skipped, so a new client field never breaks a session.
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
import { V1_RESPONSES_ALIAS } from "../shared/constants";
import { V1_ERROR_TYPES } from "../shared/error-types";

const textPartSchema = z.object({
  type: z.enum(["input_text", "output_text", "text", "summary_text"]),
  text: z.string(),
});
const refusalPartSchema = z.object({
  type: z.literal("refusal"),
  refusal: z.string(),
});
const imagePartSchema = z.object({
  type: z.literal("input_image"),
  image_url: z.string().nullable().optional(),
  detail: z.string().nullable().optional(),
});
/** Any other part type (input_file, audio, ...): accepted, skipped. */
const otherPartSchema = z.object({ type: z.string() });

const contentPartSchema = z.union([
  textPartSchema,
  refusalPartSchema,
  imagePartSchema,
  otherPartSchema,
]);

export const responsesMessageItemSchema = z.object({
  type: z.literal("message").optional(),
  role: z.enum(["user", "assistant", "system", "developer"]),
  content: z.union([z.string(), z.array(contentPartSchema)]),
});

export const responsesToolOutputSchema = z.union([
  z.string(),
  z.array(contentPartSchema),
]);

const functionCallItemSchema = z.object({
  type: z.literal("function_call"),
  call_id: z.string().min(1),
  name: z.string().min(1),
  arguments: z.string(),
});
const functionCallOutputItemSchema = z.object({
  type: z.literal("function_call_output"),
  call_id: z.string().min(1),
  output: responsesToolOutputSchema,
});
const customToolCallItemSchema = z.object({
  type: z.literal("custom_tool_call"),
  call_id: z.string().min(1),
  name: z.string().min(1),
  input: z.string(),
});
const customToolCallOutputItemSchema = z.object({
  type: z.literal("custom_tool_call_output"),
  call_id: z.string().min(1),
  output: responsesToolOutputSchema,
});
const localShellCallItemSchema = z.object({
  type: z.literal("local_shell_call"),
  id: z.string().nullable().optional(),
  call_id: z.string().nullable().optional(),
  action: z.object({
    type: z.string(),
    command: z.array(z.string()),
    timeout_ms: z.number().nullable().optional(),
    working_directory: z.string().nullable().optional(),
  }),
});
const localShellCallOutputItemSchema = z.object({
  type: z.literal("local_shell_call_output"),
  id: z.string().nullable().optional(),
  call_id: z.string().nullable().optional(),
  output: responsesToolOutputSchema,
});
export const responsesReasoningItemSchema = z.object({
  type: z.literal("reasoning"),
  summary: z.array(textPartSchema.or(otherPartSchema)).nullable().optional(),
  content: z.array(textPartSchema.or(otherPartSchema)).nullable().optional(),
  encrypted_content: z.string().nullable().optional(),
});
/** web_search_call, compaction, item_reference, ...: accepted, skipped. */
const otherItemSchema = z.object({ type: z.string() });

export const responsesInputItemSchema = z.union([
  responsesMessageItemSchema,
  functionCallItemSchema,
  functionCallOutputItemSchema,
  customToolCallItemSchema,
  customToolCallOutputItemSchema,
  localShellCallItemSchema,
  localShellCallOutputItemSchema,
  responsesReasoningItemSchema,
  otherItemSchema,
]);

const functionToolSchema = z.object({
  type: z.literal("function"),
  name: z.string().min(1).max(128),
  description: z.string().nullable().optional(),
  parameters: z.record(z.string(), z.json()).nullable().optional(),
  strict: z.boolean().nullable().optional(),
});
const customToolSchema = z.object({
  type: z.literal("custom"),
  name: z.string().min(1).max(128),
  description: z.string().nullable().optional(),
  format: z
    .object({
      type: z.string(),
      syntax: z.string().nullable().optional(),
      definition: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});
const localShellToolSchema = z.object({ type: z.literal("local_shell") });
/** Hosted tools (web_search, image_generation, file_search, ...): skipped. */
const otherToolSchema = z.object({ type: z.string() });

export const responsesToolSchema = z.union([
  functionToolSchema,
  customToolSchema,
  localShellToolSchema,
  otherToolSchema,
]);

export const responsesToolChoiceSchema = z.union([
  z.enum(["none", "auto", "required"]),
  z.object({
    type: z.enum(["function", "custom"]),
    name: z.string().min(1),
  }),
  z.object({ type: z.string() }),
]);

export type ResponsesInputItem = z.infer<typeof responsesInputItemSchema>;
export type ResponsesTool = z.infer<typeof responsesToolSchema>;
export type ResponsesReasoningItem = z.infer<
  typeof responsesReasoningItemSchema
>;
export type ResponsesToolChoice = z.infer<typeof responsesToolChoiceSchema>;
export type ResponsesToolOutput = z.infer<typeof responsesToolOutputSchema>;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["v1", "responses"],
  aliases: [V1_RESPONSES_ALIAS] as const,
  title: "responses.post.title",
  titleShort: "responses.post.titleShort",
  description: "responses.post.description",
  icon: "terminal",
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
    title: "responses.post.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true } as const,
    children: {
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "responses.post.fields.model.label",
        description: "responses.post.fields.model.description",
        schema: z.string().min(1),
      }),
      input: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "responses.post.fields.input.label",
        description: "responses.post.fields.input.description",
        schema: z.union([z.string(), z.array(responsesInputItemSchema)]),
      }),
      instructions: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "responses.post.fields.instructions.label",
        description: "responses.post.fields.instructions.description",
        schema: z.string().nullable().optional(),
      }),
      stream: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "responses.post.fields.stream.label",
        description: "responses.post.fields.stream.description",
        schema: z.boolean().nullable().optional(),
      }),
      tools: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "responses.post.fields.tools.label",
        description: "responses.post.fields.tools.description",
        schema: z.array(responsesToolSchema).nullable().optional(),
      }),
      tool_choice: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "responses.post.fields.toolChoice.label",
        description: "responses.post.fields.toolChoice.description",
        schema: responsesToolChoiceSchema.nullable().optional(),
      }),
      parallel_tool_calls: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "responses.post.fields.parallelToolCalls.label",
        description: "responses.post.fields.parallelToolCalls.description",
        schema: z.boolean().nullable().optional(),
      }),
      max_output_tokens: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "responses.post.fields.maxOutputTokens.label",
        description: "responses.post.fields.maxOutputTokens.description",
        schema: z.number().int().positive().nullable().optional(),
      }),
      temperature: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "responses.post.fields.temperature.label",
        description: "responses.post.fields.temperature.description",
        schema: z.number().min(0).max(2).nullable().optional(),
      }),
      top_p: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "responses.post.fields.topP.label",
        description: "responses.post.fields.topP.description",
        schema: z.number().min(0).max(1).nullable().optional(),
      }),
      reasoning: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "responses.post.fields.reasoning.label",
        description: "responses.post.fields.reasoning.description",
        schema: z
          .object({
            effort: z.string().nullable().optional(),
            summary: z.string().nullable().optional(),
          })
          .nullable()
          .optional(),
      }),
      text: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "responses.post.fields.text.label",
        description: "responses.post.fields.text.description",
        schema: z
          .object({
            format: z
              .object({
                type: z.string(),
                name: z.string().nullable().optional(),
                schema: z.record(z.string(), z.json()).nullable().optional(),
              })
              .nullable()
              .optional(),
          })
          .nullable()
          .optional(),
      }),
      store: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "responses.post.fields.store.label",
        description: "responses.post.fields.store.description",
        schema: z.boolean().nullable().optional(),
      }),
      previous_response_id: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "responses.post.fields.previousResponseId.label",
        description: "responses.post.fields.previousResponseId.description",
        schema: z.string().nullable().optional(),
      }),
      include: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "responses.post.fields.include.label",
        description: "responses.post.fields.include.description",
        schema: z.array(z.string()).nullable().optional(),
      }),
      object: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "responses.post.response.object",
        schema: z.string(),
      }),
    },
  }),
  errorTypes: V1_ERROR_TYPES,
  successTypes: {
    title: "responses.post.success.title",
    description: "responses.post.success.description",
  },
  examples: {
    requests: {
      default: {
        model: "deepseek-v4.1-flash",
        input: "Say hello in five words.",
      },
    },
    responses: { default: { object: "response" } },
  },
});

const v1ResponsesEndpoints = { POST } as const;
export default v1ResponsesEndpoints;

export type V1ResponsesPostRequestOutput = typeof POST.types.RequestOutput;
export type V1ResponsesPostResponseOutput = typeof POST.types.ResponseOutput;
