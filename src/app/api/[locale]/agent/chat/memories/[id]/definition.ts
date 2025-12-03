/**
 * Single Memory API Definition
 * Defines PATCH and DELETE endpoints for individual memory operations
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
 * Memory tool aliases for AI tool calling
 */
export const MEMORY_UPDATE_ALIAS = "memories:update" as const;
export const MEMORY_DELETE_ALIAS = "memories:delete" as const;

/**
 * Update Memory Endpoint (PATCH)
 * Updates an existing memory by ID
 */
const { PATCH } = createEndpoint({
  method: Methods.PATCH,
  path: ["agent", "chat", "memories", "[id]"],
  aliases: [MEMORY_UPDATE_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.memories.patch.title" as const,
  description: "app.api.agent.chat.memories.patch.description" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.memories" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.memories.patch.container.title" as const,
      description:
        "app.api.agent.chat.memories.patch.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.agent.chat.memories.patch.id.label" as const,
          description:
            "app.api.agent.chat.memories.patch.id.description" as const,
        },
        z.string().uuid(),
      ),

      // === REQUEST DATA ===
      content: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.agent.chat.memories.patch.content.label" as const,
          description:
            "app.api.agent.chat.memories.patch.content.description" as const,
          columns: 12,
        },
        z.string().min(1).max(1000).optional(),
      ),
      tags: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.memories.patch.tags.label" as const,
          description:
            "app.api.agent.chat.memories.patch.tags.description" as const,
          columns: 6,
        },
        z.array(z.string()).optional(),
      ),
      priority: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.agent.chat.memories.patch.priority.label" as const,
          description:
            "app.api.agent.chat.memories.patch.priority.description" as const,
          columns: 6,
        },
        z.number().min(0).max(100).optional(),
      ),

      // === RESPONSE ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.memories.patch.response.success.content" as const,
        },
        z.boolean(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.memories.patch.errors.validation.title" as const,
      description:
        "app.api.agent.chat.memories.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.memories.patch.errors.network.title" as const,
      description:
        "app.api.agent.chat.memories.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.memories.patch.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.memories.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.memories.patch.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.memories.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.memories.patch.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.memories.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.memories.patch.errors.server.title" as const,
      description:
        "app.api.agent.chat.memories.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.memories.patch.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.memories.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.memories.patch.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.memories.patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.memories.patch.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.memories.patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.memories.patch.success.title" as const,
    description:
      "app.api.agent.chat.memories.patch.success.description" as const,
  },

  examples: {
    requests: {
      update: {
        content:
          "Profession: Senior Software Engineer specializing in TypeScript and Python",
        tags: ["profession", "skills", "experience"],
      },
    },
    responses: {
      update: {
        success: true,
      },
    },
    urlPathParams: {
      update: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

/**
 * Delete Memory Endpoint (DELETE)
 * Removes a memory by ID
 */
const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["agent", "chat", "memories", "[id]"],
  aliases: [MEMORY_DELETE_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.memories.delete.title" as const,
  description: "app.api.agent.chat.memories.delete.description" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.memories" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.memories.delete.container.title" as const,
      description:
        "app.api.agent.chat.memories.delete.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.agent.chat.memories.delete.id.label" as const,
          description:
            "app.api.agent.chat.memories.delete.id.description" as const,
        },
        z.string().uuid(),
      ),

      // === RESPONSE ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.memories.delete.response.success.content" as const,
        },
        z.boolean(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.memories.delete.errors.validation.title" as const,
      description:
        "app.api.agent.chat.memories.delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.memories.delete.errors.network.title" as const,
      description:
        "app.api.agent.chat.memories.delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.memories.delete.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.memories.delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.memories.delete.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.memories.delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.memories.delete.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.memories.delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.memories.delete.errors.server.title" as const,
      description:
        "app.api.agent.chat.memories.delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.memories.delete.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.memories.delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.memories.delete.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.memories.delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.memories.delete.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.memories.delete.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.memories.delete.success.title" as const,
    description:
      "app.api.agent.chat.memories.delete.success.description" as const,
  },

  examples: {
    requests: undefined,
    responses: {
      delete: {
        success: true,
      },
    },
    urlPathParams: {
      delete: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

// Type exports for PATCH endpoint
export type MemoryUpdateRequestInput = typeof PATCH.types.RequestInput;
export type MemoryUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type MemoryUpdateResponseInput = typeof PATCH.types.ResponseInput;
export type MemoryUpdateResponseOutput = typeof PATCH.types.ResponseOutput;

// Type exports for DELETE endpoint
export type MemoryDeleteRequestInput = typeof DELETE.types.RequestInput;
export type MemoryDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type MemoryDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type MemoryDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

const definitions = { PATCH, DELETE };
export { PATCH, DELETE };
export default definitions;
