/**
 * Create Folder API Definition
 * Defines endpoint for creating a new folder
 */

import { z } from "zod";

import {
  dateSchema,
  iconSchema,
} from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedRequestField,
  scopedRequestUrlPathParamsField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { DefaultFolderId, isDefaultFolderId } from "../../../config";
import { scopedTranslation } from "./i18n";
import { FolderCreateContainer } from "./widget";

/**
 * Create Folder Endpoint (POST)
 * Creates a new folder
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "chat", "folders", "[rootFolderId]", "create"],
  aliases: ["folder-create"] as const,
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.REMOTE_SKILL,
  ] as const,

  title: "title" as const,
  description: "description" as const,
  category: "app.endpointCategories.chat",
  tags: ["tags.folders" as const],
  icon: "folder-plus" as const,

  fields: customWidgetObject({
    render: FolderCreateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      // === REQUEST URL PATH PARAMS ===
      rootFolderId: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "sections.folder.rootFolderId.label" as const,
        description: "sections.folder.rootFolderId.description" as const,
        columns: 12,
        options: [
          {
            value: DefaultFolderId.PRIVATE,
            label: "config.folders.private" as const,
          },
          {
            value: DefaultFolderId.SHARED,
            label: "config.folders.shared" as const,
          },
          {
            value: DefaultFolderId.PUBLIC,
            label: "config.folders.public" as const,
          },
          {
            value: DefaultFolderId.INCOGNITO,
            label: "config.folders.incognito" as const,
          },
        ],
        schema: z.enum(DefaultFolderId),
      }),
      name: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "sections.folder.name.label" as const,
        description: "sections.folder.name.description" as const,
        columns: 12,
        schema: z.string().min(1).max(255),
      }),
      icon: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "sections.folder.icon.label" as const,
        description: "sections.folder.icon.description" as const,
        columns: 6,
        // Runtime: accepts any string (emoji, IconKey), Type: IconKey | undefined
        schema: iconSchema.optional(),
      }),
      color: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "sections.folder.color.label" as const,
        description: "sections.folder.color.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      parentId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "sections.folder.parentId.label" as const,
        description: "sections.folder.parentId.description" as const,
        columns: 12,
        schema: z.uuid().optional(),
      }),

      // === RESPONSE ===
      folderId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.folder.id.content" as const,
        schema: z.uuid(),
      }),
      createdAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.folder.createdAt.content" as const,
        schema: dateSchema,
      }),
      updatedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.folder.updatedAt.content" as const,
        schema: dateSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
  },

  successTypes: {
    title: "success.title",
    description: "success.description",
  },

  options: {
    mutationOptions: {
      onSuccess: async ({
        requestData,
        responseData,
        pathParams,
        logger,
        user,
      }) => {
        const { ChatFoldersRepositoryClient } =
          await import("../repository-client");
        const rootFolderId = pathParams.rootFolderId;
        if (!isDefaultFolderId(rootFolderId)) {
          return;
        }
        ChatFoldersRepositoryClient.insertFolderIntoCache(
          {
            type: "folder",
            id: responseData.folderId,
            name: requestData.name,
            icon: requestData.icon ?? null,
            color: requestData.color ?? null,
            rootFolderId,
            parentId: requestData.parentId ?? null,
            userId: user && !user.isPublic ? user.id : null,
            createdAt: responseData.createdAt,
            updatedAt: responseData.updatedAt,
            sortOrder: 0,
            pinned: null,
            expanded: null,
            canManage: true,
            canCreateThread: true,
            canModerate: null,
            canDelete: true,
            canManagePermissions: null,
            rolesView: null,
            rolesManage: null,
            rolesCreateThread: null,
            rolesPost: null,
            rolesModerate: null,
            rolesAdmin: null,
            title: null,
            folderId: null,
            status: null,
            preview: null,
            archived: null,
            canEdit: null,
            canPost: null,
            isStreaming: null,
            rolesEdit: null,
          },
          logger,
        );
      },
    },
  },

  examples: {
    urlPathParams: {
      default: {
        rootFolderId: DefaultFolderId.PRIVATE,
      },
    },
    requests: {
      default: {
        name: "Work",
        icon: "folder",
        color: "#3b82f6",
      },
    },
    responses: {
      default: {
        folderId: "123e4567-e89b-12d3-a456-426614174000",
        createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
        updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
      },
    },
  },
});

// Extract types
export type FolderCreateRequestInput = typeof POST.types.RequestInput;
export type FolderCreateRequestOutput = typeof POST.types.RequestOutput;
export type FolderCreateResponseInput = typeof POST.types.ResponseInput;
export type FolderCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
