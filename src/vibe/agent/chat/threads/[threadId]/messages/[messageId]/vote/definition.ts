/**
 * Vote Message Endpoint Definition
 * Handles upvoting and downvoting messages
 */

import {
  DefaultFolderId,
  rootFolderIdOptions,
} from "next-vibe/agent/chat/config";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
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

import { scopedTranslation } from "./i18n";

/**
 * Vote Message Endpoint (POST)
 * Upvote, downvote, or remove vote from a message
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: [
    "vibe",
    "agent",
    "chat",
    "threads",
    "[threadId]",
    "messages",
    "[messageId]",
    "vote",
  ],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "thumbs-up",
  category: "ai",
  subCategory: "messagesModerating",
  tags: ["tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
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
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title" as const,
    description: "post.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("../../../../definition")).default.GET,
        labelField: "title",
        label: "post.threadId.label" as const,
        description: "post.threadId.description" as const,
        schema: z.uuid(),
      }),
      messageId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.messageId.label" as const,
        description: "post.messageId.description" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      rootFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.rootFolderId.label" as const,
        description: "post.rootFolderId.description" as const,
        columns: 6,
        options: rootFolderIdOptions,
        schema: z.enum(DefaultFolderId),
      }),
      vote: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.vote.label" as const,
        description: "post.vote.description" as const,
        options: [
          {
            label: "post.vote.options.upvote" as const,
            value: "up",
          },
          {
            label: "post.vote.options.downvote" as const,
            value: "down",
          },
          {
            label: "post.vote.options.remove" as const,
            value: "remove",
          },
        ],
        schema: z.enum(["up", "down", "remove"]),
      }),

      // === RESPONSE ===
      upvotes: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.upvotes.content" as const,
        schema: z.coerce.number(),
      }),
      downvotes: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.downvotes.content" as const,
        schema: z.coerce.number(),
      }),
      userVote: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.userVote.content" as const,
        schema: z.enum(["up", "down", "none"]),
      }),
    },
  }),

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  // Route to client (localStorage) for incognito threads - voting is a no-op there
  useClientRoute: ({ data }) => data.rootFolderId === DefaultFolderId.INCOGNITO,

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
        rootFolderId: DefaultFolderId.PRIVATE,
        vote: "up" as const,
      },
      upvote: {
        rootFolderId: DefaultFolderId.PRIVATE,
        vote: "up" as const,
      },
      downvote: {
        rootFolderId: DefaultFolderId.PRIVATE,
        vote: "down" as const,
      },
      removeVote: {
        rootFolderId: DefaultFolderId.PRIVATE,
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
