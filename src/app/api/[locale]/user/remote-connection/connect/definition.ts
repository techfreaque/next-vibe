/**
 * Remote Connection Connect API Definition
 * POST - login to remote instance and store session in DB
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  requestField,
  responseField,
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";

import type { RemoteConnectionsListResponseOutput } from "../list/definition";
import { scopedTranslation } from "./i18n";
import { RemoteConnectWidget } from "./widget";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "remote-connection", "connect"],
  allowedRoles: envClient.NEXT_PUBLIC_VIBE_IS_CLOUD
    ? ([] as const) // Cloud instances don't initiate connections; local side does
    : ([UserRole.CUSTOMER, UserRole.ADMIN] as const),
  title: "post.title" as const,
  description: "post.description" as const,
  icon: "link" as const,
  category: "endpointCategories.userAuth",
  tags: ["tags.remoteConnection" as const],
  aliases: ["remote-connect", "connect-remote"] as const,

  fields: customWidgetObject({
    render: RemoteConnectWidget,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data" },
      }),
      remoteUrl: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.URL,
        label: "post.remoteUrl.label" as const,
        description: "post.remoteUrl.description" as const,
        placeholder: "post.remoteUrl.placeholder" as const,
        columns: 12,
        theme: { style: "none" },
        schema: z
          .string({
            error: "post.remoteUrl.validation.required",
          })
          .min(1, { message: "post.remoteUrl.validation.required" })
          .url({ message: "post.remoteUrl.validation.invalid" })
          .transform((val) => val.replace(/\/+$/, "")) // strip trailing slashes
          .default(envClient.NEXT_PUBLIC_PROJECT_URL),
      }),
      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "post.email.label" as const,
        description: "post.email.description" as const,
        placeholder: "post.email.placeholder" as const,
        columns: 6,
        theme: { style: "none" },
        schema: z
          .string({ error: "post.email.validation.required" })
          .min(1, { message: "post.email.validation.required" })
          .email({ message: "post.email.validation.invalid" }),
      }),
      password: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "post.password.label" as const,
        description: "post.password.description" as const,
        placeholder: "post.password.placeholder" as const,
        columns: 6,
        theme: { style: "none" },
        schema: z
          .string({ error: "post.password.validation.required" })
          .min(1, { message: "post.password.validation.required" }),
      }),
      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        order: 10,
        usage: { request: "data" },
      }),
      submitButton: widgetField(scopedTranslation, {
        type: WidgetType.SUBMIT_BUTTON,
        text: "post.actions.submit" as const,
        loadingText: "post.actions.submitting" as const,
        icon: "link",
        variant: "default",
        size: "default",
        order: 11,
        usage: { request: "data" },
      }),
      remoteUrlResult: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string(),
      }),
      instanceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string(),
      }),
      isConnected: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const listDefinition = await import("../list/definition");
        apiClient.updateEndpointData(
          listDefinition.GET,
          data.logger,
          (prev) => {
            if (!prev?.success) {
              return undefined;
            }
            const instanceId = data.responseData.instanceId;
            const newConn: RemoteConnectionsListResponseOutput["connections"][number] =
              {
                instanceId,
                remoteUrl: data.requestData.remoteUrl,
                localUrl: null,
                isActive: true,
                lastSyncedAt: new Date().toISOString(),
                hasToken: true,
                healthStatus: "healthy",
              };
            // Replace if exists (reconnect), otherwise append
            const exists = prev.data.connections.some(
              (c) => c.instanceId === newConn.instanceId,
            );
            return {
              success: true,
              data: {
                ...prev.data,
                connections: exists
                  ? prev.data.connections.map((c) =>
                      c.instanceId === newConn.instanceId ? newConn : c,
                    )
                  : [...prev.data.connections, newConn],
              },
            };
          },
        );
      },
    },
  },

  examples: {
    requests: {
      default: {
        remoteUrl: envClient.NEXT_PUBLIC_PROJECT_URL,
        email: "you@example.com",
        password: "your-password",
      },
    },
    responses: {
      default: {
        remoteUrlResult: "https://unbottled.ai",
        instanceId: "thea",
        isConnected: true,
      },
    },
  },
});

export type RemoteConnectPostRequestInput = typeof POST.types.RequestInput;
export type RemoteConnectPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
