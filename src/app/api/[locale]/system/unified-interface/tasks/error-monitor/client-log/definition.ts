/**
 * Client Error Log API Definition
 * POST endpoint for client-side components to report errors/warnings for DB persistence.
 * Public - client-side code can call this even when unauthenticated.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CLIENT_LOG_PATH } from "./constants";
import { scopedTranslation } from "./i18n";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: CLIENT_LOG_PATH,
  aliases: ["report-client-error"],
  title: "post.title" as const,
  description: "post.description" as const,
  category: "endpointCategories.tasks",
  subCategory: "endpointCategories.tasksMonitoring",
  icon: "alert-triangle",
  tags: ["post.tags.monitoring" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
  ],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.title" as const,
    description: "post.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      level: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.level.label" as const,
        description: "post.fields.level.description" as const,
        schema: z.enum(["error", "warn"]),
      }),
      message: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.message.label" as const,
        description: "post.fields.message.description" as const,
        placeholder: "post.fields.message.placeholder" as const,
        schema: z.string().min(1).max(500),
      }),
      metadata: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.metadata.label" as const,
        description: "post.fields.metadata.description" as const,
        schema: z.array(z.record(z.string(), z.string())).optional(),
      }),
      ok: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.ok.title" as const,
        schema: z.boolean(),
      }),
    },
  }),

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

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
      title: "post.errors.unsavedChanges.titleChanges" as const,
      description: "post.errors.unsavedChanges.titleChanges" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  examples: {
    requests: {
      default: {
        level: "error" as const,
        message: "Unhandled promise rejection",
      },
    },
    responses: {
      default: {
        ok: true,
      },
    },
  },
});

export type ClientLogRequestOutput = typeof POST.types.RequestOutput;
export type ClientLogResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
