/**
 * Personas API Definition
 * Defines endpoints for listing and creating personas
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
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { ModelId, ModelIdOptions } from "../model-access/models";
import { CategoryOptions, DEFAULT_CATEGORIES } from "./config";

/**
 * Get Personas List Endpoint (GET)
 * Retrieves all personas (default + custom) for the current user
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "agent", "chat", "personas"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PUBLIC] as const,

  title: "app.api.v1.core.agent.chat.personas.get.title" as const,
  description: "app.api.v1.core.agent.chat.personas.get.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.personas" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.chat.personas.get.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.get.container.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { response: true },
    {
      // === RESPONSE ===
      personas: responseArrayField(
        {
          type: WidgetType.DATA_CARDS,
          layout: "grid",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.agent.chat.personas.get.response.personas.persona.title" as const,
            layout: { type: LayoutType.GRID, columns: 2 },
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.personas.get.response.personas.persona.id.content" as const,
              },
              z.string(),
            ),
            name: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.personas.get.response.personas.persona.name.content" as const,
              },
              z.string(),
            ),
            description: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.personas.get.response.personas.persona.description.content" as const,
              },
              z.string(),
            ),
            icon: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.personas.get.response.personas.persona.icon.content" as const,
              },
              z.string(),
            ),
            systemPrompt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.personas.get.response.personas.persona.systemPrompt.content" as const,
              },
              z.string(),
            ),
            category: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.personas.get.response.personas.persona.category.content" as const,
              },
              z.enum(DEFAULT_CATEGORIES.map((c) => c.id)),
            ),
            source: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.personas.get.response.personas.persona.source.content" as const,
              },
              z.enum(["built-in", "my", "community"]),
            ),
            preferredModel: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.personas.get.response.personas.persona.preferredModel.content" as const,
              },
              z.enum(ModelId).optional(),
            ),
            suggestedPrompts: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.personas.get.response.personas.persona.suggestedPrompts.content" as const,
              },
              z.array(z.string()).optional(),
            ),
          },
        ),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.personas.get.errors.validation.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.personas.get.errors.network.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.personas.get.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.personas.get.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.personas.get.errors.notFound.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.personas.get.errors.server.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.personas.get.errors.unknown.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.personas.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.personas.get.errors.conflict.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.chat.personas.get.success.title" as const,
    description:
      "app.api.v1.core.agent.chat.personas.get.success.description" as const,
  },

  examples: {
    requests: undefined,
    responses: {
      listAll: {
        personas: [
          {
            id: "default",
            name: "Default",
            description: "The models unmodified behavior",
            icon: "🤖",
            systemPrompt: "",
            category: "general",
            source: "built-in",
            suggestedPrompts: [
              "Help me brainstorm ideas for a new project",
              "Explain quantum computing in simple terms",
            ],
          },
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            name: "My Custom Persona",
            description: "A custom persona I created",
            icon: "🎯",
            systemPrompt: "You are a helpful assistant specialized in...",
            category: "technical",
            source: "my",
            preferredModel: ModelId.GPT_5,
            suggestedPrompts: ["Help me with coding", "Review my architecture"],
          },
        ],
      },
    },
    urlPathParams: undefined,
  },
});

/**
 * Create Persona Endpoint (POST)
 * Creates a new custom persona for the current user
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "agent", "chat", "personas"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.v1.core.agent.chat.personas.post.title" as const,
  description: "app.api.v1.core.agent.chat.personas.post.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.personas" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.personas.post.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.post.container.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { request: "data", response: true },
    {
      // === REQUEST ===
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.agent.chat.personas.post.name.label" as const,
          description:
            "app.api.v1.core.agent.chat.personas.post.name.description" as const,
          layout: { columns: 6 },
        },
        z.string().min(1).max(100),
      ),
      description: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.agent.chat.personas.post.personaDescription.label" as const,
          description:
            "app.api.v1.core.agent.chat.personas.post.personaDescription.description" as const,
          layout: { columns: 6 },
        },
        z.string().min(1).max(500),
      ),
      icon: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.agent.chat.personas.post.icon.label" as const,
          description:
            "app.api.v1.core.agent.chat.personas.post.icon.description" as const,
          layout: { columns: 6 },
        },
        z.string().min(1).max(10),
      ),
      systemPrompt: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.agent.chat.personas.post.systemPrompt.label" as const,
          description:
            "app.api.v1.core.agent.chat.personas.post.systemPrompt.description" as const,
          layout: { columns: 12 },
        },
        z.string().min(1).max(5000),
      ),
      category: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.agent.chat.personas.post.category.label" as const,
          description:
            "app.api.v1.core.agent.chat.personas.post.category.description" as const,
          options: CategoryOptions,
          layout: { columns: 6 },
        },
        z.enum(DEFAULT_CATEGORIES.map((c) => c.id)),
      ),
      preferredModel: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.agent.chat.personas.post.preferredModel.label" as const,
          description:
            "app.api.v1.core.agent.chat.personas.post.preferredModel.description" as const,
          options: ModelIdOptions,
          layout: { columns: 6 },
        },
        z.enum(ModelId).optional(),
      ),
      suggestedPrompts: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.agent.chat.personas.post.suggestedPrompts.label" as const,
          description:
            "app.api.v1.core.agent.chat.personas.post.suggestedPrompts.description" as const,
          layout: { columns: 12 },
        },
        z.array(z.string()).max(4).optional(),
      ),

      // === RESPONSE ===
      id: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.personas.post.response.id.content" as const,
        },
        z.string(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.personas.post.errors.validation.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.personas.post.errors.network.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.personas.post.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.personas.post.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.personas.post.errors.notFound.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.personas.post.errors.server.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.personas.post.errors.unknown.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.personas.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.personas.post.errors.conflict.title" as const,
      description:
        "app.api.v1.core.agent.chat.personas.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.chat.personas.post.success.title" as const,
    description:
      "app.api.v1.core.agent.chat.personas.post.success.description" as const,
  },

  examples: {
    requests: {
      create: {
        name: "Code Reviewer",
        description: "Expert at reviewing code and suggesting improvements",
        icon: "👨‍💻",
        systemPrompt:
          "You are an expert code reviewer. Analyze code for bugs, performance issues, and best practices.",
        category: "technical",
        preferredModel: ModelId.GPT_5,
        suggestedPrompts: [
          "Review this code for bugs",
          "Suggest performance improvements",
        ],
      },
    },
    responses: {
      create: {
        id: "550e8400-e29b-41d4-a716-446655440000",
      },
    },
    urlPathParams: undefined,
  },
});

// Type exports for GET endpoint
export type PersonaListRequestInput = typeof GET.types.RequestInput;
export type PersonaListRequestOutput = typeof GET.types.RequestOutput;
export type PersonaListResponseInput = typeof GET.types.ResponseInput;
export type PersonaListResponseOutput = typeof GET.types.ResponseOutput;

// Type exports for POST endpoint
export type PersonaCreateRequestInput = typeof POST.types.RequestInput;
export type PersonaCreateRequestOutput = typeof POST.types.RequestOutput;
export type PersonaCreateResponseInput = typeof POST.types.ResponseInput;
export type PersonaCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { GET, POST };
export { GET, POST };
export default definitions;
