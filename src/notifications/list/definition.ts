/**
 * Notifications list - the signed-in user's notifications, unread first.
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { paginationField } from "next-vibe/unified-ui/widgets/containers/pagination/types";
import { z } from "zod";

import { NOTIFICATIONS_LIST_ALIAS } from "../constants";
import { scopedTranslation } from "../i18n";

const NotificationsListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.NotificationsListContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["notifications", "list"],
  aliases: [NOTIFICATIONS_LIST_ALIAS],
  title: "list.get.title" as const,
  titleShort: "list.get.titleShort" as const,
  description: "list.get.description" as const,
  category: "notifications" as const,
  icon: "bell" as const,
  tags: ["tags.notifications" as const, "tags.list" as const],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: customWidgetObject({
    render: NotificationsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      notifications: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "list.get.response.notifications.id" as const,
              schema: z.string(),
            }),
            type: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "list.get.response.notifications.type" as const,
              schema: z.string(),
            }),
            title: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "list.get.response.notifications.title" as const,
              schema: z.string(),
            }),
            body: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "list.get.response.notifications.body" as const,
              schema: z.string().nullable(),
            }),
            link: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "list.get.response.notifications.link" as const,
              schema: z.string().nullable(),
            }),
            read: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "list.get.response.notifications.read" as const,
              schema: z.boolean(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "list.get.response.notifications.createdAt" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),
      unreadCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "list.get.response.unreadCount" as const,
        schema: z.coerce.number(),
      }),
      paginationInfo: paginationField({ order: 2 }),
    },
  }),

  examples: {
    requests: {
      default: { paginationInfo: { page: 1, limit: 20 } },
    },
    responses: {
      default: {
        notifications: [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            type: "enums.type.taskComplete",
            title: "Weekly report finished",
            body: "Your background task is done. Open the result.",
            link: "/threads/private/123e4567-e89b-12d3-a456-426614174001",
            read: false,
            createdAt: "2026-11-08T12:00:00.000Z",
          },
        ],
        unreadCount: 1,
        paginationInfo: { totalCount: 1, pageCount: 1 },
      },
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

export type NotificationsListGetResponseOutput =
  typeof GET.types.ResponseOutput;
export type NotificationItem =
  NotificationsListGetResponseOutput["notifications"][number];

export default { GET } as const;
