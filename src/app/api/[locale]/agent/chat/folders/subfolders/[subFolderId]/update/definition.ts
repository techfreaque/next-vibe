import { z } from "zod";

import {
  dateSchema,
  iconSchema,
} from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedRequestUrlPathParamsField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  UserPermissionRoleOptions,
  UserRoleDB,
} from "@/app/api/[locale]/user/user-roles/enum";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

/**
 * Update Folder Endpoint (PATCH)
 * Updates an existing folder — all fields
 */
const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["agent", "chat", "folders", "subfolders", "[subFolderId]", "update"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "patch.title" as const,
  description: "patch.description" as const,
  category: "app.endpointCategories.chat",
  tags: ["tags.folders" as const],
  icon: "folder-pen" as const,

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "patch.container.title" as const,
    description: "patch.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === REQUEST URL PARAMS ===
      subFolderId: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "patch.id.label" as const,
        description: "patch.id.description" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      name: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.name.label" as const,
        description: "patch.name.description" as const,
        columns: 12,
        schema: z.string().min(1).max(255).optional(),
      }),
      icon: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.icon.label" as const,
        description: "patch.icon.description" as const,
        columns: 6,
        schema: iconSchema.nullish(),
      }),
      color: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.color.label" as const,
        description: "patch.color.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      parentId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "patch.parentId.label" as const,
        description: "patch.parentId.description" as const,
        columns: 6,
        schema: z.uuid().nullable().optional(),
      }),
      expanded: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.expanded.label" as const,
        description: "patch.expanded.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      sortOrder: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "patch.sortOrder.label" as const,
        description: "patch.sortOrder.description" as const,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),
      pinned: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.pinned.label" as const,
        description: "patch.pinned.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      rolesView: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.rolesView.label" as const,
        description: "patch.rolesView.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)).nullable().optional(),
      }),
      rolesManage: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.rolesManage.label" as const,
        description: "patch.rolesManage.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)).nullable().optional(),
      }),
      rolesCreateThread: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.rolesCreateThread.label" as const,
        description: "patch.rolesCreateThread.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)).nullable().optional(),
      }),
      rolesPost: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.rolesPost.label" as const,
        description: "patch.rolesPost.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)).nullable().optional(),
      }),
      rolesModerate: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.rolesModerate.label" as const,
        description: "patch.rolesModerate.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)).nullable().optional(),
      }),
      rolesAdmin: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.rolesAdmin.label" as const,
        description: "patch.rolesAdmin.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)).nullable().optional(),
      }),

      // === RESPONSE ===
      folderId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.folder.id.content" as const,
        schema: z.uuid(),
      }),
      updatedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.folder.updatedAt.content" as const,
        schema: dateSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title",
      description: "patch.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title",
      description: "patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title",
      description: "patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title",
      description: "patch.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title",
      description: "patch.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title",
      description: "patch.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title",
      description: "patch.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title",
      description: "patch.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title",
      description: "patch.errors.conflict.description",
    },
  },

  successTypes: {
    title: "patch.success.title",
    description: "patch.success.description",
  },

  examples: {
    urlPathParams: {
      default: { subFolderId: "123e4567-e89b-12d3-a456-426614174000" },
    },
    requests: {
      default: {
        name: "Personal",
        color: "#10b981",
        icon: "folder-heart",
      },
    },
    responses: {
      default: {
        folderId: "123e4567-e89b-12d3-a456-426614174000",
        updatedAt: new Date().toISOString(),
      },
    },
  },
});

export type FolderUpdateRequestInput = typeof PATCH.types.RequestInput;
export type FolderUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type FolderUpdateResponseInput = typeof PATCH.types.ResponseInput;
export type FolderUpdateResponseOutput = typeof PATCH.types.ResponseOutput;
export type FolderUpdateUrlParamsTypeOutput =
  typeof PATCH.types.UrlVariablesOutput;

const definitions = { PATCH } as const;
export default definitions;
