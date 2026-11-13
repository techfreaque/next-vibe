/**
 * Anthropic Messages request schemas, shared by POST /v1/messages and
 * POST /v1/messages/count_tokens. Every block/tool type clients send is
 * accepted: server tools (web_search_*, code_execution_*) and unknown block
 * types are skipped, so a new Claude Code field never breaks a session.
 */

import { z } from "zod";

export const anthropicTextBlockSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

const base64SourceSchema = z.object({
  type: z.literal("base64"),
  media_type: z.string(),
  data: z.string(),
});
const urlSourceSchema = z.object({
  type: z.literal("url"),
  url: z.string(),
});
const textSourceSchema = z.object({
  type: z.literal("text"),
  data: z.string(),
});
const otherSourceSchema = z.object({ type: z.string() });

export const anthropicImageBlockSchema = z.object({
  type: z.literal("image"),
  source: z.union([base64SourceSchema, urlSourceSchema, otherSourceSchema]),
});

const documentBlockSchema = z.object({
  type: z.literal("document"),
  source: z.union([
    base64SourceSchema,
    urlSourceSchema,
    textSourceSchema,
    otherSourceSchema,
  ]),
  title: z.string().nullable().optional(),
});

const otherBlockSchema = z.object({ type: z.string() });

/** Tool search result entry: loads a deferred tool by name. */
const toolReferenceBlockSchema = z.object({
  type: z.literal("tool_reference"),
  tool_name: z.string().min(1),
});

const toolUseBlockSchema = z.object({
  type: z.literal("tool_use"),
  id: z.string().min(1),
  name: z.string().min(1),
  input: z.json(),
});

const toolResultBlockSchema = z.object({
  type: z.literal("tool_result"),
  tool_use_id: z.string().min(1),
  content: z
    .union([
      z.string(),
      z.array(
        z.union([
          anthropicTextBlockSchema,
          anthropicImageBlockSchema,
          toolReferenceBlockSchema,
          otherBlockSchema,
        ]),
      ),
    ])
    .nullable()
    .optional(),
  is_error: z.boolean().nullable().optional(),
});

const thinkingBlockSchema = z.object({
  type: z.literal("thinking"),
  thinking: z.string(),
  signature: z.string().nullable().optional(),
});

const redactedThinkingBlockSchema = z.object({
  type: z.literal("redacted_thinking"),
  data: z.string(),
});

export const anthropicContentBlockSchema = z.union([
  anthropicTextBlockSchema,
  anthropicImageBlockSchema,
  documentBlockSchema,
  toolUseBlockSchema,
  toolResultBlockSchema,
  thinkingBlockSchema,
  redactedThinkingBlockSchema,
  otherBlockSchema,
]);

/**
 * user / assistant turns, plus the mid-conversation `system` entries Claude
 * Code sends for reminders and per-turn effort (content may be empty).
 */
export const anthropicMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.union([z.string(), z.array(anthropicContentBlockSchema)]),
});

export const anthropicSystemSchema = z.union([
  z.string(),
  z.array(z.union([anthropicTextBlockSchema, otherBlockSchema])),
]);

/** Client tool ({name, input_schema}); type is absent or "custom". */
const clientToolSchema = z.object({
  type: z.string().nullable().optional(),
  name: z.string().min(1).max(128),
  description: z.string().nullable().optional(),
  input_schema: z.record(z.string(), z.json()),
  /** deferred until a tool search result references it */
  defer_loading: z.boolean().nullable().optional(),
});
/** Server tools (web_search_20250305, ...): we do not run them; skipped. */
const serverToolSchema = z.object({
  type: z.string(),
  name: z.string().nullable().optional(),
});

export const anthropicToolSchema = z.union([
  clientToolSchema,
  serverToolSchema,
]);

export const anthropicToolChoiceSchema = z.object({
  type: z.string(),
  name: z.string().nullable().optional(),
  disable_parallel_tool_use: z.boolean().nullable().optional(),
});

export const anthropicThinkingSchema = z.object({
  type: z.string(),
  budget_tokens: z.number().nullable().optional(),
  /** "omitted": the client wants thinking blocks without their text */
  display: z.string().nullable().optional(),
});

export type AnthropicContentBlock = z.infer<typeof anthropicContentBlockSchema>;
export type AnthropicMessage = z.infer<typeof anthropicMessageSchema>;
export type AnthropicSystem = z.infer<typeof anthropicSystemSchema>;
export type AnthropicTool = z.infer<typeof anthropicToolSchema>;
export type AnthropicToolChoice = z.infer<typeof anthropicToolChoiceSchema>;
