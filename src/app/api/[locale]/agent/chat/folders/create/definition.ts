/**
 * Create Folder API Definition
 * Defines endpoint for creating a new folder
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayOptionalField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import {
  UserPermissionRoleOptions,
  UserRole,
  UserRoleDB,
} from "@/app/api/[locale]/user/user-roles/enum";

import { dateSchema, iconSchema } from "../../../../shared/types/common.schema";
import { DefaultFolderId } from "../../config";
import { FolderCreateContainer } from "./widget";

/**
 * Create Folder Endpoint (POST)
 * Creates a new folder
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["agent", "chat", "folders", "create"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.folders.post.title" as const,
  description: "app.api.agent.chat.folders.post.description" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.folders" as const],
  icon: "folder-plus" as const,

  fields: customWidgetObject({
    render: FolderCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST ===
      folder: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.folders.post.sections.folder.title" as const,
          description:
            "app.api.agent.chat.folders.post.sections.folder.description" as const,
          layoutType: LayoutType.STACKED,
        },
        { request: "data" },
        {
          rootFolderId: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label:
              "app.api.agent.chat.folders.post.sections.folder.rootFolderId.label" as const,
            description:
              "app.api.agent.chat.folders.post.sections.folder.rootFolderId.description" as const,
            columns: 12,
            options: [
              {
                value: DefaultFolderId.PRIVATE,
                label: "app.api.agent.chat.config.folders.private" as const,
              },
              {
                value: DefaultFolderId.SHARED,
                label: "app.api.agent.chat.config.folders.shared" as const,
              },
              {
                value: DefaultFolderId.PUBLIC,
                label: "app.api.agent.chat.config.folders.public" as const,
              },
              {
                value: DefaultFolderId.INCOGNITO,
                label: "app.api.agent.chat.config.folders.incognito" as const,
              },
            ],
            schema: z.enum(DefaultFolderId),
          }),
          name: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label:
              "app.api.agent.chat.folders.post.sections.folder.name.label" as const,
            description:
              "app.api.agent.chat.folders.post.sections.folder.name.description" as const,
            columns: 12,
            schema: z.string().min(1).max(255),
          }),
          icon: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label:
              "app.api.agent.chat.folders.post.sections.folder.icon.label" as const,
            description:
              "app.api.agent.chat.folders.post.sections.folder.icon.description" as const,
            columns: 6,
            // Runtime: accepts any string (emoji, IconKey), Type: IconKey | undefined
            schema: iconSchema.optional(),
          }),
          color: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label:
              "app.api.agent.chat.folders.post.sections.folder.color.label" as const,
            description:
              "app.api.agent.chat.folders.post.sections.folder.color.description" as const,
            columns: 6,
            schema: z.string().optional(),
          }),
          parentId: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.UUID,
            label:
              "app.api.agent.chat.folders.post.sections.folder.parentId.label" as const,
            description:
              "app.api.agent.chat.folders.post.sections.folder.parentId.description" as const,
            columns: 12,
            schema: z.uuid().optional(),
          }),
        },
      ),

      // === RESPONSE ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.chat.folders.post.response.title" as const,
          description:
            "app.api.agent.chat.folders.post.response.description" as const,
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          folder: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.agent.chat.folders.post.response.folder.title" as const,
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              id: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.id.content" as const,
                schema: z.uuid(),
              }),
              userId: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.userId.content" as const,
                schema: z.uuid(),
              }),
              rootFolderId: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.rootFolderId.content" as const,
                schema: z.enum(DefaultFolderId),
              }),
              name: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.name.content" as const,
                schema: z.string(),
              }),
              icon: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.icon.content" as const,
                // Runtime: accepts any string (emoji, IconKey), Type: IconKey | null
                schema: z.string().nullable() as z.ZodType<IconKey | null>,
              }),
              color: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.color.content" as const,
                schema: z.string().nullable(),
              }),
              parentId: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.parentId.content" as const,
                schema: z.uuid().nullable(),
              }),
              expanded: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.expanded.content" as const,
                schema: z.boolean(),
              }),
              sortOrder: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.sortOrder.content" as const,
                schema: z.coerce.number(),
              }),
              rolesView: responseArrayOptionalField(
                { type: WidgetType.CONTAINER },
                responseField({
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesManage: responseArrayOptionalField(
                { type: WidgetType.CONTAINER },
                responseField({
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesCreateThread: responseArrayOptionalField(
                { type: WidgetType.CONTAINER },
                responseField({
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesPost: responseArrayOptionalField(
                { type: WidgetType.CONTAINER },
                responseField({
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesModerate: responseArrayOptionalField(
                { type: WidgetType.CONTAINER },
                responseField({
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesAdmin: responseArrayOptionalField(
                { type: WidgetType.CONTAINER },
                responseField({
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              createdAt: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.createdAt.content" as const,
                schema: dateSchema,
              }),
              updatedAt: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.updatedAt.content" as const,
                schema: dateSchema,
              }),
            },
          ),
        },
      ),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.folders.post.errors.validation.title",
      description:
        "app.api.agent.chat.folders.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.folders.post.errors.unauthorized.title",
      description:
        "app.api.agent.chat.folders.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.folders.post.errors.forbidden.title",
      description:
        "app.api.agent.chat.folders.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.folders.post.errors.notFound.title",
      description:
        "app.api.agent.chat.folders.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.folders.post.errors.server.title",
      description: "app.api.agent.chat.folders.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.folders.post.errors.network.title",
      description: "app.api.agent.chat.folders.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.folders.post.errors.unknown.title",
      description: "app.api.agent.chat.folders.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.folders.post.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.folders.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.folders.post.errors.conflict.title",
      description:
        "app.api.agent.chat.folders.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.agent.chat.folders.post.success.title",
    description: "app.api.agent.chat.folders.post.success.description",
  },

  examples: {
    requests: {
      default: {
        folder: {
          rootFolderId: DefaultFolderId.PRIVATE,
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
            rootFolderId: DefaultFolderId.PRIVATE,
            name: "Work",
            icon: "folder",
            color: "#3b82f6",
            parentId: null,
            expanded: true,
            sortOrder: 0,
            rolesView: [],
            rolesManage: [],
            rolesCreateThread: [],
            rolesPost: [],
            rolesModerate: [],
            rolesAdmin: [],
            createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
            updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
          },
        },
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
