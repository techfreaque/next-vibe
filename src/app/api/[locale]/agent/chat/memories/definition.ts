/**
 * Memories API Definition
 * Defines endpoints for managing AI memories (persistent context)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  responseArrayField,
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

import { dateSchema } from "../../../shared/types/common.schema";

/**
 * Memory tool aliases for AI tool calling
 */
export const MEMORY_LIST_ALIAS = "memories-list" as const;
export const MEMORY_ADD_ALIAS = "memories-add" as const;

/**
 * Get Memories List Endpoint (GET)
 * Retrieves all memories for the current user or lead
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "memories"],
  aliases: [MEMORY_LIST_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.memories.get.title" as const,
  description: "app.api.agent.chat.memories.get.description" as const,
  icon: "brain",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.memories" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.memories.get.container.title" as const,
      description: "app.api.agent.chat.memories.get.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { response: true },
    {
      // === RESPONSE ===
      memories: responseArrayField(
        {
          type: WidgetType.DATA_CARDS,
          layout: {
            type: LayoutType.GRID,
            columns: 1,
          },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title: "app.api.agent.chat.memories.get.response.memories.memory.title" as const,
            layoutType: LayoutType.STACKED,
            columns: 12,
          },
          { response: true },
          {
            memoryNumber: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.agent.chat.memories.get.response.memories.memory.memoryNumber.text" as const,
              },
              z.coerce.number().int(),
            ),
            content: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.memories.get.response.memories.memory.content.content" as const,
              },
              z.string(),
            ),
            priority: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.agent.chat.memories.get.response.memories.memory.priority.text" as const,
              },
              z.coerce.number(),
            ),
            tags: responseArrayField(
              {
                type: WidgetType.DATA_LIST,
              },
              responseField(
                {
                  type: WidgetType.BADGE,
                },
                z.string(),
              ),
            ),
            createdAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.memories.get.response.memories.memory.createdAt.content" as const,
              },
              dateSchema,
            ),
          },
        ),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.memories.get.errors.validation.title" as const,
      description: "app.api.agent.chat.memories.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.memories.get.errors.network.title" as const,
      description: "app.api.agent.chat.memories.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.memories.get.errors.unauthorized.title" as const,
      description: "app.api.agent.chat.memories.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.memories.get.errors.forbidden.title" as const,
      description: "app.api.agent.chat.memories.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.memories.get.errors.notFound.title" as const,
      description: "app.api.agent.chat.memories.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.memories.get.errors.server.title" as const,
      description: "app.api.agent.chat.memories.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.memories.get.errors.unknown.title" as const,
      description: "app.api.agent.chat.memories.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.memories.get.errors.unsavedChanges.title" as const,
      description: "app.api.agent.chat.memories.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.memories.get.errors.conflict.title" as const,
      description: "app.api.agent.chat.memories.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.memories.get.success.title" as const,
    description: "app.api.agent.chat.memories.get.success.description" as const,
  },

  examples: {
    requests: undefined,
    responses: {
      list: {
        memories: [
          {
            memoryNumber: 0,
            content: "Profession: Software engineer specializing in Python",
            tags: ["profession", "skills"],
            priority: 0,
            createdAt: new Date("2025-01-01T00:00:00Z"),
          },
          {
            memoryNumber: 1,
            content: "Preferences: Dark mode, coffee over tea",
            tags: ["preferences"],
            priority: 0,
            createdAt: new Date("2025-01-01T00:00:00Z"),
          },
        ],
      },
    },
    urlPathParams: undefined,
  },
});

/**
 * Add Memory Endpoint (POST)
 * Creates a new memory for the current user or lead
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["agent", "chat", "memories"],
  aliases: [MEMORY_ADD_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.memories.post.title" as const,
  description: "app.api.agent.chat.memories.post.description" as const,
  icon: "brain",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.memories" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.memories.post.container.title" as const,
      description: "app.api.agent.chat.memories.post.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data", response: true },
    {
      // === REQUEST ===
      content: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.agent.chat.memories.post.content.label" as const,
          description: "app.api.agent.chat.memories.post.content.description" as const,
          columns: 12,
        },
        z.string().min(1).max(1000),
      ),
      tags: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.memories.post.tags.label" as const,
          description: "app.api.agent.chat.memories.post.tags.description" as const,
          columns: 6,
        },
        z.array(z.string()).optional(),
      ),
      priority: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.agent.chat.memories.post.priority.label" as const,
          description: "app.api.agent.chat.memories.post.priority.description" as const,
          columns: 6,
        },
        z.coerce.number().min(0).max(100).optional(),
      ),

      // === RESPONSE ===
      id: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.memories.post.response.id.content" as const,
        },
        z.coerce.number().int(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.memories.post.errors.validation.title" as const,
      description: "app.api.agent.chat.memories.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.memories.post.errors.network.title" as const,
      description: "app.api.agent.chat.memories.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.memories.post.errors.unauthorized.title" as const,
      description: "app.api.agent.chat.memories.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.memories.post.errors.forbidden.title" as const,
      description: "app.api.agent.chat.memories.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.memories.post.errors.notFound.title" as const,
      description: "app.api.agent.chat.memories.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.memories.post.errors.server.title" as const,
      description: "app.api.agent.chat.memories.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.memories.post.errors.unknown.title" as const,
      description: "app.api.agent.chat.memories.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.memories.post.errors.unsavedChanges.title" as const,
      description: "app.api.agent.chat.memories.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.memories.post.errors.conflict.title" as const,
      description: "app.api.agent.chat.memories.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.memories.post.success.title" as const,
    description: "app.api.agent.chat.memories.post.success.description" as const,
  },

  examples: {
    requests: {
      add: {
        content: "Allergies: Peanuts",
        tags: ["health", "allergies"],
        priority: 10,
      },
    },
    responses: {
      add: {
        id: 0,
      },
    },
    urlPathParams: undefined,
  },
});

// Type exports for GET endpoint
export type MemoriesListRequestInput = typeof GET.types.RequestInput;
export type MemoriesListRequestOutput = typeof GET.types.RequestOutput;
export type MemoriesListResponseInput = typeof GET.types.ResponseInput;
export type MemoriesListResponseOutput = typeof GET.types.ResponseOutput;
export type MemoriesList = MemoriesListResponseOutput["memories"];

// Type exports for POST endpoint
export type MemoryAddRequestInput = typeof POST.types.RequestInput;
export type MemoryAddRequestOutput = typeof POST.types.RequestOutput;
export type MemoryAddResponseInput = typeof POST.types.ResponseInput;
export type MemoryAddResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { GET, POST };
export default definitions;
