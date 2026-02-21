/**
 * Messaging Accounts List API Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { dateSchema } from "../../../../shared/types/common.schema";
import { UserRole } from "../../../../user/user-roles/enum";
import {
  MessageChannel,
  MessageChannelFilter,
  MessageChannelFilterOptions,
  MessagingAccountStatus,
  MessagingAccountStatusDB,
} from "../../enum";
import { MessagingAccountsListContainer } from "./widget";

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["emails", "messaging", "accounts", "list"],
  title: "app.api.emails.messaging.accounts.list.title",
  description: "app.api.emails.messaging.accounts.list.description",
  category: "app.api.emails.category",
  icon: "message-circle",
  tags: ["app.api.emails.messaging.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: MessagingAccountsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton({ usage: { request: "data", response: true } }),

      channel: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.messaging.accounts.list.fields.channel.label",
        description:
          "app.api.emails.messaging.accounts.list.fields.channel.description",
        columns: 3,
        options: MessageChannelFilterOptions,
        schema: z.enum(MessageChannelFilter).default(MessageChannelFilter.ANY),
      }),

      search: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.messaging.accounts.list.fields.search.label",
        description:
          "app.api.emails.messaging.accounts.list.fields.search.description",
        placeholder:
          "app.api.emails.messaging.accounts.list.fields.search.placeholder",
        columns: 3,
        schema: z.string().optional(),
      }),

      page: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.messaging.accounts.list.fields.page.label",
        description:
          "app.api.emails.messaging.accounts.list.fields.page.description",
        columns: 3,
        schema: z.coerce.number().int().min(1).default(1),
      }),

      limit: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.messaging.accounts.list.fields.limit.label",
        description:
          "app.api.emails.messaging.accounts.list.fields.limit.description",
        columns: 3,
        schema: z.coerce.number().int().min(1).max(100).default(20),
      }),

      // === RESPONSE FIELDS ===
      accounts: responseArrayField(
        { type: WidgetType.CONTAINER },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.emails.messaging.accounts.list.response.account.title",
            description:
              "app.api.emails.messaging.accounts.list.response.account.description",
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            id: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messaging.accounts.list.response.account.id",
              schema: z.uuid(),
            }),
            name: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messaging.accounts.list.response.account.name",
              schema: z.string(),
            }),
            channel: responseField({
              type: WidgetType.BADGE,
              text: "app.api.emails.messaging.accounts.list.response.account.channel",
              schema: z.enum(MessageChannel),
            }),
            provider: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messaging.accounts.list.response.account.provider",
              schema: z.string(),
            }),
            fromId: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messaging.accounts.list.response.account.fromId",
              schema: z.string().nullable(),
            }),
            status: responseField({
              type: WidgetType.BADGE,
              text: "app.api.emails.messaging.accounts.list.response.account.status",
              schema: z.enum(MessagingAccountStatusDB),
            }),
            messagesSentTotal: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messaging.accounts.list.response.account.messagesSentTotal",
              schema: z.coerce.number().int(),
            }),
            lastUsedAt: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messaging.accounts.list.response.account.lastUsedAt",
              schema: dateSchema.nullable(),
            }),
            createdAt: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messaging.accounts.list.response.account.createdAt",
              schema: dateSchema,
            }),
          },
        ),
      ),

      pagination: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.emails.messaging.accounts.list.response.pagination.title",
          description:
            "app.api.emails.messaging.accounts.list.response.pagination.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          page: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.messaging.accounts.list.response.pagination.page",
            schema: z.coerce.number().int(),
          }),
          limit: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.messaging.accounts.list.response.pagination.limit",
            schema: z.coerce.number().int(),
          }),
          total: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.messaging.accounts.list.response.pagination.total",
            schema: z.coerce.number().int(),
          }),
          totalPages: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.messaging.accounts.list.response.pagination.totalPages",
            schema: z.coerce.number().int(),
          }),
        },
      ),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.emails.messaging.accounts.list.errors.validation.title",
      description:
        "app.api.emails.messaging.accounts.list.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.emails.messaging.accounts.list.errors.unauthorized.title",
      description:
        "app.api.emails.messaging.accounts.list.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.messaging.accounts.list.errors.forbidden.title",
      description:
        "app.api.emails.messaging.accounts.list.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.messaging.accounts.list.errors.notFound.title",
      description:
        "app.api.emails.messaging.accounts.list.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.messaging.accounts.list.errors.conflict.title",
      description:
        "app.api.emails.messaging.accounts.list.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.messaging.accounts.list.errors.server.title",
      description:
        "app.api.emails.messaging.accounts.list.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.messaging.accounts.list.errors.networkError.title",
      description:
        "app.api.emails.messaging.accounts.list.errors.networkError.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.emails.messaging.accounts.list.errors.unsavedChanges.title",
      description:
        "app.api.emails.messaging.accounts.list.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.messaging.accounts.list.errors.unknown.title",
      description:
        "app.api.emails.messaging.accounts.list.errors.unknown.description",
    },
  },

  successTypes: {
    title: "app.api.emails.messaging.accounts.list.success.title",
    description: "app.api.emails.messaging.accounts.list.success.description",
  },

  examples: {
    requests: { default: {} },
    responses: {
      default: {
        accounts: [
          {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Twilio SMS",
            channel: MessageChannel.SMS,
            provider: "twilio",
            fromId: "+1234567890",
            status: MessagingAccountStatus.ACTIVE,
            messagesSentTotal: 500,
            lastUsedAt: "2024-01-07T11:45:00.000Z",
            createdAt: "2024-01-01T00:00:00.000Z",
          },
        ],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      },
    },
  },
});

export type MessagingAccountsListGETRequestInput =
  typeof GET.types.RequestInput;
export type MessagingAccountsListGETRequestOutput =
  typeof GET.types.RequestOutput;
export type MessagingAccountsListGETResponseInput =
  typeof GET.types.ResponseInput;
export type MessagingAccountsListGETResponseOutput =
  typeof GET.types.ResponseOutput;

const messagingAccountsListEndpoints = { GET };
export default messagingAccountsListEndpoints;
