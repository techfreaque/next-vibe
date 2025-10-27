/**
 * Chat Folders API Definition
 * Defines endpoints for listing and creating folders
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { DEFAULT_FOLDER_IDS } from "../config";

/**
 * Get Folders List Endpoint (GET)
 * Retrieves all folders for the current user in hierarchical structure
 *
 * Note: PUBLIC role is allowed for anonymous users to access incognito folders
 * The repository layer filters results based on authentication status
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "agent", "chat", "folders"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.v1.core.agent.chat.folders.get.title" as const,
  description: "app.api.v1.core.agent.chat.folders.get.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.folders" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.chat.folders.get.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.get.container.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { request: "data", response: true },
    {
      // === REQUEST FILTERS ===
      rootFolderId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.agent.chat.folders.get.rootFolderId.label" as const,
          description:
            "app.api.v1.core.agent.chat.folders.get.rootFolderId.description" as const,
          layout: { columns: 12 },
          options: [
            {
              value: DEFAULT_FOLDER_IDS.PRIVATE,
              label:
                "app.api.v1.core.agent.chat.config.folders.private" as const,
            },
            {
              value: DEFAULT_FOLDER_IDS.SHARED,
              label:
                "app.api.v1.core.agent.chat.config.folders.shared" as const,
            },
            {
              value: DEFAULT_FOLDER_IDS.PUBLIC,
              label:
                "app.api.v1.core.agent.chat.config.folders.public" as const,
            },
            {
              value: DEFAULT_FOLDER_IDS.INCOGNITO,
              label:
                "app.api.v1.core.agent.chat.config.folders.incognito" as const,
            },
          ],
        },
        z.enum([
          DEFAULT_FOLDER_IDS.PRIVATE,
          DEFAULT_FOLDER_IDS.SHARED,
          DEFAULT_FOLDER_IDS.PUBLIC,
          DEFAULT_FOLDER_IDS.INCOGNITO,
        ]),
      ),

      // === RESPONSE ===
      folders: responseArrayField(
        {
          type: WidgetType.DATA_CARDS,
          layout: "list",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.agent.chat.folders.get.response.folders.folder.title" as const,
            layout: { type: LayoutType.GRID, columns: 2 },
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.folders.get.response.folders.folder.id.content" as const,
              },
              z.uuid(),
            ),
            userId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.folders.get.response.folders.folder.userId.content" as const,
              },
              z.uuid(),
            ),
            rootFolderId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.folders.get.response.folders.folder.rootFolderId.content" as const,
              },
              z.enum([
                DEFAULT_FOLDER_IDS.PRIVATE,
                DEFAULT_FOLDER_IDS.SHARED,
                DEFAULT_FOLDER_IDS.PUBLIC,
                DEFAULT_FOLDER_IDS.INCOGNITO,
              ]),
            ),
            name: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.folders.get.response.folders.folder.name.content" as const,
              },
              z.string(),
            ),
            icon: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.folders.get.response.folders.folder.icon.content" as const,
              },
              z.string().nullable(),
            ),
            color: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.folders.get.response.folders.folder.color.content" as const,
              },
              z.string().nullable(),
            ),
            parentId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.folders.get.response.folders.folder.parentId.content" as const,
              },
              z.uuid().nullable(),
            ),
            expanded: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.folders.get.response.folders.folder.expanded.content" as const,
              },
              z.boolean(),
            ),
            sortOrder: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.folders.get.response.folders.folder.sortOrder.content" as const,
              },
              z.number(),
            ),
            metadata: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.folders.get.response.folders.folder.metadata.content" as const,
              },
              z.record(z.string(), z.any()),
            ),
            createdAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.folders.get.response.folders.folder.createdAt.content" as const,
              },
              z.date(),
            ),
            updatedAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.folders.get.response.folders.folder.updatedAt.content" as const,
              },
              z.date(),
            ),
          },
        ),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.agent.chat.folders.get.errors.validation.title",
      description:
        "app.api.v1.core.agent.chat.folders.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.agent.chat.folders.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.folders.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.agent.chat.folders.get.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.folders.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.agent.chat.folders.get.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.folders.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.agent.chat.folders.get.errors.server.title",
      description:
        "app.api.v1.core.agent.chat.folders.get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.agent.chat.folders.get.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.folders.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.agent.chat.folders.get.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.folders.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.folders.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.folders.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.agent.chat.folders.get.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.folders.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.chat.folders.get.success.title",
    description: "app.api.v1.core.agent.chat.folders.get.success.description",
  },

  examples: {
    requests: {
      default: {
        rootFolderId: DEFAULT_FOLDER_IDS.PRIVATE,
      },
    },
    responses: {
      default: {
        folders: [],
      },
    },
  },
});

/**
 * Create Folder Endpoint (POST)
 * Creates a new folder
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "agent", "chat", "folders"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.v1.core.agent.chat.folders.post.title" as const,
  description: "app.api.v1.core.agent.chat.folders.post.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.folders" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.chat.folders.post.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.post.container.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { request: "data", response: true },
    {
      // === REQUEST ===
      folder: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.agent.chat.folders.post.sections.folder.title" as const,
          description:
            "app.api.v1.core.agent.chat.folders.post.sections.folder.description" as const,
          layout: { type: LayoutType.STACKED },
        },
        { request: "data" },
        {
          rootFolderId: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label:
                "app.api.v1.core.agent.chat.folders.post.sections.folder.rootFolderId.label" as const,
              description:
                "app.api.v1.core.agent.chat.folders.post.sections.folder.rootFolderId.description" as const,
              layout: { columns: 12 },
              validation: { required: true },
              options: [
                {
                  value: DEFAULT_FOLDER_IDS.PRIVATE,
                  label:
                    "app.api.v1.core.agent.chat.config.folders.private" as const,
                },
                {
                  value: DEFAULT_FOLDER_IDS.SHARED,
                  label:
                    "app.api.v1.core.agent.chat.config.folders.shared" as const,
                },
                {
                  value: DEFAULT_FOLDER_IDS.PUBLIC,
                  label:
                    "app.api.v1.core.agent.chat.config.folders.public" as const,
                },
                {
                  value: DEFAULT_FOLDER_IDS.INCOGNITO,
                  label:
                    "app.api.v1.core.agent.chat.config.folders.incognito" as const,
                },
              ],
            },
            z.enum([
              DEFAULT_FOLDER_IDS.PRIVATE,
              DEFAULT_FOLDER_IDS.SHARED,
              DEFAULT_FOLDER_IDS.PUBLIC,
              DEFAULT_FOLDER_IDS.INCOGNITO,
            ]),
          ),
          name: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.agent.chat.folders.post.sections.folder.name.label" as const,
              description:
                "app.api.v1.core.agent.chat.folders.post.sections.folder.name.description" as const,
              layout: { columns: 12 },
              validation: { required: true },
            },
            z.string().min(1).max(255),
          ),
          icon: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.agent.chat.folders.post.sections.folder.icon.label" as const,
              description:
                "app.api.v1.core.agent.chat.folders.post.sections.folder.icon.description" as const,
              layout: { columns: 6 },
              validation: { required: false },
            },
            z.string().optional(),
          ),
          color: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.agent.chat.folders.post.sections.folder.color.label" as const,
              description:
                "app.api.v1.core.agent.chat.folders.post.sections.folder.color.description" as const,
              layout: { columns: 6 },
              validation: { required: false },
            },
            z.string().optional(),
          ),
          parentId: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.UUID,
              label:
                "app.api.v1.core.agent.chat.folders.post.sections.folder.parentId.label" as const,
              description:
                "app.api.v1.core.agent.chat.folders.post.sections.folder.parentId.description" as const,
              layout: { columns: 12 },
              validation: { required: false },
            },
            z.uuid().optional(),
          ),
        },
      ),

      // === RESPONSE ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.agent.chat.folders.post.response.title" as const,
          description:
            "app.api.v1.core.agent.chat.folders.post.response.description" as const,
          layout: { type: LayoutType.STACKED },
        },
        { response: true },
        {
          folder: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.agent.chat.folders.post.response.folder.title" as const,
              layout: { type: LayoutType.GRID, columns: 2 },
            },
            { response: true },
            {
              id: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.folders.post.response.folder.id.content" as const,
                },
                z.uuid(),
              ),
              userId: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.folders.post.response.folder.userId.content" as const,
                },
                z.uuid(),
              ),
              rootFolderId: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.folders.post.response.folder.rootFolderId.content" as const,
                },
                z.enum([
                  DEFAULT_FOLDER_IDS.PRIVATE,
                  DEFAULT_FOLDER_IDS.SHARED,
                  DEFAULT_FOLDER_IDS.PUBLIC,
                  DEFAULT_FOLDER_IDS.INCOGNITO,
                ]),
              ),
              name: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.folders.post.response.folder.name.content" as const,
                },
                z.string(),
              ),
              icon: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.folders.post.response.folder.icon.content" as const,
                },
                z.string().nullable(),
              ),
              color: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.folders.post.response.folder.color.content" as const,
                },
                z.string().nullable(),
              ),
              parentId: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.folders.post.response.folder.parentId.content" as const,
                },
                z.uuid().nullable(),
              ),
              expanded: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.folders.post.response.folder.expanded.content" as const,
                },
                z.boolean(),
              ),
              sortOrder: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.folders.post.response.folder.sortOrder.content" as const,
                },
                z.number(),
              ),
              metadata: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.folders.post.response.folder.metadata.content" as const,
                },
                z.record(z.string(), z.any()),
              ),
              createdAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.folders.post.response.folder.createdAt.content" as const,
                },
                z.date(),
              ),
              updatedAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.folders.post.response.folder.updatedAt.content" as const,
                },
                z.date(),
              ),
            },
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.agent.chat.folders.post.errors.validation.title",
      description:
        "app.api.v1.core.agent.chat.folders.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.folders.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.folders.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.agent.chat.folders.post.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.folders.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.agent.chat.folders.post.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.folders.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.agent.chat.folders.post.errors.server.title",
      description:
        "app.api.v1.core.agent.chat.folders.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.agent.chat.folders.post.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.folders.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.agent.chat.folders.post.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.folders.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.folders.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.folders.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.agent.chat.folders.post.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.folders.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.chat.folders.post.success.title",
    description: "app.api.v1.core.agent.chat.folders.post.success.description",
  },

  examples: {
    requests: {
      default: {
        folder: {
          rootFolderId: DEFAULT_FOLDER_IDS.PRIVATE,
          name: "Work",
          icon: "folder",
          color: "#3b82f6",
        },
      },
    },
    responses: {
      default: {
        response: {
          folder: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            userId: "123e4567-e89b-12d3-a456-426614174001",
            rootFolderId: DEFAULT_FOLDER_IDS.PRIVATE,
            name: "Work",
            icon: "folder",
            color: "#3b82f6",
            parentId: null,
            expanded: true,
            sortOrder: 0,
            metadata: {},
            createdAt: new Date("2024-01-01T00:00:00Z"),
            updatedAt: new Date("2024-01-01T00:00:00Z"),
          },
        },
      },
    },
  },
});

// Extract types
export type FolderListRequestInput = typeof GET.types.RequestInput;
export type FolderListRequestOutput = typeof GET.types.RequestOutput;
export type FolderListResponseInput = typeof GET.types.ResponseInput;
export type FolderListResponseOutput = typeof GET.types.ResponseOutput;

export type FolderCreateRequestInput = typeof POST.types.RequestInput;
export type FolderCreateRequestOutput = typeof POST.types.RequestOutput;
export type FolderCreateResponseInput = typeof POST.types.ResponseInput;
export type FolderCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { GET, POST };
export { GET, POST };
export default definitions;
