/**
 * WS Provider Stream API Definition
 * POST /agent/ai-stream/ws-provider/stream
 *
 * Starts an AI stream for a remote WS Provider client.
 * The client sends a message + model. AI events stream via WebSocket.
 * All tools are executed server-side - the client only observes events.
 */

import { z } from "zod";

import {
  ChatModelId,
  ChatModelIdOptions,
} from "@/app/api/[locale]/agent/ai-stream/models";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import {
  type ChatMessage,
  selectChatMessageSchema,
} from "@/app/api/[locale]/agent/chat/db";
import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
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
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "radio",
  category: "ai",
  subCategory: "Inference",
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
        // Empty content is valid for confirmation-resume turns - the AI
        // continues from the confirmed tool result without a new user message.
        schema: z.string(),
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

      rootFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.rootFolderId.label",
        description: "post.fields.rootFolderId.description",
        columns: 6,
        schema: z.nativeEnum(DefaultFolderId).optional(),
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

      threadMirrorMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.threadMirrorMode.label",
        description: "post.fields.threadMirrorMode.description",
        columns: 6,
        schema: z.enum(["both", "local", "cloud", "none"]).optional(),
      }),

      folderPath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "post.fields.folderPath.label",
        description: "post.fields.folderPath.description",
        columns: 6,
        schema: z.array(z.string()).optional(),
      }),

      userMessageId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.userMessageId.label",
        description: "post.fields.userMessageId.description",
        columns: 6,
        schema: z.string().uuid().optional(),
      }),

      parentMessageId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.parentMessageId.label",
        description: "post.fields.parentMessageId.description",
        columns: 6,
        schema: z.string().uuid().optional(),
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

      toolConfirmations: requestDataArrayOptionalField(
        scopedTranslation,
        {
          type: WidgetType.CONTAINER,
          title: "post.fields.toolConfirmations.title",
          description: "post.fields.toolConfirmations.description",
        },
        objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { request: "data" },
          children: {
            messageId: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "post.fields.toolConfirmations.messageId.label",
              description:
                "post.fields.toolConfirmations.messageId.description",
              schema: z.string().uuid(),
            }),
            confirmed: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "post.fields.toolConfirmations.confirmed.label",
              description:
                "post.fields.toolConfirmations.confirmed.description",
              schema: z.boolean(),
            }),
            updatedArgs: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.JSON,
              label: "post.fields.toolConfirmations.updatedArgs.label",
              description:
                "post.fields.toolConfirmations.updatedArgs.description",
              schema: z
                .record(
                  z.string(),
                  z.union([
                    z.string(),
                    z.coerce.number(),
                    z.boolean(),
                    z.null(),
                  ]),
                )
                .optional(),
            }),
          },
        }),
      ),

      confirmationOverrides: requestDataArrayOptionalField(
        scopedTranslation,
        {
          type: WidgetType.CONTAINER,
          title: "post.fields.confirmationOverrides.title",
          description: "post.fields.confirmationOverrides.description",
        },
        objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { request: "data" },
          children: {
            toolId: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "post.fields.confirmationOverrides.toolId.label",
              description:
                "post.fields.confirmationOverrides.toolId.description",
              schema: z.string(),
            }),
            requiresConfirmation: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "post.fields.confirmationOverrides.requiresConfirmation.label",
              description:
                "post.fields.confirmationOverrides.requiresConfirmation.description",
              schema: z.boolean(),
            }),
          },
        }),
      ),

      attachments: requestDataArrayOptionalField(
        scopedTranslation,
        {
          type: WidgetType.CONTAINER,
          title: "post.fields.attachments.title",
          description: "post.fields.attachments.description",
        },
        objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { request: "data" },
          children: {
            filename: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "post.fields.attachments.filename.label",
              description: "post.fields.attachments.filename.description",
              schema: z.string().min(1),
            }),
            mimeType: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "post.fields.attachments.mimeType.label",
              description: "post.fields.attachments.mimeType.description",
              schema: z.string().min(1),
            }),
            data: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label: "post.fields.attachments.data.label",
              description: "post.fields.attachments.data.description",
              schema: z.string().min(1),
            }),
          },
        }),
      ),

      messageHistory: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "post.fields.messageHistory.label",
        description: "post.fields.messageHistory.description",
        schema: z
          .array(
            selectChatMessageSchema.extend({
              createdAt: dateSchema.nullable(),
              updatedAt: dateSchema.nullable(),
              // Tool messages may send content as an array (AI SDK multi-part
              // content format). Accept and coerce to JSON string.
              content: z
                .union([
                  z.string(),
                  z.array(z.unknown()),
                  z.record(z.string(), z.unknown()),
                  z.null(),
                ])
                .transform((v) =>
                  typeof v === "string" || v === null ? v : JSON.stringify(v),
                )
                .optional(),
              errorMessage: z
                .union([z.string(), z.unknown()])
                .transform((v) =>
                  typeof v === "string" || v === null || v === undefined
                    ? v
                    : JSON.stringify(v),
                )
                .optional(),
              // DB-populated fields absent in client-side messages
              authorId: z.string().nullish(),
              authorName: z.string().nullish(),
              errorType: z.string().nullish(),
              errorCode: z.string().nullish(),
              upvotes: z.number().nullish(),
              downvotes: z.number().nullish(),
              searchVector: z.string().nullish(),
            }),
          )
          .optional()
          .nullable() as z.ZodType<ChatMessage[]>,
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
        messageHistory: [],
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
        messageHistory: [],
      },
      continueThread: {
        content: "Can you elaborate on your previous answer?",
        model: ChatModelId.CLAUDE_HAIKU_4_5,
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        skill: "default",
        timezone: "UTC",
        messageHistory: [],
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
