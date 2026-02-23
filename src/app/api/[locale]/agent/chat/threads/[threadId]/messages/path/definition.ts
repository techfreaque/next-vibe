/**
 * Conversation Path Endpoint Definition
 * Retrieves messages following a specific conversation path
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedRequestUrlPathParamsField,
  scopedResponseArrayFieldNew,
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

import { ChatMessageRole } from "../../../../enum";
import { scopedTranslation } from "./i18n";

/**
 * Get Conversation Path Endpoint (GET)
 * Retrieves messages following a specific conversation path
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "threads", "[threadId]", "messages", "path"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "arrow-right",
  category: "category" as const,
  tags: ["tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
  },

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.container.title" as const,
    description: "get.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === URL PARAMS ===
      threadId: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.threadId.label" as const,
        description: "get.threadId.description" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      branchIndices: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "get.branchIndices.label" as const,
        description: "get.branchIndices.description" as const,
        schema: z.record(z.string(), z.coerce.number()).optional(),
      }),

      // === RESPONSE ===
      messages: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "get.response.messages.message.title" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
          usage: { response: true },
          children: {
            id: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.id.content" as const,
              schema: z.uuid(),
            }),
            threadId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.threadId.content" as const,
              schema: z.uuid(),
            }),
            role: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.role.content" as const,
              schema: z.enum(ChatMessageRole),
            }),
            content: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.content.content" as const,
              schema: z.string().nullable(),
            }),
            parentId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.parentId.content" as const,
              schema: z.uuid().nullable(),
            }),
            depth: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.depth.content" as const,
              schema: z.coerce.number(),
            }),
            authorId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.authorId.content" as const,
              schema: z.string().nullable(),
            }),
            isAI: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.isAI.content" as const,
              schema: z.boolean(),
            }),
            model: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.model.content" as const,
              schema: z.string().nullable(),
            }),
            createdAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.createdAt.content" as const,
              schema: dateSchema,
            }),
            updatedAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.updatedAt.content" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),
    },
  }),

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    urlPathParams: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: {
        branchIndices: {
          "660e8400-e29b-41d4-a716-446655440001": 0,
          "770e8400-e29b-41d4-a716-446655440002": 1,
        },
      },
    },
    responses: {
      default: {
        messages: [
          {
            id: "660e8400-e29b-41d4-a716-446655440000",
            threadId: "550e8400-e29b-41d4-a716-446655440000",
            role: ChatMessageRole.USER,
            content: "Hello, how can you help me?",
            parentId: null,
            depth: 0,
            authorId: "770e8400-e29b-41d4-a716-446655440000",
            isAI: false,
            model: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    },
  },
});

/**
 * Export definitions
 */
export const definitions = { GET };

/**
 * Export type definitions
 */
export type PathGetRequestOutput = typeof GET.types.RequestOutput;
export type PathGetResponseOutput = typeof GET.types.ResponseOutput;
export type PathGetUrlVariablesOutput = typeof GET.types.UrlVariablesOutput;

export default definitions;
