/**
 * Chat File Serving Endpoint Definition
 * Serves uploaded files from filesystem storage
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestUrlPathParamsField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { THREAD_FILES_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

/**
 * Endpoint definition
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "threads", "files", "[threadId]", "[filename]"],
  aliases: [THREAD_FILES_ALIAS] as const,
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  category: "ai",
  subCategory: "messagesFiles",
  icon: "download" as const,
  tags: ["tags.files" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
  ] as const,
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "urlPathParams" },
    children: {
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/agent/chat/threads/definition"))
            .default.GET,
        labelField: "title",
        schema: z.uuid(),
      }),
      filename: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        schema: z.string().min(1),
      }),
    },
  }),
  errorTypes: {
    validation_failed: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    network_error: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    unauthorized: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    forbidden: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    not_found: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    server_error: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    unknown_error: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    unsaved_changes: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    conflict: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
  },
  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
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
export type ChatFileUrlVariablesOutput = typeof GET.types.UrlVariablesOutput;

const definitions = { GET };

export default definitions;
