/**
 * Unread notification count - cheap poll target for the nav bell badge.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { NOTIFICATIONS_UNREAD_COUNT_ALIAS } from "../constants";
import { scopedTranslation } from "../i18n";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["notifications", "unread-count"],
  aliases: [NOTIFICATIONS_UNREAD_COUNT_ALIAS],
  title: "unreadCount.get.title" as const,
  titleShort: "unreadCount.get.titleShort" as const,
  description: "unreadCount.get.description" as const,
  category: "notifications" as const,
  icon: "bell" as const,
  tags: ["tags.notifications" as const, "tags.unread" as const],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    usage: { response: true },
    children: {
      unreadCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "unreadCount.get.response.unreadCount" as const,
        schema: z.coerce.number(),
      }),
    },
  }),

  examples: {
    responses: {
      default: { unreadCount: 3 },
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

export type NotificationsUnreadCountGetResponseOutput =
  typeof GET.types.ResponseOutput;

export default { GET } as const;
