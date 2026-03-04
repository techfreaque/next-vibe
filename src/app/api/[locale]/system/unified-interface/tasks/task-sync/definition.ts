/**
 * Task Sync API Definition
 * POST endpoint for syncing tasks between remote and local Thea instances.
 * Accepts PUBLIC role (passes middleware), validates API key in handler.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";

import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "task-sync"],
  title: "taskSync.post.title",
  description: "taskSync.post.description",
  icon: "refresh-cw",
  category: "app.endpointCategories.system",
  tags: ["tags.tasks" as const],
  allowedRoles: envClient.VIBE_IS_CLOUD
    ? ([UserRole.ADMIN] as const)
    : ([] as const),

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // Request
      completionsJson: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z.string().optional(),
      }),
      memoriesJson: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z.string().optional(),
      }),
      capabilitiesJson: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z.string().optional(),
      }),
      capabilitiesHash: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.string().optional(),
      }),

      // Response
      tasksJson: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      synced: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
      completionsProcessed: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
      memoriesSynced: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
      sharedMemoriesJson: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "taskSync.post.errors.validation.title",
      description: "taskSync.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "taskSync.post.errors.unauthorized.title",
      description: "taskSync.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "taskSync.post.errors.internal.title",
      description: "taskSync.post.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "taskSync.post.errors.forbidden.title",
      description: "taskSync.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "taskSync.post.errors.notFound.title",
      description: "taskSync.post.errors.notFound.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "taskSync.post.errors.network.title",
      description: "taskSync.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "taskSync.post.errors.unknown.title",
      description: "taskSync.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "taskSync.post.errors.unsaved.title",
      description: "taskSync.post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "taskSync.post.errors.conflict.title",
      description: "taskSync.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "taskSync.post.success.title",
    description: "taskSync.post.success.description",
  },

  examples: {
    requests: {
      default: {
        capabilitiesHash: "abc123",
      },
    },
    responses: {
      default: {
        tasksJson: "[]",
        synced: 0,
        completionsProcessed: 0,
        memoriesSynced: 0,
        sharedMemoriesJson: "[]",
      },
    },
  },
});

export const endpoints = { POST };

export type SyncRequestOutput = typeof POST.types.RequestOutput;
export type SyncResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
