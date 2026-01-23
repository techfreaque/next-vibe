/**
 * Chat File Serving Endpoint Definition
 * Serves uploaded files from filesystem storage
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestUrlPathParamsField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

/**
 * Endpoint definition
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "files", "[threadId]", "[filename]"],
  title: "app.api.agent.chat.files.get.title" as const,
  description: "app.api.agent.chat.files.get.description" as const,
  category: "app.api.agent.chat.category" as const,
  icon: "download" as const,
  tags: ["app.api.agent.chat.tags.files" as const],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams" },
    {
      threadId: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        schema: z.uuid(),
      }),
      filename: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        schema: z.string().min(1),
      }),
    },
  ),
  errorTypes: {
    validation_failed: {
      title: "app.api.agent.chat.files.get.errors.validation.title",
      description: "app.api.agent.chat.files.get.errors.validation.description",
    },
    network_error: {
      title: "app.api.agent.chat.files.get.errors.network.title",
      description: "app.api.agent.chat.files.get.errors.network.description",
    },
    unauthorized: {
      title: "app.api.agent.chat.files.get.errors.unauthorized.title",
      description:
        "app.api.agent.chat.files.get.errors.unauthorized.description",
    },
    forbidden: {
      title: "app.api.agent.chat.files.get.errors.forbidden.title",
      description: "app.api.agent.chat.files.get.errors.forbidden.description",
    },
    not_found: {
      title: "app.api.agent.chat.files.get.errors.notFound.title",
      description: "app.api.agent.chat.files.get.errors.notFound.description",
    },
    server_error: {
      title: "app.api.agent.chat.files.get.errors.server.title",
      description: "app.api.agent.chat.files.get.errors.server.description",
    },
    unknown_error: {
      title: "app.api.agent.chat.files.get.errors.unknown.title",
      description: "app.api.agent.chat.files.get.errors.unknown.description",
    },
    unsaved_changes: {
      title: "app.api.agent.chat.files.get.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.files.get.errors.unsavedChanges.description",
    },
    conflict: {
      title: "app.api.agent.chat.files.get.errors.conflict.title",
      description: "app.api.agent.chat.files.get.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.agent.chat.files.get.success.title",
    description: "app.api.agent.chat.files.get.success.description",
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

export type ChatFileRequestOutput = typeof GET.types.RequestOutput;
export type ChatFileResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET };

export default definitions;
