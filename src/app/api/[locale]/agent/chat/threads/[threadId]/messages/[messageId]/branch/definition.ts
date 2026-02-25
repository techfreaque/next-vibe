/**
 * Branch Message Endpoint Definition
 * Creates a new branch from an existing message
 */

import { z } from "zod";

import { ModelId } from "@/app/api/[locale]/agent/models/models";
import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedRequestUrlPathParamsField,
  scopedResponseField,
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
import { scopedTranslation } from "./i18n";

/**
 * Create Branch Endpoint (POST)
 * Creates a new branch from an existing message
 */
const { POST } = createEndpoint({
  scopedTranslation,
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

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "git-branch",
  category: "app.endpointCategories.chat",
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

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title" as const,
    description: "post.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === URL PARAMS ===
      threadId: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.threadId.label" as const,
        description: "post.threadId.description" as const,
        schema: z.uuid(),
      }),
      messageId: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.messageId.label" as const,
        description: "post.messageId.description" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      content: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.content.label" as const,
        description: "post.content.description" as const,
        schema: z.string().min(1),
      }),
      role: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.role.label" as const,
        description: "post.role.description" as const,
        options: ChatMessageRoleOptions,
        schema: z.enum(ChatMessageRole),
      }),
      model: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.model.label" as const,
        description: "post.model.description" as const,
        schema: z.enum(ModelId).optional(),
      }),

      // === RESPONSE ===
      message: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.message.title" as const,
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { response: true },
        children: {
          id: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.message.id.content" as const,
            schema: z.uuid(),
          }),
          threadId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.message.threadId.content" as const,
            schema: z.uuid(),
          }),
          role: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.message.role.content" as const,
            schema: z.enum(ChatMessageRole),
          }),
          content: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.message.content.content" as const,
            schema: z.string().nullable(),
          }),
          parentId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.message.parentId.content" as const,
            schema: z.uuid().nullable(),
          }),
          depth: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.message.depth.content" as const,
            schema: z.coerce.number(),
          }),
          authorId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.message.authorId.content" as const,
            schema: z.string().nullable(),
          }),
          isAI: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.message.isAI.content" as const,
            schema: z.boolean(),
          }),
          model: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.message.model.content" as const,
            schema: z.string().nullable(),
          }),
          createdAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.message.createdAt.content" as const,
            schema: dateSchema,
          }),
          updatedAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.message.updatedAt.content" as const,
            schema: dateSchema,
          }),
        },
      }),
    },
  }),

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
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
