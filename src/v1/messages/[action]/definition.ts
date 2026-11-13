/**
 * POST /v1/messages/count_tokens - Anthropic token counting (Claude Code calls
 * it to size its context). Free: an estimate from the same converter
 * /v1/messages uses, no model call, no credits, no rate-limit budget.
 *
 * The folder is [action] because route folders cannot contain "_" (it is the
 * endpoint-id separator); the only accepted action is "count_tokens", the
 * exact path Anthropic clients call.
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
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../i18n";
import { V1_MESSAGES_COUNT_TOKENS_ALIAS } from "../../shared/constants";
import { V1_ERROR_TYPES } from "../../shared/error-types";
import {
  anthropicMessageSchema,
  anthropicSystemSchema,
  anthropicToolSchema,
} from "../schema";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["v1", "messages", "[action]"],
  aliases: [V1_MESSAGES_COUNT_TOKENS_ALIAS] as const,
  title: "countTokens.post.title",
  titleShort: "countTokens.post.titleShort",
  description: "countTokens.post.description",
  icon: "hash",
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
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "countTokens.post.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      action: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "countTokens.post.fields.action.label",
        description: "countTokens.post.fields.action.description",
        schema: z.enum(["count_tokens"]),
      }),
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "countTokens.post.fields.model.label",
        description: "countTokens.post.fields.model.description",
        schema: z.string().min(1),
      }),
      messages: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "countTokens.post.fields.messages.label",
        description: "countTokens.post.fields.messages.description",
        schema: z.array(anthropicMessageSchema).min(1),
      }),
      system: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "countTokens.post.fields.system.label",
        description: "countTokens.post.fields.system.description",
        schema: anthropicSystemSchema.nullable().optional(),
      }),
      tools: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "countTokens.post.fields.tools.label",
        description: "countTokens.post.fields.tools.description",
        schema: z.array(anthropicToolSchema).nullable().optional(),
      }),
      input_tokens: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "countTokens.post.response.inputTokens",
        schema: z.number(),
      }),
    },
  }),
  errorTypes: V1_ERROR_TYPES,
  successTypes: {
    title: "countTokens.post.success.title",
    description: "countTokens.post.success.description",
  },
  examples: {
    requests: {
      default: {
        model: "deepseek-v4.1-flash",
        messages: [{ role: "user", content: "Hello" }],
      },
    },
    urlPathParams: { default: { action: "count_tokens" } },
    responses: { default: { input_tokens: 3 } },
  },
});

const v1CountTokensEndpoints = { POST } as const;
export default v1CountTokensEndpoints;

export type V1CountTokensPostRequestOutput = typeof POST.types.RequestOutput;
