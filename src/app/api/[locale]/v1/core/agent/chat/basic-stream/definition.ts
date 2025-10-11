/**
 * Basic Stream API Route Definition
 * Defines endpoint for basic streaming functionality with random string generation
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Basic Stream Endpoint (POST)
 * Streams random strings progressively using a for-loop
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "agent", "chat", "basic-stream"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.v1.core.agent.chat.basicStream.post.title",
  description: "app.api.v1.core.agent.chat.basicStream.post.description",
  category: "app.api.v1.core.agent.category",
  tags: [
    "app.api.v1.core.agent.tags.streaming",
    "app.api.v1.core.agent.tags.chat",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.chat.basicStream.post.form.title",
      description:
        "app.api.v1.core.agent.chat.basicStream.post.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      count: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.agent.chat.basicStream.post.count.label",
          description:
            "app.api.v1.core.agent.chat.basicStream.post.count.description",
          layout: { columns: 4 },
        },
        z.number().min(1).max(100).default(10),
      ),
      delay: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.agent.chat.basicStream.post.delay.label",
          description:
            "app.api.v1.core.agent.chat.basicStream.post.delay.description",
          layout: { columns: 4 },
        },
        z.number().min(100).max(5000).default(1000),
      ),
      prefix: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.agent.chat.basicStream.post.prefix.label",
          description:
            "app.api.v1.core.agent.chat.basicStream.post.prefix.description",
          layout: { columns: 4 },
        },
        z.string().max(50).default("Message"),
      ),
      includeTimestamp: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.agent.chat.basicStream.post.includeTimestamp.label",
          description:
            "app.api.v1.core.agent.chat.basicStream.post.includeTimestamp.description",
          layout: { columns: 6 },
        },
        z.boolean().default(true),
      ),
      includeCounter: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.agent.chat.basicStream.post.includeCounter.label",
          description:
            "app.api.v1.core.agent.chat.basicStream.post.includeCounter.description",
          layout: { columns: 6 },
        },
        z.boolean().default(true),
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.agent.chat.basicStream.post.response.title",
          description:
            "app.api.v1.core.agent.chat.basicStream.post.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.basicStream.post.response.success",
            },
            z.boolean(),
          ),
          totalMessages: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.basicStream.post.response.totalMessages",
            },
            z.number(),
          ),
          duration: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.basicStream.post.response.duration",
            },
            z.number(),
          ),
          completed: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.basicStream.post.response.completed",
            },
            z.boolean(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.basicStream.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.basicStream.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.basicStream.post.errors.validation.title",
      description:
        "app.api.v1.core.agent.chat.basicStream.post.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.agent.chat.basicStream.post.errors.server.title",
      description:
        "app.api.v1.core.agent.chat.basicStream.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.agent.chat.basicStream.post.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.basicStream.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.agent.chat.basicStream.post.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.basicStream.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.basicStream.post.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.basicStream.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.basicStream.post.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.basicStream.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.basicStream.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.basicStream.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.basicStream.post.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.basicStream.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.chat.basicStream.post.success.title",
    description:
      "app.api.v1.core.agent.chat.basicStream.post.success.description",
  },

  examples: {
    requests: {
      default: {
        count: 10,
        delay: 1000,
        prefix: "Message",
        includeTimestamp: true,
        includeCounter: true,
      },
      fast: {
        count: 5,
        delay: 500,
        prefix: "Quick",
        includeTimestamp: false,
        includeCounter: true,
      },
      slow: {
        count: 20,
        delay: 2000,
        prefix: "Slow",
        includeTimestamp: true,
        includeCounter: false,
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          totalMessages: 10,
          duration: 10000,
          completed: true,
        },
      },
      fast: {
        response: {
          success: true,
          totalMessages: 5,
          duration: 2500,
          completed: true,
        },
      },
      slow: {
        response: {
          success: true,
          totalMessages: 20,
          duration: 40000,
          completed: true,
        },
      },
    },
    urlPathVariables: undefined,
  },
});

// Extract types using the new enhanced system
export type BasicStreamPostRequestTypeInput = typeof POST.types.RequestInput;
export type BasicStreamPostRequestTypeOutput = typeof POST.types.RequestOutput;
export type BasicStreamPostResponseTypeInput = typeof POST.types.ResponseInput;
export type BasicStreamPostResponseTypeOutput =
  typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  POST,
};

export { POST };
export default definitions;
