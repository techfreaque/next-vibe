/**
 * Single Persona API Definition
 * Defines endpoints for GET, PATCH (update), and DELETE operations on a single persona
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import {
  objectField,
  requestDataField,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { ModelId, ModelIdOptions } from "../../model-access/models";
import { CategoryOptions, DEFAULT_CATEGORIES } from "../config";

/**
 * Get Single Persona Endpoint (GET)
 * Retrieves a specific persona by ID (default or custom)
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "agent", "chat", "personas", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PUBLIC] as const,

  title: "app.api.v1.core.agent.chat.personas.id.get.title" as const,
  description:
    "app.api.v1.core.agent.chat.personas.id.get.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.personas" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.personas.id.get.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.get.container.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { request: "urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.agent.chat.personas.id.get.id.label" as const,
          description:
            "app.api.v1.core.agent.chat.personas.id.get.id.description" as const,
        },
        z.string(), // Can be default persona ID or UUID
      ),

      // === RESPONSE ===
      persona: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.agent.chat.personas.id.get.response.persona.title" as const,
          layout: { type: LayoutType.GRID, columns: 2 },
        },
        { response: true },
        {
          id: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.personas.id.get.response.persona.id.content" as const,
            },
            z.string(),
          ),
          name: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.personas.id.get.response.persona.name.content" as const,
            },
            z.string(),
          ),
          description: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.personas.id.get.response.persona.description.content" as const,
            },
            z.string(),
          ),
          icon: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.personas.id.get.response.persona.icon.content" as const,
            },
            z.string(),
          ),
          systemPrompt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.personas.id.get.response.persona.systemPrompt.content" as const,
            },
            z.string(),
          ),
          category: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.personas.id.get.response.persona.category.content" as const,
            },
            z.enum(DEFAULT_CATEGORIES.map((c) => c.id)),
          ),
          source: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.personas.id.get.response.persona.source.content" as const,
            },
            z.enum(["built-in", "my", "community"]),
          ),
          preferredModel: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.personas.id.get.response.persona.preferredModel.content" as const,
            },
            z.enum(ModelId).optional(),
          ),
          suggestedPrompts: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.personas.id.get.response.persona.suggestedPrompts.content" as const,
            },
            z.array(z.string()).optional(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.get.errors.validation.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.get.errors.network.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.get.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.get.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.get.errors.notFound.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.get.errors.server.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.get.errors.unknown.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.get.errors.conflict.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.chat.personas.id.get.success.title" as const,
    description:
      "app.api.v1.core.agent.chat.personas.id.get.success.description" as const,
  },

  examples: {
    requests: undefined,
    responses: {
      getDefault: {
        persona: {
          id: "default",
          name: "Default",
          description: "The models unmodified behavior",
          icon: "🤖",
          systemPrompt: "",
          category: "general",
          source: "built-in",
          suggestedPrompts: ["Help me brainstorm ideas"],
        },
      },
      getCustom: {
        persona: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          name: "Code Reviewer",
          description: "Expert at reviewing code",
          icon: "👨‍💻",
          systemPrompt: "You are an expert code reviewer...",
          category: "technical",
          source: "my",
          preferredModel: ModelId.GPT_5,
          suggestedPrompts: ["Review this code"],
        },
      },
    },
    urlPathParams: {
      getDefault: { id: "default" },
      getCustom: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

/**
 * Update Persona Endpoint (PATCH)
 * Updates a custom persona (only custom personas can be updated)
 */
const { PATCH } = createEndpoint({
  method: Methods.PATCH,
  path: ["v1", "core", "agent", "chat", "personas", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.v1.core.agent.chat.personas.id.patch.title" as const,
  description:
    "app.api.v1.core.agent.chat.personas.id.patch.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.personas" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.personas.id.patch.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.patch.container.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { request: "data&urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.agent.chat.personas.id.patch.id.label" as const,
          description:
            "app.api.v1.core.agent.chat.personas.id.patch.id.description" as const,
        },
        z.string(),
      ),

      // === REQUEST DATA (all optional for PATCH) ===
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.agent.chat.personas.id.patch.name.label" as const,
          description:
            "app.api.v1.core.agent.chat.personas.id.patch.name.description" as const,
          layout: { columns: 6 },
        },
        z.string().min(1).max(100).optional(),
      ),
      personaDescription: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.agent.chat.personas.id.patch.personaDescription.label" as const,
          description:
            "app.api.v1.core.agent.chat.personas.id.patch.personaDescription.description" as const,
          layout: { columns: 6 },
        },
        z.string().min(1).max(500).optional(),
      ),
      icon: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.agent.chat.personas.id.patch.icon.label" as const,
          description:
            "app.api.v1.core.agent.chat.personas.id.patch.icon.description" as const,
          layout: { columns: 6 },
        },
        z.string().min(1).max(10).optional(),
      ),
      systemPrompt: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.agent.chat.personas.id.patch.systemPrompt.label" as const,
          description:
            "app.api.v1.core.agent.chat.personas.id.patch.systemPrompt.description" as const,
          layout: { columns: 12 },
        },
        z.string().min(1).max(5000).optional(),
      ),
      category: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.agent.chat.personas.id.patch.category.label" as const,
          description:
            "app.api.v1.core.agent.chat.personas.id.patch.category.description" as const,
          options: CategoryOptions,
          layout: { columns: 6 },
        },
        z.enum(DEFAULT_CATEGORIES.map((c) => c.id)).optional(),
      ),
      preferredModel: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.agent.chat.personas.id.patch.preferredModel.label" as const,
          description:
            "app.api.v1.core.agent.chat.personas.id.patch.preferredModel.description" as const,
          options: ModelIdOptions,
          layout: { columns: 6 },
        },
        z.enum(ModelId).optional(),
      ),

      // === RESPONSE ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.personas.id.patch.response.success.content" as const,
        },
        z.boolean(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.validation.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.network.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.notFound.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.server.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.unknown.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.conflict.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.id.patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.v1.core.agent.chat.personas.id.patch.success.title" as const,
    description:
      "app.api.v1.core.agent.chat.personas.id.patch.success.description" as const,
  },

  examples: {
    requests: {
      update: {
        name: "Updated Code Reviewer",
        personaDescription: "Updated description",
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

// Type exports for GET endpoint
export type PersonaGetRequestInput = typeof GET.types.RequestInput;
export type PersonaGetRequestOutput = typeof GET.types.RequestOutput;
export type PersonaGetResponseInput = typeof GET.types.ResponseInput;
export type PersonaGetResponseOutput = typeof GET.types.ResponseOutput;

// Type exports for PATCH endpoint
export type PersonaUpdateRequestInput = typeof PATCH.types.RequestInput;
export type PersonaUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type PersonaUpdateResponseInput = typeof PATCH.types.ResponseInput;
export type PersonaUpdateResponseOutput = typeof PATCH.types.ResponseOutput;

const definitions = { GET, PATCH };
export { GET, PATCH };
export default definitions;
