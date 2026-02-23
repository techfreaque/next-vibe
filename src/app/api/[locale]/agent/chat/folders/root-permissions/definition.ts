/**
 * Root Folder Permissions API Definition
 * Defines endpoint for computing root folder permissions
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { DefaultFolderId } from "../../config";
import { scopedTranslation } from "./i18n";

/**
 * Get Root Folder Permissions Endpoint (GET)
 * Computes permissions for a root folder
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "folders", "root-permissions"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "shield",
  category: "category" as const,
  tags: ["tags.folders" as const],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.container.title" as const,
    description: "get.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST ===
      rootFolderId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.rootFolderId.label" as const,
        description: "get.rootFolderId.description" as const,
        columns: 12,
        schema: z.enum(DefaultFolderId),
      }),

      // === RESPONSE ===
      canCreateThread: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.canCreateThread.content" as const,
        schema: z.boolean(),
      }),
      canCreateFolder: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.canCreateFolder.content" as const,
        schema: z.boolean(),
      }),
    },
  }),

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
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

const definitions = { GET } as const;
export default definitions;

export type RootPermissionsGetRequestOutput = typeof GET.types.RequestOutput;
export type RootPermissionsGetResponseOutput = typeof GET.types.ResponseOutput;
