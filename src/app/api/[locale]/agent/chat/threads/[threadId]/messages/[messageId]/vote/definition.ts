/**
 * Vote Message Endpoint Definition
 * Handles upvoting and downvoting messages
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  requestUrlPathParamsField,
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

/**
 * Vote Message Endpoint (POST)
 * Upvote, downvote, or remove vote from a message
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
    "vote",
  ],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title:
    "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.title" as const,
  description:
    "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.description" as const,
  icon: "thumbs-up",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.validation.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.network.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.unauthorized.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.forbidden.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.notFound.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.server.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.unknown.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.conflict.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.errors.conflict.description",
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.container.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.threadId.label" as const,
          description:
            "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.threadId.description" as const,
        },
        z.uuid(),
      ),
      messageId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.messageId.label" as const,
          description:
            "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.messageId.description" as const,
        },
        z.uuid(),
      ),

      // === REQUEST DATA ===
      vote: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.vote.label" as const,
          description:
            "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.vote.description" as const,
          options: [
            {
              label:
                "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.vote.options.upvote" as const,
              value: "up",
            },
            {
              label:
                "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.vote.options.downvote" as const,
              value: "down",
            },
            {
              label:
                "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.vote.options.remove" as const,
              value: "remove",
            },
          ],
        },
        z.enum(["up", "down", "remove"]),
      ),

      // === RESPONSE ===
      upvotes: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.response.upvotes.content" as const,
        },
        z.coerce.number(),
      ),
      downvotes: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.response.downvotes.content" as const,
        },
        z.coerce.number(),
      ),
      userVote: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.response.userVote.content" as const,
        },
        z.enum(["up", "down", "none"]),
      ),
    },
  ),

  successTypes: {
    title:
      "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.success.title",
    description:
      "app.api.agent.chat.threads.threadId.messages.messageId.vote.post.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        messageId: "660e8400-e29b-41d4-a716-446655440001",
      },
      upvote: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        messageId: "660e8400-e29b-41d4-a716-446655440001",
      },
      downvote: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        messageId: "660e8400-e29b-41d4-a716-446655440001",
      },
      removeVote: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        messageId: "660e8400-e29b-41d4-a716-446655440001",
      },
    },
    requests: {
      default: {
        vote: "up" as const,
      },
      upvote: {
        vote: "up" as const,
      },
      downvote: {
        vote: "down" as const,
      },
      removeVote: {
        vote: "remove" as const,
      },
    },
    responses: {
      default: {
        upvotes: 5,
        downvotes: 1,
        userVote: "up" as const,
      },
      upvote: {
        upvotes: 5,
        downvotes: 1,
        userVote: "up" as const,
      },
      downvote: {
        upvotes: 4,
        downvotes: 2,
        userVote: "down" as const,
      },
      removeVote: {
        upvotes: 4,
        downvotes: 1,
        userVote: "none" as const,
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
export type VotePostRequestOutput = typeof POST.types.RequestOutput;
export type VotePostResponseOutput = typeof POST.types.ResponseOutput;
export type VotePostUrlVariablesOutput = typeof POST.types.UrlVariablesOutput;

export default definitions;
