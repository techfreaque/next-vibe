/**
 * Root Folder Permissions API Definition
 * Defines endpoint for computing root folder permissions
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

/**
 * Get Root Folder Permissions Endpoint (GET)
 * Computes permissions for a root folder
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: [
    "vibe",
    "agent",
    "chat",
    "folders",
    "[rootFolderId]",
    "root-permissions",
  ],
  aliases: ["folder-permissions"] as const,
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "shield",
  category: "ai",
  subCategory: "chatOrganization",

  tags: ["tags.folders" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.container.title" as const,
    description: "get.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "urlPathParams", response: true },
    children: {
      // === REQUEST URL PATH PARAMS ===
      rootFolderId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.rootFolderId.label" as const,
        description: "get.rootFolderId.description" as const,
        columns: 12,
        options: [
          {
            value: DefaultFolderId.PRIVATE,
            label: "get.rootFolderId.options.private" as const,
          },
          {
            value: DefaultFolderId.SHARED,
            label: "get.rootFolderId.options.shared" as const,
          },
          {
            value: DefaultFolderId.PUBLIC,
            label: "get.rootFolderId.options.public" as const,
          },
          {
            value: DefaultFolderId.BACKGROUND,
            label: "get.rootFolderId.options.background" as const,
          },
          {
            value: DefaultFolderId.INCOGNITO,
            label: "get.rootFolderId.options.incognito" as const,
          },
          {
            value: DefaultFolderId.REMOTE,
            label: "get.rootFolderId.options.remote" as const,
          },
        ],
        schema: z.enum(DefaultFolderId),
      }),

      // === RESPONSE ===
      canCreateThread: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.canCreateThread.content" as const,
        schema: z.boolean(),
      }),
      canCreateFolder: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.canCreateFolder.content" as const,
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
    urlPathParams: {
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

export type RootPermissionsGetUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
export type RootPermissionsGetResponseOutput = typeof GET.types.ResponseOutput;
