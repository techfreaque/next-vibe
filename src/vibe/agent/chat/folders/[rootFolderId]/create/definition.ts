/**
 * Create Folder API Definition
 * Defines endpoint for creating a new folder
 */

import {
  dateSchema,
  iconSchema,
} from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { DefaultFolderId, isDefaultFolderId } from "../../../config";
import { ThreadStreamingState } from "../../../enum";
import { scopedTranslation } from "./i18n";

const FolderCreateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.FolderCreateContainer })),
);

/**
 * Create Folder Endpoint (POST)
 * Creates a new folder
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "chat", "folders", "[rootFolderId]", "create"],
  aliases: ["folder-create"] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "title" as const,
  titleShort: "title" as const,
  description: "description" as const,

  tags: ["tags.folders" as const],
  icon: "folder-plus" as const,
  category: "ai",
  subCategory: "chatOrganization",

  fields: customWidgetObject({
    render: FolderCreateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      // === REQUEST URL PATH PARAMS ===
      rootFolderId: requestUrlPathParamsField(scopedTranslation, {
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
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "sections.folder.name.label" as const,
        description: "sections.folder.name.description" as const,
        columns: 12,
        schema: z.string().min(1).max(255),
      }),
      icon: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "sections.folder.icon.label" as const,
        description: "sections.folder.icon.description" as const,
        columns: 6,
        // Runtime: accepts any string (emoji, IconKey), Type: IconKey | undefined
        schema: iconSchema.optional(),
      }),
      color: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "sections.folder.color.label" as const,
        description: "sections.folder.color.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      parentId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "sections.folder.parentId.label" as const,
        description: "sections.folder.parentId.description" as const,
        columns: 12,
        schema: z.uuid().optional(),
      }),

      // === RESPONSE ===
      folderId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.folder.id.content" as const,
        schema: z.uuid(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.folder.createdAt.content" as const,
        schema: dateSchema,
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.folder.updatedAt.content" as const,
        schema: dateSchema,
      }),

      // === BUTTONS ===
      backButton: backButton(scopedTranslation, {
        label: "backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data&urlPathParams" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "submitButton.label" as const,
        loadingText: "submitButton.loadingText" as const,
        icon: "folder-plus",
        variant: "primary",
        className: "w-full",
        usage: { request: "data&urlPathParams" },
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
            description: null,
            archived: null,
            canEdit: null,
            canPost: null,
            streamingState: ThreadStreamingState.IDLE,
            rolesEdit: null,
            activeShareCount: null,
            lastSharedAt: null,
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
