/**
 * Create Folder API Definition
 * Defines endpoint for creating a new folder
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseArrayOptionalField,
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
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import {
  UserPermissionRoleOptions,
  UserRole,
  UserRoleDB,
} from "@/app/api/[locale]/user/user-roles/enum";

import { dateSchema, iconSchema } from "../../../../shared/types/common.schema";
import { DefaultFolderId } from "../../config";
import { scopedTranslation } from "./i18n";
import { FolderCreateContainer } from "./widget";

/**
 * Create Folder Endpoint (POST)
 * Creates a new folder
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "chat", "folders", "create"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.REMOTE_SKILL,
  ] as const,

  title: "title" as const,
  description: "description" as const,
  category: "category" as const,
  tags: ["tags.folders" as const],
  icon: "folder-plus" as const,

  fields: customWidgetObject({
    render: FolderCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST ===
      folder: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "sections.folder.title" as const,
        description: "sections.folder.description" as const,
        layoutType: LayoutType.STACKED,
        usage: { request: "data" },
        children: {
          rootFolderId: scopedRequestField(scopedTranslation, {
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
        },
      }),

      // === RESPONSE ===
      response: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.title" as const,
        description: "response.description" as const,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          folder: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "response.folder.title" as const,
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              id: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.folder.id.content" as const,
                schema: z.uuid(),
              }),
              userId: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.folder.userId.content" as const,
                schema: z.uuid(),
              }),
              rootFolderId: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.folder.rootFolderId.content" as const,
                schema: z.enum(DefaultFolderId),
              }),
              name: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.folder.name.content" as const,
                schema: z.string(),
              }),
              icon: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.folder.icon.content" as const,
                // Runtime: accepts any string (emoji, IconKey), Type: IconKey | null
                schema: z.string().nullable() as z.ZodType<IconKey | null>,
              }),
              color: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.folder.color.content" as const,
                schema: z.string().nullable(),
              }),
              parentId: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.folder.parentId.content" as const,
                schema: z.uuid().nullable(),
              }),
              expanded: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.folder.expanded.content" as const,
                schema: z.boolean(),
              }),
              sortOrder: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.folder.sortOrder.content" as const,
                schema: z.coerce.number(),
              }),
              rolesView: responseArrayOptionalField(
                { type: WidgetType.CONTAINER },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesManage: responseArrayOptionalField(
                { type: WidgetType.CONTAINER },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesCreateThread: responseArrayOptionalField(
                { type: WidgetType.CONTAINER },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesPost: responseArrayOptionalField(
                { type: WidgetType.CONTAINER },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesModerate: responseArrayOptionalField(
                { type: WidgetType.CONTAINER },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesAdmin: responseArrayOptionalField(
                { type: WidgetType.CONTAINER },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
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
        },
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
