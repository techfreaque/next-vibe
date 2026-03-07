/**
 * Remote Connection by Instance ID
 * GET    — status of this connection
 * PATCH  — rename (update friendlyName)
 * DELETE — disconnect (remove from DB)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedRequestUrlPathParamsField,
  scopedResponseField,
  scopedWidgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";
import { RemoteConnectionByIdWidget } from "./widget";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["user", "remote-connection", "[instanceId]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "link" as const,
  category: "app.endpointCategories.userAuth",
  tags: ["tags.remoteConnection" as const],
  aliases: ["remote-status", "connection-status"] as const,

  fields: customWidgetObject({
    render: RemoteConnectionByIdWidget,
    usage: { response: true, request: "urlPathParams" } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { response: true },
      }),
      instanceId: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.instanceId.label" as const,
        description: "get.instanceId.description" as const,
        schema: z.string().min(1).max(32),
        hidden: true,
      }),
      isConnected: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
      friendlyName: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
      remoteUrl: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
      isActive: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean().nullable(),
      }),
      lastSyncedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { instanceId: "hermes" },
    },
    responses: {
      connected: {
        isConnected: true,
        friendlyName: "My Laptop",
        remoteUrl: "https://unbottled.ai",
        isActive: true,
        lastSyncedAt: "2026-03-01T12:00:00.000Z",
      },
      notConnected: {
        isConnected: false,
        friendlyName: null,
        remoteUrl: null,
        isActive: null,
        lastSyncedAt: null,
      },
    },
  },
});

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["user", "remote-connection", "[instanceId]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "patch.title" as const,
  description: "patch.description" as const,
  icon: "pencil" as const,
  category: "app.endpointCategories.userAuth",
  tags: ["tags.remoteConnection" as const],
  aliases: ["remote-rename", "rename-connection"] as const,

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { request: "data" },
      }),
      instanceId: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.instanceId.label" as const,
        description: "patch.instanceId.description" as const,
        schema: z.string().min(1).max(32),
        hidden: true,
      }),
      friendlyName: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.friendlyName.label" as const,
        description: "patch.friendlyName.description" as const,
        placeholder: "patch.friendlyName.placeholder" as const,
        columns: 12,
        schema: z.string().min(1).max(64),
      }),
      submitButton: scopedWidgetField(scopedTranslation, {
        type: WidgetType.SUBMIT_BUTTON,
        text: "patch.title" as const,
        loadingText: "patch.title" as const,
        icon: "pencil",
        variant: "default",
        size: "default",
        order: 10,
        usage: { request: "data" },
      }),
      updated: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title" as const,
      description: "patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title" as const,
      description: "patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title" as const,
      description: "patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title" as const,
      description: "patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title" as const,
      description: "patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title" as const,
      description: "patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title" as const,
      description: "patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title" as const,
      description: "patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title" as const,
      description: "patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "patch.success.title" as const,
    description: "patch.success.description" as const,
  },

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const listDefinition = await import("../list/definition");
        // Update list cache
        apiClient.updateEndpointData(
          listDefinition.GET,
          data.logger,
          (prev) => {
            if (!prev?.success) {
              return prev;
            }
            return {
              success: true,
              data: {
                connections: prev.data.connections.map((c) =>
                  c.instanceId === data.pathParams.instanceId
                    ? { ...c, friendlyName: data.requestData.friendlyName }
                    : c,
                ),
              },
            };
          },
        );
        // Update [instanceId] GET cache
        apiClient.updateEndpointData(
          GET,
          data.logger,
          (prev) => {
            if (!prev?.success) {
              return prev;
            }
            return {
              success: true,
              data: {
                ...prev.data,
                friendlyName: data.requestData.friendlyName,
              },
            };
          },
          { urlPathParams: { instanceId: data.pathParams.instanceId } },
        );
      },
    },
  },

  examples: {
    urlPathParams: {
      default: { instanceId: "hermes" },
    },
    requests: {
      default: { friendlyName: "My Work Laptop" },
    },
    responses: {
      default: { updated: true },
    },
  },
});

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["user", "remote-connection", "[instanceId]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "trash" as const,
  category: "app.endpointCategories.userAuth",
  tags: ["tags.remoteConnection" as const],
  aliases: ["remote-disconnect", "disconnect-remote"] as const,

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      instanceId: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.instanceId.label" as const,
        description: "delete.instanceId.description" as const,
        schema: z.string().min(1).max(32),
        hidden: true,
      }),
      submitButton: scopedWidgetField(scopedTranslation, {
        type: WidgetType.SUBMIT_BUTTON,
        text: "delete.title" as const,
        loadingText: "delete.title" as const,
        icon: "link-2-off",
        variant: "destructive",
        size: "default",
        order: 10,
        usage: { request: "data" },
      }),
      disconnected: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title" as const,
      description: "delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title" as const,
      description: "delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title" as const,
      description: "delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title" as const,
      description: "delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title" as const,
      description: "delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title" as const,
      description: "delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title" as const,
      description: "delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title" as const,
      description: "delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title" as const,
      description: "delete.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "delete.success.title" as const,
    description: "delete.success.description" as const,
  },

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const listDefinition = await import("../list/definition");
        // Remove from list cache
        apiClient.updateEndpointData(
          listDefinition.GET,
          data.logger,
          (prev) => {
            if (!prev?.success) {
              return prev;
            }
            return {
              success: true,
              data: {
                connections: prev.data.connections.filter(
                  (c) => c.instanceId !== data.pathParams.instanceId,
                ),
              },
            };
          },
        );
        // Clear [instanceId] GET cache — mark as not connected
        apiClient.updateEndpointData(
          GET,
          data.logger,
          (prev) => {
            if (!prev?.success) {
              return prev;
            }
            return {
              success: true,
              data: {
                isConnected: false,
                friendlyName: null,
                remoteUrl: null,
                isActive: null,
                lastSyncedAt: null,
              },
            };
          },
          { urlPathParams: { instanceId: data.pathParams.instanceId } },
        );
      },
    },
  },

  examples: {
    urlPathParams: {
      default: { instanceId: "hermes" },
    },
    responses: {
      default: { disconnected: true },
    },
  },
});

export type RemoteConnectionByIdGetResponseOutput =
  typeof GET.types.ResponseOutput;
export type RemoteConnectionByIdPatchRequestInput =
  typeof PATCH.types.RequestInput;

const definitions = { GET, PATCH, DELETE };
export default definitions;
