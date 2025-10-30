import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  requestUrlPathParamsField,
  responseArrayField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Get Folder Permissions Endpoint (GET)
 * Retrieves the list of moderator IDs for a folder
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "agent", "chat", "folders", "[id]", "permissions"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title:
    "app.api.v1.core.agent.chat.folders.id.permissions.get.title" as const,
  description:
    "app.api.v1.core.agent.chat.folders.id.permissions.get.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: [
    "app.api.v1.core.agent.chat.tags.folders" as const,
    "app.api.v1.core.agent.chat.tags.permissions" as const,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.container.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { request: "urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.agent.chat.folders.id.permissions.get.id.label" as const,
          description:
            "app.api.v1.core.agent.chat.folders.id.permissions.get.id.description" as const,
        },
        z.uuid(),
      ),

      // === RESPONSE ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.agent.chat.folders.id.permissions.get.response.title" as const,
          description:
            "app.api.v1.core.agent.chat.folders.id.permissions.get.response.description" as const,
          layout: { type: LayoutType.STACKED },
        },
        { response: true },
        {
          allowedRoles: responseArrayField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.folders.id.permissions.get.response.allowedRoles.content" as const,
            },
            z.string(),
          ),
          moderatorIds: responseArrayField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.folders.id.permissions.get.response.moderatorIds.content" as const,
            },
            z.string(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.validation.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.network.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.notFound.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.server.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.unknown.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.unsaved.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.conflict.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.v1.core.agent.chat.folders.id.permissions.get.success.title" as const,
    description:
      "app.api.v1.core.agent.chat.folders.id.permissions.get.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { id: "123e4567-e89b-12d3-a456-426614174000" },
    },
    requests: undefined,
    responses: {
      default: {
        response: {
          allowedRoles: ["PUBLIC", "CUSTOMER", "ADMIN"],
          moderatorIds: [
            "223e4567-e89b-12d3-a456-426614174001",
            "323e4567-e89b-12d3-a456-426614174002",
          ],
        },
      },
    },
  },
});

/**
 * Update Folder Permissions Endpoint (PATCH)
 * Updates the list of moderator IDs for a folder
 */
const { PATCH } = createEndpoint({
  method: Methods.PATCH,
  path: ["v1", "core", "agent", "chat", "folders", "[id]", "permissions"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title:
    "app.api.v1.core.agent.chat.folders.id.permissions.patch.title" as const,
  description:
    "app.api.v1.core.agent.chat.folders.id.permissions.patch.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: [
    "app.api.v1.core.agent.chat.tags.folders" as const,
    "app.api.v1.core.agent.chat.tags.permissions" as const,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.container.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { request: "data&urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.agent.chat.folders.id.permissions.patch.id.label" as const,
          description:
            "app.api.v1.core.agent.chat.folders.id.permissions.patch.id.description" as const,
        },
        z.uuid(),
      ),

      // === REQUEST DATA ===
      allowedRoles: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.agent.chat.folders.id.permissions.patch.allowedRoles.label" as const,
          description:
            "app.api.v1.core.agent.chat.folders.id.permissions.patch.allowedRoles.description" as const,
          layout: { columns: 12 },
        },
        z.array(z.string()).optional(),
      ),
      moderatorIds: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.agent.chat.folders.id.permissions.patch.moderatorIds.label" as const,
          description:
            "app.api.v1.core.agent.chat.folders.id.permissions.patch.moderatorIds.description" as const,
          layout: { columns: 12 },
        },
        z.array(z.string()).optional(),
      ),

      // === RESPONSE ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.agent.chat.folders.id.permissions.patch.response.title" as const,
          description:
            "app.api.v1.core.agent.chat.folders.id.permissions.patch.response.description" as const,
          layout: { type: LayoutType.STACKED },
        },
        { response: true },
        {
          allowedRoles: responseArrayField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.folders.id.permissions.patch.response.allowedRoles.content" as const,
            },
            z.string(),
          ),
          moderatorIds: responseArrayField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.folders.id.permissions.patch.response.moderatorIds.content" as const,
            },
            z.string(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.validation.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.network.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.notFound.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.server.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.unknown.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.unsaved.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.conflict.title" as const,
      description:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.v1.core.agent.chat.folders.id.permissions.patch.success.title" as const,
    description:
      "app.api.v1.core.agent.chat.folders.id.permissions.patch.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { id: "123e4567-e89b-12d3-a456-426614174000" },
    },
    requests: {
      default: {
        allowedRoles: ["PUBLIC", "CUSTOMER"],
        moderatorIds: [
          "223e4567-e89b-12d3-a456-426614174001",
          "323e4567-e89b-12d3-a456-426614174002",
        ],
      },
    },
    responses: {
      default: {
        response: {
          allowedRoles: ["PUBLIC", "CUSTOMER"],
          moderatorIds: [
            "223e4567-e89b-12d3-a456-426614174001",
            "323e4567-e89b-12d3-a456-426614174002",
          ],
        },
      },
    },
  },
});

// Extract types
export type FolderPermissionsGetRequestInput = typeof GET.types.RequestInput;
export type FolderPermissionsGetRequestOutput = typeof GET.types.RequestOutput;
export type FolderPermissionsGetResponseInput = typeof GET.types.ResponseInput;
export type FolderPermissionsGetResponseOutput =
  typeof GET.types.ResponseOutput;
export type FolderPermissionsGetUrlParamsTypeOutput =
  typeof GET.types.UrlVariablesOutput;

export type FolderPermissionsUpdateRequestInput =
  typeof PATCH.types.RequestInput;
export type FolderPermissionsUpdateRequestOutput =
  typeof PATCH.types.RequestOutput;
export type FolderPermissionsUpdateResponseInput =
  typeof PATCH.types.ResponseInput;
export type FolderPermissionsUpdateResponseOutput =
  typeof PATCH.types.ResponseOutput;
export type FolderPermissionsUpdateUrlParamsTypeOutput =
  typeof PATCH.types.UrlVariablesOutput;

const definitions = { GET, PATCH } as const;
export default definitions;
