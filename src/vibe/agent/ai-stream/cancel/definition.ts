/**
 * AI Stream Cancel Endpoint Definition
 * Cancels an active AI streaming response for a given thread.
 */

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
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "ai-stream", "cancel"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PUBLIC,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_OFF,
  ],

  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "square",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.streaming"],

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
    title: "post.container.title",
    description: "post.container.description",
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST ===
      threadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("next-vibe/agent/chat/threads/definition")).default.GET,
        labelField: "title",
        label: "post.threadId.label",
        description: "post.threadId.description",
        schema: z.string().uuid(),
      }),

      // === RESPONSE ===
      cancelled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.cancelled",
        schema: z.boolean(),
      }),
    },
  }),

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
      },
    },
    responses: {
      default: {
        cancelled: true,
      },
    },
  },
});

export type AiStreamCancelPostRequestOutput = typeof POST.types.RequestOutput;
export type AiStreamCancelPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
