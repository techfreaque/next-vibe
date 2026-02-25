/**
 * Chat File Serving Endpoint Definition
 * Serves uploaded files from filesystem storage
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestUrlPathParamsField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

/**
 * Endpoint definition
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "files", "[threadId]", "[filename]"],
  title: "get.title" as const,
  description: "get.description" as const,
  category: "app.endpointCategories.chat",
  icon: "download" as const,
  tags: ["tags.files" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
  ] as const,
  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "urlPathParams" },
    children: {
      threadId: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        schema: z.uuid(),
      }),
      filename: scopedRequestUrlPathParamsField(scopedTranslation, {
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

const definitions = { GET };

export default definitions;
