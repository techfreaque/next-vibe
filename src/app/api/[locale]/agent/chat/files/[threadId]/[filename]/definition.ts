/**
 * Chat File Serving Endpoint Definition
 * Serves uploaded files from filesystem storage
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestUrlPathParamsField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

/**
 * Request schema
 */
const ChatFileRequestSchema = z.object({
  threadId: z.string().uuid(),
  filename: z.string().min(1),
});

export type ChatFileRequestInput = z.input<typeof ChatFileRequestSchema>;
export type ChatFileRequestOutput = z.output<typeof ChatFileRequestSchema>;

/**
 * Endpoint definition
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "files", "[threadId]", "[filename]"],
  title: "app.api.agent.chat.folders.get.title" as const,
  description: "app.api.agent.chat.folders.get.description" as const,
  category: "app.api.agent.chat.category" as const,
  icon: "download" as const,
  tags: ["app.api.agent.chat.tags.folders" as const],
  allowedRoles: [],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams" },
    {
      threadId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
        },
        z.uuid(),
      ),
      filename: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
        },
        z.string().min(1),
      ),
    },
  ),
  errorTypes: {
    validation_failed: {
      title: "app.api.agent.chat.folders.get.errors.validation.title",
      description:
        "app.api.agent.chat.folders.get.errors.validation.description",
    },
    network_error: {
      title: "app.api.agent.chat.folders.get.errors.network.title",
      description: "app.api.agent.chat.folders.get.errors.network.description",
    },
    unauthorized: {
      title: "app.api.agent.chat.folders.get.errors.unauthorized.title",
      description:
        "app.api.agent.chat.folders.get.errors.unauthorized.description",
    },
    forbidden: {
      title: "app.api.agent.chat.folders.get.errors.forbidden.title",
      description:
        "app.api.agent.chat.folders.get.errors.forbidden.description",
    },
    not_found: {
      title: "app.api.agent.chat.folders.get.errors.notFound.title",
      description: "app.api.agent.chat.folders.get.errors.notFound.description",
    },
    server_error: {
      title: "app.api.agent.chat.folders.get.errors.server.title",
      description: "app.api.agent.chat.folders.get.errors.server.description",
    },
    unknown_error: {
      title: "app.api.agent.chat.folders.get.errors.unknown.title",
      description: "app.api.agent.chat.folders.get.errors.unknown.description",
    },
    unsaved_changes: {
      title: "app.api.agent.chat.folders.get.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.folders.get.errors.unsavedChanges.description",
    },
    conflict: {
      title: "app.api.agent.chat.folders.get.errors.conflict.title",
      description: "app.api.agent.chat.folders.get.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.agent.chat.folders.get.success.title",
    description: "app.api.agent.chat.folders.get.success.description",
  },
  examples: {
    urlPathParams: {
      default: {
        threadId: "123e4567-e89b-12d3-a456-426614174000",
        filename: "document.pdf",
      },
    },
  },
});

const definitions = { GET };

export default definitions;
