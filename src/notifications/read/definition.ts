/**
 * Mark notifications read - one by id, or everything with all=true.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestField,
  responseField,
  submitButton,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { NOTIFICATIONS_READ_ALIAS } from "../constants";
import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["notifications", "read"],
  aliases: [NOTIFICATIONS_READ_ALIAS],
  title: "read.post.title" as const,
  titleShort: "read.post.titleShort" as const,
  description: "read.post.description" as const,
  category: "notifications" as const,
  icon: "check" as const,
  tags: ["tags.notifications" as const, "tags.read" as const],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  options: {
    mutationOptions: {
      // Bell badge + list reflect the new read state without a reload
      onSuccess: async (data) => {
        const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
        const [list, count] = await Promise.all([
          import("../list/definition"),
          import("../unread-count/definition"),
        ]);
        await apiClient.refetchEndpoint(list.default.GET, data.logger);
        await apiClient.refetchEndpoint(count.default.GET, data.logger);
      },
    },
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    usage: { request: "data", response: true },
    children: {
      id: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "read.post.id.label" as const,
        description: "read.post.id.description" as const,
        columns: 12,
        schema: z.string().uuid().optional(),
      }),
      all: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "read.post.all.label" as const,
        description: "read.post.all.description" as const,
        columns: 12,
        schema: z.boolean().optional(),
      }),
      updatedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "read.post.response.updatedCount" as const,
        schema: z.coerce.number(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "read.post.submit.label" as const,
        loadingText: "read.post.submit.loading" as const,
        icon: "check",
        variant: "primary",
        usage: { request: "data" },
      }),
    },
  }),

  examples: {
    requests: {
      default: { id: "123e4567-e89b-12d3-a456-426614174000" },
      all: { all: true },
    },
    responses: {
      default: { updatedCount: 1 },
      all: { updatedCount: 4 },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.serverError.title" as const,
      description: "errors.serverError.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
  },
  successTypes: {
    title: "success.title" as const,
    description: "success.description" as const,
  },
});

export type NotificationsReadPostResponseOutput =
  typeof POST.types.ResponseOutput;

export default { POST } as const;
