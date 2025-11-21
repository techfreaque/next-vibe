/**
 * Root Folder Permissions API Definition
 * Defines endpoint for computing root folder permissions
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { DefaultFolderId } from "../../config";

/**
 * Get Root Folder Permissions Endpoint (GET)
 * Computes permissions for a root folder
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "agent", "chat", "folders", "root-permissions"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title:
    "app.api.v1.core.agent.chat.folders.rootPermissions.get.title" as const,
  description:
    "app.api.v1.core.agent.chat.folders.rootPermissions.get.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.folders" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data", response: true },
    {
      // === REQUEST ===
      rootFolderId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.agent.chat.folders.rootPermissions.get.rootFolderId.label" as const,
          description:
            "app.api.v1.core.agent.chat.folders.rootPermissions.get.rootFolderId.description" as const,
          columns: 12,
        },
        z.enum(DefaultFolderId),
      ),

      // === RESPONSE ===
      canCreateThread: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.folders.rootPermissions.get.response.canCreateThread.content" as const,
        },
        z.boolean(),
      ),
      canCreateFolder: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.folders.rootPermissions.get.response.canCreateFolder.content" as const,
        },
        z.boolean(),
      ),
    },
  ),

  // === SUCCESS HANDLING ===
  successTypes: {
    title:
      "app.api.v1.core.agent.chat.folders.rootPermissions.get.success.title",
    description:
      "app.api.v1.core.agent.chat.folders.rootPermissions.get.success.description",
  },

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.validation.title",
      description:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.server.title",
      description:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.folders.rootPermissions.get.errors.conflict.description",
    },
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        rootFolderId: DefaultFolderId.PRIVATE,
      },
    },
    responses: {
      default: {
        canCreateThread: true,
        canCreateFolder: true,
      },
    },
  },
});

export { GET };
const definitions = { GET } as const;
export default definitions;

export type RootPermissionsGetRequestOutput = typeof GET.types.RequestOutput;
export type RootPermissionsGetResponseOutput = typeof GET.types.ResponseOutput;
