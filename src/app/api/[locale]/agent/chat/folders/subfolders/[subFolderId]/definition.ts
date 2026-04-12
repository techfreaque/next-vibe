/**
 * Chat Subfolder by ID API Definition
 * Defines endpoints for getting and deleting individual subfolders
 */

import { z } from "zod";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import {
  dateSchema,
  iconSchema,
} from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  objectField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";
import { DeleteFolderContainer } from "./widget";

/**
 * Get Subfolder by ID Endpoint (GET)
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "folders", "subfolders", "[subFolderId]"],
  aliases: ["folder-get"] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "folder",
  category: "endpointCategories.chat",
  subCategory: "endpointCategories.chatOrganization",

  tags: ["tags.folders" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.container.title" as const,
    description: "get.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "urlPathParams", response: true },
    children: {
      subFolderId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.id.label" as const,
        description: "get.id.description" as const,
        schema: z.uuid(),
      }),

      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.folder.name.content" as const,
        schema: z.string(),
      }),
      icon: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.folder.icon.content" as const,
        schema: iconSchema.nullable(),
      }),
      color: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.folder.color.content" as const,
        schema: z.string().nullable(),
      }),
      parentId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.folder.parentId.content" as const,
        schema: z.uuid().nullable(),
      }),
      rootFolderId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.folder.rootFolderId.content" as const,
        schema: z.enum(DefaultFolderId),
      }),
      expanded: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.folder.expanded.content" as const,
        schema: z.boolean(),
      }),
      sortOrder: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.folder.sortOrder.content" as const,
        schema: z.coerce.number(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.folder.createdAt.content" as const,
        schema: dateSchema,
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.folder.updatedAt.content" as const,
        schema: dateSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
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
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
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

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    urlPathParams: {
      default: { subFolderId: "123e4567-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        name: "My Folder",
        icon: null,
        color: null,
        parentId: null,
        rootFolderId: DefaultFolderId.PRIVATE,
        expanded: false,
        sortOrder: 0,
        createdAt: "2024-01-15T10:00:00.000Z",
        updatedAt: "2024-01-15T10:00:00.000Z",
      },
    },
  },
});

/**
 * Delete Subfolder Endpoint (DELETE)
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["agent", "chat", "folders", "subfolders", "[subFolderId]"],
  aliases: ["folder-delete"] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "folder-x",
  category: "endpointCategories.chat",
  subCategory: "endpointCategories.chatOrganization",

  tags: ["tags.folders" as const],

  fields: customWidgetObject({
    render: DeleteFolderContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      subFolderId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "delete.id.label" as const,
        description: "delete.id.description" as const,
        schema: z.uuid(),
      }),

      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.name.content" as const,
        schema: z.string(),
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.updatedAt.content" as const,
        schema: dateSchema,
      }),

      // === BUTTONS ===
      backButton: backButton(scopedTranslation, {
        label: "delete.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "urlPathParams" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "delete.submitButton.label" as const,
        loadingText: "delete.submitButton.loadingText" as const,
        icon: "folder-x",
        variant: "destructive",
        className: "w-full",
        usage: { request: "urlPathParams" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title",
      description: "delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title",
      description: "delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title",
      description: "delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title",
      description: "delete.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title",
      description: "delete.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title",
      description: "delete.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title",
      description: "delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title",
      description: "delete.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title",
      description: "delete.errors.conflict.description",
    },
  },

  successTypes: {
    title: "delete.success.title",
    description: "delete.success.description",
  },

  examples: {
    urlPathParams: {
      default: { subFolderId: "123e4567-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        name: "My Folder",
        updatedAt: "2024-01-15T10:00:00.000Z",
      },
    },
  },
});

// Extract types
export type FolderGetRequestInput = typeof GET.types.RequestInput;
export type FolderGetRequestOutput = typeof GET.types.RequestOutput;
export type FolderGetResponseInput = typeof GET.types.ResponseInput;
export type FolderGetResponseOutput = typeof GET.types.ResponseOutput;

export type FolderDeleteRequestInput = typeof DELETE.types.RequestInput;
export type FolderDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type FolderDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type FolderDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

const definitions = { GET, DELETE } as const;
export default definitions;
