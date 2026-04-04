/**
 * WS Provider Stream API Definition
 * POST /agent/ai-stream/ws-provider/stream
 *
 * Starts an AI stream for a remote WS Provider client.
 * The client sends a message + model. AI events stream via WebSocket.
 * All tools are executed server-side — the client only observes events.
 */

import { z } from "zod";

import {
  ChatModelId,
  ChatModelIdOptions,
} from "@/app/api/[locale]/agent/ai-stream/models";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataArrayOptionalField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "ai-stream", "ws-provider", "stream"],
  aliases: ["ws-provider-stream"],
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.AI_TOOL_OFF],
  title: "post.title",
  description: "post.description",
  icon: "radio",
  category: "endpointCategories.ai",
  tags: ["tags.ai", "tags.streaming"],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===

      content: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.fields.content.label",
        description: "post.fields.content.description",
        placeholder: "post.fields.content.placeholder",
        columns: 12,
        schema: z.string().min(1),
      }),

      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.model.label",
        description: "post.fields.model.description",
        options: ChatModelIdOptions,
        columns: 6,
        schema: z.enum(ChatModelId),
      }),

      threadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.threadId.label",
        description: "post.fields.threadId.description",
        placeholder: "post.fields.threadId.placeholder",
        columns: 6,
        schema: z
          .union([z.literal(""), z.string().uuid()])
          .optional()
          .transform((v) => (v === "" ? undefined : v)),
      }),

      skill: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.skill.label",
        description: "post.fields.skill.description",
        columns: 6,
        schema: z.string().default("default"),
      }),

      systemPrompt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.fields.systemPrompt.label",
        description: "post.fields.systemPrompt.description",
        placeholder: "post.fields.systemPrompt.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      instanceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.instanceId.label",
        description: "post.fields.instanceId.description",
        columns: 6,
        schema: z.string().optional(),
      }),

      tools: requestDataArrayOptionalField(
        scopedTranslation,
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          title: "post.fields.tools.title",
          description: "post.fields.tools.description",
        },
        objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { request: "data" },
          children: {
            name: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "post.fields.tools.name.label",
              description: "post.fields.tools.name.description",
              columns: 4,
              schema: z.string().min(1),
            }),
            description: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "post.fields.tools.toolDescription.label",
              description: "post.fields.tools.toolDescription.description",
              columns: 4,
              schema: z.string(),
            }),
            parameters: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.JSON,
              label: "post.fields.tools.parameters.label",
              description: "post.fields.tools.parameters.description",
              columns: 4,
              schema: z.record(z.string(), z.unknown()),
            }),
          },
        }),
      ),

      timezone: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.timezone.label",
        description: "post.fields.timezone.description",
        columns: 6,
        schema: z.string().default("UTC"),
      }),

      // === RESPONSE FIELDS ===

      responseThreadId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.responseThreadId",
        columns: 6,
        schema: z.string().uuid(),
      }),

      messageId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.messageId",
        columns: 6,
        schema: z.string().uuid(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsaved.title",
      description: "post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      simple: {
        content: "Hello, can you help me with a coding question?",
        model: ChatModelId.GPT_5_MINI,
        skill: "default",
        timezone: "UTC",
      },
      withTools: {
        content: "Search for the latest TypeScript release notes",
        model: ChatModelId.CLAUDE_HAIKU_4_5,
        skill: "default",
        instanceId: "my-remote-instance",
        tools: [
          {
            name: "web_search",
            description: "Search the web for information",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string", description: "Search query" },
              },
              required: ["query"],
            },
          },
        ],
        timezone: "America/New_York",
      },
      continueThread: {
        content: "Can you elaborate on your previous answer?",
        model: ChatModelId.CLAUDE_HAIKU_4_5,
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        skill: "default",
        timezone: "UTC",
      },
    },
    responses: {
      default: {
        responseThreadId: "550e8400-e29b-41d4-a716-446655440000",
        messageId: "660e8400-e29b-41d4-a716-446655440001",
      },
    },
  },
});

export const endpoints = { POST };

export type WsProviderStreamPostRequestInput = typeof POST.types.RequestInput;
export type WsProviderStreamPostRequestOutput = typeof POST.types.RequestOutput;
export type WsProviderStreamPostResponseInput = typeof POST.types.ResponseInput;
export type WsProviderStreamPostResponseOutput =
  typeof POST.types.ResponseOutput;

export default endpoints;
