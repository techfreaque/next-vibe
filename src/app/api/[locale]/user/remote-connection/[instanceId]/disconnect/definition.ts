/**
 * Remote Connection Disconnect
 * DELETE - remove the connection record
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestUrlPathParamsField,
  responseField,
  widgetField,
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

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["user", "remote-connection", "[instanceId]", "disconnect"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "trash" as const,
  category: "endpointCategories.userAuth",
  tags: ["tags.remoteConnection" as const],
  aliases: ["remote-disconnect", "disconnect-remote"] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      instanceId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.instanceId.label" as const,
        description: "delete.instanceId.description" as const,
        schema: z.string().min(1).max(32),
      }),
      submitButton: widgetField(scopedTranslation, {
        type: WidgetType.SUBMIT_BUTTON,
        text: "delete.title" as const,
        loadingText: "delete.title" as const,
        icon: "link-2-off",
        variant: "destructive",
        size: "default",
        order: 10,
        usage: { request: "data" },
      }),
      disconnected: responseField(scopedTranslation, {
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
        const listDefinition = await import("../../list/definition");
        const statusDefinition = await import("../definition");
        // Remove from list cache
        apiClient.updateEndpointData(
          listDefinition.GET,
          data.logger,
          (prev) => {
            if (!prev?.success) {
              return undefined;
            }
            return {
              success: true,
              data: {
                ...prev.data,
                connections: prev.data.connections.filter(
                  (c) => c.instanceId !== data.pathParams.instanceId,
                ),
              },
            };
          },
        );
        // Clear [instanceId] GET cache - mark as not connected
        apiClient.updateEndpointData(
          statusDefinition.default.GET,
          data.logger,
          (prev) => {
            if (!prev?.success) {
              return undefined;
            }
            return {
              success: true,
              data: {
                isConnected: false,
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

export type RemoteConnectionDisconnectDeleteResponseOutput =
  typeof DELETE.types.ResponseOutput;

const definitions = { DELETE };
export default definitions;
