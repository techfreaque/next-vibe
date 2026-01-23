/**
 * Branch Message Endpoint Definition
 * Creates a new branch from an existing message
 */

import { z } from "zod";

import { ModelId } from "@/app/api/[locale]/agent/models/models";
import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  requestUrlPathParamsField,
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

import { ChatMessageRole, ChatMessageRoleOptions } from "../../../../../enum";

/**
 * Create Branch Endpoint (POST)
 * Creates a new branch from an existing message
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: [
    "agent",
    "chat",
    "threads",
    "[threadId]",
    "messages",
    "[messageId]",
    "branch",
  ],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title:
    "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.title" as const,
  description:
    "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.description" as const,
  icon: "git-branch",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.validation.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.network.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.unauthorized.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.forbidden.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.notFound.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.server.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.unknown.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.conflict.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.errors.conflict.description",
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.container.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label:
          "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.threadId.label" as const,
        description:
          "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.threadId.description" as const,
        schema: z.uuid(),
      }),
      messageId: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label:
          "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.messageId.label" as const,
        description:
          "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.messageId.description" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      content: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.content.label" as const,
        description:
          "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.content.description" as const,
        schema: z.string().min(1),
      }),
      role: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label:
          "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.role.label" as const,
        description:
          "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.role.description" as const,
        options: ChatMessageRoleOptions,
        schema: z.enum(ChatMessageRole),
      }),
      model: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.model.label" as const,
        description:
          "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.model.description" as const,
        schema: z.enum(ModelId).optional(),
      }),

      // === RESPONSE ===
      message: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.response.message.title" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { response: true },
        {
          id: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.response.message.id.content" as const,
            schema: z.uuid(),
          }),
          threadId: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.response.message.threadId.content" as const,
            schema: z.uuid(),
          }),
          role: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.response.message.role.content" as const,
            schema: z.enum(ChatMessageRole),
          }),
          content: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.response.message.content.content" as const,
            schema: z.string().nullable(),
          }),
          parentId: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.response.message.parentId.content" as const,
            schema: z.uuid().nullable(),
          }),
          depth: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.response.message.depth.content" as const,
            schema: z.coerce.number(),
          }),
          authorId: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.response.message.authorId.content" as const,
            schema: z.string().nullable(),
          }),
          isAI: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.response.message.isAI.content" as const,
            schema: z.boolean(),
          }),
          model: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.response.message.model.content" as const,
            schema: z.string().nullable(),
          }),
          tokens: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.response.message.tokens.content" as const,
            schema: z.coerce.number().nullable(),
          }),
          createdAt: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.response.message.createdAt.content" as const,
            schema: dateSchema,
          }),
          updatedAt: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.response.message.updatedAt.content" as const,
            schema: dateSchema,
          }),
        },
      ),
    },
  ),

  successTypes: {
    title:
      "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.success.title",
    description:
      "app.api.agent.chat.threads.threadId.messages.messageId.branch.post.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        messageId: "660e8400-e29b-41d4-a716-446655440001",
      },
    },
    requests: {
      default: {
        content: "Let me try a different approach...",
        role: ChatMessageRole.USER,
      },
    },
    responses: {
      default: {
        message: {
          id: "770e8400-e29b-41d4-a716-446655440002",
          threadId: "550e8400-e29b-41d4-a716-446655440000",
          role: ChatMessageRole.USER,
          content: "Let me try a different approach...",
          parentId: "660e8400-e29b-41d4-a716-446655440001",
          depth: 1,
          authorId: "880e8400-e29b-41d4-a716-446655440003",
          isAI: false,
          model: null,
          tokens: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    },
  },
});

/**
 * Export definitions
 */
const definitions = { POST };

/**
 * Export type definitions
 */
export type BranchPostRequestOutput = typeof POST.types.RequestOutput;
export type BranchPostResponseOutput = typeof POST.types.ResponseOutput;
export type BranchPostUrlVariablesOutput = typeof POST.types.UrlVariablesOutput;

export default definitions;
