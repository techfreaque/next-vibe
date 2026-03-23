/**
 * Remote Connection Rename
 * PATCH - update the friendly name of a connection
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
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

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["user", "remote-connection", "[instanceId]", "rename"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "patch.title" as const,
  description: "patch.description" as const,
  icon: "pencil" as const,
  category: "app.endpointCategories.userAuth",
  tags: ["tags.remoteConnection" as const],
  aliases: ["remote-rename", "rename-connection"] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      instanceId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.instanceId.label" as const,
        description: "patch.instanceId.description" as const,
        schema: z.string().min(1).max(32),
        hidden: true,
      }),
      newInstanceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.newInstanceId.label" as const,
        description: "patch.newInstanceId.description" as const,
        placeholder: "patch.newInstanceId.placeholder" as const,
        columns: 12,
        schema: z.string().min(1).max(32),
      }),
      propagate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.newInstanceId.label" as const,
        description: "patch.newInstanceId.description" as const,
        hidden: true,
        schema: z.boolean().optional().default(true),
      }),
      submitButton: widgetField(scopedTranslation, {
        type: WidgetType.SUBMIT_BUTTON,
        text: "patch.title" as const,
        loadingText: "patch.title" as const,
        icon: "pencil",
        variant: "default",
        size: "default",
        order: 10,
        usage: { request: "data" },
      }),
      updated: responseField(scopedTranslation, {
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
        const listDefinition = await import("../../list/definition");
        const statusDefinition = await import("../definition");
        // Update list cache
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
                connections: prev.data.connections.map((c) =>
                  c.instanceId === data.pathParams.instanceId
                    ? { ...c, instanceId: data.requestData.newInstanceId }
                    : c,
                ),
              },
            };
          },
        );
        // Update [instanceId] GET cache
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
                ...prev.data,
                instanceId: data.requestData.newInstanceId,
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
      default: { newInstanceId: "hermes-work" },
    },
    responses: {
      default: { updated: true },
    },
  },
});

export type RemoteConnectionRenamePatchRequestInput =
  typeof PATCH.types.RequestInput;
export type RemoteConnectionRenamePatchResponseOutput =
  typeof PATCH.types.ResponseOutput;

const definitions = { PATCH };
export default definitions;
