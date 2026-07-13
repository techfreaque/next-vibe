/**
 * View Image - Definition
 * Fetches a stored image by URL and returns it so the AI can re-examine it.
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
import { objectField, requestField } from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { AGENT_VIEW_IMAGE_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "view-image"],
  aliases: [AGENT_VIEW_IMAGE_ALIAS] as const,
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "image",
  category: "ai",
  subCategory: "Tools",
  tags: ["tags.vision", "tags.ai"],
  dynamicTitle: ({ request }) => {
    if (!request?.url) {
      return undefined;
    }
    const short =
      request.url.length > 60 ? `${request.url.slice(0, 60)}...` : request.url;
    return {
      message: "post.dynamicTitle" as const,
      messageParams: { url: short },
    };
  },

  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PUBLIC],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.title",
    description: "post.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      url: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.url.label",
        description: "post.url.description",
        placeholder: "post.url.placeholder",
        columns: 12,
        schema: z
          .string()
          .url()
          .describe(
            "Storage URL of the image to fetch and display. Pass the URL from the [image: ...] stub in a previous tool result.",
          ),
      }),
    },
  }),

  examples: {
    requests: {
      default: {
        url: "https://example.com/api/en-GLOBAL/agent/chat/threads/files/thread-123/screenshot-abc.png",
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation_failed.title",
      description: "post.errors.validation_failed.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network_error.title",
      description: "post.errors.network_error.description",
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
      title: "post.errors.not_found.title",
      description: "post.errors.not_found.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server_error.title",
      description: "post.errors.server_error.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown_error.title",
      description: "post.errors.unknown_error.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsaved_changes.title",
      description: "post.errors.unsaved_changes.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
});

export type ViewImagePostRequestInput = typeof POST.types.RequestInput;
export type ViewImagePostRequestOutput = typeof POST.types.RequestOutput;
export type ViewImagePostResponseInput = typeof POST.types.ResponseInput;
export type ViewImagePostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
