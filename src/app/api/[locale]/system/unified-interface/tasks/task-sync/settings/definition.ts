/**
 * Task Sync Settings Endpoint
 * GET  - get current sync enabled state
 * PATCH - enable or disable the task-sync-pull cron task
 *
 * Admin-only. The sync task is disabled by default and must be explicitly
 * enabled via this endpoint.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
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
import { envClient } from "@/config/env-client";

import { scopedTranslation } from "./i18n";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: [
    "system",
    "unified-interface",
    "tasks",
    "task-sync",
    "settings",
  ] as const,
  allowedRoles: envClient.NEXT_PUBLIC_VIBE_IS_CLOUD
    ? ([] as const)
    : ([UserRole.ADMIN] as const),

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "settings" as const,
  category: "endpointCategories.systemTasks",
  tags: ["tags.taskSync" as const],
  aliases: ["task-sync-settings", "sync-settings"] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { response: true },
    children: {
      syncEnabled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),
    },
  }),

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
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
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
  },

  examples: {
    responses: {
      enabled: { syncEnabled: true },
      disabled: { syncEnabled: false },
    },
  },
});

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: [
    "system",
    "unified-interface",
    "tasks",
    "task-sync",
    "settings",
  ] as const,
  allowedRoles: envClient.NEXT_PUBLIC_VIBE_IS_CLOUD
    ? ([] as const)
    : ([UserRole.ADMIN] as const),

  title: "patch.title" as const,
  description: "patch.description" as const,
  icon: "settings" as const,
  category: "endpointCategories.systemTasks",
  tags: ["tags.taskSync" as const],
  aliases: ["update-sync-settings", "toggle-sync"] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      syncEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.syncEnabled.label" as const,
        description: "patch.syncEnabled.description" as const,
        columns: 12,
        schema: z.boolean(),
      }),
      submitButton: widgetField(scopedTranslation, {
        type: WidgetType.SUBMIT_BUTTON,
        text: "patch.title" as const,
        loadingText: "patch.title" as const,
        icon: "settings",
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

  successTypes: {
    title: "patch.success.title" as const,
    description: "patch.success.description" as const,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title" as const,
      description: "patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title" as const,
      description: "patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title" as const,
      description: "patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title" as const,
      description: "patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title" as const,
      description: "patch.errors.notFound.description" as const,
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
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title" as const,
      description: "patch.errors.network.description" as const,
    },
  },

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        // Update the GET cache so the toggle reflects immediately
        apiClient.updateEndpointData(GET, data.logger, (prev) => {
          if (!prev?.success) {
            return prev;
          }
          return {
            success: true,
            data: { syncEnabled: data.requestData.syncEnabled },
          };
        });
      },
    },
  },

  examples: {
    requests: {
      enable: { syncEnabled: true },
      disable: { syncEnabled: false },
    },
    responses: {
      default: { updated: true },
    },
  },
});

export type TaskSyncSettingsGetOutput = typeof GET.types.ResponseOutput;
export type TaskSyncSettingsPatchResponseOutput =
  typeof PATCH.types.ResponseOutput;

const endpoints = { GET, PATCH };
export default endpoints;
